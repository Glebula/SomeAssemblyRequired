import { useState, useRef } from 'react';
import { MISSIONS } from '../../data/missions';
import { SCREENS } from '../../hooks/useGameState';

const DIFFICULTIES = ['bronze', 'silver', 'gold'];
const DIFFICULTY_BITS = { bronze: 80, silver: 65, gold: 50 };
const DIFFICULTY_COLORS = { bronze: '#cd7f32', silver: '#a8a9ad', gold: '#ffd700' };

export default function CodeEntry({ goTo, setMission, devMode, settings }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [shaking, setShaking] = useState(false);
  const [revealedMission, setRevealedMission] = useState(null);
  const [revealing, setRevealing] = useState(false);
  const [difficulty, setDifficulty] = useState(null);
  const [devSearch, setDevSearch] = useState('');
  const inputRef = useRef(null);

  const missionList = Object.entries(MISSIONS);
  const filteredMissions = missionList.filter(([code, m]) =>
    m.title.toLowerCase().includes(devSearch.toLowerCase()) ||
    code.toLowerCase().includes(devSearch.toLowerCase())
  );

  function handleInput(e) {
    let val = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');

    // Auto-format: MSN-XXXX
    if (val.length === 3 && !val.includes('-')) {
      val = val + '-';
    }
    if (val.length > 8) val = val.slice(0, 8);

    setCode(val);
    setError('');
    setRevealedMission(null);
    setDifficulty(null);
  }

  function handleSubmit() {
    const mission = MISSIONS[code];
    if (!mission) {
      setError('Invalid code. Check your Mission Card and try again.');
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
      return;
    }
    revealMission(code, mission);
  }

  function revealMission(code, mission) {
    const assignedDifficulty = settings?.forceDifficulty ||
      DIFFICULTIES[Math.floor(Math.random() * DIFFICULTIES.length)];
    setDifficulty(assignedDifficulty);
    setRevealing(true);
    setTimeout(() => {
      setRevealedMission({ code, mission });
      setRevealing(false);
    }, 300);
  }

  function handleDevSelect(code) {
    const mission = MISSIONS[code];
    if (mission) {
      setCode(code);
      revealMission(code, mission);
    }
  }

  function handleAccept() {
    setMission(code, revealedMission.mission, difficulty);
    goTo(SCREENS.MISSION_BRIEFING);
  }

  function handleRedraw() {
    // Deduct 10 bits (handled via state)
    setRevealedMission(null);
    setCode('');
    setDifficulty(null);
    setError('');
  }

  const categoryColors = {
    'social-interaction': '#34d399',
    'social-daily': '#34d399',
    'environmental': '#00b4ff',
    'physical': '#ff6b35',
    'wild': '#a78bfa'
  };

  return (
    <div
      className="bg-grid"
      style={{
        minHeight: '100vh',
        background: '#0a0e1a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div style={{ width: '100%', maxWidth: 600 }}>
        {/* Back button */}
        <button
          onClick={() => goTo(SCREENS.HOME)}
          style={{
            background: 'transparent', border: 'none', color: '#8892b0',
            cursor: 'pointer', fontSize: 14, marginBottom: 32,
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: 'Space Grotesk, sans-serif'
          }}
        >
          ← Back
        </button>

        <div className="animate-slide-down-in">
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 24, fontWeight: 700, color: '#e8eaf6',
            marginBottom: 8, marginTop: 0
          }}>
            Draw a Mission Card
          </h2>
          <p style={{
            color: '#8892b0', marginBottom: 32, fontSize: 15,
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            Enter the code from your physical mission card below.
          </p>

          {/* Dev mode: searchable dropdown */}
          {devMode && (
            <div style={{ marginBottom: 24, padding: 16, background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.3)', borderRadius: 8 }}>
              <p style={{ color: '#ff6b35', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', marginBottom: 8, fontWeight: 700 }}>
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
                {filteredMissions.map(([code, m]) => (
                  <button
                    key={code}
                    onClick={() => handleDevSelect(code)}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '6px 10px', background: 'transparent',
                      border: 'none', borderRadius: 4, cursor: 'pointer',
                      color: '#e8eaf6', fontSize: 13, fontFamily: 'Space Grotesk, sans-serif'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,180,255,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ color: '#00b4ff', fontFamily: 'JetBrains Mono, monospace', marginRight: 8 }}>{code}</span>
                    {m.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Code input */}
          {!revealedMission && (
            <div className={shaking ? 'animate-shake' : ''}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <input
                  ref={inputRef}
                  value={code}
                  onChange={handleInput}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  placeholder="MSN-XXXX"
                  maxLength={8}
                  style={{
                    flex: 1,
                    padding: '16px 20px',
                    fontSize: 24,
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    background: '#12172e',
                    border: `2px solid ${error ? '#ef4444' : '#2a3060'}`,
                    borderRadius: 10,
                    color: '#e8eaf6',
                    outline: 'none',
                    textTransform: 'uppercase',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={e => { if (!error) e.target.style.borderColor = '#00b4ff'; }}
                  onBlur={e => { if (!error) e.target.style.borderColor = '#2a3060'; }}
                  autoFocus
                />
                <button
                  onClick={handleSubmit}
                  style={{
                    padding: '16px 28px',
                    background: 'linear-gradient(135deg, #00b4ff, #0080cc)',
                    border: 'none', borderRadius: 10, color: 'white',
                    fontSize: 16, fontWeight: 700, cursor: 'pointer',
                    fontFamily: 'Space Grotesk, sans-serif',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 20px rgba(0, 180, 255, 0.3)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = ''}
                >
                  Submit
                </button>
              </div>

              {error && (
                <p style={{ color: '#ef4444', fontSize: 14, fontFamily: 'JetBrains Mono, monospace', marginTop: 0 }}>
                  ⚠ {error}
                </p>
              )}
            </div>
          )}

          {/* Mission card reveal */}
          {revealedMission && !revealing && (
            <div className="animate-slide-up">
              <MissionCardReveal
                mission={revealedMission.mission}
                code={revealedMission.code}
                difficulty={difficulty}
                categoryColors={categoryColors}
              />
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button
                  onClick={handleAccept}
                  style={{
                    flex: 2,
                    padding: '16px',
                    background: 'linear-gradient(135deg, #00b4ff, #0080cc)',
                    border: 'none', borderRadius: 10, color: 'white',
                    fontSize: 16, fontWeight: 700, cursor: 'pointer',
                    fontFamily: 'Space Grotesk, sans-serif',
                    boxShadow: '0 4px 20px rgba(0, 180, 255, 0.3)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = ''}
                >
                  Accept Mission →
                </button>
                <button
                  onClick={handleRedraw}
                  style={{
                    flex: 1,
                    padding: '16px',
                    background: 'transparent',
                    border: '2px solid #2a3060',
                    borderRadius: 10, color: '#8892b0',
                    fontSize: 14, fontWeight: 600, cursor: 'pointer',
                    fontFamily: 'Space Grotesk, sans-serif',
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
                  Redraw (−10 Bits)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MissionCardReveal({ mission, code, difficulty, categoryColors }) {
  const tierColors = { bronze: '#cd7f32', silver: '#a8a9ad', gold: '#ffd700', standard: '#00b4ff', advanced: '#a78bfa', extreme: '#ff6b35', random: '#8892b0' };
  const tierColor = tierColors[difficulty] || tierColors[mission.tier] || '#8892b0';

  return (
    <div style={{
      background: '#12172e',
      border: `2px solid ${tierColor}40`,
      borderRadius: 16,
      padding: 24,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Top glow bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${tierColor}, transparent)` }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#8892b0', marginBottom: 4, letterSpacing: '0.1em' }}>{code}</div>
          <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, fontWeight: 700, color: '#e8eaf6', margin: 0 }}>{mission.title}</h3>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{
            padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
            background: `${categoryColors[mission.category]}20`,
            color: categoryColors[mission.category],
            border: `1px solid ${categoryColors[mission.category]}40`,
            fontFamily: 'Space Grotesk, sans-serif', textTransform: 'capitalize'
          }}>
            {mission.category.replace('-', ' ')}
          </span>
          <span style={{
            padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
            background: `${tierColor}20`, color: tierColor,
            border: `1px solid ${tierColor}40`,
            fontFamily: 'Space Grotesk, sans-serif', textTransform: 'capitalize'
          }}>
            {difficulty} difficulty
          </span>
        </div>
      </div>

      <p style={{ color: '#8892b0', fontSize: 14, lineHeight: 1.6, fontFamily: 'Space Grotesk, sans-serif', margin: 0 }}>
        {mission.description.slice(0, 180)}...
      </p>
    </div>
  );
}
