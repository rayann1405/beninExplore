// Generates the stylized Tier 2 (villages) and Tier 3 (végétation/rochers)
// GLB assets into /public/modele/ — single-geometry, vertex-colored meshes
// so they can be GPU-instanced at runtime with drei <Instances>.
// Run `npm run models:generate`.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';

// GLTFExporter writes GLB via Blob + FileReader (browser APIs). Polyfill the
// FileReader part for Node.
if (!globalThis.FileReader) {
  class FileReaderPolyfill {
    result = null;
    onloadend = null;
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((ab) => {
        this.result = ab;
        if (typeof this.onloadend === 'function') this.onloadend({});
      });
    }
  }
  globalThis.FileReader = FileReaderPolyfill;
}

const rand = (a = 0, b = 1) => a + Math.random() * (b - a);

// Builds a single non-indexed geometry from colored parts: every vertex of a
// part gets that part's base color, with a subtle per-vertex tint for a
// stylized low-poly texture.
function colorizedMaterial(color) {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    vertexColors: true,
    roughness: 1,
    metalness: 0,
  });
}

function bake(parts) {
  const merged = [];
  for (const part of parts) {
    part.updateMatrixWorld(true);
    const geo = part.geometry.index ? part.geometry.toNonIndexed() : part.geometry.clone();
    const pos = geo.attributes.position;
    geo.deleteAttribute('normal');
    geo.deleteAttribute('uv');
    const colorAttr = new Float32Array(pos.count * 3);
    const c = new THREE.Color(part.material.color);
    for (let i = 0; i < pos.count; i++) {
      const tint = 0.85 + Math.random() * 0.3;
      colorAttr[i * 3] = c.r * tint;
      colorAttr[i * 3 + 1] = c.g * tint;
      colorAttr[i * 3 + 2] = c.b * tint;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colorAttr, 3));
    geo.applyMatrix4(part.matrixWorld);
    merged.push(geo);
  }
  const out = mergeGeometries(merged, false);
  out.computeVertexNormals();
  return out;
}

function mesh(geo, color) {
  const m = new THREE.Mesh(geo, colorizedMaterial(color));
  m.matrixAutoUpdate = true;
  return m;
}

// ---------------------------------------------------------------- tier 3

function makeTree() {
  const parts = [];
  const trunk = mesh(new THREE.CylinderGeometry(0.07, 0.1, 0.9, 6), '#6B4A2B');
  trunk.position.y = 0.45;
  parts.push(trunk);
  for (let i = 0; i < 3; i++) {
    const fol = mesh(new THREE.IcosahedronGeometry(0.3, 0), i === 1 ? '#2F6B4F' : '#3A7A56');
    fol.position.set((i - 1) * 0.14, 1.05 + i * 0.24, (i % 2 ? 1 : -1) * 0.08);
    fol.scale.set(1, 0.75, 1);
    parts.push(fol);
  }
  return bake(parts);
}

function makeCanopy() {
  // Dense, dark sacred-forest canopy (Kpassè).
  const parts = [];
  const trunk = mesh(new THREE.CylinderGeometry(0.16, 0.22, 1.6, 7), '#4E3820');
  trunk.position.y = 0.8;
  parts.push(trunk);
  for (let i = 0; i < 7; i++) {
    const fol = mesh(new THREE.IcosahedronGeometry(rand(0.3, 0.55), 0), '#1F4634');
    const ang = (i / 7) * Math.PI * 2 + rand(-0.3, 0.3);
    const r = rand(0.1, 0.35);
    fol.position.set(Math.cos(ang) * r, 1.6 + rand(0, 0.5), Math.sin(ang) * r);
    fol.scale.set(1, rand(0.75, 0.95), 1);
    parts.push(fol);
  }
  return bake(parts);
}

function makePalm() {
  const parts = [];
  const trunkMat = '#8A6A45';
  for (let i = 0; i < 8; i++) {
    const t = i / 7;
    const seg = mesh(new THREE.CylinderGeometry(0.075 * (1 - t * 0.35), 0.085, 0.2, 6), trunkMat);
    seg.position.y = 0.1 + i * 0.19;
    seg.rotation.z = t * 0.12 + (i % 2 ? -0.01 : 0.01);
    parts.push(seg);
  }
  const frondColor = '#2E7D4F';
  const n = 8;
  for (let i = 0; i < n; i++) {
    const frond = mesh(new THREE.ConeGeometry(0.055, 0.85, 4), i % 2 ? frondColor : '#3A8F5C');
    frond.rotation.set(Math.PI / 2 - 0.35, 0, (i / n) * Math.PI * 2);
    frond.position.y = 1.55;
    frond.scale.set(0.5, 1, 1);
    parts.push(frond);
  }
  return bake(parts);
}

