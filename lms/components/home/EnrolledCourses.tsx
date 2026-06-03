'use client';
import { useState } from 'react';
import { COURSES, Course } from '@/lib/mockData';
import { ArrowRight, CheckCircle2, Play, Video, HelpCircle, FileText } from 'lucide-react';
import Link from 'next/link';

type Filter = 'all' | 'in_progress' | 'completed' | 'not_started';
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'in_progress', label: 'In progress' },
  { key: 'completed', label: 'Completed' },
  { key: 'not_started', label: 'Not started' },
];

function CourseCard({ course }: { course: Course }) {
  const isComplete = course.status === 'completed';
  const isActive = course.status === 'in_progress';
  const isQueued = course.status === 'not_started';

  const headerBg = isActive
    ? 'linear-gradient(135deg, #FFF9EB 0%, #FFF0CC 100%)'
    : isComplete
    ? 'linear-gradient(135deg, #D6FFE4 0%, #85FFAD 100%)'
    : 'linear-gradient(135deg, #F6ECFF 0%, #E3C2FF 100%)';
  const headerColor = isActive ? 'var(--yellow-700, #92400E)' : isComplete ? 'var(--green-700)' : 'var(--purple-800)';
  const statusText = isActive ? 'In progress' : isComplete ? 'Complete' : 'Not started';

  return (
    <div style={{
      width: 'calc((100% - 20px) / 3)', flexShrink: 0,
      background: '#fff',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      opacity: isQueued ? 0.88 : 1,
      boxShadow: 'var(--shadow-sm)',
      transition: 'box-shadow 0.12s ease, opacity 0.14s ease',
      display: 'flex', flexDirection: 'column',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; if (isQueued) e.currentTarget.style.opacity = '1'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; if (isQueued) e.currentTarget.style.opacity = '0.88'; }}
    >
      {/* Status header */}
      <div style={{ padding: '8px 16px', background: headerBg, flexShrink: 0 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: headerColor, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          {statusText}
        </span>
      </div>

      <div style={{ padding: '13px 15px 0', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Title */}
        <div style={{
          fontSize: 16, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.3,
          color: isComplete ? 'var(--text-secondary)' : 'var(--text-primary)',
          fontFamily: 'var(--font-display)',
          marginBottom: 12,
        }}>
          {course.title}
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', marginBottom: 10 }}/>

        {/* Activity counts */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
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

        <div style={{ borderTop: '1px solid var(--border-subtle)', marginBottom: 10 }}/>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 13, marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="progress-track" style={{ width: 48 }}>
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
            <Link href={`/learn?course=${course.id}`} style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 11, fontWeight: 600, color: 'var(--green-600)', textDecoration: 'none',
            }}>
              <CheckCircle2 size={11} strokeWidth={2.5}/> Review
            </Link>
          ) : isActive ? (
            <Link href={`/learn?course=${course.id}`}
              className="btn-primary"
              style={{ padding: '5px 12px', fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}
            >
              <Play size={8} fill="currentColor" strokeWidth={0}/> Continue
            </Link>
          ) : (
            <Link href={`/learn?course=${course.id}`} style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 11, fontWeight: 600, color: 'var(--blue-700)',
              textDecoration: 'none', transition: 'color 0.12s ease',
            }}>
              Start <ArrowRight size={10}/>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EnrolledCourses() {
  const [filter, setFilter] = useState<Filter>('all');
  const filtered = COURSES.filter(c => filter === 'all' || c.status === filter);

  return (
    <div className="enter enter-4" style={{ marginTop: 36 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div className="label" style={{ marginBottom: 4 }}>Enrolled courses</div>
          <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
            Your learning tracks
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {FILTERS.map(f => {
            const count = f.key === 'all' ? COURSES.length : COURSES.filter(c => c.status === f.key).length;
            const active = filter === f.key;
            return (
              <button key={f.key} onClick={() => setFilter(f.key)} style={{
                padding: '6px 13px', fontSize: 12, fontWeight: 600,
                background: active ? 'var(--blue-700)' : 'transparent',
                color: active ? '#fff' : 'var(--text-tertiary)',
                border: `1px solid ${active ? 'transparent' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-md)', cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                transition: 'all 0.12s ease',
              }}>
                {f.label}
                <span style={{ fontSize: 10, marginLeft: 4, opacity: 0.65, fontWeight: 600 }}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Card grid */}
      <div key={filter} className="enter enter-1" style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {filtered.map(c => <CourseCard key={c.id} course={c}/>)}
      </div>

      {filtered.length === 0 && (
        <div style={{
          padding: '52px 0', textAlign: 'center',
          color: 'var(--text-tertiary)',
          border: '1px dashed var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
            No {filter.replace('_', ' ')} courses
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--neutral-300)' }}>
            Switch to a different filter to see courses
          </div>
        </div>
      )}
    </div>
  );
}
