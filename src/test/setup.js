import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

afterEach(() => {
  cleanup();
});

global.fetch = vi.fn();
global.navigator = {
  ...global.navigator,
  serviceWorker: {
    register: vi.fn().mockResolvedValue({}),
    ready: Promise.resolve({}),
  },
  storage: {
    estimate: vi.fn().mockResolvedValue({ quota: 1000000000, usage: 1000000 }),
  },
};

Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
