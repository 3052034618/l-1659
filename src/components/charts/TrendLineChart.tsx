import { useMemo, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

export interface TrendSeries {
  name: string;
  data: number[];
  color: string;
  confidence?: [number[], number[]];
}

interface TrendLineChartProps {
  xData: string[];
  series: TrendSeries[];
  areaFill?: boolean;
  height?: number | string;
  title?: string;
}

const BG_COLOR = '#1E293B';
const TEXT_COLOR = '#E5E7EB';
const GOLD_COLOR = '#D4A574';
const TOOLTIP_BG = 'rgba(30, 41, 59, 0.92)';
const AXIS_LINE = 'rgba(229, 231, 235, 0.15)';
const SPLIT_LINE = 'rgba(229, 231, 235, 0.06)';
const GRID_COLOR = 'rgba(212, 165, 116, 0.25)';

export default function TrendLineChart({
  xData,
  series,
  areaFill = true,
  height = 320,
  title = '趋势分析',
}: TrendLineChartProps) {
  const [range, setRange] = useState<'7d' | '30d' | 'all'>('all');

  const slicedX = useMemo(() => {
    if (range === '7d') return xData.slice(-7);
    if (range === '30d') return xData.slice(-30);
    return xData;
  }, [xData, range]);

  const slicedSeries = useMemo(() => {
    const n = range === '7d' ? 7 : range === '30d' ? 30 : xData.length;
    return series.map((s) => ({
      ...s,
      data: s.data.slice(-n),
      confidence: s.confidence
        ? [s.confidence[0].slice(-n), s.confidence[1].slice(-n)]
        : undefined,
    }));
  }, [series, range, xData.length]);

  const option: EChartsOption = useMemo(() => {
    const mainSeries: any[] = [];
    const bandSeries: any[] = [];

    slicedSeries.forEach((s, idx) => {
      if (s.confidence) {
        const [lower, upper] = s.confidence;
        const baseColor = s.color;
        bandSeries.push({
          name: `${s.name}区间下限`,
          type: 'line',
          data: lower,
          stack: `confidence-${idx}`,
          lineStyle: { opacity: 0 },
          symbol: 'none',
          z: 1,
        });
        bandSeries.push({
          name: `${s.name}置信区间`,
          type: 'line',
          data: upper.map((v, i) => v - (lower[i] || 0)),
          stack: `confidence-${idx}`,
          lineStyle: { opacity: 0 },
          symbol: 'none',
          areaStyle: {
            color: baseColor + '22',
          },
          z: 1,
        });
      }

      mainSeries.push({
        name: s.name,
        type: 'line',
        data: s.data,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        showSymbol: false,
        lineStyle: {
          width: 2.5,
          color: s.color,
          shadowColor: s.color + '66',
          shadowBlur: 8,
          shadowOffsetY: 3,
        },
        itemStyle: {
          color: s.color,
          borderColor: BG_COLOR,
          borderWidth: 2,
        },
        emphasis: {
          focus: 'series',
          scale: 1.3,
          itemStyle: {
            shadowBlur: 16,
            shadowColor: s.color,
          },
        },
        areaStyle: areaFill
          ? {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: s.color + '55' },
                  { offset: 1, color: s.color + '03' },
                ],
              },
            }
          : undefined,
        z: 2,
      });
    });

    return {
      backgroundColor: BG_COLOR,
      title: {
        text: title,
        left: 16,
        top: 14,
        textStyle: {
          color: TEXT_COLOR,
          fontSize: 15,
          fontWeight: 600,
        },
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: TOOLTIP_BG,
        borderColor: GOLD_COLOR,
        borderWidth: 1,
        textStyle: { color: TEXT_COLOR, fontSize: 13 },
        padding: [10, 14],
        axisPointer: {
          type: 'cross',
          lineStyle: { color: GRID_COLOR, type: 'dashed' },
          label: { backgroundColor: TOOLTIP_BG, color: TEXT_COLOR },
        },
      },
      legend: {
        top: 14,
        right: 120,
        icon: 'roundRect',
        itemWidth: 14,
        itemHeight: 6,
        itemGap: 16,
        textStyle: { color: TEXT_COLOR, fontSize: 12 },
      },
      grid: {
        top: 64,
        left: 48,
        right: 24,
        bottom: 44,
      },
      xAxis: {
        type: 'category',
        data: slicedX,
        boundaryGap: false,
        axisLine: { lineStyle: { color: AXIS_LINE } },
        axisTick: { show: false },
        axisLabel: {
          color: 'rgba(229, 231, 235, 0.65)',
          fontSize: 11,
          margin: 10,
        },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: 'rgba(229, 231, 235, 0.65)',
          fontSize: 11,
          margin: 10,
        },
        splitLine: { lineStyle: { color: SPLIT_LINE, type: 'dashed' } },
      },
      dataZoom: slicedX.length > 15 ? [
        {
          type: 'inside',
          start: 0,
          end: 100,
        },
        {
          type: 'slider',
          height: 20,
          bottom: 8,
          borderColor: 'transparent',
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          fillerColor: GOLD_COLOR + '33',
          handleStyle: { color: GOLD_COLOR, borderColor: BG_COLOR },
          textStyle: { color: TEXT_COLOR, fontSize: 10 },
        },
      ] : undefined,
      series: [...bandSeries, ...mainSeries],
    } as EChartsOption;
  }, [slicedX, slicedSeries, areaFill, title]);

  const ranges = [
    { key: '7d' as const, label: '近7天' },
    { key: '30d' as const, label: '近30天' },
    { key: 'all' as const, label: '全部' },
  ];

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height,
        background: BG_COLOR,
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid rgba(212, 165, 116, 0.15)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 16,
          zIndex: 10,
          display: 'flex',
          gap: 4,
          padding: 3,
          background: 'rgba(15, 23, 42, 0.6)',
          borderRadius: 8,
          border: '1px solid rgba(212, 165, 116, 0.2)',
        }}
      >
        {ranges.map((r) => {
          const active = range === r.key;
          return (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              style={{
                padding: '4px 10px',
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: active ? 600 : 400,
                transition: 'all 0.2s ease',
                background: active ? GOLD_COLOR : 'transparent',
                color: active ? '#0F172A' : TEXT_COLOR,
              }}
            >
              {r.label}
            </button>
          );
        })}
      </div>

      <ReactECharts
        option={option}
        style={{ width: '100%', height: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
}
