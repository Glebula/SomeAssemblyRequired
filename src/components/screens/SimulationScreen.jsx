import { useState, useEffect } from 'react';
import { SCREENS } from '../../hooks/useGameState';
import { calculateScore } from '../../utils/scoring';
import { ENVIRONMENTS } from '../../data/environments';

const ENV_SCENES = {
  'extreme-heat-low-visibility': { bg: '#1a0a00', color: '#ff6b35', scene: '🔥 Burning building' },
  'extreme-cold-low-visibility': { bg: '#001020', color: '#00f0ff', scene: '❄️ Blizzard conditions' },
  'extreme-heat-remote': { bg: '#1a0a00', color: '#ff6b35', scene: '🌋 Remote wildfire zone' },
  underwater: { bg: '#001525', color: '#06b6d4', scene: '🌊 Ocean depths' },
  'underwater-remote': { bg: '#000f1a', color: '#06b6d4', scene: '🌊 Deep sea' },
  'low-visibility': { bg: '#0a0a0a', color: '#8892b0', scene: '🌫️ Darkness' },
  'crowded-public': { bg: '#0a1020', color: '#22c55e', scene: '👥 Public space' },
  'remote-no-signal': { bg: '#0a0e1a', color: '#8892b0', scene: '📵 Remote area' },
  'unstable-terrain': { bg: '#100a00', color: '#f97316', scene: '⛰️ Unstable ground' },
  sterile: { bg: '#001020', color: '#e8eaf6', scene: '🏥 Sterile environment' },
  normal: { bg: '#0a0e1a', color: '#00b4ff', scene: '🏢 Standard conditions' },
};

function generateMoments(mission, breakdown, activeCombos, activeConflicts) {
  const moments = [];
  const stats = Object.entries(breakdown || {}).sort(([, a], [, b]) => b.actual - a.actual);

  // Best stat
  const best = stats.find(([, d]) => d.met);
  if (best) {
    const [stat, data] = best;
    moments.push({ text: `${stat.charAt(0).toUpperCase() + stat.slice(1)} check — ${data.actual}/${data.requirement} ✓`, type: 'success' });
  }

  // Combos
  if (activeCombos.length > 0) {
    moments.push({ text: `⚡ ${activeCombos[0].name} fires! ${activeCombos[0].description}`, type: 'combo' });
  }

  // Worst stat
  const worst = stats.reverse().find(([, d]) => !d.met);
  if (worst) {
    const [stat, data] = worst;
    moments.push({ text: `${stat.charAt(0).toUpperCase() + stat.slice(1)} insufficient — ${data.actual}/${data.requirement} ✗`, type: 'fail' });
  }

  // Conflicts
  if (activeConflicts.length > 0) {
    moments.push({ text: `⚠ ${activeConflicts[0].name}: ${activeConflicts[0].description}`, type: 'conflict' });
  }

  // Fill to 3 moments minimum
  if (moments.length < 3) {
    const allMet = stats.every(([, d]) => d.met);
    if (allMet) moments.push({ text: 'All systems nominal — mission proceeding!', type: 'success' });
    else moments.push({ text: 'Robot adapting to field conditions…', type: 'neutral' });
  }

  return moments.slice(0, 4);
}

