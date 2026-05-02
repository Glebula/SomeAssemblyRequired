import { PARTS_BY_ID } from '../../data/parts';

const STAT_ICONS = { precision:'🎯', strength:'💪', perception:'👁️', mobility:'⚡', durability:'🛡️', adaptability:'🧠', communication:'📡', social:'🤝' };

export default function PartInfoPopup({ part, onAdd, onRemove, isEquipped, canAfford, onClose }) {
  if (!part) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#12172e',
          border: '1px solid #2a3060',
          borderRadius: '20px 20px 0 0',
          padding: '24px 20px 32px',
          width: '100%',
          maxWidth: 500,
          animation: 'slideUp 0.3s ease',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#8892b0', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>
              {part.category.toUpperCase()}
            </div>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#e8eaf6' }}>{part.name}</h3>
          </div>
          <div style={{
            background: 'rgba(0,180,255,0.15)', color: '#00b4ff',
            border: '1px solid rgba(0,180,255,0.4)',
            borderRadius: 20, padding: '4px 12px',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 16, fontWeight: 700,
          }}>
            {part.cost} Bits
          </div>
        </div>

        <p style={{ color: '#8892b0', fontSize: 14, margin: '0 0 16px', lineHeight: 1.5 }}>{part.description}</p>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          {Object.keys(part.benefits || {}).length > 0 && (
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#34d399', marginBottom: 6, letterSpacing: '0.1em' }}>GOOD AT</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {Object.entries(part.benefits).map(([s, v]) => v !== 0 && (
                  <span key={s} style={{
                    background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)',
                    borderRadius: 6, padding: '2px 8px', fontSize: 12, color: '#34d399',
                  }}>
                    {STAT_ICONS[s]} +{v} {s}
                  </span>
                ))}
              </div>
            </div>
          )}
          {Object.keys(part.tradeoffs || {}).length > 0 && (
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', marginBottom: 6, letterSpacing: '0.1em' }}>WEAK AT</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {Object.entries(part.tradeoffs).map(([s, v]) => (
                  <span key={s} style={{
                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: 6, padding: '2px 8px', fontSize: 12, color: '#ef4444',
                  }}>
                    {STAT_ICONS[s]} {v} {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Combo hint */}
        {part.combosWith?.length > 0 && (
          <div style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: 8, padding: '8px 12px', marginBottom: 12 }}>
            <span style={{ color: '#fbbf24', fontSize: 13 }}>
              ⚡ Combo: <strong>{part.comboName}</strong> — {part.comboEffect}
            </span>
          </div>
        )}

        {/* Action button */}
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          {isEquipped ? (
            <button
              onClick={onRemove}
              style={{
                flex: 1, padding: '14px',
                background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.5)',
                borderRadius: 12, color: '#ef4444',
                fontSize: 15, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'Space Grotesk, sans-serif',
              }}
            >
              Remove Part
            </button>
          ) : (
            <button
              onClick={canAfford ? onAdd : undefined}
              style={{
                flex: 1, padding: '14px',
                background: canAfford ? 'linear-gradient(135deg, #00b4ff, #0080cc)' : 'rgba(255,255,255,0.05)',
                border: canAfford ? 'none' : '1px solid #2a3060',
                borderRadius: 12,
                color: canAfford ? 'white' : '#4a5568',
                fontSize: 15, fontWeight: 700,
                cursor: canAfford ? 'pointer' : 'not-allowed',
                fontFamily: 'Space Grotesk, sans-serif',
                boxShadow: canAfford ? '0 4px 20px rgba(0,180,255,0.35)' : undefined,
              }}
            >
              {canAfford ? 'Add to Robot' : `Need ${part.cost} Bits`}
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              padding: '14px 20px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid #2a3060',
              borderRadius: 12, color: '#8892b0',
              fontSize: 15, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'Space Grotesk, sans-serif',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
