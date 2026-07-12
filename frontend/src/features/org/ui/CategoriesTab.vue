<template>
  <div>
    <!-- Header -->
    <div class="row items-center justify-between q-mb-md">
      <h2 class="text-h6 font-semibold q-my-none text-white">Asset Categories</h2>
      <q-btn
        color="primary"
        no-caps
        class="bg-gradient-primary btn-shadow font-semibold"
        @click="openCreateModal"
      >
        <lucide-icon name="plus" :size="16" class="q-mr-sm" />
        Add Category
      </q-btn>
    </div>

    <!-- Filter Bar -->
    <q-card class="bg-dark-card glass-border q-mb-md q-pa-md">
      <div class="row q-col-gutter-md items-center">
        <div class="col-12 col-md-6">
          <q-input
            v-model="searchQuery"
            placeholder="Search Categories (Exact Match)..."
            dense
            outlined
            dark
            @keyup.enter="applyFilters"
          >
            <template v-slot:prepend>
              <lucide-icon name="search" :size="18" class="text-grey-5" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-6 flex justify-end q-gutter-sm">
          <q-btn flat color="grey-5" no-caps label="Clear" @click="clearFilters" />
          <q-btn color="primary" no-caps label="Search" @click="applyFilters" />
        </div>
      </div>
    </q-card>

    <!-- Data Table -->
    <q-table
      :rows="categories"
      :columns="columns"
      row-key="id"
      :loading="loading"
      dark
      flat
      bordered
      class="q-card--glass glass-table"
      :pagination="{ rowsPerPage: 10 }"
      hide-pagination
      @row-click="onRowClick"
    >
      <!-- Loading Skeleton -->
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>

      <!-- Row custom styling to show clickable cursor -->
      <template v-slot:body-cell="props">
        <q-td :props="props" class="cursor-pointer">
          {{ props.value }}
        </q-td>
      </template>
      
      <!-- Actions / Arrow indicator -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="text-right cursor-pointer">
          <q-btn flat round dense color="grey-5" icon="chevron_right" />
        </q-td>
      </template>

      <!-- Empty State -->
      <template v-slot:no-data>
        <div class="full-width row flex-center q-pa-xl text-grey-5">
          <lucide-icon name="folder-open" :size="48" class="q-mb-md text-grey-7" />
          <div class="text-h6 full-width text-center">No categories found</div>
        </div>
      </template>
    </q-table>

    <div class="row justify-between items-center q-mt-md" v-if="pageInfo">
      <div class="text-grey-5">Showing {{ categories.length }} of {{ totalCount }}</div>
      <div class="q-gutter-sm">
        <q-btn outline color="primary" label="Previous" @click="loadPrev" :disable="!pageInfo.hasPreviousPage" :loading="loading" />
        <q-btn outline color="primary" label="Next" @click="loadNext" :disable="!pageInfo.hasNextPage" :loading="loading" />
      </div>
    </div>

    <!-- Detail Drawer -->
    <q-drawer
      v-model="drawerOpen"
      side="right"
      overlay
      bordered
      :width="400"
      class="bg-dark-card glass-border"
    >
      <div v-if="selectedCategory" class="full-height column">
        <!-- Drawer Header -->
        <div class="row items-center justify-between q-pa-md border-bottom">
          <div class="text-h6 font-semibold text-white">{{ selectedCategory.name }}</div>
          <div class="q-gutter-sm">
            <q-btn flat round dense icon="edit" color="primary" @click="openEditModal" />
            <q-btn flat round dense icon="close" color="grey-5" @click="drawerOpen = false" />
          </div>
        </div>
        
        <!-- Drawer Content -->
        <div class="flex-1 q-pa-md">
          <div class="text-subtitle2 text-grey-5 q-mb-md">Custom Fields Schema</div>
          
          <div v-if="!parsedSchema(selectedCategory) || parsedSchema(selectedCategory)?.fields.length === 0" class="text-grey-6 text-center q-pa-md">
            No custom fields defined.
          </div>
          
          <div v-else class="q-gutter-y-sm">
            <q-card v-for="field in parsedSchema(selectedCategory)?.fields" :key="field.name" dark flat bordered class="bg-dark-page q-pa-sm">
              <div class="row items-center justify-between">
                <div>
                  <div class="text-weight-bold text-white">{{ field.label }}</div>
                  <div class="text-caption text-grey-5 font-mono">{{ field.name }}</div>
                </div>
                <div class="column items-end">
                  <q-badge :color="getTypeColor(field.type)" class="q-mb-xs">{{ field.type }}</q-badge>
                  <q-badge v-if="field.required" color="negative" outline>Required</q-badge>
                </div>
              </div>
            </q-card>
          </div>
        </div>
      </div>
    </q-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useCategoriesPage } from '../api/useCategories';
