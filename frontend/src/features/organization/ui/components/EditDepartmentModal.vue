<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <q-card class="glass-panel" style="min-width: 400px; padding: 16px">
      <q-card-section>
        <div class="text-h6 text-white">Edit Department</div>
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
            :options="filteredUsers"
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
            :options="filteredDepartments"
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

          <q-select
            v-model="form.status"
            :options="['ACTIVE', 'INACTIVE']"
            label="Status"
            outlined
            dark
            class="q-mb-md"
          />

          <div class="row justify-end q-mt-md">
            <q-btn flat label="Cancel" color="white" v-close-popup />
            <q-btn type="submit" label="Save" color="primary" class="q-ml-sm" :loading="loading" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { reactive, watch, computed } from 'vue';

interface User {
  id: string;
  name: string;
  role: string;
}

interface Department {
  id: string;
  name: string;
  status: string;
  head_id?: string | null;
  head?: { id: string; name: string } | null;
  parent_department_id?: string | null;
  parent_department?: { id: string; name: string } | null;
}

const props = defineProps<{
  modelValue: boolean;
  department: Department | null;
  users: User[];
  departments: Department[];
  loading: boolean;
}>();

const emit = defineEmits(['update:modelValue', 'submit']);

const form = reactive({
  name: '',
  head_id: null as string | null,
  parent_department_id: null as string | null,
  status: 'ACTIVE',
});

// Watch department prop to load values when modal opens
watch(
  () => props.department,
  (newDept) => {
    if (newDept) {
      form.name = newDept.name || '';
      form.head_id = newDept.head?.id || newDept.head_id || null;
      form.parent_department_id =
        newDept.parent_department?.id || newDept.parent_department_id || null;
      form.status = newDept.status || 'ACTIVE';
    }
  },
  { immediate: true },
);

// Filter parent departments so a department cannot be its own parent
const filteredDepartments = computed(() => {
  return props.departments.filter((d) => d.id !== props.department?.id);
});

// Filter users to only show Department Heads
const filteredUsers = computed(() => {
  return props.users.filter((u) => u.role === 'DEPARTMENT_HEAD');
});

function onSubmit() {
  emit('submit', {
    id: props.department?.id,
    name: form.name,
    head_id: form.head_id,
    parent_department_id: form.parent_department_id,
    status: form.status,
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
