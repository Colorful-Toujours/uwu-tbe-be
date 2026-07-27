export const PERMISSION_CODES = {
  USER_READ: 'user:read',
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  PERMISSION_MANAGE: 'permission:manage',
  ROLE_MANAGE: 'role:manage',
} as const;

export type PermissionCode =
  (typeof PERMISSION_CODES)[keyof typeof PERMISSION_CODES];

export const ALL_PERMISSION_CODES: PermissionCode[] =
  Object.values(PERMISSION_CODES);

export const PERMISSION_DEFINITIONS: Array<{
  code: PermissionCode;
  name: string;
  description: string;
}> = [
  {
    code: PERMISSION_CODES.USER_READ,
    name: '查看用户',
    description: '查看用户列表和详情',
  },
  {
    code: PERMISSION_CODES.USER_CREATE,
    name: '创建用户',
    description: '创建新用户',
  },
  {
    code: PERMISSION_CODES.USER_UPDATE,
    name: '更新用户',
    description: '更新用户信息',
  },
  {
    code: PERMISSION_CODES.USER_DELETE,
    name: '删除用户',
    description: '删除用户',
  },
  {
    code: PERMISSION_CODES.PERMISSION_MANAGE,
    name: '管理权限',
    description: '管理权限定义',
  },
  {
    code: PERMISSION_CODES.ROLE_MANAGE,
    name: '管理角色',
    description: '管理角色及角色权限、用户角色分配',
  },
];

export const ROLE_CODES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;
