import { useQuery, useMutation } from '@vue/apollo-composable';
import { ref, computed, type Ref } from 'vue';
import {
  GetMaintenanceRequestsDocument,
  CreateMaintenanceRequestDocument,
  ApproveMaintenanceRequestDocument,
  RejectMaintenanceRequestDocument,
  AssignTechnicianDocument,
  ResolveMaintenanceRequestDocument,
  type CreateMaintenanceRequestInput,
  type MaintenanceFilterInput,
} from 'src/graphql/generated/graphql';

export function useMaintenance(filter: Ref<MaintenanceFilterInput> = ref({})) {
  const { result, loading, error, refetch } = useQuery(GetMaintenanceRequestsDocument, () => ({
    filter: filter.value,
  }));

  const requests = computed(() => result.value?.maintenanceRequests ?? []);

  return {
    requests,
    loading,
    error,
    refetch,
  };
}

export function useCreateMaintenanceRequest() {
  const { mutate, loading, error } = useMutation(CreateMaintenanceRequestDocument);

  async function createRequest(input: CreateMaintenanceRequestInput) {
    const res = await mutate({ input });
    return res?.data?.createMaintenanceRequest;
  }

  return {
    createRequest,
    loading,
    error,
  };
}

export function useApproveMaintenanceRequest() {
  const { mutate, loading, error } = useMutation(ApproveMaintenanceRequestDocument);

  async function approveRequest(id: string) {
    const res = await mutate({ id });
    return res?.data?.approveMaintenanceRequest;
  }

  return {
    approveRequest,
    loading,
    error,
  };
}

export function useRejectMaintenanceRequest() {
  const { mutate, loading, error } = useMutation(RejectMaintenanceRequestDocument);

  async function rejectRequest(id: string) {
    const res = await mutate({ id });
    return res?.data?.rejectMaintenanceRequest;
  }

  return {
    rejectRequest,
    loading,
    error,
  };
}

export function useAssignTechnician() {
  const { mutate, loading, error } = useMutation(AssignTechnicianDocument);

  async function assign(id: string, technicianName: string) {
    const res = await mutate({ id, technician_name: technicianName });
    return res?.data?.assignTechnician;
  }

  return {
    assign,
    loading,
    error,
  };
}

export function useResolveMaintenanceRequest() {
  const { mutate, loading, error } = useMutation(ResolveMaintenanceRequestDocument);

  async function resolveRequest(id: string) {
    const res = await mutate({ id });
    return res?.data?.resolveMaintenanceRequest;
  }

  return {
    resolveRequest,
    loading,
    error,
  };
}
