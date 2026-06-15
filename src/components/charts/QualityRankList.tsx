import { useMemo } from 'react';

export interface BrandRank {
  rank: number;
  name: string;
  score: number;
  lastRank?: number;
  logo?: string;
}

interface QualityRankListProps {
  brands: BrandRank[];
  height?: number | string;
  title?: string;
}

const BG_COLOR = '#1E293B';
const TEXT_COLOR = '#E5E7EB';
const GOLD_COLOR = '#D4A574';
const GREEN = '#10B981';
const RED = '#EF4444';
const BLUE = '#3B82F6';

const MEDAL_COLORS: Record<number, string> = {
  1: 'linear-gradient(135deg, #FFD700 0%, #D4A574 100%)',
  2: 'linear-gradient(135deg, #E5E7EB 0%, #9CA3AF 100%)',
  3: 'linear-gradient(135deg, #CD7F32 0%, #A0522D 100%)',
};

function MedalIcon({ rank }: { rank: number }) {
  if (rank > 3) return null;
  return (
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: MEDAL_COLORS[rank],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 13,
        fontWeight: 800,
        color: rank === 1 || rank === 3 ? '#0F172A' : '#374151',
        boxShadow: `0 2px 8px ${rank === 1 ? 'rgba(212, 165, 116, 0.5)' : 'rgba(0,0,0,0.3)'}`,
        position: 'relative',
      }}
    >
      {rank}
      <span
        style={{
          position: 'absolute',
          bottom: -3,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 8,
          color: rank === 1 ? GOLD_COLOR : 'rgba(229, 231, 235, 0.6)',
        }}
      >
        {rank === 1 ? '★' : rank === 2 ? '★' : '★'}
      </span>
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank <= 3) return null;
  return (
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: 8,
        background: 'rgba(229, 231, 235, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 13,
        fontWeight: 700,
        color: 'rgba(229, 231, 235, 0.7)',
        border: '1px solid rgba(229, 231, 235, 0.1)',
      }}
    >
      {rank}
    </div>
  );
}

function TrendArrow({ current, last }: { current: number; last?: number }) {
  if (!last || last === current) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          fontSize: 11,
          color: 'rgba(229, 231, 235, 0.4)',
        }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
          <line x1="1" y1="5" x2="9" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span>持平</span>
      </div>
    );
  }
  const up = current < last;
  const diff = Math.abs(current - last);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        fontSize: 11,
        color: up ? GREEN : RED,
        fontWeight: 600,
      }}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
        {up ? (
          <path d="M5 1 L9 7 L7 7 L7 9 L3 9 L3 7 L1 7 Z" />
        ) : (
          <path d="M5 9 L1 3 L3 3 L3 1 L7 1 L7 3 L9 3 Z" />
        )}
      </svg>
      <span>{diff}</span>
    </div>
  );
}

export default function QualityRankList({
  brands,
  height = 420,
  title = '品牌质量排名 TOP10',
}: QualityRankListProps) {
  const sortedBrands = useMemo(() => {
    return [...brands].sort((a, b) => a.rank - b.rank).slice(0, 10);
  }, [brands]);

  const maxScore = useMemo(() => {
    return Math.max(100, ...sortedBrands.map((b) => b.score));
  }, [sortedBrands]);

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
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(229, 231, 235, 0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 4,
              height: 16,
              borderRadius: 2,
              background: GOLD_COLOR,
            }}
          />
          <h3
            style={{
              margin: 0,
              fontSize: 15,
              fontWeight: 600,
              color: TEXT_COLOR,
            }}
          >
            {title}
          </h3>
        </div>
        <div
          style={{
            fontSize: 11,
            color: 'rgba(229, 231, 235, 0.5)',
          }}
        >
          合格率 (%)
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px 12px 12px',
        }}
      >
        {sortedBrands.map((brand, idx) => {
          const isTop3 = brand.rank <= 3;
          const pct = (brand.score / maxScore) * 100;
          return (
            <div
              key={brand.name + brand.rank}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 10px',
                borderRadius: 10,
                marginBottom: idx < sortedBrands.length - 1 ? 2 : 0,
                background: isTop3
                  ? brand.rank === 1
                    ? 'linear-gradient(90deg, rgba(212, 165, 116, 0.12) 0%, transparent 100%)'
                    : 'rgba(229, 231, 235, 0.03)'
                  : 'transparent',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background =
                  'rgba(212, 165, 116, 0.08)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background =
                  isTop3
                    ? brand.rank === 1
                      ? 'linear-gradient(90deg, rgba(212, 165, 116, 0.12) 0%, transparent 100%)'
                      : 'rgba(229, 231, 235, 0.03)'
                    : 'transparent';
              }}
            >
              <MedalIcon rank={brand.rank} />
              <RankBadge rank={brand.rank} />

              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 5,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: isTop3 ? 700 : 600,
                        color: isTop3 ? GOLD_COLOR : TEXT_COLOR,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: 160,
                      }}
                      title={brand.name}
                    >
                      {brand.name}
                    </span>
                    <TrendArrow current={brand.rank} last={brand.lastRank} />
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        height: 6,
                        borderRadius: 3,
                        background: 'rgba(229, 231, 235, 0.06)',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          borderRadius: 3,
                          background:
                            brand.rank === 1
                              ? `linear-gradient(90deg, #F59E0B, ${GOLD_COLOR})`
                              : brand.rank === 2
                                ? `linear-gradient(90deg, #9CA3AF, #E5E7EB)`
                                : brand.rank === 3
                                  ? `linear-gradient(90deg, #A0522D, #CD7F32)`
                                  : `linear-gradient(90deg, #2563EB, ${BLUE})`,
                          boxShadow:
                            brand.rank === 1
                              ? '0 0 8px rgba(212, 165, 116, 0.5)'
                              : 'none',
                          transition: 'width 0.6s ease',
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color:
                          brand.score >= 95
                            ? GREEN
                            : brand.score >= 90
                              ? BLUE
                              : brand.score >= 85
                                ? GOLD_COLOR
                                : RED,
                        minWidth: 44,
                        textAlign: 'right',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {brand.score.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
