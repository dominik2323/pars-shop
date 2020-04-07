const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const base = require('./webpack.config.base');
const dotenv = require('dotenv-webpack');

module.exports = merge(base, {
  mode: 'development',
  output: {
    filename: 'static/js/main.js',
    chunkFilename: 'static/js/[name].chunk.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(sass|scss)$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              prependData: `$prefix: '';`,
            },
          },
        ],
      },
      {
        test: /\.(svg|png|jpg|jpeg|gif|mp3|ico)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'static/assets',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html'),
      // favicon: path.resolve(__dirname, 'public', 'favicon.ico'),
    }),
    new dotenv(),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    historyApiFallback: true,
    publicPath: '/',
    port: 3000,
  },
});
