import { useMemo } from 'react';
import { Timeline, Tooltip, Badge } from 'antd';
import type { TimelineItemProps } from 'antd';
import {
  CheckOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  ShopOutlined,
  ApartmentOutlined,
  CrownOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface ApprovalNode {
  key: string;
  title: string;
  status: ApprovalStatus;
  description?: string;
  operator?: string;
  time?: string;
  remark?: string;
  duration?: string;
}

interface ApprovalTimelineProps {
  nodes?: ApprovalNode[];
  currentStep?: number;
  onNodeClick?: (node: ApprovalNode, index: number) => void;
  height?: number | string;
  title?: string;
  layout?: 'vertical' | 'horizontal';
}

const BG_COLOR = '#1E293B';
const TEXT_COLOR = '#E5E7EB';
const GOLD_COLOR = '#D4A574';
const GREEN = '#10B981';
const RED = '#EF4444';
const BLUE = '#3B82F6';
const ORANGE = '#F59E0B';

const DEFAULT_NODES: ApprovalNode[] = [
  {
    key: 'enterprise',
    title: '酒企确认',
    status: 'approved',
    description: '生产企业提交资质材料，确认产品信息',
    operator: '贵州茅台股份',
    time: '2026-06-10 09:30',
    duration: '0.5h',
  },
  {
    key: 'provincial',
    title: '省局复核',
    status: 'pending',
    description: '省级市场监管局对材料进行合规性复核',
    operator: '贵州省市场监管局',
    remark: '材料审核中，预计24小时内完成',
  },
  {
    key: 'national',
    title: '国家批准',
    status: 'pending',
    description: '国家市场监督管理总局终审并颁发批准文号',
    operator: '国家市场监督管理总局',
  },
];

const STATUS_STYLE: Record<ApprovalStatus, { color: string; bg: string; border: string; label: string }> = {
  approved: {
    color: GREEN,
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.3)',
    label: '已通过',
  },
  pending: {
    color: ORANGE,
    bg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.3)',
    label: '待处理',
  },
  rejected: {
    color: RED,
    bg: 'rgba(239, 68, 68, 0.12)',
    border: 'rgba(239, 68, 68, 0.3)',
    label: '已驳回',
  },
};

const NODE_ICONS = [ShopOutlined, ApartmentOutlined, CrownOutlined];

function StatusDot({ status, index }: { status: ApprovalStatus; index: number }) {
  const style = STATUS_STYLE[status];
  const Icon = NODE_ICONS[index] || InfoCircleOutlined;
  const isCurrent = status === 'pending';

  return (
    <div
      style={{
        position: 'relative',
        width: 48,
        height: 48,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: BG_COLOR,
        border: `2px solid ${style.border}`,
        boxShadow: isCurrent
          ? `0 0 0 6px ${style.color}15, 0 0 24px ${style.color}44`
          : `0 2px 12px rgba(0,0,0,0.3)`,
        zIndex: 3,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: style.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          ...(isCurrent
            ? {
                animation: 'approvalPulse 1.8s ease-in-out infinite',
              }
            : {}),
        }}
      >
        {status === 'approved' ? (
          <CheckOutlined style={{ fontSize: 16, color: style.color }} />
        ) : status === 'rejected' ? (
          <CloseOutlined style={{ fontSize: 16, color: style.color }} />
        ) : (
          <Icon style={{ fontSize: 16, color: style.color }} />
        )}
      </div>

      {isCurrent && (
        <>
          <span
            style={{
              position: 'absolute',
              inset: -6,
              borderRadius: '50%',
              border: `2px solid ${style.color}40`,
              animation: 'approvalRipple 1.8s ease-out infinite',
              pointerEvents: 'none',
            }}
          />
          <span
            style={{
              position: 'absolute',
              inset: -12,
              borderRadius: '50%',
              border: `1px solid ${style.color}20`,
              animation: 'approvalRipple 1.8s ease-out infinite 0.6s',
              pointerEvents: 'none',
            }}
          />
        </>
      )}

      <style>{`
        @keyframes approvalPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes approvalRipple {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(1.3); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function ConnectionBar({
  status,
  nextStatus,
  progress,
}: {
  status: ApprovalStatus;
  nextStatus?: ApprovalStatus;
  progress?: number;
}) {
  const isDone = status === 'approved';
  const currentStyle = STATUS_STYLE[status];
  const baseColor = isDone ? GREEN : currentStyle.color;
  const fillProgress = progress ?? (isDone ? 1 : 0.5);

  return (
    <div
      style={{
        flex: 1,
        height: 4,
        minWidth: 40,
        background: 'rgba(229, 231, 235, 0.08)',
        borderRadius: 2,
        margin: '0 -8px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${fillProgress * 100}%`,
          height: '100%',
          borderRadius: 2,
          background: isDone
            ? `linear-gradient(90deg, ${GREEN}, ${GREEN}cc)`
            : status === 'pending'
              ? `linear-gradient(90deg, ${ORANGE}, ${GOLD_COLOR})`
              : `linear-gradient(90deg, ${RED}88, ${RED})`,
          boxShadow: `0 0 8px ${baseColor}44`,
          transition: 'width 0.6s ease',
          position: 'relative',
        }}
      >
        {status === 'pending' && !isDone && (
          <div
            style={{
              position: 'absolute',
              right: -4,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: baseColor,
              boxShadow: `0 0 12px ${baseColor}`,
              animation: 'progressGlow 1.2s ease-in-out infinite',
            }}
          />
        )}
      </div>
      <style>{`
        @keyframes progressGlow {
          0%, 100% { opacity: 1; transform: translateY(-50%) scale(1); }
          50% { opacity: 0.7; transform: translateY(-50%) scale(1.2); }
        }
      `}</style>
    </div>
  );
}

