import { PARTS_BY_ID } from '../data/parts';
import { COMBOS } from '../data/combos';
import { ENVIRONMENTS } from '../data/environments';

const ALL_STATS = ['precision', 'strength', 'perception', 'mobility', 'durability', 'adaptability', 'communication', 'social'];

export function computeRobotStats(equippedPartIds, mission, statModifiers = {}) {
  const parts = equippedPartIds.map(id => PARTS_BY_ID[id]).filter(Boolean);
  const stats = Object.fromEntries(ALL_STATS.map(s => [s, 0]));

  for (const part of parts) {
    for (const [stat, val] of Object.entries(part.benefits || {})) {
      stats[stat] = (stats[stat] || 0) + val;
    }
    for (const [stat, val] of Object.entries(part.tradeoffs || {})) {
      stats[stat] = (stats[stat] || 0) + val;
    }
  }

  // Apply stat modifiers (from curveballs etc.)
  for (const [stat, val] of Object.entries(statModifiers)) {
    stats[stat] = (stats[stat] || 0) + val;
  }

  // Check combos
  const activeCombos = [];
  for (const combo of COMBOS) {
    const allPresent = combo.parts.every(pid => equippedPartIds.includes(pid));
    if (!allPresent) continue;
    // Apply bonus if mission category matches or combo is universal
    const missionCat = mission?.category;
    if (combo.missionCategory === null || !combo.missionCategory || combo.missionCategory === missionCat) {
      activeCombos.push(combo);
      for (const [stat, val] of Object.entries(combo.bonus)) {
        stats[stat] = (stats[stat] || 0) + val;
      }
    }
  }

  // Check conflicts
  const activeConflicts = [];
  const partIdSet = new Set(equippedPartIds);

  // OVERLOAD: Light Scout Frame (1) + Nuclear Reactor (29)
  if (partIdSet.has(1) && partIdSet.has(29)) {
    activeConflicts.push({ name: 'OVERLOAD', description: "Frame can't handle the reactor!" });
    for (const s of ALL_STATS) stats[s] = Math.max(0, (stats[s] || 0) - 5);
  }

  // INTERFERENCE: Precision Arms (6) + Heavy Lift Claws (7)
  if (partIdSet.has(6) && partIdSet.has(7)) {
    activeConflicts.push({ name: 'INTERFERENCE', description: 'Arms clash — reduced effectiveness' });
    stats.precision = Math.max(0, (stats.precision || 0) - 2);
    stats.strength = Math.max(0, (stats.strength || 0) - 2);
  }

  // CONFLICT: Multiple AI modules
  const aiIds = [16, 17, 18, 19, 20];
  const equippedAI = aiIds.filter(id => partIdSet.has(id));
  if (equippedAI.length > 1) {
    activeConflicts.push({ name: 'CONFLICT', description: 'Multiple processors fighting each other' });
    stats.adaptability = Math.max(0, (stats.adaptability || 0) - 2);
  }

  // Voice Synthesizer (22) without Emotion Display (23) = uncanny valley
  if (partIdSet.has(22) && !partIdSet.has(23)) {
    stats.social = Math.max(0, (stats.social || 0) - 2);
  }

  // Gesture Module (24) requires arms
  const hasArms = parts.some(p => p.category === 'arms');
  if (partIdSet.has(24) && !hasArms) {
    stats.communication = Math.max(0, (stats.communication || 0) - 2);
    stats.social = Math.max(0, (stats.social || 0) - 2);
  }

  // Clamp all to 0+
  for (const s of ALL_STATS) stats[s] = Math.max(0, stats[s] || 0);

  return { stats, activeCombos, activeConflicts };
}

export function applyEnvironmentToRequirements(requirements, mission) {
  if (!requirements) return requirements;
  const env = ENVIRONMENTS[mission?.environment] || ENVIRONMENTS.normal;
  const effects = env.effects || {};
  const req = { ...requirements };

  if (effects.socialRequirementBonus) req.social = (req.social || 0) + effects.socialRequirementBonus;
  if (effects.mobilityRequirementBonus) req.mobility = (req.mobility || 0) + effects.mobilityRequirementBonus;
  if (effects.communicationDisabled) req.communication = 0;

  return req;
}

