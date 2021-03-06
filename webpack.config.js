const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const vueLoaderPlugin=require('vue-loader/lib/plugin')
module.exports = {
    entry: {index:'./src/index.js',test:'./src/test.js'},
    output:{
        filename:'[name].js',
        path:__dirname+'/dist'
    },
    module: {
        rules: [
            {
                test:/\.vue$/,
                loader:'vue-loader'
        },{
            test: /\.css$/,
            loader: ['style-loader', 'css-loader']
        }]
    },
    plugins: [
        new htmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
            filename: 'index.html'
        }),
        new htmlWebpackPlugin({
            filename: 'test.html',
            template:'src/test.html'
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new vueLoaderPlugin()

    ],
    devServer: {
        host: 'localhost',
        compress: true,
        port: 9527,
        historyApiFallback: true,
    }
}