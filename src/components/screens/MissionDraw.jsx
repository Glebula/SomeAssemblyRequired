import { useState } from 'react';
import { MISSIONS } from '../../data/missions';
import { ENVIRONMENTS } from '../../data/environments';
import { generateRequirementsFromDescription } from '../../utils/missionGenerator';
import { SCREENS } from '../../hooks/useGameState';

const DIFFICULTIES = ['bronze', 'silver', 'gold'];
const DIFFICULTY_COLORS = { bronze: '#cd7f32', silver: '#a8a9ad', gold: '#ffd700' };
const DIFFICULTY_BITS = { bronze: 80, silver: 65, gold: 50 };

const STAT_ICONS = {
  precision: '🎯', strength: '💪', perception: '👁️',
  mobility: '🏃', durability: '🛡️', adaptability: '🧠',
  communication: '📡', social: '🤝',
};

const CATEGORY_COLORS = {
  'social-interaction': '#34d399',
  'social-daily': '#34d399',
  'environmental': '#00b4ff',
  'physical': '#ff6b35',
  'wild': '#a78bfa',
};

const ALL_KEYS = Object.keys(MISSIONS);

function pickRandomKey(excludeKey = null) {
  const pool = excludeKey ? ALL_KEYS.filter(k => k !== excludeKey) : ALL_KEYS;
  return pool[Math.floor(Math.random() * pool.length)];
}

function pickDifficulty(forced = null) {
  if (forced) return forced;
  return DIFFICULTIES[Math.floor(Math.random() * DIFFICULTIES.length)];
}

