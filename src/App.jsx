import { useGameState, SCREENS } from './hooks/useGameState';
import HomeScreen from './components/screens/HomeScreen';
import CodeEntry from './components/screens/CodeEntry';
import MissionBriefing from './components/screens/MissionBriefing';
import BuildScreen from './components/screens/BuildScreen';
import CurveballScreen from './components/screens/CurveballScreen';
import QuestionsScreen from './components/screens/QuestionsScreen';
import SimulationScreen from './components/screens/SimulationScreen';
import ResultsScreen from './components/screens/ResultsScreen';
import SettingsScreen from './components/screens/SettingsScreen';
import LeaderboardScreen from './components/screens/LeaderboardScreen';
import DevBadge from './components/common/DevBadge';

export default function App() {
  const {
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
  } = useGameState();

  const { screen, devMode } = state;

  const renderScreen = () => {
    switch (screen) {
      case SCREENS.HOME:
        return <HomeScreen goTo={goTo} />;

      case SCREENS.CODE_ENTRY:
        return (
          <CodeEntry
            goTo={goTo}
            setMission={setMission}
            devMode={devMode}
            settings={state.settings}
          />
        );

      case SCREENS.MISSION_BRIEFING:
        return <MissionBriefing state={state} goTo={goTo} />;

      case SCREENS.BUILD:
        return (
          <BuildScreen
            state={state}
            goTo={goTo}
            update={update}
            equipPart={equipPart}
            unequipPart={unequipPart}
          />
        );

      case SCREENS.CURVEBALL:
        return (
          <CurveballScreen
            state={state}
            goTo={goTo}
            update={update}
            unequipPart={unequipPart}
          />
        );

      case SCREENS.QUESTIONS:
        return (
          <QuestionsScreen
            state={state}
            goTo={goTo}
            update={update}
          />
        );

      case SCREENS.SIMULATION:
        return (
          <SimulationScreen
            state={state}
            goTo={goTo}
            update={update}
          />
        );

      case SCREENS.RESULTS:
        return (
          <ResultsScreen
            state={state}
            goTo={goTo}
            startNewGame={startNewGame}
            addScore={addScore}
          />
        );

      case SCREENS.SETTINGS:
        return (
          <SettingsScreen
            state={state}
            goTo={goTo}
            updateSettings={updateSettings}
            enableDevMode={enableDevMode}
            disableDevMode={disableDevMode}
          />
        );

      case SCREENS.LEADERBOARD:
        return (
          <LeaderboardScreen
            state={state}
            goTo={goTo}
            addScore={addScore}
            clearLeaderboard={clearLeaderboard}
          />
        );

      default:
        return <HomeScreen goTo={goTo} />;
    }
  };

  return (
    <>
      {renderScreen()}
      {devMode && <DevBadge />}
    </>
  );
}
