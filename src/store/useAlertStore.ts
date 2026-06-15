import { create } from 'zustand';
import type {
  Alert,
  AlertType,
  AlertLevel,
  AlertStatus,
  AlertLog,
  QualityIssue,
  ActionPlan,
  ApprovalStep,
} from '../types';
import { generateAlerts, generateAlertLogs, generateQualityIssues, generateActionPlans, generateApprovalSteps } from '../utils/mock';
import { now, formatDateTime } from '../utils/date';

interface AlertFilter {
  keyword?: string;
  types: AlertType[];
  levels: AlertLevel[];
  statuses: AlertStatus[];
  provinceCode?: string;
  cityCode?: string;
  brandId?: string;
  enterpriseId?: string;
  startDate?: string;
  endDate?: string;
  riskScoreMin?: number;
  riskScoreMax?: number;
  page: number;
  pageSize: number;
}

interface AlertState {
  alerts: Alert[];
  filteredAlerts: Alert[];
  selectedAlert: Alert | null;
  alertLogs: AlertLog[];
  isLoading: boolean;
  filter: AlertFilter;
  totalCount: number;

  loadAlerts: (count?: number) => void;
  setFilter: (updates: Partial<AlertFilter>) => void;
  resetFilter: () => void;
  applyFilter: () => void;

  getAlertById: (id: string) => Alert | undefined;
  selectAlert: (id: string | null) => void;
  loadAlertLogs: (alertId: string) => void;

  createAlert: (data: Partial<Alert>) => Alert;
  updateAlert: (id: string, updates: Partial<Alert>) => boolean;
  deleteAlert: (id: string) => boolean;

  approveAlert: (alertId: string, comment?: string) => Promise<boolean>;
  rejectAlert: (alertId: string, comment?: string) => Promise<boolean>;
  processAlert: (alertId: string) => boolean;
  resolveAlert: (alertId: string) => boolean;
  closeAlert: (alertId: string) => boolean;
  submitAlert: (alertId: string) => boolean;

  addQualityIssue: (alertId: string, issue: QualityIssue) => boolean;
  updateQualityIssue: (alertId: string, issueId: string, updates: Partial<QualityIssue>) => boolean;
  removeQualityIssue: (alertId: string, issueId: string) => boolean;

  addActionPlan: (alertId: string, plan: ActionPlan) => boolean;
  updateActionPlan: (alertId: string, planId: string, updates: Partial<ActionPlan>) => boolean;
  removeActionPlan: (alertId: string, planId: string) => boolean;

  addAlertLog: (alertId: string, action: string, actionName: string, comment?: string) => void;

  getAlertsByType: (type: AlertType) => Alert[];
  getAlertsByLevel: (level: AlertLevel) => Alert[];
  getAlertsByStatus: (status: AlertStatus) => Alert[];
  getPendingApprovals: () => Alert[];
  getStats: () => {
    total: number;
    pending: number;
    processing: number;
    resolved: number;
    critical: number;
    high: number;
    averageRiskScore: number;
  };
}

const defaultFilter: AlertFilter = {
  types: [],
  levels: [],
  statuses: [],
  page: 1,
  pageSize: 10,
};

const initialAlerts = generateAlerts(18);

