'use client';
import { ChevronRight, MessageSquare, Pin, Calendar, Clock, ClipboardCheck, Megaphone } from 'lucide-react';
import Link from 'next/link';

// ─── Mock Data ──────────────────────────────────────────────────────────────

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  type: 'exam' | 'assignment' | 'quiz';
  programme: string;
  course?: string;
  note?: string;
}

interface GradingItem {
  id: string;
  studentName: string;
  studentInitials: string;
  title: string;
  courseCode: string;
  submittedAt: string;
  status: 'new' | 'pending' | 'overdue';
}

interface ForumThread {
  id: string;
  title: string;
  course: string;
  author: string;
  authorInitials: string;
  time: string;
  replies: number;
  status: 'unanswered' | 'answered' | 'flagged';
  programme: string;
}

interface Announcement {
  id: string;
  title: string;
  body: string;
  programme: string;
  programmeLabel: string;
  time: string;
  pinned: boolean;
}

const UPCOMING: UpcomingEvent[] = [
  { id: 'u1', title: 'Business Statistics Project Due', date: '8 Jun', time: '11:59 PM', type: 'assignment', programme: 'MBA-26', course: 'MBA-105' },
  { id: 'u2', title: 'Module 3 Quiz — Business Law', date: '10 Jun', time: '9:00 AM', type: 'quiz', programme: 'MBA-26', course: 'MBA-106' },
  { id: 'u3', title: 'End Sem — Managerial Economics', date: '15 Jun', time: '10:00 AM', type: 'exam', programme: 'MBA-26', course: 'MBA-101', note: 'Hall A, Block 3' },
  { id: 'u4', title: 'End Sem — Managerial Communication', date: '17 Jun', time: '10:00 AM', type: 'exam', programme: 'MBA-26', course: 'MBA-102', note: 'Hall A, Block 3' },
  { id: 'u5', title: 'End Sem — Financial Accounting', date: '19 Jun', time: '10:00 AM', type: 'exam', programme: 'MBA-26', course: 'MBA-103', note: 'Hall B, Block 3' },
  { id: 'u6', title: 'End Sem — Organizational Behaviour', date: '21 Jun', time: '10:00 AM', type: 'exam', programme: 'MBA-26', course: 'MBA-104' },
  { id: 'u7', title: 'OB Reflection Paper Due', date: '22 Jun', time: '11:59 PM', type: 'assignment', programme: 'MBA-26', course: 'MBA-104' },
];

const GRADING_ITEMS: GradingItem[] = [
  { id: 'g1', studentName: 'Arjun Mehta', studentInitials: 'AM', title: 'Case Study: Market Entry Strategy', courseCode: 'MBA-101', submittedAt: '2h ago', status: 'new' },
  { id: 'g2', studentName: 'Priya Sharma', studentInitials: 'PS', title: 'Financial Statement Analysis Report', courseCode: 'MBA-103', submittedAt: '4h ago', status: 'new' },
  { id: 'g3', studentName: 'Kavya Menon', studentInitials: 'KM', title: 'Case Study: Market Entry Strategy', courseCode: 'MBA-101', submittedAt: '5h ago', status: 'new' },
  { id: 'g4', studentName: 'Rohan Gupta', studentInitials: 'RG', title: 'OB Reflection Paper', courseCode: 'MBA-104', submittedAt: '2d ago', status: 'pending' },
  { id: 'g5', studentName: 'Dev Malhotra', studentInitials: 'DM', title: 'OB Reflection Paper', courseCode: 'MBA-104', submittedAt: '1d ago', status: 'overdue' },
];

const FORUM_THREADS: ForumThread[] = [
  { id: 'f1', title: 'Doubt regarding Market Equilibrium in imperfect competition', course: 'MBA-101', author: 'Arjun Mehta', authorInitials: 'AM', time: '2h ago', replies: 0, status: 'unanswered', programme: 'MBA-26' },
  { id: 'f2', title: 'Assignment format — APA or Harvard referencing?', course: 'MBA-102', author: 'Kavya Menon', authorInitials: 'KM', time: '1d ago', replies: 1, status: 'unanswered', programme: 'MBA-26' },
  { id: 'f3', title: 'Request to reschedule OB group presentation', course: 'MBA-104', author: 'Dev Malhotra', authorInitials: 'DM', time: '2d ago', replies: 0, status: 'unanswered', programme: 'MBA-26' },
  { id: 'f4', title: 'Inappropriate language in discussion', course: 'MBA-104', author: 'System', authorInitials: '!', time: '2d ago', replies: 0, status: 'flagged', programme: 'MBA-26' },
  { id: 'f5', title: 'Lab submission deadline — server was down', course: 'BCA-201', author: 'Karthik Nair', authorInitials: 'KN', time: '4d ago', replies: 1, status: 'unanswered', programme: 'BCA-26' },
];

