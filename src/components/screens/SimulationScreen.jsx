import { useState, useEffect, useRef } from 'react';
import { SCREENS } from '../../hooks/useGameState';
import { calculateScore, calculateStats, getActiveCombos, getActiveConflicts } from '../../utils/scoring';
import { PARTS } from '../../data/parts';
import { ENVIRONMENTS } from '../../data/environments';

function generateScenarios(mission, equippedPartIds, stats, activeConflicts, activeCombos) {
  const env = ENVIRONMENTS[mission?.environment] || ENVIRONMENTS['normal'];
  const scenarios = [];

  // Frame check
  const hasFrame = equippedPartIds.some(id => PARTS.find(p => p.id === id)?.category === 'frame');
  if (hasFrame) {
    scenarios.push({ text: 'Structural integrity check... Frame holding steady!', outcome: 'success' });
  } else {
    scenarios.push({ text: 'No frame detected — robot is unstable!', outcome: 'fail' });
  }

  // Environment check
  if (env.effects.requiresWaterproofing) {
    const hasWaterproof = equippedPartIds.some(id => {
      const p = PARTS.find(p => p.id === id);
      return p?.specialRules?.waterproof;
    });
    if (hasWaterproof) {
      scenarios.push({ text: `Entering ${env.name}... Waterproofing seal holding! ✅`, outcome: 'success' });
    } else {
      scenarios.push({ text: `ALERT: No waterproofing detected! Water damage imminent!`, outcome: 'fail' });
    }
  }

  if (env.effects.requiresHeatShield) {
    const hasHeat = equippedPartIds.some(id => PARTS.find(p => p.id === id)?.specialRules?.heatImmune);
    scenarios.push({
      text: hasHeat
        ? `Heat shield active — thermal protection holding!`
        : `WARNING: Extreme heat detected — components at risk!`,
      outcome: hasHeat ? 'success' : 'warn'
    });
  }

  // Stat-based scenarios
  const req = mission?.requirements;
  if (req) {
    if (req.perception >= 3) {
      const val = stats.perception;
      scenarios.push({
        text: val >= req.perception
          ? `Sensors scanning environment... ${val >= 4 ? 'Comprehensive scan complete!' : 'Target located!'} ✅`
          : `Sensor range insufficient — struggling to detect targets... ⚠`,
        outcome: val >= req.perception ? 'success' : 'warn'
      });
    }

    if (req.strength >= 3) {
      const val = stats.strength;
      scenarios.push({
        text: val >= req.strength
          ? `Applying force — ${val >= 4 ? 'effortless!' : 'objective cleared!'} ✅`
          : `Insufficient strength — struggling with load!`,
        outcome: val >= req.strength ? 'success' : 'warn'
      });
    }

    if (req.communication >= 3) {
      const val = stats.communication;
      scenarios.push({
        text: val >= req.communication
          ? `Communication established with base! Coordinates transmitted.`
          : `⚠ Communication failure — unable to relay critical data!`,
        outcome: val >= req.communication ? 'success' : 'fail'
      });
    }

    if (req.social >= 4) {
      const val = stats.social;
      scenarios.push({
        text: val >= req.social
          ? `Social interaction protocols engaged — ${val >= 5 ? 'excellent rapport established!' : 'people responding positively!'}`
          : `Robot's social behavior raising concerns with bystanders...`,
        outcome: val >= req.social ? 'success' : 'warn'
      });
    }

    if (req.mobility >= 3) {
      const val = stats.mobility;
      scenarios.push({
        text: val >= req.mobility
          ? `Navigating terrain successfully!`
          : `Mobility issues — terrain challenging robot movement!`,
        outcome: val >= req.mobility ? 'success' : 'warn'
      });
    }

    if (req.adaptability >= 3) {
      const val = stats.adaptability;
      scenarios.push({
        text: val >= req.adaptability
          ? `Unexpected obstacle encountered — adapting protocol in real-time!`
          : `Unexpected situation — robot freezing, unable to adapt!`,
        outcome: val >= req.adaptability ? 'success' : 'fail'
      });
    }

    if (req.precision >= 3) {
      const val = stats.precision;
      scenarios.push({
        text: val >= req.precision
          ? `Precision operation underway — ${val >= 5 ? 'sub-millimeter accuracy achieved!' : 'task completed accurately!'}`
          : `Precision too low — errors accumulating!`,
        outcome: val >= req.precision ? 'success' : 'fail'
      });
    }

    if (req.durability >= 3) {
      const val = stats.durability;
      scenarios.push({
        text: val >= req.durability
          ? `Impact sustained — structural integrity maintained!`
          : `Structural damage detected — durability at risk!`,
        outcome: val >= req.durability ? 'success' : 'warn'
      });
    }
  }

  // Combo scenarios
  activeCombos.forEach(combo => {
    scenarios.push({
      text: `⚡ ${combo} activates — synergy boost engaged!`,
      outcome: 'combo'
    });
  });

  // Conflict scenarios
  activeConflicts.forEach(conflict => {
    scenarios.push({
      text: `⚠ ${conflict.name}: ${conflict.effect}`,
      outcome: 'conflict'
    });
  });

  // Glitch
  const hasALM = equippedPartIds.includes(17);
  const hasRepairKit = equippedPartIds.includes(34);
  const glitchOccurred = hasALM && Math.random() < 0.10;
  if (hasALM && glitchOccurred && !hasRepairKit) {
    scenarios.splice(Math.floor(scenarios.length / 2), 0, {
      text: `💥 Adaptive Learning Module glitches! Processing error... ${hasRepairKit ? 'Repair Kit activates — recovered!' : 'System unstable!'}`,
      outcome: hasRepairKit ? 'success' : 'warn'
    });
  }

  // Final verdict
  scenarios.push({ text: 'Mission complete — field test concluding...', outcome: 'final' });

  return { scenarios: scenarios.slice(0, 8), glitchOccurred: glitchOccurred && !hasRepairKit };
}