export const useAlertStore = create<AlertState>((set, get) => ({
  alerts: initialAlerts,
  filteredAlerts: initialAlerts,
  selectedAlert: null,
  alertLogs: [],
  isLoading: false,
  filter: { ...defaultFilter },
  totalCount: initialAlerts.length,

  loadAlerts: (count = 18) => {
    set({ isLoading: true });
    const newAlerts = generateAlerts(count);
    set({
      alerts: newAlerts,
      filteredAlerts: newAlerts,
      totalCount: newAlerts.length,
      isLoading: false,
    });
  },

  setFilter: (updates) => {
    set((state) => ({
      filter: { ...state.filter, ...updates },
    }));
    get().applyFilter();
  },

  resetFilter: () => {
    set({ filter: { ...defaultFilter } });
    get().applyFilter();
  },

  applyFilter: () => {
    const { alerts, filter } = get();
    let result = [...alerts];

    if (filter.keyword && filter.keyword.trim()) {
      const kw = filter.keyword.trim().toLowerCase();
      result = result.filter((a) =>
        a.title.toLowerCase().includes(kw) ||
        a.description.toLowerCase().includes(kw) ||
        a.alertNo.toLowerCase().includes(kw) ||
        (a.enterpriseName || '').toLowerCase().includes(kw) ||
        (a.brandName || '').toLowerCase().includes(kw)
      );
    }

    if (filter.types.length > 0) {
      result = result.filter((a) => filter.types.includes(a.type));
    }

    if (filter.levels.length > 0) {
      result = result.filter((a) => filter.levels.includes(a.level));
    }

    if (filter.statuses.length > 0) {
      result = result.filter((a) => filter.statuses.includes(a.status));
    }

    if (filter.provinceCode) {
      result = result.filter((a) => a.provinceCode === filter.provinceCode);
    }

    if (filter.cityCode) {
      result = result.filter((a) => a.cityCode === filter.cityCode);
    }

    if (filter.brandId) {
      result = result.filter((a) => a.brandId === filter.brandId);
    }

    if (filter.enterpriseId) {
      result = result.filter((a) => a.enterpriseId === filter.enterpriseId);
    }

    if (filter.startDate) {
      result = result.filter((a) => a.createdAt >= filter.startDate!);
    }

    if (filter.endDate) {
      result = result.filter((a) => a.createdAt <= filter.endDate! + ' 23:59:59');
    }

    if (typeof filter.riskScoreMin === 'number') {
      result = result.filter((a) => a.riskScore >= filter.riskScoreMin!);
    }

    if (typeof filter.riskScoreMax === 'number') {
      result = result.filter((a) => a.riskScore <= filter.riskScoreMax!);
    }

    const total = result.length;
    const { page, pageSize } = filter;
    const start = (page - 1) * pageSize;
    const paged = result.slice(start, start + pageSize);

    set({
      filteredAlerts: paged,
      totalCount: total,
    });
  },

  getAlertById: (id) => get().alerts.find((a) => a.id === id),

  selectAlert: (id) => {
    if (!id) {
      set({ selectedAlert: null, alertLogs: [] });
      return;
    }
    const alert = get().getAlertById(id);
    set({ selectedAlert: alert || null });
    if (alert) {
      get().loadAlertLogs(id);
    }
  },

  loadAlertLogs: (alertId) => {
    const logs = generateAlertLogs(alertId, randomInt(4, 8));
    set({ alertLogs: logs });
  },

  createAlert: (data) => {
    const newAlert: Alert = {
      id: `alert-${Date.now()}`,
      alertNo: `ALT${now().format('YYYYMM')}${String(get().alerts.length + 1).padStart(4, '0')}`,
      type: data.type || 'quality',
      typeName: data.typeName || '质量预警',
      level: data.level || 'warning',
      status: 'pending',
      title: data.title || '新建预警',
      description: data.description || '',
      provinceCode: data.provinceCode || '',
      provinceName: data.provinceName || '',
      cityCode: data.cityCode,
      cityName: data.cityName,
      enterpriseId: data.enterpriseId,
      enterpriseName: data.enterpriseName,
      brandId: data.brandId,
      brandName: data.brandName,
      indicatorValue: data.indicatorValue || 0,
      thresholdValue: data.thresholdValue || 0,
      deviation: data.deviation || 0,
      riskScore: data.riskScore || 50,
      createdAt: formatDateTime(now()),
      createdBy: data.createdBy || '当前用户',
      approvalSteps: generateApprovalSteps(`alert-${Date.now()}`, 1),
      currentApprovalLevel: 1,
      relatedAlerts: [],
      ...data,
    };

    set((state) => ({
      alerts: [newAlert, ...state.alerts],
    }));
    get().applyFilter();
    get().addAlertLog(newAlert.id, 'create', '创建预警', '系统自动创建');

    return newAlert;
  },

  updateAlert: (id, updates) => {
    const { alerts } = get();
    const idx = alerts.findIndex((a) => a.id === id);
    if (idx === -1) return false;

    const updated: Alert = { ...alerts[idx], ...updates };
    set((state) => {
      const newAlerts = [...state.alerts];
      newAlerts[idx] = updated;
      return {
        alerts: newAlerts,
        selectedAlert: state.selectedAlert?.id === id ? updated : state.selectedAlert,
      };
    });
    get().applyFilter();
    return true;
  },

  deleteAlert: (id) => {
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== id),
      selectedAlert: state.selectedAlert?.id === id ? null : state.selectedAlert,
    }));
    get().applyFilter();
    return true;
  },

  approveAlert: async (alertId, comment) => {
    const alert = get().getAlertById(alertId);
    if (!alert) return false;

    const nextLevel = alert.currentApprovalLevel + 1;
    const maxLevel = 2;
    const isFinalApproval = nextLevel > maxLevel;

    const newSteps = alert.approvalSteps.map((step) => {
      if (step.level === alert.currentApprovalLevel) {
        return {
          ...step,
          status: 'approved' as const,
          comment: comment || '审批通过',
          approvedAt: formatDateTime(now()),
        };
      }
      return step;
    });

    get().updateAlert(alertId, {
      status: isFinalApproval ? 'approved' : 'pending',
      approvalSteps: newSteps,
      currentApprovalLevel: nextLevel,
      approvedAt: isFinalApproval ? formatDateTime(now()) : alert.approvedAt,
    });

    get().addAlertLog(alertId, 'approve', '审批通过', comment);
    return true;
  },

  rejectAlert: async (alertId, comment) => {
    const alert = get().getAlertById(alertId);
    if (!alert) return false;

    const newSteps = alert.approvalSteps.map((step) => {
      if (step.level === alert.currentApprovalLevel) {
        return {
          ...step,
          status: 'rejected' as const,
          comment: comment || '审批驳回',
          approvedAt: formatDateTime(now()),
        };
      }
      return step;
    });

    get().updateAlert(alertId, {
      status: 'rejected',
      approvalSteps: newSteps,
    });

    get().addAlertLog(alertId, 'reject', '审批驳回', comment);
    return true;
  },

  submitAlert: (alertId) => {
    const result = get().updateAlert(alertId, { status: 'pending' });
    if (result) {
      get().addAlertLog(alertId, 'submit', '提交审批');
    }
    return result;
  },

  processAlert: (alertId) => {
    const result = get().updateAlert(alertId, { status: 'processing' });
    if (result) {
      get().addAlertLog(alertId, 'process', '开始处理');
    }
    return result;
  },

  resolveAlert: (alertId) => {
    const result = get().updateAlert(alertId, {
      status: 'resolved',
      resolvedAt: formatDateTime(now()),
    });
    if (result) {
      get().addAlertLog(alertId, 'resolve', '标记解决');
    }
    return result;
  },

  closeAlert: (alertId) => {
    const result = get().updateAlert(alertId, {
      status: 'closed',
      closedAt: formatDateTime(now()),
    });
    if (result) {
      get().addAlertLog(alertId, 'close', '关闭预警');
    }
    return result;
  },

  addQualityIssue: (alertId, issue) => {
    const alert = get().getAlertById(alertId);
    if (!alert) return false;
    const issues = [...(alert.qualityIssues || []), issue];
    return get().updateAlert(alertId, { qualityIssues: issues });
  },

  updateQualityIssue: (alertId, issueId, updates) => {
    const alert = get().getAlertById(alertId);
    if (!alert || !alert.qualityIssues) return false;
    const issues = alert.qualityIssues.map((q) =>
      q.id === issueId ? { ...q, ...updates } : q
    );
    return get().updateAlert(alertId, { qualityIssues: issues });
  },

  removeQualityIssue: (alertId, issueId) => {
    const alert = get().getAlertById(alertId);
    if (!alert || !alert.qualityIssues) return false;
    const issues = alert.qualityIssues.filter((q) => q.id !== issueId);
    return get().updateAlert(alertId, { qualityIssues: issues });
  },

  addActionPlan: (alertId, plan) => {
    const alert = get().getAlertById(alertId);
    if (!alert) return false;
    const plans = [...(alert.actionPlans || []), plan];
    return get().updateAlert(alertId, { actionPlans: plans });
  },

  updateActionPlan: (alertId, planId, updates) => {
    const alert = get().getAlertById(alertId);
    if (!alert || !alert.actionPlans) return false;
    const plans = alert.actionPlans.map((p) =>
      p.id === planId ? { ...p, ...updates } : p
    );
    return get().updateAlert(alertId, { actionPlans: plans });
  },

  removeActionPlan: (alertId, planId) => {
    const alert = get().getAlertById(alertId);
    if (!alert || !alert.actionPlans) return false;
    const plans = alert.actionPlans.filter((p) => p.id !== planId);
    return get().updateAlert(alertId, { actionPlans: plans });
  },

  addAlertLog: (alertId, action, actionName, comment) => {
    const newLog: AlertLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      alertId,
      action,
      actionName,
      operatorId: 'current-user',
      operatorName: '当前用户',
      comment,
      createdAt: formatDateTime(now()),
    };
    set((state) => ({
      alertLogs: [newLog, ...state.alertLogs],
    }));
  },

  getAlertsByType: (type) => get().alerts.filter((a) => a.type === type),

  getAlertsByLevel: (level) => get().alerts.filter((a) => a.level === level),

  getAlertsByStatus: (status) => get().alerts.filter((a) => a.status === status),

  getPendingApprovals: () => get().alerts.filter((a) => a.status === 'pending'),

  getStats: () => {
    const { alerts } = get();
    const total = alerts.length;
    const pending = alerts.filter((a) => a.status === 'pending').length;
    const processing = alerts.filter((a) => a.status === 'processing').length;
    const resolved = alerts.filter((a) => a.status === 'resolved' || a.status === 'closed').length;
    const critical = alerts.filter((a) => a.level === 'critical').length;
    const high = alerts.filter((a) => a.level === 'danger').length;
    const avgRisk = total > 0
      ? alerts.reduce((sum, a) => sum + a.riskScore, 0) / total
      : 0;

    return {
      total,
      pending,
      processing,
      resolved,
      critical,
      high,
      averageRiskScore: Number(avgRisk.toFixed(1)),
    };
  },
}));

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
