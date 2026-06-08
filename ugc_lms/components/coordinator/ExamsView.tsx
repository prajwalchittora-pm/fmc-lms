'use client';
import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Plus, X, Calendar, Clock, Users, AlertTriangle, CheckCircle2, XCircle, Eye, EyeOff, ExternalLink, GraduationCap, FileText, ArrowUpRight, Ban, ShieldCheck } from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────

type ExamType = 'midsem' | 'endsem' | 'supplementary' | 'improvement';
type ExamStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
type EligibilityStatus = 'eligible' | 'exemption_requested' | 'medical_pending' | 'debarred' | 'overridden';

interface Exam {
  id: string; courseCode: string; courseName: string; type: ExamType;
  date: string; startTime: string; endTime: string; duration: string;
  mode: 'online' | 'in-person'; maxMarks: number; status: ExamStatus;
  eligible: number; appeared: number; venue: string;
}

interface EligibilityRow {
  id: string; name: string; rollNo: string; initials: string;
  attendance: number; status: EligibilityStatus; reason?: string;
}

interface ResultRow {
  id: string; name: string; rollNo: string; initials: string;
  marks: number; maxMarks: number; status: 'passed' | 'failed' | 'absent' | 'withheld';
}

// ─── Mock Data ──────────────────────────────────────────────────────────────

const PROGRAMMES = [
  { id: 'mba-26', name: 'MBA - Batch 2026', code: 'MBA-26', semesters: 4 },
  { id: 'bca-26', name: 'BCA - Batch 2026', code: 'BCA-26', semesters: 6 },
  { id: 'cse-26', name: 'B.Tech CSE - Batch 2026', code: 'CSE-26', semesters: 8 },
];

const MOCK_EXAMS: Exam[] = [
  // Mid Sem (March 2026) — all completed
  { id: 'e1', courseCode: 'MBA-101', courseName: 'Managerial Economics', type: 'midsem', date: '10 Mar 2026', startTime: '10:00 AM', endTime: '12:00 PM', duration: '2h', mode: 'online', maxMarks: 15, status: 'completed', eligible: 10, appeared: 9, venue: '' },
  { id: 'e2', courseCode: 'MBA-102', courseName: 'Managerial Communication', type: 'midsem', date: '11 Mar 2026', startTime: '10:00 AM', endTime: '12:00 PM', duration: '2h', mode: 'online', maxMarks: 15, status: 'completed', eligible: 10, appeared: 9, venue: '' },
  { id: 'e3', courseCode: 'MBA-103', courseName: 'Financial Accounting', type: 'midsem', date: '12 Mar 2026', startTime: '2:00 PM', endTime: '4:00 PM', duration: '2h', mode: 'online', maxMarks: 15, status: 'completed', eligible: 10, appeared: 10, venue: '' },
  { id: 'e4', courseCode: 'MBA-104', courseName: 'Organizational Behaviour', type: 'midsem', date: '13 Mar 2026', startTime: '10:00 AM', endTime: '12:00 PM', duration: '2h', mode: 'online', maxMarks: 15, status: 'completed', eligible: 10, appeared: 8, venue: '' },
  { id: 'e5', courseCode: 'MBA-105', courseName: 'Business Statistics', type: 'midsem', date: '14 Mar 2026', startTime: '2:00 PM', endTime: '4:00 PM', duration: '2h', mode: 'online', maxMarks: 15, status: 'completed', eligible: 10, appeared: 9, venue: '' },
  { id: 'e6', courseCode: 'MBA-106', courseName: 'Business Law & Ethics', type: 'midsem', date: '15 Mar 2026', startTime: '10:00 AM', endTime: '11:00 AM', duration: '1h', mode: 'online', maxMarks: 15, status: 'completed', eligible: 10, appeared: 10, venue: '' },
  // Mid Sem (May 2026) — all completed
  { id: 'e7', courseCode: 'MBA-101', courseName: 'Managerial Economics', type: 'midsem', date: '5 May 2026', startTime: '10:00 AM', endTime: '12:00 PM', duration: '2h', mode: 'online', maxMarks: 10, status: 'completed', eligible: 10, appeared: 9, venue: '' },
  { id: 'e8', courseCode: 'MBA-102', courseName: 'Managerial Communication', type: 'midsem', date: '6 May 2026', startTime: '10:00 AM', endTime: '12:00 PM', duration: '2h', mode: 'online', maxMarks: 10, status: 'completed', eligible: 10, appeared: 8, venue: '' },
  { id: 'e9', courseCode: 'MBA-103', courseName: 'Financial Accounting', type: 'midsem', date: '7 May 2026', startTime: '2:00 PM', endTime: '4:00 PM', duration: '2h', mode: 'online', maxMarks: 10, status: 'completed', eligible: 10, appeared: 10, venue: '' },
  { id: 'e10', courseCode: 'MBA-104', courseName: 'Organizational Behaviour', type: 'midsem', date: '8 May 2026', startTime: '10:00 AM', endTime: '12:00 PM', duration: '2h', mode: 'online', maxMarks: 10, status: 'completed', eligible: 10, appeared: 8, venue: '' },
  { id: 'e11', courseCode: 'MBA-105', courseName: 'Business Statistics', type: 'midsem', date: '9 May 2026', startTime: '2:00 PM', endTime: '4:00 PM', duration: '2h', mode: 'online', maxMarks: 10, status: 'completed', eligible: 10, appeared: 9, venue: '' },
  { id: 'e12', courseCode: 'MBA-106', courseName: 'Business Law & Ethics', type: 'midsem', date: '10 May 2026', startTime: '10:00 AM', endTime: '11:00 AM', duration: '1h', mode: 'online', maxMarks: 10, status: 'completed', eligible: 10, appeared: 10, venue: '' },
  // End Sem (June 2026) — upcoming / scheduled
  { id: 'e13', courseCode: 'MBA-101', courseName: 'Managerial Economics', type: 'endsem', date: '15 Jun 2026', startTime: '10:00 AM', endTime: '1:00 PM', duration: '3h', mode: 'in-person', maxMarks: 75, status: 'scheduled', eligible: 9, appeared: 0, venue: 'Hall A, Block 3' },
  { id: 'e14', courseCode: 'MBA-102', courseName: 'Managerial Communication', type: 'endsem', date: '17 Jun 2026', startTime: '10:00 AM', endTime: '1:00 PM', duration: '3h', mode: 'in-person', maxMarks: 75, status: 'scheduled', eligible: 9, appeared: 0, venue: 'Hall A, Block 3' },
  { id: 'e15', courseCode: 'MBA-103', courseName: 'Financial Accounting', type: 'endsem', date: '19 Jun 2026', startTime: '10:00 AM', endTime: '1:00 PM', duration: '3h', mode: 'in-person', maxMarks: 75, status: 'scheduled', eligible: 9, appeared: 0, venue: 'Hall B, Block 3' },
  { id: 'e16', courseCode: 'MBA-104', courseName: 'Organizational Behaviour', type: 'endsem', date: '21 Jun 2026', startTime: '10:00 AM', endTime: '1:00 PM', duration: '3h', mode: 'in-person', maxMarks: 75, status: 'scheduled', eligible: 9, appeared: 0, venue: 'Hall A, Block 3' },
  { id: 'e17', courseCode: 'MBA-105', courseName: 'Business Statistics', type: 'endsem', date: '23 Jun 2026', startTime: '10:00 AM', endTime: '1:00 PM', duration: '3h', mode: 'in-person', maxMarks: 75, status: 'scheduled', eligible: 9, appeared: 0, venue: 'Hall B, Block 3' },
  { id: 'e18', courseCode: 'MBA-106', courseName: 'Business Law & Ethics', type: 'endsem', date: '25 Jun 2026', startTime: '10:00 AM', endTime: '12:00 PM', duration: '2h', mode: 'in-person', maxMarks: 75, status: 'scheduled', eligible: 9, appeared: 0, venue: 'Hall A, Block 3' },
];

