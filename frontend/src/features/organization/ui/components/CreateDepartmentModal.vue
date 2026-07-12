<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <q-card class="glass-panel" style="min-width: 400px; padding: 16px">
      <q-card-section>
        <div class="text-h6 text-white">Create Department</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="onSubmit">
          <q-input
            v-model="form.name"
            label="Department Name"
            outlined
            dark
            class="q-mb-md"
            required
          />

          <q-select
            v-model="form.head_id"
            :options="users"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            label="Department Head (Optional)"
            outlined
            dark
            class="q-mb-md"
            clearable
          />

          <q-select
            v-model="form.parent_department_id"
            :options="departments"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            label="Parent Department (Optional)"
            outlined
            dark
            class="q-mb-md"
            clearable
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
  users: { id: string; name: string }[];
  departments: { id: string; name: string }[];
  loading: boolean;
}>();

const emit = defineEmits(['update:modelValue', 'submit']);

const form = reactive({
  name: '',
  head_id: null as string | null,
  parent_department_id: null as string | null,
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
