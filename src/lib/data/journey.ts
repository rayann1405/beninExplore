// Sections du parcours scrollé — source de vérité unique de l'expérience.
// Ajouter une étape = ajouter une entrée ici : les sections DOM, la trajectoire
// de caméra, le menu latéral et l'indicateur de progression dérivent tous de
// `journey.length`. Ne jamais dupliquer de logique par section ailleurs.

export type JourneyType = 'monument' | 'evenement';
export type JourneyPalette = 'nuit-indigo' | 'latérite' | 'or' | 'palmier' | 'fete';

export interface JourneyAsset {
  // Chemin public vers un GLB optimisé (DRACO), ex: /modele/tier1/amazone.opt.glb
  url: string;
  // Échelle du scan photogrammétrique : ajustée à la taille réelle (voir README).
  scale?: number;
  rotationY?: number;
}

export interface JourneySection {
  id: string;
  type: JourneyType;
  name: string;
  tagline: string;
  description: string;
  location: string;
  // Uniquement pour type "evenement" — dates récurrentes annuelles.
  dates?: string;
  fact?: string;
  asset?: JourneyAsset;
  palette: JourneyPalette;
}

export const journey: JourneySection[] = [
  {
    id: 'amazone',
    type: 'monument',
    name: "Statue de l'Amazone",
    tagline: 'Hommage aux guerrières Agoodjié',
    description:
      "Statue monumentale de bronze de 30 mètres de haut (environ 150 tonnes), inaugurée le 30 juillet 2022 sur l'esplanade des Amazones à Cotonou, face à l'océan Atlantique. Œuvre du sculpteur Li Xiangqun, elle rend hommage aux Agoodjié — les Amazones du Dahomey, régiment militaire entièrement féminin actif jusqu'à la fin du XIXe siècle.",
    location: 'Cotonou',
    fact: "Deuxième plus grande statue d'Afrique, après la Renaissance africaine de Dakar",
    palette: 'latérite',
    asset: { url: '/modele/tier1/amazone.opt.glb', scale: 7.5 },
  },
  {
    id: 'bio-guera',
    type: 'monument',
    name: 'Monument Bio Guéra',
    tagline: 'Figure de la résistance à la colonisation',
    description:
      "Statue équestre de bronze, cuivre et acier (environ 7 mètres de haut, 13 tonnes), érigée au rond-point de l'aéroport international de Cotonou et inaugurée le 30 juillet 2022. Elle honore Bio Guéra, prince du royaume bariba et chef de guerre wasangari, figure de la résistance face à la conquête coloniale française à la fin du XIXe siècle.",
    location: 'Cotonou',
    fact: 'Figure de la résistance bariba, mort en 1916 près de Bembéréké',
    palette: 'or',
    asset: { url: '/modele/tier1/bio-guera.opt.glb', scale: 4 },
  },
  {
    id: 'behanzin',
    type: 'monument',
    name: 'Statue du roi Béhanzin',
    tagline: 'Le dernier roi rebelle du Danxomè',
    description:
      "Statue du roi Béhanzin (1845–1906), dernier souverain indépendant du Danxomè, érigée à Abomey, ancienne capitale du royaume. Proclamé roi en 1889, il organise une résistance farouche à la conquête coloniale française pendant les guerres de 1890 et 1892–1894, avant d'être capturé et exilé à la Martinique puis en Algérie, où il meurt en 1906. Symbole du refus de la soumission, sa figure est célébrée dans tout le Bénin.",
    location: 'Abomey',
    fact: 'Son trône et ses reliques ont été restitués au Bénin en 2021',
    palette: 'latérite',
    asset: { url: '/modele/tier1/behanzin_statut.opt.glb', scale: 6 },
  },
  {
    id: 'porte-non-retour',
    type: 'monument',
    name: 'Porte du Non-Retour',
    tagline: 'Le seuil de la mémoire',
    description:
      "Sur la plage d'Ouidah, l'arc monumental de la Porte du Non-Retour commémore le départ des captifs vers les Amériques pendant la traite transatlantique. Lieu de mémoire et de recueillement, il clôt la Route des Esclaves longue de plus de trois kilomètres.",
    location: 'Ouidah',
    fact: "Bout de la Route des Esclaves, face à l'océan",
    palette: 'nuit-indigo',
  },
  {
    id: 'vodun-days',
    type: 'evenement',
    name: 'Vodun Days',
    tagline: 'La célébration nationale du vodun',
    dates: '10 janvier, chaque année',
    description:
      "Chaque 10 janvier, le Bénin célèbre la fête nationale du vodun, principalement à Ouidah, berceau du culte. Cérémonies, défilés et rituels rassemblent pratiquants, curieux et diaspora autour d'une tradition vivante.",
    location: 'Ouidah',
    fact: 'Journée nationale des religions endogènes',
    palette: 'nuit-indigo',
  },
  {
    id: 'weloveya',
    type: 'evenement',
    name: 'We Love Ya',
    tagline: 'Le grand festival afrobeat',
    dates: 'fin décembre, chaque année',
    description:
      "Festival de musique afrobeat organisé chaque fin d'année à Cotonou, We Love Ya réunit les scènes béninoises et internationales pour plusieurs jours de concerts, de danses et de célébration de la culture ouest-africaine.",
    location: 'Cotonou',
    fact: 'Le rendez-vous musical de fin d’année',
    palette: 'fete',
  },
];
