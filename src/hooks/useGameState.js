import { useState, useCallback } from 'react';
import { PARTS, PARTS_BY_ID, SINGLE_EQUIP_CATEGORIES } from '../data/parts';
import { STANDARD_MISSIONS } from '../data/missions';
import { CURVEBALLS } from '../data/curveballs';

export const SCREENS = {
  HOME: 'home',
  DRAW_MISSION: 'draw-mission',
  BUILD: 'build',
  CURVEBALL: 'curveball',
  QUESTION: 'question',
  SIMULATION: 'simulation',
  RESULTS: 'results',
  SETTINGS: 'settings',
  LEADERBOARD: 'leaderboard',
};

const INITIAL_STATE = {
  screen: SCREENS.HOME,
  mission: null,
  difficulty: null,
  bits: 80,
  equippedPartIds: [],
  statModifiers: { precision: 0, strength: 0, perception: 0, mobility: 0, durability: 0, adaptability: 0, communication: 0, social: 0 },
  curveballEvent: null,
  curveballMods: { scoreDelta: 0 },
  requirementOverrides: {},
  questionAsked: null,
  bitsFromQuestion: 0,
  simulationResult: null,
  devMode: false,
  settings: {
    leaderboardMode: false,
    eventName: '',
    sound: true,
    unlimitedBits: false,
    unlimitedTime: false,
    skipCurveball: false,
    skipQuestion: false,
    autoAnswerQuestion: false,
    skipSimulation: false,
    forceScore: null,
    noGlitchRisk: false,
    showStatsOverlay: false,
    showScoringBreakdown: false,
    forceDifficulty: null,
    forceMissionId: null,
  },
  leaderboard: [],
  mysteryMissionRevealed: false,
  revealedMission: null,
  toasts: [],
};

let toastCounter = 0;

