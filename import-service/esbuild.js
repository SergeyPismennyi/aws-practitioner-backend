const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const functionsDir = `src/handlers`;
const outDir = `dist`;
const entryPoints = fs
  .readdirSync(path.join(__dirname, functionsDir))
  .map(entry => `${functionsDir}/${entry}/index.ts`);

esbuild.build({
  entryPoints,
  entryNames: 'handlers/[dir]',
  outdir: path.join(__dirname, outDir),
  outbase: functionsDir,
  format: 'cjs',
  platform: 'node',
  target: ['node14'],
  bundle: true,
  minify: true,
});
