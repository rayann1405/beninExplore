import { setRequestLocale, getTranslations } from 'next-intl/server';

export default async function AboutPage({ params }: { params: Promise<{locale: string}> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tCommon = await getTranslations('common');

  return (
    <div className="min-h-screen bg-background px-8 pt-36">
      <div className="mx-auto max-w-3xl text-paper">
        <h1 className="mb-4 font-display text-4xl leading-tight text-paper md:text-5xl">
          {tCommon('about')} — <span className="text-gold">Bénin Explore</span>
        </h1>
        <div className="mb-8 flex items-center gap-3">
          <span className="inline-block h-1.5 w-1.5 rotate-45 bg-gold" />
          <span className="h-px w-24 bg-gold/50" />
        </div>
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
