'use client';
import { useState } from 'react';
import { COURSES, Course, SEMESTERS, SemesterId } from '@/lib/mockData';
import { ArrowRight, AlertTriangle, Clock, Video, Play, CheckCircle2, BookOpen, FileEdit, ChevronDown } from 'lucide-react';
import Link from 'next/link';

// ─── Urgency system ────────────────────────────────────────────────────────────

type SignalType = 'exam' | 'not_eligible' | 'deadline' | 'attendance' | 'live_session' | 'on_track' | 'completed' | 'not_started';

interface Signal {
  type: SignalType;
  label: string;
  priority: number; // lower = more urgent
}

const SIGNAL_STYLE: Record<SignalType, { color: string; bg: string; icon: React.ElementType }> = {
  exam:          { color: '#DC2626', bg: 'rgba(220,38,38,0.07)', icon: BookOpen },
  not_eligible:  { color: '#DC2626', bg: 'rgba(220,38,38,0.07)', icon: AlertTriangle },
  deadline:      { color: '#D97706', bg: 'rgba(217,119,6,0.07)', icon: Clock },
  attendance:    { color: '#D97706', bg: 'rgba(217,119,6,0.07)', icon: AlertTriangle },
  live_session:  { color: '#072FB5', bg: 'rgba(7,47,181,0.07)', icon: Video },
  on_track:      { color: '#16A34A', bg: 'rgba(22,163,74,0.07)', icon: CheckCircle2 },
  completed:     { color: '#16A34A', bg: 'rgba(22,163,74,0.07)', icon: CheckCircle2 },
  not_started:   { color: 'var(--text-tertiary)', bg: 'var(--bg-section)', icon: BookOpen },
};

// Collect ALL signals for a course, return sorted by priority
function getCourseSignals(course: Course): Signal[] {
  if (course.status === 'completed') return [{ type: 'completed', label: 'Completed', priority: 100 }];
  if (course.status === 'not_started') return [{ type: 'not_started', label: 'Not started', priority: 90 }];

  const signals: Signal[] = [];

  // Simulate per-course signals (in production these come from API)
  if (course.id === 'spoken-english') {
    signals.push({ type: 'exam', label: 'Mid-Sem Exam in 5 days', priority: 1 });
    signals.push({ type: 'deadline', label: 'Assignment due in 2 days', priority: 3 });
    signals.push({ type: 'live_session', label: 'Live session today at 10 AM', priority: 5 });
  } else if (course.id === 'active-listening') {
    signals.push({ type: 'not_eligible', label: 'Not eligible for exam — 68% attendance', priority: 1 });
    signals.push({ type: 'attendance', label: 'Attendance at 68%', priority: 4 });
    signals.push({ type: 'deadline', label: 'Quiz due in 4 days', priority: 6 });
  } else if (course.id === 'reading-comprehension') {
    signals.push({ type: 'live_session', label: 'Live session tomorrow at 2 PM', priority: 5 });
  } else if (course.id === 'workplace-skills') {
    signals.push({ type: 'deadline', label: 'Assignment due next week', priority: 8 });
  }

  if (signals.length === 0) {
    signals.push({ type: 'on_track', label: 'On track', priority: 50 });
  }

  return signals.sort((a, b) => a.priority - b.priority);
}

// ─── Components ────────────────────────────────────────────────────────────────

