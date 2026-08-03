import { setRequestLocale, getTranslations } from 'next-intl/server';

export default async function AboutPage({ params }: { params: Promise<{locale: string}> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tCommon = await getTranslations('common');

  return (
    <div className="min-h-screen bg-background pt-32 px-8">
      <div className="max-w-3xl mx-auto text-paper">
        <h1 className="text-4xl font-display font-bold mb-8 text-laterite">
          {tCommon('about')} - Bénin Explore
        </h1>
        <div className="prose prose-invert prose-lg">
          <p className="font-sans leading-relaxed text-paper/80 mb-6">
            Bénin Explore est un projet expérimental visant à mettre en valeur le patrimoine
            naturel, culturel et historique du Bénin à travers une expérience web 3D immersive.
          </p>
          <p className="font-sans leading-relaxed text-paper/80 mb-6">
            Conçu pour offrir une approche esthétique et stylisée, ce site abandonne la
            photographie traditionnelle au profit de représentations géométriques et symboliques,
            s&apos;inspirant des motifs des tissus appliqués d&apos;Abomey et des paysages locaux.
          </p>
          <p className="font-sans leading-relaxed text-paper/80">
            Stack technique : Next.js, React Three Fiber, Tailwind CSS.
          </p>
        </div>
      </div>
    </div>
  );
}
