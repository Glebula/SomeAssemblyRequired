import { useState, useEffect } from 'react';
import { SCREENS } from '../../hooks/useGameState';

export default function CurveballScreen({ state, goTo, pickCurveball, applyCurveballEffect }) {
  const { curveballEvent, settings } = state;
  const [animIn, setAnimIn] = useState(false);
  const [chosen, setChosen] = useState(null);
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    if (!curveballEvent) pickCurveball();
  }, []);

  useEffect(() => {
    if (curveballEvent) {
      const t = setTimeout(() => setAnimIn(true), 50);
      return () => clearTimeout(t);
    }
  }, [curveballEvent]);

  function handleChoice(choice) {
    if (resolving) return;
    setChosen(choice);
    setResolving(true);
    applyCurveballEffect(curveballEvent, choice);
    setTimeout(() => goTo(settings.skipQuestion ? SCREENS.SIMULATION : SCREENS.QUESTION), 1200);
  }

  if (!curveballEvent) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0e1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#8892b0', fontFamily: 'JetBrains Mono, monospace' }}>Loading event…</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'rgba(10,14,26,0.97)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Warning strip */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
            color: '#ef4444', letterSpacing: '0.3em', textTransform: 'uppercase',
            animation: 'pulse 1s ease-in-out infinite',
          }}>
            ⚠ CURVEBALL EVENT ⚠
          </span>
        </div>

        {/* Event card */}
        <div
          style={{
            background: '#12172e',
            border: '2px solid rgba(239,68,68,0.4)',
            borderRadius: 20,
            padding: '32px 24px',
            marginBottom: 20,
            textAlign: 'center',
            animation: animIn ? 'slamIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both' : undefined,
            boxShadow: '0 0 40px rgba(239,68,68,0.2)',
          }}
        >
          <div style={{ fontSize: 56, marginBottom: 16 }}>{curveballEvent.icon}</div>
          <h2 style={{
            margin: '0 0 12px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 24, fontWeight: 700, color: '#ef4444',
          }}>
            {curveballEvent.name}
          </h2>
          <p style={{ color: '#8892b0', fontSize: 15, margin: 0, lineHeight: 1.6 }}>
            {curveballEvent.description}
          </p>
        </div>

        {/* Choices */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {['A', 'B'].map(choice => {
            const opt = choice === 'A' ? curveballEvent.optionA : curveballEvent.optionB;
            const picked = chosen === choice;
            const other = chosen && chosen !== choice;
            return (
              <button
                key={choice}
                onClick={() => !chosen && handleChoice(choice)}
                style={{
                  padding: '18px 20px',
                  background: picked ? 'rgba(0,180,255,0.2)' : other ? 'rgba(255,255,255,0.02)' : '#1a1f3a',
                  border: `2px solid ${picked ? '#00b4ff' : other ? '#1a2040' : '#2a3060'}`,
                  borderRadius: 14,
                  color: picked ? '#00b4ff' : other ? '#2a3060' : '#e8eaf6',
                  fontSize: 15, fontWeight: 600, cursor: chosen ? 'default' : 'pointer',
                  fontFamily: 'Space Grotesk, sans-serif',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  opacity: other ? 0.4 : 1,
                }}
              >
                <span style={{ color: picked ? '#00b4ff' : '#8892b0', fontFamily: 'JetBrains Mono, monospace', marginRight: 10 }}>
                  {choice}:
                </span>
                {opt.text}
              </button>
            );
          })}
        </div>

        {resolving && (
          <div style={{ textAlign: 'center', marginTop: 20, color: '#8892b0', fontSize: 13, fontFamily: 'JetBrains Mono, monospace', animation: 'pulse 0.5s ease-in-out infinite' }}>
            Applying effect…
          </div>
        )}
      </div>
    </div>
  );
}
