// 项目根目录创建 babel.config.js
module.exports = {
    presets: [
      ['@babel/preset-env', { 
        targets: {
          node: 'current'
        }
      }]
    ]
  };
  