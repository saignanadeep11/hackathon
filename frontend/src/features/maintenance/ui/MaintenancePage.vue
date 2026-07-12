<template>
  <q-page class="q-pa-lg text-white">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h4 font-bold q-my-none text-white">Maintenance Management</h1>
        <p class="text-subtitle2 text-grey-5 q-mt-xs q-mb-none">
          Raise, track, and manage asset maintenance requests and repair cycles.
        </p>
      </div>
      <q-btn
        color="primary"
        no-caps
        class="bg-gradient-primary btn-shadow font-semibold"
        @click="openRaiseModal"
      >
        <lucide-icon name="plus" :size="16" class="q-mr-sm" />
        Raise Repair Request
      </q-btn>
    </div>

    <!-- Filters Panel -->
    <q-card class="q-card--glass q-mb-lg q-pa-md">
      <div class="row q-col-gutter-md items-center">
        <!-- Asset Filter -->
        <div class="col-12 col-md-4">
          <q-select
            v-model="filters.asset_id"
            :options="assetOptions"
            label="Filter by Asset"
            filled
            dark
            dense
            clearable
            option-value="id"
            option-label="name"
            emit-value
            map-options
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.name }}</q-item-label>
                  <q-item-label caption class="text-grey-5">{{ scope.opt.asset_tag }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>

        <!-- Status Filter -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-select
            v-model="filters.status"
            :options="statusOptions"
            label="Status"
            filled
            dark
            dense
            clearable
            emit-value
            map-options
          />
        </div>

        <!-- Priority Filter -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-select
            v-model="filters.priority"
            :options="priorityOptions"
            label="Priority"
            filled
            dark
            dense
            clearable
            emit-value
            map-options
          />
        </div>

        <div class="col-12 col-md-2 flex justify-end">
          <q-btn flat dense color="grey-4" label="Clear Filters" no-caps @click="clearFilters" />
        </div>
      </div>
    </q-card>

    <!-- Maintenance List Table -->
    <q-card class="q-card--glass">
      <q-table
        :rows="requests"
        :columns="columns"
        row-key="id"
        class="q-table--glass text-white"
        dark
        flat
        dense
        :loading="loading"
        :pagination="pagination"
        no-data-label="No maintenance requests registered yet"
      >
        <template v-slot:body-cell-asset_tag="props">
          <q-td :props="props" class="font-mono text-primary font-semibold">
            {{ props.row.asset?.asset_tag ?? 'N/A' }}
          </q-td>
        </template>

        <template v-slot:body-cell-asset_name="props">
          <q-td :props="props" class="font-semibold">
            {{ props.row.asset?.name ?? 'Deleted Asset' }}
          </q-td>
        </template>

        <template v-slot:body-cell-raised_by="props">
          <q-td :props="props">
            {{ props.row.raised_by_user?.name ?? 'System' }}
          </q-td>
        </template>

        <template v-slot:body-cell-priority="props">
          <q-td :props="props">
            <maintenance-priority-badge :priority="props.row.priority" />
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <maintenance-status-badge :status="props.row.status" />
          </q-td>
        </template>

        <template v-slot:body-cell-technician_name="props">
          <q-td :props="props" class="text-grey-4">
            {{ props.row.technician_name || 'Unassigned' }}
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm text-right">
            <!-- Details Dialog Trigger -->
            <q-btn flat round dense color="primary" @click="viewDetails(props.row)">
              <lucide-icon name="eye" :size="16" />
              <q-tooltip>View Details</q-tooltip>
            </q-btn>

            <!-- Actions restricted to managers/admins -->
            <template v-if="isManager">
              <!-- Approve (only for PENDING) -->
              <q-btn
                v-if="props.row.status === 'PENDING'"
                flat
                round
                dense
                color="positive"
                @click="onApprove(props.row.id)"
              >
                <lucide-icon name="check" :size="16" />
                <q-tooltip>Approve Request</q-tooltip>
              </q-btn>

              <!-- Reject (only for PENDING) -->
              <q-btn
                v-if="props.row.status === 'PENDING'"
                flat
                round
                dense
                color="negative"
                @click="onReject(props.row.id)"
              >
                <lucide-icon name="x" :size="16" />
                <q-tooltip>Reject Request</q-tooltip>
              </q-btn>

              <!-- Assign Technician (only for APPROVED or IN_PROGRESS) -->
              <q-btn
                v-if="props.row.status === 'APPROVED' || props.row.status === 'IN_PROGRESS'"
                flat
                round
                dense
                color="accent"
                @click="openAssignDialog(props.row.id, props.row.technician_name)"
              >
                <lucide-icon name="user" :size="16" />
                <q-tooltip>Assign Technician</q-tooltip>
              </q-btn>

              <!-- Mark Resolved (only for IN_PROGRESS or APPROVED) -->
              <q-btn
                v-if="props.row.status === 'APPROVED' || props.row.status === 'IN_PROGRESS'"
                flat
                round
                dense
                color="positive"
                @click="onResolve(props.row.id)"
              >
                <lucide-icon name="check-circle" :size="16" />
                <q-tooltip>Mark Resolved</q-tooltip>
              </q-btn>
            </template>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Side Detail Drawer -->
    <q-dialog v-model="detailsOpen" position="right" full-height>
      <q-card class="details-drawer text-white" style="width: 480px; max-width: 90vw">
        <q-card-section class="row items-center q-pb-md border-bottom-glass">
          <div class="text-h6 font-semibold">Request Specifications</div>
          <q-space />
          <q-btn flat round dense icon="close" color="grey-5" @click="detailsOpen = false" />
        </q-card-section>

        <q-card-section
          v-if="selectedRequest"
          class="scroll q-pa-md"
          style="height: calc(100% - 70px)"
        >
          <div class="text-center q-mb-lg">
            <q-avatar size="80px" color="rgba(255,255,255,0.05)" class="q-mb-sm border-glass">
              <img
                v-if="selectedRequest.photo_url"
                :src="selectedRequest.photo_url"
                alt="Ticket Photo"
                style="object-fit: cover"
              />
              <q-icon v-else name="construction" size="40px" color="primary" />
            </q-avatar>
            <div class="text-h6 font-bold">{{ selectedRequest.asset?.name }}</div>
            <div class="text-subtitle2 text-primary font-mono">
              {{ selectedRequest.asset?.asset_tag }}
            </div>
            <div class="q-mt-sm row justify-center q-gutter-x-sm">
              <maintenance-status-badge :status="selectedRequest.status" />
              <maintenance-priority-badge :priority="selectedRequest.priority" />
            </div>
          </div>

          <!-- Specifications List -->
          <div class="q-gutter-y-sm q-mb-lg">
            <div class="spec-row">
              <span class="spec-label">Raised By</span>
              <span class="spec-value">{{ selectedRequest.raised_by_user?.name }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-label">Contact Email</span>
              <span class="spec-value">{{ selectedRequest.raised_by_user?.email }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-label">Technician Assigned</span>
              <span class="spec-value">{{ selectedRequest.technician_name || 'Unassigned' }}</span>
            </div>
            <div class="spec-row flex-column items-start q-pa-md">
              <span class="spec-label q-mb-xs">Issue Description</span>
              <p
                class="text-grey-2 q-my-none text-weight-regular"
                style="font-size: 13px; line-height: 1.4"
              >
                {{ selectedRequest.description }}
              </p>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Raise Request Dialog Modal -->
    <q-dialog v-model="raiseOpen">
      <q-card class="q-card--glass text-white" style="width: 500px; max-width: 90vw">
        <q-card-section class="row items-center border-bottom-glass">
          <div class="text-h6 font-semibold">Raise Repair Request</div>
          <q-space />
          <q-btn flat round dense icon="close" color="grey-5" @click="raiseOpen = false" />
        </q-card-section>

        <q-form @submit.prevent="onRaiseSubmit">
          <q-card-section class="q-gutter-y-md q-pt-md">
            <!-- Asset Selection -->
            <q-select
              v-model="newRequest.asset_id"
              :options="allAssets"
              label="Select Asset"
              filled
              dark
              dense
              option-value="id"
              option-label="name"
              emit-value
              map-options
              :rules="[(val) => !!val || 'Asset is required']"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.name }}</q-item-label>
                    <q-item-label caption class="text-grey-5">{{
                      scope.opt.asset_tag
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <!-- Priority -->
            <q-select
              v-model="newRequest.priority"
              :options="priorityOptions"
              label="Priority Level"
              filled
              dark
              dense
              emit-value
              map-options
              :rules="[(val) => !!val || 'Priority is required']"
            />

            <!-- Photo URL -->
            <q-input
              v-model="newRequest.photo_url"
              label="Attachment Photo URL (Optional)"
              filled
              dark
              dense
            />

            <!-- Issue Description -->
            <q-input
              v-model="newRequest.description"
              type="textarea"
              label="Describe the issue"
              filled
              dark
              dense
              rows="4"
              :rules="[(val) => !!val || 'Description is required']"
            />
          </q-card-section>

          <q-card-actions align="right" class="q-pa-md border-top-glass">
            <q-btn flat label="Cancel" color="grey-5" @click="raiseOpen = false" />
            <q-btn
              type="submit"
              label="Submit Request"
              color="primary"
              class="bg-gradient-primary btn-shadow"
              :loading="raising"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth.store';
import { UserRole } from 'src/config/permissions';
import { useAssets } from 'src/features/assets/api/useAssets';
import {
  useMaintenance,
  useCreateMaintenanceRequest,
  useApproveMaintenanceRequest,
  useRejectMaintenanceRequest,
  useAssignTechnician,
  useResolveMaintenanceRequest,
} from '../api/useMaintenance';
import MaintenanceStatusBadge from './MaintenanceStatusBadge.vue';
import MaintenancePriorityBadge from './MaintenancePriorityBadge.vue';
import {
  type GetMaintenanceRequestsQuery,
  type MaintenanceFilterInput,
  type MaintenanceStatus,
  type MaintenancePriority,
} from 'src/graphql/generated/graphql';

type RequestType = GetMaintenanceRequestsQuery['maintenanceRequests'][number];

const $q = useQuasar();
const authStore = useAuthStore();

const isManager = computed(() => {
  const role = authStore.currentUser?.role;
  return role === UserRole.ADMIN || role === UserRole.ASSET_MANAGER;
});

// Filters State
const filters = ref<MaintenanceFilterInput>({
  asset_id: null,
  status: null,
  priority: null,
});

// Composable calls
const { requests, loading, refetch } = useMaintenance(filters);
const { assets } = useAssets(); // For raising requests and matching assets filter

const { createRequest } = useCreateMaintenanceRequest();
const { approveRequest } = useApproveMaintenanceRequest();
const { rejectRequest } = useRejectMaintenanceRequest();
const { assign } = useAssignTechnician();
const { resolveRequest } = useResolveMaintenanceRequest();

const raising = ref(false);

const assetOptions = computed(() => assets.value);
const allAssets = computed(() =>
  assets.value.filter(
    (a) => a.status !== 'UNDER_MAINTENANCE' && a.status !== 'RETIRED' && a.status !== 'DISPOSED',
  ),
);

const statusOptions = [
  { label: 'Pending', value: 'PENDING' as MaintenanceStatus },
  { label: 'Approved', value: 'APPROVED' as MaintenanceStatus },
  { label: 'Rejected', value: 'REJECTED' as MaintenanceStatus },
  { label: 'In Progress', value: 'IN_PROGRESS' as MaintenanceStatus },
  { label: 'Resolved', value: 'RESOLVED' as MaintenanceStatus },
];

const priorityOptions = [
  { label: 'Low', value: 'LOW' as MaintenancePriority },
  { label: 'Medium', value: 'MEDIUM' as MaintenancePriority },
  { label: 'High', value: 'HIGH' as MaintenancePriority },
  { label: 'Critical', value: 'CRITICAL' as MaintenancePriority },
];

const pagination = ref({
  page: 1,
  rowsPerPage: 15,
});

const columns = [
  { name: 'asset_tag', label: 'Asset Tag', field: 'asset_tag', align: 'left' as const },
  { name: 'asset_name', label: 'Asset Name', field: 'asset_name', align: 'left' as const },
  { name: 'raised_by', label: 'Raised By', field: 'raised_by', align: 'left' as const },
  { name: 'priority', label: 'Priority', field: 'priority', align: 'left' as const },
  { name: 'status', label: 'Status', field: 'status', align: 'left' as const },
  {
    name: 'technician_name',
    label: 'Technician',
    field: 'technician_name',
    align: 'left' as const,
  },
  { name: 'actions', label: '', field: '', align: 'right' as const },
];

// Detail modal/drawer state
const detailsOpen = ref(false);
const selectedRequest = ref<RequestType | null>(null);

function viewDetails(request: RequestType) {
  selectedRequest.value = request;
  detailsOpen.value = true;
}

// Raise request modal state
const raiseOpen = ref(false);
const newRequest = ref({
  asset_id: '',
  priority: '' as MaintenancePriority,
  description: '',
  photo_url: '',
});

function openRaiseModal() {
  newRequest.value = {
    asset_id: '',
    priority: 'MEDIUM' as MaintenancePriority,
    description: '',
    photo_url: '',
  };
  raiseOpen.value = true;
}

async function onRaiseSubmit() {
  try {
    raising.value = true;
    await createRequest({
      asset_id: newRequest.value.asset_id,
      priority: newRequest.value.priority,
      description: newRequest.value.description,
      photo_url: newRequest.value.photo_url || undefined,
    });
    $q.notify({
      type: 'positive',
      message: 'Repair request successfully submitted',
    });
    raiseOpen.value = false;
    void refetch();
  } catch (err: unknown) {
    const error = err as Error;
    $q.notify({
      type: 'negative',
      message: error.message || 'Failed to submit repair request',
    });
  } finally {
    raising.value = false;
  }
}

// Action Handlers
async function onApprove(id: string) {
  try {
    await approveRequest(id);
    $q.notify({
      type: 'positive',
      message: 'Request approved and asset marked as Under Maintenance',
    });
    void refetch();
  } catch (err: unknown) {
    const error = err as Error;
    $q.notify({
      type: 'negative',
      message: error.message || 'Failed to approve request',
    });
  }
}

async function onReject(id: string) {
  try {
    await rejectRequest(id);
    $q.notify({ type: 'positive', message: 'Request rejected successfully' });
    void refetch();
  } catch (err: unknown) {
    const error = err as Error;
    $q.notify({ type: 'negative', message: error.message || 'Failed to reject request' });
  }
}

function openAssignDialog(id: string, currentTechnician?: string | null) {
  $q.dialog({
    title: 'Assign Technician',
    message: 'Enter the name of the technician performing the repair:',
    prompt: {
      model: currentTechnician || '',
      type: 'text',
      isValid: (val) => val.trim().length > 0,
    },
    dark: true,
    cancel: true,
    persistent: true,
  }).onOk((name: string) => {
    void (async () => {
      try {
        await assign(id, name);
        $q.notify({
          type: 'positive',
          message: `Technician assigned and repair status set to In Progress`,
        });
        void refetch();
      } catch (err: unknown) {
        const error = err as Error;
        $q.notify({ type: 'negative', message: error.message || 'Failed to assign technician' });
      }
    })();
  });
}

async function onResolve(id: string) {
  try {
    await resolveRequest(id);
    $q.notify({ type: 'positive', message: 'Request resolved and asset marked as Available' });
    void refetch();
  } catch (err: unknown) {
    const error = err as Error;
    $q.notify({ type: 'negative', message: error.message || 'Failed to resolve request' });
  }
}

function clearFilters() {
  filters.value = {
    asset_id: null,
    status: null,
    priority: null,
  };
}
</script>

<style lang="scss" scoped>
.q-card--glass {
  background: rgba(19, 27, 46, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
}

.details-drawer {
  background: rgba(11, 19, 38, 0.95);
  backdrop-filter: blur(20px);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  height: 100%;
}

.border-bottom-glass {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.border-top-glass {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.border-glass {
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.spec-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 6px;
  font-size: 13px;

  &.flex-column {
    flex-direction: column;
  }

  .spec-label {
    color: #64748b;
    font-weight: 500;
  }
  .spec-value {
    color: #f1f5f9;
    font-weight: 600;
  }
}

.bg-gradient-primary {
  background: linear-gradient(135deg, $primary 0%, $accent 100%);
}

.btn-shadow {
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
}
</style>
