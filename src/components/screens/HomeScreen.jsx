import { SCREENS } from '../../hooks/useGameState';

export default function HomeScreen({ goTo }) {
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
        style={{
          position: 'absolute', top: 20, right: 20,
          background: 'rgba(255,255,255,0.05)', border: '1px solid #2a3060',
          borderRadius: 12, padding: '10px 14px',
          color: '#8892b0', fontSize: 20, cursor: 'pointer',
          minWidth: 44,
        }}
        aria-label="Settings"
      >
        ⚙
      </button>

      <div className="animate-fade-in" style={{ textAlign: 'center', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ marginBottom: 12 }}>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, rgba(0,180,255,0.15), rgba(0,240,255,0.05))',
            border: '1px solid rgba(0,180,255,0.3)',
            borderRadius: 16,
            padding: '6px 16px',
            marginBottom: 16,
          }}>
            <span style={{ color: '#00b4ff', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, letterSpacing: '0.2em' }}>
              🤖 ROBOTICS CHALLENGE
            </span>
          </div>
        </div>

        <h1 style={{
          margin: '0 0 8px',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 'clamp(32px, 9vw, 56px)',
          fontWeight: 700,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          background: 'linear-gradient(135deg, #e8eaf6, #00b4ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          SOME<br />ASSEMBLY<br />REQUIRED
        </h1>

        <p style={{
          color: '#8892b0',
          fontSize: 16,
          marginBottom: 48,
          fontFamily: 'Space Grotesk, sans-serif',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}>
          Design · Build · Test
        </p>

        <button
          onClick={() => goTo(SCREENS.DRAW_MISSION)}
          style={{
            display: 'block',
            width: '100%',
            maxWidth: 280,
            margin: '0 auto 20px',
            padding: '20px 32px',
            background: 'linear-gradient(135deg, #00b4ff, #0066cc)',
            border: 'none',
            borderRadius: 16,
            color: 'white',
            fontSize: 20,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'Space Grotesk, sans-serif',
            letterSpacing: '0.05em',
            boxShadow: '0 0 40px rgba(0,180,255,0.5), 0 4px 20px rgba(0,0,0,0.4)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'}
          onMouseLeave={e => e.currentTarget.style.transform = ''}
        >
          ▶ PLAY
        </button>

        <p style={{ color: '#3a4060', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>
          For 1 player · ~5 minutes
        </p>
      </div>
    </div>
  );
}
