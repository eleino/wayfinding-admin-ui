import '@testing-library/jest-dom';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from './server';

// Ky uses Node's Request implementation in Vitest, which requires an absolute URL.
vi.stubEnv('VITE_API_BASE_URL', 'http://localhost/api/v1/');
window.scrollTo = () => undefined;

// Establish API mocking before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// reset request handlers and cleanup after each test to avoid test interference
afterEach(() => {
    server.resetHandlers();
    cleanup();
});

// Clean up after the tests are finished
afterAll(() => server.close());
