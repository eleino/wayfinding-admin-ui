import { sortMetricsByDate } from "@utils/sortMetrics";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Metrics } from '@apptypes/metrics';

// use Recharts to display a line chart of path usage and finished counts over time

interface PathUsageChartProps {
    pathMetrics: Metrics[];
}

const PathUsageChart = (props: PathUsageChartProps) => {
    // ensure metrics are sorted by date before rendering the chart
    const metrics = sortMetricsByDate(props.pathMetrics);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip wrapperClassName="text-lab-gray-light rounded" labelClassName="font-bold" contentStyle={{backgroundColor: 'var(--color-sidebar-grey)', border: '1px solid var(--color-border-grey)'}} />
                <Legend />
                <Line name="Paths started" type="monotone" dataKey="usage_count" stroke="var(--color-lab-turquoise)" activeDot={{ r: 5, stroke: "var(--color-lab-turquoise)" }} />
                <Line name="Paths completed" type="monotone" dataKey="finished_count" stroke="var(--color-lab-green-dark)" activeDot={{ r: 5, stroke: "var(--color-lab-green-dark)" }} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default PathUsageChart;
