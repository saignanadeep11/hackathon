import { useQuery } from '@vue/apollo-composable';
import { gql } from '@apollo/client/core';

export const GET_DASHBOARD_METRICS = gql`
  query GetDashboardMetrics {
    dashboardMetrics {
      assetsAvailable
      assetsAllocated
      maintenanceToday
      activeBookings
      pendingTransfers
      upcomingReturns
      overdueReturns
    }
  }
`;

export function useDashboard() {
  const { result, loading, error, refetch } = useQuery(GET_DASHBOARD_METRICS, null, {
    fetchPolicy: 'cache-and-network',
  });

  return {
    metricsResult: result,
    metricsLoading: loading,
    metricsError: error,
    refetchMetrics: refetch,
  };
}
