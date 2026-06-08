'use client';
import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, ChevronLeft, GraduationCap, Clock, CheckCircle2, AlertTriangle, ExternalLink, Send, FileText, Download, RotateCcw } from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────

type SubmissionStatus = 'new' | 'pending' | 'overdue' | 'graded';
type SubmissionType = 'assignment' | 'quiz';

interface Submission {
  id: string;
  studentName: string;
  studentInitials: string;
  rollNo: string;
  type: SubmissionType;
  title: string;
  courseCode: string;
  courseName: string;
  programme: string;
  submittedAt: string;
  submittedDate: string;
  dueDate: string;
  status: SubmissionStatus;
  plagiarismScore: number; // 0-100
  plagiarismReportUrl: string;
  grade?: number;
  maxMarks: number;
  feedback?: string;
  fileUrl: string;
  wordCount?: number;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────

const PROGRAMMES = [
  { id: 'all', name: 'All Programmes' },
  { id: 'MBA-26', name: 'MBA - Batch 2026' },
  { id: 'BCA-26', name: 'BCA - Batch 2026' },
  { id: 'CSE-26', name: 'B.Tech CSE - Batch 2026' },
];

const COURSES = [
  { code: 'all', name: 'All Courses' },
  { code: 'MBA-101', name: 'Managerial Economics' },
  { code: 'MBA-102', name: 'Managerial Communication' },
  { code: 'MBA-103', name: 'Financial Accounting' },
  { code: 'MBA-104', name: 'Organizational Behaviour' },
  { code: 'MBA-105', name: 'Business Statistics' },
  { code: 'MBA-106', name: 'Business Law & Ethics' },
];

const MOCK_SUBMISSIONS: Submission[] = [
  { id: 'sub1', studentName: 'Arjun Mehta', studentInitials: 'AM', rollNo: 'MBA-2026-001', type: 'assignment', title: 'Case Study: Market Entry Strategy', courseCode: 'MBA-101', courseName: 'Managerial Economics', programme: 'MBA-26', submittedAt: '2 hours ago', submittedDate: '7 Jun 2026, 12:30 PM', dueDate: '8 Jun 2026', status: 'new', plagiarismScore: 12, plagiarismReportUrl: '#', maxMarks: 50, fileUrl: '#', wordCount: 2840 },
  { id: 'sub2', studentName: 'Priya Sharma', studentInitials: 'PS', rollNo: 'MBA-2026-002', type: 'assignment', title: 'Financial Statement Analysis Report', courseCode: 'MBA-103', courseName: 'Financial Accounting', programme: 'MBA-26', submittedAt: '4 hours ago', submittedDate: '7 Jun 2026, 10:15 AM', dueDate: '8 Jun 2026', status: 'new', plagiarismScore: 8, plagiarismReportUrl: '#', maxMarks: 50, fileUrl: '#', wordCount: 3200 },
  { id: 'sub3', studentName: 'Kavya Menon', studentInitials: 'KM', rollNo: 'MBA-2026-013', type: 'assignment', title: 'Case Study: Market Entry Strategy', courseCode: 'MBA-101', courseName: 'Managerial Economics', programme: 'MBA-26', submittedAt: '5 hours ago', submittedDate: '7 Jun 2026, 9:00 AM', dueDate: '8 Jun 2026', status: 'new', plagiarismScore: 15, plagiarismReportUrl: '#', maxMarks: 50, fileUrl: '#', wordCount: 2650 },
  { id: 'sub4', studentName: 'Sneha Reddy', studentInitials: 'SR', rollNo: 'MBA-2026-008', type: 'assignment', title: 'Financial Statement Analysis Report', courseCode: 'MBA-103', courseName: 'Financial Accounting', programme: 'MBA-26', submittedAt: '6 hours ago', submittedDate: '7 Jun 2026, 8:30 AM', dueDate: '8 Jun 2026', status: 'new', plagiarismScore: 5, plagiarismReportUrl: '#', maxMarks: 50, fileUrl: '#', wordCount: 3450 },
  { id: 'sub5', studentName: 'Dev Malhotra', studentInitials: 'DM', rollNo: 'MBA-2026-016', type: 'assignment', title: 'Organizational Behaviour Reflection', courseCode: 'MBA-104', courseName: 'Organizational Behaviour', programme: 'MBA-26', submittedAt: '1 day ago', submittedDate: '6 Jun 2026, 11:45 PM', dueDate: '5 Jun 2026', status: 'overdue', plagiarismScore: 22, plagiarismReportUrl: '#', maxMarks: 50, fileUrl: '#', wordCount: 1890 },
  { id: 'sub6', studentName: 'Rohan Gupta', studentInitials: 'RG', rollNo: 'MBA-2026-011', type: 'assignment', title: 'Organizational Behaviour Reflection', courseCode: 'MBA-104', courseName: 'Organizational Behaviour', programme: 'MBA-26', submittedAt: '2 days ago', submittedDate: '5 Jun 2026, 3:20 PM', dueDate: '5 Jun 2026', status: 'pending', plagiarismScore: 18, plagiarismReportUrl: '#', maxMarks: 50, fileUrl: '#', wordCount: 2100 },
  { id: 'sub7', studentName: 'Aisha Khan', studentInitials: 'AK', rollNo: 'MBA-2026-015', type: 'assignment', title: 'Organizational Behaviour Reflection', courseCode: 'MBA-104', courseName: 'Organizational Behaviour', programme: 'MBA-26', submittedAt: '2 days ago', submittedDate: '5 Jun 2026, 2:00 PM', dueDate: '5 Jun 2026', status: 'pending', plagiarismScore: 9, plagiarismReportUrl: '#', maxMarks: 50, fileUrl: '#', wordCount: 2560 },
  { id: 'sub8', studentName: 'Siddharth Rao', studentInitials: 'SR2', rollNo: 'MBA-2026-014', type: 'quiz', title: 'Business Communication Assessment', courseCode: 'MBA-102', courseName: 'Managerial Communication', programme: 'MBA-26', submittedAt: '3 days ago', submittedDate: '4 Jun 2026, 10:42 AM', dueDate: '4 Jun 2026', status: 'pending', plagiarismScore: 0, plagiarismReportUrl: '', maxMarks: 50, fileUrl: '#' },
  { id: 'sub9', studentName: 'Arjun Mehta', studentInitials: 'AM', rollNo: 'MBA-2026-001', type: 'assignment', title: 'Case Study: Elasticity Analysis', courseCode: 'MBA-101', courseName: 'Managerial Economics', programme: 'MBA-26', submittedAt: '5 days ago', submittedDate: '2 Jun 2026, 11:50 PM', dueDate: '3 Jun 2026', status: 'graded', plagiarismScore: 10, plagiarismReportUrl: '#', grade: 42, maxMarks: 50, feedback: 'Excellent analysis of price elasticity with good real-world examples. The section on cross-elasticity could have been more detailed.', fileUrl: '#', wordCount: 3100 },
  { id: 'sub10', studentName: 'Priya Sharma', studentInitials: 'PS', rollNo: 'MBA-2026-002', type: 'assignment', title: 'Case Study: Elasticity Analysis', courseCode: 'MBA-101', courseName: 'Managerial Economics', programme: 'MBA-26', submittedAt: '5 days ago', submittedDate: '2 Jun 2026, 10:30 PM', dueDate: '3 Jun 2026', status: 'graded', plagiarismScore: 6, plagiarismReportUrl: '#', grade: 47, maxMarks: 50, feedback: 'Outstanding work. Thorough research and well-structured arguments throughout.', fileUrl: '#', wordCount: 3500 },
  { id: 'sub11', studentName: 'Sneha Reddy', studentInitials: 'SR', rollNo: 'MBA-2026-008', type: 'assignment', title: 'Case Study: Elasticity Analysis', courseCode: 'MBA-101', courseName: 'Managerial Economics', programme: 'MBA-26', submittedAt: '6 days ago', submittedDate: '1 Jun 2026, 8:00 PM', dueDate: '3 Jun 2026', status: 'graded', plagiarismScore: 3, plagiarismReportUrl: '#', grade: 48, maxMarks: 50, feedback: 'Exceptional analysis with creative application of elasticity concepts to the Indian FMCG market.', fileUrl: '#', wordCount: 3800 },
  { id: 'sub12', studentName: 'Rahul Verma', studentInitials: 'RV', rollNo: 'MBA-2026-003', type: 'assignment', title: 'Case Study: Elasticity Analysis', courseCode: 'MBA-101', courseName: 'Managerial Economics', programme: 'MBA-26', submittedAt: '5 days ago', submittedDate: '2 Jun 2026, 11:58 PM', dueDate: '3 Jun 2026', status: 'graded', plagiarismScore: 34, plagiarismReportUrl: '#', grade: 28, maxMarks: 50, feedback: 'Significant portions appear to be directly copied from online sources. The analysis lacks original thinking. Please review the plagiarism report and consider resubmission.', fileUrl: '#', wordCount: 2200 },
];

const STATUS_CONFIG: Record<SubmissionStatus, { label: string; color: string; bg: string }> = {
  new: { label: 'New', color: '#072FB5', bg: 'rgba(7,47,181,0.06)' },
  pending: { label: 'Pending', color: '#D97706', bg: 'rgba(217,119,6,0.06)' },
  overdue: { label: 'Overdue', color: '#DC2626', bg: 'rgba(220,38,38,0.06)' },
  graded: { label: 'Graded', color: '#059669', bg: 'rgba(5,150,105,0.06)' },
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function GradingView() {
  const [programmeFilter, setProgrammeFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [gradeInput, setGradeInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');

  const filtered = MOCK_SUBMISSIONS.filter(s => {
    if (programmeFilter !== 'all' && s.programme !== programmeFilter) return false;
    if (courseFilter !== 'all' && s.courseCode !== courseFilter) return false;
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (search && !s.studentName.toLowerCase().includes(search.toLowerCase()) && !s.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const newCount = MOCK_SUBMISSIONS.filter(s => s.status === 'new').length;
  const pendingCount = MOCK_SUBMISSIONS.filter(s => s.status === 'pending').length;
  const overdueCount = MOCK_SUBMISSIONS.filter(s => s.status === 'overdue').length;
  const gradedCount = MOCK_SUBMISSIONS.filter(s => s.status === 'graded').length;

  const thStyle: React.CSSProperties = { fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'var(--font-sans)', padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)', whiteSpace: 'nowrap' };
  const tdStyle: React.CSSProperties = { fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', padding: '12px 14px', borderBottom: '1px solid rgba(0,0,0,0.03)' };

  // ─── Detail View ────────────────────────────────────────────────────────
  if (selectedSubmission) {
    const sub = selectedSubmission;
    const sc = STATUS_CONFIG[sub.status];
    const plagColor = sub.plagiarismScore <= 15 ? '#059669' : sub.plagiarismScore <= 30 ? '#D97706' : '#DC2626';

    return (
      <div style={{ padding: '28px 40px' }}>
        <button onClick={() => setSelectedSubmission(null)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: 'var(--blue-700)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-sans)', marginBottom: 20 }}>
          <ChevronLeft size={14} /> Back to Submissions
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
          {/* Left: Submission content */}
          <div>
            {/* Header card */}
            <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', padding: '24px 28px', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--blue-700)', background: 'rgba(7,47,181,0.06)', padding: '2px 8px', borderRadius: 'var(--radius-xs)', fontFamily: 'var(--font-mono)' }}>{sub.courseCode}</span>
                <span style={{ fontSize: 10.5, fontWeight: 600, color: sc.color, background: sc.bg, padding: '2px 8px', borderRadius: 'var(--radius-xs)' }}>{sc.label}</span>
                <span style={{ fontSize: 10.5, fontWeight: 600, color: sub.type === 'quiz' ? '#7C3AED' : '#8F3B00', background: sub.type === 'quiz' ? 'rgba(124,58,237,0.06)' : 'rgba(143,59,0,0.06)', padding: '2px 8px', borderRadius: 'var(--radius-xs)', textTransform: 'capitalize' }}>{sub.type}</span>
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', margin: '0 0 6px' }}>{sub.title}</h2>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500 }}>{sub.courseName}</div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--bg-section)', border: '1px solid var(--border-subtle)', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)' }}>{sub.studentInitials}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{sub.studentName}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{sub.rollNo}</div>
                  </div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 16 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 600 }}>Submitted</div>
                    <div style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--text-secondary)' }}>{sub.submittedDate}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 600 }}>Due</div>
                    <div style={{ fontSize: 11.5, fontWeight: 500, color: sub.status === 'overdue' ? '#DC2626' : 'var(--text-secondary)' }}>{sub.dueDate}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submission file */}
            <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', padding: '20px 24px', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Submission</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {sub.wordCount && <span style={{ fontSize: 10.5, color: 'var(--text-tertiary)', fontWeight: 500 }}>{sub.wordCount.toLocaleString()} words</span>}
                  <button style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: 'var(--blue-700)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-sans)' }}>
                    <Download size={12} /> Download
                  </button>
                </div>
              </div>
              <div style={{ background: 'var(--bg-section)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', padding: '20px', minHeight: 200 }}>
                <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.8, fontFamily: 'var(--font-sans)' }}>
                  <p style={{ margin: '0 0 12px' }}><i>[Document preview would render here — PDF viewer or rich text display of the student&apos;s submission]</i></p>
                  <p style={{ margin: 0, color: 'var(--text-tertiary)', fontSize: 11.5 }}>File: {sub.title.replace(/\s+/g, '_')}.pdf</p>
                </div>
              </div>
            </div>

            {/* Existing feedback (if graded) */}
            {sub.status === 'graded' && sub.feedback && (
              <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', padding: '20px 24px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Feedback Given</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, background: 'var(--bg-section)', padding: '14px 16px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid #059669' }}>{sub.feedback}</div>
                <div style={{ marginTop: 10, fontSize: 12, fontWeight: 700, color: '#059669' }}>Grade: {sub.grade}/{sub.maxMarks}</div>
              </div>
            )}
          </div>

          {/* Right sidebar: Plagiarism + Grading form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Plagiarism */}
            <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', padding: '20px' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>Plagiarism Check</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', border: `3px solid ${plagColor}`, display: 'grid', placeItems: 'center' }}>
                  <span style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-mono)', color: plagColor }}>{sub.plagiarismScore}%</span>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: plagColor }}>{sub.plagiarismScore <= 15 ? 'Low similarity' : sub.plagiarismScore <= 30 ? 'Moderate similarity' : 'High similarity'}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{sub.plagiarismScore <= 15 ? 'Within acceptable range' : sub.plagiarismScore <= 30 ? 'Review recommended' : 'Requires investigation'}</div>
                </div>
              </div>
              {sub.plagiarismReportUrl && (
                <button onClick={() => window.open(sub.plagiarismReportUrl, '_blank')} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, width: '100%',
                  padding: '8px', fontSize: 12, fontWeight: 600, color: 'var(--blue-700)',
                  background: 'rgba(7,47,181,0.04)', border: '1px solid rgba(7,47,181,0.12)',
                  borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)',
                }}>
                  <ExternalLink size={12} /> View Full Report
                </button>
              )}
            </div>

            {/* Grading form */}
            {sub.status !== 'graded' && (
              <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', padding: '20px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>Grade Submission</div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Marks (out of {sub.maxMarks})</label>
                  <input type="number" value={gradeInput} onChange={e => setGradeInput(e.target.value)} min={0} max={sub.maxMarks} placeholder="0" style={{ width: '100%', padding: '10px 12px', fontSize: 16, fontFamily: 'var(--font-mono)', fontWeight: 700, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', outline: 'none', textAlign: 'center' }} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Feedback &amp; Comments</label>
                  <textarea value={feedbackInput} onChange={e => setFeedbackInput(e.target.value)} placeholder="Write your feedback to the student..." rows={5} style={{ width: '100%', padding: '10px 12px', fontSize: 12.5, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)', outline: 'none', resize: 'vertical', lineHeight: 1.6 }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, width: '100%',
                    padding: '10px', fontSize: 13, fontWeight: 600, color: '#fff',
                    background: 'var(--blue-700)', border: '1px solid var(--blue-700)',
                    borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)',
                  }}>
                    <Send size={13} /> Submit Grade
                  </button>
                  <button style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, width: '100%',
                    padding: '10px', fontSize: 13, fontWeight: 600, color: '#D97706',
                    background: 'rgba(217,119,6,0.04)', border: '1px solid rgba(217,119,6,0.15)',
                    borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)',
                  }}>
                    <RotateCcw size={13} /> Request Resubmission
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── List View ──────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '28px 40px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', margin: 0 }}>Grading</h1>
        <p style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500, marginTop: 4 }}>Review submissions, check plagiarism &amp; provide feedback</p>
      </div>

      {/* Summary counts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'New', count: newCount, color: '#072FB5', bg: 'rgba(7,47,181,0.04)', border: 'rgba(7,47,181,0.1)' },
          { label: 'Pending', count: pendingCount, color: '#D97706', bg: 'rgba(217,119,6,0.04)', border: 'rgba(217,119,6,0.1)' },
          { label: 'Overdue', count: overdueCount, color: '#DC2626', bg: 'rgba(220,38,38,0.04)', border: 'rgba(220,38,38,0.1)' },
          { label: 'Graded', count: gradedCount, color: '#059669', bg: 'rgba(5,150,105,0.04)', border: 'rgba(5,150,105,0.1)' },
        ].map(c => (
          <button key={c.label} onClick={() => setStatusFilter(c.label.toLowerCase() as SubmissionStatus)} style={{
            background: statusFilter === c.label.toLowerCase() ? c.bg : '#fff',
            border: statusFilter === c.label.toLowerCase() ? `1.5px solid ${c.border}` : '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)', padding: '14px 18px', cursor: 'pointer', textAlign: 'left',
          }}>
            <div style={{ fontSize: 26, fontWeight: 800, fontFamily: 'var(--font-mono)', color: c.color, letterSpacing: '-0.02em' }}>{c.count}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: c.color, marginTop: 2 }}>{c.label}</div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <select value={programmeFilter} onChange={e => setProgrammeFilter(e.target.value)} style={{
          padding: '6px 28px 6px 10px', fontSize: 12, fontWeight: 500, color: 'var(--text-primary)',
          background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)',
          fontFamily: 'var(--font-sans)', outline: 'none', cursor: 'pointer',
          appearance: 'none', WebkitAppearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
        }}>
          {PROGRAMMES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select value={courseFilter} onChange={e => setCourseFilter(e.target.value)} style={{
          padding: '6px 28px 6px 10px', fontSize: 12, fontWeight: 500, color: 'var(--text-primary)',
          background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)',
          fontFamily: 'var(--font-sans)', outline: 'none', cursor: 'pointer',
          appearance: 'none', WebkitAppearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
        }}>
          {COURSES.map(c => <option key={c.code} value={c.code}>{c.code === 'all' ? c.name : `${c.code}: ${c.name}`}</option>)}
        </select>
        {statusFilter !== 'all' && (
          <button onClick={() => setStatusFilter('all')} style={{
            padding: '6px 10px', fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)',
            background: 'var(--bg-section)', border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)',
          }}>Clear filter &times;</button>
        )}
        <div style={{ position: 'relative', marginLeft: 'auto' }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search submissions..." style={{
            width: 200, padding: '6px 10px 6px 30px', fontSize: 12, fontWeight: 500,
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
              <th style={{ ...thStyle, minWidth: 200 }}>Submission</th>
              <th style={thStyle}>Course</th>
              <th style={thStyle}>Submitted</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Plagiarism</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Status</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Grade</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(sub => {
              const sc = STATUS_CONFIG[sub.status];
              const plagColor = sub.plagiarismScore <= 15 ? '#059669' : sub.plagiarismScore <= 30 ? '#D97706' : '#DC2626';
              return (
                <tr key={sub.id} onClick={() => { setSelectedSubmission(sub); setGradeInput(sub.grade?.toString() || ''); setFeedbackInput(sub.feedback || ''); }}
                  style={{ cursor: 'pointer', background: sub.status === 'overdue' ? 'rgba(220,38,38,0.02)' : 'transparent' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.015)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = sub.status === 'overdue' ? 'rgba(220,38,38,0.02)' : 'transparent'; }}
                >
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--bg-section)', border: '1px solid var(--border-subtle)', display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 700, color: 'var(--text-secondary)', flexShrink: 0 }}>{sub.studentInitials}</div>
                      <div>
                        <div style={{ fontSize: 12.5, fontWeight: 600 }}>{sub.studentName}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{sub.rollNo}</div>
                      </div>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ fontSize: 12.5, fontWeight: 600 }}>{sub.title}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 1, textTransform: 'capitalize' }}>{sub.type}</div>
                  </td>
                  <td style={{ ...tdStyle, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{sub.courseCode}</td>
                  <td style={{ ...tdStyle, fontSize: 11.5, color: 'var(--text-secondary)' }}>{sub.submittedAt}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    {sub.type === 'quiz' ? (
                      <span style={{ fontSize: 10.5, color: 'var(--text-tertiary)' }}>N/A</span>
                    ) : (
                      <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', color: plagColor }}>{sub.plagiarismScore}%</span>
                    )}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: sc.color, background: sc.bg, padding: '3px 10px', borderRadius: 'var(--radius-xs)' }}>{sc.label}</span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 12 }}>
                    {sub.grade !== undefined ? (
                      <span>{sub.grade}<span style={{ fontWeight: 400, color: 'var(--text-tertiary)' }}>/{sub.maxMarks}</span></span>
                    ) : (
                      <span style={{ color: 'var(--text-tertiary)' }}>—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border-subtle)', fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>
          {filtered.length} submissions
        </div>
      </div>
    </div>
  );
}
