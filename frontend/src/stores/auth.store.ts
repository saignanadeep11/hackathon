import { defineStore } from 'pinia';
import { apolloClient } from 'src/boot/apollo';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('access_token') || null,
    user: null as User | null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    login(token: string, user: User) {
      this.token = token;
      this.user = user;
      localStorage.setItem('access_token', token);
    },
    async logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('access_token');
      // Clear apollo cache
      await apolloClient.clearStore();
    }
  }
});
