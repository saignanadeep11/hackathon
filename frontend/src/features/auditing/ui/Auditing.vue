<template>
  <q-page class="q-pa-lg text-white">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h4 font-bold q-my-none text-white">Asset Audits</h1>
        <p class="text-subtitle2 text-grey-5 q-mt-xs q-mb-none">Create verification cycles, assign auditors, and resolve asset discrepancies.</p>
      </div>
      <q-btn
        v-if="isAdminOrManager && currentTab === 'cycles'"
        color="primary"
        no-caps
        class="bg-gradient-primary btn-shadow font-semibold"
        @click="openCreateModal"
      >
        <lucide-icon name="plus" :size="16" class="q-mr-sm" />
        New Audit Cycle
      </q-btn>
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
      <q-tab name="cycles" label="Audit Cycles" v-if="isAdminOrManager" />
      <q-tab name="checklist" label="My Auditor Checklist" />
    </q-tabs>

    <q-tab-panels v-model="currentTab" animated class="bg-transparent q-pa-none">
      <!-- Audit Cycles Panel -->
      <q-tab-panel name="cycles" class="q-pa-none" v-if="isAdminOrManager">
        <q-card class="q-card--glass q-mb-lg">
          <q-table
            :rows="auditCycles"
            :columns="cycleColumns"
            row-key="id"
            class="q-table--glass text-white"
            dark
            flat
            dense
            :loading="loadingCycles"
            no-data-label="No audit cycles created yet"
          >
            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-chip
                  :color="props.row.status === 'OPEN' ? 'positive' : 'grey-7'"
                  text-color="white"
                  dense
                  square
                  class="text-weight-bold"
                >
                  {{ props.row.status }}
                </q-chip>
              </q-td>
            </template>

            <template v-slot:body-cell-target_department="props">
              <q-td :props="props">
                {{ props.row.target_department?.name || 'All Departments' }}
              </q-td>
            </template>

            <template v-slot:body-cell-start_date="props">
              <q-td :props="props">
                {{ formatDate(props.row.start_date) }}
              </q-td>
            </template>

            <template v-slot:body-cell-end_date="props">
              <q-td :props="props">
                {{ formatDate(props.row.end_date) }}
              </q-td>
            </template>

            <template v-slot:body-cell-progress="props">
              <q-td :props="props">
                <div class="row items-center q-gutter-x-sm" style="min-width: 150px">
                  <q-linear-progress
                    :value="getCycleProgress(props.row)"
                    color="primary"
                    track-color="grey-8"
                    class="col"
                  />
                  <span class="text-caption text-grey-4">
                    {{ getVerifiedCount(props.row) }}/{{ props.row.items?.length || 0 }}
                  </span>
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="q-gutter-x-sm text-right">
                <q-btn
                  flat
                  round
                  dense
                  color="primary"
                  @click="viewCycleDetails(props.row)"
                >
                  <lucide-icon name="eye" :size="16" />
                  <q-tooltip>View Details & Discrepancies</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="props.row.status === 'OPEN'"
                  flat
                  round
                  dense
                  color="negative"
                  @click="confirmCloseCycle(props.row)"
                >
                  <lucide-icon name="check-square" :size="16" />
                  <q-tooltip>Close Audit Cycle</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card>
      </q-tab-panel>

      <!-- Auditor Checklist Panel -->
      <q-tab-panel name="checklist" class="q-pa-none">
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-4">
            <q-input
              v-model="checklistSearch"
              placeholder="Search assigned assets..."
              filled
              dark
              dense
              clearable
            >
              <template v-slot:prepend>
                <lucide-icon name="search" :size="18" class="text-grey-5" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-3">
            <q-select
              v-model="checklistStatusFilter"
              :options="itemStatusOptions"
              label="Verification Status"
              filled
              dark
              dense
              clearable
              emit-value
              map-options
            />
          </div>
        </div>

        <q-card class="q-card--glass">
          <q-table
            :rows="filteredChecklist"
            :columns="checklistColumns"
            row-key="id"
            class="q-table--glass text-white"
            dark
            flat
            dense
            :loading="loadingItems"
            no-data-label="No assets assigned to you for auditing"
          >
            <template v-slot:body-cell-asset_tag="props">
              <q-td :props="props" class="font-mono text-primary text-weight-bold">
                {{ props.row.asset.asset_tag }}
              </q-td>
            </template>

            <template v-slot:body-cell-name="props">
              <q-td :props="props">
                <div class="text-weight-medium text-white">{{ props.row.asset.name }}</div>
                <div class="text-caption text-grey-5">Category: {{ props.row.asset.category?.name || 'N/A' }}</div>
              </q-td>
            </template>

            <template v-slot:body-cell-location="props">
              <q-td :props="props">
                {{ props.row.asset.location }}
              </q-td>
            </template>

            <template v-slot:body-cell-verification_status="props">
              <q-td :props="props">
                <q-chip
                  :color="getItemStatusColor(props.row.verification_status)"
                  text-color="white"
                  dense
                  square
                  class="text-weight-bold"
                >
                  {{ props.row.verification_status }}
                </q-chip>
              </q-td>
            </template>

            <template v-slot:body-cell-notes="props">
              <q-td :props="props" style="max-width: 200px; overflow: hidden; text-overflow: ellipsis">
                {{ props.row.notes || '-' }}
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="q-gutter-x-sm text-right">
                <q-btn
                  v-if="props.row.audit_cycle.status === 'OPEN'"
                  flat
                  round
                  dense
                  color="positive"
                  @click="openVerifyModal(props.row)"
                >
                  <lucide-icon name="check-circle" :size="16" />
                  <q-tooltip>Update Status</q-tooltip>
                </q-btn>
                <span v-else class="text-caption text-grey-6">Cycle Closed</span>
              </q-td>
            </template>
          </q-table>
        </q-card>
      </q-tab-panel>
    </q-tab-panels>

    <!-- Create Cycle Dialog -->
    <q-dialog v-model="createModalOpen" persistent>
      <q-card class="q-card--glass text-white" style="min-width: 450px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 font-bold">Start New Audit Cycle</div>
          <q-space />
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit="handleCreateCycle" class="q-gutter-y-md">
            <q-input
              v-model="newCycle.name"
              label="Cycle Name *"
              filled
              dark
              :rules="[val => !!val || 'Name is required']"
            />

            <q-select
              v-model="newCycle.target_department_id"
              :options="departmentOptions"
              label="Target Department (Optional)"
              filled
              dark
              clearable
              option-value="id"
              option-label="name"
              emit-value
              map-options
              hint="Leave blank to audit all active assets"
            />

            <div class="row q-col-gutter-sm">
              <div class="col">
                <q-input
                  v-model="newCycle.start_date"
                  label="Start Date *"
                  filled
                  dark
                  type="date"
                  stack-label
                  :rules="[val => !!val || 'Required']"
                />
              </div>
              <div class="col">
                <q-input
                  v-model="newCycle.end_date"
                  label="End Date *"
                  filled
                  dark
                  type="date"
                  stack-label
                  :rules="[val => !!val || 'Required']"
                />
              </div>
            </div>

            <q-select
              v-model="newCycle.auditor_ids"
              :options="userOptions"
              label="Assign Auditors *"
              filled
              dark
              multiple
              use-chips
              option-value="id"
              option-label="name"
              emit-value
              map-options
              :rules="[val => val && val.length > 0 || 'Select at least one auditor']"
            />

            <div class="row justify-end q-mt-md">
              <q-btn label="Cancel" flat v-close-popup class="q-mr-sm" />
              <q-btn
                type="submit"
                label="Create Cycle"
                color="primary"
                class="bg-gradient-primary btn-shadow font-semibold"
                :loading="creatingCycle"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Update Item Verification Status Dialog -->
    <q-dialog v-model="verifyModalOpen" persistent>
      <q-card class="q-card--glass text-white" style="min-width: 400px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 font-bold">Update Verification Status</div>
          <q-space />
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-sm">
          <div class="text-subtitle1 text-weight-medium q-mb-md">
            {{ selectedChecklistItem?.asset.name }} ({{ selectedChecklistItem?.asset.asset_tag }})
          </div>

          <q-form @submit="handleUpdateItemStatus" class="q-gutter-y-md">
            <q-select
              v-model="itemUpdate.status"
              :options="verificationStatusOptions"
              label="Status *"
              filled
              dark
              emit-value
              map-options
              :rules="[val => !!val || 'Required']"
            />

            <q-input
              v-model="itemUpdate.notes"
              label="Audit Notes"
              filled
              dark
              type="textarea"
              rows="3"
              hint="Specify damage notes or missing details if applicable"
            />

            <div class="row justify-end q-mt-md">
              <q-btn label="Cancel" flat v-close-popup class="q-mr-sm" />
              <q-btn
                type="submit"
                label="Save Updates"
                color="primary"
                class="bg-gradient-primary btn-shadow font-semibold"
                :loading="updatingStatus"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Cycle Details & Discrepancies Dialog -->
    <q-dialog v-model="detailsModalOpen" max-width="800px">
      <q-card class="q-card--glass text-white" style="width: 700px; max-width: 90vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 font-bold">Cycle Details: {{ selectedCycle?.name }}</div>
          <q-space />
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>

        <q-card-section class="q-py-md">
          <div class="row q-col-gutter-sm q-mb-md text-grey-4">
            <div class="col-6 col-sm-3">
              <div class="text-caption text-grey-5">Status</div>
              <div class="text-body2 font-semibold text-white">{{ selectedCycle?.status }}</div>
            </div>
            <div class="col-6 col-sm-3">
              <div class="text-caption text-grey-5">Department</div>
              <div class="text-body2 font-semibold text-white">
                {{ selectedCycle?.target_department?.name || 'All Departments' }}
              </div>
            </div>
            <div class="col-6 col-sm-3">
              <div class="text-caption text-grey-5">Start Date</div>
              <div class="text-body2 font-semibold text-white">{{ formatDate(selectedCycle?.start_date) }}</div>
            </div>
            <div class="col-6 col-sm-3">
              <div class="text-caption text-grey-5">End Date</div>
              <div class="text-body2 font-semibold text-white">{{ formatDate(selectedCycle?.end_date) }}</div>
            </div>
          </div>

          <div class="text-subtitle2 font-bold text-primary q-mb-sm">Discrepancy & Audit Items Checklist</div>
          <q-list bordered separator class="rounded-borders overflow-hidden bg-black-2">
            <q-item v-for="item in selectedCycle?.items" :key="item.id" class="q-py-sm">
              <q-item-section avatar>
                <q-chip
                  :color="getItemStatusColor(item.verification_status)"
                  text-color="white"
                  dense
                  square
                  class="text-weight-bold"
                >
                  {{ item.verification_status }}
                </q-chip>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-medium text-white">{{ item.asset.name }}</q-item-label>
                <q-item-label caption class="text-grey-5">Tag: {{ item.asset.asset_tag }} | Auditor: {{ item.auditor.name }}</q-item-label>
              </q-item-section>
              <q-item-section side v-if="item.notes">
                <q-item-label caption class="text-grey-4 text-italic" style="max-width: 250px">
                  "{{ item.notes }}"
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from 'src/stores/auth.store';
import { useQuasar } from 'quasar';
import {
  useAuditCycles,
  useMyAuditItems,
  useCreateAuditCycle,
  useUpdateAuditItemStatus,
  useCloseAuditCycle,
  useDepartmentsForAudit,
  useUsersForAudit,
} from '../api/useAudits';
import type { AuditItemStatus } from 'src/graphql/generated/graphql';

