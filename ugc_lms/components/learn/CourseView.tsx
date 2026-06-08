'use client';
import { useState, useRef, useEffect } from 'react';
import { COURSES, LEARNING_PATH } from '@/lib/mockData';
import { ChevronLeft, ChevronDown, ChevronRight, Play, ArrowRight, Video, HelpCircle, FileText, FileDown, PanelLeftOpen, Filter, Layers, MonitorPlay, BookOpenText, MessageSquare, ClipboardCheck, CheckCircle2, Search } from 'lucide-react';
import VideoActivity from './VideoActivity';
import PageActivity from './PageActivity';
import QuizActivity from './QuizActivity';
import PdfActivity from './PdfActivity';
import FocusToolbar from './FocusToolbar';
import { usePrototype } from '@/context/PrototypeContext';

const TYPE_ICONS: Record<string, React.ElementType> = {
  all: Layers,
  video: Video,
  quiz: HelpCircle,
  page: FileText,
  pdf: FileDown,
};
const TYPE_LABELS: Record<string, string> = { all: 'All types', video: 'Video', quiz: 'Quiz', page: 'Page', pdf: 'PDF' };

// ─── Unit/Quadrant hierarchy ────────────────────────────────────────────────

type QuadrantType = 'live_session' | 'e_tutorial' | 'e_content' | 'discussion' | 'assessment';

interface UnitActivity { id: string; title: string; done: boolean; current?: boolean; duration: string; type: string; }
interface Quadrant { type: QuadrantType; activities: UnitActivity[]; }
interface Unit { id: string; number: number; title: string; quadrants: Quadrant[]; }

const QUADRANT_META: Record<QuadrantType, { icon: React.ElementType; label: string; color: string }> = {
  live_session: { icon: Video, label: 'Live Session', color: '#072FB5' },
  e_tutorial: { icon: MonitorPlay, label: 'E-Tutorial', color: '#8F3B00' },
  e_content: { icon: BookOpenText, label: 'E-Content', color: '#7C3AED' },
  discussion: { icon: MessageSquare, label: 'Discussion', color: '#0DA88F' },
  assessment: { icon: ClipboardCheck, label: 'Assessment', color: '#DC2626' },
};

