'use client';
import { COURSES, Course } from '@/lib/mockData';
import { Video, HelpCircle, FileText, ArrowRight, CheckCircle2, Play } from 'lucide-react';

interface Props { onSelect: (id: string) => void; }

const COURSE_THUMBS: Record<string, { from: string; to: string; accent: string }> = {
  'spoken-english':        { from: '#2a4ab8', to: '#5a80e8', accent: '#a8c4ff' },
  'active-listening':      { from: '#1a7a52', to: '#34c98a', accent: '#90f0c8' },
  'business-writing':      { from: '#a05818', to: '#d88438', accent: '#ffd08a' },
  'reading-comprehension': { from: '#5028a8', to: '#8858d8', accent: '#d0b0ff' },
  'workplace-skills':      { from: '#1468a0', to: '#3098cc', accent: '#90d8f8' },
  'career-readiness':      { from: '#b04020', to: '#e06840', accent: '#ffc090' },
  'ielts-readiness':       { from: '#1840a0', to: '#4070cc', accent: '#90b8ff' },
};

function CourseThumb({ courseId, isComplete, isQueued }: { courseId: string; isComplete: boolean; isQueued: boolean }) {
  const t = COURSE_THUMBS[courseId] ?? COURSE_THUMBS['spoken-english'];
  const uid = courseId;

  return (
    <svg
      width="100%" height="88" viewBox="0 0 320 88"
      style={{ display: 'block', opacity: isQueued ? 0.55 : 1 }}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`cg-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={isComplete ? '#1a5c38' : t.from}/>
          <stop offset="100%" stopColor={isComplete ? '#2a9e62' : t.to}/>
        </linearGradient>
        <linearGradient id={`cd-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="30%" stopColor="transparent"/>
          <stop offset="100%" stopColor="rgba(8,8,8,0.65)"/>
        </linearGradient>
      </defs>
      <rect width="320" height="88" fill={`url(#cg-${uid})`}/>
      {courseId === 'spoken-english' && <>
        <path d="M100 44 Q 132 18 160 44 Q 188 70 220 44" stroke={isComplete ? '#90f0c8' : t.accent} strokeWidth="2.5" fill="none" opacity="0.75"/>
        <path d="M80 56 Q 120 30 160 56 Q 200 82 240 56" stroke={isComplete ? '#90f0c8' : t.accent} strokeWidth="1.5" fill="none" opacity="0.45"/>
        <circle cx="160" cy="44" r="5" fill={isComplete ? '#90f0c8' : t.accent} opacity="0.9"/>
        <circle cx="220" cy="44" r="3.5" fill={isComplete ? '#90f0c8' : t.accent} opacity="0.7"/>
        <circle cx="100" cy="44" r="3.5" fill={isComplete ? '#90f0c8' : t.accent} opacity="0.7"/>
      </>}
      {courseId === 'active-listening' && <>
        <circle cx="160" cy="44" r="8" fill={isComplete ? '#90f0c8' : t.accent} opacity="0.9"/>
        <circle cx="160" cy="44" r="22" fill="none" stroke={isComplete ? '#90f0c8' : t.accent} strokeWidth="2" opacity="0.65"/>
        <circle cx="160" cy="44" r="38" fill="none" stroke={isComplete ? '#90f0c8' : t.accent} strokeWidth="1.2" opacity="0.40"/>
        <circle cx="160" cy="44" r="56" fill="none" stroke={isComplete ? '#90f0c8' : t.accent} strokeWidth="0.8" opacity="0.20"/>
      </>}
      {courseId === 'business-writing' && <>
        <rect x="90" y="12" width="90" height="64" fill="rgba(255,255,255,0.10)" stroke={isComplete ? '#90f0c8' : t.accent} strokeWidth="1.8" opacity="0.7"/>
        <line x1="103" y1="38" x2="167" y2="38" stroke={isComplete ? '#90f0c8' : t.accent} strokeWidth="2.2" opacity="0.8"/>
        <line x1="103" y1="50" x2="167" y2="50" stroke={isComplete ? '#90f0c8' : t.accent} strokeWidth="1" opacity="0.5"/>
        <line x1="103" y1="60" x2="158" y2="60" stroke={isComplete ? '#90f0c8' : t.accent} strokeWidth="1" opacity="0.5"/>
      </>}
      {courseId === 'reading-comprehension' && <>
        <path d="M60 14 L 160 10 L 160 78 L 60 74 Z" fill="rgba(255,255,255,0.08)" stroke={isComplete ? '#90f0c8' : t.accent} strokeWidth="1.4" opacity="0.65"/>
        <path d="M160 10 L 260 14 L 260 74 L 160 78 Z" fill="rgba(255,255,255,0.05)" stroke={isComplete ? '#90f0c8' : t.accent} strokeWidth="1.4" opacity="0.65"/>
        <line x1="160" y1="10" x2="160" y2="78" stroke={isComplete ? '#90f0c8' : t.accent} strokeWidth="1.8" opacity="0.85"/>
      </>}
      {courseId === 'workplace-skills' && <>
        <circle cx="160" cy="20" r="12" fill="rgba(255,255,255,0.18)" stroke={isComplete ? '#90f0c8' : t.accent} strokeWidth="1.8" opacity="0.8"/>
        <circle cx="100" cy="66" r="12" fill="rgba(255,255,255,0.14)" stroke={isComplete ? '#90f0c8' : t.accent} strokeWidth="1.6" opacity="0.7"/>
        <circle cx="220" cy="66" r="12" fill="rgba(255,255,255,0.14)" stroke={isComplete ? '#90f0c8' : t.accent} strokeWidth="1.6" opacity="0.7"/>
        <line x1="152" y1="30" x2="110" y2="56" stroke={isComplete ? '#90f0c8' : t.accent} strokeWidth="1.4" opacity="0.55"/>
        <line x1="168" y1="30" x2="210" y2="56" stroke={isComplete ? '#90f0c8' : t.accent} strokeWidth="1.4" opacity="0.55"/>
        <circle cx="160" cy="20" r="5" fill={isComplete ? '#90f0c8' : t.accent} opacity="0.85"/>
        <circle cx="100" cy="66" r="5" fill={isComplete ? '#90f0c8' : t.accent} opacity="0.75"/>
        <circle cx="220" cy="66" r="5" fill={isComplete ? '#90f0c8' : t.accent} opacity="0.75"/>
      </>}
      {courseId === 'career-readiness' && <>
        {([[60,78],[96,58],[132,38],[168,22],[220,22]] as [number,number][]).map(([x,y],i,a) => (
          i > 0 ? <line key={i} x1={a[i-1][0]} y1={a[i-1][1]} x2={x} y2={y}
            stroke={isComplete ? '#90f0c8' : t.accent} strokeWidth="2.5" opacity="0.82"/> : null
        ))}
        <polygon points="210,16 226,22 210,28" fill={isComplete ? '#90f0c8' : t.accent} opacity="0.88"/>
      </>}
      {courseId === 'ielts-readiness' && <>
        <ellipse cx="148" cy="44" rx="44" ry="38" fill="rgba(255,255,255,0.07)"
          stroke={isComplete ? '#90f0c8' : t.accent} strokeWidth="1.5" opacity="0.65"/>
        <line x1="104" y1="44" x2="192" y2="44" stroke={isComplete ? '#90f0c8' : t.accent} strokeWidth="1" opacity="0.5"/>
        <ellipse cx="148" cy="44" rx="18" ry="38" fill="none" stroke={isComplete ? '#90f0c8' : t.accent} strokeWidth="1" opacity="0.40"/>
        <circle cx="240" cy="52" r="16" fill="rgba(255,255,255,0.12)"
          stroke={isComplete ? '#90f0c8' : t.accent} strokeWidth="1.5" opacity="0.7"/>
      </>}
      <rect width="320" height="88" fill={`url(#cd-${uid})`}/>
      {isComplete && (
        <g>
          <circle cx="268" cy="20" r="14" fill="rgba(26,92,56,0.85)" stroke="rgba(144,240,200,0.5)" strokeWidth="1"/>
          <polyline points="262,20 267,26 275,14" fill="none" stroke="#90f0c8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
      )}
    </svg>
  );
}

