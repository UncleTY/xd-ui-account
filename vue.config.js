const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8081,
    proxy: {
      '/api': {
        target: 'http://localhost:8080/xd-account/',
        pathRewrite: { '^/api': '' },//路径改写
      },
    }
  }
})
