'use client';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Download, GraduationCap, AlertTriangle, CheckCircle2, XCircle, Users, FileText, BarChart3 } from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────

type ReportType = 'engagement' | 'exam';

interface EngagementRow {
  id: string; name: string; rollNo: string; initials: string;
  engagement: number; attendance: number; fortnightHours: number;
  quadrants: { live: number; tutorial: number; content: number; forum: number };
  eligible: boolean;
}

interface ExamSummaryRow {
  examId: string; courseCode: string; courseName: string; type: string;
  date: string; eligible: number; appeared: number; absent: number;
  passed: number; failed: number; avgScore: number; maxMarks: number;
  overrides: number;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────

const PROGRAMMES = [
  { id: 'mba-26', name: 'MBA - Batch 2026', code: 'MBA-26', semesters: 4 },
  { id: 'bca-26', name: 'BCA - Batch 2026', code: 'BCA-26', semesters: 6 },
  { id: 'cse-26', name: 'B.Tech CSE - Batch 2026', code: 'CSE-26', semesters: 8 },
];

const ENGAGEMENT_DATA: EngagementRow[] = [
  { id: 's8', name: 'Sneha Reddy', rollNo: 'MBA-2026-008', initials: 'SR', engagement: 95, attendance: 98, fortnightHours: 18.5, quadrants: { live: 100, tutorial: 92, content: 95, forum: 88 }, eligible: true },
  { id: 's2', name: 'Priya Sharma', rollNo: 'MBA-2026-002', initials: 'PS', engagement: 91, attendance: 96, fortnightHours: 16.2, quadrants: { live: 96, tutorial: 88, content: 90, forum: 82 }, eligible: true },
  { id: 's13', name: 'Kavya Menon', rollNo: 'MBA-2026-013', initials: 'KM', engagement: 87, attendance: 91, fortnightHours: 14.8, quadrants: { live: 90, tutorial: 85, content: 88, forum: 78 }, eligible: true },
  { id: 's15', name: 'Aisha Khan', rollNo: 'MBA-2026-015', initials: 'AK', engagement: 85, attendance: 90, fortnightHours: 13.5, quadrants: { live: 88, tutorial: 82, content: 86, forum: 76 }, eligible: true },
  { id: 's1', name: 'Arjun Mehta', rollNo: 'MBA-2026-001', initials: 'AM', engagement: 72, attendance: 88, fortnightHours: 10.1, quadrants: { live: 80, tutorial: 68, content: 72, forum: 55 }, eligible: false },
  { id: 's11', name: 'Rohan Gupta', rollNo: 'MBA-2026-011', initials: 'RG', engagement: 67, attendance: 82, fortnightHours: 9.4, quadrants: { live: 76, tutorial: 62, content: 68, forum: 48 }, eligible: false },
  { id: 's14', name: 'Siddharth Rao', rollNo: 'MBA-2026-014', initials: 'SR2', engagement: 58, attendance: 73, fortnightHours: 7.2, quadrants: { live: 68, tutorial: 55, content: 52, forum: 40 }, eligible: false },
  { id: 's16', name: 'Dev Malhotra', rollNo: 'MBA-2026-016', initials: 'DM', engagement: 51, attendance: 68, fortnightHours: 5.8, quadrants: { live: 60, tutorial: 48, content: 45, forum: 35 }, eligible: false },
  { id: 's3', name: 'Rahul Verma', rollNo: 'MBA-2026-003', initials: 'RV', engagement: 38, attendance: 52, fortnightHours: 3.2, quadrants: { live: 44, tutorial: 32, content: 35, forum: 20 }, eligible: false },
  { id: 's6', name: 'Neha Patel', rollNo: 'MBA-2026-006', initials: 'NP', engagement: 28, attendance: 40, fortnightHours: 1.5, quadrants: { live: 30, tutorial: 22, content: 28, forum: 12 }, eligible: false },
];

const EXAM_SUMMARY_DATA: ExamSummaryRow[] = [
  { examId: 'e1', courseCode: 'MBA-101', courseName: 'Managerial Economics', type: 'Mid Sem', date: '10 Mar 2026', eligible: 10, appeared: 9, absent: 1, passed: 8, failed: 1, avgScore: 10.3, maxMarks: 15, overrides: 0 },
  { examId: 'e2', courseCode: 'MBA-102', courseName: 'Managerial Communication', type: 'Mid Sem', date: '11 Mar 2026', eligible: 10, appeared: 9, absent: 1, passed: 7, failed: 2, avgScore: 9.1, maxMarks: 15, overrides: 0 },
  { examId: 'e3', courseCode: 'MBA-103', courseName: 'Financial Accounting', type: 'Mid Sem', date: '12 Mar 2026', eligible: 10, appeared: 10, absent: 0, passed: 9, failed: 1, avgScore: 11.2, maxMarks: 15, overrides: 0 },
  { examId: 'e4', courseCode: 'MBA-104', courseName: 'Organizational Behaviour', type: 'Mid Sem', date: '13 Mar 2026', eligible: 10, appeared: 8, absent: 2, passed: 7, failed: 1, avgScore: 9.8, maxMarks: 15, overrides: 0 },
  { examId: 'e5', courseCode: 'MBA-105', courseName: 'Business Statistics', type: 'Mid Sem', date: '14 Mar 2026', eligible: 10, appeared: 9, absent: 1, passed: 8, failed: 1, avgScore: 10.0, maxMarks: 15, overrides: 0 },
  { examId: 'e6', courseCode: 'MBA-106', courseName: 'Business Law & Ethics', type: 'Mid Sem', date: '15 Mar 2026', eligible: 10, appeared: 10, absent: 0, passed: 9, failed: 1, avgScore: 10.5, maxMarks: 15, overrides: 0 },
  { examId: 'e7', courseCode: 'MBA-101', courseName: 'Managerial Economics', type: 'Mid Sem', date: '5 May 2026', eligible: 10, appeared: 9, absent: 1, passed: 8, failed: 1, avgScore: 6.8, maxMarks: 10, overrides: 0 },
  { examId: 'e8', courseCode: 'MBA-102', courseName: 'Managerial Communication', type: 'Mid Sem', date: '6 May 2026', eligible: 10, appeared: 8, absent: 2, passed: 7, failed: 1, avgScore: 6.2, maxMarks: 10, overrides: 0 },
  { examId: 'e9', courseCode: 'MBA-103', courseName: 'Financial Accounting', type: 'Mid Sem', date: '7 May 2026', eligible: 10, appeared: 10, absent: 0, passed: 9, failed: 1, avgScore: 7.4, maxMarks: 10, overrides: 0 },
  { examId: 'e10', courseCode: 'MBA-104', courseName: 'Organizational Behaviour', type: 'Mid Sem', date: '8 May 2026', eligible: 10, appeared: 8, absent: 2, passed: 7, failed: 1, avgScore: 6.5, maxMarks: 10, overrides: 0 },
  { examId: 'e11', courseCode: 'MBA-105', courseName: 'Business Statistics', type: 'Mid Sem', date: '9 May 2026', eligible: 10, appeared: 9, absent: 1, passed: 8, failed: 1, avgScore: 6.9, maxMarks: 10, overrides: 0 },
  { examId: 'e12', courseCode: 'MBA-106', courseName: 'Business Law & Ethics', type: 'Mid Sem', date: '10 May 2026', eligible: 10, appeared: 10, absent: 0, passed: 9, failed: 1, avgScore: 7.1, maxMarks: 10, overrides: 0 },
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function ReportsView() {
  const [selectedProgramme, setSelectedProgramme] = useState('mba-26');
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [activeReport, setActiveReport] = useState<ReportType>('engagement');
  const [showProgrammeDD, setShowProgrammeDD] = useState(false);
  const [engagementSort, setEngagementSort] = useState<'engagement' | 'attendance'>('engagement');
  const [examTypeFilter, setExamTypeFilter] = useState<'all' | 'Mid Sem' | 'End Sem'>('all');
  const programmeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (programmeRef.current && !programmeRef.current.contains(e.target as Node)) setShowProgrammeDD(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const programme = PROGRAMMES.find(p => p.id === selectedProgramme) || PROGRAMMES[0];

  // Engagement stats
  const totalStudents = ENGAGEMENT_DATA.length;
  const eligibleCount = ENGAGEMENT_DATA.filter(s => s.eligible).length;
  const belowCount = totalStudents - eligibleCount;
  const avgFortnightHrs = +(ENGAGEMENT_DATA.reduce((s, r) => s + r.fortnightHours, 0) / totalStudents).toFixed(1);

  // Exam stats
  const filteredExams = examTypeFilter === 'all' ? EXAM_SUMMARY_DATA : EXAM_SUMMARY_DATA.filter(e => e.type === examTypeFilter);
  const totalExams = filteredExams.length;
  const totalAppeared = filteredExams.reduce((s, e) => s + e.appeared, 0);
  const totalAbsent = filteredExams.reduce((s, e) => s + e.absent, 0);
  const totalPassed = filteredExams.reduce((s, e) => s + e.passed, 0);
  const totalFailed = filteredExams.reduce((s, e) => s + e.failed, 0);
  const overallPassRate = totalAppeared > 0 ? Math.round((totalPassed / totalAppeared) * 100) : 0;

  const sortedEngagement = [...ENGAGEMENT_DATA].sort((a, b) => {
    if (engagementSort === 'attendance') return b.attendance - a.attendance;
    return b.engagement - a.engagement;
  });

  const thStyle: React.CSSProperties = { fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'var(--font-sans)', padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)', whiteSpace: 'nowrap' };
  const tdStyle: React.CSSProperties = { fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', padding: '10px 14px', borderBottom: '1px solid rgba(0,0,0,0.03)' };

  const TABS: { key: ReportType; label: string }[] = [
    { key: 'engagement', label: 'Engagement & Eligibility' },
    { key: 'exam', label: 'Exam Summary' },
  ];

  return (
    <div style={{ padding: '28px 40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', margin: 0 }}>Reports</h1>
          <p style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500, marginTop: 4 }}>UGC compliance reports &amp; programme analytics</p>
        </div>
        <div ref={programmeRef} style={{ position: 'relative' }}>
          <button onClick={() => setShowProgrammeDD(!showProgrammeDD)} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', fontSize: 13, fontWeight: 600,
            color: 'var(--text-primary)', background: '#fff', border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)',
          }}>
            <GraduationCap size={14} strokeWidth={1.5} style={{ color: 'var(--text-tertiary)' }} />
            {programme.name}
            <ChevronDown size={14} style={{ color: 'var(--text-tertiary)' }} />
          </button>
          {showProgrammeDD && (
            <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 4, zIndex: 50, background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', minWidth: 220, overflow: 'hidden' }}>
              {PROGRAMMES.map(p => (
                <button key={p.id} onClick={() => { setSelectedProgramme(p.id); setShowProgrammeDD(false); }} style={{
                  display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', fontSize: 12.5,
                  fontWeight: selectedProgramme === p.id ? 700 : 500, color: selectedProgramme === p.id ? 'var(--blue-700)' : 'var(--text-primary)',
                  background: selectedProgramme === p.id ? 'rgba(7,47,181,0.04)' : 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)',
                }}>{p.name}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1.5px solid var(--border-subtle)', marginBottom: 24 }}>
        {TABS.map(t => {
          const isActive = activeReport === t.key;
          return (
            <button key={t.key} onClick={() => setActiveReport(t.key)} style={{
              padding: '10px 20px', fontSize: 13, fontWeight: isActive ? 700 : 500,
              color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
              background: 'transparent', border: 'none',
              borderBottom: isActive ? '2px solid var(--text-primary)' : '2px solid transparent',
              marginBottom: '-1.5px', cursor: 'pointer', fontFamily: 'var(--font-sans)',
            }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = isActive ? 'var(--text-primary)' : 'var(--text-tertiary)'; }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ═══ ENGAGEMENT & ELIGIBILITY ═══ */}
      {activeReport === 'engagement' && (
        <div>
          {/* Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>Semester {selectedSemester} &middot; {programme.name} &middot; UGC Regulation 15.1.c.iii</div>
            <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
              <Download size={13} /> Export CSV
            </button>
          </div>

          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
            <div style={{ background: '#fff', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <Users size={14} style={{ color: 'var(--text-tertiary)' }} />
                <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Total Students</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{totalStudents}</div>
            </div>
            <div style={{ background: '#fff', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <CheckCircle2 size={14} style={{ color: '#059669' }} />
                <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Eligible (75%+)</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#059669', letterSpacing: '-0.02em' }}>{eligibleCount}</div>
            </div>
            <div style={{ background: '#fff', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <XCircle size={14} style={{ color: '#DC2626' }} />
                <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Below Threshold</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#DC2626', letterSpacing: '-0.02em' }}>{belowCount}</div>
            </div>
          </div>

          {/* UGC note */}
          <div style={{ background: 'rgba(7,47,181,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(7,47,181,0.08)', padding: '10px 14px', marginBottom: 16, fontSize: 11, color: 'var(--text-secondary)', display: 'flex', gap: 8, alignItems: 'center' }}>
            <AlertTriangle size={13} style={{ color: 'var(--blue-700)', opacity: 0.6, flexShrink: 0 }} />
            <span><b>UGC Requirement:</b> Students must maintain 75% engagement across all 4 quadrants and log minimum 2 hours of activity every fortnight (Reg 13.e). Students below threshold are ineligible for End Semester exams.</span>
          </div>

          {/* Sort */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)' }}>Sort by:</span>
            {([['engagement', 'Engagement %'] as const, ['attendance', 'Attendance'] as const]).map(([key, label]) => (
              <button key={key} onClick={() => setEngagementSort(key)} style={{
                padding: '4px 10px', fontSize: 11, fontWeight: engagementSort === key ? 700 : 500,
                color: engagementSort === key ? 'var(--blue-700)' : 'var(--text-tertiary)',
                background: engagementSort === key ? 'rgba(7,47,181,0.04)' : 'transparent',
                border: engagementSort === key ? '1px solid rgba(7,47,181,0.12)' : '1px solid transparent',
                borderRadius: 'var(--radius-xs)', cursor: 'pointer', fontFamily: 'var(--font-sans)',
              }}>{label}</button>
            ))}
          </div>

          {/* Table */}
          <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ ...thStyle, width: 36, textAlign: 'center' }}>#</th>
                    <th style={{ ...thStyle, minWidth: 160 }}>Student</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Engagement</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Attendance</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Fortnight Hrs</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Live</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Tutorial</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Content</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Forum</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Eligibility</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedEngagement.map((student, idx) => {
                    const engColor = student.engagement >= 75 ? '#059669' : student.engagement >= 50 ? '#D97706' : '#DC2626';
                    const attColor = student.attendance >= 75 ? '#059669' : student.attendance >= 50 ? '#D97706' : '#DC2626';
                    return (
                      <tr key={student.id} style={{ background: !student.eligible ? (student.engagement < 50 ? 'rgba(220,38,38,0.02)' : 'rgba(217,119,6,0.02)') : 'transparent' }}>
                        <td style={{ ...tdStyle, textAlign: 'center', fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{idx + 1}</td>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--bg-section)', border: '1px solid var(--border-subtle)', display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 700, color: 'var(--text-secondary)', flexShrink: 0 }}>{student.initials}</div>
                            <div>
                              <div style={{ fontSize: 12.5, fontWeight: 600 }}>{student.name}</div>
                              <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{student.rollNo}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                            <div style={{ width: 40, height: 4, background: 'var(--bg-section)', borderRadius: 2, overflow: 'hidden' }}>
                              <div style={{ width: `${student.engagement}%`, height: '100%', background: engColor, borderRadius: 2 }} />
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', color: engColor, minWidth: 32 }}>{student.engagement}%</span>
                          </div>
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 12, color: attColor }}>{student.attendance}%</td>
                        <td style={{ ...tdStyle, textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 12, color: student.fortnightHours >= 2 ? 'var(--text-primary)' : '#DC2626' }}>{student.fortnightHours}h</td>
                        {(['live', 'tutorial', 'content', 'forum'] as const).map(q => {
                          const val = student.quadrants[q];
                          const qColor = val >= 75 ? '#059669' : val >= 50 ? '#D97706' : '#DC2626';
                          return (
                            <td key={q} style={{ ...tdStyle, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: qColor }}>{val}%</td>
                          );
                        })}
                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                          {student.eligible ? (
                            <span style={{ fontSize: 10.5, fontWeight: 700, color: '#059669', background: 'rgba(5,150,105,0.06)', padding: '3px 10px', borderRadius: 'var(--radius-xs)' }}>Eligible</span>
                          ) : (
                            <span style={{ fontSize: 10.5, fontWeight: 700, color: '#DC2626', background: 'rgba(220,38,38,0.06)', padding: '3px 10px', borderRadius: 'var(--radius-xs)' }}>Ineligible</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>
              <span>{totalStudents} students &middot; {eligibleCount} eligible &middot; {belowCount} below threshold</span>
              <span>Avg fortnightly hours: {avgFortnightHrs}h (min required: 2h)</span>
            </div>
          </div>
        </div>
      )}

      {/* ═══ EXAM SUMMARY ═══ */}
      {activeReport === 'exam' && (
        <div>
          {/* Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>Semester {selectedSemester} &middot; {programme.name}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['all', 'Mid Sem', 'End Sem'] as const).map(filter => (
                <button key={filter} onClick={() => setExamTypeFilter(filter)} style={{
                  padding: '5px 12px', fontSize: 11.5, fontWeight: examTypeFilter === filter ? 700 : 500,
                  color: examTypeFilter === filter ? '#fff' : 'var(--text-secondary)',
                  background: examTypeFilter === filter ? 'var(--blue-700)' : '#fff',
                  border: examTypeFilter === filter ? '1px solid var(--blue-700)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)',
                }}>{filter === 'all' ? 'All Exams' : filter}</button>
              ))}
              <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 14px', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                <Download size={13} /> Export
              </button>
            </div>
          </div>

          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
            <div style={{ background: '#fff', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', padding: '16px 20px' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>Total Exams</div>
              <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{totalExams}</div>
            </div>
            <div style={{ background: '#fff', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', padding: '16px 20px' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>Pass Rate</div>
              <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-mono)', color: overallPassRate >= 80 ? '#059669' : overallPassRate >= 60 ? '#D97706' : '#DC2626', letterSpacing: '-0.02em' }}>{overallPassRate}%</div>
            </div>
            <div style={{ background: '#fff', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', padding: '16px 20px' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>Total Appeared</div>
              <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{totalAppeared}</div>
            </div>
            <div style={{ background: '#fff', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', padding: '16px 20px' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>Failed</div>
              <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-mono)', color: totalFailed > 0 ? '#DC2626' : '#059669', letterSpacing: '-0.02em' }}>{totalFailed}</div>
            </div>
          </div>

          {/* Table */}
          <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Date</th>
                    <th style={{ ...thStyle, minWidth: 180 }}>Course</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Type</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Eligible</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Appeared</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Absent</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Passed</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Failed</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Pass Rate</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Avg Score</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExams.map(exam => {
                    const passRate = exam.appeared > 0 ? Math.round((exam.passed / exam.appeared) * 100) : 0;
                    const passColor = passRate >= 80 ? '#059669' : passRate >= 60 ? '#D97706' : '#DC2626';
                    return (
                      <tr key={exam.examId} style={{ background: passRate < 60 ? 'rgba(220,38,38,0.02)' : 'transparent' }}>
                        <td style={{ ...tdStyle, fontSize: 12, fontWeight: 600 }}>{exam.date}</td>
                        <td style={tdStyle}>
                          <div style={{ fontSize: 12.5, fontWeight: 600 }}>{exam.courseName}</div>
                          <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', marginTop: 1 }}>{exam.courseCode}</div>
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                          <span style={{ fontSize: 10.5, fontWeight: 700, color: exam.type === 'Mid Sem' ? '#072FB5' : '#1a1a1a', background: exam.type === 'Mid Sem' ? 'rgba(7,47,181,0.06)' : 'rgba(0,0,0,0.05)', padding: '2px 8px', borderRadius: 'var(--radius-xs)' }}>{exam.type}</span>
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{exam.eligible}</td>
                        <td style={{ ...tdStyle, textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{exam.appeared}</td>
                        <td style={{ ...tdStyle, textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 600, color: exam.absent > 0 ? '#DC2626' : 'var(--text-tertiary)' }}>{exam.absent}</td>
                        <td style={{ ...tdStyle, textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#059669' }}>{exam.passed}</td>
                        <td style={{ ...tdStyle, textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 600, color: exam.failed > 0 ? '#DC2626' : 'var(--text-tertiary)' }}>{exam.failed}</td>
                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: passColor, background: `${passColor}10`, padding: '2px 8px', borderRadius: 'var(--radius-xs)' }}>{passRate}%</span>
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 12 }}>
                          {exam.avgScore.toFixed(1)}<span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>/{exam.maxMarks}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>
              <span>{totalExams} exams &middot; {totalAppeared} total appearances &middot; {totalAbsent} absences</span>
              <span>Overall: {totalPassed} passed, {totalFailed} failed ({overallPassRate}% pass rate)</span>
            </div>
          </div>

          {/* Attention flags */}
          {filteredExams.some(e => e.appeared > 0 && Math.round((e.passed / e.appeared) * 100) < 70) && (
            <div style={{ marginTop: 16, background: 'rgba(217,119,6,0.04)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(217,119,6,0.15)', padding: '14px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <AlertTriangle size={14} style={{ color: '#D97706' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#D97706' }}>Attention Required</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {filteredExams.filter(e => e.appeared > 0 && Math.round((e.passed / e.appeared) * 100) < 70).map(e => (
                  <div key={e.examId} style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--text-secondary)' }}>
                    <span style={{ fontWeight: 700 }}>{e.courseCode}</span> ({e.type}, {e.date}) &mdash; {Math.round((e.passed / e.appeared) * 100)}% pass rate, {e.failed} failure(s), {e.absent} absent
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