const ANNOUNCEMENTS: Announcement[] = [
  { id: 'a1', title: 'End Semester Examination Schedule Released', body: 'Exams from 15 Jun to 25 Jun. Check the Exams tab for detailed timetable and hall allocations.', programme: 'MBA-26', programmeLabel: 'MBA - Batch 2026', time: '2h ago', pinned: true },
  { id: 'a2', title: 'Eligibility List — Final Reminder', body: 'Students below 75% attendance must submit exemption requests with documents by 6 June.', programme: 'MBA-26', programmeLabel: 'MBA - Batch 2026', time: '1d ago', pinned: true },
  { id: 'a3', title: 'Preparatory Leave Notice', body: 'Preparatory leave from 10 Jun to 14 Jun. No classes. Library open 8 AM – 8 PM.', programme: 'all', programmeLabel: 'All Programmes', time: '3d ago', pinned: false },
];

const EVENT_STYLES: Record<string, { color: string; bg: string; label: string }> = {
  exam: { color: '#DC2626', bg: 'rgba(220,38,38,0.07)', label: 'Exam' },
  assignment: { color: '#8F3B00', bg: 'rgba(143,59,0,0.07)', label: 'Assignment' },
  quiz: { color: '#7C3AED', bg: 'rgba(124,58,237,0.07)', label: 'Quiz' },
};

