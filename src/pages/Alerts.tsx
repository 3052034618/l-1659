import { useState, useMemo } from 'react';
import {
  Breadcrumb,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Table,
  Drawer,
  Descriptions,
  Modal,
  Radio,
  Checkbox,
  InputNumber,
  Row,
  Col,
  message,
  Tag,
  Space,
} from 'antd';
import {
  AlertTriangle,
  AlertOctagon,
  Package,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  Send,
  FileText,
  Factory,
  Activity,
  History,
  Home,
  ChevronRight,
  ArrowLeft,
  MapPin,
} from 'lucide-react';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import TrendLineChart from '@/components/charts/TrendLineChart';
import ApprovalTimeline, { ApprovalNode, ApprovalStatus } from '@/components/charts/ApprovalTimeline';
import GoldCard from '@/components/common/GoldCard';
import StatusTag from '@/components/common/StatusTag';
import { useAuth } from '@/router';
import {
  generateAlertStats,
  generateAlertList,
  generateAlertDetail,
  ALERT_TYPES,
  ALERT_LEVELS,
} from '@/utils/mock';
import { cn } from '@/lib/utils';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface FilterState {
  type: string | undefined;
  level: string | undefined;
  status: string | undefined;
  dateRange: [dayjs.Dayjs, dayjs.Dayjs] | null;
  keyword: string;
}

const STAT_ICONS = [
  <AlertOctagon key="l1" className="w-6 h-6 text-white" />,
  <AlertTriangle key="l2" className="w-6 h-6 text-white" />,
  <Clock key="pending" className="w-6 h-6 text-white" />,
  <CheckCircle2 key="resolved" className="w-6 h-6 text-white" />,
];

const STATUS_MAP: Record<string, 'pending' | 'processing' | 'resolved' | 'expired'> = {
  pending: 'pending',
  approved: 'processing',
  processing: 'processing',
  resolved: 'resolved',
  closed: 'resolved',
  rejected: 'expired',
};