const MOCK_ELIGIBILITY: EligibilityRow[] = [
  { id: 's8', name: 'Sneha Reddy', rollNo: 'MBA-2026-008', initials: 'SR', attendance: 98, status: 'eligible' },
  { id: 's2', name: 'Priya Sharma', rollNo: 'MBA-2026-002', initials: 'PS', attendance: 96, status: 'eligible' },
  { id: 's13', name: 'Kavya Menon', rollNo: 'MBA-2026-013', initials: 'KM', attendance: 91, status: 'eligible' },
  { id: 's15', name: 'Aisha Khan', rollNo: 'MBA-2026-015', initials: 'AK', attendance: 90, status: 'eligible' },
  { id: 's1', name: 'Arjun Mehta', rollNo: 'MBA-2026-001', initials: 'AM', attendance: 88, status: 'eligible' },
  { id: 's11', name: 'Rohan Gupta', rollNo: 'MBA-2026-011', initials: 'RG', attendance: 82, status: 'eligible' },
  { id: 's14', name: 'Siddharth Rao', rollNo: 'MBA-2026-014', initials: 'SR2', attendance: 73, status: 'exemption_requested', reason: 'Family emergency — 2 weeks absence in April' },
  { id: 's16', name: 'Dev Malhotra', rollNo: 'MBA-2026-016', initials: 'DM', attendance: 68, status: 'exemption_requested', reason: 'Sports meet participation — university team' },
  { id: 's3', name: 'Rahul Verma', rollNo: 'MBA-2026-003', initials: 'RV', attendance: 52, status: 'medical_pending', reason: 'Medical certificate submitted — dengue, 3 weeks' },
  { id: 's6', name: 'Neha Patel', rollNo: 'MBA-2026-006', initials: 'NP', attendance: 40, status: 'debarred' },
];

