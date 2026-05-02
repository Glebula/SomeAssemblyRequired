import { useState, useEffect, useRef } from 'react';
import { QUESTIONS } from '../../data/questions';
import { SCREENS } from '../../hooks/useGameState';
import { useTimer } from '../../hooks/useTimer';

const QUESTION_TIME = 15;
const QUESTIONS_PER_ROUND = 1;

function pickQuestions() {
  const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, QUESTIONS_PER_ROUND);
}

export default function QuestionsScreen({ state, goTo, update }) {
  const { settings, devMode } = state;
  const [questions] = useState(() => pickQuestions());
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answered, setAnswered] = useState(null); // index or 'timed-out'
  const [flash, setFlash] = useState(null); // 'correct' | 'wrong'
  const [totalBits, setTotalBits] = useState(0);
  const [done, setDone] = useState(false);
  const accumulatedBitsRef = useRef(0);

  const q = questions[currentIdx];

  const timer = useTimer(QUESTION_TIME, () => {
    if (answered === null) handleAnswer(null);
  });

  useEffect(() => {
    if (settings?.skipQuestions && devMode) {
      const maxBits = settings?.autoAnswerQuestions ? QUESTIONS_PER_ROUND * 10 : 0;
      update({ bitsFromQuestions: maxBits, bits: state.bits + maxBits });
      goTo(SCREENS.SIMULATION);
      return;
    }
    timer.start();
  }, [currentIdx]);

  function handleAnswer(idx) {
    if (answered !== null) return;
    timer.pause();
    setAnswered(idx === null ? 'timed-out' : idx);

    let bitsEarned = 0;
    let statBonus = null;

    if (q.type === 'ethical') {
      bitsEarned = idx !== null ? q.bitsReward : 0;
      statBonus = idx !== null ? q.statBonuses?.[idx] : null;
      setFlash('correct');
    } else {
      const correct = idx === q.correctIndex;
      bitsEarned = correct ? q.bitsReward : 0;
      setFlash(correct ? 'correct' : 'wrong');
    }

    accumulatedBitsRef.current += bitsEarned;
    setTotalBits(accumulatedBitsRef.current);

    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setAnswered(null);
        setFlash(null);
        timer.reset(QUESTION_TIME);
        setCurrentIdx(prev => prev + 1);
      } else {
        // Done — use ref to get the true accumulated total (avoids stale closure)
        update({ bitsFromQuestions: accumulatedBitsRef.current, bits: state.bits + accumulatedBitsRef.current });
        setDone(true);
      }
    }, 1800);
  }

  if (done) {
    return <QuestionsSummary
      totalBits={totalBits}
      state={state}
      goTo={goTo}
      update={update}
    />;
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0e1a', padding: 24,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }} className="bg-grid">
      <div style={{ maxWidth: 560, width: '100%' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#8892b0', letterSpacing: '0.1em' }}>
              BITS CHALLENGE
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, color: '#fbbf24', fontWeight: 700 }}>
              +{totalBits} Bits earned
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#8892b0' }}>
              {currentIdx + 1}/{questions.length}
            </div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 22, fontWeight: 700,
              color: timer.seconds <= 5 ? '#ef4444' : '#00f0ff'
            }}>
              {timer.formatted}
            </div>
          </div>
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24, justifyContent: 'center' }}>
          {questions.map((_, i) => (
            <div key={i} style={{
              width: 10, height: 10, borderRadius: '50%',
              background: i < currentIdx ? '#34d399' : i === currentIdx ? '#00b4ff' : '#2a3060',
              transition: 'background 0.3s'
            }} />
          ))}
        </div>

        {/* Question card */}
        <div
          className={`animate-fade-in ${flash === 'correct' ? 'animate-flash-green' : flash === 'wrong' ? 'animate-flash-red' : ''}`}
          style={{
            background: '#12172e', border: '1px solid #2a3060',
            borderRadius: 16, padding: 28, marginBottom: 20
          }}
          key={currentIdx}
        >
          {/* Type badge */}
          <span style={{
            padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700,
            background: q.type === 'ethical' ? 'rgba(167,139,250,0.15)' : 'rgba(0,180,255,0.1)',
            color: q.type === 'ethical' ? '#a78bfa' : '#00b4ff',
            fontFamily: 'Space Grotesk, sans-serif', textTransform: 'capitalize',
            marginBottom: 16, display: 'inline-block'
          }}>
            {q.type === 'ethical' ? '⚖ Ethical Dilemma' : q.type === 'logic' ? '🔧 Logic' : q.type === 'tradeoff' ? '⚡ Tradeoff' : '🔬 Engineering'}
          </span>

          {/* Question text */}
          <p style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, fontWeight: 600,
            color: '#e8eaf6', lineHeight: 1.5, marginBottom: 0, marginTop: 0
          }}>
            {q.question}
          </p>
        </div>

        {/* Timer bar */}
        <div style={{ height: 4, background: '#1a1f3a', borderRadius: 2, marginBottom: 20 }}>
          <div style={{
            height: '100%', borderRadius: 2,
            width: `${(timer.seconds / QUESTION_TIME) * 100}%`,
            background: timer.seconds <= 5 ? '#ef4444' : '#00b4ff',
            transition: 'width 1s linear, background 0.3s'
          }} />
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {q.options.map((option, i) => {
            const isSelected = answered === i;
            const isCorrect = q.type === 'ethical' ? true : i === q.correctIndex;
            const showResult = answered !== null;

            let borderColor = '#2a3060';
            let bgColor = '#1a1f3a';
            let textColor = '#e8eaf6';

            if (showResult) {
              if (isSelected) {
                if (isCorrect) {
                  borderColor = '#34d399'; bgColor = 'rgba(52, 211, 153, 0.1)'; textColor = '#34d399';
                } else {
                  borderColor = '#ef4444'; bgColor = 'rgba(239, 68, 68, 0.1)'; textColor = '#ef4444';
                }
              } else if (isCorrect && answered !== null && q.type !== 'ethical') {
                borderColor = '#34d399'; bgColor = 'rgba(52, 211, 153, 0.05)'; textColor = '#34d399';
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={answered !== null}
                style={{
                  padding: '14px 18px',
                  background: bgColor,
                  border: `1.5px solid ${borderColor}`,
                  borderRadius: 10, color: textColor,
                  fontSize: 15, fontWeight: 500, cursor: answered ? 'default' : 'pointer',
                  fontFamily: 'Space Grotesk, sans-serif',
                  textAlign: 'left', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: 10
                }}
                onMouseEnter={e => { if (!answered) { e.currentTarget.style.borderColor = '#00b4ff'; e.currentTarget.style.background = 'rgba(0,180,255,0.05)'; }}}
                onMouseLeave={e => { if (!answered) { e.currentTarget.style.borderColor = '#2a3060'; e.currentTarget.style.background = '#1a1f3a'; }}}
              >
                <span style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  background: borderColor === '#2a3060' ? '#12172e' : borderColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: 'white'
                }}>
                  {showResult && isSelected && isCorrect ? '✓' :
                   showResult && isSelected && !isCorrect ? '✗' :
                   showResult && isCorrect && q.type !== 'ethical' ? '✓' :
                   String.fromCharCode(65 + i)}
                </span>
                {option}
                {showResult && isSelected && (
                  <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 700 }}>
                    {isCorrect || q.type === 'ethical' ? `+${q.bitsReward} Bits` : '0 Bits'}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation after answer */}
        {answered !== null && q.explanation && (
          <div className="animate-slide-up" style={{
            marginTop: 16, padding: 12,
            background: 'rgba(0, 180, 255, 0.08)',
            border: '1px solid rgba(0, 180, 255, 0.2)',
            borderRadius: 8
          }}>
            <p style={{ color: '#8892b0', fontSize: 13, fontFamily: 'Space Grotesk, sans-serif', margin: 0 }}>
              💡 {q.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function QuestionsSummary({ totalBits, state, goTo, update }) {
  const [spending, setSpending] = useState(false);
  const spendTimer = useTimer(30, () => proceedToSimulation());

  function proceedToSimulation() {
    goTo(SCREENS.SIMULATION);
  }

  function handleSpendNow() {
    setSpending(true);
    spendTimer.start();
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0e1a', padding: 24,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }} className="bg-grid">
      <div className="animate-fade-in" style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>💰</div>
        <h2 style={{
          fontFamily: 'Space Grotesk, sans-serif', fontSize: 28, fontWeight: 700,
          color: '#e8eaf6', marginBottom: 8
        }}>
          Questions Complete!
        </h2>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 36, fontWeight: 700,
          color: '#fbbf24', marginBottom: 8
        }}>
          +{totalBits} Bits
        </div>
        <p style={{ color: '#8892b0', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 32 }}>
          You now have <strong style={{ color: '#fbbf24' }}>{state.bits}</strong> total Bits.
        </p>

        {!spending && totalBits > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button
              onClick={handleSpendNow}
              style={{
                padding: '14px 24px',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                border: 'none', borderRadius: 10, color: '#0a0e1a',
                fontSize: 16, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'Space Grotesk, sans-serif'
              }}
            >
              💰 Spend Bits Now (30s)
            </button>
            <button
              onClick={proceedToSimulation}
              style={{
                padding: '14px 24px', background: 'transparent',
                border: '1px solid #2a3060', borderRadius: 10, color: '#8892b0',
                fontSize: 15, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif'
              }}
            >
              Proceed to Field Test →
            </button>
          </div>
        )}

        {!spending && totalBits === 0 && (
          <button
            onClick={proceedToSimulation}
            style={{
              padding: '16px 40px',
              background: 'linear-gradient(135deg, #00b4ff, #0080cc)',
              border: 'none', borderRadius: 10, color: 'white',
              fontSize: 16, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'Space Grotesk, sans-serif',
              boxShadow: '0 4px 20px rgba(0,180,255,0.3)'
            }}
          >
            Proceed to Field Test →
          </button>
        )}

        {spending && (
          <div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 24, color: '#fbbf24',
              marginBottom: 8
            }}>
              ⏱ {spendTimer.formatted} remaining
            </div>
            <p style={{ color: '#8892b0', fontSize: 14, fontFamily: 'Space Grotesk, sans-serif', marginBottom: 16 }}>
              Go back to your robot and add parts! (Use the Build Screen)
            </p>
            <button
              onClick={proceedToSimulation}
              style={{
                padding: '14px 32px',
                background: 'linear-gradient(135deg, #00b4ff, #0080cc)',
                border: 'none', borderRadius: 10, color: 'white',
                fontSize: 15, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'Space Grotesk, sans-serif'
              }}
            >
              Proceed to Field Test →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
