import React, { useState, useRef } from 'react';
import {
  Card,
  Upload,
  Button,
  Table,
  Space,
  Typography,
  Tag,
  message,
  Row,
  Col,
  Statistic,
  List,
  Divider,
} from 'antd';
import type { UploadProps } from 'antd';
import {
  UploadOutlined,
  DownloadOutlined,
  InboxOutlined,
  WarningOutlined,
  StockOutlined,
  RiseOutlined,
  BulbOutlined,
} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';

const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;

interface MonthlyTarget {
  key: string;
  month: string;
  brandName: string;
  alcoholDegree: number;
  targetOutput: number;
}

interface ForecastDay {
  date: string;
  predictedSales: number;
  lowerBound: number;
  upperBound: number;
  plannedProduction: number;
  inventoryLevel: number;
}

const BRAND_LIBRARY = [
  { name: '茅台飞天', degree: 53 },
  { name: '五粮液', degree: 52 },
  { name: '国窖1573', degree: 52 },
  { name: '剑南春', degree: 52 },
  { name: '汾酒青花', degree: 53 },
  { name: '泸州老窖', degree: 52 },
  { name: '洋河梦之蓝', degree: 52 },
  { name: '郎酒青花郎', degree: 53 },
];

const generateMockForecast = (): ForecastDay[] => {
  const data: ForecastDay[] = [];
  const today = dayjs();
  let inventory = 5000;

  for (let i = 30; i >= 1; i--) {
    const date = today.subtract(i, 'day');
    const baseSales = 4000 + Math.random() * 800;
    inventory = inventory + 4200 - baseSales;
    data.push({
      date: date.format('MM-DD'),
      predictedSales: Math.round(baseSales),
      lowerBound: Math.round(baseSales * 0.9),
      upperBound: Math.round(baseSales * 1.1),
      plannedProduction: 4200 + Math.round(Math.random() * 400),
      inventoryLevel: Math.max(0, Math.round(inventory)),
    });
  }

  for (let i = 0; i < 90; i++) {
    const date = today.add(i, 'day');
    const trendFactor = 1 + Math.sin(i / 30) * 0.1 + i * 0.002;
    const baseSales = (4200 + Math.random() * 600) * trendFactor;
    const production = 4400 + Math.round(Math.sin(i / 14) * 300);
    inventory = inventory + production - baseSales;
    data.push({
      date: date.format('MM-DD'),
      predictedSales: Math.round(baseSales),
      lowerBound: Math.round(baseSales * (0.85 + Math.random() * 0.05)),
      upperBound: Math.round(baseSales * (1.05 + Math.random() * 0.1)),
      plannedProduction: production,
      inventoryLevel: Math.max(0, Math.round(inventory)),
    });
  }

  return data;
};

const ForecastChart: React.FC<{ data: ForecastDay[] }> = ({ data }) => {
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
      data: ['历史销量', '预测销量', '计划产量', '库存水平'],
      textStyle: { color: '#9CA3AF' },
      top: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '12%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map((d) => d.date),
      axisLine: { lineStyle: { color: '#374151' } },
      axisLabel: { color: '#9CA3AF', interval: 14 },
      splitLine: { lineStyle: { color: 'rgba(55, 65, 81, 0.5)' } },
    },
    yAxis: [
      {
        type: 'value',
        name: '数量(千升)',
        nameTextStyle: { color: '#9CA3AF' },
        axisLine: { lineStyle: { color: '#374151' } },
        axisLabel: { color: '#9CA3AF' },
        splitLine: { lineStyle: { color: 'rgba(55, 65, 81, 0.5)' } },
      },
    ],
    series: [
      {
        name: '历史销量',
        type: 'line',
        smooth: true,
        data: data.slice(0, 30).map((d) => d.predictedSales),
        lineStyle: { color: '#3B82F6', width: 2 },
        itemStyle: { color: '#3B82F6' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.05)' },
            ],
          },
        },
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: { color: '#D4A574', type: 'dashed' },
          data: [{ xAxis: 29 }],
          label: { formatter: '今日', color: '#D4A574' },
        },
      },
      {
        name: '预测销量',
        type: 'line',
        smooth: true,
        data: [
          ...new Array(29).fill(null),
          data[29]?.predictedSales,
          ...data.slice(30).map((d) => d.predictedSales),
        ],
        lineStyle: { color: '#D4A574', width: 2, type: 'dashed' },
        itemStyle: { color: '#D4A574' },
      },
      {
        name: '预测区间',
        type: 'line',
        data: [
          ...new Array(29).fill(null),
          ...data.slice(29).map((d) => d.upperBound),
        ],
        lineStyle: { opacity: 0 },
        stack: 'confidence',
        symbol: 'none',
      },
      {
        name: '预测区间下限',
        type: 'line',
        data: [
          ...new Array(29).fill(null),
          ...data.slice(29).map((d) => d.lowerBound),
        ],
        lineStyle: { opacity: 0 },
        areaStyle: {
          color: 'rgba(212, 165, 116, 0.15)',
        },
        stack: 'confidence',
        symbol: 'none',
      },
      {
        name: '计划产量',
        type: 'bar',
        data: data.map((d) => d.plannedProduction),
        itemStyle: {
          color: 'rgba(16, 185, 129, 0.5)',
          borderRadius: [2, 2, 0, 0],
        },
        barWidth: 4,
      },
      {
        name: '库存水平',
        type: 'line',
        smooth: true,
        data: data.map((d) => d.inventoryLevel),
        lineStyle: { color: '#8B5CF6', width: 2 },
        itemStyle: { color: '#8B5CF6' },
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: 380, width: '100%' }}
      notMerge
    />
  );
};

