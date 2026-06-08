'use client';
import { useState } from 'react';
import { Clock, Download, CheckCircle2, XCircle, RotateCcw, Pencil, Video, GraduationCap } from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────

interface Session {
  id: string; title: string; course: string; courseName: string;
  programme: string; programmeName: string;
  date: string; time: string;
  scheduledDuration: string; totalDuration: string; cutoffDuration: string;
  cutoffMinutes: number; status: 'completed' | 'upcoming';
  presentCount?: number; totalCount?: number;
}

interface StudentAttendance {
  id: string; name: string; initials: string; rollNo: string;
  timeAttended: string; timeMinutes: number;
  autoStatus: 'present' | 'absent';
  overrideStatus?: 'present' | 'absent';
  overrideReason?: string;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────

const PROGRAMMES = [
  { id: 'all', name: 'All Programmes' },
  { id: 'MBA-26', name: 'MBA - Batch 2026' },
  { id: 'BCA-26', name: 'BCA - Batch 2026' },
];

const SESSIONS: Session[] = [
  { id: 'ls1', title: 'Demand & Supply Analysis', course: 'MBA-101', courseName: 'Managerial Economics', programme: 'MBA-26', programmeName: 'MBA - Batch 2026', date: '7 Jun 2026', time: '10:00 AM', scheduledDuration: '2h', totalDuration: '2h 15m', cutoffDuration: '1h 30m', cutoffMinutes: 90, status: 'completed', presentCount: 8, totalCount: 10 },
  { id: 'ls2', title: 'Elasticity of Demand', course: 'MBA-101', courseName: 'Managerial Economics', programme: 'MBA-26', programmeName: 'MBA - Batch 2026', date: '5 Jun 2026', time: '10:00 AM', scheduledDuration: '2h', totalDuration: '2h', cutoffDuration: '1h 30m', cutoffMinutes: 90, status: 'completed', presentCount: 9, totalCount: 10 },
  { id: 'ls3', title: 'Statistics Lab Session', course: 'MBA-105', courseName: 'Business Statistics', programme: 'MBA-26', programmeName: 'MBA - Batch 2026', date: '4 Jun 2026', time: '11:00 AM', scheduledDuration: '1h 30m', totalDuration: '1h 30m', cutoffDuration: '1h 8m', cutoffMinutes: 68, status: 'completed', presentCount: 10, totalCount: 10 },
  { id: 'ls4', title: 'Probability Workshop', course: 'MBA-105', courseName: 'Business Statistics', programme: 'MBA-26', programmeName: 'MBA - Batch 2026', date: '1 Jun 2026', time: '11:00 AM', scheduledDuration: '2h', totalDuration: '1h 55m', cutoffDuration: '1h 30m', cutoffMinutes: 90, status: 'completed', presentCount: 8, totalCount: 10 },
  { id: 'ls5', title: 'Linked Lists & Trees', course: 'BCA-201', courseName: 'Data Structures', programme: 'BCA-26', programmeName: 'BCA - Batch 2026', date: '6 Jun 2026', time: '2:00 PM', scheduledDuration: '2h', totalDuration: '2h', cutoffDuration: '1h 30m', cutoffMinutes: 90, status: 'completed', presentCount: 105, totalCount: 120 },
  { id: 'ls6', title: 'Graph Traversal Algorithms', course: 'BCA-201', courseName: 'Data Structures', programme: 'BCA-26', programmeName: 'BCA - Batch 2026', date: '3 Jun 2026', time: '2:00 PM', scheduledDuration: '2h', totalDuration: '1h 50m', cutoffDuration: '1h 30m', cutoffMinutes: 90, status: 'completed', presentCount: 98, totalCount: 120 },
  { id: 'ls7', title: 'Pre-Exam Revision', course: 'MBA-101', courseName: 'Managerial Economics', programme: 'MBA-26', programmeName: 'MBA - Batch 2026', date: '15 Jun 2026', time: '10:00 AM', scheduledDuration: '3h', totalDuration: '-', cutoffDuration: '2h 15m', cutoffMinutes: 135, status: 'upcoming' },
];

const MOCK_ATTENDANCE: Record<string, StudentAttendance[]> = {
  'ls1': [
    { id: 's1', name: 'Arjun Mehta', initials: 'AM', rollNo: 'MBA-2026-001', timeAttended: '2h 10m', timeMinutes: 130, autoStatus: 'present' },
    { id: 's2', name: 'Priya Sharma', initials: 'PS', rollNo: 'MBA-2026-002', timeAttended: '2h 15m', timeMinutes: 135, autoStatus: 'present' },
    { id: 's3', name: 'Rahul Verma', initials: 'RV', rollNo: 'MBA-2026-003', timeAttended: '42m', timeMinutes: 42, autoStatus: 'absent' },
    { id: 's8', name: 'Sneha Reddy', initials: 'SR', rollNo: 'MBA-2026-008', timeAttended: '2h 14m', timeMinutes: 134, autoStatus: 'present' },
    { id: 's6', name: 'Neha Patel', initials: 'NP', rollNo: 'MBA-2026-006', timeAttended: '0m', timeMinutes: 0, autoStatus: 'absent' },
    { id: 's11', name: 'Rohan Gupta', initials: 'RG', rollNo: 'MBA-2026-011', timeAttended: '1h 52m', timeMinutes: 112, autoStatus: 'present' },
    { id: 's13', name: 'Kavya Menon', initials: 'KM', rollNo: 'MBA-2026-013', timeAttended: '2h 5m', timeMinutes: 125, autoStatus: 'present' },
    { id: 's14', name: 'Siddharth Rao', initials: 'SR2', rollNo: 'MBA-2026-014', timeAttended: '1h 22m', timeMinutes: 82, autoStatus: 'absent', overrideStatus: 'present', overrideReason: 'Network issues — joined late, verified via chat logs' },
    { id: 's15', name: 'Aisha Khan', initials: 'AK', rollNo: 'MBA-2026-015', timeAttended: '2h 8m', timeMinutes: 128, autoStatus: 'present' },
    { id: 's16', name: 'Dev Malhotra', initials: 'DM', rollNo: 'MBA-2026-016', timeAttended: '1h 35m', timeMinutes: 95, autoStatus: 'present' },
  ],
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function AttendanceView() {
  const [selectedSession, setSelectedSession] = useState('ls1');
  const [programmeFilter, setProgrammeFilter] = useState('all');
  const [attendance, setAttendance] = useState<Record<string, StudentAttendance[]>>(MOCK_ATTENDANCE);
  const [editingOverride, setEditingOverride] = useState<string | null>(null);
  const [overrideReason, setOverrideReason] = useState('');

  const session = SESSIONS.find(s => s.id === selectedSession);
  const students = attendance[selectedSession] || [];
  const finalStatus = (s: StudentAttendance) => s.overrideStatus || s.autoStatus;
  const presentCount = students.filter(s => finalStatus(s) === 'present').length;
  const absentCount = students.filter(s => finalStatus(s) === 'absent').length;
  const overrideCount = students.filter(s => s.overrideStatus).length;

  const filteredSessions = programmeFilter === 'all' ? SESSIONS : SESSIONS.filter(s => s.programme === programmeFilter);

  const applyOverride = (studentId: string, status: 'present' | 'absent') => {
    setAttendance(prev => ({
      ...prev,
      [selectedSession]: (prev[selectedSession] || []).map(s =>
        s.id === studentId ? { ...s, overrideStatus: status, overrideReason: overrideReason || 'Manual override by faculty' } : s
      ),
    }));
    setEditingOverride(null);
    setOverrideReason('');
  };

  const removeOverride = (studentId: string) => {
    setAttendance(prev => ({
      ...prev,
      [selectedSession]: (prev[selectedSession] || []).map(s =>
        s.id === studentId ? { ...s, overrideStatus: undefined, overrideReason: undefined } : s
      ),
    }));
  };

  const thStyle: React.CSSProperties = { fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'var(--font-sans)', padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)', whiteSpace: 'nowrap' };
  const tdStyle: React.CSSProperties = { fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', padding: '10px 14px', borderBottom: '1px solid rgba(0,0,0,0.03)' };

  return (
    <div style={{ padding: '28px 40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', margin: 0 }}>Attendance</h1>
          <p style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500, marginTop: 4 }}>Auto-marked based on 75% session duration cut-off &middot; Override when needed</p>
        </div>
        <select value={programmeFilter} onChange={e => setProgrammeFilter(e.target.value)} style={{
          padding: '8px 28px 8px 14px', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)',
          background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)',
          fontFamily: 'var(--font-sans)', outline: 'none', cursor: 'pointer',
          appearance: 'none', WebkitAppearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
        }}>
          {PROGRAMMES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20 }}>
        {/* Left: Session list */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10, paddingLeft: 2 }}>Live Sessions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {filteredSessions.map(s => {
              const isActive = selectedSession === s.id;
              const attendanceRate = s.presentCount && s.totalCount ? Math.round((s.presentCount / s.totalCount) * 100) : null;
              return (
                <button key={s.id} onClick={() => setSelectedSession(s.id)} style={{
                  textAlign: 'left', padding: '14px 16px', borderRadius: 'var(--radius-sm)',
                  background: isActive ? '#fff' : 'transparent',
                  border: isActive ? '1px solid var(--border-subtle)' : '1px solid transparent',
                  boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
                  cursor: 'pointer', fontFamily: 'var(--font-sans)',
                }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(0,0,0,0.02)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = isActive ? '#fff' : 'transparent'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <Video size={12} style={{ color: isActive ? 'var(--blue-700)' : 'var(--text-tertiary)', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>{s.title}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, paddingLeft: 18 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--blue-700)', background: 'rgba(7,47,181,0.06)', padding: '1px 6px', borderRadius: 'var(--radius-xs)', fontFamily: 'var(--font-mono)' }}>{s.course}</span>
                    <span style={{ fontSize: 10.5, color: 'var(--text-tertiary)' }}>{s.courseName}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 18 }}>
                    <span style={{ fontSize: 10.5, color: 'var(--text-tertiary)', fontWeight: 500 }}>{s.date}, {s.time}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>&middot; {s.scheduledDuration}</span>
                    {s.status === 'upcoming' ? (
                      <span style={{ fontSize: 9.5, fontWeight: 700, color: '#072FB5', background: 'rgba(7,47,181,0.06)', padding: '1px 6px', borderRadius: 'var(--radius-xs)', marginLeft: 'auto' }}>Upcoming</span>
                    ) : attendanceRate !== null && (
                      <span style={{ fontSize: 10, fontWeight: 600, fontFamily: 'var(--font-mono)', color: attendanceRate >= 80 ? '#059669' : '#D97706', marginLeft: 'auto' }}>{s.presentCount}/{s.totalCount}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Attendance detail */}
        <div>
          {session && (
            <>
              {/* Session header */}
              <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', padding: '20px 24px', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <Video size={16} style={{ color: 'var(--blue-700)' }} />
                      <span style={{ fontSize: 17, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{session.title}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 24 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--blue-700)', background: 'rgba(7,47,181,0.06)', padding: '2px 8px', borderRadius: 'var(--radius-xs)', fontFamily: 'var(--font-mono)' }}>{session.course}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{session.courseName}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>&middot; {session.date}, {session.time}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle2 size={15} style={{ color: '#059669' }} />
                      <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#059669' }}>{presentCount}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <XCircle size={15} style={{ color: '#DC2626' }} />
                      <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#DC2626' }}>{absentCount}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>/{students.length}</span>
                  </div>
                </div>

                {/* Duration cards */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, paddingTop: 14, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                  <div style={{ background: 'var(--bg-section)', borderRadius: 'var(--radius-xs)', padding: '10px 14px' }}>
                    <div style={{ fontSize: 9.5, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>Scheduled</div>
                    <div style={{ fontSize: 16, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{session.scheduledDuration}</div>
                  </div>
                  <div style={{ background: 'var(--bg-section)', borderRadius: 'var(--radius-xs)', padding: '10px 14px' }}>
                    <div style={{ fontSize: 9.5, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>Total Duration</div>
                    <div style={{ fontSize: 16, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{session.totalDuration}</div>
                  </div>
                  <div style={{ background: 'rgba(217,119,6,0.04)', borderRadius: 'var(--radius-xs)', padding: '10px 14px', border: '1px solid rgba(217,119,6,0.08)' }}>
                    <div style={{ fontSize: 9.5, fontWeight: 600, color: '#D97706', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>Cut-off (75%)</div>
                    <div style={{ fontSize: 16, fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#D97706' }}>{session.cutoffDuration}</div>
                  </div>
                </div>

                {overrideCount > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 10 }}>
                    <Pencil size={11} style={{ color: '#D97706' }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#D97706' }}>{overrideCount} manual override{overrideCount !== 1 ? 's' : ''} applied</span>
                  </div>
                )}
              </div>

              {/* Export */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
                <button style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 12px', fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)', background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                  <Download size={12} /> Export
                </button>
              </div>

              {/* Table */}
              <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ ...thStyle, width: 36, textAlign: 'center' }}>#</th>
                      <th style={{ ...thStyle, minWidth: 160 }}>Student</th>
                      <th style={thStyle}>Roll No</th>
                      <th style={{ ...thStyle, textAlign: 'center' }}>Time Attended</th>
                      <th style={{ ...thStyle, textAlign: 'center' }}>Auto Status</th>
                      <th style={{ ...thStyle, textAlign: 'center' }}>Final Status</th>
                      <th style={{ ...thStyle, textAlign: 'center' }}>Override</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, idx) => {
                      const final = finalStatus(student);
                      const hasOverride = !!student.overrideStatus;
                      const isEditing = editingOverride === student.id;
                      const timeColor = student.timeMinutes >= (session?.cutoffMinutes || 0) ? '#059669' : student.timeMinutes > 0 ? '#DC2626' : 'var(--text-tertiary)';
                      const pct = session && session.cutoffMinutes > 0 ? Math.min(100, Math.round((student.timeMinutes / (session.cutoffMinutes / 0.75)) * 100)) : 0;

                      return (
                        <tr key={student.id} style={{ background: final === 'absent' ? 'rgba(220,38,38,0.02)' : hasOverride ? 'rgba(217,119,6,0.02)' : 'transparent' }}>
                          <td style={{ ...tdStyle, textAlign: 'center', fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{idx + 1}</td>
                          <td style={tdStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--bg-section)', border: '1px solid var(--border-subtle)', display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 700, color: 'var(--text-secondary)', flexShrink: 0 }}>{student.initials}</div>
                              <span style={{ fontSize: 12.5, fontWeight: 600 }}>{student.name}</span>
                            </div>
                          </td>
                          <td style={{ ...tdStyle, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{student.rollNo}</td>
                          <td style={{ ...tdStyle, textAlign: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                              <div style={{ width: 40, height: 4, background: 'var(--bg-section)', borderRadius: 2, overflow: 'hidden' }}>
                                <div style={{ width: `${pct}%`, height: '100%', background: timeColor, borderRadius: 2 }} />
                              </div>
                              <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', color: timeColor, minWidth: 44 }}>{student.timeAttended}</span>
                            </div>
                          </td>
                          <td style={{ ...tdStyle, textAlign: 'center' }}>
                            <span style={{ fontSize: 10.5, fontWeight: 600, color: student.autoStatus === 'present' ? '#059669' : '#DC2626', textTransform: 'capitalize' }}>{student.autoStatus}</span>
                          </td>
                          <td style={{ ...tdStyle, textAlign: 'center' }}>
                            <span style={{
                              fontSize: 10.5, fontWeight: 700, padding: '3px 10px', borderRadius: 'var(--radius-xs)', textTransform: 'capitalize',
                              color: final === 'present' ? '#059669' : '#DC2626',
                              background: final === 'present' ? 'rgba(5,150,105,0.06)' : 'rgba(220,38,38,0.06)',
                            }}>{final}</span>
                            {hasOverride && (
                              <div style={{ fontSize: 9, color: '#D97706', fontWeight: 600, marginTop: 2 }}>Overridden</div>
                            )}
                          </td>
                          <td style={{ ...tdStyle, textAlign: 'center' }}>
                            {isEditing ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                                <input value={overrideReason} onChange={e => setOverrideReason(e.target.value)} placeholder="Reason..." style={{ width: 140, padding: '3px 6px', fontSize: 10, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)', fontFamily: 'var(--font-sans)', outline: 'none' }} />
                                <div style={{ display: 'flex', gap: 3 }}>
                                  <button onClick={() => applyOverride(student.id, student.autoStatus === 'absent' ? 'present' : 'absent')} style={{ padding: '2px 8px', fontSize: 10, fontWeight: 600, color: '#059669', background: 'rgba(5,150,105,0.06)', border: '1px solid rgba(5,150,105,0.15)', borderRadius: 'var(--radius-xs)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                                    {student.autoStatus === 'absent' ? 'Mark Present' : 'Mark Absent'}
                                  </button>
                                  <button onClick={() => setEditingOverride(null)} style={{ padding: '2px 6px', fontSize: 10, fontWeight: 500, color: 'var(--text-tertiary)', background: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Cancel</button>
                                </div>
                              </div>
                            ) : hasOverride ? (
                              <button onClick={() => removeOverride(student.id)} title="Remove override" style={{ padding: '3px 8px', fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', background: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)', cursor: 'pointer', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: 3, margin: '0 auto' }}>
                                <RotateCcw size={10} /> Revert
                              </button>
                            ) : (
                              <button onClick={() => { setEditingOverride(student.id); setOverrideReason(''); }} style={{ padding: '3px 8px', fontSize: 10, fontWeight: 600, color: 'var(--blue-700)', background: 'rgba(7,47,181,0.04)', border: '1px solid rgba(7,47,181,0.12)', borderRadius: 'var(--radius-xs)', cursor: 'pointer', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: 3, margin: '0 auto' }}>
                                <Pencil size={10} /> Override
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>
                  <span>{students.length} students &middot; {presentCount} present &middot; {absentCount} absent</span>
                  <span>Cut-off: {session?.cutoffDuration} (75% of {session?.scheduledDuration})</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
