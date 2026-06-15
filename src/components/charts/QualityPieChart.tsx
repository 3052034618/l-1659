import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

export interface QualityIssue {
  name: string;
  value: number;
  color?: string;
}

interface QualityPieChartProps {
  data: QualityIssue[];
  height?: number | string;
  title?: string;
}

const BG_COLOR = '#1E293B';
const TEXT_COLOR = '#E5E7EB';
const GOLD_COLOR = '#D4A574';
const TOOLTIP_BG = 'rgba(30, 41, 59, 0.92)';

const DEFAULT_COLORS = ['#EF4444', '#F59E0B', '#3B82F6', '#10B981', '#8B5CF6'];

export default function QualityPieChart({
  data,
  height = 320,
  title = '质量问题分布',
}: QualityPieChartProps) {
  const total = useMemo(() => data.reduce((sum, d) => sum + d.value, 0), [data]);

  const option: EChartsOption = useMemo(() => {
    const pieData = data.map((d, i) => ({
      name: d.name,
      value: d.value,
      itemStyle: {
        color: d.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length],
        borderColor: BG_COLOR,
        borderWidth: 3,
      },
    }));

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
        trigger: 'item',
        backgroundColor: TOOLTIP_BG,
        borderColor: GOLD_COLOR,
        borderWidth: 1,
        textStyle: { color: TEXT_COLOR, fontSize: 13 },
        padding: [10, 14],
        formatter: (params: any) => {
          const pct = total > 0 ? ((params.value / total) * 100).toFixed(1) : '0';
          return `<div style="font-weight:600;margin-bottom:4px;color:${params.color}">${params.name}</div>
            <div>数量：<b style="color:${GOLD_COLOR}">${params.value}</b></div>
            <div>占比：<b style="color:${GOLD_COLOR}">${pct}%</b></div>`;
        },
      },
      legend: {
        orient: 'vertical',
        left: 16,
        bottom: 16,
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 10,
        textStyle: {
          color: 'rgba(229, 231, 235, 0.8)',
          fontSize: 12,
        },
        formatter: (name: string) => {
          const item = data.find((d) => d.name === name);
          if (!item || total <= 0) return name;
          const pct = ((item.value / total) * 100).toFixed(1);
          return `${name}  ${pct}%`;
        },
      },
      graphic: [
        {
          type: 'text',
          left: 'center',
          top: '42%',
          style: {
            text: total.toString(),
            textAlign: 'center',
            fill: TEXT_COLOR,
            fontSize: 32,
            fontWeight: 700,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          },
        },
        {
          type: 'text',
          left: 'center',
          top: '56%',
          style: {
            text: '问题总数',
            textAlign: 'center',
            fill: 'rgba(229, 231, 235, 0.6)',
            fontSize: 12,
          },
        },
      ],
      series: [
        {
          name: '质量问题',
          type: 'pie',
          radius: ['52%', '72%'],
          center: ['60%', '52%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 6,
          },
          label: {
            show: true,
            position: 'outside',
            color: TEXT_COLOR,
            fontSize: 11,
            formatter: '{b}\n{d}%',
            lineHeight: 16,
          },
          labelLine: {
            show: true,
            length: 12,
            length2: 8,
            lineStyle: {
              color: 'rgba(229, 231, 235, 0.3)',
            },
          },
          emphasis: {
            scale: true,
            scaleSize: 10,
            itemStyle: {
              shadowBlur: 20,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
            label: {
              show: true,
              fontSize: 13,
              fontWeight: 600,
            },
          },
          data: pieData,
        },
      ],
    };
  }, [data, total, title]);

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
      <ReactECharts
        option={option}
        style={{ width: '100%', height: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
}
