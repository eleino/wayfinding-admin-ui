import type { Metrics, PathMetricsList } from '@apptypes/metrics';
import apiClient from './client';

// GET /metrics/paths?startDate=2025-12-01&endDate=2025-12-31
export const fetchAllPathMetrics = async (buildingId: number, startDate: string, endDate: string): Promise<PathMetricsList[]> => {
    if (!startDate || !endDate) {
        throw new Error("Start date and end date are required to fetch path metrics summaries.");
    }
    const response = await apiClient.get(`metrics/paths?buildingId=${buildingId}&startDate=${startDate}&endDate=${endDate}`);
    return response.json();
}

// GET /metrics/paths/:pathId?date=2025-12-01
export const fetchPathMetrics = async (siteId: number|null, pathId: number, date: string): Promise<Metrics[]> => {
    if (!siteId) {
        throw new Error("Site ID is required to fetch path metrics.");
    }
    const response = await apiClient.get(`sites/${siteId}/metrics/paths/${pathId}?date=${date}`);
    const json: { data: Metrics[] } = await response.json();
    return json.data;
}