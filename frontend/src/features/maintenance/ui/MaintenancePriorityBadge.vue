<template>
  <span class="priority-badge" :style="badgeStyles">
    <span class="priority-label">{{ label }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { MaintenancePriority } from 'src/graphql/generated/graphql';

const props = defineProps<{
  priority: MaintenancePriority;
}>();

const config = computed(() => {
  switch (props.priority) {
    case 'LOW':
      return { color: '#64748b', label: 'Low' };
    case 'MEDIUM':
      return { color: '#3b82f6', label: 'Medium' };
    case 'HIGH':
      return { color: '#f59e0b', label: 'High' };
    case 'CRITICAL':
      return { color: '#ef4444', label: 'Critical' };
    default:
      return { color: '#64748b', label: props.priority };
  }
});

const label = computed(() => config.value.label);

const badgeStyles = computed(() => ({
  backgroundColor: `rgba(${hexToRgb(config.value.color)}, 0.1)`,
  color: config.value.color,
  borderColor: `rgba(${hexToRgb(config.value.color)}, 0.25)`,
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
.priority-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 4px;
  border: 1px solid transparent;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>
