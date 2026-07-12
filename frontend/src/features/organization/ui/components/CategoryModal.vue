<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <q-card class="glass-panel" style="min-width: 500px; padding: 16px">
      <q-card-section>
        <div class="text-h6 text-white">{{ isEdit ? 'Edit Category' : 'Create Category' }}</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="onSubmit">
          <q-input
            v-model="form.name"
            label="Category Name"
            outlined
            dark
            class="q-mb-lg"
            required
            placeholder="e.g. Electronics, Furniture"
          />

          <div class="text-subtitle2 text-white q-mb-sm row items-center justify-between">
            <span>Custom Fields Schema (Optional)</span>
            <q-btn flat dense color="primary" label="+ Add Field" no-caps @click="addField" />
          </div>

          <div v-if="form.fields.length === 0" class="text-grey-5 q-mb-md text-caption">
            No custom fields defined. Click '+ Add Field' to define custom attributes (e.g.
            Warranty, Brand).
          </div>

          <div
            v-for="(field, index) in form.fields"
            :key="index"
            class="row items-center q-col-gutter-x-sm q-mb-md"
          >
            <div class="col">
              <q-input
                v-model="field.name"
                label="Field Label / Name"
                dense
                outlined
                dark
                required
                placeholder="e.g. warranty_period"
                :rules="[
                  (val) => !!val || 'Name required',
                  (val) => /^[a-zA-Z0-9_-]+$/.test(val) || 'Alphanumeric and _ or - only',
                ]"
              />
            </div>
            <div class="col-4">
              <q-select
                v-model="field.type"
                :options="['text', 'number', 'date', 'boolean']"
                label="Type"
                dense
                outlined
                dark
                emit-value
                map-options
                options-dense
                class="text-capitalize"
              />
            </div>
            <div class="col-auto">
              <q-btn
                flat
                round
                dense
                color="negative"
                @click="removeField(index)"
                style="margin-top: -20px"
              >
                <lucide-icon name="trash-2" size="18" />
              </q-btn>
            </div>
          </div>

          <div class="row justify-end q-mt-lg">
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

interface FieldItem {
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean';
}

interface Category {
  id: string;
  name: string;
  custom_fields_schema?: unknown;
}

const props = defineProps<{
  modelValue: boolean;
  category: Category | null;
  loading: boolean;
}>();

const emit = defineEmits(['update:modelValue', 'submit']);

const isEdit = computed(() => !!props.category);

const form = reactive({
  name: '',
  fields: [] as FieldItem[],
});

// Load category details if editing
watch(
  () => props.category,
  (newCat) => {
    if (newCat) {
      form.name = newCat.name;
      let schema: Record<string, unknown> = {};
      if (typeof newCat.custom_fields_schema === 'string') {
        try {
          schema = JSON.parse(newCat.custom_fields_schema) as Record<string, unknown>;
        } catch {
          schema = {};
        }
      } else if (newCat.custom_fields_schema && typeof newCat.custom_fields_schema === 'object') {
        schema = newCat.custom_fields_schema as Record<string, unknown>;
      }
      form.fields = Object.entries(schema).map(([name, val]) => {
        const item = val as Record<string, unknown> | null;
        return {
          name,
          type: (item?.type as 'text' | 'number' | 'date' | 'boolean') || 'text',
        };
      });
    } else {
      form.name = '';
      form.fields = [];
    }
  },
  { immediate: true },
);

// Reset form when opening modal for creation
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen && !props.category) {
      form.name = '';
      form.fields = [];
    }
  },
);

function addField() {
  form.fields.push({
    name: '',
    type: 'text',
  });
}

function removeField(index: number) {
  form.fields.splice(index, 1);
}

function onSubmit() {
  // Convert fields array back to the expected key-value schema object
  const schemaObj: Record<string, Record<string, string>> = {};
  for (const f of form.fields) {
    if (f.name.trim()) {
      schemaObj[f.name.trim()] = {
        type: f.type,
      };
    }
  }

  emit('submit', {
    id: props.category?.id,
    name: form.name,
    custom_fields_schema: JSON.stringify(schemaObj),
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
