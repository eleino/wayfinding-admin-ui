import { fetchAllPathMetrics } from "@api/metrics";
import { useQuery } from "@tanstack/react-query";

export const useGetAllPathMetrics = (buildingId: number | null, startDate: string, endDate: string) => {
    const query = useQuery({ queryKey: ["allPathMetrics", buildingId, startDate, endDate], queryFn: () => fetchAllPathMetrics(buildingId, startDate, endDate), enabled: !!buildingId && !!startDate && !!endDate });
    return query;
}
