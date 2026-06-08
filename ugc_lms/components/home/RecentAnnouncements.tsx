'use client';
import { Megaphone, Pin, ChevronRight } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  body: string;
  time: string;
  pinned: boolean;
  programme: string;
}

const ANNOUNCEMENTS: Announcement[] = [
  { id: 'a1', title: 'End Semester Examination Schedule Released', body: 'Online proctored exams from 15 Jun to 25 Jun. Check the Exams tab for detailed timetable.', time: '2h ago', pinned: true, programme: 'MBA - Batch 2026' },
  { id: 'a2', title: 'Eligibility List — Final Reminder', body: 'Students below 75% engagement must submit exemption requests with documents by 6 June.', time: '1d ago', pinned: true, programme: 'MBA - Batch 2026' },
  { id: 'a3', title: 'Preparatory Period Notice', body: 'No new live sessions from 10 Jun to 14 Jun. Use this time for revision. E-library access continues.', time: '3d ago', pinned: false, programme: 'All Programmes' },
];

export default function RecentAnnouncements() {
  return (
    <div style={{ marginTop: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <span className="label">Announcements</span>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', marginTop: 4 }}>
            Recent updates
          </div>
        </div>
        <button style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '6px 14px', fontSize: 12, fontWeight: 600,
          color: 'var(--text-secondary)', background: 'transparent',
          border: '1px solid var(--border-subtle)', borderRadius: 8,
          cursor: 'pointer', fontFamily: 'var(--font-sans)',
        }}>
          View all <ChevronRight size={12} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ANNOUNCEMENTS.map(ann => (
          <div key={ann.id} style={{
            background: '#fff',
            border: '2px solid rgba(15,15,15,0.45)',
            borderRadius: 10,
            padding: '16px 18px',
            cursor: 'pointer',
            transition: 'box-shadow 0.12s, border-color 0.12s',
          }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 3px 12px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = 'rgba(7,47,181,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(15,15,15,0.12)'; }}
          >
            {/* Top: programme + pinned + time */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: '#072FB5', background: 'rgba(7,47,181,0.06)', padding: '2px 8px', borderRadius: 4 }}>{ann.programme}</span>
                {ann.pinned && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 9, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <Pin size={8} style={{ transform: 'rotate(45deg)' }} /> Pinned
                  </span>
                )}
              </div>
              <span style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 500 }}>{ann.time}</span>
            </div>

            {/* Title */}
            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.35, marginBottom: 4, fontFamily: 'var(--font-display)' }}>{ann.title}</div>

            {/* Body preview */}
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{ann.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
