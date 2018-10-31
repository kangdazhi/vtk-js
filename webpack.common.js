// node modules
const path = require('path');

// webpack plugins
const WebpackNotifierPlugin = require('webpack-notifier');

// config files
const pkg = require('./package.json');
const settings = require('./webpack.settings.js');

// Configure Entries
const configureEntries = () => {
  const entries = {};
  const keys = Object.keys(settings.entries);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = settings.entries[key];
    entries[key] = path.resolve(__dirname, settings.paths.src.base + value);
  }
  return entries;
};

// Configure vtk rules
function configureVtkRules() {
  return [
    {
      test: /\.glsl$/i,
      loader: 'shader-loader',
    },
    {
      test: /\.js$/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      ],
    },
    {
      test: /\.css$/,
      exclude: /\.module\.css$/,
      use: [
        { loader: 'style-loader' },
        { loader: 'css-loader' },
        { loader: 'postcss-loader' },
      ],
    },
    {
      test: /\.module\.css$/,
      use: [
        { loader: 'style-loader' },
        {
          loader: 'css-loader',
          options: {
            localIdentName: '[name]-[local]_[sha512:hash:base64:5]',
            modules: true,
          },
        },
        { loader: 'postcss-loader' },
      ],
    },
    {
      test: /\.svg$/,
      use: [{ loader: 'raw-loader' }],
    },
    {
      test: /\.worker\.js$/,
      use: [
        { loader: 'worker-loader', options: { inline: true, fallback: false } },
      ],
    },
  ];
}

// The base webpack config
const baseConfig = {
  name: pkg.name,
  entry: configureEntries(),
  output: {
    path: path.resolve(__dirname, settings.paths.dist.base),
    publicPath: settings.urls.publicPath,
    libraryTarget: 'umd',
  },
  resolve: {
    alias: {
      'vtk.js': __dirname,
    },
  },
  module: {
    rules: configureVtkRules(),
  },
  plugins: [
    new WebpackNotifierPlugin({
      title: 'Webpack - vtk.js',
      excludeWarnings: true,
      alwaysNotify: true,
    }),
  ],
};

// Common module exports
module.exports = {
  baseConfig,
};
