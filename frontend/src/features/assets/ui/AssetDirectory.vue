<template>
  <q-page class="q-pa-lg text-white">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h4 font-bold q-my-none text-white">Asset Management</h1>
        <p class="text-subtitle2 text-grey-5 q-mt-xs q-mb-none">
          Manage assets and categories across your organization.
        </p>
      </div>
      <q-btn
        v-if="canRegister && currentTab === 'assets'"
        color="primary"
        no-caps
        class="bg-gradient-primary btn-shadow font-semibold"
        @click="openRegisterModal"
      >
        <lucide-icon name="plus" :size="16" class="q-mr-sm" />
        Register Asset
      </q-btn>
    </div>

    <!-- Navigation Tabs -->
    <q-tabs
      v-model="currentTab"
      dense
      class="text-grey q-mb-md"
      active-color="primary"
      indicator-color="primary"
      align="left"
      narrow-indicator
    >
      <q-tab name="assets" label="Assets Directory" />
      <q-tab name="categories" label="Asset Categories" v-if="canManageCategories" />
    </q-tabs>

    <q-tab-panels v-model="currentTab" animated class="bg-transparent q-pa-none">
      <q-tab-panel name="assets" class="q-pa-none">
        <q-card class="q-card--glass q-mb-lg q-pa-md">
          <div class="row q-col-gutter-md items-center">
            <!-- Search -->
            <div class="col-12 col-md-3">
              <q-input
                v-model="filters.search"
                placeholder="Search by tag, serial, name..."
                filled
                dark
                dense
                clearable
              >
                <template v-slot:prepend>
                  <lucide-icon name="search" :size="18" class="text-grey-5" />
                </template>
              </q-input>
            </div>

            <!-- Status -->
            <div class="col-12 col-sm-6 col-md-2">
              <q-select
                v-model="filters.status"
                :options="statusOptions"
                label="Status"
                filled
                dark
                dense
                clearable
                emit-value
                map-options
              />
            </div>

            <!-- Category -->
            <div class="col-12 col-sm-6 col-md-2">
              <q-select
                v-model="filters.category_id"
                :options="categoryOptions"
                label="Category"
                filled
                dark
                dense
                clearable
                option-value="id"
                option-label="name"
                emit-value
                map-options
              />
            </div>

            <!-- Location -->
            <div class="col-12 col-sm-6 col-md-2">
              <q-input
                v-model="filters.location"
                placeholder="Filter by location..."
                filled
                dark
                dense
                clearable
              >
                <template v-slot:prepend>
                  <lucide-icon name="map-pin" :size="18" class="text-grey-5" />
                </template>
              </q-input>
            </div>

            <!-- Bookable Toggle -->
            <div class="col-12 col-sm-6 col-md-3 flex justify-end">
              <q-toggle
                v-model="filters.is_shared_bookable"
                label="Shared Bookable Only"
                dark
                color="primary"
                class="text-grey-4"
              />
            </div>
          </div>
        </q-card>

        <!-- Assets List Table -->
        <q-card class="q-card--glass">
          <q-table
            :rows="filteredAssets"
            :columns="columns"
            row-key="id"
            class="q-table--glass text-white"
            dark
            flat
            dense
            :loading="loading"
            :pagination="pagination"
            no-data-label="No assets registered yet"
          >
            <template v-slot:body-cell-asset_tag="props">
              <q-td
                :props="props"
                class="font-mono text-primary font-semibold cursor-pointer"
                @click="viewDetails(props.row)"
              >
                {{ props.row.asset_tag }}
              </q-td>
            </template>

            <template v-slot:body-cell-name="props">
              <q-td
                :props="props"
                class="cursor-pointer font-semibold"
                @click="viewDetails(props.row)"
              >
                {{ props.row.name }}
              </q-td>
            </template>

            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <asset-status-badge :status="props.row.status" />
              </q-td>
            </template>

            <template v-slot:body-cell-is_shared_bookable="props">
              <q-td :props="props" class="text-center">
                <q-icon
                  v-if="props.row.is_shared_bookable"
                  name="check_circle"
                  color="positive"
                  size="20px"
                />
                <q-icon v-else name="cancel" color="grey-7" size="20px" />
              </q-td>
            </template>

            <template v-slot:body-cell-acquisition_cost="props">
              <q-td :props="props">
                ${{
                  Number(props.row.acquisition_cost).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                }}
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="q-gutter-x-sm text-right">
                <q-btn flat round dense color="primary" @click="viewDetails(props.row)">
                  <lucide-icon name="eye" :size="16" />
                  <q-tooltip>View Details & History</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card>

        <!-- Side Detail Drawer / Dialog -->
        <q-dialog v-model="detailsOpen" position="right" full-height>
          <q-card class="details-drawer text-white" style="width: 480px; max-width: 90vw">
            <q-card-section class="row items-center q-pb-md border-bottom-glass">
              <div class="text-h6 font-semibold">Asset Specification</div>
              <q-space />
              <q-btn flat round dense icon="close" color="grey-5" @click="detailsOpen = false" />
            </q-card-section>

            <q-card-section
              v-if="selectedAsset"
              class="scroll q-pa-md"
              style="height: calc(100% - 70px)"
            >
              <!-- General Details -->
              <div class="text-center q-mb-lg">
                <q-avatar size="80px" color="rgba(255,255,255,0.05)" class="q-mb-sm border-glass">
                  <img
                    v-if="selectedAsset.photo_url"
                    :src="selectedAsset.photo_url"
                    alt="Asset Photo"
                    style="object-fit: cover"
                  />
                  <q-icon v-else name="computer" size="40px" color="primary" />
                </q-avatar>
                <div class="text-h6 font-bold">{{ selectedAsset.name }}</div>
                <div class="text-subtitle2 text-primary font-mono">
                  {{ selectedAsset.asset_tag }}
                </div>
                <div class="q-mt-xs">
                  <asset-status-badge :status="selectedAsset.status" />
                </div>
              </div>

              <!-- Specifications Grid -->
              <div class="q-gutter-y-sm q-mb-lg">
                <div class="spec-row">
                  <span class="spec-label">Serial Number</span>
                  <span class="spec-value font-mono">{{ selectedAsset.serial_number }}</span>
                </div>
                <div class="spec-row">
                  <span class="spec-label">Category</span>
                  <span class="spec-value">{{ selectedAsset.category?.name }}</span>
                </div>
                <div class="spec-row">
                  <span class="spec-label">Location</span>
                  <span class="spec-value">{{ selectedAsset.location }}</span>
                </div>
                <div class="spec-row">
                  <span class="spec-label">Date Acquired</span>
                  <span class="spec-value">{{ selectedAsset.acquisition_date }}</span>
                </div>
                <div class="spec-row">
                  <span class="spec-label">Acquisition Cost</span>
                  <span class="spec-value"
                    >${{ Number(selectedAsset.acquisition_cost).toLocaleString() }}</span
                  >
                </div>
                <div class="spec-row">
                  <span class="spec-label">Condition</span>
                  <span class="spec-value">{{ selectedAsset.condition }}</span>
                </div>
                <div class="spec-row">
                  <span class="spec-label">Bookable Resource</span>
                  <span class="spec-value">{{
                    selectedAsset.is_shared_bookable ? 'Yes' : 'No'
                  }}</span>
                </div>
              </div>

              <!-- Dynamic Custom Fields -->
              <template v-if="parsedCustomFields && Object.keys(parsedCustomFields).length > 0">
                <div class="text-subtitle2 text-primary q-mb-sm font-semibold">
                  Custom Specifications
                </div>
                <div class="q-gutter-y-sm q-mb-lg">
                  <div v-for="(val, key) in parsedCustomFields" :key="key" class="spec-row">
                    <span class="spec-label">{{ formatKey(String(key)) }}</span>
                    <span class="spec-value">{{ val }}</span>
                  </div>
                </div>
              </template>

              <!-- History Tab -->
              <div class="text-subtitle2 text-primary q-mb-sm font-semibold">
                Asset Lifespans & History
              </div>
              <q-list class="history-timeline">
                <q-item class="q-px-none">
                  <q-item-section avatar class="timeline-avatar">
                    <div class="timeline-dot bg-positive"></div>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold text-white"
                      >Asset Registered</q-item-label
                    >
                    <q-item-label caption class="text-grey-5"
                      >Initial registration status set to Available</q-item-label
                    >
                  </q-item-section>
                  <q-item-section side top>
                    <q-item-label caption class="text-grey-6">{{
                      formatDate(String(selectedAsset.createdAt))
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-tab-panel>

      <q-tab-panel name="categories" class="q-pa-none" v-if="canManageCategories">
        <categories-tab />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth.store';
import { UserRole } from 'src/config/permissions';
import { useAssets, useCategories } from '../api/useAssets';
import AssetStatusBadge from './AssetStatusBadge.vue';
import RegisterAssetModal from './RegisterAssetModal.vue';
import CategoriesTab from '../../organization/ui/components/CategoriesTab.vue';
import {
  type GetAssetsQuery,
  type AssetFilterInput,
  type AssetStatus,
} from 'src/graphql/generated/graphql';

type AssetType = GetAssetsQuery['assets'][number];

const $q = useQuasar();
const authStore = useAuthStore();

const currentTab = ref('assets');

const canManageCategories = computed(() => {
  const role = authStore.currentUser?.role;
  return role === UserRole.ADMIN || role === UserRole.ASSET_MANAGER;
});

const filters = ref<AssetFilterInput>({
  search: '',
  status: null,
  category_id: null,
  location: '',
  is_shared_bookable: false,
});

const { assets, loading, refetch } = useAssets(filters);
const { categories } = useCategories();

const canRegister = computed(() => {
  const role = authStore.currentUser?.role;
  return role === UserRole.ADMIN || role === UserRole.ASSET_MANAGER;
});

const statusOptions = [
  { label: 'Available', value: 'AVAILABLE' as AssetStatus },
  { label: 'Allocated', value: 'ALLOCATED' as AssetStatus },
  { label: 'Reserved', value: 'RESERVED' as AssetStatus },
  { label: 'Under Maintenance', value: 'UNDER_MAINTENANCE' as AssetStatus },
  { label: 'Lost', value: 'LOST' as AssetStatus },
  { label: 'Retired', value: 'RETIRED' as AssetStatus },
  { label: 'Disposed', value: 'DISPOSED' as AssetStatus },
];

const categoryOptions = computed(() => categories.value);

const pagination = ref({
  sortBy: 'createdAt',
  descending: true,
  page: 1,
  rowsPerPage: 15,
});

const columns = [
  { name: 'asset_tag', label: 'Tag', field: 'asset_tag', align: 'left' as const, sortable: true },
  { name: 'name', label: 'Name', field: 'name', align: 'left' as const, sortable: true },
  {
    name: 'category',
    label: 'Category',
    field: (row: AssetType) => row.category?.name || 'N/A',
    align: 'left' as const,
    sortable: true,
  },
  { name: 'status', label: 'Status', field: 'status', align: 'left' as const, sortable: true },
  {
    name: 'condition',
    label: 'Condition',
    field: 'condition',
    align: 'left' as const,
    sortable: true,
  },
  {
    name: 'location',
    label: 'Location',
    field: 'location',
    align: 'left' as const,
    sortable: true,
  },
  {
    name: 'is_shared_bookable',
    label: 'Bookable',
    field: 'is_shared_bookable',
    align: 'center' as const,
  },
  {
    name: 'acquisition_cost',
    label: 'Cost',
    field: 'acquisition_cost',
    align: 'right' as const,
    sortable: true,
  },
  { name: 'actions', label: '', field: '', align: 'right' as const },
];

const filteredAssets = computed(() => {
  // Let the backend handle filters primarily, but we also filter locally as fallback/safety
  return assets.value;
});

// Detail drawer state
const detailsOpen = ref(false);
const selectedAsset = ref<AssetType | null>(null);

const parsedCustomFields = computed(() => {
  if (!selectedAsset.value?.custom_fields_data) return {};
  try {
    return typeof selectedAsset.value.custom_fields_data === 'string'
      ? JSON.parse(selectedAsset.value.custom_fields_data)
      : selectedAsset.value.custom_fields_data;
  } catch {
    return {};
  }
});

function formatKey(key: string): string {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function viewDetails(asset: AssetType) {
  selectedAsset.value = asset;
  detailsOpen.value = true;
}

function openRegisterModal() {
  $q.dialog({
    component: RegisterAssetModal,
  }).onOk(() => {
    void refetch();
  });
}
</script>

<style lang="scss" scoped>
.q-card--glass {
  background: rgba(19, 27, 46, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
}

.details-drawer {
  background: rgba(11, 19, 38, 0.95);
  backdrop-filter: blur(20px);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  height: 100%;
}

.border-bottom-glass {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.border-glass {
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.spec-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 6px;
  font-size: 13px;

  .spec-label {
    color: #64748b;
    font-weight: 500;
  }
  .spec-value {
    color: #f1f5f9;
    font-weight: 600;
  }
}

.bg-gradient-primary {
  background: linear-gradient(135deg, $primary 0%, $accent 100%);
}

.btn-shadow {
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
}

.history-timeline {
  .timeline-avatar {
    min-width: 32px;
    align-items: center;
    justify-content: center;
  }
  .timeline-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    box-shadow: 0 0 8px currentColor;
  }
}
</style>