// Required for vue/multi-word-component-names rule
defineOptions({ name: 'AuditingPage' });

// Typed shapes for audit items and cycles returned from GraphQL
interface AuditItemAsset {
  id: string;
  asset_tag: string;
  name: string;
  condition: string;
  location: string;
  status: string;
  category: { id: string; name: string };
}

interface AuditItemRecord {
  id: string;
  verification_status: AuditItemStatus;
  notes: string | null;
  audit_cycle: { id: string; name: string; status: string };
  asset: AuditItemAsset;
}

interface AuditCycleRecord {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: string;
  target_department: { id: string; name: string } | null;
  items: Array<{
    id: string;
    verification_status: AuditItemStatus;
    notes: string | null;
    asset: { id: string; asset_tag: string; name: string; status: string };
    auditor: { id: string; name: string };
  }> | null;
}

const $q = useQuasar();
const authStore = useAuthStore();

// Check role
const isAdminOrManager = computed(() => {
  const role = authStore.currentRole;
  return role === 'ADMIN' || role === 'ASSET_MANAGER';
});

const currentTab = ref(isAdminOrManager.value ? 'cycles' : 'checklist');

// Queries
const { auditCycles, loading: loadingCycles, refetch: refetchCycles } = useAuditCycles();
const { myAuditItems, loading: loadingItems, refetch: refetchItems } = useMyAuditItems();
const { departments } = useDepartmentsForAudit();
const { users } = useUsersForAudit();

