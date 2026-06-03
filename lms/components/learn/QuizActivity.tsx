'use client';
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Bookmark, CheckCircle2, XCircle, RotateCcw, ArrowRight, AlertTriangle, BookOpen, Clock3, Target, ShieldAlert } from 'lucide-react';
import { usePrototype } from '@/context/PrototypeContext';

// ─── Question Types ────────────────────────────────────────────────────────────

type McqSingle   = { type: 'mcq-single';   q: string; options: string[]; correct: number; explanation: string; };
type McqMulti    = { type: 'mcq-multi';    q: string; options: string[]; correct: number[]; explanation: string; };
type TrueFalse   = { type: 'true-false';   q: string; correct: boolean; explanation: string; };
type ShortAnswer = { type: 'short-answer'; q: string; acceptedAnswers: string[]; explanation: string; };
type Essay       = { type: 'essay';        q: string; rubric: string; };
type Matching    = { type: 'matching';     q: string; pairs: { left: string; right: string }[]; explanation: string; };
type FillBlank   = { type: 'fill-blank';   template: string; blanks: string[]; explanation: string; };
type Numerical   = { type: 'numerical';    q: string; correct: number; tolerance: number; unit?: string; explanation: string; };
type Ordering    = { type: 'ordering';     q: string; items: string[]; correct: number[]; explanation: string; };
type Question    = McqSingle | McqMulti | TrueFalse | ShortAnswer | Essay | Matching | FillBlank | Numerical | Ordering;

type Answer =
  | { type: 'mcq-single';   value: number | null }
  | { type: 'mcq-multi';    value: number[] }
  | { type: 'true-false';   value: boolean | null }
  | { type: 'short-answer'; value: string }
  | { type: 'essay';        value: string }
  | { type: 'matching';     value: (number | null)[] }
  | { type: 'fill-blank';   value: string[] }
  | { type: 'numerical';    value: string }
  | { type: 'ordering';     value: number[] };

// ─── Quiz Data ─────────────────────────────────────────────────────────────────

const QUIZ: { title: string; course: string; timeLimit: number; passMark: number; questions: Question[] } = {
  title: 'Communication Foundations',
  course: 'Professional Communication & Spoken English Excellence',
  timeLimit: 12 * 60,
  passMark: 60,
  questions: [
    { type: 'mcq-single', q: 'According to the course material, what is the primary purpose of professional communication?', options: ['The transfer of information from sender to receiver', 'The creation of shared meaning between parties', 'Demonstrating subject-matter expertise to the audience', 'Persuading others to take a specific course of action'], correct: 1, explanation: 'Communication is the creation of shared meaning — not merely information transfer. Two people can hear the same words and walk away with entirely different understandings.' },
    { type: 'mcq-multi', q: 'Which of the following are part of the Seven Cs of Communication? Select all that apply.', options: ['Clarity', 'Creativity', 'Conciseness', 'Consistency', 'Correctness', 'Courtesy'], correct: [0, 2, 4, 5], explanation: 'The Seven Cs are Clarity, Conciseness, Completeness, Correctness, Coherence, Courtesy, and Concreteness. Creativity and Consistency are not part of the framework.' },
    { type: 'true-false', q: 'According to McKinsey Global Institute research, professionals tend to overestimate their own communication effectiveness.', correct: true, explanation: 'McKinsey\'s research found that most professionals overestimate their communication effectiveness by a significant margin — the gap between perceived and actual clarity is where careers stall.' },
    { type: 'matching', q: 'Match each communication principle with its correct definition.', pairs: [{ left: 'Conciseness', right: 'Delivering the message with minimum words required' }, { left: 'Coherence', right: 'Ideas are logically connected and flow naturally' }, { left: 'Completeness', right: 'Message contains all necessary information' }, { left: 'Concreteness', right: 'Using specific facts and figures rather than vague terms' }], explanation: 'Each C serves a distinct function. Conciseness reduces noise; Coherence aids comprehension; Completeness prevents misunderstanding; Concreteness builds credibility.' },
    { type: 'fill-blank', template: 'Research by Princeton\'s Uri Hasson found that a well-told story causes [BLANK] coupling between speaker and listener, because stories activate the [BLANK] brain rather than just language-processing regions.', blanks: ['neural', 'entire'], explanation: '"Neural coupling" describes the mirroring of brain activity between a storyteller and listener. Unlike facts, stories activate the motor cortex, sensory cortex, and frontal cortex simultaneously.' },
    { type: 'ordering', q: 'Arrange the phases of the Three-Phase Communication Framework in the correct sequence.', items: ['Reflective Calibration', 'Purposeful Preparation', 'Articulate Delivery'], correct: [1, 2, 0], explanation: 'The correct sequence is: Purposeful Preparation → Articulate Delivery → Reflective Calibration. You prepare, deliver, then reflect and improve.' },
    { type: 'numerical', q: 'According to McKinsey Global Institute, by what percentage could improved communication raise the productivity of interaction workers?', correct: 22.5, tolerance: 2.5, unit: '%', explanation: 'McKinsey found a 20–25% improvement range (midpoint 22.5%). Any answer in that range is accepted.' },
    { type: 'short-answer', q: 'What term describes the deliberate adjustment of vocabulary, tone, and formality to suit different professional audiences and contexts?', acceptedAnswers: ['code-switching', 'code switching', 'codeswitching'], explanation: 'Code-switching is the deliberate adjustment of register — vocabulary, tone, formality — to suit the audience and context.' },
    { type: 'essay', q: 'Describe a professional scenario where the Problem-Solution-Result storytelling framework would be more effective than a data-only presentation. Explain why the story structure creates a stronger outcome.', rubric: 'Strong responses will: (1) identify a specific professional context, (2) explain why emotional engagement matters in the Problem phase, (3) describe how positioning the Solution after establishing stakes increases its impact, (4) explain how the Result provides resolution and credibility. Aim for 150–250 words.' },
    { type: 'mcq-single', q: 'In professional spoken communication, what does the extended exhale in the 4-4-6 breathing pattern specifically trigger?', options: ['Increased adrenaline for sharper focus', 'The sympathetic nervous system fight-or-flight response', 'The vagal response via parasympathetic activation', 'Elevated cortisol for improved working memory'], correct: 2, explanation: 'The extended exhale (6 counts) specifically triggers the vagal response — activating the parasympathetic nervous system, reducing physiological anxiety before high-stakes communication.' },
  ],
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function blankAnswer(q: Question): Answer {
  if (q.type === 'mcq-single')   return { type: 'mcq-single',   value: null };
  if (q.type === 'mcq-multi')    return { type: 'mcq-multi',    value: [] };
  if (q.type === 'true-false')   return { type: 'true-false',   value: null };
  if (q.type === 'short-answer') return { type: 'short-answer', value: '' };
  if (q.type === 'essay')        return { type: 'essay',        value: '' };
  if (q.type === 'matching')     return { type: 'matching',     value: q.pairs.map(() => null) };
  if (q.type === 'fill-blank')   return { type: 'fill-blank',   value: q.blanks.map(() => '') };
  if (q.type === 'numerical')    return { type: 'numerical',    value: '' };
  return { type: 'ordering', value: q.items.map((_, i) => i) };
}

function isAnswered(ans: Answer): boolean {
  if (ans.type === 'mcq-single')   return ans.value !== null;
  if (ans.type === 'mcq-multi')    return ans.value.length > 0;
  if (ans.type === 'true-false')   return ans.value !== null;
  if (ans.type === 'short-answer') return ans.value.trim().length > 0;
  if (ans.type === 'essay')        return ans.value.trim().length > 0;
  if (ans.type === 'matching')     return ans.value.some(v => v !== null);
  if (ans.type === 'fill-blank')   return ans.value.some(v => v.trim().length > 0);
  if (ans.type === 'numerical')    return ans.value.trim().length > 0;
  return true;
}

function isCorrectAnswer(q: Question, ans: Answer): boolean | null {
  if (q.type === 'essay') return null;
  if (q.type === 'mcq-single'   && ans.type === 'mcq-single')   return ans.value === q.correct;
  if (q.type === 'mcq-multi'    && ans.type === 'mcq-multi')    return JSON.stringify([...ans.value].sort()) === JSON.stringify([...q.correct].sort());
  if (q.type === 'true-false'   && ans.type === 'true-false')   return ans.value === q.correct;
  if (q.type === 'short-answer' && ans.type === 'short-answer') return q.acceptedAnswers.map(a => a.toLowerCase()).includes(ans.value.trim().toLowerCase());
  if (q.type === 'matching'     && ans.type === 'matching')     return ans.value.every((v, i) => v === i);
  if (q.type === 'fill-blank'   && ans.type === 'fill-blank')   return q.blanks.every((b, i) => (ans.value[i] ?? '').trim().toLowerCase() === b.toLowerCase());
  if (q.type === 'numerical'    && ans.type === 'numerical') { const n = parseFloat(ans.value); return !isNaN(n) && Math.abs(n - q.correct) <= q.tolerance; }
  if (q.type === 'ordering'     && ans.type === 'ordering')     return JSON.stringify(ans.value) === JSON.stringify(q.correct);
  return false;
}

function formatTime(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  return `${m}:${(s % 60).toString().padStart(2, '0')}`;
}

const TYPE_LABEL: Record<string, string> = {
  'mcq-single': 'Multiple choice', 'mcq-multi': 'Multiple select',
  'true-false': 'True / False', 'short-answer': 'Short answer',
  'essay': 'Essay', 'matching': 'Matching',
  'fill-blank': 'Fill in the blank', 'numerical': 'Numerical', 'ordering': 'Ordering',
};
const TYPE_DOT_COLOR: Record<string, string> = {
  'mcq-single': 'var(--blue-700)', 'mcq-multi': '#6366F1',
  'true-false': 'var(--green-600)', 'short-answer': 'var(--orange-600)',
  'essay': '#7C3AED', 'matching': '#0891B2',
  'fill-blank': 'var(--orange-600)', 'numerical': '#DC2626', 'ordering': '#92400E',
};
const LETTERS = ['A','B','C','D','E','F'];

// ─── Question Renderers ────────────────────────────────────────────────────────

function McqSingleR({ q, ans, set, locked }: { q: McqSingle; ans: Answer & {type:'mcq-single'}; set:(a:Answer)=>void; locked:boolean }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
      {q.options.map((opt,i) => {
        const sel = ans.value === i;
        return (
          <div key={i} onClick={()=>{ if(!locked) set({type:'mcq-single',value:i}); }}
            style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'13px 16px', border:`1.5px solid ${sel?'var(--blue-700)':'var(--border-subtle)'}`, borderRadius:'var(--radius-sm)', background:sel?'var(--blue-50)':'#fff', cursor:locked?'default':'pointer', transition:'all 0.12s ease' }}
            onMouseEnter={e=>{ if(!locked&&!sel) e.currentTarget.style.background='var(--bg-section)'; }}
            onMouseLeave={e=>{ if(!locked&&!sel) e.currentTarget.style.background='#fff'; }}
          >
            <div style={{ width:20, height:20, flexShrink:0, borderRadius:'50%', border:`2px solid ${sel?'var(--blue-700)':'var(--border-subtle)'}`, background:sel?'var(--blue-700)':'transparent', display:'grid', placeItems:'center', transition:'all 0.12s ease', marginTop:1 }}>
              {sel ? <div style={{ width:7, height:7, borderRadius:'50%', background:'#fff' }}/> : <span style={{ fontSize:9, fontWeight:800, color:'var(--text-tertiary)', fontFamily:'var(--font-mono)' }}>{LETTERS[i]}</span>}
            </div>
            <span style={{ fontSize:14, fontWeight:500, color:'var(--text-primary)', lineHeight:1.45 }}>{opt}</span>
          </div>
        );
      })}
    </div>
  );
}

