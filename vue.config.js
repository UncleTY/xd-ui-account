const {defineConfig} = require('@vue/cli-service')

module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        proxy: {
            '/api': {
                target: 'http://124.220.24.28:8082',
                logLevel: 'debug',
                changeOrigin: true, //开启跨域
                pathRewrite: { //重写地址
                    '^/api': ''
                }
            }
        }
    }
})