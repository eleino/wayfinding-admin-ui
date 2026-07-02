import '@testing-library/jest-dom';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from './server';

// Establish API mocking before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// reset request handlers and cleanup after each test to avoid test interference
afterEach(() => {
    server.resetHandlers();
    cleanup();
});

// Clean up after the tests are finished
afterAll(() => server.close());