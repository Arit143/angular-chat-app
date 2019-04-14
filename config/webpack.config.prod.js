'use strict';

const webpackMerge            = require('webpack-merge');
const ngw                     = require('@ngtools/webpack');
const UglifyJsPlugin          = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano                 = require('cssnano');

const commonConfig            = require('./webpack.config.common');
const helpers                 = require('./helpers');

module.exports = webpackMerge(commonConfig, {
    mode: 'production',

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
        filename: '[hash].js',
        chunkFilename: '[id].[hash].chunk.js'
    },
    /**
     * Minify js files
     * Optimize css
     * Divide the build into different chunks 
     * Note: we have to use webpack-chunk-name in comments to make this work
     */
    optimization: {
        noEmitOnErrors: true,
        splitChunks: {
            chunks: 'all'
        },
        runtimeChunk: 'single',
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true
            }),

            new OptimizeCSSAssetsPlugin({
                cssProcessor: cssnano,
                cssProcessorOptions: {
                    discardComments: {
                        removeAll: true
                    }
                },
                canPrint: false
            })
        ]
    },
    /**
     * AOT plugin
     */
    module: {
        rules: [
            {
                test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
                loader: '@ngtools/webpack'
            }
        ]
    },

    plugins: [
        new ngw.AngularCompilerPlugin({
            tsConfigPath: helpers.root('tsconfig.aot.json'),
            entryModule: helpers.root('src', 'app', 'app.module#AppModule')
        })
    ]
});