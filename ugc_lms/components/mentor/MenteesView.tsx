'use client';
import { useState } from 'react';
import { Search, Users, AlertTriangle, CheckCircle2, XCircle, ChevronRight, Clock, TrendingDown, BarChart3 } from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────

type MenteeStatus = 'on_track' | 'at_risk' | 'critical';

interface Mentee {
  id: string; name: string; initials: string; rollNo: string;
  programme: string; programmeName: string; semester: number;
  engagement: number; attendance: number; cgpa: number;
  lastActive: string; forumPosts: number; sessionsAttended: number;
  status: MenteeStatus;
  lastCounselling?: string;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────

const MENTEES: Mentee[] = [
  { id: 'm1', name: 'Sneha Reddy', initials: 'SR', rollNo: 'MBA-2026-008', programme: 'MBA-26', programmeName: 'MBA', semester: 1, engagement: 95, attendance: 98, cgpa: 10.0, lastActive: '15 min ago', forumPosts: 12, sessionsAttended: 8, status: 'on_track' },
  { id: 'm2', name: 'Priya Sharma', initials: 'PS', rollNo: 'MBA-2026-002', programme: 'MBA-26', programmeName: 'MBA', semester: 1, engagement: 91, attendance: 96, cgpa: 9.55, lastActive: '30 min ago', forumPosts: 9, sessionsAttended: 8, status: 'on_track' },
  { id: 'm3', name: 'Kavya Menon', initials: 'KM', rollNo: 'MBA-2026-013', programme: 'MBA-26', programmeName: 'MBA', semester: 1, engagement: 87, attendance: 91, cgpa: 9.50, lastActive: '1h ago', forumPosts: 7, sessionsAttended: 7, status: 'on_track' },
  { id: 'm4', name: 'Aisha Khan', initials: 'AK', rollNo: 'MBA-2026-015', programme: 'MBA-26', programmeName: 'MBA', semester: 1, engagement: 85, attendance: 90, cgpa: 9.20, lastActive: '2h ago', forumPosts: 5, sessionsAttended: 8, status: 'on_track' },
  { id: 'm5', name: 'Arjun Mehta', initials: 'AM', rollNo: 'MBA-2026-001', programme: 'MBA-26', programmeName: 'MBA', semester: 1, engagement: 72, attendance: 88, cgpa: 8.0, lastActive: '2h ago', forumPosts: 8, sessionsAttended: 6, status: 'at_risk', lastCounselling: '28 May 2026' },
  { id: 'm6', name: 'Rohan Gupta', initials: 'RG', rollNo: 'MBA-2026-011', programme: 'MBA-26', programmeName: 'MBA', semester: 1, engagement: 67, attendance: 82, cgpa: 8.05, lastActive: '1d ago', forumPosts: 4, sessionsAttended: 5, status: 'at_risk', lastCounselling: '20 May 2026' },
  { id: 'm7', name: 'Siddharth Rao', initials: 'SR2', rollNo: 'MBA-2026-014', programme: 'MBA-26', programmeName: 'MBA', semester: 1, engagement: 58, attendance: 73, cgpa: 7.05, lastActive: '3h ago', forumPosts: 2, sessionsAttended: 4, status: 'at_risk', lastCounselling: '15 May 2026' },
  { id: 'm8', name: 'Dev Malhotra', initials: 'DM', rollNo: 'MBA-2026-016', programme: 'MBA-26', programmeName: 'MBA', semester: 1, engagement: 51, attendance: 68, cgpa: 6.40, lastActive: '1d ago', forumPosts: 1, sessionsAttended: 3, status: 'at_risk', lastCounselling: '10 May 2026' },
  { id: 'm9', name: 'Rahul Verma', initials: 'RV', rollNo: 'MBA-2026-003', programme: 'MBA-26', programmeName: 'MBA', semester: 1, engagement: 38, attendance: 52, cgpa: 4.10, lastActive: '5d ago', forumPosts: 1, sessionsAttended: 2, status: 'critical', lastCounselling: '1 Jun 2026' },
  { id: 'm10', name: 'Neha Patel', initials: 'NP', rollNo: 'MBA-2026-006', programme: 'MBA-26', programmeName: 'MBA', semester: 1, engagement: 28, attendance: 40, cgpa: 0.0, lastActive: '12d ago', forumPosts: 0, sessionsAttended: 1, status: 'critical', lastCounselling: '25 May 2026' },
  { id: 'm11', name: 'Ananya Iyer', initials: 'AI', rollNo: 'BCA-2026-001', programme: 'BCA-26', programmeName: 'BCA', semester: 2, engagement: 78, attendance: 90, cgpa: 8.5, lastActive: '1h ago', forumPosts: 6, sessionsAttended: 7, status: 'on_track' },
  { id: 'm12', name: 'Karthik Nair', initials: 'KN', rollNo: 'BCA-2026-002', programme: 'BCA-26', programmeName: 'BCA', semester: 2, engagement: 82, attendance: 92, cgpa: 8.1, lastActive: '3h ago', forumPosts: 8, sessionsAttended: 8, status: 'on_track' },
];

const STATUS_CONFIG: Record<MenteeStatus, { label: string; color: string; bg: string }> = {
  on_track: { label: 'On Track', color: '#059669', bg: 'rgba(5,150,105,0.06)' },
  at_risk: { label: 'At Risk', color: '#D97706', bg: 'rgba(217,119,6,0.06)' },
  critical: { label: 'Critical', color: '#DC2626', bg: 'rgba(220,38,38,0.06)' },
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function MenteesView() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<MenteeStatus | 'all'>('all');
  const [programmeFilter, setProgrammeFilter] = useState('all');

  const filtered = MENTEES.filter(m => {
    if (statusFilter !== 'all' && m.status !== statusFilter) return false;
    if (programmeFilter !== 'all' && m.programme !== programmeFilter) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.rollNo.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const onTrackCount = MENTEES.filter(m => m.status === 'on_track').length;
  const atRiskCount = MENTEES.filter(m => m.status === 'at_risk').length;
  const criticalCount = MENTEES.filter(m => m.status === 'critical').length;

  const thStyle: React.CSSProperties = { fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'var(--font-sans)', padding: '10px 12px', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)', whiteSpace: 'nowrap' };
  const tdStyle: React.CSSProperties = { fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', padding: '10px 12px', borderBottom: '1px solid rgba(0,0,0,0.03)' };

  return (
    <div style={{ padding: '28px 40px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', margin: 0 }}>My Mentees</h1>
        <p style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500, marginTop: 4 }}>{MENTEES.length} students assigned &middot; UGC 1:250 mentor ratio</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        {([['all', `All (${MENTEES.length})`], ['on_track', `On Track (${onTrackCount})`], ['at_risk', `At Risk (${atRiskCount})`], ['critical', `Critical (${criticalCount})`]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setStatusFilter(key as MenteeStatus | 'all')} style={{
            padding: '5px 12px', fontSize: 11.5, fontWeight: statusFilter === key ? 700 : 500,
            color: statusFilter === key ? '#fff' : 'var(--text-secondary)',
            background: statusFilter === key ? 'var(--blue-700)' : '#fff',
            border: statusFilter === key ? '1px solid var(--blue-700)' : '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)',
          }}>{label}</button>
        ))}
        <span style={{ width: 1, height: 20, background: 'var(--border-subtle)', margin: '0 4px' }} />
        <select value={programmeFilter} onChange={e => setProgrammeFilter(e.target.value)} style={{
          padding: '5px 28px 5px 10px', fontSize: 11.5, fontWeight: 500, color: 'var(--text-secondary)',
          background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)',
          fontFamily: 'var(--font-sans)', outline: 'none', cursor: 'pointer',
          appearance: 'none' as const, WebkitAppearance: 'none' as const,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
        }}>
          <option value="all">All Programmes</option>
          <option value="MBA-26">MBA - Batch 2026</option>
          <option value="BCA-26">BCA - Batch 2026</option>
        </select>
        <div style={{ position: 'relative', marginLeft: 'auto' }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search mentees..." style={{
            width: 200, padding: '5px 10px 5px 30px', fontSize: 12, fontWeight: 500,
            border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)',
            background: '#fff', fontFamily: 'var(--font-sans)', outline: 'none', color: 'var(--text-primary)',
          }} />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, minWidth: 160 }}>Student</th>
              <th style={thStyle}>Programme</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Engagement</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Attendance</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>CGPA</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Last Active</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Forum</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Status</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Last Counselling</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(mentee => {
              const sc = STATUS_CONFIG[mentee.status];
              const engColor = mentee.engagement >= 75 ? '#059669' : mentee.engagement >= 50 ? '#D97706' : '#DC2626';
              const attColor = mentee.attendance >= 75 ? '#059669' : mentee.attendance >= 50 ? '#D97706' : '#DC2626';
              return (
                <tr key={mentee.id} style={{ background: mentee.status === 'critical' ? 'rgba(220,38,38,0.02)' : mentee.status === 'at_risk' ? 'rgba(217,119,6,0.01)' : 'transparent', cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.015)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = mentee.status === 'critical' ? 'rgba(220,38,38,0.02)' : mentee.status === 'at_risk' ? 'rgba(217,119,6,0.01)' : 'transparent'; }}
                >
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--bg-section)', border: '1px solid var(--border-subtle)', display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 700, color: 'var(--text-secondary)', flexShrink: 0 }}>{mentee.initials}</div>
                      <div>
                        <div style={{ fontSize: 12.5, fontWeight: 600 }}>{mentee.name}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{mentee.rollNo}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ ...tdStyle, fontSize: 11, color: 'var(--text-secondary)' }}>{mentee.programmeName} Sem {mentee.semester}</td>
                  <td style={{ ...tdStyle, textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 12, color: engColor }}>{mentee.engagement}%</td>
                  <td style={{ ...tdStyle, textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 12, color: attColor }}>{mentee.attendance}%</td>
                  <td style={{ ...tdStyle, textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 12, color: mentee.cgpa >= 8 ? '#059669' : mentee.cgpa >= 5 ? 'var(--text-primary)' : '#DC2626' }}>{mentee.cgpa.toFixed(1)}</td>
                  <td style={{ ...tdStyle, textAlign: 'center', fontSize: 11, color: 'var(--text-tertiary)' }}>{mentee.lastActive}</td>
                  <td style={{ ...tdStyle, textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 11, color: mentee.forumPosts === 0 ? '#DC2626' : 'var(--text-secondary)' }}>{mentee.forumPosts}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: sc.color, background: sc.bg, padding: '3px 10px', borderRadius: 'var(--radius-xs)' }}>{sc.label}</span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center', fontSize: 11, color: 'var(--text-tertiary)' }}>{mentee.lastCounselling || '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border-subtle)', fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>
          {filtered.length} mentees shown
        </div>
      </div>
    </div>
  );
}
