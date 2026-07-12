<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card class="q-card--glass" style="width: 500px; max-width: 90vw;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-white font-semibold">Register New Asset</div>
        <q-space />
        <q-btn flat round dense icon="close" color="grey-5" v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-md">
        <q-form @submit.prevent="handleSubmit" class="q-gutter-y-md">
          <!-- Asset Name -->
          <q-input
            v-model="form.name"
            label="Asset Name"
            filled
            dark
            :rules="[val => !!val || 'Name is required']"
            dense
          />

          <!-- Serial Number -->
          <q-input
            v-model="form.serial_number"
            label="Serial Number"
            filled
            dark
            :rules="[val => !!val || 'Serial number is required']"
            dense
          />

          <!-- Category -->
          <q-select
            v-model="selectedCategory"
            :options="categoryOptions"
            label="Category"
            filled
            dark
            dense
            option-value="id"
            option-label="name"
            :rules="[val => !!val || 'Category is required']"
            @update:model-value="handleCategoryChange"
          />

          <!-- Location -->
          <q-input
            v-model="form.location"
            label="Location"
            filled
            dark
            :rules="[val => !!val || 'Location is required']"
            dense
          />

          <div class="row q-col-gutter-md">
            <!-- Acquisition Date -->
            <div class="col-12 col-sm-6">
              <q-input
                v-model="form.acquisition_date"
                label="Acquisition Date"
                type="date"
                filled
                dark
                :rules="[val => !!val || 'Date is required']"
                dense
              />
            </div>
            <!-- Acquisition Cost -->
            <div class="col-12 col-sm-6">
              <q-input
                v-model.number="form.acquisition_cost"
                label="Acquisition Cost"
                type="number"
                prefix="$"
                filled
                dark
                :rules="[val => val !== null && val !== undefined && val >= 0 || 'Cost must be >= 0']"
                dense
              />
            </div>
          </div>

          <div class="row q-col-gutter-md">
            <!-- Condition -->
            <div class="col-12 col-sm-6">
              <q-select
                v-model="form.condition"
                :options="conditionOptions"
                label="Condition"
                filled
                dark
                dense
                :rules="[val => !!val || 'Condition is required']"
              />
            </div>
            <!-- Bookable Toggle -->
            <div class="col-12 col-sm-6 flex items-center justify-center">
              <q-toggle
                v-model="form.is_shared_bookable"
                label="Shared Bookable"
                dark
                color="primary"
              />
            </div>
          </div>

          <!-- Photo URL -->
          <q-input
            v-model="form.photo_url"
            label="Photo URL (Optional)"
            filled
            dark
            dense
          />

          <!-- Dynamic Custom Fields Section -->
          <template v-if="customFieldsSchema && customFieldsSchema.fields && customFieldsSchema.fields.length > 0">
            <div class="text-subtitle2 text-grey-4 q-mt-sm">Category Specific Fields</div>
            <div class="q-gutter-y-sm">
              <div v-for="field in customFieldsSchema.fields" :key="field.name">
                <!-- Text Custom Field -->
                <q-input
                  v-if="field.type === 'text'"
                  v-model="customFieldsData[field.name]"
                  :label="field.label"
                  filled
                  dark
                  dense
                  :rules="field.required ? [val => !!val || `${field.label} is required`] : []"
                />
                <!-- Number Custom Field -->
                <q-input
                  v-else-if="field.type === 'number'"
                  v-model.number="customFieldsData[field.name]"
                  :label="field.label"
                  type="number"
                  filled
                  dark
                  dense
                  :rules="field.required ? [val => val !== null && val !== undefined || `${field.label} is required`] : []"
                />
                <!-- Toggle Custom Field -->
                <q-toggle
                  v-else-if="field.type === 'boolean' || field.type === 'toggle'"
                  v-model="customFieldsData[field.name]"
                  :label="field.label"
                  dark
                  color="primary"
                />
              </div>
            </div>
          </template>

          <q-card-actions align="right" class="q-px-none q-pt-md">
            <q-btn flat label="Cancel" color="grey-5" v-close-popup />
            <q-btn type="submit" label="Register" color="primary" :loading="registerLoading" />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDialogPluginComponent, useQuasar } from 'quasar';
import { useCategories, useRegisterAsset } from '../api/useAssets';

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();
const $q = useQuasar();

const { categories } = useCategories();
const { registerAsset, registerLoading } = useRegisterAsset();

import type { GetCategoriesQuery } from 'src/graphql/generated/graphql';

type CategoryType = GetCategoriesQuery['categories'][number];

const selectedCategory = ref<CategoryType | null>(null);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const customFieldsData = ref<Record<string, any>>({});

const conditionOptions = ['NEW', 'GOOD', 'FAIR', 'POOR', 'DAMAGED'];

const form = ref({
  name: '',
  serial_number: '',
  location: '',
  acquisition_date: new Date().toISOString().split('T')[0],
  acquisition_cost: 0,
  condition: 'GOOD',
  is_shared_bookable: false,
  photo_url: '',
});

const categoryOptions = computed(() => categories.value);

interface SchemaField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
}

interface CustomSchema {
  fields?: SchemaField[];
}

const customFieldsSchema = computed<CustomSchema | null>(() => {
  if (!selectedCategory.value?.custom_fields_schema) return null;
  try {
    return typeof selectedCategory.value.custom_fields_schema === 'string'
      ? JSON.parse(selectedCategory.value.custom_fields_schema)
      : selectedCategory.value.custom_fields_schema;
  } catch {
    return null;
  }
});

function handleCategoryChange(category: CategoryType | null) {
  customFieldsData.value = {};
  if (category?.custom_fields_schema) {
    try {
      const parsed = typeof category.custom_fields_schema === 'string'
        ? JSON.parse(category.custom_fields_schema)
        : category.custom_fields_schema;
      if (parsed?.fields) {
        parsed.fields.forEach((field: SchemaField) => {
          if (field.type === 'boolean' || field.type === 'toggle') {
            customFieldsData.value[field.name] = false;
          } else {
            customFieldsData.value[field.name] = '';
          }
        });
      }
    } catch {
      // Ignore
    }
  }
}

async function handleSubmit() {
  if (!selectedCategory.value) {
    $q.notify({ type: 'negative', message: 'Category is required' });
    return;
  }

  try {
    const input = {
      name: form.value.name,
      serial_number: form.value.serial_number,
      category_id: selectedCategory.value.id,
      acquisition_date: new Date(form.value.acquisition_date as string),
      acquisition_cost: Number(form.value.acquisition_cost),
      condition: form.value.condition,
      location: form.value.location,
      is_shared_bookable: form.value.is_shared_bookable,
      photo_url: form.value.photo_url || undefined,
      custom_fields_data: JSON.stringify(customFieldsData.value),
    };

    await registerAsset(input);
    $q.notify({
      type: 'positive',
      message: 'Asset registered successfully',
      icon: 'check',
    });
    onDialogOK();
  } catch (error) {
    const err = error as Error;
    $q.notify({
      type: 'negative',
      message: err.message || 'Failed to register asset',
    });
  }
}
</script>

<style lang="scss" scoped>
.q-card--glass {
  background: rgba(19, 27, 46, 0.95);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4);
}
</style>
