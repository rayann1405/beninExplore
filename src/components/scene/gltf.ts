import { useGLTF } from '@react-three/drei';

// DRACO decoder served from /public/draco (copied from three's libs) so the
// compressed * .opt.glb scans (scripts/optimize-models.mjs) decode locally,
// without any CDN dependency. Loads pass `useDraco = true`, which points the
// DRACOLoader at this path.
useGLTF.setDecoderPath('/draco/');
