# Bénin Explore

Parcours 3D scrollé par sections — un monument ou un événement à la fois — construit avec Next.js, React Three Fiber, GSAP ScrollTrigger, Tailwind CSS et next-intl.

## Lancer le projet

```bash
npm install
npm run dev
```

Ouvrez `http://localhost:3000` pour voir le résultat.

## Principe

Le scroll natif du document pilote le parcours :

- des **sections DOM** empilées (une par étape, ~100vh chacune) créent la longueur du scroll ;
- un **canvas 3D fixe** en arrière-plan voyage le long d'une trajectoire : la caméra se déplace en douceur vers la cible de la section active ;
- le fond, le brouillard et la lumière ambiante **fondu en douceur** entre les palettes des sections voisines ;
- titre animé **lettre par lettre** à l'entrée de chaque section, menu latéral et indicateur de progression (étape / total) ;
- `prefers-reduced-motion` : transitions de caméra directes (pas de travelling), particules réduites et statiques, titres sans animation.

## Architecture data-driven

`src/lib/data/journey.ts` est la **source de vérité unique**. Nombre de sections, trajectoire de caméra, menu latéral et indicateur dérivent tous de `journey.length` — rien n'est codé en dur par section.

```ts
interface JourneySection {
  id: string;                    // ex: "amazone"
  type: 'monument' | 'evenement';
  name: string;
  tagline: string;
  description: string;
  location: string;
  dates?: string;                // uniquement evenement — récurrence annuelle
  fact?: string;
  asset?: { url: string; scale?: number; rotationY?: number; };
  palette: 'nuit-indigo' | 'latérite' | 'or' | 'palmier' | 'fete';
}
```

- Positions de caméra : calculées dans `src/components/journey/scroll/computeCamera.ts` (`sectionPosition(i, count)` + trajectoire lissée `sampleJourney(t)`). Espacement régulier le long de l'axe X (constante `JOURNEY_STEP`). Le cadrage est **adaptatif** : la caméra monte et recule selon la hauteur réelle du contenu de chaque section (bounding box du modèle mesurée au runtime, `scroll/sectionHeights.ts`) — un monument haut est cadré en entier, un petit est rapproché. Facteurs réglables : `CAMERA_HEIGHT_FACTOR` / `CAMERA_DISTANCE_FACTOR` / `LOOK_HEIGHT_FACTOR`.
- Palettes : `src/components/journey/decor/palette.ts` (couleur du fond, brouillard, lumière, accent, particules).
- Registre visuel : `monument` = sobre (totem, lumière posée) ; `evenement` = arène lumineuse ; `weloveya` (`fete`) = festif et coloré ; `vodun-days` (`nuit-indigo`) = nocturne posé, jamais folklorisé.

## Ajouter une nouvelle étape

1. Ouvrez `src/lib/data/journey.ts` et ajoutez une entrée dans le tableau `journey` (id unique, type, textes, palette). Sans `asset`, un **décor par défaut** cohérent avec la palette s'affiche automatiquement.
2. Si un modèle 3D est disponible : déposez le GLB optimisé dans `public/modele/` et renseignez `asset.url`.

Rien d'autre à modifier : les sections DOM, la trajectoire de caméra, le menu latéral et l'indicateur s'adaptent à `journey.length`.

## Assets 3D (scans photogrammétriques)

- Scans bruts : `public/modele/tier1/<id>.glb` (source uniquement, ignorés par git — un scan n'a pas d'échelle fiable par défaut).
- Runtime : `public/modele/tier1/<id>.opt.glb` (compressé DRACO + textures WebP), servi et décodé localement via `/public/draco/` (voir `src/lib/three/gltf.ts`).
- Compression : `npm run models:optimize`.
- `scale` règle la hauteur du modèle dans le monde (proportions entre étapes, ex: l'Amazone plus haute que Bio Guéra) ; le cadrage caméra s'y adapte automatiquement. Le modèle est auto-posé au sol (bounding box) quel que soit son origine.

> Convention de nommage : l'`id` de l'étape dans `journey.ts` doit correspondre au nom du fichier GLB (`<id>.opt.glb`) pour une maintenance simple.

## Ajouter une nouvelle locale (ex: Fon, Yoruba)

L'architecture est préparée pour l'ajout de nouvelles langues sans modification du code ou du routing complexe. Le contenu des étapes du parcours vit dans `journey.ts` (français) ; la coquille (navigation, épilogue) passe par `messages/<locale>.json`.

Pour activer par exemple le fon (`fon`) :
1. Créez un fichier `messages/fon.json` sur le même modèle que `fr.json`.
2. Ouvrez `i18n/routing.ts` et ajoutez `'fon'` dans le tableau `locales`.
3. Mettez à jour le composant `src/components/layout/LocaleSwitcher.tsx` pour ajouter l'option dans le menu déroulant :
```tsx
<option value="fon" className="bg-ink text-paper">FON</option>
```
