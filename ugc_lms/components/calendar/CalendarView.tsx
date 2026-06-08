'use client';
import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Video, FileEdit, HelpCircle, BookOpen, TreePalm, Clock } from 'lucide-react';

// ─── Types & Config ────────────────────────────────────────────────────────────

type EventType = 'live_session' | 'assignment' | 'quiz' | 'exam' | 'holiday';

interface CalendarEvent {
  id: string;
  type: EventType;
  title: string;
  course?: string;
  date: string; // YYYY-MM-DD
  time?: string;
  duration?: string;
}

const EVENT_CONFIG: Record<EventType, { icon: React.ElementType; label: string; color: string; bg: string }> = {
  live_session: { icon: Video, label: 'Live Session', color: '#072FB5', bg: 'rgba(7,47,181,0.08)' },
  assignment: { icon: FileEdit, label: 'Assignment', color: '#8F3B00', bg: 'rgba(143,59,0,0.08)' },
  quiz: { icon: HelpCircle, label: 'Quiz', color: '#7C3AED', bg: 'rgba(124,58,237,0.08)' },
  exam: { icon: BookOpen, label: 'Exam', color: '#DC2626', bg: 'rgba(220,38,38,0.08)' },
  holiday: { icon: TreePalm, label: 'Holiday', color: '#16A34A', bg: 'rgba(22,163,74,0.08)' },
};

// ─── Mock Events ───────────────────────────────────────────────────────────────

const now = new Date();
const y = now.getFullYear();
const m = now.getMonth();

function d(day: number, monthOff = 0): string {
  const dt = new Date(y, m + monthOff, day);
  return dt.toISOString().split('T')[0];
}

const EVENTS: CalendarEvent[] = [
  { id: 'e1', type: 'live_session', title: 'Counselling - Managerial Economics', course: 'MBA-101', date: d(4), time: '10:00 AM', duration: '1.5 hrs' },
  { id: 'e2', type: 'assignment', title: 'Case Study: Elasticity Analysis', course: 'MBA-101', date: d(6), time: '11:59 PM' },
  { id: 'e3', type: 'live_session', title: 'Communication Workshop', course: 'MBA-102', date: d(8), time: '2:00 PM', duration: '2 hrs' },
  { id: 'e4', type: 'quiz', title: 'Module 2 Assessment', course: 'MBA-102', date: d(9), time: '9:00 AM', duration: '60 min' },
  { id: 'e4b', type: 'assignment', title: 'OB Case Study Due', course: 'MBA-104', date: d(9), time: '11:59 PM' },
  { id: 'e4c', type: 'live_session', title: 'Economics Office Hours', course: 'MBA-101', date: d(9), time: '4:00 PM', duration: '1 hr' },
  { id: 'e5', type: 'assignment', title: 'Financial Statements Project', course: 'MBA-103', date: d(12), time: '11:59 PM' },
  { id: 'e6', type: 'live_session', title: 'Statistics Lab Session', course: 'MBA-105', date: d(14), time: '11:00 AM', duration: '1.5 hrs' },
  { id: 'e7', type: 'holiday', title: 'University Foundation Day', date: d(15) },
  { id: 'e8', type: 'live_session', title: 'OB Group Discussion', course: 'MBA-104', date: d(18), time: '3:00 PM', duration: '1 hr' },
  { id: 'e9', type: 'quiz', title: 'Business Law Quiz 2', course: 'MBA-106', date: d(20), time: '10:00 AM', duration: '30 min' },
  { id: 'e10', type: 'exam', title: 'Mid-Semester Examination', course: 'All Courses', date: d(23), time: '10:00 AM' },
  { id: 'e11', type: 'exam', title: 'Mid-Semester Examination', course: 'All Courses', date: d(24), time: '10:00 AM' },
  { id: 'e12', type: 'assignment', title: 'Leadership Case Analysis', course: 'MBA-104', date: d(27), time: '11:59 PM' },
  { id: 'e13', type: 'live_session', title: 'Accounting Review Session', course: 'MBA-103', date: d(28), time: '10:00 AM', duration: '2 hrs' },
  // Next month
  { id: 'e14', type: 'live_session', title: 'Economics Seminar', course: 'MBA-101', date: d(3, 1), time: '10:00 AM', duration: '1.5 hrs' },
  { id: 'e15', type: 'exam', title: 'End-Semester Examination', course: 'All Courses', date: d(15, 1), time: '10:00 AM' },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getMonthGrid(year: number, month: number): (number | null)[][] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1; // Monday-based
  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = Array(startOffset).fill(null);
  for (let day = 1; day <= daysInMonth; day++) {
    week.push(day);
    if (week.length === 7) { weeks.push(week); week = []; }
  }
  if (week.length > 0) { while (week.length < 7) week.push(null); weeks.push(week); }
  return weeks;
}

function toKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function isToday(year: number, month: number, day: number): boolean {
  const t = new Date();
  return t.getFullYear() === year && t.getMonth() === month && t.getDate() === day;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function CalendarView() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(toKey(today.getFullYear(), today.getMonth(), today.getDate()));
  const [activeFilters, setActiveFilters] = useState<Set<EventType>>(new Set(['live_session', 'assignment', 'quiz', 'exam', 'holiday']));

  const toggleFilter = (type: EventType) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type); else next.add(type);
      return next;
    });
  };

  const filteredEvents = useMemo(() => EVENTS.filter(e => activeFilters.has(e.type)), [activeFilters]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    filteredEvents.forEach(e => { (map[e.date] ??= []).push(e); });
    return map;
  }, [filteredEvents]);

  const weeks = getMonthGrid(viewYear, viewMonth);

  const goToday = () => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); setSelectedDate(toKey(today.getFullYear(), today.getMonth(), today.getDate())); };
  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };

  const selectedEvents = selectedDate ? (eventsByDate[selectedDate] ?? []) : [];

  // Upcoming 7 days
  const upcoming = useMemo(() => {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const end = new Date(start); end.setDate(end.getDate() + 7);
    return filteredEvents
      .filter(e => { const ed = new Date(e.date); return ed >= start && ed <= end; })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredEvents]);

  return (
    <div style={{ padding: '24px 48px 64px', maxWidth: 1400, width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <span className="label">Schedule</span>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', margin: '4px 0 0' }}>
          Academic Calendar
        </h1>
      </div>

      <div style={{ display: 'flex', gap: 20 }}>
        {/* ── LEFT: Calendar Grid ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button onClick={prevMonth} style={{ width: 30, height: 30, display: 'grid', placeItems: 'center', background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
                <ChevronLeft size={14} color="var(--text-secondary)" />
              </button>
              <span style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', minWidth: 180, textAlign: 'center' }}>
                {MONTHS[viewMonth]} {viewYear}
              </span>
              <button onClick={nextMonth} style={{ width: 30, height: 30, display: 'grid', placeItems: 'center', background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
                <ChevronRight size={14} color="var(--text-secondary)" />
              </button>
              <button onClick={goToday} style={{ padding: '5px 12px', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)', marginLeft: 4 }}>
                Today
              </button>
            </div>

            {/* Event type filters */}
            <div style={{ display: 'flex', gap: 4 }}>
              {(Object.keys(EVENT_CONFIG) as EventType[]).map(type => {
                const cfg = EVENT_CONFIG[type];
                const active = activeFilters.has(type);
                return (
                  <button key={type} onClick={() => toggleFilter(type)} style={{
                    display: 'flex', alignItems: 'center', gap: 4, padding: '4px 9px',
                    fontSize: 10, fontWeight: 600, fontFamily: 'var(--font-sans)',
                    color: active ? cfg.color : 'var(--text-tertiary)',
                    background: active ? cfg.bg : 'transparent',
                    border: '1px solid ' + (active ? cfg.color + '30' : 'var(--border-subtle)'),
                    borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                    opacity: active ? 1 : 0.5, transition: 'all 0.1s ease',
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: active ? cfg.color : 'var(--text-tertiary)' }} />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Calendar grid */}
          <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--border-subtle)' }}>
              {DAYS.map(day => (
                <div key={day} style={{ padding: '10px 0', textAlign: 'center', fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {day}
                </div>
              ))}
            </div>

            {/* Weeks */}
            {weeks.map((week, wi) => (
              <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: wi < weeks.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                {week.map((day, di) => {
                  if (day === null) return <div key={di} style={{ minHeight: 90, background: 'var(--bg-section)', borderRight: di < 6 ? '1px solid var(--border-subtle)' : 'none' }} />;
                  const key = toKey(viewYear, viewMonth, day);
                  const dayEvents = eventsByDate[key] ?? [];
                  const isTod = isToday(viewYear, viewMonth, day);
                  const isSel = selectedDate === key;
                  const isWeekend = di >= 5;
                  const hasEvents = dayEvents.length > 0;
                  // Pick the most urgent event color for the accent
                  const priorityOrder: EventType[] = ['exam', 'assignment', 'quiz', 'live_session', 'holiday'];
                  const accentType = hasEvents ? priorityOrder.find(t => dayEvents.some(e => e.type === t)) ?? dayEvents[0].type : null;
                  const accentColor = accentType ? EVENT_CONFIG[accentType].color : null;
                  return (
                    <div
                      key={di}
                      onClick={() => setSelectedDate(key)}
                      style={{
                        minHeight: 90, cursor: 'pointer',
                        borderRight: di < 6 ? '1px solid var(--border-subtle)' : 'none',
                        background: isSel ? 'rgba(7,47,181,0.04)' : isWeekend ? 'rgba(0,0,0,0.012)' : 'transparent',
                        transition: 'background 0.1s ease',
                        display: 'flex', flexDirection: 'column',
                        padding: '5px 6px',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                      onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; }}
                      onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = isWeekend ? 'rgba(0,0,0,0.015)' : 'transparent'; }}
                    >
                      {/* Date number — top right */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
                        <span style={{
                          width: 24, height: 24, display: 'grid', placeItems: 'center',
                          fontSize: 11, fontWeight: isTod || hasEvents ? 700 : 500,
                          fontFamily: 'var(--font-mono)',
                          color: isTod ? '#fff' : hasEvents ? 'var(--text-primary)' : 'var(--text-secondary)',
                          background: isTod ? 'var(--text-primary)' : 'transparent',
                          borderRadius: '50%',
                        }}>
                          {day}
                        </span>
                      </div>

                      {/* Event labels — up to 2, then +N */}
                      {hasEvents && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                          {dayEvents.slice(0, 2).map(ev => {
                            const cfg = EVENT_CONFIG[ev.type];
                            return (
                              <div key={ev.id} style={{
                                fontSize: 9, fontWeight: 600, lineHeight: 1.3,
                                color: cfg.color, background: cfg.bg,
                                padding: '2px 4px', borderLeft: '2px solid ' + cfg.color,
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                              }}>
                                {ev.title}
                              </div>
                            );
                          })}
                          {dayEvents.length > 2 && (
                            <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-tertiary)', paddingLeft: 4 }}>+{dayEvents.length - 2} more</div>
                          )}
                        </div>
                      )}

                      {/* Selected indicator */}
                      {isSel && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'var(--text-primary)' }} />}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Selected Day Panel ── */}
        <div style={{ width: 280, flexShrink: 0 }}>
          {/* Selected date events */}
          <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '18px 16px', marginBottom: 16, position: 'sticky', top: 24 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 8 }}>
              {selectedDate ? new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'Select a date'}
            </div>

            {selectedEvents.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {selectedEvents.map(ev => {
                  const cfg = EVENT_CONFIG[ev.type];
                  const Icon = cfg.icon;
                  return (
                    <div key={ev.id} style={{ padding: '10px 12px', borderLeft: '3px solid ' + cfg.color, background: cfg.bg, borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                        <Icon size={10} strokeWidth={2.2} style={{ color: cfg.color }} />
                        <span style={{ fontSize: 9, fontWeight: 700, color: cfg.color, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{cfg.label}</span>
                      </div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', marginBottom: 2 }}>
                        {ev.title}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>
                        {[ev.course, ev.time, ev.duration].filter(Boolean).join(' · ')}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 12, fontWeight: 500 }}>
                No events on this day
              </div>
            )}
          </div>

          {/* Upcoming 7 days */}
          <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '18px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 12 }}>
              <Clock size={11} style={{ color: 'var(--text-tertiary)' }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Next 7 days</span>
            </div>

            {upcoming.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {upcoming.map(ev => {
                  const cfg = EVENT_CONFIG[ev.type];
                  const Icon = cfg.icon;
                  const evDate = new Date(ev.date + 'T12:00:00');
                  const dayLabel = isToday(evDate.getFullYear(), evDate.getMonth(), evDate.getDate()) ? 'Today' : evDate.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
                  return (
                    <div key={ev.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', background: cfg.bg, border: '1px solid ' + cfg.color + '25', display: 'grid', placeItems: 'center', flexShrink: 0, marginTop: 1 }}>
                        <Icon size={9} strokeWidth={2.5} style={{ color: cfg.color }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {ev.title}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 500 }}>
                          {dayLabel}{ev.time ? ' · ' + ev.time : ''}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: '12px 0', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 12, fontWeight: 500 }}>
                Nothing scheduled
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
