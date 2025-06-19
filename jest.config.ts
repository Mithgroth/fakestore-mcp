import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  projects: [
    {
      displayName: 'unit',
      preset: 'ts-jest/presets/default-esm',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/**/*.test.ts'],
      testPathIgnorePatterns: ['.*\\.e2e\\.test\\.ts$'],
      setupFiles: ['<rootDir>/jest.setup.ts'],
      extensionsToTreatAsEsm: ['.ts', '.tsx'],
      transform: {
        '^.+\\.[jt]sx?$': ['ts-jest', { useESM: true }],
      },
      transformIgnorePatterns: [
        'node_modules/(?!(jest-fetch-mock|@modelcontextprotocol/sdk)/)',
      ],
      moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
      },
    },
    {
      displayName: 'e2e',
      preset: 'ts-jest/presets/default-esm',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/**/*.e2e.test.ts'],
      setupFiles: ['<rootDir>/jest.e2e.setup.ts'],
      extensionsToTreatAsEsm: ['.ts', '.tsx'],
      transform: {
        '^.+\\.[jt]sx?$': ['ts-jest', { useESM: true }],
      },
      transformIgnorePatterns: [
        'node_modules/(?!(jest-fetch-mock|@modelcontextprotocol/sdk|undici)/)',
      ],
      moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
      },
    }
  ]
};

export default config; 