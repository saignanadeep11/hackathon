<template>
  <q-card class="chart-card full-height column justify-between">
    <!-- Card Header with Title and Badges -->
    <q-card-section class="q-pb-none">
      <div class="row justify-between items-center q-col-gutter-y-sm">
        <div class="text-h6 font-outfit text-weight-bold">
          Utilization Trends
        </div>
        
        <div class="row items-center q-gutter-x-sm">
          <span class="badge active-badge font-outfit">
            Active Bookings: 86
          </span>
          <span class="badge pending-badge font-outfit">
            Pending Transfers: 22
          </span>
        </div>
      </div>
    </q-card-section>

    <!-- Main Chart Section using BaseBarChart -->
    <q-card-section class="q-py-md flex-grow column justify-center" style="height: 320px;">
      <BaseBarChart :series-data="seriesData" :categories="categories" />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import BaseBarChart from 'src/features/shared/ui/BaseBarChart.vue';

// Mocking 6 periods as shown in screenshot
const chartRawData = ref([
  { label: 'Jan/Feb', value: 35 },
  { label: 'Mar/Apr', value: 55 },
  { label: 'May/Jun', value: 25 },
  { label: 'Jul/Aug', value: 92 },
  { label: 'Sep/Oct', value: 48 },
  { label: 'Nov/Dec', value: 72 },
]);

const categories = computed(() => chartRawData.value.map(item => item.label));
const seriesData = computed(() => chartRawData.value.map(item => item.value));
</script>

<style lang="scss">
.chart-card {
  border-radius: 16px !important;
  overflow: hidden;
}

.badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.active-badge {
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
  border-color: rgba(59, 130, 246, 0.2);
}

.pending-badge {
  background: rgba(168, 85, 247, 0.1);
  color: #7c3aed;
  border-color: rgba(168, 85, 247, 0.2);
}
</style>

