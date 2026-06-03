'use client';
import { useState, useEffect, useRef } from 'react';
import { Minimize2, ChevronLeft, ChevronRight, Video, FileText, FileDown, HelpCircle } from 'lucide-react';

const TYPE_ICONS: Record<string, React.ElementType> = { video: Video, page: FileText, pdf: FileDown, quiz: HelpCircle };
const TYPE_LABELS: Record<string, string> = { video: 'Video', page: 'Reading', pdf: 'PDF', quiz: 'Quiz' };

interface FocusToolbarProps {
  activityTitle: string;
  activityType: string;
  onExit: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export default function FocusToolbar({ activityTitle, activityType, onExit, onPrev, onNext, hasPrev, hasNext }: FocusToolbarProps) {
  const [visible, setVisible] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const resetTimer = () => {
    setVisible(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setVisible(false), 3000);
  };

  useEffect(() => {
    resetTimer();
    return () => clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (e.clientY < 60) resetTimer();
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const Icon = TYPE_ICONS[activityType] || FileText;

  return (
    <div
      onMouseEnter={() => { setVisible(true); clearTimeout(timeoutRef.current); }}
      onMouseLeave={resetTimer}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: 48,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
        display: 'flex', alignItems: 'center',
        padding: '0 16px',
        zIndex: 100,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-4px)',
        transition: 'opacity 0.25s ease, transform 0.25s ease',
        pointerEvents: visible ? 'auto' : 'none',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Exit */}
      <button
        onClick={onExit}
        title="Exit focus mode (Esc)"
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '5px 10px',
          background: 'var(--bg-section)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          cursor: 'pointer',
          fontSize: 11.5, fontWeight: 600,
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-sans)',
          flexShrink: 0,
        }}
      >
        <Minimize2 size={12} strokeWidth={2.2} />
        Exit focus
      </button>

      {/* Center — activity info */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, minWidth: 0 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '3px 8px',
          background: 'var(--bg-section)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          fontSize: 10, fontWeight: 700,
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          flexShrink: 0,
        }}>
          <Icon size={10} strokeWidth={2} />
          {TYPE_LABELS[activityType] || activityType}
        </div>
        <span style={{
          fontSize: 13, fontWeight: 600,
          color: 'var(--text-primary)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          maxWidth: 400,
        }}>
          {activityTitle}
        </span>
      </div>

      {/* Nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          title="Previous activity"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 30, height: 30,
            background: 'transparent',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            cursor: hasPrev ? 'pointer' : 'default',
            opacity: hasPrev ? 1 : 0.3,
          }}
        >
          <ChevronLeft size={14} color="var(--text-secondary)" />
        </button>
        <button
          onClick={onNext}
          disabled={!hasNext}
          title="Next activity"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 30, height: 30,
            background: 'transparent',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            cursor: hasNext ? 'pointer' : 'default',
            opacity: hasNext ? 1 : 0.3,
          }}
        >
          <ChevronRight size={14} color="var(--text-secondary)" />
        </button>
      </div>
    </div>
  );
}
