module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  transform: {
    '^.+\.js$': 'babel-jest',
  },
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.d.ts',
    '!src/server.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testTimeout: 10000,
};