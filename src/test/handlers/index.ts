import { locationHandlers } from './locations';
import { dashboardHandlers } from './dashboard';

export const handlers = [
    ...locationHandlers,
    ...dashboardHandlers,
];
