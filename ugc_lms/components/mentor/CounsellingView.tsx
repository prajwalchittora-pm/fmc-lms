'use client';
import { useState } from 'react';
import { Plus, X, Clock, CheckCircle2, HeartHandshake, Calendar, FileText } from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────

type SessionStatus = 'scheduled' | 'completed' | 'cancelled';

interface CounsellingSession {
  id: string; mentee: string; menteeInitials: string; rollNo: string; programme: string;
  date: string; time: string; duration: string; type: string;
  status: SessionStatus; notes?: string; actionItems?: string[];
}

// ─── Mock Data ──────────────────────────────────────────────────────────────

const SESSIONS: CounsellingSession[] = [
  { id: 'cs1', mentee: 'Rahul Verma', menteeInitials: 'RV', rollNo: 'MBA-2026-003', programme: 'MBA-26', date: '9 Jun 2026', time: '2:00 PM', duration: '30 min', type: 'Progress Review', status: 'scheduled' },
  { id: 'cs2', mentee: 'Neha Patel', menteeInitials: 'NP', rollNo: 'MBA-2026-006', programme: 'MBA-26', date: '10 Jun 2026', time: '11:00 AM', duration: '45 min', type: 'Re-engagement Plan', status: 'scheduled' },
  { id: 'cs3', mentee: 'Dev Malhotra', menteeInitials: 'DM', rollNo: 'MBA-2026-016', programme: 'MBA-26', date: '11 Jun 2026', time: '3:00 PM', duration: '30 min', type: 'Academic Guidance', status: 'scheduled' },
  { id: 'cs4', mentee: 'Rahul Verma', menteeInitials: 'RV', rollNo: 'MBA-2026-003', programme: 'MBA-26', date: '1 Jun 2026', time: '2:00 PM', duration: '40 min', type: 'Progress Review', status: 'completed', notes: 'Rahul acknowledged missing live sessions due to part-time work. Agreed to attend at least 4 out of 6 remaining sessions. Will review engagement weekly.', actionItems: ['Attend next 4 live sessions', 'Submit pending MBA-104 assignment by 8 Jun', 'Weekly check-in every Monday'] },
  { id: 'cs5', mentee: 'Neha Patel', menteeInitials: 'NP', rollNo: 'MBA-2026-006', programme: 'MBA-26', date: '25 May 2026', time: '11:00 AM', duration: '50 min', type: 'Re-engagement Plan', status: 'completed', notes: 'Neha has been dealing with family issues. Referred to university counsellor for personal support. Academic re-engagement plan created: start with 2 courses instead of all 6. Escalated to coordinator for potential semester extension.', actionItems: ['Connect with university counsellor', 'Focus on MBA-101 and MBA-103 first', 'Coordinator to review extension request'] },
  { id: 'cs6', mentee: 'Siddharth Rao', menteeInitials: 'SR', rollNo: 'MBA-2026-014', programme: 'MBA-26', date: '15 May 2026', time: '4:00 PM', duration: '25 min', type: 'Attendance Review', status: 'completed', notes: 'Siddharth has attendance at 73% due to sports meet participation. Verified university team documentation. Recommended exemption request for End Sem eligibility.', actionItems: ['Submit exemption request with sports certificate', 'Attend all remaining sessions'] },
  { id: 'cs7', mentee: 'Dev Malhotra', menteeInitials: 'DM', rollNo: 'MBA-2026-016', programme: 'MBA-26', date: '10 May 2026', time: '3:00 PM', duration: '30 min', type: 'Academic Guidance', status: 'completed', notes: 'Dev struggling with MBA-105 Business Statistics. Connected with peer study group. Suggested additional tutorial resources on the LMS.', actionItems: ['Join statistics peer study group', 'Complete tutorial modules 3-5', 'Attend statistics lab sessions'] },
];

