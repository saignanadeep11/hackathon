<template>
  <q-page class="q-pa-lg text-white">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h4 font-bold q-my-none text-white">Asset Allocations</h1>
        <p class="text-subtitle2 text-grey-5 q-mt-xs q-mb-none">
          Track, request, and manage asset assignments across the organization.
        </p>
      </div>
      <div class="q-gutter-x-sm">
        <q-btn
          v-if="isManager"
          color="primary"
          no-caps
          class="bg-gradient-primary btn-shadow font-semibold"
          @click="openAssignModal"
        >
          <lucide-icon name="user-plus" :size="16" class="q-mr-sm" />
          Assign Asset
        </q-btn>
        <q-btn
          v-else
          color="primary"
          no-caps
          class="bg-gradient-primary btn-shadow font-semibold"
          @click="openRequestModal"
        >
          <lucide-icon name="plus" :size="16" class="q-mr-sm" />
          Request Asset
        </q-btn>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <q-tabs
      v-model="currentTab"
      dense
      class="text-grey q-mb-md"
      active-color="primary"
      indicator-color="primary"
      align="left"
      narrow-indicator
    >
      <q-tab name="my-allocations" label="My Allocations" />
      <q-tab v-if="isManager" name="pending-requests" label="Pending Requests" />
      <q-tab name="all-allocations" label="Allocation History" />
    </q-tabs>

    <q-tab-panels v-model="currentTab" animated class="bg-transparent q-pa-none">
      <!-- 1. My Allocations Tab -->
      <q-tab-panel name="my-allocations" class="q-pa-none">
        <q-card class="q-card--glass">
          <q-table
            :rows="myAllocationsRows"
            :columns="columns"
            row-key="id"
            class="q-table--glass text-white"
            dark
            flat
            dense
            :loading="loading"
            no-data-label="No assets allocated to you currently"
          >
            <template v-slot:body-cell-asset_tag="props">
              <q-td :props="props" class="font-mono text-primary font-semibold">
                {{ props.row.asset?.asset_tag || 'N/A' }}
              </q-td>
            </template>

            <template v-slot:body-cell-asset_name="props">
              <q-td :props="props" class="font-semibold">
                {{ props.row.asset?.name || 'N/A' }}
              </q-td>
            </template>

            <template v-slot:body-cell-allocated_to="props">
              <q-td :props="props">
                <span v-if="props.row.allocated_to_user">
                  <lucide-icon name="user" :size="12" class="q-mr-xs text-grey-5" />
                  {{ props.row.allocated_to_user.name }}
                </span>
                <span v-else-if="props.row.allocated_to_department">
                  <lucide-icon name="building" :size="12" class="q-mr-xs text-grey-5" />
                  {{ props.row.allocated_to_department.name }}
                </span>
                <span v-else class="text-grey-6">-</span>
              </q-td>
            </template>

            <template v-slot:body-cell-expected_return_date="props">
              <q-td :props="props">
                {{
                  props.row.expected_return_date
                    ? new Date(props.row.expected_return_date).toLocaleDateString()
                    : 'Indefinite'
                }}
              </q-td>
            </template>

            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-chip
                  :color="getStatusColor(props.row.status)"
                  text-color="white"
                  dense
                  square
                  class="text-uppercase text-weight-bold font-semibold"
                  style="font-size: 10px"
                >
                  {{ props.row.status }}
                </q-chip>
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="q-gutter-x-sm text-right">
                <q-btn
                  v-if="props.row.status === 'APPROVED' || props.row.status === 'ACTIVE'"
                  color="accent"
                  no-caps
                  dense
                  size="sm"
                  class="px-3"
                  @click="openReturnModal(props.row)"
                >
                  <lucide-icon name="arrow-left" :size="14" class="q-mr-xs" />
                  Return Asset
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card>
      </q-tab-panel>

      <!-- 2. Pending Requests Tab -->
      <q-tab-panel v-if="isManager" name="pending-requests" class="q-pa-none">
        <q-card class="q-card--glass">
          <q-table
            :rows="pendingAllocationsRows"
            :columns="columns"
            row-key="id"
            class="q-table--glass text-white"
            dark
            flat
            dense
            :loading="loading"
            no-data-label="No pending allocation requests"
          >
            <template v-slot:body-cell-asset_tag="props">
              <q-td :props="props" class="font-mono text-primary font-semibold">
                {{ props.row.asset?.asset_tag || 'N/A' }}
              </q-td>
            </template>

            <template v-slot:body-cell-asset_name="props">
              <q-td :props="props" class="font-semibold">
                {{ props.row.asset?.name || 'N/A' }}
              </q-td>
            </template>

            <template v-slot:body-cell-allocated_to="props">
              <q-td :props="props">
                <span v-if="props.row.allocated_to_user">
                  <lucide-icon name="user" :size="12" class="q-mr-xs text-grey-5" />
                  {{ props.row.allocated_to_user.name }}
                </span>
                <span v-else-if="props.row.allocated_to_department">
                  <lucide-icon name="building" :size="12" class="q-mr-xs text-grey-5" />
                  {{ props.row.allocated_to_department.name }}
                </span>
                <span v-else class="text-grey-6">-</span>
              </q-td>
            </template>

            <template v-slot:body-cell-expected_return_date="props">
              <q-td :props="props">
                {{
                  props.row.expected_return_date
                    ? new Date(props.row.expected_return_date).toLocaleDateString()
                    : 'Indefinite'
                }}
              </q-td>
            </template>

            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-chip
                  :color="getStatusColor(props.row.status)"
                  text-color="white"
                  dense
                  square
                  class="text-uppercase text-weight-bold font-semibold"
                  style="font-size: 10px"
                >
                  {{ props.row.status }}
                </q-chip>
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="q-gutter-x-sm text-right">
                <q-btn
                  color="positive"
                  no-caps
                  dense
                  size="sm"
                  class="px-2"
                  @click="handleApprove(props.row.id)"
                >
                  <lucide-icon name="check" :size="14" class="q-mr-xs" />
                  Approve
                </q-btn>
                <q-btn
                  color="negative"
                  no-caps
                  dense
                  size="sm"
                  class="px-2"
                  @click="handleReject(props.row.id)"
                >
                  <lucide-icon name="x" :size="14" class="q-mr-xs" />
                  Reject
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card>
      </q-tab-panel>

      <!-- 3. All Allocations Tab -->
      <q-tab-panel name="all-allocations" class="q-pa-none">
        <q-card class="q-card--glass">
          <q-table
            :rows="allAllocationsRows"
            :columns="columns"
            row-key="id"
            class="q-table--glass text-white"
            dark
            flat
            dense
            :loading="loading"
            no-data-label="No allocation records found"
          >
            <template v-slot:body-cell-asset_tag="props">
              <q-td :props="props" class="font-mono text-primary font-semibold">
                {{ props.row.asset?.asset_tag || 'N/A' }}
              </q-td>
            </template>

            <template v-slot:body-cell-asset_name="props">
              <q-td :props="props" class="font-semibold">
                {{ props.row.asset?.name || 'N/A' }}
              </q-td>
            </template>

            <template v-slot:body-cell-allocated_to="props">
              <q-td :props="props">
                <span v-if="props.row.allocated_to_user">
                  <lucide-icon name="user" :size="12" class="q-mr-xs text-grey-5" />
                  {{ props.row.allocated_to_user.name }}
                </span>
                <span v-else-if="props.row.allocated_to_department">
                  <lucide-icon name="building" :size="12" class="q-mr-xs text-grey-5" />
                  {{ props.row.allocated_to_department.name }}
                </span>
                <span v-else class="text-grey-6">-</span>
              </q-td>
            </template>

            <template v-slot:body-cell-expected_return_date="props">
              <q-td :props="props">
                {{
                  props.row.expected_return_date
                    ? new Date(props.row.expected_return_date).toLocaleDateString()
                    : 'Indefinite'
                }}
              </q-td>
            </template>

            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-chip
                  :color="getStatusColor(props.row.status)"
                  text-color="white"
                  dense
                  square
                  class="text-uppercase text-weight-bold font-semibold"
                  style="font-size: 10px"
                >
                  {{ props.row.status }}
                </q-chip>
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="q-gutter-x-sm text-right">
                <span
                  v-if="props.row.status === 'RETURNED' && props.row.check_in_notes"
                  class="text-grey-5 text-caption"
                >
                  Notes: {{ props.row.check_in_notes }}
                </span>
                <q-btn
                  v-else-if="
                    (isManager || props.row.requested_by?.id === currentUser?.id) &&
                    (props.row.status === 'APPROVED' || props.row.status === 'ACTIVE')
                  "
                  color="accent"
                  no-caps
                  dense
                  size="sm"
                  class="px-3"
                  @click="openReturnModal(props.row)"
                >
                  <lucide-icon name="arrow-left" :size="14" class="q-mr-xs" />
                  Return Asset
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card>
      </q-tab-panel>
    </q-tab-panels>

    <!-- Dialogs -->

    <!-- Direct Assign Dialog (Admin/Manager) -->
    <q-dialog v-model="assignModalOpen" persistent>
      <q-card
        class="q-card--glass text-white q-pa-md"
        style="min-width: 400px; border: 1px solid rgba(255, 255, 255, 0.1)"
      >
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 font-bold">Assign Asset Directly</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit="submitDirectAssign" class="q-gutter-md">
            <!-- Asset Selection -->
            <q-select
              v-model="assignForm.asset_id"
              :options="availableAssetOptions"
              label="Select Asset"
              filled
              dark
              map-options
              emit-value
              required
              :rules="[(v) => !!v || 'Asset is required']"
            />

            <!-- Assignment Type Toggle -->
            <div class="row items-center justify-between q-my-sm">
              <span class="text-subtitle2 text-grey-4">Assign To:</span>
              <q-btn-toggle
                v-model="assignForm.type"
                toggle-color="primary"
                flat
                dark
                dense
                :options="[
                  { label: 'User', value: 'user' },
                  { label: 'Department', value: 'department' },
                ]"
              />
            </div>

            <!-- User Selector -->
            <q-select
              v-if="assignForm.type === 'user'"
              v-model="assignForm.allocated_to_user_id"
              :options="userOptions"
              label="Select Employee"
              filled
              dark
              map-options
              emit-value
              required
              :rules="[(v) => !!v || 'Employee is required']"
            />

            <!-- Department Selector -->
            <q-select
              v-else
              v-model="assignForm.allocated_to_department_id"
              :options="departmentOptions"
              label="Select Department"
              filled
              dark
              map-options
              emit-value
              required
              :rules="[(v) => !!v || 'Department is required']"
            />

            <!-- Expected Return Date -->
            <q-input
              v-model="assignForm.expected_return_date"
              filled
              dark
              label="Expected Return Date (Optional)"
              type="date"
            />

            <div class="row justify-end q-mt-md">
              <q-btn label="Cancel" flat v-close-popup class="text-grey-4" />
              <q-btn
                label="Assign Now"
                type="submit"
                color="primary"
                class="q-ml-sm"
                :loading="requestLoading"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Request Allocation Dialog (Employee) -->
    <q-dialog v-model="requestModalOpen" persistent>
      <q-card
        class="q-card--glass text-white q-pa-md"
        style="min-width: 400px; border: 1px solid rgba(255, 255, 255, 0.1)"
      >
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 font-bold">Request Asset Allocation</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit="submitRequest" class="q-gutter-md">
            <!-- Asset Selection -->
            <q-select
              v-model="requestForm.asset_id"
              :options="availableAssetOptions"
              label="Select Asset"
              filled
              dark
              map-options
              emit-value
              required
              :rules="[(v) => !!v || 'Asset is required']"
            />

            <!-- Expected Return Date -->
            <q-input
              v-model="requestForm.expected_return_date"
              filled
              dark
              label="Expected Return Date (Optional)"
              type="date"
            />

            <div class="row justify-end q-mt-md">
              <q-btn label="Cancel" flat v-close-popup class="text-grey-4" />
              <q-btn
                label="Submit Request"
                type="submit"
                color="primary"
                class="q-ml-sm"
                :loading="requestLoading"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Return Asset Dialog -->
    <q-dialog v-model="returnModalOpen" persistent>
      <q-card
        class="q-card--glass text-white q-pa-md"
        style="min-width: 400px; border: 1px solid rgba(255, 255, 255, 0.1)"
      >
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 font-bold">Return Asset</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit="submitReturn" class="q-gutter-md">
            <p class="text-grey-4 text-subtitle2">
              Are you sure you want to return this asset? Please capture its current condition
              details below.
            </p>

            <q-input
              v-model="returnForm.check_in_notes"
              filled
              dark
              type="textarea"
              label="Condition & Return Notes"
              placeholder="e.g. Returned in perfect condition, power supply included."
              required
              :rules="[(v) => !!v || 'Notes are required to log asset check-in']"
            />

            <div class="row justify-end q-mt-md">
              <q-btn label="Cancel" flat v-close-popup class="text-grey-4" />
              <q-btn
                label="Confirm Return"
                type="submit"
                color="accent"
                class="q-ml-sm"
                :loading="returnLoading"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { GetAllocationsQuery } from 'src/graphql/generated/graphql';