export default function MissionDraw({ state, goTo, setMission }) {
  const { settings, devMode } = state;
  const [currentKey, setCurrentKey] = useState(() => pickRandomKey());
  const [difficulty, setDifficulty] = useState(() => pickDifficulty(settings?.forceDifficulty));
  const [cardKey, setCardKey] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [redrawCount, setRedrawCount] = useState(0);
  const [playerChoiceText, setPlayerChoiceText] = useState('');
  const [devSearch, setDevSearch] = useState('');

  const mission = MISSIONS[currentKey];
  const isMystery = currentKey === 'MSN-1019';
  const isPlayerChoice = currentKey === 'MSN-1020';
  const baseBits = DIFFICULTY_BITS[difficulty] || 80;
  const startingBits = Math.max(10, baseBits - redrawCount * 10);
  const diffColor = DIFFICULTY_COLORS[difficulty] || '#8892b0';
  const env = ENVIRONMENTS[mission?.environment] || ENVIRONMENTS['normal'];
  const categoryColor = CATEGORY_COLORS[mission?.category] || '#8892b0';

  const top3Stats = mission?.requirements
    ? Object.entries(mission.requirements).filter(([, v]) => v > 0).sort(([, a], [, b]) => b - a).slice(0, 3)
    : [];

  const canAccept = !isFlipping && (!isPlayerChoice || playerChoiceText.trim().length >= 5);

  const filteredMissions = Object.entries(MISSIONS).filter(([k, m]) =>
    m.title.toLowerCase().includes(devSearch.toLowerCase()) ||
    k.toLowerCase().includes(devSearch.toLowerCase())
  );

  function handleRedraw() {
    setIsFlipping(true);
    setTimeout(() => {
      const newKey = pickRandomKey(currentKey);
      setCurrentKey(newKey);
      setDifficulty(pickDifficulty(settings?.forceDifficulty));
      setRedrawCount(c => c + 1);
      setPlayerChoiceText('');
      setCardKey(k => k + 1);
      setIsFlipping(false);
    }, 400);
  }

  function handleAccept() {
    let finalMission = { ...mission };
    if (isPlayerChoice && playerChoiceText.trim()) {
      finalMission = {
        ...mission,
        requirements: generateRequirementsFromDescription(playerChoiceText),
        description: `"${playerChoiceText}" — ${mission.description}`,
      };
    }
    setMission(currentKey, finalMission, difficulty, redrawCount * 10);
    goTo(SCREENS.MISSION_BRIEFING);
  }

  function handleDevSelect(key) {
    setCurrentKey(key);
    setDifficulty(pickDifficulty(settings?.forceDifficulty));
    setRedrawCount(0);
    setPlayerChoiceText('');
    setCardKey(k => k + 1);
  }

  return (
    <div className="bg-grid" style={{
      minHeight: '100vh', background: '#0a0e1a', padding: 24,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ maxWidth: 520, width: '100%' }}>
        {/* Back */}
        <button
          onClick={() => goTo(SCREENS.HOME)}
          style={{
            background: 'transparent', border: 'none', color: '#8892b0',
            cursor: 'pointer', fontSize: 14, marginBottom: 24,
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: 'Space Grotesk, sans-serif'
          }}
        >
          ← Back
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#8892b0', letterSpacing: '0.2em', marginBottom: 8 }}>
            MISSION DRAW
          </div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 15, color: '#fbbf24', fontWeight: 700 }}>
            💰 Starting budget: {startingBits} Bits
            {redrawCount > 0 && (
              <span style={{ color: '#ef4444', fontSize: 13, fontWeight: 400, marginLeft: 8 }}>
                (−{redrawCount * 10} from {redrawCount} redraw{redrawCount > 1 ? 's' : ''})
              </span>
            )}
          </div>
        </div>

        {/* Dev mission selector */}
        {devMode && (
          <div style={{ marginBottom: 20, padding: 16, background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.3)', borderRadius: 8 }}>
            <p style={{ color: '#ff6b35', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', marginBottom: 8, marginTop: 0, fontWeight: 700 }}>
              DEV: MISSION SELECT
            </p>
            <input
              value={devSearch}
              onChange={e => setDevSearch(e.target.value)}
              placeholder="Search missions..."
              style={{
                width: '100%', padding: '8px 12px',
                background: '#12172e', border: '1px solid #2a3060',
                borderRadius: 6, color: '#e8eaf6', fontSize: 14,
                fontFamily: 'Space Grotesk, sans-serif', marginBottom: 8
              }}
            />
            <div style={{ maxHeight: 160, overflowY: 'auto' }}>
              {filteredMissions.map(([k, m]) => (
                <button
                  key={k}
                  onClick={() => handleDevSelect(k)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '6px 10px',
                    background: k === currentKey ? 'rgba(0,180,255,0.15)' : 'transparent',
                    border: 'none', borderRadius: 4, cursor: 'pointer',
                    color: k === currentKey ? '#00b4ff' : '#e8eaf6',
                    fontSize: 13, fontFamily: 'Space Grotesk, sans-serif'
                  }}
                  onMouseEnter={e => { if (k !== currentKey) e.currentTarget.style.background = 'rgba(0,180,255,0.08)'; }}
                  onMouseLeave={e => { if (k !== currentKey) e.currentTarget.style.background = 'transparent'; }}
                >
                  {m.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mission card or flipping placeholder */}
        {isFlipping ? (
          <div style={{
            height: 180, background: '#12172e', borderRadius: 20,
            border: '2px solid #2a3060', marginBottom: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div className="animate-spin-slow" style={{ fontSize: 48 }}>🎴</div>
          </div>
        ) : (
          <div
            key={cardKey}
            className="animate-slam-in"
            style={{
              background: '#12172e',
              border: `2px solid ${isMystery ? '#a78bfa40' : isPlayerChoice ? '#fbbf2440' : `${diffColor}40`}`,
              borderRadius: 20, padding: 28, marginBottom: 16,
              position: 'relative', overflow: 'hidden'
            }}
          >
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 3,
              background: isMystery
                ? 'linear-gradient(90deg, transparent, #a78bfa, transparent)'
                : isPlayerChoice
                ? 'linear-gradient(90deg, transparent, #fbbf24, transparent)'
                : `linear-gradient(90deg, transparent, ${diffColor}, transparent)`
            }} />

            {isMystery ? (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <div style={{ fontSize: 56, marginBottom: 12 }}>🎲</div>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 40, fontWeight: 700,
                  color: '#a78bfa', marginBottom: 12, letterSpacing: '0.15em'
                }}>
                  ???
                </div>
                <div style={{
                  fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, fontWeight: 700,
                  color: '#e8eaf6', marginBottom: 12
                }}>
                  Mystery Mission
                </div>
                <p style={{
                  color: '#8892b0', fontSize: 14, lineHeight: 1.6,
                  fontFamily: 'Space Grotesk, sans-serif', margin: 0
                }}>
                  Your real job is revealed halfway through building. Build a versatile robot!
                </p>
              </div>
            ) : isPlayerChoice ? (
              <div>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div style={{ fontSize: 44, marginBottom: 8 }}>✏️</div>
                  <div style={{
                    fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, fontWeight: 700,
                    color: '#e8eaf6', marginBottom: 8
                  }}>
                    Player's Choice
                  </div>
                  <p style={{
                    color: '#8892b0', fontSize: 14, lineHeight: 1.5,
                    fontFamily: 'Space Grotesk, sans-serif', margin: 0
                  }}>
                    Describe any robot job you can imagine. The app generates your mission!
                  </p>
                </div>
                <textarea
                  value={playerChoiceText}
                  onChange={e => setPlayerChoiceText(e.target.value)}
                  placeholder="e.g. deep sea cable repair, hospital surgery assistant, farm harvesting drone..."
                  rows={3}
                  style={{
                    width: '100%', padding: '12px 16px',
                    background: '#1a1f3a', border: '1px solid #2a3060',
                    borderRadius: 10, color: '#e8eaf6', fontSize: 14,
                    fontFamily: 'Space Grotesk, sans-serif', resize: 'none',
                    outline: 'none', lineHeight: 1.5, boxSizing: 'border-box'
                  }}
                  onFocus={e => { e.target.style.borderColor = '#00b4ff'; }}
                  onBlur={e => { e.target.style.borderColor = '#2a3060'; }}
                />
                {playerChoiceText.trim().length > 0 && playerChoiceText.trim().length < 5 && (
                  <p style={{ color: '#fbbf24', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', marginTop: 8, marginBottom: 0 }}>
                    Keep typing...
                  </p>
                )}
              </div>
            ) : (
              <div>
                <h2 style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: 'clamp(20px, 4vw, 26px)', fontWeight: 700,
                  color: '#e8eaf6', margin: '0 0 12px 0'
                }}>
                  {mission?.title}
                </h2>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: top3Stats.length > 0 ? 20 : 0 }}>
                  <span style={{
                    padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                    background: 'rgba(0,180,255,0.12)', color: '#00b4ff',
                    border: '1px solid rgba(0,180,255,0.3)',
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}>
                    {env.icon} {env.name}
                  </span>
                  <span style={{
                    padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                    background: `${diffColor}18`, color: diffColor,
                    border: `1px solid ${diffColor}40`,
                    fontFamily: 'Space Grotesk, sans-serif', textTransform: 'capitalize'
                  }}>
                    {difficulty}
                  </span>
                </div>
                {top3Stats.length > 0 && (
                  <div>
                    <div style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                      color: '#8892b0', letterSpacing: '0.15em', marginBottom: 10
                    }}>
                      NEEDS:
                    </div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      {top3Stats.map(([stat]) => (
                        <div key={stat} style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '8px 16px',
                          background: 'rgba(0,180,255,0.08)',
                          border: '1px solid rgba(0,180,255,0.2)',
                          borderRadius: 10
                        }}>
                          <span style={{ fontSize: 22 }}>{STAT_ICONS[stat] || '⚙️'}</span>
                          <span style={{
                            fontFamily: 'Space Grotesk, sans-serif', fontSize: 14,
                            fontWeight: 700, color: '#e8eaf6', textTransform: 'capitalize'
                          }}>
                            {stat}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Objectives */}
        {!isFlipping && mission?.objectives && (
          <div className="animate-fade-in" style={{
            background: '#12172e', border: '1px solid #2a3060',
            borderRadius: 12, padding: 20, marginBottom: 20
          }}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#00b4ff',
              letterSpacing: '0.15em', marginBottom: 12
            }}>
              THINK ABOUT:
            </div>
            {mission.objectives.map((obj, i) => (
              <div key={i} style={{
                display: 'flex', gap: 10,
                marginBottom: i < mission.objectives.length - 1 ? 10 : 0
              }}>
                <span style={{
                  color: '#00b4ff', fontWeight: 700, flexShrink: 0,
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 13
                }}>
                  {i + 1}.
                </span>
                <p style={{
                  color: '#8892b0', fontSize: 13, lineHeight: 1.5,
                  fontFamily: 'Space Grotesk, sans-serif', margin: 0
                }}>
                  {obj}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Action buttons */}
        {!isFlipping && (
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={handleAccept}
              disabled={!canAccept}
              style={{
                flex: 2, padding: '16px',
                background: canAccept
                  ? 'linear-gradient(135deg, #00b4ff, #0080cc)'
                  : '#1a1f3a',
                border: canAccept ? 'none' : '1px solid #2a3060',
                borderRadius: 12,
                color: canAccept ? 'white' : '#4a5578',
                fontSize: 16, fontWeight: 700,
                cursor: canAccept ? 'pointer' : 'default',
                fontFamily: 'Space Grotesk, sans-serif',
                boxShadow: canAccept ? '0 4px 20px rgba(0,180,255,0.3)' : 'none',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { if (canAccept) e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
            >
              Accept Mission →
            </button>
            <button
              onClick={handleRedraw}
              style={{
                flex: 1, padding: '16px',
                background: 'transparent',
                border: '2px solid #2a3060',
                borderRadius: 12, color: '#8892b0',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'Space Grotesk, sans-serif',
                lineHeight: 1.3,
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#ff6b35';
                e.currentTarget.style.color = '#ff6b35';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#2a3060';
                e.currentTarget.style.color = '#8892b0';
              }}
            >
              Redraw<br />
              <span style={{ fontSize: 12, opacity: 0.8 }}>−10 Bits</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
