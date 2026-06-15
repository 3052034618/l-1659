import React, { useState } from 'react';
import {
  Card,
  List,
  Tag,
  Button,
  Space,
  Typography,
  Drawer,
  Row,
  Col,
  Statistic,
  Table,
  Divider,
  Progress,
} from 'antd';
import {
  FilePdfOutlined,
  EyeOutlined,
  CalendarOutlined,
  FileTextOutlined,
  AimOutlined,
  TrophyOutlined,
  AlertOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  RiseOutlined,
  StarFilled,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';

const { Title, Text, Paragraph } = Typography;

interface WeeklyReport {
  id: string;
  reportNo: string;
  weekNumber: number;
  year: number;
  startDate: string;
  endDate: string;
  generatedAt: string;
  scope: 'national' | 'provincial' | 'municipal';
  regionName?: string;
  status: 'generated' | 'generating' | 'draft';
}

const generateMockReports = (): WeeklyReport[] => {
  const reports: WeeklyReport[] = [];
  const scopes: Array<{ scope: WeeklyReport['scope']; name?: string }> = [
    { scope: 'national' },
    { scope: 'provincial', name: '四川省' },
    { scope: 'provincial', name: '贵州省' },
    { scope: 'municipal', name: '成都市' },
    { scope: 'provincial', name: '江苏省' },
    { scope: 'national' },
    { scope: 'provincial', name: '山东省' },
    { scope: 'municipal', name: '遵义市' },
  ];
  for (let i = 0; i < 12; i++) {
    const scopeInfo = scopes[i % scopes.length];
    const startDate = dayjs().subtract(i * 7, 'day');
    reports.push({
      id: `RPT-${2026}${String(24 - i).padStart(3, '0')}`,
      reportNo: `WINE-ANNUAL-2026-W${String(24 - i).padStart(2, '0')}`,
      weekNumber: 24 - i,
      year: 2026,
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: startDate.add(6, 'day').format('YYYY-MM-DD'),
      generatedAt: startDate.add(7, 'day').add(2, 'hour').format('YYYY-MM-DD HH:mm'),
      scope: scopeInfo.scope,
      regionName: scopeInfo.name,
      status: i === 0 ? 'generating' : 'generated',
    });
  }
  return reports;
};

const TrendLineChart: React.FC = () => {
  const weeks = ['W18', 'W19', 'W20', 'W21', 'W22', 'W23', 'W24'];
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(17, 24, 39, 0.95)',
      borderColor: '#D4A574',
      borderWidth: 1,
      textStyle: { color: '#F3F4F6' },
    },
    legend: {
      data: ['本周产销率', '上周产销率', '去年同期'],
      textStyle: { color: '#9CA3AF' },
      top: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '14%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: weeks,
      axisLine: { lineStyle: { color: '#374151' } },
      axisLabel: { color: '#9CA3AF' },
      splitLine: { lineStyle: { color: 'rgba(55, 65, 81, 0.5)' } },
    },
    yAxis: {
      type: 'value',
      name: '产销率(%)',
      min: 70,
      max: 100,
      nameTextStyle: { color: '#9CA3AF' },
      axisLine: { lineStyle: { color: '#374151' } },
      axisLabel: { color: '#9CA3AF', formatter: '{value}%' },
      splitLine: { lineStyle: { color: 'rgba(55, 65, 81, 0.5)' } },
    },
    series: [
      {
        name: '本周产销率',
        type: 'line',
        smooth: true,
        data: [85.2, 87.6, 84.3, 88.9, 91.2, 89.5, 92.8],
        lineStyle: { color: '#D4A574', width: 3 },
        itemStyle: { color: '#D4A574' },
        symbol: 'circle',
        symbolSize: 8,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(212, 165, 116, 0.35)' },
              { offset: 1, color: 'rgba(212, 165, 116, 0.02)' },
            ],
          },
        },
      },
      {
        name: '上周产销率',
        type: 'line',
        smooth: true,
        data: [83.8, 86.1, 82.9, 87.2, 89.6, 88.1, 89.5],
        lineStyle: { color: '#3B82F6', width: 2, type: 'dashed' },
        itemStyle: { color: '#3B82F6' },
        symbol: 'circle',
        symbolSize: 6,
      },
      {
        name: '去年同期',
        type: 'line',
        smooth: true,
        data: [80.1, 82.4, 81.2, 84.6, 85.9, 84.3, 87.2],
        lineStyle: { color: '#6B7280', width: 2, type: 'dotted' },
        itemStyle: { color: '#6B7280' },
        symbol: 'circle',
        symbolSize: 5,
      },
    ],
  };
  return <ReactECharts option={option} style={{ height: 280, width: '100%' }} notMerge />;
};

