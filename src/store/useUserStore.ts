import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import { ROLES, getRoleDefinition, hasPermission as hasRolePermission } from '../constants/config';
import type { RoleType } from '../constants/config';
import {
  canViewAllProvinces,
  canViewProvince,
  canViewCity,
  canApprove,
  canApprovePlan,
  canCreateAlert,
  canCloseAlert,
  canCreatePlan,
  canExportReport,
  canManageUser,
  canManageConfig,
  canQualityInspect,
  canViewDashboard,
  canViewNationalDashboard,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  isRoleHigherOrEqual,
} from '../utils/permission';
import { generateUsers } from '../utils/mock';
import { now, formatDateTime } from '../utils/date';

interface UserState {
  currentUser: User | null;
  allUsers: User[];
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  setCurrentUser: (user: User | null) => void;
  updateUserProfile: (updates: Partial<User>) => void;

  canViewAllProvinces: () => boolean;
  canViewProvince: (provinceCode: string) => boolean;
  canViewCity: (cityCode: string, provinceCode: string) => boolean;
  canApprove: (level?: number) => boolean;
  canApprovePlan: (level?: number) => boolean;
  canCreateAlert: () => boolean;
  canCloseAlert: () => boolean;
  canCreatePlan: () => boolean;
  canExportReport: () => boolean;
  canManageUser: () => boolean;
  canManageConfig: () => boolean;
  canQualityInspect: () => boolean;
  canViewDashboard: () => boolean;
  canViewNationalDashboard: () => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  isRoleHigherOrEqual: (role: RoleType) => boolean;

  getUserPermissions: () => string[];
  getRoleName: () => string;
  getAccessibleProvinceCodes: () => string[];
}

const initialUsers = generateUsers(15);

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      allUsers: initialUsers,
      isAuthenticated: false,
      isLoading: false,

      login: async (username: string, password: string) => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 600));

        const { allUsers } = get();
        const user = allUsers.find((u) => u.username === username.toLowerCase());

        if (!user) {
          set({ isLoading: false });
          return { success: false, message: '用户不存在' };
        }

        if (!user.isActive) {
          set({ isLoading: false });
          return { success: false, message: '账号已被禁用' };
        }

        const roleDef = getRoleDefinition(user.role);
        const userWithPerms: User = {
          ...user,
          permissions: roleDef?.permissions || [],
          lastLoginAt: formatDateTime(now()),
        };

        set({
          currentUser: userWithPerms,
          isAuthenticated: true,
          isLoading: false,
        });

        return { success: true, message: '登录成功' };
      },

      logout: () => {
        set({
          currentUser: null,
          isAuthenticated: false,
        });
      },

      setCurrentUser: (user) => {
        set({
          currentUser: user,
          isAuthenticated: !!user,
        });
      },

      updateUserProfile: (updates) => {
        const { currentUser, allUsers } = get();
        if (!currentUser) return;

        const updatedUser: User = { ...currentUser, ...updates };
        const updatedAllUsers = allUsers.map((u) =>
          u.id === currentUser.id ? updatedUser : u
        );

        set({
          currentUser: updatedUser,
          allUsers: updatedAllUsers,
        });
      },

      canViewAllProvinces: () => canViewAllProvinces(get().currentUser),
      canViewProvince: (provinceCode) => canViewProvince(get().currentUser, provinceCode),
      canViewCity: (cityCode, provinceCode) => canViewCity(get().currentUser, cityCode, provinceCode),
      canApprove: (level) => canApprove(get().currentUser, level),
      canApprovePlan: (level) => canApprovePlan(get().currentUser, level),
      canCreateAlert: () => canCreateAlert(get().currentUser),
      canCloseAlert: () => canCloseAlert(get().currentUser),
      canCreatePlan: () => canCreatePlan(get().currentUser),
      canExportReport: () => canExportReport(get().currentUser),
      canManageUser: () => canManageUser(get().currentUser),
      canManageConfig: () => canManageConfig(get().currentUser),
      canQualityInspect: () => canQualityInspect(get().currentUser),
      canViewDashboard: () => canViewDashboard(get().currentUser),
      canViewNationalDashboard: () => canViewNationalDashboard(get().currentUser),
      hasPermission: (permission) => hasPermission(get().currentUser, permission),
      hasAnyPermission: (permissions) => hasAnyPermission(get().currentUser, permissions),
      hasAllPermissions: (permissions) => hasAllPermissions(get().currentUser, permissions),
      isRoleHigherOrEqual: (role) => {
        const currentRole = get().currentUser?.role;
        if (!currentRole) return false;
        return isRoleHigherOrEqual(currentRole, role);
      },

      getUserPermissions: () => {
        const currentUser = get().currentUser;
        return currentUser?.permissions || [];
      },

      getRoleName: () => {
        const currentUser = get().currentUser;
        if (!currentUser) return '';
        const roleDef = getRoleDefinition(currentUser.role);
        return roleDef?.name || '';
      },

      getAccessibleProvinceCodes: () => {
        const currentUser = get().currentUser;
        if (!currentUser) return [];
        if (canViewAllProvinces(currentUser)) {
          return [];
        }
        if (currentUser.provinceCode) {
          return [currentUser.provinceCode];
        }
        return [];
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export { ROLES };
