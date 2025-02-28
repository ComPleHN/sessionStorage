// jest.config.js
module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    transform: {
      '^.+\\.[jt]sx?$': 'babel-jest'
    },
    transformIgnorePatterns: [
      "/node_modules/(?!(your-module-name)/)" // 保留需要转换的第三方模块
    ]
  };

  