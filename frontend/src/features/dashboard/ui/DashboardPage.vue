<template>
  <q-page class="dashboard-page q-pa-lg">
    <!-- Page Header -->
    <div class="row items-center justify-between q-mb-xl">
      <div>
        <h1 class="text-h5 text-white q-mb-xs" style="font-weight: 700">Dashboard</h1>
        <p class="text-grey-5 text-caption">Real-time operational snapshot</p>
      </div>
      <q-btn flat round dense @click="void refetch()" :loading="loading" class="text-grey-5">
        <lucide-icon name="refresh-cw" :size="18" />
        <q-tooltip>Refresh</q-tooltip>
      </q-btn>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !metrics" class="q-pa-xl text-center">
      <q-spinner-dots color="primary" size="48px" />
    </div>

    <template v-if="metrics">
      <!-- Row 1: Asset Health KPIs -->
      <div class="kpi-grid q-mb-lg">
        <div class="kpi-card kpi-card--total">
          <div class="kpi-icon">
            <lucide-icon name="package" :size="22" />
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ metrics.totalAssets }}</div>
            <div class="kpi-label">Total Assets</div>
          </div>
          <div class="kpi-trend">
            <q-linear-progress
              :value="1"
              color="grey-7"
              track-color="transparent"
              size="3px"
              class="q-mt-sm"
            />
          </div>
        </div>

        <div class="kpi-card kpi-card--available">
          <div class="kpi-icon">
            <lucide-icon name="check-circle" :size="22" />
          </div>
          <div class="kpi-content">
            <div class="kpi-value text-positive">{{ metrics.availableAssets }}</div>
            <div class="kpi-label">Available</div>
          </div>
          <div class="kpi-bar">
            <q-linear-progress
              :value="metrics.totalAssets > 0 ? metrics.availableAssets / metrics.totalAssets : 0"
              color="positive"
              track-color="transparent"
              size="3px"
              class="q-mt-sm"
            />
          </div>
        </div>

        <div class="kpi-card kpi-card--allocated">
          <div class="kpi-icon">
            <lucide-icon name="user-check" :size="22" />
          </div>
          <div class="kpi-content">
            <div class="kpi-value text-info">{{ metrics.allocatedAssets }}</div>
            <div class="kpi-label">Allocated</div>
          </div>
          <div class="kpi-bar">
            <q-linear-progress
              :value="metrics.totalAssets > 0 ? metrics.allocatedAssets / metrics.totalAssets : 0"
              color="info"
              track-color="transparent"
              size="3px"
              class="q-mt-sm"
            />
          </div>
        </div>

        <div class="kpi-card kpi-card--maintenance">
          <div class="kpi-icon">
            <lucide-icon name="wrench" :size="22" />
          </div>
          <div class="kpi-content">
            <div class="kpi-value" style="color: #a855f7">{{ metrics.underMaintenanceAssets }}</div>
            <div class="kpi-label">Under Maintenance</div>
          </div>
          <div class="kpi-bar">
            <q-linear-progress
              :value="metrics.totalAssets > 0 ? metrics.underMaintenanceAssets / metrics.totalAssets : 0"
              color="purple"
              track-color="transparent"
              size="3px"
              class="q-mt-sm"
            />
          </div>
        </div>
      </div>

      <!-- Row 2: Operational Alerts -->
      <div class="alert-grid q-mb-lg">
        <div class="alert-card alert-card--pending">
          <lucide-icon name="clock" :size="20" class="alert-icon" />
          <div class="alert-value text-warning">{{ metrics.pendingAllocationRequests }}</div>
          <div class="alert-label">Pending Approvals</div>
        </div>

        <div class="alert-card" :class="metrics.overdueAllocations > 0 ? 'alert-card--overdue' : 'alert-card--ok'">
          <lucide-icon name="alert-triangle" :size="20" class="alert-icon" />
          <div class="alert-value" :class="metrics.overdueAllocations > 0 ? 'text-negative' : 'text-positive'">
            {{ metrics.overdueAllocations }}
          </div>
          <div class="alert-label">Overdue Returns</div>
        </div>

        <div class="alert-card alert-card--bookings">
          <lucide-icon name="calendar-check" :size="20" class="alert-icon" />
          <div class="alert-value text-positive">{{ metrics.upcomingBookingsToday }}</div>
          <div class="alert-label">Bookings Today</div>
        </div>

        <div class="alert-card alert-card--total-bookings">
          <lucide-icon name="calendar" :size="20" class="alert-icon" />
          <div class="alert-value text-grey-3">{{ metrics.totalBookings }}</div>
          <div class="alert-label">Total Bookings</div>
        </div>
      </div>

      <!-- Row 3: Asset Utilization Bar + Activity Feed -->
      <div class="bottom-grid">
        <!-- Utilization Breakdown -->
        <q-card class="util-card" flat>
          <q-card-section class="q-pb-sm">
            <div class="row items-center q-mb-md">
              <lucide-icon name="pie-chart" :size="18" class="text-grey-5 q-mr-sm" />
              <span class="text-subtitle2 text-white">Asset Utilization</span>
            </div>
            <div class="util-bars">
              <div v-for="seg in utilizationSegments" :key="seg.label" class="util-row q-mb-sm">
                <div class="row items-center justify-between q-mb-xs">
                  <span class="text-caption text-grey-4">{{ seg.label }}</span>
                  <span class="text-caption" :style="`color: ${seg.hex}`">
                    {{ seg.count }} ({{ seg.pct }}%)
                  </span>
                </div>
                <q-linear-progress
                  :value="seg.pct / 100"
                  :color="seg.color"
                  track-color="grey-9"
                  size="8px"
                  rounded
                />
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Recent Activity Feed -->
        <q-card class="feed-card" flat>
          <q-card-section class="q-pb-sm">
            <div class="row items-center justify-between q-mb-md">
              <div class="row items-center">
                <lucide-icon name="activity" :size="18" class="text-grey-5 q-mr-sm" />
                <span class="text-subtitle2 text-white">Recent Activity</span>
              </div>
              <q-btn flat dense size="xs" label="View All" color="primary" to="/notifications" />
            </div>
          </q-card-section>

          <q-list v-if="metrics.recentActivityLogs.length > 0" separator>
            <q-item
              v-for="log in metrics.recentActivityLogs"
              :key="log.id"
              class="feed-item"
              dense
            >
              <q-item-section avatar style="min-width: 32px">
                <div class="feed-dot" :class="`feed-dot--${log.type.toLowerCase()}`" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-grey-3" style="font-size: 13px; line-height: 1.4">
                  {{ log.message }}
                </q-item-label>
                <q-item-label caption class="text-grey-7">
                  {{ log.actor?.name }} · {{ formatTime(log.created_at) }}
                </q-item-label>
              </q-item-section>
              <q-item-section side style="min-width: 60px">
                <q-chip
                  :color="typeColor(log.type)"
                  text-color="white"
                  dense
                  size="xs"
                >
                  {{ log.type }}
                </q-chip>
              </q-item-section>
            </q-item>
          </q-list>

          <div v-else class="q-pa-lg text-center text-grey-6">
            <lucide-icon name="activity" :size="32" class="q-mb-sm" />
            <p class="text-caption">No recent activity yet</p>
          </div>
        </q-card>
      </div>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDashboard } from 'src/features/dashboard/api/useDashboard';

