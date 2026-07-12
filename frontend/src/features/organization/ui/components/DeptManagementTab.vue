<template>
  <div class="dept-tab-container">
    <!-- Filter Bar -->
    <q-card class="bg-dark-card glass-border q-mb-md q-pa-md">
      <div class="row q-col-gutter-md items-center">
        <div class="col-12 col-md-6">
          <q-input
            v-model="searchQuery"
            placeholder="Search Departments..."
            dense
            outlined
            dark
            @keyup.enter="emit('apply-filter', searchQuery.trim())"
          >
            <template v-slot:prepend>
              <lucide-icon name="search" :size="18" class="text-grey-5" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-6 flex justify-end q-gutter-sm">
          <q-btn flat color="grey-5" no-caps label="Clear" @click="clearFilters" />
          <q-btn
            color="primary"
            no-caps
            label="Search"
            @click="emit('apply-filter', searchQuery.trim())"
          />
        </div>
      </div>
    </q-card>

    <q-table
      flat
      class="transparent-table"
      :rows="rows"
      :columns="columns"
      row-key="id"
      hide-pagination
      :loading="loading"
      :rows-per-page-options="[0]"
    >
      <template v-slot:body-cell-head="props">
        <q-td :props="props">
          <q-select
            :model-value="props.row.head?.id"
            :options="departmentHeads"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            dense
            outlined
            dark
            label="Select Head"
            style="min-width: 150px"
            @update:model-value="emit('assign-head', props.row.id, $event)"
          />
        </q-td>
      </template>

      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <div
            class="status-pill"
            :class="props.row.status === 'ACTIVE' ? 'status-active' : 'status-inactive'"
          >
            {{ props.row.status === 'ACTIVE' ? 'Active' : 'Inactive' }}
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="text-right">
          <q-btn
            outline
            color="primary"
            size="sm"
            label="Edit"
            no-caps
            class="q-mr-sm"
            @click="emit('edit-dept', props.row)"
          />
          <q-btn
            v-if="props.row.status === 'INACTIVE'"
            outline
            color="positive"
            size="sm"
            label="Set Active"
            no-caps
            @click="emit('update-status', props.row.id, 'ACTIVE')"
          />
          <q-btn
            v-if="props.row.status === 'ACTIVE'"
            outline
            color="negative"
            size="sm"
            label="Set Inactive"
            no-caps
            @click="emit('update-status', props.row.id, 'INACTIVE')"
          />
        </q-td>
      </template>
    </q-table>

    <!-- Pagination Footer -->
    <div class="row justify-between items-center q-mt-md" v-if="pageInfo">
      <div class="text-grey-5">Showing {{ departments?.length || 0 }} of {{ totalCount }}</div>
      <div class="q-gutter-sm">
        <q-btn
          outline
          color="primary"
          label="Previous"
          @click="emit('load-prev')"
          :disable="!pageInfo.hasPreviousPage"
          :loading="loading"
        />
        <q-btn
          outline
          color="primary"
          label="Next"
          @click="emit('load-next')"
          :disable="!pageInfo.hasNextPage"
          :loading="loading"
        />
      </div>
    </div>

    <div class="q-mt-lg text-grey-5 text-caption" style="font-family: monospace">
      Editing a department here also drives the picklist in Screen 4 & 5
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { QTableColumn } from 'quasar';
import type { GeneralStatus } from 'src/graphql/generated/graphql';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: { name: string };
}

interface Department {
  id: string;
  name: string;
  status: GeneralStatus;
  head?: { id?: string; name?: string; email?: string } | null;
  parent_department?: { id?: string; name?: string } | null;
}

interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string | null;
  endCursor?: string | null;
}

const props = defineProps<{
  departments?: Department[];
  users?: User[];
  loading: boolean;
  pageInfo?: PageInfo | null | undefined;
  totalCount?: number;
}>();

const emit = defineEmits([
  'update-status',
  'assign-head',
  'edit-dept',
  'load-next',
  'load-prev',
  'apply-filter',
]);

const searchQuery = ref('');

function clearFilters() {
  searchQuery.value = '';
  emit('apply-filter', '');
}

const departmentHeads = computed(() => {
  return (props.users || []).filter((u) => u.role === 'DEPARTMENT_HEAD');
});

const columns: QTableColumn[] = [
  { name: 'name', label: 'Department', align: 'left', field: 'name' },
  {
    name: 'head',
    label: 'Head',
    align: 'left',
    field: (row: Department) => row.head?.name || '--',
  },
  {
    name: 'parent',
    label: 'Parent Dept',
    align: 'left',
    field: (row: Department) => row.parent_department?.name || '--',
  },
  { name: 'status', label: 'Status', align: 'center', field: 'status' },
  { name: 'actions', label: 'Actions', align: 'right', field: 'actions' },
];

const rows = computed(() => props.departments || []);
</script>

<style lang="scss" scoped>
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
  padding: 4px 16px;
  display: inline-block;
  font-size: 12px;
  font-weight: 500;
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