// Mutations
const { createAuditCycle } = useCreateAuditCycle();
const { updateAuditItemStatus } = useUpdateAuditItemStatus();
const { closeAuditCycle } = useCloseAuditCycle();

// Search & Filter
const checklistSearch = ref('');
const checklistStatusFilter = ref<AuditItemStatus | null>(null);

// Create Modal state
const createModalOpen = ref(false);
const creatingCycle = ref(false);
const newCycle = ref({
  name: '',
  target_department_id: null as string | null,
  start_date: '',
  end_date: '',
  auditor_ids: [] as string[],
});

// Update Verification Modal state
const verifyModalOpen = ref(false);
const updatingStatus = ref(false);
const selectedChecklistItem = ref<AuditItemRecord | null>(null);
const itemUpdate = ref({
  status: '' as AuditItemStatus,
  notes: '',
});

// Cycle Details Modal state
const detailsModalOpen = ref(false);
const selectedCycle = ref<AuditCycleRecord | null>(null);

// Options lists
const departmentOptions = computed(() => departments.value.filter(d => d.status === 'ACTIVE'));
const userOptions = computed(() => users.value);

const itemStatusOptions = [
  { label: 'Verified', value: 'VERIFIED' as AuditItemStatus },
  { label: 'Missing', value: 'MISSING' as AuditItemStatus },
  { label: 'Damaged', value: 'DAMAGED' as AuditItemStatus },
];

