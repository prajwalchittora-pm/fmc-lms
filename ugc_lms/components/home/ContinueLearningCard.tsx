'use client';
import { COURSES } from '@/lib/mockData';
import { MonitorPlay, BookOpenText, MessageSquare, ClipboardCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ContinueLearningCard({ firstTime }: { firstTime?: boolean } = {}) {
  const course = COURSES.find(c => c.status === 'in_progress') ?? COURSES[0];
  const isComplete = course.progress === 100;

  return (
    <div className="enter enter-2" style={{
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 'var(--radius-md)',
      background: 'linear-gradient(135deg, #EEF4FF 0%, var(--orange-100) 100%)',
      border: '1px solid var(--border-subtle)',
      boxShadow: 'var(--shadow-sm)',
      transition: 'box-shadow 0.12s ease',
    }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow-md)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'var(--shadow-sm)')}
    >
      <div style={{ padding: '20px 28px', boxSizing: 'border-box' }}>

        <span className="label" style={{ color: 'var(--text-tertiary)' }}>{firstTime ? 'Start learning' : 'Continue learning'}</span>

        <h2 style={{
          margin: '8px 0 14px', fontSize: 24, fontWeight: 800,
          letterSpacing: '-0.03em', lineHeight: 1.2,
          color: 'var(--text-primary)', fontFamily: 'var(--font-display)',
        }}>
          {course.title}
        </h2>

        {/* Activity stats */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
          {[
            { Icon: MonitorPlay,     done: course.activities.videos.done,       total: course.activities.videos.total,       label: 'E-Tutorial' },
            { Icon: BookOpenText,    done: course.activities.pages.done,        total: course.activities.pages.total,        label: 'E-Content' },
            { Icon: MessageSquare,   done: course.activities.discussions.done,  total: course.activities.discussions.total,  label: 'Discussion' },
            { Icon: ClipboardCheck,  done: course.activities.quizzes.done,      total: course.activities.quizzes.total,      label: 'Assessment' },
          ].map(({ Icon, done, total, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <Icon size={14} strokeWidth={1.8} color="var(--text-tertiary)" />
              <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
                {done}<span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-tertiary)' }}>/{total}</span>
              </span>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)' }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Progress + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 6 }}>
          <div className="progress-track" style={{ flex: 1 }}>
            <div
              className={isComplete ? 'progress-fill progress-fill-success' : 'progress-fill'}
              style={{ width: `${course.progress}%` }}
            />
          </div>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: isComplete ? 'var(--green-600)' : 'var(--text-tertiary)', flexShrink: 0 }}>
            {course.progress}%
          </span>
          <Link href={`/learn?course=${course.id}`} data-tour="start-course" className="btn-primary" style={{ flexShrink: 0, padding: '11px 22px', fontSize: 15 }}>
            {isComplete ? 'Review Course' : firstTime ? 'Start Course' : 'Continue'} <ArrowRight size={13}/>
          </Link>
        </div>
      </div>
    </div>
  );
}
