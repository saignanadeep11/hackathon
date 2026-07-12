<template>
  <q-page class="q-pa-lg text-white">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h4 font-bold q-my-none text-white">Organization Setup</h1>
        <p class="text-subtitle2 text-grey-5 q-mt-xs q-mb-none">
          Manage departments, asset categories, and employee roles/status.
        </p>
      </div>
      <q-btn
        v-if="tab === 'departments'"
        color="primary"
        no-caps
        class="bg-gradient-primary btn-shadow font-semibold"
        @click="handleAddClick"
      >
        <lucide-icon name="plus" :size="16" class="q-mr-sm" />
        Add Department
      </q-btn>
    </div>

    <!-- Navigation Tabs -->
    <q-tabs
      v-model="tab"
      dense
      class="text-grey q-mb-md"
      active-color="primary"
      indicator-color="primary"
      align="left"
      narrow-indicator
    >
      <q-tab name="departments" label="Departments" />
      <q-tab name="categories" label="Asset Categories" />
      <q-tab name="employee" label="Employee Directory" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated class="bg-transparent q-pa-none">
      <!-- Departments Panel -->
      <q-tab-panel name="departments" class="q-pa-none">
        <DeptManagementTab
          :departments="paginatedDepts"
          :users="usersResult?.users"
          :loading="deptPageLoading"
          :page-info="deptPageInfo"
          :total-count="deptTotalCount"
          @update-status="handleUpdateDepartmentStatus"
          @assign-head="handleAssignHead"
          @edit-dept="handleEditDept"
          @load-next="handleDeptLoadNext"
          @load-prev="handleDeptLoadPrev"
          @apply-filter="handleDeptApplyFilter"
        />
      </q-tab-panel>

      <!-- Categories Panel -->
      <q-tab-panel name="categories" class="q-pa-none">
        <CategoriesTab />
      </q-tab-panel>

      <!-- Employee Panel -->
      <q-tab-panel name="employee" class="q-pa-none">
        <EmployeeDirectoryTab
          :users="paginatedUsers"
          :loading="userPageLoading"
          :page-info="userPageInfo"
          :total-count="userTotalCount"
          @edit-employee="handleEditUser"
          @load-next="handleUserLoadNext"
          @load-prev="handleUserLoadPrev"
          @apply-filter="handleUserApplyFilter"
        />
      </q-tab-panel>
    </q-tab-panels>

    <!-- Modals -->
    <CreateDepartmentModal
      v-model="isDeptModalOpen"
      :users="usersResult?.users || []"
      :departments="departmentsResult?.departments || []"
      :loading="createDepartmentLoading"
      @submit="handleCreateDepartment"
    />

    <EditDepartmentModal
      v-model="isEditDeptModalOpen"
      :users="usersResult?.users || []"
      :departments="departmentsResult?.departments || []"
      :department="selectedDept"
      :loading="updateDepartmentLoading"
      @submit="handleUpdateDepartment"
    />

    <EditUserModal
      v-model="isEditUserModalOpen"
      :departments="departmentsResult?.departments || []"
      :user="selectedUser"
      :loading="updateUserLoading"
      @submit="handleUpdateUser"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useOrganization, useDepartmentsPage, useUsersPage } from '../api/useOrganization';
import DeptManagementTab from './components/DeptManagementTab.vue';
import CategoriesTab from './components/CategoriesTab.vue';
import EmployeeDirectoryTab from './components/EmployeeDirectoryTab.vue';
import CreateDepartmentModal from './components/CreateDepartmentModal.vue';
import EditDepartmentModal from './components/EditDepartmentModal.vue';
import EditUserModal from './components/EditUserModal.vue';

const $q = useQuasar();
const tab = ref('departments');

interface Department {
  id: string;
  name: string;
  status: string;
  head?: { id?: string; name: string } | null;
  parent_department?: { id?: string; name: string } | null;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  department?: { id?: string; name: string } | null;
}

interface DepartmentInput {
  name?: string;
  head_id?: string | null;
  parent_department_id?: string | null;
}

interface UserInput {
  role?: string;
  status?: string;
  department_id?: string | null;
}

const isDeptModalOpen = ref(false);
const isEditDeptModalOpen = ref(false);
const selectedDept = ref<Department | null>(null);

const isEditUserModalOpen = ref(false);
const selectedUser = ref<User | null>(null);



const {
  departmentsResult,
  usersResult,
  createDepartment,
  createDepartmentLoading,
  updateDepartment,
  updateDepartmentLoading,
  updateDepartmentStatus,
  assignDepartmentHead,
  updateUser,
  updateUserLoading,
} = useOrganization();

const {
  variables: deptVariables,
  departments: paginatedDepts,
  pageInfo: deptPageInfo,
  totalCount: deptTotalCount,
  loading: deptPageLoading,
  refetch: refetchDeptsPage,
  fetchMore: fetchMoreDepts,
} = useDepartmentsPage({ first: 10 });

const {
  variables: userVariables,
  users: paginatedUsers,
  pageInfo: userPageInfo,
  totalCount: userTotalCount,
  loading: userPageLoading,
  refetch: refetchUsersPage,
  fetchMore: fetchMoreUsers,
} = useUsersPage({ first: 10 });

