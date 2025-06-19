# Testing Documentation

## Overview

This project has a comprehensive testing setup with both unit tests and end-to-end (E2E) tests for the MCP server functionality.

## Test Structure

### Unit Tests (`*.test.ts`)
- **Location**: `src/app/api/mcp/route.test.ts`
- **Purpose**: Test MCP server handlers with mocked fetch calls
- **Setup**: Uses `jest-fetch-mock` to mock external API calls
- **Coverage**: 
  - Tool listing functionality
  - Tool execution with mocked responses
  - Cart operations flow with authentication
  - Error handling scenarios

### E2E Tests (`*.e2e.test.ts`)
- **Location**: `src/app/api/mcp/route.e2e.test.ts`
- **Purpose**: Test MCP server with real FakeStore API calls
- **Setup**: Uses `undici` fetch for real network requests
- **Coverage**:
  - Real product data retrieval
  - Category listing
  - Product filtering
  - Tool schema validation

## Running Tests

### All Tests
```bash
npm test
```

### Unit Tests Only
```bash
npm test -- --selectProjects=unit
```

### E2E Tests Only
```bash
npm test -- --selectProjects=e2e
```

### Specific Test Pattern
```bash
npm test -- --testNamePattern="cart operations"
```

## Test Configuration

### Jest Configuration (`jest.config.ts`)
- Uses `ts-jest` with ESM support
- Separate projects for unit and E2E tests
- Different setup files for each test type

### Setup Files
- **`jest.setup.ts`**: Unit test setup with fetch mocking
- **`jest.e2e.setup.ts`**: E2E test setup with real fetch

## Key Features Tested

### MCP Server Functionality
- ✅ Tool registration and listing
- ✅ Tool execution with proper request/response format
- ✅ Session management
- ✅ Error handling and validation

### FakeStore API Integration
- ✅ Product retrieval (single and multiple)
- ✅ Category listing
- ✅ Product filtering by category
- ✅ Authentication flow
- ✅ Cart operations (add, remove, get, clear)

### API Response Validation
- ✅ JSON-RPC 2.0 format compliance
- ✅ MCP protocol adherence
- ✅ Proper error responses
- ✅ Content structure validation

## Test Data

### Demo Users (from FakeStore API)
```typescript
const DEMO_USERS = [
  { username: 'johnd', password: 'm38rmF$', name: 'John Doe', email: 'john@gmail.com' },
  { username: 'mor_2314', password: '83r5^_', name: 'David Morrison', email: 'morrison@gmail.com' },
  { username: 'kevinryan', password: 'kev02937@', name: 'Kevin Ryan', email: 'kevin@gmail.com' },
  { username: 'donero', password: 'ewedon', name: 'Don Romer', email: 'don@gmail.com' },
]
```

## Dependencies

### Test Dependencies
- `jest` - Testing framework
- `ts-jest` - TypeScript support for Jest
- `@types/jest` - TypeScript definitions
- `jest-environment-node` - Node.js test environment
- `jest-fetch-mock` - Fetch mocking for unit tests
- `undici` - Real fetch implementation for E2E tests

## Best Practices

1. **Separation of Concerns**: Unit tests use mocks, E2E tests use real APIs
2. **Comprehensive Coverage**: Both happy path and error scenarios
3. **Real Data**: E2E tests validate against actual FakeStore API responses
4. **Type Safety**: Full TypeScript support in all test files
5. **Fast Feedback**: Unit tests run quickly with mocks
6. **Integration Validation**: E2E tests ensure real-world functionality

## Troubleshooting

### Common Issues
- **Fetch Errors**: Ensure `undici` is installed for E2E tests
- **ESM Issues**: Check `jest.config.ts` transform settings
- **Type Errors**: Verify TypeScript configuration is correct
- **Network Issues**: E2E tests require internet connection

### Debug Commands
```bash
# Run tests with verbose output
npm test -- --verbose

# Run specific test file
npm test -- src/app/api/mcp/route.test.ts

# Run tests in watch mode
npm test -- --watch
``` 