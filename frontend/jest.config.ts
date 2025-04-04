module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testMatch: ['<rootDir>/tests/**/*.test.tsx'],
    roots: ['<rootDir>/tests/'],
    setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
};

export {};