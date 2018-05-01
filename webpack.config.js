/*
 * Created on Mon Apr 30 2018
 *
 * Copyright (c) 2018 Your Company
 */

// var HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: [
        './src/index.js'
    ],
    output: {
        filename: 'bundle.js',
    },
    devServer: {
        host: '0.0.0.0',
        port: 9100
    },
    devtool: 'inline-source-map',
    mode: 'development',
    // plugins: [new HtmlWebpackPlugin()]
}
