export const COMBOS = [
  {
    name: 'Surgeon Suite',
    parts: [6, 32],
    bonus: { precision: 3 },
    description: '+3 Precision on medical missions',
    missionCategory: 'physical',
  },
  {
    name: 'Empathy Engine',
    parts: [17, 23],
    bonus: { social: 3 },
    description: '+3 Social on social missions',
    missionCategory: 'social-interaction',
  },
  {
    name: 'All-Seeing',
    parts: [11, 12],
    bonus: { perception: 2 },
    description: '+2 Perception in any condition',
    missionCategory: null,
  },
  {
    name: 'Extraction Kit',
    parts: [7, 33],
    bonus: { strength: 3 },
    description: '+3 Strength on rescue missions',
    missionCategory: 'environmental',
  },
];
