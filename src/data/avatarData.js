// Centralized student avatar metadata and image mappings for StudyMate
// Characters provided by user from pixel-art portraits

export const AVATARS = [
  {
    id: 'warrior',
    label: 'Warrior',
    title: 'Scout Vanguard',
    image: '/avatars/warrior.jpg',
    colors: ['#e5643c', '#f5a623'],
    desc: 'Determined frontline explorer inspired by survey scouts.'
  },
  {
    id: 'rogue',
    label: 'Rogue',
    title: 'Shadow Shinobi',
    image: '/avatars/rogue.jpg',
    colors: ['#6b7280', '#e5643c'],
    desc: 'Calm and observant ninja tactician with acute perception.'
  },
  {
    id: 'scholar',
    label: 'Scholar',
    title: 'Archive Sage',
    image: '/avatars/scholar.jpg',
    colors: ['#3b82f6', '#f0f1ff'],
    desc: 'Diligent researcher dedicated to deep conceptual analysis.'
  },
  {
    id: 'mage',
    label: 'Mage',
    title: 'Night Conjurer',
    image: '/avatars/mage.jpg',
    colors: ['#8b5cf6', '#2dd4bf'],
    desc: 'Intuitive thinker who unlocks complex abstractions.'
  },
  {
    id: 'archer',
    label: 'Archer',
    title: 'Precision Mystic',
    image: '/avatars/archer.jpg',
    colors: ['#22c55e', '#f5a623'],
    desc: 'Sharp-eyed problem solver targeting core fundamentals.'
  },
  {
    id: 'paladin',
    label: 'Paladin',
    title: 'Radiant Champion',
    image: '/avatars/paladin.jpg',
    colors: ['#f5a623', '#ffffff'],
    desc: 'Steadfast learner driven by mastery and achievement.'
  }
]

export const AVATAR_MAP = Object.fromEntries(AVATARS.map((a) => [a.id, a]))

export function getAvatar(avatarId) {
  return AVATAR_MAP[avatarId] || AVATARS[0]
}
