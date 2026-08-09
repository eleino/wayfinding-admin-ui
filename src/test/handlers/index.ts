import { locationHandlers } from './locations';
import { dashboardHandlers } from './dashboard';
import { translationHandlers } from './translations';
import { authHandlers } from './auth';
import { pathHandlers } from './paths';
import { qrCodeHandlers } from './qrcodes';
import { instructionHandlers } from './instructions';

export const handlers = [
    ...locationHandlers,
    ...dashboardHandlers,
    ...translationHandlers,
    ...authHandlers,
    ...pathHandlers,
    ...qrCodeHandlers,
    ...instructionHandlers,
];
