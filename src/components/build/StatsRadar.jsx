const STATS = ['precision','strength','perception','mobility','durability','adaptability','communication','social'];
const LABELS = { precision:'Precision', strength:'Strength', perception:'Perception', mobility:'Mobility', durability:'Durability', adaptability:'Adapt.', communication:'Comm.', social:'Social' };
const N = STATS.length;
const R = 80;
const CX = 110, CY = 110;

function angleFor(i) { return (i / N) * Math.PI * 2 - Math.PI / 2; }
function point(r, i) {
  const a = angleFor(i);
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
}

export default function StatsRadar({ stats = {}, requirements = {} }) {
  const maxVal = 5;

  const reqPoints = STATS.map((s, i) => point((requirements[s] || 0) / maxVal * R, i));
  const statPoints = STATS.map((s, i) => point(Math.min((stats[s] || 0) / maxVal, 1) * R, i));

  return (
    <svg viewBox="0 0 220 220" style={{ width: '100%', maxWidth: 220 }}>
      {/* Grid rings */}
      {[1,2,3,4,5].map(v => {
        const pts = STATS.map((_, i) => point(v / maxVal * R, i));
        return (
          <polygon key={v}
            points={pts.map(p => p.join(',')).join(' ')}
            fill="none" stroke="#2a3060" strokeWidth={v === 5 ? 1.5 : 1} />
        );
      })}

      {/* Axis lines */}
      {STATS.map((_, i) => {
        const [x, y] = point(R, i);
        return <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke="#2a3060" strokeWidth={1} />;
      })}

      {/* Requirements polygon */}
      {Object.values(requirements).some(v => v > 0) && (
        <polygon
          points={reqPoints.map(p => p.join(',')).join(' ')}
          fill="rgba(251,191,36,0.08)"
          stroke="rgba(251,191,36,0.5)"
          strokeWidth={1.5}
          strokeDasharray="4 2"
        />
      )}

      {/* Stats polygon */}
      <polygon
        points={statPoints.map(p => p.join(',')).join(' ')}
        fill="rgba(0,180,255,0.15)"
        stroke="#00b4ff"
        strokeWidth={2}
      />

      {/* Stat dots */}
      {statPoints.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3} fill="#00b4ff" />
      ))}

      {/* Labels */}
      {STATS.map((s, i) => {
        const [x, y] = point(R + 16, i);
        const met = !requirements[s] || (stats[s] || 0) >= (requirements[s] || 0);
        return (
          <text key={s} x={x} y={y + 4} textAnchor="middle"
            fill={met ? '#8892b0' : '#ef4444'}
            fontSize={9} fontFamily="Space Grotesk, sans-serif" fontWeight={600}>
            {LABELS[s]}
          </text>
        );
      })}
    </svg>
  );
}