const QualityPieChart: React.FC = () => {
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(17, 24, 39, 0.95)',
      borderColor: '#D4A574',
      borderWidth: 1,
      textStyle: { color: '#F3F4F6' },
      formatter: '{b}: {c}起 ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: { color: '#9CA3AF' },
      itemGap: 12,
    },
    series: [
      {
        name: '质量事故原因',
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#111827',
          borderWidth: 2,
        },
        label: { show: false },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
            color: '#F3F4F6',
          },
        },
        labelLine: { show: false },
        data: [
          { value: 18, name: '酒精度不符', itemStyle: { color: '#EF4444' } },
          { value: 12, name: '添加剂超标', itemStyle: { color: '#F59E0B' } },
          { value: 9, name: '标签标识违规', itemStyle: { color: '#3B82F6' } },
          { value: 6, name: '卫生指标不合格', itemStyle: { color: '#8B5CF6' } },
          { value: 5, name: '其他问题', itemStyle: { color: '#6B7280' } },
        ],
      },
    ],
  };
  return <ReactECharts option={option} style={{ height: 280, width: '100%' }} notMerge />;
};

interface SatisfactionItem {
  key: string;
  rank: number;
  brandName: string;
  score: number;
  lastWeekRank: number;
  trend: 'up' | 'down' | 'flat';
}

const satisfactionData: SatisfactionItem[] = [
  { key: '1', rank: 1, brandName: '茅台飞天', score: 98.6, lastWeekRank: 1, trend: 'flat' },
  { key: '2', rank: 2, brandName: '五粮液', score: 97.2, lastWeekRank: 3, trend: 'up' },
  { key: '3', rank: 3, brandName: '国窖1573', score: 96.8, lastWeekRank: 2, trend: 'down' },
  { key: '4', rank: 4, brandName: '汾酒青花', score: 95.4, lastWeekRank: 5, trend: 'up' },
  { key: '5', rank: 5, brandName: '郎酒青花郎', score: 94.9, lastWeekRank: 4, trend: 'down' },
  { key: '6', rank: 6, brandName: '泸州老窖', score: 94.1, lastWeekRank: 7, trend: 'up' },
  { key: '7', rank: 7, brandName: '洋河梦之蓝', score: 93.6, lastWeekRank: 6, trend: 'down' },
  { key: '8', rank: 8, brandName: '古井贡酒', score: 92.8, lastWeekRank: 9, trend: 'up' },
  { key: '9', rank: 9, brandName: '习酒窖藏', score: 92.1, lastWeekRank: 8, trend: 'down' },
  { key: '10', rank: 10, brandName: '剑南春', score: 91.5, lastWeekRank: 11, trend: 'up' },
];

