<template>
  <q-page class="login-page flex flex-center">
    <!-- Background environment -->
    <div class="bg-environment">
      <div class="bg-grid" />
      <div class="floating-orb orb-primary" />
      <div class="floating-orb orb-accent" />
    </div>

    <div class="login-card">
      <!-- Brand -->
      <div class="brand text-center">
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
        active-color="white"
        inactive-color="grey-5"
      >
        <q-tab name="login" label="Sign In" />
        <q-tab name="register" label="Register" />
      </q-tabs>

      <q-tab-panels v-model="activeTab" animated class="login-panels">
        <!-- Login Form -->
        <q-tab-panel name="login" class="q-pa-none">
          <q-form @submit.prevent="handleLogin">
            <q-input
              v-model="loginForm.email"
              type="email"
              label="Email address"
              outlined
              dark
              class="login-input q-mb-md"
              :rules="[emailRule]"
              hide-bottom-space
            >
              <template #prepend>
                <lucide-icon name="mail" :size="20" color="#64748b" />
              </template>
            </q-input>

            <q-input
              v-model="loginForm.password"
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              outlined
              dark
              class="login-input q-mb-md"
              :rules="[requiredRule]"
              hide-bottom-space
            >
              <template #prepend>
                <lucide-icon name="lock" :size="20" color="#64748b" />
              </template>
              <template #append>
                <q-btn
                  flat
                  round
                  dense
                  class="password-toggle"
                  @click="showPassword = !showPassword"
                >
                  <lucide-icon :name="showPassword ? 'eye-off' : 'eye'" :size="20" />
                </q-btn>
              </template>
            </q-input>

            <div class="form-row q-mb-lg">
              <q-checkbox v-model="rememberMe" dark class="remember-checkbox" label="Remember me" />
              <a href="#" class="forgot-link">Forgot password?</a>
            </div>

            <q-btn
              type="submit"
              label="Sign In to Dashboard"
              color="primary"
              class="full-width login-btn"
              :loading="loginLoading"
              unelevated
            />
          </q-form>

          <div class="divider q-my-lg">
            <div class="divider-line" />
            <span class="divider-text">or</span>
            <div class="divider-line" />
          </div>

          <q-btn
            flat
            class="full-width sso-btn"
            @click="handleSso"
          >
            <lucide-icon name="fingerprint" :size="20" class="q-mr-sm" />
            Authenticate with SSO
          </q-btn>
        </q-tab-panel>

        <!-- Register Form -->
        <q-tab-panel name="register" class="q-pa-none">
          <q-form @submit.prevent="handleRegister">
            <q-input
              v-model="registerForm.name"
              label="Full Name"
              outlined
              dark
              class="login-input q-mb-md"
              :rules="[requiredRule]"
              hide-bottom-space
            >
              <template #prepend>
                <lucide-icon name="user" :size="20" color="#64748b" />
              </template>
            </q-input>

            <q-input
              v-model="registerForm.email"
              type="email"
              label="Email address"
              outlined
              dark
              class="login-input q-mb-md"
              :rules="[emailRule]"
              hide-bottom-space
            >
              <template #prepend>
                <lucide-icon name="mail" :size="20" color="#64748b" />
              </template>
            </q-input>

            <q-input
              v-model="registerForm.password"
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              outlined
              dark
              class="login-input q-mb-md"
              :rules="[minLengthRule]"
              hide-bottom-space
            >
              <template #prepend>
                <lucide-icon name="lock" :size="20" color="#64748b" />
              </template>
              <template #append>
                <q-btn
                  flat
                  round
                  dense
                  class="password-toggle"
                  @click="showPassword = !showPassword"
                >
                  <lucide-icon :name="showPassword ? 'eye-off' : 'eye'" :size="20" />
                </q-btn>
              </template>
            </q-input>

            <q-input
              v-model="registerForm.confirm"
              :type="showPassword ? 'text' : 'password'"
              label="Confirm Password"
              outlined
              dark
              class="login-input q-mb-lg"
              :rules="[confirmRule]"
              hide-bottom-space
            >
              <template #prepend>
                <lucide-icon name="lock" :size="20" color="#64748b" />
              </template>
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
        <template #avatar>
          <lucide-icon name="alert-circle" :size="20" color="#ef4444" />
        </template>
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
const rememberMe = ref(false);

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

