'use client';
import { useState } from 'react';
import { Award, X } from 'lucide-react';
import { EngagementScore } from '@/lib/mockData';

const TIERS = [
  { label: 'Lacking', min: 0, max: 20, color: '#DC2626' },
  { label: 'Needs Improvement', min: 20, max: 40, color: '#D97706' },
  { label: 'Satisfactory', min: 40, max: 60, color: '#CA8A04' },
  { label: 'Good', min: 60, max: 80, color: '#16A34A' },
  { label: 'Excellent', min: 80, max: 100, color: '#059669' },
];

function getTier(score: number) {
  return TIERS.find(t => score >= t.min && score < t.max) ?? TIERS[TIERS.length - 1];
}

function EngagementModal({ data, onClose }: { data: EngagementScore; onClose: () => void }) {
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 500 }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '90%', maxWidth: 680,
        background: '#fff', borderRadius: 'var(--radius-md)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.20)',
        zIndex: 501, fontFamily: 'var(--font-sans)',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '24px 28px 16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
              Engagement Score Calculation
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-tertiary)', margin: 0, fontWeight: 500 }}>
              Aggregate of all enrolled courses · Weighted based on UGC Credit Norms
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--text-tertiary)' }}>
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: '0 28px 24px' }}>
          <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 0.8fr 0.6fr', background: 'var(--bg-section)', padding: '10px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
              {['Activity Component', 'Your Time / Target', 'Completion %', 'Weight %', 'Score'].map(h => (
                <div key={h} style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.02em' }}>{h}</div>
              ))}
            </div>
            {data.components.map((c, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 0.8fr 0.6fr', padding: '12px 16px', borderBottom: i < data.components.length - 1 ? '1px solid var(--border-subtle)' : 'none', alignItems: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{c.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{c.yourTime} / {c.targetTime}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{c.completion !== null ? `${c.completion}%` : 'N/A'}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{c.weight}%</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{c.score.toFixed(1)}</div>
              </div>
            ))}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 0.8fr 0.6fr', padding: '12px 16px', background: getTier(data.total).color, color: '#fff', fontWeight: 700 }}>
              <div style={{ fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Total Semester</div>
              <div style={{ fontSize: 13 }}>{data.totalTime} / {data.totalTarget}</div>
              <div style={{ fontSize: 13 }}>{data.totalCompletion}%</div>
              <div />
              <div style={{ fontSize: 13 }}>{data.total} ({data.status})</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function EngagementScoreCard({ data }: { data: EngagementScore }) {
  const [showModal, setShowModal] = useState(false);
  const tier = getTier(data.total);
  const pct = Math.min(data.total / data.maxScore, 1);

  return (
    <>
      <div style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 'var(--radius-md)',
        background: 'linear-gradient(160deg, #030B22 0%, #06102E 40%, #213594 100%)',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column',
        padding: '22px 22px 20px',
        fontFamily: 'var(--font-sans)',
      }}>
        {/* Background decorative elements */}
        <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, background: 'radial-gradient(circle, rgba(255,106,0,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -20, width: 140, height: 140, background: 'radial-gradient(circle, rgba(33,53,148,0.3) 0%, transparent 70%)', pointerEvents: 'none' }} />
        {/* Subtle grid pattern */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04, pointerEvents: 'none' }}>
          {Array.from({ length: 8 }).map((_, i) => <line key={`h${i}`} x1="0" y1={i * 40} x2="100%" y2={i * 40} stroke="#fff" strokeWidth="0.5" />)}
          {Array.from({ length: 12 }).map((_, i) => <line key={`v${i}`} x1={i * 30} y1="0" x2={i * 30} y2="100%" stroke="#fff" strokeWidth="0.5" />)}
        </svg>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 0, position: 'relative' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>
            Engagement Score
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{ background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer', padding: '4px 10px', borderRadius: 'var(--radius-sm)', color: 'rgba(255,255,255,0.50)', display: 'flex', alignItems: 'center', gap: 4, transition: 'background 0.1s', fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-sans)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.color = 'rgba(255,255,255,0.70)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.50)'; }}
          >
            View Details
          </button>
        </div>

        {/* Score — the hero */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 8 }}>
            <span style={{ fontSize: 64, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)', letterSpacing: '-0.04em', lineHeight: 1 }}>
              {data.total}
            </span>
            <span style={{ fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,0.30)', fontFamily: 'var(--font-mono)' }}>
              %
            </span>
          </div>

          {/* Progress bar — segmented, white fill + 75% threshold */}
          <div style={{ width: '100%', position: 'relative', marginBottom: 6 }}>
            <div style={{ display: 'flex', gap: 3, height: 4 }}>
              {TIERS.map((t, i) => {
                const segFill = data.total >= t.max ? 1 : data.total > t.min ? (data.total - t.min) / (t.max - t.min) : 0;
                return (
                  <div key={i} style={{ flex: 1, background: 'rgba(255,255,255,0.10)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${segFill * 100}%`, background: '#fff', transition: 'width 0.5s ease' }} />
                  </div>
                );
              })}
            </div>
            {/* 75% threshold marker */}
            <div style={{ position: 'absolute', left: '75%', top: -3, width: 1, height: 10, background: 'rgba(255,255,255,0.35)' }} />
            <div style={{ position: 'absolute', left: '75%', top: 10, transform: 'translateX(-50%)', fontSize: 8, color: 'rgba(255,255,255,0.30)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>75%</div>
          </div>

          {/* Eligibility status */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px', background: data.total >= 75 ? 'rgba(22,163,74,0.15)' : 'rgba(220,38,38,0.15)', borderRadius: 'var(--radius-sm)', marginTop: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: data.total >= 75 ? '#16A34A' : '#DC2626', boxShadow: `0 0 6px ${data.total >= 75 ? '#16A34A80' : '#DC262680'}` }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: data.total >= 75 ? '#4ADE80' : '#FCA5A5', letterSpacing: '0.01em' }}>
              {data.total >= 75 ? 'Eligible for End-Sem Exams' : 'Not eligible for End-Sem Exams'}
            </span>
          </div>
        </div>

      </div>

      {showModal && <EngagementModal data={data} onClose={() => setShowModal(false)} />}
    </>
  );
}
