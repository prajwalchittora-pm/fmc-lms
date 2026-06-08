'use client';
import { ChevronRight, Users, AlertTriangle, CheckCircle2, XCircle, HeartHandshake, MessageSquare, Clock, TrendingDown } from 'lucide-react';
import Link from 'next/link';

// ─── Mock Data ──────────────────────────────────────────────────────────────

const MENTOR = { name: 'Dr. Meera Nair' };

interface MenteeSummary {
  total: number; onTrack: number; atRisk: number; critical: number;
  upcomingSessions: number; pendingEscalations: number;
}

const SUMMARY: MenteeSummary = { total: 48, onTrack: 32, atRisk: 12, critical: 4, upcomingSessions: 3, pendingEscalations: 2 };

interface AtRiskMentee {
  id: string; name: string; initials: string; rollNo: string; programme: string;
  engagement: number; lastActive: string; issue: string;
}

const AT_RISK: AtRiskMentee[] = [
  { id: 'ar1', name: 'Rahul Verma', initials: 'RV', rollNo: 'MBA-2026-003', programme: 'MBA-26', engagement: 38, lastActive: '5 days ago', issue: 'Engagement below 50%, 2 failed courses' },
  { id: 'ar2', name: 'Neha Patel', initials: 'NP', rollNo: 'MBA-2026-006', programme: 'MBA-26', engagement: 28, lastActive: '12 days ago', issue: 'Inactive for 12 days, all courses failing' },
  { id: 'ar3', name: 'Dev Malhotra', initials: 'DM', rollNo: 'MBA-2026-016', programme: 'MBA-26', engagement: 51, lastActive: '1 day ago', issue: 'Engagement dropping, missed 3 live sessions' },
  { id: 'ar4', name: 'Siddharth Rao', initials: 'SR', rollNo: 'MBA-2026-014', programme: 'MBA-26', engagement: 58, lastActive: '3 hours ago', issue: 'Attendance at 73%, exemption requested' },
];

interface UpcomingSession {
  id: string; mentee: string; menteeInitials: string; date: string; time: string; type: string; programme: string;
}

const UPCOMING_SESSIONS: UpcomingSession[] = [
  { id: 'cs1', mentee: 'Rahul Verma', menteeInitials: 'RV', date: '9 Jun', time: '2:00 PM', type: 'Progress Review', programme: 'MBA-26' },
  { id: 'cs2', mentee: 'Neha Patel', menteeInitials: 'NP', date: '10 Jun', time: '11:00 AM', type: 'Re-engagement Plan', programme: 'MBA-26' },
  { id: 'cs3', mentee: 'Dev Malhotra', menteeInitials: 'DM', date: '11 Jun', time: '3:00 PM', type: 'Academic Guidance', programme: 'MBA-26' },
];

interface RecentForumActivity {
  id: string; mentee: string; menteeInitials: string; title: string; course: string; time: string; type: 'post' | 'reply' | 'inactive';
}

