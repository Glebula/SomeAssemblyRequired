import { COMBOS } from '../data/combos';
import { ENVIRONMENTS } from '../data/environments';
import { PARTS } from '../data/parts';

export const STAT_NAMES = ['precision', 'strength', 'perception', 'mobility', 'durability', 'adaptability', 'communication', 'social'];

export function calculateStats(equippedPartIds, activeConflicts = [], activeCombos = [], mission = null) {
  const stats = {
    precision: 0, strength: 0, perception: 0, mobility: 0,
    durability: 0, adaptability: 0, communication: 0, social: 0
  };

  // Sum up all part benefits and tradeoffs
  equippedPartIds.forEach(partId => {
    const part = PARTS.find(p => p.id === partId);
    if (!part) return;
    STAT_NAMES.forEach(stat => {
      if (part.benefits[stat]) stats[stat] += part.benefits[stat];
      if (part.tradeoffs[stat]) stats[stat] += part.tradeoffs[stat];
    });
  });

  // Apply combo bonuses
  activeCombos.forEach(comboName => {
    const combo = COMBOS.find(c => c.name === comboName);
    if (!combo) return;
    STAT_NAMES.forEach(stat => {
      if (combo.bonus[stat]) stats[stat] += combo.bonus[stat];
    });
  });

  // Apply conflict penalties
  activeConflicts.forEach(() => {
    stats.adaptability = Math.max(0, stats.adaptability - 2);
  });

  // Apply Voice Synthesizer uncanny valley penalty
  const hasVoiceSynth = equippedPartIds.includes(22);
  const hasEmotionDisplay = equippedPartIds.includes(23);
  if (hasVoiceSynth && !hasEmotionDisplay) {
    stats.social = Math.max(0, stats.social - 2);
  }

  // Apply Companion Personality Module physical penalty
  const hasCPM = equippedPartIds.includes(40);
  if (hasCPM) {
    stats.precision = Math.max(0, stats.precision - 2);
    stats.strength = Math.max(0, stats.strength - 2);
  }

  // Clamp all stats to 0 minimum
  STAT_NAMES.forEach(stat => {
    stats[stat] = Math.max(0, stats[stat]);
  });

  return stats;
}

export function getActiveCombos(equippedPartIds, missionCategory) {
  const active = [];
  COMBOS.forEach(combo => {
    const allPresent = combo.parts.every(id => equippedPartIds.includes(id));
    if (!allPresent) return;
    if (combo.applicableTo === 'all') {
      active.push(combo.name);
    } else if (missionCategory && combo.applicableTo.includes(missionCategory)) {
      active.push(combo.name);
    } else if (!missionCategory) {
      active.push(combo.name);
    }
  });
  return active;
}

export function getActiveConflicts(equippedPartIds) {
  const conflicts = [];
  const equippedParts = equippedPartIds.map(id => PARTS.find(p => p.id === id)).filter(Boolean);

  equippedParts.forEach(part => {
    if (!part.conflictsWith || part.conflictsWith.length === 0) return;
    part.conflictsWith.forEach(conflictId => {
      if (equippedPartIds.includes(conflictId)) {
        const conflictPart = PARTS.find(p => p.id === conflictId);
        const conflictKey = [part.id, conflictId].sort().join('-');
        if (!conflicts.find(c => c.key === conflictKey)) {
          conflicts.push({
            key: conflictKey,
            parts: [part.name, conflictPart?.name],
            name: part.conflictName || 'CONFLICT',
            effect: part.conflictEffect || 'Parts conflict with each other'
          });
        }
      }
    });
  });

  return conflicts;
}

export function calculateTotalWeight(equippedPartIds) {
  return equippedPartIds.reduce((sum, id) => {
    const part = PARTS.find(p => p.id === id);
    return sum + (part?.weight || 0);
  }, 0);
}

