<template>
  <div class="category-tab-container">
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
      <template v-slot:body-cell-customFields="props">
        <q-td :props="props">
          <span v-if="getFieldsList(props.row).length === 0" class="text-grey-6">None</span>
          <q-badge
            v-for="field in getFieldsList(props.row)"
            :key="field.name"
            color="primary"
            outline
            class="q-mr-xs q-my-xs text-capitalize"
          >
            {{ field.name }} ({{ field.type }})
          </q-badge>
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
            @click="emit('edit', props.row)"
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { QTableColumn } from 'quasar';

interface Category {
  id: string;
  name: string;
  custom_fields_schema?: unknown;
}

const props = defineProps<{
  categories?: Category[];
  loading: boolean;
}>();

const emit = defineEmits(['edit']);

const columns: QTableColumn[] = [
  { name: 'name', label: 'Category Name', align: 'left', field: 'name' },
  {
    name: 'customFields',
    label: 'Custom Fields Schema',
    align: 'left',
    field: (row: Category) => row.custom_fields_schema,
  },
  { name: 'actions', label: 'Actions', align: 'right', field: 'actions' },
];

const rows = computed(() => props.categories || []);

function getFieldsList(row: Category) {
  let schema = row.custom_fields_schema;
  if (!schema) return [];
  if (typeof schema === 'string') {
    try {
      schema = JSON.parse(schema) as Record<string, unknown>;
    } catch {
      return [];
    }
  }
  return Object.entries(schema as Record<string, unknown>).map(([name, val]) => {
    const item = val as Record<string, unknown> | null;
    return {
      name,
      type: (item?.type as string) || 'text',
    };
  });
}
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
