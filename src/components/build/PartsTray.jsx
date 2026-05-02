import { useState } from 'react';
import { PARTS, PART_CATEGORIES, PARTS_BY_ID, SINGLE_EQUIP_CATEGORIES } from '../../data/parts';
import { useDraggable } from '@dnd-kit/core';

const CATEGORY_COLORS = {
  frame: '#1d4ed8', arms: '#f97316', sensors: '#06b6d4',
  ai: '#a855f7', communication: '#22c55e', power: '#eab308', specialty: '#00b4ff',
};

function DraggablePart({ part, isEquipped, isSelected, canAfford, categoryLocked, onClick }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: `part-${part.id}` });
  const dimmed = !isEquipped && (!canAfford || categoryLocked);

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        flex: '0 0 auto',
        width: 84,
        position: 'relative',
        opacity: isDragging ? 0.4 : dimmed ? 0.4 : 1,
        transform: transform ? `translate(${transform.x}px,${transform.y}px)` : undefined,
        touchAction: 'none',
      }}
    >
      <button
        onClick={() => onClick(part.id)}
        style={{
          width: '100%',
          background: isSelected
            ? 'rgba(0,180,255,0.2)'
            : isEquipped ? 'rgba(0,180,255,0.1)' : '#1a1f3a',
          border: `2px solid ${isSelected ? '#00b4ff' : isEquipped ? 'rgba(0,180,255,0.5)' : dimmed ? '#1a2040' : '#2a3060'}`,
          borderRadius: 12,
          padding: '10px 6px 8px',
          cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          boxShadow: isSelected ? '0 0 0 2px rgba(0,180,255,0.3)' : undefined,
        }}
      >
        <PartIcon part={part} size={36} dim={dimmed} />
        <div style={{
          fontSize: 10,
          color: isSelected ? '#e8eaf6' : dimmed ? '#3a4060' : '#8892b0',
          textAlign: 'center', lineHeight: 1.2,
          fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500,
        }}>
          {part.name}
        </div>
        <div style={{
          background: isEquipped ? 'rgba(0,180,255,0.2)' : 'rgba(255,255,255,0.06)',
          color: isEquipped ? '#00b4ff' : dimmed ? '#2a3060' : '#8892b0',
          borderRadius: 10, padding: '1px 7px',
          fontSize: 10, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
        }}>
          {isEquipped ? '✓' : `${part.cost}b`}
        </div>
      </button>
    </div>
  );
}

function PartIcon({ part, size = 32, dim }) {
  const color = dim ? '#2a3060' : CATEGORY_COLORS[part.category] || '#00b4ff';
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 32 32">
      {part.category === 'frame' && (
        <rect x={4} y={6} width={24} height={20} rx={3} fill="none" stroke={color} strokeWidth={2.5} />
      )}
      {part.category === 'arms' && (
        <g>
          <rect x={3} y={8} width={8} height={16} rx={3} fill={color} opacity={0.8} />
          <rect x={21} y={8} width={8} height={16} rx={3} fill={color} opacity={0.8} />
          <path d={part.id === 7 ? 'M3 24 L1 30 M8 24 L6 30' : 'M5 24 L3 30 M9 24 L11 30'} stroke={color} strokeWidth={2.5} strokeLinecap="round" />
          <path d={part.id === 7 ? 'M21 24 L19 30 M26 24 L24 30' : 'M21 24 L19 30 M25 24 L27 30'} stroke={color} strokeWidth={2.5} strokeLinecap="round" />
        </g>
      )}
      {part.category === 'sensors' && (
        <circle cx={16} cy={16} r={10} fill="none" stroke={color} strokeWidth={2.5} />
      )}
      {part.category === 'ai' && (
        <g>
          <circle cx={16} cy={16} r={9} fill={`${color}30`} stroke={color} strokeWidth={2} />
          <circle cx={16} cy={16} r={5} fill={color} opacity={0.8} />
        </g>
      )}
      {part.category === 'communication' && (
        <g>
          <path d="M16 22 L16 8 M10 14 L16 8 L22 14" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={16} cy={26} r={2} fill={color} />
        </g>
      )}
      {part.category === 'power' && (
        <g>
          <rect x={8} y={6} width={16} height={20} rx={3} fill="none" stroke={color} strokeWidth={2} />
          <rect x={12} y={3} width={8} height={4} rx={2} fill={color} />
          <path d="M14 12 L12 17 L16 17 L13 24 L20 16 L16 16 L18 12Z" fill={color} />
        </g>
      )}
      {part.category === 'specialty' && (
        <g>
          <circle cx={16} cy={16} r={10} fill="none" stroke={color} strokeWidth={2} />
          <text x={16} y={21} textAnchor="middle" fill={color} fontSize={12}>★</text>
        </g>
      )}
    </svg>
  );
}

