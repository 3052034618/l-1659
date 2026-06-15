import { useEffect, useMemo, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/core';
import type { EChartsOption } from 'echarts';
import chinaGeoJson from './china-geo';
import { provinces } from './china-geo';

export interface ProvinceData {
  code: string;
  name: string;
  sales?: number;
  production?: number;
  quality?: number;
}

export type DimensionType = 'sales' | 'production' | 'quality';

interface ChinaHeatMapProps {
  data: ProvinceData[];
  dimension?: DimensionType;
  onProvinceClick?: (code: string) => void;
  height?: number | string;
}

const BG_COLOR = '#1E293B';
const TEXT_COLOR = '#E5E7EB';
const GOLD_COLOR = '#D4A574';
const BLUE_DEEP = '#1E3A8A';
const TOOLTIP_BG = 'rgba(30, 41, 59, 0.92)';
const BORDER_COLOR = 'rgba(212, 165, 116, 0.4)';

const DIMENSION_CONFIG = {
  sales: { label: '销量', unit: '万件', min: 0, max: 100 },
  production: { label: '产量', unit: '万件', min: 0, max: 120 },
  quality: { label: '合格率', unit: '%', min: 85, max: 100 },
} as const;

let mapRegistered = false;

export default function ChinaHeatMap({
  data,
  dimension: initDimension = 'sales',
  onProvinceClick,
  height = 480,
}: ChinaHeatMapProps) {
  const [dimension, setDimension] = useState<DimensionType>(initDimension);

  useEffect(() => {
    if (!mapRegistered) {
      echarts.registerMap('china', chinaGeoJson as any);
      mapRegistered = true;
    }
  }, []);

  const codeToName = useMemo(() => {
    const m: Record<string, string> = {};
    provinces.forEach((p) => (m[p.code] = p.name));
    return m;
  }, []);

  const nameToCode = useMemo(() => {
    const m: Record<string, string> = {};
    provinces.forEach((p) => (m[p.name] = p.code));
    return m;
  }, []);

  const config = DIMENSION_CONFIG[dimension];

  const mapData = useMemo(() => {
    return data.map((d) => ({
      name: d.name || codeToName[d.code] || '',
      value: d[dimension] ?? 0,
      code: d.code,
    }));
  }, [data, dimension, codeToName]);

  const option: EChartsOption = useMemo(() => {
    return {
      backgroundColor: BG_COLOR,
      title: {
        text: `全国产销分布 · ${config.label}`,
        left: 'center',
        top: 12,
        textStyle: {
          color: TEXT_COLOR,
          fontSize: 16,
          fontWeight: 600,
        },
        subtext: '点击省份查看详情',
        subtextStyle: {
          color: 'rgba(229, 231, 235, 0.5)',
          fontSize: 12,
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
          const v = typeof params.value === 'number' ? params.value : 0;
          return `<div style="font-weight:600;margin-bottom:4px;color:${GOLD_COLOR}">${params.name}</div>
            <div>${config.label}：<b style="color:${GOLD_COLOR}">${v.toFixed(dimension === 'quality' ? 2 : 1)}</b> ${config.unit}</div>`;
        },
      },
      visualMap: {
        type: 'continuous',
        min: config.min,
        max: config.max,
        left: 24,
        bottom: 24,
        text: ['高', '低'],
        calculable: true,
        textStyle: { color: TEXT_COLOR, fontSize: 12 },
        inRange: {
          color: [BLUE_DEEP, '#1D4ED8', '#3B82F6', '#F59E0B', GOLD_COLOR],
        },
        itemHeight: 140,
        itemWidth: 14,
      },
      geo: {
        map: 'china',
        roam: false,
        zoom: 1.2,
        center: [104, 36],
        itemStyle: {
          areaColor: 'rgba(30, 58, 138, 0.25)',
          borderColor: BORDER_COLOR,
          borderWidth: 1,
        },
        emphasis: {
          itemStyle: {
            areaColor: GOLD_COLOR,
            borderColor: '#FFF',
            borderWidth: 1.5,
            shadowColor: 'rgba(212, 165, 116, 0.6)',
            shadowBlur: 12,
          },
          label: {
            show: true,
            color: '#0F172A',
            fontWeight: 600,
            fontSize: 12,
          },
        },
        label: {
          show: true,
          color: 'rgba(229, 231, 235, 0.75)',
          fontSize: 10,
        },
      },
      series: [
        {
          name: config.label,
          type: 'map',
          map: 'china',
          geoIndex: 0,
          roam: false,
          zoom: 1.2,
          center: [104, 36],
          data: mapData,
          label: {
            show: true,
            color: TEXT_COLOR,
            fontSize: 10,
          },
          itemStyle: {
            borderColor: BORDER_COLOR,
            borderWidth: 1,
          },
          emphasis: {
            itemStyle: {
              areaColor: GOLD_COLOR,
              borderColor: '#FFF',
              borderWidth: 1.5,
              shadowColor: 'rgba(212, 165, 116, 0.6)',
              shadowBlur: 12,
            },
            label: {
              show: true,
              color: '#0F172A',
              fontWeight: 600,
              fontSize: 12,
            },
          },
        },
      ],
    };
  }, [config, mapData, dimension]);

  const onEvents = useMemo(() => {
    return {
      click: (params: any) => {
        if (params && params.name && onProvinceClick) {
          const code = nameToCode[params.name] || params.data?.code || '';
          if (code) onProvinceClick(code);
        }
      },
    };
  }, [onProvinceClick, nameToCode]);

  const tabs: Array<{ key: DimensionType; label: string }> = [
    { key: 'sales', label: '销量' },
    { key: 'production', label: '产量' },
    { key: 'quality', label: '合格率' },
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
          gap: 6,
          padding: 4,
          background: 'rgba(15, 23, 42, 0.6)',
          borderRadius: 8,
          border: '1px solid rgba(212, 165, 116, 0.2)',
        }}
      >
        {tabs.map((t) => {
          const active = dimension === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setDimension(t.key)}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: active ? 600 : 400,
                transition: 'all 0.2s ease',
                background: active ? GOLD_COLOR : 'transparent',
                color: active ? '#0F172A' : TEXT_COLOR,
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <ReactECharts
        option={option}
        onEvents={onEvents}
        style={{ width: '100%', height: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
}
