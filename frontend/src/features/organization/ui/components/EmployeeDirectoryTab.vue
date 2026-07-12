<template>
  <div class="employee-tab-container">
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
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="text-right">
          <q-btn
            v-if="props.row.role !== 'ADMIN'"
            outline
            color="primary"
            size="sm"
            label="Promote to Admin"
            no-caps
            class="q-mr-sm"
            @click="emit('promote', props.row.id)"
          />
          <q-btn
            v-if="props.row.role !== 'DEPARTMENT_HEAD' && props.row.role !== 'ADMIN'"
            outline
            color="secondary"
            size="sm"
            label="Promote to Dept Head"
            no-caps
            class="q-mr-sm"
            @click="emit('promote-dept-head', props.row.id)"
          />
          <q-btn
            v-if="props.row.role !== 'ASSET_MANAGER' && props.row.role !== 'ADMIN'"
            outline
            color="accent"
            size="sm"
            label="Promote to Asset Manager"
            no-caps
            @click="emit('promote-asset-manager', props.row.id)"
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { QTableColumn } from 'quasar';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: { name: string };
}

const props = defineProps<{
  users?: User[];
  loading: boolean;
}>();

const emit = defineEmits(['promote', 'promote-dept-head', 'promote-asset-manager']);

const columns: QTableColumn[] = [
  { name: 'name', label: 'Employee', align: 'left', field: 'name' },
  { name: 'email', label: 'Email', align: 'left', field: 'email' },
  {
    name: 'department',
    label: 'Department',
    align: 'left',
    field: (row: User) => row.department?.name || '--',
  },
  { name: 'role', label: 'Role', align: 'left', field: 'role' },
  { name: 'actions', label: 'Actions', align: 'right', field: 'actions' },
];

const rows = computed(() => props.users || []);
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
</style>
