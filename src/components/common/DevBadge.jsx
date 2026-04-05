export default function DevBadge() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 12,
        right: 12,
        zIndex: 9999,
        background: 'rgba(255, 107, 53, 0.85)',
        color: 'white',
        padding: '4px 12px',
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 700,
        fontFamily: 'JetBrains Mono, monospace',
        letterSpacing: '0.1em',
        pointerEvents: 'none',
        border: '1px solid rgba(255, 107, 53, 0.5)',
        backdropFilter: 'blur(4px)'
      }}
    >
      DEV MODE
    </div>
  );
}
