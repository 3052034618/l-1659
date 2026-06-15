import { useEffect, useRef, useState } from 'react';
import { List, Badge, Button } from 'antd';
import {
  Thermometer,
  Droplets,
  Gauge,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ArrowDownToLine,
  FlaskConical,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';

export type DataType =
  | 'temperature'
  | 'humidity'
  | 'pressure'
  | 'activity'
  | 'alert'
  | 'success'
  | 'data'
  | 'quality'
  | 'energy';

export interface StreamItem {
  id: string;
  type: DataType;
  title: string;
  content: string;
  value?: string | number;
  unit?: string;
  timestamp: number;
  isNew?: boolean;
}

const typeConfig: Record<
  DataType,
  {
    icon: LucideIcon;
    color: string;
    bgColor: string;
  }
> = {
  temperature: {
    icon: Thermometer,
    color: '#F87171',
    bgColor: 'rgba(248, 113, 113, 0.12)',
  },
  humidity: {
    icon: Droplets,
    color: '#60A5FA',
    bgColor: 'rgba(96, 165, 250, 0.12)',
  },
  pressure: {
    icon: Gauge,
    color: '#C084FC',
    bgColor: 'rgba(192, 132, 252, 0.12)',
  },
  activity: {
    icon: Activity,
    color: '#34D399',
    bgColor: 'rgba(52, 211, 153, 0.12)',
  },
  alert: {
    icon: AlertTriangle,
    color: '#FBBF24',
    bgColor: 'rgba(251, 191, 36, 0.12)',
  },
  success: {
    icon: CheckCircle2,
    color: '#34D399',
    bgColor: 'rgba(52, 211, 153, 0.12)',
  },
  data: {
    icon: ArrowDownToLine,
    color: '#D4A574',
    bgColor: 'rgba(212, 165, 116, 0.12)',
  },
  quality: {
    icon: FlaskConical,
    color: '#22D3EE',
    bgColor: 'rgba(34, 211, 238, 0.12)',
  },
  energy: {
    icon: Zap,
    color: '#FACC15',
    bgColor: 'rgba(250, 204, 21, 0.12)',
  },
};

const mockTemplates: Array<Omit<StreamItem, 'id' | 'timestamp' | 'isNew'>> = [
  {
    type: 'temperature',
    title: '发酵罐#01',
    content: '温度读数更新',
    value: 28.5,
    unit: '°C',
  },
  {
    type: 'humidity',
    title: '储酒库B区',
    content: '湿度检测',
    value: 68,
    unit: '%RH',
  },
  {
    type: 'pressure',
    title: '蒸馏塔#02',
    content: '压力正常',
    value: 0.12,
    unit: 'MPa',
  },
  {
    type: 'activity',
    title: '生产车间A',
    content: '设备运行状态',
    value: '活跃',
  },
  {
    type: 'alert',
    title: '发酵罐#03',
    content: '温度偏离设定值',
    value: 32.1,
    unit: '°C',
  },
  {
    type: 'success',
    title: '批次B2024001',
    content: '发酵完成',
  },
  {
    type: 'data',
    title: '数据同步',
    content: '传感器数据已上传',
    value: 1256,
    unit: '条',
  },
  {
    type: 'quality',
    title: '品控检测#128',
    content: '酒精度检测',
    value: 52.3,
    unit: '%vol',
  },
  {
    type: 'energy',
    title: '车间能耗',
    content: '实时功耗',
    value: 156.8,
    unit: 'kW',
  },
  {
    type: 'temperature',
    title: '陈酿窖#05',
    content: '环境温度',
    value: 16.2,
    unit: '°C',
  },
];

interface DataStreamProps {
  className?: string;
  maxItems?: number;
  interval?: number;
  autoScroll?: boolean;
}

export default function DataStream({
  className,
  maxItems = 20,
  interval = 3000,
  autoScroll = true,
}: DataStreamProps) {
  const [data, setData] = useState<StreamItem[]>([]);
  const [newCount, setNewCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const userScrolledRef = useRef(false);

  useEffect(() => {
    const initialData: StreamItem[] = [];
    for (let i = 0; i < 8; i++) {
      const template =
        mockTemplates[Math.floor(Math.random() * mockTemplates.length)];
      initialData.push({
        ...template,
        id: `stream-${Date.now()}-${i}`,
        timestamp: Date.now() - (8 - i) * 5000,
      });
    }
    setData(initialData);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      const template =
        mockTemplates[Math.floor(Math.random() * mockTemplates.length)];
      const newItem: StreamItem = {
        ...template,
        id: `stream-${Date.now()}`,
        timestamp: Date.now(),
        isNew: true,
      };

      setData((prev) => {
        const updated = [newItem, ...prev].slice(0, maxItems);
        return updated.map((item, idx) =>
          idx >= 3 ? { ...item, isNew: false } : item
        );
      });

      if (userScrolledRef.current && listRef.current) {
        const scrollTop = listRef.current.scrollTop;
        if (scrollTop > 10) {
          setNewCount((c) => c + 1);
        }
      }

      setTimeout(() => {
        setData((prev) => prev.map((item) => ({ ...item, isNew: false })));
      }, 2000);
    }, interval);

    return () => clearInterval(timer);
  }, [isPaused, interval, maxItems]);

  const handleScroll = () => {
    if (!listRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    const isAtTop = scrollTop < 20;
    const nearTop = scrollHeight - scrollTop - clientHeight > 100;

    if (!isAtTop && nearTop) {
      userScrolledRef.current = true;
    } else if (isAtTop) {
      userScrolledRef.current = false;
      setNewCount(0);
    }
  };

  const scrollToTop = () => {
    if (listRef.current) {
      listRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      setNewCount(0);
      userScrolledRef.current = false;
    }
  };

  useEffect(() => {
    if (!autoScroll || userScrolledRef.current || !listRef.current) return;
    listRef.current.scrollTop = 0;
  }, [data, autoScroll]);

  return (
    <div className={cn('relative h-full flex flex-col', className)}>
      {newCount > 0 && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10">
          <Button
            type="primary"
            size="small"
            icon={
              <Badge
                count={newCount}
                size="small"
                offset={[2, -2]}
                color="#D4A574"
              >
                <ArrowDownToLine size={14} />
              </Badge>
            }
            onClick={scrollToTop}
            className="!h-8 !px-4 !rounded-full shadow-lg"
            style={{
              background:
                'linear-gradient(135deg, #D4A574 0%, #B8860B 100%)',
              border: 'none',
            }}
          >
            {newCount} 条新消息
          </Button>
        </div>
      )}

      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'w-2 h-2 rounded-full',
              isPaused ? 'bg-gray-500' : 'bg-emerald-500 animate-pulse'
            )}
          />
          <span className="text-sm text-gray-400 font-medium">
            {isPaused ? '数据流已暂停' : '实时数据流'}
          </span>
        </div>
        <Button
          type="text"
          size="small"
          onClick={() => setIsPaused(!isPaused)}
          className="!text-gray-400 !h-7 hover:!text-gold-400 !text-xs"
        >
          {isPaused ? '继续' : '暂停'}
        </Button>
      </div>

      <div
        ref={listRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto space-y-1 pr-1 -mr-1 scroll-smooth"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#334155 transparent',
        }}
      >
        <List
          dataSource={data}
          locale={{ emptyText: '暂无数据' }}
          renderItem={(item) => {
            const config = typeConfig[item.type];
            const Icon = config.icon;
            return (
              <List.Item
                key={item.id}
                className={cn(
                  '!border-none !px-3 !py-2.5 rounded-xl mb-1 cursor-pointer transition-all duration-300',
                  item.isNew
                    ? 'bg-gold-500/10 border border-gold-500/30'
                    : 'hover:bg-white/5 border border-transparent'
                )}
              >
                <div className="flex items-start gap-3 w-full">
                  <div
                    className={cn(
                      'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0',
                      item.isNew && 'animate-pulse'
                    )}
                    style={{
                      background: config.bgColor,
                    }}
                  >
                    <Icon
                      size={18}
                      strokeWidth={2}
                      style={{ color: config.color }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          'text-sm font-medium truncate',
                          item.isNew ? 'text-white' : 'text-gray-200'
                        )}
                      >
                        {item.title}
                      </span>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {dayjs(item.timestamp).format('HH:mm:ss')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <span className="text-xs text-gray-500 truncate">
                        {item.content}
                      </span>
                      {item.value !== undefined && (
                        <span
                          className="text-xs font-semibold flex-shrink-0"
                          style={{ color: config.color }}
                        >
                          {item.value}
                          {item.unit && (
                            <span className="text-gray-500 ml-0.5 font-normal">
                              {item.unit}
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </List.Item>
            );
          }}
        />
      </div>

      <style>{`
        .ant-list-items {
          display: flex !important;
          flex-direction: column !important;
        }
        div[ref='listRef']::-webkit-scrollbar {
          width: 4px;
        }
        div[ref='listRef']::-webkit-scrollbar-track {
          background: transparent;
        }
        div[ref='listRef']::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 2px;
        }
        div[ref='listRef']::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
    </div>
  );
}
