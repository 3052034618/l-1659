import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

export interface ForecastPoint {
  date: string;
  value: number;
  lower?: number;
  upper?: number;
}

interface ForecastChartProps {
  history: ForecastPoint[];
  forecast: ForecastPoint[];
  threshold?: number;
  height?: number | string;
  title?: string;
  valueLabel?: string;
}

const BG_COLOR = '#1E293B';
const TEXT_COLOR = '#E5E7EB';
const GOLD_COLOR = '#D4A574';
const BLUE = '#3B82F6';
const GREEN = '#10B981';
const RED = '#EF4444';
const TOOLTIP_BG = 'rgba(30, 41, 59, 0.92)';
const AXIS_LINE = 'rgba(229, 231, 235, 0.15)';
const SPLIT_LINE = 'rgba(229, 231, 235, 0.06)';

export default function ForecastChart({
  history,
  forecast,
  threshold,
  height = 340,
  title = '90天销量预测',
  valueLabel = '销量',
}: ForecastChartProps) {
  const allData = useMemo(() => {
    const xData: string[] = [];
    const historyVals: Array<number | null> = [];
    const forecastVals: Array<number | null> = [];
    const lowerVals: Array<number | null> = [];
    const upperVals: Array<number | null> = [];
    const bandBase: Array<number | null> = [];
    const bandRange: Array<number | null> = [];

    history.forEach((p) => {
      xData.push(p.date);
      historyVals.push(p.value);
      forecastVals.push(null);
      lowerVals.push(null);
      upperVals.push(null);
      bandBase.push(null);
      bandRange.push(null);
    });

    forecast.forEach((p) => {
      xData.push(p.date);
      historyVals.push(null);
      forecastVals.push(p.value);
      const lo = p.lower ?? p.value * 0.9;
      const hi = p.upper ?? p.value * 1.1;
      lowerVals.push(lo);
      upperVals.push(hi);
      bandBase.push(lo);
      bandRange.push(hi - lo);
    });

    return { xData, historyVals, forecastVals, lowerVals, upperVals, bandBase, bandRange };
  }, [history, forecast]);

  const option: EChartsOption = useMemo(() => {
    const series: any[] = [];

    if (allData.bandBase.some((v) => v !== null)) {
      series.push({
        name: '置信下限',
        type: 'line',
        data: allData.bandBase,
        stack: 'confidence',
        lineStyle: { opacity: 0 },
        symbol: 'none',
        z: 1,
      });
      series.push({
        name: '置信区间',
        type: 'line',
        data: allData.bandRange,
        stack: 'confidence',
        lineStyle: { opacity: 0 },
        symbol: 'none',
        areaStyle: {
          color: BLUE + '22',
        },
        z: 1,
      });
    }

    series.push({
      name: '历史数据',
      type: 'line',
      data: allData.historyVals,
      smooth: true,
      symbol: 'circle',
      symbolSize: 5,
      showSymbol: false,
      lineStyle: {
        width: 3,
        color: GOLD_COLOR,
        shadowColor: GOLD_COLOR + '66',
        shadowBlur: 10,
      },
      itemStyle: {
        color: GOLD_COLOR,
        borderColor: BG_COLOR,
        borderWidth: 2,
      },
      emphasis: {
        focus: 'series',
        scale: 1.3,
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: GOLD_COLOR + '40' },
            { offset: 1, color: GOLD_COLOR + '03' },
          ],
        },
      },
      z: 4,
    });

    series.push({
      name: '预测数据',
      type: 'line',
      data: allData.forecastVals,
      smooth: true,
      symbol: 'circle',
      symbolSize: 5,
      showSymbol: false,
      lineStyle: {
        width: 2.5,
        color: BLUE,
        type: [6, 4],
        shadowColor: BLUE + '55',
        shadowBlur: 8,
      },
      itemStyle: {
        color: BLUE,
        borderColor: BG_COLOR,
        borderWidth: 2,
      },
      emphasis: {
        focus: 'series',
        scale: 1.3,
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: BLUE + '33' },
            { offset: 1, color: BLUE + '03' },
          ],
        },
      },
      z: 3,
    });

    const markLine: any =
      threshold !== undefined
        ? {
            silent: false,
            symbol: ['none', 'arrow'],
            symbolSize: 10,
            lineStyle: {
              color: RED,
              type: 'dashed',
              width: 2,
              shadowColor: RED + '55',
              shadowBlur: 6,
            },
            label: {
              show: true,
              position: 'insideEndTop',
              formatter: `阈值 ${threshold}`,
              color: RED,
              fontWeight: 600,
              fontSize: 11,
              padding: [4, 8],
              backgroundColor: RED + '1A',
              borderRadius: 4,
            },
            data: [{ yAxis: threshold }],
          }
        : undefined;

    if (threshold !== undefined) {
      series[series.length - 1].markLine = markLine;
    }

    const historyEndIdx = history.length - 1;
    const historyEndVal = allData.historyVals[historyEndIdx] as number;

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
        subtext: `历史${history.length}天 · 预测${forecast.length}天`,
        subtextStyle: {
          color: 'rgba(229, 231, 235, 0.5)',
          fontSize: 11,
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
          lineStyle: { color: GOLD_COLOR + '40', type: 'dashed' },
          label: { backgroundColor: TOOLTIP_BG, color: TEXT_COLOR },
        },
        formatter: (params: any) => {
          if (!Array.isArray(params) || !params.length) return '';
          const date = params[0].axisValue;
          let html = `<div style="font-weight:600;margin-bottom:6px;color:${GOLD_COLOR}">${date}</div>`;
          params.forEach((p: any) => {
            if (p.value === null || p.value === undefined || p.value === '') return;
            if (['置信下限', '置信区间'].includes(p.seriesName)) return;
            const color = p.color;
            html += `<div style="display:flex;align-items:center;gap:6px;margin:2px 0">
              <span style="width:8px;height:8px;border-radius:50%;background:${typeof color === 'string' ? color : GOLD_COLOR};display:inline-block"></span>
              <span style="color:rgba(229,231,235,0.8)">${p.seriesName}：</span>
              <b style="color:${GOLD_COLOR}">${p.value?.toFixed?.(1) ?? p.value}</b>
            </div>`;
          });
          return html;
        },
      },
      legend: {
        top: 14,
        right: 16,
        icon: 'roundRect',
        itemWidth: 14,
        itemHeight: 6,
        itemGap: 14,
        textStyle: { color: TEXT_COLOR, fontSize: 12 },
      },
      grid: {
        top: 68,
        left: 52,
        right: 24,
        bottom: 44,
      },
      xAxis: {
        type: 'category',
        data: allData.xData,
        boundaryGap: false,
        axisLine: { lineStyle: { color: AXIS_LINE } },
        axisTick: { show: false },
        axisLabel: {
          color: 'rgba(229, 231, 235, 0.65)',
          fontSize: 10,
          margin: 10,
          interval: Math.floor(allData.xData.length / 10),
          rotate: allData.xData.length > 20 ? 30 : 0,
        },
      },
      yAxis: {
        type: 'value',
        name: valueLabel,
        nameTextStyle: {
          color: 'rgba(229, 231, 235, 0.6)',
          fontSize: 11,
          padding: [0, 0, 0, 30],
        },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: 'rgba(229, 231, 235, 0.65)',
          fontSize: 11,
          margin: 10,
        },
        splitLine: { lineStyle: { color: SPLIT_LINE, type: 'dashed' } },
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100,
        },
        {
          type: 'slider',
          height: 18,
          bottom: 6,
          borderColor: 'transparent',
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          fillerColor: GOLD_COLOR + '33',
          handleStyle: { color: GOLD_COLOR, borderColor: BG_COLOR },
          textStyle: { color: TEXT_COLOR, fontSize: 10 },
        },
      ],
      markLine: undefined,
      series,
      graphic:
        historyEndIdx >= 0 && historyEndVal !== undefined
          ? [
              {
                type: 'group',
                left: 'center',
                top: 42,
                children: [
                  {
                    type: 'text',
                    style: {
                      text: '◆ 历史与预测分界点',
                      fill: 'rgba(229, 231, 235, 0.5)',
                      fontSize: 10,
                    },
                  },
                ],
              },
            ]
          : undefined,
    } as EChartsOption;
  }, [allData, history.length, forecast.length, threshold, title, valueLabel]);

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
          top: 48,
          left: 16,
          right: 16,
          display: 'flex',
          justifyContent: 'space-between',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 10,
            color: GOLD_COLOR,
          }}
        >
          <span
            style={{
              width: 24,
              height: 2,
              background: GOLD_COLOR,
              borderRadius: 1,
              display: 'inline-block',
            }}
          />
          历史数据
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 10,
            color: BLUE,
          }}
        >
          预测数据
          <span
            style={{
              width: 24,
              height: 2,
              background: `repeating-linear-gradient(90deg, ${BLUE} 0 4px, transparent 4px 7px)`,
              borderRadius: 1,
              display: 'inline-block',
            }}
          />
        </div>
      </div>

      <ReactECharts
        option={option}
        style={{ width: '100%', height: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
}