function McqMultiR({ q, ans, set, locked }: { q: McqMulti; ans: Answer & {type:'mcq-multi'}; set:(a:Answer)=>void; locked:boolean }) {
  const toggle = (i:number) => { if(locked) return; const p=ans.value; set({type:'mcq-multi', value:p.includes(i)?p.filter(v=>v!==i):[...p,i]}); };
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
      <div style={{ fontSize:11, color:'var(--text-tertiary)', fontWeight:600, marginBottom:2 }}>Select all that apply</div>
      {q.options.map((opt,i) => {
        const sel = ans.value.includes(i);
        return (
          <div key={i} onClick={()=>toggle(i)}
            style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'13px 16px', border:`1.5px solid ${sel?'var(--blue-700)':'var(--border-subtle)'}`, borderRadius:'var(--radius-sm)', background:sel?'var(--blue-50)':'#fff', cursor:locked?'default':'pointer', transition:'all 0.12s ease' }}
            onMouseEnter={e=>{ if(!locked&&!sel) e.currentTarget.style.background='var(--bg-section)'; }}
            onMouseLeave={e=>{ if(!locked&&!sel) e.currentTarget.style.background='#fff'; }}
          >
            <div style={{ width:17, height:17, flexShrink:0, borderRadius:4, border:`2px solid ${sel?'var(--blue-700)':'var(--border-subtle)'}`, background:sel?'var(--blue-700)':'transparent', display:'grid', placeItems:'center', transition:'all 0.12s ease', marginTop:2 }}>
              {sel && <svg width="9" height="7" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6, flex:1 }}>
              <span style={{ fontSize:9, fontWeight:800, color:sel?'var(--blue-700)':'var(--text-tertiary)', fontFamily:'var(--font-mono)', flexShrink:0 }}>{LETTERS[i]}</span>
              <span style={{ fontSize:14, fontWeight:500, color:'var(--text-primary)', lineHeight:1.45 }}>{opt}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TrueFalseR({ ans, set, locked }: { q:TrueFalse; ans: Answer & {type:'true-false'}; set:(a:Answer)=>void; locked:boolean }) {
  return (
    <div style={{ display:'flex', gap:12 }}>
      {([true,false] as const).map(val => {
        const sel = ans.value === val;
        return (
          <div key={String(val)} onClick={()=>{ if(!locked) set({type:'true-false',value:val}); }}
            style={{ flex:1, padding:'24px 20px', border:`1.5px solid ${sel?'var(--blue-700)':'var(--border-subtle)'}`, borderRadius:'var(--radius-sm)', background:sel?'var(--blue-50)':'#fff', cursor:locked?'default':'pointer', textAlign:'center', transition:'all 0.12s ease' }}
            onMouseEnter={e=>{ if(!locked&&!sel) e.currentTarget.style.background='var(--bg-section)'; }}
            onMouseLeave={e=>{ if(!locked&&!sel) e.currentTarget.style.background='#fff'; }}
          >
            <div style={{ fontSize:24, fontWeight:800, color:sel?'var(--blue-700)':'var(--text-secondary)', fontFamily:'var(--font-display)', letterSpacing:'-0.02em' }}>{val?'True':'False'}</div>
          </div>
        );
      })}
    </div>
  );
}

function ShortAnswerR({ ans, set, locked }: { q:ShortAnswer; ans: Answer & {type:'short-answer'}; set:(a:Answer)=>void; locked:boolean }) {
  return <input type="text" value={ans.value} disabled={locked} placeholder="Type your answer…" onChange={e=>set({type:'short-answer',value:e.target.value})}
    style={{ width:'100%', padding:'13px 16px', fontSize:14, fontFamily:'var(--font-sans)', fontWeight:500, color:'var(--text-primary)', border:'1.5px solid var(--border-subtle)', borderRadius:'var(--radius-sm)', outline:'none', boxSizing:'border-box', background:locked?'var(--bg-section)':'#fff' }}
    onFocus={e=>{e.currentTarget.style.borderColor='var(--blue-700)';}} onBlur={e=>{e.currentTarget.style.borderColor='var(--border-subtle)';}}
  />;
}

function EssayR({ q, ans, set, locked }: { q:Essay; ans: Answer & {type:'essay'}; set:(a:Answer)=>void; locked:boolean }) {
  const wc = ans.value.trim().split(/\s+/).filter(Boolean).length;
  return (
    <div>
      <div style={{ padding:'12px 14px', background:'var(--bg-section)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-sm)', marginBottom:12 }}>
        <div style={{ fontSize:10, fontWeight:800, color:'var(--blue-700)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:4 }}>Marking rubric</div>
        <p style={{ fontSize:12.5, color:'var(--text-secondary)', lineHeight:1.65, margin:0 }}>{q.rubric}</p>
      </div>
      <textarea value={ans.value} disabled={locked} placeholder="Write your response here…" onChange={e=>set({type:'essay',value:e.target.value})} rows={7}
        style={{ width:'100%', padding:'13px 16px', fontSize:14, fontFamily:'var(--font-sans)', color:'var(--text-primary)', border:'1.5px solid var(--border-subtle)', borderRadius:'var(--radius-sm)', outline:'none', boxSizing:'border-box', resize:'vertical', lineHeight:1.7, background:locked?'var(--bg-section)':'#fff' }}
        onFocus={e=>{e.currentTarget.style.borderColor='var(--blue-700)';}} onBlur={e=>{e.currentTarget.style.borderColor='var(--border-subtle)';}}
      />
      <div style={{ fontSize:11, color:'var(--text-tertiary)', fontWeight:500, marginTop:5, textAlign:'right' }}>{wc} words</div>
    </div>
  );
}

function MatchingR({ q, ans, set, locked }: { q:Matching; ans: Answer & {type:'matching'}; set:(a:Answer)=>void; locked:boolean }) {
  const opts = [...q.pairs.map((p,i)=>({text:p.right,idx:i}))].sort((a,b)=>a.text.localeCompare(b.text));
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
        {['Item','Match'].map(h=><div key={h} style={{ fontSize:10, fontWeight:700, color:'var(--text-tertiary)', letterSpacing:'0.06em', textTransform:'uppercase', padding:'0 4px' }}>{h}</div>)}
      </div>
      {q.pairs.map((pair,i) => {
        const sel = ans.value[i];
        return (
          <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, alignItems:'center' }}>
            <div style={{ padding:'11px 14px', background:'var(--bg-section)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-sm)', fontSize:13.5, fontWeight:600, color:'var(--text-primary)', lineHeight:1.4 }}>{pair.left}</div>
            <select disabled={locked} value={sel??''} onChange={e=>{ const u=[...ans.value]; u[i]=e.target.value===''?null:parseInt(e.target.value); set({type:'matching',value:u}); }}
              style={{ padding:'11px 14px', fontSize:13, fontFamily:'var(--font-sans)', border:`1.5px solid ${sel!==null?'var(--blue-700)':'var(--border-subtle)'}`, borderRadius:'var(--radius-sm)', background:sel!==null?'var(--blue-50)':'#fff', color:'var(--text-primary)', outline:'none', cursor:locked?'default':'pointer' }}
            >
              <option value="">— Select —</option>
              {opts.map(r=><option key={r.idx} value={r.idx}>{r.text}</option>)}
            </select>
          </div>
        );
      })}
    </div>
  );
}

function FillBlankR({ q, ans, set, locked }: { q:FillBlank; ans: Answer & {type:'fill-blank'}; set:(a:Answer)=>void; locked:boolean }) {
  const parts = q.template.split('[BLANK]');
  return (
    <div style={{ fontSize:15, lineHeight:2.3, color:'var(--text-primary)', fontWeight:500 }}>
      {parts.map((part,i)=>(
        <span key={i}>{part}{i<parts.length-1&&(
          <input type="text" value={ans.value[i]??''} disabled={locked}
            onChange={e=>{ const u=[...ans.value]; u[i]=e.target.value; set({type:'fill-blank',value:u}); }}
            style={{ display:'inline-block', width:140, margin:'0 6px', padding:'3px 10px', fontSize:14, fontFamily:'var(--font-sans)', fontWeight:700, color:'var(--blue-700)', border:'none', borderBottom:'2.5px solid var(--blue-700)', background:'var(--blue-50)', borderRadius:'3px 3px 0 0', outline:'none', verticalAlign:'middle', textAlign:'center' }}
          />
        )}</span>
      ))}
    </div>
  );
}

function NumericalR({ q, ans, set, locked }: { q:Numerical; ans: Answer & {type:'numerical'}; set:(a:Answer)=>void; locked:boolean }) {
  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <input type="number" value={ans.value} disabled={locked} placeholder="Enter number…" onChange={e=>set({type:'numerical',value:e.target.value})}
          style={{ padding:'13px 18px', fontSize:20, fontFamily:'var(--font-mono)', fontWeight:800, color:'var(--text-primary)', border:'1.5px solid var(--border-subtle)', borderRadius:'var(--radius-sm)', outline:'none', width:160, background:locked?'var(--bg-section)':'#fff' }}
          onFocus={e=>{e.currentTarget.style.borderColor='var(--blue-700)';}} onBlur={e=>{e.currentTarget.style.borderColor='var(--border-subtle)';}}
        />
        {q.unit && <span style={{ fontSize:18, fontWeight:700, color:'var(--text-secondary)', fontFamily:'var(--font-mono)' }}>{q.unit}</span>}
      </div>
      <div style={{ fontSize:12, color:'var(--text-tertiary)', marginTop:8, fontWeight:500 }}>Accepted: {q.correct-q.tolerance} – {q.correct+q.tolerance}{q.unit?' '+q.unit:''}</div>
    </div>
  );
}

