'use client';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Download, GraduationCap, AlertTriangle, CheckCircle2, XCircle, Users } from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────

interface EngagementRow {
  id: string; name: string; rollNo: string; initials: string;
  engagement: number; attendance: number;
  quadrants: { live: number; tutorial: number; content: number; forum: number };
  eligible: boolean;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────

const PROGRAMMES = [
  { id: 'mba-26', name: 'MBA - Batch 2026', code: 'MBA-26', semesters: 4 },
  { id: 'bca-26', name: 'BCA - Batch 2026', code: 'BCA-26', semesters: 6 },
  { id: 'cse-26', name: 'B.Tech CSE - Batch 2026', code: 'CSE-26', semesters: 8 },
];

const ENGAGEMENT_DATA: EngagementRow[] = [
  { id: 's8', name: 'Sneha Reddy', rollNo: 'MBA-2026-008', initials: 'SR', engagement: 95, attendance: 98, quadrants: { live: 100, tutorial: 92, content: 95, forum: 88 }, eligible: true },
  { id: 's2', name: 'Priya Sharma', rollNo: 'MBA-2026-002', initials: 'PS', engagement: 91, attendance: 96, quadrants: { live: 96, tutorial: 88, content: 90, forum: 82 }, eligible: true },
  { id: 's13', name: 'Kavya Menon', rollNo: 'MBA-2026-013', initials: 'KM', engagement: 87, attendance: 91, quadrants: { live: 90, tutorial: 85, content: 88, forum: 78 }, eligible: true },
  { id: 's15', name: 'Aisha Khan', rollNo: 'MBA-2026-015', initials: 'AK', engagement: 85, attendance: 90, quadrants: { live: 88, tutorial: 82, content: 86, forum: 76 }, eligible: true },
  { id: 's1', name: 'Arjun Mehta', rollNo: 'MBA-2026-001', initials: 'AM', engagement: 72, attendance: 88, quadrants: { live: 80, tutorial: 68, content: 72, forum: 55 }, eligible: false },
  { id: 's11', name: 'Rohan Gupta', rollNo: 'MBA-2026-011', initials: 'RG', engagement: 67, attendance: 82, quadrants: { live: 76, tutorial: 62, content: 68, forum: 48 }, eligible: false },
  { id: 's14', name: 'Siddharth Rao', rollNo: 'MBA-2026-014', initials: 'SR2', engagement: 58, attendance: 73, quadrants: { live: 68, tutorial: 55, content: 52, forum: 40 }, eligible: false },
  { id: 's16', name: 'Dev Malhotra', rollNo: 'MBA-2026-016', initials: 'DM', engagement: 51, attendance: 68, quadrants: { live: 60, tutorial: 48, content: 45, forum: 35 }, eligible: false },
  { id: 's3', name: 'Rahul Verma', rollNo: 'MBA-2026-003', initials: 'RV', engagement: 38, attendance: 52, quadrants: { live: 44, tutorial: 32, content: 35, forum: 20 }, eligible: false },
  { id: 's6', name: 'Neha Patel', rollNo: 'MBA-2026-006', initials: 'NP', engagement: 28, attendance: 40, quadrants: { live: 30, tutorial: 22, content: 28, forum: 12 }, eligible: false },
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function ReportsView() {
  const [selectedProgramme, setSelectedProgramme] = useState('mba-26');
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [showProgrammeDD, setShowProgrammeDD] = useState(false);
  const [engagementSort, setEngagementSort] = useState<'engagement' | 'attendance'>('engagement');
  const [eligibilityFilter, setEligibilityFilter] = useState<'all' | 'eligible' | 'ineligible'>('all');
  const programmeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (programmeRef.current && !programmeRef.current.contains(e.target as Node)) setShowProgrammeDD(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const programme = PROGRAMMES.find(p => p.id === selectedProgramme) || PROGRAMMES[0];
  const totalStudents = ENGAGEMENT_DATA.length;
  const eligibleCount = ENGAGEMENT_DATA.filter(s => s.eligible).length;
  const belowCount = totalStudents - eligibleCount;

  const filteredData = ENGAGEMENT_DATA.filter(s => {
    if (eligibilityFilter === 'eligible') return s.eligible;
    if (eligibilityFilter === 'ineligible') return !s.eligible;
    return true;
  });

  const sortedEngagement = [...filteredData].sort((a, b) => {
    if (engagementSort === 'attendance') return b.attendance - a.attendance;
    return b.engagement - a.engagement;
  });

  return (
    <div style={{ padding: '28px 40px', maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', margin: 0 }}>Engagement & Eligibility</h1>
          <p style={{ fontSize: 13, color: 'var(--text-tertiary)', fontWeight: 500, marginTop: 5 }}>UGC Regulation 15.1.c.iii — 75% engagement threshold for exam eligibility</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div ref={programmeRef} style={{ position: 'relative' }}>
            <button onClick={() => setShowProgrammeDD(!showProgrammeDD)} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', fontSize: 13, fontWeight: 600,
              color: 'var(--text-primary)', background: '#fff', border: '1px solid var(--border-subtle)',
              borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font-sans)',
            }}>
              <GraduationCap size={15} strokeWidth={1.5} style={{ color: 'var(--text-tertiary)' }} />
              {programme.name}
              <ChevronDown size={14} style={{ color: 'var(--text-tertiary)' }} />
            </button>
            {showProgrammeDD && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 4, zIndex: 50, background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', minWidth: 220, overflow: 'hidden' }}>
                {PROGRAMMES.map(p => (
                  <button key={p.id} onClick={() => { setSelectedProgramme(p.id); setShowProgrammeDD(false); }} style={{
                    display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', fontSize: 13,
                    fontWeight: selectedProgramme === p.id ? 700 : 500, color: selectedProgramme === p.id ? 'var(--blue-700)' : 'var(--text-primary)',
                    background: selectedProgramme === p.id ? 'rgba(7,47,181,0.04)' : 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)',
                  }}>{p.name}</button>
                ))}
              </div>
            )}
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total Students', value: totalStudents, icon: Users, color: 'var(--text-primary)', onClick: () => setEligibilityFilter('all') },
          { label: 'Eligible (75%+)', value: eligibleCount, icon: CheckCircle2, color: '#059669', onClick: () => setEligibilityFilter('eligible') },
          { label: 'Below Threshold', value: belowCount, icon: XCircle, color: '#DC2626', onClick: () => setEligibilityFilter('ineligible') },
        ].map(card => {
          const isActive = (card.label === 'Total Students' && eligibilityFilter === 'all') ||
            (card.label === 'Eligible (75%+)' && eligibilityFilter === 'eligible') ||
            (card.label === 'Below Threshold' && eligibilityFilter === 'ineligible');
          return (
            <div key={card.label} onClick={card.onClick} style={{
              background: '#fff', borderRadius: 10, padding: '18px 22px', cursor: 'pointer',
              border: isActive ? `2px solid ${card.color === 'var(--text-primary)' ? 'var(--blue-700)' : card.color}` : '1px solid var(--border-subtle)',
              transition: 'border-color 0.12s, box-shadow 0.12s',
            }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.04)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                <card.icon size={15} style={{ color: card.color, opacity: 0.7 }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.03em', textTransform: 'uppercase' }}>{card.label}</span>
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'var(--font-display)', color: card.color, letterSpacing: '-0.03em' }}>{card.value}</div>
            </div>
          );
        })}
      </div>

      {/* UGC note */}
      <div style={{ background: 'rgba(7,47,181,0.03)', borderRadius: 8, border: '1px solid rgba(7,47,181,0.08)', padding: '12px 16px', marginBottom: 20, fontSize: 12, color: 'var(--text-secondary)', display: 'flex', gap: 10, alignItems: 'center', lineHeight: 1.5 }}>
        <AlertTriangle size={14} style={{ color: 'var(--blue-700)', opacity: 0.6, flexShrink: 0 }} />
        <span><b>UGC Requirement:</b> Students must maintain 75% engagement across all 4 quadrants. Students below threshold are ineligible for End Semester exams.</span>
      </div>

      {/* Sort */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)' }}>Sort by</span>
          {([['engagement', 'Engagement'] as const, ['attendance', 'Attendance'] as const]).map(([key, label]) => (
            <button key={key} onClick={() => setEngagementSort(key)} style={{
              padding: '5px 12px', fontSize: 12, fontWeight: engagementSort === key ? 700 : 500,
              color: engagementSort === key ? 'var(--blue-700)' : 'var(--text-tertiary)',
              background: engagementSort === key ? 'rgba(7,47,181,0.06)' : 'transparent',
              border: engagementSort === key ? '1px solid rgba(7,47,181,0.15)' : '1px solid transparent',
              borderRadius: 6, cursor: 'pointer', fontFamily: 'var(--font-sans)',
            }}>{label}</button>
          ))}
        </div>
        <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{sortedEngagement.length} students</span>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid rgba(15,15,15,0.08)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-section)' }}>
                <th style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase', padding: '11px 16px', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)', width: 36 }}>#</th>
                <th style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase', padding: '11px 16px', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)', minWidth: 180 }}>Student</th>
                <th style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase', padding: '11px 16px', textAlign: 'center', borderBottom: '1px solid var(--border-subtle)' }}>Engagement</th>
                <th style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase', padding: '11px 16px', textAlign: 'center', borderBottom: '1px solid var(--border-subtle)' }}>Attendance</th>
                <th style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase', padding: '11px 16px', textAlign: 'center', borderBottom: '1px solid var(--border-subtle)' }}>Live</th>
                <th style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase', padding: '11px 16px', textAlign: 'center', borderBottom: '1px solid var(--border-subtle)' }}>Tutorial</th>
                <th style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase', padding: '11px 16px', textAlign: 'center', borderBottom: '1px solid var(--border-subtle)' }}>Content</th>
                <th style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase', padding: '11px 16px', textAlign: 'center', borderBottom: '1px solid var(--border-subtle)' }}>Forum</th>
                <th style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase', padding: '11px 16px', textAlign: 'center', borderBottom: '1px solid var(--border-subtle)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedEngagement.map((student, idx) => {
                const engColor = student.engagement >= 75 ? '#059669' : student.engagement >= 50 ? '#D97706' : '#DC2626';
                const attColor = student.attendance >= 75 ? '#059669' : student.attendance >= 50 ? '#D97706' : '#DC2626';
                const td: React.CSSProperties = { fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', padding: '12px 16px', borderBottom: '1px solid rgba(0,0,0,0.03)' };
                return (
                  <tr key={student.id} style={{
                    background: !student.eligible ? (student.engagement < 50 ? 'rgba(220,38,38,0.02)' : 'rgba(217,119,6,0.015)') : 'transparent',
                    transition: 'background 0.1s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.01)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = !student.eligible ? (student.engagement < 50 ? 'rgba(220,38,38,0.02)' : 'rgba(217,119,6,0.015)') : 'transparent'; }}
                  >
                    <td style={{ ...td, textAlign: 'center', fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{idx + 1}</td>
                    <td style={td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 30, height: 30, borderRadius: '50%',
                          background: student.eligible ? 'rgba(5,150,105,0.06)' : 'var(--bg-section)',
                          border: `1.5px solid ${student.eligible ? 'rgba(5,150,105,0.15)' : 'var(--border-subtle)'}`,
                          display: 'grid', placeItems: 'center',
                          fontSize: 10, fontWeight: 700, color: student.eligible ? '#059669' : 'var(--text-secondary)', flexShrink: 0,
                        }}>{student.initials}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{student.name}</div>
                          <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', marginTop: 1 }}>{student.rollNo}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ ...td, textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <div style={{ width: 48, height: 5, background: 'var(--bg-section)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${student.engagement}%`, height: '100%', background: engColor, borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)', color: engColor, minWidth: 36 }}>{student.engagement}%</span>
                      </div>
                    </td>
                    <td style={{ ...td, textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 13, color: attColor }}>{student.attendance}%</td>
                    {(['live', 'tutorial', 'content', 'forum'] as const).map(q => {
                      const val = student.quadrants[q];
                      const qColor = val >= 75 ? '#059669' : val >= 50 ? '#D97706' : '#DC2626';
                      return <td key={q} style={{ ...td, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: qColor }}>{val}%</td>;
                    })}
                    <td style={{ ...td, textAlign: 'center' }}>
                      {student.eligible ? (
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#059669', background: 'rgba(5,150,105,0.06)', padding: '4px 12px', borderRadius: 5 }}>Eligible</span>
                      ) : (
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#DC2626', background: 'rgba(220,38,38,0.06)', padding: '4px 12px', borderRadius: 5 }}>Ineligible</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