export default function SimulationScreen({ state, goTo, update }) {
  const { mission, equippedPartIds, difficulty, curveballPenalty, settings, devMode } = state;
  const [step, setStep] = useState(-1);
  const [scenarios, setScenarios] = useState([]);
  const [displayedScenarios, setDisplayedScenarios] = useState([]);
  const [scoreAnim, setScoreAnim] = useState(0);
  const [finalScore, setFinalScore] = useState(null);
  const [glitchOccurred, setGlitchOccurred] = useState(false);
  const intervalRef = useRef(null);

  const activeCombos = getActiveCombos(equippedPartIds, mission?.category);
  const activeConflicts = getActiveConflicts(equippedPartIds);
  const currentStats = calculateStats(equippedPartIds, activeConflicts, activeCombos, mission);
  const env = ENVIRONMENTS[mission?.environment] || ENVIRONMENTS['normal'];

  useEffect(() => {
    if (settings?.skipSimulation && devMode) {
      const forced = settings?.forceScore ?? null;
      const result = forced !== null
        ? { total: forced, grade: forced >= 85 ? 'gold' : forced >= 70 ? 'silver' : forced >= 50 ? 'bronze' : 'failed', breakdown: {}, activeCombos, activeConflicts }
        : calculateScore(equippedPartIds, state.mysteryMissionRequirements ? { ...mission, requirements: state.mysteryMissionRequirements } : mission, difficulty, curveballPenalty || 0, false);
      update({ simulationResult: result, finalScore: result.total });
      goTo(SCREENS.RESULTS);
      return;
    }

    const { scenarios: s, glitchOccurred: g } = generateScenarios(
      state.mysteryMissionRequirements ? { ...mission, requirements: state.mysteryMissionRequirements } : mission,
      equippedPartIds, currentStats, activeConflicts, activeCombos
    );
    setScenarios(s);
    setGlitchOccurred(g);

    // Play out scenarios one by one
    let idx = 0;
    const stepDuration = 2000;

    intervalRef.current = setInterval(() => {
      setStep(idx);
      setDisplayedScenarios(prev => [...prev, s[idx]]);
      idx++;
      if (idx >= s.length) {
        clearInterval(intervalRef.current);
        // Calculate final score
        setTimeout(() => {
          const effectiveMission = state.mysteryMissionRequirements
            ? { ...mission, requirements: state.mysteryMissionRequirements }
            : mission;
          const result = settings?.forceScore != null && devMode
            ? { total: settings.forceScore, grade: settings.forceScore >= 85 ? 'gold' : settings.forceScore >= 70 ? 'silver' : settings.forceScore >= 50 ? 'bronze' : 'failed', breakdown: {}, activeCombos, activeConflicts }
            : calculateScore(equippedPartIds, effectiveMission, difficulty, curveballPenalty || 0, settings?.noGlitchRisk && devMode ? false : g);
          setFinalScore(result.total);
          update({ simulationResult: result, finalScore: result.total });
          animateScore(result.total);
        }, 500);
      }
    }, stepDuration);

    return () => clearInterval(intervalRef.current);
  }, []);

  function animateScore(target) {
    let current = 0;
    const increment = target / 30;
    const anim = setInterval(() => {
      current = Math.min(current + increment, target);
      setScoreAnim(Math.round(current));
      if (current >= target) clearInterval(anim);
    }, 50);
  }

  const outcomeIcon = { success: '✅', warn: '⚠️', fail: '❌', combo: '⚡', conflict: '🔥', final: '🏁' };
  const outcomeColor = { success: '#34d399', warn: '#fbbf24', fail: '#ef4444', combo: '#fbbf24', conflict: '#ef4444', final: '#00f0ff' };

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0e1a', padding: 24,
      display: 'flex', flexDirection: 'column', alignItems: 'center'
    }} className="bg-grid">
      <div style={{ maxWidth: 640, width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#8892b0', letterSpacing: '0.2em', marginBottom: 8 }}>
            FIELD TEST
          </div>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(20px, 4vw, 28px)',
            fontWeight: 700, color: '#e8eaf6', marginBottom: 4, marginTop: 0
          }}>
            {mission?.title}
          </h2>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#00b4ff'
          }}>
            {env.icon} {env.name}
          </span>
        </div>

        {/* Score meter */}
        {finalScore !== null && (
          <div className="animate-slide-down-in" style={{
            background: '#12172e', border: '1px solid #2a3060',
            borderRadius: 12, padding: 20, marginBottom: 20, textAlign: 'center'
          }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#8892b0', marginBottom: 8, letterSpacing: '0.1em' }}>
              FINAL SCORE
            </div>
            <div className="animate-number-pop" style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 56, fontWeight: 700,
              color: finalScore >= 85 ? '#ffd700' : finalScore >= 70 ? '#a8a9ad' : finalScore >= 50 ? '#cd7f32' : '#ef4444',
              lineHeight: 1
            }}>
              {scoreAnim}
            </div>
            <div style={{ color: '#8892b0', fontSize: 14, fontFamily: 'Space Grotesk, sans-serif' }}>/ 100</div>
          </div>
        )}

        {/* Scenario feed */}
        <div style={{
          background: '#12172e', border: '1px solid #2a3060',
          borderRadius: 12, padding: 20, marginBottom: 20,
          minHeight: 200
        }}>
          {displayedScenarios.map((scenario, i) => (
            <div
              key={i}
              className="animate-slide-up"
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '8px 0',
                borderBottom: i < displayedScenarios.length - 1 ? '1px solid rgba(42,48,96,0.5)' : 'none'
              }}
            >
              <span style={{ fontSize: 16, flexShrink: 0 }}>{outcomeIcon[scenario.outcome] || '•'}</span>
              <p style={{
                margin: 0, fontSize: 14, lineHeight: 1.5,
                color: outcomeColor[scenario.outcome] || '#8892b0',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                {scenario.text}
              </p>
            </div>
          ))}

          {displayedScenarios.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <div className="animate-blink" style={{ fontSize: 24, marginBottom: 8 }}>🤖</div>
              <p style={{ color: '#8892b0', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>
                Deploying robot...
              </p>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ height: 4, background: '#1a1f3a', borderRadius: 2 }}>
            <div style={{
              height: '100%', borderRadius: 2,
              width: `${scenarios.length > 0 ? ((step + 1) / scenarios.length) * 100 : 0}%`,
              background: 'linear-gradient(90deg, #00b4ff, #00f0ff)',
              transition: 'width 1.8s ease'
            }} />
          </div>
        </div>

        {/* See Results button */}
        {finalScore !== null && (
          <button
            className="animate-slide-up"
            onClick={() => goTo(SCREENS.RESULTS)}
            style={{
              width: '100%', padding: '16px',
              background: 'linear-gradient(135deg, #00b4ff, #0080cc)',
              border: 'none', borderRadius: 12, color: 'white',
              fontSize: 16, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'Space Grotesk, sans-serif',
              boxShadow: '0 4px 30px rgba(0,180,255,0.4)'
            }}
          >
            See Results →
          </button>
        )}
      </div>
    </div>
  );
}
