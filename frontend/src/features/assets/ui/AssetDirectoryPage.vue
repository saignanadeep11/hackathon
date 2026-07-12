<template>
  <q-page class="q-pa-lg app-page">
    <div class="row items-center justify-between q-mb-lg">
      <h4 class="text-white q-my-none text-weight-bold" style="font-size: 24px">Asset Directory</h4>
      <q-btn color="primary" label="+ Register Asset" rounded no-caps @click="isModalOpen = true" />
    </div>

    <div class="glass-panel q-pa-md">
      <q-table
        flat
        class="transparent-table"
        :rows="rows"
        :columns="columns"
        row-key="id"
        :loading="assetsLoading"
        hide-pagination
        :rows-per-page-options="[0]"
      >
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <div
              class="status-pill"
              :class="props.row.status === 'AVAILABLE' ? 'status-active' : 'status-inactive'"
            >
              {{ props.row.status }}
            </div>
          </q-td>
        </template>
      </q-table>
    </div>

    <RegisterAssetModal
      v-model="isModalOpen"
      :categories="categories"
      :loading="createAssetLoading"
      @submit="handleCreateAsset"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { QTableColumn } from 'quasar';
import { useAssets, useCategories, useRegisterAsset } from '../api/useAssets';
import RegisterAssetModal from './components/RegisterAssetModal.vue';
import type { RegisterAssetInput } from 'src/graphql/generated/graphql';

interface AssetData {
  id: string;
  asset_tag: string;
  name: string;
  location: string;
  condition: string;
  status: string;
  category?: { name: string };
}

const { assets, loading: assetsLoading, refetch } = useAssets();
const { categories } = useCategories();
const { registerAsset: createAsset, registerLoading: createAssetLoading } = useRegisterAsset();
const isModalOpen = ref(false);

const columns: QTableColumn[] = [
  { name: 'asset_tag', label: 'Tag', align: 'left', field: 'asset_tag' },
  { name: 'name', label: 'Name', align: 'left', field: 'name' },
  {
    name: 'category',
    label: 'Category',
    align: 'left',
    field: (row: AssetData) => row.category?.name || '--',
  },
  { name: 'location', label: 'Location', align: 'left', field: 'location' },
  { name: 'condition', label: 'Condition', align: 'left', field: 'condition' },
  { name: 'status', label: 'Status', align: 'center', field: 'status' },
];

const rows = computed(() => assets.value);

async function handleCreateAsset(input: RegisterAssetInput) {
  try {
    await createAsset(input);
    isModalOpen.value = false;
    void refetch();
  } catch (err: unknown) {
    console.error(err);
  }
}
</script>

<style lang="scss" scoped>
.app-page {
  background: transparent;
}
.glass-panel {
  background: $glass-bg;
  border: 1px solid $glass-border;
  border-radius: $radius-lg;
  backdrop-filter: blur($glass-blur);
}
.transparent-table {
  background: transparent !important;
  color: #fff;
  :deep(th) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    color: $grey-5;
    font-weight: 500;
  }
  :deep(td) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
}
.status-pill {
  border-radius: 20px;
  padding: 4px 12px;
  display: inline-block;
  font-size: 12px;
  border: 1px solid currentColor;
}
.status-active {
  color: $positive;
  background: rgba(33, 186, 69, 0.1);
}
.status-inactive {
  color: $grey-5;
  background: rgba(158, 158, 158, 0.1);
}
</style>
