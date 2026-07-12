import { defineStore } from 'pinia';
import { apolloClient } from 'src/boot/apollo';
import type { AuthUser } from 'src/features/auth/types/auth.types';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('assetflow_access_token') || (null as string | null),
    user: localStorage.getItem('assetflow_user')
      ? JSON.parse(localStorage.getItem('assetflow_user')!)
      : (null as AuthUser | null),
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
    currentRole: (state) => state.user?.role ?? null,
    currentUser: (state) => state.user,
  },
  actions: {
    setSession(token: string, user: AuthUser) {
      this.token = token;
      this.user = user;
      localStorage.setItem('assetflow_access_token', token);
      localStorage.setItem('assetflow_user', JSON.stringify(user));
    },
    async clearSession() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('assetflow_access_token');
      localStorage.removeItem('assetflow_user');
      await apolloClient.clearStore();
    },
  },
});
