<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <q-card class="glass-panel" style="min-width: 400px; padding: 16px">
      <q-card-section>
        <div class="text-h6 text-white">Register Asset</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="onSubmit">
          <q-input
            v-model="form.asset_tag"
            label="Asset Tag"
            outlined
            dark
            class="q-mb-md"
            required
          />
          <q-input v-model="form.name" label="Name" outlined dark class="q-mb-md" required />
          <q-input
            v-model="form.serial_number"
            label="Serial Number"
            outlined
            dark
            class="q-mb-md"
            required
          />

          <q-select
            v-model="form.category_id"
            :options="categories"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            label="Category"
            outlined
            dark
            class="q-mb-md"
            required
          />

          <q-input
            v-model="form.acquisition_date"
            type="date"
            label="Acquisition Date"
            outlined
            dark
            class="q-mb-md"
            required
          />
          <q-input
            v-model.number="form.acquisition_cost"
            type="number"
            label="Acquisition Cost"
            outlined
            dark
            class="q-mb-md"
            required
          />
          <q-input
            v-model="form.condition"
            label="Condition (e.g. New, Good)"
            outlined
            dark
            class="q-mb-md"
            required
          />
          <q-input
            v-model="form.location"
            label="Location (e.g. HQ, Room A)"
            outlined
            dark
            class="q-mb-md"
            required
          />
          <q-toggle
            v-model="form.is_shared_bookable"
            label="Is Shared Bookable"
            color="primary"
            dark
            class="q-mb-md"
          />

          <div class="row justify-end q-mt-md">
            <q-btn flat label="Cancel" color="white" v-close-popup />
            <q-btn
              type="submit"
              label="Submit"
              color="primary"
              class="q-ml-sm"
              :loading="loading"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

defineProps<{
  modelValue: boolean;
  categories: { id: string; name: string }[];
  loading: boolean;
}>();

const emit = defineEmits(['update:modelValue', 'submit']);

const form = reactive({
  asset_tag: '',
  name: '',
  serial_number: '',
  category_id: null as string | null,
  acquisition_date: '',
  acquisition_cost: 0,
  condition: '',
  location: '',
  is_shared_bookable: false,
});

function onSubmit() {
  emit('submit', { ...form });
}
</script>

<style lang="scss" scoped>
.glass-panel {
  background: $glass-bg;
  border: 1px solid $glass-border;
  backdrop-filter: blur($glass-blur);
}
</style>
