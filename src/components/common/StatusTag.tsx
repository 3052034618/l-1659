import { Tag } from 'antd';
import type { TagProps } from 'antd';
import { cn } from '@/lib/utils';

export type StatusType =
  | 'pending'
  | 'processing'
  | 'reviewing'
  | 'approved'
  | 'resolved'
  | 'expired'
  | 'connected'
  | 'partial'
  | 'disconnected';

interface StatusTagProps extends Omit<TagProps, 'color' | 'status'> {
  status: StatusType;
  size?: 'sm' | 'md';
  showDot?: boolean;
}

const statusConfig: Record<
  StatusType,
  {
    label: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
    dotColor: string;
  }
> = {
  pending: {
    label: '待处理',
    bgColor: 'rgba(251, 191, 36, 0.12)',
    textColor: '#FBBF24',
    borderColor: 'rgba(251, 191, 36, 0.25)',
    dotColor: '#FBBF24',
  },
  processing: {
    label: '处理中',
    bgColor: 'rgba(59, 130, 246, 0.12)',
    textColor: '#60A5FA',
    borderColor: 'rgba(59, 130, 246, 0.25)',
    dotColor: '#60A5FA',
  },
  reviewing: {
    label: '审核中',
    bgColor: 'rgba(168, 85, 247, 0.12)',
    textColor: '#C084FC',
    borderColor: 'rgba(168, 85, 247, 0.25)',
    dotColor: '#C084FC',
  },
  approved: {
    label: '已通过',
    bgColor: 'rgba(16, 185, 129, 0.12)',
    textColor: '#34D399',
    borderColor: 'rgba(16, 185, 129, 0.25)',
    dotColor: '#34D399',
  },
  resolved: {
    label: '已解决',
    bgColor: 'rgba(16, 185, 129, 0.12)',
    textColor: '#34D399',
    borderColor: 'rgba(16, 185, 129, 0.25)',
    dotColor: '#34D399',
  },
  expired: {
    label: '已过期',
    bgColor: 'rgba(156, 163, 175, 0.12)',
    textColor: '#9CA3AF',
    borderColor: 'rgba(156, 163, 175, 0.25)',
    dotColor: '#9CA3AF',
  },
  connected: {
    label: '已连接',
    bgColor: 'rgba(16, 185, 129, 0.12)',
    textColor: '#34D399',
    borderColor: 'rgba(16, 185, 129, 0.25)',
    dotColor: '#34D399',
  },
  partial: {
    label: '部分连接',
    bgColor: 'rgba(251, 191, 36, 0.12)',
    textColor: '#FBBF24',
    borderColor: 'rgba(251, 191, 36, 0.25)',
    dotColor: '#FBBF24',
  },
  disconnected: {
    label: '已断开',
    bgColor: 'rgba(239, 68, 68, 0.12)',
    textColor: '#F87171',
    borderColor: 'rgba(239, 68, 68, 0.25)',
    dotColor: '#F87171',
  },
};

export default function StatusTag({
  status,
  size = 'md',
  showDot = true,
  className,
  children,
  ...rest
}: StatusTagProps) {
  const config = statusConfig[status] ?? statusConfig.pending;

  const sizeClasses =
    size === 'sm'
      ? '!px-2 !py-0 !text-xs !h-5 !leading-5'
      : '!px-3 !py-0.5 !text-sm !h-7 !leading-6';

  return (
    <Tag
      className={cn(
        '!rounded-full !inline-flex !items-center !gap-1.5 !border !font-medium',
        sizeClasses,
        className
      )}
      style={{
        background: config.bgColor,
        color: config.textColor,
        borderColor: config.borderColor,
      }}
      {...rest}
    >
      {showDot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            (status === 'processing' || status === 'reviewing') &&
              'animate-pulse'
          )}
          style={{ backgroundColor: config.dotColor }}
        />
      )}
      {children ?? config.label}
    </Tag>
  );
}
