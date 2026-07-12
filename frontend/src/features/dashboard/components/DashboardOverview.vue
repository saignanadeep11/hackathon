<template>
  <div class="q-px-lg q-pb-lg">
    <!-- 1. Header Component -->
    <DashboardHeader class="q-mb-md" />

    <!-- 2. KPI Statistics Cards Component -->
    <DashboardStats class="q-mb-lg" />

    <!-- 3. Chart & Overdue Returns Row -->
    <div class="row q-col-gutter-lg">
      <!-- Utilization Trends Chart (takes 8/12 on large screens, stacks on small) -->
      <div class="col-12 col-lg-8">
        <UtilizationChart class="full-height" />
      </div>

      <!-- Overdue Returns Sidebar (takes 4/12 on large screens, stacks on small) -->
      <div class="col-12 col-lg-4">
        <OverdueReturns class="full-height" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardHeader from './DashboardHeader.vue';
import DashboardStats from './DashboardStats.vue';
import UtilizationChart from './UtilizationChart.vue';
import OverdueReturns from './OverdueReturns.vue';
</script>

<style lang="scss" scoped>
// Scoped rules for main dashboard overview container
</style>