const verificationStatusOptions = [
  { label: 'Verified', value: 'VERIFIED' as AuditItemStatus },
  { label: 'Missing (Flag Discrepancy)', value: 'MISSING' as AuditItemStatus },
  { label: 'Damaged (Flag Discrepancy)', value: 'DAMAGED' as AuditItemStatus },
];

// Table Configurations
const cycleColumns = [
  { name: 'name', label: 'Name', align: 'left' as const, field: 'name', sortable: true },
  { name: 'target_department', label: 'Department Target', align: 'left' as const, field: 'target_department', sortable: true },
  { name: 'start_date', label: 'Start Date', align: 'left' as const, field: 'start_date' },
  { name: 'end_date', label: 'End Date', align: 'left' as const, field: 'end_date' },
  { name: 'status', label: 'Status', align: 'center' as const, field: 'status' },
  { name: 'progress', label: 'Audit Progress', align: 'left' as const, field: 'progress' },
  { name: 'actions', label: 'Actions', align: 'right' as const, field: 'actions' },
];

const checklistColumns = [
  { name: 'asset_tag', label: 'Asset Tag', align: 'left' as const, field: (row: AuditItemRecord) => row.asset.asset_tag, sortable: true },
  { name: 'name', label: 'Asset Name', align: 'left' as const, field: (row: AuditItemRecord) => row.asset.name, sortable: true },
  { name: 'location', label: 'Expected Location', align: 'left' as const, field: (row: AuditItemRecord) => row.asset.location, sortable: true },
  { name: 'verification_status', label: 'Status', align: 'center' as const, field: 'verification_status', sortable: true },
  { name: 'notes', label: 'Auditor Notes', align: 'left' as const, field: 'notes' },
  { name: 'actions', label: 'Actions', align: 'right' as const, field: 'actions' },
];

// Helpers
function formatDate(dateStr: string | undefined) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function getCycleProgress(cycle: AuditCycleRecord) {
  if (!cycle.items || cycle.items.length === 0) return 0;
  return getVerifiedCount(cycle) / cycle.items.length;
}

