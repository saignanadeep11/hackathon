<template>
  <q-page class="notifications-page q-pa-lg">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h5 text-white q-mb-xs" style="font-weight: 700">Activity Log</h1>
        <p class="text-grey-5 text-caption">System-wide record of all actions</p>
      </div>
      <div class="row items-center gap-md">
        <!-- Type Filter -->
        <q-select
          v-model="selectedType"
          :options="typeOptions"
          dense
          outlined
          dark
          clearable
          emit-value
          map-options
          label="Filter by type"
          style="min-width: 180px"
          class="filter-select"
        />
        <q-btn
          v-if="hasUnread"
          unelevated
          color="primary"
          label="Mark All Read"
          size="sm"
          :loading="markLoading"
          @click="handleMarkAllRead"
        >
          <lucide-icon name="check-check" :size="14" class="q-ml-xs" />
        </q-btn>
      </div>
    </div>

    <!-- Log Timeline -->
    <q-card class="log-card" flat bordered>
      <q-card-section class="q-pa-none">
        <q-list v-if="!loading && logs.length > 0" separator>
          <q-item
            v-for="log in logs"
            :key="log.id"
            class="log-item"
            :class="{ 'log-item--unread': !log.is_read }"
          >
            <!-- Icon -->
            <q-item-section avatar style="min-width: 44px">
              <div class="log-icon" :class="`log-icon--${log.type.toLowerCase()}`">
                <lucide-icon :name="typeIcon(log.type)" :size="16" />
              </div>
            </q-item-section>

            <!-- Content -->
            <q-item-section>
              <q-item-label class="text-white" style="font-size: 14px; line-height: 1.4">
                {{ formatLogMessage(log.message) }}
              </q-item-label>
              <q-item-label caption class="q-mt-xs row items-center gap-sm">
                <q-chip
                  :color="typeColor(log.type)"
                  text-color="white"
                  dense
                  size="xs"
                  class="q-mr-xs"
                >
                  {{ log.type }}
                </q-chip>
                <span class="text-grey-6">by {{ log.actor?.name || 'System' }}</span>
                <span class="text-grey-7">·</span>
                <span class="text-grey-6">{{ formatDateTime(log.created_at) }}</span>
              </q-item-label>
            </q-item-section>

            <!-- Read indicator -->
            <q-item-section side>
              <div v-if="!log.is_read" class="unread-pill">NEW</div>
              <lucide-icon v-else name="check" :size="14" class="text-grey-7" />
            </q-item-section>
          </q-item>
        </q-list>

        <!-- Empty -->
        <div v-else-if="!loading" class="empty-state q-pa-xl text-center">
          <lucide-icon name="activity" :size="48" class="text-grey-7 q-mb-md" />
          <p class="text-h6 text-grey-5 q-mb-sm">No activity logs found</p>
          <p class="text-caption text-grey-6">
            {{
              selectedType
                ? 'Try clearing the filter to see all logs.'
                : 'Actions on assets, bookings, and maintenance will appear here.'
            }}
          </p>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="q-pa-xl text-center">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  useNotifications,
  useMarkAllNotificationsRead,
} from 'src/features/notifications/api/useNotifications';
import { formatLogMessage } from './utils';
import type { ActivityLogFilterInput } from 'src/graphql/generated/graphql';

const selectedType = ref<string | null>(null);

const filter = computed<ActivityLogFilterInput>(() => ({
  type: (selectedType.value as ActivityLogFilterInput['type']) ?? undefined,
}));

const { logs, loading, refetch } = useNotifications(filter);
const { markAllNotificationsRead, loading: markLoading } = useMarkAllNotificationsRead();

const hasUnread = computed(() => logs.value.some((l) => !l.is_read));

const typeOptions = [
  { label: 'Allocation', value: 'ALLOCATION' },
  { label: 'Booking', value: 'BOOKING' },
  { label: 'Maintenance', value: 'MAINTENANCE' },
  { label: 'Audit', value: 'AUDIT' },
];

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
      return 'activity';
  }
}

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

function formatDateTime(iso: unknown): string {
  const date = new Date(iso as string);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

async function handleMarkAllRead() {
  await markAllNotificationsRead();
  void refetch();
}
</script>

<style lang="scss" scoped>
.notifications-page {
  max-width: 860px;
  margin: 0 auto;
}

.filter-select {
  :deep(.q-field__control) {
    background: $dark-card;
    border-color: $glass-border;
    border-radius: $radius-sm;
  }
  :deep(.q-field__label),
  :deep(.q-field__native) {
    color: $grey-4;
  }
}

.log-card {
  background: $dark-card !important;
  border: 1px solid $glass-border !important;
  border-radius: $radius-md;
  overflow: hidden;
}

.log-item {
  min-height: 64px;
  transition: background 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }

  &--unread {
    background: rgba(59, 130, 246, 0.04);
    border-left: 2px solid $primary;
  }
}

.log-icon {
  width: 36px;
  height: 36px;
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

.unread-pill {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: $primary;
  background: rgba(59, 130, 246, 0.15);
  padding: 2px 6px;
  border-radius: 20px;
}

.empty-state {
  color: $grey-6;
}
</style>
