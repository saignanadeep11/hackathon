import { useQuery } from '@vue/apollo-composable';
import { computed } from 'vue';
import { GetDashboardMetricsDocument } from 'src/graphql/generated/graphql';

export function useDashboard() {
  const { result, loading, error, refetch } = useQuery(
    GetDashboardMetricsDocument,
    {},
    {
      pollInterval: 30000, // Poll every 30 seconds for live updates
      fetchPolicy: 'network-only',
    },
  );

  const metrics = computed(() => result.value?.dashboardMetrics ?? null);

  return {
    metrics,
    loading,
    error,
    refetch,
  };
}
