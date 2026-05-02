import { useState, useEffect, useRef } from 'react';
import { DndContext, DragOverlay, useDroppable } from '@dnd-kit/core';
import { SCREENS } from '../../hooks/useGameState';
import { PARTS_BY_ID, SINGLE_EQUIP_CATEGORIES } from '../../data/parts';
import { useTimer, formatTime } from '../../hooks/useTimer';
import { useScoring } from '../../hooks/useScoring';
import { COMBOS } from '../../data/combos';
import RobotVisualization from '../build/RobotVisualization';
import PartsTray from '../build/PartsTray';
import PartInfoPopup from '../build/PartInfoPopup';
import StatsRadar from '../build/StatsRadar';
import Timer from '../common/Timer';
import ToastContainer from '../common/Toast';

const STAT_ICONS = { precision:'🎯', strength:'💪', perception:'👁️', mobility:'⚡', durability:'🛡️', adaptability:'🧠', communication:'📡', social:'🤝' };
const BUILD_SECONDS = 120;

function Workbench({ children, equippedPartIds, onPartClick }) {
  const { isOver, setNodeRef } = useDroppable({ id: 'workbench' });
  return (
    <div
      ref={setNodeRef}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: isOver ? 'rgba(0,180,255,0.06)' : 'transparent',
        border: `2px dashed ${isOver ? '#00b4ff' : 'transparent'}`,
        borderRadius: 16,
        transition: 'all 0.2s',
        padding: '12px 8px',
        minHeight: 260,
        position: 'relative',
      }}
    >
      {children}
      {/* Part count badge */}
      {equippedPartIds.length > 0 && (
        <div style={{ position: 'absolute', top: 8, right: 8, background: '#00b4ff', color: '#0a0e1a', borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
          {equippedPartIds.length} parts
        </div>
      )}
    </div>
  );
}