export function calculateTotalPower(equippedPartIds) {
  return equippedPartIds.reduce((sum, id) => {
    const part = PARTS.find(p => p.id === id);
    return sum + (part?.power || 0);
  }, 0);
}

export function getPowerBudget(equippedPartIds) {
  let budget = 0;
  equippedPartIds.forEach(id => {
    const part = PARTS.find(p => p.id === id);
    if (part?.specialRules?.powerBudget) {
      budget += part.specialRules.powerBudget;
    }
  });
  return budget === 0 ? 10 : budget; // Default 10 if no power source
}

export function calculateScore(equippedPartIds, mission, difficulty = 'bronze', curveballPenalty = 0, glitchOccurred = false) {
  if (!mission || !mission.requirements) {
    return { total: 0, breakdown: {}, grade: 'failed', activeCombos: [], activeConflicts: [] };
  }

  const activeCombos = getActiveCombos(equippedPartIds, mission.category);
  const activeConflicts = getActiveConflicts(equippedPartIds);
  const stats = calculateStats(equippedPartIds, activeConflicts, activeCombos, mission);

  // Apply environment effects
  const env = ENVIRONMENTS[mission.environment] || ENVIRONMENTS['normal'];
  const envEffects = env.effects;

  let adjustedStats = { ...stats };

  // Underwater without waterproofing
  const hasWaterproof = equippedPartIds.some(id => {
    const p = PARTS.find(p => p.id === id);
    return p?.specialRules?.waterproof;
  });
  if (envEffects.requiresWaterproofing && !hasWaterproof) {
    ['strength', 'mobility', 'precision', 'durability'].forEach(s => {
      adjustedStats[s] = 0;
    });
  }

  // Perception cap (low visibility)
  if (envEffects.perceptionCap !== undefined) {
    const hasOverride = equippedPartIds.includes(11) || equippedPartIds.includes(12);
    if (!hasOverride) {
      adjustedStats.perception = Math.min(adjustedStats.perception, envEffects.perceptionCap);
    }
  }

  // Communication disabled in remote areas
  if (envEffects.communicationDisabled) {
    adjustedStats.communication = 0;
  }

  // Sterile environment banned parts
  if (envEffects.bannedParts) {
    const hasBannedPart = equippedPartIds.some(id => envEffects.bannedParts.includes(id));
    if (hasBannedPart) {
      STAT_NAMES.forEach(s => { adjustedStats[s] = Math.max(0, adjustedStats[s] - 2); });
    }
  }

  // Difficulty multiplier for requirements
  const difficultyMultiplier = { bronze: 0.8, silver: 1.0, gold: 1.2 }[difficulty] || 1.0;

  let totalScore = 0;
  const breakdown = {};

  STAT_NAMES.forEach(stat => {
    const rawReq = mission.requirements[stat] || 0;
    const requirement = Math.ceil(rawReq * difficultyMultiplier);
    const actual = adjustedStats[stat];

    let statScore;
    if (requirement === 0) {
      statScore = 12.5;
    } else if (actual >= requirement) {
      statScore = 12.5;
      const overBonus = Math.min((actual - requirement) * 0.5, 2);
      statScore += overBonus;
    } else {
      const gap = requirement - actual;
      statScore = Math.max(12.5 - gap * 4, 0);
    }

    breakdown[stat] = {
      requirement,
      actual,
      score: statScore,
      met: actual >= requirement
    };

    totalScore += statScore;
  });

  // Apply glitch penalty
  if (glitchOccurred) {
    totalScore = Math.max(0, totalScore - 8);
  }

  // Apply curveball penalty
  totalScore = Math.max(0, totalScore + curveballPenalty);

  const capped = Math.min(100, Math.round(totalScore));

  return {
    total: capped,
    breakdown,
    grade: capped >= 85 ? 'gold' : capped >= 70 ? 'silver' : capped >= 50 ? 'bronze' : 'failed',
    activeCombos,
    activeConflicts
  };
}
