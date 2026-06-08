'use client';
import { useState } from 'react';
import { Search, ChevronDown, BookOpen, FileText, HelpCircle, Clock } from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────

type EventType = 'exam' | 'assignment' | 'quiz';

interface ScheduleEvent {
  id: string;
  title: string;
  type: EventType;
  date: string; // sortable YYYY-MM-DD
  dateLabel: string;
  day: string;
  time?: string;
  course: string;
  courseName: string;
  programme: string;
  maxMarks?: number;
  duration?: string;
  venue?: string;
  submissions?: number;
  totalStudents?: number;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────

const EVENTS: ScheduleEvent[] = [
  // Upcoming
  { id: 'sc1', title: 'Business Statistics Project', type: 'assignment', date: '2026-06-08', dateLabel: '8 Jun', day: 'Monday', time: '11:59 PM', course: 'MBA-105', courseName: 'Business Statistics', programme: 'MBA-26', maxMarks: 50, submissions: 4, totalStudents: 10 },
  { id: 'sc2', title: 'Module 3 Quiz — Contract Law', type: 'quiz', date: '2026-06-10', dateLabel: '10 Jun', day: 'Wednesday', time: '9:00 AM', course: 'MBA-106', courseName: 'Business Law & Ethics', programme: 'MBA-26', maxMarks: 20, duration: '30 min' },
  { id: 'sc3', title: 'End Sem — Managerial Economics', type: 'exam', date: '2026-06-15', dateLabel: '15 Jun', day: 'Monday', time: '10:00 AM', course: 'MBA-101', courseName: 'Managerial Economics', programme: 'MBA-26', maxMarks: 75, duration: '3h', venue: 'Hall A, Block 3' },
  { id: 'sc4', title: 'End Sem — Managerial Communication', type: 'exam', date: '2026-06-17', dateLabel: '17 Jun', day: 'Wednesday', time: '10:00 AM', course: 'MBA-102', courseName: 'Managerial Communication', programme: 'MBA-26', maxMarks: 75, duration: '3h', venue: 'Hall A, Block 3' },
  { id: 'sc5', title: 'End Sem — Financial Accounting', type: 'exam', date: '2026-06-19', dateLabel: '19 Jun', day: 'Friday', time: '10:00 AM', course: 'MBA-103', courseName: 'Financial Accounting', programme: 'MBA-26', maxMarks: 75, duration: '3h', venue: 'Hall B, Block 3' },
  { id: 'sc6', title: 'End Sem — Organizational Behaviour', type: 'exam', date: '2026-06-21', dateLabel: '21 Jun', day: 'Sunday', time: '10:00 AM', course: 'MBA-104', courseName: 'Organizational Behaviour', programme: 'MBA-26', maxMarks: 75, duration: '3h', venue: 'Hall A, Block 3' },
  { id: 'sc7', title: 'OB Reflection Paper', type: 'assignment', date: '2026-06-22', dateLabel: '22 Jun', day: 'Monday', time: '11:59 PM', course: 'MBA-104', courseName: 'Organizational Behaviour', programme: 'MBA-26', maxMarks: 50, submissions: 0, totalStudents: 10 },
  { id: 'sc8', title: 'End Sem — Business Statistics', type: 'exam', date: '2026-06-23', dateLabel: '23 Jun', day: 'Tuesday', time: '10:00 AM', course: 'MBA-105', courseName: 'Business Statistics', programme: 'MBA-26', maxMarks: 75, duration: '3h', venue: 'Hall B, Block 3' },
  { id: 'sc9', title: 'End Sem — Business Law & Ethics', type: 'exam', date: '2026-06-25', dateLabel: '25 Jun', day: 'Thursday', time: '10:00 AM', course: 'MBA-106', courseName: 'Business Law & Ethics', programme: 'MBA-26', maxMarks: 75, duration: '2h', venue: 'Hall A, Block 3' },
  { id: 'sc10', title: 'Leadership Case Analysis', type: 'assignment', date: '2026-06-28', dateLabel: '28 Jun', day: 'Sunday', time: '11:59 PM', course: 'MBA-104', courseName: 'Organizational Behaviour', programme: 'MBA-26', maxMarks: 50, submissions: 0, totalStudents: 10 },
  { id: 'sc11', title: 'Data Structures Lab 5', type: 'assignment', date: '2026-06-12', dateLabel: '12 Jun', day: 'Friday', time: '11:59 PM', course: 'BCA-201', courseName: 'Data Structures', programme: 'BCA-26', maxMarks: 30, submissions: 0, totalStudents: 120 },
  { id: 'sc12', title: 'Module 4 Quiz — Sorting Algorithms', type: 'quiz', date: '2026-06-14', dateLabel: '14 Jun', day: 'Sunday', time: '10:00 AM', course: 'BCA-201', courseName: 'Data Structures', programme: 'BCA-26', maxMarks: 25, duration: '45 min' },
  // Past (completed)
  { id: 'sc13', title: 'Case Study: Elasticity Analysis', type: 'assignment', date: '2026-06-03', dateLabel: '3 Jun', day: 'Wednesday', time: '11:59 PM', course: 'MBA-101', courseName: 'Managerial Economics', programme: 'MBA-26', maxMarks: 50, submissions: 10, totalStudents: 10 },
  { id: 'sc14', title: 'Business Communication Assessment', type: 'quiz', date: '2026-06-04', dateLabel: '4 Jun', day: 'Thursday', time: '10:00 AM', course: 'MBA-102', courseName: 'Managerial Communication', programme: 'MBA-26', maxMarks: 50, duration: '60 min' },
  { id: 'sc15', title: 'Financial Statement Analysis Report', type: 'assignment', date: '2026-06-06', dateLabel: '6 Jun', day: 'Saturday', time: '11:59 PM', course: 'MBA-103', courseName: 'Financial Accounting', programme: 'MBA-26', maxMarks: 50, submissions: 8, totalStudents: 10 },
];

const TYPE_CONFIG: Record<EventType, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  exam: { label: 'Exam', color: '#DC2626', bg: 'rgba(220,38,38,0.06)', icon: BookOpen },
  assignment: { label: 'Assignment', color: '#8F3B00', bg: 'rgba(143,59,0,0.06)', icon: FileText },
  quiz: { label: 'Quiz', color: '#7C3AED', bg: 'rgba(124,58,237,0.06)', icon: HelpCircle },
};

