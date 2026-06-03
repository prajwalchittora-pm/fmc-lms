'use client';
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, ArrowRight, ChevronDown, RotateCcw, Lightbulb } from 'lucide-react';

const PAGE_CONTENT: Record<string, { lead: string; body: string[] }> = {
  'lp-1': {
    lead: 'Effective communication is the cornerstone of professional success. Before techniques and tactics, there is a foundational understanding — what communication actually is, and why most of us do it far less well than we think.',
    body: [
      'Communication is not simply the transfer of information from one person to another. It is the creation of shared meaning. Two people can hear the same words and walk away with completely different understandings — and both would be correct in their own frame of reference. The professional communicator\'s task is to bridge that gap deliberately.',
      'Research from McKinsey Global Institute found that improved communication and collaboration through social technologies could raise the productivity of interaction workers by 20–25%. Yet the same research found that most professionals overestimate their own communication effectiveness by a significant margin. The gap between perceived and actual clarity is where careers stall.',
      'This course begins with a simple premise: communication is a learnable skill, not a fixed trait. The professionals you most admire for their clarity, warmth, and persuasiveness were not born that way. They practised specific habits, often without realising it. Over the next several modules, you\'ll build those same habits with intention.',
    ],
  },
  'lp-3': {
    lead: 'The Seven Principles of Effective Communication form the foundation of every professional interaction — from casual emails to boardroom presentations. Understanding them turns instinct into repeatable craft.',
    body: [
      'Clarity is the first principle, and arguably the most important. A message is only as good as how well it is understood. Clarity demands that you know your audience before you open your mouth or put pen to paper. What do they already know? What do they need to know? What language will resonate? Every word choice is a micro-decision about clarity.',
      'Conciseness follows from clarity. The temptation to over-explain — to hedge, to qualify, to pad — is rooted in insecurity. Confident communicators make one point, make it well, and stop. The Gettysburg Address contains 271 words. The Emancipation Proclamation fewer than 700. Brevity signals respect for the listener\'s time and confidence in your own message.',
      'Completeness, coherence, correctness, courtesy, and concreteness round out the seven Cs. They exist in productive tension: completeness pulls against conciseness, courtesy against directness. Mastery is knowing which principle to prioritise in a given context — and that is where professional judgement, not rule-following, determines outcomes.',
    ],
  },
  'lp-8': {
    lead: 'Non-verbal communication accounts for the majority of meaning conveyed in face-to-face interactions. Your posture, eye contact, and gestures speak before you say a word — and often louder.',
    body: [
      'Eye contact is the most powerful non-verbal signal available to a communicator. It conveys confidence, sincerity, and engagement. In professional Western contexts, sustained eye contact of 3–5 seconds communicates presence and conviction, while frequent breaking of eye contact signals nervousness or evasion. In group settings, distribute eye contact deliberately — each person should feel individually addressed, not merely included in a sweep of the room.',
      'Posture communicates status and emotional state more reliably than most people realise. An upright, open posture — shoulders back, feet planted, hands visible — signals confidence and approachability. Slouching, crossed arms, and inward-turned feet all communicate defensiveness or disengagement regardless of what the words are saying. In video calls, where the body is largely absent, posture remains visible from the torso up and carries outsized weight.',
      'Gesture, when purposeful, amplifies verbal communication. Open-palm gestures signal transparency and openness. Pointing can feel aggressive; instead, use the full hand to direct attention. The most effective public speakers use gesture to mark the rhythm of their argument — hands open wide on broad concepts, brought together on specific points. Study recordings of yourself speaking; most people are surprised by how little, or how erratically, they gesture.',
    ],
  },
  'lp-12': {
    lead: 'The oldest communication technology — storytelling — remains the most powerful. Neuroscience now explains what storytellers have always known: a good story doesn\'t just inform, it transforms.',
    body: [
      'When we hear facts, two regions of the brain activate: Broca\'s area and Wernicke\'s area, responsible for language processing. When we hear a story, the entire brain activates — motor cortex, sensory cortex, frontal cortex. Princeton researcher Uri Hasson calls this "neural coupling": a well-told story causes the listener\'s brain activity to mirror the speaker\'s. You are not transmitting information; you are transmitting experience. This is why stories are remembered and statistics are forgotten.',
      'The Problem-Solution-Result structure is the most reliable framework for professional storytelling. Every effective business story follows some version of this arc: here was the challenge, here is what we did, here is what changed. The mistake most professionals make is leading with the solution. Start with the problem — vividly, specifically, emotionally. If the audience doesn\'t feel the weight of the problem, they won\'t value the solution.',
      'Specificity is the secret ingredient of memorable professional stories. "We improved customer satisfaction" is forgettable. "We reduced the average wait time from 11 minutes to 4 minutes, and in the following quarter, our NPS score rose from 32 to 61" is a story. Numbers anchor stories to reality; sensory details make them vivid; named individuals make them human. The more specific your story, the more universal its resonance — paradoxically, the concrete is more relatable than the abstract.',
    ],
  },
};