export function applyEnvironmentToStats(stats, equippedPartIds, mission) {
  const env = ENVIRONMENTS[mission?.environment] || ENVIRONMENTS.normal;
  const effects = env.effects || {};
  const s = { ...stats };
  const partIdSet = new Set(equippedPartIds);

  // Perception cap (unless overriding sensors equipped)
  if (effects.perceptionCap !== undefined) {
    const hasOverride = (effects.overriddenByIds || []).some(id => partIdSet.has(id));
    if (!hasOverride) s.perception = Math.min(s.perception || 0, effects.perceptionCap);
  }

  // Communication disabled
  if (effects.communicationDisabled) s.communication = 0;

  // Heat shield required
  if (effects.requiresHeatShield && !partIdSet.has(31)) {
    s.durability = Math.max(0, (s.durability || 0) - 3);
    s.mobility = Math.max(0, (s.mobility || 0) - 2);
  }

  // Waterproofing required (part 30 OR amphibious frame 4)
  if (effects.requiresWaterproofing && !partIdSet.has(30) && !partIdSet.has(4)) {
    for (const stat of ALL_STATS) s[stat] = Math.max(0, (s[stat] || 0) - 3);
  }

  // Banned parts: their benefits are negated
  if (effects.bannedPartIds) {
    for (const bannedId of effects.bannedPartIds) {
      if (partIdSet.has(bannedId)) {
        const part = PARTS_BY_ID[bannedId];
        if (part) {
          for (const [stat, val] of Object.entries(part.benefits || {})) {
            s[stat] = Math.max(0, (s[stat] || 0) - val);
          }
        }
      }
    }
  }

  return s;
}

export function calculateScore(equippedPartIds, mission, statModifiers = {}, curveballMods = { scoreDelta: 0 }, noGlitchRisk = false) {
  if (!mission?.requirements) return { total: 0, grade: 'failed', breakdown: {}, activeCombos: [], activeConflicts: [] };

  const { stats, activeCombos, activeConflicts } = computeRobotStats(equippedPartIds, mission, statModifiers);
  const adjustedStats = applyEnvironmentToStats(stats, equippedPartIds, mission);
  const adjustedReqs = applyEnvironmentToRequirements(mission.requirements, mission);

  // Only stats the mission actually requires contribute to the score.
  // Irrelevant stats (req=0) are ignored so players aren't rewarded/penalised
  // for things the mission doesn't care about.
  const relevantStats = ALL_STATS.filter(s => (adjustedReqs[s] || 0) > 0);
  const numRelevant = relevantStats.length || 1;
  const pointsPerStat = 100 / numRelevant;

  let total = 0;
  const breakdown = {};

  for (const stat of ALL_STATS) {
    const requirement = adjustedReqs[stat] || 0;
    const actual = adjustedStats[stat] || 0;
    let statScore = 0;

    if (requirement === 0) {
      // Not required by this mission — no contribution either way
      statScore = 0;
    } else if (actual >= requirement) {
      // Met: 80% base score, bonus up to 100% for significantly exceeding
      const over = actual - requirement;
      const bonusFraction = Math.min(over / requirement, 1);
      statScore = pointsPerStat * (0.8 + bonusFraction * 0.2);
    } else {
      // Missed: 0–60% proportional to how close you got
      const fraction = actual / requirement;
      statScore = pointsPerStat * 0.6 * fraction;
    }

    total += statScore;
    breakdown[stat] = { requirement, actual, statScore, met: actual >= requirement };
  }

  total = Math.min(100, total);

  // Glitch risk from Adaptive Learning Module (17)
  const partIdSet = new Set(equippedPartIds);
  if (partIdSet.has(17) && !noGlitchRisk && !partIdSet.has(34)) {
    if (Math.random() < 0.10) total = Math.max(0, total - 8);
  }

  // Curveball score delta
  total = Math.max(0, Math.min(100, total + (curveballMods.scoreDelta || 0)));
  total = Math.round(total);

  const grade = total >= 85 ? 'gold' : total >= 70 ? 'silver' : total >= 50 ? 'bronze' : 'failed';

  return { total, grade, breakdown, activeCombos, activeConflicts };
}
