import { locationHandlers } from './locations';
import { dashboardHandlers } from './dashboard';
import { translationHandlers } from './translations';

export const handlers = [
    ...locationHandlers,
    ...dashboardHandlers,
    ...translationHandlers,
];
