module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests'],
  clearMocks: true,
  coverageDirectory: './docs/jest-coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
  collectCoverage: true,
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
  //测试文件的类型
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx', 'node'],

  coverageThreshold: {
    global: {
      branches: 50,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
};
