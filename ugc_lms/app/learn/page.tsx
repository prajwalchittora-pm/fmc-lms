'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import SideNav from '@/components/SideNav';
import Breadcrumb from '@/components/Breadcrumb';
import CourseList from '@/components/learn/CourseList';
import CourseView from '@/components/learn/CourseView';
import { COURSES } from '@/lib/mockData';
import { usePrototype } from '@/context/PrototypeContext';
import { Maximize2 } from 'lucide-react';

function LearnContent() {
  const searchParams = useSearchParams();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const { focusMode, setFocusMode } = usePrototype();
  const courseName = selectedCourse ? (COURSES.find(c => c.id === selectedCourse)?.title ?? 'Course') : null;

  useEffect(() => {
    const courseParam = searchParams.get('course');
    if (courseParam) setSelectedCourse(courseParam);
  }, [searchParams]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedCourse) setSelectedCourse(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedCourse]);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#FBF4EA' }}>
      <SideNav />
      <div style={{
        flex: 1,
        height: '100vh',
        overflow: selectedCourse ? 'hidden' : 'auto',
        padding: selectedCourse ? '0 20px' : '0',
        boxSizing: 'border-box',
        position: 'relative',
        background: '#F8F5F1',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Breadcrumb — hidden in focus mode */}
        {!focusMode && (
          <div style={{ padding: selectedCourse ? '0' : '0 40px', flexShrink: 0 }}>
            <Breadcrumb
              items={
                selectedCourse
                  ? [
                      { label: 'Overview', onClick: () => setSelectedCourse(null) },
                      { label: 'Learn', onClick: () => setSelectedCourse(null) },
                      { label: courseName! },
                    ]
                  : [
                      { label: 'Overview', onClick: () => {} },
                      { label: 'Learn' },
                    ]
              }
              rightAction={selectedCourse ? (
                <button
                  onClick={() => setFocusMode(true)}
                  title="Focus mode (⌘⇧F)"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '4px 10px',
                    background: 'transparent',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 11, fontWeight: 600,
                    color: 'var(--text-tertiary)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)',
                    transition: 'color 0.12s ease, border-color 0.12s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--text-tertiary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
                >
                  <Maximize2 size={11} strokeWidth={2.2} /> Focus
                </button>
              ) : undefined}
            />
          </div>
        )}
        {selectedCourse ? (
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <CourseView courseId={selectedCourse} onBack={() => setSelectedCourse(null)} />
          </div>
        ) : (
          <CourseList onSelect={setSelectedCourse} />
        )}
      </div>
    </div>
  );
}

export default function LearnPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'grid', placeItems: 'center', height: '100vh', background: '#FBF4EA', color: 'var(--text-tertiary)', fontSize: 14 }}>
        Loading...
      </div>
    }>
      <LearnContent />
    </Suspense>
  );
}
