import { SCREENS } from '../../hooks/useGameState';
import { ENVIRONMENTS } from '../../data/environments';

const STAT_DISPLAY = {
  precision: { icon: '🎯', label: 'Precision' },
  strength: { icon: '💪', label: 'Strength' },
  perception: { icon: '👁️', label: 'Perception' },
  mobility: { icon: '🏃', label: 'Mobility' },
  durability: { icon: '🛡️', label: 'Durability' },
  adaptability: { icon: '🧠', label: 'Adaptability' },
  communication: { icon: '📡', label: 'Communication' },
  social: { icon: '🤝', label: 'Social' },
};

const CATEGORY_LABELS = {
  'social-interaction': 'Social Interaction',
  'social-daily': 'Social / Daily Life',
  'environmental': 'Environmental',
  'physical': 'Physical Work',
  'wild': 'Wild Card'
};

const CATEGORY_COLORS = {
  'social-interaction': '#34d399',
  'social-daily': '#34d399',
  'environmental': '#00b4ff',
  'physical': '#ff6b35',
  'wild': '#a78bfa'
};

const DIFFICULTY_COLORS = { bronze: '#cd7f32', silver: '#a8a9ad', gold: '#ffd700' };
const DIFFICULTY_BITS = { bronze: 80, silver: 65, gold: 50 };

