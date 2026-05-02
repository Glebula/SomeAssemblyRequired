export default function DevBadge({ devMode, settings }) {
  if (!devMode) return null;
  return (
    <div style={{
      position: 'fixed', top: 12, right: 12,
      zIndex: 9999,
      background: 'rgba(255,107,53,0.9)',
      color: 'white',
      padding: '4px 10px',
      borderRadius: 6,
      fontSize: 11,
      fontFamily: 'JetBrains Mono, monospace',
      fontWeight: 700,
      letterSpacing: '0.1em',
      pointerEvents: 'none',
    }}>
      ⚙ DEV MODE
    </div>
  );
}
