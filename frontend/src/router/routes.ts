import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  // ── Public routes (no sidebar) ─────────────────────────────────
  {
    path: '/login',
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('src/features/auth/ui/LoginPage.vue') }],
    meta: { guest: true },
  },

  // ── Protected routes (with sidebar) ───────────────────────────
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', component: () => import('src/features/dashboard/ui/DashboardPage.vue') },
      { path: 'org', component: () => import('src/features/organization/ui/OrgSetup.vue') },
      { path: 'assets', component: () => import('src/features/assets/ui/AssetDirectoryPage.vue') },
    ],
  },

  { path: '/:catchAll(.*)*', component: () => import('pages/ErrorNotFound.vue') },
];

export default routes;
