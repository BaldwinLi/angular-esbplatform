const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
    entry: {
        app: './src/main.ts',
    },

    output: {
        filename: './src/[name]_bundle.js',
    },

    resolve: {
        extensions: [".js", ".ts"]
    },
    plugins: [
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./manifest.json'),
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new ExtractTextPlugin("styles.css"),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: false
            }
        })
    ],
    module: {
        rules: [
            { test: /\.ts$/, loader: 'ts-loader' },
            {
                test: /\.css$/,
                loader: ['style-loader', 'css-loader']
            },
            {
                test: /\.js$/,
                loader: ['jsx-loader']
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                loader: ['url-loader']
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: "source-map-loader"
            },
            {
                enforce: 'pre',
                test: /\.ts$/,
                use: "source-map-loader"
            },
            {
                enforce: 'pre',
                test: /\.tsx?$/,
                use: "source-map-loader"
            }
        ]
    },
    devServer: { inline: true },
    devtool: 'inline-source-map',
};