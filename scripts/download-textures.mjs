// Downloads CC0 PBR textures (ambientCG) into /public/textures/<zone>/ as
// `color.jpg` + `normal.jpg`, consumed by the terrain triplanar shader.
// Run `npm run textures:download`. If the network is unavailable, the app
// falls back to procedurally generated textures (see TerrainMaterial.ts).
import { execSync } from 'child_process';
import { mkdirSync, existsSync, readdirSync, renameSync, rmSync, writeFileSync } from 'fs';
import { resolve } from 'path';

// zone -> ambientCG material id (1K JPG packs, CC0).
const ZONES = {
  laterite: 'Ground107', // terre rouge / latérite
  savane: 'Ground080', // herbe dorée / savane
  foret: 'Ground037', // sol forestier / végétation
  sable: 'Ground054', // plage / sable
};

const outRoot = resolve('public/textures');

function unzip(zipPath, destDir) {
  // unzip may not be guaranteed everywhere; fall back to `ditto` on macOS.
  try {
    execSync(`unzip -o -q "${zipPath}" -d "${destDir}"`, { stdio: 'pipe' });
  } catch {
    execSync(`ditto -x -k "${zipPath}" "${destDir}"`, { stdio: 'pipe' });
  }
}

for (const [zone, id] of Object.entries(ZONES)) {
  const dir = resolve(outRoot, zone);
  mkdirSync(dir, { recursive: true });
  const tmp = resolve(dir, '_src');
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(tmp, { recursive: true });

  const zipPath = resolve(dir, `${id}.zip`);
  console.log(`— ${zone} (${id})`);
  execSync(`curl -sL "https://ambientcg.com/get?file=${id}_1K-JPG.zip" -o "${zipPath}" --max-time 120`, { stdio: 'inherit' });
  if (!existsSync(zipPath) || !existsSync(resolve(dir, `${id}.zip`))) {
    console.log(`  ✗ download failed for ${id}`);
    continue;
  }
  unzip(zipPath, tmp);

  const files = readdirSync(tmp);
  const color = files.find((f) => /_Color\.jpg$/i.test(f));
  const normal = files.find((f) => /_NormalGL\.jpg$/i.test(f));
  const roughness = files.find((f) => /_Roughness\.jpg$/i.test(f));
  for (const [name, src] of [
    ['color.jpg', color],
    ['normal.jpg', normal],
    ['roughness.jpg', roughness],
  ]) {
    if (src) renameSync(resolve(tmp, src), resolve(dir, name));
  }
  rmSync(zipPath, { force: true });
  rmSync(tmp, { recursive: true, force: true });
  console.log(`  ✓ color.jpg${normal ? ' + normal.jpg' : ''}${roughness ? ' + roughness.jpg' : ''}`);
}

writeFileSync(
  resolve(outRoot, 'SOURCES.txt'),
  'Textures CC0 — ambientCG (https://ambientcg.com) — 1K JPG packs:\n' +
    Object.entries(ZONES).map(([zone, id]) => `${zone}: ${id}`).join('\n') +
    '\n'
);
console.log('Done. Sources recorded in public/textures/SOURCES.txt');
