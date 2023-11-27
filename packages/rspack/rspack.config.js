const rspack = require('@rspack/core');

/**
 * @type {import('@rspack/cli').Configuration}
 */
module.exports = {
  context: __dirname,
  entry: {
    main: './src/main.ts',
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  resolve: {
    fallback: {
      stream: require.resolve('readable-stream'),
    },
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: './index.html',
    }),
  ],
};
