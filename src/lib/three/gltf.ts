import { useGLTF } from '@react-three/drei';

// Décodeur DRACO servi depuis /public/draco (copié des libs de three) pour que
// les GLB compressés *.opt.glb (scripts/optimize-models.mjs) se décodent en
// local, sans dépendance CDN. Les chargements passent `useDraco = true`, ce qui
// pointe le DRACOLoader vers ce chemin.
useGLTF.setDecoderPath('/draco/');
