import { useQuery, useMutation } from '@vue/apollo-composable';
import { computed } from 'vue';
import {
  GetAuditCyclesDocument,
  GetMyAuditItemsDocument,
  CreateAuditCycleDocument,
  UpdateAuditItemStatusDocument,
  CloseAuditCycleDocument,
  GetDepartmentsForAuditDocument,
  GetUsersForAuditDocument,
  type CreateAuditCycleInput,
  type AuditItemStatus,
} from 'src/graphql/generated/graphql';

export function useAuditCycles() {
  const { result, loading, error, refetch } = useQuery(GetAuditCyclesDocument, null, {
    fetchPolicy: 'network-only',
  });
  const auditCycles = computed(() => result.value?.auditCycles ?? []);

  return {
    auditCycles,
    loading,
    error,
    refetch,
  };
}

export function useMyAuditItems() {
  const { result, loading, error, refetch } = useQuery(GetMyAuditItemsDocument, null, {
    fetchPolicy: 'network-only',
  });
  const myAuditItems = computed(() => result.value?.myAuditItems ?? []);

  return {
    myAuditItems,
    loading,
    error,
    refetch,
  };
}

export function useCreateAuditCycle() {
  const { mutate: createMutate, loading: createLoading, error: createError } = useMutation(CreateAuditCycleDocument);

  async function createAuditCycle(input: CreateAuditCycleInput) {
    const result = await createMutate({ input });
    return result?.data?.createAuditCycle;
  }

  return {
    createAuditCycle,
    createLoading,
    createError,
  };
}

export function useUpdateAuditItemStatus() {
  const { mutate: updateMutate, loading: updateLoading, error: updateError } = useMutation(UpdateAuditItemStatusDocument);

  async function updateAuditItemStatus(itemId: string, status: AuditItemStatus, notes?: string) {
    const result = await updateMutate({ itemId, status, notes });
    return result?.data?.updateAuditItemStatus;
  }

  return {
    updateAuditItemStatus,
    updateLoading,
    updateError,
  };
}

export function useCloseAuditCycle() {
  const { mutate: closeMutate, loading: closeLoading, error: closeError } = useMutation(CloseAuditCycleDocument);

  async function closeAuditCycle(id: string) {
    const result = await closeMutate({ id });
    return result?.data?.closeAuditCycle;
  }

  return {
    closeAuditCycle,
    closeLoading,
    closeError,
  };
}

export function useDepartmentsForAudit() {
  const { result, loading, error } = useQuery(GetDepartmentsForAuditDocument);
  const departments = computed(() => result.value?.departments ?? []);

  return {
    departments,
    loading,
    error,
  };
}

export function useUsersForAudit() {
  const { result, loading, error } = useQuery(GetUsersForAuditDocument);
  const users = computed(() => result.value?.users ?? []);

  return {
    users,
    loading,
    error,
  };
}
