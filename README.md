# Bénin Explore

Projet d'exploration 3D stylisée du Bénin, construit avec Next.js, React Three Fiber, Tailwind CSS et next-intl.

## Lancer le projet

```bash
npm install
npm run dev
```

Ouvrez `http://localhost:3000` pour voir le résultat.

## Pipeline des assets 3D

La carte charge trois familles d'assets, selon le `tier` déclaré dans `lib/data/poi.ts` :

| Tier | Contenu | Source | Emplacement |
| --- | --- | --- | --- |
| 1 | Monuments (scans photogrammétriques) | GLB client | `public/modele/tier1/` |
| 2 | Villages (tata-somba, pilotis, afro-brésilien) | GLB généré | `public/modele/tier2/` |
| 3 | Végétation / rochers | GLB généré | `public/modele/tier3/` |

- **Tier 2/3** : régénérés par `npm run models:generate` — ne les éditez pas à la main.
- **Textures du sol** : téléchargées par `npm run textures:download` dans `public/textures/<zone>/` (color/normal/roughness). Un fallback procédural prend le relais si un fichier manque.

### Déposer un nouveau monument (tier 1)

1. Placez le scan brut en **GLB** dans `public/modele/tier1/<id>.glb` (source uniquement, jamais servie).
2. Compressez : `npm run models:optimize` → génère `<id>.opt.glb` (DRACO + textures WebP) + copie les décodeurs dans `public/draco/`.
3. Dans `lib/data/poi.ts`, vérifiez pour ce `poi` :
   - `asset: { tier: 1, url: '/modele/tier1/<id>.opt.glb', scale, rotationY }` — l'URL **doit** se terminer par `.opt.glb` pour être servie (sinon un placeholder s'affiche) ;
   - `camera.offset` / `camera.lookAtOffset` (cadrage de repos, unités monde) ;
   - `pathOrder` (position dans le parcours nord→sud).
4. Réglez `scale` / `rotationY` au dev : le modèle est auto-posé sur le terrain (bounding box), l'échelle est non métrique selon le scan.
5. `npm run lint && npm run build` puis vérifiez visuellement l'arrêt correspondant.

## Ajouter un nouveau lieu

1. Ouvrez `lib/data/poi.ts`.
2. Ajoutez un nouvel objet dans le tableau `poiData` avec un `id` unique, sa `region`, sa `category`, ses coordonnées `coords`, son `pathOrder` et son bloc `asset` (voir ci-dessus).
3. Ouvrez `messages/fr.json` et `messages/en.json` et ajoutez les traductions correspondantes dans le bloc `poi` en utilisant l'ID comme clé :
```json
"mon-nouvel-id": {
  "name": "Nom du lieu",
  "tagline": "Courte description",
  "description": "Description détaillée...",
  "fact": "Fait marquant"
}
```

Rien d'autre à modifier, le lieu apparaîtra automatiquement sur la carte et sa page dédiée sera générée.

## Ajouter une nouvelle locale (ex: Fon, Yoruba)

L'architecture est préparée pour l'ajout de nouvelles langues sans modification du code ou du routing complexe.

Pour activer par exemple le fon (`fon`) :
1. Créez un fichier `messages/fon.json` sur le même modèle que `fr.json`.
2. Ouvrez `i18n/routing.ts` et ajoutez `'fon'` dans le tableau `locales`.
3. Mettez à jour le composant `src/components/layout/LocaleSwitcher.tsx` pour ajouter l'option dans le menu déroulant :
```tsx
<option value="fon" className="bg-ink text-paper">FON</option>
```

Le reste (génération statique des pages lieux, middleware) s'adaptera automatiquement.
