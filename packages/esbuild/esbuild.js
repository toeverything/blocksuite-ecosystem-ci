import { build } from 'esbuild'
import { polyfillNode } from 'esbuild-plugin-polyfill-node'
import htmlPlugin from '@chialab/esbuild-plugin-html'

await build({
  bundle: true,
  entryPoints: ['src/index.html'],
  outdir: 'dist',
  plugins: [polyfillNode(), htmlPlugin()],
  treeShaking: true,
  define: {
    'process.stdout.isTTY': 'false',
  },
})