function makeRock() {
  const geo = new THREE.IcosahedronGeometry(0.5, 1);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    const r = rand(0.82, 1.18);
    pos.setXYZ(i, v.x * r, Math.abs(v.y) * r * 0.72, v.z * r);
  }
  geo.computeVertexNormals();
  const rock = mesh(geo, '#7E7468');
  rock.position.y = 0.18;
  return bake([rock]);
}

// ---------------------------------------------------------------- tier 2

function makeTataSomba() {
  const parts = [];
  const wallColor = '#B07A4F';
  const tower = mesh(new THREE.CylinderGeometry(0.24, 0.34, 0.8, 8), wallColor);
  tower.position.y = 0.4;
  parts.push(tower);
  const top = mesh(new THREE.CylinderGeometry(0.15, 0.2, 0.55, 8), wallColor);
  top.position.y = 1.05;
  parts.push(top);
  // little granary on stilts
  const granary = mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.3, 6), '#9A6A42');
  granary.position.set(0.42, 0.55, 0.1);
  granary.rotation.y = 0.4;
  parts.push(granary);
  return bake(parts);
}

function makePilotis() {
  const parts = [];
  const wood = '#7A5A38';
  for (const [dx, dz] of [
    [0.22, 0.18],
    [0.22, -0.18],
    [-0.22, 0.18],
    [-0.22, -0.18],
  ]) {
    const post = mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.5, 5), wood);
    post.position.set(dx, 0.25, dz);
    parts.push(post);
  }
  const platform = mesh(new THREE.BoxGeometry(0.62, 0.06, 0.52), wood);
  platform.position.y = 0.5;
  parts.push(platform);
  const body = mesh(new THREE.BoxGeometry(0.5, 0.36, 0.4), '#C09A68');
  body.position.y = 0.7;
  parts.push(body);
  const roof = mesh(new THREE.ConeGeometry(0.44, 0.32, 4), '#43543E');
  roof.position.y = 1.04;
  roof.rotation.y = Math.PI / 4;
  parts.push(roof);
  return bake(parts);
}

function makeAfroBresilien() {
  const parts = [];
  const pastel = ['#E8C9A0', '#D9B8A8', '#B9C8D9', '#E8D0B0'][Math.floor(Math.random() * 4)];
  const body = mesh(new THREE.BoxGeometry(0.56, 0.42, 0.46), pastel);
  body.position.y = 0.21;
  parts.push(body);
  const roof = mesh(new THREE.ConeGeometry(0.5, 0.38, 4), '#B0552A');
  roof.position.y = 0.6;
  roof.rotation.y = Math.PI / 4;
  parts.push(roof);
  // parapet
  const parapet = mesh(new THREE.BoxGeometry(0.6, 0.12, 0.5), '#D8D8D0');
  parapet.position.y = 0.1;
  parts.push(parapet);
  return bake(parts);
}

// ---------------------------------------------------------------- export

const ASSETS = {
  'tier3/arbre.glb': makeTree,
  'tier3/canopee.glb': makeCanopy,
  'tier3/palmier.glb': makePalm,
  'tier3/rocher.glb': makeRock,
  'tier2/tata-somba.glb': makeTataSomba,
  'tier2/pilotis.glb': makePilotis,
  'tier2/afro-bresilien.glb': makeAfroBresilien,
};

const exporter = new GLTFExporter();
const outRoot = resolve('public/modele');

for (const [rel, build] of Object.entries(ASSETS)) {
  const geometry = build();
  const scene = new THREE.Scene();
  const root = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 })
  );
  root.name = rel.split('/')[1].replace('.glb', '');
  scene.add(root);

  const outPath = resolve(outRoot, rel);
  mkdirSync(resolve(outRoot, rel.split('/')[0]), { recursive: true });
  const glb = await exporter.parseAsync(scene, { binary: true });
  writeFileSync(outPath, Buffer.from(glb));
  const count = geometry.attributes.position.count;
  console.log(`✓ ${rel} (${count.toLocaleString()} sommets)`);
}