export default function Alerts() {
  const { user, hasPermission } = useAuth();

  const stats = useMemo(() => generateAlertStats(), []);
  const allAlerts = useMemo(() => generateAlertList(50), []);

  const [filters, setFilters] = useState<FilterState>({
    type: undefined,
    level: undefined,
    status: undefined,
    dateRange: null,
    keyword: '',
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [planForm] = Form.useForm();

  const alertDetail = useMemo(
    () => (selectedAlert ? generateAlertDetail(selectedAlert.id) : null),
    [selectedAlert]
  );

  const filteredAlerts = useMemo(() => {
    return allAlerts.filter((a: any) => {
      if (filters.type && a.type !== filters.type) return false;
      if (filters.level !== undefined && a.level !== filters.level) {
        const isLevel1 = a.level === 'critical' || a.level === 'danger';
        const isLevel2 = a.level === 'warning' || a.level === 'info';
        if (filters.level === 'critical' || filters.level === 'danger') {
          if (!isLevel1) return false;
        } else if (filters.level === 'warning' || filters.level === 'info') {
          if (!isLevel2) return false;
        }
      }
      if (filters.status && a.status !== filters.status) return false;
      if (filters.keyword) {
        const kw = filters.keyword.toLowerCase();
        if (
          !a.title.toLowerCase().includes(kw) &&
          !a.enterprise.toLowerCase().includes(kw) &&
          !a.id.toLowerCase().includes(kw)
        )
          return false;
      }
      if (filters.dateRange) {
        const t = dayjs(a.triggerTime);
        if (t.isBefore(filters.dateRange[0]) || t.isAfter(filters.dateRange[1])) return false;
      }
      return true;
    });
  }, [allAlerts, filters]);

  const handleViewDetail = (record: any) => {
    setSelectedAlert(record);
    setDrawerOpen(true);
  };

  const handleApprovalAction = async (action: 'approve' | 'reject' | 'submit') => {
    setActionLoading(action);
    await new Promise((r) => setTimeout(r, 900));
    setActionLoading(null);
    message.success(
      action === 'approve'
        ? '审批通过成功'
        : action === 'reject'
        ? '已驳回审批'
        : '方案已提交'
    );
    if (action === 'submit') setPlanModalOpen(false);
  };

  const resetFilters = () => {
    setFilters({
      type: undefined,
      level: undefined,
      status: undefined,
      dateRange: null,
      keyword: '',
    });
  };

  const canApprove =
    hasPermission('alerts:approve') ||
    user?.role === 'national' ||
    user?.role === 'provincial' ||
    user?.role === 'municipal';
  const canSubmit =
    hasPermission('alerts:handle') ||
    user?.role === 'enterprise_qc' ||
    user?.role === 'enterprise_prod';

  const approvalNodes: ApprovalNode[] | undefined = useMemo(() => {
    if (!alertDetail?.approvals) return undefined;
    return alertDetail.approvals.map((a: any, idx: number) => ({
      key: `step-${idx}`,
      title: a.role,
      status: (a.status as ApprovalStatus) || 'pending',
      description: a.comment || undefined,
      operator: a.user,
      time: a.time || undefined,
    }));
  }, [alertDetail]);

  const columns = [
    {
      title: '编号',
      dataIndex: 'id',
      key: 'id',
      width: 140,
      fixed: 'left' as const,
      render: (v: string) => (
        <span
          className="font-mono text-xs font-medium px-2 py-1 rounded"
          style={{
            background: 'rgba(212, 165, 116, 0.08)',
            color: '#9CA3AF',
            border: '1px solid rgba(212, 165, 116, 0.15)',
          }}
        >
          {v}
        </span>
      ),
    },
    {
      title: '类型/等级',
      key: 'type_level',
      width: 150,
      render: (_: any, r: any) => (
        <div className="space-y-1.5">
          <Tag
            style={{
              margin: 0,
              fontSize: 11,
              fontWeight: 500,
              borderRadius: 6,
              padding: '2px 8px',
              background:
                r.type === 'quality' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.12)',
              borderColor:
                r.type === 'quality' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)',
              color: r.type === 'quality' ? '#F87171' : '#FBBF24',
            }}
            icon={
              r.type === 'quality' ? (
                <AlertOctagon className="w-3 h-3" />
              ) : (
                <Package className="w-3 h-3" />
              )
            }
          >
            {r.typeLabel}
          </Tag>
          <div>
            <span
              className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded"
              style={{
                backgroundColor: r.levelColor + '20',
                color: r.levelColor,
                border: `1px solid ${r.levelColor}30`,
              }}
            >
              <AlertTriangle className="w-3 h-3" fill="currentColor" />
              {r.levelLabel}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: '预警标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (v: string) => <span className="font-medium text-slate-200">{v}</span>,
    },
    {
      title: '企业/品牌',
      key: 'ent',
      width: 190,
      render: (_: any, r: any) => (
        <div className="space-y-0.5">
          <div className="font-medium text-slate-200 text-sm">{r.enterprise}</div>
          <div className="text-xs text-slate-400">品牌: {r.brand}</div>
        </div>
      ),
    },
    {
      title: '所属地区',
      dataIndex: 'province',
      key: 'province',
      width: 110,
      render: (v: string) => (
        <span className="text-sm text-slate-300 inline-flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          {v}
        </span>
      ),
    },
    {
      title: '触发时间',
      dataIndex: 'triggerTime',
      key: 'time',
      width: 170,
      render: (v: string) => (
        <span className="text-xs text-slate-400 font-mono">{v}</span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status: string) => (
        <StatusTag status={STATUS_MAP[status] || 'pending'} size="sm">
          {allAlerts.find((a: any) => a.status === status)?.statusLabel || status}
        </StatusTag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right' as const,
      render: (_: any, r: any) => (
        <Button
          type="link"
          icon={<Eye className="w-4 h-4" />}
          style={{ padding: 0, height: 'auto', color: '#60A5FA' }}
          onClick={() => handleViewDetail(r)}
        >
          查看详情
        </Button>
      ),
    },
  ];

  const statusTagColorMap: Record<string, string> = {
    pending: '#FBBF24',
    approved: '#60A5FA',
    processing: '#60A5FA',
    resolved: '#34D399',
    closed: '#34D399',
    rejected: '#F87171',
  };

  return (
    <div className="min-h-full">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <Breadcrumb
            separator={<ChevronRight className="w-3 h-3" />}
            style={{ marginBottom: 8 }}
            items={[
              {
                title: (
                  <span className="inline-flex items-center gap-1.5 text-slate-400 hover:text-amber-400 cursor-pointer transition-colors">
                    <Home className="w-3.5 h-3.5" />
                    首页
                  </span>
                ),
              },
              {
                title: (
                  <span className="text-slate-200 font-medium inline-flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    预警中心
                  </span>
                ),
              },
            ]}
          />
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)',
                boxShadow: '0 8px 24px -4px rgba(239, 68, 68, 0.4)',
              }}
            >
              <AlertOctagon className="w-5 h-5 text-white" />
            </div>
            预警中心
            <Tag
              icon={<Activity className="w-3 h-3" />}
              style={{
                margin: 0,
                marginLeft: 8,
                fontSize: 11,
                fontWeight: 600,
                borderRadius: 999,
                padding: '2px 10px',
                background: 'rgba(16, 185, 129, 0.12)',
                borderColor: 'rgba(16, 185, 129, 0.3)',
                color: '#34D399',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            >
              实时监控中
            </Tag>
          </h1>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        {stats.map((s: any, idx: number) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + idx * 0.05, duration: 0.3 }}
          >
            <div
              className="rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'rgba(30, 41, 59, 0.4)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(212, 165, 116, 0.15)',
                boxShadow: '0 4px 24px -4px rgba(0, 0, 0, 0.25)',
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-slate-400 text-sm font-medium mb-2">{s.label}</div>
                  <div
                    style={{ color: s.color, fontSize: 30, fontWeight: 800, lineHeight: 1 }}
                  >
                    {s.value}
                  </div>
                </div>
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${s.color}dd 0%, ${s.color}88 100%)`,
                  }}
                >
                  {STAT_ICONS[idx]}
                </div>
              </div>
              <div
                className="mt-4 h-1.5 rounded-full overflow-hidden"
                style={{ background: 'rgba(229, 231, 235, 0.08)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(
                      100,
                      (s.value / (s.label === '已解决' ? 400 : 200)) * 100
                    )}%`,
                    backgroundColor: s.color,
                    boxShadow: `0 0 8px ${s.color}66`,
                  }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <GoldCard padding="md">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <div className="flex items-center gap-2 mr-2">
              <Filter className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-white">筛选条件</span>
            </div>
            <div className="flex-1 flex flex-wrap gap-3 items-center min-w-0">
              <Select
                allowClear
                placeholder="预警类型"
                value={filters.type}
                onChange={(v) => setFilters({ ...filters, type: v })}
                style={{ width: 140 }}
                size="middle"
                options={ALERT_TYPES.map((t) => ({ value: t.value, label: t.label }))}
              />
              <Select
                allowClear
                placeholder="预警等级"
                value={filters.level}
                onChange={(v) => setFilters({ ...filters, level: v })}
                style={{ width: 140 }}
                size="middle"
                options={ALERT_LEVELS.map((l) => ({ value: l.value, label: l.label }))}
              />
              <Select
                allowClear
                placeholder="状态"
                value={filters.status}
                onChange={(v) => setFilters({ ...filters, status: v })}
                style={{ width: 130 }}
                size="middle"
                options={[
                  { value: 'pending', label: '待审批' },
                  { value: 'approved', label: '审批中' },
                  { value: 'processing', label: '处理中' },
                  { value: 'resolved', label: '已解决' },
                  { value: 'rejected', label: '已驳回' },
                ]}
              />
              <RangePicker
                value={filters.dateRange as any}
                onChange={(v) => setFilters({ ...filters, dateRange: v as any })}
                size="middle"
              />
              <Input
                prefix={<Search className="w-4 h-4 text-slate-400" />}
                placeholder="搜索标题/企业/编号"
                allowClear
                value={filters.keyword}
                onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                style={{ width: 220 }}
                size="middle"
              />
            </div>
            <div className="flex items-center gap-2 ml-auto shrink-0">
              <Button
                onClick={resetFilters}
                style={{
                  borderRadius: 10,
                  background: 'rgba(212, 165, 116, 0.08)',
                  borderColor: 'rgba(212, 165, 116, 0.2)',
                  color: '#D4A574',
                }}
              >
                重置
              </Button>
              <Button
                icon={<RefreshCw className="w-4 h-4" />}
                onClick={() => message.success('已刷新数据')}
                style={{
                  borderRadius: 10,
                  background: 'rgba(212, 165, 116, 0.08)',
                  borderColor: 'rgba(212, 165, 116, 0.2)',
                  color: '#D4A574',
                }}
              >
                刷新
              </Button>
              <Button
                type="primary"
                icon={<Download className="w-4 h-4" />}
                style={{
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                  border: 'none',
                  boxShadow: '0 4px 12px -2px rgba(59, 130, 246, 0.4)',
                }}
              >
                导出
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl" style={{ border: '1px solid rgba(212, 165, 116, 0.1)' }}>
            <Table
              columns={columns}
              dataSource={filteredAlerts}
              rowKey="key"
              scroll={{ x: 1300 }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
              }}
              size="middle"
              style={{
                background: 'transparent',
              }}
            />
          </div>
        </GoldCard>
      </motion.div>

      <Drawer
        title={
          <div className="flex items-center gap-3 -ml-2">
            <button
              onClick={() => setDrawerOpen(false)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 transition-colors"
              style={{ background: 'rgba(212, 165, 116, 0.08)' }}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="font-bold text-lg text-white flex items-center gap-2">
                预警详情
                {selectedAlert && (
                  <span
                    className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: selectedAlert.levelColor + '20',
                      color: selectedAlert.levelColor,
                      border: `1px solid ${selectedAlert.levelColor}30`,
                    }}
                  >
                    <AlertTriangle className="w-3 h-3" fill="currentColor" />
                    {selectedAlert.levelLabel}
                  </span>
                )}
              </div>
              <div
                className="text-xs mt-0.5 font-mono"
                style={{ color: '#6B7280' }}
              >
                {selectedAlert?.id}
              </div>
            </div>
          </div>
        }
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={760}
        destroyOnClose
        styles={{
          header: {
            padding: '18px 24px',
            borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
            background: 'rgba(15, 23, 42, 0.95)',
          },
          body: {
            padding: '20px 24px',
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(15, 23, 42, 1) 100%)',
          },
          mask: {
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
          },
          content: {
            background: '#0F172A',
            border: '1px solid rgba(212, 165, 116, 0.15)',
          },
        }}
        extra={
          <div className="flex items-center gap-2 mr-8">
            <Button
              icon={<Download className="w-4 h-4" />}
              size="middle"
              style={{
                borderRadius: 10,
                background: 'rgba(212, 165, 116, 0.08)',
                borderColor: 'rgba(212, 165, 116, 0.2)',
                color: '#D4A574',
              }}
            >
              导出报告
            </Button>
          </div>
        }
      >
        {selectedAlert && alertDetail && (
          <div className="space-y-6">
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(30, 41, 59, 0.4)',
                border: '1px solid rgba(212, 165, 116, 0.15)',
              }}
            >
              <div
                className="p-5"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(239, 68, 68, 0.12) 0%, rgba(245, 158, 11, 0.12) 50%, rgba(249, 115, 22, 0.12) 100%)',
                  borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
                }}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-lg font-bold text-white leading-snug">
                    {selectedAlert.title}
                  </h3>
                  <Tag
                    style={{
                      flexShrink: 0,
                      fontSize: 11,
                      fontWeight: 500,
                      borderRadius: 999,
                      padding: '3px 10px',
                      background:
                        (statusTagColorMap[selectedAlert.status] || '#FBBF24') + '20',
                      borderColor:
                        (statusTagColorMap[selectedAlert.status] || '#FBBF24') + '40',
                      color: statusTagColorMap[selectedAlert.status] || '#FBBF24',
                    }}
                  >
                    {selectedAlert.statusLabel}
                  </Tag>
                </div>
                <p
                  className="text-sm leading-relaxed rounded-lg p-3"
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    color: '#94A3B8',
                    border: '1px solid rgba(212, 165, 116, 0.1)',
                  }}
                >
                  {alertDetail.description}
                </p>
              </div>
              <div className="p-5">
                <Descriptions
                  column={2}
                  size="small"
                  colon={false}
                  labelStyle={{ color: '#64748B', fontWeight: 500 }}
                  contentStyle={{ color: '#E2E8F0' }}
                >
                  <Descriptions.Item label="预警类型">
                    <span style={{ color: selectedAlert.levelColor }}>
                      {selectedAlert.typeLabel}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="预警等级">
                    <span
                      style={{
                        color: selectedAlert.levelColor,
                        fontWeight: 600,
                      }}
                    >
                      {selectedAlert.levelLabel}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="所属企业">{selectedAlert.enterprise}</Descriptions.Item>
                  <Descriptions.Item label="涉及品牌">{selectedAlert.brand}</Descriptions.Item>
                  <Descriptions.Item label="所属地区">{selectedAlert.province}</Descriptions.Item>
                  <Descriptions.Item label="触发时间">
                    <span className="font-mono text-xs">{selectedAlert.triggerTime}</span>
                  </Descriptions.Item>
                  <Descriptions.Item label="批次编号">
                    <span
                      className="font-mono text-xs px-2 py-0.5 rounded"
                      style={{
                        background: 'rgba(212, 165, 116, 0.08)',
                        border: '1px solid rgba(212, 165, 116, 0.15)',
                      }}
                    >
                      {alertDetail.batchNo}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="影响产品">
                    <span style={{ color: '#F87171', fontWeight: 600 }}>
                      {alertDetail.productCount} 件
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="影响范围" span={2}>
                    {alertDetail.affectedArea}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-blue-400" />
                历史指标趋势（近30天）
              </h4>
              <div
                className="rounded-2xl p-4"
                style={{
                  background: 'rgba(30, 41, 59, 0.4)',
                  border: '1px solid rgba(212, 165, 116, 0.15)',
                }}
              >
                <TrendLineChart
                  xData={alertDetail.metrics.map((m: any) => m.date)}
                  series={[
                    {
                      name: '检测值',
                      data: alertDetail.metrics.map((m: any) => m.value),
                      color: '#3B82F6',
                    },
                    {
                      name: '阈值',
                      data: alertDetail.metrics.map((m: any) => m.threshold),
                      color: '#EF4444',
                    },
                  ]}
                  title="指标趋势分析"
                  height={240}
                />
                <div
                  className="mt-2 pt-3 grid grid-cols-3 gap-4 text-xs"
                  style={{ borderTop: '1px solid rgba(212, 165, 116, 0.1)' }}
                >
                  <div>
                    <div style={{ color: '#64748B', marginBottom: 4 }}>最大值</div>
                    <div
                      className="font-bold text-base"
                      style={{ color: '#F87171' }}
                    >
                      {Math.max(...alertDetail.metrics.map((m: any) => m.value)).toFixed(3)}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#64748B', marginBottom: 4 }}>平均值</div>
                    <div
                      className="font-bold text-base"
                      style={{ color: '#E2E8F0' }}
                    >
                      {(
                        alertDetail.metrics.reduce((s: number, m: any) => s + m.value, 0) /
                        alertDetail.metrics.length
                      ).toFixed(3)}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#64748B', marginBottom: 4 }}>阈值线</div>
                    <div
                      className="font-bold text-base"
                      style={{ color: '#FBBF24' }}
                    >
                      {alertDetail.metrics[0]?.threshold}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-violet-400" />
                三级审批流程
              </h4>
              <ApprovalTimeline
                nodes={approvalNodes}
                title="三级审批进度"
                layout="horizontal"
                height={280}
              />
              {selectedAlert.status !== 'resolved' &&
                selectedAlert.status !== 'rejected' &&
                selectedAlert.status !== 'closed' && (
                  <div className="mt-4 flex flex-wrap gap-3 justify-end">
                    {canSubmit && (
                      <Button
                        icon={<FileText className="w-4 h-4" />}
                        onClick={() => setPlanModalOpen(true)}
                        style={{
                          borderRadius: 10,
                          background: 'linear-gradient(135deg, #D4A574 0%, #B8860B 100%)',
                          border: 'none',
                          color: '#0F172A',
                          fontWeight: 600,
                          boxShadow: '0 4px 12px -2px rgba(212, 165, 116, 0.4)',
                        }}
                      >
                        提交处理方案
                      </Button>
                    )}
                    {canApprove && (
                      <>
                        <Button
                          danger
                          icon={<XCircle className="w-4 h-4" />}
                          loading={actionLoading === 'reject'}
                          onClick={() => handleApprovalAction('reject')}
                          style={{
                            borderRadius: 10,
                          }}
                        >
                          驳回
                        </Button>
                        <Button
                          type="primary"
                          icon={<CheckCircle2 className="w-4 h-4" />}
                          loading={actionLoading === 'approve'}
                          onClick={() => handleApprovalAction('approve')}
                          style={{
                            borderRadius: 10,
                            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                            border: 'none',
                            boxShadow: '0 4px 12px -2px rgba(16, 185, 129, 0.4)',
                          }}
                        >
                          审批通过
                        </Button>
                      </>
                    )}
                  </div>
                )}
            </div>

            <div>
              <h4 className="font-semibold text-white flex items-center gap-2 mb-3">
                <History className="w-4 h-4 text-slate-400" />
                操作日志
              </h4>
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(30, 41, 59, 0.4)',
                  border: '1px solid rgba(212, 165, 116, 0.15)',
                }}
              >
                {alertDetail.logs.map((log: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 px-4 py-3 transition-colors"
                    style={{
                      borderBottom:
                        idx < alertDetail.logs.length - 1
                          ? '1px solid rgba(212, 165, 116, 0.06)'
                          : 'none',
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs"
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(212, 165, 116, 0.15) 0%, rgba(184, 134, 11, 0.15) 100%)',
                        color: '#D4A574',
                        border: '1px solid rgba(212, 165, 116, 0.2)',
                      }}
                    >
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-slate-200 text-sm">
                          {log.action}
                        </span>
                        {log.detail && (
                          <span
                            className="text-[11px] rounded px-2 py-0.5"
                            style={{
                              background: 'rgba(212, 165, 116, 0.08)',
                              color: '#94A3B8',
                              border: '1px solid rgba(212, 165, 116, 0.12)',
                            }}
                          >
                            {log.detail}
                          </span>
                        )}
                      </div>
                      <div
                        className="flex items-center gap-3 text-[11px] mt-0.5"
                        style={{ color: '#64748B' }}
                      >
                        <span>操作人：{log.user}</span>
                      </div>
                    </div>
                    <span
                      className="text-[11px] font-mono shrink-0"
                      style={{ color: '#64748B' }}
                    >
                      {log.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>

      <Modal
        title={
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-white">提交处理方案</span>
          </div>
        }
        open={planModalOpen}
        onCancel={() => setPlanModalOpen(false)}
        onOk={planForm.submit}
        okText="提交方案"
        okButtonProps={{
          icon: <Send className="w-4 h-4" />,
          style: {
            background: 'linear-gradient(135deg, #D4A574 0%, #B8860B 100%)',
            border: 'none',
            borderRadius: 10,
            color: '#0F172A',
            fontWeight: 600,
          },
          loading: actionLoading === 'submit',
        }}
        cancelButtonProps={{
          style: {
            borderRadius: 10,
            background: 'rgba(212, 165, 116, 0.08)',
            borderColor: 'rgba(212, 165, 116, 0.2)',
            color: '#D4A574',
          },
        }}
        width={600}
        destroyOnClose
        styles={{
          header: {
            background: '#1E293B',
            borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
          },
          body: {
            background: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)',
          },
          mask: {
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
          },
          content: {
            background: '#1E293B',
            border: '1px solid rgba(212, 165, 116, 0.15)',
          },
        }}
      >
        <Form
          form={planForm}
          layout="vertical"
          onFinish={() => handleApprovalAction('submit')}
          initialValues={{ type: 'limit_production', range: 'partial', measures: [] }}
          style={{ marginTop: 8 }}
        >
          <Form.Item
            label={<span className="font-medium text-slate-200">方案类型</span>}
            name="type"
            rules={[{ required: true, message: '请选择方案类型' }]}
          >
            <Radio.Group size="large" style={{ width: '100%' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Radio.Button
                  value="limit_production"
                  style={{
                    borderRadius: 12,
                    height: 'auto',
                    padding: '12px 16px',
                    marginBottom: 8,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    background: 'rgba(212, 165, 116, 0.05)',
                    borderColor: 'rgba(212, 165, 116, 0.2)',
                    color: '#E2E8F0',
                  }}
                >
                  <Factory className="w-5 h-5 text-amber-400" />
                  <div style={{ textAlign: 'left' }}>
                    <div className="font-semibold">限产整改</div>
                    <div className="text-[11px]" style={{ color: '#64748B' }}>
                      暂停或减少相关生产线
                    </div>
                  </div>
                </Radio.Button>
                <Radio.Button
                  value="recall"
                  style={{
                    borderRadius: 12,
                    height: 'auto',
                    padding: '12px 16px',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    background: 'rgba(239, 68, 68, 0.05)',
                    borderColor: 'rgba(239, 68, 68, 0.2)',
                    color: '#E2E8F0',
                  }}
                >
                  <Package className="w-5 h-5 text-rose-400" />
                  <div style={{ textAlign: 'left' }}>
                    <div className="font-semibold">产品召回</div>
                    <div className="text-[11px]" style={{ color: '#64748B' }}>
                      通知经销商召回已售产品
                    </div>
                  </div>
                </Radio.Button>
              </Space>
            </Radio.Group>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={<span className="font-medium text-slate-200">涉及范围</span>}
                name="range"
                rules={[{ required: true, message: '请选择范围' }]}
              >
                <Select
                  options={[
                    { value: 'partial', label: '部分批次' },
                    { value: 'all_brand', label: '全系产品' },
                    { value: 'area', label: '指定区域' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span className="font-medium text-slate-200">数量(件)</span>}
                name="quantity"
                rules={[{ required: true, message: '请输入数量' }]}
              >
                <InputNumber
                  min={1}
                  style={{ width: '100%' }}
                  placeholder="请输入产品数量"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={<span className="font-medium text-slate-200">整改措施</span>}
            name="measures"
            rules={[
              {
                required: true,
                message: '请至少选择一项措施',
                type: 'array',
                min: 1,
              },
            ]}
          >
            <Checkbox.Group style={{ width: '100%' }}>
              <Row gutter={[8, 8]}>
                {[
                  '生产线整改',
                  '设备维护检修',
                  '人员培训考核',
                  '原料重新检测',
                  '增加质检频次',
                  '第三方复检',
                ].map((m) => (
                  <Col span={12} key={m}>
                    <Checkbox
                      value={m}
                      style={{ fontSize: 13, padding: '4px 0', color: '#CBD5E1' }}
                    >
                      {m}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item
            label={<span className="font-medium text-slate-200">方案说明</span>}
            name="description"
            rules={[{ required: true, message: '请填写方案说明' }]}
          >
            <TextArea
              rows={4}
              placeholder="请详细描述处理方案、时间节点及责任人..."
              showCount
              maxLength={500}
              style={{ borderRadius: 10 }}
            />
          </Form.Item>
        </Form>
      </Modal>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
