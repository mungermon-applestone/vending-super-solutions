
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Extend Vitest's expect method with methods from react-testing-library
expect.extend({});

// Clean up after each test
afterEach(() => {
  cleanup();
});