export default function ApprovalTimeline({
  nodes: customNodes,
  currentStep,
  onNodeClick,
  height = 280,
  title = '三级审批进度',
  layout = 'horizontal',
}: ApprovalTimelineProps) {
  const nodes = customNodes || DEFAULT_NODES;

  const computedCurrent = useMemo(() => {
    if (currentStep !== undefined) return currentStep;
    const idx = nodes.findIndex((n) => n.status === 'pending');
    return idx >= 0 ? idx : nodes.length - 1;
  }, [nodes, currentStep]);

  if (layout === 'vertical') {
    const items: TimelineItemProps[] = nodes.map((node, index) => {
      const style = STATUS_STYLE[node.status];
      const Icon = NODE_ICONS[index] || InfoCircleOutlined;
      const isCurrent = index === computedCurrent;

      return {
        dot: (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: style.bg,
              border: `2px solid ${style.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: -4,
              ...(isCurrent
                ? {
                    boxShadow: `0 0 0 4px ${style.color}20, 0 0 16px ${style.color}44`,
                  }
                : {}),
            }}
          >
            {node.status === 'approved' ? (
              <CheckOutlined style={{ color: style.color, fontSize: 13 }} />
            ) : node.status === 'rejected' ? (
              <CloseOutlined style={{ color: style.color, fontSize: 13 }} />
            ) : (
              <Icon style={{ color: style.color, fontSize: 13 }} />
            )}
          </div>
        ),
        color: style.color,
        children: (
          <div
            onClick={() => onNodeClick?.(node, index)}
            style={{
              cursor: onNodeClick ? 'pointer' : 'default',
              padding: '12px 14px',
              borderRadius: 10,
              background: isCurrent
                ? `linear-gradient(135deg, ${style.color}10 0%, transparent 100%)`
                : 'rgba(229, 231, 235, 0.03)',
              border: `1px solid ${isCurrent ? style.border : 'rgba(229, 231, 235, 0.06)'}`,
              marginBottom: 6,
              transition: 'all 0.2s ease',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: isCurrent ? style.color : TEXT_COLOR,
                }}
              >
                {node.title}
              </span>
              <Badge
                color={style.color}
                text={
                  <span style={{ fontSize: 11, color: style.color, fontWeight: 500 }}>
                    {style.label}
                  </span>
                }
              />
            </div>
            {node.description && (
              <div
                style={{
                  fontSize: 12,
                  color: 'rgba(229, 231, 235, 0.65)',
                  lineHeight: 1.5,
                  marginBottom: 6,
                }}
              >
                {node.description}
              </div>
            )}
            {(node.operator || node.time) && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  flexWrap: 'wrap',
                  fontSize: 11,
                  color: 'rgba(229, 231, 235, 0.5)',
                }}
              >
                {node.operator && <span>处理方：{node.operator}</span>}
                {node.time && <span>· {node.time}</span>}
                {node.duration && <span>· 耗时 {node.duration}</span>}
              </div>
            )}
            {node.remark && (
              <div
                style={{
                  marginTop: 8,
                  padding: '6px 10px',
                  borderRadius: 6,
                  background: style.bg,
                  border: `1px solid ${style.border}`,
                  fontSize: 11,
                  color: style.color,
                  lineHeight: 1.5,
                }}
              >
                💬 {node.remark}
              </div>
            )}
          </div>
        ),
      };
    });

    return (
      <div
        style={{
          position: 'relative',
          width: '100%',
          minHeight: height,
          background: BG_COLOR,
          borderRadius: 12,
          overflow: 'hidden',
          border: '1px solid rgba(212, 165, 116, 0.15)',
          padding: 16,
        }}
      >
        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 4,
              height: 16,
              borderRadius: 2,
              background: GOLD_COLOR,
            }}
          />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: TEXT_COLOR }}>
            {title}
          </h3>
        </div>
        <Timeline mode="left" items={items} />
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: height,
        background: BG_COLOR,
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid rgba(212, 165, 116, 0.15)',
        padding: '16px 16px 20px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 4,
            height: 16,
            borderRadius: 2,
            background: GOLD_COLOR,
          }}
        />
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: TEXT_COLOR }}>
          {title}
        </h3>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(229, 231, 235, 0.5)' }}>
          {nodes.filter((n) => n.status === 'approved').length}/{nodes.length} 已完成
        </span>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 0,
          padding: '0 8px',
          minHeight: 180,
        }}
      >
        {nodes.map((node, index) => {
          const style = STATUS_STYLE[node.status];
          const isCurrent = index === computedCurrent;
          const nextStatus = nodes[index + 1]?.status;
          const Icon = NODE_ICONS[index] || InfoCircleOutlined;

          return (
            <div
              key={node.key}
              style={{
                display: 'flex',
                flex: 1,
                minWidth: 0,
                position: 'relative',
              }}
            >
              <div
                style={{
                  flex: index < nodes.length - 1 ? '0 0 auto' : '1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: 0,
                }}
              >
                <StatusDot status={node.status} index={index} />

                <div
                  style={{
                    marginTop: 14,
                    width: '100%',
                    textAlign: 'center',
                    padding: '10px 8px',
                    borderRadius: 10,
                    background: isCurrent
                      ? `linear-gradient(180deg, ${style.color}12 0%, transparent 100%)`
                      : 'rgba(229, 231, 235, 0.02)',
                    border: `1px solid ${isCurrent ? style.border : 'rgba(229, 231, 235, 0.06)'}`,
                    cursor: onNodeClick ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                    minHeight: 130,
                    maxWidth: 200,
                  }}
                  onClick={() => onNodeClick?.(node, index)}
                  onMouseEnter={(e) => {
                    if (onNodeClick) {
                      (e.currentTarget as HTMLDivElement).style.background =
                        `${style.color}0D`;
                      (e.currentTarget as HTMLDivElement).style.borderColor =
                        style.border;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (onNodeClick) {
                      (e.currentTarget as HTMLDivElement).style.background = isCurrent
                        ? `linear-gradient(180deg, ${style.color}12 0%, transparent 100%)`
                        : 'rgba(229, 231, 235, 0.02)';
                      (e.currentTarget as HTMLDivElement).style.borderColor = isCurrent
                        ? style.border
                        : 'rgba(229, 231, 235, 0.06)';
                    }
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      marginBottom: 6,
                      flexWrap: 'wrap',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: isCurrent ? style.color : TEXT_COLOR,
                      }}
                    >
                      {node.title}
                    </span>
                    <Tooltip title={style.label}>
                      <span
                        style={{
                          padding: '1px 6px',
                          borderRadius: 10,
                          background: style.bg,
                          border: `1px solid ${style.border}`,
                          fontSize: 10,
                          color: style.color,
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 3,
                        }}
                      >
                        {node.status === 'approved' ? (
                          <CheckOutlined />
                        ) : node.status === 'rejected' ? (
                          <CloseOutlined />
                        ) : (
                          <ClockCircleOutlined />
                        )}
                        {style.label}
                      </span>
                    </Tooltip>
                  </div>

                  {node.description && (
                    <div
                      style={{
                        fontSize: 11,
                        color: 'rgba(229, 231, 235, 0.6)',
                        lineHeight: 1.5,
                        marginBottom: 8,
                      }}
                    >
                      {node.description}
                    </div>
                  )}

                  {node.operator && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 4,
                        fontSize: 10,
                        color: 'rgba(229, 231, 235, 0.5)',
                        marginBottom: 4,
                      }}
                    >
                      <Icon style={{ fontSize: 11 }} />
                      <span style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {node.operator}
                      </span>
                    </div>
                  )}

                  {node.time && (
                    <div
                      style={{
                        fontSize: 10,
                        color: 'rgba(229, 231, 235, 0.4)',
                      }}
                    >
                      {node.time}
                      {node.duration && ` · ${node.duration}`}
                    </div>
                  )}

                  {node.remark && (
                    <div
                      style={{
                        marginTop: 8,
                        padding: '5px 8px',
                        borderRadius: 6,
                        background: style.bg,
                        border: `1px solid ${style.border}`,
                        fontSize: 10,
                        color: style.color,
                        lineHeight: 1.5,
                        textAlign: 'left',
                      }}
                    >
                      💬 {node.remark}
                    </div>
                  )}
                </div>
              </div>

              {index < nodes.length - 1 && (
                <div
                  style={{
                    alignSelf: 'flex-start',
                    marginTop: 22,
                    display: 'flex',
                    alignItems: 'center',
                    width: 40,
                    flexShrink: 0,
                  }}
                >
                  <ConnectionBar
                    status={node.status}
                    nextStatus={nextStatus}
                    progress={node.status === 'approved' ? 1 : node.status === 'pending' ? 0.5 : 0}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