function handleSso() {
  // TODO: wire up SSO authentication
}
</script>

<style lang="scss" scoped>
.login-page {
  background: $dark-page;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.bg-environment {
  position: fixed;
  inset: 0;
  background: radial-gradient(circle at 50% -20%, rgba(59, 130, 246, 0.15) 0%, transparent 60%);
  z-index: 0;
  pointer-events: none;
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(circle at center, black, transparent 80%);
}

.floating-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.1;
  pointer-events: none;
}

.orb-primary {
  width: 400px;
  height: 400px;
  top: -80px;
  left: -80px;
  background: $primary;
}

.orb-accent {
  width: 300px;
  height: 300px;
  bottom: 0;
  right: -40px;
  background: $accent;
}

.login-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  padding: 48px;
  background: $glass-bg;
  border: 1px solid $glass-border;
  border-radius: $radius-lg;
  backdrop-filter: blur($glass-blur);
  box-shadow: $shadow-md;
}

.brand {
  margin-bottom: 32px;

  .brand-logo {
    margin: 0 auto 16px;
    width: 56px;
    height: 56px;
    background: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.3);
    border-radius: $radius-md;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
  }

  .brand-name {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 36px;
    font-weight: 700;
    color: #fff;
    margin: 0;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }

  .brand-tagline {
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: $grey-5;
    font-size: 13px;
    font-weight: 500;
    margin: 4px 0 0;
    line-height: 1.4;
  }
}

.login-tabs {
  border-bottom: 1px solid $glass-border;
  margin-bottom: 24px;

  :deep(.q-tab__label) {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    text-transform: none;
  }
}

.login-panels {
  background: transparent;

  :deep(.q-panel) {
    background: transparent;
  }
}

.login-input {
  :deep(.q-field__control) {
    background: $dark;
    border-radius: $radius-md;
    border: 1px solid $glass-border;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  :deep(.q-field__control:before) {
    border: none;
  }

  :deep(.q-field__control:after) {
    display: none;
  }

  :deep(.q-field__label) {
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: $grey-5;
    font-size: 14px;
  }

  :deep(.q-field__native) {
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #fff;
    font-size: 14px;

    &::placeholder {
      color: $grey-8;
    }
  }

  :deep(.q-field--focused .q-field__control) {
    border-color: $primary;
    box-shadow: $focus-glow;
  }

  :deep(.q-field--error .q-field__control) {
    border-color: $negative;
  }

  :deep(.q-field__bottom) {
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: $negative;
    font-size: 12px;
    padding-top: 4px;
  }
}

.password-toggle {
  color: $grey-5;
  transition: color 0.2s ease;

  &:hover {
    color: #fff;
  }
}

.form-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.remember-checkbox {
  :deep(.q-checkbox__label) {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
  }
}

.forgot-link {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #fff;
    text-decoration: underline;
  }
}

.login-btn {
  height: 48px;
  border-radius: $radius-md;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.3px;
  background: linear-gradient(135deg, $primary 0%, $accent 100%);
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.25);

  &:hover {
    transform: scale(1.02);
  }
}

.divider {
  display: flex;
  align-items: center;
  gap: 16px;

  .divider-line {
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.05);
  }

  .divider-text {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 10px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.2);
    text-transform: uppercase;
    letter-spacing: 0.15em;
  }
}

.sso-btn {
  height: 44px;
  border-radius: $radius-md;
  border: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(255, 255, 255, 0.05);
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  text-transform: none;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
}

.error-banner {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  font-size: 13px;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
</style>
