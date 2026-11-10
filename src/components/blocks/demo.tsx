'use client';

import { useEffect, useState } from 'react';
import ScrollExpandMedia from '@/components/blocks/ScrollExpandMedia';

interface MediaAbout {
  overview: string;
  conclusion: string;
}

interface MediaContent {
  src: string;
  poster?: string;
  background: string;
  title: string;
  date: string;
  scrollToExpand: string;
  about: MediaAbout;
}

interface MediaContentCollection {
  [key: string]: MediaContent;
}

// Demo de référence du composant ScrollExpandMedia, alimentée par les images
// béninoises locales (aucune dépendance réseau). Non routée.
const sampleMediaContent: MediaContentCollection = {
  video: {
    src: '/images/porte_du_non_retour.jpeg',
    background: '/images/palais_abomey..png',
    title: 'Immersion Bénin',
    date: 'Patrimoine vivant',
    scrollToExpand: 'Défiler pour agrandir',
    about: {
      overview:
        'Cette démo illustre le composant ScrollExpandMedia avec une image : au fil du scroll, le média s’agrandit pour occuper tout l’écran, créant une expérience immersive.',
      conclusion:
        'Le composant fonctionne aussi bien avec des images que des vidéos, au service d’une narration patrimoniale moderne.',
    },
  },
  image: {
    src: '/images/statue_amazone.jpg',
    background: '/images/bio-guera-1.jpg',
    title: 'Monuments du Bénin',
    date: 'Cotonou · Abomey · Ouidah',
    scrollToExpand: 'Défiler pour agrandir',
    about: {
      overview:
        'Une démo en mode image : les monuments béninois s’affichent un à un, révélés par le scroll.',
      conclusion:
        'Une approche élégante pour présenter chaque étape du parcours sans surcharge visuelle.',
    },
  },
};

const MediaContent = ({ mediaType }: { mediaType: 'video' | 'image' }) => {
  const currentMedia = sampleMediaContent[mediaType];

  return (
    <div className='mx-auto max-w-4xl'>
      <h2 className='mb-6 text-3xl font-bold text-paper'>À propos</h2>
      <p className='mb-8 text-lg text-paper'>{currentMedia.about.overview}</p>
      <p className='mb-8 text-lg text-paper'>{currentMedia.about.conclusion}</p>
    </div>
  );
};

export const VideoExpansion = () => {
  const mediaType = 'video';
  const currentMedia = sampleMediaContent[mediaType];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className='min-h-screen'>
      <ScrollExpandMedia
        mediaType={mediaType}
        mediaSrc={currentMedia.src}
        bgImageSrc={currentMedia.background}
        title={currentMedia.title}
        date={currentMedia.date}
        scrollToExpand={currentMedia.scrollToExpand}
      >
        <MediaContent mediaType={mediaType} />
      </ScrollExpandMedia>
    </div>
  );
};

export const ImageExpansion = () => {
  const mediaType = 'image';
  const currentMedia = sampleMediaContent[mediaType];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className='min-h-screen'>
      <ScrollExpandMedia
        mediaType={mediaType}
        mediaSrc={currentMedia.src}
        bgImageSrc={currentMedia.background}
        title={currentMedia.title}
        date={currentMedia.date}
        scrollToExpand={currentMedia.scrollToExpand}
      >
        <MediaContent mediaType={mediaType} />
      </ScrollExpandMedia>
    </div>
  );
};

const Demo = () => {
  const [mediaType, setMediaType] = useState<'video' | 'image'>('image');
  const currentMedia = sampleMediaContent[mediaType];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [mediaType]);

  return (
    <div className='min-h-screen'>
      <div className='fixed top-4 right-4 z-50 flex gap-2'>
        <button
          onClick={() => setMediaType('video')}
          className={`cursor-pointer rounded-lg px-4 py-2 ${
            mediaType === 'video'
              ? 'bg-white text-black'
              : 'border border-white/30 bg-black/50 text-white'
          }`}
        >
          Video
        </button>

        <button
          onClick={() => setMediaType('image')}
          className={`cursor-pointer rounded-lg px-4 py-2 ${
            mediaType === 'image'
              ? 'bg-white text-black'
              : 'border border-white/30 bg-black/50 text-white'
          }`}
        >
          Image
        </button>
      </div>

      <ScrollExpandMedia
        key={mediaType}
        mediaType={mediaType}
        mediaSrc={currentMedia.src}
        bgImageSrc={currentMedia.background}
        title={currentMedia.title}
        date={currentMedia.date}
        scrollToExpand={currentMedia.scrollToExpand}
      >
        <MediaContent mediaType={mediaType} />
      </ScrollExpandMedia>
    </div>
  );
};

export default Demo;
