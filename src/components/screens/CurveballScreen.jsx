import { useState, useEffect } from 'react';
import { SCREENS } from '../../hooks/useGameState';
import { useTimer } from '../../hooks/useTimer';
import { PARTS } from '../../data/parts';

const CURVEBALL_TIME = 60;

export default function CurveballScreen({ state, goTo, update, unequipPart }) {
  const { curveballEvent, equippedPartIds, bits } = state;
  const [resolved, setResolved] = useState(false);
  const [workbenchOpen, setWorkbenchOpen] = useState(false);

  const timer = useTimer(CURVEBALL_TIME, () => handleAction(curveballEvent?.options?.[0]?.action, curveballEvent?.options?.[0]));

  useEffect(() => {
    timer.start();
  }, []);

  function handleAction(actionType, option) {
    timer.pause();
    switch (actionType) {
      case 'scorePenalty':
        update({ curveballPenalty: (state.curveballPenalty || 0) + (option?.penalty || -10) });
        proceed();
        break;
      case 'removePart':
        setWorkbenchOpen(true);
        break;
      case 'openWorkbench':
        setWorkbenchOpen(true);
        break;
      case 'addBits':
        update({ bits: bits + (option?.amount || 0) });
        proceed();
        break;
      case 'statPenalty':
        update({ curveballPenalty: (state.curveballPenalty || 0) + (option?.amount || -2) });
        proceed();
        break;
      case 'requirementIncrease':
        // Store as penalty
        update({ curveballPenalty: (state.curveballPenalty || 0) - 4 });
        proceed();
        break;
      case 'freePart':
      case 'swapPart':
      case 'forceRemoveAndReplace':
      case 'forceRemove':
        setWorkbenchOpen(true);
        break;
      case 'acceptNewEnvironment':
      default:
        proceed();
    }
  }

  function proceed() {
    setResolved(true);
    setTimeout(() => {
      goTo(SCREENS.QUESTIONS);
    }, 800);
  }

  if (!curveballEvent) {
    goTo(SCREENS.QUESTIONS);
    return null;
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0e1a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, position: 'relative', overflow: 'hidden'
    }}>
      {/* Dark overlay */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(255,107,53,0.08) 0%, rgba(10,14,26,0.95) 70%)'
      }} />

      {/* Content */}
      <div className="animate-slam-in" style={{
        position: 'relative', zIndex: 10,
        maxWidth: 560, width: '100%'
      }}>
        {/* Timer */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 28, fontWeight: 700,
            color: timer.seconds <= 10 ? '#ef4444' : '#fbbf24'
          }}>
            ⏱ {timer.formatted}
          </span>
        </div>

        {/* Event card */}
        <div style={{
          background: '#12172e',
          border: '2px solid rgba(255, 107, 53, 0.6)',
          borderRadius: 20, padding: 32,
          boxShadow: '0 0 60px rgba(255, 107, 53, 0.2)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>{curveballEvent.icon}</div>

          <div style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#ff6b35',
            letterSpacing: '0.3em', marginBottom: 12, textTransform: 'uppercase'
          }}>
            ⚡ CURVEBALL EVENT
          </div>

          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(22px, 4vw, 32px)',
            fontWeight: 700, color: '#e8eaf6', marginBottom: 16, marginTop: 0
          }}>
            {curveballEvent.name}
          </h2>

          <p style={{
            color: '#8892b0', fontSize: 16, lineHeight: 1.6,
            fontFamily: 'Space Grotesk, sans-serif', marginBottom: 32
          }}>
            {curveballEvent.description}
          </p>

          {/* Options */}
          {!resolved && !workbenchOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {curveballEvent.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleAction(option.action, option)}
                  style={{
                    padding: '14px 20px',
                    background: i === 0
                      ? 'linear-gradient(135deg, #ff6b35, #cc4a20)'
                      : 'rgba(255, 107, 53, 0.1)',
                    border: i === 0 ? 'none' : '1px solid rgba(255, 107, 53, 0.3)',
                    borderRadius: 10, color: 'white',
                    fontSize: 15, fontWeight: i === 0 ? 700 : 600,
                    cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif',
                    transition: 'all 0.2s',
                    textAlign: 'left'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={e => e.currentTarget.style.transform = ''}
                >
                  {option.text}
                </button>
              ))}
            </div>
          )}

          {/* Workbench open: show equipped parts for removal */}
          {workbenchOpen && (
            <div>
              <p style={{ color: '#00b4ff', fontSize: 14, fontFamily: 'Space Grotesk, sans-serif', marginBottom: 16 }}>
                Select a part to remove from your robot:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
                {equippedPartIds.map(id => {
                  const part = PARTS.find(p => p.id === id);
                  if (!part) return null;
                  return (
                    <button
                      key={id}
                      onClick={() => { unequipPart(id, part.cost); proceed(); }}
                      style={{
                        padding: '8px 14px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        borderRadius: 8, color: '#ef4444',
                        fontSize: 13, cursor: 'pointer',
                        fontFamily: 'Space Grotesk, sans-serif'
                      }}
                    >
                      ✕ {part.name} ({part.cost}b)
                    </button>
                  );
                })}
              </div>
              <button
                onClick={proceed}
                style={{
                  padding: '10px 24px', background: 'transparent',
                  border: '1px solid #2a3060', borderRadius: 8,
                  color: '#8892b0', fontSize: 13, cursor: 'pointer',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}
              >
                Skip (no change)
              </button>
            </div>
          )}

          {resolved && (
            <div className="animate-fade-in" style={{ color: '#34d399', fontSize: 18, fontWeight: 700 }}>
              ✓ Response recorded — continuing...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