const GRADING_STATUS: Record<string, { color: string }> = {
  new: { color: '#072FB5' },
  pending: { color: '#D97706' },
  overdue: { color: '#DC2626' },
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function Dashboard({ userName = 'Dr. Sharma' }: { userName?: string }) {
  const unansweredCount = FORUM_THREADS.filter(t => t.status === 'unanswered').length;
  const flaggedCount = FORUM_THREADS.filter(t => t.status === 'flagged').length;

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0 }}>
          Good afternoon, {userName}
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 6, fontWeight: 500, lineHeight: 1.5 }}>
          Saturday, 7 June 2026
        </p>
      </div>

      {/* ═══ UPCOMING — full width hero section ═══ */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calendar size={16} strokeWidth={1.5} style={{ color: 'var(--text-tertiary)' }} />
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', margin: 0, letterSpacing: '-0.01em' }}>Upcoming</h2>
          </div>
          <Link href="/coordinator/schedule" style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--blue-700)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>
            View full schedule <ChevronRight size={13} />
          </Link>
        </div>

        {/* Timeline-style event cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {UPCOMING.slice(0, 4).map(event => {
            const es = EVENT_STYLES[event.type];
            return (
              <div key={event.id} style={{
                background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)',
                padding: '16px 18px', position: 'relative', overflow: 'hidden',
                borderTop: `3px solid ${es.color}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: es.color, background: es.bg, padding: '2px 8px', borderRadius: 'var(--radius-xs)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{es.label}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{event.programme}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 8 }}>{event.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{event.date}</span>
                  {event.time && <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>{event.time}</span>}
                </div>
                {event.course && <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>{event.course}</div>}
                {event.note && <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2, fontStyle: 'italic' }}>{event.note}</div>}
              </div>
            );
          })}
        </div>

        {/* Remaining events as compact list */}
        {UPCOMING.length > 4 && (
          <div style={{ display: 'flex', gap: 16, marginTop: 10, paddingLeft: 2 }}>
            {UPCOMING.slice(4).map(event => {
              const es = EVENT_STYLES[event.type];
              return (
                <div key={event.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: es.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)' }}>{event.title}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>{event.date}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ═══ GRADING QUEUE ═══ */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ClipboardCheck size={16} strokeWidth={1.5} style={{ color: 'var(--text-tertiary)' }} />
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', margin: 0, letterSpacing: '-0.01em' }}>Grading Queue</h2>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#072FB5', background: 'rgba(7,47,181,0.06)', padding: '2px 8px', borderRadius: 'var(--radius-xs)' }}>{GRADING_ITEMS.filter(g => g.status === 'new').length} new</span>
            {GRADING_ITEMS.some(g => g.status === 'overdue') && (
              <span style={{ fontSize: 10, fontWeight: 700, color: '#DC2626', background: 'rgba(220,38,38,0.06)', padding: '2px 8px', borderRadius: 'var(--radius-xs)' }}>{GRADING_ITEMS.filter(g => g.status === 'overdue').length} overdue</span>
            )}
          </div>
          <Link href="/coordinator/grading" style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--blue-700)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>
            View all submissions <ChevronRight size={13} />
          </Link>
        </div>

        <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
          {GRADING_ITEMS.map((item, i) => {
            const sc = GRADING_STATUS[item.status];
            return (
              <Link key={item.id} href="/coordinator/grading" style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '12px 22px', cursor: 'pointer',
                  borderBottom: i < GRADING_ITEMS.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                  background: item.status === 'overdue' ? 'rgba(220,38,38,0.02)' : 'transparent',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.015)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = item.status === 'overdue' ? 'rgba(220,38,38,0.02)' : 'transparent'; }}
                >
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--bg-section)', border: '1px solid var(--border-subtle)', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', flexShrink: 0 }}>{item.studentInitials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>{item.studentName} <span style={{ fontWeight: 400, color: 'var(--text-tertiary)' }}>submitted</span> {item.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                      <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--blue-700)', background: 'rgba(7,47,181,0.06)', padding: '1px 6px', borderRadius: 'var(--radius-xs)', fontFamily: 'var(--font-mono)' }}>{item.courseCode}</span>
                      <span style={{ fontSize: 10.5, color: 'var(--text-tertiary)' }}>{item.submittedAt}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: sc.color, background: `${sc.color}10`, padding: '3px 10px', borderRadius: 'var(--radius-xs)', textTransform: 'capitalize', flexShrink: 0 }}>{item.status}</span>
                  <ChevronRight size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ═══ TWO COLUMN: Forums + Announcements ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Forum Activity */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <MessageSquare size={15} strokeWidth={1.5} style={{ color: 'var(--text-tertiary)' }} />
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', margin: 0 }}>Forum Activity</h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {unansweredCount > 0 && (
                <span style={{ fontSize: 10, fontWeight: 700, color: '#D97706', background: 'rgba(217,119,6,0.08)', padding: '3px 8px', borderRadius: 'var(--radius-xs)' }}>{unansweredCount} unanswered</span>
              )}
              {flaggedCount > 0 && (
                <span style={{ fontSize: 10, fontWeight: 700, color: '#DC2626', background: 'rgba(220,38,38,0.08)', padding: '3px 8px', borderRadius: 'var(--radius-xs)' }}>{flaggedCount} flagged</span>
              )}
            </div>
          </div>
          <div>
            {FORUM_THREADS.map((thread, i) => {
              const isFlagged = thread.status === 'flagged';
              const isUnanswered = thread.status === 'unanswered';
              const dotColor = isFlagged ? '#DC2626' : isUnanswered ? '#D97706' : '#059669';
              return (
                <Link key={thread.id} href="/coordinator/forums" style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex', gap: 12, padding: '14px 22px', cursor: 'pointer',
                    borderBottom: i < FORUM_THREADS.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                    background: isFlagged ? 'rgba(220,38,38,0.02)' : 'transparent',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.02)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = isFlagged ? 'rgba(220,38,38,0.02)' : 'transparent'; }}
                  >
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: isFlagged ? 'rgba(220,38,38,0.06)' : 'var(--bg-section)', border: '1px solid var(--border-subtle)', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 700, color: isFlagged ? '#DC2626' : 'var(--text-secondary)', flexShrink: 0, marginTop: 1 }}>{thread.authorInitials}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 3 }}>{thread.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--blue-700)', background: 'rgba(7,47,181,0.06)', padding: '1px 6px', borderRadius: 'var(--radius-xs)', fontFamily: 'var(--font-mono)' }}>{thread.course}</span>
                        <span style={{ fontSize: 10.5, color: 'var(--text-tertiary)' }}>{thread.author}</span>
                        <span style={{ fontSize: 10.5, color: 'var(--text-tertiary)' }}>&middot; {thread.time}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0, paddingTop: 2 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: dotColor }} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <MessageSquare size={10} style={{ color: 'var(--text-tertiary)' }} />
                        <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600, color: thread.replies === 0 ? '#D97706' : 'var(--text-tertiary)' }}>{thread.replies}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          <Link href="/coordinator/forums" style={{ textDecoration: 'none' }}>
            <div style={{ padding: '12px 22px', borderTop: '1px solid var(--border-subtle)', textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--blue-700)', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(7,47,181,0.02)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >View all threads &rarr;</div>
          </Link>
        </div>

        {/* Recent Announcements */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Megaphone size={15} strokeWidth={1.5} style={{ color: 'var(--text-tertiary)' }} />
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', margin: 0 }}>Recent Announcements</h3>
            </div>
            <Link href="/coordinator/announcements" style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--blue-700)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>
              New <span style={{ fontSize: 13 }}>+</span>
            </Link>
          </div>
          <div>
            {ANNOUNCEMENTS.map((ann, i) => (
              <Link key={ann.id} href="/coordinator/announcements" style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: '16px 22px', cursor: 'pointer',
                  borderBottom: i < ANNOUNCEMENTS.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                  borderLeft: ann.pinned ? '3px solid var(--blue-700)' : '3px solid transparent',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.015)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    {ann.pinned && <Pin size={10} style={{ color: 'var(--blue-700)', transform: 'rotate(45deg)' }} />}
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>{ann.title}</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{ann.body}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: ann.programme === 'all' ? '#059669' : '#072FB5', background: ann.programme === 'all' ? 'rgba(5,150,105,0.06)' : 'rgba(7,47,181,0.06)', padding: '2px 7px', borderRadius: 'var(--radius-xs)' }}>{ann.programmeLabel}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 500 }}>{ann.time}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/coordinator/announcements" style={{ textDecoration: 'none' }}>
            <div style={{ padding: '12px 22px', borderTop: '1px solid var(--border-subtle)', textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--blue-700)', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(7,47,181,0.02)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >View all announcements &rarr;</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