function getVerifiedCount(cycle: AuditCycleRecord) {
  if (!cycle.items) return 0;
  return cycle.items.filter(item => item.verification_status === 'VERIFIED').length;
}

function getItemStatusColor(status: AuditItemStatus) {
  switch (status) {
    case 'VERIFIED':
      return 'positive';
    case 'MISSING':
      return 'negative';
    case 'DAMAGED':
      return 'warning';
    default:
      return 'grey';
  }
}

// Filtered checklist computed
const filteredChecklist = computed(() => {
  return myAuditItems.value.filter(item => {
    // Search filter
    const matchesSearch = !checklistSearch.value ||
      item.asset.name.toLowerCase().includes(checklistSearch.value.toLowerCase()) ||
      item.asset.asset_tag.toLowerCase().includes(checklistSearch.value.toLowerCase()) ||
      item.asset.location.toLowerCase().includes(checklistSearch.value.toLowerCase());

    // Status filter
    const matchesStatus = !checklistStatusFilter.value || item.verification_status === checklistStatusFilter.value;

    return matchesSearch && matchesStatus;
  });
});

// Modal actions
function openCreateModal() {
  newCycle.value = {
    name: '',
    target_department_id: null,
    start_date: (new Date().toISOString().split('T')[0] as string) || '',
    end_date: (new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] as string) || '',
    auditor_ids: [],
  };
  createModalOpen.value = true;
}

async function handleCreateCycle() {
  creatingCycle.value = true;
  try {
    await createAuditCycle({
      name: newCycle.value.name,
      target_department_id: newCycle.value.target_department_id || undefined,
      start_date: new Date(newCycle.value.start_date),
      end_date: new Date(newCycle.value.end_date),
      auditor_ids: newCycle.value.auditor_ids,
    });
    createModalOpen.value = false;
    await refetchCycles();
    $q.notify({
      type: 'positive',
      message: 'Audit Cycle created successfully and assets assigned.',
    });
  } catch (err: unknown) {
    $q.notify({
      type: 'negative',
      message: (err instanceof Error ? err.message : null) || 'Failed to create audit cycle.',
    });
  } finally {
    creatingCycle.value = false;
  }
}

function openVerifyModal(item: AuditItemRecord) {
  selectedChecklistItem.value = item;
  itemUpdate.value = {
    status: item.verification_status,
    notes: item.notes || '',
  };
  verifyModalOpen.value = true;
}

async function handleUpdateItemStatus() {
  updatingStatus.value = true;
  if (!selectedChecklistItem.value) return;
  try {
    await updateAuditItemStatus(
      selectedChecklistItem.value.id,
      itemUpdate.value.status,
      itemUpdate.value.notes
    );
    verifyModalOpen.value = false;
    await refetchItems();
    await refetchCycles();
    $q.notify({
      type: 'positive',
      message: 'Asset verification status updated.',
    });
  } catch (err: unknown) {
    $q.notify({
      type: 'negative',
      message: (err instanceof Error ? err.message : null) || 'Failed to update item status.',
    });
  } finally {
    updatingStatus.value = false;
  }
}

function viewCycleDetails(cycle: AuditCycleRecord) {
  selectedCycle.value = cycle;
  detailsModalOpen.value = true;
}

async function handleCloseCycle(cycleId: string) {
  try {
    await closeAuditCycle(cycleId);
    await refetchCycles();
    $q.notify({
      type: 'positive',
      message: 'Audit Cycle closed successfully.',
    });
  } catch (err: unknown) {
    $q.notify({
      type: 'negative',
      message: (err instanceof Error ? err.message : null) || 'Failed to close audit cycle.',
    });
  }
}

function confirmCloseCycle(cycle: AuditCycleRecord) {
  $q.dialog({
    title: 'Close Audit Cycle',
    message: `Are you sure you want to close the "${cycle.name}" audit cycle? No further updates can be made to its items.`,
    cancel: true,
    persistent: true,
    dark: true,
  }).onOk(() => {
    void handleCloseCycle(cycle.id);
  });
}
</script>

<style scoped lang="scss">
.bg-black-2 {
  background: rgba(0, 0, 0, 0.2);
}
</style>
