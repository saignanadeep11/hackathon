<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <q-card class="glass-panel" style="min-width: 400px; padding: 16px">
      <q-card-section>
        <div class="text-h6 text-white font-semibold">Edit Department</div>
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
import { reactive, watch, computed } from 'vue';

interface Department {
  id: string;
  name: string;
  head?: { id?: string; name: string } | null;
  parent_department?: { id?: string; name: string } | null;
}

const props = defineProps<{
  modelValue: boolean;
  users: { id: string; name: string }[];
  departments: Department[];
  department: Department | null;
  loading: boolean;
}>();

const emit = defineEmits(['update:modelValue', 'submit']);

const form = reactive({
  name: '',
  head_id: null as string | null,
  parent_department_id: null as string | null,
});

// Avoid infinite recursion by not allowing a department to select itself as parent
const filteredDepartments = computed(() => {
  if (!props.department) return props.departments;
  return props.departments.filter((d) => d.id !== props.department?.id);
});

watch(
  () => props.department,
  (newVal) => {
    if (newVal) {
      form.name = newVal.name;
      form.head_id = newVal.head?.id || (typeof newVal.head === 'string' ? newVal.head : null);
      form.parent_department_id =
        newVal.parent_department?.id ||
        (typeof newVal.parent_department === 'string' ? newVal.parent_department : null);
    }
  },
  { immediate: true },
);

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
