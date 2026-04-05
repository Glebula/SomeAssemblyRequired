import { useState } from 'react';
import { SCREENS } from '../../hooks/useGameState';
import { PARTS } from '../../data/parts';

const STAT_LABELS = {
  precision: 'Precision', strength: 'Strength', perception: 'Perception',
  mobility: 'Mobility', durability: 'Durability', adaptability: 'Adaptability',
  communication: 'Communication', social: 'Social'
};

const GRADE_CONFIG = {
  gold: { color: '#ffd700', label: 'GOLD', emoji: '🏆', message: 'Outstanding! Your robot was perfectly suited for this mission.' },
  silver: { color: '#a8a9ad', label: 'SILVER', emoji: '🥈', message: 'Great work! Your robot performed well with a few gaps.' },
  bronze: { color: '#cd7f32', label: 'BRONZE', emoji: '🥉', message: 'Solid effort! Some stats fell short but you made it work.' },
  failed: { color: '#ef4444', label: 'MISSION FAILED', emoji: '💥', message: 'Your robot struggled significantly. Review the gaps and try again!' }
};

export default function ResultsScreen({ state, goTo, startNewGame, addScore }) {
  const { simulationResult, mission, missionCode, equippedPartIds, settings } = state;

  if (!simulationResult) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0e1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#8892b0', fontFamily: 'Space Grotesk, sans-serif' }}>No results yet.</p>
      </div>
    );
  }

  const { total, grade, breakdown, activeCombos, activeConflicts } = simulationResult;
  const gradeConfig = GRADE_CONFIG[grade] || GRADE_CONFIG.failed;

  // Find best part and biggest weakness
  let biggestWeakness = null;
  let biggestWeaknessGap = 0;
  let bestStat = null;
  let bestStatOver = 0;

  if (breakdown) {
    Object.entries(breakdown).forEach(([stat, data]) => {
      const gap = data.requirement - data.actual;
      if (gap > biggestWeaknessGap) { biggestWeaknessGap = gap; biggestWeakness = stat; }
      const over = data.actual - data.requirement;
      if (over > bestStatOver) { bestStatOver = over; bestStat = stat; }
    });
  }

  // Find best part
  const bestPart = equippedPartIds.length > 0
    ? PARTS.find(p => p.id === equippedPartIds[0])
    : null;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a', padding: '24px' }} className="bg-grid">
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        {/* Score display */}
        <div className="animate-fade-in" style={{
          textAlign: 'center', padding: '40px 24px',
          background: '#12172e', borderRadius: 20,
          border: `2px solid ${gradeConfig.color}40`,
          marginBottom: 24, position: 'relative', overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 3,
            background: `linear-gradient(90deg, transparent, ${gradeConfig.color}, transparent)`
          }} />

          <div style={{ fontSize: 56, marginBottom: 12 }}>{gradeConfig.emoji}</div>

          <div style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 'clamp(64px, 12vw, 96px)',
            fontWeight: 700, color: gradeConfig.color, lineHeight: 1,
            textShadow: `0 0 40px ${gradeConfig.color}60`
          }}>
            {total}
          </div>
          <div style={{ color: '#8892b0', fontFamily: 'JetBrains Mono, monospace', fontSize: 18, marginBottom: 8 }}>/ 100</div>

          <div style={{
            display: 'inline-block', padding: '6px 20px', borderRadius: 20,
            background: `${gradeConfig.color}20`, color: gradeConfig.color,
            border: `2px solid ${gradeConfig.color}`,
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 18,
            marginBottom: 16
          }}>
            {gradeConfig.label}
          </div>

          <p style={{ color: '#8892b0', fontFamily: 'Space Grotesk, sans-serif', fontSize: 16, margin: 0 }}>
            {gradeConfig.message}
          </p>

          {/* Share score */}
          {settings?.leaderboardMode && (
            <div style={{ marginTop: 20 }}>
              <AddToLeaderboard score={total} missionTitle={mission?.title} addScore={addScore} />
            </div>
          )}
        </div>

        {/* Stat breakdown */}
        {breakdown && Object.keys(breakdown).length > 0 && (
          <div style={{
            background: '#12172e', border: '1px solid #2a3060',
            borderRadius: 16, padding: 24, marginBottom: 20
          }}>
            <h3 style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#8892b0',
              letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 20, marginTop: 0
            }}>
              STAT BREAKDOWN
            </h3>
            {Object.entries(breakdown).map(([stat, data]) => (
              <StatBar key={stat} stat={stat} data={data} />
            ))}
          </div>
        )}

        {/* Insights */}
        <div style={{
          background: '#12172e', border: '1px solid #2a3060',
          borderRadius: 16, padding: 24, marginBottom: 24
        }}>
          <h3 style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#8892b0',
            letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16, marginTop: 0
          }}>
            PERFORMANCE INSIGHTS
          </h3>

          {biggestWeakness && biggestWeaknessGap > 0 && (
            <div style={{
              padding: 12, background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, marginBottom: 12
            }}>
              <div style={{ color: '#ef4444', fontSize: 14, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', marginBottom: 4 }}>
                ⬇ Biggest Weakness: {STAT_LABELS[biggestWeakness]}
              </div>
              <div style={{ color: '#8892b0', fontSize: 13, fontFamily: 'Space Grotesk, sans-serif' }}>
                You were {biggestWeaknessGap} point{biggestWeaknessGap > 1 ? 's' : ''} short. Consider adding a part that boosts {STAT_LABELS[biggestWeakness]} next time.
              </div>
            </div>
          )}

          {bestStat && bestStatOver > 0 && (
            <div style={{
              padding: 12, background: 'rgba(52,211,153,0.08)',
              border: '1px solid rgba(52,211,153,0.3)', borderRadius: 8, marginBottom: 12
            }}>
              <div style={{ color: '#34d399', fontSize: 14, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', marginBottom: 4 }}>
                ⬆ Best Stat: {STAT_LABELS[bestStat]}
              </div>
              <div style={{ color: '#8892b0', fontSize: 13, fontFamily: 'Space Grotesk, sans-serif' }}>
                Exceeded the requirement by {bestStatOver} point{bestStatOver > 1 ? 's' : ''}!
              </div>
            </div>
          )}

          {activeCombos && activeCombos.length > 0 && (
            <div style={{
              padding: 12, background: 'rgba(251,191,36,0.08)',
              border: '1px solid rgba(251,191,36,0.3)', borderRadius: 8, marginBottom: 12
            }}>
              <div style={{ color: '#fbbf24', fontSize: 14, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', marginBottom: 4 }}>
                ⚡ Combos Fired
              </div>
              <div style={{ color: '#8892b0', fontSize: 13, fontFamily: 'Space Grotesk, sans-serif' }}>
                {activeCombos.join(', ')}
              </div>
            </div>
          )}

          {activeConflicts && activeConflicts.length > 0 && (
            <div style={{
              padding: 12, background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8
            }}>
              <div style={{ color: '#ef4444', fontSize: 14, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', marginBottom: 4 }}>
                ⚠ Conflicts Penalized
              </div>
              <div style={{ color: '#8892b0', fontSize: 13, fontFamily: 'Space Grotesk, sans-serif' }}>
                {activeConflicts.map(c => c.name).join(', ')}
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={startNewGame}
            style={{
              flex: 2, padding: '16px',
              background: 'linear-gradient(135deg, #00b4ff, #0080cc)',
              border: 'none', borderRadius: 12, color: 'white',
              fontSize: 16, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'Space Grotesk, sans-serif',
              boxShadow: '0 4px 30px rgba(0,180,255,0.4)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = ''}
          >
            🔄 Play Again
          </button>
          {settings?.leaderboardMode && (
            <button
              onClick={() => goTo(SCREENS.LEADERBOARD)}
              style={{
                flex: 1, padding: '16px',
                background: 'rgba(251,191,36,0.1)',
                border: '1px solid rgba(251,191,36,0.4)',
                borderRadius: 12, color: '#fbbf24',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'Space Grotesk, sans-serif'
              }}
            >
              🏆 Leaderboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StatBar({ stat, data }) {
  const { requirement, actual, met } = data;
  const maxVal = Math.max(requirement, actual, 1);
  const reqPct = (requirement / 5) * 100;
  const actualPct = (actual / 5) * 100;

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 13, color: '#e8eaf6', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>
          {STAT_LABELS[stat]}
        </span>
        <span style={{
          fontSize: 12, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
          color: met ? '#34d399' : '#ef4444'
        }}>
          {actual}/{requirement}
        </span>
      </div>
      <div style={{ position: 'relative', height: 10, background: '#1a1f3a', borderRadius: 5 }}>
        {/* Requirement bar (faint) */}
        <div style={{
          position: 'absolute', top: 0, left: 0,
          height: '100%', width: `${reqPct}%`,
          background: 'rgba(136,146,176,0.2)', borderRadius: 5
        }} />
        {/* Actual bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0,
          height: '100%', width: `${actualPct}%`,
          background: met
            ? 'linear-gradient(90deg, #34d399, #10b981)'
            : 'linear-gradient(90deg, #ef4444, #dc2626)',
          borderRadius: 5, transition: 'width 0.8s ease'
        }} />
      </div>
    </div>
  );
}

function AddToLeaderboard({ score, missionTitle, addScore }) {
  const [name, setName] = useState('');
  const [added, setAdded] = useState(false);

  function handleAdd() {
    if (!name.trim()) return;
    addScore({ name: name.trim(), score, mission: missionTitle });
    setAdded(true);
  }

  if (added) {
    return <p style={{ color: '#34d399', fontFamily: 'Space Grotesk, sans-serif', fontSize: 14 }}>✓ Score added to leaderboard!</p>;
  }

  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleAdd()}
        placeholder="Your name"
        style={{
          padding: '8px 14px', background: '#1a1f3a',
          border: '1px solid #2a3060', borderRadius: 8,
          color: '#e8eaf6', fontSize: 14, fontFamily: 'Space Grotesk, sans-serif',
          maxWidth: 200
        }}
      />
      <button
        onClick={handleAdd}
        style={{
          padding: '8px 16px', background: 'rgba(251,191,36,0.2)',
          border: '1px solid rgba(251,191,36,0.5)', borderRadius: 8,
          color: '#fbbf24', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          fontFamily: 'Space Grotesk, sans-serif'
        }}
      >
        + Add to Board
      </button>
    </div>
  );
}

