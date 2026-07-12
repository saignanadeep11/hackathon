<template>
  <div class="dept-tab-container">
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
    <div class="q-mt-lg text-grey-5 text-caption" style="font-family: monospace">
      Editing a department here also drives the picklist in Screen 4 & 5
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { QTableColumn } from 'quasar';

interface Department {
  id: string;
  name: string;
  status: string;
  head?: { name: string };
  parent_department?: { name: string };
}

const props = defineProps<{
  departments?: Department[];
  users?: Record<string, unknown>[];
  loading: boolean;
}>();

const emit = defineEmits(['update-status', 'assign-head']);

const departmentHeads = computed(() => {
  return (props.users || []).filter((u: any) => u.role === 'DEPARTMENT_HEAD');
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
