import { SCREENS } from '../../hooks/useGameState';

export default function HomeScreen({ goTo }) {
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
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Ambient glow blobs */}
      <div style={{
        position: 'absolute', top: '15%', left: '10%',
        width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,180,255,0.06) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '20%', right: '5%',
        width: 250, height: 250, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,53,0.06) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Settings gear — subtle, top right */}
      <button
        onClick={() => goTo(SCREENS.SETTINGS)}
        style={{
          position: 'absolute', top: 20, right: 20,
          background: 'transparent',
          border: '1px solid rgba(42,48,96,0.6)',
          borderRadius: 10,
          width: 44, height: 44,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          color: '#4a5578',
          fontSize: 20,
          transition: 'all 0.2s'
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#00b4ff'; e.currentTarget.style.color = '#00b4ff'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(42,48,96,0.6)'; e.currentTarget.style.color = '#4a5578'; }}
        title="Settings"
      >
        ⚙
      </button>

      {/* Main content */}
      <div className="animate-fade-in" style={{ textAlign: 'center', maxWidth: 500 }}>
        {/* Robot */}
        <div className="animate-float" style={{ marginBottom: 40 }}>
          <RobotLogo />
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 700,
          fontSize: 'clamp(42px, 10vw, 80px)',
          lineHeight: 0.95,
          margin: '0 0 24px 0',
        }}>
          <span style={{
            display: 'block',
            background: 'linear-gradient(135deg, #00b4ff, #00f0ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>SOME</span>
          <span style={{ display: 'block', color: '#e8eaf6' }}>ASSEMBLY</span>
          <span style={{
            display: 'block',
            background: 'linear-gradient(135deg, #ff6b35, #ff9a35)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>REQUIRED</span>
        </h1>

        <p style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 14,
          color: '#4a5578',
          letterSpacing: '0.2em',
          marginBottom: 48,
          textTransform: 'uppercase'
        }}>
          Build · Deploy · Score
        </p>

        {/* PLAY button — the hero CTA */}
        <button
          onClick={() => goTo(SCREENS.CODE_ENTRY)}
          style={{
            background: 'linear-gradient(135deg, #00b4ff, #0080cc)',
            color: 'white',
            border: 'none',
            padding: '22px 72px',
            borderRadius: 16,
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: 24,
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 6px 40px rgba(0, 180, 255, 0.5)',
            letterSpacing: '0.05em',
            display: 'block',
            width: '100%',
            maxWidth: 360,
            margin: '0 auto 20px'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 10px 50px rgba(0, 180, 255, 0.7)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = '';
            e.currentTarget.style.boxShadow = '0 6px 40px rgba(0, 180, 255, 0.5)';
          }}
        >
          ▶ PLAY
        </button>

        <p style={{
          color: 'rgba(74,85,120,0.8)',
          fontSize: 13,
          fontFamily: 'Space Grotesk, sans-serif'
        }}>
          Draw a mission card to get started
        </p>
      </div>
    </div>
  );
}

function RobotLogo() {
  return (
    <svg width="120" height="120" viewBox="0 0 100 100">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <line x1="50" y1="8" x2="50" y2="20" stroke="#00b4ff" strokeWidth="2" filter="url(#glow)"/>
      <circle cx="50" cy="6" r="4" fill="#00f0ff" filter="url(#glow)"/>
      <rect x="30" y="20" width="40" height="28" rx="6" fill="#1a1f3a" stroke="#00b4ff" strokeWidth="1.5"/>
      <rect x="37" y="28" width="10" height="8" rx="2" fill="#00f0ff" filter="url(#glow)"/>
      <rect x="53" y="28" width="10" height="8" rx="2" fill="#00f0ff" filter="url(#glow)"/>
      <rect x="25" y="52" width="50" height="32" rx="6" fill="#1a1f3a" stroke="#00b4ff" strokeWidth="1.5"/>
      <circle cx="50" cy="68" r="8" fill="#12172e" stroke="#ff6b35" strokeWidth="1.5"/>
      <circle cx="50" cy="68" r="4" fill="#ff6b35" opacity="0.8" filter="url(#glow)"/>
      <rect x="8" y="54" width="14" height="24" rx="5" fill="#1a1f3a" stroke="#00b4ff" strokeWidth="1.5"/>
      <rect x="78" y="54" width="14" height="24" rx="5" fill="#1a1f3a" stroke="#00b4ff" strokeWidth="1.5"/>
      <rect x="31" y="87" width="14" height="10" rx="4" fill="#1a1f3a" stroke="#00b4ff" strokeWidth="1.5"/>
      <rect x="55" y="87" width="14" height="10" rx="4" fill="#1a1f3a" stroke="#00b4ff" strokeWidth="1.5"/>
    </svg>
  );
}
