const vendors = [
    "@angular/animations",
    "@angular/common",
    "@angular/compiler",
    "@angular/core",
    "@angular/forms",
    "@angular/http",
    "@angular/platform-browser",
    "@angular/platform-browser-dynamic",
    "@angular/router",
    "@ngui/datetime-picker",
    "core-js",
    "echarts",
    "jquery",
    "moment",
    "reflect-metadata",
    "rxjs",
    "angular2-layer",
    "ng2-combobox",
    "zone.js",
    "es6-promise"
];

const webpack = require('webpack');
const path = require('path');

module.exports = {
    output: {
        path: path.resolve(__dirname, "src"),
        filename: '[name]_bundle.js',
        library: '[name]_bundle',
    },
    entry: {
        "lib": vendors,
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    plugins: [
        new webpack.DllPlugin({
            path: 'manifest.json',
            name: '[name]_bundle',
            context: __dirname,
        }),
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
        ]
    },
};