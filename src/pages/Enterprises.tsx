import React, { useState } from 'react';
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Typography,
  Drawer,
  Row,
  Col,
  Input,
  Select,
  Descriptions,
  Timeline,
  List,
  Divider,
  Badge,
  Empty,
  Avatar,
  Statistic,
} from 'antd';
import type { TableProps } from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  ApartmentOutlined,
  EnvironmentOutlined,
  WifiOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined,
  AlertOutlined,
  DatabaseOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  DisconnectOutlined,
  UserOutlined,
  AppstoreOutlined,
  SettingOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

interface Enterprise {
  key: string;
  id: string;
  name: string;
  creditCode: string;
  legalPerson: string;
  province: string;
  city: string;
  productionScale: 'small' | 'medium' | 'large';
  mainProducts: string[];
  dataAccessStatus: 'connected' | 'partial' | 'disconnected';
  creditRating: 'A' | 'B' | 'C' | 'D';
  lastConnectionAt?: string;
  registeredAt: string;
  address: string;
  alertCount: number;
  dataItems: { name: string; status: 'normal' | 'warning' | 'off'; lastSync: string }[];
  alerts: { id: string; level: 1 | 2; title: string; time: string; status: string }[];
  timeline: { time: string; action: string; color: string }[];
}

const PROVINCES = [
  '北京市', '天津市', '河北省', '山西省', '内蒙古自治区',
  '辽宁省', '吉林省', '黑龙江省', '上海市', '江苏省',
  '浙江省', '安徽省', '福建省', '江西省', '山东省',
  '河南省', '湖北省', '湖南省', '广东省', '广西壮族自治区',
  '海南省', '重庆市', '四川省', '贵州省', '云南省',
  '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区',
  '新疆维吾尔自治区',
];

const PROVINCE_CITIES: Record<string, string[]> = {
  '四川省': ['成都市', '绵阳市', '德阳市', '宜宾市', '泸州市'],
  '贵州省': ['贵阳市', '遵义市', '六盘水市', '安顺市'],
  '江苏省': ['南京市', '苏州市', '无锡市', '徐州市', '常州市'],
  '山东省': ['济南市', '青岛市', '烟台市', '潍坊市', '临沂市'],
  '山西省': ['太原市', '临汾市', '吕梁市', '晋中市'],
  '安徽省': ['合肥市', '亳州市', '蚌埠市', '阜阳市'],
  '陕西省': ['西安市', '宝鸡市', '咸阳市'],
  '湖北省': ['武汉市', '宜昌市', '襄阳市'],
  '湖南省': ['长沙市', '常德市', '岳阳市'],
  '北京市': ['东城区', '西城区', '朝阳区', '海淀区', '丰台区'],
  '上海市': ['黄浦区', '徐汇区', '长宁区', '浦东新区', '闵行区'],
  '广东省': ['广州市', '深圳市', '佛山市', '东莞市'],
};

const BRAND_LIBRARY = [
  '茅台飞天', '五粮液', '国窖1573', '剑南春', '汾酒青花',
  '泸州老窖', '洋河梦之蓝', '郎酒青花郎', '古井贡酒', '西凤酒',
  '董酒', '酒鬼酒', '水井坊', '舍得', '习酒窖藏',
  '牛栏山', '红星二锅头', '黄鹤楼', '白云边', '口子窖',
];