export default function SimulationScreen({ state, goTo, setSimulationResult }) {
  const { mission, equippedPartIds, statModifiers, requirementOverrides, curveballMods, settings } = state;
  const [phase, setPhase] = useState('intro'); // intro | running | done
  const [visibleMoments, setVisibleMoments] = useState([]);
  const [score, setScore] = useState(0);
  const [targetScore, setTargetScore] = useState(0);
  const [result, setResult] = useState(null);

  const envKey = mission?.environment || 'normal';
  const envScene = ENV_SCENES[envKey] || ENV_SCENES.normal;

  useEffect(() => {
    // Compute score
    const effectiveReqs = requirementOverrides
      ? Object.keys(requirementOverrides).reduce((acc, k) => {
          acc[k] = (mission?.requirements?.[k] || 0) + (requirementOverrides[k] || 0);
          return acc;
        }, { ...(mission?.requirements || {}) })
      : mission?.requirements;

    const missionWithOverrides = { ...mission, requirements: effectiveReqs };

    let computed;
    if (settings?.forceScore !== null && settings?.forceScore !== undefined) {
      const grade = settings.forceScore >= 85 ? 'gold' : settings.forceScore >= 70 ? 'silver' : settings.forceScore >= 50 ? 'bronze' : 'failed';
      computed = { total: settings.forceScore, grade, breakdown: {}, activeCombos: [], activeConflicts: [] };
    } else {
      computed = calculateScore(equippedPartIds, missionWithOverrides, statModifiers, curveballMods, settings?.noGlitchRisk);
    }

    setResult(computed);
    setTargetScore(computed.total);

    const moments = generateMoments(mission, computed.breakdown, computed.activeCombos, computed.activeConflicts);

    // Animate phases
    const t1 = setTimeout(() => {
      setPhase('running');
      moments.forEach((m, i) => {
        setTimeout(() => setVisibleMoments(prev => [...prev, m]), i * 1800);
      });
    }, 800);

    const totalTime = 800 + moments.length * 1800 + 1000;
    const t2 = setTimeout(() => {
      setPhase('done');
      setSimulationResult(computed);
    }, totalTime);

    // Score counter animation
    let frame = 0;
    const frames = 40;
    const interval = totalTime / frames;
    const scoreTimer = setInterval(() => {
      frame++;
      setScore(Math.round((frame / frames) * computed.total));
      if (frame >= frames) clearInterval(scoreTimer);
    }, interval);

    return () => { clearTimeout(t1); clearTimeout(t2); clearInterval(scoreTimer); };
  }, []);

  useEffect(() => {
    if (phase === 'done') {
      const t = setTimeout(() => goTo(SCREENS.RESULTS), 1500);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const gradeColor = score >= 85 ? '#ffd700' : score >= 70 ? '#a8a9ad' : score >= 50 ? '#cd7f32' : '#ef4444';

  return (
    <div style={{
      minHeight: '100vh',
      background: envScene.bg,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Environment glow */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 200,
        background: `radial-gradient(ellipse at 50% 0%, ${envScene.color}20 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: '#8892b0', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 }}>
            Field Test
          </div>
          <div style={{ fontSize: 16, color: envScene.color, fontWeight: 700 }}>{envScene.scene}</div>
        </div>

        {/* Score meter */}
        <div style={{
          background: '#12172e', border: `2px solid ${gradeColor}40`,
          borderRadius: 20, padding: '24px',
          textAlign: 'center', marginBottom: 20,
        }}>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 72, fontWeight: 700,
            color: gradeColor,
            lineHeight: 1,
            textShadow: `0 0 30px ${gradeColor}60`,
            transition: 'color 0.3s',
          }}>
            {score}
          </div>
          <div style={{ color: '#8892b0', fontFamily: 'JetBrains Mono, monospace', fontSize: 16 }}>/ 100</div>
        </div>

        {/* Moments */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {visibleMoments.map((m, i) => {
            const colors = { success: '#34d399', fail: '#ef4444', combo: '#fbbf24', conflict: '#f97316', neutral: '#8892b0' };
            const c = colors[m.type] || colors.neutral;
            return (
              <div key={i} className="animate-slide-up" style={{
                padding: '10px 14px',
                background: `${c}10`,
                border: `1px solid ${c}30`,
                borderRadius: 10,
                color: c, fontSize: 13, fontWeight: 600,
                fontFamily: 'Space Grotesk, sans-serif',
              }}>
                {m.text}
              </div>
            );
          })}
        </div>

        {phase === 'done' && (
          <div className="animate-fade-in" style={{ textAlign: 'center', marginTop: 20, color: '#8892b0', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', animation: 'pulse 0.5s ease-in-out infinite' }}>
            Calculating results…
          </div>
        )}
      </div>
    </div>
  );
}
