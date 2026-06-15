import { useState, useEffect, useMemo } from 'react';
import { Form, Input, Select, Button, Checkbox, message, Divider } from 'antd';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Crown,
  Building2,
  Landmark,
  Factory,
  Sparkles,
  Wine,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth, MOCK_USERS, UserInfo } from '@/router';

interface LoginForm {
  username: string;
  password: string;
  captcha: string;
  role: string;
  remember: boolean;
}

const ROLE_OPTIONS = [
  { value: 'national', label: '国家食药监管理员', desc: '全国范围总览与审批' },
  { value: 'provincial', label: '省市场监管局', desc: '所辖省份数据监管' },
  { value: 'municipal', label: '市市场监管局', desc: '所辖地市数据监管' },
  { value: 'enterprise_qc', label: '酒企质量总监', desc: '企业质量与预警处理' },
  { value: 'enterprise_prod', label: '酒企生产主管', desc: '生产计划与库存' },
];

const quickLogins = [
  { role: 'national', label: '国家管理员', icon: <Crown className="w-4 h-4" />, color: 'from-amber-400 to-amber-600', desc: '全国视角' },
  { role: 'provincial', label: '省局管理员', icon: <Landmark className="w-4 h-4" />, color: 'from-blue-400 to-blue-600', desc: '省级监管' },
  { role: 'municipal', label: '市局管理员', icon: <Building2 className="w-4 h-4" />, color: 'from-violet-400 to-violet-600', desc: '市级监管' },
  { role: 'enterprise_qc', label: '酒企总监', icon: <Factory className="w-4 h-4" />, color: 'from-emerald-400 to-emerald-600', desc: '企业视角' },
];

