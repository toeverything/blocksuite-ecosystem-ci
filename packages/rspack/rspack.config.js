const rspack = require('@rspack/core');

/**
 * @type {import('@rspack/cli').Configuration}
 */
module.exports = {
  experiments: {
    rspackFuture: {
      disableApplyEntryLazily: true,
    },
  },
  context: __dirname,
  entry: {
    main: './src/main.ts',
  },
  devServer: {
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.json$/,
        use: [
          {
            loader: require.resolve('json-loader')
          }
        ],
        type: 'javascript/auto'
      }
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: './index.html',
    }),
  ],
};
