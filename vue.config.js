const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    devServer: {
        host: 'localhost',
        hot:true,
        port: 8080,
        proxy: {
            '/xboot': {
                // target: 'http://192.168.1.65:8888',  // 请求本地 需要xboot后台项目
                // target:"http://endmanager.znccc.cn", //线上
                target:"http://47.99.72.232:8887",//测试
                pathRewrite: {
                    '^/xboot': '/xboot'
                    }
                // ws: true
            },
            '/foo': {
                target: '<other_url>'
            }
        }
    },
    // 打包时不生成.map文件 避免看到源码
    productionSourceMap: false,
    // 部署优化
    configureWebpack: {
        // 使用CDN
        // externals: {
        //     vue: 'Vue',
        //     axios: 'axios',
        //     'vue-router': 'VueRouter',
        //     vuex: 'Vuex',
        //     iview: 'iview',
        //     echarts: 'echarts',
        //     apexcharts: 'ApexCharts',
        //     'vue-apexcharts': 'VueApexCharts',
        //     xlsx: 'XLSX',
        //     dplayer: 'DPlayer',
        //     gitalk: 'Gitalk'
        // },
        // GZIP压缩
        plugins: [
            new CompressionPlugin({
                test: /\.js$|\.html$|\.css/, // 匹配文件
                threshold: 10240 // 对超过10k文件压缩
            })
        ]
    }
}