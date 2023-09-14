/**
 * @type {import('@rspack/cli').Configuration}
 */
module.exports = {
  context: __dirname,
  entry: {
    main: './src/main.ts',
  },
  builtins: {
    html: [
      {
        template: './index.html',
      },
    ],
  },
}
