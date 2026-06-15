import React, { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { Layout, Menu, Button, Avatar, Dropdown, Space, Typography, Badge, message } from 'antd';
import type { MenuProps } from 'antd';
import {
  LayoutDashboard,
  AlertTriangle,
  FileSpreadsheet,
  BarChart3,
  Building2,
  LogOut,
  User,
  Bell,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import NotFound from '@/pages/NotFound';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Alerts from '@/pages/Alerts';
import ProductionPlan from '@/pages/ProductionPlan';
import Reports from '@/pages/Reports';
import Enterprises from '@/pages/Enterprises';

const { Header: AntHeader, Sider, Content } = Layout;
const { Title, Text } = Typography;

export interface UserInfo {
  id: string;
  name: string;
  role: 'national' | 'provincial' | 'municipal' | 'enterprise_qc' | 'enterprise_prod';
  roleName: string;
  region?: { province?: string; city?: string };
  enterpriseId?: string;
  permissions: string[];
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserInfo | null;
  login: (user: UserInfo) => void;
  logout: () => void;
  hasPermission: (p: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

const MOCK_USERS: Record<string, UserInfo> = {
  national: {
    id: 'U000001',
    name: '张监管',
    role: 'national',
    roleName: '国家食药监管理员',
    region: { province: '全国' },
    permissions: ['dashboard:view', 'alerts:view', 'alerts:approve', 'alerts:approve-level3',
      'production-plan:view', 'reports:view', 'reports:export', 'enterprises:view', 'enterprises:manage'],
  },
  provincial: {
    id: 'U000002',
    name: '李省监',
    role: 'provincial',
    roleName: '四川省市场监管局',
    region: { province: '四川省' },
    permissions: ['dashboard:view', 'alerts:view', 'alerts:approve', 'alerts:approve-level2',
      'production-plan:view', 'reports:view', 'reports:export', 'enterprises:view'],
  },
  municipal: {
    id: 'U000003',
    name: '王市监',
    role: 'municipal',
    roleName: '遵义市市场监管局',
    region: { province: '贵州省', city: '遵义市' },
    permissions: ['dashboard:view', 'alerts:view', 'reports:view', 'enterprises:view'],
  },
  enterprise_qc: {
    id: 'U000004',
    name: '陈品质',
    role: 'enterprise_qc',
    roleName: '茅台集团质量总监',
    region: { province: '贵州省', city: '遵义市' },
    enterpriseId: 'E001',
    permissions: ['dashboard:view', 'alerts:view', 'alerts:handle', 'alerts:approve-level1',
      'production-plan:view', 'production-plan:create', 'reports:view'],
  },
  enterprise_prod: {
    id: 'U000005',
    name: '刘生产',
    role: 'enterprise_prod',
    roleName: '五粮液生产主管',
    region: { province: '四川省', city: '宜宾市' },
    enterpriseId: 'E002',
    permissions: ['dashboard:view', 'production-plan:view', 'production-plan:create', 'reports:view'],
  },
};

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(() => {
    try {
      const raw = localStorage.getItem('wine_auth_user');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!user);

  const login = (u: UserInfo) => {
    localStorage.setItem('wine_auth_user', JSON.stringify(u));
    setUser(u);
    setIsLoggedIn(true);
    message.success(`欢迎回来，${u.name}`);
  };

  const logout = () => {
    localStorage.removeItem('wine_auth_user');
    setUser(null);
    setIsLoggedIn(false);
    message.success('已安全退出登录');
  };

  const hasPermission = (p: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(p);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export { MOCK_USERS };

const AuthGuard: React.FC<{ children: ReactNode; permission?: string }> = ({ children, permission }) => {
  const { isLoggedIn, user, hasPermission } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true, state: { from: location.pathname } });
      return;
    }
    if (permission && !hasPermission(permission)) {
      message.warning('您没有访问该功能的权限');
    }
  }, [isLoggedIn, permission, navigate, location.pathname, hasPermission]);

  if (!isLoggedIn) return null;

  if (permission && !hasPermission(permission)) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <div className="text-center p-12 rounded-2xl border border-white/10 bg-white/5">
          <Shield className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <Title level={3} style={{ color: '#F3F4F6', marginBottom: 12 }}>
            权限不足
          </Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
            您的角色（{user?.roleName}）没有访问此功能的权限。
          </Text>
          <Button type="primary" onClick={() => navigate('/dashboard')}>
            返回看板
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const selectedKey = location.pathname.split('/')[1] || 'dashboard';

  const menuItems: MenuProps['items'] = [
    {
      key: 'dashboard',
      icon: <LayoutDashboard size={18} />,
      label: '核心监测看板',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: 'alerts',
      icon: (
        <Badge count={5} size="small" color="#EF4444" offset={[14, -4]}>
          <AlertTriangle size={18} />
        </Badge>
      ),
      label: '预警中心',
      onClick: () => navigate('/alerts'),
    },
    {
      key: 'production-plan',
      icon: <FileSpreadsheet size={18} />,
      label: '生产计划管理',
      onClick: () => navigate('/production-plan'),
    },
    {
      key: 'reports',
      icon: <BarChart3 size={18} />,
      label: '运营诊断报告',
      onClick: () => navigate('/reports'),
    },
    {
      key: 'enterprises',
      icon: <Building2 size={18} />,
      label: '企业数据管理',
      onClick: () => navigate('/enterprises'),
    },
  ];

  const userMenu: MenuProps['items'] = [
    { key: 'profile', icon: <User size={16} />, label: '个人中心' },
    { key: 'settings', icon: <Settings size={16} />, label: '系统设置' },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogOut size={16} />,
      label: '退出登录',
      onClick: () => {
        logout();
        navigate('/login', { replace: true });
      },
    },
  ];

  return (
    <Layout className="min-h-screen" style={{ background: 'transparent' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={240}
        collapsedWidth={72}
        style={{
          background: 'linear-gradient(180deg, #111827 0%, #0B1220 100%)',
          borderRight: '1px solid rgba(212, 165, 116, 0.12)',
        }}
      >
        <div
          className={`flex items-center h-16 px-4 border-b ${collapsed ? 'justify-center' : 'justify-start'}`}
          style={{ borderColor: 'rgba(212, 165, 116, 0.12)' }}
        >
          <div
            className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, #D4A574, #B8860B)' }}
          >
            <Shield size={18} style={{ color: '#1F2937' }} />
          </div>
          {!collapsed && (
            <div className="ml-3 flex flex-col overflow-hidden">
              <Text
                strong
                style={{ color: '#D4A574', fontSize: 15, whiteSpace: 'nowrap', letterSpacing: 1 }}
              >
                酒类监测平台
              </Text>
              <Text type="secondary" style={{ fontSize: 10, whiteSpace: 'nowrap', marginTop: 2 }}>
                WINE MONITORING SYSTEM
              </Text>
            </div>
          )}
        </div>

        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          style={{
            background: 'transparent',
            borderInlineEnd: 'none',
            padding: '16px 8px',
          }}
        />

        {!collapsed && (
          <div className="absolute bottom-4 left-0 right-0 px-4">
            <div className="p-3 rounded-lg text-xs" style={{ background: 'rgba(212, 165, 116, 0.08)' }}>
              <div style={{ color: '#9CA3AF', marginBottom: 4 }}>系统版本</div>
              <div style={{ color: '#D4A574', fontFamily: 'monospace', fontWeight: 600 }}>
                V 1.0.0 · 稳定版
              </div>
            </div>
          </div>
        )}
      </Sider>

      <Layout>
        <AntHeader
          className="flex items-center justify-between"
          style={{
            background: 'linear-gradient(180deg, rgba(30,41,59,0.8) 0%, rgba(17,24,39,0.4) 100%)',
            borderBottom: '1px solid rgba(212, 165, 116, 0.12)',
            backdropFilter: 'blur(12px)',
            height: 64,
            padding: '0 24px',
          }}
        >
          <div className="flex items-center h-full">
            <Button
              type="text"
              onClick={() => setCollapsed(!collapsed)}
              icon={collapsed ? <ChevronRight size={18} style={{ color: '#D4A574' }} />
                : <ChevronLeft size={18} style={{ color: '#D4A574' }} />}
              style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            />
            <Space size={8} className="ml-3">
              <div className="h-2 w-2 rounded-full animate-pulse" style={{ background: '#10B981' }} />
              <Text type="secondary" style={{ fontSize: 13 }}>
                系统运行正常 · 接入企业
                <Text strong style={{ color: '#D4A574', marginLeft: 4 }}>56</Text> 家
              </Text>
            </Space>
          </div>

          <div className="flex items-center h-full">
            <Space size={16}>
              <Badge count={12} size="small">
                <Button
                  type="text"
                  shape="circle"
                  style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  icon={<Bell size={18} style={{ color: '#9CA3AF' }} />}
                />
              </Badge>

              <Dropdown menu={{ items: userMenu }} placement="bottomRight" trigger={['click']}>
                <div
                  className="flex items-center cursor-pointer px-3 py-1.5 rounded-lg transition-all hover:bg-white/5"
                  style={{ gap: 10 }}
                >
                  <Avatar
                    size={36}
                    icon={<User size={18} />}
                    style={{
                      background: 'linear-gradient(135deg, rgba(212,165,116,0.25), rgba(184,134,11,0.25))',
                      color: '#D4A574',
                      border: '1px solid rgba(212, 165, 116, 0.4)',
                    }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                    <Text strong style={{ color: '#F3F4F6', fontSize: 13 }}>
                      {user?.name || '访客'}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {user?.roleName || '登录后查看'}
                    </Text>
                  </div>
                </div>
              </Dropdown>
            </Space>
          </div>
        </AntHeader>

        <Content
          style={{
            padding: 24,
            minHeight: 'calc(100vh - 64px)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div className="min-h-full">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

const DashboardPage = () => (
  <AuthGuard permission="dashboard:view"><Dashboard /></AuthGuard>
);
const AlertsPage = () => (
  <AuthGuard permission="alerts:view"><Alerts /></AuthGuard>
);
const ProductionPlanPage = () => (
  <AuthGuard permission="production-plan:view"><ProductionPlan /></AuthGuard>
);
const ReportsPage = () => (
  <AuthGuard permission="reports:view"><Reports /></AuthGuard>
);
const EnterprisesPage = () => (
  <AuthGuard permission="enterprises:view"><Enterprises /></AuthGuard>
);

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'alerts', element: <AlertsPage /> },
      { path: 'production-plan', element: <ProductionPlanPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'enterprises', element: <EnterprisesPage /> },
    ],
  },
  { path: '*', element: <NotFound /> },
]);

const AppRouter: React.FC = () => (
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

export default AppRouter;