import { useAuthStore } from 'src/stores/auth.store';
import { useAssets } from 'src/features/assets/api/useAssets';
import { useOrganization } from 'src/features/organization/api/useOrganization';
import {
  useAllocations,
  useRequestAllocation,
  useApproveAllocation,
  useRejectAllocation,
  useReturnAsset,
} from 'src/features/allocations/api/useAllocations';

const authStore = useAuthStore();
const currentUser = computed(() => authStore.user);
const isManager = computed(() => ['ADMIN', 'ASSET_MANAGER'].includes(authStore.currentRole || ''));

const currentTab = ref('my-allocations');

// Fetch Allocations list
const { allocations, loading, refetch } = useAllocations();

// Fetch Organization data (users & departments) for selectors
const { usersResult, departmentsResult } = useOrganization();

// Fetch Assets list to choose from (only AVAILABLE assets)
const { assets: allAssets, refetch: refetchAssets } = useAssets();

const availableAssetOptions = computed(() => {
  return (allAssets.value || [])
    .filter((a) => a.status === 'AVAILABLE')
    .map((a) => ({
      label: `${a.name} (${a.asset_tag})`,
      value: a.id,
    }));
});

const userOptions = computed(() => {
  return (usersResult.value?.users || []).map((u: { id: string; name: string; email: string }) => ({
    label: `${u.name} (${u.email})`,
    value: u.id,
  }));
});

