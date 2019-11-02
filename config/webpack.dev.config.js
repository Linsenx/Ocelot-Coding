const config = require('./index.js')
const webpack = require('webpack')
const HtmlPlugin = require('html-webpack-plugin')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

module.exports = {
  entry: `${config.renderer}/index.js`,
  devServer: {
    hot: true,
    quiet: true,
    historyApiFallback: true
  },
  plugins: [
    new HtmlPlugin({
      template: './renderer/index.html',
      filename: 'index.html'
    }),
    new FriendlyErrorsWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
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
