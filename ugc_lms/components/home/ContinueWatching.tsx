'use client';
import { useRef } from 'react';
import { VIDEO_ACTIVITIES, COURSES } from '@/lib/mockData';
import { Play, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const THUMBS: Record<string, { from: string; to: string; accent: string; pattern: string }> = {
  'pronunciation':  { from: '#5b8fd4', to: '#8cb8f0', accent: '#ddeeff', pattern: 'wave' },
  'listening':      { from: '#2a9e6e', to: '#48d494', accent: '#b0f4d8', pattern: 'ripple' },
  'presentation':   { from: '#3a60e8', to: '#6a90ff', accent: '#ccdaff', pattern: 'slide' },
  'rapport':        { from: '#7040c8', to: '#a870ff', accent: '#e4d0ff', pattern: 'network' },
  'email-writing':  { from: '#c86028', to: '#f08840', accent: '#ffd8a8', pattern: 'chart' },
};

function Thumb({ id, from, to, accent, pattern }: { id: string; from: string; to: string; accent: string; pattern: string }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 260 156" style={{ display: 'block', aspectRatio: '260/156' }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`tg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from}/>
          <stop offset="100%" stopColor={to}/>
        </linearGradient>
        <linearGradient id={`td-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="40%" stopColor="transparent"/>
          <stop offset="100%" stopColor="rgba(10,10,10,0.75)"/>
        </linearGradient>
      </defs>
      <rect width="260" height="156" fill={`url(#tg-${id})`}/>

      {pattern === 'wave' && <>
        <path d="M0 78 Q 32 50, 65 78 T 130 78 T 195 78 T 260 78" stroke={accent} strokeWidth="2.5" fill="none" opacity="0.8"/>
        <path d="M0 100 Q 32 72, 65 100 T 130 100 T 195 100 T 260 100" stroke={accent} strokeWidth="1.5" fill="none" opacity="0.5"/>
        <path d="M0 56 Q 32 28, 65 56 T 130 56 T 195 56 T 260 56" stroke={accent} strokeWidth="1.2" fill="none" opacity="0.3"/>
        <circle cx="65" cy="78" r="4" fill={accent} opacity="0.9"/>
        <circle cx="130" cy="78" r="4" fill={accent} opacity="0.9"/>
        <circle cx="195" cy="78" r="4" fill={accent} opacity="0.9"/>
      </>}

      {pattern === 'ripple' && <>
        <circle cx="130" cy="78" r="14" fill={accent} opacity="0.22"/>
        <circle cx="130" cy="78" r="32" fill="none" stroke={accent} strokeWidth="1.8" opacity="0.55"/>
        <circle cx="130" cy="78" r="52" fill="none" stroke={accent} strokeWidth="1.2" opacity="0.35"/>
        <circle cx="130" cy="78" r="72" fill="none" stroke={accent} strokeWidth="0.8" opacity="0.18"/>
        <circle cx="130" cy="78" r="7" fill={accent} opacity="0.85"/>
      </>}

      {pattern === 'slide' && <>
        <rect x="36" y="22" width="148" height="98" fill="none" stroke={accent} strokeWidth="1.8" opacity="0.65"/>
        <line x1="36" y1="40" x2="184" y2="40" stroke={accent} strokeWidth="0.8" opacity="0.4"/>
        <line x1="52" y1="58" x2="148" y2="58" stroke={accent} strokeWidth="2.5" opacity="0.75"/>
        <line x1="52" y1="72" x2="136" y2="72" stroke={accent} strokeWidth="1.2" opacity="0.5"/>
        <line x1="52" y1="84" x2="156" y2="84" stroke={accent} strokeWidth="1.2" opacity="0.5"/>
        <line x1="52" y1="96" x2="128" y2="96" stroke={accent} strokeWidth="1.2" opacity="0.5"/>
        <rect x="202" y="26" width="46" height="30" fill={accent} opacity="0.18" stroke={accent} strokeWidth="0.8" strokeOpacity="0.5"/>
        <rect x="202" y="62" width="46" height="30" fill={accent} opacity="0.12" stroke={accent} strokeWidth="0.8" strokeOpacity="0.4"/>
        <rect x="202" y="98" width="46" height="30" fill={accent} opacity="0.08" stroke={accent} strokeWidth="0.8" strokeOpacity="0.3"/>
      </>}

      {pattern === 'network' && <>
        {[[44,34],[44,78],[44,122],[130,22],[130,62],[130,100],[130,134],[216,44],[216,112]].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r="5" fill={accent} opacity="0.85"/>
        ))}
        {[[44,34,130,22],[44,34,130,62],[44,78,130,62],[44,78,130,100],[44,122,130,100],[44,122,130,134],
          [130,22,216,44],[130,62,216,44],[130,100,216,112],[130,134,216,112]].map(([x1,y1,x2,y2],i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={accent} strokeWidth="1" opacity="0.3"/>
        ))}
      </>}

      {pattern === 'chart' && <>
        <line x1="34" y1="22" x2="34" y2="124" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2"/>
        <line x1="34" y1="124" x2="238" y2="124" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2"/>
        {[[60,110],[94,72],[128,90],[162,46],[196,66],[230,34]].map(([x,y],i,a) => (
          i > 0 ? <line key={i} x1={a[i-1][0]} y1={a[i-1][1]} x2={x} y2={y} stroke={accent} strokeWidth="2.2" opacity="0.85"/> : null
        ))}
        {[[60,110],[94,72],[128,90],[162,46],[196,66],[230,34]].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r="4" fill={accent}/>
        ))}
      </>}

      <rect width="260" height="156" fill={`url(#td-${id})`}/>
    </svg>
  );
}