const departmentOptions = computed(() => {
  return (departmentsResult.value?.departments || []).map((d: { id: string; name: string }) => ({
    label: d.name,
    value: d.id,
  }));
});

// Row filtering logic
const myAllocationsRows = computed(() => {
  const currentUserId = currentUser.value?.id;
  return (allocations.value || []).filter((a) => {
    const isAssignedToMe = a.allocated_to_user?.id === currentUserId;
    // Allow return if in active status
    return isAssignedToMe && ['REQUESTED', 'APPROVED', 'ACTIVE'].includes(a.status);
  });
});

const pendingAllocationsRows = computed(() => {
  return (allocations.value || []).filter((a) => a.status === 'REQUESTED');
});

const allAllocationsRows = computed(() => {
  return allocations.value || [];
});

// Table columns
const columns = [
  {
    name: 'asset_tag',
    label: 'Asset Tag',
    field: (row: GetAllocationsQuery['allocations'][number]) => row.asset?.asset_tag,
    align: 'left' as const,
  },
  {
    name: 'asset_name',
    label: 'Asset Name',
    field: (row: GetAllocationsQuery['allocations'][number]) => row.asset?.name,
    align: 'left' as const,
  },
  {
    name: 'allocated_to',
    label: 'Allocated To',
    field: (row: GetAllocationsQuery['allocations'][number]) =>
      row.allocated_to_user?.name || row.allocated_to_department?.name,
    align: 'left' as const,
  },
  {
    name: 'requested_by',
    label: 'Requested By',
    field: (row: GetAllocationsQuery['allocations'][number]) => row.requested_by?.name,
    align: 'left' as const,
  },
  {
    name: 'expected_return_date',
    label: 'Expected Return',
    field: 'expected_return_date',
    align: 'left' as const,
  },
  { name: 'status', label: 'Status', field: 'status', align: 'center' as const },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' as const },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'REQUESTED':
      return 'warning';
    case 'APPROVED':
    case 'ACTIVE':
      return 'positive';
    case 'RETURNED':
      return 'grey-7';
    case 'REJECTED':
      return 'negative';
    default:
      return 'primary';
  }
};

