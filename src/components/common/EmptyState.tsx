import { Empty } from 'antd';
import type { EmptyProps } from 'antd';
import { PackageSearch } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps extends Omit<EmptyProps, 'description'> {
  description?: React.ReactNode;
  title?: string;
  className?: string;
  iconSize?: 'sm' | 'md' | 'lg';
}

export default function EmptyState({
  description,
  title,
  className,
  iconSize = 'md',
  image,
  ...rest
}: EmptyStateProps) {
  const sizeMap = {
    sm: 48,
    md: 72,
    lg: 100,
  };

  const size = sizeMap[iconSize];

  const defaultImage = (
    <div
      className={cn(
        'rounded-2xl flex items-center justify-center',
        iconSize === 'lg' ? 'w-32 h-32' : iconSize === 'md' ? 'w-20 h-20' : 'w-14 h-14'
      )}
      style={{
        background:
          'linear-gradient(135deg, rgba(212, 165, 116, 0.15) 0%, rgba(184, 134, 11, 0.05) 100%)',
      }}
    >
      <PackageSearch
        size={size}
        strokeWidth={1.5}
        className="text-gold-500/60"
      />
    </div>
  );

  return (
    <div className={cn('w-full flex items-center justify-center py-12', className)}>
      <Empty
        image={image ?? defaultImage}
        imageStyle={{
          height: undefined,
          marginBottom: 16,
        }}
        description={
          <div className="text-center mt-2">
            {title && (
              <div className="text-gray-300 font-medium text-base mb-1">
                {title}
              </div>
            )}
            {description && (
              <div className="text-gray-500 text-sm">
                {description}
              </div>
            )}
            {!title && !description && (
              <div className="text-gray-500 text-sm">暂无数据</div>
            )}
          </div>
        }
        {...rest}
      />
    </div>
  );
}
