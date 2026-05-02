import { useGameState, SCREENS } from './hooks/useGameState';
import HomeScreen from './components/screens/HomeScreen';
import DrawMission from './components/screens/DrawMission';
import BuildScreen from './components/screens/BuildScreen';
import CurveballScreen from './components/screens/CurveballScreen';
import QuestionScreen from './components/screens/QuestionScreen';
import SimulationScreen from './components/screens/SimulationScreen';
import ResultsScreen from './components/screens/ResultsScreen';
import SettingsScreen from './components/screens/SettingsScreen';
import LeaderboardScreen from './components/screens/LeaderboardScreen';
import DevBadge from './components/common/DevBadge';

export default function App() {
  const game = useGameState();
  const { state } = game;

  function renderScreen() {
    switch (state.screen) {
      case SCREENS.HOME:
        return <HomeScreen goTo={game.goTo} />;
      case SCREENS.DRAW_MISSION:
        return <DrawMission state={state} goTo={game.goTo} setMission={game.setMission} />;
      case SCREENS.BUILD:
        return (
          <BuildScreen
            state={state}
            goTo={game.goTo}
            equipPart={game.equipPart}
            unequipPart={game.unequipPart}
            addToast={game.addToast}
            revealMysteryMission={game.revealMysteryMission}
            update={game.update}
          />
        );
      case SCREENS.CURVEBALL:
        return (
          <CurveballScreen
            state={state}
            goTo={game.goTo}
            pickCurveball={game.pickCurveball}
            applyCurveballEffect={game.applyCurveballEffect}
          />
        );
      case SCREENS.QUESTION:
        return (
          <QuestionScreen
            state={state}
            goTo={game.goTo}
            pickQuestion={game.pickQuestion}
            answerQuestion={game.answerQuestion}
          />
        );
      case SCREENS.SIMULATION:
        return (
          <SimulationScreen
            state={state}
            goTo={game.goTo}
            setSimulationResult={game.setSimulationResult}
          />
        );
      case SCREENS.RESULTS:
        return (
          <ResultsScreen
            state={state}
            goTo={game.goTo}
            startNewGame={game.startNewGame}
            addScore={game.addScore}
          />
        );
      case SCREENS.SETTINGS:
        return (
          <SettingsScreen
            state={state}
            goTo={game.goTo}
            updateSettings={game.updateSettings}
            enableDevMode={game.enableDevMode}
            disableDevMode={game.disableDevMode}
          />
        );
      case SCREENS.LEADERBOARD:
        return (
          <LeaderboardScreen
            state={state}
            goTo={game.goTo}
            addScore={game.addScore}
            clearLeaderboard={game.clearLeaderboard}
          />
        );
      default:
        return <HomeScreen goTo={game.goTo} />;
    }
  }

  return (
    <>
      <DevBadge devMode={state.devMode} />
      {renderScreen()}
    </>
  );
}