const MOCK_RESULTS: Record<string, ResultRow[]> = {
  'e1': [
    { id: 's8', name: 'Sneha Reddy', rollNo: 'MBA-2026-008', initials: 'SR', marks: 14, maxMarks: 15, status: 'passed' },
    { id: 's2', name: 'Priya Sharma', rollNo: 'MBA-2026-002', initials: 'PS', marks: 13, maxMarks: 15, status: 'passed' },
    { id: 's13', name: 'Kavya Menon', rollNo: 'MBA-2026-013', initials: 'KM', marks: 13, maxMarks: 15, status: 'passed' },
    { id: 's15', name: 'Aisha Khan', rollNo: 'MBA-2026-015', initials: 'AK', marks: 12, maxMarks: 15, status: 'passed' },
    { id: 's1', name: 'Arjun Mehta', rollNo: 'MBA-2026-001', initials: 'AM', marks: 11, maxMarks: 15, status: 'passed' },
    { id: 's11', name: 'Rohan Gupta', rollNo: 'MBA-2026-011', initials: 'RG', marks: 10, maxMarks: 15, status: 'passed' },
    { id: 's14', name: 'Siddharth Rao', rollNo: 'MBA-2026-014', initials: 'SR2', marks: 8, maxMarks: 15, status: 'passed' },
    { id: 's16', name: 'Dev Malhotra', rollNo: 'MBA-2026-016', initials: 'DM', marks: 7, maxMarks: 15, status: 'passed' },
    { id: 's3', name: 'Rahul Verma', rollNo: 'MBA-2026-003', initials: 'RV', marks: 5, maxMarks: 15, status: 'failed' },
    { id: 's6', name: 'Neha Patel', rollNo: 'MBA-2026-006', initials: 'NP', marks: 0, maxMarks: 15, status: 'absent' },
  ],
};

