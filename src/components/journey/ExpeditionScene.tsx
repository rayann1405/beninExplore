'use client';
import { Suspense } from 'react';
import { journey } from '@/lib/data/journey';
import { sectionPosition } from './scroll/computeCamera';
import { paletteFor } from './decor/palette';
import Particles from './decor/Particles';
import Glow from './decor/Glow';
import AssetModel from './AssetModel';
import DefaultScene from './decor/DefaultScene';
import SceneAtmosphere from './scroll/SceneAtmosphere';
import JourneyCamera from './scroll/JourneyCamera';

// Contenu 3D du parcours : une étape par section de `journey`, placée le long
// de l'axe de la trajectoire. Section avec `asset` → scan photogrammétrique ;
// sans `asset` → décor par défaut cohérent avec la palette. Chaque étape est
// baignée d'un champ de particules à la couleur de sa palette.
export default function ExpeditionScene() {
  return (
    <>
      <SceneAtmosphere />
      <JourneyCamera />

      {/* Éclairage à dominante chaude : directionnelle or (relief, reflets)
          + hémisphère sable/terre (remplissage doux). La matière PBR du
          scan est révélée par la lumière, sans teinte imposée sur le mesh. */}
      <directionalLight position={[7, 10, 9]} intensity={1.5} color="#FFE1AE" />
      <directionalLight position={[-9, 5, -6]} intensity={0.35} color="#7F93B8" />
      <hemisphereLight args={['#C9B48A', '#5A2410', 0.65]} />

      {journey.map((section, i) => {
        const palette = paletteFor(section.palette);
        const position = sectionPosition(i, journey.length);
        return (
          <group key={section.id}>
            <Particles palette={palette} position={[position[0], 0, position[2]]} radius={7} />
            {section.asset ? (
              <>
                <Glow color={palette.light} position={[position[0], 2, position[2] - 1]} />
                <pointLight
                  position={[position[0], 5, 3]}
                  color={palette.light}
                  intensity={16}
                  distance={18}
                  decay={1.6}
                />
                <Suspense fallback={null}>
                  <AssetModel asset={section.asset} index={i} position={position} accent={palette.accent} />
                </Suspense>
              </>
            ) : (
              <DefaultScene section={section} palette={palette} position={position} />
            )}
          </group>
        );
      })}
    </>
  );
}
