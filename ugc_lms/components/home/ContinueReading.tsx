'use client';
import { useRef } from 'react';
import { PAGE_ACTIVITIES, COURSES } from '@/lib/mockData';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const CARD_PALETTES = [
  { bg: '#DBE9FF', accent: 'var(--blue-700)',    border: 'rgba(7,47,181,0.14)' },
  { bg: '#D6FFE4', accent: 'var(--green-700)',   border: 'rgba(0,87,29,0.14)'  },
  { bg: '#FFF8ED', accent: 'var(--orange-600)',  border: 'rgba(143,59,0,0.14)' },
  { bg: '#F6ECFF', accent: 'var(--purple-800)',  border: 'rgba(92,6,167,0.14)' },
  { bg: '#E0F8FF', accent: 'var(--cyan-700)',    border: 'rgba(0,78,102,0.14)' },
  { bg: '#FFEBF6', accent: 'var(--pink-800)',    border: 'rgba(102,0,58,0.14)' },
];

const SCROLL_AMOUNT = 332;

export default function ContinueReading({ firstTime }: { firstTime?: boolean } = {}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const unread = PAGE_ACTIVITIES.filter(p => !p.done);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'right' ? SCROLL_AMOUNT : -SCROLL_AMOUNT, behavior: 'smooth' });
  };

  return (
    <div className="enter enter-6" style={{ marginTop: 36, paddingBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div className="label">{firstTime ? 'Start reading' : 'Continue reading'}</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {(['left', 'right'] as const).map(dir => (
            <button
              key={dir}
              onClick={() => scroll(dir)}
              style={{
                width: 28, height: 28, display: 'grid', placeItems: 'center',
                background: '#fff', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                color: 'var(--text-secondary)', transition: 'all 0.1s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-section)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              {dir === 'left' ? <ChevronLeft size={14} strokeWidth={2}/> : <ChevronRight size={14} strokeWidth={2}/>}
            </button>
          ))}
        </div>
      </div>

      {unread.length === 0 ? (
        <div style={{
          height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--bg-section)', border: '1px dashed var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-tertiary)', fontSize: 13, fontWeight: 500,
        }}>
          All pages read
        </div>
      ) : (
        <div
          ref={scrollRef}
          style={{
            display: 'flex', gap: 12,
            overflowX: 'auto', overflowY: 'visible',
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none',
            paddingBottom: 6,
          }}
        >
          {unread.map((page, idx) => {
            const course = COURSES.find(c => c.id === page.courseId);
            const palette = CARD_PALETTES[idx % CARD_PALETTES.length];

            return (
              <Link key={page.id} href={`/learn?course=${page.courseId}`}
                style={{ textDecoration: 'none', color: 'inherit', width: 308, flexShrink: 0 }}>
                <div style={{
                  background: '#fff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'box-shadow 0.12s ease',
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                >
                  {/* Top zone: white — course name + arrow */}
                  <div style={{
                    padding: '12px 16px',
                    background: '#fff',
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <span style={{
                      fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {course?.title.split(' ').slice(0, 4).join(' ')}
                    </span>
                  </div>

                  {/* Bottom zone: warm beige — title */}
                  <div style={{
                    padding: '16px 16px 14px',
                    background: 'linear-gradient(135deg, #FFFCF8 0%, #EEF4FF 100%)',
                  }}>
                    <div style={{
                      fontSize: 16, fontWeight: 800, color: 'var(--text-primary)',
                      letterSpacing: '-0.025em', lineHeight: 1.3,
                      fontFamily: 'var(--font-display)',
                      marginBottom: 14,
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                      {page.title}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--blue-700)', display: 'flex', alignItems: 'center', gap: 3 }}>
                        Read <ArrowUpRight size={13}/>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
