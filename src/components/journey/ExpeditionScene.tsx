'use client';
import { Suspense } from 'react';
import { journey } from '@/lib/data/journey';
import { sectionPosition } from './scroll/computeCamera';
import { paletteFor } from './decor/palette';
import Particles from './decor/Particles';
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

      {journey.map((section, i) => {
        const palette = paletteFor(section.palette);
        const position = sectionPosition(i, journey.length);
        return (
          <group key={section.id}>
            <Particles palette={palette} position={[position[0], 0, position[2]]} radius={7} />
            {section.asset ? (
              <>
                <pointLight
                  position={[position[0], 5, 3]}
                  color={palette.light}
                  intensity={25}
                  distance={20}
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