import CreateCategoryModal from './CreateCategoryModal.vue';
import EditCategoryModal from './EditCategoryModal.vue';

const $q = useQuasar();

// Pagination State
const searchQuery = ref('');

const { variables, categories, totalCount, loading, refetch, fetchMore, pageInfo } = useCategoriesPage({
  first: 10,
});

function clearFilters() {
  searchQuery.value = '';
  applyFilters();
}

function applyFilters() {
  if (!searchQuery.value.trim()) {
    variables.value = { first: 10 };
    return;
  }

  // Wrap in 'or' array as requested, using 'eq' operator
  variables.value = {
    first: 10,
    filter: {
      or: [
        {
          name: {
            icontains: searchQuery.value.trim()
          }
        }
      ]
    }
  };
}

function loadNext() {
  if (!pageInfo.value?.hasNextPage || !pageInfo.value?.endCursor) return;
  void fetchMore({
    variables: {
      after: pageInfo.value.endCursor,
      before: undefined,
      first: 10,
      last: undefined
    },
    updateQuery: (prev, { fetchMoreResult }) => {
      if (!fetchMoreResult) return prev;
      return fetchMoreResult; // Replace instead of append for pagination pages
    },
  });
}

function loadPrev() {
  if (!pageInfo.value?.hasPreviousPage || !pageInfo.value?.startCursor) return;
  void fetchMore({
    variables: {
      before: pageInfo.value.startCursor,
      after: undefined,
      last: 10,
      first: undefined
    },
    updateQuery: (prev, { fetchMoreResult }) => {
      if (!fetchMoreResult) return prev;
      return fetchMoreResult;
    },
  });
}

const drawerOpen = ref(false);
const selectedCategory = ref<Record<string, unknown> | null>(null);

interface CustomField {
  name: string;
  label: string;
  type: string;
  required: boolean;
}

const columns = [
  { name: 'name', label: 'Category Name', field: 'name', align: 'left' as const, sortable: true },
  { 
    name: 'custom_fields', 
    label: 'Custom Fields', 
    field: (row: Record<string, unknown>) => {
      const schema = parsedSchema(row);
      return schema?.fields?.length || 0;
    },
    align: 'center' as const 
  },
  { name: 'actions', label: '', field: 'actions', align: 'right' as const }
];

function parsedSchema(category: Record<string, unknown> | null): { fields: CustomField[] } | null {
  if (!category?.custom_fields_schema) return null;
  try {
    let parsed = category.custom_fields_schema;
    if (typeof parsed === 'string') parsed = JSON.parse(parsed);
    if (typeof parsed === 'string') parsed = JSON.parse(parsed); // Handle double stringified DB rows
    return parsed as { fields: CustomField[] };
  } catch {
    return null;
  }
}

function getTypeColor(type: string) {
  switch (type) {
    case 'text': return 'blue';
    case 'number': return 'purple';
    case 'boolean': return 'green';
    default: return 'grey';
  }
}

function onRowClick(evt: Event, row: Record<string, unknown>) {
  selectedCategory.value = row;
  drawerOpen.value = true;
}

function openCreateModal() {
  $q.dialog({
    component: CreateCategoryModal,
  }).onOk(() => {
    void refetch();
  });
}

function openEditModal() {
  if (!selectedCategory.value) return;
  $q.dialog({
    component: EditCategoryModal,
    componentProps: {
      category: selectedCategory.value,
    }
  }).onOk(() => {
    void refetch();
    // Update selected category in drawer if still open, or close it
    drawerOpen.value = false;
  });
}
</script>

<style lang="scss" scoped>
.q-card--glass {
  background: rgba(19, 27, 46, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
.glass-table {
  :deep(.q-table__top) { border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
  :deep(th) { font-weight: 600; color: $grey-4; border-bottom-color: rgba(255, 255, 255, 0.05); }
  :deep(td) { border-bottom-color: rgba(255, 255, 255, 0.03); }
  :deep(tbody tr:hover) { background: rgba(255, 255, 255, 0.03); }
}
.bg-dark-card {
  background: rgba(19, 27, 46, 0.95);
  backdrop-filter: blur(20px);
}
.bg-dark-page {
  background: rgba(0, 0, 0, 0.2);
}
.border-bottom {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.font-mono {
  font-family: monospace;
}
</style>
