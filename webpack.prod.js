// node modules
const merge = require('webpack-merge');
const moment = require('moment');
const webpack = require('webpack');

// webpack plugins
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin');

// config files
const common = require('./webpack.common.js');
const settings = require('./webpack.settings.js');

// Configure file banner
function configureBanner() {
  return {
    banner: [
      '/*!',
      ` * @project        ${settings.name}`,
      ` * @build          ${moment().format('llll')} ET`,
      ` * @copyright      Copyright (c) ${moment().format('YYYY')} ${
        settings.copyright
      }`,
      ' *',
      ' */',
      '',
    ].join('\n'),
    raw: true,
  };
}

// Configure Bundle Analyzer
function configureBundleAnalyzer() {
  return {
    analyzerMode: 'static',
    reportFilename: 'vtk-bundle.html',
    openAnalyzer: settings.options.openAnalyzer(),
  };
}

// Configure Html webpack
// function configureHtml() {
//   return {
//     templateContent: '',
//     filename: 'webapp.html',
//     inject: false,
//   };
// }

// Configure terser
function configureTerser() {
  return {
    cache: true,
    parallel: true,
    sourceMap: true,
  };
}

// Configure optimization
function configureOptimization() {
  return {
    minimizer: [new TerserPlugin(configureTerser())],
  };
}

// Production module exports
module.exports = [
  merge(common.baseConfig, {
    mode: 'production',
    devtool: 'source-map',
    optimization: configureOptimization(),
    plugins: [
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.BannerPlugin(configureBanner()),
      new BundleAnalyzerPlugin(configureBundleAnalyzer()),
    ],
  }),
];
