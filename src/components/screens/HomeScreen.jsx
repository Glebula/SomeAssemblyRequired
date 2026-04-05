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
      {/* Corner decorations */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: 120, height: 120,
        borderTop: '2px solid rgba(0,180,255,0.3)',
        borderLeft: '2px solid rgba(0,180,255,0.3)',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, right: 0,
        width: 120, height: 120,
        borderBottom: '2px solid rgba(0,180,255,0.3)',
        borderRight: '2px solid rgba(0,180,255,0.3)',
      }} />

      {/* Settings gear */}
      <button
        onClick={() => goTo(SCREENS.SETTINGS)}
        style={{
          position: 'absolute', top: 20, right: 20,
          background: 'transparent',
          border: '1px solid rgba(42,48,96,0.8)',
          borderRadius: 8,
          width: 44, height: 44,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          color: '#8892b0',
          fontSize: 20,
          transition: 'all 0.2s'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = '#00b4ff';
          e.currentTarget.style.color = '#00b4ff';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'rgba(42,48,96,0.8)';
          e.currentTarget.style.color = '#8892b0';
        }}
        title="Settings"
      >
        ⚙
      </button>

      {/* Main content */}
      <div className="animate-fade-in" style={{ textAlign: 'center', maxWidth: 600 }}>
        {/* Robot icon */}
        <div className="animate-float" style={{ marginBottom: 32 }}>
          <RobotLogo />
        </div>

        {/* Title */}
        <div style={{ marginBottom: 8 }}>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 'clamp(10px, 2vw, 13px)',
            color: '#00b4ff',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginBottom: 12
          }}>
            MIT Robotics Challenge
          </div>
          <h1 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(36px, 8vw, 72px)',
            lineHeight: 1,
            margin: 0,
            background: 'linear-gradient(135deg, #00b4ff, #00f0ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            SOME
          </h1>
          <h1 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(36px, 8vw, 72px)',
            lineHeight: 1,
            margin: 0,
            color: '#e8eaf6',
          }}>
            ASSEMBLY
          </h1>
          <h1 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(36px, 8vw, 72px)',
            lineHeight: 1,
            margin: '0 0 16px 0',
            background: 'linear-gradient(135deg, #ff6b35, #ff9a35)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            REQUIRED
          </h1>
        </div>

        <p style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 'clamp(14px, 2.5vw, 18px)',
          color: '#8892b0',
          letterSpacing: '0.2em',
          marginBottom: 48,
          textTransform: 'uppercase'
        }}>
          Design. Build. Test.
        </p>

        {/* Start button */}
        <button
          onClick={() => goTo(SCREENS.CODE_ENTRY)}
          style={{
            background: 'linear-gradient(135deg, #00b4ff, #0080cc)',
            color: 'white',
            border: 'none',
            padding: '18px 56px',
            borderRadius: 12,
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: 20,
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 30px rgba(0, 180, 255, 0.4)',
            letterSpacing: '0.05em'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 8px 40px rgba(0, 180, 255, 0.6)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = '';
            e.currentTarget.style.boxShadow = '0 4px 30px rgba(0, 180, 255, 0.4)';
          }}
        >
          ▶ Start Round
        </button>

        {/* Tagline */}
        <p style={{
          marginTop: 32,
          color: 'rgba(136,146,176,0.6)',
          fontSize: 13,
          fontFamily: 'JetBrains Mono, monospace'
        }}>
          Draw a Mission Card to begin
        </p>
      </div>
    </div>
  );
}

function RobotLogo() {
  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      {/* Glow */}
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Antenna */}
      <line x1="50" y1="8" x2="50" y2="20" stroke="#00b4ff" strokeWidth="2" filter="url(#glow)"/>
      <circle cx="50" cy="6" r="4" fill="#00f0ff" filter="url(#glow)"/>

      {/* Head */}
      <rect x="30" y="20" width="40" height="28" rx="6" fill="#1a1f3a" stroke="#00b4ff" strokeWidth="1.5"/>
      {/* Eyes */}
      <rect x="37" y="28" width="10" height="8" rx="2" fill="#00f0ff" filter="url(#glow)"/>
      <rect x="53" y="28" width="10" height="8" rx="2" fill="#00f0ff" filter="url(#glow)"/>

      {/* Body */}
      <rect x="25" y="52" width="50" height="32" rx="6" fill="#1a1f3a" stroke="#00b4ff" strokeWidth="1.5"/>
      {/* Chest core */}
      <circle cx="50" cy="68" r="8" fill="#12172e" stroke="#ff6b35" strokeWidth="1.5"/>
      <circle cx="50" cy="68" r="4" fill="#ff6b35" opacity="0.8" filter="url(#glow)"/>

      {/* Arms */}
      <rect x="8" y="54" width="14" height="24" rx="5" fill="#1a1f3a" stroke="#00b4ff" strokeWidth="1.5"/>
      <rect x="78" y="54" width="14" height="24" rx="5" fill="#1a1f3a" stroke="#00b4ff" strokeWidth="1.5"/>

      {/* Legs */}
      <rect x="31" y="87" width="14" height="10" rx="4" fill="#1a1f3a" stroke="#00b4ff" strokeWidth="1.5"/>
      <rect x="55" y="87" width="14" height="10" rx="4" fill="#1a1f3a" stroke="#00b4ff" strokeWidth="1.5"/>
    </svg>
  );
}
