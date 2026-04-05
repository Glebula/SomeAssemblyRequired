import { useState } from 'react';
import { MISSIONS } from '../../data/missions';
import { SCREENS } from '../../hooks/useGameState';

const MEDAL_COLORS = { 0: '#ffd700', 1: '#a8a9ad', 2: '#cd7f32' };
const MEDAL_ICONS = { 0: '🥇', 1: '🥈', 2: '🥉' };

export default function LeaderboardScreen({ state, goTo, addScore, clearLeaderboard }) {
  const { leaderboard, settings } = state;
  const [showAddForm, setShowAddForm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [formData, setFormData] = useState({ name: '', score: '', mission: '' });

  const missionList = Object.entries(MISSIONS);

  function handleAddScore() {
    if (!formData.name.trim() || !formData.score) return;
    addScore({
      name: formData.name.trim(),
      score: parseInt(formData.score),
      mission: formData.mission || 'Unknown'
    });
    setFormData({ name: '', score: '', mission: '' });
    setShowAddForm(false);
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0e1a', padding: 24,
      display: 'flex', flexDirection: 'column'
    }} className="bg-grid">
      <div style={{ maxWidth: 800, margin: '0 auto', width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <button
            onClick={() => goTo(SCREENS.SETTINGS)}
            style={{
              background: 'transparent', border: 'none', color: '#8892b0',
              cursor: 'pointer', fontSize: 14, fontFamily: 'Space Grotesk, sans-serif'
            }}
          >
            ← Back
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                padding: '8px 16px', background: 'rgba(0,180,255,0.15)',
                border: '1px solid rgba(0,180,255,0.4)', borderRadius: 8,
                color: '#00b4ff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'Space Grotesk, sans-serif'
              }}
            >
              + Add Score
            </button>
            <button
              onClick={() => setShowClearConfirm(true)}
              style={{
                padding: '8px 16px', background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8,
                color: '#ef4444', fontSize: 13, cursor: 'pointer',
                fontFamily: 'Space Grotesk, sans-serif'
              }}
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#fbbf24',
            letterSpacing: '0.3em', marginBottom: 8
          }}>
            🏆 EVENT LEADERBOARD
          </div>
          <h1 style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(24px, 5vw, 40px)',
            fontWeight: 700, color: '#e8eaf6', margin: '0 0 8px 0'
          }}>
            SOME ASSEMBLY REQUIRED
          </h1>
          {settings.eventName && (
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 14, color: '#00b4ff'
            }}>
              {settings.eventName}
            </div>
          )}
        </div>

        {/* Leaderboard list */}
        {leaderboard.length === 0 ? (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 16
          }}>
            <div style={{ fontSize: 48 }}>🏆</div>
            <p style={{ color: '#8892b0', fontFamily: 'Space Grotesk, sans-serif', fontSize: 16 }}>
              No scores yet. Add the first one!
            </p>
          </div>
        ) : (
          <div style={{ flex: 1 }}>
            {/* Column headers */}
            <div style={{
              display: 'grid', gridTemplateColumns: '48px 1fr auto auto',
              gap: 12, padding: '8px 20px', marginBottom: 8
            }}>
              <span style={{ color: '#8892b0', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>#</span>
              <span style={{ color: '#8892b0', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>PLAYER</span>
              <span style={{ color: '#8892b0', fontSize: 11, fontFamily: 'JetBrains Mono, monospace', textAlign: 'right' }}>MISSION</span>
              <span style={{ color: '#8892b0', fontSize: 11, fontFamily: 'JetBrains Mono, monospace', textAlign: 'right', minWidth: 60 }}>SCORE</span>
            </div>

            {leaderboard.map((entry, i) => (
              <div
                key={entry.id || i}
                className="animate-slide-up"
                style={{
                  display: 'grid', gridTemplateColumns: '48px 1fr auto auto',
                  gap: 12, padding: '14px 20px',
                  background: i < 3
                    ? `${MEDAL_COLORS[i]}10`
                    : i % 2 === 0 ? '#12172e' : '#0e1323',
                  border: `1px solid ${i < 3 ? `${MEDAL_COLORS[i]}30` : '#2a3060'}`,
                  borderRadius: 10, marginBottom: 8, alignItems: 'center'
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  {i < 3 ? (
                    <span style={{ fontSize: 20 }}>{MEDAL_ICONS[i]}</span>
                  ) : (
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, color: '#8892b0', fontWeight: 700 }}>
                      {i + 1}
                    </span>
                  )}
                </div>
                <div style={{
                  fontFamily: 'Space Grotesk, sans-serif', fontSize: 16, fontWeight: 700,
                  color: i < 3 ? MEDAL_COLORS[i] : '#e8eaf6'
                }}>
                  {entry.name}
                </div>
                <div style={{
                  fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: '#8892b0',
                  textAlign: 'right', maxWidth: 160, overflow: 'hidden',
                  textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}>
                  {entry.mission}
                </div>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 22, fontWeight: 700,
                  color: entry.score >= 85 ? '#ffd700' : entry.score >= 70 ? '#a8a9ad' : entry.score >= 50 ? '#cd7f32' : '#ef4444',
                  textAlign: 'right', minWidth: 60
                }}>
                  {entry.score}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Score Form */}
        {showAddForm && (
          <>
            <div onClick={() => setShowAddForm(false)} style={{
              position: 'fixed', inset: 0, background: 'rgba(10,14,26,0.8)', zIndex: 200
            }} />
            <div className="animate-slide-up" style={{
              position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 201,
              background: '#12172e', borderTop: '2px solid #00b4ff',
              borderRadius: '20px 20px 0 0', padding: 28,
              maxWidth: 500, margin: '0 auto'
            }}>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, fontWeight: 700, color: '#e8eaf6', marginBottom: 20, marginTop: 0 }}>
                Add Score
              </h3>
              <input
                value={formData.name}
                onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                placeholder="Player name"
                style={{
                  width: '100%', padding: '10px 14px', marginBottom: 10,
                  background: '#1a1f3a', border: '1px solid #2a3060',
                  borderRadius: 8, color: '#e8eaf6', fontSize: 15,
                  fontFamily: 'Space Grotesk, sans-serif'
                }}
              />
              <input
                type="number" min="0" max="100"
                value={formData.score}
                onChange={e => setFormData(f => ({ ...f, score: e.target.value }))}
                placeholder="Score (0-100)"
                style={{
                  width: '100%', padding: '10px 14px', marginBottom: 10,
                  background: '#1a1f3a', border: '1px solid #2a3060',
                  borderRadius: 8, color: '#e8eaf6', fontSize: 15,
                  fontFamily: 'JetBrains Mono, monospace'
                }}
              />
              <select
                value={formData.mission}
                onChange={e => setFormData(f => ({ ...f, mission: e.target.value }))}
                style={{
                  width: '100%', padding: '10px 14px', marginBottom: 20,
                  background: '#1a1f3a', border: '1px solid #2a3060',
                  borderRadius: 8, color: '#e8eaf6', fontSize: 14,
                  fontFamily: 'Space Grotesk, sans-serif'
                }}
              >
                <option value="">Select mission...</option>
                {missionList.map(([code, m]) => (
                  <option key={code} value={m.title}>{m.title}</option>
                ))}
              </select>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={handleAddScore}
                  style={{
                    flex: 1, padding: '12px',
                    background: 'linear-gradient(135deg, #00b4ff, #0080cc)',
                    border: 'none', borderRadius: 10, color: 'white',
                    fontSize: 15, fontWeight: 700, cursor: 'pointer',
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}
                >
                  Add Score
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  style={{
                    padding: '12px 20px', background: 'transparent',
                    border: '1px solid #2a3060', borderRadius: 10,
                    color: '#8892b0', fontSize: 14, cursor: 'pointer',
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}

        {/* Clear confirmation */}
        {showClearConfirm && (
          <>
            <div onClick={() => setShowClearConfirm(false)} style={{
              position: 'fixed', inset: 0, background: 'rgba(10,14,26,0.8)', zIndex: 200
            }} />
            <div className="animate-fade-in" style={{
              position: 'fixed', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 201, background: '#12172e',
              border: '2px solid rgba(239,68,68,0.5)',
              borderRadius: 16, padding: 28,
              width: '90%', maxWidth: 400, textAlign: 'center'
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🗑️</div>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, fontWeight: 700, color: '#e8eaf6', marginBottom: 8, marginTop: 0 }}>
                Clear all scores?
              </h3>
              <p style={{ color: '#8892b0', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 20 }}>
                This cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => { clearLeaderboard(); setShowClearConfirm(false); }}
                  style={{
                    flex: 1, padding: '12px', background: 'rgba(239,68,68,0.15)',
                    border: '1px solid rgba(239,68,68,0.5)', borderRadius: 10,
                    color: '#ef4444', fontSize: 15, fontWeight: 700, cursor: 'pointer',
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}
                >
                  Yes, Clear All
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  style={{
                    flex: 1, padding: '12px', background: 'transparent',
                    border: '1px solid #2a3060', borderRadius: 10,
                    color: '#8892b0', fontSize: 14, cursor: 'pointer',
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