const UNITS: Unit[] = [
  { id: 'u1', number: 1, title: 'Introduction to the Subject', quadrants: [
    { type: 'live_session', activities: [{ id: 'lp-ls1', title: 'Orientation Session', done: true, duration: '1.5 hrs', type: 'video' }] },
    { type: 'e_tutorial', activities: [
      { id: 'lp-2', title: 'Voice Modulation & Tone Control', done: true, duration: '14:20', type: 'video' },
      { id: 'lp-5', title: 'Pronunciation & Accent Clarity', done: true, duration: '18:45', type: 'video' },
    ]},
    { type: 'e_content', activities: [
      { id: 'lp-1', title: 'Introduction to Professional Communication', done: true, duration: '~6 min read', type: 'page' },
      { id: 'lp-3', title: 'The Seven Principles of Effective Communication', done: true, duration: '~11 min read', type: 'page' },
    ]},
    { type: 'discussion', activities: [{ id: 'lp-d1', title: 'Introduce Yourself', done: true, duration: 'Forum', type: 'page' }] },
    { type: 'assessment', activities: [{ id: 'lp-4', title: 'Check-in: Communication Fundamentals', done: true, duration: '5 questions', type: 'quiz' }] },
  ]},
  { id: 'u2', number: 2, title: 'Core Communication Skills', quadrants: [
    { type: 'live_session', activities: [{ id: 'lp-ls2', title: 'Communication Workshop', done: false, duration: '2 hrs', type: 'video' }] },
    { type: 'e_tutorial', activities: [
      { id: 'lp-7', title: 'Mastering Clarity & Pronunciation', done: false, duration: '22:15', type: 'video' },
      { id: 'lp-9', title: 'Structuring Compelling Presentations', done: false, duration: '28:30', type: 'video' },
    ]},
    { type: 'e_content', activities: [
      { id: 'lp-6', title: 'Spoken Excellence', done: false, current: true, duration: '~12 min read', type: 'page' },
      { id: 'lp-8', title: 'Non-Verbal Communication & Body Language', done: false, duration: '~12 min read', type: 'page' },
      { id: 'lp-8b', title: 'Reference Guide: Body Language Cheat Sheet', done: false, duration: '4 pages', type: 'pdf' },
    ]},
    { type: 'discussion', activities: [{ id: 'lp-d2', title: 'Discuss: Effective Communication Styles', done: false, duration: 'Forum', type: 'page' }] },
    { type: 'assessment', activities: [{ id: 'lp-10', title: 'Module 2 Assessment', done: false, duration: '10 questions', type: 'quiz' }] },
  ]},
  { id: 'u3', number: 3, title: 'Advanced Communication & Storytelling', quadrants: [
    { type: 'e_tutorial', activities: [
      { id: 'lp-11', title: 'Interview Communication Skills', done: false, duration: '24:10', type: 'video' },
    ]},
    { type: 'e_content', activities: [
      { id: 'lp-12', title: 'Storytelling in Professional Contexts', done: false, duration: '~15 min read', type: 'page' },
      { id: 'lp-12b', title: 'Case Study: Persuasive Narratives in Business', done: false, duration: '6 pages', type: 'pdf' },
    ]},
    { type: 'discussion', activities: [{ id: 'lp-d3', title: 'Share Your Story Framework', done: false, duration: 'Forum', type: 'page' }] },
    { type: 'assessment', activities: [{ id: 'lp-13', title: 'Final Assessment', done: false, duration: '20 questions', type: 'quiz' }] },
  ]},
];

// Flatten all activities for prev/next navigation
const ALL_ACTIVITIES = UNITS.flatMap(u => u.quadrants.flatMap(q => q.activities));

