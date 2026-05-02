import { formatTime } from '../../hooks/useTimer';

export default function Timer({ timeLeft, totalSeconds = 120 }) {
  const pct = timeLeft / totalSeconds;
  const isWarning = timeLeft <= 30 && timeLeft > 10;
  const isDanger = timeLeft <= 10;

  const radius = 20;
  const circ = 2 * Math.PI * radius;
  const offset = circ * (1 - pct);

  const color = isDanger ? '#ef4444' : isWarning ? '#fbbf24' : '#00b4ff';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <svg width={52} height={52} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={26} cy={26} r={radius} fill="none" stroke="#1a1f3a" strokeWidth={4} />
        <circle
          cx={26} cy={26} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s' }}
        />
      </svg>
      <span style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 22,
        fontWeight: 700,
        color,
        minWidth: 52,
        animation: isDanger ? 'pulse 0.5s ease-in-out infinite' : undefined,
      }}>
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}
