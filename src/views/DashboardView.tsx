import { ListOrganisations } from "@components/Dashboard/ListOrganisations";
import PathUsageChart from "@components/Dashboard/PathUsageChart";
import { useGetAllPathMetrics } from "@hooks/useMetrics";
import { aggregateMetricsByDate } from "@utils/sortMetrics";

export const DashboardView = () => {
    // fetch all metrics for building 1
    const metricsData = useGetAllPathMetrics(1, "2025-11-01", "2025-12-17");
    const aggregatedMetrics = aggregateMetricsByDate(metricsData.data || []);
    return (
        <div className="w-200 p-4">
            <h1>Dashboard</h1>
            <h2 className="text-center">Path usage:</h2>
            <PathUsageChart pathMetrics={aggregatedMetrics} />
            <ListOrganisations />
        </div>
    );
}