export default function MissionBriefing({ state, goTo }) {
  const { mission, difficulty, bits } = state;
  if (!mission) return null;

  const env = ENVIRONMENTS[mission.environment] || ENVIRONMENTS['normal'];
  const diffColor = DIFFICULTY_COLORS[difficulty] || '#8892b0';
  const categoryColor = CATEGORY_COLORS[mission.category] || '#8892b0';

  return (
    <div
      className="bg-grid"
      style={{ minHeight: '100vh', background: '#0a0e1a', padding: '24px' }}
    >
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <button
            onClick={() => goTo(SCREENS.MISSION_DRAW)}
            style={{
              background: 'transparent', border: 'none', color: '#8892b0',
              cursor: 'pointer', fontSize: 14, fontFamily: 'Space Grotesk, sans-serif',
              display: 'flex', alignItems: 'center', gap: 6
            }}
          >
            ← Back
          </button>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
            color: '#8892b0', letterSpacing: '0.1em'
          }}>
            MISSION BRIEFING
          </div>
          <div style={{ width: 60 }} />
        </div>

        <div className="animate-fade-in">
          {/* Mission header card */}
          <div style={{
            background: '#12172e',
            border: `2px solid ${diffColor}30`,
            borderRadius: 16, padding: 28, marginBottom: 24,
            position: 'relative', overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 3,
              background: `linear-gradient(90deg, transparent, ${diffColor}, transparent)`
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
              <div>
                <h1 style={{
                  fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(24px, 4vw, 36px)',
                  fontWeight: 700, color: '#e8eaf6', margin: 0
                }}>
                  {mission.title}
                </h1>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{
                  padding: '5px 14px', borderRadius: 20, fontSize: 13, fontWeight: 700,
                  background: `${categoryColor}20`, color: categoryColor,
                  border: `1px solid ${categoryColor}40`,
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  {CATEGORY_LABELS[mission.category] || mission.category}
                </span>
                <span style={{
                  padding: '5px 14px', borderRadius: 20, fontSize: 13, fontWeight: 700,
                  background: `${diffColor}20`, color: diffColor,
                  border: `1px solid ${diffColor}40`,
                  fontFamily: 'Space Grotesk, sans-serif', textTransform: 'capitalize'
                }}>
                  {difficulty}
                </span>
                <span style={{
                  padding: '5px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                  background: 'rgba(0,180,255,0.1)', color: '#00b4ff',
                  border: '1px solid rgba(0,180,255,0.3)',
                  fontFamily: 'JetBrains Mono, monospace'
                }}>
                  {env.icon} {env.name}
                </span>
              </div>
            </div>

            <p style={{
              color: '#a8b0c8', fontSize: 15, lineHeight: 1.7,
              fontFamily: 'Space Grotesk, sans-serif', margin: 0
            }}>
              {mission.description}
            </p>
          </div>

          {/* Two column layout */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 24 }}>
            {/* Guiding objectives */}
            <div style={{ background: '#12172e', border: '1px solid #2a3060', borderRadius: 12, padding: 20 }}>
              <h3 style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#00b4ff',
                letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16, marginTop: 0
              }}>
                Guiding Objectives
              </h3>
              {mission.objectives.map((obj, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  <span style={{ color: '#00b4ff', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                    {i + 1}.
                  </span>
                  <p style={{ color: '#8892b0', fontSize: 14, lineHeight: 1.5, fontFamily: 'Space Grotesk, sans-serif', margin: 0 }}>
                    {obj}
                  </p>
                </div>
              ))}

              {/* Special rule */}
              {mission.specialRule && (
                <div style={{
                  marginTop: 16, padding: 12,
                  background: 'rgba(167, 139, 250, 0.1)',
                  border: '1px solid rgba(167, 139, 250, 0.3)',
                  borderRadius: 8
                }}>
                  <p style={{ color: '#a78bfa', fontSize: 13, fontFamily: 'JetBrains Mono, monospace', margin: 0, lineHeight: 1.5 }}>
                    ⚡ SPECIAL: {mission.specialRule}
                  </p>
                </div>
              )}
            </div>

            {/* Top stats + budget */}
            <div>
              {mission.requirements ? (() => {
                const top3 = Object.entries(mission.requirements)
                  .filter(([, v]) => v > 0)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 3);
                return (
                  <div style={{ background: '#12172e', border: '1px solid #2a3060', borderRadius: 12, padding: 20, marginBottom: 16 }}>
                    <h3 style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#00b4ff',
                      letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16, marginTop: 0
                    }}>
                      This mission needs:
                    </h3>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      {top3.map(([stat]) => {
                        const display = STAT_DISPLAY[stat] || { icon: '⚙️', label: stat };
                        return (
                          <div key={stat} style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            height: 60, padding: '0 20px',
                            background: 'rgba(0,180,255,0.08)',
                            border: '1px solid rgba(0,180,255,0.25)',
                            borderRadius: 12,
                            fontFamily: 'Space Grotesk, sans-serif',
                          }}>
                            <span style={{ fontSize: 28 }}>{display.icon}</span>
                            <span style={{ fontSize: 15, fontWeight: 700, color: '#e8eaf6' }}>{display.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })() : (
                <div style={{
                  background: '#12172e', border: '1px solid rgba(167,139,250,0.3)',
                  borderRadius: 12, padding: 20, marginBottom: 16,
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>🎲</div>
                  <p style={{ color: '#a78bfa', fontFamily: 'JetBrains Mono, monospace', fontSize: 13, margin: 0 }}>
                    Requirements revealed during build phase!
                  </p>
                </div>
              )}

              {/* Bits budget */}
              <div style={{
                background: '#12172e', border: '1px solid rgba(251,191,36,0.3)',
                borderRadius: 12, padding: 20, display: 'flex', alignItems: 'center', gap: 16
              }}>
                <div style={{ fontSize: 36 }}>💰</div>
                <div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#8892b0', marginBottom: 4, letterSpacing: '0.1em' }}>
                    STARTING BUDGET
                  </div>
                  <div style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 32,
                    fontWeight: 700, color: '#fbbf24'
                  }}>
                    {bits} Bits
                  </div>
                  <div style={{ color: '#8892b0', fontSize: 12, fontFamily: 'Space Grotesk, sans-serif', marginTop: 2 }}>
                    {difficulty} difficulty — {DIFFICULTY_BITS[difficulty] || 80} base
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Start button */}
          <button
            onClick={() => goTo(SCREENS.BUILD)}
            style={{
              width: '100%', padding: '18px',
              background: 'linear-gradient(135deg, #00b4ff, #0080cc)',
              border: 'none', borderRadius: 12, color: 'white',
              fontSize: 18, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'Space Grotesk, sans-serif',
              boxShadow: '0 4px 30px rgba(0, 180, 255, 0.4)',
              transition: 'all 0.2s',
              letterSpacing: '0.05em'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 40px rgba(0, 180, 255, 0.6)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '0 4px 30px rgba(0, 180, 255, 0.4)';
            }}
          >
            🔧 Start Building
          </button>
        </div>
      </div>
    </div>
  );
}
