# 安装jsdom
```
npm install --save-dev jest jest-environment-jsdom @testing-library/jest-dom
```
# 发现jest使用commonjs的require语法，但是这里使用的是import语法，所以需要配置jest.config.js
```
npm install --save-dev @babel/core @babel/preset-env babel-jest
```