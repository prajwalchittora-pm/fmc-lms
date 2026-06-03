'use client';
import { useState, useRef, useEffect } from 'react';
import { COURSES, LEARNING_PATH } from '@/lib/mockData';
import { ChevronLeft, ChevronDown, Play, ArrowRight, Video, HelpCircle, FileText, FileDown, PanelLeftOpen, Filter, Layers } from 'lucide-react';
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

  const selectedActivity = LEARNING_PATH.find(a => a.id === selectedActivityId) ?? LEARNING_PATH[0];
  const isQuizMode = selectedActivity.type === 'quiz' && quizActive;

  // Reset quiz state when switching activities
  useEffect(() => { setQuizActive(false); }, [selectedActivityId]);

  // Collapse sidebar when quiz is active, restore when quiz ends
  useEffect(() => {
    if (isQuizMode) setCollapsed(true);
    else setCollapsed(false);
  }, [isQuizMode]);
  const selectedIdx = LEARNING_PATH.findIndex(a => a.id === selectedActivityId);

  const handlePrev = () => { if (selectedIdx > 0) setSelectedActivityId(LEARNING_PATH[selectedIdx - 1].id); };
  const handleNext = () => { if (selectedIdx < LEARNING_PATH.length - 1) setSelectedActivityId(LEARNING_PATH[selectedIdx + 1].id); };

  const activityProps = { onBack, onPrev: handlePrev, onNext: handleNext, hasPrev: selectedIdx > 0, hasNext: selectedIdx < LEARNING_PATH.length - 1 };

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

        {/* Activity list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ position: 'relative' }}>
            {LEARNING_PATH.filter(item => {
              const matchesType = activityFilter === 'all' || item.type === activityFilter;
              const matchesSearch = !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase());
              return matchesType && matchesSearch;
            }).map(item => {
              const isCurrent = (item as any).current === true;
              const isDone = item.done;
              const isSelected = item.id === selectedActivityId;
              const iconColor = isDone ? 'var(--green-600)' : isCurrent ? 'var(--blue-700)' : 'rgba(127,127,127,0.5)';
              const IconComp = TYPE_ICONS[item.type] ?? FileText;

              if (collapsed) {
                return (
                  <div key={item.id} onClick={() => setSelectedActivityId(item.id)}
                    title={item.title}
                    style={{
                      display: 'flex', justifyContent: 'center', alignItems: 'center',
                      padding: '10px 0',
                      background: isSelected ? 'var(--bg-section)' : 'transparent',
                      cursor: 'pointer',
                      borderBottom: '1px solid var(--border-subtle)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-section)')}
                    onMouseLeave={e => (e.currentTarget.style.background = isSelected ? 'var(--bg-section)' : 'transparent')}
                  >
                    <div style={{
                      width: 32, height: 32, display: 'grid', placeItems: 'center',
                      background: isCurrent ? 'var(--accent-soft)' : isDone ? 'var(--success-soft)' : 'var(--bg-section)',
                      borderRadius: '50%',
                    }}>
                      <IconComp size={15} strokeWidth={2} color={iconColor} />
                    </div>
                  </div>
                );
              }

              return (
                <div key={item.id} onClick={() => setSelectedActivityId(item.id)}
                  data-tour={isCurrent ? 'current-activity' : undefined}
                  style={{
                    position: 'relative',
                    padding: '14px 14px 14px 48px',
                    borderBottom: '1px solid var(--border-subtle)',
                    background: isCurrent
                      ? 'var(--blue-50)'
                      : isSelected
                        ? 'var(--bg-pastel-beige-3)'
                        : 'transparent',
                    borderLeft: isSelected && !isCurrent ? '2px solid var(--orange-600)' : 'none',
                    opacity: (!isDone && !isCurrent) ? 0.65 : 1,
                    cursor: 'pointer',
                    transition: 'background 0.1s ease',
                  }}
                  onMouseEnter={e => { if (!isCurrent) e.currentTarget.style.background = 'var(--bg-section)'; e.currentTarget.style.opacity = '1'; }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = isCurrent ? 'var(--blue-50)' : isSelected ? 'var(--bg-pastel-beige-3)' : 'transparent';
                    e.currentTarget.style.opacity = (!isDone && !isCurrent) ? '0.65' : '1';
                  }}
                >
                  {/* Icon badge */}
                  <div style={{
                    position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
                    width: 30, height: 30, display: 'grid', placeItems: 'center',
                    background: isCurrent ? 'var(--accent-soft)' : isDone ? 'var(--success-soft)' : 'var(--bg-section)',
                    borderRadius: '50%',
                    zIndex: 1,
                  }}>
                    <IconComp size={14} strokeWidth={2} color={iconColor} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 13, fontWeight: isCurrent ? 700 : isDone ? 500 : 600,
                        color: isCurrent ? 'var(--blue-700)' : isDone ? 'var(--text-secondary)' : 'var(--text-primary)',
                        letterSpacing: '-0.01em', lineHeight: 1.3,
                        marginBottom: 3,
                      }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', fontWeight: 500 }}>
                        {TYPE_LABELS[item.type]} · {item.duration}
                      </div>
                    </div>

                    {isDone ? (
                      <div style={{
                        flexShrink: 0, padding: '3px 8px',
                        background: 'var(--green-600)', color: '#fff',
                        fontSize: 10, fontWeight: 800,
                        letterSpacing: '0.04em', textTransform: 'uppercase',
                        borderRadius: 'var(--radius-pill)',
                      }}>Done</div>
                    ) : isCurrent ? (
                      <button className="btn-primary" style={{ flexShrink: 0, fontSize: 11, padding: '5px 10px', display: 'inline-flex', alignItems: 'center', gap: 3 }}
                        onClick={e => { e.stopPropagation(); setSelectedActivityId(item.id); }}>
                        <Play size={8} fill="currentColor" strokeWidth={0}/> Resume
                      </button>
                    ) : (
                      <span style={{ flexShrink: 0, fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                        Start <ArrowRight size={10}/>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            {LEARNING_PATH.filter(item => {
              const matchesType = activityFilter === 'all' || item.type === activityFilter;
              const matchesSearch = !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase());
              return matchesType && matchesSearch;
            }).length === 0 && (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>No results</div>
                <div style={{ fontSize: 12, fontWeight: 500 }}>Try a different search or filter</div>
              </div>
            )}
          </div>
          <div style={{ height: 16 }}/>
        </div>

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