function OrderingR({ q, ans, set, locked }: { q:Ordering; ans: Answer & {type:'ordering'}; set:(a:Answer)=>void; locked:boolean }) {
  const move = (from:number, to:number) => { if(locked) return; const u=[...ans.value]; const [it]=u.splice(from,1); u.splice(to,0,it); set({type:'ordering',value:u}); };
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
      <div style={{ fontSize:11, color:'var(--text-tertiary)', fontWeight:600, marginBottom:2 }}>Use the arrows to reorder</div>
      {ans.value.map((idx,pos)=>(
        <div key={idx} style={{ display:'flex', alignItems:'center', gap:10, padding:'13px 16px', background:'#fff', border:'1.5px solid var(--border-subtle)', borderRadius:'var(--radius-sm)' }}>
          <span style={{ fontSize:12, fontWeight:800, color:'var(--text-tertiary)', fontFamily:'var(--font-mono)', minWidth:20 }}>{pos+1}.</span>
          <span style={{ flex:1, fontSize:14, fontWeight:500, color:'var(--text-primary)', lineHeight:1.4 }}>{q.items[idx]}</span>
          {!locked && (
            <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
              <button onClick={()=>move(pos,pos-1)} disabled={pos===0} style={{ width:22, height:22, display:'grid', placeItems:'center', background:'var(--bg-section)', border:'1px solid var(--border-subtle)', borderRadius:3, cursor:pos===0?'default':'pointer', opacity:pos===0?0.3:1 }}><ChevronLeft size={11} style={{transform:'rotate(90deg)'}}/></button>
              <button onClick={()=>move(pos,pos+1)} disabled={pos===ans.value.length-1} style={{ width:22, height:22, display:'grid', placeItems:'center', background:'var(--bg-section)', border:'1px solid var(--border-subtle)', borderRadius:3, cursor:pos===ans.value.length-1?'default':'pointer', opacity:pos===ans.value.length-1?0.3:1 }}><ChevronLeft size={11} style={{transform:'rotate(-90deg)'}}/></button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function QuestionRenderer({ q, ans, set, locked }: { q:Question; ans:Answer; set:(a:Answer)=>void; locked:boolean }) {
  if (q.type==='mcq-single'   && ans.type==='mcq-single')   return <McqSingleR   q={q} ans={ans} set={set} locked={locked}/>;
  if (q.type==='mcq-multi'    && ans.type==='mcq-multi')    return <McqMultiR    q={q} ans={ans} set={set} locked={locked}/>;
  if (q.type==='true-false'   && ans.type==='true-false')   return <TrueFalseR   q={q} ans={ans} set={set} locked={locked}/>;
  if (q.type==='short-answer' && ans.type==='short-answer') return <ShortAnswerR q={q} ans={ans} set={set} locked={locked}/>;
  if (q.type==='essay'        && ans.type==='essay')        return <EssayR       q={q} ans={ans} set={set} locked={locked}/>;
  if (q.type==='matching'     && ans.type==='matching')     return <MatchingR    q={q} ans={ans} set={set} locked={locked}/>;
  if (q.type==='fill-blank'   && ans.type==='fill-blank')   return <FillBlankR   q={q} ans={ans} set={set} locked={locked}/>;
  if (q.type==='numerical'    && ans.type==='numerical')    return <NumericalR   q={q} ans={ans} set={set} locked={locked}/>;
  if (q.type==='ordering'     && ans.type==='ordering')     return <OrderingR    q={q} ans={ans} set={set} locked={locked}/>;
  return null;
}

function ReviewFeedback({ q, ans }: { q:Question; ans:Answer }) {
  const result = isCorrectAnswer(q, ans);
  if (q.type==='essay') return (
    <div style={{ display:'flex', gap:12, alignItems:'flex-start', padding:'14px 16px', background:'var(--bg-section)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)', marginTop:20 }}>
      <div style={{ width:28, height:28, borderRadius:'50%', background:'#fff', border:'1px solid var(--border-subtle)', display:'grid', placeItems:'center', flexShrink:0 }}>
        <span style={{ fontSize:13 }}>✍️</span>
      </div>
      <div>
        <div style={{ fontSize:10, fontWeight:800, color:'var(--text-tertiary)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:4 }}>Awaiting manual review</div>
        <p style={{ fontSize:13, color:'var(--text-secondary)', margin:0, lineHeight:1.65, fontWeight:500 }}>{q.rubric}</p>
      </div>
    </div>
  );
  const expl = (q as any).explanation as string;
  const isCorrect = result === true;
  return (
    <div style={{ display:'flex', gap:12, alignItems:'flex-start', padding:'16px', background:isCorrect?'#F0FDF4':'#FFF1F2', border:`1px solid ${isCorrect?'#BBF7D0':'#FECDD3'}`, borderRadius:'var(--radius-md)', marginTop:20 }}>
      <div style={{ width:28, height:28, borderRadius:'50%', background:isCorrect?'#16A34A':'#DC2626', display:'grid', placeItems:'center', flexShrink:0 }}>
        {isCorrect ? <CheckCircle2 size={14} color='#fff'/> : <XCircle size={14} color='#fff'/>}
      </div>
      <div>
        <div style={{ fontSize:10, fontWeight:800, color:isCorrect?'#15803D':'#B91C1C', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:6 }}>{isCorrect?'Correct':'Incorrect'}</div>
        <p style={{ fontSize:13, color:isCorrect?'#166534':'#991B1B', lineHeight:1.65, margin:0, fontWeight:500 }}>{expl}</p>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

type ActivityItem = { id:string; type:string; title:string; duration:string; done:boolean; current?:boolean; };
interface QuizActivityProps { activity:ActivityItem; onBack:()=>void; onPrev?:()=>void; onNext?:()=>void; hasPrev:boolean; hasNext:boolean; onQuizStart?:()=>void; onQuizEnd?:()=>void; }
type Phase = 'preflight' | 'taking' | 'submitted';

export default function QuizActivity({ onBack, onNext, hasNext, onQuizStart, onQuizEnd }: QuizActivityProps) {
  const { setFocusMode } = usePrototype();
  const questions = QUIZ.questions;
  const n = questions.length;

  const [phase, setPhase]   = useState<Phase>('preflight');
  const [cur,   setCur]     = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(()=>questions.map(blankAnswer));
  const [flagged, setFlagged] = useState<boolean[]>(()=>new Array(n).fill(false));
  const [timeLeft, setTime]   = useState(QUIZ.timeLimit);
  const [showLeaveWarning, setShowLeaveWarning] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [reviewQ, setReviewQ] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>|null>(null);
  const questionListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (phase === 'taking') { onQuizStart?.(); setFocusMode(true); }
    else if (phase === 'preflight') { onQuizEnd?.(); setFocusMode(false); }
    else if (phase === 'submitted') { setFocusMode(false); }
  }, [phase]);

  useEffect(() => {
    if (phase !== 'taking') return;
    timerRef.current = setInterval(() => {
      setTime(t => { if (t<=1) { clearInterval(timerRef.current!); setPhase('submitted'); return 0; } return t-1; });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [phase]);

  // Intercept browser back button during quiz
  useEffect(() => {
    if (phase !== 'taking') return;
    window.history.pushState(null, '', window.location.href);
    const onPop = () => {
      window.history.pushState(null, '', window.location.href);
      setShowLeaveWarning(true);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [phase]);

  const setAnswer = (i:number, a:Answer) => { const u=[...answers]; u[i]=a; setAnswers(u); };
  const toggleFlag = (i:number) => { const u=[...flagged]; u[i]=!u[i]; setFlagged(u); };

  const doSubmit = () => { clearInterval(timerRef.current!); setPhase('submitted'); setShowSubmitConfirm(false); setShowLeaveWarning(false); setReviewQ(0); };
  const doLeave  = () => { doSubmit(); };
  const doRetry  = () => { setPhase('preflight'); setFocusMode(false); setAnswers(questions.map(blankAnswer)); setFlagged(new Array(n).fill(false)); setTime(QUIZ.timeLimit); setCur(0); };

  const attempted  = answers.filter(isAnswered).length;
  const flagCount  = flagged.filter(Boolean).length;
  const warn       = timeLeft < 120;
  const urgent     = timeLeft < 60;
  const timerColor = urgent ? '#DC2626' : warn ? '#D97706' : 'var(--text-primary)';

  const results   = questions.map((q,i)=>isCorrectAnswer(q,answers[i]));
  const gradable  = questions.filter(q=>q.type!=='essay').length;
  const correct   = results.filter(r=>r===true).length;
  const scorePct  = gradable>0 ? Math.round((correct/gradable)*100) : 0;
  const passed    = scorePct >= QUIZ.passMark;

  // ── Phase 1: Pre-flight ─────────────────────────────────────────────────────
  if (phase === 'preflight') {
    return (
      <div style={{ height:'100%', background:'linear-gradient(135deg, #EEF4FF 0%, #FFF9EB 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-sans)', padding:40, boxSizing:'border-box', position:'relative' }}>
        <div style={{ maxWidth:500, width:'100%', background:'#fff', borderRadius:'var(--radius-md)', boxShadow:'0 4px 24px rgba(15,15,15,0.10)', padding:'40px 40px 36px' }}>
          {/* Badge */}
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:22 }}>
            <div style={{ width:38, height:38, borderRadius:'var(--radius-sm)', background:'var(--blue-50)', border:'1px solid rgba(7,47,181,0.15)', display:'grid', placeItems:'center', flexShrink:0 }}>
              <BookOpen size={17} color='var(--blue-700)'/>
            </div>
            <span style={{ fontSize:11, fontWeight:700, color:'var(--text-tertiary)', letterSpacing:'0.1em', textTransform:'uppercase' }}>Timed Assessment</span>
          </div>

          {/* Title */}
          <h1 style={{ fontSize:28, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.03em', lineHeight:1.2, margin:'0 0 6px', fontFamily:'var(--font-display)' }}>{QUIZ.title}</h1>
          <p style={{ fontSize:13, color:'var(--text-secondary)', margin:'0 0 28px', fontWeight:500, lineHeight:1.5 }}>{QUIZ.course}</p>

          {/* Stats row */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:28 }}>
            {[
              { icon:<BookOpen size={14} color='var(--blue-700)'/>, label:'Questions', value:`${n}` },
              { icon:<Clock3 size={14} color='var(--blue-700)'/>, label:'Time limit', value:formatTime(QUIZ.timeLimit) },
              { icon:<Target size={14} color='var(--blue-700)'/>, label:'Pass mark', value:`${QUIZ.passMark}%` },
            ].map(({icon,label,value})=>(
              <div key={label} style={{ padding:'14px 14px 12px', background:'var(--bg-section)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-sm)', textAlign:'center' }}>
                <div style={{ display:'flex', justifyContent:'center', marginBottom:8 }}>{icon}</div>
                <div style={{ fontSize:20, fontWeight:800, color:'var(--text-primary)', fontFamily:'var(--font-mono)', letterSpacing:'-0.03em', lineHeight:1 }}>{value}</div>
                <div style={{ fontSize:11, color:'var(--text-tertiary)', fontWeight:600, marginTop:4 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Rules */}
          <div style={{ padding:'16px 18px', background:'var(--bg-section)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-sm)', marginBottom:24 }}>
            <div style={{ fontSize:10, fontWeight:800, color:'var(--text-tertiary)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:12 }}>Before you begin</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {[
                'Timer starts as soon as you click Start Quiz and cannot be paused',
                'Navigating away will trigger auto-submission of your current answers',
                'You can flag questions to revisit before submitting',
                'Essay questions are graded manually and do not count toward your automated score',
              ].map((rule,i)=>(
                <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                  <div style={{ width:18, height:18, borderRadius:'50%', background:'var(--blue-50)', border:'1px solid rgba(7,47,181,0.2)', display:'grid', placeItems:'center', flexShrink:0, marginTop:1 }}>
                    <span style={{ fontSize:9, fontWeight:800, color:'var(--blue-700)', fontFamily:'var(--font-mono)' }}>{i+1}</span>
                  </div>
                  <span style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.55, fontWeight:500 }}>{rule}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button onClick={()=>setPhase('taking')} className="btn-primary" style={{ width:'100%', padding:'14px 0', fontSize:15, fontWeight:700, fontFamily:'var(--font-sans)', display:'flex', alignItems:'center', justifyContent:'center', gap:8, borderRadius:'var(--radius-sm)', cursor:'pointer', letterSpacing:'-0.01em', border:'none', background:'var(--blue-700)', color:'#fff', transition:'opacity 0.15s ease' }}
            onMouseEnter={e=>{e.currentTarget.style.opacity='0.88';}} onMouseLeave={e=>{e.currentTarget.style.opacity='1';}}
          >
            Start Quiz <ArrowRight size={16}/>
          </button>
        </div>
      </div>
    );
  }

  // ── Phase 3: Results ────────────────────────────────────────────────────────
  if (phase === 'submitted') {
    const rq = questions[reviewQ];
    const ra = answers[reviewQ];
    const rResult = results[reviewQ];
    return (
      <div style={{ height:'100%', display:'flex', overflow:'hidden', fontFamily:'var(--font-sans)', position:'relative', background:'var(--bg-section)', gap:16, padding:'20px 20px 32px', boxSizing:'border-box' }}>

        {/* LEFT PANEL — Score + Navigator */}
        <div style={{ width:280, flexShrink:0, display:'flex', flexDirection:'column', background:'#fff', overflow:'hidden', borderRadius:'var(--radius-md)', border:'1px solid var(--border-subtle)', boxShadow:'0 2px 12px rgba(15,15,15,0.06)' }}>

          {/* Score header */}
          <div style={{ padding:'24px 20px 20px', flexShrink:0, background: passed ? 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)' : 'linear-gradient(135deg, #FFF1F2 0%, #FEF2F2 100%)' }}>
            <div style={{ display:'flex', alignItems:'baseline', gap:6, marginBottom:6 }}>
              <span style={{ fontSize:42, fontWeight:800, fontFamily:'var(--font-mono)', letterSpacing:'-0.04em', color:passed?'#16A34A':'#DC2626', lineHeight:1 }}>{scorePct}</span>
              <span style={{ fontSize:18, fontWeight:700, color:passed?'#16A34A':'#DC2626', opacity:0.6 }}>%</span>
            </div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:'var(--radius-sm)', background:passed?'rgba(22,163,74,0.12)':'rgba(220,38,38,0.10)' }}>
              {passed ? <CheckCircle2 size={12} fill='#16A34A' color='#fff'/> : <XCircle size={12} fill='#DC2626' color='#fff'/>}
              <span style={{ fontSize:11, fontWeight:700, color:passed?'#16A34A':'#DC2626' }}>{passed?'Passed':'Not passed'} · {QUIZ.passMark}% required</span>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:6, padding:'16px 20px' }}>
            {[
              { label:'Correct', value:correct, bg:'#F0FDF4', color:'#16A34A' },
              { label:'Wrong', value:gradable-correct, bg:'#FFF1F2', color:'#DC2626' },
              { label:'Essay', value:n-gradable, bg:'var(--bg-section)', color:'var(--text-tertiary)' },
            ].map(({label,value,bg,color})=>(
              <div key={label} style={{ textAlign:'center', padding:'10px 4px', background:bg, borderRadius:'var(--radius-sm)' }}>
                <div style={{ fontSize:18, fontWeight:800, fontFamily:'var(--font-mono)', color, lineHeight:1 }}>{value}</div>
                <div style={{ fontSize:9, fontWeight:700, color, opacity:0.7, letterSpacing:'0.06em', textTransform:'uppercase', marginTop:4 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ padding:'0 20px 16px', display:'flex', flexDirection:'column', gap:8, flexShrink:0 }}>
            <button onClick={doRetry} style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'10px 0', fontSize:12, fontWeight:600, fontFamily:'var(--font-sans)', background:'var(--bg-section)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-sm)', cursor:'pointer', color:'var(--text-secondary)', transition:'all 0.12s ease', width:'100%' }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--blue-700)'; e.currentTarget.style.color='var(--blue-700)';}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border-subtle)'; e.currentTarget.style.color='var(--text-secondary)';}}
            >
              <RotateCcw size={12}/> Retry quiz
            </button>
            <button onClick={()=>{setFocusMode(false);onBack();}} style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'10px 0', fontSize:13, fontWeight:700, fontFamily:'var(--font-sans)', background:'var(--blue-700)', border:'none', borderRadius:'var(--radius-sm)', cursor:'pointer', color:'#fff', width:'100%' }}>
              Finish Review <ArrowRight size={13}/>
            </button>
          </div>

          {/* Question navigator */}
          <div style={{ padding:'12px 20px 10px', borderTop:'1px solid var(--border-subtle)', flexShrink:0 }}>
            <div style={{ fontSize:10, fontWeight:700, color:'var(--text-tertiary)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:8 }}>Review Answers</div>
          </div>

          <div style={{ flex:1, overflowY:'auto', padding:'0 20px 16px', scrollbarWidth:'none' } as React.CSSProperties}>
            <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
              {questions.map((_,i)=>{
                const r=results[i]; const isCur=i===reviewQ;
                const isCorrect = r === true; const isWrong = r === false;
                return (
                  <button key={i} onClick={()=>setReviewQ(i)}
                    style={{
                      display:'flex', alignItems:'center', gap:10, width:'100%',
                      padding:'8px 10px',
                      background: isCur ? 'var(--bg-section)' : 'transparent',
                      border:'none', borderLeft: isCur ? '2px solid var(--blue-700)' : '2px solid transparent',
                      borderRadius:0,
                      cursor:'pointer',
                      textAlign:'left',
                      transition:'background 0.1s ease',
                    }}
                    onMouseEnter={e=>{ if(!isCur) e.currentTarget.style.background='var(--bg-section)'; }}
                    onMouseLeave={e=>{ if(!isCur) e.currentTarget.style.background='transparent'; }}
                  >
                    <span style={{ fontSize:11, fontWeight:700, color:'var(--text-tertiary)', fontFamily:'var(--font-mono)', minWidth:20 }}>{i+1}</span>
                    {isCorrect && <CheckCircle2 size={14} fill='#16A34A' color='#fff'/>}
                    {isWrong && <XCircle size={14} fill='#DC2626' color='#fff'/>}
                    {r === null && <span style={{ width:14, height:14, borderRadius:3, background:'var(--bg-section)', border:'1.5px solid var(--border-subtle)', display:'inline-block', flexShrink:0 }}/>}
                    <span style={{ fontSize:12, fontWeight: isCur ? 600 : 500, color: isCur ? 'var(--text-primary)' : 'var(--text-secondary)', flex:1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                      {'q' in questions[i] ? (questions[i] as any).q.slice(0,40) + '…' : TYPE_LABEL[questions[i].type]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT — Question review */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', position:'relative', borderRadius:'var(--radius-md)', border:'1px solid var(--border-subtle)', boxShadow:'0 2px 12px rgba(15,15,15,0.06)' }}>

          {/* Top bar */}
          <div style={{ display:'flex', alignItems:'center', padding:'10px 20px', background:'#fff', borderBottom:'1px solid var(--border-subtle)', flexShrink:0, borderRadius:'var(--radius-md) var(--radius-md) 0 0' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:15, fontWeight:800, color:'var(--text-primary)', fontFamily:'var(--font-mono)' }}>Q{reviewQ+1}</span>
              <span style={{ fontSize:12, color:'var(--text-tertiary)', fontFamily:'var(--font-mono)' }}>of {n}</span>
            </div>
            <div style={{ flex:1 }}/>
            <div style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 10px', borderRadius:'var(--radius-sm)', background: rResult===true?'#F0FDF4':rResult===false?'#FFF1F2':'var(--bg-section)' }}>
              {rResult === true && <><CheckCircle2 size={13} fill='#16A34A' color='#fff'/><span style={{ fontSize:11, fontWeight:700, color:'#16A34A' }}>Correct</span></>}
              {rResult === false && <><XCircle size={13} fill='#DC2626' color='#fff'/><span style={{ fontSize:11, fontWeight:700, color:'#DC2626' }}>Incorrect</span></>}
              {rResult === null && <span style={{ fontSize:11, fontWeight:600, color:'var(--text-tertiary)' }}>Awaiting review</span>}
            </div>
          </div>

          {/* Question content */}
          <div tabIndex={0} style={{ flex:1, overflowY:'auto', padding:'28px 32px 80px', background:'var(--bg-section)', scrollbarWidth:'none', outline:'none' } as React.CSSProperties}>
            <div style={{ background:'#fff', borderRadius:'var(--radius-md)', padding:'32px 36px', boxShadow:'0 1px 3px rgba(15,15,15,0.04)', border:'1px solid var(--border-subtle)' }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 8px', background:'var(--bg-section)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-sm)', marginBottom:14 }}>
                <div style={{ width:5, height:5, borderRadius:'50%', background:TYPE_DOT_COLOR[rq.type]||'var(--text-tertiary)' }}/>
                <span style={{ fontSize:10, fontWeight:600, color:'var(--text-tertiary)' }}>{TYPE_LABEL[rq.type]}</span>
              </div>
              <p style={{ fontSize:20, fontWeight:700, color:'var(--text-primary)', letterSpacing:'-0.02em', lineHeight:1.5, margin:'0 0 28px', fontFamily:'var(--font-display)' }}>
                {'q' in rq ? rq.q : 'Fill in the blanks in the passage below.'}
              </p>
              <QuestionRenderer q={rq} ans={ra} set={()=>{}} locked={true}/>
              <ReviewFeedback q={rq} ans={ra}/>
            </div>
          </div>

          {/* Bottom nav */}
          <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'#fff', borderTop:'1px solid var(--border-subtle)', borderRadius:'0 0 var(--radius-md) var(--radius-md)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 24px', zIndex:10 }}>
            <button onClick={()=>setReviewQ(i=>Math.max(0,i-1))} disabled={reviewQ===0}
              style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'8px 14px', fontSize:12, fontWeight:600, fontFamily:'var(--font-sans)', background:'transparent', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-sm)', cursor:reviewQ===0?'default':'pointer', opacity:reviewQ===0?0.3:1, color:'var(--text-secondary)' }}
            >
              <ChevronLeft size={13}/> Prev
            </button>
            <span style={{ fontSize:11, fontWeight:600, color:'var(--text-tertiary)', fontFamily:'var(--font-mono)' }}>{reviewQ+1} of {n}</span>
            <button onClick={()=>setReviewQ(i=>Math.min(n-1,i+1))} disabled={reviewQ===n-1}
              style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'8px 18px', fontSize:13, fontWeight:700, fontFamily:'var(--font-sans)', background:reviewQ===n-1?'transparent':'var(--blue-700)', border:reviewQ===n-1?'1px solid var(--border-subtle)':'none', borderRadius:'var(--radius-sm)', cursor:reviewQ===n-1?'default':'pointer', opacity:reviewQ===n-1?0.3:1, color:reviewQ===n-1?'var(--text-secondary)':'#fff' }}
            >
              Next <ChevronRight size={13}/>
            </button>
          </div>
        </div>

</div>
    );
  }

  // ── Phase 2: Taking ─────────────────────────────────────────────────────────
  const q = questions[cur];
  const ans = answers[cur];

  return (
    <div style={{ height:'100%', display:'flex', overflow:'hidden', fontFamily:'var(--font-sans)', position:'relative', background:'var(--bg-section)', gap:16, padding:'20px 20px 32px', boxSizing:'border-box' }}>

      {/* ── LEFT CONTENT ── */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', position:'relative', borderRadius:'var(--radius-md)', border:'1px solid var(--border-subtle)', boxShadow:'0 2px 12px rgba(15,15,15,0.06)' }}>

        {/* Top bar with Leave */}
        <div style={{ display:'flex', alignItems:'center', padding:'8px 16px', background:'#fff', borderBottom:'1px solid var(--border-subtle)', flexShrink:0, borderRadius:'var(--radius-md) var(--radius-md) 0 0' }}>
          <button onClick={()=>setShowLeaveWarning(true)}
            style={{ display:'inline-flex', alignItems:'center', gap:4, background:'rgba(220,38,38,0.06)', border:'1px solid rgba(220,38,38,0.15)', borderRadius:'var(--radius-sm)', fontSize:11.5, fontWeight:600, color:'#DC2626', cursor:'pointer', fontFamily:'var(--font-sans)', padding:'5px 12px 5px 8px', transition:'background 0.12s ease' }}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(220,38,38,0.12)';}} onMouseLeave={e=>{e.currentTarget.style.background='rgba(220,38,38,0.06)';}}
          >
            <ChevronLeft size={13}/> Leave quiz
          </button>
          <div style={{ flex:1 }}/>
          <span style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)', fontFamily:'var(--font-display)', letterSpacing:'-0.02em' }}>{QUIZ.title}</span>
        </div>

        {/* Question — bg-section scroll area, card container */}
        <div style={{ flex:1, overflowY:'auto', padding:'28px 32px 80px', background:'var(--bg-section)' }}>
          <div style={{ background:'#fff', borderRadius:'var(--radius-md)', padding:'32px 36px', boxShadow:'0 1px 3px rgba(15,15,15,0.06), 0 4px 16px rgba(15,15,15,0.05)', border:'1px solid var(--border-subtle)' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:18, fontWeight:800, color:'var(--text-primary)', fontFamily:'var(--font-mono)', letterSpacing:'-0.02em' }}>Q{cur+1}</span>
                <span style={{ fontSize:12, color:'var(--text-tertiary)', fontFamily:'var(--font-mono)' }}>of {n}</span>
              </div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 8px', background:'var(--bg-section)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-sm)' }}>
                <div style={{ width:5, height:5, borderRadius:'50%', background:TYPE_DOT_COLOR[q.type]||'var(--text-tertiary)' }}/>
                <span style={{ fontSize:10, fontWeight:600, color:'var(--text-tertiary)', letterSpacing:'0.02em' }}>{TYPE_LABEL[q.type]}</span>
              </div>
            </div>
            <p style={{ fontSize:20, fontWeight:700, color:'var(--text-primary)', letterSpacing:'-0.02em', lineHeight:1.5, margin:'0 0 28px', fontFamily:'var(--font-display)' }}>
              {'q' in q ? q.q : 'Fill in the blanks in the passage below.'}
            </p>
            <QuestionRenderer q={q} ans={ans} set={(a)=>setAnswer(cur,a)} locked={false}/>
          </div>
        </div>

        {/* Bottom nav bar */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'#fff', borderTop:'1px solid var(--border-subtle)', borderRadius:'0 0 var(--radius-md) var(--radius-md)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 24px', zIndex:10 }}>
          <button onClick={()=>setCur(i=>Math.max(0,i-1))} disabled={cur===0}
            style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'8px 14px', fontSize:12, fontWeight:600, fontFamily:'var(--font-sans)', background:'transparent', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-sm)', cursor:cur===0?'default':'pointer', opacity:cur===0?0.3:1, color:'var(--text-secondary)' }}
          >
            <ChevronLeft size={13}/> Prev
          </button>

          <button onClick={()=>toggleFlag(cur)}
            style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'8px 14px', fontSize:12, fontWeight:600, fontFamily:'var(--font-sans)', background:flagged[cur]?'#EEF2FF':'transparent', border:`1px solid ${flagged[cur]?'#6366F1':'var(--border-subtle)'}`, borderRadius:'var(--radius-sm)', cursor:'pointer', color:flagged[cur]?'#4338CA':'var(--text-tertiary)', transition:'all 0.12s ease' }}
          >
            <Bookmark size={12} fill={flagged[cur]?'#4338CA':'none'}/> {flagged[cur]?'Bookmarked':'Bookmark'}
          </button>

          <button onClick={cur===n-1 ? ()=>setShowSubmitConfirm(true) : ()=>{setAnswer(cur,ans);setCur(i=>i+1);}}
            style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'8px 18px', fontSize:13, fontWeight:700, fontFamily:'var(--font-sans)', background:'var(--blue-700)', border:'none', borderRadius:'var(--radius-sm)', cursor:'pointer', color:'#fff', transition:'opacity 0.1s ease' }}
            onMouseEnter={e=>{ e.currentTarget.style.opacity='0.85'; }} onMouseLeave={e=>{ e.currentTarget.style.opacity='1'; }}
          >
            {cur===n-1 ? <>Submit <ArrowRight size={13}/></> : <>Save & Next <ChevronRight size={13}/></>}
          </button>
        </div>
      </div>

      {/* ── RIGHT PANEL — floating navigator ── */}
      <div style={{ width:260, flexShrink:0, display:'flex', flexDirection:'column', background:'#fff', overflow:'hidden', borderRadius:'var(--radius-md)', border:'1px solid var(--border-subtle)', boxShadow:'0 2px 12px rgba(15,15,15,0.08)' }}>

        {/* Timer */}
        <div style={{ padding:'20px 16px 16px', flexShrink:0 }}>
          <div style={{ fontSize:10, fontWeight:700, color:'var(--text-tertiary)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:10, display:'flex', alignItems:'center', gap:5 }}>
            {urgent ? <AlertTriangle size={11} color='#DC2626'/> : <Clock3 size={11} color='var(--text-tertiary)'/>}
            Time remaining
          </div>
          <div style={{ fontSize:34, fontWeight:800, fontFamily:'var(--font-mono)', letterSpacing:'0.02em', color:timerColor, lineHeight:1, marginBottom:10, transition:'color 0.3s ease' }}>{formatTime(timeLeft)}</div>
          <div style={{ height:3, background:'var(--border-subtle)', borderRadius:2, overflow:'hidden' }}>
            <div style={{ height:'100%', background:timerColor, width:`${(timeLeft/QUIZ.timeLimit)*100}%`, transition:'width 1s linear, background 0.3s ease', borderRadius:2 }}/>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:6, marginTop:14 }}>
            {[
              { label:'Done', value:attempted, bg:'#F0FDF4', color:'#16A34A' },
              { label:'Left', value:n-attempted, bg:'#FFFBEB', color:'#D97706' },
              { label:'Saved', value:flagCount, bg:'#EEF2FF', color:'#4338CA' },
            ].map(({label,value,bg,color})=>(
              <div key={label} style={{ textAlign:'center', padding:'10px 4px', background:bg, borderRadius:'var(--radius-sm)' }}>
                <div style={{ fontSize:18, fontWeight:800, fontFamily:'var(--font-mono)', color, lineHeight:1 }}>{value}</div>
                <div style={{ fontSize:9, fontWeight:700, color, opacity:0.7, letterSpacing:'0.06em', textTransform:'uppercase', marginTop:4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit — primary CTA, top of panel after stats */}
        <div style={{ padding:'0 16px 16px', flexShrink:0 }}>
          <button onClick={()=>setShowSubmitConfirm(true)}
            style={{ width:'100%', padding:'10px 0', fontSize:13, fontWeight:700, fontFamily:'var(--font-sans)', background:'var(--blue-700)', border:'none', borderRadius:'var(--radius-sm)', cursor:'pointer', color:'#fff', transition:'opacity 0.12s ease', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}
            onMouseEnter={e=>{e.currentTarget.style.opacity='0.88';}} onMouseLeave={e=>{e.currentTarget.style.opacity='1';}}
          >
            Submit Quiz <ArrowRight size={13}/>
          </button>
        </div>

        {/* Questions label + pinned legend */}
        <div style={{ padding:'14px 16px 12px', borderBottom:'1px solid var(--border-subtle)', flexShrink:0 }}>
          <div style={{ fontSize:11, fontWeight:700, color:'var(--text-tertiary)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:10 }}>Questions</div>
          <div style={{ display:'flex', flexDirection:'row', gap:10, flexWrap:'wrap' }}>
            {[
              { icon:<CheckCircle2 size={16} fill='#16A34A' color='#fff'/>, label:'Answered' },
              { icon:<span style={{width:16,height:16,borderRadius:4,background:'var(--bg-section)',border:'1.5px solid var(--border-subtle)',display:'inline-block',flexShrink:0}}/>, label:'Empty' },
              { icon:<Bookmark size={16} color='#4338CA' fill='#4338CA'/>, label:'Saved' },
            ].map(({icon,label})=>(
              <div key={label} style={{ display:'flex', alignItems:'center', gap:7 }}>
                {icon}
                <span style={{ fontSize:12, color:'var(--text-secondary)', fontWeight:500 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable grid */}
        <div ref={questionListRef} style={{ flex:1, overflowY:'auto', padding:'12px 16px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:6 }}>
            {questions.map((_,i)=>{
              const done = isAnswered(answers[i]);
              const isCur = i === cur;
              const fl = flagged[i];
              let bg='var(--bg-section)', border='var(--border-subtle)', iconEl=<span style={{fontSize:11,fontWeight:700,color:'var(--text-tertiary)',fontFamily:'var(--font-mono)'}}>{i+1}</span>;
              if (fl)   { bg='#EEF2FF'; border='#6366F1'; iconEl=<Bookmark size={28} fill='#4338CA' color='#4338CA'/>; }
              if (done) { bg='#fff'; border='#16A34A'; iconEl=<CheckCircle2 size={28} fill='#16A34A' color='#fff'/>; }
              return (
                <button key={i} onClick={()=>setCur(i)}
                  style={{ aspectRatio:'1', borderRadius:'var(--radius-sm)', border:`1.5px solid ${border}`, cursor:'pointer', display:'grid', placeItems:'center', background:bg, transition:'all 0.1s ease', width:'100%' }}>
                  {iconEl}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Leave warning modal ── */}
      {showLeaveWarning && (
        <>
          <div style={{ position:'absolute', inset:0, background:'rgba(15,15,15,0.35)', zIndex:50 }} onClick={()=>setShowLeaveWarning(false)}/>
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', zIndex:60, width:380, background:'#fff', borderRadius:'var(--radius-md)', border:'1px solid var(--border-subtle)', boxShadow:'0 8px 40px rgba(15,15,15,0.18)', padding:'28px', fontFamily:'var(--font-sans)' }}>
            <div style={{ width:40, height:40, borderRadius:'var(--radius-sm)', background:'rgba(220,38,38,0.08)', border:'1px solid rgba(220,38,38,0.2)', display:'grid', placeItems:'center', marginBottom:16 }}>
              <ShieldAlert size={18} color='#DC2626'/>
            </div>
            <div style={{ fontSize:18, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.02em', marginBottom:8, fontFamily:'var(--font-display)' }}>Leave quiz?</div>
            <p style={{ fontSize:13.5, color:'var(--text-secondary)', lineHeight:1.65, margin:'0 0 24px', fontWeight:500 }}>
              Your quiz will be <strong style={{color:'#DC2626'}}>automatically submitted</strong> with your current answers. You have answered <strong style={{color:'var(--text-primary)'}}>{attempted}</strong> of <strong style={{color:'var(--text-primary)'}}>{n}</strong> questions.
            </p>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={()=>setShowLeaveWarning(false)} style={{ flex:1, padding:'11px 0', fontSize:13, fontWeight:600, fontFamily:'var(--font-sans)', background:'var(--bg-section)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-sm)', cursor:'pointer', color:'var(--text-secondary)', transition:'all 0.12s ease' }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--blue-700)'; e.currentTarget.style.color='var(--blue-700)';}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border-subtle)'; e.currentTarget.style.color='var(--text-secondary)';}}
              >
                Continue quiz
              </button>
              <button onClick={doLeave} style={{ flex:1, padding:'11px 0', fontSize:13, fontWeight:700, fontFamily:'var(--font-sans)', background:'#DC2626', border:'none', borderRadius:'var(--radius-sm)', cursor:'pointer', color:'#fff', transition:'opacity 0.12s ease' }}
                onMouseEnter={e=>{e.currentTarget.style.opacity='0.88';}}
                onMouseLeave={e=>{e.currentTarget.style.opacity='1';}}
              >
                Submit &amp; leave
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Submit confirm modal ── */}
      {showSubmitConfirm && (
        <>
          <div style={{ position:'absolute', inset:0, background:'rgba(15,15,15,0.35)', zIndex:50 }} onClick={()=>setShowSubmitConfirm(false)}/>
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', zIndex:60, width:380, background:'#fff', borderRadius:'var(--radius-md)', border:'1px solid var(--border-subtle)', boxShadow:'0 8px 40px rgba(15,15,15,0.18)', padding:'28px', fontFamily:'var(--font-sans)' }}>
            <div style={{ fontSize:18, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.02em', marginBottom:6, fontFamily:'var(--font-display)' }}>Submit quiz?</div>
            <p style={{ fontSize:13, color:'var(--text-secondary)', margin:'0 0 18px', fontWeight:500, lineHeight:1.55 }}>Once submitted you cannot change your answers.</p>
            <div style={{ display:'flex', flexDirection:'column', gap:8, padding:'14px 16px', background:'var(--bg-section)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-sm)', marginBottom:20 }}>
              {[
                { val:attempted, label:'questions answered', color:'var(--text-primary)' },
                ...(n-attempted>0 ? [{ val:n-attempted, label:'unanswered — will score 0', color:'#DC2626' }] : []),
                ...(flagCount>0   ? [{ val:flagCount, label:'saved for review', color:'#4338CA' }] : []),
              ].map(({val,label,color})=>(
                <div key={label} style={{ fontSize:13, color:'var(--text-secondary)', fontWeight:500 }}>
                  <strong style={{color, fontFamily:'var(--font-mono)'}}>{val}</strong> {label}
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={()=>setShowSubmitConfirm(false)} style={{ flex:1, padding:'11px 0', fontSize:13, fontWeight:600, fontFamily:'var(--font-sans)', background:'var(--bg-section)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-sm)', cursor:'pointer', color:'var(--text-secondary)', transition:'all 0.12s ease' }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--blue-700)'; e.currentTarget.style.color='var(--blue-700)';}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border-subtle)'; e.currentTarget.style.color='var(--text-secondary)';}}
              >
                Keep reviewing
              </button>
              <button onClick={doSubmit} style={{ flex:1, padding:'11px 0', fontSize:13, fontWeight:700, fontFamily:'var(--font-sans)', background:'var(--blue-700)', border:'none', borderRadius:'var(--radius-sm)', cursor:'pointer', color:'#fff', transition:'opacity 0.12s ease' }}
                onMouseEnter={e=>{e.currentTarget.style.opacity='0.88';}} onMouseLeave={e=>{e.currentTarget.style.opacity='1';}}
              >
                Submit now
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
