import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import routes from './routes';
import { useAuthStore } from 'src/stores/auth.store';
import { ROUTE_PERMISSIONS } from 'src/config/permissions';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route((/* { store, ssrContext } */) => {
  const createHistory = import.meta.env.QUASAR_SERVER
    ? createMemoryHistory
    : import.meta.env.QUASAR_VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(import.meta.env.QUASAR_VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, _from, next) => {
    const authStore = useAuthStore();
    const requiresAuth = to.matched.some((r) => r.meta.requiresAuth);
    const isGuestOnly = to.matched.some((r) => r.meta.guest);

    // Redirect logged-in users away from /login
    if (isGuestOnly && authStore.isLoggedIn) {
      return next('/dashboard');
    }

    // Redirect unauthenticated users to /login
    if (requiresAuth && !authStore.isLoggedIn) {
      return next('/login');
    }

    // Role-based access: check ROUTE_PERMISSIONS
    if (authStore.isLoggedIn && authStore.currentRole) {
      const allowedRoles = ROUTE_PERMISSIONS[to.path];
      // allowedRoles === undefined means route not listed (allow through)
      // allowedRoles === [] means all authenticated roles allowed
      if (allowedRoles !== undefined && allowedRoles.length > 0) {
        if (!allowedRoles.includes(authStore.currentRole)) {
          return next('/dashboard'); // Redirect to safe default
        }
      }
    }

    next();
  });

  return Router;
});