const PROGRAMMES = [
  { id: 'all', name: 'All Programmes' },
  { id: 'MBA-26', name: 'MBA - Batch 2026' },
  { id: 'BCA-26', name: 'BCA - Batch 2026' },
  { id: 'CSE-26', name: 'B.Tech CSE - Batch 2026' },
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function ScheduleView() {
  const [typeFilter, setTypeFilter] = useState<EventType | 'all'>('all');
  const [programmeFilter, setProgrammeFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [search, setSearch] = useState('');

  const today = '2026-06-07';

  const filtered = EVENTS
    .filter(e => {
      if (typeFilter !== 'all' && e.type !== typeFilter) return false;
      if (programmeFilter !== 'all' && e.programme !== programmeFilter) return false;
      if (timeFilter === 'upcoming' && e.date <= today) return false;
      if (timeFilter === 'past' && e.date > today) return false;
      if (search && !e.title.toLowerCase().includes(search.toLowerCase()) && !e.course.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => timeFilter === 'past' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));

  // Group events by week
  const grouped: { label: string; events: ScheduleEvent[] }[] = [];
  let currentGroup = '';
  filtered.forEach(event => {
    const eventDate = new Date(event.date);
    const todayDate = new Date(today);
    const diffDays = Math.round((eventDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24));
    let groupLabel: string;
    if (diffDays <= 0) groupLabel = 'Past';
    else if (diffDays <= 1) groupLabel = 'Tomorrow';
    else if (diffDays <= 7) groupLabel = 'This Week';
    else if (diffDays <= 14) groupLabel = 'Next Week';
    else if (diffDays <= 30) groupLabel = 'This Month';
    else groupLabel = 'Later';

    if (groupLabel !== currentGroup) {
      grouped.push({ label: groupLabel, events: [] });
      currentGroup = groupLabel;
    }
    grouped[grouped.length - 1].events.push(event);
  });

  const upcomingCount = EVENTS.filter(e => e.date > today).length;
  const examCount = EVENTS.filter(e => e.date > today && e.type === 'exam').length;
  const assignmentCount = EVENTS.filter(e => e.date > today && e.type === 'assignment').length;
  const quizCount = EVENTS.filter(e => e.date > today && e.type === 'quiz').length;

  return (
    <div style={{ padding: '28px 40px', maxWidth: 1000 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', margin: 0 }}>Schedule</h1>
        <p style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500, marginTop: 4 }}>Upcoming assignments, quizzes &amp; exams across programmes</p>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '6px 8px' }}>
        {/* Time filter */}
        {(['upcoming', 'past', 'all'] as const).map(t => (
          <button key={t} onClick={() => setTimeFilter(t)} style={{
            padding: '5px 12px', fontSize: 11.5, fontWeight: timeFilter === t ? 700 : 500,
            color: timeFilter === t ? '#fff' : 'var(--text-secondary)',
            background: timeFilter === t ? 'var(--blue-700)' : 'transparent',
            border: 'none', borderRadius: 'var(--radius-xs)', cursor: 'pointer',
            fontFamily: 'var(--font-sans)', textTransform: 'capitalize',
          }}>{t}</button>
        ))}

        <span style={{ width: 1, height: 18, background: 'var(--border-subtle)', margin: '0 4px', flexShrink: 0 }} />

        {/* Type filter with counts */}
        {(['all', 'exam', 'assignment', 'quiz'] as const).map(t => {
          const cfg = t === 'all' ? null : TYPE_CONFIG[t];
          const isActive = typeFilter === t;
          const count = t === 'exam' ? examCount : t === 'assignment' ? assignmentCount : t === 'quiz' ? quizCount : upcomingCount;
          return (
            <button key={t} onClick={() => setTypeFilter(t)} style={{
              display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px',
              fontSize: 11.5, fontWeight: isActive ? 700 : 500,
              color: isActive ? (cfg?.color || 'var(--text-primary)') : 'var(--text-tertiary)',
              background: isActive && cfg ? cfg.bg : isActive ? 'var(--bg-section)' : 'transparent',
              border: 'none', borderRadius: 'var(--radius-xs)', cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
            }}>
              {cfg && <cfg.icon size={11} style={{ color: isActive ? cfg.color : 'var(--text-tertiary)' }} />}
              {t === 'all' ? 'All' : cfg!.label}
              {t !== 'all' && <span style={{ fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-mono)', opacity: 0.7 }}>({count})</span>}
            </button>
          );
        })}

        <span style={{ width: 1, height: 18, background: 'var(--border-subtle)', margin: '0 4px', flexShrink: 0 }} />

        <select value={programmeFilter} onChange={e => setProgrammeFilter(e.target.value)} style={{
          padding: '5px 28px 5px 8px', fontSize: 11.5, fontWeight: 500, color: 'var(--text-secondary)',
          background: 'transparent', border: 'none', fontFamily: 'var(--font-sans)', outline: 'none', cursor: 'pointer',
          appearance: 'none', WebkitAppearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
        }}>
          {PROGRAMMES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>

        <div style={{ position: 'relative', marginLeft: 'auto' }}>
          <Search size={12} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{
            width: 150, padding: '5px 8px 5px 26px', fontSize: 11.5, fontWeight: 500,
            border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)',
            background: 'var(--bg-section)', fontFamily: 'var(--font-sans)', outline: 'none', color: 'var(--text-primary)',
          }} />
        </div>
      </div>

      {/* Grouped event list */}
      {grouped.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', padding: '48px', textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>No events found</div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Try adjusting your filters</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {grouped.map(group => (
            <div key={group.label}>
              {/* Group header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{group.label}</span>
                <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
                <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)' }}>{group.events.length} event{group.events.length !== 1 ? 's' : ''}</span>
              </div>

              {/* Events */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {group.events.map(event => {
                  const cfg = TYPE_CONFIG[event.type];
                  const Icon = cfg.icon;
                  const isPast = event.date <= today;
                  return (
                    <div key={event.id} style={{
                      background: '#fff', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)',
                      padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16,
                      opacity: isPast ? 0.6 : 1,
                      borderLeft: `3px solid ${cfg.color}`,
                    }}>
                      {/* Date block */}
                      <div style={{ width: 52, textAlign: 'center', flexShrink: 0 }}>
                        <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', lineHeight: 1 }}>{event.dateLabel.split(' ')[0]}</div>
                        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginTop: 2 }}>{event.dateLabel.split(' ')[1]}</div>
                        <div style={{ fontSize: 9, color: 'var(--text-tertiary)', marginTop: 1 }}>{event.day}</div>
                      </div>

                      {/* Divider */}
                      <div style={{ width: 1, height: 40, background: 'var(--border-subtle)', flexShrink: 0 }} />

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: cfg.color, background: cfg.bg, padding: '2px 7px', borderRadius: 'var(--radius-xs)', display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Icon size={10} /> {cfg.label}
                          </span>
                          <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--blue-700)', background: 'rgba(7,47,181,0.06)', padding: '2px 6px', borderRadius: 'var(--radius-xs)', fontFamily: 'var(--font-mono)' }}>{event.course}</span>
                        </div>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>{event.title}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 3 }}>{event.courseName} &middot; {event.programme}</div>
                      </div>

                      {/* Right meta */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                        {event.time && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Clock size={11} style={{ color: 'var(--text-tertiary)' }} />
                            <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{event.time}</span>
                          </div>
                        )}
                        {event.duration && (
                          <span style={{ fontSize: 10.5, color: 'var(--text-tertiary)', fontWeight: 500 }}>{event.duration}</span>
                        )}
                        {event.maxMarks && (
                          <span style={{ fontSize: 10.5, color: 'var(--text-tertiary)', fontWeight: 500 }}>{event.maxMarks} marks</span>
                        )}
                        {event.venue && (
                          <span style={{ fontSize: 10, color: 'var(--text-tertiary)', fontStyle: 'italic' }}>{event.venue}</span>
                        )}
                        {event.submissions !== undefined && (
                          <span style={{ fontSize: 10, fontWeight: 600, color: event.submissions === event.totalStudents ? '#059669' : '#D97706' }}>{event.submissions}/{event.totalStudents} submitted</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