// Actions & Mutations
const { requestAllocation, requestLoading } = useRequestAllocation();
const { approveAllocation } = useApproveAllocation();
const { rejectAllocation } = useRejectAllocation();
const { returnAsset, returnLoading } = useReturnAsset();

// Assign Modal
const assignModalOpen = ref(false);
const assignForm = ref({
  asset_id: '',
  type: 'user',
  allocated_to_user_id: '',
  allocated_to_department_id: '',
  expected_return_date: '',
});

function openAssignModal() {
  assignForm.value = {
    asset_id: '',
    type: 'user',
    allocated_to_user_id: '',
    allocated_to_department_id: '',
    expected_return_date: '',
  };
  assignModalOpen.value = true;
}

async function submitDirectAssign() {
  try {
    const input = {
      asset_id: assignForm.value.asset_id,
      allocated_to_user_id:
        assignForm.value.type === 'user' ? assignForm.value.allocated_to_user_id : undefined,
      allocated_to_department_id:
        assignForm.value.type === 'department'
          ? assignForm.value.allocated_to_department_id
          : undefined,
      expected_return_date: assignForm.value.expected_return_date
        ? new Date(assignForm.value.expected_return_date)
        : undefined,
    };

    // First, request the allocation
    const req = await requestAllocation(input);
    if (req?.id) {
      // Direct assignment instantly approves it
      await approveAllocation(req.id);
    }

    assignModalOpen.value = false;
    void refetch();
    void refetchAssets();
  } catch (err) {
    console.error(err);
  }
}

