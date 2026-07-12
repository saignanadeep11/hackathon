import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth.store';
import { useMutation } from '@vue/apollo-composable';
import { LoginDocument, RegisterDocument } from 'src/graphql/generated/graphql';
import type { AuthUser } from '../types/auth.types';

export function useAuth() {
  const router = useRouter();
  const authStore = useAuthStore();

  // ── Login ─────────────────────────────────────────────────────
  const {
    mutate: loginMutate,
    loading: loginLoading,
    error: loginError,
  } = useMutation(LoginDocument);

  async function login(email: string, password: string) {
    const result = await loginMutate({ input: { email, password } });
    if (result?.data?.login) {
      const { accessToken, user } = result.data.login;
      authStore.setSession(accessToken, user as AuthUser);
      await router.push('/dashboard');
    }
  }

  // ── Register ──────────────────────────────────────────────────
  const {
    mutate: registerMutate,
    loading: registerLoading,
    error: registerError,
  } = useMutation(RegisterDocument);

  async function register(name: string, email: string, password: string) {
    const result = await registerMutate({ input: { name, email, password } });
    if (result?.data?.register) {
      const { accessToken, user } = result.data.register;
      authStore.setSession(accessToken, user as AuthUser);
      await router.push('/dashboard');
    }
  }

  // ── Logout ────────────────────────────────────────────────────
  async function logout() {
    await authStore.clearSession();
    await router.push('/login');
  }

  return {
    login,
    loginLoading,
    loginError,
    register,
    registerLoading,
    registerError,
    logout,
  };
}
