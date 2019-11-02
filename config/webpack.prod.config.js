const config = require('./index.js')
const webpack = require('webpack')
const HtmlPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = {
  entry: `${config.renderer}/index.js`,
  devtool: false,
  output: {
    filename: '[name].bundle.js',
    path: config.dist
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new CopyPlugin([{ from: `${config.base}/package.json`, to: config.dist }]),
    new HtmlPlugin({
      template: `${config.renderer}/index.html`,
      filename: 'index.html'
    }),
    new webpack.NamedModulesPlugin(),
    new MonacoWebpackPlugin(),
    new BundleAnalyzerPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader' // creates style nodes from JS strings
          },
          {
            loader: 'css-loader' // translates CSS into CommonJS
          },
          {
            loader: 'less-loader', // compiles Less to CSS
            options: {
              javascriptEnabled: true
            }
          }
        ]
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
}