function CourseCard({ course, onSelect }: { course: Course; onSelect: () => void }) {
  const isActive = course.status === 'in_progress';
  const isComplete = course.status === 'completed';
  const isQueued = course.status === 'not_started';

  const headerBg = isActive
    ? 'linear-gradient(135deg, #FFF9EB 0%, #FFF0CC 100%)'
    : isComplete
    ? 'linear-gradient(135deg, #D6FFE4 0%, #85FFAD 100%)'
    : 'linear-gradient(135deg, #F6ECFF 0%, #E3C2FF 100%)';
  const headerColor = isActive ? 'var(--yellow-700, #92400E)' : isComplete ? 'var(--green-700)' : 'var(--purple-800)';
  const statusText = isActive ? 'In progress' : isComplete ? 'Complete' : 'Not started';

  return (
    <div
      onClick={onSelect}
      style={{
        width: 360, flexShrink: 0,
        background: '#fff',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        cursor: 'pointer',
        opacity: isQueued ? 0.75 : 1,
        display: 'flex', flexDirection: 'column',
        boxShadow: 'var(--shadow-sm)',
        transition: 'box-shadow 0.12s ease, opacity 0.14s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; if (isQueued) e.currentTarget.style.opacity = '0.92'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; if (isQueued) e.currentTarget.style.opacity = '0.75'; }}
    >
      {/* Status header */}
      <div style={{
        padding: '8px 16px',
        background: headerBg,
        display: 'flex', alignItems: 'center',
      }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: headerColor, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          {statusText}
        </span>
      </div>

      {/* Title */}
      <div style={{ padding: '14px 16px 12px', flex: 1 }}>
        <div style={{
          fontSize: 16, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.3,
          color: isComplete ? 'var(--text-secondary)' : 'var(--text-primary)',
          fontFamily: 'var(--font-display)',
        }}>
          {course.title}
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '0 16px' }}/>

      {/* Activity counts */}
      <div style={{ padding: '10px 16px', display: 'flex', gap: 14, alignItems: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-secondary)' }}>
          <Video size={12} strokeWidth={1.8}/>
          <b style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{course.activities.videos.total}</b> videos
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-secondary)' }}>
          <HelpCircle size={12} strokeWidth={1.8}/>
          <b style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{course.activities.quizzes.total}</b> quizzes
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-secondary)' }}>
          <FileText size={12} strokeWidth={1.8}/>
          <b style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{course.activities.pages.total}</b> pages
        </span>
      </div>

      <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '0 16px' }}/>

      {/* Footer: progress + CTA */}
      <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="progress-track" style={{ width: 56 }}>
            <div
              className={isComplete ? 'progress-fill progress-fill-success' : isActive ? 'progress-fill' : undefined}
              style={{ height: '100%', width: `${course.progress}%`, borderRadius: 100, background: isQueued ? 'rgba(127,127,127,0.15)' : undefined }}
            />
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', color: isComplete ? 'var(--green-600)' : 'var(--text-tertiary)' }}>
            {course.progress}%
          </span>
        </div>

        {isComplete ? (
          <button className="btn-primary"
            style={{ padding: '5px 12px', fontSize: 11, background: 'var(--success-soft)', color: 'var(--green-600)', border: '1px solid rgba(0,117,40,0.2)' }}
            onClick={e => { e.stopPropagation(); onSelect(); }}
          >
            <CheckCircle2 size={9} strokeWidth={2.5}/> Review
          </button>
        ) : isActive ? (
          <button className="btn-primary"
            style={{ padding: '5px 12px', fontSize: 11 }}
            onClick={e => { e.stopPropagation(); onSelect(); }}
          >
            <Play size={8} fill="currentColor" strokeWidth={0}/> Continue
          </button>
        ) : (
          <button
            onClick={e => { e.stopPropagation(); onSelect(); }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)',
              fontFamily: 'var(--font-sans)', padding: 0, transition: 'color 0.12s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}
          >
            Start <ArrowRight size={10}/>
          </button>
        )}
      </div>
    </div>
  );
}

