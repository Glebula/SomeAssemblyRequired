import { useState, useEffect } from 'react';
import { MISSIONS, STANDARD_MISSIONS } from '../../data/missions';
import { SCREENS } from '../../hooks/useGameState';
import { generateRequirementsFromDescription, generateTopStats } from '../../utils/missionGenerator';

const STAT_ICONS = { precision:'🎯', strength:'💪', perception:'👁️', mobility:'⚡', durability:'🛡️', adaptability:'🧠', communication:'📡', social:'🤝' };
const TIER_COLORS = { standard:'#22c55e', advanced:'#f97316', extreme:'#ef4444', random:'#a855f7' };
const CATEGORY_LABELS = { 'social-interaction':'Social', 'social-daily':'Daily Life', environmental:'Environmental', physical:'Physical', wild:'Wild Card' };
const DIFF_BITS = { bronze: 80, silver: 65, gold: 50 };

function pickRandom(exclude = null) {
  const pool = MISSIONS.filter(m => m.id !== exclude);
  return pool[Math.floor(Math.random() * pool.length)];
}

function pickDifficulty(force) {
  if (force) return force;
  return ['bronze','silver','gold'][Math.floor(Math.random() * 3)];
}

export default function DrawMission({ state, goTo, setMission }) {
  const { settings } = state;
  const [mission, setLocalMission] = useState(() => {
    if (settings?.forceMissionId) {
      return MISSIONS.find(m => m.id === settings.forceMissionId) || pickRandom();
    }
    return pickRandom();
  });
  const [difficulty, setDifficulty] = useState(() => pickDifficulty(settings?.forceDifficulty));
  const [redrawCount, setRedrawCount] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [cardKey, setCardKey] = useState(0);
  const [playerChoiceText, setPlayerChoiceText] = useState('');
  const [playerChoiceReady, setPlayerChoiceReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(t);
  }, [cardKey]);

  function handleRedraw() {
    if (isFlipping) return;
    setIsFlipping(true);
    setRevealed(false);
    setTimeout(() => {
      const newMission = pickRandom(mission.id);
      const newDiff = pickDifficulty(settings?.forceDifficulty);
      setLocalMission(newMission);
      setDifficulty(newDiff);
      setRedrawCount(c => c + 1);
      setCardKey(k => k + 1);
      setIsFlipping(false);
    }, 400);
  }

  function handleAccept() {
    let finalMission = mission;
    if (mission.specialRule === 'players-choice') {
      if (!playerChoiceReady || !playerChoiceText.trim()) return;
      const reqs = generateRequirementsFromDescription(playerChoiceText);
      const topStats = generateTopStats(reqs);
      finalMission = {
        ...mission,
        title: playerChoiceText.length > 30 ? playerChoiceText.slice(0, 28) + '…' : playerChoiceText,
        requirements: reqs,
        topStats,
        environment: 'normal',
      };
    }
    setMission(finalMission, difficulty, redrawCount * 10);
    goTo(SCREENS.BUILD);
  }

  const penaltyBits = redrawCount * 10;
  const startingBits = Math.max(10, DIFF_BITS[difficulty] - penaltyBits);
  const isMystery = mission.specialRule === 'mystery';
  const isPlayerChoice = mission.specialRule === 'players-choice';

  return (
    <div className="bg-grid" style={{ minHeight: '100vh', background: '#0a0e1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Header */}
        <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ color: '#8892b0', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 }}>
            Mission Draw
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#00b4ff', fontFamily: 'JetBrains Mono, monospace', fontSize: 22, fontWeight: 700 }}>{startingBits}</div>
              <div style={{ color: '#8892b0', fontSize: 11 }}>Starting Bits</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: TIER_COLORS[difficulty] || '#22c55e', fontFamily: 'JetBrains Mono, monospace', fontSize: 22, fontWeight: 700, textTransform: 'uppercase' }}>{difficulty}</div>
              <div style={{ color: '#8892b0', fontSize: 11 }}>Difficulty</div>
            </div>
          </div>
        </div>

        {/* Mission Card */}
        <div key={cardKey} style={{
          animation: isFlipping ? undefined : 'slamIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
          marginBottom: 24,
        }}>
          <div style={{
            background: '#12172e',
            border: `2px solid ${isMystery ? '#a855f7' : isPlayerChoice ? '#f97316' : '#2a3060'}`,
            borderRadius: 20,
            overflow: 'hidden',
            opacity: isFlipping ? 0.3 : 1,
            transition: 'opacity 0.2s',
          }}>
            {/* Card top bar */}
            <div style={{
              background: isMystery ? 'rgba(168,85,247,0.15)' : isPlayerChoice ? 'rgba(249,115,22,0.15)' : 'rgba(0,180,255,0.08)',
              padding: '14px 20px',
              borderBottom: '1px solid #1a2040',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ color: '#8892b0', fontSize: 11, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.12em' }}>
                {CATEGORY_LABELS[mission.category] || mission.category}
              </span>
              <span style={{
                background: `${TIER_COLORS[mission.tier] || '#8892b0'}20`,
                color: TIER_COLORS[mission.tier] || '#8892b0',
                border: `1px solid ${TIER_COLORS[mission.tier] || '#8892b0'}40`,
                borderRadius: 20, padding: '2px 10px',
                fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>
                {mission.tier}
              </span>
            </div>

            <div style={{ padding: '20px' }}>
              {/* Title */}
              {isMystery ? (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{ fontSize: 48, marginBottom: 8 }}>❓</div>
                  <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#a855f7', fontFamily: 'JetBrains Mono, monospace' }}>???</h2>
                  <p style={{ color: '#8892b0', fontSize: 13, margin: '8px 0 0' }}>Revealed at 1:00 remaining</p>
                </div>
              ) : isPlayerChoice ? (
                <div>
                  <h2 style={{ margin: '0 0 12px', fontSize: 22, fontWeight: 700, color: '#f97316' }}>Player's Choice</h2>
                  <p style={{ color: '#8892b0', fontSize: 13, margin: '0 0 14px' }}>Describe any real-world robot job:</p>
                  <input
                    value={playerChoiceText}
                    onChange={e => { setPlayerChoiceText(e.target.value); setPlayerChoiceReady(false); }}
                    onKeyDown={e => { if (e.key === 'Enter' && playerChoiceText.trim()) setPlayerChoiceReady(true); }}
                    placeholder="e.g. rescue robot, surgery bot, delivery drone..."
                    style={{
                      width: '100%', padding: '12px', background: '#0d1225',
                      border: '1px solid #2a3060', borderRadius: 10,
                      color: '#e8eaf6', fontSize: 14, fontFamily: 'Space Grotesk, sans-serif',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                  {playerChoiceText.trim() && !playerChoiceReady && (
                    <button
                      onClick={() => setPlayerChoiceReady(true)}
                      style={{ marginTop: 10, width: '100%', padding: '10px', background: 'rgba(249,115,22,0.2)', border: '1px solid rgba(249,115,22,0.5)', borderRadius: 8, color: '#f97316', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      Generate Mission →
                    </button>
                  )}
                  {playerChoiceReady && (
                    <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 8, color: '#34d399', fontSize: 12 }}>
                      ✓ Requirements generated! Accept to continue.
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <h2 style={{ margin: '0 0 10px', fontSize: 22, fontWeight: 700, color: '#e8eaf6', lineHeight: 1.2 }}>{mission.title}</h2>
                  <p style={{ color: '#8892b0', fontSize: 13, margin: '0 0 16px', lineHeight: 1.6 }}>{mission.description}</p>

                  {/* Top 3 stats */}
                  {mission.topStats?.length > 0 && (
                    <div>
                      <div style={{ fontSize: 11, color: '#8892b0', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.12em', marginBottom: 10, textTransform: 'uppercase' }}>
                        This mission needs:
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {mission.topStats.map(stat => (
                          <div key={stat} style={{
                            background: 'rgba(0,180,255,0.1)', border: '1px solid rgba(0,180,255,0.3)',
                            borderRadius: 10, padding: '6px 12px',
                            display: 'flex', alignItems: 'center', gap: 6,
                          }}>
                            <span style={{ fontSize: 16 }}>{STAT_ICONS[stat]}</span>
                            <span style={{ color: '#00b4ff', fontSize: 13, fontWeight: 600 }}>
                              {stat.charAt(0).toUpperCase() + stat.slice(1)}
                            </span>
                            <span style={{ color: '#4a7a99', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>
                              {mission.requirements?.[stat] || 0}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Objectives */}
                  {mission.objectives?.length > 0 && (
                    <div style={{ marginTop: 16 }}>
                      <div style={{ fontSize: 11, color: '#8892b0', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.12em', marginBottom: 8, textTransform: 'uppercase' }}>
                        Think about:
                      </div>
                      {mission.objectives.slice(0, 2).map((obj, i) => (
                        <div key={i} style={{ color: '#6b7a99', fontSize: 12, marginBottom: 4, paddingLeft: 12, borderLeft: '2px solid #2a3060', lineHeight: 1.5 }}>
                          {obj}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={handleAccept}
            disabled={isPlayerChoice && !playerChoiceReady}
            style={{
              padding: '18px',
              background: (isPlayerChoice && !playerChoiceReady) ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #00b4ff, #0066cc)',
              border: 'none', borderRadius: 14,
              color: (isPlayerChoice && !playerChoiceReady) ? '#4a5568' : 'white',
              fontSize: 17, fontWeight: 700, cursor: (isPlayerChoice && !playerChoiceReady) ? 'not-allowed' : 'pointer',
              fontFamily: 'Space Grotesk, sans-serif',
              boxShadow: (isPlayerChoice && !playerChoiceReady) ? 'none' : '0 4px 24px rgba(0,180,255,0.4)',
              transition: 'all 0.2s',
            }}
          >
            ✓ Accept Mission
          </button>

          <button
            onClick={handleRedraw}
            disabled={isFlipping}
            style={{
              padding: '14px',
              background: 'transparent',
              border: '1px solid #2a3060',
              borderRadius: 14,
              color: penaltyBits > 0 ? '#fbbf24' : '#8892b0',
              fontSize: 14, fontWeight: 600, cursor: isFlipping ? 'wait' : 'pointer',
              fontFamily: 'Space Grotesk, sans-serif',
              transition: 'all 0.2s',
            }}
          >
            🎲 Redraw {redrawCount > 0 ? `(−${(redrawCount + 1) * 10} Bits total)` : '(−10 Bits)'}
          </button>
        </div>
      </div>
    </div>
  );
}
