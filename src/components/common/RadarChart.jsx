import { useMemo } from 'react';

const STATS = ['precision', 'strength', 'perception', 'mobility', 'durability', 'adaptability', 'communication', 'social'];
const STAT_LABELS = ['Precision', 'Strength', 'Perception', 'Mobility', 'Durability', 'Adaptability', 'Comm', 'Social'];

function polarToCartesian(cx, cy, r, angleIndex, total) {
  const angle = (angleIndex / total) * 2 * Math.PI - Math.PI / 2;
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle)
  };
}

function buildPolygon(cx, cy, maxR, values, maxVal = 5) {
  return STATS.map((_, i) => {
    const r = (values[i] / maxVal) * maxR;
    const p = polarToCartesian(cx, cy, r, i, STATS.length);
    return `${p.x},${p.y}`;
  }).join(' ');
}

export default function RadarChart({ requirements = {}, playerStats = null, size = 200 }) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.38;
  const labelR = size * 0.48;

  const reqValues = STATS.map(s => requirements[s] || 0);
  const playerValues = playerStats ? STATS.map(s => playerStats[s] || 0) : null;

  const gridLevels = [1, 2, 3, 4, 5];

  const axes = STATS.map((_, i) => {
    const end = polarToCartesian(cx, cy, maxR, i, STATS.length);
    return end;
  });

  const reqPolygon = buildPolygon(cx, cy, maxR, reqValues);
  const playerPolygon = playerValues ? buildPolygon(cx, cy, maxR, playerValues) : null;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
      {/* Grid circles */}
      {gridLevels.map(level => {
        const r = (level / 5) * maxR;
        return (
          <circle
            key={level}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="rgba(42, 48, 96, 0.8)"
            strokeWidth={1}
          />
        );
      })}

      {/* Axis lines */}
      {axes.map((end, i) => (
        <line
          key={i}
          x1={cx} y1={cy}
          x2={end.x} y2={end.y}
          stroke="rgba(42, 48, 96, 0.6)"
          strokeWidth={1}
        />
      ))}

      {/* Requirements polygon */}
      <polygon
        points={reqPolygon}
        fill="rgba(0, 180, 255, 0.12)"
        stroke="rgba(0, 180, 255, 0.5)"
        strokeWidth={1.5}
      />

      {/* Player stats polygon */}
      {playerPolygon && (
        <polygon
          points={playerPolygon}
          fill="rgba(0, 240, 255, 0.2)"
          stroke="rgba(0, 240, 255, 0.9)"
          strokeWidth={2}
        />
      )}

      {/* Labels */}
      {STATS.map((stat, i) => {
        const pos = polarToCartesian(cx, cy, labelR, i, STATS.length);
        const angle = (i / STATS.length) * 2 * Math.PI - Math.PI / 2;
        let textAnchor = 'middle';
        if (Math.cos(angle) > 0.3) textAnchor = 'start';
        else if (Math.cos(angle) < -0.3) textAnchor = 'end';

        const reqVal = reqValues[i];
        const playerVal = playerValues ? playerValues[i] : null;
        const met = playerVal !== null ? playerVal >= reqVal : null;

        return (
          <g key={stat}>
            <text
              x={pos.x}
              y={pos.y}
              textAnchor={textAnchor}
              dominantBaseline="middle"
              fill={met === null ? '#8892b0' : met ? '#00f0ff' : '#ff6b35'}
              fontSize={size < 150 ? 9 : 11}
              fontFamily="Space Grotesk, sans-serif"
              fontWeight="600"
            >
              {STAT_LABELS[i]}
            </text>
            {reqVal > 0 && (
              <text
                x={pos.x}
                y={pos.y + (size < 150 ? 10 : 13)}
                textAnchor={textAnchor}
                dominantBaseline="middle"
                fill="rgba(136, 146, 176, 0.7)"
                fontSize={size < 150 ? 8 : 9}
                fontFamily="JetBrains Mono, monospace"
              >
                {playerVal !== null ? `${playerVal}/${reqVal}` : reqVal}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
