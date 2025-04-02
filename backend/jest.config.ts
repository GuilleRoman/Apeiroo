module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/**/*.test.ts'], // Adjust to your test file location
    clearMocks: true,
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.test.json',
      },
    }
  };