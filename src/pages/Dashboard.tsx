import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Drawer, Segmented, Tooltip } from 'antd';
import {
  LayoutDashboard,
  Calendar,
  RefreshCw,
  Factory,
  ShoppingCart,
  TrendingUp,
  Package,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Building2,
  BarChart3,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import KPICard from '@/components/common/KPICard';
import ChinaHeatMap from '@/components/charts/ChinaHeatMap';
import QualityRankList from '@/components/charts/QualityRankList';
import TrendLineChart from '@/components/charts/TrendLineChart';
import DataStream from '@/components/common/DataStream';
import QualityPieChart from '@/components/charts/QualityPieChart';
import GoldCard from '@/components/common/GoldCard';
import StatusTag from '@/components/common/StatusTag';
import { useAuth } from '@/router';
import {
  generateKPI,
  generateProvinceData,
  generateQualityRank,
  generateTrendData,
  generateDataStream,
  generateProvinceDetail,
} from '@/utils/mock';

type MapDimension = 'sales' | 'production' | 'quality';

const iconMap: Record<string, LucideIcon> = {
  Factory,
  ShoppingCart,
  TrendingUp,
  Package,
  ShieldCheck,
  AlertTriangle,
};

const cardBgStyle = {
  background: 'rgba(30, 41, 59, 0.4)',
  border: '1px solid rgba(212, 165, 116, 0.15)',
};

export default function Dashboard() {
  const { user, logout, isLoggedIn } = useAuth();

  const [mapDimension, setMapDimension] = useState<MapDimension>('sales');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const kpiData = useMemo(() => generateKPI(), []);
  const provinceRawData = useMemo(() => generateProvinceData(), []);
  const qualityRank = useMemo(() => generateQualityRank(), []);
  const trendData = useMemo(() => generateTrendData(7), []);
  const _streamData = useMemo(() => generateDataStream(15), []);

  const heatmapData = useMemo(() => {
    return provinceRawData.map((p: any) => ({
      code: p.code,
      name: p.name,
      sales: typeof p.sales === 'object' ? p.sales.value : p.sales,
      production: typeof p.production === 'object' ? p.production.value : p.production,
      quality:
        typeof p.qualityPassRate === 'object'
          ? p.qualityPassRate.value
          : parseFloat(p.qualityPassRate ?? 95),
    }));
  }, [provinceRawData]);

  const qualityRankAdapted = useMemo(() => {
    return qualityRank.map((b: any) => ({
      rank: b.rank,
      name: b.name,
      score: typeof b.score === 'string' ? parseFloat(b.score) : b.score,
    }));
  }, [qualityRank]);

  const provinceDetail = useMemo(
    () => (selectedProvince ? generateProvinceDetail(selectedProvince) : null),
    [selectedProvince]
  );

  const provinceTrend = useMemo(
    () => (selectedProvince ? generateTrendData(7) : null),
    [selectedProvince]
  );

  useEffect(() => {
    if (!autoRefresh) return;
    const timer = setInterval(() => {
      generateDataStream(1);
    }, 5000);
    return () => clearInterval(timer);
  }, [autoRefresh]);

  const handleProvinceClick = (code: string) => {
    const province = provinceRawData.find((p: any) => p.code === code);
    setSelectedProvince(province?.name || code);
    setDrawerOpen(true);
  };

  const todayStr = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const kpiIcon = (iconKey: string) => iconMap[iconKey] || Factory;

  const drawerStatCards = provinceDetail
    ? [
        {
          label: '总产量',
          value: provinceDetail.production,
          unit: '万吨',
          color: '#3B82F6',
        },
        {
          label: '总销量',
          value: provinceDetail.sales,
          unit: '万吨',
          color: '#8B5CF6',
        },
        {
          label: '质量合格率',
          value: provinceDetail.qualityRate,
          unit: '%',
          color: '#10B981',
        },
        {
          label: '接入企业数',
          value: provinceDetail.enterprises,
          unit: '家',
          color: '#F59E0B',
        },
      ]
    : [];

  return (
    <div className="min-h-full" style={{ background: 'transparent', color: '#F3F4F6' }}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 flex items-center justify-between"
      >
        <div>
          <div
            className="mb-2 flex items-center gap-2 text-sm"
            style={{ color: '#9CA3AF' }}
          >
            <span>首页</span>
            <span className="opacity-40">/</span>
            <span style={{ color: '#F3F4F6' }} className="font-medium">
              核心看板
            </span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <LayoutDashboard
                className="w-6 h-6"
                style={{ color: '#D4A574' }}
              />
              监管驾驶舱
            </h1>
            <StatusTag status="connected" size="sm">
              <Calendar className="w-3 h-3 mr-1" />
              {todayStr}
            </StatusTag>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Tooltip title={autoRefresh ? '自动刷新中' : '已暂停'}>
            <button
              onClick={() => setAutoRefresh((v) => !v)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border"
              style={{
                background: autoRefresh
                  ? 'rgba(16, 185, 129, 0.1)'
                  : 'rgba(30, 41, 59, 0.4)',
                color: autoRefresh ? '#34D399' : '#9CA3AF',
                borderColor: autoRefresh
                  ? 'rgba(16, 185, 129, 0.25)'
                  : 'rgba(212, 165, 116, 0.15)',
              }}
            >
              <RefreshCw
                className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`}
              />
              {autoRefresh ? '自动刷新中' : '已暂停'}
            </button>
          </Tooltip>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6"
      >
        {kpiData.map((kpi: any, idx: number) => (
          <motion.div
            key={kpi.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12 + idx * 0.05 }}
          >
            <KPICard
              title={kpi.label}
              value={parseFloat(kpi.value)}
              unit={kpi.unit}
              trend={kpi.trend}
              trendLabel="同比"
              icon={kpiIcon(kpi.icon)}
              decimals={kpi.unit === '%' ? 1 : 0}
            />
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="lg:col-span-2"
        >
          <GoldCard
            title={
              <div className="flex items-center gap-2">
                <MapPin
                  className="w-4 h-4"
                  style={{ color: '#D4A574' }}
                />
                <span>全国产销分布</span>
              </div>
            }
            extra={
              <Segmented
                value={mapDimension}
                onChange={(v) => setMapDimension(v as MapDimension)}
                size="small"
                options={[
                  {
                    label: (
                      <span className="flex items-center gap-1.5">
                        <ShoppingCart className="w-3.5 h-3.5" />
                        销量
                      </span>
                    ),
                    value: 'sales',
                  },
                  {
                    label: (
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        产量
                      </span>
                    ),
                    value: 'production',
                  },
                  {
                    label: (
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        合格率
                      </span>
                    ),
                    value: 'quality',
                  },
                ]}
              />
            }
            padding="none"
            className="!shadow-none"
          >
            <div style={{ padding: 0 }}>
              <ChinaHeatMap
                data={heatmapData}
                dimension={mapDimension}
                onProvinceClick={handleProvinceClick}
                height={500}
              />
            </div>
          </GoldCard>
        </motion.div>

        <div className="flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <QualityRankList
              brands={qualityRankAdapted}
              height={340}
              title="品牌质量排名 TOP10"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
          >
            <div style={cardBgStyle} className="rounded-2xl overflow-hidden">
              <TrendLineChart
                xData={trendData.dates}
                series={[
                  { name: '产销率', data: trendData.rate, color: '#10B981' },
                ]}
                areaFill={true}
                height={220}
                title="全国产销率近7天趋势"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <GoldCard
          title={
            <div className="flex items-center gap-2">
              <BarChart3
                className="w-4 h-4"
                style={{ color: '#D4A574' }}
              />
              <span>实时数据流</span>
            </div>
          }
          padding="none"
          className="!shadow-none"
        >
          <div style={{ height: 380, padding: 16 }}>
            <DataStream
              maxItems={15}
              interval={autoRefresh ? 5000 : 0}
              autoScroll={true}
            />
          </div>
        </GoldCard>
      </motion.div>

      <Drawer
        title={
          <div className="flex items-center gap-3 -ml-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background:
                  'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))',
                border: '1px solid rgba(59, 130, 246, 0.3)',
              }}
            >
              <MapPin className="w-5 h-5" style={{ color: '#60A5FA' }} />
            </div>
            <div>
              <div className="font-bold text-lg" style={{ color: '#F3F4F6' }}>
                {selectedProvince || ''} · 详情报告
              </div>
              <div className="text-xs" style={{ color: '#9CA3AF' }}>
                省级监管数据透视
              </div>
            </div>
          </div>
        }
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={560}
        destroyOnClose
        styles={{
          header: {
            padding: '20px 24px',
            borderBottom: '1px solid rgba(212, 165, 116, 0.12)',
            background: 'rgba(15, 23, 42, 0.9)',
          },
          body: {
            padding: '20px 24px',
            background:
              'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
          },
          mask: {
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
          },
          content: {
            background: 'rgba(15, 23, 42, 0.98)',
            borderLeft: '1px solid rgba(212, 165, 116, 0.15)',
          },
        }}
      >
        {provinceDetail && (
          <div className="space-y-5" style={{ color: '#F3F4F6' }}>
            <div className="grid grid-cols-2 gap-3">
              {drawerStatCards.map((stat, idx) => (
                <div
                  key={idx}
                  className="rounded-xl p-4"
                  style={{
                    background: 'rgba(30, 41, 59, 0.6)',
                    border: `1px solid ${stat.color}20`,
                  }}
                >
                  <div
                    className="text-xs font-medium mb-1.5"
                    style={{ color: '#9CA3AF' }}
                  >
                    {stat.label}
                  </div>
                  <div
                    className="text-2xl font-bold flex items-baseline gap-1"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                    <span
                      className="text-xs font-normal"
                      style={{ color: '#9CA3AF' }}
                    >
                      {stat.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="rounded-xl pt-2"
              style={{
                borderTop: '1px solid rgba(212, 165, 116, 0.1)',
              }}
            />

            <div>
              <div className="flex items-center justify-between mb-3">
                <h4
                  className="font-semibold flex items-center gap-2 text-sm"
                  style={{ color: '#F3F4F6' }}
                >
                  <TrendingUp
                    className="w-4 h-4"
                    style={{ color: '#3B82F6' }}
                  />
                  近 7 天销量/产量趋势
                </h4>
              </div>
              <div
                style={cardBgStyle}
                className="rounded-xl overflow-hidden"
              >
                {provinceTrend && (
                  <TrendLineChart
                    xData={provinceTrend.dates}
                    series={[
                      {
                        name: '销量',
                        data: provinceTrend.sales,
                        color: '#3B82F6',
                      },
                      {
                        name: '产量',
                        data: provinceTrend.production,
                        color: '#F59E0B',
                      },
                    ]}
                    height={200}
                    title=""
                  />
                )}
              </div>
            </div>

            <div>
              <h4
                className="font-semibold flex items-center gap-2 text-sm mb-3"
                style={{ color: '#F3F4F6' }}
              >
                <Sparkles
                  className="w-4 h-4"
                  style={{ color: '#F472B6' }}
                />
                质量问题分布
              </h4>
              <div
                style={cardBgStyle}
                className="rounded-xl overflow-hidden"
              >
                <QualityPieChart
                  data={provinceDetail.qualityDistribution}
                  height={240}
                  title=""
                />
              </div>
            </div>

            <div>
              <h4
                className="font-semibold flex items-center gap-2 text-sm mb-3"
                style={{ color: '#F3F4F6' }}
              >
                <Building2
                  className="w-4 h-4"
                  style={{ color: '#F59E0B' }}
                />
                地市概览
              </h4>
              <div
                className="max-h-[320px] overflow-y-auto pr-1 space-y-2"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#334155 transparent',
                }}
              >
                {provinceDetail.cities.map((c: any, idx: number) => {
                  const rate = parseFloat(c.qualityRate);
                  const status:
                    | 'approved'
                    | 'processing'
                    | 'pending' =
                    rate >= 98
                      ? 'approved'
                      : rate >= 95
                      ? 'processing'
                      : 'pending';
                  return (
                    <div
                      key={idx}
                      className="rounded-xl p-4 transition-all cursor-pointer"
                      style={{
                        background: 'rgba(30, 41, 59, 0.4)',
                        border: '1px solid rgba(212, 165, 116, 0.1)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          'rgba(30, 41, 59, 0.7)';
                        e.currentTarget.style.borderColor =
                          'rgba(212, 165, 116, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          'rgba(30, 41, 59, 0.4)';
                        e.currentTarget.style.borderColor =
                          'rgba(212, 165, 116, 0.1)';
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
                            style={{
                              background: 'rgba(212, 165, 116, 0.1)',
                              color: '#D4A574',
                            }}
                          >
                            {idx + 1}
                          </span>
                          <span
                            className="font-semibold"
                            style={{ color: '#F3F4F6' }}
                          >
                            {c.name}市
                          </span>
                        </div>
                        <StatusTag status={status} size="sm">
                          合格率 {c.qualityRate}%
                        </StatusTag>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <div
                            className="text-[11px] mb-0.5"
                            style={{ color: '#9CA3AF' }}
                          >
                            产量
                          </div>
                          <div
                            className="text-sm font-semibold flex items-baseline gap-0.5"
                            style={{ color: '#60A5FA' }}
                          >
                            {c.production}
                            <span
                              className="text-[10px] font-normal"
                              style={{ color: '#9CA3AF' }}
                            >
                              万吨
                            </span>
                          </div>
                        </div>
                        <div>
                          <div
                            className="text-[11px] mb-0.5"
                            style={{ color: '#9CA3AF' }}
                          >
                            销量
                          </div>
                          <div
                            className="text-sm font-semibold flex items-baseline gap-0.5"
                            style={{ color: '#C084FC' }}
                          >
                            {c.sales}
                            <span
                              className="text-[10px] font-normal"
                              style={{ color: '#9CA3AF' }}
                            >
                              万吨
                            </span>
                          </div>
                        </div>
                        <div>
                          <div
                            className="text-[11px] mb-0.5"
                            style={{ color: '#9CA3AF' }}
                          >
                            产销率
                          </div>
                          <div
                            className="text-sm font-semibold flex items-baseline gap-0.5"
                            style={{ color: '#34D399' }}
                          >
                            {c.production > 0
                              ? ((c.sales / c.production) * 100).toFixed(1)
                              : 0}
                            <span
                              className="text-[10px] font-normal"
                              style={{ color: '#9CA3AF' }}
                            >
                              %
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
