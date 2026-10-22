// Single source of truth for the Learning World Map
// Coordinates are calibrated to the 1280 x 936 reference map

export const INITIAL_NODES = [
  {
    id: 'intro',
    label: 'Intro',
    subtitle: 'Kingdom Arrival',
    category: 'Orientation',
    type: 'learn',
    x: 866,
    y: 663,
    status: 'mastered',
    xp: 50,
    hasNotificationDot: true,
    desc: 'Welcome to the Europe Learning Realm! Learn how knowledge paths connect, explore the terrain, and prepare for your quest.',
    summary: 'Master the basics of navigation, quest progression, and XP mechanics.',
    keyTakeaways: [
      'Learning nodes form a connected knowledge tree.',
      'Completing objectives unlocks downstream regions and rewards XP.',
      'If you miss questions, recovery quests automatically assist your learning.'
    ],
    quiz: {
      question: 'How do you unlock the Highland Citadel on this map?',
      options: [
        'Skip directly past prerequisite checkpoints',
        'Complete connected prerequisite objectives in sequence',
        'Wait for a daily countdown timer',
        'Reset your profile'
      ],
      correctIndex: 1,
      explanation: 'Knowledge nodes unlock progressively as you master prerequisite concepts along the connected path.'
    },
    recoveryQuest: {
      misconception:
        'A common misconception is assuming RPG maps allow jumping straight to final bosses without mastering foundational checkpoints.',
      targetedConcept: 'Directed Graph Prerequisite Gating',
      practiceTask: {
        title: 'Map Pathway Inspection',
        instruction: 'Trace the path arrows from Intro through Learn, Quiz, and Summit Falls.',
        keyModel: 'Every node checks its "prerequisites" array. The Citadel requires Summit Falls mastery.'
      },
      followUpQuestion: {
        question: 'What condition triggers a locked objective to become available on the realm map?',
        options: [
          'All prerequisite objectives connected to it must be mastered',
          'The student must accumulate 1,000 XP in a single session',
          'The map must be refreshed 5 times',
          'A subscription token must be purchased'
        ],
        correctIndex: 0,
        explanation: 'The progression system checks that all prerequisite concept nodes have been completed before opening the next path.'
      }
    }
  },
  {
    id: 'learn',
    label: 'Learn',
    subtitle: 'Coastal Biomes',
    category: 'Core Concepts',
    type: 'learn',
    x: 388,
    y: 638,
    status: 'mastered',
    xp: 75,
    desc: 'Examine European coastal biomes, terrestrial ecosystems, and energy flows through micro-climates.',
    summary: 'Discover how marine wind patterns and latitude shape Mediterranean biodiversity.',
    keyTakeaways: [
      'Coastal vegetation develops specialized moisture-retention foliage.',
      'Temperature fluctuations between sea and land drive coastal microclimates.',
      'Estuary ecosystems act as natural biological water filtration filters.'
    ],
    quiz: {
      question: 'Why do Mediterranean coastal shrubs typically feature small, waxy leaves?',
      options: [
        'To attract deep-sea marine animals',
        'To minimize water loss through transpiration in hot summers',
        'To reflect winter moonlight',
        'To increase rapid frost absorption'
      ],
      correctIndex: 1,
      explanation: 'Sclerophyllous waxy leaves are an evolutionary adaptation to preserve water during arid Mediterranean summers.'
    },
    recoveryQuest: {
      misconception:
        'Students often confuse heat tolerance with frost protection or light reflection, overlooking the critical role of transpiration.',
      targetedConcept: 'Plant Moisture Retention & Transpiration',
      practiceTask: {
        title: 'Leaf Cuticle Analysis',
        instruction: 'Review the microscopic cross-section of a sclerophyllous Mediterranean leaf.',
        keyModel: 'Thick cutin layers and sunken stomata create a protective boundary layer reducing vapor evaporation by up to 80%.'
      },
      followUpQuestion: {
        question: 'Which physiological adaptation helps Mediterranean flora survive prolonged dry seasons?',
        options: [
          'Sunken stomata and thick waxy cuticles that reduce water loss',
          'Exclusively shallow surface roots with no taproot',
          'Broad, thin leaves designed to maximize water evaporation',
          'Absence of protective cellular cell walls'
        ],
        correctIndex: 0,
        explanation: 'Sunken stomata trap humid air against the leaf surface, dramatically reducing transpiration during arid droughts.'
      }
    }
  },
  {
    id: 'homework',
    label: 'Homework',
    subtitle: 'Runoff Analysis',
    category: 'Practice Lab',
    type: 'homework',
    x: 990,
    y: 508,
    status: 'available',
    xp: 100,
    bonusXpLabel: '+30 XP',
    desc: 'Apply your environmental knowledge: assess watershed runoff patterns and measure sediment transport down canyon slopes.',
    summary: 'Analyze interactive catchment data and recommend sustainable terracing strategies.',
    keyTakeaways: [
      'Deforested slopes suffer up to 10x higher topsoil erosion rates.',
      'Stone terracing slows hydraulic velocity and promotes groundwater recharge.',
      'Downstream coral reefs depend on clean sediment-filtered runoff.'
    ],
    quiz: {
      question: 'Which intervention best protects downstream river basins from flash flood sediment overload?',
      options: [
        'Total removal of riparian riverbank vegetation',
        'Constructing terraced slopes and maintaining vegetative buffer strips',
        'Paving river channels with smooth cement',
        'Diverting the entire river into stagnant reservoirs'
      ],
      correctIndex: 1,
      explanation: 'Vegetative buffer strips and terracing trap sediment particles and allow water to naturally percolate into aquifers.'
    },
    recoveryQuest: {
      misconception:
        'A frequent error is assuming concrete canalization prevents floods; smooth concrete actually accelerates peak velocity and increases downstream erosion.',
      targetedConcept: 'Hydraulic Dissipation & Riparian Buffers',
      practiceTask: {
        title: 'Runoff Velocity Comparison',
        instruction: 'Compare hydraulic flow rates between bare soil, concrete channels, and vegetated buffer zones.',
        keyModel: 'Root friction and terraced steps dissipate kinetic energy, allowing sediment to settle before reaching estuaries.'
      },
      followUpQuestion: {
        question: 'Why are vegetative riparian buffer zones superior to paved concrete ditches for environmental flood control?',
        options: [
          'They filter agricultural runoff, slow down floodwaters, and recharge groundwater',
          'They increase the speed of floodwaters into coastal cities',
          'They eliminate 100% of moisture from soil permanently',
          'They prevent all plant life from growing near riverbeds'
        ],
        correctIndex: 0,
        explanation: 'Riparian root systems absorb excess nutrients, reduce peak hydraulic surges, and promote aquifer percolation.'
      }
    }
  },
  {
    id: 'quiz',
    label: 'Quiz',
    subtitle: 'Plateau Checkpoint',
    category: 'Checkpoint Exam',
    type: 'quiz',
    x: 657,
    y: 397,
    status: 'mastered',
    xp: 150,
    desc: 'Demonstrate mastery of coastal biomes, river drainage dynamics, and geological slope formation.',
    summary: 'Comprehensive mid-island assessment unlocking the upper alpine highlands.',
    keyTakeaways: [
      'Integrates concepts across orientation, biology, and hydrology.',
      'Earns the Explorer Checkpoint badge upon first-time mastery.',
      'Unlocks the Highland trail toward the Ancient Watchtower.'
    ],
    quiz: {
      question: 'What is the primary ecological danger of rapid agricultural runoff entering freshwater estuaries?',
      options: [
        'Eutrophication caused by excess nitrogen and phosphorus leading to oxygen depletion',
        'Instantaneous freezing of river water',
        'Increased atmospheric ozone accumulation',
        'Rapid permanent increase in water pH to extreme alkaline levels'
      ],
      correctIndex: 0,
      explanation: 'Excess nutrients trigger algal blooms whose decomposition strips dissolved oxygen from the water column.'
    },
    recoveryQuest: {
      misconception:
        'Students often guess physical temperature changes rather than the biochemical cascade of nutrient loading and bacterial decomposition.',
      targetedConcept: 'Biochemical Eutrophication Cascade',
      practiceTask: {
        title: 'Dissolved Oxygen Depletion Model',
        instruction: 'Observe the 3-step sequence: Nutrient Surge ➔ Algal Bloom ➔ Microbial Decomposition consuming O2.',
        keyModel: 'Aerobic bacteria consume dissolved oxygen as they break down dying algae, creating hypoxic dead zones.'
      },
      followUpQuestion: {
        question: 'In an aquatic dead zone caused by eutrophication, what causes the collapse of fish populations?',
        options: [
          'Hypoxia: severe depletion of dissolved oxygen caused by decomposing organic matter',
          'Water becoming so transparent fish are blinded by sunlight',
          'Excessive salt crystallization in freshwater gills',
          'Instant boiling of shallow water'
        ],
        correctIndex: 0,
        explanation: 'Decomposing microorganisms consume the available dissolved oxygen, leaving fish without enough oxygen to survive.'
      }
    }
  },
  {
    id: 'objective_plateau',
    label: 'New Objective',
    subtitle: 'Ancient Watchtower',
    category: 'Exploration',
    type: 'objective',
    x: 370,
    y: 265,
    status: 'mastered',
    xp: 120,
    desc: 'Explore the western limestone battlements. Examine weathering patterns and structural integrity of ancient masonry.',
    summary: 'Investigate chemical karst dissolution and how ancient architects adapted to limestone terrain.',
    keyTakeaways: [
      'Slightly acidic rainwater steadily dissolves calcium carbonate in limestone structures.',
      'Karst topography produces natural caves, springs, and subsurface caverns.',
      'Historical mortar formulations used pozzolanic ash for hydraulic resilience.'
    ],
    quiz: {
      question: 'What chemical compound in natural rainwater is primarily responsible for dissolving limestone?',
      options: [
        'Dilute carbonic acid (H2CO3) formed from dissolved carbon dioxide',
        'Pure sulfuric acid from outer space dust',
        'Concentrated hydrochloric acid',
        'Dissolved sodium chloride'
      ],
      correctIndex: 0,
      explanation: 'Rainwater absorbs atmospheric CO2, creating weak carbonic acid that dissolves calcium carbonate (calcite).'
    },
    recoveryQuest: {
      misconception:
        'Students often assume acid rain must come from industrial pollution, forgetting that natural unpolluted rain is naturally mildly acidic due to atmospheric carbon dioxide.',
      targetedConcept: 'Carbonic Acid & Calcium Carbonate Equilibrium',
      practiceTask: {
        title: 'Chemical Karst Reaction',
        instruction: 'H2O + CO2 ⇌ H2CO3. Then H2CO3 + CaCO3 ⇌ Ca(HCO3)2 (soluble calcium bicarbonate).',
        keyModel: 'This natural weak acid is what carves massive limestone caverns and erodes ancient masonry over centuries.'
      },
      followUpQuestion: {
        question: 'Which process explains why natural limestone develops caves and sinkholes over geological time?',
        options: [
          'Carbonic acid in rainwater slowly dissolves calcium carbonate minerals',
          'Lightning strikes melting the rock into liquid quartz',
          'Earth magnetic forces magnetizing stone particles away',
          'Plant leaves digesting rock through photosynthetic enzymes'
        ],
        correctIndex: 0,
        explanation: 'Mild carbonic acid in groundwater chemically dissolves calcite along fracture lines, enlarging them into caves and sinkholes.'
      }
    }
  },
  {
    id: 'objective_summit',
    label: 'New Objective',
    subtitle: 'Summit Falls',
    category: 'Active Quest',
    type: 'objective',
    x: 578,
    y: 138,
    status: 'in_progress',
    xp: 200,
    desc: 'Active Objective: Reach the high-altitude falls. Analyze glacial snowmelt volume and seasonal water distribution.',
    summary: 'Track alpine snowpack volume and understand how mountain heads sustain entire lowland civilizations.',
    keyTakeaways: [
      'Alpine snowpack functions as a giant natural frozen water tower.',
      'Peak seasonal melt occurs in late spring, buffering summer drought periods.',
      'Rising regional temperatures shift precipitation from snow to rain, disrupting baseflows.'
    ],
    quiz: {
      question: 'Why does a reduction in mountain snowpack threaten summer agricultural production downstream?',
      options: [
        'Meltwater ceases to replenish river flows during the driest, peak-growing months',
        'Snowpack reduction forces crop roots to freeze',
        'It causes plants to stop photosynthesis',
        'Lowland soil becomes too rich in organic nitrogen'
      ],
      correctIndex: 0,
      explanation: 'Snowpack slowly releases water throughout warm summer months. Without it, spring floods are followed by severe summer droughts.'
    },
    recoveryQuest: {
      misconception:
        'Students sometimes think rain in winter can easily substitute for snow; however, winter rain runs off immediately, leaving riverbeds bone dry by mid-summer.',
      targetedConcept: 'Seasonal Hydrological Phase Delay',
      practiceTask: {
        title: 'Snowpack Storage Hydrograph Drill',
        instruction: 'Compare a hydrograph with snowpack (sustained summer discharge) versus without snowpack (winter flood spike + summer drought).',
        keyModel: 'Snow solid-state storage delays runoff release by 4-6 months until peak agricultural demand in July and August.'
      },
      followUpQuestion: {
        question: 'What is the primary hydrological benefit of high-altitude snowpack compared to winter rainfall?',
        options: [
          'It acts as natural storage that delays water release until dry summer growing seasons',
          'It prevents clouds from forming over agricultural fields',
          'It completely stops rivers from ever reaching the sea',
          'It purifies seawater into bottled mineral water'
        ],
        correctIndex: 0,
        explanation: 'Snowpack delays the timing of runoff, providing sustained meltwater when lowland agricultural valleys experience the least rainfall.'
      }
    }
  },
  {
    id: 'objective_fortress',
    label: 'New Objective',
    subtitle: 'Highland Citadel',
    category: 'Locked Fortress',
    type: 'objective',
    x: 1056,
    y: 145,
    status: 'locked',
    prerequisites: ['objective_summit'],
    xp: 250,
    desc: 'The ancient summit citadel looms over Europe. Complete Summit Falls to unseal the fortress gates and face the final trial.',
    summary: 'Culminating mastery trial synthesizing geology, hydrology, and ecological stewardship.',
    keyTakeaways: [
      'Final grand challenge evaluating all concepts learned across the Europe realm.',
      'Grants the Europe Realm Grandmaster Crest upon completion.'
    ],
    quiz: {
      question: 'How do highland forest ecosystems buffer entire downstream river basins against climate extremes?',
      options: [
        'By stabilizing slopes with deep roots, regulating water release, and cooling regional microclimates',
        'By halting all wind circulation permanently',
        'By absorbing 100% of cosmic solar radiation',
        'By converting river water directly into hydrogen fuel'
      ],
      correctIndex: 0,
      explanation: 'Mountain forests act as biological sponges that mitigate flash floods, prevent catastrophic landslides, and sustain perennial streams.'
    },
    recoveryQuest: {
      misconception:
        'Students occasionally confuse physical mechanical shielding with dynamic ecological regulation and hydrological percolation.',
      targetedConcept: 'Integrated Watershed Canopy & Sponge Effect',
      practiceTask: {
        title: 'Forest Canopy Interception Model',
        instruction: 'Observe how tree foliage intercepts torrential raindrops, preventing compaction of permeable topsoil.',
        keyModel: 'Forest canopy + humus layer slow down infiltration, reducing peak flood volumes and keeping streams flowing perennially.'
      },
      followUpQuestion: {
        question: 'Which environmental service do high-altitude mountain forests provide to low-lying communities?',
        options: [
          'Stabilizing soil against catastrophic mudslides and regulating streamflow rates',
          'Halting regional tectonic plate movement',
          'Permanently heating mountain peaks to tropical temperatures',
          'Blocking all atmospheric cloud formation'
        ],
        correctIndex: 0,
        explanation: 'Deep tree root networks secure steep bedrock and leaf litter acts as an absorbent sponge, regulating downstream flood risks.'
      }
    }
  }
]

export const MAP_CONNECTIONS = [
  { from: 'intro', to: 'learn', status: 'completed' },
  { from: 'intro', to: 'homework', status: 'available' },
  { from: 'learn', to: 'quiz', status: 'completed' },
  { from: 'homework', to: 'quiz', status: 'available' },
  { from: 'quiz', to: 'objective_plateau', status: 'completed' },
  { from: 'objective_plateau', to: 'objective_summit', status: 'in_progress' },
  { from: 'objective_summit', to: 'objective_fortress', status: 'locked' }
]

export const MAP_DIMENSIONS = {
  width: 1280,
  height: 936
}
