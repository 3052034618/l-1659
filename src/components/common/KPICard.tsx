import { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: number;
  unit?: string;
  trend?: number;
  trendLabel?: string;
  icon?: LucideIcon;
  className?: string;
  decimals?: number;
  prefix?: string;
}

function useCountUp(target: number, duration = 1500, decimals = 0) {
  const [displayValue, setDisplayValue] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>();
  const previousTarget = useRef(0);

  useEffect(() => {
    const startTime = startRef.current ?? performance.now();
    startRef.current = startTime;
    const startValue = previousTarget.current;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (target - startValue) * easeProgress;

      setDisplayValue(currentValue);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        previousTarget.current = target;
        startRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [target, duration, decimals]);

  return displayValue;
}

export default function KPICard({
  title,
  value,
  unit,
  trend,
  trendLabel,
  icon: Icon,
  className,
  decimals = 0,
  prefix,
}: KPICardProps) {
  const displayValue = useCountUp(value, 1500, decimals);
  const isPositive = (trend ?? 0) >= 0;

  const formatNumber = (num: number) => {
    const fixed = num.toFixed(decimals);
    const parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  return (
    <div
      className={cn(
        'relative rounded-2xl p-5 overflow-hidden transition-all duration-300 ease-out',
        'hover:-translate-y-1 hover:shadow-gold',
        className
      )}
      style={{
        background:
          'linear-gradient(145deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.9) 100%)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          padding: '1px',
          background:
            'linear-gradient(135deg, rgba(212, 165, 116, 0.6) 0%, rgba(184, 134, 11, 0.25) 40%, rgba(251, 191, 36, 0.12) 60%, rgba(184, 134, 11, 0.25) 80%, rgba(212, 165, 116, 0.6) 100%)',
          WebkitMask:
            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(212, 165, 116, 0.6) 0%, transparent 70%)',
        }}
      />

      <div className="relative flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <p className="text-gray-400 text-sm font-medium mb-1 truncate">
            {title}
          </p>
          <div className="flex items-baseline gap-1">
            {prefix && (
              <span className="text-gold-400 text-lg font-semibold">
                {prefix}
              </span>
            )}
            <span
              className="text-3xl font-bold tracking-tight"
              style={{
                background:
                  'linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 50%, #D4A574 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {formatNumber(displayValue)}
            </span>
            {unit && (
              <span className="text-gray-500 text-sm ml-1 flex-shrink-0">
                {unit}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ml-3"
            style={{
              background:
                'linear-gradient(135deg, rgba(212, 165, 116, 0.2) 0%, rgba(184, 134, 11, 0.1) 100%)',
              border: '1px solid rgba(212, 165, 116, 0.25)',
            }}
          >
            <Icon
              size={24}
              className="text-gold-400"
              strokeWidth={2}
            />
          </div>
        )}
      </div>

      {typeof trend === 'number' && (
        <div className="relative flex items-center gap-3">
          <div
            className={cn(
              'flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-medium',
              isPositive
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-rose-500/10 text-rose-400'
            )}
          >
            {isPositive ? (
              <TrendingUp size={16} strokeWidth={2.5} />
            ) : (
              <TrendingDown size={16} strokeWidth={2.5} />
            )}
            <span>
              {isPositive ? '+' : ''}
              {trend.toFixed(1)}%
            </span>
          </div>
          {trendLabel && (
            <span className="text-gray-500 text-xs truncate">
              {trendLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
