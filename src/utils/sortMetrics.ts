import type { Metrics, PathMetricsList } from '../types/metrics';

// sort metrics by date
export const sortMetricsByDate = (metrics: Metrics[]): Metrics[] => {
    return metrics.slice().sort((a, b) => a.date.localeCompare(b.date));
};

// sort path metrics summaries by usage count
export const sortPathMetricsSummariesByUsageCount = (summaries: PathMetricsList[]): PathMetricsList[] => {
    return summaries.slice().sort((a, b) => b.usage_count - a.usage_count);
};

// sort path metrics summaries by finished count
export const sortPathMetricsSummariesByFinishedCount = (summaries: PathMetricsList[]): PathMetricsList[] => {
    return summaries.slice().sort((a, b) => b.finished_count - a.finished_count);
};

// add up total usage and finished counts for each date
export const aggregateMetricsByDate = (summaries: PathMetricsList[]): Metrics[] => {
    const metricsMap: Record<string, Metrics> = {};

    summaries.forEach(summary => {
        summary.metrics.forEach(metric => {
            if (!metricsMap[metric.date]) {
                metricsMap[metric.date] = { date: metric.date, usage_count: 0, finished_count: 0 };
            }
            metricsMap[metric.date].usage_count += metric.usage_count;
            metricsMap[metric.date].finished_count += metric.finished_count;
        });
    });

    return Object.values(metricsMap);
};