export const ENVIRONMENTS = {
  normal: { name: 'Normal', icon: '🏢', effects: {} },
  'extreme-heat-low-visibility': {
    name: 'Extreme Heat + Low Visibility', icon: '🔥',
    effects: { requiresHeatShield: true, perceptionCap: 2, overriddenByIds: [11, 12] },
  },
  'extreme-cold-low-visibility': {
    name: 'Extreme Cold + Low Visibility', icon: '❄️',
    effects: { perceptionCap: 2, overriddenByIds: [11, 12] },
  },
  'extreme-heat-remote': {
    name: 'Extreme Heat + Remote', icon: '🌋',
    effects: { requiresHeatShield: true, communicationDisabled: true },
  },
  underwater: {
    name: 'Underwater', icon: '🌊',
    effects: { requiresWaterproofing: true },
  },
  'underwater-remote': {
    name: 'Underwater + Remote', icon: '🌊',
    effects: { requiresWaterproofing: true, communicationDisabled: true },
  },
  'low-visibility': {
    name: 'Low Visibility', icon: '🌫️',
    effects: { perceptionCap: 2, overriddenByIds: [11, 12] },
  },
  'crowded-public': {
    name: 'Crowded Public Space', icon: '👥',
    effects: { socialRequirementBonus: 2 },
  },
  'remote-no-signal': {
    name: 'Remote / No Signal', icon: '📵',
    effects: { communicationDisabled: true },
  },
  'unstable-terrain': {
    name: 'Unstable Terrain', icon: '⛰️',
    effects: { mobilityRequirementBonus: 2 },
  },
  sterile: {
    name: 'Sterile Environment', icon: '🏥',
    effects: { bannedPartIds: [7, 29] },
  },
  random: { name: 'Unknown', icon: '❓', effects: {} },
};
