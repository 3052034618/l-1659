import type { RoleType } from '../constants/config';
import { ROLES, getRoleDefinition } from '../constants/config';
import type { User } from '../types';

export const canViewAllProvinces = (user: User | null | undefined): boolean => {
  if (!user) return false;
  const roleDef = getRoleDefinition(user.role);
  if (!roleDef) return false;
  return roleDef.permissions.includes('province:view:all');
};

export const canViewProvince = (
  user: User | null | undefined,
  provinceCode: string
): boolean => {
  if (!user) return false;
  if (canViewAllProvinces(user)) return true;
  const roleDef = getRoleDefinition(user.role);
  if (!roleDef) return false;
  if (roleDef.permissions.includes('province:view:assigned') || roleDef.permissions.includes('dashboard:view:province')) {
    return user.provinceCode === provinceCode;
  }
  if (roleDef.permissions.includes('city:view:assigned')) {
    return user.provinceCode === provinceCode;
  }
  return false;
};

export const canViewCity = (
  user: User | null | undefined,
  cityCode: string,
  provinceCode: string
): boolean => {
  if (!user) return false;
  if (canViewAllProvinces(user)) return true;
  const roleDef = getRoleDefinition(user.role);
  if (!roleDef) return false;
  if (roleDef.permissions.includes('city:view:all')) return true;
  if (roleDef.permissions.includes('city:view:assigned')) {
    return user.cityCode === cityCode;
  }
  if (roleDef.permissions.includes('province:view:assigned')) {
    return user.provinceCode === provinceCode;
  }
  return false;
};

export const canApprove = (
  user: User | null | undefined,
  level?: number
): boolean => {
  if (!user) return false;
  const roleDef = getRoleDefinition(user.role);
  if (!roleDef) return false;
  if (roleDef.permissions.includes('alert:approve')) return true;
  if (typeof level === 'number') {
    return roleDef.permissions.includes(`alert:approve:level${level}`);
  }
  return roleDef.permissions.some((p) => p.startsWith('alert:approve'));
};

export const canApprovePlan = (user: User | null | undefined, level?: number): boolean => {
  if (!user) return false;
  const roleDef = getRoleDefinition(user.role);
  if (!roleDef) return false;
  if (roleDef.permissions.includes('plan:approve')) return true;
  if (typeof level === 'number') {
    return roleDef.permissions.includes(`plan:approve:level${level}`);
  }
  return roleDef.permissions.some((p) => p.startsWith('plan:approve'));
};

export const canCreateAlert = (user: User | null | undefined): boolean => {
  if (!user) return false;
  const roleDef = getRoleDefinition(user.role);
  if (!roleDef) return false;
  return roleDef.permissions.includes('alert:create');
};

export const canCloseAlert = (user: User | null | undefined): boolean => {
  if (!user) return false;
  const roleDef = getRoleDefinition(user.role);
  if (!roleDef) return false;
  return roleDef.permissions.includes('alert:close');
};

export const canCreatePlan = (user: User | null | undefined): boolean => {
  if (!user) return false;
  const roleDef = getRoleDefinition(user.role);
  if (!roleDef) return false;
  return roleDef.permissions.includes('plan:create');
};

export const canExportReport = (user: User | null | undefined): boolean => {
  if (!user) return false;
  const roleDef = getRoleDefinition(user.role);
  if (!roleDef) return false;
  return (
    roleDef.permissions.includes('report:export') ||
    roleDef.permissions.some((p) => p.startsWith('report:export:'))
  );
};

export const canManageUser = (user: User | null | undefined): boolean => {
  if (!user) return false;
  const roleDef = getRoleDefinition(user.role);
  if (!roleDef) return false;
  return roleDef.permissions.includes('user:manage');
};

export const canManageConfig = (user: User | null | undefined): boolean => {
  if (!user) return false;
  const roleDef = getRoleDefinition(user.role);
  if (!roleDef) return false;
  return (
    roleDef.permissions.includes('config:manage') ||
    roleDef.permissions.includes('system:config'));
};

export const canQualityInspect = (user: User | null | undefined): boolean => {
  if (!user) return false;
  const roleDef = getRoleDefinition(user.role);
  if (!roleDef) return false;
  return (
    roleDef.permissions.includes('quality:inspect') ||
    roleDef.permissions.some((p) => p.startsWith('quality:inspect:')));
};

export const canViewDashboard = (
  user: User | null | undefined
): boolean => {
  if (!user) return false;
  const roleDef = getRoleDefinition(user.role);
  if (!roleDef) return false;
  return roleDef.permissions.some((p) => p.startsWith('dashboard:view:'));
};

export const canViewNationalDashboard = (
  user: User | null | undefined
): boolean => {
  if (!user) return false;
  const roleDef = getRoleDefinition(user.role);
  if (!roleDef) return false;
  return roleDef.permissions.includes('dashboard:view:all');
};

export const hasPermission = (
  user: User | null | undefined,
  permission: string
): boolean => {
  if (!user) return false;
  const roleDef = getRoleDefinition(user.role);
  if (!roleDef) return false;
  return roleDef.permissions.includes(permission);
};

export const hasAnyPermission = (
  user: User | null | undefined,
  permissions: string[]
): boolean => {
  if (!user) return false;
  const roleDef = getRoleDefinition(user.role);
  if (!roleDef) return false;
  return permissions.some((p) => roleDef.permissions.includes(p));
};

export const hasAllPermissions = (
  user: User | null | undefined,
  permissions: string[]
): boolean => {
  if (!user) return false;
  const roleDef = getRoleDefinition(user.role);
  if (!roleDef) return false;
  return permissions.every((p) => roleDef.permissions.includes(p));
};

export const getRoleHierarchy = (role: RoleType): number => {
  const hierarchy: Record<RoleType, number> = {
    super_admin: 100,
    national_manager: 90,
    province_manager: 80,
    auditor: 75,
    city_manager: 70,
    quality_inspector: 60,
    viewer: 10,
  };
  return hierarchy[role] || 0;
};

export const isRoleHigherOrEqual = (
  role1: RoleType, role2: RoleType
): boolean => {
  return getRoleHierarchy(role1) >= getRoleHierarchy(role2);
};

export const getAllPermissions = (): RoleType[] => {
  return ROLES.map((r) => r.role);
};

export const getRolesByHierarchy = (minLevel: number): RoleType[] => {
  return ROLES.filter((r) => getRoleHierarchy(r.role) >= minLevel).map(
    (r) => r.role
  );
};
