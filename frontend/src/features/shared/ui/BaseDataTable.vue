<template>
  <q-table
    :rows="rows"
    :columns="columns"
    :loading="loading"
    v-model:pagination="pagination"
    @request="onRequest"
    flat
    bordered
  >
    <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </q-table>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, watch } from 'vue';

interface Props {
  rows: any[];
  columns: any[];
  loading?: boolean;
  totalCount?: number;
}

const props = defineProps<Props>();
const emit = defineEmits(['request']);

const pagination = ref({
  sortBy: 'id',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: props.totalCount || 0,
});

watch(
  () => props.totalCount,
  (newVal) => {
    pagination.value.rowsNumber = newVal || 0;
  }
);

function onRequest(props: any) {
  const { page, rowsPerPage, sortBy, descending } = props.pagination;
  pagination.value = props.pagination;

  emit('request', {
    offset: (page - 1) * rowsPerPage,
    limit: rowsPerPage,
    sortBy,
    descending,
  });
}
</script>
