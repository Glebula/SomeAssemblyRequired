import { useState, useCallback } from 'react';
import { MISSIONS } from '../data/missions';

export const SCREENS = {
  HOME: 'home',
  CODE_ENTRY: 'code-entry',
  MISSION_BRIEFING: 'mission-briefing',
  BUILD: 'build',
  CURVEBALL: 'curveball',
  QUESTIONS: 'questions',
  SIMULATION: 'simulation',
  RESULTS: 'results',
  SETTINGS: 'settings',
  LEADERBOARD: 'leaderboard'
};

const INITIAL_STATE = {
  screen: SCREENS.HOME,
  mission: null,
  missionCode: null,
  difficulty: null,
  bits: 80,
  equippedPartIds: [],
  curveballEvent: null,
  curveballPenalty: 0,
  questionsAnswered: [],
  bitsFromQuestions: 0,
  simulationResult: null,
  finalScore: null,
  devMode: false,
  settings: {
    leaderboardMode: false,
    eventName: '',
    sound: true,
    unlimitedBits: false,
    unlimitedTime: false,
    noWeightLimit: false,
    noPowerLimit: false,
    skipCurveball: false,
    skipQuestions: false,
    autoAnswerQuestions: false,
    skipSimulation: false,
    forceScore: null,
    noGlitchRisk: false,
    showStatsOverlay: false,
    showScoringBreakdown: false,
    forceDifficulty: null,
    forceCurveball: null,
  },
  leaderboard: [],
  mysterMissionRevealed: false,
  mysteryMissionRequirements: null,
};

export function useGameState() {
  const [state, setState] = useState(INITIAL_STATE);

  const update = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const goTo = useCallback((screen) => {
    setState(prev => ({ ...prev, screen }));
  }, []);

  const startNewGame = useCallback(() => {
    setState(prev => ({
      ...INITIAL_STATE,
      devMode: prev.devMode,
      settings: prev.settings,
      leaderboard: prev.leaderboard,
      screen: SCREENS.CODE_ENTRY
    }));
  }, []);

  const setMission = useCallback((code, mission, difficulty) => {
    const difficultyBits = { bronze: 80, silver: 65, gold: 50 }[difficulty] || 80;
    setState(prev => ({
      ...prev,
      missionCode: code,
      mission,
      difficulty,
      bits: difficultyBits,
      equippedPartIds: [],
      curveballPenalty: 0,
      questionsAnswered: [],
      bitsFromQuestions: 0,
      mysterMissionRevealed: false,
      mysteryMissionRequirements: null
    }));
  }, []);

  const equipPart = useCallback((partId, cost) => {
    setState(prev => ({
      ...prev,
      equippedPartIds: [...prev.equippedPartIds, partId],
      bits: prev.settings.unlimitedBits ? prev.bits : prev.bits - cost
    }));
  }, []);

  const unequipPart = useCallback((partId, refund) => {
    setState(prev => ({
      ...prev,
      equippedPartIds: prev.equippedPartIds.filter(id => id !== partId),
      bits: prev.bits + refund
    }));
  }, []);

  const addScore = useCallback((entry) => {
    setState(prev => ({
      ...prev,
      leaderboard: [...prev.leaderboard, { ...entry, id: Date.now() }]
        .sort((a, b) => b.score - a.score)
    }));
  }, []);

  const clearLeaderboard = useCallback(() => {
    setState(prev => ({ ...prev, leaderboard: [] }));
  }, []);

  const updateSettings = useCallback((updates) => {
    setState(prev => ({ ...prev, settings: { ...prev.settings, ...updates } }));
  }, []);

  const enableDevMode = useCallback(() => {
    setState(prev => ({ ...prev, devMode: true }));
  }, []);

  const disableDevMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      devMode: false,
      settings: {
        ...prev.settings,
        unlimitedBits: false,
        unlimitedTime: false,
        noWeightLimit: false,
        noPowerLimit: false,
        skipCurveball: false,
        skipQuestions: false,
        autoAnswerQuestions: false,
        skipSimulation: false,
        forceScore: null,
        noGlitchRisk: false
      }
    }));
  }, []);

  return {
    state,
    update,
    goTo,
    startNewGame,
    setMission,
    equipPart,
    unequipPart,
    addScore,
    clearLeaderboard,
    updateSettings,
    enableDevMode,
    disableDevMode
  };
}
