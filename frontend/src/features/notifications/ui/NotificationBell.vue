<template>
  <q-btn flat round dense class="notif-bell">
    <lucide-icon name="bell" :size="20" />
    <q-badge v-if="unreadCount > 0" floating color="negative" rounded class="notif-badge">
      {{ unreadCount > 99 ? '99+' : unreadCount }}
    </q-badge>

    <!-- Dropdown Menu -->
    <q-menu
      anchor="bottom right"
      self="top right"
      :offset="[0, 8]"
      class="notif-menu"
      max-height="480px"
      style="min-width: 360px"
      @before-show="void refetchLogs()"
    >
      <!-- Header -->
      <div class="notif-menu-header row items-center justify-between q-px-md q-py-sm">
        <span class="text-subtitle2 text-white">Notifications</span>
        <div class="row items-center gap-sm">
          <q-btn
            v-if="unreadCount > 0"
            flat
            dense
            size="xs"
            label="Mark all read"
            color="primary"
            @click.stop="handleMarkAllRead"
            :loading="markLoading"
          />
        </div>
      </div>

      <q-separator dark />

      <!-- Log Items -->
      <q-list v-if="recentLogs.length > 0" separator>
        <q-item
          v-for="log in recentLogs"
          :key="log.id"
          class="notif-item"
          :class="{ 'notif-item--unread': !log.is_read }"
          clickable
        >
          <q-item-section avatar style="min-width: 36px">
            <div class="notif-icon" :class="`notif-icon--${log.type.toLowerCase()}`">
              <lucide-icon :name="typeIcon(log.type)" :size="14" />
            </div>
          </q-item-section>
          <q-item-section>
            <q-item-label class="notif-message text-white text-caption">
              {{ formatLogMessage(log.message) }}
            </q-item-label>
            <q-item-label caption class="text-grey-6">
              {{ formatTime(log.created_at) }}
            </q-item-label>
          </q-item-section>
          <q-item-section v-if="!log.is_read" side style="min-width: 8px">
            <div class="unread-dot" />
          </q-item-section>
        </q-item>
      </q-list>

      <div v-else class="q-pa-lg text-center text-grey-6">
        <lucide-icon name="bell-off" :size="28" class="q-mb-sm" />
        <p class="text-caption">No notifications yet</p>
      </div>

      <q-separator dark />

      <!-- Footer -->
      <div class="notif-menu-footer q-pa-sm text-center">
        <q-btn
          flat
          dense
          label="View All Notifications"
          color="primary"
          size="sm"
          to="/notifications"
          class="full-width"
        />
      </div>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import {
  useUnreadNotificationCount,
  useNotifications,
  useMarkAllNotificationsRead,
} from 'src/features/notifications/api/useNotifications';
import { formatLogMessage } from './utils';

const $q = useQuasar();
const router = useRouter();

const { unreadCount, refetch: refetchCount } = useUnreadNotificationCount();
const { logs, refetch: refetchLogs } = useNotifications();
const { markAllNotificationsRead, loading: markLoading } = useMarkAllNotificationsRead();

// Show only the last 8 in the dropdown
const recentLogs = computed(() => logs.value.slice(0, 8));

function typeColor(type: string): string {
  switch (type) {
    case 'ALLOCATION':
      return 'primary';
    case 'BOOKING':
      return 'positive';
    case 'MAINTENANCE':
      return 'purple';
    case 'AUDIT':
      return 'warning';
    default:
      return 'grey-7';
  }
}

const NOTIFICATION_SVGS: Record<string, string> = {
  ALLOCATION: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 8px; color: #3b82f6;"><path d="M16.5 9.4 7.55 4.24a1.79 1.79 0 0 0-1.8 0L2.5 6.1a1.8 1.8 0 0 0-1 1.6v6.6a1.8 1.8 0 0 0 1 1.6L5.75 18a1.79 1.79 0 0 0 1.8 0l8.95-5.16a1.8 1.8 0 0 0 1-1.6V7.7a1.8 1.8 0 0 0-1-1.6Z"/><path d="m2.5 6.1 7.5 4.3 7.5-4.3"/><path d="M10 10.4V20"/></svg>`,
  BOOKING: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 8px; color: #10b981;"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
  MAINTENANCE: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 8px; color: #a855f7;"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  AUDIT: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 8px; color: #f59e0b;"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>`,
  DEFAULT: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 8px; color: #3b82f6;"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`
};

function getNotificationHtml(type: string, message: string): string {
  const svg = NOTIFICATION_SVGS[type] || NOTIFICATION_SVGS.DEFAULT;
  return `<div class="row items-center no-wrap">${svg}<span style="font-size: 13px; line-height: 1.4; color: #f3f4f6;">${message}</span></div>`;
}

watch(unreadCount, (newVal, oldVal) => {
  if (oldVal !== undefined && newVal !== undefined && newVal > oldVal) {
    if (refetchLogs) {
      const promise = refetchLogs();
      if (promise) {
        void promise.then(() => {
        const newCount = newVal - oldVal;
        const newUnreadLogs = logs.value.slice(0, newCount);
        for (const log of newUnreadLogs) {
          $q.notify({
            message: getNotificationHtml(log.type, formatLogMessage(log.message)),
            html: true,
            position: 'top-right',
            timeout: 6000,
            color: 'dark',
            textColor: 'white',
            classes: 'glass-toast-notification',
            actions: [
              {
                label: 'View',
                color: typeColor(log.type),
                handler: () => {
                  void router.push('/notifications');
                },
              },
            ],
          });
        }
      });
    }
  }
}
});

function typeIcon(type: string): string {
  switch (type) {
    case 'ALLOCATION':
      return 'package';
    case 'BOOKING':
      return 'calendar';
    case 'MAINTENANCE':
      return 'wrench';
    case 'AUDIT':
      return 'clipboard-check';
    default:
      return 'bell';
  }
}

function formatTime(iso: unknown): string {
  const date = new Date(iso as string);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString();
}

async function handleMarkAllRead() {
  await markAllNotificationsRead();
  void refetchCount();
  void refetchLogs();
}
</script>

<style lang="scss" scoped>
.notif-bell {
  position: relative;
}

.notif-badge {
  font-size: 10px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
}

.notif-menu {
  background: $dark-card !important;
  border: 1px solid $glass-border;
  border-radius: $radius-md;
  overflow: hidden;

  .notif-menu-header {
    background: rgba(255, 255, 255, 0.03);
  }

  .notif-item {
    min-height: 48px;
    transition: background 0.15s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.04);
    }

    &--unread {
      background: rgba(59, 130, 246, 0.05);
    }

    .notif-message {
      line-height: 1.4;
      white-space: normal;
    }
  }

  .notif-icon {
    width: 28px;
    height: 28px;
    border-radius: $radius-sm;
    display: flex;
    align-items: center;
    justify-content: center;

    &--allocation {
      background: rgba(59, 130, 246, 0.15);
      color: $primary;
    }
    &--booking {
      background: rgba(16, 185, 129, 0.15);
      color: $positive;
    }
    &--maintenance {
      background: rgba(168, 85, 247, 0.15);
      color: $status-maintenance;
    }
    &--audit {
      background: rgba(245, 158, 11, 0.15);
      color: $warning;
    }
  }

  .unread-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: $primary;
  }

  .notif-menu-footer {
    background: rgba(255, 255, 255, 0.02);
  }
}
</style>

<style lang="scss">
.glass-toast-notification {
  background: rgba(19, 27, 46, 0.85) !important;
  backdrop-filter: blur(12px) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4) !important;
  border-radius: 8px !important;
}
</style>
