// GET /metrics/paths/:pathId?date=2025-12-01
export interface Metrics {
    date: string;
    usage_count: number;
    finished_count: number;
}

// GET /metrics/paths?startDate=2025-12-01&endDate=2025-12-31
export interface PathMetricsList {
    path_id: number;
    usage_count: number;
    finished_count: number;
    metrics: Metrics[];
}