const generateMockEnterprises = (): Enterprise[] => {
  const enterprises: Enterprise[] = [];
  const statuses: Enterprise['dataAccessStatus'][] = ['connected', 'partial', 'disconnected'];
  const ratings: Enterprise['creditRating'][] = ['A', 'A', 'A', 'B', 'B', 'C', 'D'];
  const scales: Enterprise['productionScale'][] = ['small', 'medium', 'large'];

  for (let i = 0; i < 56; i++) {
    const province = PROVINCES[i % PROVINCES.length];
    const cities = PROVINCE_CITIES[province] || ['市辖区'];
    const city = cities[i % cities.length];
    const status = statuses[i % statuses.length];
    const rating = ratings[i % ratings.length];
    const scale = scales[i % scales.length];
    const mainProducts = BRAND_LIBRARY.slice(i % 8, (i % 8) + 3);

    enterprises.push({
      key: `ent-${i + 1}`,
      id: `ENT${String(20240001 + i).padStart(8, '0')}`,
      name: [
        '贵州茅台股份有限公司',
        '宜宾五粮液集团有限公司',
        '泸州老窖股份有限公司',
        '山西杏花村汾酒厂',
        '四川郎酒集团有限责任公司',
        '江苏洋河酒厂股份有限公司',
      ][i % 6] + ` (${i + 1}号厂)`,
      creditCode: `91${['510000', '520000', '320000', '370000', '110000', '310000'][i % 6]}${String(100000 + i * 137).padStart(10, '0')}`,
      legalPerson: ['李保芳', '曾从钦', '刘淼', '谭忠豹', '汪俊林', '张联东'][i % 6],
      province,
      city,
      productionScale: scale,
      mainProducts,
      dataAccessStatus: status,
      creditRating: rating,
      lastConnectionAt: status !== 'disconnected'
        ? dayjs().subtract(i * 3, 'hour').subtract(i * 17, 'minute').format('YYYY-MM-DD HH:mm:ss')
        : dayjs().subtract(i + 3, 'day').format('YYYY-MM-DD HH:mm:ss'),
      registeredAt: dayjs().subtract(5 + i, 'year').format('YYYY-MM-DD'),
      address: `${province}${city}经济开发区xx路${100 + i}号`,
      alertCount: Math.floor(Math.random() * 8),
      dataItems: [
        { name: '生产数据接口', status: 'normal', lastSync: '2分钟前' },
        { name: '库存数据接口', status: status === 'disconnected' ? 'off' : (i % 3 === 0 ? 'warning' : 'normal'), lastSync: status === 'disconnected' ? '已离线' : '5分钟前' },
        { name: '销售数据接口', status: status === 'disconnected' ? 'off' : 'normal', lastSync: status === 'disconnected' ? '已离线' : '1分钟前' },
        { name: '质检数据接口', status: status === 'connected' ? 'normal' : (status === 'partial' ? 'warning' : 'off'), lastSync: status === 'disconnected' ? '已离线' : '10分钟前' },
        { name: '物流数据接口', status: status === 'connected' ? 'normal' : 'off', lastSync: status === 'connected' ? '3分钟前' : '已离线' },
      ],
      alerts: [
        { id: 'A1', level: 2, title: '库存积压超预警阈值23%', time: dayjs().subtract(i + 1, 'day').format('YYYY-MM-DD'), status: '处理中' },
        { id: 'A2', level: 1, title: '批次质量抽检不合格', time: dayjs().subtract(i + 5, 'day').format('YYYY-MM-DD'), status: '已处理' },
        { id: 'A3', level: 1, title: '产销率连续7天下滑', time: dayjs().subtract(i + 12, 'day').format('YYYY-MM-DD'), status: '已解除' },
      ],
      timeline: [
        { time: dayjs().subtract(i * 2, 'hour').format('MM-DD HH:mm'), action: '生产数据实时同步', color: 'green' },
        { time: dayjs().subtract(i + 1, 'day').format('MM-DD HH:mm'), action: '数据接入配置更新', color: 'blue' },
        { time: dayjs().subtract(i + 3, 'day').format('MM-DD HH:mm'), action: '企业信息变更审核通过', color: '#D4A574' },
        { time: dayjs().subtract(i + 10, 'day').format('MM-DD HH:mm'), action: '完成企业资质认证', color: 'purple' },
        { time: dayjs().subtract(i + 30, 'day').format('MM-DD HH:mm'), action: '企业注册申请提交', color: 'gray' },
      ],
    });
  }

  return enterprises;
};

