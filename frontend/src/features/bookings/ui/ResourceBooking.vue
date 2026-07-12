<template>
  <q-page class="q-pa-lg text-white">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h4 font-bold q-my-none text-white">Resource Booking</h1>
        <p class="text-subtitle2 text-grey-5 q-mt-xs q-mb-none">Book shared company resources (rooms, vehicles, projectors) and avoid schedule overlaps.</p>
      </div>
      <div class="row items-center q-gutter-x-md">
        <!-- View Toggle -->
        <q-btn-toggle
          v-model="viewMode"
          toggle-color="primary"
          flat
          dark
          dense
          :options="[
            { label: 'Calendar', value: 'calendar' },
            { label: 'List View', value: 'list' }
          ]"
        />
        <q-btn
          color="primary"
          no-caps
          class="bg-gradient-primary btn-shadow font-semibold"
          @click="openNewBookingDialog(null)"
        >
          <lucide-icon name="calendar-plus" :size="16" class="q-mr-sm" />
          New Booking
        </q-btn>
      </div>
    </div>

    <!-- MAIN VIEW -->
    <div class="row q-col-gutter-lg">
      <!-- Left sidebar: Datepicker (only in Calendar Mode) -->
      <div v-if="viewMode === 'calendar'" class="col-12 col-md-4">
        <q-card class="q-card--glass q-pa-md text-white">
          <div class="text-subtitle1 font-bold q-mb-sm text-primary">Select Schedule Date</div>
          <q-date
            v-model="selectedDate"
            minimal
            dark
            flat
            bordered
            class="bg-transparent text-white full-width"
            mask="YYYY-MM-DD"
            @update:model-value="refetch"
          />
          <div class="q-mt-md text-caption text-grey-4">
            <div class="row items-center q-mb-xs">
              <span class="bullet bg-positive q-mr-xs"></span> CONFIRMED/UPCOMING
            </div>
            <div class="row items-center">
              <span class="bullet bg-grey-7 q-mr-xs"></span> CANCELLED
            </div>
          </div>
        </q-card>
      </div>

      <!-- Right content area -->
      <div :class="viewMode === 'calendar' ? 'col-12 col-md-8' : 'col-12'">
        <!-- 1. Calendar / Timeline View -->
        <div v-if="viewMode === 'calendar'" class="q-gutter-y-md">
          <q-card
            v-for="asset in bookableAssets"
            :key="asset.id"
            class="q-card--glass q-pa-md"
          >
            <div class="row items-center justify-between q-mb-md">
              <div class="row items-center">
                <lucide-icon name="monitor" :size="20" class="text-primary q-mr-sm" />
                <div>
                  <div class="text-subtitle1 font-bold text-white">{{ asset.name }}</div>
                  <div class="text-caption text-grey-5">
                    Tag: {{ asset.asset_tag }} &bull; Location: {{ asset.location }}
                  </div>
                </div>
              </div>
              <q-btn
                outline
                color="primary"
                no-caps
                size="sm"
                @click="openNewBookingDialog(asset)"
              >
                Book This
              </q-btn>
            </div>

            <!-- Booking timeline block for selected date -->
            <div class="timeline-container bg-dark-page q-pa-sm rounded-borders">
              <div v-if="getBookingsForAssetAndDate(asset.id).length === 0" class="text-caption text-grey-6 text-center py-2">
                No bookings scheduled for today. Available all day.
              </div>
              <div v-else class="q-gutter-y-sm">
                <div
                  v-for="booking in getBookingsForAssetAndDate(asset.id)"
                  :key="booking.id"
                  class="booking-strip row items-center justify-between q-pa-sm rounded-borders"
                  :class="booking.status === 'CANCELLED' ? 'border-cancelled' : 'border-upcoming'"
                >
                  <div>
                    <span class="text-subtitle2 font-semibold text-white">
                      {{ formatTime(booking.start_time) }} - {{ formatTime(booking.end_time) }}
                    </span>
                    <span class="text-caption text-grey-5 q-ml-md">
                      Booked by: {{ booking.booked_by_user?.name || 'Unknown' }}
                    </span>
                  </div>
                  <div class="row items-center">
                    <q-chip
                      :color="booking.status === 'CANCELLED' ? 'grey-8' : 'primary'"
                      text-color="white"
                      dense
                      square
                      class="text-caption text-weight-bold"
                    >
                      {{ booking.status }}
                    </q-chip>
                    <q-btn
                      v-if="booking.status === 'UPCOMING' && (isManager || booking.booked_by_user?.id === currentUser?.id)"
                      flat
                      round
                      dense
                      color="negative"
                      icon="close"
                      size="sm"
                      class="q-ml-sm"
                      @click="handleCancelBooking(booking.id)"
                    >
                      <q-tooltip>Cancel Booking</q-tooltip>
                    </q-btn>
                  </div>
                </div>
              </div>
            </div>
          </q-card>
        </div>

        <!-- 2. List View -->
        <q-card v-else class="q-card--glass">
          <q-table
            :rows="bookings"
            :columns="columns"
            row-key="id"
            class="q-table--glass text-white"
            dark
            flat
            dense
            :loading="loading"
            no-data-label="No bookings requested yet"
          >
            <template v-slot:body-cell-asset="props">
              <q-td :props="props" class="font-semibold text-white">
                {{ props.row.asset?.name || 'N/A' }}
                <span class="text-caption text-grey-5 block">
                  Tag: {{ props.row.asset?.asset_tag }}
                </span>
              </q-td>
            </template>

            <template v-slot:body-cell-start_time="props">
              <q-td :props="props">
                {{ formatDateTime(props.row.start_time) }}
              </q-td>
            </template>

            <template v-slot:body-cell-end_time="props">
              <q-td :props="props">
                {{ formatDateTime(props.row.end_time) }}
              </q-td>
            </template>

            <template v-slot:body-cell-booked_by="props">
              <q-td :props="props">
                {{ props.row.booked_by_user?.name || 'N/A' }}
              </q-td>
            </template>

            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-chip
                  :color="getStatusColor(props.row.status)"
                  text-color="white"
                  dense
                  square
                  class="text-uppercase text-weight-bold"
                  style="font-size: 10px;"
                >
                  {{ props.row.status }}
                </q-chip>
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="text-right">
                <q-btn
                  v-if="props.row.status === 'UPCOMING' && (isManager || props.row.booked_by_user?.id === currentUser?.id)"
                  color="negative"
                  flat
                  no-caps
                  dense
                  size="sm"
                  class="px-2"
                  @click="handleCancelBooking(props.row.id)"
                >
                  <lucide-icon name="trash" :size="14" class="q-mr-xs" />
                  Cancel
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card>
      </div>
    </div>

    <!-- Booking Dialog -->
    <q-dialog v-model="bookingDialogValues.open" persistent>
      <q-card class="q-card--glass text-white q-pa-md" style="min-width: 400px; border: 1px solid rgba(255, 255, 255, 0.1);">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 font-bold">Request Time Slot Booking</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <!-- Error banner for overlap conflicts -->
          <div v-if="submitError" class="q-mb-md q-pa-sm bg-negative text-white rounded-borders row items-center">
            <lucide-icon name="alert-triangle" :size="18" class="q-mr-sm" />
            <div class="text-caption col">{{ submitError }}</div>
          </div>

          <q-form @submit="submitBooking" class="q-gutter-md">
            <!-- Resource selector -->
            <q-select
              v-model="bookingDialogValues.asset_id"
              :options="bookableAssetOptions"
              label="Select Resource"
              filled
              dark
              map-options
              emit-value
              required
              :rules="[v => !!v || 'Resource selection is required']"
            />

            <!-- Booking Date -->
            <q-input
              v-model="bookingDialogValues.date"
              filled
              dark
              label="Booking Date"
              type="date"
              required
              :rules="[v => !!v || 'Date is required']"
            />

            <!-- Start Time -->
            <q-input
              v-model="bookingDialogValues.start_time"
              filled
              dark
              label="Start Time"
              type="time"
              required
              :rules="[v => !!v || 'Start time is required']"
            />

            <!-- End Time -->
            <q-input
              v-model="bookingDialogValues.end_time"
              filled
              dark
              label="End Time"
              type="time"
              required
              :rules="[v => !!v || 'End time is required']"
            />

            <div class="row justify-end q-mt-md">
              <q-btn label="Cancel" flat v-close-popup class="text-grey-4" />
              <q-btn label="Reserve Slot" type="submit" color="primary" class="q-ml-sm" :loading="createLoading" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { GetBookingsQuery, GetBookableAssetsQuery } from 'src/graphql/generated/graphql';
