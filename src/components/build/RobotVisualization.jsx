import { PARTS_BY_ID } from '../../data/parts';

const FRAME_COLORS = {
  1: { body: '#0e7490', leg: '#0e7490', label: 'Scout' },
  2: { body: '#1d4ed8', leg: '#1d4ed8', label: 'Standard' },
  3: { body: '#374151', leg: '#374151', label: 'Tank' },
  4: { body: '#065f46', leg: '#065f46', label: 'Amphibious' },
};
const AI_COLORS = { 16: '#3b82f6', 17: '#a855f7', 18: '#06b6d4', 19: '#eab308', 20: '#ef4444' };
const ARM_COLORS = { 5: '#3b82f6', 6: '#00b4ff', 7: '#f97316', 8: '#8b5cf6', 9: '#ec4899' };

export default function RobotVisualization({ equippedPartIds = [], onPartClick }) {
  const ids = new Set(equippedPartIds);
  const parts = equippedPartIds.map(id => PARTS_BY_ID[id]).filter(Boolean);

  const frame = parts.find(p => p.category === 'frame');
  const armPart = parts.find(p => p.category === 'arms');
  const aiPart = parts.find(p => p.category === 'ai');
  const commParts = parts.filter(p => p.category === 'communication');
  const sensorParts = parts.filter(p => p.category === 'sensors');
  const powerPart = parts.find(p => p.category === 'power');
  const specialtyParts = parts.filter(p => p.category === 'specialty');

  const fc = frame ? (FRAME_COLORS[frame.id] || FRAME_COLORS[2]) : null;
  const bodyColor = fc ? fc.body : '#1a1f3a';
  const bodyStroke = fc ? fc.body : '#2a3060';
  const legColor = fc ? fc.leg : '#1a1f3a';
  const armColor = armPart ? (ARM_COLORS[armPart.id] || '#3b82f6') : '#1a1f3a';
  const aiColor = aiPart ? (AI_COLORS[aiPart.id] || '#a855f7') : null;

  const hasHeatShield = ids.has(31);
  const hasWaterproof = ids.has(30) || ids.has(4);
  const hasArmor = ids.has(37);
  const hasSpeedBoost = ids.has(38);
  const hasWinch = ids.has(33);
  const hasBeacon = ids.has(36);
  const hasCompanion = ids.has(40);
  const hasThermal = ids.has(11);
  const hasLidar = ids.has(12);
  const hasEmotion = ids.has(23);
  const hasMedical = ids.has(32);

  const hasFrame = !!frame;
  const hasArms = !!armPart;
  const hasAI = !!aiPart;

  return (
    <svg viewBox="0 0 200 300" style={{ width: '100%', maxWidth: 220, filter: hasFrame ? 'drop-shadow(0 0 12px rgba(0,180,255,0.3))' : undefined }}>
      {/* Heat shield aura */}
      {hasHeatShield && (
        <ellipse cx={100} cy={160} rx={75} ry={120} fill="none" stroke="#f97316" strokeWidth={2} opacity={0.4}
          style={{ animation: 'pulse 2s ease-in-out infinite' }} />
      )}

      {/* Waterproof seal */}
      {hasWaterproof && (
        <ellipse cx={100} cy={250} rx={55} ry={18} fill="none" stroke="#06b6d4" strokeWidth={2} opacity={0.5}
          style={{ animation: 'pulse 2s ease-in-out infinite' }} />
      )}

      {/* LEGS */}
      <rect x={55} y={218} width={36} height={58} rx={6} fill={legColor} stroke={hasFrame ? legColor : '#2a3060'} strokeWidth={hasFrame ? 0 : 1.5} strokeDasharray={hasFrame ? undefined : '4 3'} />
      <rect x={109} y={218} width={36} height={58} rx={6} fill={legColor} stroke={hasFrame ? legColor : '#2a3060'} strokeWidth={hasFrame ? 0 : 1.5} strokeDasharray={hasFrame ? undefined : '4 3'} />
      {/* Speed booster jets */}
      {hasSpeedBoost && (
        <>
          <ellipse cx={73} cy={278} rx={8} ry={12} fill="#f97316" opacity={0.7} style={{ animation: 'pulse 0.3s ease-in-out infinite' }} />
          <ellipse cx={127} cy={278} rx={8} ry={12} fill="#f97316" opacity={0.7} style={{ animation: 'pulse 0.3s ease-in-out infinite' }} />
        </>
      )}
      {/* Leg detail lines */}
      {hasFrame && (
        <>
          <line x1={64} y1={235} x2={82} y2={235} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
          <line x1={118} y1={235} x2={136} y2={235} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
        </>
      )}

      {/* LEFT ARM */}
      {hasArms ? (
        <g>
          <rect x={10} y={102} width={28} height={80} rx={8} fill={armColor} />
          {/* Arm detail */}
          <rect x={15} y={140} width={18} height={12} rx={3} fill="rgba(0,0,0,0.3)" />
          {/* Claw/gripper based on arm type */}
          {armPart.id === 7 && ( // Heavy Lift Claws
            <>
              <path d="M10 182 L5 198 M24 182 L19 198 M38 182 L33 198" stroke={armColor} strokeWidth={4} strokeLinecap="round" />
            </>
          )}
          {(armPart.id === 6 || armPart.id === 9) && ( // Precision/Soft
            <path d="M14 182 L10 192 M21 183 L21 195 M28 182 L32 192" stroke={armColor} strokeWidth={2.5} strokeLinecap="round" />
          )}
          {armPart.id === 5 && (
            <path d="M13 182 L8 194 M24 182 L28 194" stroke={armColor} strokeWidth={3} strokeLinecap="round" />
          )}
        </g>
      ) : (
        <rect x={10} y={102} width={28} height={80} rx={8} fill="#0d1225" stroke="#2a3060" strokeWidth={1.5} strokeDasharray="4 3" />
      )}

      {/* RIGHT ARM */}
      {hasArms ? (
        <g>
          <rect x={162} y={102} width={28} height={80} rx={8} fill={armColor} />
          <rect x={167} y={140} width={18} height={12} rx={3} fill="rgba(0,0,0,0.3)" />
          {armPart.id === 7 && (
            <path d="M162 182 L157 198 M176 182 L171 198 M190 182 L185 198" stroke={armColor} strokeWidth={4} strokeLinecap="round" />
          )}
          {(armPart.id === 6 || armPart.id === 9) && (
            <path d="M166 182 L162 192 M173 183 L173 195 M180 182 L184 192" stroke={armColor} strokeWidth={2.5} strokeLinecap="round" />
          )}
          {armPart.id === 5 && (
            <path d="M165 182 L161 194 M176 182 L180 194" stroke={armColor} strokeWidth={3} strokeLinecap="round" />
          )}
        </g>
      ) : (
        <rect x={162} y={102} width={28} height={80} rx={8} fill="#0d1225" stroke="#2a3060" strokeWidth={1.5} strokeDasharray="4 3" />
      )}

      {/* TORSO */}
      <rect x={38} y={95} width={124} height={120} rx={12}
        fill={bodyColor}
        stroke={hasFrame ? 'rgba(255,255,255,0.12)' : '#2a3060'}
        strokeWidth={hasFrame ? 1 : 1.5}
        strokeDasharray={hasFrame ? undefined : '4 3'}
      />

      {/* Armor overlay */}
      {hasArmor && (
        <rect x={38} y={95} width={124} height={120} rx={12} fill="none" stroke="#6b7280" strokeWidth={4} opacity={0.6} />
      )}

      {/* Power indicator */}
      {powerPart ? (
        <g>
          <rect x={68} y={178} width={64} height={26} rx={6} fill="rgba(0,0,0,0.4)" />
          {powerPart.id === 29 && ( // Nuclear
            <circle cx={100} cy={191} r={8} fill="#a855f7" style={{ animation: 'pulse 1s ease-in-out infinite' }} />
          )}
          {powerPart.id === 28 && ( // Solar
            <>
              <rect x={38} y={100} width={16} height={40} rx={3} fill="#fbbf24" opacity={0.8} />
              <rect x={146} y={100} width={16} height={40} rx={3} fill="#fbbf24" opacity={0.8} />
            </>
          )}
          {(powerPart.id === 26 || powerPart.id === 27) && (
            <rect x={72} y={181} width={powerPart.id === 27 ? 56 : 42} height={20} rx={4}
              fill={powerPart.id === 27 ? '#22c55e' : '#3b82f6'} opacity={0.7} />
          )}
        </g>
      ) : (
        <rect x={68} y={178} width={64} height={26} rx={6} fill="#0d1225" stroke="#2a3060" strokeWidth={1} strokeDasharray="3 2" />
      )}

      {/* AI Core */}
      {hasAI ? (
        <g>
          <circle cx={100} cy={148} r={24} fill={`${aiColor}20`} />
          <circle cx={100} cy={148} r={16} fill={`${aiColor}40`} style={{ animation: 'pulse 2s ease-in-out infinite' }} />
          <circle cx={100} cy={148} r={9} fill={aiColor} style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
          {/* AI pattern rings */}
          <circle cx={100} cy={148} r={20} fill="none" stroke={aiColor} strokeWidth={1} opacity={0.4} />
        </g>
      ) : (
        <circle cx={100} cy={148} r={16} fill="#0d1225" stroke="#2a3060" strokeWidth={1} strokeDasharray="3 2" />
      )}

      {/* Medical scanner emblem */}
      {hasMedical && (
        <g>
          <circle cx={72} cy={125} r={10} fill="rgba(239,68,68,0.2)" stroke="#ef4444" strokeWidth={1.5} />
          <line x1={72} y1={119} x2={72} y2={131} stroke="#ef4444" strokeWidth={2} strokeLinecap="round" />
          <line x1={66} y1={125} x2={78} y2={125} stroke="#ef4444" strokeWidth={2} strokeLinecap="round" />
        </g>
      )}

      {/* Companion heart */}
      {hasCompanion && (
        <path d="M128 118 C128 114 122 111 122 116 C122 111 116 114 116 118 C116 122 122 126 122 126 C122 126 128 122 128 118Z"
          fill="#ec4899" style={{ animation: 'pulse 1s ease-in-out infinite' }} />
      )}

      {/* Rescue winch */}
      {hasWinch && (
        <circle cx={100} cy={98} r={8} fill="none" stroke="#f97316" strokeWidth={2.5} />
      )}

      {/* HEAD */}
      <rect x={60} y={20} width={80} height={68} rx={12}
        fill={bodyColor}
        stroke={hasFrame ? 'rgba(255,255,255,0.12)' : '#2a3060'}
        strokeWidth={hasFrame ? 1 : 1.5}
        strokeDasharray={hasFrame ? undefined : '4 3'}
      />

      {/* Neck */}
      <rect x={82} y={84} width={36} height={14} rx={4}
        fill={hasFrame ? bodyColor : '#0d1225'}
        stroke={hasFrame ? 'rgba(255,255,255,0.08)' : '#2a3060'}
        strokeWidth={1}
        strokeDasharray={hasFrame ? undefined : '3 2'}
      />

      {/* SENSORS / EYES */}
      {sensorParts.length > 0 ? (
        <g>
          {hasThermal ? (
            <>
              <circle cx={82} cy={50} r={11} fill="#f9731620" stroke="#f97316" strokeWidth={2} />
              <circle cx={82} cy={50} r={6} fill="#f97316" style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
              <circle cx={118} cy={50} r={11} fill="#f9731620" stroke="#f97316" strokeWidth={2} />
              <circle cx={118} cy={50} r={6} fill="#f97316" style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
            </>
          ) : hasLidar ? (
            <>
              <circle cx={100} cy={50} r={14} fill="#06b6d420" stroke="#06b6d4" strokeWidth={2} />
              <circle cx={100} cy={50} r={4} fill="#06b6d4" />
              {[0,45,90,135,180,225,270,315].map(a => (
                <line key={a} x1={100} y1={50}
                  x2={100 + Math.cos(a * Math.PI/180) * 10}
                  y2={50 + Math.sin(a * Math.PI/180) * 10}
                  stroke="#06b6d4" strokeWidth={1} opacity={0.5} />
              ))}
            </>
          ) : (
            <>
              <circle cx={82} cy={50} r={9} fill="#1d4ed820" stroke="#00b4ff" strokeWidth={1.5} />
              <circle cx={82} cy={50} r={4} fill="#00b4ff" />
              <circle cx={118} cy={50} r={9} fill="#1d4ed820" stroke="#00b4ff" strokeWidth={1.5} />
              <circle cx={118} cy={50} r={4} fill="#00b4ff" />
            </>
          )}
        </g>
      ) : (
        <>
          <circle cx={82} cy={50} r={9} fill="#0d1225" stroke="#2a3060" strokeWidth={1} strokeDasharray="2 2" />
          <circle cx={118} cy={50} r={9} fill="#0d1225" stroke="#2a3060" strokeWidth={1} strokeDasharray="2 2" />
        </>
      )}

      {/* COMMUNICATION face elements */}
      {hasEmotion ? (
        <g>
          <rect x={72} y={64} width={56} height={16} rx={4} fill="#0d1225" stroke="#22c55e" strokeWidth={1.5} />
          <path d="M80 72 Q100 80 120 72" fill="none" stroke="#22c55e" strokeWidth={2} strokeLinecap="round" />
        </g>
      ) : commParts.length > 0 ? (
        <g>
          <rect x={76} y={64} width={48} height={14} rx={3} fill="#0d1225" />
          {[...Array(6)].map((_, i) => (
            <rect key={i} x={80 + i*7} y={68} width={4} height={6} rx={1} fill="#00b4ff" opacity={0.6 + i*0.05} />
          ))}
        </g>
      ) : (
        <rect x={76} y={65} width={48} height={12} rx={3} fill="#0d1225" stroke="#2a3060" strokeWidth={1} strokeDasharray="2 2" />
      )}

      {/* Antenna (communication beacon) */}
      {(commParts.some(p => [21, 22, 25].includes(p.id)) || hasBeacon) && (
        <g>
          <line x1={100} y1={20} x2={100} y2={6} stroke={hasBeacon ? '#fbbf24' : '#00b4ff'} strokeWidth={2} strokeLinecap="round" />
          <circle cx={100} cy={5} r={3.5} fill={hasBeacon ? '#fbbf24' : '#00b4ff'}
            style={{ animation: 'pulse 1s ease-in-out infinite' }} />
        </g>
      )}

      {/* Empty state hint */}
      {equippedPartIds.length === 0 && (
        <text x={100} y={158} textAnchor="middle" fill="#2a3060" fontSize={11} fontFamily="Space Grotesk, sans-serif">
          Drop parts here
        </text>
      )}
    </svg>
  );
}