export default function CourseList({ onSelect }: Props) {
  const inProgress = COURSES.filter(c => c.status === 'in_progress');
  const notStarted = COURSES.filter(c => c.status === 'not_started');
  const completed = COURSES.filter(c => c.status === 'completed');

  const doneCount = COURSES.reduce((acc, c) => acc + c.activities.videos.done + c.activities.quizzes.done + c.activities.pages.done, 0);
  const totalCount = COURSES.reduce((acc, c) => acc + c.activities.videos.total + c.activities.quizzes.total + c.activities.pages.total, 0);
  const overallProgress = Math.round((doneCount / totalCount) * 100);

  const Section = ({ title, courses, color }: { title: string; courses: Course[]; color?: string }) => (
    <div style={{ marginBottom: 36 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span className="label" style={{ color: color ?? 'var(--text-tertiary)' }}>{title}</span>
        <span style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 600, opacity: 0.5 }}>{courses.length}</span>
        <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }}/>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {courses.map(c => <CourseCard key={c.id} course={c} onSelect={() => onSelect(c.id)}/>)}
      </div>
    </div>
  );

  return (
    <div className="enter enter-1" style={{ padding: '44px 80px', overflowY: 'auto', height: '100%' }}>

      {/* Header banner */}
      <div style={{
        position: 'relative', marginBottom: 36, padding: '26px 32px',
        background: 'linear-gradient(135deg, #EEF4FF 0%, var(--orange-100, #FFE8CC) 100%)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 32, position: 'relative' }}>
          <div>
            <div className="label" style={{ marginBottom: 8 }}>Learning catalogue</div>
            <h1 style={{
              margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1,
              fontFamily: 'var(--font-display)',
            }}>
              Your courses
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--text-tertiary)', maxWidth: 440, lineHeight: 1.5 }}>
              Professional Communication &amp; Soft Skills — follow the recommended path or explore freely.
            </p>
          </div>
          <div style={{ flexShrink: 0, textAlign: 'right' }}>
            <div className="label" style={{ marginBottom: 6 }}>Overall progress</div>
            <div style={{
              fontSize: 28, fontWeight: 800, letterSpacing: '-0.04em',
              color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', lineHeight: 1,
            }}>
              {overallProgress}%
            </div>
            <div className="progress-track" style={{ marginTop: 8, width: 120 }}>
              <div className="progress-fill" style={{ width: `${overallProgress}%` }}/>
            </div>
            <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)', marginTop: 4, fontWeight: 500 }}>
              {doneCount} / {totalCount} activities · {COURSES.length} courses
            </div>
          </div>
        </div>
      </div>

      {inProgress.length > 0 && <Section title="In progress" courses={inProgress}/>}
      {notStarted.length > 0 && <Section title="Up next" courses={notStarted}/>}
      {completed.length > 0 && <Section title="Completed" courses={completed} color="var(--green-600)"/>}
    </div>
  );
}
