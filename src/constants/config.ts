export type RoleType =
  | 'super_admin'
  | 'national_manager'
  | 'province_manager'
  | 'city_manager'
  | 'quality_inspector'
  | 'production_manager'
  | 'auditor'
  | 'viewer';

export interface RoleDefinition {
  role: RoleType;
  name: string;
  description: string;
  permissions: string[];
}

export interface AlertThreshold {
  qualityIssueRate: number;
  productionDecline: number;
  inventoryOverstock: number;
  inventoryShortage: number;
  satisfactionDrop: number;
}

export interface ApprovalConfig {
  alertApprovalRequired: boolean;
  alertApprovalLevels: number;
  planApprovalRequired: boolean;
  planApprovalLevels: number;
  autoApproveLowRisk: boolean;
  lowRiskThreshold: number;
}

export interface GlobalConfig {
  systemName: string;
  systemVersion: string;
  roles: RoleDefinition[];
  alertThresholds: AlertThreshold;
  approval: ApprovalConfig;
  dataRetentionDays: number;
  predictionDays: number;
  timezone: string;
  currencyUnit: string;
  volumeUnit: string;
}

export const ROLES: RoleDefinition[] = [
  {
    role: 'super_admin',
    name: '超级管理员',
    description: '拥有系统所有权限，负责系统配置和用户管理',
    permissions: [
      'user:manage',
      'role:manage',
      'config:manage',
      'dashboard:view:all',
      'province:view:all',
      'alert:create',
      'alert:view:all',
      'alert:approve',
      'alert:close',
      'plan:create',
      'plan:approve',
      'report:export',
      'quality:inspect',
      'data:manage',
      'system:config',
    ],
  },
  {
    role: 'national_manager',
    name: '全国管理员',
    description: '负责全国数据总览和跨省份协调',
    permissions: [
      'dashboard:view:all',
      'province:view:all',
      'alert:view:all',
      'alert:create',
      'alert:approve',
      'plan:create',
      'plan:view:all',
      'report:export',
      'quality:view',
    ],
  },
  {
    role: 'province_manager',
    name: '省级管理员',
    description: '负责所管辖省份的所有业务管理',
    permissions: [
      'dashboard:view:province',
      'province:view:assigned',
      'city:view:all',
      'alert:view:province',
      'alert:create',
      'alert:approve:level1',
      'plan:create',
      'plan:approve:level1',
      'report:export:province',
      'quality:inspect:province',
    ],
  },
  {
    role: 'city_manager',
    name: '市级管理员',
    description: '负责所管辖地市的业务管理',
    permissions: [
      'dashboard:view:city',
      'city:view:assigned',
      'alert:view:city',
      'alert:create',
      'plan:create',
      'report:export:city',
      'quality:view',
    ],
  },
  {
    role: 'quality_inspector',
    name: '质检员',
    description: '负责质量数据录入和质量检查',
    permissions: [
      'quality:inspect',
      'quality:create',
      'quality:edit',
      'alert:create',
      'alert:view:assigned',
      'report:view',
    ],
  },
  {
    role: 'auditor',
    name: '审批员',
    description: '负责预警和行动计划的审批',
    permissions: [
      'alert:view:all',
      'alert:approve',
      'plan:view:all',
      'plan:approve',
      'report:export',
    ],
  },
  {
    role: 'viewer',
    name: '观察员',
    description: '只读权限，仅可查看数据',
    permissions: [
      'dashboard:view:province',
      'alert:view:assigned',
      'report:view',
    ],
  },
];

export const ALERT_THRESHOLDS: AlertThreshold = {
  qualityIssueRate: 3.0,
  productionDecline: 15.0,
  inventoryOverstock: 120.0,
  inventoryShortage: 30.0,
  satisfactionDrop: 8.0,
};

export const APPROVAL_CONFIG: ApprovalConfig = {
  alertApprovalRequired: true,
  alertApprovalLevels: 3,
  planApprovalRequired: true,
  planApprovalLevels: 3,
  autoApproveLowRisk: true,
  lowRiskThreshold: 20,
};

export const GLOBAL_CONFIG: GlobalConfig = {
  systemName: '酒类智能监测平台',
  systemVersion: '1.0.0',
  roles: ROLES,
  alertThresholds: ALERT_THRESHOLDS,
  approval: APPROVAL_CONFIG,
  dataRetentionDays: 365,
  predictionDays: 90,
  timezone: 'Asia/Shanghai',
  currencyUnit: '万元',
  volumeUnit: '万千升',
};

export const getRoleDefinition = (role: RoleType): RoleDefinition | undefined => {
  return ROLES.find((r) => r.role === role);
};

export const getRoleName = (role: RoleType): string => {
  return getRoleDefinition(role)?.name || role;
};

export const hasPermission = (
  userRole: RoleType,
  permission: string
): boolean => {
  const roleDef = getRoleDefinition(userRole);
  if (!roleDef) return false;
  return roleDef.permissions.includes(permission);
};
