import { useState, useEffect } from 'react';
import { QUESTIONS } from '../../data/questions';
import { SCREENS } from '../../hooks/useGameState';
import { useTimer } from '../../hooks/useTimer';

const TYPE_LABELS = { engineering: '🔧 Engineering', logic: '💻 Logic', ethical: '⚖️ Ethics', tradeoff: '⚖️ Tradeoff' };
const QUESTION_SECONDS = 15;

export default function QuestionScreen({ state, goTo, pickQuestion, answerQuestion }) {
  const { questionAsked, settings } = state;
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [bitsEarned, setBitsEarned] = useState(0);

  useEffect(() => {
    if (!questionAsked) pickQuestion(QUESTIONS);
  }, []);

  // Auto-answer in dev mode
  useEffect(() => {
    if (settings.autoAnswerQuestion && questionAsked && !selected) {
      handleAnswer(questionAsked.correctIndex ?? 0);
    }
  }, [questionAsked]);

  const { timeLeft } = useTimer(QUESTION_SECONDS, {
    enabled: !selected && !settings.unlimitedTime,
    onComplete: () => { if (!selected) handleAnswer(-1); },
  });

  function handleAnswer(idx) {
    if (selected !== null || showResult) return;
    setSelected(idx);

    const q = questionAsked;
    let bits = 0;
    if (q.type === 'ethical') bits = q.bitsReward || 8;
    else if (idx === q.correctIndex) bits = q.bitsReward || 10;

    setBitsEarned(bits);
    answerQuestion(idx, q);
    setShowResult(true);

    setTimeout(() => goTo(settings.skipSimulation ? SCREENS.RESULTS : SCREENS.SIMULATION), 2000);
  }

  if (!questionAsked) {
    return <div style={{ minHeight: '100vh', background: '#0a0e1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#8892b0', fontFamily: 'JetBrains Mono, monospace' }}>Loading question…</div>
    </div>;
  }

  const q = questionAsked;
  const isEthical = q.type === 'ethical';

  return (
    <div className="bg-grid" style={{ minHeight: '100vh', background: '#0a0e1a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
      <div style={{ width: '100%', maxWidth: 440 }} className="animate-fade-in">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <span style={{ background: 'rgba(0,180,255,0.1)', border: '1px solid rgba(0,180,255,0.3)', borderRadius: 20, padding: '4px 12px', fontSize: 12, color: '#00b4ff', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>
            {TYPE_LABELS[q.type] || 'Question'}
          </span>

          {!selected && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 32, height: 32,
                borderRadius: '50%',
                background: `conic-gradient(${timeLeft <= 5 ? '#ef4444' : '#00b4ff'} ${(timeLeft / QUESTION_SECONDS) * 360}deg, #1a1f3a 0deg)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#0a0e1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: timeLeft <= 5 ? '#ef4444' : '#00b4ff', fontWeight: 700 }}>
                  {timeLeft}
                </div>
              </div>
              <span style={{ fontSize: 11, color: '#8892b0', fontFamily: 'JetBrains Mono, monospace' }}>sec</span>
            </div>
          )}
        </div>

        {/* Question */}
        <div style={{ background: '#12172e', border: '1px solid #2a3060', borderRadius: 16, padding: '20px', marginBottom: 16 }}>
          <p style={{ margin: 0, fontSize: 16, color: '#e8eaf6', lineHeight: 1.6, fontWeight: 500 }}>
            {q.question}
          </p>
          {isEthical && (
            <p style={{ margin: '8px 0 0', fontSize: 12, color: '#8892b0', fontStyle: 'italic' }}>
              No wrong answer — each choice gives different bonuses.
            </p>
          )}
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          {q.options.map((opt, i) => {
            const isSelected = selected === i;
            const isCorrect = !isEthical && i === q.correctIndex;
            const isWrong = selected !== null && isSelected && !isCorrect && !isEthical;
            const showCorrectHighlight = showResult && isCorrect && !isEthical;

            let bg = '#1a1f3a', border = '#2a3060', color = '#e8eaf6';
            if (isSelected && isEthical) { bg = 'rgba(0,180,255,0.15)'; border = '#00b4ff'; color = '#00b4ff'; }
            else if (showCorrectHighlight) { bg = 'rgba(52,211,153,0.15)'; border = '#34d399'; color = '#34d399'; }
            else if (isWrong) { bg = 'rgba(239,68,68,0.1)'; border = '#ef4444'; color = '#ef4444'; }
            else if (selected !== null) { bg = '#12172e'; border = '#1a2040'; color = '#4a5568'; }

            return (
              <button
                key={i}
                onClick={() => !selected && handleAnswer(i)}
                style={{
                  padding: '14px 16px', background: bg, border: `2px solid ${border}`,
                  borderRadius: 12, color, fontSize: 14, fontWeight: 600,
                  cursor: selected ? 'default' : 'pointer',
                  fontFamily: 'Space Grotesk, sans-serif', textAlign: 'left',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontFamily: 'JetBrains Mono, monospace', marginRight: 8, opacity: 0.6 }}>
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt}
                {isEthical && showResult && isSelected && q.statBonuses?.[i] && (
                  <span style={{ marginLeft: 8, fontSize: 12, opacity: 0.8 }}>
                    (+{Object.entries(q.statBonuses[i]).map(([s, v]) => `${v} ${s}`).join(', ')})
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Result feedback */}
        {showResult && (
          <div className="animate-fade-in" style={{
            padding: '14px 16px',
            background: bitsEarned > 0 ? 'rgba(52,211,153,0.1)' : 'rgba(239,68,68,0.1)',
            border: `1px solid ${bitsEarned > 0 ? 'rgba(52,211,153,0.4)' : 'rgba(239,68,68,0.4)'}`,
            borderRadius: 12,
          }}>
            <div style={{ color: bitsEarned > 0 ? '#34d399' : '#ef4444', fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
              {bitsEarned > 0 ? `✓ +${bitsEarned} Bits earned!` : '✗ Incorrect'} — Proceeding to simulation…
            </div>
            <div style={{ color: '#8892b0', fontSize: 12 }}>{q.explanation}</div>
          </div>
        )}
      </div>
    </div>
  );
}
