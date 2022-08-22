/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  modulePathIgnorePatterns: [
    'dist',
    'node_modules'
  ],
  preset: 'ts-jest',
  testEnvironment: 'node',
};
