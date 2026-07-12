<template>
  <q-select
    v-model="model"
    :options="options"
    use-input
    clearable
    :loading="loading"
    @filter="filterFn"
    :label="label"
    :option-label="optionLabel"
    :option-value="optionValue"
    emit-value
    map-options
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey"> No results </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from 'vue';

interface Props {
  modelValue: any;
  options: any[];
  label?: string;
  optionLabel?: string;
  optionValue?: string;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  optionLabel: 'name',
  optionValue: 'id',
});

const emit = defineEmits(['update:modelValue', 'search']);

const model = ref(props.modelValue);

function filterFn(val: string, update: (cb: () => void) => void) {
  // Pass the search text up to the parent to trigger GraphQL re-fetch
  emit('search', val);
  update(() => {
    // Options are externally controlled via props.options
  });
}
</script>
