<template>
  <div class="q-py-md">
    <!-- Top Search Bar Row -->
    <div class="row q-mb-lg">
      <div class="col-12 col-md-6">
        <q-input
          v-model="searchText"
          placeholder="Search assets, locations, users..."
          dense
          outlined
          class="search-input"
        >
          <template v-slot:prepend>
            <q-icon name="search" color="grey-6" />
          </template>
        </q-input>
      </div>
    </div>

    <!-- Title & Action Buttons Row -->
    <div class="row justify-between items-center q-col-gutter-y-md">
      <div class="col-12 col-sm-auto">
        <h1 class="text-h4 text-bold q-ma-none font-outfit" style="font-size: 2rem; line-height: 2.2rem;">
          Dashboard Overview
        </h1>
        <p class="text-subtitle2 text-grey-7 q-mt-xs q-mb-none font-outfit text-weight-regular">
          Real-time asset telemetry and utilization metrics.
        </p>
      </div>

      <div class="col-12 col-sm-auto row items-center q-gutter-x-sm no-wrap-sm">
        <!-- Date Selector Button -->
        <q-btn
          outline
          color="primary"
          icon="event"
          label="Last 30 Days"
          no-caps
          class="q-px-md text-weight-medium"
          style="border-radius: 10px;"
        >
          <q-icon name="arrow_drop_down" size="20px" class="q-ml-xs text-grey-6" />
        </q-btn>

        <!-- Export Report Button -->
        <q-btn
          color="primary"
          icon="download"
          label="Export Report"
          no-caps
          class="q-px-md text-weight-bold"
          style="border-radius: 10px;"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const searchText = ref('');
</script>

<style lang="scss">
.search-input {
  .q-field__control {
    border-radius: 20px !important;
  }
}

@media (max-width: 599.98px) {
  .no-wrap-sm {
    flex-wrap: wrap !important;
    gap: 8px;
  }
}
</style>

