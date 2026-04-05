export const PARTS = [
  // === FRAMES ===
  {
    id: 1, name: "Light Scout Frame", category: "frame", cost: 10,
    benefits: { mobility: 3 },
    tradeoffs: { durability: -2 },
    specialRules: { maxModules: 5 },
    weight: 10, power: 1,
    description: "A lightweight, agile frame built for speed. Can only support 5 total modules due to its minimal structure.",
    combosWith: [],
    conflictsWith: [29],
    conflictName: "OVERLOAD",
    conflictEffect: "Frame can't handle the reactor — -5 to ALL stats"
  },
  {
    id: 2, name: "Standard Frame", category: "frame", cost: 15,
    benefits: {},
    tradeoffs: {},
    specialRules: {},
    weight: 20, power: 1,
    description: "A reliable, balanced frame. No special advantages, but no weaknesses either. The safe choice.",
    combosWith: [],
    conflictsWith: []
  },
  {
    id: 3, name: "Heavy Tank Frame", category: "frame", cost: 20,
    benefits: { durability: 4, strength: 2 },
    tradeoffs: { mobility: -3 },
    specialRules: {},
    weight: 45, power: 2,
    description: "Built like a tank. Extremely durable and strong, but slow and heavy. Best for missions where survival matters more than speed.",
    combosWith: [],
    conflictsWith: []
  },
  {
    id: 4, name: "Amphibious Frame", category: "frame", cost: 18,
    benefits: {},
    tradeoffs: { mobility: -1 },
    specialRules: { waterproof: true },
    weight: 25, power: 1,
    description: "Sealed and buoyant — can operate in water and on land. Slightly slower on land due to its sealed design.",
    combosWith: [],
    conflictsWith: []
  },
  // === ARMS & MANIPULATORS ===
  {
    id: 5, name: "Basic Grippers", category: "arms", cost: 8,
    benefits: { precision: 1, strength: 1 },
    tradeoffs: {},
    specialRules: {},
    weight: 8, power: 1,
    description: "Simple mechanical grippers. They get the job done, but nothing fancy. No combo potential.",
    combosWith: [],
    conflictsWith: []
  },
  {
    id: 6, name: "Precision Servo Arms", category: "arms", cost: 20,
    benefits: { precision: 4, strength: 1 },
    tradeoffs: { durability: -2 },
    specialRules: { breaksIfWeightOver: 80 },
    weight: 12, power: 2,
    description: "Incredibly precise robotic arms with sub-millimeter accuracy. Fragile — breaks if total robot weight exceeds 80% capacity.",
    combosWith: [32],
    conflictsWith: [7],
    conflictName: "INTERFERENCE",
    conflictEffect: "Arms clash — only one set takes effect (the one added first)"
  },
  {
    id: 7, name: "Heavy Lift Claws", category: "arms", cost: 15,
    benefits: { strength: 4, durability: 2 },
    tradeoffs: { precision: -3 },
    specialRules: {},
    weight: 20, power: 2,
    description: "Massive hydraulic claws that can lift heavy objects. Way too clumsy for any delicate work.",
    combosWith: [33],
    conflictsWith: [6],
    conflictName: "INTERFERENCE",
    conflictEffect: "Arms clash — only one set takes effect (the one added first)"
  },
  {
    id: 8, name: "Multi-Tool Hands", category: "arms", cost: 22,
    benefits: { precision: 2, strength: 2, adaptability: 1 },
    tradeoffs: {},
    specialRules: { maxStatBonus: 2 },
    weight: 15, power: 2,
    description: "Swiss-army-knife hands with multiple built-in tools. Versatile but not exceptional at anything.",
    combosWith: [],
    conflictsWith: []
  },
  {
    id: 9, name: "Soft-Touch Grippers", category: "arms", cost: 12,
    benefits: { social: 2, precision: 2 },
    tradeoffs: { strength: -2 },
    specialRules: {},
    weight: 8, power: 1,
    description: "Gentle, human-friendly grippers with soft silicone pads. Great for social interaction and delicate tasks, but can't exert much force.",
    combosWith: [],
    conflictsWith: []
  },
  // === SENSORS ===
  {
    id: 10, name: "Basic Camera", category: "sensors", cost: 5,
    benefits: { perception: 1 },
    tradeoffs: {},
    specialRules: { uselessInDarkSmoke: true },
    weight: 3, power: 1,
    description: "A standard optical camera. Sees fine in normal conditions, but useless in darkness or smoke.",
    combosWith: [],
    conflictsWith: []
  },
  {
    id: 11, name: "Thermal Camera", category: "sensors", cost: 8,
    benefits: { perception: 3 },
    tradeoffs: { perception: -1 },
    specialRules: { bonusInDarkSmoke: true, penaltyInNormalLight: true },
    weight: 5, power: 1,
    description: "Sees heat signatures through smoke, darkness, and snow. Slightly worse than normal vision in well-lit conditions.",
    combosWith: [12],
    conflictsWith: []
  },
  {
    id: 12, name: "LIDAR Array", category: "sensors", cost: 15,
    benefits: { perception: 3, mobility: 1 },
    tradeoffs: {},
    specialRules: { powerHungry: true },
    weight: 10, power: 3,
    description: "360-degree laser mapping of the environment. Excellent spatial awareness. Draws significant power.",
    combosWith: [11],
    conflictsWith: []
  },
  {
    id: 13, name: "Microphone Suite", category: "sensors", cost: 10,
    benefits: { perception: 2, communication: 1 },
    tradeoffs: { adaptability: -1 },
    specialRules: { penaltyInLoudEnv: true },
    weight: 4, power: 1,
    description: "Directional microphones that can isolate sounds. Gets overwhelmed in very loud environments.",
    combosWith: [],
    conflictsWith: []
  },
  {
    id: 14, name: "Pressure Sensors", category: "sensors", cost: 7,
    benefits: { precision: 2 },
    tradeoffs: {},
    specialRules: { fragile: true },
    weight: 3, power: 1,
    description: "Ultra-sensitive touch feedback sensors. Gives precise haptic data but easily damaged by heavy impacts.",
    combosWith: [],
    conflictsWith: []
  },
  {
    id: 15, name: "Chemical Detector", category: "sensors", cost: 12,
    benefits: { perception: 2 },
    tradeoffs: {},
    specialRules: { onlyEnvironmentalJobs: true },
    weight: 6, power: 1,
    description: "Detects hazardous chemicals, gas leaks, and air quality. Only provides meaningful data in environmental missions.",
    combosWith: [],
    conflictsWith: []
  },
  // === PROCESSOR / AI ===
  {
    id: 16, name: "Basic Logic Chip", category: "ai", cost: 8,
    benefits: { adaptability: 1 },
    tradeoffs: {},
    specialRules: { limitedTaskType: true },
    weight: 2, power: 1,
    description: "Simple if/then logic processing. Can handle one type of task competently, but can't multitask or improvise.",
    combosWith: [],
    conflictsWith: [17, 18, 19, 20],
    conflictName: "CONFLICT",
    conflictEffect: "Multiple processors fight each other — -2 Adaptability"
  },
  {
    id: 17, name: "Adaptive Learning Module", category: "ai", cost: 30,
    benefits: { adaptability: 4, social: 3 },
    tradeoffs: {},
    specialRules: { powerDrain: 3, glitchRisk: 0.10 },
    weight: 8, power: 5,
    description: "Advanced machine learning processor that learns from experience and adapts to new situations. Extremely power-hungry and has a 10% chance of glitching during the simulation.",
    combosWith: [23],
    conflictsWith: [16, 18, 19, 20],
    conflictName: "CONFLICT",
    conflictEffect: "Multiple processors fight each other — -2 Adaptability"
  },
  {
    id: 18, name: "Pattern Recognition AI", category: "ai", cost: 18,
    benefits: { perception: 3, adaptability: 2 },
    tradeoffs: { mobility: -1 },
    specialRules: {},
    weight: 5, power: 2,
    description: "Specialized in recognizing visual and data patterns. Processing-intensive — causes slight movement lag.",
    combosWith: [],
    conflictsWith: [16, 17, 19, 20],
    conflictName: "CONFLICT",
    conflictEffect: "Multiple processors fight each other — -2 Adaptability"
  },
  {
    id: 19, name: "Decision Engine", category: "ai", cost: 15,
    benefits: { adaptability: 2, precision: 1, strength: 1, perception: 1, mobility: 1, durability: 1, communication: 1, social: 1 },
    tradeoffs: {},
    specialRules: { rigid: true },
    weight: 5, power: 2,
    description: "A logical decision-making processor that boosts all stats slightly. Once it commits to a course of action, it can't easily change.",
    combosWith: [],
    conflictsWith: [16, 17, 18, 20],
    conflictName: "CONFLICT",
    conflictEffect: "Multiple processors fight each other — -2 Adaptability"
  },
  {
    id: 20, name: "Reflex Processor", category: "ai", cost: 12,
    benefits: { mobility: 3, precision: 1 },
    tradeoffs: { social: -2 },
    specialRules: {},
    weight: 4, power: 2,
    description: "Lightning-fast reaction times. Makes snap decisions that are physically efficient but can seem erratic or alarming to nearby humans.",
    combosWith: [],
    conflictsWith: [16, 17, 18, 19],
    conflictName: "CONFLICT",
    conflictEffect: "Multiple processors fight each other — -2 Adaptability"
  },
  // === COMMUNICATION ===
  {
    id: 21, name: "Basic Speaker", category: "communication", cost: 5,
    benefits: { communication: 1 },
    tradeoffs: { social: -1 },
    specialRules: {},
    weight: 2, power: 1,
    description: "A simple speaker that outputs pre-recorded phrases. Sounds obviously robotic, which can unsettle people.",
    combosWith: [],
    conflictsWith: []
  },
  {
    id: 22, name: "Voice Synthesizer", category: "communication", cost: 12,
    benefits: { communication: 3, social: 2 },
    tradeoffs: {},
    specialRules: { uncannyPenalty: true },
    weight: 4, power: 1,
    description: "Natural-sounding speech synthesis. Sounds great IF the robot also has good emotional expression — otherwise enters 'uncanny valley' (-2 Social if no Emotion Display equipped).",
    combosWith: [],
    conflictsWith: []
  },
  {
    id: 23, name: "Emotion Display Screen", category: "communication", cost: 14,
    benefits: { social: 3, communication: 1 },
    tradeoffs: {},
    specialRules: { fragileScreen: true },
    weight: 6, power: 1,
    description: "An LED face screen that displays emotions — smiles, concern, thinking expressions. Makes the robot relatable. Screen is fragile.",
    combosWith: [17],
    conflictsWith: []
  },
  {
    id: 24, name: "Gesture Module", category: "communication", cost: 10,
    benefits: { communication: 2, social: 2 },
    tradeoffs: {},
    specialRules: { requiresArms: true },
    weight: 4, power: 1,
    description: "Enables natural hand gestures and body language. Requires arms to function.",
    combosWith: [],
    conflictsWith: []
  },
  {
    id: 25, name: "Translation Module", category: "communication", cost: 16,
    benefits: { communication: 3, adaptability: 1 },
    tradeoffs: {},
    specialRules: { processingLag: true },
    weight: 4, power: 2,
    description: "Real-time translation across 50+ languages. Processing the translation causes a slight delay in responses.",
    combosWith: [],
    conflictsWith: []
  },
  // === POWER SUPPLY ===
  {
    id: 26, name: "Standard Battery", category: "power", cost: 5,
    benefits: {},
    tradeoffs: {},
    specialRules: { powerBudget: 10, limitedRuntime: true },
    weight: 8, power: 0,
    description: "A standard lithium-ion battery pack. Reliable for normal missions but may run out on extended operations.",
    combosWith: [],
    conflictsWith: []
  },
  {
    id: 27, name: "Extended Battery", category: "power", cost: 12,
    benefits: {},
    tradeoffs: {},
    specialRules: { powerBudget: 15 },
    weight: 18, power: 0,
    description: "A larger battery with 50% more capacity. Significantly heavier than the standard pack.",
    combosWith: [],
    conflictsWith: []
  },
  {
    id: 28, name: "Solar Cells", category: "power", cost: 10,
    benefits: {},
    tradeoffs: {},
    specialRules: { powerBudget: 12, regenerating: true, uselessIndoors: true },
    weight: 10, power: 0,
    description: "Solar panels that regenerate power over time. Completely useless indoors, underground, or at night.",
    combosWith: [],
    conflictsWith: []
  },
  {
    id: 29, name: "Nuclear Micro-Reactor", category: "power", cost: 25,
    benefits: {},
    tradeoffs: { social: -3 },
    specialRules: { powerBudget: 999, bannedInSterile: true },
    weight: 40, power: 0,
    description: "Virtually unlimited power. Extremely heavy, makes people nervous (Social penalty), and banned in sterile/medical environments.",
    combosWith: [],
    conflictsWith: [1],
    conflictName: "OVERLOAD",
    conflictEffect: "Frame can't handle the reactor — -5 to ALL stats"
  },
  // === SPECIALTY MODULES ===
  {
    id: 30, name: "Waterproofing Kit", category: "specialty", cost: 10,
    benefits: {},
    tradeoffs: { mobility: -1 },
    specialRules: { waterproof: true },
    weight: 15, power: 0,
    description: "Seals all components against water damage. Adds weight and slightly reduces land mobility due to sealed joints.",
    combosWith: [],
    conflictsWith: []
  },
  {
    id: 31, name: "Heat Shield", category: "specialty", cost: 12,
    benefits: {},
    tradeoffs: {},
    specialRules: { heatImmune: true },
    weight: 10, power: 0,
    description: "Ceramic heat-resistant coating. Protects against extreme heat environments. Adds noticeable weight.",
    combosWith: [],
    conflictsWith: []
  },
  {
    id: 32, name: "Medical Scanner", category: "specialty", cost: 18,
    benefits: { perception: 3, precision: 2 },
    tradeoffs: {},
    specialRules: { onlyMedicalJobs: true },
    weight: 12, power: 2,
    description: "Advanced medical imaging — X-ray, ultrasound, vitals monitoring. Extremely useful in medical contexts, dead weight in others.",
    combosWith: [6],
    conflictsWith: []
  },
  {
    id: 33, name: "Rescue Winch", category: "specialty", cost: 14,
    benefits: { strength: 3, mobility: 2 },
    tradeoffs: { mobility: -1 },
    specialRules: { rescueBonus: true },
    weight: 15, power: 1,
    description: "A motorized cable winch for pulling people or objects. Great vertical mobility. Slightly reduces horizontal speed.",
    combosWith: [7],
    conflictsWith: []
  },
  {
    id: 34, name: "Repair Kit", category: "specialty", cost: 8,
    benefits: {},
    tradeoffs: {},
    specialRules: { repairsOnePart: true },
    weight: 5, power: 0,
    description: "Emergency repair tools. Can fix one part that breaks or malfunctions during the simulation. Single use.",
    combosWith: [],
    conflictsWith: []
  },
  {
    id: 35, name: "Stealth Module", category: "specialty", cost: 15,
    benefits: { social: 2 },
    tradeoffs: { communication: -2 },
    specialRules: {},
    weight: 8, power: 1,
    description: "Sound dampening and low-profile design. Makes the robot non-threatening (Social bonus) but severely limits its ability to communicate loudly.",
    combosWith: [],
    conflictsWith: []
  },
  {
    id: 36, name: "Emergency Beacon", category: "specialty", cost: 6,
    benefits: { communication: 2 },
    tradeoffs: {},
    specialRules: { onlyEmergencyMissions: true },
    weight: 3, power: 1,
    description: "High-powered emergency signal transmitter. Useful in rescue/emergency missions.",
    combosWith: [],
    conflictsWith: []
  },
  {
    id: 37, name: "Reinforced Armor", category: "specialty", cost: 16,
    benefits: { durability: 4 },
    tradeoffs: { mobility: -2, precision: -1 },
    specialRules: {},
    weight: 25, power: 0,
    description: "Heavy armor plating. Makes the robot extremely tough but significantly slower and slightly less precise.",
    combosWith: [],
    conflictsWith: []
  },
  {
    id: 38, name: "Speed Boosters", category: "specialty", cost: 14,
    benefits: { mobility: 4 },
    tradeoffs: { precision: -2 },
    specialRules: { powerHungry: true },
    weight: 10, power: 3,
    description: "Jet-assisted movement modules. Incredibly fast but too fast for delicate work, and burns through power quickly.",
    combosWith: [],
    conflictsWith: []
  },
  {
    id: 39, name: "Stabilization Gyro", category: "specialty", cost: 10,
    benefits: { precision: 2, mobility: 1 },
    tradeoffs: {},
    specialRules: { terrainBonus: true },
    weight: 5, power: 1,
    description: "Advanced gyroscopic stabilizer. Improves precision and helps maintain balance on unstable terrain.",
    combosWith: [],
    conflictsWith: []
  },
  {
    id: 40, name: "Companion Personality Module", category: "specialty", cost: 20,
    benefits: { social: 4, communication: 2 },
    tradeoffs: {},
    specialRules: { physicalPenalty: -2 },
    weight: 5, power: 2,
    description: "A warm, friendly personality overlay that makes the robot charming and personable. So focused on being sociable that physical task efficiency drops.",
    combosWith: [],
    conflictsWith: []
  }
];

export const CATEGORY_LABELS = {
  frame: 'Frame',
  arms: 'Arms',
  sensors: 'Sensors',
  ai: 'AI',
  communication: 'Comm',
  power: 'Power',
  specialty: 'Special'
};

export const CATEGORY_COLORS = {
  frame: '#00b4ff',
  arms: '#ff6b35',
  sensors: '#00f0ff',
  ai: '#a78bfa',
  communication: '#34d399',
  power: '#fbbf24',
  specialty: '#f472b6'
};

export const SINGLE_SLOT_CATEGORIES = ['frame', 'power'];
