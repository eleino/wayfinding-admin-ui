import 'vitest-browser-react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { cleanup } from 'vitest-browser-react';
import { worker } from './worker';

// Keep API requests independent of Vitest's temporary browser-server origin.
vi.stubEnv('VITE_API_BASE_URL', 'http://localhost/api/v1/');
window.scrollTo = () => undefined;

// Establish API mocking before all tests
beforeAll(() => worker.start({ onUnhandledRequest: 'error', quiet: true }));

// reset request handlers and cleanup after each test to avoid test interference
afterEach(async () => {
    worker.resetHandlers();
    localStorage.clear();
    await cleanup();
});

// Clean up after the tests are finished
afterAll(() => worker.stop());