type RichBlock =
  | { type: 'lead'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'section-heading'; label: string; text: string }
  | { type: 'video-embed'; url: string; caption?: string }
  | { type: 'accordion'; items: { title: string; body: string }[] }
  | { type: 'flip-cards'; items: { term: string; definition: string; example: string }[] }
  | { type: 'scenario-check'; question: string; context: string; options: { text: string; correct: boolean; feedback: string }[] }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'pro-tip'; text: string };

const RICH_PAGE_CONTENT: Record<string, RichBlock[]> = {
  'lp-6': [
    { type: 'lead', text: 'Spoken excellence is not about speaking perfectly — it is about speaking with intention. In this module, you will explore the frameworks, vocabulary, and situational strategies that distinguish competent communicators from genuinely compelling ones.' },
    { type: 'video-embed', url: 'https://www.youtube.com/embed/sZdoVkm8LCs', caption: 'Section 01 — Introduction to Spoken Excellence · 8:42' },
    { type: 'section-heading', label: 'Section 02', text: 'The Three-Phase Communication Framework' },
    { type: 'paragraph', text: 'Elite communicators do not wing it. They operate from a repeatable framework that structures every interaction — from a two-minute hallway conversation to a forty-minute all-hands address. The three phases below are the backbone of that framework.' },
    { type: 'accordion', items: [
      { title: 'Phase 1 — Purposeful Preparation', body: 'Before you speak, know your objective and your audience. Ask: what is the single most important thing I need this person to understand or feel? Then engineer every word toward that outcome. Preparation is not writing a script — it is knowing your destination so well that any path can get you there. Executives who appear effortlessly articulate in high-stakes meetings have typically rehearsed the core of their message until it is below conscious thought.' },
      { title: 'Phase 2 — Articulate Delivery', body: 'Delivery is where preparation meets the moment. The four levers are pace (slow down more than feels natural), pause (silence is not dead air — it is emphasis), pitch (vary it deliberately; monotone signals disengagement), and presence (full attention on the listener, not your next sentence). The most common delivery mistake is rushing — driven by anxiety, not content. A measured pace communicates confidence more reliably than any vocabulary choice.' },
      { title: 'Phase 3 — Reflective Calibration', body: 'Every conversation is data. After high-stakes interactions, spend two minutes asking: What landed? What did not? Where did I lose them? The communicators who improve fastest are not the most talented — they are the most reflective. Record yourself weekly, even informally. The gap between how you sound in your head and how you sound to others is always larger than you expect, and always closable.' },
    ]},
    { type: 'section-heading', label: 'Section 03', text: 'Key Vocabulary — Flip to Reveal' },
    { type: 'flip-cards', items: [
      { term: 'Prosody', definition: 'The patterns of rhythm, stress, and intonation in speech. Prosody carries emotional meaning that words alone cannot.', example: '"You\'re doing great" said with rising intonation is reassuring; said with falling pitch and stress on "great," it can be sarcastic. Same words, opposite meanings.' },
      { term: 'Code-switching', definition: 'The deliberate adjustment of vocabulary, tone, formality, and register to suit different professional contexts and audiences.', example: 'How you brief a CEO on a product launch differs from how you discuss the same launch with your engineering team — not because the facts change, but because the audience and stakes differ.' },
      { term: 'Paralanguage', definition: 'All vocal elements of communication beyond the literal words: volume, pace, pitch, pause, breath, and filler sounds.', example: 'The word "fine" can signal genuine agreement, resigned acceptance, or barely-contained frustration depending entirely on paralanguage — proving that how you say something is often more important than what you say.' },
    ]},
    { type: 'section-heading', label: 'Section 04', text: 'Scenario Knowledge Check' },
    { type: 'scenario-check', context: 'Your manager has just asked you to present a project update to senior leadership — in 20 minutes. You have data, but no slides prepared.', question: 'What is your most effective first move?', options: [
      { text: 'Apologise for the lack of slides and offer to reschedule so you can prepare a proper presentation.', correct: false, feedback: 'Rescheduling signals that you cannot operate without visual aids — a significant credibility cost with senior leadership. It also misses the opportunity to demonstrate composure under pressure.' },
      { text: 'Identify your single most important message, then structure your verbal delivery around Problem → Progress → Next Step.', correct: true, feedback: 'This is the right move. Senior leaders do not need slides — they need clarity and confidence. A structured verbal update (problem, what you\'ve done, what comes next) demonstrates executive presence. Slides are a crutch; clear thinking is the actual skill.' },
      { text: 'Quickly assemble a few bullet-point slides in the time available, even if they are rough.', correct: false, feedback: 'Rushed, rough slides often create more noise than signal. They signal panic, draw attention to what\'s missing, and can derail the conversation. In most cases, no slides and clear spoken delivery outperforms hasty visual aids.' },
    ]},
    { type: 'section-heading', label: 'Reference', text: 'Academic vs. Corporate Communication' },
    { type: 'table', headers: ['Dimension', 'Academic Communication', 'Corporate Communication'], rows: [
      ['Primary audience', 'Peers, instructors, examiners', 'Managers, clients, cross-functional teams'],
      ['Goal', 'Demonstrate depth of knowledge', 'Drive decision, alignment, or action'],
      ['Register', 'Formal, analytical', 'Varies: formal to conversational depending on context'],
      ['Structure', 'Introduction → Argument → Evidence → Conclusion', 'Bottom-line up front → Evidence → Next step'],
      ['Length norm', 'More = more thorough', 'Less = more respect for time'],
      ['Hedging', 'Expected and respected', 'Reads as uncertainty; avoid in high-stakes contexts'],
      ['Passive voice', 'Common and accepted', 'Active voice strongly preferred; signals ownership'],
    ]},
    { type: 'pro-tip', text: 'The single most common mistake in professional spoken communication is not poor vocabulary or weak structure — it is speaking too fast. When we are nervous or excited, we accelerate. The audience\'s comprehension drops, and we appear less confident, not more. Train yourself to pause after every key point. The silence feels longer to you than to your listener — and it communicates mastery.' },
  ],
};

