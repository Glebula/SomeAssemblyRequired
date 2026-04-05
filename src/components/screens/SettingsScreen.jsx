import { useState } from 'react';
import { SCREENS } from '../../hooks/useGameState';
import { CURVEBALLS } from '../../data/curveballs';
import { MISSIONS } from '../../data/missions';

const DEV_PASSWORD = 'SAR-DEV-2026';

export default function SettingsScreen({ state, goTo, updateSettings, enableDevMode, disableDevMode, setMission }) {
  const { settings, devMode } = state;
  const [devPassword, setDevPassword] = useState('');
  const [devError, setDevError] = useState('');
  const [howToPlayOpen, setHowToPlayOpen] = useState(false);

  function handleDevSubmit() {
    if (devPassword === DEV_PASSWORD) {
      enableDevMode();
      setDevError('');
    } else {
      setDevError('Incorrect password.');
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0e1a', padding: 24
    }} className="bg-grid">
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <button
            onClick={() => goTo(SCREENS.HOME)}
            style={{
              background: 'transparent', border: 'none', color: '#8892b0',
              cursor: 'pointer', fontSize: 14, fontFamily: 'Space Grotesk, sans-serif'
            }}
          >
            ← Back
          </button>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 24,
            fontWeight: 700, color: '#e8eaf6', margin: 0
          }}>
            ⚙ Settings
          </h2>
        </div>

        <div className="animate-fade-in">
          {/* Event Leaderboard Mode */}
          <SettingsCard>
            <ToggleSetting
              label="Event Leaderboard Mode"
              description="Show a live leaderboard for tournaments and events"
              value={settings.leaderboardMode}
              onChange={v => updateSettings({ leaderboardMode: v })}
            />
            {settings.leaderboardMode && (
              <div style={{ marginTop: 12 }}>
                <input
                  value={settings.eventName}
                  onChange={e => updateSettings({ eventName: e.target.value })}
                  placeholder="Event name (e.g. MIT Robotics Championship)"
                  style={{
                    width: '100%', padding: '10px 14px',
                    background: '#1a1f3a', border: '1px solid #2a3060',
                    borderRadius: 8, color: '#e8eaf6', fontSize: 14,
                    fontFamily: 'Space Grotesk, sans-serif', marginBottom: 10
                  }}
                />
                <button
                  onClick={() => goTo(SCREENS.LEADERBOARD)}
                  style={{
                    padding: '8px 20px', background: 'rgba(251,191,36,0.15)',
                    border: '1px solid rgba(251,191,36,0.4)', borderRadius: 8,
                    color: '#fbbf24', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}
                >
                  🏆 Open Leaderboard
                </button>
              </div>
            )}
          </SettingsCard>

          {/* Sound */}
          <SettingsCard>
            <ToggleSetting
              label="Sound"
              description="Enable sound effects"
              value={settings.sound}
              onChange={v => updateSettings({ sound: v })}
            />
          </SettingsCard>

          {/* How to Play */}
          <SettingsCard>
            <button
              onClick={() => setHowToPlayOpen(true)}
              style={{
                width: '100%', padding: '12px 0', background: 'transparent',
                border: 'none', color: '#00b4ff', fontSize: 15, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif',
                textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8
              }}
            >
              📖 How to Play
            </button>
            <button
              style={{
                width: '100%', padding: '12px 0', background: 'transparent',
                border: 'none', color: '#8892b0', fontSize: 14,
                cursor: 'default', fontFamily: 'Space Grotesk, sans-serif',
                textAlign: 'left'
              }}
            >
              About: Some Assembly Required v1.0 — Built for MIT Robotics Events
            </button>
          </SettingsCard>

          {/* Developer Mode */}
          <SettingsCard>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 600, color: '#e8eaf6' }}>
                  Developer Mode
                </div>
                <div style={{ color: '#8892b0', fontSize: 13, fontFamily: 'Space Grotesk, sans-serif', marginTop: 2 }}>
                  Advanced testing tools for facilitators
                </div>
              </div>
              {devMode && (
                <button
                  onClick={disableDevMode}
                  style={{
                    padding: '4px 12px', background: 'rgba(255,107,53,0.15)',
                    border: '1px solid rgba(255,107,53,0.4)', borderRadius: 6,
                    color: '#ff6b35', fontSize: 12, cursor: 'pointer',
                    fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700
                  }}
                >
                  Disable
                </button>
              )}
            </div>

            {!devMode ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="password"
                  value={devPassword}
                  onChange={e => { setDevPassword(e.target.value); setDevError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleDevSubmit()}
                  placeholder="Enter dev password"
                  style={{
                    flex: 1, padding: '8px 12px',
                    background: '#1a1f3a', border: `1px solid ${devError ? '#ef4444' : '#2a3060'}`,
                    borderRadius: 8, color: '#e8eaf6', fontSize: 14,
                    fontFamily: 'JetBrains Mono, monospace'
                  }}
                />
                <button
                  onClick={handleDevSubmit}
                  style={{
                    padding: '8px 16px', background: '#1a1f3a',
                    border: '1px solid #2a3060', borderRadius: 8,
                    color: '#8892b0', fontSize: 13, cursor: 'pointer',
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}
                >
                  Unlock
                </button>
              </div>
            ) : null}

            {devError && (
              <p style={{ color: '#ef4444', fontSize: 13, fontFamily: 'Space Grotesk, sans-serif', marginTop: 8, marginBottom: 0 }}>
                {devError}
              </p>
            )}

            {/* Dev tools */}
            {devMode && <DevToolsPanel settings={settings} updateSettings={updateSettings} goTo={goTo} setMission={setMission} />}
          </SettingsCard>
        </div>

        {/* How to Play modal */}
        {howToPlayOpen && (
          <HowToPlayModal onClose={() => setHowToPlayOpen(false)} />
        )}
      </div>
    </div>
  );
}