const STATUS_CONFIG: Record<SessionStatus, { label: string; color: string; bg: string }> = {
  scheduled: { label: 'Scheduled', color: '#072FB5', bg: 'rgba(7,47,181,0.06)' },
  completed: { label: 'Completed', color: '#059669', bg: 'rgba(5,150,105,0.06)' },
  cancelled: { label: 'Cancelled', color: '#747474', bg: 'rgba(0,0,0,0.04)' },
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function CounsellingView() {
  const [statusFilter, setStatusFilter] = useState<SessionStatus | 'all'>('all');
  const [selectedSession, setSelectedSession] = useState<CounsellingSession | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filtered = statusFilter === 'all' ? SESSIONS : SESSIONS.filter(s => s.status === statusFilter);
  const scheduledCount = SESSIONS.filter(s => s.status === 'scheduled').length;
  const completedCount = SESSIONS.filter(s => s.status === 'completed').length;

  if (selectedSession) {
    const sc = STATUS_CONFIG[selectedSession.status];
    return (
      <div style={{ padding: '28px 40px', maxWidth: 800 }}>
        <button onClick={() => setSelectedSession(null)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: 'var(--blue-700)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-sans)', marginBottom: 20 }}>&larr; Back to Sessions</button>

        <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', padding: '28px 32px', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: sc.color, background: sc.bg, padding: '3px 10px', borderRadius: 'var(--radius-xs)' }}>{sc.label}</span>
            <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-tertiary)' }}>{selectedSession.type}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--bg-section)', border: '1px solid var(--border-subtle)', display: 'grid', placeItems: 'center', fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)' }}>{selectedSession.menteeInitials}</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{selectedSession.mentee}</div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>{selectedSession.rollNo} &middot; {selectedSession.programme}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 20, paddingTop: 16, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
            <div><div style={{ fontSize: 9.5, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 3 }}>Date</div><div style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{selectedSession.date}</div></div>
            <div><div style={{ fontSize: 9.5, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 3 }}>Time</div><div style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{selectedSession.time}</div></div>
            <div><div style={{ fontSize: 9.5, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 3 }}>Duration</div><div style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{selectedSession.duration}</div></div>
          </div>
        </div>

        {selectedSession.notes && (
          <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', padding: '24px 28px', marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', marginBottom: 10 }}>Session Notes</div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>{selectedSession.notes}</p>
          </div>
        )}

        {selectedSession.actionItems && selectedSession.actionItems.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', padding: '24px 28px' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', marginBottom: 12 }}>Action Items</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selectedSession.actionItems.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  <CheckCircle2 size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0, marginTop: 3 }} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: '28px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', margin: 0 }}>Counselling Sessions</h1>
          <p style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500, marginTop: 4 }}>Schedule, conduct &amp; log mentoring sessions with students</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} style={{
          display: 'flex', alignItems: 'center', gap: 5, padding: '8px 16px', fontSize: 12.5, fontWeight: 600,
          color: '#fff', background: 'var(--blue-700)', border: '1px solid var(--blue-700)',
          borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)',
        }}>
          <Plus size={14} /> Schedule Session
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        {([['all', `All (${SESSIONS.length})`], ['scheduled', `Scheduled (${scheduledCount})`], ['completed', `Completed (${completedCount})`]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setStatusFilter(key as SessionStatus | 'all')} style={{
            padding: '5px 12px', fontSize: 11.5, fontWeight: statusFilter === key ? 700 : 500,
            color: statusFilter === key ? '#fff' : 'var(--text-secondary)',
            background: statusFilter === key ? 'var(--blue-700)' : '#fff',
            border: statusFilter === key ? '1px solid var(--blue-700)' : '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)',
          }}>{label}</button>
        ))}
      </div>

      {/* Session list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map(session => {
          const sc = STATUS_CONFIG[session.status];
          return (
            <div key={session.id} onClick={() => setSelectedSession(session)} style={{
              background: '#fff', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)',
              padding: '16px 22px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
            >
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-section)', border: '1px solid var(--border-subtle)', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', flexShrink: 0 }}>{session.menteeInitials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>{session.mentee}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{session.type}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--blue-700)', background: 'rgba(7,47,181,0.06)', padding: '1px 6px', borderRadius: 'var(--radius-xs)', fontFamily: 'var(--font-mono)' }}>{session.programme}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{session.date}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)', marginTop: 1 }}>{session.time} &middot; {session.duration}</div>
                </div>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: sc.color, background: sc.bg, padding: '3px 10px', borderRadius: 'var(--radius-xs)', minWidth: 70, textAlign: 'center' }}>{sc.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,0.4)' }} onClick={() => setShowCreateModal(false)}>
          <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', width: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 16, fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>Schedule Session</div>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 4, display: 'flex' }}><X size={18} /></button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Mentee</label>
                <select style={{ width: '100%', padding: '8px 28px 8px 12px', fontSize: 13, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)', outline: 'none', background: '#fff', appearance: 'none' as const, WebkitAppearance: 'none' as const, backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}>
                  <option>Rahul Verma (MBA-2026-003)</option>
                  <option>Neha Patel (MBA-2026-006)</option>
                  <option>Dev Malhotra (MBA-2026-016)</option>
                  <option>Siddharth Rao (MBA-2026-014)</option>
                  <option>Arjun Mehta (MBA-2026-001)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Session Type</label>
                <select style={{ width: '100%', padding: '8px 28px 8px 12px', fontSize: 13, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)', outline: 'none', background: '#fff', appearance: 'none' as const, WebkitAppearance: 'none' as const, backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}>
                  <option>Progress Review</option>
                  <option>Academic Guidance</option>
                  <option>Re-engagement Plan</option>
                  <option>Attendance Review</option>
                  <option>Career Counselling</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Date</label>
                  <input type="date" style={{ width: '100%', padding: '8px 10px', fontSize: 12, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Time</label>
                  <input type="time" style={{ width: '100%', padding: '8px 10px', fontSize: 12, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)', outline: 'none' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Notes (optional)</label>
                <textarea rows={3} placeholder="Pre-session notes or agenda..." style={{ width: '100%', padding: '8px 12px', fontSize: 13, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)', outline: 'none', resize: 'vertical', lineHeight: 1.6 }} />
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => setShowCreateModal(false)} style={{ padding: '8px 20px', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Cancel</button>
              <button onClick={() => setShowCreateModal(false)} style={{ padding: '8px 20px', fontSize: 13, fontWeight: 600, color: '#fff', background: 'var(--blue-700)', border: '1px solid var(--blue-700)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Schedule</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
