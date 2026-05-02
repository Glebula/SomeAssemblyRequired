import { useState } from 'react';
import { SCREENS } from '../../hooks/useGameState';
import { MISSIONS } from '../../data/missions';

const STAT_ICONS = { precision:'🎯', strength:'💪', perception:'👁️', mobility:'⚡', durability:'🛡️', adaptability:'🧠', communication:'📡', social:'🤝' };
const STAT_PART_TIP = {
  precision: 'Precision Servo Arms or Pressure Sensors',
  strength: 'Heavy Lift Claws or Heavy Tank Frame',
  perception: 'Thermal Camera or LIDAR Array',
  mobility: 'Speed Boosters or Light Scout Frame',
  durability: 'Reinforced Armor or Heavy Tank Frame',
  adaptability: 'Adaptive Learning Module or Decision Engine',
  communication: 'Voice Synthesizer or Translation Module',
  social: 'Emotion Display Screen or Companion Personality Module',
};
const GRADE_CONFIG = {
  gold:   { color: '#ffd700', label: 'GOLD',   emoji: '🏆', message: 'Outstanding! Your robot was perfectly suited for this mission.' },
  silver: { color: '#a8a9ad', label: 'SILVER', emoji: '🥈', message: 'Great work! Your robot performed well with a few gaps.' },
  bronze: { color: '#cd7f32', label: 'BRONZE', emoji: '🥉', message: 'Solid effort! Some stats fell short but you made it work.' },
  failed: { color: '#ef4444', label: 'MISSION FAILED', emoji: '💥', message: 'Your robot struggled significantly. Review the gaps and try again!' },
};

export default function ResultsScreen({ state, goTo, startNewGame, addScore }) {
  const { simulationResult, mission, settings } = state;
  if (!simulationResult) return null;

  const { total, grade, breakdown, activeCombos, activeConflicts } = simulationResult;
  const gc = GRADE_CONFIG[grade] || GRADE_CONFIG.failed;

  // Best stat above requirement
  let bestStat = null, bestOver = 0, worstStat = null, worstGap = 0;
  if (breakdown) {
    Object.entries(breakdown).forEach(([stat, d]) => {
      const over = d.actual - d.requirement;
      if (over > bestOver) { bestOver = over; bestStat = stat; }
      const gap = d.requirement - d.actual;
      if (gap > worstGap) { worstGap = gap; worstStat = stat; }
    });
  }

  const whatWorked = bestStat && bestOver > 0
    ? `${bestStat.charAt(0).toUpperCase() + bestStat.slice(1)} was ${bestOver} point${bestOver > 1 ? 's' : ''} above target`
    : 'Well-rounded build — all stats met!';

  return (
    <div className="bg-grid" style={{ minHeight: '100vh', background: '#0a0e1a', padding: '24px 16px' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        {/* Score card */}
        <div className="animate-fade-in" style={{
          textAlign: 'center', padding: '40px 24px',
          background: '#12172e', borderRadius: 24,
          border: `2px solid ${gc.color}40`,
          marginBottom: 20, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${gc.color}, transparent)` }} />

          <div style={{ fontSize: 52, marginBottom: 12 }}>{gc.emoji}</div>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 'clamp(64px, 14vw, 96px)',
            fontWeight: 700, color: gc.color, lineHeight: 1,
            textShadow: `0 0 40px ${gc.color}60`,
          }}>
            {total}
          </div>
          <div style={{ color: '#8892b0', fontFamily: 'JetBrains Mono, monospace', fontSize: 18, marginBottom: 10 }}>/ 100</div>

          <div style={{
            display: 'inline-block', padding: '6px 20px', borderRadius: 20,
            background: `${gc.color}20`, color: gc.color,
            border: `2px solid ${gc.color}`,
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 18, marginBottom: 14,
          }}>
            {gc.label}
          </div>

          <p style={{ color: '#8892b0', fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, margin: 0 }}>
            {gc.message}
          </p>

          {activeCombos?.length > 0 && (
            <div style={{ marginTop: 12, fontSize: 12, color: '#fbbf24' }}>
              ⚡ {activeCombos.map(c => c.name).join(' + ')}
            </div>
          )}

          {/* Leaderboard entry */}
          {settings?.leaderboardMode && (
            <div style={{ marginTop: 20 }}>
              <AddToLeaderboard score={total} missionTitle={mission?.title} addScore={addScore} />
            </div>
          )}
        </div>

        {/* Performance card */}
        <div style={{ background: '#12172e', border: '1px solid #2a3060', borderRadius: 16, padding: '20px', marginBottom: 20 }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#8892b0', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>
            Performance
          </div>

          <div style={{ padding: '12px 14px', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 10, marginBottom: 10 }}>
            <div style={{ color: '#34d399', fontSize: 14, fontWeight: 700 }}>
              ✅ What worked: {whatWorked}
            </div>
          </div>

          {worstStat && worstGap > 0 && (
            <div style={{ padding: '12px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, marginBottom: 10 }}>
              <div style={{ color: '#ef4444', fontSize: 14, fontWeight: 700 }}>
                ❌ Biggest gap: {worstStat.charAt(0).toUpperCase() + worstStat.slice(1)} was {worstGap} point{worstGap > 1 ? 's' : ''} short
              </div>
            </div>
          )}

          <div style={{ padding: '12px 14px', background: 'rgba(0,180,255,0.08)', border: '1px solid rgba(0,180,255,0.25)', borderRadius: 10 }}>
            <div style={{ color: '#00b4ff', fontSize: 14, fontWeight: 700 }}>
              {worstStat && STAT_PART_TIP[worstStat]
                ? `💡 Tip: Boost ${worstStat} next time with ${STAT_PART_TIP[worstStat]}`
                : '💡 Tip: Try a higher difficulty for more of a challenge!'
              }
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={startNewGame}
            style={{
              flex: 2, padding: '16px',
              background: 'linear-gradient(135deg, #00b4ff, #0066cc)',
              border: 'none', borderRadius: 12, color: 'white',
              fontSize: 16, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'Space Grotesk, sans-serif',
              boxShadow: '0 4px 24px rgba(0,180,255,0.4)',
            }}
          >
            🔄 Play Again
          </button>
          {settings?.leaderboardMode && (
            <button
              onClick={() => goTo(SCREENS.LEADERBOARD)}
              style={{
                flex: 1, padding: '16px',
                background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.4)',
                borderRadius: 12, color: '#fbbf24',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'Space Grotesk, sans-serif',
              }}
            >
              🏆 Board
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function AddToLeaderboard({ score, missionTitle, addScore }) {
  const [name, setName] = useState('');
  const [added, setAdded] = useState(false);
  if (added) return <p style={{ color: '#34d399', fontSize: 14 }}>✓ Added to leaderboard!</p>;
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && name.trim() && (addScore({ name: name.trim(), score, mission: missionTitle }), setAdded(true))}
        placeholder="Your name"
        style={{ padding: '8px 12px', background: '#1a1f3a', border: '1px solid #2a3060', borderRadius: 8, color: '#e8eaf6', fontSize: 14, fontFamily: 'Space Grotesk, sans-serif', maxWidth: 180 }}
      />
      <button
        onClick={() => name.trim() && (addScore({ name: name.trim(), score, mission: missionTitle }), setAdded(true))}
        style={{ padding: '8px 14px', background: 'rgba(251,191,36,0.2)', border: '1px solid rgba(251,191,36,0.5)', borderRadius: 8, color: '#fbbf24', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}
      >
        + Add
      </button>
    </div>
  );
}
