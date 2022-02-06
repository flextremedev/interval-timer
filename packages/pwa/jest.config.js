const path = require('path');

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
  transform: {
    '.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      { configFile: path.resolve(__dirname, './.babelrc') },
    ],
  },
  setupFilesAfterEnv: ['<rootDir>/setup-tests.js'],
  testEnvironment: 'jsdom',
};
