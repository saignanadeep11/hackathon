<template>
  <q-page class="q-pa-lg text-white">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h4 font-bold q-my-none text-white">Organization Setup</h1>
        <p class="text-subtitle2 text-grey-5 q-mt-xs q-mb-none">Manage departments, asset categories, and system configuration.</p>
      </div>
    </div>

    <!-- Tabs Container -->
    <q-card class="q-card--glass bg-transparent" flat>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey-5 bg-dark-page q-pa-sm rounded-borders"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
      >
        <q-tab name="categories" no-caps>
          <div class="row items-center q-gutter-x-sm">
            <lucide-icon name="tags" :size="18" />
            <span>Asset Categories</span>
          </div>
        </q-tab>
        <q-tab name="departments" no-caps>
          <div class="row items-center q-gutter-x-sm">
            <lucide-icon name="building-2" :size="18" />
            <span>Departments</span>
          </div>
        </q-tab>
      </q-tabs>

      <q-separator dark class="q-my-md glass-separator" />

      <q-tab-panels v-model="tab" animated class="bg-transparent text-white">
        <!-- Categories Panel -->
        <q-tab-panel name="categories" class="q-pa-none">
          <CategoriesTab />
        </q-tab-panel>

        <!-- Departments Panel -->
        <q-tab-panel name="departments" class="q-pa-none">
          <div class="full-width row flex-center q-pa-xl text-grey-5 bg-dark-card rounded-borders glass-border">
            <lucide-icon name="hammer" :size="48" class="q-mb-md text-grey-7" />
            <div class="text-h6 full-width text-center">Departments Management Coming Soon</div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CategoriesTab from './CategoriesTab.vue';

const tab = ref('categories');
</script>

<style lang="scss" scoped>
.q-card--glass {
  background: transparent;
}
.bg-dark-page {
  background: rgba(0, 0, 0, 0.2);
}
.bg-dark-card {
  background: rgba(19, 27, 46, 0.4);
  backdrop-filter: blur(12px);
}
.rounded-borders {
  border-radius: $radius-sm;
}
.glass-border {
  border: 1px solid rgba(255, 255, 255, 0.05);
}
.glass-separator {
  background: rgba(255, 255, 255, 0.05);
}
</style>