export function useGameState() {
  const [state, setState] = useState(INITIAL_STATE);

  const update = useCallback((updates) => setState(prev => ({ ...prev, ...updates })), []);

  const goTo = useCallback((screen) => setState(prev => ({ ...prev, screen })), []);

  const startNewGame = useCallback(() => {
    setState(prev => ({
      ...INITIAL_STATE,
      devMode: prev.devMode,
      settings: prev.settings,
      leaderboard: prev.leaderboard,
      screen: SCREENS.DRAW_MISSION,
    }));
  }, []);

  const setMission = useCallback((mission, difficulty, redrawPenalty = 0) => {
    const diffBits = { bronze: 80, silver: 65, gold: 50 }[difficulty] || 80;
    setState(prev => ({
      ...prev,
      mission,
      difficulty,
      bits: Math.max(10, diffBits - redrawPenalty),
      equippedPartIds: [],
      statModifiers: { ...INITIAL_STATE.statModifiers },
      curveballEvent: null,
      curveballMods: { scoreDelta: 0 },
      requirementOverrides: {},
      questionAsked: null,
      bitsFromQuestion: 0,
      simulationResult: null,
      mysteryMissionRevealed: false,
      revealedMission: null,
    }));
  }, []);

  const canEquip = useCallback((partId) => {
    return (parts, bits, settings) => {
      const part = PARTS_BY_ID[partId];
      if (!part) return { ok: false, reason: 'Unknown part' };
      if (parts.includes(partId)) return { ok: false, reason: 'Already equipped' };
      if (!settings.unlimitedBits && bits < part.cost) return { ok: false, reason: 'Not enough Bits' };
      if (SINGLE_EQUIP_CATEGORIES.has(part.category)) {
        const hasOne = parts.some(id => PARTS_BY_ID[id]?.category === part.category);
        if (hasOne) return { ok: false, reason: `Only one ${part.category} allowed` };
      }
      // Light Scout Frame max 5 modules
      const frameId = parts.find(id => PARTS_BY_ID[id]?.category === 'frame');
      if (frameId === 1 || (parts.includes(1) && part.category !== 'frame')) {
        const nonFrameCount = parts.filter(id => PARTS_BY_ID[id]?.category !== 'frame').length;
        if (nonFrameCount >= 5) return { ok: false, reason: 'Light Scout Frame max 5 modules reached' };
      }
      return { ok: true };
    };
  }, []);

  const equipPart = useCallback((partId) => {
    setState(prev => {
      const part = PARTS_BY_ID[partId];
      if (!part) return prev;
      if (prev.equippedPartIds.includes(partId)) return prev;
      if (!prev.settings.unlimitedBits && prev.bits < part.cost) return prev;
      return {
        ...prev,
        equippedPartIds: [...prev.equippedPartIds, partId],
        bits: prev.settings.unlimitedBits ? prev.bits : prev.bits - part.cost,
      };
    });
  }, []);

  const unequipPart = useCallback((partId) => {
    setState(prev => {
      const part = PARTS_BY_ID[partId];
      if (!part) return prev;
      return {
        ...prev,
        equippedPartIds: prev.equippedPartIds.filter(id => id !== partId),
        bits: prev.bits + part.cost,
      };
    });
  }, []);

  const applyCurveballEffect = useCallback((event, choice) => {
    setState(prev => {
      const opt = choice === 'A' ? event.optionA : event.optionB;
      let newState = {
        ...prev,
        curveballEvent: event,
        curveballMods: { ...prev.curveballMods },
        equippedPartIds: [...prev.equippedPartIds],
        bits: prev.bits,
        statModifiers: { ...prev.statModifiers },
        requirementOverrides: { ...prev.requirementOverrides },
      };

      switch (opt.action) {
        case 'removeCheapest': {
          if (newState.equippedPartIds.length > 0) {
            const cheapest = newState.equippedPartIds
              .map(id => PARTS_BY_ID[id])
              .filter(Boolean)
              .sort((a, b) => a.cost - b.cost)[0];
            if (cheapest) {
              newState.equippedPartIds = newState.equippedPartIds.filter(id => id !== cheapest.id);
              newState.bits += cheapest.cost;
            }
          }
          break;
        }
        case 'removeRandom': {
          if (newState.equippedPartIds.length > 0) {
            const idx = Math.floor(Math.random() * newState.equippedPartIds.length);
            const removedId = newState.equippedPartIds[idx];
            const removed = PARTS_BY_ID[removedId];
            newState.equippedPartIds = newState.equippedPartIds.filter((_, i) => i !== idx);
            if (removed) newState.bits += removed.cost;
          }
          break;
        }
        case 'payToKeep': {
          newState.bits = Math.max(0, newState.bits - (opt.value || 0));
          break;
        }
        case 'increaseReq': {
          newState.requirementOverrides[opt.stat] = (newState.requirementOverrides[opt.stat] || 0) + opt.value;
          break;
        }
        case 'scorePenalty': {
          newState.curveballMods.scoreDelta = (newState.curveballMods.scoreDelta || 0) + (opt.value || 0);
          break;
        }
        case 'scoreBonus': {
          newState.curveballMods.scoreDelta = (newState.curveballMods.scoreDelta || 0) + (opt.value || 0);
          break;
        }
        case 'addBits': {
          newState.bits += opt.value || 0;
          break;
        }
        case 'removeMostExpensive': {
          if (newState.equippedPartIds.length > 0) {
            const expensive = newState.equippedPartIds
              .map(id => PARTS_BY_ID[id])
              .filter(Boolean)
              .sort((a, b) => b.cost - a.cost)[0];
            if (expensive) {
              newState.equippedPartIds = newState.equippedPartIds.filter(id => id !== expensive.id);
              newState.bits += expensive.cost;
            }
          }
          break;
        }
        case 'addRandomPart': {
          const equipped = new Set(newState.equippedPartIds);
          const available = PARTS.filter(p => {
            if (equipped.has(p.id)) return false;
            if (SINGLE_EQUIP_CATEGORIES.has(p.category) && newState.equippedPartIds.some(id => PARTS_BY_ID[id]?.category === p.category)) return false;
            return true;
          });
          if (available.length > 0) {
            const pick = available[Math.floor(Math.random() * available.length)];
            newState.equippedPartIds = [...newState.equippedPartIds, pick.id];
          }
          break;
        }
        case 'removeNewest': {
          if (newState.equippedPartIds.length > 0) {
            const lastId = newState.equippedPartIds[newState.equippedPartIds.length - 1];
            const part = PARTS_BY_ID[lastId];
            newState.equippedPartIds = newState.equippedPartIds.slice(0, -1);
            if (part) newState.bits += part.cost;
          }
          break;
        }
        case 'randomStatPenalty': {
          const stats = ['precision', 'strength', 'perception', 'mobility', 'durability', 'adaptability', 'communication', 'social'];
          const stat = stats[Math.floor(Math.random() * stats.length)];
          newState.statModifiers[stat] = (newState.statModifiers[stat] || 0) + (opt.value || -1);
          break;
        }
        case 'statPenalty': {
          if (opt.stat) {
            newState.statModifiers[opt.stat] = (newState.statModifiers[opt.stat] || 0) + (opt.value || 0);
          }
          break;
        }
      }

      return newState;
    });
  }, []);

  const revealMysteryMission = useCallback(() => {
    const eligible = STANDARD_MISSIONS.filter(m => m.requirements);
    const revealed = eligible[Math.floor(Math.random() * eligible.length)];
    setState(prev => ({ ...prev, mysteryMissionRevealed: true, revealedMission: revealed }));
    return revealed;
  }, []);

  const pickCurveball = useCallback(() => {
    setState(prev => {
      const { forceCurveball } = prev.settings;
      let event;
      if (forceCurveball) {
        event = CURVEBALLS.find(c => c.id === forceCurveball) || CURVEBALLS[Math.floor(Math.random() * CURVEBALLS.length)];
      } else {
        event = CURVEBALLS[Math.floor(Math.random() * CURVEBALLS.length)];
      }
      return { ...prev, curveballEvent: event };
    });
  }, []);

  const pickQuestion = useCallback((questions) => {
    const q = questions[Math.floor(Math.random() * questions.length)];
    setState(prev => ({ ...prev, questionAsked: q }));
    return q;
  }, []);

  const answerQuestion = useCallback((selectedIndex, question) => {
    setState(prev => {
      let bitsGained = 0;
      let statBonus = {};
      if (question.type === 'ethical') {
        bitsGained = question.bitsReward || 0;
        statBonus = question.statBonuses?.[selectedIndex] || {};
      } else if (selectedIndex === question.correctIndex) {
        bitsGained = question.bitsReward || 0;
      }
      const newMods = { ...prev.statModifiers };
      for (const [s, v] of Object.entries(statBonus)) newMods[s] = (newMods[s] || 0) + v;
      return {
        ...prev,
        bits: prev.bits + bitsGained,
        bitsFromQuestion: bitsGained,
        statModifiers: newMods,
      };
    });
  }, []);

  const setSimulationResult = useCallback((result) => {
    setState(prev => ({ ...prev, simulationResult: result }));
  }, []);

  const addScore = useCallback((entry) => {
    setState(prev => ({
      ...prev,
      leaderboard: [...prev.leaderboard, { ...entry, id: Date.now() }].sort((a, b) => b.score - a.score),
    }));
  }, []);

  const clearLeaderboard = useCallback(() => setState(prev => ({ ...prev, leaderboard: [] })), []);

  const updateSettings = useCallback((updates) => {
    setState(prev => ({ ...prev, settings: { ...prev.settings, ...updates } }));
  }, []);

  const enableDevMode = useCallback(() => setState(prev => ({ ...prev, devMode: true })), []);
  const disableDevMode = useCallback(() => {
    setState(prev => ({
      ...prev, devMode: false,
      settings: { ...prev.settings, unlimitedBits: false, unlimitedTime: false, skipCurveball: false, skipQuestion: false, autoAnswerQuestion: false, skipSimulation: false, forceScore: null, noGlitchRisk: false, forceMissionId: null, forceCurveball: null },
    }));
  }, []);

  const addToast = useCallback((message, type = 'info') => {
    const id = ++toastCounter;
    setState(prev => ({ ...prev, toasts: [...prev.toasts, { id, message, type }] }));
    setTimeout(() => {
      setState(prev => ({ ...prev, toasts: prev.toasts.filter(t => t.id !== id) }));
    }, 3000);
  }, []);

  return {
    state, update, goTo, startNewGame, setMission,
    equipPart, unequipPart, canEquip,
    applyCurveballEffect, revealMysteryMission, pickCurveball, pickQuestion, answerQuestion,
    setSimulationResult, addScore, clearLeaderboard,
    updateSettings, enableDevMode, disableDevMode, addToast,
  };
}
