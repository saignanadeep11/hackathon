import { useQuery, useMutation } from '@vue/apollo-composable';
import { ref, computed, type Ref } from 'vue';
import {
  GetActivityLogsDocument,
  GetUnreadNotificationCountDocument,
  MarkAllNotificationsReadDocument,
  type ActivityLogFilterInput,
} from 'src/graphql/generated/graphql';

export function useNotifications(filter: Ref<ActivityLogFilterInput> = ref({})) {
  const { result, loading, error, refetch } = useQuery(GetActivityLogsDocument, () => ({
    filter: filter.value,
  }), {
    fetchPolicy: 'network-only',
  });

  const logs = computed(() => result.value?.activityLogs ?? []);

  return {
    logs,
    loading,
    error,
    refetch,
  };
}

export function useUnreadNotificationCount() {
  const { result, loading, error, refetch } = useQuery(GetUnreadNotificationCountDocument, {}, {
    pollInterval: 15000, // Poll every 15 seconds for notification bell count
    fetchPolicy: 'network-only',
  });

  const unreadCount = computed(() => result.value?.unreadNotificationCount ?? 0);

  return {
    unreadCount,
    loading,
    error,
    refetch,
  };
}

export function useMarkAllNotificationsRead() {
  const { mutate: markReadMutate, loading, error } = useMutation(MarkAllNotificationsReadDocument);

  async function markAllNotificationsRead() {
    const res = await markReadMutate();
    return res?.data?.markAllNotificationsRead ?? false;
  }

  return {
    markAllNotificationsRead,
    loading,
    error,
  };
}