import { useAuthStore } from 'src/stores/auth.store';
import {
  useBookings,
  useBookableAssets,
  useCreateBooking,
  useCancelBooking,
} from 'src/features/bookings/api/useBookings';

const authStore = useAuthStore();
const currentUser = computed(() => authStore.user);
const isManager = computed(() => ['ADMIN', 'ASSET_MANAGER'].includes(authStore.currentRole || ''));

const viewMode = ref('calendar');
const selectedDate = ref(new Date().toISOString().split('T')[0]); // YYYY-MM-DD format

// Fetch Bookings & Bookable Assets
const { bookings, loading, refetch } = useBookings();
const { bookableAssets } = useBookableAssets();

const bookableAssetOptions = computed(() => {
  return (bookableAssets.value || []).map((a) => ({
    label: `${a.name} (${a.location || 'No Location'})`,
    value: a.id,
  }));
});

// Format dates / times
function formatTime(isoString: unknown) {
  const date = new Date(isoString as string);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDateTime(isoString: unknown) {
  const date = new Date(isoString as string);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function getStatusColor(status: string) {
  switch (status) {
    case 'UPCOMING': return 'positive';
    case 'ONGOING': return 'warning';
    case 'COMPLETED': return 'primary';
    case 'CANCELLED': return 'grey-7';
    default: return 'primary';
  }
}

// Find bookings for selected asset and selected date
function getBookingsForAssetAndDate(assetId: string) {
  return (bookings.value || []).filter((b: GetBookingsQuery['bookings'][number]) => {
    if (b.asset_id !== assetId) return false;
    const startStr = (b.start_time as string).split('T')[0];
    return startStr === selectedDate.value;
  });
}

// Actions & Mutations
const { createBooking, createLoading } = useCreateBooking();
const { cancelBooking } = useCancelBooking();

// New Booking Dialog state
const submitError = ref<string | null>(null);
const bookingDialogValues = ref({
  open: false,
  asset_id: '',
  date: '',
  start_time: '',
  end_time: '',
});

function openNewBookingDialog(asset: GetBookableAssetsQuery['bookableAssets'][number] | null) {
  submitError.value = null;
  bookingDialogValues.value = {
    open: true,
    asset_id: asset ? asset.id : '',
    date: selectedDate.value || '',
    start_time: '09:00',
    end_time: '10:00',
  };
}

async function submitBooking() {
  submitError.value = null;
  try {
    const startIso = new Date(`${bookingDialogValues.value.date}T${bookingDialogValues.value.start_time}:00`);
    const endIso = new Date(`${bookingDialogValues.value.date}T${bookingDialogValues.value.end_time}:00`);

    if (startIso >= endIso) {
      submitError.value = 'Start time must be before end time.';
      return;
    }

    const input = {
      asset_id: bookingDialogValues.value.asset_id,
      start_time: startIso,
      end_time: endIso,
    };

    await createBooking(input);
    bookingDialogValues.value.open = false;
    void refetch();
  } catch (err: unknown) {
    console.error(err);
    const errMsg = err instanceof Error ? err.message : String(err);
    if (errMsg && errMsg.includes('overlaps')) {
      submitError.value = 'Requested slot overlaps with an existing booking.';
    } else {
      submitError.value = errMsg || 'Failed to create booking.';
    }
  }
}

async function handleCancelBooking(id: string) {
  try {
    await cancelBooking(id);
    void refetch();
  } catch (err) {
    console.error(err);
  }
}

// Table columns for list view
const columns = [
  { name: 'asset', label: 'Resource / Asset', field: (row: GetBookingsQuery['bookings'][number]) => row.asset?.name, align: 'left' as const },
  { name: 'start_time', label: 'Start Time', field: 'start_time', align: 'left' as const },
  { name: 'end_time', label: 'End Time', field: 'end_time', align: 'left' as const },
  { name: 'booked_by', label: 'Booked By', field: (row: GetBookingsQuery['bookings'][number]) => row.booked_by_user?.name, align: 'left' as const },
  { name: 'status', label: 'Status', field: 'status', align: 'center' as const },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' as const },
];
</script>

<style scoped lang="scss">
.px-2 {
  padding-left: 8px;
  padding-right: 8px;
}
.bullet {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.py-2 {
  padding-top: 8px;
  padding-bottom: 8px;
}
.border-upcoming {
  border-left: 4px solid $positive;
}
.border-cancelled {
  border-left: 4px solid $grey-7;
}
.booking-strip {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.timeline-container {
  border: 1px solid rgba(255, 255, 255, 0.05);
}
</style>
