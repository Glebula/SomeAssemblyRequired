import { useState, useEffect, useCallback } from 'react';
import { DndContext, DragOverlay, useDraggable, useDroppable, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SCREENS } from '../../hooks/useGameState';
import { PARTS, CATEGORY_COLORS, SINGLE_SLOT_CATEGORIES } from '../../data/parts';
import { MISSIONS } from '../../data/missions';
import { CURVEBALLS } from '../../data/curveballs';
import { calculateStats, getActiveCombos, getActiveConflicts } from '../../utils/scoring';
import { useTimer } from '../../hooks/useTimer';
import RadarChart from '../common/RadarChart';
import PartsTray from '../build/PartsTray';
import RobotVisualization from '../build/RobotVisualization';
import PartInfoPopup from '../build/PartInfoPopup';

const BUILD_TIME = 120; // 2 minutes
const MYSTERY_REVEAL_TIME = 90; // 1:30 remaining

export default function BuildScreen({ state, goTo, update, equipPart, unequipPart }) {
  const { mission, bits, equippedPartIds, settings, devMode, difficulty } = state;
  const [selectedPart, setSelectedPart] = useState(null);
  const [dragItem, setDragItem] = useState(null);
  const [comboFlash, setComboFlash] = useState(null);
  const [conflictFlash, setConflictFlash] = useState(null);
  const [statsOpen, setStatsOpen] = useState(false);
  const [mysteryRevealed, setMysteryRevealed] = useState(false);
  const [mysteryRequirements, setMysteryRequirements] = useState(null);

  const isMystery = state.missionCode === 'MSN-1019';

  const handleTimerExpire = useCallback(() => {
    if (!settings?.unlimitedTime || !devMode) {
      endBuildPhase();
    }
  }, [settings, devMode, equippedPartIds]);

  const timer = useTimer(
    settings?.unlimitedTime && devMode ? 9999 : BUILD_TIME,
    handleTimerExpire
  );

  useEffect(() => {
    timer.start();
  }, []);

  // Mystery mission reveal at 1:30
  useEffect(() => {
    if (isMystery && timer.seconds <= MYSTERY_REVEAL_TIME && !mysteryRevealed) {
      const otherMissions = Object.entries(MISSIONS).filter(([code]) => code !== 'MSN-1019' && code !== 'MSN-1020');
      const [, randomMission] = otherMissions[Math.floor(Math.random() * otherMissions.length)];
      setMysteryRequirements(randomMission.requirements);
      setMysteryRevealed(true);
      update({ mysteryMissionRequirements: randomMission.requirements, mysterMissionRevealed: true });
    }
  }, [timer.seconds, isMystery, mysteryRevealed]);

  function endBuildPhase() {
    timer.pause();
    // Pick random curveball
    const curveball = settings?.skipCurveball && devMode
      ? null
      : settings?.forceCurveball && devMode
        ? CURVEBALLS.find(c => c.id === settings.forceCurveball) || CURVEBALLS[Math.floor(Math.random() * CURVEBALLS.length)]
        : CURVEBALLS[Math.floor(Math.random() * CURVEBALLS.length)];
    update({ curveballEvent: curveball });

    if (settings?.skipCurveball && devMode) {
      goTo(settings?.skipQuestions && devMode ? SCREENS.SIMULATION : SCREENS.QUESTIONS);
    } else {
      goTo(SCREENS.CURVEBALL);
    }
  }

  // Current stats
  const activeCombos = getActiveCombos(equippedPartIds, mission?.category);
  const activeConflicts = getActiveConflicts(equippedPartIds);
  const currentStats = calculateStats(equippedPartIds, activeConflicts, activeCombos, mission);

  const effectiveRequirements = isMystery
    ? (mysteryRevealed ? mysteryRequirements : null)
    : mission?.requirements;

  // Detect new combos/conflicts
  useEffect(() => {
    if (activeCombos.length > 0) {
      const lastCombo = activeCombos[activeCombos.length - 1];
      setComboFlash(lastCombo);
      setTimeout(() => setComboFlash(null), 3000);
    }
  }, [activeCombos.length]);

  useEffect(() => {
    if (activeConflicts.length > 0) {
      const lastConflict = activeConflicts[activeConflicts.length - 1];
      setConflictFlash(lastConflict.name);
      setTimeout(() => setConflictFlash(null), 3000);
    }
  }, [activeConflicts.length]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  function handleDragStart(event) {
    const partData = event.active.data.current?.part;
    if (partData) setDragItem(partData);
  }

  function handleDragEnd(event) {
    setDragItem(null);
    const { active, over } = event;
    if (!over) return;

    const part = active.data.current?.part;
    if (!part) return;
    const fromTray = active.data.current?.fromTray;
    const fromWorkbench = active.data.current?.fromWorkbench;

    if (over.id === 'workbench' && fromTray && !equippedPartIds.includes(part.id)) {
      handleEquipPart(part);
    } else if (over.id === 'parts-tray' && fromWorkbench) {
      handleUnequipPart(part);
    } else if (over.id === 'remove-zone' && fromWorkbench) {
      handleUnequipPart(part);
    }
  }

  function handleEquipPart(part) {
    const canAfford = (settings?.unlimitedBits && devMode) || bits >= part.cost;
    if (!canAfford) return;

    // Check single-slot categories
    if (SINGLE_SLOT_CATEGORIES.includes(part.category)) {
      const alreadyHas = equippedPartIds.some(id => {
        const ep = PARTS.find(p => p.id === id);
        return ep?.category === part.category;
      });
      if (alreadyHas) return;
    }

    equipPart(part.id, part.cost);
  }

  function handleUnequipPart(part) {
    unequipPart(part.id, part.cost);
  }

  const timerColor = timer.seconds <= 30 ? '#ef4444' : timer.seconds <= 60 ? '#fbbf24' : '#00f0ff';

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div style={{
        height: '100vh', display: 'flex', flexDirection: 'column',
        background: '#0a0e1a', overflow: 'hidden'
      }}>
        {/* Top bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16,
          padding: '10px 16px',
          background: '#12172e', borderBottom: '1px solid #2a3060',
          flexShrink: 0, flexWrap: 'wrap'
        }}>
          {/* Timer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#8892b0', fontFamily: 'JetBrains Mono, monospace' }}>⏱</span>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 28, fontWeight: 700,
              color: timerColor,
              animation: timer.seconds <= 10 ? 'blink 1s infinite' : undefined
            }}>
              {settings?.unlimitedTime && devMode ? '∞' : timer.formatted}
            </span>
          </div>

          {/* Bits */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 16 }}>💰</span>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 22, fontWeight: 700,
              color: bits < 20 ? '#ef4444' : '#fbbf24'
            }}>
              {settings?.unlimitedBits && devMode ? '∞' : bits}
            </span>
            <span style={{ color: '#8892b0', fontSize: 12, fontFamily: 'Space Grotesk, sans-serif' }}>Bits</span>
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Stats toggle (mobile) */}
          <button
            onClick={() => setStatsOpen(s => !s)}
            style={{
              padding: '6px 12px', background: statsOpen ? 'rgba(0,180,255,0.15)' : 'transparent',
              border: `1px solid ${statsOpen ? '#00b4ff' : '#2a3060'}`,
              borderRadius: 6, color: statsOpen ? '#00b4ff' : '#8892b0',
              fontSize: 12, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 600, whiteSpace: 'nowrap'
            }}
          >
            📊 Stats
          </button>

          {/* End build (manual) */}
          <button
            onClick={endBuildPhase}
            style={{
              padding: '6px 14px',
              background: 'linear-gradient(135deg, #ff6b35, #cc4a20)',
              border: 'none', borderRadius: 6, color: 'white',
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'Space Grotesk, sans-serif', whiteSpace: 'nowrap'
            }}
          >
            Finish Build →
          </button>
        </div>

        {/* Main area */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
          {/* Workbench */}
          <WorkbenchArea
            equippedPartIds={equippedPartIds}
            activeCombos={activeCombos}
            activeConflicts={activeConflicts}
            onPartClick={(part) => setSelectedPart(part)}
            onRemovePart={handleUnequipPart}
          />

          {/* Stats Panel (collapsible on mobile) */}
          <div style={{
            width: statsOpen ? 220 : 0,
            transition: 'width 0.3s',
            overflow: 'hidden',
            flexShrink: 0,
            background: '#12172e',
            borderLeft: '1px solid #2a3060'
          }}>
            {statsOpen && (
              <StatsPanel
                currentStats={currentStats}
                requirements={effectiveRequirements}
                activeCombos={activeCombos}
                activeConflicts={activeConflicts}
                isMystery={isMystery}
                mysteryRevealed={mysteryRevealed}
                settings={settings}
                devMode={devMode}
              />
            )}
          </div>
        </div>

        {/* Parts Tray */}
        <PartsTray
          bits={bits}
          equippedPartIds={equippedPartIds}
          onPartClick={setSelectedPart}
          devMode={devMode}
          settings={settings}
        />

        {/* Combo/Conflict notifications */}
        {comboFlash && (
          <div className="animate-slide-up" style={{
            position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(251, 191, 36, 0.15)', border: '1px solid #fbbf24',
            borderRadius: 10, padding: '10px 20px', zIndex: 500,
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, fontWeight: 700, color: '#fbbf24'
          }}>
            ⚡ {comboFlash} activated!
          </div>
        )}
        {conflictFlash && (
          <div className="animate-slide-up" style={{
            position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444',
            borderRadius: 10, padding: '10px 20px', zIndex: 500,
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, fontWeight: 700, color: '#ef4444'
          }}>
            ⚠ {conflictFlash} — Conflict detected!
          </div>
        )}

        {/* Mystery reveal overlay */}
        {isMystery && mysteryRevealed && !state.mysterMissionRevealed && (
          <div className="animate-slam-in" style={{
            position: 'fixed', inset: 0, background: 'rgba(10,14,26,0.9)',
            zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{ textAlign: 'center', padding: 32 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎲</div>
              <h2 style={{ color: '#a78bfa', fontFamily: 'Space Grotesk, sans-serif', fontSize: 28, marginBottom: 8 }}>
                Mission Revealed!
              </h2>
              <p style={{ color: '#8892b0', fontFamily: 'Space Grotesk, sans-serif' }}>
                Requirements are now visible. You have 90 seconds to adapt!
              </p>
              <button
                onClick={() => update({ mysterMissionRevealed: true })}
                style={{
                  marginTop: 20, padding: '12px 32px',
                  background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
                  border: 'none', borderRadius: 8, color: 'white',
                  fontSize: 16, fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}
              >
                Continue Building
              </button>
            </div>
          </div>
        )}

        {/* Part info popup */}
        {selectedPart && (
          <PartInfoPopup
            part={selectedPart}
            onClose={() => setSelectedPart(null)}
            onEquip={handleEquipPart}
            onUnequip={handleUnequipPart}
            isEquipped={equippedPartIds.includes(selectedPart.id)}
            canAfford={(settings?.unlimitedBits && devMode) || bits >= selectedPart.cost}
            equippedPartIds={equippedPartIds}
          />
        )}

        {/* Drag overlay */}
        <DragOverlay>
          {dragItem && (
            <div style={{
              padding: 12, background: '#1a1f3a',
              border: `2px solid ${CATEGORY_COLORS[dragItem.category]}`,
              borderRadius: 10, fontSize: 12, color: '#e8eaf6',
              fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600,
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              pointerEvents: 'none', width: 90, textAlign: 'center'
            }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>{getPartEmoji(dragItem)}</div>
              <div style={{ fontSize: 10 }}>{dragItem.name}</div>
            </div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
}

function WorkbenchArea({ equippedPartIds, activeCombos, activeConflicts, onPartClick, onRemovePart }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'workbench' });

  const equippedParts = equippedPartIds.map(id => PARTS.find(p => p.id === id)).filter(Boolean);

  return (
    <div
      ref={setNodeRef}
      style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        background: isOver ? 'rgba(0, 180, 255, 0.04)' : '#0a0e1a',
        transition: 'background 0.2s',
        position: 'relative', overflow: 'hidden'
      }}
      className="bg-grid"
    >
      {/* Corner indicators */}
      {isOver && (
        <div style={{
          position: 'absolute', inset: 0,
          border: '2px dashed rgba(0, 180, 255, 0.4)',
          borderRadius: 4, pointerEvents: 'none'
        }} />
      )}

      {/* Robot visualization */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <RobotVisualization
          equippedPartIds={equippedPartIds}
          activeConflicts={activeConflicts}
          activeCombos={activeCombos}
        />
      </div>

      {/* Equipped parts list (bottom overlay) */}
      {equippedParts.length > 0 && (
        <div style={{
          position: 'absolute', bottom: 8, left: 8, right: 8,
          display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center'
        }}>
          {equippedParts.map(part => (
            <EquippedPartChip
              key={part.id}
              part={part}
              hasConflict={activeConflicts.some(c => c.parts?.includes(part.name))}
              onClick={() => onPartClick(part)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EquippedPartChip({ part, hasConflict, onClick }) {
  const color = CATEGORY_COLORS[part.category];
  const { setNodeRef, attributes, listeners, transform, isDragging } = useDraggable({
    id: `workbench-${part.id}`,
    data: { part, fromWorkbench: true }
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={onClick}
      style={{
        padding: '3px 8px',
        background: hasConflict ? 'rgba(239,68,68,0.15)' : `${color}15`,
        border: `1px solid ${hasConflict ? '#ef4444' : color}`,
        borderRadius: 12, fontSize: 11, color: hasConflict ? '#ef4444' : color,
        fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600,
        cursor: 'pointer', userSelect: 'none',
        transform: isDragging ? `translate3d(${transform?.x || 0}px, ${transform?.y || 0}px, 0)` : undefined,
        opacity: isDragging ? 0.5 : 1
      }}
    >
      {hasConflict ? '⚠ ' : ''}{part.name}
    </div>
  );
}

function StatsPanel({ currentStats, requirements, activeCombos, activeConflicts, isMystery, mysteryRevealed, settings, devMode }) {
  const statLabels = { precision: 'Prec', strength: 'Str', perception: 'Perc', mobility: 'Mob', durability: 'Dur', adaptability: 'Adpt', communication: 'Comm', social: 'Soc' };

  return (
    <div style={{ padding: 16, overflowY: 'auto', height: '100%' }}>
      {/* Radar */}
      {requirements ? (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: '#00b4ff', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em', marginBottom: 8 }}>
            STAT RADAR
          </div>
          <RadarChart requirements={requirements} playerStats={currentStats} size={170} />
        </div>
      ) : isMystery && !mysteryRevealed ? (
        <div style={{ textAlign: 'center', padding: 20 }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>🎲</div>
          <div style={{ color: '#a78bfa', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>
            MYSTERY<br/>MISSION
          </div>
        </div>
      ) : null}

      {/* Stat bars */}
      <div style={{ marginBottom: 16 }}>
        {Object.entries(currentStats).map(([stat, val]) => {
          const req = requirements?.[stat] || 0;
          const met = val >= req;
          return (
            <div key={stat} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                <span style={{ fontSize: 10, color: '#8892b0', fontFamily: 'JetBrains Mono, monospace' }}>{statLabels[stat]}</span>
                <span style={{ fontSize: 10, color: req > 0 ? (met ? '#34d399' : '#ef4444') : '#8892b0', fontFamily: 'JetBrains Mono, monospace' }}>
                  {val}{req > 0 ? `/${req}` : ''}
                </span>
              </div>
              <div style={{ height: 4, background: '#1a1f3a', borderRadius: 2 }}>
                <div style={{
                  height: '100%', borderRadius: 2, transition: 'width 0.3s',
                  width: `${Math.min(100, (val / 5) * 100)}%`,
                  background: req > 0 ? (met ? '#34d399' : '#ef4444') : '#00b4ff'
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Combos */}
      {activeCombos.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: '#fbbf24', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em', marginBottom: 6 }}>
            ⚡ COMBOS ACTIVE
          </div>
          {activeCombos.map(combo => (
            <div key={combo} style={{
              padding: '4px 8px', background: 'rgba(251,191,36,0.1)',
              border: '1px solid rgba(251,191,36,0.3)', borderRadius: 6,
              fontSize: 11, color: '#fbbf24', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 4
            }}>
              {combo}
            </div>
          ))}
        </div>
      )}

      {/* Conflicts */}
      {activeConflicts.length > 0 && (
        <div>
          <div style={{ fontSize: 10, color: '#ef4444', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em', marginBottom: 6 }}>
            ⚠ CONFLICTS
          </div>
          {activeConflicts.map(conflict => (
            <div key={conflict.key} style={{
              padding: '4px 8px', background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6,
              fontSize: 11, color: '#ef4444', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 4
            }}>
              {conflict.name}
            </div>
          ))}
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
  return map[part?.id] || '⚙️';
}