function generateCaptcha(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggedIn } = useAuth();
  const [form] = Form.useForm<LoginForm>();
  const [loading, setLoading] = useState(false);
  const [quickLoading, setQuickLoading] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaRotation, setCaptchaRotation] = useState(0);

  const from = ((location.state as { from?: string })?.from) || '/dashboard';

  useEffect(() => {
    if (isLoggedIn) {
      navigate(from, { replace: true });
    }
  }, [isLoggedIn, navigate, from]);

  useEffect(() => {
    form.setFieldsValue({
      role: 'national',
      username: 'admin',
      password: '123456',
      remember: true,
    });
  }, [form]);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaRotation((r) => r + 180);
  };

  const captchaSVG = useMemo(() => {
    const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    return (
      <div className="flex items-center justify-center w-[110px] h-[38px] bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200 relative overflow-hidden select-none">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.6 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <line
              key={i}
              x1={`${Math.random() * 100}%`}
              y1={`${Math.random() * 100}%`}
              x2={`${Math.random() * 100}%`}
              y2={`${Math.random() * 100}%`}
              stroke={colors[i % colors.length]}
              strokeWidth="1"
              opacity="0.4"
            />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <circle
              key={`d${i}`}
              cx={`${Math.random() * 100}%`}
              cy={`${Math.random() * 100}%`}
              r="1"
              fill={colors[i % colors.length]}
              opacity="0.5"
            />
          ))}
        </svg>
        <motion.span
          key={captcha + captchaRotation}
          initial={{ rotateY: 0 }}
          animate={{ rotateY: captchaRotation }}
          transition={{ duration: 0.4 }}
          className="relative font-bold tracking-[6px] text-lg bg-gradient-to-r from-blue-600 via-violet-600 to-rose-600 bg-clip-text text-transparent"
          style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
        >
          {captcha}
        </motion.span>
      </div>
    );
  }, [captcha, captchaRotation]);

  const doLogin = (user: UserInfo) => {
    login(user);
    setTimeout(() => navigate(from, { replace: true }), 300);
  };

  const handleSubmit = async (values: LoginForm) => {
    if (values.captcha.toUpperCase() !== captcha.toUpperCase()) {
      message.error('验证码错误');
      refreshCaptcha();
      return;
    }
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 500));
      const user = MOCK_USERS[values.role];
      if (!user) {
        message.error('角色不存在');
        return;
      }
      doLogin(user);
    } catch (err: any) {
      message.error(err.message || '登录失败');
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role: string) => {
    try {
      setQuickLoading(role);
      await new Promise((r) => setTimeout(r, 300));
      const user = MOCK_USERS[role];
      if (!user) {
        message.error('角色不存在');
        return;
      }
      doLogin(user);
    } catch (err: any) {
      message.error(err.message || '登录失败');
    } finally {
      setQuickLoading(null);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-[#0B1220] via-[#111827] to-[#0B1220] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse-slow"
             style={{ background: 'radial-gradient(circle, rgba(212,165,116,0.12), transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse-slow"
             style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.1), transparent 70%)', animationDelay: '1.5s' }} />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(212,165,116,0.5) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative flex-1 hidden lg:flex flex-col justify-between p-12 xl:p-20 overflow-hidden"
      >
        <div className="relative z-10 max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center gap-3 mb-12"
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl"
                 style={{ background: 'linear-gradient(135deg, #D4A574 0%, #B8860B 100%)', boxShadow: '0 8px 32px rgba(212,165,116,0.4)' }}>
              <Wine className="w-8 h-8" style={{ color: '#1F2937' }} />
            </div>
            <div>
              <div style={{ color: 'rgba(212,165,116,0.6)' }} className="text-xs tracking-[0.3em] uppercase">National Liquor Supervision</div>
              <div className="text-white font-bold text-lg">NLQM · v1.0</div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: '"Noto Serif SC", "Source Han Serif CN", Georgia, serif' }}
          >
            全国酒类
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #D4A574 0%, #FBBF24 50%, #D4A574 100%)' }}
            >
              生产流通智能监测平台
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="text-slate-400 text-lg leading-relaxed mb-12"
          >
            运用大数据与人工智能技术，构建覆盖生产·库存·流通·质检全链条的
            <span style={{ color: '#D4A574' }} className="font-medium"> 酒类行业数字化监管体系</span>，
            保障食品安全与产业高质量发展。
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="space-y-4 mb-12"
          >
            {[0, 1, 2].map((i) => (
              <div key={i} className="relative h-px overflow-hidden rounded-full">
                <motion.div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(212,165,116,0.7), transparent)' }}
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 2 + i * 0.4, repeat: Infinity, ease: 'linear', delay: i * 0.5 }}
                />
                <div style={{ background: 'linear-gradient(90deg, rgba(212,165,116,0.08), rgba(212,165,116,0.25), rgba(212,165,116,0.08))' }}
                     className="absolute inset-0" />
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="grid grid-cols-3 gap-6"
          >
            {[
              { v: '34', l: '覆盖省份', s: '省级行政区' },
              { v: '2,800+', l: '接入酒企', s: '实时数据上报' },
              { v: '99.2%', l: '质检覆盖率', s: '全链路追溯' },
            ].map((s) => (
              <div key={s.l} className="space-y-1">
                <div className="text-3xl xl:text-4xl font-bold bg-clip-text text-transparent"
                     style={{ backgroundImage: 'linear-gradient(135deg, #fff, #D4A574)' }}>
                  {s.v}
                </div>
                <div className="text-white/90 font-medium text-sm">{s.l}</div>
                <div className="text-slate-500 text-xs">{s.s}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="relative z-10 text-slate-500 text-sm"
        >
          © 2025 全国酒类生产流通监管中心 · 中国酒业协会技术支持
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        className="relative flex-1 flex items-center justify-center p-6 lg:p-12"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full max-w-md"
        >
          <div
            className="rounded-3xl shadow-2xl border p-8 xl:p-10 relative overflow-hidden"
            style={{
              background: 'rgba(30, 41, 59, 0.7)',
              borderColor: 'rgba(212, 165, 116, 0.25)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset',
            }}
          >
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl pointer-events-none"
                 style={{ background: 'radial-gradient(circle, rgba(212,165,116,0.2), transparent 70%)' }} />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full blur-3xl pointer-events-none"
                 style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.15), transparent 70%)' }} />

            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5" style={{ color: '#D4A574' }} />
                <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: '#D4A574' }}>
                  安全认证登录
                </span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-1">欢迎登录</h2>
              <p className="text-slate-400 mb-8 text-sm">请选择角色并登录管理系统</p>

              <Form<LoginForm>
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                size="large"
                className="space-y-1"
              >
                <Form.Item
                  label={<span className="text-slate-300 font-medium text-sm">登录角色</span>}
                  name="role"
                  rules={[{ required: true, message: '请选择登录角色' }]}
                >
                  <Select
                    options={ROLE_OPTIONS.map((r) => ({
                      value: r.value,
                      label: (
                        <div className="flex items-center justify-between gap-4">
                          <span className="font-medium text-slate-200">{r.label}</span>
                          <span className="text-xs text-slate-500">{r.desc}</span>
                        </div>
                      )
                    }))}
                    className="[&_.ant-select-selector]:!rounded-xl !bg-slate-800/50"
                    placeholder="请选择登录角色"
                    style={{ color: '#fff' }}
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="text-slate-300 font-medium text-sm">账号</span>}
                  name="username"
                  rules={[{ required: true, message: '请输入登录账号' }]}
                >
                  <Input
                    prefix={<User className="w-4 h-4 text-slate-500" />}
                    placeholder="请输入登录账号"
                    className="!rounded-xl"
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="text-slate-300 font-medium text-sm">密码</span>}
                  name="password"
                  rules={[{ required: true, message: '请输入登录密码' }]}
                >
                  <Input.Password
                    prefix={<Lock className="w-4 h-4 text-slate-500" />}
                    placeholder="请输入登录密码"
                    className="!rounded-xl"
                    iconRender={(visible) =>
                      visible ? <Eye className="w-4 h-4 text-slate-500" />
                              : <EyeOff className="w-4 h-4 text-slate-500" />
                    }
                    visibilityToggle={{ visible: showPassword, onVisibleChange: setShowPassword }}
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="text-slate-300 font-medium text-sm">验证码</span>}
                  name="captcha"
                  rules={[{ required: true, message: '请输入验证码', len: 4 }]}
                >
                  <div className="flex gap-3">
                    <Input
                      placeholder="请输入4位验证码"
                      maxLength={4}
                      className="!rounded-xl flex-1 uppercase tracking-widest font-semibold"
                    />
                    <button
                      type="button"
                      onClick={refreshCaptcha}
                      title="点击刷新验证码"
                      className="shrink-0 transition-transform hover:scale-[1.02] active:scale-95"
                    >
                      {captchaSVG}
                    </button>
                  </div>
                </Form.Item>

                <div className="flex items-center justify-between mb-6 mt-2">
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox className="text-sm text-slate-400">记住登录状态</Checkbox>
                  </Form.Item>
                  <a className="text-sm font-medium" style={{ color: '#D4A574' }}>忘记密码？</a>
                </div>

                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                  className={cn(
                    '!h-12 !rounded-xl !text-base !font-semibold !border-0',
                    'hover:!shadow-xl hover:!-translate-y-0.5',
                    'active:!translate-y-0 transition-all duration-300'
                  )}
                  style={{
                    background: 'linear-gradient(135deg, #D4A574 0%, #B8860B 100%)',
                    boxShadow: '0 4px 16px rgba(212,165,116,0.4)',
                    color: '#1F2937',
                  }}
                >
                  登 录 系 统
                </Button>
              </Form>

              <Divider className="!my-6 !text-slate-500 !text-xs" plain>
                <span className="px-2">演示账号 · 快捷登录</span>
              </Divider>

              <div className="grid grid-cols-2 gap-3">
                {quickLogins.map((q) => (
                  <motion.button
                    key={q.role}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleQuickLogin(q.role)}
                    disabled={!!quickLoading}
                    className={cn(
                      'relative overflow-hidden group rounded-xl p-3 text-left border transition-all duration-300',
                      quickLoading === q.role
                        ? 'border-gold-400 bg-gold-500/10'
                        : 'hover:shadow-lg hover:border-gold-500/40 border-slate-700/60 bg-slate-800/30 hover:bg-slate-800/60'
                    )}
                  >
                    <div
                      className={cn(
                        'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300',
                        q.color
                      )}
                    />
                    <div className="relative flex items-center gap-2.5">
                      <div
                        className={cn(
                          'w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center text-white shadow-sm',
                          q.color
                        )}
                      >
                        {q.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-200 text-sm truncate">{q.label}</div>
                        <div className="text-[11px] text-slate-500">{q.desc}</div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-slate-500 text-xs mt-6"
          >
            登录即表示同意
            <a style={{ color: '#D4A574' }} className="mx-1 hover:underline">《平台服务协议》</a>
            与
            <a style={{ color: '#D4A574' }} className="mx-1 hover:underline">《隐私政策》</a>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}
