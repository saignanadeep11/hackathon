<template>
  <q-layout view="lHh Lpr lFf" class="app-layout">
    <!-- Sidebar -->
    <q-drawer v-model="drawerOpen" show-if-above :width="240" class="app-sidebar">
      <!-- Brand -->
      <div class="sidebar-brand q-px-md q-py-lg">
        <div class="brand-icon"><lucide-icon name="box" :size="20" color="#3b82f6" /></div>
        <span class="brand-text">AssetFlow</span>
      </div>

      <!-- Navigation -->
      <q-list class="sidebar-nav q-px-sm">
        <template v-for="item in visibleNavItems" :key="item.route">
          <q-item :to="item.route" exact active-class="nav-item--active" class="nav-item">
            <q-item-section avatar>
              <lucide-icon :name="item.icon" :size="18" />
            </q-item-section>
            <q-item-section>{{ item.label }}</q-item-section>
          </q-item>
        </template>
      </q-list>

      <!-- Sidebar Footer: User Info -->
      <div class="sidebar-footer q-px-md q-py-md">
        <div class="user-info q-mb-sm">
          <q-avatar size="32px" color="primary" text-color="white" class="q-mr-sm">
            {{ userInitials }}
          </q-avatar>
          <div class="user-details">
            <div class="user-name">{{ authStore.currentUser?.name }}</div>
            <div class="user-role">{{ roleLabel }}</div>
          </div>
        </div>
        <q-btn flat dense class="logout-btn full-width" @click="handleLogout">
          <lucide-icon name="log-out" :size="16" class="q-mr-sm" />
          Sign Out
        </q-btn>
      </div>
    </q-drawer>

    <!-- Header -->
    <q-header class="app-header">
      <q-toolbar>
        <q-btn flat round dense @click="drawerOpen = !drawerOpen">
          <lucide-icon name="menu" :size="20" />
        </q-btn>
        <q-space />
        <q-btn flat round dense>
          <lucide-icon name="bell" :size="20" />
          <q-badge floating color="negative" rounded>3</q-badge>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from 'src/stores/auth.store';
import { NAV_ITEMS, ROLE_LABELS } from 'src/config/permissions';
import { useAuth } from 'src/features/auth/api/useAuth';

const drawerOpen = ref(true);
const authStore = useAuthStore();
const { logout } = useAuth();

const visibleNavItems = computed(() =>
  NAV_ITEMS.filter(
    (item) =>
      item.roles.length === 0 ||
      (authStore.currentRole && item.roles.includes(authStore.currentRole)),
  ),
);

const userInitials = computed(() => {
  const name = authStore.currentUser?.name || '';
  return name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

const roleLabel = computed(() =>
  authStore.currentRole ? ROLE_LABELS[authStore.currentRole as keyof typeof ROLE_LABELS] : '',
);

async function handleLogout() {
  await logout();
}
</script>

<style lang="scss" scoped>
.app-layout {
  background: $dark-page;
}

.app-sidebar {
  background: $dark-card !important;
  border-right: 1px solid $glass-border !important;

  .sidebar-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid $glass-border;
    .brand-icon {
      width: 36px;
      height: 36px;
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid rgba(59, 130, 246, 0.3);
      border-radius: $radius-sm;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .brand-text {
      font-size: 18px;
      font-weight: 700;
      color: #fff;
      letter-spacing: -0.3px;
    }
  }

  .sidebar-nav {
    flex: 1;
    .nav-item {
      border-radius: $radius-sm;
      margin-bottom: 2px;
      color: $grey-5;
      min-height: 40px;
      font-size: 14px;
      &:hover {
        background: rgba(255, 255, 255, 0.04);
        color: #fff;
      }
      &--active {
        background: rgba(59, 130, 246, 0.12) !important;
        color: $primary !important;
        border-left: 3px solid $primary;
      }
    }
  }

  .sidebar-footer {
    border-top: 1px solid $glass-border;
    margin-top: auto;
    .user-info {
      display: flex;
      align-items: center;
    }
    .user-name {
      font-size: 13px;
      font-weight: 600;
      color: #fff;
      line-height: 1.2;
    }
    .user-role {
      font-size: 11px;
      color: $grey-5;
    }
    .logout-btn {
      color: $grey-5;
      font-size: 13px;
      justify-content: flex-start;
      &:hover {
        color: $negative;
      }
    }
  }
}

.app-header {
  background: rgba(6, 14, 32, 0.8) !important;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid $glass-border;
}
</style>
