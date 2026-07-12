import { useQuery, useMutation } from '@vue/apollo-composable';
import { ref, computed, type Ref } from 'vue';
import {
  GetAllocationsDocument,
  RequestAllocationDocument,
  ApproveAllocationDocument,
  RejectAllocationDocument,
  ReturnAssetDocument,
  type CreateAllocationInput,
  type AllocationFilterInput,
} from 'src/graphql/generated/graphql';

export function useAllocations(filter: Ref<AllocationFilterInput> = ref({})) {
  const { result, loading, error, refetch } = useQuery(GetAllocationsDocument, () => ({
    filter: filter.value,
  }));

  const allocations = computed(() => result.value?.allocations ?? []);

  return {
    allocations,
    loading,
    error,
    refetch,
  };
}

export function useRequestAllocation() {
  const { mutate: requestMutate, loading: requestLoading, error: requestError } = useMutation(RequestAllocationDocument);

  async function requestAllocation(input: CreateAllocationInput) {
    const result = await requestMutate({ input });
    return result?.data?.requestAllocation;
  }

  return {
    requestAllocation,
    requestLoading,
    requestError,
  };
}

export function useApproveAllocation() {
  const { mutate: approveMutate, loading: approveLoading, error: approveError } = useMutation(ApproveAllocationDocument);

  async function approveAllocation(id: string) {
    const result = await approveMutate({ id });
    return result?.data?.approveAllocation;
  }

  return {
    approveAllocation,
    approveLoading,
    approveError,
  };
}

export function useRejectAllocation() {
  const { mutate: rejectMutate, loading: rejectLoading, error: rejectError } = useMutation(RejectAllocationDocument);

  async function rejectAllocation(id: string) {
    const result = await rejectMutate({ id });
    return result?.data?.rejectAllocation;
  }

  return {
    rejectAllocation,
    rejectLoading,
    rejectError,
  };
}

export function useReturnAsset() {
  const { mutate: returnMutate, loading: returnLoading, error: returnError } = useMutation(ReturnAssetDocument);

  async function returnAsset(id: string, checkInNotes?: string) {
    const result = await returnMutate({ id, check_in_notes: checkInNotes });
    return result?.data?.returnAsset;
  }

  return {
    returnAsset,
    returnLoading,
    returnError,
  };
}
