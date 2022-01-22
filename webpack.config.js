const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    mode: 'development', // change to 'production'
    entry: './src/app.js',
    devtool: 'inline-source-map', // Erased to production
    plugins: [
        new HtmlWebpackPlugin({
            inject: false,
            template: "index.html"
        }),
    ],
    devServer: {
        static: './dist',
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.sass$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
                exclude: /node_modules/i,
            },
            {
                test: /\.(png|svg|jpg|jpeg)$/i,
                type: "asset/resource",
                exclude: /node_modules/i,
            },
        ]
    }
}