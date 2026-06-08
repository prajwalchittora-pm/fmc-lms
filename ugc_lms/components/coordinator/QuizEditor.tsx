'use client';
import { useState } from 'react';
import {
  Plus, Trash2, GripVertical, X, ChevronLeft, ChevronRight, ChevronDown,
  CheckCircle2, CircleDot, ToggleLeft, Type, AlignLeft, GitBranch, Hash, FileText,
  HelpCircle, Copy
} from 'lucide-react';

// ─── Question Types ────────────────────────────────────────────────────────

type QuestionType = 'mcq' | 'multiple_select' | 'true_false' | 'short_answer' | 'fill_blank' | 'matching' | 'numerical' | 'essay';

interface QuestionOption { id: string; text: string; correct: boolean; }
interface MatchPair { id: string; left: string; right: string; }
interface BlankAnswer { id: string; blank: number; accepted: string[]; }

interface Question {
  id: string;
  type: QuestionType;
  text: string;
  points: number;
  options: QuestionOption[];
  matchPairs: MatchPair[];
  blankAnswers: BlankAnswer[];
  acceptedAnswers: string[];
  correctAnswer: number | null;
  tolerance: number;
  caseSensitive: boolean;
  wordLimit: number | null;
  essayInstructions: string;
}

const QUESTION_TYPES: { type: QuestionType; label: string; desc: string; icon: React.ElementType; color: string }[] = [
  { type: 'mcq', label: 'Multiple Choice', desc: 'Single correct answer from options', icon: CircleDot, color: '#072FB5' },
  { type: 'multiple_select', label: 'Multiple Select', desc: 'Multiple correct answers (checkboxes)', icon: CheckCircle2, color: '#0E7490' },
  { type: 'true_false', label: 'True / False', desc: 'Binary choice question', icon: ToggleLeft, color: '#1B7A4A' },
  { type: 'short_answer', label: 'Short Answer', desc: 'Text input matched against accepted answers', icon: Type, color: '#8F3B00' },
  { type: 'fill_blank', label: 'Fill in the Blank', desc: 'Sentence with blanks to complete', icon: AlignLeft, color: '#7C3AED' },
  { type: 'matching', label: 'Matching', desc: 'Match items from two columns', icon: GitBranch, color: '#0DA88F' },
  { type: 'numerical', label: 'Numerical', desc: 'Number input with tolerance range', icon: Hash, color: '#DC2626' },
  { type: 'essay', label: 'Essay', desc: 'Long-form text, manually graded', icon: FileText, color: '#6B7280' },
];

function createQuestion(type: QuestionType): Question {
  const base: Question = {
    id: 'q-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
    type, text: '', points: 1,
    options: [], matchPairs: [], blankAnswers: [], acceptedAnswers: [],
    correctAnswer: null, tolerance: 0, caseSensitive: false,
    wordLimit: null, essayInstructions: '',
  };
  switch (type) {
    case 'mcq':
      base.options = [
        { id: 'o1', text: '', correct: true },
        { id: 'o2', text: '', correct: false },
        { id: 'o3', text: '', correct: false },
        { id: 'o4', text: '', correct: false },
      ];
      break;
    case 'multiple_select':
      base.options = [
        { id: 'o1', text: '', correct: false },
        { id: 'o2', text: '', correct: false },
        { id: 'o3', text: '', correct: false },
        { id: 'o4', text: '', correct: false },
      ];
      break;
    case 'true_false':
      base.options = [
        { id: 'tf1', text: 'True', correct: true },
        { id: 'tf2', text: 'False', correct: false },
      ];
      break;
    case 'short_answer':
      base.acceptedAnswers = [''];
      break;
    case 'fill_blank':
      base.text = 'The capital of India is {blank}.';
      base.blankAnswers = [{ id: 'b1', blank: 1, accepted: [''] }];
      break;
    case 'matching':
      base.matchPairs = [
        { id: 'm1', left: '', right: '' },
        { id: 'm2', left: '', right: '' },
        { id: 'm3', left: '', right: '' },
      ];
      break;
    case 'numerical':
      base.correctAnswer = null;
      base.tolerance = 0;
      break;
    case 'essay':
      base.wordLimit = 500;
      break;
  }
  return base;
}

// ─── Question Type Picker ──────────────────────────────────────────────────

