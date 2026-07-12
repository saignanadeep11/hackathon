<template>
  <q-btn flat round dense class="notif-bell">
    <lucide-icon name="bell" :size="20" />
    <q-badge
      v-if="unreadCount > 0"
      floating
      color="negative"
      rounded
      class="notif-badge"
    >
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
              {{ log.message }}
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
import { computed } from 'vue';
import { useUnreadNotificationCount, useNotifications, useMarkAllNotificationsRead } from 'src/features/notifications/api/useNotifications';

const { unreadCount, refetch: refetchCount } = useUnreadNotificationCount();
const { logs, refetch: refetchLogs } = useNotifications();
const { markAllNotificationsRead, loading: markLoading } = useMarkAllNotificationsRead();

// Show only the last 8 in the dropdown
const recentLogs = computed(() => logs.value.slice(0, 8));

function typeIcon(type: string): string {
  switch (type) {
    case 'ALLOCATION': return 'package';
    case 'BOOKING': return 'calendar';
    case 'MAINTENANCE': return 'wrench';
    case 'AUDIT': return 'clipboard-check';
    default: return 'bell';
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
