<template>
  <q-page class="q-pa-lg app-page">
    <div class="row items-center justify-between q-mb-lg">
      <h4 class="text-white q-my-none text-weight-bold" style="font-size: 24px">
        Organization setup
      </h4>
    </div>

    <div class="org-tabs-container q-mt-md">
      <!-- Tab Pills -->
      <div class="row items-center q-gutter-x-sm q-mb-xl">
        <q-btn
          v-for="t in tabs"
          :key="t.name"
          :label="t.label"
          :outline="tab !== t.name"
          :color="tab === t.name ? 'primary' : 'grey-5'"
          :text-color="tab === t.name ? 'white' : ''"
          rounded
          no-caps
          @click="tab = t.name"
          class="tab-btn"
          :class="{ 'tab-btn--active': tab === t.name }"
        />

        <q-btn
          v-if="tab !== 'employee'"
          outline
          color="positive"
          label="+ Add"
          rounded
          no-caps
          class="q-ml-sm tab-btn text-white"
          @click="handleAddClick"
        />
      </div>

      <!-- Tab Content -->
      <div>
        <DeptManagementTab
          v-if="tab === 'departments'"
          :departments="departmentsResult?.departments"
          :users="usersResult?.users"
          :loading="departmentsLoading"
          @update-status="handleUpdateDepartmentStatus"
          @assign-head="handleAssignHead"
        />
        <CategoryManagementTab
          v-if="tab === 'categories'"
          :categories="categoriesResult?.categories"
          :loading="categoriesLoading"
          @edit="handleEditCategory"
        />
        <EmployeeDirectoryTab
          v-if="tab === 'employee'"
          :users="usersResult?.users"
          :loading="usersLoading"
          @promote="handlePromote"
          @promote-dept-head="handlePromoteDeptHead"
          @promote-asset-manager="handlePromoteAssetManager"
        />
      </div>
    </div>

    <CreateDepartmentModal
      v-model="isDeptModalOpen"
      :users="usersResult?.users || []"
      :departments="departmentsResult?.departments || []"
      :loading="createDepartmentLoading"
      @submit="handleCreateDepartment"
    />

    <CategoryModal
      v-model="isCategoryModalOpen"
      :category="selectedCategory"
      :loading="createCategoryLoading || updateCategoryLoading"
      @submit="handleCategorySubmit"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useOrganization } from '../api/useOrganization';
import DeptManagementTab from './components/DeptManagementTab.vue';
import EmployeeDirectoryTab from './components/EmployeeDirectoryTab.vue';
import CategoryManagementTab from './components/CategoryManagementTab.vue';
import CreateDepartmentModal from './components/CreateDepartmentModal.vue';
import CategoryModal from './components/CategoryModal.vue';

interface Category {
  id: string;
  name: string;
  custom_fields_schema?: unknown;
}

const tab = ref('departments');
const isDeptModalOpen = ref(false);
const isCategoryModalOpen = ref(false);
const selectedCategory = ref<Category | null>(null);

const tabs = [
  { name: 'departments', label: 'Departments' },
  { name: 'categories', label: 'Categories' },
  { name: 'employee', label: 'Employee' },
];

const {
  departmentsResult,
  departmentsLoading,
  usersResult,
  usersLoading,
  categoriesResult,
  categoriesLoading,
  promoteToAdmin,
  promoteToDeptHead,
  promoteToAssetManager,
  createDepartment,
  createDepartmentLoading,
  updateDepartmentStatus,
  assignDepartmentHead,
  createCategory,
  createCategoryLoading,
  updateCategory,
  updateCategoryLoading,
} = useOrganization();

function handlePromote(userId: string) {
  void promoteToAdmin({ id: userId });
}

function handlePromoteDeptHead(userId: string) {
  void promoteToDeptHead({ id: userId });
}

function handlePromoteAssetManager(userId: string) {
  void promoteToAssetManager({ id: userId });
}

function handleUpdateDepartmentStatus(deptId: string, status: string) {
  void updateDepartmentStatus({ id: deptId, status });
}

function handleAssignHead(deptId: string, headId: string) {
  void assignDepartmentHead({ id: deptId, head_id: headId });
}

function handleAddClick() {
  if (tab.value === 'departments') {
    isDeptModalOpen.value = true;
  } else if (tab.value === 'categories') {
    selectedCategory.value = null;
    isCategoryModalOpen.value = true;
  }
}

function handleCreateDepartment(input: Record<string, unknown>) {
  createDepartment(input)
    .then(() => {
      isDeptModalOpen.value = false;
    })
    .catch((err) => console.error(err));
}

function handleEditCategory(category: Category) {
  selectedCategory.value = category;
  isCategoryModalOpen.value = true;
}

function handleCategorySubmit(payload: Record<string, unknown>) {
  if (selectedCategory.value) {
    updateCategory({ id: selectedCategory.value.id, ...payload })
      .then(() => {
        isCategoryModalOpen.value = false;
      })
      .catch((err) => console.error(err));
  } else {
    createCategory(payload)
      .then(() => {
        isCategoryModalOpen.value = false;
      })
      .catch((err) => console.error(err));
  }
}
</script>

<style lang="scss" scoped>
.app-page {
  background: transparent;
}
.tab-btn {
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  font-size: 13px;
  padding: 4px 16px;

  &--active {
    border-color: transparent !important;
    background: rgba(255, 255, 255, 0.1) !important;
  }
}
</style>