function CourseCard({ course, signals }: { course: Course; signals: Signal[] }) {
  const worstSignal = signals[0];
  const worstStyle = SIGNAL_STYLE[worstSignal.type];
  const WorstIcon = worstStyle.icon;
  const isActive = course.status === 'in_progress';
  const isComplete = course.status === 'completed';
  const isQueued = course.status === 'not_started';
  const hasMultiple = signals.length > 1;

  const headerBg = isActive
    ? 'linear-gradient(135deg, #FFF9EB 0%, #FFF0CC 100%)'
    : isComplete
    ? 'linear-gradient(135deg, #D6FFE4 0%, #85FFAD 100%)'
    : 'linear-gradient(135deg, #F6ECFF 0%, #E3C2FF 100%)';
  const headerColor = isActive ? '#92400E' : isComplete ? 'var(--green-700)' : 'var(--purple-800)';
  const statusText = isActive ? 'In progress' : isComplete ? 'Complete' : 'Not started';

  return (
    <div style={{
      width: 'calc((100% - 20px) / 3)', flexShrink: 0,
      background: '#fff', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      transition: 'box-shadow 0.12s ease',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
    >
      {/* Status header */}
      <div style={{ padding: '8px 16px', background: headerBg }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: headerColor, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{statusText}</span>
      </div>

      {/* Title */}
      <div style={{ padding: '14px 16px 10px', flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.3, color: isComplete ? 'var(--text-secondary)' : 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
          {course.title}
        </div>
      </div>

      {/* Urgency signal chip */}
      {isActive && (
        <div style={{ padding: '0 16px 10px', display: 'flex', alignItems: 'center', gap: 5 }}>
          <WorstIcon size={10} strokeWidth={2.2} style={{ color: worstStyle.color }} />
          <span style={{ fontSize: 10, fontWeight: 600, color: worstStyle.color }}>{worstSignal.label}</span>
          {hasMultiple && <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-tertiary)' }}>+{signals.length - 1}</span>}
        </div>
      )}

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
          <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', color: isComplete ? 'var(--green-600)' : 'var(--text-tertiary)' }}>{course.progress}%</span>
        </div>
        {isComplete ? (
          <Link href={`/learn?course=${course.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: 'var(--green-600)', textDecoration: 'none' }}>
            <CheckCircle2 size={11} strokeWidth={2.5}/> Review
          </Link>
        ) : isActive ? (
          <Link href={`/learn?course=${course.id}`} className="btn-primary" style={{ padding: '5px 12px', fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
            <Play size={8} fill="currentColor" strokeWidth={0}/> Continue
          </Link>
        ) : (
          <Link href={`/learn?course=${course.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textDecoration: 'none' }}>
            Start <ArrowRight size={10}/>
          </Link>
        )}
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

interface Props {
  semesterId?: SemesterId;
}

export default function EnrolledCourses({ semesterId }: Props) {
  const [showAll, setShowAll] = useState(false);
  const semCourseIds = semesterId ? SEMESTERS.find(s => s.id === semesterId)?.courses ?? [] : null;
  const courses = semCourseIds ? COURSES.filter(c => semCourseIds.includes(c.id)) : COURSES;
  const semLabel = semesterId ? SEMESTERS.find(s => s.id === semesterId)?.label : null;

  // Build urgency data
  const courseData = courses.map(c => ({ course: c, signals: getCourseSignals(c) }));

  // Split by worst signal priority
  const needsAttention = courseData.filter(d => d.signals[0].priority <= 10);
  const onTrack = courseData.filter(d => {
    const t = d.signals[0].type;
    return d.signals[0].priority > 10 && t !== 'completed' && t !== 'not_started';
  });
  const completed = courseData.filter(d => d.signals[0].type === 'completed');
  const notStarted = courseData.filter(d => d.signals[0].type === 'not_started');

  // Limit on-track display unless expanded
  const onTrackVisible = showAll ? onTrack : onTrack.slice(0, 3);
  const onTrackHidden = onTrack.length - onTrackVisible.length;

  return (
    <div className="enter enter-4" style={{ marginTop: 36 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div className="label" style={{ marginBottom: 4 }}>Your Courses</div>
          <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
            {semLabel || 'All semesters'} — {courses.length} course{courses.length !== 1 ? 's' : ''}
          </div>
        </div>
        <Link href="/learn" style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '6px 14px', fontSize: 12, fontWeight: 600,
          color: 'var(--text-secondary)', background: 'transparent',
          border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)',
          textDecoration: 'none', fontFamily: 'var(--font-sans)',
        }}>
          View all courses <ArrowRight size={12} />
        </Link>
      </div>

      {courses.length === 0 ? (
        <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--text-tertiary)', border: '1px dashed var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>No courses in this semester yet</div>
          <div style={{ fontSize: 12 }}>Courses will appear here once enrolled</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>

          {/* Needs attention */}
          {needsAttention.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#DC2626', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
                <AlertTriangle size={10} /> Needs attention ({needsAttention.length})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {needsAttention.map(d => <CourseCard key={d.course.id} course={d.course} signals={d.signals} />)}
              </div>
            </div>
          )}

          {/* On track + rest */}
          {[...onTrack, ...notStarted].length > 0 && (
            <div style={{ marginBottom: 10 }}>
              {needsAttention.length > 0 && (
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 10 }}>
                  Other courses ({onTrack.length + notStarted.length})
                </div>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {(showAll ? [...onTrack, ...notStarted] : [...onTrack, ...notStarted].slice(0, 3)).map(d => <CourseCard key={d.course.id} course={d.course} signals={d.signals} />)}
              </div>
              {!showAll && [...onTrack, ...notStarted].length > 3 && (
                <div style={{ textAlign: 'center', marginTop: 12 }}>
                  <button onClick={() => setShowAll(true)} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '8px 20px', fontSize: 11, fontWeight: 600,
                    color: 'var(--text-tertiary)', background: '#fff',
                    border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer', fontFamily: 'var(--font-sans)',
                  }}>
                    Show {[...onTrack, ...notStarted].length - 3} more <ChevronDown size={11} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Summary pills */}
          {(completed.length > 0 || notStarted.length > 0) && (
            <div style={{ display: 'flex', gap: 10 }}>
              {completed.length > 0 && (
                <Link href="/learn" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(22,163,74,0.04)', border: '1px solid rgba(22,163,74,0.12)', borderRadius: 'var(--radius-sm)', textDecoration: 'none' }}>
                  <CheckCircle2 size={13} style={{ color: '#16A34A' }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#16A34A' }}>{completed.length} completed</span>
                  <ArrowRight size={11} style={{ color: '#16A34A', marginLeft: 'auto' }} />
                </Link>
              )}
              {notStarted.length > 0 && (
                <Link href="/learn" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'var(--bg-section)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', textDecoration: 'none' }}>
                  <BookOpen size={13} style={{ color: 'var(--text-tertiary)' }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{notStarted.length} not started</span>
                  <ArrowRight size={11} style={{ color: 'var(--text-tertiary)', marginLeft: 'auto' }} />
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