function ToggleSetting({ label, description, value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
      <div>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 600, color: '#e8eaf6' }}>
          {label}
        </div>
        {description && (
          <div style={{ color: '#8892b0', fontSize: 13, fontFamily: 'Space Grotesk, sans-serif', marginTop: 2 }}>
            {description}
          </div>
        )}
      </div>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: 48, height: 26, borderRadius: 13,
          background: value ? '#00b4ff' : '#2a3060',
          border: 'none', cursor: 'pointer', padding: 0,
          position: 'relative', transition: 'background 0.2s', flexShrink: 0
        }}
      >
        <div style={{
          width: 20, height: 20, borderRadius: '50%', background: 'white',
          position: 'absolute', top: 3,
          left: value ? 25 : 3,
          transition: 'left 0.2s'
        }} />
      </button>
    </div>
  );
}

function SettingsCard({ children }) {
  return (
    <div style={{
      background: '#12172e', border: '1px solid #2a3060',
      borderRadius: 12, padding: 20, marginBottom: 12
    }}>
      {children}
    </div>
  );
}

function DevToolsPanel({ settings, updateSettings, goTo, setMission }) {
  function startFreePlay() {
    const randomMission = MISSIONS[Math.floor(Math.random() * MISSIONS.length)];
    setMission(randomMission.code, randomMission, 'bronze');
    goTo(SCREENS.BUILD);
  }
  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ height: 1, background: '#2a3060', marginBottom: 16 }} />
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#ff6b35', letterSpacing: '0.1em', marginBottom: 16 }}>
        DEV TOOLS
      </div>

      {/* Free Play */}
      <div style={{ marginBottom: 16 }}>
        <button
          onClick={startFreePlay}
          style={{
            width: '100%', padding: '12px 16px',
            background: 'linear-gradient(135deg, rgba(0,180,255,0.2), rgba(0,240,255,0.1))',
            border: '1px solid rgba(0,180,255,0.5)', borderRadius: 8,
            color: '#00f0ff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            fontFamily: 'Space Grotesk, sans-serif',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
          }}
        >
          🎲 Free Play — Random Mission → Build
        </button>
        <p style={{ color: '#8892b0', fontSize: 11, fontFamily: 'Space Grotesk, sans-serif', margin: '6px 0 0', textAlign: 'center' }}>
          Auto-assigns a random mission and jumps straight to the build screen
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        <ToggleSetting label="Unlimited Bits" value={settings.unlimitedBits} onChange={v => updateSettings({ unlimitedBits: v })} />
        <ToggleSetting label="Unlimited Time" value={settings.unlimitedTime} onChange={v => updateSettings({ unlimitedTime: v })} />
        <ToggleSetting label="No Weight Limit" value={settings.noWeightLimit} onChange={v => updateSettings({ noWeightLimit: v })} />
        <ToggleSetting label="No Power Limit" value={settings.noPowerLimit} onChange={v => updateSettings({ noPowerLimit: v })} />
        <ToggleSetting label="Skip Curveball" value={settings.skipCurveball} onChange={v => updateSettings({ skipCurveball: v })} />
        <ToggleSetting label="Skip Questions" value={settings.skipQuestions} onChange={v => updateSettings({ skipQuestions: v })} />
        <ToggleSetting label="Skip Simulation" value={settings.skipSimulation} onChange={v => updateSettings({ skipSimulation: v })} />
        <ToggleSetting label="No Glitch Risk" value={settings.noGlitchRisk} onChange={v => updateSettings({ noGlitchRisk: v })} />
        <ToggleSetting label="Show Stats Overlay" value={settings.showStatsOverlay} onChange={v => updateSettings({ showStatsOverlay: v })} />
        <ToggleSetting label="Auto-Answer Qs" value={settings.autoAnswerQuestions} onChange={v => updateSettings({ autoAnswerQuestions: v })} />
      </div>

      {/* Force score */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ color: '#8892b0', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', display: 'block', marginBottom: 4 }}>
          FORCE SCORE (0-100, blank = calculate)
        </label>
        <input
          type="number" min="0" max="100"
          value={settings.forceScore ?? ''}
          onChange={e => updateSettings({ forceScore: e.target.value ? parseInt(e.target.value) : null })}
          style={{
            padding: '8px 12px', background: '#1a1f3a',
            border: '1px solid #2a3060', borderRadius: 8,
            color: '#e8eaf6', fontSize: 14, fontFamily: 'JetBrains Mono, monospace',
            width: 120
          }}
          placeholder="auto"
        />
      </div>

      {/* Force difficulty */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ color: '#8892b0', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', display: 'block', marginBottom: 4 }}>
          FORCE DIFFICULTY
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          {[null, 'bronze', 'silver', 'gold'].map(d => (
            <button
              key={d ?? 'auto'}
              onClick={() => updateSettings({ forceDifficulty: d })}
              style={{
                padding: '5px 12px', borderRadius: 6, fontSize: 12,
                fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer',
                background: settings.forceDifficulty === d ? 'rgba(0,180,255,0.2)' : '#1a1f3a',
                border: `1px solid ${settings.forceDifficulty === d ? '#00b4ff' : '#2a3060'}`,
                color: settings.forceDifficulty === d ? '#00b4ff' : '#8892b0',
                textTransform: 'capitalize', fontWeight: 600
              }}
            >
              {d ?? 'auto'}
            </button>
          ))}
        </div>
      </div>

      {/* Phase jump buttons */}
      <div>
        <div style={{ color: '#8892b0', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', marginBottom: 8 }}>
          PHASE JUMP
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {[
            { label: 'Home', screen: SCREENS.HOME },
            { label: 'Code Entry', screen: SCREENS.CODE_ENTRY },
            { label: 'Briefing', screen: SCREENS.MISSION_BRIEFING },
            { label: 'Build', screen: SCREENS.BUILD },
            { label: 'Curveball', screen: SCREENS.CURVEBALL },
            { label: 'Questions', screen: SCREENS.QUESTIONS },
            { label: 'Simulation', screen: SCREENS.SIMULATION },
            { label: 'Results', screen: SCREENS.RESULTS },
          ].map(({ label, screen }) => (
            <button
              key={screen}
              onClick={() => goTo(screen)}
              style={{
                padding: '5px 10px', background: '#1a1f3a',
                border: '1px solid #2a3060', borderRadius: 6,
                color: '#8892b0', fontSize: 11, cursor: 'pointer',
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff6b35'; e.currentTarget.style.color = '#ff6b35'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a3060'; e.currentTarget.style.color = '#8892b0'; }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function HowToPlayModal({ onClose }) {
  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(10,14,26,0.85)',
        zIndex: 200, backdropFilter: 'blur(4px)'
      }} />
      <div className="animate-fade-in" style={{
        position: 'fixed', inset: '24px', zIndex: 201,
        background: '#12172e', border: '1px solid #2a3060',
        borderRadius: 16, padding: 28, overflow: 'auto',
        maxWidth: 560, margin: 'auto', height: 'fit-content',
        maxHeight: 'calc(100vh - 48px)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, fontWeight: 700, color: '#e8eaf6', margin: 0 }}>
            📖 How to Play
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#8892b0', fontSize: 20, cursor: 'pointer' }}>×</button>
        </div>

        {[
          { step: '1', title: 'Draw a Mission Card', desc: 'Pick a physical mission card from the deck and enter its code (MSN-XXXX) into the app.' },
          { step: '2', title: 'Read the Briefing', desc: 'Learn what job your robot needs to do. Note the environment, stat requirements, and your starting Bits budget.' },
          { step: '3', title: 'Build Your Robot (3 mins)', desc: 'Drag parts from the tray onto the workbench. Buy parts with Bits. Watch for combos (⚡) and conflicts (⚠)! Balance your stats against the mission requirements.' },
          { step: '4', title: 'Curveball Event', desc: 'Something unexpected happens! Make a quick decision that affects your robot or budget.' },
          { step: '5', title: 'Bits Challenge', desc: 'Answer 3 questions to earn bonus Bits. Engineering, logic, and ethical dilemmas — all correct in their own way.' },
          { step: '6', title: 'Field Test', desc: 'Your robot is deployed! Watch the simulation play out and see how it handles the mission.' },
          { step: '7', title: 'See Your Score', desc: 'Get a score out of 100 and see where your robot excelled or fell short. Report your score to the leaderboard!' },
        ].map(({ step, title, desc }) => (
          <div key={step} style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
              background: 'rgba(0,180,255,0.2)', border: '1px solid rgba(0,180,255,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: '#00b4ff',
              fontFamily: 'JetBrains Mono, monospace'
            }}>
              {step}
            </div>
            <div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, fontWeight: 700, color: '#e8eaf6', marginBottom: 2 }}>
                {title}
              </div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: '#8892b0', lineHeight: 1.5 }}>
                {desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
