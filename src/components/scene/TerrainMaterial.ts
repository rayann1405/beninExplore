import * as THREE from 'three';

// Triplanar PBR terrain material built on MeshStandardMaterial via
// onBeforeCompile, so it keeps the full standard pipeline (IBL from the
// Environment, shadows, specular) while replacing the albedo map with a
// zone-blended triplanar sample of the four CC0 textures.
//
// Blend model (world latitude northExtent = ~21):
//   south (lat≈0)  -> forest floor, fading to sand on the coast & Nokoué
//   centre (lat≈0.5) -> golden savanna
//   north (lat≈1)  -> red laterite
export function createTerrainPbrMaterial(
  textures: {
    laterite: THREE.Texture;
    savane: THREE.Texture;
    foret: THREE.Texture;
    sable: THREE.Texture;
  },
  northExtent: number,
  lakeCenter: [number, number],
  deepColor: THREE.Color = new THREE.Color('#061019')
) {
  const texScale = 2.4;
  const material = new THREE.MeshStandardMaterial({
    roughness: 0.9,
    metalness: 0.0,
  });

  // Dummy 1x1 map enables the USE_MAP branch we then fully replace.
  const dummy = new THREE.Texture();
  material.map = dummy;

  for (const t of Object.values(textures)) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 4;
  }

  const uniforms = {
    uTexLaterite: { value: textures.laterite },
    uTexSavane: { value: textures.savane },
    uTexForet: { value: textures.foret },
    uTexSable: { value: textures.sable },
    uTexScale: { value: texScale },
    uNorthExtent: { value: northExtent },
    uLakeCenter: { value: new THREE.Vector2(lakeCenter[0], -lakeCenter[1]) },
    uLakeInner: { value: 0.5 },
    uLakeOuter: { value: 1.5 },
    uCoastWidth: { value: 0.07 },
    uDeepColor: { value: deepColor },
  };

  material.onBeforeCompile = (shader) => {
    shader.uniforms = { ...shader.uniforms, ...uniforms };

    shader.vertexShader =
      'varying vec3 vWorldPos;\n' +
      shader.vertexShader.replace(
        '#include <begin_vertex>',
        'vec4 wp = modelMatrix * vec4(position, 1.0);\n  vWorldPos = wp.xyz;\n#include <begin_vertex>'
      );

    shader.fragmentShader =
      `
      varying vec3 vWorldPos;
      uniform sampler2D uTexLaterite;
      uniform sampler2D uTexSavane;
      uniform sampler2D uTexForet;
      uniform sampler2D uTexSable;
      uniform float uTexScale;
      uniform float uNorthExtent;
      uniform vec2 uLakeCenter;
      uniform float uLakeInner;
      uniform float uLakeOuter;
      uniform float uCoastWidth;
      uniform vec3 uDeepColor;

      vec3 triplanarColor(sampler2D tex, vec3 p, vec3 n) {
        vec3 b = pow(abs(n), vec3(4.0));
        b /= max(b.x + b.y + b.z, 1e-4);
        vec3 c = texture2D(tex, p.xz * uTexScale).rgb * b.z;
        c += texture2D(tex, p.xy * uTexScale).rgb * b.y;
        c += texture2D(tex, p.zy * uTexScale).rgb * b.x;
        return c;
      }
    ` + shader.fragmentShader.replace(
        '#include <map_fragment>',
        `
        vec3 tpN = normalize(vNormal);
        vec3 albedo = triplanarColor(uTexForet, vWorldPos, tpN);

        float lat = clamp(-vWorldPos.z / uNorthExtent, 0.0, 1.0);
        vec3 mid = mix(
          albedo,
          triplanarColor(uTexSavane, vWorldPos, tpN),
          smoothstep(0.12, 0.4, lat)
        );
        albedo = mix(
          mid,
          triplanarColor(uTexLaterite, vWorldPos, tpN),
          smoothstep(0.45, 0.75, lat)
        );

        // Sand: coastal band in the far south + shores of Lake Nokoué.
        float sandMask = smoothstep(uCoastWidth, 0.0, lat);
        float distLake = distance(vWorldPos.xz, uLakeCenter);
        sandMask = max(sandMask, 1.0 - smoothstep(uLakeInner, uLakeOuter, distLake));
        albedo = mix(albedo, triplanarColor(uTexSable, vWorldPos, tpN), clamp(sandMask, 0.0, 1.0) * 0.85);

        // Below-water vertices fade to deep ink so the coastline reads as
        // a drop-off rather than a flat cutout.
        float submerged = smoothstep(0.0, -1.0, vWorldPos.y);
        albedo = mix(albedo, uDeepColor, submerged * 0.85);

        vec4 sampledDiffuseColor = vec4(albedo, 1.0);
        diffuseColor *= sampledDiffuseColor;
        `
      );
  };

  // Keep a reference so we can mark the material dirty after onBeforeCompile.
  (material as THREE.MeshStandardMaterial & {terrainUniforms?: Record<string, THREE.IUniform>}).terrainUniforms = uniforms;
  material.needsUpdate = true;
  return material;
}
