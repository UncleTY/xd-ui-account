const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8081,
    proxy: {
      '/api': {
        target: 'http://124.220.24.28:8080/xd-account/',
        changOrigin: true,
        pathRewrite: { '^/api': '' },//路径改写
      }
    }
  }
})
