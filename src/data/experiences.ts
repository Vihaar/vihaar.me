export interface Experience {
  slug: string;
  title: string;
  subtitle: string;
  category: 'family' | 'adventure' | 'personal' | 'work';
  route: string;
  colors: { primary: string; secondary: string; bg: string; text: string };
  gameTitle: string;
  mapPosition: { x: number; y: number };
}

export const experiences: Experience[] = [
  {
    slug: 'family',
    title: 'Family',
    subtitle: 'The heart of everything',
    category: 'family',
    route: '/family',
    colors: { primary: '#dc2626', secondary: '#f87171', bg: '#1a0a0a', text: '#fca5a5' },
    gameTitle: 'Pass the Love',
    mapPosition: { x: 50, y: 50 },
  },
  {
    slug: 'skiing',
    title: 'Skiing',
    subtitle: 'Carving through the cold',
    category: 'adventure',
    route: '/skiing',
    colors: { primary: '#e0f2fe', secondary: '#7dd3fc', bg: '#f0f9ff', text: '#0c4a6e' },
    gameTitle: 'Downhill Dodge',
    mapPosition: { x: 20, y: 15 },
  },
  {
    slug: 'boxing',
    title: 'Boxing',
    subtitle: '135 lbs of heart',
    category: 'personal',
    route: '/boxing',
    colors: { primary: '#ef4444', secondary: '#991b1b', bg: '#0a0a0a', text: '#fca5a5' },
    gameTitle: 'Punch Out',
    mapPosition: { x: 80, y: 25 },
  },
  {
    slug: 'petition',
    title: 'The Petition',
    subtitle: 'Paper plates over styrofoam',
    category: 'personal',
    route: '/petition',
    colors: { primary: '#f59e0b', secondary: '#d97706', bg: '#1a1408', text: '#fde68a' },
    gameTitle: 'Collect Signatures',
    mapPosition: { x: 15, y: 70 },
  },
  {
    slug: 'marathon',
    title: 'Ann Arbor Marathon',
    subtitle: '26.2 miles of grit',
    category: 'adventure',
    route: '/marathon',
    colors: { primary: '#f97316', secondary: '#ea580c', bg: '#1a0f08', text: '#fed7aa' },
    gameTitle: 'Run & Dodge',
    mapPosition: { x: 75, y: 75 },
  },
  {
    slug: 'batman-mountain',
    title: 'Batman Mountain',
    subtitle: 'Free soloing basalt spires in Iceland',
    category: 'adventure',
    route: '/batman-mountain',
    colors: { primary: '#6b7280', secondary: '#374151', bg: '#0a0a0f', text: '#d1d5db' },
    gameTitle: 'Climb the Spire',
    mapPosition: { x: 35, y: 20 },
  },
  {
    slug: 'max-cekot',
    title: 'Max Cekot Kitchen',
    subtitle: 'Michelin star in Riga',
    category: 'work',
    route: '/max-cekot',
    colors: { primary: '#f59e0b', secondary: '#92400e', bg: '#1a1408', text: '#fef3c7' },
    gameTitle: 'Plate It Up',
    mapPosition: { x: 60, y: 15 },
  },
  {
    slug: 'tedx',
    title: 'TEDxYouth',
    subtitle: 'Got good at talking',
    category: 'work',
    route: '/tedx',
    colors: { primary: '#dc2626', secondary: '#7f1d1d', bg: '#1a0505', text: '#fecaca' },
    gameTitle: 'Keep the Rhythm',
    mapPosition: { x: 85, y: 55 },
  },
  {
    slug: 'child-actor',
    title: 'Child Actor',
    subtitle: 'Lights, camera, action',
    category: 'personal',
    route: '/child-actor',
    colors: { primary: '#eab308', secondary: '#a16207', bg: '#1a1608', text: '#fef08a' },
    gameTitle: 'Simon Says',
    mapPosition: { x: 40, y: 80 },
  },
];