function UnitAccordion({ collapsed, searchQuery, selectedActivityId, onSelectActivity }: {
  collapsed: boolean; searchQuery: string; selectedActivityId: string; onSelectActivity: (id: string) => void;
}) {
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(() => {
    // Auto-expand unit containing current/selected activity
    for (const u of UNITS) {
      for (const q of u.quadrants) {
        if (q.activities.some(a => a.current || a.id === selectedActivityId)) return new Set([u.id]);
      }
    }
    return new Set([UNITS[0]?.id]);
  });
  const [expandedQuadrants, setExpandedQuadrants] = useState<Set<string>>(() => {
    for (const u of UNITS) {
      for (const q of u.quadrants) {
        if (q.activities.some(a => a.current || a.id === selectedActivityId)) return new Set([u.id + '-' + q.type]);
      }
    }
    return new Set();
  });

  const toggleUnit = (id: string) => setExpandedUnits(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const toggleQuadrant = (key: string) => setExpandedQuadrants(prev => { const n = new Set(prev); if (n.has(key)) n.delete(key); else n.add(key); return n; });

  if (collapsed) {
    return (
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {ALL_ACTIVITIES.map(a => (
          <div key={a.id} onClick={() => onSelectActivity(a.id)} title={a.title}
            style={{ display: 'flex', justifyContent: 'center', padding: '8px 0', cursor: 'pointer', background: a.id === selectedActivityId ? 'var(--bg-section)' : 'transparent', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'grid', placeItems: 'center', background: a.done ? 'var(--success-soft)' : a.current ? 'var(--accent-soft)' : 'var(--bg-section)' }}>
              {a.done ? <CheckCircle2 size={12} style={{ color: 'var(--green-600)' }} /> : <div style={{ width: 6, height: 6, borderRadius: '50%', background: a.current ? 'var(--blue-700)' : 'var(--border-subtle)' }} />}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const sq = searchQuery.toLowerCase();

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      {UNITS.map(unit => {
        const hasMatch = !sq || unit.quadrants.some(q => q.activities.some(a => a.title.toLowerCase().includes(sq)));
        if (sq && !hasMatch) return null;
        const isExpanded = expandedUnits.has(unit.id);
        const unitDone = unit.quadrants.every(q => q.activities.every(a => a.done));
        const unitActivityCount = unit.quadrants.reduce((s, q) => s + q.activities.length, 0);
        const unitDoneCount = unit.quadrants.reduce((s, q) => s + q.activities.filter(a => a.done).length, 0);

        return (
          <div key={unit.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            {/* Unit header */}
            <div
              onClick={() => toggleUnit(unit.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', cursor: 'pointer', background: isExpanded ? 'var(--bg-section)' : 'transparent', transition: 'background 0.1s' }}
              onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.background = 'rgba(0,0,0,0.02)'; }}
              onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontSize: 13, fontWeight: 800, color: unitDone ? 'var(--green-600)' : 'var(--text-primary)', fontFamily: 'var(--font-mono)', flexShrink: 0, width: 20 }}>
                {unit.number}.
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
                  {unit.title}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 500, marginTop: 2 }}>
                  {unitDoneCount}/{unitActivityCount} completed
                </div>
              </div>
              {unitDone && <CheckCircle2 size={14} style={{ color: 'var(--green-600)', flexShrink: 0 }} />}
              {isExpanded ? <ChevronDown size={13} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} /> : <ChevronRight size={13} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />}
            </div>

            {/* Quadrants */}
            {isExpanded && unit.quadrants.map(quad => {
              const qKey = unit.id + '-' + quad.type;
              const qExpanded = expandedQuadrants.has(qKey);
              const meta = QUADRANT_META[quad.type];
              const QIcon = meta.icon;
              const qDone = quad.activities.every(a => a.done);
              const matchActivities = sq ? quad.activities.filter(a => a.title.toLowerCase().includes(sq)) : quad.activities;
              if (sq && matchActivities.length === 0) return null;

              return (
                <div key={qKey}>
                  {/* Quadrant header */}
                  <div
                    onClick={() => toggleQuadrant(qKey)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px 8px 44px', cursor: 'pointer', borderTop: '1px dashed var(--border-subtle)', transition: 'background 0.1s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.015)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <QIcon size={13} strokeWidth={1.8} style={{ color: meta.color, flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)' }}>{meta.label}</span>
                    {qDone && <CheckCircle2 size={11} style={{ color: 'var(--green-600)', flexShrink: 0 }} />}
                    <span style={{ fontSize: 10, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{matchActivities.filter(a => a.done).length}/{matchActivities.length}</span>
                    {qExpanded ? <ChevronDown size={11} style={{ color: 'var(--text-tertiary)' }} /> : <ChevronRight size={11} style={{ color: 'var(--text-tertiary)' }} />}
                  </div>

                  {/* Activities */}
                  {qExpanded && matchActivities.map(act => {
                    const isSelected = act.id === selectedActivityId;
                    const isCurrent = act.current;
                    return (
                      <div
                        key={act.id}
                        onClick={() => onSelectActivity(act.id)}
                        data-tour={isCurrent ? 'current-activity' : undefined}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '8px 14px 8px 62px',
                          cursor: 'pointer',
                          background: isSelected ? 'var(--bg-pastel-beige-3)' : isCurrent ? 'var(--blue-50)' : 'transparent',
                          borderLeft: isSelected ? '2px solid var(--orange-600)' : '2px solid transparent',
                          transition: 'background 0.1s',
                        }}
                        onMouseEnter={e => { if (!isSelected && !isCurrent) e.currentTarget.style.background = 'var(--bg-section)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = isSelected ? 'var(--bg-pastel-beige-3)' : isCurrent ? 'var(--blue-50)' : 'transparent'; }}
                      >
                        {act.done ? (
                          <CheckCircle2 size={13} style={{ color: 'var(--green-600)', flexShrink: 0 }} />
                        ) : (
                          <div style={{ width: 13, height: 13, borderRadius: '50%', border: '1.5px solid ' + (isCurrent ? 'var(--blue-700)' : 'var(--border-subtle)'), background: isCurrent ? 'var(--blue-700)' : 'transparent', flexShrink: 0, display: 'grid', placeItems: 'center' }}>
                            {isCurrent && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }} />}
                          </div>
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: isCurrent ? 700 : 500, color: isCurrent ? 'var(--blue-700)' : act.done ? 'var(--text-secondary)' : 'var(--text-primary)', lineHeight: 1.3, textDecoration: act.done ? 'line-through' : 'none', textDecorationColor: 'var(--border-subtle)' }}>
                            {act.title}
                          </div>
                          <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 1 }}>{act.duration}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

const MIN_WIDTH = 200;
const MAX_WIDTH = 520;
const DEFAULT_WIDTH = 300;

export default function CourseView({ courseId, onBack }: { courseId: string; onBack: () => void }) {
  const course = COURSES.find(c => c.id === courseId) ?? COURSES[0];
  const { focusMode, setFocusMode } = usePrototype();

  const defaultActivityId = (LEARNING_PATH.find(a => (a as any).current) ?? LEARNING_PATH[0]).id;
  const [selectedActivityId, setSelectedActivityId] = useState<string>(defaultActivityId);
  const [quizActive, setQuizActive] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_WIDTH);
  const [searchQuery, setSearchQuery] = useState('');
  const [activityFilter, setActivityFilter] = useState<string>('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const isResizing = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(DEFAULT_WIDTH);

  const total = course.activities.videos.total + course.activities.quizzes.total + course.activities.pages.total;
  const done = course.activities.videos.done + course.activities.quizzes.done + course.activities.pages.done;
  const isComplete = course.status === 'completed';

  const selectedActivity = ALL_ACTIVITIES.find(a => a.id === selectedActivityId) ?? ALL_ACTIVITIES[0];
  const isQuizMode = selectedActivity.type === 'quiz' && quizActive;

  useEffect(() => { setQuizActive(false); }, [selectedActivityId]);

  useEffect(() => {
    if (isQuizMode) setCollapsed(true);
    else setCollapsed(false);
  }, [isQuizMode]);
  const selectedIdx = ALL_ACTIVITIES.findIndex(a => a.id === selectedActivityId);

  const handlePrev = () => { if (selectedIdx > 0) setSelectedActivityId(ALL_ACTIVITIES[selectedIdx - 1].id); };
  const handleNext = () => { if (selectedIdx < ALL_ACTIVITIES.length - 1) setSelectedActivityId(ALL_ACTIVITIES[selectedIdx + 1].id); };

  const activityProps = { onBack, onPrev: handlePrev, onNext: handleNext, hasPrev: selectedIdx > 0, hasNext: selectedIdx < ALL_ACTIVITIES.length - 1 };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      const delta = e.clientX - startX.current;
      setSidebarWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth.current + delta)));
    };
    const onUp = () => { isResizing.current = false; document.body.style.cursor = ''; document.body.style.userSelect = ''; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, []);

  // Close filter dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filterTypes = ['all', ...Array.from(new Set(LEARNING_PATH.map(i => i.type)))];

  // Focus mode keyboard shortcut — blocked during quiz
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isQuizMode) return; // quiz owns focus mode
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'f') {
        e.preventDefault();
        setFocusMode(!focusMode);
      }
      if (e.key === 'Escape' && focusMode) {
        setFocusMode(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [focusMode, setFocusMode, isQuizMode]);

  const onDragStart = (e: React.MouseEvent) => {
    isResizing.current = true;
    startX.current = e.clientX;
    startWidth.current = sidebarWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', borderRadius: (focusMode || isQuizMode) ? 0 : 'var(--radius-md)', border: (focusMode || isQuizMode) ? 'none' : '1px solid var(--border-subtle)', boxShadow: (focusMode || isQuizMode) ? 'none' : 'var(--shadow-sm)', position: 'relative' }}>

      {/* Focus mode toolbar */}
      {focusMode && (
        <FocusToolbar
          activityTitle={selectedActivity.title}
          activityType={selectedActivity.type}
          onExit={() => setFocusMode(false)}
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={selectedIdx > 0}
          hasNext={selectedIdx < LEARNING_PATH.length - 1}
        />
      )}

      {/* SIDEBAR */}
      {!isQuizMode && !focusMode && <div style={{
        width: collapsed ? 52 : sidebarWidth,
        flexShrink: collapsed ? undefined : 0,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        background: '#fff',
        borderRight: 'none',
        position: collapsed ? 'absolute' : 'relative',
        left: collapsed ? 8 : undefined,
        top: collapsed ? 8 : undefined,
        bottom: collapsed ? 8 : undefined,
        zIndex: collapsed ? 10 : undefined,
        borderRadius: collapsed ? 'var(--radius-md)' : undefined,
        border: collapsed ? '1px solid var(--border-subtle)' : undefined,
        boxShadow: collapsed ? '0 4px 20px rgba(15,15,15,0.10)' : undefined,
      }}>

        {/* Header */}
        <div style={{
          padding: collapsed ? '14px 0 12px' : '14px 16px 12px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-section)',
          flexShrink: 0,
          display: 'flex', flexDirection: 'column',
        }}>
          {collapsed ? (
            <button onClick={() => setCollapsed(false)} style={{
              display: 'grid', placeItems: 'center', margin: '0 auto',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-tertiary)', padding: 4,
            }}>
              <PanelLeftOpen size={16} />
            </button>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <button onClick={onBack} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)',
                  padding: 0, fontFamily: 'var(--font-sans)',
                  transition: 'color 0.12s ease',
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  <ChevronLeft size={13} /> Overview
                </button>
              </div>

              <div style={{
                fontSize: 15, fontWeight: 700, color: 'var(--text-primary)',
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.02em', lineHeight: 1.3, marginBottom: 12,
                overflow: 'hidden', display: '-webkit-box',
                WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              }}>
                {course.title}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                <div className="progress-track" style={{ flex: 1 }}>
                  <div
                    className={isComplete ? 'progress-fill progress-fill-success' : 'progress-fill'}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <span style={{
                  fontSize: 12, fontWeight: 800,
                  color: isComplete ? 'var(--green-600)' : 'var(--orange-600)',
                  fontFamily: 'var(--font-mono)',
                }}>
                  {course.progress}%
                </span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500 }}>
                {done} of {total} activities complete
              </div>
            </>
          )}
        </div>

        {/* Path heading + Search + Filter */}
        {!collapsed && (
          <div data-tour="activity-filter" style={{ borderBottom: '1px solid var(--border-subtle)', flexShrink: 0, padding: '10px 12px' }}>
            {/* Search + Filter row */}
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {/* Search — takes remaining space */}
              <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
                <input
                  type="text"
                  placeholder="Search…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 10px 6px 28px',
                    fontSize: 12,
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    background: 'var(--bg-section)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'var(--blue-700)'; e.currentTarget.style.background = '#fff'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.background = 'var(--bg-section)'; }}
                />
                <svg style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" color="var(--text-tertiary)">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </div>

              {/* Filter dropdown trigger — compact */}
              <div ref={filterRef} style={{ position: 'relative', flexShrink: 0 }}>
                <button
                  onClick={() => setFilterOpen(o => !o)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '6px 8px',
                    fontSize: 11, fontWeight: 600,
                    fontFamily: 'var(--font-sans)',
                    color: activityFilter !== 'all' ? 'var(--blue-700)' : 'var(--text-tertiary)',
                    background: activityFilter !== 'all' ? 'rgba(7,47,181,0.06)' : 'var(--bg-section)',
                    border: `1px solid ${activityFilter !== 'all' ? 'rgba(7,47,181,0.18)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {(() => { const Ic = TYPE_ICONS[activityFilter] || Layers; return <Ic size={11} strokeWidth={2} style={{ flexShrink: 0, opacity: 0.7 }} />; })()}
                  {activityFilter === 'all' ? 'All' : (TYPE_LABELS[activityFilter] || activityFilter)}
                  <ChevronDown size={10} strokeWidth={2} style={{ opacity: 0.4, transform: filterOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
                </button>

                {/* Dropdown panel */}
                {filterOpen && (
                  <div style={{
                    position: 'absolute', top: '100%', right: 0,
                    marginTop: 4,
                    minWidth: 180,
                    background: '#fff',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)',
                    overflow: 'hidden',
                    zIndex: 40,
                  }}>
                    {filterTypes.map(type => {
                      const active = activityFilter === type;
                      const Ic = TYPE_ICONS[type] || Layers;
                      const label = TYPE_LABELS[type] || type.charAt(0).toUpperCase() + type.slice(1);
                      const count = type === 'all' ? LEARNING_PATH.length : LEARNING_PATH.filter(i => i.type === type).length;
                      return (
                        <button
                          key={type}
                          onClick={() => { setActivityFilter(type); setFilterOpen(false); }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                            padding: '7px 12px',
                            fontSize: 12, fontWeight: active ? 700 : 500,
                            fontFamily: 'var(--font-sans)',
                            color: active ? 'var(--blue-700)' : 'var(--text-primary)',
                            background: active ? 'rgba(7,47,181,0.05)' : 'transparent',
                            border: 'none',
                            borderBottom: '1px solid var(--border-subtle)',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'background 0.1s ease',
                          }}
                          onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--bg-section)'; }}
                          onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                        >
                          <Ic size={12} strokeWidth={active ? 2.2 : 1.6} style={{ color: active ? 'var(--blue-700)' : 'var(--text-tertiary)', flexShrink: 0 }} />
                          <span style={{ flex: 1 }}>{label}</span>
                          <span style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 600 }}>{count}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Hierarchical unit list */}
        <UnitAccordion
          collapsed={collapsed}
          searchQuery={searchQuery}
          selectedActivityId={selectedActivityId}
          onSelectActivity={setSelectedActivityId}
        />

        {/* Drag resize handle */}
        {!collapsed && (
          <div onMouseDown={onDragStart} style={{
            position: 'absolute', top: 0, right: 0, width: 5, height: '100%',
            cursor: 'col-resize', zIndex: 10,
            background: 'transparent',
            transition: 'background 0.15s ease',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--blue-700)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          />
        )}
      </div>}

      {/* ACTIVITY CONTENT */}
      <div style={{ flex: 1, overflow: 'hidden', paddingLeft: focusMode ? 0 : ((!isQuizMode && collapsed) ? 68 : 0), paddingTop: focusMode ? 48 : 0, borderLeft: (isQuizMode || focusMode) ? 'none' : '1px solid #D7D7D7', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {selectedActivity.type === 'video' && <VideoActivity activity={selectedActivity as any} courseId={courseId} {...activityProps} />}
          {selectedActivity.type === 'page'  && <PageActivity  activity={selectedActivity as any} {...activityProps} />}
          {selectedActivity.type === 'pdf'   && <PdfActivity   activity={selectedActivity as any} {...activityProps} />}
          {selectedActivity.type === 'quiz'  && <QuizActivity  activity={selectedActivity as any} {...activityProps} onQuizStart={()=>setQuizActive(true)} onQuizEnd={()=>setQuizActive(false)} />}
        </div>
      </div>
    </div>
  );
}
