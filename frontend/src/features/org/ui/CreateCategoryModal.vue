<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card class="q-card--glass" style="width: 600px; max-width: 95vw;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-white font-semibold">Create Asset Category</div>
        <q-space />
        <q-btn flat round dense icon="close" color="grey-5" v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-md">
        <q-form @submit.prevent="handleSubmit" class="q-gutter-y-md">
          <!-- Category Name -->
          <q-input
            v-model="categoryName"
            label="Category Name"
            filled
            dark
            :rules="[val => !!val || 'Name is required']"
            dense
          />

          <!-- Custom Fields Builder -->
          <div>
            <div class="row items-center justify-between q-mb-sm">
              <div class="text-subtitle2 text-grey-4">Custom Fields Schema</div>
              <q-btn
                flat
                dense
                color="primary"
                icon="add"
                label="Add Field"
                no-caps
                @click="addField"
              />
            </div>

            <div v-if="fields.length === 0" class="text-grey-6 text-caption text-center q-pa-md bg-dark-page rounded-borders">
              No custom fields added. This category will only use standard fields.
            </div>

            <div class="q-gutter-y-sm">
              <div v-for="(field, index) in fields" :key="index" class="row q-col-gutter-sm items-center bg-dark-page q-pa-sm rounded-borders">
                <!-- Field Name -->
                <div class="col-12 col-sm-3">
                  <q-input
                    v-model="field.name"
                    label="Internal Name"
                    hint="e.g. warranty_period"
                    filled
                    dark
                    dense
                    :rules="[val => !!val || 'Required', val => /^[a-z0-9_]+$/.test(val) || 'Lowercase, numbers, underscores only']"
                    hide-bottom-space
                  />
                </div>
                
                <!-- Field Label -->
                <div class="col-12 col-sm-3">
                  <q-input
                    v-model="field.label"
                    label="Display Label"
                    hint="e.g. Warranty Period"
                    filled
                    dark
                    dense
                    :rules="[val => !!val || 'Required']"
                    hide-bottom-space
                  />
                </div>

                <!-- Field Type -->
                <div class="col-12 col-sm-3">
                  <q-select
                    v-model="field.type"
                    :options="['text', 'number', 'boolean']"
                    label="Type"
                    filled
                    dark
                    dense
                    hide-bottom-space
                  />
                </div>

                <!-- Required Toggle & Remove -->
                <div class="col-12 col-sm-3 row items-center justify-between">
                  <q-checkbox v-model="field.required" label="Required" dark dense color="primary" />
                  <q-btn flat round dense color="negative" icon="close" @click="removeField(index)">
                    <q-tooltip>Remove Field</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </div>
          </div>

          <q-card-actions align="right" class="q-px-none q-pt-md">
            <q-btn flat label="Cancel" color="grey-5" v-close-popup />
            <q-btn type="submit" label="Create Category" color="primary" :loading="createLoading" />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDialogPluginComponent, useQuasar } from 'quasar';
import { useCreateCategory } from '../api/useCategories';

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();
const $q = useQuasar();

const { createCategory, createLoading } = useCreateCategory();

const categoryName = ref('');

interface CustomField {
  name: string;
  label: string;
  type: string;
  required: boolean;
}

const fields = ref<CustomField[]>([]);

function addField() {
  fields.value.push({
    name: '',
    label: '',
    type: 'text',
    required: false
  });
}

function removeField(index: number) {
  fields.value.splice(index, 1);
}

async function handleSubmit() {
  if (!categoryName.value) {
    return;
  }

  try {
    const schemaObj = { fields: fields.value };
    const schemaStr = JSON.stringify(schemaObj);
    
    await createCategory(categoryName.value, schemaStr);
    
    $q.notify({
      type: 'positive',
      message: 'Category created successfully',
      icon: 'check',
    });
    
    onDialogOK();
  } catch (error) {
    const err = error as Error;
    $q.notify({
      type: 'negative',
      message: err.message || 'Failed to create category',
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
.bg-dark-page {
  background: rgba(0, 0, 0, 0.2);
}
.rounded-borders {
  border-radius: $radius-sm;
}
</style>
