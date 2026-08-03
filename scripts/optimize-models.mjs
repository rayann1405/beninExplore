// Compresses the raw photogrammetry scans in /public/modele/tier1 into
// runtime-friendly DRACO + WebP copies ("*.opt.glb") — the files the site
// actually loads via useGLTF. Run `npm run models:optimize` after dropping
// a new raw scan in /public/modele/tier1.
import { execSync } from 'child_process';
import { readdirSync } from 'fs';
import { resolve } from 'path';

const tier1 = resolve('public/modele/tier1');
const bin = resolve('node_modules/.bin/gltf-transform');

const files = readdirSync(tier1).filter((f) => f.endsWith('.glb') && !f.endsWith('.opt.glb'));

for (const file of files) {
  const inPath = resolve(tier1, file);
  const outPath = resolve(tier1, file.replace(/\.glb$/, '.opt.glb'));
  console.log(`— optimizing ${file} (DRACO + WebP textures)...`);
  execSync(
    `"${bin}" optimize "${inPath}" "${outPath}" ` +
      `--compress draco --texture-compress webp --texture-size 2048 ` +
      `--weld true --simplify true --simplify-error 0.004`,
    { stdio: 'inherit' }
  );
  console.log(`  ✓ ${file} -> ${outPath}`);
}
