import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { PARTS, CATEGORY_LABELS, CATEGORY_COLORS, SINGLE_SLOT_CATEGORIES } from '../../data/parts';

const CATEGORIES = ['frame', 'arms', 'sensors', 'ai', 'communication', 'power', 'specialty'];

export default function PartsTray({ bits, equippedPartIds, onPartClick, devMode, settings }) {
  const [activeCategory, setActiveCategory] = useState('frame');

  const filteredParts = PARTS.filter(p => p.category === activeCategory);

  return (
    <div style={{
      background: '#12172e',
      borderTop: '1px solid #2a3060',
      display: 'flex', flexDirection: 'column'
    }}>
      {/* Category tabs */}
      <div style={{
        display: 'flex', overflowX: 'auto', gap: 0,
        borderBottom: '1px solid #2a3060',
        scrollbarWidth: 'none', msOverflowStyle: 'none'
      }}>
        {CATEGORIES.map(cat => {
          const color = CATEGORY_COLORS[cat];
          const isActive = activeCategory === cat;
          const hasEquipped = equippedPartIds.some(id => {
            const p = PARTS.find(p => p.id === id);
            return p?.category === cat;
          });

          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                flex: '0 0 auto',
                padding: '10px 14px',
                background: isActive ? `${color}15` : 'transparent',
                border: 'none',
                borderBottom: `2px solid ${isActive ? color : 'transparent'}`,
                color: isActive ? color : '#8892b0',
                fontSize: 12, fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'Space Grotesk, sans-serif',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                position: 'relative'
              }}
            >
              {CATEGORY_LABELS[cat]}
              {hasEquipped && (
                <span style={{
                  position: 'absolute', top: 4, right: 4,
                  width: 6, height: 6, borderRadius: '50%',
                  background: color
                }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Parts grid */}
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        padding: '12px',
        gap: 10,
        minHeight: 150,
        scrollbarWidth: 'thin'
      }}>
        {filteredParts.map(part => (
          <DraggablePart
            key={part.id}
            part={part}
            bits={bits}
            isEquipped={equippedPartIds.includes(part.id)}
            isSingleSlotTaken={
              SINGLE_SLOT_CATEGORIES.includes(part.category) &&
              equippedPartIds.some(id => {
                const ep = PARTS.find(p => p.id === id);
                return ep?.category === part.category && ep.id !== part.id;
              })
            }
            onClick={() => onPartClick(part)}
            devMode={devMode}
            settings={settings}
          />
        ))}
      </div>
    </div>
  );
}

function DraggablePart({ part, bits, isEquipped, isSingleSlotTaken, onClick, devMode, settings }) {
  const canAfford = (settings?.unlimitedBits && devMode) || bits >= part.cost;
  const disabled = (!canAfford && !isEquipped) || (isSingleSlotTaken && !isEquipped);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `tray-${part.id}`,
    data: { part, fromTray: true },
    disabled
  });

  const color = CATEGORY_COLORS[part.category] || '#00b4ff';

  const style = {
    position: 'relative',
    flex: '0 0 auto',
    width: 120,
    background: isEquipped
      ? `${color}15`
      : disabled ? '#0d1120' : '#1a1f3a',
    border: `1.5px solid ${isEquipped ? color : disabled ? '#1a1f3a' : '#2a3060'}`,
    borderRadius: 10,
    padding: 12,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition: 'all 0.15s',
    transform: isDragging ? `translate3d(${transform?.x || 0}px, ${transform?.y || 0}px, 0) scale(1.05)` : undefined,
    zIndex: isDragging ? 200 : 1,
    boxShadow: isDragging ? `0 8px 30px rgba(0,0,0,0.5)` : isEquipped ? `0 2px 12px ${color}30` : 'none',
    userSelect: 'none'
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      {...attributes}
      {...listeners}
    >
      {/* Equipped indicator */}
      {isEquipped && (
        <div style={{
          position: 'absolute', top: 5, right: 5,
          width: 8, height: 8, borderRadius: '50%',
          background: color,
          boxShadow: `0 0 6px ${color}`
        }} />
      )}

      {/* Part emoji */}
      <div style={{ fontSize: 32, textAlign: 'center', marginBottom: 6 }}>
        {getPartEmoji(part)}
      </div>

      {/* Part name */}
      <div style={{
        fontSize: 11, color: isEquipped ? color : '#8892b0',
        fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600,
        textAlign: 'center', lineHeight: 1.3,
        overflow: 'hidden', display: '-webkit-box',
        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
      }}>
        {part.name}
      </div>

      {/* Short description */}
      <div style={{
        marginTop: 6,
        minHeight: 28,
        fontSize: 10,
        color: '#cbd5e1',
        fontFamily: 'Space Grotesk, sans-serif',
        lineHeight: 1.2,
        textAlign: 'center',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical'
      }}>
        {getShortDescription(part)}
      </div>

      {/* Cost badge */}
      <div style={{
        marginTop: 6, textAlign: 'center',
        fontFamily: 'JetBrains Mono, monospace', fontSize: 13,
        fontWeight: 700,
        color: canAfford || isEquipped ? '#fbbf24' : '#4a5060'
      }}>
        {part.cost}b
      </div>

      {/* Lock icon for unaffordable */}
      {disabled && !isEquipped && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          borderRadius: 10
        }}>
          <span style={{ fontSize: 18, opacity: 0.5 }}>🔒</span>
        </div>
      )}
    </div>
  );
}

function getPartEmoji(part) {
  const map = {
    1: '🏃', 2: '🤖', 3: '🛡️', 4: '🌊',
    5: '🤌', 6: '✂️', 7: '💪', 8: '🛠️', 9: '🤲',
    10: '📷', 11: '🌡️', 12: '📡', 13: '🎤', 14: '👆', 15: '🔬',
    16: '💾', 17: '🧠', 18: '🔭', 19: '⚖️', 20: '⚡',
    21: '🔊', 22: '🗣️', 23: '😊', 24: '👋', 25: '🌐',
    26: '🔋', 27: '🔋', 28: '☀️', 29: '☢️',
    30: '💧', 31: '🔥', 32: '🏥', 33: '🪝', 34: '🔧',
    35: '🥷', 36: '📻', 37: '🛡️', 38: '🚀', 39: '🎯', 40: '😄'
  };
  return map[part.id] || '⚙️';
}

function getShortDescription(part) {
  if (part.id === 1) return 'Lightweight and fast. Can only hold 5 modules.';
  return part.description || 'Utility robot module.';
}
