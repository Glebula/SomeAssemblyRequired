import { CATEGORY_COLORS } from '../../data/parts';
import { PARTS } from '../../data/parts';

const PART_POSITIONS = {
  frame: { label: 'Body', slot: 'body' },
  arms: { label: 'Arms', slot: 'arms' },
  sensors: { label: 'Sensors', slot: 'head' },
  ai: { label: 'AI Core', slot: 'chest' },
  communication: { label: 'Comm', slot: 'antenna' },
  power: { label: 'Power', slot: 'back' },
  specialty: { label: 'Module', slot: 'misc' }
};

export default function RobotVisualization({ equippedPartIds, activeConflicts = [], activeCombos = [] }) {
  const equipped = equippedPartIds.map(id => PARTS.find(p => p.id === id)).filter(Boolean);

  const hasFrame = equipped.some(p => p.category === 'frame');
  const hasArms = equipped.some(p => p.category === 'arms');
  const hasSensors = equipped.some(p => p.category === 'sensors');
  const hasAI = equipped.some(p => p.category === 'ai');
  const hasComm = equipped.some(p => p.category === 'communication');
  const hasPower = equipped.some(p => p.category === 'power');
  const hasSpecialty = equipped.some(p => p.category === 'specialty');

  const hasConflict = activeConflicts.length > 0;
  const hasCombo = activeCombos.length > 0;

  const frame = equipped.find(p => p.category === 'frame');
  const armsPart = equipped.find(p => p.category === 'arms');

  // Frame color variants
  const frameColor = frame?.id === 3 ? '#ff6b35' : frame?.id === 4 ? '#00b4ff' : frame?.id === 1 ? '#34d399' : '#00b4ff';
  const bodyOpacity = hasFrame ? 1 : 0.2;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        viewBox="0 0 200 260"
        style={{ width: '100%', maxWidth: 200, height: 'auto', overflow: 'visible' }}
      >
        <defs>
          <filter id="robot-glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="conflict-glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="1"/>
            <stop offset="100%" stopColor="#0080cc" stopOpacity="0.5"/>
          </radialGradient>
          <radialGradient id="conflictGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444"/>
            <stop offset="100%" stopColor="#7f1d1d"/>
          </radialGradient>
        </defs>

        {/* === ANTENNA / COMM === */}
        {hasComm && (
          <g className="animate-snap-in">
            <line x1="100" y1="8" x2="100" y2="25" stroke={CATEGORY_COLORS.communication} strokeWidth="2.5" filter="url(#robot-glow)"/>
            <circle cx="100" cy="6" r="5" fill={CATEGORY_COLORS.communication} filter="url(#robot-glow)"/>
            {/* Side antennas */}
            <line x1="88" y1="15" x2="78" y2="8" stroke={CATEGORY_COLORS.communication} strokeWidth="1.5" opacity="0.7"/>
            <circle cx="78" cy="8" r="3" fill={CATEGORY_COLORS.communication} opacity="0.7"/>
            <line x1="112" y1="15" x2="122" y2="8" stroke={CATEGORY_COLORS.communication} strokeWidth="1.5" opacity="0.7"/>
            <circle cx="122" cy="8" r="3" fill={CATEGORY_COLORS.communication} opacity="0.7"/>
          </g>
        )}

        {/* === HEAD === */}
        <g opacity={bodyOpacity}>
          <rect x="65" y="24" width="70" height="50" rx="10"
            fill="#12172e"
            stroke={hasConflict ? '#ef4444' : frameColor}
            strokeWidth={hasFrame ? 2 : 1}
            filter={hasFrame ? "url(#robot-glow)" : undefined}
          />

          {/* Sensor eyes */}
          {hasSensors ? (
            <g className="animate-snap-in">
              <rect x="73" y="36" width="20" height="14" rx="4"
                fill={CATEGORY_COLORS.sensors} filter="url(#robot-glow)"/>
              <rect x="107" y="36" width="20" height="14" rx="4"
                fill={CATEGORY_COLORS.sensors} filter="url(#robot-glow)"/>
              {/* Scan line effect */}
              <rect x="73" y="42" width="20" height="2" rx="1" fill="white" opacity="0.5"/>
              <rect x="107" y="42" width="20" height="2" rx="1" fill="white" opacity="0.5"/>
            </g>
          ) : (
            <g>
              <rect x="73" y="36" width="20" height="14" rx="4" fill="#1a1f3a" stroke="#2a3060" strokeWidth="1"/>
              <rect x="107" y="36" width="20" height="14" rx="4" fill="#1a1f3a" stroke="#2a3060" strokeWidth="1"/>
            </g>
          )}

          {/* Emotion display / mouth area */}
          {hasComm && equipped.find(p => p.id === 23) ? (
            <g className="animate-snap-in">
              <rect x="80" y="56" width="40" height="12" rx="4"
                fill={CATEGORY_COLORS.communication} opacity="0.9" filter="url(#robot-glow)"/>
              <text x="100" y="65" textAnchor="middle" fill="white" fontSize="8" fontFamily="monospace">◠‿◠</text>
            </g>
          ) : (
            <rect x="82" y="57" width="36" height="9" rx="3" fill="#1a1f3a" stroke="#2a3060" strokeWidth="1"/>
          )}
        </g>

        {/* === BODY === */}
        <g opacity={bodyOpacity}>
          <rect x="55" y="78" width="90" height="80" rx="10"
            fill="#12172e"
            stroke={hasConflict ? '#ef4444' : frameColor}
            strokeWidth={hasFrame ? 2 : 1}
            filter={hasFrame && !hasConflict ? "url(#robot-glow)" : hasConflict ? "url(#conflict-glow)" : undefined}
          />

          {/* Body details — chest panels */}
          <rect x="63" y="86" width="74" height="6" rx="3" fill="#1a1f3a" stroke="#2a3060" strokeWidth="0.5"/>

          {/* AI Core */}
          {hasAI ? (
            <g className="animate-snap-in">
              <circle cx="100" cy="118" r="20"
                fill="url(#coreGrad)"
                filter="url(#robot-glow)"
                opacity="0.9"
              />
              <circle cx="100" cy="118" r="12" fill="#0a0e1a"/>
              <circle cx="100" cy="118" r="7" fill={hasConflict ? '#ef4444' : '#00f0ff'} filter="url(#robot-glow)"/>
              {/* AI ring */}
              <circle cx="100" cy="118" r="17" fill="none" stroke={CATEGORY_COLORS.ai} strokeWidth="1" strokeDasharray="4 3" opacity="0.6"/>
            </g>
          ) : (
            <circle cx="100" cy="118" r="18" fill="#1a1f3a" stroke="#2a3060" strokeWidth="1"/>
          )}

          {/* Power indicator */}
          {hasPower && (
            <g className="animate-snap-in">
              <rect x="63" y="142" width="74" height="10" rx="3" fill="#1a1f3a" stroke={CATEGORY_COLORS.power} strokeWidth="1"/>
              <rect x="65" y="144" width="50" height="6" rx="2" fill={CATEGORY_COLORS.power} opacity="0.8" filter="url(#robot-glow)"/>
              <text x="118" y="150" textAnchor="start" fill={CATEGORY_COLORS.power} fontSize="7" fontFamily="JetBrains Mono, monospace" opacity="0.8">PWR</text>
            </g>
          )}
        </g>

        {/* === ARMS === */}
        {hasArms ? (
          <g className="animate-snap-in">
            {/* Left arm */}
            <rect x="20" y="82" width="32" height="54" rx="10"
              fill="#12172e"
              stroke={hasConflict ? '#ef4444' : CATEGORY_COLORS.arms}
              strokeWidth="2"
              filter="url(#robot-glow)"
            />
            {armsPart?.id === 6 && ( // Precision servo
              <g>
                <rect x="24" y="92" width="24" height="4" rx="2" fill={CATEGORY_COLORS.arms} opacity="0.6"/>
                <rect x="24" y="100" width="24" height="4" rx="2" fill={CATEGORY_COLORS.arms} opacity="0.6"/>
              </g>
            )}
            {armsPart?.id === 7 && ( // Heavy lift claws
              <g>
                <rect x="24" y="118" width="10" height="12" rx="2" fill={CATEGORY_COLORS.arms}/>
                <rect x="38" y="118" width="10" height="12" rx="2" fill={CATEGORY_COLORS.arms}/>
              </g>
            )}
            <circle cx="36" cy="130" r="8" fill="#1a1f3a" stroke={CATEGORY_COLORS.arms} strokeWidth="1.5"/>

            {/* Right arm */}
            <rect x="148" y="82" width="32" height="54" rx="10"
              fill="#12172e"
              stroke={hasConflict ? '#ef4444' : CATEGORY_COLORS.arms}
              strokeWidth="2"
              filter="url(#robot-glow)"
            />
            {armsPart?.id === 6 && (
              <g>
                <rect x="152" y="92" width="24" height="4" rx="2" fill={CATEGORY_COLORS.arms} opacity="0.6"/>
                <rect x="152" y="100" width="24" height="4" rx="2" fill={CATEGORY_COLORS.arms} opacity="0.6"/>
              </g>
            )}
            {armsPart?.id === 7 && (
              <g>
                <rect x="152" y="118" width="10" height="12" rx="2" fill={CATEGORY_COLORS.arms}/>
                <rect x="166" y="118" width="10" height="12" rx="2" fill={CATEGORY_COLORS.arms}/>
              </g>
            )}
            <circle cx="164" cy="130" r="8" fill="#1a1f3a" stroke={CATEGORY_COLORS.arms} strokeWidth="1.5"/>
          </g>
        ) : (
          // Ghost arms
          <g opacity="0.15">
            <rect x="20" y="82" width="32" height="54" rx="10" fill="none" stroke="#2a3060" strokeWidth="1.5" strokeDasharray="4 3"/>
            <rect x="148" y="82" width="32" height="54" rx="10" fill="none" stroke="#2a3060" strokeWidth="1.5" strokeDasharray="4 3"/>
          </g>
        )}

        {/* === SPECIALTY MODULES === */}
        {hasSpecialty && (
          <g className="animate-snap-in">
            {/* Back pack / specialty */}
            <rect x="152" y="86" width="20" height="24" rx="4"
              fill="#12172e"
              stroke={CATEGORY_COLORS.specialty}
              strokeWidth="1.5"
              filter="url(#robot-glow)"
            />
            <circle cx="162" cy="98" r="5" fill={CATEGORY_COLORS.specialty} opacity="0.8" filter="url(#robot-glow)"/>
          </g>
        )}

        {/* === LEGS === */}
        <g opacity={bodyOpacity}>
          {/* Left leg */}
          <rect x="62" y="162" width="32" height="50" rx="8"
            fill="#12172e"
            stroke={hasFrame ? frameColor : '#2a3060'}
            strokeWidth={hasFrame ? 1.5 : 1}
          />
          <rect x="62" y="205" width="32" height="14" rx="6"
            fill="#1a1f3a"
            stroke={hasFrame ? frameColor : '#2a3060'}
            strokeWidth={hasFrame ? 1.5 : 1}
          />

          {/* Right leg */}
          <rect x="106" y="162" width="32" height="50" rx="8"
            fill="#12172e"
            stroke={hasFrame ? frameColor : '#2a3060'}
            strokeWidth={hasFrame ? 1.5 : 1}
          />
          <rect x="106" y="205" width="32" height="14" rx="6"
            fill="#1a1f3a"
            stroke={hasFrame ? frameColor : '#2a3060'}
            strokeWidth={hasFrame ? 1.5 : 1}
          />

          {/* Knee joints */}
          <circle cx="78" cy="185" r="6" fill="#0a0e1a" stroke={hasFrame ? frameColor : '#2a3060'} strokeWidth="1.5"/>
          <circle cx="122" cy="185" r="6" fill="#0a0e1a" stroke={hasFrame ? frameColor : '#2a3060'} strokeWidth="1.5"/>
        </g>

        {/* === COMBO SPARK === */}
        {hasCombo && (
          <g>
            <circle cx="40" cy="100" r="12" fill="none" stroke="#fbbf24" strokeWidth="1.5"
              opacity="0.7" strokeDasharray="3 3">
              <animateTransform attributeName="transform" type="rotate" from="0 40 100" to="360 40 100" dur="3s" repeatCount="indefinite"/>
            </circle>
            <text x="40" y="104" textAnchor="middle" fill="#fbbf24" fontSize="10" filter="url(#robot-glow)">⚡</text>
          </g>
        )}

        {/* === CONFLICT INDICATOR === */}
        {hasConflict && (
          <g>
            <circle cx="160" cy="78" r="12" fill="#ef4444" opacity="0.2" filter="url(#conflict-glow)"/>
            <text x="160" y="82" textAnchor="middle" fill="#ef4444" fontSize="12" filter="url(#conflict-glow)">⚠</text>
          </g>
        )}
      </svg>

      {/* Empty state prompt */}
      {equippedPartIds.length === 0 && (
        <div style={{
          position: 'absolute', bottom: '10%',
          color: 'rgba(136, 146, 176, 0.5)',
          fontSize: 13, fontFamily: 'JetBrains Mono, monospace',
          textAlign: 'center', pointerEvents: 'none'
        }}>
          Drag parts here
        </div>
      )}
    </div>
  );
}
