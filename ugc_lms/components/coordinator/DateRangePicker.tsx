'use client';
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartChange: (d: string) => void;
  onEndChange: (d: string) => void;
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function formatDate(d: Date): string {
  return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
}

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function DateRangePicker({ startDate, endDate, onStartChange, onEndChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [selecting, setSelecting] = useState<'start' | 'end'>('start');
  const [viewMonth, setViewMonth] = useState(() => new Date(2026, 5, 1)); // June 2026
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const today = new Date(2026, 5, 7);
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const prevMonth = () => setViewMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setViewMonth(new Date(year, month + 1, 1));

  const handleDayClick = (day: number) => {
    const dateStr = toDateStr(new Date(year, month, day));
    if (selecting === 'start') {
      onStartChange(dateStr);
      setSelecting('end');
    } else {
      onEndChange(dateStr);
      setOpen(false);
      setSelecting('start');
    }
  };

  const startLabel = startDate ? formatDate(new Date(startDate)) : 'Start';
  const endLabel = endDate ? formatDate(new Date(endDate)) : 'End';
  const hasSelection = startDate || endDate;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Trigger */}
      <button onClick={() => setOpen(!open)} style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '4px 12px', fontSize: 11.5, fontWeight: 500,
        color: hasSelection ? 'var(--text-primary)' : 'var(--text-tertiary)',
        background: '#fff', border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)',
      }}>
        <Calendar size={12} strokeWidth={1.6} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
        <span style={{ fontWeight: startDate ? 600 : 400 }}>{startLabel}</span>
        <span style={{ color: 'var(--text-tertiary)', fontSize: 10 }}>&rarr;</span>
        <span style={{ fontWeight: endDate ? 600 : 400 }}>{endLabel}</span>
      </button>

      {/* Calendar dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: 6, zIndex: 60,
          width: 280, background: '#fff', borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)', boxShadow: '0 12px 36px rgba(0,0,0,0.12)',
          padding: '16px',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <button onClick={prevMonth} style={{ width: 28, height: 28, display: 'grid', placeItems: 'center', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-xs)', color: 'var(--text-tertiary)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-section)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            ><ChevronLeft size={16} /></button>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              {MONTHS[month]} {year}
            </span>
            <button onClick={nextMonth} style={{ width: 28, height: 28, display: 'grid', placeItems: 'center', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-xs)', color: 'var(--text-tertiary)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-section)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            ><ChevronRight size={16} /></button>
          </div>

          {/* Selecting label */}
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500, marginBottom: 10, textAlign: 'center' }}>
            Select {selecting === 'start' ? 'start' : 'end'} date
          </div>

          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0, marginBottom: 4 }}>
            {DAYS.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', padding: '4px 0', letterSpacing: '0.03em' }}>{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0 }}>
            {/* Previous month overflow */}
            {Array.from({ length: firstDay }, (_, i) => {
              const day = prevMonthDays - firstDay + 1 + i;
              return <div key={`prev-${i}`} style={{ textAlign: 'center', padding: '6px 0', fontSize: 12, color: 'var(--text-tertiary)', opacity: 0.3 }}>{day}</div>;
            })}

            {/* Current month */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dateStr = toDateStr(new Date(year, month, day));
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              const isStart = dateStr === startDate;
              const isEnd = dateStr === endDate;
              const isSelected = isStart || isEnd;
              const isInRange = startDate && endDate && dateStr > startDate && dateStr < endDate;

              return (
                <div key={day} onClick={() => handleDayClick(day)} style={{
                  textAlign: 'center', padding: '6px 0', fontSize: 12, fontWeight: isSelected ? 700 : 500,
                  color: isSelected ? '#fff' : isInRange ? 'var(--blue-700)' : 'var(--text-primary)',
                  background: isSelected ? 'var(--blue-700)' : isInRange ? 'rgba(7,47,181,0.06)' : 'transparent',
                  borderRadius: isToday || isSelected ? '50%' : 0,
                  cursor: 'pointer', transition: 'background 0.1s',
                  border: isToday && !isSelected ? '1px solid var(--blue-700)' : '1px solid transparent',
                  width: 32, height: 32, lineHeight: '20px',
                  display: 'grid', placeItems: 'center', margin: '0 auto',
                }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--bg-section)'; }}
                  onMouseLeave={e => { if (!isSelected && !isInRange) e.currentTarget.style.background = 'transparent'; }}
                >
                  {day}
                </div>
              );
            })}

            {/* Next month overflow */}
            {Array.from({ length: (7 - ((firstDay + daysInMonth) % 7)) % 7 }, (_, i) => (
              <div key={`next-${i}`} style={{ textAlign: 'center', padding: '6px 0', fontSize: 12, color: 'var(--text-tertiary)', opacity: 0.3 }}>{i + 1}</div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
            <button onClick={() => { onStartChange(''); onEndChange(''); setSelecting('start'); }} style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', padding: 0 }}>Clear</button>
            <button onClick={() => { const t = toDateStr(today); if (selecting === 'start') { onStartChange(t); setSelecting('end'); } else { onEndChange(t); setOpen(false); setSelecting('start'); } }} style={{ fontSize: 12, fontWeight: 600, color: 'var(--blue-700)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', padding: 0 }}>Today</button>
          </div>
        </div>
      )}
    </div>
  );
}