function handleDeptApplyFilter(search: string) {
  if (!search) {
    deptVariables.value = { first: 10 };
    return;
  }
  deptVariables.value = {
    first: 10,
    filter: {
      or: [
        {
          name: {
            icontains: search,
          },
        },
      ],
    },
  };
}

function handleDeptLoadNext() {
  if (!deptPageInfo.value?.hasNextPage || !deptPageInfo.value?.endCursor) return;
  void fetchMoreDepts({
    variables: {
      after: deptPageInfo.value.endCursor,
      before: undefined,
      first: 10,
      last: undefined,
    },
    updateQuery: (prev, { fetchMoreResult }) => {
      if (!fetchMoreResult) return prev;
      return fetchMoreResult;
    },
  });
}

function handleDeptLoadPrev() {
  if (!deptPageInfo.value?.hasPreviousPage || !deptPageInfo.value?.startCursor) return;
  void fetchMoreDepts({
    variables: {
      before: deptPageInfo.value.startCursor,
      after: undefined,
      last: 10,
      first: undefined,
    },
    updateQuery: (prev, { fetchMoreResult }) => {
      if (!fetchMoreResult) return prev;
      return fetchMoreResult;
    },
  });
}

function handleUserApplyFilter(search: string) {
  if (!search) {
    userVariables.value = { first: 10 };
    return;
  }
  userVariables.value = {
    first: 10,
    filter: {
      or: [
        {
          name: {
            icontains: search,
          },
        },
        {
          email: {
            icontains: search,
          },
        },
      ],
    },
  };
}

function handleUserLoadNext() {
  if (!userPageInfo.value?.hasNextPage || !userPageInfo.value?.endCursor) return;
  void fetchMoreUsers({
    variables: {
      after: userPageInfo.value.endCursor,
      before: undefined,
      first: 10,
      last: undefined,
    },
    updateQuery: (prev, { fetchMoreResult }) => {
      if (!fetchMoreResult) return prev;
      return fetchMoreResult;
    },
  });
}

function handleUserLoadPrev() {
  if (!userPageInfo.value?.hasPreviousPage || !userPageInfo.value?.startCursor) return;
  void fetchMoreUsers({
    variables: {
      before: userPageInfo.value.startCursor,
      after: undefined,
      last: 10,
      first: undefined,
    },
    updateQuery: (prev, { fetchMoreResult }) => {
      if (!fetchMoreResult) return prev;
      return fetchMoreResult;
    },
  });
}

function handleAddClick() {
  if (tab.value === 'departments') isDeptModalOpen.value = true;
}

function handleUpdateDepartmentStatus(deptId: string, status: string) {
  void updateDepartmentStatus({ id: deptId, status })
    .then(() => {
      $q.notify({ type: 'positive', message: 'Department status updated successfully.' });
      void refetchDeptsPage();
    })
    .catch((err: Error) => {
      $q.notify({
        type: 'negative',
        message: err.message || 'Failed to update department status.',
      });
    });
}

function handleAssignHead(deptId: string, headId: string) {
  void assignDepartmentHead({ id: deptId, head_id: headId })
    .then(() => {
      $q.notify({ type: 'positive', message: 'Department Head assigned successfully.' });
      void refetchDeptsPage();
    })
    .catch((err: Error) => {
      $q.notify({ type: 'negative', message: err.message || 'Failed to assign Department Head.' });
    });
}

function handleCreateDepartment(input: DepartmentInput) {
  void createDepartment(input)
    .then(() => {
      isDeptModalOpen.value = false;
      $q.notify({ type: 'positive', message: 'Department created successfully.' });
      void refetchDeptsPage();
    })
    .catch((err: Error) => {
      $q.notify({ type: 'negative', message: err.message || 'Failed to create department.' });
    });
}

function handleEditDept(dept: Department) {
  selectedDept.value = dept;
  isEditDeptModalOpen.value = true;
}

function handleUpdateDepartment(input: DepartmentInput) {
  if (!selectedDept.value) return;
  void updateDepartment({
    id: selectedDept.value.id,
    name: input.name,
    head_id: input.head_id,
    parent_department_id: input.parent_department_id,
  })
    .then(() => {
      isEditDeptModalOpen.value = false;
      selectedDept.value = null;
      $q.notify({ type: 'positive', message: 'Department updated successfully.' });
      void refetchDeptsPage();
      void refetchUsersPage();
    })
    .catch((err: Error) => {
      $q.notify({ type: 'negative', message: err.message || 'Failed to update department.' });
    });
}

function handleEditUser(user: User) {
  selectedUser.value = user;
  isEditUserModalOpen.value = true;
}

function handleUpdateUser(input: UserInput) {
  if (!selectedUser.value) return;
  void updateUser({
    id: selectedUser.value.id,
    role: input.role,
    status: input.status,
    department_id: input.department_id,
  })
    .then(() => {
      isEditUserModalOpen.value = false;
      selectedUser.value = null;
      $q.notify({ type: 'positive', message: 'Employee updated successfully.' });
      void refetchUsersPage();
      void refetchDeptsPage();
    })
    .catch((err: Error) => {
      $q.notify({ type: 'negative', message: err.message || 'Failed to update employee.' });
    });
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
