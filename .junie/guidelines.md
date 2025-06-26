# Development Guidelines for IIIF Image API Example

This document provides guidelines and instructions for developing and maintaining the IIIF Image API Example project.

## Build/Configuration Instructions

### Prerequisites
- Node.js and npm

### Project Setup
```sh
npm install
```

### Development Server
To start the development server with hot-reload:
```sh
npm run dev
```
This will start the server at http://localhost:5173 by default.

### Production Build
To build the project for production:
```sh
npm run build
```
The built files will be in the `dist` directory.

### Preview Production Build
To preview the production build locally:
```sh
npm run preview
```

## Testing Information

### Unit Testing with Vitest

This project uses [Vitest](https://vitest.dev/) for unit testing, with [Vue Test Utils](https://test-utils.vuejs.org/) for component testing.

#### Running Unit Tests
```sh
npm run test:unit
```

#### Writing Unit Tests

Unit tests are located in `__tests__` directories next to the files they test, or in the `src/components/__tests__` directory for component tests.

Test files should follow the naming convention `*.spec.ts`.

Example of a component test:
```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import YourComponent from '../YourComponent.vue'

describe('YourComponent', () => {
  it('renders properly', () => {
    const wrapper = mount(YourComponent, { props: { /* your props */ } })
    expect(wrapper.text()).toContain('Expected text')
  })
})
```

Example of a utility function test:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import yourFunction from '../yourFunction'

describe('yourFunction', () => {
  it('should work as expected', () => {
    // Your test here
    expect(yourFunction()).toBe(expectedResult)
  })
})
```

For testing time-based functions, use Vitest's fake timers:
```typescript
beforeEach(() => {
  vi.useFakeTimers()
})

it('should handle timing correctly', () => {
  // Your test here
  vi.advanceTimersByTime(100) // Fast-forward time
})
```

### End-to-End Testing with Playwright

This project uses [Playwright](https://playwright.dev/) for end-to-end testing.

#### Running E2E Tests
```sh
# Install browsers for the first run
npx playwright install

# Run all tests
npm run test:e2e

# Run tests on a specific browser
npm run test:e2e -- --project=chromium

# Run a specific test file
npm run test:e2e -- tests/example.spec.ts

# Run tests in debug mode
npm run test:e2e -- --debug
```

#### Writing E2E Tests

E2E tests are located in the `e2e` directory at the project root.

Example of an E2E test:
```typescript
import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('Expected heading');
  await page.click('button');
  await expect(page.locator('.result')).toBeVisible();
});
```

## Code Style and Development Guidelines

### TypeScript

This project uses TypeScript for type safety. Make sure to define proper types for your functions, components, and variables.

### Vue 3 Composition API

This project uses Vue 3 with the Composition API. Refer to the [Vue 3 documentation](https://v3.vuejs.org/guide/composition-api-introduction.html) for best practices.

### State Management

This project uses [Pinia](https://pinia.vuejs.org/) for state management. Store modules are located in the `src/stores` directory.

### Routing

This project uses [Vue Router](https://router.vuejs.org/) for routing. Route definitions are located in the `src/router` directory.

### Utility Functions

Utility functions like the debounce function are organized in their own directories (e.g., `src/debounce`). When adding new utility functions, follow this pattern and include appropriate tests.

### Component Organization

Components are organized in the `src/components` directory. Views (page components) are in the `src/views` directory.

## IIIF-Specific Information

This project implements the [IIIF Image API](https://iiif.io/api/image/3.0/), which is a standardized way to deliver images over the web. When working with IIIF functionality, refer to the official IIIF documentation for guidance on implementation details.