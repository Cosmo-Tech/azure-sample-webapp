import * as esbuild from 'esbuild';
import { polyfillNode } from 'esbuild-plugin-polyfill-node';

await esbuild.build({
  loader: { '.js': 'jsx', '.html': 'text', '.scss': 'text', '.svg': 'dataurl', '.png': 'dataurl' },
  entryPoints: ['src/index.js'],
  bundle: true,
  minify: true,
  sourcemap: true,
  // target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
  outfile: 'dist/main.js',
  plugins: [
    polyfillNode({
      // Options (optional)
    }),
  ],
});

// require('esbuild').buildSync();
