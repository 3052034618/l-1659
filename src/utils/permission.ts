import type { RoleType } from '../constants/config';
import { ROLES, getRoleDefinition } from '../constants/config';
import type { User } from '../types';
import type { UserInfo } from '../router';

type AnyUser = User | UserInfo | null | undefined;

const getUserRole = (user: AnyUser): RoleType | undefined => {
  if (!user) return undefined;
  const roleMap: Record<string, RoleType> = {
    'national': 'national_manager',
    'provincial': 'province_manager',
    'municipal': 'city_manager',
    'enterprise_qc': 'quality_inspector',
    'enterprise_prod': 'production_manager',
  };
  return roleMap[user.role as string] || (user.role as RoleType);
};

const getProvinceCode = (user: AnyUser): string | undefined => {
  if (!user) return undefined;
  if ('provinceCode' in user) return user.provinceCode;
  if ('region' in user && user.region) return user.region.province;
  return undefined;
};

const getCityCode = (user: AnyUser): string | undefined => {
  if (!user) return undefined;
  if ('cityCode' in user) return user.cityCode;
  if ('region' in user && user.region) return user.region.city;
  return undefined;
};

export const canViewAllProvinces = (user: AnyUser): boolean => {
  if (!user) return false;
  const role = getUserRole(user);
  if (!role) return false;
  const roleDef = getRoleDefinition(role);
  if (!roleDef) return false;
  return roleDef.permissions.includes('province:view:all');
};

export const canViewProvince = (
  user: AnyUser,
  provinceCode: string
): boolean => {
  if (!user) return false;
  if (canViewAllProvinces(user)) return true;
  const role = getUserRole(user);
  if (!role) return false;
  const roleDef = getRoleDefinition(role);
  if (!roleDef) return false;
  const userProv = getProvinceCode(user);
  if (roleDef.permissions.includes('province:view:assigned') || roleDef.permissions.includes('dashboard:view:province')) {
    return userProv === provinceCode;
  }
  if (roleDef.permissions.includes('city:view:assigned')) {
    return userProv === provinceCode;
  }
  return false;
};

export const canViewCity = (
  user: AnyUser,
  cityCode: string,
  provinceCode: string
): boolean => {
  if (!user) return false;
  if (canViewAllProvinces(user)) return true;
  const role = getUserRole(user);
  if (!role) return false;
  const roleDef = getRoleDefinition(role);
  if (!roleDef) return false;
  const userProv = getProvinceCode(user);
  const userCity = getCityCode(user);
  if (roleDef.permissions.includes('city:view:all')) return true;
  if (roleDef.permissions.includes('city:view:assigned')) {
    return userCity === cityCode;
  }
  if (roleDef.permissions.includes('province:view:assigned')) {
    return userProv === provinceCode;
  }
  return false;
};

export const canApprove = (
  user: AnyUser,
  level?: number
): boolean => {
  if (!user) return false;
  const role = getUserRole(user);
  if (!role) return false;
  const roleDef = getRoleDefinition(role);
  if (!roleDef) return false;
  if (roleDef.permissions.includes('alert:approve')) return true;
  if (typeof level === 'number') {
    return roleDef.permissions.includes(`alert:approve:level${level}`);
  }
  return roleDef.permissions.some((p) => p.startsWith('alert:approve'));
};

export const canApprovePlan = (user: AnyUser, level?: number): boolean => {
  if (!user) return false;
  const role = getUserRole(user);
  if (!role) return false;
  const roleDef = getRoleDefinition(role);
  if (!roleDef) return false;
  if (roleDef.permissions.includes('plan:approve')) return true;
  if (typeof level === 'number') {
    return roleDef.permissions.includes(`plan:approve:level${level}`);
  }
  return roleDef.permissions.some((p) => p.startsWith('plan:approve'));
};

export const canCreateAlert = (user: AnyUser): boolean => {
  if (!user) return false;
  const role = getUserRole(user);
  if (!role) return false;
  const roleDef = getRoleDefinition(role);
  if (!roleDef) return false;
  return roleDef.permissions.includes('alert:create');
};

export const canCloseAlert = (user: AnyUser): boolean => {
  if (!user) return false;
  const role = getUserRole(user);
  if (!role) return false;
  const roleDef = getRoleDefinition(role);
  if (!roleDef) return false;
  return roleDef.permissions.includes('alert:close');
};

export const canCreatePlan = (user: AnyUser): boolean => {
  if (!user) return false;
  const role = getUserRole(user);
  if (!role) return false;
  const roleDef = getRoleDefinition(role);
  if (!roleDef) return false;
  return roleDef.permissions.includes('plan:create');
};

export const canExportReport = (user: AnyUser): boolean => {
  if (!user) return false;
  const role = getUserRole(user);
  if (!role) return false;
  const roleDef = getRoleDefinition(role);
  if (!roleDef) return false;
  return (
    roleDef.permissions.includes('report:export') ||
    roleDef.permissions.some((p) => p.startsWith('report:export:'))
  );
};

export const canManageUser = (user: AnyUser): boolean => {
  if (!user) return false;
  const role = getUserRole(user);
  if (!role) return false;
  const roleDef = getRoleDefinition(role);
  if (!roleDef) return false;
  return roleDef.permissions.includes('user:manage');
};

export const canManageConfig = (user: AnyUser): boolean => {
  if (!user) return false;
  const role = getUserRole(user);
  if (!role) return false;
  const roleDef = getRoleDefinition(role);
  if (!roleDef) return false;
  return (
    roleDef.permissions.includes('config:manage') ||
    roleDef.permissions.includes('system:config'));
};

export const canQualityInspect = (user: AnyUser): boolean => {
  if (!user) return false;
  const role = getUserRole(user);
  if (!role) return false;
  const roleDef = getRoleDefinition(role);
  if (!roleDef) return false;
  return (
    roleDef.permissions.includes('quality:inspect') ||
    roleDef.permissions.some((p) => p.startsWith('quality:inspect:')));
};

export const canViewDashboard = (
  user: AnyUser
): boolean => {
  if (!user) return false;
  const role = getUserRole(user);
  if (!role) return false;
  const roleDef = getRoleDefinition(role);
  if (!roleDef) return false;
  return roleDef.permissions.some((p) => p.startsWith('dashboard:view:'));
};

export const canViewNationalDashboard = (
  user: AnyUser
): boolean => {
  if (!user) return false;
  const role = getUserRole(user);
  if (!role) return false;
  const roleDef = getRoleDefinition(role);
  if (!roleDef) return false;
  return roleDef.permissions.includes('dashboard:view:all');
};

export const hasPermission = (
  user: AnyUser,
  permission: string
): boolean => {
  if (!user) return false;
  const role = getUserRole(user);
  if (!role) return false;
  const roleDef = getRoleDefinition(role);
  if (!roleDef) return false;
  return roleDef.permissions.includes(permission);
};

export const hasAnyPermission = (
  user: AnyUser,
  permissions: string[]
): boolean => {
  if (!user) return false;
  const role = getUserRole(user);
  if (!role) return false;
  const roleDef = getRoleDefinition(role);
  if (!roleDef) return false;
  return permissions.some((p) => roleDef.permissions.includes(p));
};

export const hasAllPermissions = (
  user: AnyUser,
  permissions: string[]
): boolean => {
  if (!user) return false;
  const role = getUserRole(user);
  if (!role) return false;
  const roleDef = getRoleDefinition(role);
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
    production_manager: 60,
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