export default function BuildScreen({ state, goTo, equipPart, unequipPart, addToast, revealMysteryMission, update }) {
  const { mission, bits, equippedPartIds, statModifiers, requirementOverrides, settings, devMode } = state;
  const [showStats, setShowStats] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [mysteryRevealed, setMysteryRevealed] = useState(false);
  const [effectiveMission, setEffectiveMission] = useState(mission);
  const [revealAnim, setRevealAnim] = useState(false);
  const prevComboRef = useRef(new Set());
  const prevConflictRef = useRef(new Set());

  const isMystery = mission?.specialRule === 'mystery';

  const { stats, adjustedReqs, activeCombos, activeConflicts } = useScoring(
    equippedPartIds, effectiveMission, statModifiers, requirementOverrides
  );

  // Combo/conflict toast notifications
  useEffect(() => {
    const currCombos = new Set(activeCombos.map(c => c.name));
    for (const c of currCombos) {
      if (!prevComboRef.current.has(c)) {
        addToast(`⚡ ${c} activated!`, 'combo');
      }
    }
    prevComboRef.current = currCombos;
  }, [activeCombos.map(c => c.name).join(',')]);

  useEffect(() => {
    const currConflicts = new Set(activeConflicts.map(c => c.name));
    for (const c of currConflicts) {
      if (!prevConflictRef.current.has(c)) {
        addToast(`⚠ ${c} — ${activeConflicts.find(x => x.name === c)?.description}`, 'conflict');
      }
    }
    prevConflictRef.current = currConflicts;
  }, [activeConflicts.map(c => c.name).join(',')]);

  function handleTimerComplete() {
    goTo(settings.skipCurveball ? SCREENS.QUESTION : SCREENS.CURVEBALL);
  }

  function handleTimerTick(t) {
    // Mystery reveal at exactly 60 seconds remaining
    if (isMystery && !mysteryRevealed && t === 60) {
      setRevealAnim(true);
      const revealed = revealMysteryMission();
      setEffectiveMission(revealed);
      setMysteryRevealed(true);
      addToast('🔓 Mystery revealed! Adapt your build!', 'warning');
      setTimeout(() => setRevealAnim(false), 3000);
    }
  }

  const timerEnabled = !settings.unlimitedTime;
  const { timeLeft } = useTimer(BUILD_SECONDS, {
    enabled: timerEnabled,
    onComplete: handleTimerComplete,
    onTick: handleTimerTick,
  });

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;
    if (active.id.startsWith('part-') && over.id === 'workbench') {
      const partId = parseInt(active.id.replace('part-', ''));
      handleEquip(partId);
    }
  }

  function handleEquip(partId) {
    const part = PARTS_BY_ID[partId];
    if (!part) return;
    if (equippedPartIds.includes(partId)) { setSelectedPart(null); return; }
    if (!settings.unlimitedBits && bits < part.cost) { addToast(`Not enough Bits! Need ${part.cost}b`, 'warning'); return; }
    if (SINGLE_EQUIP_CATEGORIES.has(part.category)) {
      const existing = equippedPartIds.find(id => PARTS_BY_ID[id]?.category === part.category);
      if (existing) { addToast(`Only one ${part.category} allowed`, 'warning'); return; }
    }
    // Light Scout Frame: max 5 modules
    if (equippedPartIds.includes(1) && part.category !== 'frame') {
      const nonFrame = equippedPartIds.filter(id => PARTS_BY_ID[id]?.category !== 'frame').length;
      if (nonFrame >= 5) { addToast('Light Scout Frame: max 5 modules!', 'warning'); return; }
    }
    equipPart(partId);
    setSelectedPart(null);
  }

  function handleUnequip(partId) {
    unequipPart(partId);
    setSelectedPart(null);
    addToast('Part removed — Bits refunded', 'info');
  }

  const displayMission = effectiveMission;
  const topStats = displayMission?.topStats || [];

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div style={{ minHeight: '100vh', background: '#0a0e1a', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 16px',
          background: '#0d1225',
          borderBottom: '1px solid #1a2040',
          flexShrink: 0,
        }}>
          <Timer timeLeft={timerEnabled ? timeLeft : BUILD_SECONDS} totalSeconds={BUILD_SECONDS} />

          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ color: '#8892b0', fontSize: 10, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {isMystery && !mysteryRevealed ? '???' : (displayMission?.title || 'Unknown')}
            </div>
            {/* Top stats mini */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 4 }}>
              {topStats.slice(0, 3).map(s => {
                const req = adjustedReqs?.[s] || 0;
                const actual = stats[s] || 0;
                const met = actual >= req;
                return (
                  <span key={s} style={{ fontSize: 13, opacity: met ? 1 : 0.5 }} title={`${s}: ${actual}/${req}`}>
                    {STAT_ICONS[s]}
                  </span>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 18, fontWeight: 700, color: bits < 10 ? '#ef4444' : '#00b4ff' }}>
                {bits}b
              </div>
            </div>
            <button
              onClick={() => setShowStats(s => !s)}
              style={{
                background: showStats ? 'rgba(0,180,255,0.2)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${showStats ? 'rgba(0,180,255,0.5)' : '#2a3060'}`,
                borderRadius: 10, padding: '6px 10px',
                color: showStats ? '#00b4ff' : '#8892b0',
                fontSize: 14, cursor: 'pointer',
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600,
              }}
            >
              📊
            </button>
          </div>
        </div>

        {/* Mystery reveal animation */}
        {revealAnim && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(168,85,247,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <div className="animate-slam-in" style={{
              background: '#1a0f3a', border: '3px solid #a855f7',
              borderRadius: 20, padding: '32px 40px', textAlign: 'center',
              boxShadow: '0 0 60px rgba(168,85,247,0.6)',
            }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🔓</div>
              <div style={{ color: '#a855f7', fontFamily: 'JetBrains Mono, monospace', fontSize: 18, fontWeight: 700 }}>MYSTERY REVEALED!</div>
              <div style={{ color: '#e8eaf6', fontWeight: 700, fontSize: 20, marginTop: 8 }}>{effectiveMission?.title}</div>
              <div style={{ color: '#8892b0', fontSize: 13, marginTop: 4 }}>60 seconds to adapt!</div>
            </div>
          </div>
        )}

        {/* Main content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Workbench */}
          <Workbench equippedPartIds={equippedPartIds} onPartClick={p => setSelectedPart(p)}>
            {/* Stats overlay */}
            {showStats && adjustedReqs && (
              <div style={{
                position: 'absolute', inset: 0, zIndex: 10,
                background: 'rgba(10,14,26,0.92)',
                borderRadius: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 12,
              }}>
                <StatsRadar stats={stats} requirements={adjustedReqs} />
              </div>
            )}

            <RobotVisualization equippedPartIds={equippedPartIds} />

            {/* Stats overlay (always-visible dev mode) */}
            {devMode && settings.showStatsOverlay && (
              <div style={{
                position: 'absolute', top: 8, left: 8,
                background: 'rgba(0,0,0,0.8)', borderRadius: 8, padding: '6px 10px',
                fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: '#00b4ff',
              }}>
                {Object.entries(stats).map(([k, v]) => (
                  <div key={k}>{k}: {v}{adjustedReqs ? `/${adjustedReqs[k] || 0}` : ''}</div>
                ))}
              </div>
            )}
          </Workbench>

          {/* Parts tray */}
          <PartsTray
            equippedPartIds={equippedPartIds}
            bits={bits}
            settings={settings}
            onPartClick={setSelectedPart}
          />
        </div>

        {/* Dev skip button */}
        {devMode && (
          <button
            onClick={() => goTo(settings.skipCurveball ? SCREENS.QUESTION : SCREENS.CURVEBALL)}
            style={{
              position: 'fixed', bottom: 120, right: 16,
              background: 'rgba(255,107,53,0.9)', color: 'white',
              border: 'none', borderRadius: 10, padding: '8px 14px',
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'JetBrains Mono, monospace', zIndex: 200,
            }}
          >
            Skip Build →
          </button>
        )}
      </div>

      {/* Part info popup */}
      {selectedPart && (
        <PartInfoPopup
          part={selectedPart}
          isEquipped={equippedPartIds.includes(selectedPart.id)}
          canAfford={settings.unlimitedBits || bits >= selectedPart.cost}
          onAdd={() => handleEquip(selectedPart.id)}
          onRemove={() => handleUnequip(selectedPart.id)}
          onClose={() => setSelectedPart(null)}
        />
      )}

      {/* Toasts */}
      <ToastContainer toasts={state.toasts} />
    </DndContext>
  );
}
