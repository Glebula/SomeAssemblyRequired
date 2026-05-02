import { useState } from 'react';
import { SCREENS } from '../../hooks/useGameState';
import { MISSIONS } from '../../data/missions';

const DEV_PASSWORD = 'SAR-DEV-2026';

function Toggle({ label, value, onChange, disabled }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #1a2040' }}>
      <span style={{ color: disabled ? '#3a4060' : '#e8eaf6', fontSize: 14, fontFamily: 'Space Grotesk, sans-serif' }}>{label}</span>
      <button
        onClick={() => !disabled && onChange(!value)}
        style={{
          width: 48, height: 26, borderRadius: 13,
          background: value ? '#00b4ff' : '#2a3060',
          border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
          position: 'relative', transition: 'background 0.2s',
          flexShrink: 0,
        }}
      >
        <div style={{
          width: 20, height: 20, borderRadius: '50%',
          background: 'white',
          position: 'absolute', top: 3,
          left: value ? 25 : 3,
          transition: 'left 0.2s',
        }} />
      </button>
    </div>
  );
}

export default function SettingsScreen({ state, goTo, updateSettings, enableDevMode, disableDevMode }) {
  const { settings, devMode } = state;
  const [devPwInput, setDevPwInput] = useState('');
  const [devError, setDevError] = useState('');
  const [showHow, setShowHow] = useState(false);

  function tryEnableDev() {
    if (devPwInput === DEV_PASSWORD) {
      enableDevMode();
      setDevPwInput('');
      setDevError('');
    } else {
      setDevError('Incorrect password');
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a', padding: '24px 16px' }}>
      <div style={{ maxWidth: 440, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button onClick={() => goTo(SCREENS.HOME)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #2a3060', borderRadius: 10, padding: '8px 14px', color: '#8892b0', fontSize: 14, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
            ← Back
          </button>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#e8eaf6' }}>Settings</h2>
        </div>

        {/* How to Play */}
        <div style={{ background: '#12172e', border: '1px solid #2a3060', borderRadius: 16, padding: '16px 20px', marginBottom: 16 }}>
          <button onClick={() => setShowHow(s => !s)} style={{ width: '100%', background: 'none', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#e8eaf6', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 600 }}>
            📖 How to Play {showHow ? '▲' : '▼'}
          </button>
          {showHow && (
            <div className="animate-fade-in" style={{ marginTop: 14, color: '#8892b0', fontSize: 13, lineHeight: 1.7 }}>
              <b style={{ color: '#00b4ff' }}>1. Draw a Mission</b> — See what robot job you're building for.<br />
              <b style={{ color: '#00b4ff' }}>2. Build (2 min)</b> — Spend Bits to add parts. Check your stats vs. requirements.<br />
              <b style={{ color: '#00b4ff' }}>3. Curveball</b> — An unexpected event! Make a quick choice.<br />
              <b style={{ color: '#00b4ff' }}>4. Question</b> — Answer for bonus Bits.<br />
              <b style={{ color: '#00b4ff' }}>5. Simulation</b> — Your robot runs the mission!<br />
              <b style={{ color: '#00b4ff' }}>6. Results</b> — Score 85+ for Gold, 70+ Silver, 50+ Bronze.<br /><br />
              <b style={{ color: '#fbbf24' }}>Combos</b> = big bonuses. <b style={{ color: '#ef4444' }}>Conflicts</b> = penalties. Choose wisely!
            </div>
          )}
        </div>

        {/* General */}
        <div style={{ background: '#12172e', border: '1px solid #2a3060', borderRadius: 16, padding: '16px 20px', marginBottom: 16 }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#8892b0', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>General</div>
          <Toggle label="Sound" value={settings.sound} onChange={v => updateSettings({ sound: v })} />
        </div>

        {/* Leaderboard Mode */}
        <div style={{ background: '#12172e', border: '1px solid #2a3060', borderRadius: 16, padding: '16px 20px', marginBottom: 16 }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#8892b0', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Event Mode</div>
          <Toggle label="Event Leaderboard Mode" value={settings.leaderboardMode} onChange={v => updateSettings({ leaderboardMode: v })} />
          {settings.leaderboardMode && (
            <div style={{ marginTop: 12 }}>
              <input
                value={settings.eventName}
                onChange={e => updateSettings({ eventName: e.target.value })}
                placeholder="Event name (e.g. MIT Robotics 2026)"
                style={{ width: '100%', padding: '10px 12px', background: '#0d1225', border: '1px solid #2a3060', borderRadius: 10, color: '#e8eaf6', fontSize: 13, fontFamily: 'Space Grotesk, sans-serif', boxSizing: 'border-box' }}
              />
              <button onClick={() => goTo(SCREENS.LEADERBOARD)} style={{ marginTop: 10, width: '100%', padding: '12px', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.4)', borderRadius: 10, color: '#fbbf24', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
                🏆 Open Leaderboard
              </button>
            </div>
          )}
        </div>

        {/* Developer Mode */}
        <div style={{ background: '#12172e', border: '1px solid #2a3060', borderRadius: 16, padding: '16px 20px', marginBottom: 16 }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#8892b0', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Developer</div>
          {devMode ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ color: '#ff6b35', fontWeight: 700, fontSize: 14 }}>⚙ DEV MODE ACTIVE</span>
                <button onClick={disableDevMode} style={{ padding: '6px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 8, color: '#ef4444', fontSize: 12, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
                  Disable
                </button>
              </div>
              <DevToolsInline settings={settings} updateSettings={updateSettings} goTo={goTo} />
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="password"
                  value={devPwInput}
                  onChange={e => setDevPwInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && tryEnableDev()}
                  placeholder="Enter password"
                  style={{ flex: 1, padding: '10px 12px', background: '#0d1225', border: '1px solid #2a3060', borderRadius: 10, color: '#e8eaf6', fontSize: 14, fontFamily: 'JetBrains Mono, monospace' }}
                />
                <button onClick={tryEnableDev} style={{ padding: '10px 16px', background: 'rgba(0,180,255,0.1)', border: '1px solid rgba(0,180,255,0.3)', borderRadius: 10, color: '#00b4ff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
                  Unlock
                </button>
              </div>
              {devError && <div style={{ color: '#ef4444', fontSize: 12, marginTop: 6 }}>{devError}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DevToolsInline({ settings, updateSettings, goTo }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <Toggle label="⚡ Unlimited Bits" value={settings.unlimitedBits} onChange={v => updateSettings({ unlimitedBits: v })} />
      <Toggle label="⏱ Unlimited Time" value={settings.unlimitedTime} onChange={v => updateSettings({ unlimitedTime: v })} />
      <Toggle label="🎲 Skip Curveball" value={settings.skipCurveball} onChange={v => updateSettings({ skipCurveball: v })} />
      <Toggle label="❓ Skip Question" value={settings.skipQuestion} onChange={v => updateSettings({ skipQuestion: v })} />
      <Toggle label="🤖 Auto-Answer Question" value={settings.autoAnswerQuestion} onChange={v => updateSettings({ autoAnswerQuestion: v })} />
      <Toggle label="🚀 Skip Simulation" value={settings.skipSimulation} onChange={v => updateSettings({ skipSimulation: v })} />
      <Toggle label="🛡 No Glitch Risk" value={settings.noGlitchRisk} onChange={v => updateSettings({ noGlitchRisk: v })} />
      <Toggle label="📊 Stats Overlay" value={settings.showStatsOverlay} onChange={v => updateSettings({ showStatsOverlay: v })} />

      <div style={{ paddingTop: 12, marginTop: 4 }}>
        <div style={{ fontSize: 11, color: '#8892b0', marginBottom: 6, fontFamily: 'JetBrains Mono, monospace' }}>FORCE SCORE</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="number" min={0} max={100} value={settings.forceScore ?? ''} onChange={e => updateSettings({ forceScore: e.target.value ? parseInt(e.target.value) : null })}
            placeholder="0–100 (blank = off)"
            style={{ flex: 1, padding: '8px 10px', background: '#0d1225', border: '1px solid #2a3060', borderRadius: 8, color: '#e8eaf6', fontSize: 13, fontFamily: 'JetBrains Mono, monospace' }} />
        </div>
      </div>

      <div style={{ paddingTop: 12, marginTop: 4 }}>
        <div style={{ fontSize: 11, color: '#8892b0', marginBottom: 6, fontFamily: 'JetBrains Mono, monospace' }}>FORCE MISSION</div>
        <select value={settings.forceMissionId || ''} onChange={e => updateSettings({ forceMissionId: e.target.value || null })}
          style={{ width: '100%', padding: '8px 10px', background: '#0d1225', border: '1px solid #2a3060', borderRadius: 8, color: '#e8eaf6', fontSize: 13, fontFamily: 'Space Grotesk, sans-serif' }}>
          <option value="">Random (default)</option>
          {MISSIONS.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
        </select>
      </div>

      <div style={{ paddingTop: 12, marginTop: 4 }}>
        <div style={{ fontSize: 11, color: '#8892b0', marginBottom: 8, fontFamily: 'JetBrains Mono, monospace' }}>PHASE JUMP</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {[['🏠', SCREENS.HOME], ['🎲', SCREENS.DRAW_MISSION], ['🔧', SCREENS.BUILD], ['⚡', SCREENS.CURVEBALL], ['❓', SCREENS.QUESTION], ['🤖', SCREENS.SIMULATION], ['🏆', SCREENS.RESULTS]].map(([label, screen]) => (
            <button key={screen} onClick={() => goTo(screen)} style={{ padding: '6px 10px', background: '#1a1f3a', border: '1px solid #2a3060', borderRadius: 8, color: '#8892b0', fontSize: 12, cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace' }}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
