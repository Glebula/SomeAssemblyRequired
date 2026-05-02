import { PARTS, CATEGORY_COLORS, CATEGORY_LABELS } from '../../data/parts';
import { COMBOS } from '../../data/combos';

const STAT_LABELS = {
  precision: 'Precision', strength: 'Strength', perception: 'Perception',
  mobility: 'Mobility', durability: 'Durability', adaptability: 'Adaptability',
  communication: 'Communication', social: 'Social'
};

const STAT_ICONS = {
  precision: '🎯', strength: '💪', perception: '👁️', mobility: '🏃',
  durability: '🛡️', adaptability: '🧠', communication: '📡', social: '🤝'
};

export default function PartInfoPopup({ part, onClose, onEquip, onUnequip, isEquipped, canAfford, equippedPartIds = [] }) {
  if (!part) return null;

  const color = CATEGORY_COLORS[part.category] || '#00b4ff';
  const combos = COMBOS.filter(c => c.parts.includes(part.id));

  const conflictingEquipped = (part.conflictsWith || []).filter(id => equippedPartIds.includes(id));
  const conflictingPart = conflictingEquipped.length > 0 ? PARTS.find(p => p.id === conflictingEquipped[0]) : null;

  const goodStats = Object.entries(part.benefits).filter(([, v]) => v > 0).map(([s]) => s);
  const badStats = Object.entries(part.tradeoffs).filter(([, v]) => v < 0).map(([s]) => s);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(10, 14, 26, 0.8)',
          zIndex: 100, backdropFilter: 'blur(4px)'
        }}
      />

      {/* Panel */}
      <div
        className="animate-slide-up"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          zIndex: 101,
          background: '#12172e',
          borderTop: `2px solid ${color}`,
          borderRadius: '20px 20px 0 0',
          padding: '24px',
          maxHeight: '80vh',
          overflowY: 'auto',
          maxWidth: 600,
          margin: '0 auto'
        }}
      >
        {/* Handle bar */}
        <div style={{ width: 40, height: 4, background: '#2a3060', borderRadius: 2, margin: '0 auto 20px' }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <span style={{
              padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700,
              background: `${color}20`, color, border: `1px solid ${color}40`,
              fontFamily: 'Space Grotesk, sans-serif', textTransform: 'uppercase',
              letterSpacing: '0.05em', marginBottom: 8, display: 'inline-block'
            }}>
              {CATEGORY_LABELS[part.category]}
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <h3 style={{
                fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, fontWeight: 700,
                color: '#e8eaf6', margin: 0
              }}>
                {part.name}
              </h3>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 16, fontWeight: 700,
                color: '#fbbf24'
              }}>
                {part.cost}b
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent', border: '1px solid #2a3060',
              borderRadius: 8, width: 36, height: 36, color: '#8892b0',
              cursor: 'pointer', fontSize: 18, display: 'flex',
              alignItems: 'center', justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>

        {/* Part SVG illustration */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <PartIllustration part={part} color={color} />
        </div>

        {/* Description */}
        <p style={{
          color: '#8892b0', fontSize: 14, lineHeight: 1.6,
          fontFamily: 'Space Grotesk, sans-serif', marginBottom: 20
        }}>
          {part.description}
        </p>

        {/* GOOD AT / BAD AT icon rows */}
        {(goodStats.length > 0 || badStats.length > 0) && (
          <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {goodStats.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ color: '#34d399', fontSize: 11, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>GOOD AT:</span>
                {goodStats.map(stat => (
                  <span key={stat} style={{ fontSize: 22 }} title={STAT_LABELS[stat]}>{STAT_ICONS[stat] || '⚙️'}</span>
                ))}
              </div>
            )}
            {badStats.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ color: '#ef4444', fontSize: 11, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>BAD AT:</span>
                {badStats.map(stat => (
                  <span key={stat} style={{ fontSize: 22 }} title={STAT_LABELS[stat]}>{STAT_ICONS[stat] || '⚙️'}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Combos */}
        {combos.length > 0 && (
          <div style={{
            marginBottom: 16, padding: 12,
            background: 'rgba(251, 191, 36, 0.08)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            borderRadius: 8
          }}>
            <div style={{ fontSize: 11, color: '#fbbf24', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em', marginBottom: 8 }}>
              ⚡ COMBO POTENTIAL
            </div>
            {combos.map(combo => {
              const partnerIds = combo.parts.filter(id => id !== part.id);
              const partners = partnerIds.map(id => PARTS.find(p => p.id === id)?.name).filter(Boolean);
              return (
                <div key={combo.name}>
                  <span style={{ color: '#fbbf24', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', fontSize: 13 }}>
                    {combo.name}
                  </span>
                  <span style={{ color: '#8892b0', fontSize: 13, fontFamily: 'Space Grotesk, sans-serif' }}>
                    {' '}— Pairs with {partners.join(', ')}
                  </span>
                  <div style={{ color: '#fbbf24', fontSize: 12, fontFamily: 'Space Grotesk, sans-serif', marginTop: 2 }}>
                    {combo.description}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Conflict warning */}
        {conflictingPart && (
          <div style={{
            marginBottom: 16, padding: 12,
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: 8
          }}>
            <div style={{ color: '#ef4444', fontSize: 12, fontFamily: 'Space Grotesk, sans-serif' }}>
              ⚠ Conflicts with <strong>{conflictingPart.name}</strong> currently on workbench: {part.conflictEffect}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          {isEquipped ? (
            <button
              onClick={() => { onUnequip(part); onClose(); }}
              style={{
                flex: 1, padding: '14px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '2px solid rgba(239, 68, 68, 0.5)',
                borderRadius: 10, color: '#ef4444',
                fontSize: 15, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'Space Grotesk, sans-serif', transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'}
            >
              Remove from Workbench
            </button>
          ) : (
            <button
              onClick={() => { if (canAfford) { onEquip(part); onClose(); } }}
              disabled={!canAfford}
              style={{
                flex: 1, padding: '14px',
                background: canAfford ? 'linear-gradient(135deg, #00b4ff, #0080cc)' : '#1a1f3a',
                border: `2px solid ${canAfford ? 'transparent' : '#2a3060'}`,
                borderRadius: 10, color: canAfford ? 'white' : '#4a5060',
                fontSize: 15, fontWeight: 700, cursor: canAfford ? 'pointer' : 'not-allowed',
                fontFamily: 'Space Grotesk, sans-serif', transition: 'all 0.2s',
                boxShadow: canAfford ? '0 4px 20px rgba(0, 180, 255, 0.3)' : 'none'
              }}
            >
              {canAfford ? `Add to Workbench (${part.cost} Bits)` : `Can't Afford (${part.cost} Bits)`}
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              padding: '14px 20px', background: 'transparent',
              border: '1px solid #2a3060', borderRadius: 10, color: '#8892b0',
              fontSize: 14, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}

function PartIllustration({ part, color }) {
  const size = 80;
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <defs>
        <filter id={`part-glow-${part.id}`}>
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <rect x="8" y="8" width="64" height="64" rx="12"
        fill="#1a1f3a" stroke={color} strokeWidth="2"
        filter={`url(#part-glow-${part.id})`}
      />
      {/* Category-specific icon */}
      <text x="40" y="48" textAnchor="middle" fontSize="28" filter={`url(#part-glow-${part.id})`}>
        {getCategoryEmoji(part.category, part.id)}
      </text>
      {/* Cost badge */}
      <rect x="50" y="6" width="26" height="16" rx="8" fill={color}/>
      <text x="63" y="17" textAnchor="middle" fill="white" fontSize="9" fontFamily="JetBrains Mono, monospace" fontWeight="700">
        {part.cost}b
      </text>
    </svg>
  );
}

function getCategoryEmoji(category, id) {
  const map = {
    frame: '🤖', arms: '🦾', sensors: '👁', ai: '🧠',
    communication: '📡', power: '⚡', specialty: '🔧'
  };
  const specific = {
    1: '🏃', 2: '🤖', 3: '🛡', 4: '🌊',
    6: '✂️', 7: '💪', 9: '🤲', 11: '🌡', 12: '📡',
    17: '🧠', 23: '😊', 29: '☢️', 33: '🪝', 37: '🛡', 40: '😄'
  };
  return specific[id] || map[category] || '⚙';
}
