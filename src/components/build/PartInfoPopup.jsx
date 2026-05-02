import { PARTS_BY_ID } from '../../data/parts';

const SPECIAL_RULE_LABELS = {
  maxModules:            v => `⚠️ Max ${v} total modules`,
  waterproof:            () => '💧 Works underwater',
  uselessInDarkSmoke:    () => '🚫 Useless in darkness or smoke',
  bonusInDarkSmoke:      () => '✅ Bonus in darkness and smoke',
  overridesVisibilityCap:() => '👁️ Sees through visibility limits',
  glitchRisk:            v => `⚠️ ${Math.round(v * 100)}% glitch risk during simulation`,
  uncannyWithoutEmotion: () => '😶 Creepy without an Emotion Display',
  requiresArms:          () => '🦾 Requires arms to function',
  uselessIndoors:        () => '🚫 Useless indoors or underground',
  bannedInSterile:       () => '🚫 Banned in sterile environments',
  fragile:               () => '💥 Easily damaged by impacts',
  onlyEnvironmentalJobs: () => '🌿 Only useful in environmental missions',
  onlyMedicalJobs:       () => '🏥 Only useful in medical missions',
  repairsOnePart:        () => '🔧 Repairs one broken part (single use)',
  terrainBonus:          () => '⛰️ Extra stable on rough terrain',
  heatImmune:            () => '🔥 Immune to extreme heat',
  onlyEmergencyMissions: () => '🚨 Only useful in rescue/emergency missions',
};

export default function PartInfoPopup({ part, onAdd, onRemove, isEquipped, canAfford, onClose }) {
  if (!part) return null;

  const specialTraits = Object.entries(part.specialRules || {})
    .map(([key, val]) => SPECIAL_RULE_LABELS[key]?.(val))
    .filter(Boolean);

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

        {/* Special traits */}
        {specialTraits.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#fbbf24', marginBottom: 8, letterSpacing: '0.1em', fontFamily: 'JetBrains Mono, monospace' }}>SPECIAL TRAITS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {specialTraits.map((trait, i) => (
                <div key={i} style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 8, padding: '7px 12px', fontSize: 13, color: '#e8eaf6' }}>
                  {trait}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Combo hint */}
        {part.combosWith?.length > 0 && (
          <div style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)', borderRadius: 8, padding: '8px 12px', marginBottom: 12 }}>
            <span style={{ color: '#34d399', fontSize: 13 }}>
              ⚡ Combo: <strong>{part.comboName}</strong> — {part.comboEffect}
            </span>
          </div>
        )}

        {/* Conflict hint */}
        {part.conflictsWith?.length > 0 && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, padding: '8px 12px', marginBottom: 12 }}>
            <span style={{ color: '#ef4444', fontSize: 13 }}>
              ⚠️ Conflict: <strong>{part.conflictName}</strong> — {part.conflictEffect}
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
