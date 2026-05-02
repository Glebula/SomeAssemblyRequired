import { useMemo } from 'react';
import { computeRobotStats, applyEnvironmentToStats, applyEnvironmentToRequirements } from '../utils/scoring';
import { MISSIONS_BY_ID } from '../data/missions';

export function useScoring(equippedPartIds, mission, statModifiers = {}, requirementOverrides = {}) {
  return useMemo(() => {
    const effectiveMission = mission;
    const { stats, activeCombos, activeConflicts } = computeRobotStats(equippedPartIds, effectiveMission, statModifiers);
    const adjustedStats = applyEnvironmentToStats(stats, equippedPartIds, effectiveMission);

    let adjustedReqs = effectiveMission?.requirements
      ? applyEnvironmentToRequirements(effectiveMission.requirements, effectiveMission)
      : null;

    if (adjustedReqs && requirementOverrides) {
      adjustedReqs = { ...adjustedReqs };
      for (const [k, v] of Object.entries(requirementOverrides)) {
        adjustedReqs[k] = (adjustedReqs[k] || 0) + v;
      }
    }

    return { stats: adjustedStats, adjustedReqs, activeCombos, activeConflicts };
  }, [equippedPartIds, mission, statModifiers, requirementOverrides]);
}
