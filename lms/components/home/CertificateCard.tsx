'use client';
import { CERTIFICATE } from '@/lib/mockData';
import { Award, Lock } from 'lucide-react';
import { usePrototype } from '@/context/PrototypeContext';

export default function CertificateCard() {
  const { completedCourses, totalCourses, aggregateProgress } = CERTIFICATE;
  const remaining = totalCourses - completedCourses;
  const { scenario } = usePrototype();
  const isUnlocked = completedCourses === totalCourses || scenario === 'completed';

  return (
    <div className="enter enter-3" style={{
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 'var(--radius-md)',
      background: 'linear-gradient(135deg, #030B22 0%, #06102E 50%, #213594 100%)',
      boxShadow: 'var(--shadow-md)',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* Certificate illustration — top right watermark */}
      <svg
        width="130" height="110"
        viewBox="0 0 130 110"
        style={{ position: 'absolute', top: 0, right: 0, opacity: 0.13, pointerEvents: 'none' }}
        fill="none"
      >
        <rect x="18" y="8" width="72" height="90" rx="4" stroke="white" strokeWidth="1.2"/>
        <rect x="18" y="8" width="72" height="16" rx="4" fill="white" fillOpacity="0.25"/>
        <rect x="18" y="20" width="72" height="4" fill="white" fillOpacity="0.1"/>
        <rect x="30" y="34" width="48" height="3" rx="1.5" fill="white" fillOpacity="0.6"/>
        <rect x="30" y="42" width="38" height="2" rx="1" fill="white" fillOpacity="0.35"/>
        <rect x="30" y="49" width="44" height="2" rx="1" fill="white" fillOpacity="0.35"/>
        <rect x="30" y="56" width="34" height="2" rx="1" fill="white" fillOpacity="0.35"/>
        <line x1="28" y1="80" x2="58" y2="80" stroke="white" strokeWidth="1.2" strokeOpacity="0.5"/>
        <rect x="30" y="83" width="24" height="1.5" rx="0.75" fill="white" fillOpacity="0.25"/>
        <circle cx="100" cy="58" r="22" stroke="white" strokeWidth="1.2"/>
        <circle cx="100" cy="58" r="16" stroke="white" strokeWidth="0.8" strokeDasharray="2 2"/>
        <polygon
          points="100,42 103,52 114,52 105,59 108,69 100,63 92,69 95,59 86,52 97,52"
          stroke="white" strokeWidth="0.9" fill="white" fillOpacity="0.2"
        />
        <line x1="94" y1="78" x2="89" y2="92" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="106" y1="78" x2="111" y2="92" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>

      {/* Content — three zones */}
      <div style={{
        padding: '18px 20px',
        display: 'flex', flexDirection: 'column',
        flex: 1,
        position: 'relative', zIndex: 1,
      }}>

        {/* Zone 1: Label + Headline */}
        <div>
          <span className="label" style={{ color: 'rgba(255,255,255,0.38)' }}>
            Certificate
          </span>
          <div style={{
            marginTop: 6,
            fontSize: 15, fontWeight: 800, color: '#fff',
            letterSpacing: '-0.025em', lineHeight: 1.25,
            fontFamily: 'var(--font-display)',
          }}>
            {isUnlocked ? 'Your certificate is ready' : "You're on track"}
          </div>
          <div style={{
            marginTop: 3,
            fontSize: 12, color: 'rgba(255,255,255,0.42)', lineHeight: 1.45,
          }}>
            {isUnlocked
              ? 'Download and share your achievement.'
              : `Complete ${remaining} more course${remaining !== 1 ? 's' : ''} to unlock.`}
          </div>
        </div>

        {/* Zone 2: Progress */}
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.38)' }}>
              {completedCourses}/{totalCourses} courses
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.55)' }}>
              {aggregateProgress}%
            </span>
          </div>
          <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 9999, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${aggregateProgress}%`,
              background: isUnlocked ? '#85FFAD' : 'rgba(255,255,255,0.5)',
              borderRadius: 9999,
              transition: 'width 0.7s cubic-bezier(0.4,0,0.2,1)',
            }}/>
          </div>
        </div>

        {/* Zone 3: CTA */}
        <div style={{ marginTop: 10 }}>
          {isUnlocked && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              marginBottom: 10,
              fontSize: 11, fontWeight: 600, color: '#85FFAD',
            }}>
              <Award size={12} strokeWidth={2}/> Ready to download
            </div>
          )}
          <button
            onClick={() => {}}
            style={{
              width: '100%',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: 13, fontWeight: 700,
              cursor: isUnlocked ? 'pointer' : 'default',
              border: isUnlocked ? 'none' : '1px solid rgba(255,255,255,0.2)',
              background: isUnlocked ? '#fff' : 'rgba(255,255,255,0.12)',
              color: isUnlocked ? '#030B22' : 'rgba(255,255,255,0.55)',
              transition: 'opacity 0.15s ease',
            }}
            onMouseEnter={e => { if (isUnlocked) e.currentTarget.style.opacity = '0.9'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            {isUnlocked
              ? <><Award size={13}/> Download Certificate</>
              : <><Lock size={12} strokeWidth={2}/> Locked</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}