// Supplementary tracker
const SUPPLEMENTARY_STUDENTS = [
  { id: 's3', name: 'Rahul Verma', rollNo: 'MBA-2026-003', initials: 'RV', arrears: ['MBA-102', 'MBA-104'], attempts: 1, deadline: 'Jun 2031' },
  { id: 's6', name: 'Neha Patel', rollNo: 'MBA-2026-006', initials: 'NP', arrears: ['MBA-101', 'MBA-102', 'MBA-103', 'MBA-104', 'MBA-105', 'MBA-106'], attempts: 0, deadline: 'Jun 2031' },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

const EXAM_TYPE_LABELS: Record<ExamType, { label: string; color: string; bg: string }> = {
  midsem: { label: 'Mid Sem', color: '#072FB5', bg: 'rgba(7,47,181,0.06)' },
  endsem: { label: 'End Sem', color: '#1a1a1a', bg: 'rgba(0,0,0,0.05)' },
  supplementary: { label: 'Supplementary', color: '#D97706', bg: 'rgba(217,119,6,0.06)' },
  improvement: { label: 'Improvement', color: '#EA580C', bg: 'rgba(234,88,12,0.06)' },
};

const STATUS_LABELS: Record<ExamStatus, { label: string; color: string; bg: string }> = {
  scheduled: { label: 'Scheduled', color: '#072FB5', bg: 'rgba(7,47,181,0.06)' },
  in_progress: { label: 'In Progress', color: '#059669', bg: 'rgba(5,150,105,0.06)' },
  completed: { label: 'Completed', color: '#059669', bg: 'rgba(5,150,105,0.06)' },
  cancelled: { label: 'Cancelled', color: '#747474', bg: 'rgba(0,0,0,0.04)' },
};

const ELIGIBILITY_LABELS: Record<EligibilityStatus, { label: string; color: string; bg: string }> = {
  eligible: { label: 'Eligible', color: '#059669', bg: 'rgba(5,150,105,0.06)' },
  exemption_requested: { label: 'Exemption Requested', color: '#D97706', bg: 'rgba(217,119,6,0.06)' },
  medical_pending: { label: 'Medical Pending', color: '#D97706', bg: 'rgba(217,119,6,0.06)' },
  debarred: { label: 'Debarred', color: '#DC2626', bg: 'rgba(220,38,38,0.06)' },
  overridden: { label: 'Override Granted', color: '#059669', bg: 'rgba(5,150,105,0.06)' },
};

// ─── Component ──────────────────────────────────────────────────────────────

type Tab = 'schedule' | 'eligibility' | 'results';

export default function ExamsView() {
  const [selectedProgramme, setSelectedProgramme] = useState('mba-26');
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [tab, setTab] = useState<Tab>('schedule');
  const [typeFilter, setTypeFilter] = useState<ExamType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ExamStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [showProgrammeDD, setShowProgrammeDD] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<string>('e13'); // default to first End Sem for eligibility
  const [selectedResultExam, setSelectedResultExam] = useState<string>('e1');
  const [eligibility, setEligibility] = useState<EligibilityRow[]>(MOCK_ELIGIBILITY);
  const [resultPublished, setResultPublished] = useState(false);
  const programmeRef = useRef<HTMLDivElement>(null);

  // Create exam form state
  const [newExam, setNewExam] = useState({ courseCode: 'MBA-101', type: 'endsem' as ExamType, date: '', startTime: '10:00', endTime: '13:00', mode: 'in-person' as 'online' | 'in-person', maxMarks: 75, venue: '' });

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (programmeRef.current && !programmeRef.current.contains(e.target as Node)) setShowProgrammeDD(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const programme = PROGRAMMES.find(p => p.id === selectedProgramme) || PROGRAMMES[0];

  const filteredExams = MOCK_EXAMS.filter(e => {
    if (typeFilter !== 'all' && e.type !== typeFilter) return false;
    if (statusFilter !== 'all' && e.status !== statusFilter) return false;
    if (search && !e.courseName.toLowerCase().includes(search.toLowerCase()) && !e.courseCode.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const completedExams = MOCK_EXAMS.filter(e => e.status === 'completed');
  const selectedExam = MOCK_EXAMS.find(e => e.id === selectedExamId);
  const selectedResultExamObj = MOCK_EXAMS.find(e => e.id === selectedResultExam);
  const results = MOCK_RESULTS[selectedResultExam] || [];

  const eligibleCount = eligibility.filter(e => e.status === 'eligible' || e.status === 'overridden').length;
  const exemptionCount = eligibility.filter(e => e.status === 'exemption_requested').length;
  const medicalCount = eligibility.filter(e => e.status === 'medical_pending').length;
  const debarredCount = eligibility.filter(e => e.status === 'debarred').length;

  const thStyle: React.CSSProperties = { fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'var(--font-sans)', padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)', whiteSpace: 'nowrap' };
  const tdStyle: React.CSSProperties = { fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', padding: '10px 14px', borderBottom: '1px solid rgba(0,0,0,0.03)' };

  const handleOverride = (studentId: string) => {
    setEligibility(prev => prev.map(e => e.id === studentId ? { ...e, status: 'overridden' as EligibilityStatus, reason: (e.reason || '') + ' — Override granted by coordinator' } : e));
  };

  const TABS: { key: Tab; label: string; count?: number }[] = [
    { key: 'schedule', label: 'Schedule', count: MOCK_EXAMS.length },
    { key: 'eligibility', label: 'Eligibility' },
    { key: 'results', label: 'Results' },
  ];

  return (
    <div style={{ padding: '28px 40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', margin: 0 }}>Exams</h1>
          <p style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500, marginTop: 4 }}>Schedule, manage eligibility &amp; publish results</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Proctoring Portal Link */}
          <button onClick={() => window.open('#proctoring-portal', '_blank')} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', fontSize: 12, fontWeight: 600,
            color: 'var(--text-secondary)', background: '#fff', border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)',
          }}>
            <ShieldCheck size={14} strokeWidth={1.5} style={{ color: 'var(--text-tertiary)' }} />
            Proctoring Portal
            <ArrowUpRight size={12} style={{ color: 'var(--text-tertiary)' }} />
          </button>
          {/* Programme Selector */}
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
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1.5px solid var(--border-subtle)', marginBottom: 24 }}>
        {TABS.map(t => {
          const isActive = tab === t.key;
          return (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: '10px 20px', fontSize: 13, fontWeight: isActive ? 700 : 500,
              color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
              background: 'transparent', border: 'none',
              borderBottom: isActive ? '2px solid var(--text-primary)' : '2px solid transparent',
              marginBottom: '-1.5px', cursor: 'pointer', fontFamily: 'var(--font-sans)',
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              {t.label}
              {t.count !== undefined && <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', background: 'var(--bg-section)', padding: '1px 6px', borderRadius: 'var(--radius-pill)' }}>{t.count}</span>}
            </button>
          );
        })}
      </div>

      {/* ═══ SCHEDULE TAB ═══ */}
      {tab === 'schedule' && (
        <div>
          {/* Filters */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Type filter pills */}
              {([['all', 'All'] as const, ['midsem', 'Mid Sem'] as const, ['endsem', 'End Sem'] as const, ['supplementary', 'Supp.'] as const]).map(([key, label]) => (
                <button key={key} onClick={() => setTypeFilter(key)} style={{
                  padding: '5px 12px', fontSize: 11.5, fontWeight: typeFilter === key ? 700 : 500,
                  color: typeFilter === key ? '#fff' : 'var(--text-secondary)',
                  background: typeFilter === key ? 'var(--blue-700)' : '#fff',
                  border: typeFilter === key ? '1px solid var(--blue-700)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)',
                }}>{label}</button>
              ))}
              <span style={{ width: 1, height: 20, background: 'var(--border-subtle)', margin: '0 4px' }} />
              {/* Status filter */}
              {([['all', 'All Status'] as const, ['scheduled', 'Scheduled'] as const, ['completed', 'Completed'] as const]).map(([key, label]) => (
                <button key={key} onClick={() => setStatusFilter(key)} style={{
                  padding: '5px 12px', fontSize: 11.5, fontWeight: statusFilter === key ? 600 : 500,
                  color: statusFilter === key ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  background: statusFilter === key ? 'var(--bg-section)' : 'transparent',
                  border: '1px solid transparent', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)',
                }}>{label}</button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ position: 'relative' }}>
                <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search exams..." style={{
                  width: 170, padding: '6px 10px 6px 30px', fontSize: 12, fontWeight: 500,
                  border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)',
                  background: '#fff', fontFamily: 'var(--font-sans)', outline: 'none', color: 'var(--text-primary)',
                }} />
              </div>
              <button onClick={() => setShowCreateModal(true)} style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px', fontSize: 12, fontWeight: 600,
                color: '#fff', background: 'var(--blue-700)', border: '1px solid var(--blue-700)',
                borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)',
              }}>
                <Plus size={14} /> Create Exam
              </button>
            </div>
          </div>

          {/* Exam Table */}
          <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={thStyle}>Date</th>
                  <th style={{ ...thStyle, minWidth: 200 }}>Course</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Type</th>
                  <th style={thStyle}>Time</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Mode</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Max Marks</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Status</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Appeared</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExams.map(exam => {
                  const typeInfo = EXAM_TYPE_LABELS[exam.type];
                  const statusInfo = STATUS_LABELS[exam.status];
                  return (
                    <tr key={exam.id}>
                      <td style={tdStyle}>
                        <div style={{ fontSize: 12, fontWeight: 600 }}>{exam.date}</div>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ fontSize: 12.5, fontWeight: 600 }}>{exam.courseName}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', marginTop: 1 }}>{exam.courseCode}</div>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <span style={{ fontSize: 10.5, fontWeight: 700, color: typeInfo.color, background: typeInfo.bg, padding: '2px 8px', borderRadius: 'var(--radius-xs)' }}>{typeInfo.label}</span>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ fontSize: 11.5, fontWeight: 500 }}>{exam.startTime} – {exam.endTime}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 1 }}>{exam.duration}{exam.venue ? ` · ${exam.venue}` : ''}</div>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <span style={{ fontSize: 10.5, fontWeight: 600, color: exam.mode === 'online' ? '#072FB5' : 'var(--text-secondary)' }}>{exam.mode === 'online' ? 'Online' : 'In-person'}</span>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{exam.maxMarks}</td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <span style={{ fontSize: 10.5, fontWeight: 700, color: statusInfo.color, background: statusInfo.bg, padding: '2px 8px', borderRadius: 'var(--radius-xs)' }}>{statusInfo.label}</span>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        {exam.status === 'completed' ? `${exam.appeared}/${exam.eligible}` : `${exam.eligible}`}
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                          <button onClick={() => { setSelectedExamId(exam.id); setTab('eligibility'); }} style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--blue-700)', background: 'none', border: 'none', cursor: 'pointer', padding: '3px 6px', fontFamily: 'var(--font-sans)' }}>Eligibility</button>
                          {exam.status === 'completed' && (
                            <button onClick={() => { setSelectedResultExam(exam.id); setTab('results'); }} style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--blue-700)', background: 'none', border: 'none', cursor: 'pointer', padding: '3px 6px', fontFamily: 'var(--font-sans)' }}>Results</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border-subtle)', fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>
              {filteredExams.length} exams &middot; {filteredExams.filter(e => e.status === 'completed').length} completed &middot; {filteredExams.filter(e => e.status === 'scheduled').length} upcoming
            </div>
          </div>
        </div>
      )}

      {/* ═══ ELIGIBILITY TAB ═══ */}
      {tab === 'eligibility' && (
        <div>
          {/* Exam selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>Select Exam</div>
              <select value={selectedExamId} onChange={e => setSelectedExamId(e.target.value)} style={{
                padding: '7px 28px 7px 12px', fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)',
                background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-sans)', outline: 'none', minWidth: 320, cursor: 'pointer',
                appearance: 'none', WebkitAppearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
              }}>
                {MOCK_EXAMS.map(e => (
                  <option key={e.id} value={e.id}>{e.courseCode}: {e.courseName} — {EXAM_TYPE_LABELS[e.type].label} ({e.date})</option>
                ))}
              </select>
            </div>
            {selectedExam && (
              <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: EXAM_TYPE_LABELS[selectedExam.type].color, background: EXAM_TYPE_LABELS[selectedExam.type].bg, padding: '4px 10px', borderRadius: 'var(--radius-xs)' }}>{EXAM_TYPE_LABELS[selectedExam.type].label}</span>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: STATUS_LABELS[selectedExam.status].color, background: STATUS_LABELS[selectedExam.status].bg, padding: '4px 10px', borderRadius: 'var(--radius-xs)' }}>{STATUS_LABELS[selectedExam.status].label}</span>
              </div>
            )}
          </div>

          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
            {[
              { label: 'Eligible', count: eligibleCount, color: '#059669', bg: 'rgba(5,150,105,0.04)' },
              { label: 'Exemption Requested', count: exemptionCount, color: '#D97706', bg: 'rgba(217,119,6,0.04)' },
              { label: 'Medical Pending', count: medicalCount, color: '#D97706', bg: 'rgba(217,119,6,0.04)' },
              { label: 'Debarred', count: debarredCount, color: '#DC2626', bg: 'rgba(220,38,38,0.04)' },
            ].map(card => (
              <div key={card.label} style={{ background: card.bg, borderRadius: 'var(--radius-sm)', border: `1px solid ${card.color}15`, padding: '14px 16px' }}>
                <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-mono)', color: card.color, letterSpacing: '-0.02em' }}>{card.count}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: card.color, marginTop: 2 }}>{card.label}</div>
              </div>
            ))}
          </div>

          {/* UGC rules info */}
          <div style={{ background: 'rgba(7,47,181,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(7,47,181,0.08)', padding: '12px 16px', marginBottom: 16, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <AlertTriangle size={14} style={{ color: 'var(--blue-700)', flexShrink: 0, marginTop: 1, opacity: 0.6 }} />
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <b>UGC Attendance Rules:</b> 75%+ = Eligible &middot; 65-74% = Exemption with documented reason &middot; 50-64% = Medical certificate from govt. hospital required &middot; Below 50% = Debarred, must repeat semester
            </div>
          </div>

          {/* Eligibility table */}
          <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, width: 36, textAlign: 'center' }}>#</th>
                  <th style={{ ...thStyle, minWidth: 160 }}>Student</th>
                  <th style={thStyle}>Roll No</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Attendance</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Status</th>
                  <th style={thStyle}>Reason / Notes</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {eligibility.map((student, idx) => {
                  const statusInfo = ELIGIBILITY_LABELS[student.status];
                  const attendanceColor = student.attendance >= 75 ? '#059669' : student.attendance >= 65 ? '#D97706' : student.attendance >= 50 ? '#EA580C' : '#DC2626';
                  return (
                    <tr key={student.id} style={{ background: student.status === 'debarred' ? 'rgba(220,38,38,0.02)' : 'transparent' }}>
                      <td style={{ ...tdStyle, textAlign: 'center', fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{idx + 1}</td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--bg-section)', border: '1px solid var(--border-subtle)', display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 700, color: 'var(--text-secondary)', flexShrink: 0 }}>{student.initials}</div>
                          <span style={{ fontSize: 12.5, fontWeight: 600 }}>{student.name}</span>
                        </div>
                      </td>
                      <td style={{ ...tdStyle, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{student.rollNo}</td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)', color: attendanceColor }}>{student.attendance}%</span>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <span style={{ fontSize: 10.5, fontWeight: 700, color: statusInfo.color, background: statusInfo.bg, padding: '3px 10px', borderRadius: 'var(--radius-xs)', whiteSpace: 'nowrap' }}>{statusInfo.label}</span>
                      </td>
                      <td style={{ ...tdStyle, fontSize: 11, color: 'var(--text-tertiary)', maxWidth: 200 }}>{student.reason || '—'}</td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        {(student.status === 'exemption_requested' || student.status === 'medical_pending') && (
                          <button onClick={() => handleOverride(student.id)} style={{
                            fontSize: 10.5, fontWeight: 600, color: '#059669', background: 'rgba(5,150,105,0.06)',
                            border: '1px solid rgba(5,150,105,0.2)', borderRadius: 'var(--radius-xs)',
                            padding: '3px 10px', cursor: 'pointer', fontFamily: 'var(--font-sans)',
                          }}>Grant</button>
                        )}
                        {student.status === 'debarred' && (
                          <span style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 500 }}>Cannot override</span>
                        )}
                        {(student.status === 'eligible' || student.status === 'overridden') && (
                          <CheckCircle2 size={14} style={{ color: '#059669' }} />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══ RESULTS TAB ═══ */}
      {tab === 'results' && (
        <div>
          {/* Exam selector + publish toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>Select Completed Exam</div>
              <select value={selectedResultExam} onChange={e => setSelectedResultExam(e.target.value)} style={{
                padding: '7px 28px 7px 12px', fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)',
                background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-sans)', outline: 'none', minWidth: 360, cursor: 'pointer',
                appearance: 'none', WebkitAppearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
              }}>
                {completedExams.map(e => (
                  <option key={e.id} value={e.id}>{e.courseCode}: {e.courseName} — {EXAM_TYPE_LABELS[e.type].label} ({e.date})</option>
                ))}
              </select>
            </div>
            <button onClick={() => setResultPublished(!resultPublished)} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', fontSize: 12, fontWeight: 600,
              color: resultPublished ? '#059669' : 'var(--text-tertiary)',
              background: resultPublished ? 'rgba(5,150,105,0.06)' : '#fff',
              border: resultPublished ? '1px solid rgba(5,150,105,0.2)' : '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)',
            }}>
              {resultPublished ? <Eye size={14} /> : <EyeOff size={14} />}
              {resultPublished ? 'Published to Students' : 'Not Published'}
            </button>
          </div>

          {/* Results Table */}
          {results.length > 0 ? (
            <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflow: 'hidden', marginBottom: 24 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ ...thStyle, width: 36, textAlign: 'center' }}>#</th>
                    <th style={{ ...thStyle, minWidth: 160 }}>Student</th>
                    <th style={thStyle}>Roll No</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Marks</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Percentage</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, idx) => {
                    const pct = r.maxMarks > 0 ? Math.round((r.marks / r.maxMarks) * 100) : 0;
                    const statusColor = r.status === 'passed' ? '#059669' : r.status === 'failed' ? '#DC2626' : r.status === 'absent' ? '#747474' : '#D97706';
                    const statusLabel = r.status === 'passed' ? 'Passed' : r.status === 'failed' ? 'Failed' : r.status === 'absent' ? 'Absent' : 'Withheld';
                    return (
                      <tr key={r.id} style={{ background: r.status === 'failed' ? 'rgba(220,38,38,0.02)' : r.status === 'absent' ? 'rgba(0,0,0,0.01)' : 'transparent' }}>
                        <td style={{ ...tdStyle, textAlign: 'center', fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{idx + 1}</td>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--bg-section)', border: '1px solid var(--border-subtle)', display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 700, color: 'var(--text-secondary)', flexShrink: 0 }}>{r.initials}</div>
                            <span style={{ fontSize: 12.5, fontWeight: 600 }}>{r.name}</span>
                          </div>
                        </td>
                        <td style={{ ...tdStyle, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{r.rollNo}</td>
                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                          <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{r.marks}</span>
                          <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>/{r.maxMarks}</span>
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 12, color: pct >= 85 ? '#059669' : pct >= 65 ? 'var(--text-primary)' : pct >= 40 ? '#D97706' : '#DC2626' }}>
                          {r.status !== 'absent' ? `${pct}%` : '—'}
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                          <span style={{ fontSize: 10.5, fontWeight: 700, color: statusColor, background: `${statusColor}10`, padding: '3px 10px', borderRadius: 'var(--radius-xs)' }}>{statusLabel}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>
                  {results.filter(r => r.status === 'passed').length} passed &middot; {results.filter(r => r.status === 'failed').length} failed &middot; {results.filter(r => r.status === 'absent').length} absent
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>
                  Avg: {results.filter(r => r.status !== 'absent').length > 0 ? Math.round(results.filter(r => r.status !== 'absent').reduce((s, r) => s + r.marks, 0) / results.filter(r => r.status !== 'absent').length) : 0}/{selectedResultExamObj?.maxMarks || 0}
                </span>
              </div>
            </div>
          ) : (
            <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', padding: '48px', textAlign: 'center' }}>
              <FileText size={32} style={{ color: 'var(--text-tertiary)', opacity: 0.3, marginBottom: 12 }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>No results available</div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Results for this exam haven&apos;t been uploaded yet</div>
            </div>
          )}

          {/* Supplementary Tracker */}
          <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>Supplementary &amp; Improvement Tracker</div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500, marginTop: 2 }}>Students with arrears from internal assessments &middot; UGC allows 5-year clearance window</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#D97706', background: 'rgba(217,119,6,0.06)', padding: '4px 12px', borderRadius: 'var(--radius-xs)' }}>
                {SUPPLEMENTARY_STUDENTS.length} students with arrears
              </span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, minWidth: 160 }}>Student</th>
                  <th style={thStyle}>Roll No</th>
                  <th style={thStyle}>Arrear Courses</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Attempts</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Clearance Deadline</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {SUPPLEMENTARY_STUDENTS.map(student => (
                  <tr key={student.id}>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--bg-section)', border: '1px solid var(--border-subtle)', display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 700, color: 'var(--text-secondary)', flexShrink: 0 }}>{student.initials}</div>
                        <span style={{ fontSize: 12.5, fontWeight: 600 }}>{student.name}</span>
                      </div>
                    </td>
                    <td style={{ ...tdStyle, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{student.rollNo}</td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {student.arrears.map(code => (
                          <span key={code} style={{ fontSize: 10, fontWeight: 600, color: '#DC2626', background: 'rgba(220,38,38,0.06)', padding: '2px 7px', borderRadius: 'var(--radius-xs)', fontFamily: 'var(--font-mono)' }}>{code}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{student.attempts}</td>
                    <td style={{ ...tdStyle, textAlign: 'center', fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)' }}>{student.deadline}</td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <button style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--blue-700)', background: 'rgba(7,47,181,0.04)', border: '1px solid rgba(7,47,181,0.12)', borderRadius: 'var(--radius-xs)', padding: '3px 10px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Schedule Re-exam</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══ CREATE EXAM MODAL ═══ */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }} onClick={() => setShowCreateModal(false)}>
          <div style={{ background: '#fff', borderRadius: 16, width: 480, maxHeight: '80vh', overflow: 'auto', boxShadow: '0 25px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.06)' }} onClick={e => e.stopPropagation()}>
            {/* Modal header — dark gradient */}
            <div style={{ background: 'linear-gradient(135deg, #030B22 0%, #06102E 50%, #213594 100%)', borderRadius: '16px 16px 0 0', padding: '24px 24px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.1)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    <Calendar size={20} style={{ color: '#fff' }} />
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>Create Exam</div>
                </div>
                <button onClick={() => setShowCreateModal(false)} style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center' }}><X size={16} style={{ color: '#fff' }} /></button>
              </div>
              {/* Hero input — Course selector in header */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Course</label>
                <select value={newExam.courseCode} onChange={e => setNewExam({ ...newExam, courseCode: e.target.value })} style={{ width: '100%', padding: '10px 32px 10px 14px', fontSize: 14, fontWeight: 600, border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: 10, fontFamily: 'var(--font-sans)', outline: 'none', background: 'rgba(255,255,255,0.08)', color: '#fff', appearance: 'none', WebkitAppearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='rgba(255,255,255,0.5)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}>
                  <option value="MBA-101" style={{ color: '#1a1a1a' }}>MBA-101: Managerial Economics</option>
                  <option value="MBA-102" style={{ color: '#1a1a1a' }}>MBA-102: Managerial Communication</option>
                  <option value="MBA-103" style={{ color: '#1a1a1a' }}>MBA-103: Financial Accounting</option>
                  <option value="MBA-104" style={{ color: '#1a1a1a' }}>MBA-104: Organizational Behaviour</option>
                  <option value="MBA-105" style={{ color: '#1a1a1a' }}>MBA-105: Business Statistics</option>
                  <option value="MBA-106" style={{ color: '#1a1a1a' }}>MBA-106: Business Law & Ethics</option>
                </select>
              </div>
            </div>

            {/* Modal body */}
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Type */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Exam Type</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {(['midsem', 'endsem', 'supplementary', 'improvement'] as ExamType[]).map(type => (
                    <button key={type} onClick={() => setNewExam({ ...newExam, type, maxMarks: type === 'endsem' || type === 'supplementary' || type === 'improvement' ? 75 : 25 })} style={{
                      padding: '6px 12px', fontSize: 11, fontWeight: newExam.type === type ? 700 : 500,
                      color: newExam.type === type ? '#fff' : 'var(--text-secondary)',
                      background: newExam.type === type ? '#072FB5' : 'var(--bg-section)',
                      border: newExam.type === type ? '1.5px solid #072FB5' : '1.5px solid transparent',
                      borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font-sans)',
                    }}>{EXAM_TYPE_LABELS[type].label}</button>
                  ))}
                </div>
              </div>

              {/* Date + Time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Date</label>
                  <input type="date" value={newExam.date} onChange={e => setNewExam({ ...newExam, date: e.target.value })} onFocus={e => { e.currentTarget.style.borderColor = '#072FB5'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(7,47,181,0.12)'; e.currentTarget.style.background = '#fff'; }} onBlur={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'var(--bg-section)'; }} style={{ width: '100%', padding: '8px 10px', fontSize: 12, border: '1.5px solid transparent', borderRadius: 8, fontFamily: 'var(--font-sans)', outline: 'none', background: 'var(--bg-section)', transition: 'border-color 0.15s, box-shadow 0.15s, background 0.15s' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Start Time</label>
                  <input type="time" value={newExam.startTime} onChange={e => setNewExam({ ...newExam, startTime: e.target.value })} onFocus={e => { e.currentTarget.style.borderColor = '#072FB5'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(7,47,181,0.12)'; e.currentTarget.style.background = '#fff'; }} onBlur={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'var(--bg-section)'; }} style={{ width: '100%', padding: '8px 10px', fontSize: 12, border: '1.5px solid transparent', borderRadius: 8, fontFamily: 'var(--font-sans)', outline: 'none', background: 'var(--bg-section)', transition: 'border-color 0.15s, box-shadow 0.15s, background 0.15s' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>End Time</label>
                  <input type="time" value={newExam.endTime} onChange={e => setNewExam({ ...newExam, endTime: e.target.value })} onFocus={e => { e.currentTarget.style.borderColor = '#072FB5'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(7,47,181,0.12)'; e.currentTarget.style.background = '#fff'; }} onBlur={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'var(--bg-section)'; }} style={{ width: '100%', padding: '8px 10px', fontSize: 12, border: '1.5px solid transparent', borderRadius: 8, fontFamily: 'var(--font-sans)', outline: 'none', background: 'var(--bg-section)', transition: 'border-color 0.15s, box-shadow 0.15s, background 0.15s' }} />
                </div>
              </div>

              {/* Mode + Max Marks */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Mode</label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {(['online', 'in-person'] as const).map(mode => (
                      <button key={mode} onClick={() => setNewExam({ ...newExam, mode })} style={{
                        flex: 1, padding: '7px', fontSize: 12, fontWeight: newExam.mode === mode ? 600 : 500,
                        color: newExam.mode === mode ? '#072FB5' : 'var(--text-secondary)',
                        background: newExam.mode === mode ? 'rgba(7,47,181,0.04)' : 'var(--bg-section)',
                        border: newExam.mode === mode ? '1.5px solid rgba(7,47,181,0.2)' : '1.5px solid transparent',
                        borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font-sans)',
                      }}>{mode === 'online' ? 'Online' : 'In-person'}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Max Marks</label>
                  <input type="number" value={newExam.maxMarks} onChange={e => setNewExam({ ...newExam, maxMarks: +e.target.value })} onFocus={e => { e.currentTarget.style.borderColor = '#072FB5'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(7,47,181,0.12)'; e.currentTarget.style.background = '#fff'; }} onBlur={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'var(--bg-section)'; }} style={{ width: '100%', padding: '8px 12px', fontSize: 13, fontFamily: 'var(--font-mono)', border: '1.5px solid transparent', borderRadius: 8, outline: 'none', background: 'var(--bg-section)', transition: 'border-color 0.15s, box-shadow 0.15s, background 0.15s' }} />
                </div>
              </div>

              {/* Venue (conditional) */}
              {newExam.mode === 'in-person' && (
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Venue</label>
                  <input type="text" value={newExam.venue} onChange={e => setNewExam({ ...newExam, venue: e.target.value })} placeholder="e.g., Hall A, Block 3" onFocus={e => { e.currentTarget.style.borderColor = '#072FB5'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(7,47,181,0.12)'; e.currentTarget.style.background = '#fff'; }} onBlur={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'var(--bg-section)'; }} style={{ width: '100%', padding: '8px 12px', fontSize: 13, border: '1.5px solid transparent', borderRadius: 8, fontFamily: 'var(--font-sans)', outline: 'none', background: 'var(--bg-section)', transition: 'border-color 0.15s, box-shadow 0.15s, background 0.15s' }} />
                </div>
              )}

              {/* Proctoring note */}
              <div style={{ background: 'var(--bg-section)', borderRadius: 8, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <ShieldCheck size={16} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Proctoring Settings</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>Configure proctoring in the <button onClick={() => window.open('#proctoring-portal', '_blank')} style={{ color: '#072FB5', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, fontFamily: 'var(--font-sans)', padding: 0, textDecoration: 'underline' }}>Proctoring Portal</button> after creating the exam.</div>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div style={{ padding: '16px 24px', background: '#FAFAFA', borderRadius: '0 0 16px 16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => setShowCreateModal(false)} style={{ padding: '8px 20px', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Cancel</button>
              <button onClick={() => setShowCreateModal(false)} style={{ padding: '8px 20px', fontSize: 13, fontWeight: 600, color: '#fff', background: newExam.courseCode ? '#072FB5' : 'var(--neutral-200)', border: 'none', borderRadius: 8, cursor: newExam.courseCode ? 'pointer' : 'default', fontFamily: 'var(--font-sans)', boxShadow: newExam.courseCode ? '0 1px 3px rgba(7,47,181,0.3)' : 'none', transition: 'background 0.15s, box-shadow 0.15s' }}>Create Exam</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
