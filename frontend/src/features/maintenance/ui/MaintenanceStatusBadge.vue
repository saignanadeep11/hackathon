<template>
  <span class="status-badge" :style="badgeStyles">
    <span class="status-dot" :style="dotStyles"></span>
    <span class="status-label">{{ label }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { MaintenanceStatus } from 'src/graphql/generated/graphql';

const props = defineProps<{
  status: MaintenanceStatus;
}>();

const config = computed(() => {
  switch (props.status) {
    case 'PENDING':
      return { color: '#f59e0b', label: 'Pending Approval' };
    case 'APPROVED':
      return { color: '#3b82f6', label: 'Approved' };
    case 'REJECTED':
      return { color: '#ef4444', label: 'Rejected' };
    case 'IN_PROGRESS':
      return { color: '#a855f7', label: 'In Progress' };
    case 'RESOLVED':
      return { color: '#10b981', label: 'Resolved' };
    default:
      return { color: '#64748b', label: props.status };
  }
});

const label = computed(() => config.value.label);

const badgeStyles = computed(() => ({
  backgroundColor: `rgba(${hexToRgb(config.value.color)}, 0.1)`,
  color: config.value.color,
  borderColor: `rgba(${hexToRgb(config.value.color)}, 0.25)`,
}));

const dotStyles = computed(() => ({
  backgroundColor: config.value.color,
  boxShadow: `0 0 6px ${config.value.color}`,
}));

function hexToRgb(hex: string): string {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}
</script>

<style lang="scss" scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 10px;
  border-radius: 9999px;
  border: 1px solid transparent;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: -0.1px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
</style>
