export enum UserRole {
  ADMIN            = 'ADMIN',
  ASSET_MANAGER    = 'ASSET_MANAGER',
  DEPARTMENT_HEAD  = 'DEPARTMENT_HEAD',
  EMPLOYEE         = 'EMPLOYEE',
}

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.ADMIN]:           'Administrator',
  [UserRole.ASSET_MANAGER]:   'Asset Manager',
  [UserRole.DEPARTMENT_HEAD]: 'Department Head',
  [UserRole.EMPLOYEE]:        'Employee',
};

export interface NavItem {
  label: string;
  icon: string;       // Lucide icon name
  route: string;
  roles: UserRole[];  // Empty array = accessible to all authenticated roles
}

// ──────────────────────────────────────────────────────────────
// NAVIGATION CONFIG
// Every nav link is defined here. The sidebar filters by role.
// ──────────────────────────────────────────────────────────────
export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    icon:  'layout-dashboard',
    route: '/dashboard',
    roles: [], // All authenticated users
  },
  {
    label: 'My Assets',
    icon:  'package',
    route: '/my-assets',
    roles: [UserRole.EMPLOYEE, UserRole.DEPARTMENT_HEAD],
  },
  {
    label: 'Asset Directory',
    icon:  'database',
    route: '/assets',
    roles: [UserRole.ADMIN, UserRole.ASSET_MANAGER],
  },
  {
    label: 'Allocations',
    icon:  'arrow-right-left',
    route: '/allocations',
    roles: [UserRole.ADMIN, UserRole.ASSET_MANAGER, UserRole.DEPARTMENT_HEAD],
  },
  {
    label: 'Bookings',
    icon:  'calendar',
    route: '/bookings',
    roles: [], // All authenticated users
  },
  {
    label: 'Maintenance',
    icon:  'wrench',
    route: '/maintenance',
    roles: [], // All authenticated users
  },
  {
    label: 'Audits',
    icon:  'shield-check',
    route: '/audits',
    roles: [UserRole.ADMIN, UserRole.ASSET_MANAGER],
  },
  {
    label: 'Organization Setup',
    icon:  'building-2',
    route: '/org',
    roles: [UserRole.ADMIN],
  },
  {
    label: 'Reports',
    icon:  'bar-chart-2',
    route: '/reports',
    roles: [UserRole.ADMIN, UserRole.ASSET_MANAGER],
  },
];

// ──────────────────────────────────────────────────────────────
// ROUTE PERMISSIONS
// Router guard reads this. Key = route path, Value = allowed roles.
// Empty array = all authenticated users are allowed.
// ──────────────────────────────────────────────────────────────
export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  '/dashboard':  [],
  '/my-assets':  [UserRole.EMPLOYEE, UserRole.DEPARTMENT_HEAD],
  '/assets':     [UserRole.ADMIN, UserRole.ASSET_MANAGER],
  '/allocations':[UserRole.ADMIN, UserRole.ASSET_MANAGER, UserRole.DEPARTMENT_HEAD],
  '/bookings':   [],
  '/maintenance':[],
  '/audits':     [UserRole.ADMIN, UserRole.ASSET_MANAGER],
  '/org':        [UserRole.ADMIN],
  '/reports':    [UserRole.ADMIN, UserRole.ASSET_MANAGER],
};