const FORUM_ACTIVITY: RecentForumActivity[] = [
  { id: 'fa1', mentee: 'Arjun Mehta', menteeInitials: 'AM', title: 'Posted in Market Equilibrium Discussion', course: 'MBA-101', time: '2h ago', type: 'post' },
  { id: 'fa2', mentee: 'Kavya Menon', menteeInitials: 'KM', title: 'Replied to Case Study Discussion', course: 'MBA-101', time: '1d ago', type: 'reply' },
  { id: 'fa3', mentee: 'Neha Patel', menteeInitials: 'NP', title: 'No forum activity in 14 days', course: '-', time: '14d', type: 'inactive' },
  { id: 'fa4', mentee: 'Rahul Verma', menteeInitials: 'RV', title: 'No forum activity in 8 days', course: '-', time: '8d', type: 'inactive' },
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function MentorDashboard() {
  return (
    <div style={{ padding: '32px 40px', maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0 }}>
          Good afternoon, Dr. Nair
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 6, fontWeight: 500 }}>
          Saturday, 7 June 2026 &middot; {SUMMARY.total} mentees assigned
        </p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
        <div style={{ background: '#fff', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Users size={14} style={{ color: 'var(--text-tertiary)' }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Total Mentees</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{SUMMARY.total}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <CheckCircle2 size={14} style={{ color: '#059669' }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>On Track</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#059669', letterSpacing: '-0.02em' }}>{SUMMARY.onTrack}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <AlertTriangle size={14} style={{ color: '#D97706' }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>At Risk</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#D97706', letterSpacing: '-0.02em' }}>{SUMMARY.atRisk}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <XCircle size={14} style={{ color: '#DC2626' }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Critical</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#DC2626', letterSpacing: '-0.02em' }}>{SUMMARY.critical}</div>
        </div>
      </div>

      {/* At-risk mentees */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingDown size={16} strokeWidth={1.5} style={{ color: '#DC2626' }} />
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', margin: 0 }}>Needs Attention</h2>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#DC2626', background: 'rgba(220,38,38,0.06)', padding: '2px 8px', borderRadius: 'var(--radius-xs)' }}>{AT_RISK.length} students</span>
          </div>
          <Link href="/mentor/mentees" style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--blue-700)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>
            View all mentees <ChevronRight size={13} />
          </Link>
        </div>
        <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
          {AT_RISK.map((mentee, i) => {
            const engColor = mentee.engagement < 50 ? '#DC2626' : '#D97706';
            return (
              <Link key={mentee.id} href="/mentor/mentees" style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '14px 22px', cursor: 'pointer',
                  borderBottom: i < AT_RISK.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                  background: mentee.engagement < 50 ? 'rgba(220,38,38,0.02)' : 'transparent',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.015)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = mentee.engagement < 50 ? 'rgba(220,38,38,0.02)' : 'transparent'; }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-section)', border: '1px solid var(--border-subtle)', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', flexShrink: 0 }}>{mentee.initials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{mentee.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{mentee.issue}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)', color: engColor }}>{mentee.engagement}%</div>
                      <div style={{ fontSize: 9, color: 'var(--text-tertiary)', fontWeight: 500 }}>engagement</div>
                    </div>
                    <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{mentee.lastActive}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Two column: Upcoming sessions + Forum activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Upcoming Counselling Sessions */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <HeartHandshake size={15} strokeWidth={1.5} style={{ color: 'var(--text-tertiary)' }} />
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', margin: 0 }}>Upcoming Sessions</h3>
            </div>
            <Link href="/mentor/counselling" style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--blue-700)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>
              View all <ChevronRight size={13} />
            </Link>
          </div>
          <div>
            {UPCOMING_SESSIONS.map((session, i) => (
              <Link key={session.id} href="/mentor/counselling" style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '14px 22px', cursor: 'pointer',
                  borderBottom: i < UPCOMING_SESSIONS.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.015)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--bg-section)', border: '1px solid var(--border-subtle)', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', flexShrink: 0 }}>{session.menteeInitials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>{session.mentee}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)', marginTop: 2 }}>{session.type}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{session.date}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{session.time}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/mentor/counselling" style={{ textDecoration: 'none' }}>
            <div style={{ padding: '12px 22px', borderTop: '1px solid var(--border-subtle)', textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--blue-700)', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(7,47,181,0.02)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >Schedule new session &rarr;</div>
          </Link>
        </div>

        {/* Mentee Forum Activity */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <MessageSquare size={15} strokeWidth={1.5} style={{ color: 'var(--text-tertiary)' }} />
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', margin: 0 }}>Mentee Forum Activity</h3>
            </div>
            <Link href="/mentor/forums" style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--blue-700)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>
              View all <ChevronRight size={13} />
            </Link>
          </div>
          <div>
            {FORUM_ACTIVITY.map((activity, i) => {
              const isInactive = activity.type === 'inactive';
              return (
                <div key={activity.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 22px',
                  borderBottom: i < FORUM_ACTIVITY.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                  background: isInactive ? 'rgba(220,38,38,0.02)' : 'transparent',
                }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: isInactive ? 'rgba(220,38,38,0.06)' : 'var(--bg-section)', border: '1px solid var(--border-subtle)', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 700, color: isInactive ? '#DC2626' : 'var(--text-secondary)', flexShrink: 0 }}>{activity.menteeInitials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: isInactive ? '#DC2626' : 'var(--text-primary)' }}>{activity.mentee}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)', marginTop: 1 }}>{activity.title}</div>
                  </div>
                  <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                    {isInactive ? (
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#DC2626', background: 'rgba(220,38,38,0.06)', padding: '2px 7px', borderRadius: 'var(--radius-xs)' }}>Inactive</span>
                    ) : (
                      <>
                        <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--blue-700)', background: 'rgba(7,47,181,0.06)', padding: '1px 5px', borderRadius: 'var(--radius-xs)', fontFamily: 'var(--font-mono)' }}>{activity.course}</span>
                        <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{activity.time}</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
