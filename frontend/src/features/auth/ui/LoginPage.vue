<template>
  <q-page class="login-page flex flex-center">
    <!-- Background grid effect -->
    <div class="bg-grid" />

    <div class="login-card q-pa-xl">
      <!-- Brand -->
      <div class="brand q-mb-xl text-center">
        <div class="brand-logo">
          <lucide-icon name="box" :size="32" color="#3b82f6" />
        </div>
        <h1 class="brand-name">AssetFlow</h1>
        <p class="brand-tagline">Enterprise Asset Management</p>
      </div>

      <!-- Tabs -->
      <q-tabs
        v-model="activeTab"
        dense
        class="login-tabs q-mb-lg"
        indicator-color="primary"
        align="justify"
      >
        <q-tab name="login" label="Sign In" />
        <q-tab name="register" label="Register" />
      </q-tabs>

      <!-- Login Form -->
      <q-tab-panels v-model="activeTab" animated class="bg-transparent">
        <q-tab-panel name="login" class="q-pa-none">
          <q-form @submit.prevent="handleLogin">
            <q-input
              v-model="loginForm.email"
              type="email"
              label="Email address"
              outlined
              dark
              class="q-mb-md"
              :rules="[emailRule]"
            >
              <template #prepend><lucide-icon name="mail" :size="16" /></template>
            </q-input>
            <q-input
              v-model="loginForm.password"
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              outlined
              dark
              class="q-mb-lg"
              :rules="[requiredRule]"
            >
              <template #prepend><lucide-icon name="lock" :size="16" /></template>
              <template #append>
                <div class="cursor-pointer flex flex-center" @click="showPassword = !showPassword">
                  <lucide-icon :name="showPassword ? 'eye-off' : 'eye'" :size="16" />
                </div>
              </template>
            </q-input>
            <q-btn
              type="submit"
              label="Sign In"
              color="primary"
              class="full-width login-btn"
              :loading="loginLoading"
              unelevated
            />
          </q-form>
        </q-tab-panel>

        <!-- Register Form -->
        <q-tab-panel name="register" class="q-pa-none">
          <q-form @submit.prevent="handleRegister">
            <q-input
              v-model="registerForm.name"
              label="Full Name"
              outlined
              dark
              class="q-mb-md"
              :rules="[requiredRule]"
            >
              <template #prepend><lucide-icon name="user" :size="16" /></template>
            </q-input>
            <q-input
              v-model="registerForm.email"
              type="email"
              label="Email address"
              outlined
              dark
              class="q-mb-md"
              :rules="[emailRule]"
            >
              <template #prepend><lucide-icon name="mail" :size="16" /></template>
            </q-input>
            <q-input
              v-model="registerForm.password"
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              outlined
              dark
              class="q-mb-md"
              :rules="[minLengthRule]"
            >
              <template #prepend><lucide-icon name="lock" :size="16" /></template>
            </q-input>
            <q-input
              v-model="registerForm.confirm"
              :type="showPassword ? 'text' : 'password'"
              label="Confirm Password"
              outlined
              dark
              class="q-mb-lg"
              :rules="[confirmRule]"
            >
              <template #prepend><lucide-icon name="lock" :size="16" /></template>
            </q-input>
            <q-btn
              type="submit"
              label="Create Account"
              color="primary"
              class="full-width login-btn"
              :loading="registerLoading"
              unelevated
            />
          </q-form>
        </q-tab-panel>
      </q-tab-panels>

      <!-- Error banner -->
      <q-banner v-if="errorMessage" class="error-banner q-mt-md" rounded>
        <template #avatar><lucide-icon name="alert-circle" :size="16" color="#ef4444" /></template>
        {{ errorMessage }}
      </q-banner>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuth } from '../api/useAuth';

const activeTab = ref<'login' | 'register'>('login');
const showPassword = ref(false);

const loginForm = ref({ email: '', password: '' });
const registerForm = ref({ name: '', email: '', password: '', confirm: '' });

const { login, loginLoading, loginError, register, registerLoading, registerError } = useAuth();

const errorMessage = computed(() => {
  const err = loginError.value || registerError.value;
  return err?.graphQLErrors?.[0]?.message || (err ? 'An unexpected error occurred' : null);
});

// Validation rules
const emailRule = (v: string) => /.+@.+\..+/.test(v) || 'Valid email required';
const requiredRule = (v: string) => !!v?.trim() || 'This field is required';
const minLengthRule = (v: string) => v?.length >= 6 || 'Minimum 6 characters';
const confirmRule = (v: string) => v === registerForm.value.password || 'Passwords do not match';

async function handleLogin() {
  await login(loginForm.value.email, loginForm.value.password);
}

async function handleRegister() {
  await register(registerForm.value.name, registerForm.value.email, registerForm.value.password);
}
</script>

<style lang="scss" scoped>
.login-page {
  background: $dark-page;
  min-height: 100vh;
  position: relative;
  overflow: hidden;

  .bg-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(59, 130, 246, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(59, 130, 246, 0.04) 1px, transparent 1px);
    background-size: 48px 48px;
  }
}

.login-card {
  position: relative;
  z-index: 1;
  width: 420px;
  background: $glass-bg;
  border: 1px solid $glass-border;
  border-radius: $radius-lg;
  backdrop-filter: blur($glass-blur);
  box-shadow: $shadow-md;
}

.brand {
  .brand-logo {
    margin: 0 auto 12px;
    width: 56px;
    height: 56px;
    background: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.3);
    border-radius: $radius-md;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .brand-name {
    font-size: 24px;
    font-weight: 700;
    color: #fff;
    margin: 0;
  }
  .brand-tagline {
    color: $grey-5;
    font-size: 13px;
    margin: 4px 0 0;
  }
}

.login-tabs {
  border-bottom: 1px solid $glass-border;
}

.login-btn {
  height: 44px;
  border-radius: $radius-md;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.error-banner {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  font-size: 13px;
}
</style>