export default function PartsTray({ equippedPartIds, bits, settings, onAdd, onSell, onDetails }) {
  const [activeCategory, setActiveCategory] = useState('frame');
  const [selectedPartId, setSelectedPartId] = useState(null);

  const partIdSet = new Set(equippedPartIds);
  const categoryParts = PARTS.filter(p => p.category === activeCategory);
  const selectedPart = selectedPartId ? PARTS_BY_ID[selectedPartId] : null;
  const selIsEquipped = selectedPart ? partIdSet.has(selectedPart.id) : false;
  const selCanAfford = selectedPart ? (settings?.unlimitedBits || bits >= selectedPart.cost) : false;

  function handleCategoryChange(catId) {
    setActiveCategory(catId);
    setSelectedPartId(null);
  }

  function handleTap(partId) {
    setSelectedPartId(id => id === partId ? null : partId);
  }

  function isLocked(part) {
    if (partIdSet.has(part.id)) return false;
    if (SINGLE_EQUIP_CATEGORIES.has(part.category)) {
      return equippedPartIds.some(id => PARTS_BY_ID[id]?.category === part.category);
    }
    return false;
  }

  return (
    <div style={{ background: '#0d1225', borderTop: '1px solid #1a2040' }}>
      {/* Category tabs */}
      <div style={{ display: 'flex', overflowX: 'auto', borderBottom: '1px solid #1a2040', scrollbarWidth: 'none' }}>
        {PART_CATEGORIES.map(cat => {
          const hasEquipped = equippedPartIds.some(id => PARTS_BY_ID[id]?.category === cat.id);
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              style={{
                flex: '0 0 auto', padding: '10px 14px',
                background: activeCategory === cat.id ? '#1a1f3a' : 'transparent',
                border: 'none',
                borderBottom: activeCategory === cat.id ? '2px solid #00b4ff' : '2px solid transparent',
                color: activeCategory === cat.id ? '#00b4ff' : '#8892b0',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'Space Grotesk, sans-serif', whiteSpace: 'nowrap', position: 'relative',
              }}
            >
              {cat.emoji} {cat.label}
              {hasEquipped && (
                <span style={{ position: 'absolute', top: 6, right: 6, width: 6, height: 6, borderRadius: '50%', background: '#00b4ff' }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Parts strip */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '12px 12px 10px', scrollbarWidth: 'none' }}>
        {categoryParts.map(part => (
          <DraggablePart
            key={part.id}
            part={part}
            isEquipped={partIdSet.has(part.id)}
            isSelected={selectedPartId === part.id}
            canAfford={settings?.unlimitedBits || bits >= part.cost}
            categoryLocked={isLocked(part)}
            onClick={handleTap}
          />
        ))}
      </div>

      {/* Action panel */}
      <div style={{ minHeight: 60, borderTop: '1px solid #1a2040', padding: '10px 12px 14px', background: '#080c1c' }}>
        {selectedPart ? (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#e8eaf6', fontSize: 13, fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {selectedPart.name}
              </div>
              <div style={{ color: '#8892b0', fontSize: 11, lineHeight: 1.4, marginTop: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {selectedPart.description}
              </div>
            </div>
            <button
              onClick={() => onDetails(selectedPart)}
              style={{ padding: '8px 10px', background: 'rgba(0,180,255,0.08)', border: '1px solid rgba(0,180,255,0.25)', borderRadius: 8, color: '#00b4ff', fontSize: 16, cursor: 'pointer', flexShrink: 0 }}
              title="View full details"
            >
              ℹ️
            </button>
            {selIsEquipped ? (
              <button
                onClick={() => { onSell(selectedPart.id); setSelectedPartId(null); }}
                style={{ padding: '8px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 8, color: '#ef4444', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', flexShrink: 0 }}
              >
                Sell
              </button>
            ) : (
              <button
                onClick={() => { if (selCanAfford) { onAdd(selectedPart.id); setSelectedPartId(null); } }}
                style={{ padding: '8px 14px', background: selCanAfford ? 'rgba(0,180,255,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${selCanAfford ? 'rgba(0,180,255,0.5)' : '#2a3060'}`, borderRadius: 8, color: selCanAfford ? '#00b4ff' : '#4a5568', fontSize: 13, fontWeight: 700, cursor: selCanAfford ? 'pointer' : 'not-allowed', fontFamily: 'Space Grotesk, sans-serif', flexShrink: 0 }}
              >
                {selCanAfford ? `Add  ${selectedPart.cost}b` : `Need ${selectedPart.cost}b`}
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 40 }}>
            <span style={{ color: '#2a3060', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>tap a part to select · hold to drag</span>
          </div>
        )}
      </div>
    </div>
  );
}
