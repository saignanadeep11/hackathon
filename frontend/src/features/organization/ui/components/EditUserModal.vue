<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <q-card class="glass-panel" style="min-width: 400px; padding: 16px">
      <q-card-section>
        <div class="text-h6 text-white font-semibold">Edit Employee Details</div>
        <div class="text-caption text-grey-5">{{ user?.email }}</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="onSubmit">
          <!-- Name (Read only or editable? Let's make it editable for convenience) -->
          <q-input
            v-model="form.name"
            label="Name"
            outlined
            dark
            class="q-mb-md"
            required
            readonly
          />

          <!-- Department -->
          <q-select
            v-model="form.department_id"
            :options="departments"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            label="Department"
            outlined
            dark
            class="q-mb-md"
            clearable
          />

          <!-- Role -->
          <q-select
            v-model="form.role"
            :options="roleOptions"
            label="System Role"
            outlined
            dark
            class="q-mb-md"
            required
          />

          <!-- Status -->
          <q-select
            v-model="form.status"
            :options="statusOptions"
            label="Status"
            outlined
            dark
            class="q-mb-md"
            required
          />

          <div class="row justify-end q-mt-md">
            <q-btn flat label="Cancel" color="white" v-close-popup />
            <q-btn
              type="submit"
              label="Save Changes"
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
import { reactive, watch } from 'vue';

interface Department {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  department?: { id?: string; name: string } | null;
}

const props = defineProps<{
  modelValue: boolean;
  departments: Department[];
  user: User | null;
  loading: boolean;
}>();

const emit = defineEmits(['update:modelValue', 'submit']);

const roleOptions = [
  { label: 'Administrator', value: 'ADMIN' },
  { label: 'Asset Manager', value: 'ASSET_MANAGER' },
  { label: 'Department Head', value: 'DEPARTMENT_HEAD' },
  { label: 'Employee', value: 'EMPLOYEE' },
];

const statusOptions = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
];

const form = reactive({
  name: '',
  department_id: null as string | null,
  role: 'EMPLOYEE',
  status: 'ACTIVE',
});

watch(
  () => props.user,
  (newVal) => {
    if (newVal) {
      form.name = newVal.name;
      form.department_id =
        newVal.department?.id || (typeof newVal.department === 'string' ? newVal.department : null);
      form.role = newVal.role;
      form.status = newVal.status;
    }
  },
  { immediate: true },
);

function onSubmit() {
  emit('submit', {
    role: form.role,
    status: form.status,
    department_id: form.department_id,
  });
}
</script>

<style lang="scss" scoped>
.glass-panel {
  background: $glass-bg;
  border: 1px solid $glass-border;
  backdrop-filter: blur($glass-blur);
}
</style>
