// Flashcards derived directly from the concept nodes
export const FLASHCARD_DECKS = [
  {
    id: 'deck_europe_core',
    title: 'Europe Realm: Core Mastery Deck',
    description: 'High-yield recall cards covering all nodes on the Europe world map.',
    cards: [
      {
        id: 'fc_1',
        nodeId: 'intro',
        topic: 'Quest Progression',
        front: 'How do prerequisite nodes gate progression on the StudyMate map?',
        back: 'Knowledge nodes require mastering connected predecessor nodes. Completing checkpoints and homework unlocks higher elevation trails and citadel gates.',
        mastered: true
      },
      {
        id: 'fc_2',
        nodeId: 'learn',
        topic: 'Coastal Adaptation',
        front: 'Why do Mediterranean shrubs develop sclerophyllous, waxy leaves?',
        back: 'Sclerophyllous foliage minimizes water loss through transpiration during arid, sun-intensive Mediterranean summers.',
        mastered: true
      },
      {
        id: 'fc_3',
        nodeId: 'homework',
        topic: 'Watershed Management',
        front: 'What is the role of vegetative buffer strips along riverbanks?',
        back: 'Buffer strips reduce water runoff velocity, bind slope topsoil with root systems, and filter out sediment before reaching estuarine habitats.',
        mastered: false
      },
      {
        id: 'fc_4',
        nodeId: 'quiz',
        topic: 'Eutrophication',
        front: 'What triggers aquatic eutrophication in downstream freshwater basins?',
        back: 'Agricultural runoff rich in nitrogen and phosphorus triggers algal blooms. When the algae decomposes, dissolved oxygen is stripped from the water.',
        mastered: true
      },
      {
        id: 'fc_5',
        nodeId: 'objective_plateau',
        topic: 'Karst Geology',
        front: 'Which chemical process leads to karst limestone dissolution?',
        back: 'Rainwater absorbs atmospheric CO2 to form weak carbonic acid (H2CO3), which steadily reacts with and dissolves calcium carbonate (calcite).',
        mastered: true
      },
      {
        id: 'fc_6',
        nodeId: 'objective_summit',
        topic: 'Alpine Hydrology',
        front: 'Why is alpine snowpack described as a "natural frozen water tower"?',
        back: 'Snowpack stores winter precipitation as ice and releases meltwater gradually during hot, dry summer months when lowland crops need irrigation most.',
        mastered: false
      },
      {
        id: 'fc_7',
        nodeId: 'objective_fortress',
        topic: 'Highland Buffering',
        front: 'How do mountain forest ecosystems protect lowland valleys against climatic flash floods?',
        back: 'Highland forests act like giant biological sponges: dense root systems stabilize steep slopes while organic soil absorbs and moderates storm surges.',
        mastered: false
      }
    ]
  }
]