function TypePicker({ onSelect, onClose }: { onSelect: (type: QuestionType) => void; onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 560, background: '#fff', borderRadius: 16,
        boxShadow: '0 25px 80px rgba(0,0,0,0.25)', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '22px 28px 18px',
          background: 'linear-gradient(135deg, #030B22 0%, #06102E 50%, #213594 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)', display: 'grid', placeItems: 'center' }}>
              <HelpCircle size={20} strokeWidth={1.8} style={{ color: '#fff' }} />
            </div>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>Add Question</h3>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'rgba(255,255,255,0.5)' }}>
            <X size={15} />
          </button>
        </div>

        {/* Type grid */}
        <div style={{ padding: '20px 24px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {QUESTION_TYPES.map(qt => {
            const Icon = qt.icon;
            return (
              <button key={qt.type} onClick={() => onSelect(qt.type)} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px', background: '#fff',
                border: '1.5px solid var(--border-subtle)', borderRadius: 10,
                cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-sans)',
                transition: 'border-color 0.12s, box-shadow 0.12s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = qt.color; e.currentTarget.style.boxShadow = `0 2px 12px ${qt.color}15`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 8, background: `${qt.color}0A`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <Icon size={17} strokeWidth={2} style={{ color: qt.color }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>{qt.label}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)', marginTop: 1 }}>{qt.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Question Editor Modal ─────────────────────────────────────────────────

function QuestionEditorModal({ question, onSave, onClose }: { question: Question; onSave: (q: Question) => void; onClose: () => void }) {
  const [q, setQ] = useState<Question>({ ...question, options: question.options.map(o => ({ ...o })), matchPairs: question.matchPairs.map(m => ({ ...m })), blankAnswers: question.blankAnswers.map(b => ({ ...b, accepted: [...b.accepted] })), acceptedAnswers: [...question.acceptedAnswers] });
  const typeInfo = QUESTION_TYPES.find(t => t.type === q.type)!;
  const TypeIcon = typeInfo.icon;

  const updateOption = (id: string, patch: Partial<QuestionOption>) => {
    setQ(prev => ({ ...prev, options: prev.options.map(o => o.id === id ? { ...o, ...patch } : o) }));
  };
  const addOption = () => {
    setQ(prev => ({ ...prev, options: [...prev.options, { id: 'o-' + Date.now(), text: '', correct: false }] }));
  };
  const removeOption = (id: string) => {
    setQ(prev => ({ ...prev, options: prev.options.filter(o => o.id !== id) }));
  };
  const setCorrectMCQ = (id: string) => {
    setQ(prev => ({ ...prev, options: prev.options.map(o => ({ ...o, correct: o.id === id })) }));
  };
  const toggleCorrectMulti = (id: string) => {
    setQ(prev => ({ ...prev, options: prev.options.map(o => o.id === id ? { ...o, correct: !o.correct } : o) }));
  };

  const addMatchPair = () => {
    setQ(prev => ({ ...prev, matchPairs: [...prev.matchPairs, { id: 'm-' + Date.now(), left: '', right: '' }] }));
  };
  const removeMatchPair = (id: string) => {
    setQ(prev => ({ ...prev, matchPairs: prev.matchPairs.filter(m => m.id !== id) }));
  };
  const updateMatchPair = (id: string, side: 'left' | 'right', val: string) => {
    setQ(prev => ({ ...prev, matchPairs: prev.matchPairs.map(m => m.id === id ? { ...m, [side]: val } : m) }));
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', fontSize: 13,
    fontFamily: 'var(--font-sans)', color: 'var(--text-primary)',
    background: 'var(--bg-section)', border: '1.5px solid transparent',
    borderRadius: 8, outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.15s, box-shadow 0.15s, background 0.15s',
  };
  const focusInput = (e: React.FocusEvent<HTMLElement>) => { e.currentTarget.style.borderColor = typeInfo.color; e.currentTarget.style.boxShadow = `0 0 0 3px ${typeInfo.color}18`; e.currentTarget.style.background = '#fff'; };
  const blurInput = (e: React.FocusEvent<HTMLElement>) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'var(--bg-section)'; };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 640, maxHeight: '90vh', background: '#fff', borderRadius: 16,
        boxShadow: '0 25px 80px rgba(0,0,0,0.25)', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '22px 28px 18px',
          background: 'linear-gradient(135deg, #030B22 0%, #06102E 50%, #213594 100%)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)', display: 'grid', placeItems: 'center' }}>
                <TypeIcon size={20} strokeWidth={1.8} style={{ color: '#fff' }} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>{typeInfo.label}</h3>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>{typeInfo.desc}</span>
              </div>
            </div>
            <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'rgba(255,255,255,0.5)' }}>
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto', padding: '22px 28px' }}>

          {/* Question text */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
              Question <span style={{ color: typeInfo.color }}>*</span>
            </label>
            <textarea
              value={q.text} onChange={e => setQ(prev => ({ ...prev, text: e.target.value }))}
              placeholder={q.type === 'fill_blank' ? 'Use {blank} to mark blanks. e.g. The capital of India is {blank}.' : 'Enter your question...'}
              rows={3} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
              onFocus={focusInput} onBlur={blurInput}
            />
            {q.type === 'fill_blank' && (
              <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)', marginTop: 4 }}>Use <code style={{ background: 'var(--bg-section)', padding: '1px 5px', borderRadius: 3, fontFamily: 'var(--font-mono)', fontSize: 10 }}>{'{blank}'}</code> to mark each blank in the sentence</div>
            )}
          </div>

          {/* Points */}
          <div style={{ marginBottom: 22, display: 'flex', alignItems: 'center', gap: 12 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>Points</label>
            <input type="number" min={0} value={q.points} onChange={e => setQ(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
              style={{ ...inputStyle, width: 80, textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700 }}
              onFocus={focusInput} onBlur={blurInput}
            />
          </div>

          {/* ═══ Type-specific editors ═══ */}

          {/* MCQ / Multiple Select — options list */}
          {(q.type === 'mcq' || q.type === 'multiple_select') && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {q.type === 'mcq' ? 'Options (select the correct answer)' : 'Options (check all correct answers)'}
                </label>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {q.options.map((opt, idx) => (
                  <div key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {/* Correct indicator */}
                    <button onClick={() => q.type === 'mcq' ? setCorrectMCQ(opt.id) : toggleCorrectMulti(opt.id)} style={{
                      width: 22, height: 22, borderRadius: q.type === 'mcq' ? '50%' : 4, flexShrink: 0,
                      border: `2px solid ${opt.correct ? typeInfo.color : 'var(--neutral-200)'}`,
                      background: opt.correct ? typeInfo.color : 'transparent',
                      display: 'grid', placeItems: 'center', cursor: 'pointer', padding: 0,
                      transition: 'all 0.15s',
                    }}>
                      {opt.correct && <CheckCircle2 size={12} style={{ color: '#fff' }} />}
                    </button>
                    {/* Option label */}
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', width: 18, textAlign: 'center', flexShrink: 0 }}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {/* Option text */}
                    <input type="text" placeholder={`Option ${String.fromCharCode(65 + idx)}`} value={opt.text} onChange={e => updateOption(opt.id, { text: e.target.value })}
                      style={{ ...inputStyle, flex: 1 }} onFocus={focusInput} onBlur={blurInput}
                    />
                    {q.options.length > 2 && (
                      <button onClick={() => removeOption(opt.id)} style={{ width: 24, height: 24, borderRadius: 6, background: 'transparent', border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--text-tertiary)', transition: 'color 0.1s' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#DC2626'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)'; }}
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {q.options.length < 8 && (
                <button onClick={addOption} style={{
                  marginTop: 10, display: 'flex', alignItems: 'center', gap: 5,
                  padding: '6px 12px', fontSize: 11, fontWeight: 600,
                  color: typeInfo.color, background: `${typeInfo.color}06`,
                  border: `1px dashed ${typeInfo.color}30`, borderRadius: 6,
                  cursor: 'pointer', fontFamily: 'var(--font-sans)',
                }}>
                  <Plus size={12} /> Add option
                </button>
              )}
            </div>
          )}

          {/* True/False */}
          {q.type === 'true_false' && (
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Correct answer</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {q.options.map(opt => (
                  <button key={opt.id} onClick={() => setCorrectMCQ(opt.id)} style={{
                    flex: 1, padding: '14px', borderRadius: 10,
                    background: opt.correct ? `${typeInfo.color}08` : 'var(--bg-section)',
                    border: `2px solid ${opt.correct ? typeInfo.color : 'transparent'}`,
                    cursor: 'pointer', fontFamily: 'var(--font-sans)',
                    fontSize: 14, fontWeight: 700,
                    color: opt.correct ? typeInfo.color : 'var(--text-tertiary)',
                    transition: 'all 0.15s',
                  }}>
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Short Answer */}
          {q.type === 'short_answer' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>Accepted answers</label>
                <button onClick={() => setQ(prev => ({ ...prev, caseSensitive: !prev.caseSensitive }))} style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px',
                  fontSize: 10, fontWeight: 600, fontFamily: 'var(--font-sans)',
                  background: q.caseSensitive ? `${typeInfo.color}08` : 'var(--bg-section)',
                  color: q.caseSensitive ? typeInfo.color : 'var(--text-tertiary)',
                  border: `1px solid ${q.caseSensitive ? typeInfo.color + '30' : 'var(--border-subtle)'}`,
                  borderRadius: 5, cursor: 'pointer',
                }}>
                  Case sensitive: {q.caseSensitive ? 'On' : 'Off'}
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {q.acceptedAnswers.map((ans, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input type="text" placeholder={idx === 0 ? 'Primary correct answer' : 'Alternative accepted answer'} value={ans}
                      onChange={e => { const a = [...q.acceptedAnswers]; a[idx] = e.target.value; setQ(prev => ({ ...prev, acceptedAnswers: a })); }}
                      style={{ ...inputStyle, flex: 1 }} onFocus={focusInput} onBlur={blurInput}
                    />
                    {q.acceptedAnswers.length > 1 && (
                      <button onClick={() => { const a = q.acceptedAnswers.filter((_, i) => i !== idx); setQ(prev => ({ ...prev, acceptedAnswers: a })); }}
                        style={{ width: 24, height: 24, borderRadius: 6, background: 'transparent', border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--text-tertiary)' }}>
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={() => setQ(prev => ({ ...prev, acceptedAnswers: [...prev.acceptedAnswers, ''] }))} style={{
                marginTop: 8, display: 'flex', alignItems: 'center', gap: 5,
                padding: '6px 12px', fontSize: 11, fontWeight: 600,
                color: typeInfo.color, background: `${typeInfo.color}06`,
                border: `1px dashed ${typeInfo.color}30`, borderRadius: 6,
                cursor: 'pointer', fontFamily: 'var(--font-sans)',
              }}>
                <Plus size={12} /> Add alternative answer
              </button>
            </div>
          )}

          {/* Fill in the Blank */}
          {q.type === 'fill_blank' && (
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Accepted answers for each blank</label>
              {(() => {
                const blanks = (q.text.match(/\{blank\}/g) || []).length;
                return Array.from({ length: blanks }).map((_, bIdx) => (
                  <div key={bIdx} style={{ marginBottom: 12, padding: '12px 14px', background: 'var(--bg-section)', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: typeInfo.color, marginBottom: 6 }}>Blank {bIdx + 1}</div>
                    <input type="text" placeholder="Accepted answer(s), comma-separated"
                      value={q.blankAnswers[bIdx]?.accepted.join(', ') || ''}
                      onChange={e => {
                        const answers = e.target.value.split(',').map(s => s.trim());
                        const ba = [...q.blankAnswers];
                        ba[bIdx] = { id: ba[bIdx]?.id || 'b-' + bIdx, blank: bIdx + 1, accepted: answers };
                        setQ(prev => ({ ...prev, blankAnswers: ba }));
                      }}
                      style={{ ...inputStyle, background: '#fff' }} onFocus={focusInput} onBlur={blurInput}
                    />
                  </div>
                ));
              })()}
              {(q.text.match(/\{blank\}/g) || []).length === 0 && (
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', padding: '16px', textAlign: 'center', background: 'var(--bg-section)', borderRadius: 8 }}>
                  Add <code style={{ fontFamily: 'var(--font-mono)', background: '#fff', padding: '1px 5px', borderRadius: 3 }}>{'{blank}'}</code> to your question text above to create blanks
                </div>
              )}
            </div>
          )}

          {/* Matching */}
          {q.type === 'matching' && (
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Match pairs</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto', gap: '8px 10px', alignItems: 'center', marginBottom: 4 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Item</div>
                <div />
                <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Match</div>
                <div />
                {q.matchPairs.map(pair => (
                  <>
                    <input key={pair.id + 'l'} type="text" placeholder="Left item" value={pair.left} onChange={e => updateMatchPair(pair.id, 'left', e.target.value)}
                      style={inputStyle} onFocus={focusInput} onBlur={blurInput}
                    />
                    <span style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>→</span>
                    <input key={pair.id + 'r'} type="text" placeholder="Right match" value={pair.right} onChange={e => updateMatchPair(pair.id, 'right', e.target.value)}
                      style={inputStyle} onFocus={focusInput} onBlur={blurInput}
                    />
                    {q.matchPairs.length > 2 && (
                      <button key={pair.id + 'd'} onClick={() => removeMatchPair(pair.id)} style={{ width: 24, height: 24, borderRadius: 6, background: 'transparent', border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--text-tertiary)' }}>
                        <Trash2 size={12} />
                      </button>
                    )}
                    {q.matchPairs.length <= 2 && <div key={pair.id + 'e'} />}
                  </>
                ))}
              </div>
              <button onClick={addMatchPair} style={{
                marginTop: 8, display: 'flex', alignItems: 'center', gap: 5,
                padding: '6px 12px', fontSize: 11, fontWeight: 600,
                color: typeInfo.color, background: `${typeInfo.color}06`,
                border: `1px dashed ${typeInfo.color}30`, borderRadius: 6,
                cursor: 'pointer', fontFamily: 'var(--font-sans)',
              }}>
                <Plus size={12} /> Add pair
              </button>
            </div>
          )}

          {/* Numerical */}
          {q.type === 'numerical' && (
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Correct answer</label>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 4 }}>Answer</div>
                  <input type="number" placeholder="e.g. 42" value={q.correctAnswer ?? ''} onChange={e => setQ(prev => ({ ...prev, correctAnswer: parseFloat(e.target.value) || null }))}
                    style={{ ...inputStyle, fontFamily: 'var(--font-mono)', fontWeight: 600 }} onFocus={focusInput} onBlur={blurInput}
                  />
                </div>
                <div style={{ width: 140 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 4 }}>Tolerance (±)</div>
                  <input type="number" placeholder="0" value={q.tolerance || ''} onChange={e => setQ(prev => ({ ...prev, tolerance: parseFloat(e.target.value) || 0 }))}
                    style={{ ...inputStyle, fontFamily: 'var(--font-mono)', fontWeight: 600 }} onFocus={focusInput} onBlur={blurInput}
                  />
                </div>
              </div>
              <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)', marginTop: 6 }}>
                {q.correctAnswer !== null && q.tolerance > 0
                  ? `Accepted range: ${q.correctAnswer - q.tolerance} to ${q.correctAnswer + q.tolerance}`
                  : 'Exact match required (tolerance = 0)'}
              </div>
            </div>
          )}

          {/* Essay */}
          {q.type === 'essay' && (
            <div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Grading instructions</label>
                <textarea value={q.essayInstructions} onChange={e => setQ(prev => ({ ...prev, essayInstructions: e.target.value }))}
                  placeholder="Instructions for the person grading this essay (rubric, key points to look for)..."
                  rows={3} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                  onFocus={focusInput} onBlur={blurInput}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Word limit</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="number" placeholder="500" value={q.wordLimit ?? ''} onChange={e => setQ(prev => ({ ...prev, wordLimit: parseInt(e.target.value) || null }))}
                    style={{ ...inputStyle, width: 100, fontFamily: 'var(--font-mono)', fontWeight: 600 }}
                    onFocus={focusInput} onBlur={blurInput}
                  />
                  <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>words</span>
                </div>
              </div>
              <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(107,114,128,0.06)', borderRadius: 8, fontSize: 11, color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
                Essay questions require manual grading by the coordinator or faculty.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 28px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: 8, flexShrink: 0, background: '#FAFAFA' }}>
          <button onClick={onClose} style={{
            padding: '9px 20px', fontSize: 13, fontWeight: 600,
            color: 'var(--text-secondary)', background: '#fff',
            border: '1px solid var(--border-subtle)', borderRadius: 8,
            cursor: 'pointer', fontFamily: 'var(--font-sans)',
          }}>
            Cancel
          </button>
          <button
            onClick={() => { if (q.text.trim()) onSave(q); }}
            disabled={!q.text.trim()}
            style={{
              padding: '9px 24px', fontSize: 13, fontWeight: 700,
              color: '#fff', background: q.text.trim() ? typeInfo.color : 'var(--neutral-200)',
              border: 'none', borderRadius: 8,
              cursor: q.text.trim() ? 'pointer' : 'not-allowed',
              fontFamily: 'var(--font-sans)',
              boxShadow: q.text.trim() ? `0 2px 8px ${typeInfo.color}30` : 'none',
            }}
          >
            {question.text ? 'Save Question' : 'Add Question'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Quiz Editor ──────────────────────────────────────────────────────

// ─── Question Bank Modal ───────────────────────────────────────────────────

const QUESTION_BANK: { category: string; questions: { id: string; text: string; type: QuestionType; points: number }[] }[] = [
  { category: 'Managerial Economics', questions: [
    { id: 'qb1', text: 'Define the law of diminishing marginal returns.', type: 'short_answer', points: 2 },
    { id: 'qb2', text: 'Which of the following is NOT a market structure?', type: 'mcq', points: 1 },
    { id: 'qb3', text: 'Explain the concept of price elasticity of demand.', type: 'essay', points: 5 },
    { id: 'qb4', text: 'GDP is measured in real terms to account for inflation.', type: 'true_false', points: 1 },
  ]},
  { category: 'Managerial Communication', questions: [
    { id: 'qb5', text: 'Match the communication model with its originator.', type: 'matching', points: 3 },
    { id: 'qb6', text: 'The 7 Cs of communication include clarity, conciseness, and {blank}.', type: 'fill_blank', points: 2 },
    { id: 'qb7', text: 'Which of the following are barriers to effective communication?', type: 'multiple_select', points: 2 },
  ]},
  { category: 'Financial Accounting', questions: [
    { id: 'qb8', text: 'Calculate the current ratio if current assets = 500,000 and current liabilities = 250,000.', type: 'numerical', points: 2 },
    { id: 'qb9', text: 'The accounting equation is Assets = Liabilities + Equity.', type: 'true_false', points: 1 },
  ]},
];

function QuestionBankModal({ onAdd, onClose }: { onAdd: (questions: Question[]) => void; onClose: () => void }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [randomCategory, setRandomCategory] = useState('');
  const [randomCount, setRandomCount] = useState(5);
  const [tab, setTab] = useState<'pick' | 'random'>('pick');
  const [pickCategory, setPickCategory] = useState<string | null>(null);
  const [bankSearch, setBankSearch] = useState('');

  const toggleSelect = (id: string) => {
    setSelected(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };

  const handleAddSelected = () => {
    const qs: Question[] = [];
    QUESTION_BANK.forEach(cat => cat.questions.forEach(qb => {
      if (selected.has(qb.id)) {
        const q = createQuestion(qb.type);
        q.text = qb.text; q.points = qb.points;
        qs.push(q);
      }
    }));
    onAdd(qs);
  };

  const handleAddRandom = () => {
    const cat = QUESTION_BANK.find(c => c.category === randomCategory);
    if (!cat) return;
    const shuffled = [...cat.questions].sort(() => Math.random() - 0.5).slice(0, randomCount);
    const qs = shuffled.map(qb => { const q = createQuestion(qb.type); q.text = qb.text; q.points = qb.points; return q; });
    onAdd(qs);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: 600, maxHeight: '85vh', background: '#fff', borderRadius: 16, boxShadow: '0 25px 80px rgba(0,0,0,0.25)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '22px 28px 16px', background: 'linear-gradient(135deg, #030B22 0%, #06102E 50%, #213594 100%)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)' }}>Question Bank</h3>
            <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'rgba(255,255,255,0.5)' }}>
              <X size={15} />
            </button>
          </div>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, marginTop: 14 }}>
            {[{ key: 'pick' as const, label: 'Pick Questions' }, { key: 'random' as const, label: 'Random Questions' }].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                padding: '7px 16px', fontSize: 12, fontWeight: 600,
                color: tab === t.key ? '#fff' : 'rgba(255,255,255,0.5)',
                background: tab === t.key ? 'rgba(255,255,255,0.15)' : 'transparent',
                border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: 'var(--font-sans)',
              }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px' }}>
          {tab === 'pick' ? (
            <div>
              {!pickCategory ? (
                /* Step 1: Pick a question bank */
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input
                    type="text" placeholder="Search question banks..." value={bankSearch}
                    onChange={e => setBankSearch(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 14px', fontSize: 13,
                      fontFamily: 'var(--font-sans)', color: 'var(--text-primary)',
                      background: 'var(--bg-section)', border: '1.5px solid transparent',
                      borderRadius: 8, outline: 'none', boxSizing: 'border-box',
                      marginBottom: 4,
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = '#072FB5'; e.currentTarget.style.background = '#fff'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'var(--bg-section)'; }}
                  />
                  {QUESTION_BANK.filter(cat => cat.category.toLowerCase().includes(bankSearch.toLowerCase())).map(cat => (
                    <button key={cat.category} onClick={() => setPickCategory(cat.category)} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 16px', background: '#fff',
                      border: '1.5px solid var(--border-subtle)', borderRadius: 10,
                      cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-sans)',
                      transition: 'border-color 0.12s, box-shadow 0.12s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#072FB5'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(7,47,181,0.08)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>{cat.category}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{cat.questions.length} questions</div>
                      </div>
                      <ChevronRight size={16} style={{ color: 'var(--text-tertiary)' }} />
                    </button>
                  ))}
                </div>
              ) : (
                /* Step 2: Browse questions in selected bank */
                <div>
                  <button onClick={() => setPickCategory(null)} style={{
                    display: 'flex', alignItems: 'center', gap: 4, marginBottom: 14,
                    padding: 0, background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 12, fontWeight: 600, color: '#072FB5', fontFamily: 'var(--font-sans)',
                  }}>
                    <ChevronLeft size={14} /> All question banks
                  </button>
                  <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', marginBottom: 4 }}>{pickCategory}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 14 }}>{QUESTION_BANK.find(c => c.category === pickCategory)?.questions.length} questions available</div>
                  {QUESTION_BANK.find(c => c.category === pickCategory)?.questions.map(qb => {
                    const isSelected = selected.has(qb.id);
                    const typeInfo = QUESTION_TYPES.find(t => t.type === qb.type)!;
                    const TypeIcon = typeInfo.icon;
                    return (
                      <div key={qb.id} onClick={() => toggleSelect(qb.id)} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 12px', marginBottom: 4,
                        background: isSelected ? `${typeInfo.color}06` : 'transparent',
                        border: `1.5px solid ${isSelected ? typeInfo.color : 'transparent'}`,
                        borderRadius: 8, cursor: 'pointer', transition: 'all 0.12s',
                      }}>
                        <div style={{
                          width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                          border: `2px solid ${isSelected ? typeInfo.color : 'var(--neutral-200)'}`,
                          background: isSelected ? typeInfo.color : 'transparent',
                          display: 'grid', placeItems: 'center',
                        }}>
                          {isSelected && <CheckCircle2 size={10} style={{ color: '#fff' }} />}
                        </div>
                        <TypeIcon size={13} strokeWidth={2} style={{ color: typeInfo.color, flexShrink: 0 }} />
                        <div style={{ flex: 1, fontSize: 12.5, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.35 }}>{qb.text}</div>
                        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{qb.points}pt</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div style={{ paddingTop: 4 }}>
              {!randomCategory ? (
                /* Step 1: Search + pick a question bank */
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input
                    type="text" placeholder="Search question banks..." value={bankSearch}
                    onChange={e => setBankSearch(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 14px', fontSize: 13,
                      fontFamily: 'var(--font-sans)', color: 'var(--text-primary)',
                      background: 'var(--bg-section)', border: '1.5px solid transparent',
                      borderRadius: 8, outline: 'none', boxSizing: 'border-box',
                      marginBottom: 4,
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = '#072FB5'; e.currentTarget.style.background = '#fff'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'var(--bg-section)'; }}
                  />
                  {QUESTION_BANK.filter(cat => cat.category.toLowerCase().includes(bankSearch.toLowerCase())).map(cat => (
                    <button key={cat.category} onClick={() => { setRandomCategory(cat.category); setBankSearch(''); }} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 16px', background: '#fff',
                      border: '1.5px solid var(--border-subtle)', borderRadius: 10,
                      cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-sans)',
                      transition: 'border-color 0.12s, box-shadow 0.12s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#072FB5'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(7,47,181,0.08)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>{cat.category}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{cat.questions.length} questions available</div>
                      </div>
                      <ChevronRight size={16} style={{ color: 'var(--text-tertiary)' }} />
                    </button>
                  ))}
                </div>
              ) : (
                /* Step 2: Configure random count */
                <div>
                  <button onClick={() => setRandomCategory('')} style={{
                    display: 'flex', alignItems: 'center', gap: 4, marginBottom: 14,
                    padding: 0, background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 12, fontWeight: 600, color: '#072FB5', fontFamily: 'var(--font-sans)',
                  }}>
                    <ChevronLeft size={14} /> All question banks
                  </button>
                  <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', marginBottom: 4 }}>{randomCategory}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 20 }}>{QUESTION_BANK.find(c => c.category === randomCategory)?.questions.length} questions available in this bank</div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>How many random questions?</label>
                    <input type="number" min={1} max={QUESTION_BANK.find(c => c.category === randomCategory)?.questions.length || 20} value={randomCount} onChange={e => setRandomCount(parseInt(e.target.value) || 1)}
                      style={{ width: 100, padding: '10px 14px', fontSize: 14, fontFamily: 'var(--font-mono)', fontWeight: 700, background: 'var(--bg-section)', border: '1.5px solid transparent', borderRadius: 8, outline: 'none', textAlign: 'center' }}
                    />
                  </div>

                  <div style={{ padding: '12px 14px', background: 'rgba(7,47,181,0.04)', borderRadius: 8, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {randomCount} random question{randomCount !== 1 ? 's' : ''} will be randomly selected from <strong>{randomCategory}</strong>. Each student may get a different set.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: 8, flexShrink: 0, background: '#FAFAFA' }}>
          <button onClick={onClose} style={{ padding: '9px 20px', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Cancel</button>
          {tab === 'pick' ? (
            <button onClick={handleAddSelected} disabled={selected.size === 0} style={{
              padding: '9px 24px', fontSize: 13, fontWeight: 700, color: '#fff',
              background: selected.size > 0 ? '#072FB5' : 'var(--neutral-200)',
              border: 'none', borderRadius: 8, cursor: selected.size > 0 ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-sans)',
            }}>
              Add {selected.size} Question{selected.size !== 1 ? 's' : ''}
            </button>
          ) : (
            <button onClick={handleAddRandom} disabled={!randomCategory} style={{
              padding: '9px 24px', fontSize: 13, fontWeight: 700, color: '#fff',
              background: randomCategory ? '#072FB5' : 'var(--neutral-200)',
              border: 'none', borderRadius: 8, cursor: randomCategory ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-sans)',
            }}>
              Add Random Questions
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Quiz Editor ──────────────────────────────────────────────────────

interface QuizEditorProps {
  quizTitle: string;
}

export default function QuizEditor({ quizTitle }: QuizEditorProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [showQuestionBank, setShowQuestionBank] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const totalPoints = questions.reduce((s, q) => s + q.points, 0);

  // Mock quiz config — in production, read from quiz settings
  const quizConfig = { type: 'Graded', timeLimit: '30 min', attempts: '1 attempt', opens: '10 Jun', closes: '15 Jun' };

  const addQuestion = (type: QuestionType) => {
    setShowTypePicker(false);
    const q = createQuestion(type);
    setEditingQuestion(q);
  };

  const saveQuestion = (q: Question) => {
    setQuestions(prev => {
      const exists = prev.find(x => x.id === q.id);
      if (exists) return prev.map(x => x.id === q.id ? q : x);
      return [...prev, q];
    });
    setEditingQuestion(null);
  };

  const addFromBank = (qs: Question[]) => {
    setQuestions(prev => [...prev, ...qs]);
    setShowQuestionBank(false);
  };

  const deleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const duplicateQuestion = (q: Question) => {
    const dup = { ...q, id: 'q-' + Date.now() + '-dup', options: q.options.map(o => ({ ...o, id: o.id + '-dup' })), matchPairs: q.matchPairs.map(m => ({ ...m, id: m.id + '-dup' })) };
    setQuestions(prev => [...prev, dup]);
  };

  const AddButton = ({ variant }: { variant: 'empty' | 'inline' }) => (
    <div style={{ position: 'relative', display: variant === 'empty' ? 'inline-flex' : 'flex', justifyContent: 'center' }}>
      <button onClick={() => setShowAddMenu(!showAddMenu)} style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: variant === 'empty' ? '10px 22px' : '12px',
        fontSize: variant === 'empty' ? 13 : 12, fontWeight: 700,
        color: variant === 'empty' ? '#fff' : '#072FB5',
        background: variant === 'empty' ? '#072FB5' : 'rgba(7,47,181,0.03)',
        border: variant === 'empty' ? 'none' : '1.5px dashed rgba(7,47,181,0.2)',
        borderRadius: variant === 'empty' ? 8 : 10,
        cursor: 'pointer', fontFamily: 'var(--font-sans)',
        width: variant === 'inline' ? '100%' : 'auto',
        justifyContent: 'center',
      }}>
        <Plus size={14} strokeWidth={2.5} /> Add Question
        <ChevronDown size={12} style={{ marginLeft: 2 }} />
      </button>
      {showAddMenu && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 50 }} onClick={() => setShowAddMenu(false)} />
          <div style={{
            position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
            marginTop: 6, width: 240, background: '#fff',
            borderRadius: 10, border: '1px solid var(--border-subtle)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)', zIndex: 51,
            overflow: 'hidden',
          }}>
            <button onClick={() => { setShowAddMenu(false); setShowTypePicker(true); }} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
              background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-sans)',
              borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.1s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.02)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              <Plus size={14} style={{ color: '#072FB5' }} />
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)' }}>New Question</div>
                <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 1 }}>Create from scratch</div>
              </div>
            </button>
            <button onClick={() => { setShowAddMenu(false); setShowQuestionBank(true); }} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
              background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-sans)',
              transition: 'background 0.1s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.02)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              <Copy size={14} style={{ color: '#0E7490' }} />
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)' }}>From Question Bank</div>
                <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 1 }}>Pick or randomize from existing</div>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header with quiz metadata */}
      <div style={{
        padding: '18px 24px',
        borderBottom: '1px solid var(--border-subtle)',
        background: '#fff',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Quiz Editor</div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>{quizTitle}</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em' }}>{questions.length}</div>
              <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Questions</div>
            </div>
            <div style={{ width: 1, height: 30, background: 'var(--border-subtle)' }} />
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em' }}>{totalPoints}</div>
              <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Points</div>
            </div>
          </div>
        </div>
        {/* Quiz config pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            { label: quizConfig.type, color: quizConfig.type === 'Graded' ? '#1B7A4A' : 'var(--text-tertiary)' },
            { label: quizConfig.timeLimit, color: 'var(--text-tertiary)' },
            { label: quizConfig.attempts, color: 'var(--text-tertiary)' },
            { label: `Opens ${quizConfig.opens}`, color: 'var(--text-tertiary)' },
            { label: `Closes ${quizConfig.closes}`, color: 'var(--text-tertiary)' },
          ].map((pill, i) => (
            <span key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '4px 10px', fontSize: 10, fontWeight: 600,
              color: pill.color, background: i === 0 ? `${pill.color}0A` : 'var(--bg-section)',
              border: `1px solid ${i === 0 ? pill.color + '20' : 'var(--border-subtle)'}`,
              borderRadius: 5, fontFamily: 'var(--font-sans)',
            }}>
              {pill.label}
            </span>
          ))}
        </div>
      </div>

      {/* Question list */}
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px' }}>
        {questions.length === 0 ? (
          <div style={{
            padding: '60px 24px', textAlign: 'center',
            border: '2px dashed var(--border-subtle)', borderRadius: 12,
          }}>
            <HelpCircle size={32} style={{ color: 'var(--text-tertiary)', opacity: 0.25, marginBottom: 12 }} />
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'var(--font-display)', marginBottom: 4 }}>No questions yet</div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 16 }}>Add your first question to get started</div>
            <AddButton variant="empty" />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {questions.map((q, idx) => {
              const typeInfo = QUESTION_TYPES.find(t => t.type === q.type)!;
              const TypeIcon = typeInfo.icon;
              return (
                <div key={q.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px', background: '#fff',
                  border: '1px solid var(--border-subtle)', borderRadius: 10,
                  transition: 'box-shadow 0.12s',
                  cursor: 'pointer',
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
                  onClick={() => setEditingQuestion({ ...q, options: q.options.map(o => ({ ...o })), matchPairs: q.matchPairs.map(m => ({ ...m })) })}
                >
                  {/* Drag handle */}
                  <GripVertical size={14} style={{ color: 'var(--text-tertiary)', opacity: 0.4, flexShrink: 0, cursor: 'grab' }} />

                  {/* Number */}
                  <div style={{
                    width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                    background: `${typeInfo.color}0A`, display: 'grid', placeItems: 'center',
                    fontSize: 12, fontWeight: 800, color: typeInfo.color, fontFamily: 'var(--font-mono)',
                  }}>
                    {idx + 1}
                  </div>

                  {/* Type icon */}
                  <TypeIcon size={14} strokeWidth={2} style={{ color: typeInfo.color, flexShrink: 0 }} />

                  {/* Question text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {q.text || 'Untitled question'}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 1 }}>{typeInfo.label}</div>
                  </div>

                  {/* Points */}
                  <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', flexShrink: 0 }}>
                    {q.points} pt{q.points !== 1 ? 's' : ''}
                  </span>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 2, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => duplicateQuestion(q)} title="Duplicate" style={{ width: 26, height: 26, borderRadius: 6, background: 'transparent', border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--text-tertiary)', opacity: 0.5 }}
                      onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; }}
                      onMouseLeave={e => { e.currentTarget.style.opacity = '0.5'; e.currentTarget.style.background = 'transparent'; }}
                    >
                      <Copy size={12} />
                    </button>
                    <button onClick={() => deleteQuestion(q.id)} title="Delete" style={{ width: 26, height: 26, borderRadius: 6, background: 'transparent', border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--text-tertiary)', opacity: 0.5 }}
                      onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = '#DC2626'; e.currentTarget.style.background = 'rgba(220,38,38,0.06)'; }}
                      onMouseLeave={e => { e.currentTarget.style.opacity = '0.5'; e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.background = 'transparent'; }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Add button at bottom */}
            <AddButton variant="inline" />
          </div>
        )}
      </div>

      {/* Modals */}
      {showTypePicker && <TypePicker onSelect={addQuestion} onClose={() => setShowTypePicker(false)} />}
      {showQuestionBank && <QuestionBankModal onAdd={addFromBank} onClose={() => setShowQuestionBank(false)} />}
      {editingQuestion && <QuestionEditorModal question={editingQuestion} onSave={saveQuestion} onClose={() => setEditingQuestion(null)} />}
    </div>
  );
}
