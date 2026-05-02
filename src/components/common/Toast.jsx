import { useEffect, useState } from 'react';

function ToastItem({ toast }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLeaving(true), 2600);
    return () => clearTimeout(t);
  }, []);

  const colors = {
    combo:    { bg: 'rgba(52,211,153,0.15)', border: 'rgba(52,211,153,0.5)', text: '#34d399' },
    conflict: { bg: 'rgba(239,68,68,0.15)',  border: 'rgba(239,68,68,0.5)',  text: '#ef4444' },
    info:     { bg: 'rgba(0,180,255,0.15)',  border: 'rgba(0,180,255,0.5)',  text: '#00b4ff' },
    success:  { bg: 'rgba(52,211,153,0.15)', border: 'rgba(52,211,153,0.5)', text: '#34d399' },
    warning:  { bg: 'rgba(251,191,36,0.15)', border: 'rgba(251,191,36,0.5)', text: '#fbbf24' },
  };
  const c = colors[toast.type] || colors.info;

  return (
    <div style={{
      padding: '12px 16px',
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: 10,
      color: c.text,
      fontSize: 14,
      fontFamily: 'Space Grotesk, sans-serif',
      fontWeight: 600,
      maxWidth: 280,
      animation: leaving ? 'toastOut 0.3s ease forwards' : 'toastIn 0.3s ease both',
      backdropFilter: 'blur(8px)',
    }}>
      {toast.message}
    </div>
  );
}

export default function ToastContainer({ toasts }) {
  if (!toasts?.length) return null;
  return (
    <div style={{
      position: 'fixed', top: 80, right: 16,
      zIndex: 1000,
      display: 'flex', flexDirection: 'column', gap: 8,
      pointerEvents: 'none',
    }}>
      {toasts.map(t => <ToastItem key={t.id} toast={t} />)}
    </div>
  );
}
