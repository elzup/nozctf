import { defineConfig } from 'vitest/config'

// Cold start of the functions emulator takes several seconds on the first call
const E2E_TIMEOUT_MS = 60 * 1000

export default defineConfig({
  test: {
    globals: false,
    environment: 'node',
    include: ['e2e/**/*.e2e.test.ts'],
    // Every file clears the same Firestore emulator, so they cannot run side by side
    fileParallelism: false,
    testTimeout: E2E_TIMEOUT_MS,
    hookTimeout: E2E_TIMEOUT_MS,
  },
})
