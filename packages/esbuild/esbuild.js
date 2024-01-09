import { build } from 'esbuild'
import htmlPlugin from '@chialab/esbuild-plugin-html'

await build({
  bundle: true,
  entryPoints: ['src/index.html'],
  outdir: 'dist',
  plugins: [htmlPlugin()],
  treeShaking: true,
  define: {
    'process.stdout.isTTY': 'false',
  },
})
