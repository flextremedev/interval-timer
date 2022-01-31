module.exports = {
  displayName: {
    name: 'PWA',
    color: 'blue',
  },
  collectCoverageFrom: ['./src/**/*.{ts,tsx}'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/setup-tests.js'],
  testEnvironment: 'jsdom',
};
