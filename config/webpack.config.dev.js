'use strict';

const webpackMerge = require('webpack-merge');

const commonConfig = require('./webpack.config.common');
const helpers      = require('./helpers');

module.exports = webpackMerge(commonConfig, {
    mode: 'development',
    /**
     * Source maps 
     */
    devtool: 'cheap-module-eval-source-map',
    /**
     * Webpack output 
     * folder name
     * public path -> from where to serve
     * name of the bundle
     * id for chunks such that it can be mapped with the bundle
     */
    output: {
        path: helpers.root('dist'),
        publicPath: '/',
        filename: '[name].bundle.js',
        chunkFilename: '[id].chunk.js'
    },
    /**
     * Ask webpack not to emit on errors
     */
    optimization: {
        noEmitOnErrors: true
    },
    /**
     * Typescript loader for typescript errors
     * Angular templates for metadata of angular components
     * Angular router loader for loading different angular routes
     */
    module: {
        rules: [
            {
                test: /\.ts$/,
                loaders: [
                    {
                        loader: 'awesome-typescript-loader',
                        options: {
                            configFileName: helpers.root('tsconfig.json')
                        }
                    },
                    'angular2-template-loader',
                    'angular-router-loader'
                ],
                exclude: [/node_modules/]
            }
        ]
    },
    /**
     * Webpack dev server
     * More info https://webpack.js.org/configuration/dev-server/#root
     */
    devServer: {
        historyApiFallback: true,
        stats: 'minimal'
    }
});