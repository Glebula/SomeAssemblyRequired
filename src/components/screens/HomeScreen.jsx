import { useState } from 'react';
import { SCREENS } from '../../hooks/useGameState';

const STEPS = [
  { icon: '🎲', title: 'Draw a Mission', body: 'Flip your card to see the job. Tap it to see the 3 stats your robot needs most.' },
  { icon: '🔧', title: 'Build (2 min)', body: 'Spend Bits on parts. Tap a part to select it, then hit Add. Check the mission card anytime. Hit "Done building" when you\'re ready.' },
  { icon: '⚡', title: 'Curveball', body: 'Something unexpected happens. Make a quick choice — lose a part, gain Bits, or take a score penalty.' },
  { icon: '❓', title: 'Question', body: 'Answer a robotics question for bonus Bits. Ethical questions always award Bits regardless of your answer.' },
  { icon: '🤖', title: 'Simulation', body: 'Your robot runs the mission and the score builds in real time.' },
  { icon: '🏆', title: 'Results', body: 'Score 85+ for Gold · 70+ Silver · 50+ Bronze. Meet the mission\'s key stats to score well. Exceed them to reach Gold.' },
];

const TIPS = [
  { icon: '⚡', text: 'Combos give big stat bonuses — look for matching parts.' },
  { icon: '🚫', text: 'Conflicts hurt you — avoid equipping clashing parts.' },
  { icon: '💧', text: 'Underwater missions need waterproofing or ALL your stats drop.' },
  { icon: '🔥', text: 'Heat environments need a Heat Shield for full effectiveness.' },
  { icon: '🧠', text: 'Only one Frame, Power supply, and AI chip per robot.' },
  { icon: '💰', text: 'Tap an equipped part and hit Sell to swap it for something else.' },
];

export default function HomeScreen({ goTo }) {
  const [showHow, setShowHow] = useState(false);

  return (
    <div className="bg-grid" style={{ minHeight: '100vh', background: '#0a0e1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Background robot silhouette */}
      <svg style={{ position: 'absolute', opacity: 0.04, bottom: -40, right: -60, width: 400, height: 500, pointerEvents: 'none' }} viewBox="0 0 200 300">
        <rect x={60} y={20} width={80} height={68} rx={12} fill="#00b4ff" />
        <rect x={38} y={95} width={124} height={120} rx={12} fill="#00b4ff" />
        <rect x={10} y={102} width={28} height={80} rx={8} fill="#00b4ff" />
        <rect x={162} y={102} width={28} height={80} rx={8} fill="#00b4ff" />
        <rect x={55} y={218} width={36} height={58} rx={6} fill="#00b4ff" />
        <rect x={109} y={218} width={36} height={58} rx={6} fill="#00b4ff" />
      </svg>

      {/* Settings gear */}
      <button
        onClick={() => goTo(SCREENS.SETTINGS)}
        style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.05)', border: '1px solid #2a3060', borderRadius: 12, padding: '10px 14px', color: '#8892b0', fontSize: 20, cursor: 'pointer', minWidth: 44 }}
        aria-label="Settings"
      >
        ⚙
      </button>

      <div className="animate-fade-in" style={{ textAlign: 'center', padding: '0 24px 40px', position: 'relative', zIndex: 1, width: '100%', maxWidth: 480 }}>
        {/* Logo */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, rgba(0,180,255,0.15), rgba(0,240,255,0.05))', border: '1px solid rgba(0,180,255,0.3)', borderRadius: 16, padding: '6px 16px', marginBottom: 16 }}>
            <span style={{ color: '#00b4ff', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, letterSpacing: '0.2em' }}>
              🤖 ROBOTICS CHALLENGE
            </span>
          </div>
        </div>

        <h1 style={{ margin: '0 0 8px', fontFamily: 'JetBrains Mono, monospace', fontSize: 'clamp(32px, 9vw, 56px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #e8eaf6, #00b4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          SOME<br />ASSEMBLY<br />REQUIRED
        </h1>

        <p style={{ color: '#8892b0', fontSize: 16, marginBottom: 36, fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Design · Build · Test
        </p>

        <button
          onClick={() => goTo(SCREENS.DRAW_MISSION)}
          style={{ display: 'block', width: '100%', maxWidth: 280, margin: '0 auto 16px', padding: '20px 32px', background: 'linear-gradient(135deg, #00b4ff, #0066cc)', border: 'none', borderRadius: 16, color: 'white', fontSize: 20, fontWeight: 700, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.05em', boxShadow: '0 0 40px rgba(0,180,255,0.5), 0 4px 20px rgba(0,0,0,0.4)', transition: 'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'}
          onMouseLeave={e => e.currentTarget.style.transform = ''}
        >
          ▶ PLAY
        </button>

        <p style={{ color: '#3a4060', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', marginBottom: 24 }}>
          For 1 player · ~5 minutes
        </p>

        {/* How to Play toggle */}
        <button
          onClick={() => setShowHow(s => !s)}
          style={{ background: 'none', border: '1px solid #2a3060', borderRadius: 10, padding: '10px 20px', color: '#8892b0', fontSize: 13, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, width: '100%', maxWidth: 280, margin: '0 auto', display: 'block', marginBottom: 12 }}
        >
          📖 How to Play {showHow ? '▲' : '▼'}
        </button>

        {showHow && (
          <div className="animate-fade-in" style={{ textAlign: 'left', background: '#0d1225', border: '1px solid #1a2040', borderRadius: 16, padding: '20px 16px', marginTop: 4 }}>
            {/* Steps */}
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#8892b0', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>The 6 Phases</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {STEPS.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ flexShrink: 0, width: 32, height: 32, borderRadius: 8, background: 'rgba(0,180,255,0.1)', border: '1px solid rgba(0,180,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                    {step.icon}
                  </div>
                  <div>
                    <div style={{ color: '#00b4ff', fontSize: 12, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', marginBottom: 2 }}>{step.title}</div>
                    <div style={{ color: '#8892b0', fontSize: 12, lineHeight: 1.5 }}>{step.body}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#8892b0', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10 }}>Pro Tips</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {TIPS.map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '7px 10px' }}>
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{tip.icon}</span>
                  <span style={{ color: '#8892b0', fontSize: 12, lineHeight: 1.5 }}>{tip.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
