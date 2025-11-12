// Setup file for tests — register jest-dom matchers with Vitest's expect
import { expect } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'

// Add the jest-dom matchers to Vitest's expect
expect.extend(matchers)