const SCROLL_AMOUNT = 364;

export default function ContinueWatching({ firstTime }: { firstTime?: boolean } = {}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const unwatched = VIDEO_ACTIVITIES.filter(v => !v.done);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'right' ? SCROLL_AMOUNT : -SCROLL_AMOUNT, behavior: 'smooth' });
  };

  return (
    <div className="enter enter-5" style={{ marginTop: 36 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div className="label">{firstTime ? 'Start watching' : 'Continue watching'}</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {(['left', 'right'] as const).map(dir => (
            <button
              key={dir}
              onClick={() => scroll(dir)}
              style={{
                width: 28, height: 28, display: 'grid', placeItems: 'center',
                background: '#fff', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                color: 'var(--text-secondary)', transition: 'all 0.1s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-section)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              {dir === 'left' ? <ChevronLeft size={14} strokeWidth={2}/> : <ChevronRight size={14} strokeWidth={2}/>}
            </button>
          ))}
        </div>
      </div>

      {unwatched.length === 0 ? (
        <div style={{
          height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--bg-section)', border: '1px dashed var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-tertiary)', fontSize: 13, fontWeight: 500, gap: 8,
        }}>
          All videos watched
        </div>
      ) : (
        <div
          ref={scrollRef}
          style={{
            display: 'flex', gap: 12,
            overflowX: 'auto', overflowY: 'visible',
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none',
            paddingBottom: 6,
          }}
        >
          {unwatched.map(video => {
            const t = THUMBS[video.thumbnail ?? ''] ?? THUMBS['pronunciation'];
            const course = COURSES.find(c => c.id === video.courseId);
            return (
              <Link key={video.id} href={`/learn?course=${video.courseId}`}
                style={{ textDecoration: 'none', color: 'inherit', width: 340, flexShrink: 0 }}>
                <div style={{
                  background: '#fff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'box-shadow 0.12s ease',
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                >
                  <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <Thumb id={video.thumbnail ?? video.id} from={t.from} to={t.to} accent={t.accent} pattern={t.pattern}/>
                    <div style={{
                      position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
                      background: 'rgba(0,0,0,0)', transition: 'background 0.14s ease',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.18)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0)')}
                    >
                      <div style={{
                        width: 42, height: 42, background: 'rgba(0,0,0,0.45)',
                        borderRadius: '50%', display: 'grid', placeItems: 'center',
                      }}>
                        <Play size={16} fill="white" color="white" strokeWidth={0}/>
                      </div>
                    </div>
                    <div style={{
                      position: 'absolute', bottom: 10, right: 10,
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '4px 10px', background: 'rgba(0,0,0,0.78)',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: 12, fontWeight: 700, color: '#fff',
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.02em',
                    }}>
                      <Clock size={11} strokeWidth={2}/> {video.duration}
                    </div>
                  </div>
                  <div style={{ padding: '12px 14px' }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.35, marginBottom: 4 }}>
                      {video.title}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{course?.title}</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