const QualityRankList: React.FC = () => {
  const getMedalColor = (rank: number) => {
    if (rank === 1) return '#FFD700';
    if (rank === 2) return '#C0C0C0';
    if (rank === 3) return '#CD7F32';
    return '#6B7280';
  };

  const columns = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 70,
      align: 'center' as const,
      render: (v: number) => (
        <div
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center mx-auto text-sm font-bold',
            v <= 3 ? '' : 'bg-ink-surface'
          )}
          style={{
            background:
              v <= 3
                ? `linear-gradient(135deg, ${getMedalColor(v)}, ${getMedalColor(v)}88)`
                : undefined,
            color: v <= 3 ? '#1F2937' : '#F3F4F6',
          }}
        >
          {v}
        </div>
      ),
    },
    {
      title: '品牌',
      dataIndex: 'brandName',
      key: 'brandName',
      render: (v: string) => <Text strong style={{ color: '#F3F4F6' }}>{v}</Text>,
    },
    {
      title: '满意度',
      dataIndex: 'score',
      key: 'score',
      width: 220,
      render: (v: number) => (
        <div className="flex items-center gap-2">
          <Progress
            percent={v}
            showInfo={false}
            strokeColor={{ from: '#D4A574', to: '#FBBF24' }}
            trailColor="#374151"
            size="small"
            style={{ flex: 1 }}
          />
          <Text strong style={{ color: '#D4A574', width: 50 }}>{v.toFixed(1)}</Text>
        </div>
      ),
    },
    {
      title: '趋势',
      dataIndex: 'trend',
      key: 'trend',
      width: 80,
      align: 'center' as const,
      render: (v: SatisfactionItem['trend'], record: SatisfactionItem) => (
        <Space>
          {v === 'up' && (
            <Tag color="green" icon={<ArrowUpOutlined />}>
              上升{record.lastWeekRank - record.rank}
            </Tag>
          )}
          {v === 'down' && (
            <Tag color="red" icon={<ArrowDownOutlined />}>
              下降{record.rank - record.lastWeekRank}
            </Tag>
          )}
          {v === 'flat' && <Tag>持平</Tag>}
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={satisfactionData}
      pagination={false}
      size="small"
      rowClassName="hover:bg-gold-500/5"
    />
  );
};