const { metrics, loading, refetch } = useDashboard();

const utilizationSegments = computed(() => {
  if (!metrics.value) return [];
  const total = metrics.value.totalAssets || 1;
  return [
    { label: 'Available', count: metrics.value.availableAssets, color: 'positive', hex: '#10b981', pct: Math.round((metrics.value.availableAssets / total) * 100) },
    { label: 'Allocated', count: metrics.value.allocatedAssets, color: 'primary', hex: '#3b82f6', pct: Math.round((metrics.value.allocatedAssets / total) * 100) },
    { label: 'Under Maintenance', count: metrics.value.underMaintenanceAssets, color: 'purple', hex: '#a855f7', pct: Math.round((metrics.value.underMaintenanceAssets / total) * 100) },
    {
      label: 'Other',
      count: total - metrics.value.availableAssets - metrics.value.allocatedAssets - metrics.value.underMaintenanceAssets,
      color: 'grey-7',
      hex: '#475569',
      pct: Math.max(0, 100 - Math.round((metrics.value.availableAssets / total) * 100) - Math.round((metrics.value.allocatedAssets / total) * 100) - Math.round((metrics.value.underMaintenanceAssets / total) * 100)),
    },
  ].filter((s) => s.count > 0);
});

function typeColor(type: string): string {
  switch (type) {
    case 'ALLOCATION': return 'primary';
    case 'BOOKING': return 'positive';
    case 'MAINTENANCE': return 'purple';
    case 'AUDIT': return 'warning';
    default: return 'grey-7';
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
</script>

<style lang="scss" scoped>
.dashboard-page {
  max-width: 1200px;
  margin: 0 auto;
}

// KPI Grid (4 columns)
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.kpi-card {
  background: $dark-card;
  border: 1px solid $glass-border;
  border-radius: $radius-md;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
  }

  &--total::before { background: $grey-7; }
  &--available::before { background: $positive; }
  &--allocated::before { background: $primary; }
  &--maintenance::before { background: #a855f7; }

  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-md;
  }

  .kpi-icon {
    width: 40px;
    height: 40px;
    border-radius: $radius-sm;
    background: rgba(255, 255, 255, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    color: $grey-4;
    margin-bottom: 4px;
  }

  .kpi-value {
    font-size: 32px;
    font-weight: 700;
    line-height: 1;
    color: #fff;
    letter-spacing: -1px;
  }

  .kpi-label {
    font-size: 12px;
    color: $grey-5;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

// Alert Grid (4 columns)
.alert-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.alert-card {
  background: $dark-card;
  border: 1px solid $glass-border;
  border-radius: $radius-md;
  padding: 18px 20px;
  text-align: center;
  transition: transform 0.2s ease;

  &--pending { border-color: rgba(245, 158, 11, 0.3); }
  &--overdue { border-color: rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.04); }
  &--ok { border-color: rgba(16, 185, 129, 0.3); }
  &--bookings { border-color: rgba(16, 185, 129, 0.3); }
  &--total-bookings { border-color: $glass-border; }

  &:hover { transform: translateY(-2px); }

  .alert-icon { color: $grey-5; margin-bottom: 8px; }
  .alert-value { font-size: 28px; font-weight: 700; line-height: 1.1; }
  .alert-label { font-size: 12px; color: $grey-6; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
}

// Bottom Grid
.bottom-grid {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}

.util-card,
.feed-card {
  background: $dark-card !important;
  border: 1px solid $glass-border !important;
  border-radius: $radius-md;
}

.util-bars {
  .util-row {
    margin-bottom: 12px;
  }
}

.feed-item {
  min-height: 52px;
  transition: background 0.15s ease;
  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }
}

.feed-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-top: 4px;

  &--allocation { background: $primary; }
  &--booking { background: $positive; }
  &--maintenance { background: #a855f7; }
  &--audit { background: $warning; }
}
</style>
