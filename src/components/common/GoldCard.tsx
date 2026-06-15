import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GoldCardProps {
  children: ReactNode;
  title?: ReactNode;
  extra?: ReactNode;
  className?: string;
  bodyClassName?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingMap: Record<NonNullable<GoldCardProps['padding']>, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
};

export default function GoldCard({
  children,
  title,
  extra,
  className,
  bodyClassName,
  padding = 'md',
}: GoldCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl transition-all duration-300 ease-out',
        'hover:-translate-y-1 hover:shadow-gold',
        className
      )}
      style={{
        background:
          'linear-gradient(145deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.9) 100%)',
        backdropFilter: 'blur(10px)',
        boxShadow:
          '0 4px 24px -4px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(212, 165, 116, 0.08) inset',
      }}
    >
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-60"
        style={{
          padding: '1px',
          background:
            'linear-gradient(135deg, rgba(212, 165, 116, 0.5) 0%, rgba(184, 134, 11, 0.2) 30%, rgba(251, 191, 36, 0.1) 50%, rgba(184, 134, 11, 0.2) 70%, rgba(212, 165, 116, 0.5) 100%)',
          WebkitMask:
            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {(title || extra) && (
        <div
          className={cn(
            'flex items-center justify-between border-b border-gold-500/10',
            padding !== 'none' && 'px-5 py-4'
          )}
        >
          {typeof title === 'string' ? (
            <h3 className="text-white font-semibold text-base flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-gradient-to-b from-gold-300 to-gold-600" />
              {title}
            </h3>
          ) : (
            <div className="flex items-center gap-2">{title}</div>
          )}
          {extra && <div className="flex-shrink-0">{extra}</div>}
        </div>
      )}

      <div className={cn(paddingMap[padding], bodyClassName)}>
        {children}
      </div>
    </div>
  );
}