const generateMockMonthlyTargets = (): MonthlyTarget[] => {
  const targets: MonthlyTarget[] = [];
  const months = ['01月', '02月', '03月', '04月', '05月', '06月'];
  months.forEach((month) => {
    BRAND_LIBRARY.slice(0, 4).forEach((brand, idx) => {
      targets.push({
        key: `${month}-${brand.name}`,
        month,
        brandName: brand.name,
        alcoholDegree: brand.degree,
        targetOutput: Math.round((500 + Math.random() * 1500) * (idx === 0 ? 2 : 1)),
      });
    });
  });
  return targets;
};

export default function ProductionPlan() {
  const [monthlyTargets, setMonthlyTargets] = useState<MonthlyTarget[]>(
    generateMockMonthlyTargets()
  );
  const [forecastData] = useState<ForecastDay[]>(generateMockForecast());
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileParse = (file: File) => {
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet) as Record<string, unknown>[];

        if (jsonData.length > 0) {
          const parsed: MonthlyTarget[] = jsonData.map((row, idx) => ({
            key: `imported-${idx}`,
            month: String(row['月份'] ?? row['month'] ?? '-'),
            brandName: String(row['品牌'] ?? row['brandName'] ?? '-'),
            alcoholDegree: Number(row['酒精度'] ?? row['alcoholDegree'] ?? 0),
            targetOutput: Number(row['目标产量'] ?? row['targetOutput'] ?? 0),
          }));
          setMonthlyTargets(parsed);
          message.success(`成功解析 ${parsed.length} 条月度产量目标`);
        } else {
          message.warning('Excel文件中未解析到有效数据');
        }
      } catch {
        message.error('Excel解析失败，请检查文件格式');
      } finally {
        setUploading(false);
      }
    };
    reader.readAsArrayBuffer(file);
    return false;
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.xlsx,.xls',
    showUploadList: false,
    beforeUpload: handleFileParse,
    customRequest: () => {},
  };

  const handleDownloadTemplate = () => {
    const wsData = [
      ['月份', '品牌', '酒精度', '目标产量(千升)'],
      ['01月', '茅台飞天', 53, 2500],
      ['01月', '五粮液', 52, 1800],
      ['02月', '茅台飞天', 53, 2200],
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '生产计划');
    XLSX.writeFile(wb, '生产计划模板.xlsx');
    message.success('模板下载成功');
  };

  const columns = [
    {
      title: '月份',
      dataIndex: 'month',
      key: 'month',
      width: 100,
      render: (v: string) => <Tag color="gold">{v}</Tag>,
    },
    {
      title: '品牌',
      dataIndex: 'brandName',
      key: 'brandName',
      render: (v: string) => <Text strong style={{ color: '#F3F4F6' }}>{v}</Text>,
    },
    {
      title: '酒精度',
      dataIndex: 'alcoholDegree',
      key: 'alcoholDegree',
      width: 120,
      render: (v: number) => <Text type="secondary">{v}%vol</Text>,
    },
    {
      title: '目标产量(千升)',
      dataIndex: 'targetOutput',
      key: 'targetOutput',
      width: 160,
      sorter: (a: MonthlyTarget, b: MonthlyTarget) => a.targetOutput - b.targetOutput,
      render: (v: number) => (
        <Text strong style={{ color: '#D4A574' }}>{v.toLocaleString()}</Text>
      ),
    },
  ];

  const totalTarget = monthlyTargets.reduce((s, t) => s + t.targetOutput, 0);
  const avgMonthly = Math.round(totalTarget / 6);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Title level={3} style={{ color: '#F3F4F6', margin: 0 }}>
            生产计划管理
          </Title>
          <Text type="secondary">上传年度计划 · 智能预测90天供需 · 库存策略优化</Text>
        </div>
        <Space>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleDownloadTemplate}
            style={{ borderColor: '#D4A574', color: '#D4A574' }}
          >
            下载模板
          </Button>
        </Space>
      </div>

      <Card
        className={cn(
          'border border-ink-border bg-gradient-card shadow-card',
          'hover:shadow-gold transition-all duration-300'
        )}
        styles={{ body: { padding: '24px' } }}
      >
        <div className="mb-4">
          <Text strong style={{ color: '#F3F4F6', fontSize: 16 }}>
            <UploadOutlined className="mr-2" style={{ color: '#D4A574' }} />
            生产计划Excel上传
          </Text>
        </div>
        <Dragger
          {...uploadProps}
          className="!border-dashed !bg-ink-surface/30"
          style={{
            borderColor: 'rgba(212, 165, 116, 0.4)',
          }}
          name="file"
          accept=".xlsx,.xls"
          beforeUpload={handleFileParse}
          showUploadList={false}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined style={{ color: '#D4A574', fontSize: 48 }} />
          </p>
          <p className="ant-upload-text" style={{ color: '#F3F4F6' }}>
            点击或拖拽生产计划Excel到此区域上传
          </p>
          <p className="ant-upload-hint" style={{ color: '#6B7280' }}>
            支持 .xlsx / .xls 格式，包含月份、品牌、酒精度、目标产量列
          </p>
        </Dragger>

        <Row gutter={16} className="mt-6">
          <Col span={8}>
            <Card size="small" className="bg-ink-surface/50 border-ink-border">
              <Statistic
                title={<span style={{ color: '#9CA3AF' }}>提取目标总数</span>}
                value={monthlyTargets.length}
                suffix="条"
                valueStyle={{ color: '#D4A574' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" className="bg-ink-surface/50 border-ink-border">
              <Statistic
                title={<span style={{ color: '#9CA3AF' }}>半年目标产量</span>}
                value={totalTarget}
                suffix="千升"
                valueStyle={{ color: '#10B981' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" className="bg-ink-surface/50 border-ink-border">
              <Statistic
                title={<span style={{ color: '#9CA3AF' }}>月均产量</span>}
                value={avgMonthly}
                suffix="千升"
                valueStyle={{ color: '#3B82F6' }}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      <Card
        className="border border-ink-border bg-gradient-card shadow-card"
        title={
          <span style={{ color: '#F3F4F6' }}>
            <StockOutlined className="mr-2" style={{ color: '#D4A574' }} />
            月度产量目标
          </span>
        }
      >
        <Table
          columns={columns}
          dataSource={monthlyTargets}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          scroll={{ y: 320 }}
          rowClassName="hover:bg-gold-500/5"
        />
      </Card>

      <Card
        className="border border-ink-border bg-gradient-card shadow-card"
        title={
          <span style={{ color: '#F3F4F6' }}>
            <RiseOutlined className="mr-2" style={{ color: '#D4A574' }} />
            90天销量预测与供需分析
          </span>
        }
        extra={<Tag color="blue">历史30天 + 未来90天</Tag>}
      >
        <ForecastChart data={forecastData} />
      </Card>

      <Row gutter={16}>
        <Col span={12}>
          <Card
            className="border border-ink-border bg-gradient-card shadow-card h-full"
            title={
              <span style={{ color: '#F3F4F6' }}>
                <WarningOutlined className="mr-2" style={{ color: '#F59E0B' }} />
                市场缺口分析
              </span>
            }
          >
            <Row gutter={16} className="mb-4">
              <Col span={12}>
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                  <div className="text-xs text-red-400 mb-1">预测缺口量</div>
                  <div className="text-2xl font-bold text-red-400">
                    -12,580 <span className="text-sm font-normal">千升</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">供大于求</div>
                </div>
              </Col>
              <Col span={12}>
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <div className="text-xs text-emerald-400 mb-1">预计平衡日期</div>
                  <div className="text-2xl font-bold text-emerald-400">
                    {dayjs().add(45, 'day').format('YYYY-MM-DD')}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">约6.5周后</div>
                </div>
              </Col>
            </Row>
            <Divider style={{ borderColor: '#374151', margin: '12px 0' }} />
            <Paragraph type="secondary" style={{ marginBottom: 8 }}>
              分析摘要：
            </Paragraph>
            <List
              size="small"
              dataSource={[
                '未来30天内高端白酒市场预计出现12.6%供给过剩',
                '中端白酒需求平稳，建议维持现有生产节奏',
                '9月中秋旺季前需在7月底前完成补库计划',
                '茅台、五粮液等头部品牌库存周转偏慢，建议适度控量',
              ]}
              renderItem={(item) => (
                <List.Item style={{ borderBottom: 'none', padding: '4px 0' }}>
                  <Text type="secondary">
                    <span style={{ color: '#D4A574' }}>•</span> {item}
                  </Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card
            className="border border-ink-border bg-gradient-card shadow-card h-full"
            title={
              <span style={{ color: '#F3F4F6' }}>
                <BulbOutlined className="mr-2" style={{ color: '#D4A574' }} />
                智能库存策略推荐
              </span>
            }
          >
            <Row gutter={12} className="mb-4">
              <Col span={6}>
                <div className="text-center p-3 rounded-lg bg-ink-surface/60">
                  <div className="text-xs text-gray-400 mb-1">安全天数</div>
                  <div className="text-xl font-bold" style={{ color: '#D4A574' }}>
                    28<span className="text-xs">天</span>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div className="text-center p-3 rounded-lg bg-ink-surface/60">
                  <div className="text-xs text-gray-400 mb-1">补货点</div>
                  <div className="text-xl font-bold text-blue-400">
                    3,800<span className="text-xs">千升</span>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div className="text-center p-3 rounded-lg bg-ink-surface/60">
                  <div className="text-xs text-gray-400 mb-1">补货量</div>
                  <div className="text-xl font-bold text-emerald-400">
                    5,200<span className="text-xs">千升</span>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div className="text-center p-3 rounded-lg bg-ink-surface/60">
                  <div className="text-xs text-gray-400 mb-1">周转率</div>
                  <div className="text-xl font-bold text-purple-400">
                    12.4<span className="text-xs">次/年</span>
                  </div>
                </div>
              </Col>
            </Row>
            <Divider style={{ borderColor: '#374151', margin: '12px 0' }} />
            <div className="text-xs text-gray-400 mb-2">周转优化建议</div>
            <List
              size="small"
              bordered
              style={{
                borderColor: '#374151',
                background: 'rgba(17, 24, 39, 0.3)',
              }}
              dataSource={[
                { priority: '高', text: '优化SKU结构，停产2款低效产品释放产能' },
                { priority: '高', text: '与经销商签订淡旺季动态备货协议' },
                { priority: '中', text: '引入JIT配送模式降低区域仓库存水位15%' },
                { priority: '中', text: '建立跨区域调拨机制平衡南北供需差异' },
                { priority: '低', text: 'Q3末启动节前促销活动加速库存消化' },
              ]}
              renderItem={(item) => (
                <List.Item
                  style={{ borderBottomColor: '#374151', padding: '8px 12px' }}
                >
                  <Space>
                    <Tag
                      color={
                        item.priority === '高'
                          ? 'red'
                          : item.priority === '中'
                          ? 'gold'
                          : 'default'
                      }
                      style={{ marginRight: 8 }}
                    >
                      {item.priority}优先级
                    </Tag>
                    <Text type="secondary">{item.text}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