const DEFAULT_CONTENT = {
  lead: 'This reading covers foundational concepts that will build your understanding and professional communication skills.',
  body: [
    'Professional communication is a discipline built on principles that transcend any single context. Whether you are writing a brief email or delivering a keynote address, the underlying mechanisms — clarity, audience awareness, purposeful structure — remain constant.',
    'Developing these skills requires both conceptual understanding and deliberate practice. As you work through this material, consider where each principle applies in your current professional context and identify one specific area where immediate change is possible.',
    'The most effective learners treat every interaction as an opportunity for practice. The gap between knowledge and skill is closed only through application. Commit to applying what you read here within 24 hours of completing this lesson.',
  ],
};

function AccordionBlock({ items }: { items: { title: string; body: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div style={{ margin: '8px 0 24px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} style={{ borderBottom: i < items.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px', gap: 12,
                background: isOpen ? 'var(--blue-50)' : '#fff',
                border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-sans)', textAlign: 'left',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = 'var(--bg-section)'; }}
              onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = '#fff'; }}
            >
              <span style={{ fontSize: 13.5, fontWeight: 700, color: isOpen ? 'var(--blue-700)' : 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                {item.title}
              </span>
              <ChevronDown size={15} color={isOpen ? 'var(--blue-700)' : 'var(--text-tertiary)'}
                style={{ flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
              />
            </button>
            {isOpen && (
              <div style={{ padding: '0 16px 16px', background: 'var(--blue-50)', borderTop: '1px solid var(--accent-border)' }}>
                <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.75, margin: '14px 0 0', fontWeight: 500 }}>
                  {item.body}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function FlipCardsBlock({ items }: { items: { term: string; definition: string; example: string }[] }) {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  return (
    <div style={{ display: 'flex', gap: 12, margin: '8px 0 24px', flexWrap: 'wrap' }}>
      {items.map((card, i) => {
        const isFlipped = !!flipped[i];
        return (
          <div key={i} onClick={() => setFlipped(prev => ({ ...prev, [i]: !prev[i] }))}
            style={{ flex: '1 1 180px', minHeight: 160, cursor: 'pointer', position: 'relative', perspective: '800px' }}
          >
            <div style={{
              width: '100%', height: '100%', minHeight: 160,
              position: 'relative', transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              transition: 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                background: '#fff', border: '1px solid var(--accent-border)',
                borderRadius: 'var(--radius-md)',
                padding: '20px 16px',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--blue-700)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Term</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1.2 }}>{card.term}</div>
                </div>
                <div style={{ fontSize: 10.5, color: 'var(--neutral-300)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <RotateCcw size={9} /> tap to reveal
                </div>
              </div>
              <div style={{
                position: 'absolute', inset: 0,
                backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                background: 'var(--blue-700)', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--accent-border)',
                padding: '16px',
                display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto',
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{card.term}</div>
                <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.9)', lineHeight: 1.65, fontWeight: 500, margin: 0 }}>{card.definition}</p>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.12)' }} />
                <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>{card.example}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ScenarioCheckBlock({ question, context, options }: { question: string; context: string; options: { text: string; correct: boolean; feedback: string }[] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  return (
    <div style={{ margin: '8px 0 24px', background: 'var(--bg-section)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
      <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderLeft: '3px solid var(--blue-700)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--blue-700)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Scenario</div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>{context}</p>
      </div>
      <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em', margin: '0 0 14px' }}>{question}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        {options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = opt.correct;
          let borderColor = 'var(--border-subtle)';
          let bg = '#fff';
          let textColor = 'var(--text-secondary)';
          if (revealed && isSelected && isCorrect) { borderColor = 'var(--green-600)'; bg = 'var(--success-soft)'; textColor = 'var(--text-primary)'; }
          if (revealed && isSelected && !isCorrect) { borderColor = 'var(--red-500)'; bg = 'rgba(248,2,2,0.06)'; textColor = 'var(--text-primary)'; }
          if (!revealed && isSelected) { borderColor = 'var(--blue-700)'; bg = 'var(--blue-50)'; textColor = 'var(--text-primary)'; }
          return (
            <div key={i}>
              <div onClick={() => { if (!revealed) setSelected(i); }}
                style={{ padding: '11px 14px', border: `1px solid ${borderColor}`, borderRadius: 'var(--radius-sm)', background: bg, cursor: revealed ? 'default' : 'pointer', display: 'flex', alignItems: 'flex-start', gap: 10, transition: 'all 0.15s ease' }}
                onMouseEnter={e => { if (!revealed && !isSelected) { e.currentTarget.style.background = 'var(--bg-section)'; e.currentTarget.style.borderColor = 'var(--accent-border)'; } }}
                onMouseLeave={e => { if (!revealed && !isSelected) { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; } }}
              >
                <div style={{
                  width: 18, height: 18, flexShrink: 0, marginTop: 1, border: `2px solid ${(!revealed && isSelected) ? 'var(--blue-700)' : (revealed && isSelected && isCorrect) ? 'var(--green-600)' : (revealed && isSelected && !isCorrect) ? 'var(--red-500)' : 'var(--border-subtle)'}`,
                  borderRadius: '50%', display: 'grid', placeItems: 'center',
                  background: (!revealed && isSelected) ? 'var(--blue-700)' : (revealed && isSelected && isCorrect) ? 'var(--green-600)' : (revealed && isSelected && !isCorrect) ? 'var(--red-500)' : 'transparent',
                  transition: 'all 0.15s ease',
                }}>
                  {isSelected && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'white' }} />}
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: textColor, lineHeight: 1.55 }}>{opt.text}</span>
              </div>
              {revealed && isSelected && (
                <div style={{
                  padding: '10px 14px',
                  background: isCorrect ? 'var(--success-soft)' : 'rgba(248,2,2,0.06)',
                  borderLeft: `3px solid ${isCorrect ? 'var(--green-600)' : 'var(--red-500)'}`,
                  border: `1px solid ${isCorrect ? 'var(--green-600)' : 'var(--red-500)'}`,
                  borderTop: 'none', borderRadius: '0 0 var(--radius-sm) var(--radius-sm)',
                }}>
                  <div style={{ fontSize: 10.5, fontWeight: 800, color: isCorrect ? 'var(--green-600)' : 'var(--red-500)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 5 }}>
                    {isCorrect ? '✓ Correct' : '✗ Not the best choice'}
                  </div>
                  <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0, fontWeight: 500 }}>{opt.feedback}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {!revealed ? (
        <button onClick={() => { if (selected !== null) setRevealed(true); }} className="btn-primary"
          style={{ padding: '9px 18px', fontSize: 12.5, opacity: selected === null ? 0.45 : 1, cursor: selected === null ? 'default' : 'pointer' }}
          disabled={selected === null}>
          Check answer
        </button>
      ) : (
        <button onClick={() => { setSelected(null); setRevealed(false); }} className="btn-ghost"
          style={{ padding: '9px 18px', fontSize: 12.5, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <RotateCcw size={11} /> Try again
        </button>
      )}
    </div>
  );
}

function TableBlock({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div style={{ margin: '8px 0 24px', overflowX: 'auto', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-sans)' }}>
        <thead>
          <tr style={{ background: 'var(--blue-700)' }}>
            {headers.map((h, i) => (
              <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#fff', borderRight: i < headers.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none', whiteSpace: 'nowrap' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={{ background: ri % 2 === 0 ? '#fff' : 'var(--bg-section)', borderBottom: '1px solid var(--border-subtle)' }}>
              {row.map((cell, ci) => (
                <td key={ci} style={{ padding: '10px 14px', fontSize: 13, color: ci === 0 ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: ci === 0 ? 700 : 500, lineHeight: 1.5, borderRight: ci < row.length - 1 ? '1px solid var(--border-subtle)' : 'none', verticalAlign: 'top' }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProTipBlock({ text }: { text: string }) {
  return (
    <div style={{ margin: '8px 0 24px', background: 'var(--blue-50)', border: '1px solid var(--accent-border)', borderLeft: '3px solid var(--blue-700)', borderRadius: 'var(--radius-md)', padding: '16px 18px', display: 'flex', gap: 12 }}>
      <Lightbulb size={16} color="var(--blue-700)" style={{ flexShrink: 0, marginTop: 2 }} />
      <div>
        <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--blue-700)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 7 }}>Pro tip</div>
        <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0, fontWeight: 500 }}>{text}</p>
      </div>
    </div>
  );
}

function VideoEmbedBlock({ url, caption }: { url: string; caption?: string }) {
  return (
    <div style={{ margin: '8px 0 24px' }}>
      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', background: '#000', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
        <iframe src={url} title={caption ?? 'Video'} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
        />
      </div>
      {caption && <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', fontWeight: 500, marginTop: 8, letterSpacing: '-0.01em' }}>{caption}</div>}
    </div>
  );
}

function RichContent({ blocks }: { blocks: RichBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        if (block.type === 'lead') return <p key={i} style={{ fontSize: 15.5, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.7, margin: '0 0 24px' }}>{block.text}</p>;
        if (block.type === 'paragraph') return <p key={i} style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.75, margin: '0 0 20px', fontWeight: 500 }}>{block.text}</p>;
        if (block.type === 'section-heading') return (
          <div key={i} style={{ margin: '32px 0 14px' }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--blue-700)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 5 }}>{block.label}</div>
            <h2 style={{ fontSize: 19, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1.25, margin: 0, fontFamily: 'var(--font-display)' }}>{block.text}</h2>
          </div>
        );
        if (block.type === 'video-embed') return <VideoEmbedBlock key={i} url={block.url} caption={block.caption} />;
        if (block.type === 'accordion') return <AccordionBlock key={i} items={block.items} />;
        if (block.type === 'flip-cards') return <FlipCardsBlock key={i} items={block.items} />;
        if (block.type === 'scenario-check') return <ScenarioCheckBlock key={i} question={block.question} context={block.context} options={block.options} />;
        if (block.type === 'table') return <TableBlock key={i} headers={block.headers} rows={block.rows} />;
        if (block.type === 'pro-tip') return <ProTipBlock key={i} text={block.text} />;
        return null;
      })}
    </>
  );
}

type ActivityItem = { id: string; type: string; title: string; duration: string; done: boolean; current?: boolean; };
interface PageActivityProps { activity: ActivityItem; onBack: () => void; onPrev?: () => void; onNext?: () => void; hasPrev: boolean; hasNext: boolean; htmlContent?: string; }

export default function PageActivity({ activity, onBack, onPrev, onNext, hasPrev, hasNext, htmlContent }: PageActivityProps) {
  const [readProgress, setReadProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const richBlocks = RICH_PAGE_CONTENT[activity.id] ?? null;
  const plainContent = (richBlocks || htmlContent) ? null : (PAGE_CONTENT[activity.id] ?? DEFAULT_CONTENT);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const max = scrollHeight - clientHeight;
      if (max <= 0) { setReadProgress(100); return; }
      setReadProgress(Math.round((scrollTop / max) * 100));
    };
    el.addEventListener('scroll', handler, { passive: true });
    return () => el.removeEventListener('scroll', handler);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'var(--font-sans)', overflow: 'hidden' }}>

      {/* Reading area */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '32px 24px 56px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <span className="pill">Reading</span>
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{activity.duration}</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.04em', lineHeight: 1.2, margin: '0 0 20px', fontFamily: 'var(--font-display)' }}>
            {activity.title}
          </h1>
          <div style={{ height: 1, background: 'var(--border-subtle)', marginBottom: 16 }} />

          {richBlocks ? (
            <RichContent blocks={richBlocks} />
          ) : htmlContent ? (
            <div className="moodle-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />
          ) : plainContent ? (
            <>
              <p style={{ fontSize: 15.5, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.7, margin: '0 0 24px' }}>{plainContent.lead}</p>
              {plainContent.body.map((para, i) => (
                <p key={i} style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.75, margin: '0 0 20px' }}>{para}</p>
              ))}
            </>
          ) : null}

          <div style={{ height: 1, background: 'var(--border-subtle)', margin: '32px 0 24px' }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {activity.done ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: 'var(--green-600)', fontSize: 13, fontWeight: 700 }}>
                  <CheckCircle2 size={16} strokeWidth={2.5} /> Completed
                </div>
              ) : (
                <button className="btn-primary" style={{ padding: '9px 20px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 7 }}>
                  <CheckCircle2 size={14} /> Mark as complete
                </button>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {hasPrev && (
                <button onClick={onPrev} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-sans)', padding: 0, transition: 'opacity 0.12s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.75'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                >
                  <ChevronLeft size={13} /> Previous activity
                </button>
              )}
              {hasNext && (
                <button onClick={onNext} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', fontSize: 12.5, fontWeight: 600, color: 'var(--blue-700)', cursor: 'pointer', fontFamily: 'var(--font-sans)', padding: 0, transition: 'opacity 0.12s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.75'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                >
                  Next activity <ArrowRight size={13} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
