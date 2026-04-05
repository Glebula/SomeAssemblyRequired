export const ENVIRONMENTS = {
  "normal": { name: "Normal", icon: "🏢", effects: {} },
  "extreme-heat": { name: "Extreme Heat", icon: "🔥", effects: { durabilityPenalty: -1, requiresHeatShield: true } },
  "extreme-cold": { name: "Extreme Cold", icon: "❄️", effects: { batteryDrainMultiplier: 2 } },
  "extreme-heat-low-visibility": { name: "Extreme Heat + Low Visibility", icon: "🔥", effects: { durabilityPenalty: -1, requiresHeatShield: true, perceptionCap: 2, overriddenBy: ["thermal-camera", "lidar"] } },
  "extreme-cold-low-visibility": { name: "Extreme Cold + Low Visibility", icon: "❄️", effects: { batteryDrainMultiplier: 2, perceptionCap: 2, overriddenBy: ["thermal-camera", "lidar"] } },
  "extreme-heat-remote": { name: "Extreme Heat + Remote", icon: "🌋", effects: { durabilityPenalty: -1, requiresHeatShield: true, communicationDisabled: true } },
  "underwater": { name: "Underwater", icon: "🌊", effects: { requiresWaterproofing: true, autoFailPhysicalWithout: true } },
  "underwater-remote": { name: "Underwater + Remote", icon: "🌊", effects: { requiresWaterproofing: true, autoFailPhysicalWithout: true, communicationDisabled: true } },
  "low-visibility": { name: "Low Visibility", icon: "🌫️", effects: { perceptionCap: 2, overriddenBy: ["thermal-camera", "lidar"] } },
  "crowded-public": { name: "Crowded Public Space", icon: "👥", effects: { socialRequirementMultiplier: 2 } },
  "remote-no-signal": { name: "Remote / No Signal", icon: "📵", effects: { communicationDisabled: true } },
  "unstable-terrain": { name: "Unstable Terrain", icon: "⛰️", effects: { mobilityRequirementIncrease: 2 } },
  "sterile": { name: "Sterile Environment", icon: "🏥", effects: { bannedParts: [7, 29] } }
};