// Request Modal
const requestModalOpen = ref(false);
const requestForm = ref({
  asset_id: '',
  expected_return_date: '',
});

function openRequestModal() {
  requestForm.value = {
    asset_id: '',
    expected_return_date: '',
  };
  requestModalOpen.value = true;
}

async function submitRequest() {
  try {
    const input = {
      asset_id: requestForm.value.asset_id,
      allocated_to_user_id: currentUser.value?.id,
      expected_return_date: requestForm.value.expected_return_date
        ? new Date(requestForm.value.expected_return_date)
        : undefined,
    };
    await requestAllocation(input);
    requestModalOpen.value = false;
    void refetch();
    void refetchAssets();
  } catch (err) {
    console.error(err);
  }
}

// Approve / Reject
async function handleApprove(id: string) {
  try {
    await approveAllocation(id);
    void refetch();
    void refetchAssets();
  } catch (err) {
    console.error(err);
  }
}

async function handleReject(id: string) {
  try {
    await rejectAllocation(id);
    void refetch();
    void refetchAssets();
  } catch (err) {
    console.error(err);
  }
}

// Return Modal
const returnModalOpen = ref(false);
const returnForm = ref({
  id: '',
  check_in_notes: '',
});

function openReturnModal(row: GetAllocationsQuery['allocations'][number]) {
  returnForm.value = {
    id: row.id,
    check_in_notes: '',
  };
  returnModalOpen.value = true;
}

async function submitReturn() {
  try {
    await returnAsset(returnForm.value.id, returnForm.value.check_in_notes);
    returnModalOpen.value = false;
    void refetch();
    void refetchAssets();
  } catch (err) {
    console.error(err);
  }
}
</script>

<style scoped lang="scss">
.px-3 {
  padding-left: 12px;
  padding-right: 12px;
}
.px-2 {
  padding-left: 8px;
  padding-right: 8px;
}
</style>
