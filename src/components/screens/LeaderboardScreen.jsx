import { useState } from 'react';
import { SCREENS } from '../../hooks/useGameState';
import { MISSIONS } from '../../data/missions';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function LeaderboardScreen({ state, goTo, addScore, clearLeaderboard }) {
  const { leaderboard, settings } = state;
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [score, setScore] = useState('');
  const [missionId, setMissionId] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);

  function handleAdd() {
    if (!name.trim() || !score || isNaN(parseInt(score))) return;
    const mission = MISSIONS.find(m => m.id === missionId);
    addScore({ name: name.trim(), score: parseInt(score), mission: mission?.title || missionId || 'Unknown' });
    setName(''); setScore(''); setMissionId(''); setShowAdd(false);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a', padding: '24px 16px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, color: '#8892b0', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>
              🏆 Event Leaderboard
            </div>
            {settings.eventName && (
              <div style={{ fontSize: 22, fontWeight: 700, color: '#e8eaf6' }}>{settings.eventName}</div>
            )}
          </div>
          <button onClick={() => goTo(SCREENS.HOME)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #2a3060', borderRadius: 10, padding: '8px 14px', color: '#8892b0', fontSize: 14, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>
            ← Back
          </button>
        </div>

        {/* Board */}
        <div style={{ background: '#12172e', border: '1px solid #2a3060', borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
          {leaderboard.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#8892b0', fontFamily: 'Space Grotesk, sans-serif' }}>
              No scores yet. Play a round to get on the board!
            </div>
          ) : (
            leaderboard.map((entry, i) => (
              <div key={entry.id} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 20px',
                borderBottom: i < leaderboard.length - 1 ? '1px solid #1a2040' : 'none',
                background: i === 0 ? 'rgba(255,215,0,0.05)' : i === 1 ? 'rgba(168,169,173,0.04)' : i === 2 ? 'rgba(205,127,50,0.04)' : 'transparent',
              }}>
                <div style={{ width: 32, textAlign: 'center', fontSize: i < 3 ? 20 : 14, fontFamily: 'JetBrains Mono, monospace', color: '#8892b0', fontWeight: 700 }}>
                  {i < 3 ? MEDALS[i] : `${i + 1}`}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: '#e8eaf6' }}>{entry.name}</div>
                  <div style={{ fontSize: 12, color: '#8892b0' }}>{entry.mission}</div>
                </div>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 24, fontWeight: 700,
                  color: entry.score >= 85 ? '#ffd700' : entry.score >= 70 ? '#a8a9ad' : entry.score >= 50 ? '#cd7f32' : '#ef4444',
                }}>
                  {entry.score}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <button onClick={() => setShowAdd(s => !s)} style={{ flex: 1, padding: '14px', background: 'rgba(0,180,255,0.1)', border: '1px solid rgba(0,180,255,0.4)', borderRadius: 12, color: '#00b4ff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
            + Add Score
          </button>
          <button onClick={() => setConfirmClear(true)} style={{ padding: '14px 20px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, color: '#ef4444', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
            Clear All
          </button>
        </div>

        {showAdd && (
          <div className="animate-slide-up" style={{ background: '#12172e', border: '1px solid #2a3060', borderRadius: 16, padding: '20px', marginBottom: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Player Name" style={{ padding: '12px', background: '#0d1225', border: '1px solid #2a3060', borderRadius: 10, color: '#e8eaf6', fontSize: 14, fontFamily: 'Space Grotesk, sans-serif' }} />
              <input value={score} onChange={e => setScore(e.target.value)} type="number" min={0} max={100} placeholder="Score (0–100)" style={{ padding: '12px', background: '#0d1225', border: '1px solid #2a3060', borderRadius: 10, color: '#e8eaf6', fontSize: 14, fontFamily: 'Space Grotesk, sans-serif' }} />
              <select value={missionId} onChange={e => setMissionId(e.target.value)} style={{ padding: '12px', background: '#0d1225', border: '1px solid #2a3060', borderRadius: 10, color: '#e8eaf6', fontSize: 14, fontFamily: 'Space Grotesk, sans-serif' }}>
                <option value="">Select Mission</option>
                {MISSIONS.filter(m => !m.specialRule).map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
              </select>
              <button onClick={handleAdd} style={{ padding: '14px', background: 'linear-gradient(135deg, #00b4ff, #0066cc)', border: 'none', borderRadius: 10, color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
                Add to Board
              </button>
            </div>
          </div>
        )}

        {confirmClear && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: '#ef4444', flex: 1, fontSize: 14 }}>Clear all scores?</span>
            <button onClick={() => { clearLeaderboard(); setConfirmClear(false); }} style={{ padding: '8px 16px', background: '#ef4444', border: 'none', borderRadius: 8, color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Yes</button>
            <button onClick={() => setConfirmClear(false)} style={{ padding: '8px 16px', background: '#1a1f3a', border: '1px solid #2a3060', borderRadius: 8, color: '#8892b0', fontSize: 13, cursor: 'pointer' }}>No</button>
          </div>
        )}
      </div>
    </div>
  );
}
