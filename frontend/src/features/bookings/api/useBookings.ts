import { useQuery, useMutation } from '@vue/apollo-composable';
import { ref, computed, type Ref } from 'vue';
import {
  GetBookingsDocument,
  GetBookableAssetsDocument,
  CreateBookingDocument,
  CancelBookingDocument,
  type CreateBookingInput,
  type BookingFilterInput,
} from 'src/graphql/generated/graphql';

export function useBookings(filter: Ref<BookingFilterInput> = ref({})) {
  const { result, loading, error, refetch } = useQuery(GetBookingsDocument, () => ({
    filter: filter.value,
  }));

  const bookings = computed(() => result.value?.bookings ?? []);

  return {
    bookings,
    loading,
    error,
    refetch,
  };
}

export function useBookableAssets() {
  const { result, loading, error, refetch } = useQuery(GetBookableAssetsDocument);

  const bookableAssets = computed(() => result.value?.bookableAssets ?? []);

  return {
    bookableAssets,
    loading,
    error,
    refetch,
  };
}

export function useCreateBooking() {
  const {
    mutate: createMutate,
    loading: createLoading,
    error: createError,
  } = useMutation(CreateBookingDocument);

  async function createBooking(input: CreateBookingInput) {
    const result = await createMutate({ input });
    return result?.data?.createBooking;
  }

  return {
    createBooking,
    createLoading,
    createError,
  };
}

export function useCancelBooking() {
  const {
    mutate: cancelMutate,
    loading: cancelLoading,
    error: cancelError,
  } = useMutation(CancelBookingDocument);

  async function cancelBooking(id: string) {
    const result = await cancelMutate({ id });
    return result?.data?.cancelBooking;
  }

  return {
    cancelBooking,
    cancelLoading,
    cancelError,
  };
}
