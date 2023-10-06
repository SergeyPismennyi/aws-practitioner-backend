const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const functionsDir = `src/api`;
const outDir = `dist`;
const entryPoints = fs
  .readdirSync(path.join(__dirname, functionsDir))
  .map(entry => `${functionsDir}/${entry}/index.ts`);

esbuild.build({
  entryPoints,
  bundle: true,
  outdir: path.join(__dirname, outDir),
  outbase: functionsDir,
  format: 'cjs',
  platform: 'node',
  target: ['node14'],
  minify: process.argv.indexOf('-p') >= 0,
});
