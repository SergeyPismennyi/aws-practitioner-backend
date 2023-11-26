const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const entryPoint = path.join(__dirname, 'src/index.ts');

esbuild.build({
  entryPoints: [entryPoint],
  outfile: 'dist/index.umd.js',
  format: 'cjs',
  platform: 'node',
  target: ['node14'],
  bundle: true,
  minify: true,
});

esbuild.build({
  entryPoints: [entryPoint],
  format: 'esm',
  outfile: 'dist/index.esm.js',
  platform: 'node',
  target: ['node14'],
  bundle: true,
  minify: false,
});