export default function Reports() {
  const [reports] = useState<WeeklyReport[]>(generateMockReports());
  const [selectedReport, setSelectedReport] = useState<WeeklyReport | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleViewReport = (report: WeeklyReport) => {
    setSelectedReport(report);
    setDrawerVisible(true);
  };

  const getScopeTag = (scope: WeeklyReport['scope'], name?: string) => {
    if (scope === 'national')
      return <Tag color="gold" icon={<StarFilled />}>全国范围</Tag>;
    if (scope === 'provincial')
      return <Tag color="blue">{name}</Tag>;
    return <Tag color="purple">{name}</Tag>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Title level={3} style={{ color: '#F3F4F6', margin: 0 }}>
            运营诊断报告
          </Title>
          <Text type="secondary">
            自动生成周报 · 产销率分析 · 质量事故归因 · 品牌满意度排名
          </Text>
        </div>
        <Space>
          <Button type="primary" icon={<ThunderboltOutlined />}>
            生成新报告
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        {reports.map((report) => (
          <Col xs={24} sm={12} lg={8} xl={6} key={report.id}>
            <Card
              className={cn(
                'border border-ink-border bg-gradient-card shadow-card h-full',
                'hover:shadow-gold hover:border-gold-400/50 transition-all duration-300 cursor-pointer',
                'transform hover:-translate-y-1'
              )}
              onClick={() => handleViewReport(report)}
              styles={{ body: { padding: 20 } }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={cn(
                    'w-12 h-12 rounded-lg flex items-center justify-center',
                    report.scope === 'national'
                      ? 'bg-gold-500/20'
                      : report.scope === 'provincial'
                      ? 'bg-blue-500/20'
                      : 'bg-purple-500/20'
                  )}
                >
                  <FileTextOutlined
                    style={{
                      fontSize: 22,
                      color:
                        report.scope === 'national'
                          ? '#D4A574'
                          : report.scope === 'provincial'
                          ? '#3B82F6'
                          : '#8B5CF6',
                    }}
                  />
                </div>
                {report.status === 'generating' && (
                  <Tag color="processing" icon={<RiseOutlined />}>
                    生成中
                  </Tag>
                )}
                {report.status === 'generated' && (
                  <Tag color="success" icon={<CheckCircleOutlined />}>
                    已生成
                  </Tag>
                )}
              </div>

              <Text
                strong
                style={{ color: '#F3F4F6', fontSize: 14, display: 'block', marginBottom: 6 }}
              >
                {report.reportNo}
              </Text>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <CalendarOutlined />
                  <span>第{report.weekNumber}周 · {report.startDate} ~ {report.endDate.slice(5)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <EyeOutlined />
                  <span>生成时间: {report.generatedAt}</span>
                </div>
              </div>

              <div className="mb-4">{getScopeTag(report.scope, report.regionName)}</div>

              <Divider style={{ borderColor: '#374151', margin: '12px 0' }} />

              <Button
                icon={<FilePdfOutlined />}
                style={{ width: '100%', borderColor: '#D4A574', color: '#D4A574' }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                导出PDF
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      <Drawer
        title={null}
        placement="right"
        width={920}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        destroyOnClose
        styles={{
          body: {
            padding: 0,
            background: '#0B1220',
          },
          header: { display: 'none' },
          mask: { background: 'rgba(0, 0, 0, 0.6)' },
        }}
      >
        {selectedReport && (
          <div className="min-h-screen">
            <div
              className="relative p-8 mb-6"
              style={{
                background:
                  'linear-gradient(135deg, rgba(212,165,116,0.15) 0%, rgba(17,24,39,0.8) 100%)',
                borderBottom: '3px double #D4A574',
              }}
            >
              <div
                className="absolute top-4 left-4 w-20 h-20 rounded-sm opacity-20"
                style={{ border: '3px solid #D4A574' }}
              />
              <div
                className="absolute bottom-4 right-4 w-20 h-20 rounded-sm opacity-20"
                style={{ border: '3px solid #D4A574' }}
              />
              <div className="absolute top-4 right-4 w-20 h-20 rounded-full opacity-60 flex items-center justify-center"
                style={{
                  border: '3px solid #D4A574',
                  background: 'radial-gradient(circle, rgba(212,165,116,0.3) 0%, transparent 70%)',
                  transform: 'rotate(-15deg)',
                }}
              >
                <div className="text-center">
                  <div style={{ color: '#D4A574', fontSize: 10, fontWeight: 'bold' }}>
                    NATIONAL
                  </div>
                  <div style={{ color: '#D4A574', fontSize: 14, fontWeight: 'bold' }}>
                    酒类监测
                  </div>
                  <div style={{ color: '#D4A574', fontSize: 8 }}>CERTIFIED</div>
                </div>
              </div>

              <div className="text-center py-6 relative z-10">
                <div
                  className="inline-block px-6 py-2 mb-4"
                  style={{
                    border: '2px solid #D4A574',
                    borderRadius: 4,
                  }}
                >
                  <Text strong style={{ color: '#D4A574', fontSize: 18, letterSpacing: 4 }}>
                    运营诊断报告
                  </Text>
                </div>
                <Title level={2} style={{ color: '#F3F4F6', margin: '8px 0' }}>
                  {selectedReport.scope === 'national'
                    ? '全国酒类产销运行周报'
                    : `${selectedReport.regionName}酒类产销运行周报`}
                </Title>
                <div className="mt-4 space-x-4">
                  <Tag color="gold" style={{ fontSize: 13, padding: '4px 12px' }}>
                    报告编号: {selectedReport.reportNo}
                  </Tag>
                  <Tag style={{ fontSize: 13, padding: '4px 12px' }}>
                    第{selectedReport.weekNumber}周
                  </Tag>
                  <Tag color="blue" style={{ fontSize: 13, padding: '4px 12px' }}>
                    {selectedReport.startDate} ~ {selectedReport.endDate}
                  </Tag>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  生成时间: {selectedReport.generatedAt} | 版本: V1.0 | 密级: 内部使用
                </div>
              </div>
            </div>

            <div className="px-8 pb-8 space-y-6">
              <Card
                className="border border-ink-border bg-gradient-card shadow-card"
                title={
                  <span style={{ color: '#F3F4F6' }}>
                    <AimOutlined className="mr-2" style={{ color: '#D4A574' }} />
                    核心指标周度对比
                  </span>
                }
              >
                <Row gutter={16}>
                  <Col span={6}>
                    <Statistic
                      title={<span style={{ color: '#9CA3AF' }}>本周产销率</span>}
                      value={92.8}
                      precision={1}
                      suffix="%"
                      valueStyle={{ color: '#D4A574' }}
                      prefix={<RiseOutlined />}
                    />
                    <div className="text-xs mt-1">
                      <Tag color="success" icon={<ArrowUpOutlined />}>
                        环比 +3.3%
                      </Tag>
                      <Tag color="blue" icon={<ArrowUpOutlined />}>
                        同比 +5.6%
                      </Tag>
                    </div>
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title={<span style={{ color: '#9CA3AF' }}>总产量</span>}
                      value={486.2}
                      suffix="万千升"
                      valueStyle={{ color: '#10B981' }}
                    />
                    <div className="text-xs mt-1">
                      <Tag color="success" icon={<ArrowUpOutlined />}>环比 +2.1%</Tag>
                    </div>
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title={<span style={{ color: '#9CA3AF' }}>质量合格率</span>}
                      value={98.6}
                      precision={1}
                      suffix="%"
                      valueStyle={{ color: '#3B82F6' }}
                    />
                    <div className="text-xs mt-1">
                      <Tag color="green" icon={<ArrowUpOutlined />}>环比 +0.3%</Tag>
                    </div>
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title={<span style={{ color: '#9CA3AF' }}>库存周转</span>}
                      value={38.4}
                      suffix="天"
                      valueStyle={{ color: '#8B5CF6' }}
                    />
                    <div className="text-xs mt-1">
                      <Tag color="red" icon={<ArrowUpOutlined />}>环比 +1.2天</Tag>
                    </div>
                  </Col>
                </Row>
              </Card>

              <Card
                className="border border-ink-border bg-gradient-card shadow-card"
                title={
                  <span style={{ color: '#F3F4F6' }}>
                    <RiseOutlined className="mr-2" style={{ color: '#D4A574' }} />
                    产销率同比环比趋势（近7周）
                  </span>
                }
              >
                <TrendLineChart />
              </Card>

              <Row gutter={16}>
                <Col span={12}>
                  <Card
                    className="border border-ink-border bg-gradient-card shadow-card h-full"
                    title={
                      <span style={{ color: '#F3F4F6' }}>
                        <AlertOutlined className="mr-2" style={{ color: '#EF4444' }} />
                        质量事故原因分布
                      </span>
                    }
                    extra={<Tag color="red">本周共50起</Tag>}
                  >
                    <QualityPieChart />
                    <Divider style={{ borderColor: '#374151', margin: '12px 0' }} />
                    <div className="text-xs text-gray-400 mb-2">事故品牌TOP5</div>
                    <Table
                      size="small"
                      pagination={false}
                      dataSource={[
                        { key: '1', name: '某地方酒厂A', incidents: 8 },
                        { key: '2', name: '某民营酒企B', incidents: 6 },
                        { key: '3', name: '某区域品牌C', incidents: 5 },
                        { key: '4', name: '某县级酒厂D', incidents: 4 },
                        { key: '5', name: '某贴牌厂商E', incidents: 3 },
                      ]}
                      columns={[
                        {
                          title: '品牌名称',
                          dataIndex: 'name',
                          key: 'name',
                          render: (v: string) => (
                            <Text type="secondary">{v}</Text>
                          ),
                        },
                        {
                          title: '事故数',
                          dataIndex: 'incidents',
                          key: 'incidents',
                          width: 80,
                          align: 'right' as const,
                          render: (v: number) => (
                            <Text strong style={{ color: '#EF4444' }}>{v}起</Text>
                          ),
                        },
                      ]}
                      rowClassName="!hover:bg-red-500/5"
                    />
                  </Card>
                </Col>

                <Col span={12}>
                  <Card
                    className="border border-ink-border bg-gradient-card shadow-card h-full"
                    title={
                      <span style={{ color: '#F3F4F6' }}>
                        <TrophyOutlined className="mr-2" style={{ color: '#D4A574' }} />
                        品牌满意度 TOP 10
                      </span>
                    }
                  >
                    <QualityRankList />
                  </Card>
                </Col>
              </Row>

              <Card
                className="border border-ink-border bg-gradient-card shadow-card"
                title={
                  <span style={{ color: '#F3F4F6' }}>
                    <ThunderboltOutlined className="mr-2" style={{ color: '#D4A574' }} />
                    本周 vs 上周 关键指标对比
                  </span>
                }
              >
                <Row gutter={[16, 16]}>
                  {[
                    { label: '高端白酒销量', cur: '128.6万千升', prev: '122.3万千升', diff: '+5.1%', positive: true },
                    { label: '中端白酒销量', cur: '256.8万千升', prev: '251.2万千升', diff: '+2.2%', positive: true },
                    { label: '电商渠道占比', cur: '28.4%', prev: '26.8%', diff: '+1.6pp', positive: true },
                    { label: '线下渠道占比', cur: '71.6%', prev: '73.2%', diff: '-1.6pp', positive: false },
                    { label: '平均出厂价', cur: '¥268/瓶', prev: '¥262/瓶', diff: '+2.3%', positive: true },
                    { label: '退货率', cur: '1.2%', prev: '1.4%', diff: '-0.2pp', positive: true },
                    { label: '重大预警数', cur: '3起', prev: '5起', diff: '-40%', positive: true },
                    { label: '质检覆盖率', cur: '94.2%', prev: '92.8%', diff: '+1.4pp', positive: true },
                  ].map((item, idx) => (
                    <Col span={6} key={idx}>
                      <div className="p-4 rounded-lg bg-ink-surface/50 border border-ink-border">
                        <div className="text-xs text-gray-400 mb-2">{item.label}</div>
                        <div className="flex items-baseline justify-between">
                          <Text strong style={{ color: '#F3F4F6', fontSize: 16 }}>
                            {item.cur}
                          </Text>
                          <Tag
                            color={item.positive ? 'green' : 'red'}
                            style={{ margin: 0 }}
                          >
                            {item.diff}
                          </Tag>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          上周: {item.prev}
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card>

              <Card
                className="border border-ink-border bg-gradient-card shadow-card"
                title={
                  <span style={{ color: '#F3F4F6' }}>
                    <FileTextOutlined className="mr-2" style={{ color: '#D4A574' }} />
                    AI 优化建议
                  </span>
                }
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <div
                      className="p-5 rounded-lg h-full"
                      style={{
                        background: 'rgba(59, 130, 246, 0.08)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                      }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ background: 'rgba(59, 130, 246, 0.2)' }}
                        >
                          <ThunderboltOutlined style={{ color: '#3B82F6' }} />
                        </div>
                        <Text strong style={{ color: '#3B82F6', fontSize: 15 }}>
                          生产调度优化
                        </Text>
                      </div>
                      <List
                        size="small"
                        dataSource={[
                          '西南产区Q3产能利用率建议从82%提升至88%，应对中秋旺季',
                          '华北地区两条低产能线建议合并，提升单位产出效率12%',
                          '高端白酒基酒储备周期建议从180天延长至210天，锁定原料成本',
                          '建议在华东新建区域分仓，降低末端配送成本约8%',
                          '引入柔性灌装线，SKU切换时间缩短40%',
                        ]}
                        renderItem={(item) => (
                          <List.Item
                            style={{ borderBottom: 'none', padding: '6px 0' }}
                          >
                            <Paragraph
                              type="secondary"
                              style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}
                            >
                              <span style={{ color: '#3B82F6' }}>▸</span> {item}
                            </Paragraph>
                          </List.Item>
                        )}
                      />
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      className="p-5 rounded-lg h-full"
                      style={{
                        background: 'rgba(16, 185, 129, 0.08)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                      }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ background: 'rgba(16, 185, 129, 0.2)' }}
                        >
                          <CheckCircleOutlined style={{ color: '#10B981' }} />
                        </div>
                        <Text strong style={{ color: '#10B981', fontSize: 15 }}>
                          质检重点推荐
                        </Text>
                      </div>
                      <List
                        size="small"
                        dataSource={[
                          '建议对川黔地区小酒厂开展专项抽检，本月酒精度不符风险上升',
                          '贴牌产品标签合规性专项检查，覆盖TOP20代工企业',
                          '夏季高温期重点监控仓储卫生指标，特别是华中地区仓群',
                          '新国标添加剂使用标准培训，覆盖全部规模以上酒企',
                          '建议将电商渠道退货批次纳入溯源分析，识别潜在质量问题',
                        ]}
                        renderItem={(item) => (
                          <List.Item
                            style={{ borderBottom: 'none', padding: '6px 0' }}
                          >
                            <Paragraph
                              type="secondary"
                              style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}
                            >
                              <span style={{ color: '#10B981' }}>▸</span> {item}
                            </Paragraph>
                          </List.Item>
                        )}
                      />
                    </div>
                  </Col>
                </Row>
              </Card>

              <div className="text-center pt-4">
                <Space>
                  <Button
                    size="large"
                    icon={<FilePdfOutlined />}
                    style={{ borderColor: '#D4A574', color: '#D4A574' }}
                  >
                    下载PDF版
                  </Button>
                  <Button
                    size="large"
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => setDrawerVisible(false)}
                  >
                    关闭报告
                  </Button>
                </Space>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
