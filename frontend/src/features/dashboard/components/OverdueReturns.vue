<template>
  <q-card class="overdue-card full-height column justify-between">
    <!-- Card Header -->
    <q-card-section class="q-pb-none">
      <div class="row justify-between items-center">
        <div class="row items-center q-gutter-x-sm">
          <q-icon name="report_problem" color="negative" size="20px" class="warning-pulse" />
          <span class="text-h6 font-outfit text-weight-bold">
            Overdue Returns
          </span>
        </div>
        
        <a href="#" class="text-caption text-grey-6 font-outfit text-weight-medium view-all-link">
          View All
        </a>
      </div>
    </q-card-section>

    <!-- Card Content - List of Overdue Items -->
    <q-card-section class="q-py-md scroll-container flex-grow">
      <div class="column q-gutter-y-sm">
        <div 
          v-for="(item, index) in overdueItems" 
          :key="index" 
          class="overdue-item-card q-pa-sm"
        >
          <!-- Item Title & Late Badge -->
          <div class="row justify-between items-start no-wrap q-mb-xs">
            <div class="text-subtitle2 font-outfit text-weight-bold ellipsis text-lh-sm" style="max-width: 65%;">
              {{ item.name }}
            </div>
            
            <div class="late-badge font-outfit">
              {{ item.daysLate }} Days Late
            </div>
          </div>

          <!-- Item Context Details (User or Location) -->
          <div class="row items-center q-gutter-x-xs text-caption text-grey-6 font-outfit">
            <q-icon :name="item.contextIcon" size="14px" color="grey-6" />
            <span class="ellipsis">{{ item.contextText }}</span>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface OverdueItem {
  name: string;
  daysLate: number;
  contextIcon: string;
  contextText: string;
}

const overdueItems = ref<OverdueItem[]>([
  {
    name: 'MacBook Pro 16" (M2 Max)',
    daysLate: 3,
    contextIcon: 'person',
    contextText: 'Sarah Jenkins (Engineering)'
  },
  {
    name: 'RED Komodo 6K Camera',
    daysLate: 1,
    contextIcon: 'person',
    contextText: 'Marcus Chen (Marketing)'
  },
  {
    name: 'Herman Miller Aeron',
    daysLate: 5,
    contextIcon: 'location_on',
    contextText: 'Floor 3, Meeting Room B'
  }
]);
</script>

<style lang="scss">
.overdue-card {
  border-radius: 16px !important;
  overflow: hidden;
}

.view-all-link {
  text-decoration: none;
  transition: color 0.2s ease;
  
  &:hover {
    color: #3b82f6;
  }
}

.overdue-item-card {
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background: rgba(0, 0, 0, 0.04);
    border-color: rgba(239, 68, 68, 0.2);
    transform: translateX(4px);
  }
}

.late-badge {
  background: rgba(239, 68, 68, 0.08);
  color: #c53030;
  border: 1px solid rgba(239, 68, 68, 0.15);
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  white-space: nowrap;
}


.text-lh-sm {
  line-height: 1.15rem;
}

.warning-pulse {
  animation: pulse-alert 2s infinite;
}

@keyframes pulse-alert {
  0% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    opacity: 0.6;
    transform: scale(1);
  }
}
</style>