export default function Enterprises() {
  const [allEnterprises] = useState<Enterprise[]>(generateMockEnterprises());
  const [filteredData, setFilteredData] = useState<Enterprise[]>(allEnterprises);
  const [selectedEnterprise, setSelectedEnterprise] = useState<Enterprise | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string | undefined>();
  const [selectedCity, setSelectedCity] = useState<string | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<Enterprise['dataAccessStatus'] | undefined>();
  const [selectedRating, setSelectedRating] = useState<Enterprise['creditRating'] | undefined>();
  const [searchText, setSearchText] = useState('');

  const applyFilters = (
    province?: string,
    city?: string,
    status?: Enterprise['dataAccessStatus'],
    rating?: Enterprise['creditRating'],
    search?: string
  ) => {
    let result = allEnterprises;
    if (province) result = result.filter((e) => e.province === province);
    if (city) result = result.filter((e) => e.city === city);
    if (status) result = result.filter((e) => e.dataAccessStatus === status);
    if (rating) result = result.filter((e) => e.creditRating === rating);
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(s) ||
          e.creditCode.toLowerCase().includes(s) ||
          e.legalPerson.toLowerCase().includes(s)
      );
    }
    setFilteredData(result);
  };

  const handleReset = () => {
    setSelectedProvince(undefined);
    setSelectedCity(undefined);
    setSelectedStatus(undefined);
    setSelectedRating(undefined);
    setSearchText('');
    setFilteredData(allEnterprises);
  };

  const handleViewDetail = (record: Enterprise) => {
    setSelectedEnterprise(record);
    setDrawerVisible(true);
  };

  const getStatusTag = (status: Enterprise['dataAccessStatus']) => {
    if (status === 'connected')
      return (
        <Tag color="success" icon={<WifiOutlined />}>
          已接入
        </Tag>
      );
    if (status === 'partial')
      return (
        <Tag color="warning" icon={<ExclamationCircleOutlined />}>
          部分接入
        </Tag>
      );
    return (
      <Tag color="default" icon={<DisconnectOutlined />}>
        未接入
      </Tag>
    );
  };

  const getRatingTag = (rating: Enterprise['creditRating']) => {
    const colors: Record<Enterprise['creditRating'], string> = {
      A: 'green',
      B: 'blue',
      C: 'gold',
      D: 'red',
    };
    return (
      <Tag
        color={colors[rating]}
        icon={<SafetyCertificateOutlined />}
        style={{ fontWeight: 'bold' }}
      >
        {rating}级
      </Tag>
    );
  };

  const getScaleTag = (scale: Enterprise['productionScale']) => {
    const map = { small: '小型', medium: '中型', large: '大型' };
    const colors: Record<Enterprise['productionScale'], string> = {
      small: 'default',
      medium: 'blue',
      large: 'purple',
    };
    return <Tag color={colors[scale]}>{map[scale]}</Tag>;
  };

  const columns: TableProps<Enterprise>['columns'] = [
    {
      title: '企业名称',
      dataIndex: 'name',
      key: 'name',
      width: 260,
      fixed: 'left' as const,
      render: (v: string, record) => (
        <Space>
          <Avatar
            icon={<ApartmentOutlined />}
            style={{
              backgroundColor: 'rgba(212, 165, 116, 0.2)',
              color: '#D4A574',
            }}
          />
          <div>
            <div>
              <Text strong style={{ color: '#F3F4F6' }}>{v}</Text>
            </div>
            <div className="text-xs text-gray-500">{record.id}</div>
          </div>
        </Space>
      ),
    },
    {
      title: '统一信用代码',
      dataIndex: 'creditCode',
      key: 'creditCode',
      width: 200,
      render: (v: string) => (
        <Text type="secondary" style={{ fontFamily: 'monospace', fontSize: 12 }}>
          {v}
        </Text>
      ),
    },
    {
      title: '法人代表',
      dataIndex: 'legalPerson',
      key: 'legalPerson',
      width: 100,
      render: (v: string) => (
        <Space>
          <UserOutlined style={{ color: '#6B7280' }} />
          <Text type="secondary">{v}</Text>
        </Space>
      ),
    },
    {
      title: '省份/城市',
      dataIndex: 'province',
      key: 'region',
      width: 160,
      render: (_: string, record) => (
        <Space direction="vertical" size={2}>
          <div>
            <EnvironmentOutlined style={{ color: '#6B7280' }} className="mr-1" />
            <Text type="secondary">{record.province}</Text>
          </div>
          <div style={{ paddingLeft: 18 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.city}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: '生产规模',
      dataIndex: 'productionScale',
      key: 'productionScale',
      width: 100,
      render: (v: Enterprise['productionScale']) => getScaleTag(v),
    },
    {
      title: '接入状态',
      dataIndex: 'dataAccessStatus',
      key: 'dataAccessStatus',
      width: 110,
      render: (v: Enterprise['dataAccessStatus']) => getStatusTag(v),
    },
    {
      title: '信用评级',
      dataIndex: 'creditRating',
      key: 'creditRating',
      width: 90,
      render: (v: Enterprise['creditRating']) => getRatingTag(v),
    },
    {
      title: '最后连接时间',
      dataIndex: 'lastConnectionAt',
      key: 'lastConnectionAt',
      width: 170,
      render: (v?: string) => (
        <Space size={4}>
          <ClockCircleOutlined style={{ color: '#6B7280', fontSize: 12 }} />
          <Text type="secondary" style={{ fontSize: 12 }}>{v || '-'}</Text>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right' as const,
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
          style={{ color: '#D4A574' }}
        >
          查看详情
        </Button>
      ),
    },
  ];

  const stats = {
    total: allEnterprises.length,
    connected: allEnterprises.filter((e) => e.dataAccessStatus === 'connected').length,
    partial: allEnterprises.filter((e) => e.dataAccessStatus === 'partial').length,
    disconnected: allEnterprises.filter((e) => e.dataAccessStatus === 'disconnected').length,
    ratingA: allEnterprises.filter((e) => e.creditRating === 'A').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Title level={3} style={{ color: '#F3F4F6', margin: 0 }}>
            企业数据管理
          </Title>
          <Text type="secondary">
            酒类生产企业名录 · 接入状态监控 · 信用评级管理
          </Text>
        </div>
        <Space>
          <Button icon={<AppstoreOutlined />}>批量导入</Button>
          <Button type="primary" icon={<SettingOutlined />}>
            新增企业
          </Button>
        </Space>
      </div>

      <Row gutter={16}>
        <Col span={5}>
          <Card size="small" className="border border-ink-border bg-gradient-card">
            <Statistic
              title={<span style={{ color: '#9CA3AF' }}>企业总数</span>}
              value={stats.total}
              suffix="家"
              valueStyle={{ color: '#D4A574' }}
              prefix={<ApartmentOutlined />}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card size="small" className="border border-ink-border bg-gradient-card">
            <Statistic
              title={<span style={{ color: '#9CA3AF' }}>已接入</span>}
              value={stats.connected}
              suffix="家"
              valueStyle={{ color: '#10B981' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card size="small" className="border border-ink-border bg-gradient-card">
            <Statistic
              title={<span style={{ color: '#9CA3AF' }}>部分接入</span>}
              value={stats.partial}
              suffix="家"
              valueStyle={{ color: '#F59E0B' }}
              prefix={<ExclamationCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card size="small" className="border border-ink-border bg-gradient-card">
            <Statistic
              title={<span style={{ color: '#9CA3AF' }}>未接入</span>}
              value={stats.disconnected}
              suffix="家"
              valueStyle={{ color: '#6B7280' }}
              prefix={<DisconnectOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small" className="border border-ink-border bg-gradient-card">
            <Statistic
              title={<span style={{ color: '#9CA3AF' }}>A级信用</span>}
              value={stats.ratingA}
              suffix="家"
              valueStyle={{ color: '#3B82F6' }}
              prefix={<SafetyCertificateOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card
        className="border border-ink-border bg-gradient-card shadow-card"
        styles={{ body: { padding: 16 } }}
      >
        <Row gutter={[16, 12]} align="middle">
          <Col span={5}>
            <Select
              placeholder="选择省份"
              style={{ width: '100%' }}
              allowClear
              value={selectedProvince}
              onChange={(v) => {
                setSelectedProvince(v);
                setSelectedCity(undefined);
                applyFilters(v, undefined, selectedStatus, selectedRating, searchText);
              }}
              showSearch
              optionFilterProp="label"
            >
              {PROVINCES.map((p) => (
                <Option key={p} value={p} label={p}>
                  {p}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={5}>
            <Select
              placeholder="选择城市"
              style={{ width: '100%' }}
              allowClear
              disabled={!selectedProvince}
              value={selectedCity}
              onChange={(v) => {
                setSelectedCity(v);
                applyFilters(selectedProvince, v, selectedStatus, selectedRating, searchText);
              }}
            >
              {(PROVINCE_CITIES[selectedProvince || ''] || []).map((c) => (
                <Option key={c} value={c}>
                  {c}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="接入状态"
              style={{ width: '100%' }}
              allowClear
              value={selectedStatus}
              onChange={(v) => {
                setSelectedStatus(v);
                applyFilters(selectedProvince, selectedCity, v, selectedRating, searchText);
              }}
            >
              <Option value="connected">已接入</Option>
              <Option value="partial">部分接入</Option>
              <Option value="disconnected">未接入</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="信用评级"
              style={{ width: '100%' }}
              allowClear
              value={selectedRating}
              onChange={(v) => {
                setSelectedRating(v);
                applyFilters(selectedProvince, selectedCity, selectedStatus, v, searchText);
              }}
            >
              <Option value="A">A级</Option>
              <Option value="B">B级</Option>
              <Option value="C">C级</Option>
              <Option value="D">D级</Option>
            </Select>
          </Col>
          <Col span={5}>
            <Search
              placeholder="搜索企业名称/代码/法人"
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={(v) =>
                applyFilters(selectedProvince, selectedCity, selectedStatus, selectedRating, v)
              }
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col span={1}>
            <Button onClick={handleReset}>重置</Button>
          </Col>
        </Row>
      </Card>

      <Card
        className="border border-ink-border bg-gradient-card shadow-card"
        styles={{ body: { padding: 0 } }}
        title={
          <Space>
            <Text style={{ color: '#F3F4F6' }}>
              <ApartmentOutlined className="mr-2" style={{ color: '#D4A574' }} />
              企业列表
            </Text>
            <Badge count={filteredData.length} color="#D4A574" showZero />
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredData}
          scroll={{ x: 1300, y: 520 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条数据`,
          }}
          rowClassName="hover:bg-gold-500/5"
          locale={{ emptyText: <Empty description="暂无符合条件的企业数据" /> }}
        />
      </Card>

      <Drawer
        title={null}
        placement="right"
        width={780}
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
        {selectedEnterprise && (
          <div className="min-h-screen">
            <div
              className="px-8 py-6"
              style={{
                background:
                  'linear-gradient(135deg, rgba(212,165,116,0.12) 0%, rgba(17,24,39,0.9) 100%)',
                borderBottom: '1px solid rgba(212,165,116,0.3)',
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar
                    size={64}
                    icon={<ApartmentOutlined style={{ fontSize: 28 }} />}
                    style={{
                      backgroundColor: 'rgba(212,165,116,0.2)',
                      color: '#D4A574',
                      border: '2px solid rgba(212,165,116,0.5)',
                    }}
                  />
                  <div>
                    <Title level={4} style={{ color: '#F3F4F6', margin: 0 }}>
                      {selectedEnterprise.name}
                    </Title>
                    <div className="mt-2">
                      <Space wrap>
                        {getStatusTag(selectedEnterprise.dataAccessStatus)}
                        {getRatingTag(selectedEnterprise.creditRating)}
                        {getScaleTag(selectedEnterprise.productionScale)}
                        <Tag style={{ fontFamily: 'monospace' }}>{selectedEnterprise.id}</Tag>
                      </Space>
                    </div>
                  </div>
                </div>
                <Space>
                  <Button icon={<DatabaseOutlined />}>数据配置</Button>
                  <Button type="primary" icon={<SettingOutlined />}>
                    编辑信息
                  </Button>
                </Space>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <Card
                className="border border-ink-border bg-gradient-card shadow-card"
                size="small"
                title={
                  <span style={{ color: '#F3F4F6' }}>
                    <ApartmentOutlined className="mr-2" style={{ color: '#D4A574' }} />
                    企业基本信息
                  </span>
                }
              >
                <Descriptions
                  column={2}
                  size="small"
                  labelStyle={{ color: '#9CA3AF', width: 120 }}
                  contentStyle={{ color: '#F3F4F6' }}
                  colon
                >
                  <Descriptions.Item label="统一信用代码">
                    <span style={{ fontFamily: 'monospace' }}>
                      {selectedEnterprise.creditCode}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="法人代表">
                    {selectedEnterprise.legalPerson}
                  </Descriptions.Item>
                  <Descriptions.Item label="所属省份">
                    {selectedEnterprise.province}
                  </Descriptions.Item>
                  <Descriptions.Item label="所属城市">
                    {selectedEnterprise.city}
                  </Descriptions.Item>
                  <Descriptions.Item label="注册地址" span={2}>
                    <EnvironmentOutlined className="mr-1" />
                    {selectedEnterprise.address}
                  </Descriptions.Item>
                  <Descriptions.Item label="注册日期">
                    {selectedEnterprise.registeredAt}
                  </Descriptions.Item>
                  <Descriptions.Item label="生产规模">
                    {getScaleTag(selectedEnterprise.productionScale)}
                  </Descriptions.Item>
                  <Descriptions.Item label="主要产品" span={2}>
                    <Space wrap>
                      {selectedEnterprise.mainProducts.map((p) => (
                        <Tag key={p} color="gold">
                          {p}
                        </Tag>
                      ))}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="最后连接时间" span={2}>
                    <ClockCircleOutlined className="mr-1" style={{ color: '#9CA3AF' }} />
                    {selectedEnterprise.lastConnectionAt}
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              <Row gutter={16}>
                <Col span={12}>
                  <Card
                    className="border border-ink-border bg-gradient-card shadow-card h-full"
                    size="small"
                    title={
                      <span style={{ color: '#F3F4F6' }}>
                        <HistoryOutlined className="mr-2" style={{ color: '#D4A574' }} />
                        接入状态时间线
                      </span>
                    }
                  >
                    <Timeline
                      mode="left"
                      items={selectedEnterprise.timeline.map((t) => ({
                        color: t.color,
                        children: (
                          <div>
                            <div style={{ color: '#F3F4F6', fontSize: 13 }}>{t.action}</div>
                            <div style={{ color: '#6B7280', fontSize: 11, marginTop: 2 }}>
                              {t.time}
                            </div>
                          </div>
                        ),
                      }))}
                    />
                  </Card>
                </Col>

                <Col span={12}>
                  <Card
                    className="border border-ink-border bg-gradient-card shadow-card h-full"
                    size="small"
                    title={
                      <Space>
                        <span style={{ color: '#F3F4F6' }}>
                          <AlertOutlined className="mr-2" style={{ color: '#EF4444' }} />
                          历史预警记录
                        </span>
                        <Badge
                          count={selectedEnterprise.alertCount}
                          color="#EF4444"
                          size="small"
                        />
                      </Space>
                    }
                  >
                    <List
                      size="small"
                      dataSource={selectedEnterprise.alerts}
                      renderItem={(item) => (
                        <List.Item
                          style={{
                            borderBottom: '1px solid #374151',
                            padding: '12px 4px',
                          }}
                        >
                          <Space align="start" style={{ width: '100%' }}>
                            <Tag
                              color={item.level === 2 ? 'red' : 'orange'}
                              style={{ marginTop: 2 }}
                            >
                              {item.level === 2 ? '二级' : '一级'}
                            </Tag>
                            <div style={{ flex: 1 }}>
                              <div style={{ color: '#F3F4F6', fontSize: 13 }}>
                                {item.title}
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  marginTop: 4,
                                }}
                              >
                                <span style={{ color: '#6B7280', fontSize: 11 }}>
                                  <ClockCircleOutlined className="mr-1" />
                                  {item.time}
                                </span>
                                <Tag
                                  color={
                                    item.status === '已解除'
                                      ? 'default'
                                      : item.status === '处理中'
                                      ? 'processing'
                                      : 'success'
                                  }
                                  style={{ margin: 0 }}
                                >
                                  {item.status}
                                </Tag>
                              </div>
                            </div>
                          </Space>
                        </List.Item>
                      )}
                    />
                  </Card>
                </Col>
              </Row>

              <Card
                className="border border-ink-border bg-gradient-card shadow-card"
                size="small"
                title={
                  <span style={{ color: '#F3F4F6' }}>
                    <DatabaseOutlined className="mr-2" style={{ color: '#D4A574' }} />
                    数据接入配置
                  </span>
                }
                extra={
                  <Button size="small" type="link" style={{ color: '#D4A574' }}>
                    查看配置详情
                  </Button>
                }
              >
                <List
                  grid={{ gutter: 12, xs: 1, sm: 2, md: 2, lg: 2, xl: 3, xxl: 3 }}
                  dataSource={selectedEnterprise.dataItems}
                  renderItem={(item) => (
                    <List.Item>
                      <div
                        className={cn(
                          'p-4 rounded-lg border transition-all',
                          item.status === 'normal'
                            ? 'bg-emerald-500/5 border-emerald-500/30'
                            : item.status === 'warning'
                            ? 'bg-amber-500/5 border-amber-500/30'
                            : 'bg-gray-500/5 border-gray-500/30'
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Text
                            strong
                            style={{
                              color:
                                item.status === 'normal'
                                  ? '#10B981'
                                  : item.status === 'warning'
                                  ? '#F59E0B'
                                  : '#6B7280',
                              fontSize: 13,
                            }}
                          >
                            {item.status === 'normal'
                              ? '运行正常'
                              : item.status === 'warning'
                              ? '同步延迟'
                              : '接口离线'}
                          </Text>
                          {item.status === 'normal' && (
                            <CheckCircleOutlined
                              style={{ color: '#10B981', fontSize: 16 }}
                            />
                          )}
                          {item.status === 'warning' && (
                            <ExclamationCircleOutlined
                              style={{ color: '#F59E0B', fontSize: 16 }}
                            />
                          )}
                          {item.status === 'off' && (
                            <DisconnectOutlined
                              style={{ color: '#6B7280', fontSize: 16 }}
                            />
                          )}
                        </div>
                        <div style={{ color: '#F3F4F6', marginBottom: 4 }}>
                          {item.name}
                        </div>
                        <div
                          style={{
                            color: '#6B7280',
                            fontSize: 11,
                          }}
                        >
                          <ClockCircleOutlined className="mr-1" />
                          {item.lastSync}
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </Card>

              <Divider style={{ borderColor: '#374151' }} />

              <div className="text-center">
                <Space>
                  <Button
                    icon={<AlertOutlined />}
                    style={{ borderColor: '#EF4444', color: '#EF4444' }}
                  >
                    发送预警通知
                  </Button>
                  <Button icon={<DatabaseOutlined />}>手动触发同步</Button>
                  <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => setDrawerVisible(false)}
                  >
                    关闭详情
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
