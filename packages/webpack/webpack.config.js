// @ts-check
const HtmlWebpackPlugin = require('html-webpack-plugin')
/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  context: __dirname,
  mode: 'production',
  entry: {
    main: './src/main.js',
  },
  performance: { hints: false },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
  ],
}
