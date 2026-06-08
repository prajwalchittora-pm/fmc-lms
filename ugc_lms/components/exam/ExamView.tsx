'use client';
import { useState } from 'react';
import { ChevronDown, ChevronRight, Clock, CalendarDays, Timer, BookOpen, AlertTriangle, CheckCircle2, XCircle, FileText, ClipboardList } from 'lucide-react';
import { SEMESTERS, SemesterId } from '@/lib/mockData';

// ─── Types ────────────────────────────────────────────────────────────────────

type ExamType = 'mid-sem' | 'end-sem' | 'quiz' | 'supplementary';
type EligibilityStatus = 'eligible' | 'not-eligible';
type ExamStatus = 'scheduled' | 'live' | 'completed';
type PastExamStatus = 'passed' | 'failed';

interface UpcomingExam {
  id: string;
  examType: ExamType;
  courseName: string;
  courseCode: string;
  date: string;
  time: string;
  duration: string;
  daysLeft: number;
  eligibility: EligibilityStatus;
  eligibilityNote?: string;
  status: ExamStatus;
  syllabus: string[];
}

interface QuestionBreakdown {
  question: string;
  marksObtained: number;
  maxMarks: number;
}

interface PastExam {
  id: string;
  examType: ExamType;
  courseName: string;
  courseCode: string;
  date: string;
  marksObtained: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  status: PastExamStatus;
  breakdown?: QuestionBreakdown[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const UPCOMING_EXAMS: UpcomingExam[] = [
  {
    id: 'ue1',
    examType: 'mid-sem',
    courseName: 'Managerial Economics',
    courseCode: 'MBA-101',
    date: 'Mon, Jun 23, 2026',
    time: '10:00 AM',
    duration: '2 hours',
    daysLeft: 21,
    eligibility: 'eligible',
    status: 'scheduled',
    syllabus: ['Demand & Supply Analysis', 'Elasticity of Demand', 'Cost & Production Theory', 'Market Structures'],
  },
  {
    id: 'ue2',
    examType: 'quiz',
    courseName: 'Business Statistics',
    courseCode: 'MBA-105',
    date: 'Mon, Jun 9, 2026',
    time: '9:00 AM',
    duration: '60 min',
    daysLeft: 7,
    eligibility: 'eligible',
    status: 'scheduled',
    syllabus: ['Probability Distributions', 'Hypothesis Testing', 'Confidence Intervals'],
  },
  {
    id: 'ue3',
    examType: 'end-sem',
    courseName: 'Organizational Behaviour',
    courseCode: 'MBA-104',
    date: 'Wed, Jul 2, 2026',
    time: '10:00 AM',
    duration: '3 hours',
    daysLeft: 30,
    eligibility: 'not-eligible',
    eligibilityNote: 'Attendance below 75% (68%)',
    status: 'scheduled',
    syllabus: ['Motivation Theories', 'Leadership Models', 'Group Dynamics', 'Organizational Culture', 'Change Management'],
  },
  {
    id: 'ue4',
    examType: 'mid-sem',
    courseName: 'Managerial Communication',
    courseCode: 'MBA-102',
    date: 'Tue, Jun 24, 2026',
    time: '2:00 PM',
    duration: '1.5 hours',
    daysLeft: 22,
    eligibility: 'eligible',
    status: 'scheduled',
    syllabus: ['Communication Fundamentals', 'Persuasion & Negotiation', 'Business Correspondence'],
  },
];

const PAST_EXAMS: PastExam[] = [
  {
    id: 'pe1',
    examType: 'quiz',
    courseName: 'Managerial Economics',
    courseCode: 'MBA-101',
    date: 'Feb 28, 2026',
    marksObtained: 9,
    maxMarks: 10,
    percentage: 90,
    grade: 'A+',
    status: 'passed',
    breakdown: [
      { question: 'Q1: Define price elasticity of demand', marksObtained: 2, maxMarks: 2 },
      { question: 'Q2: Short-run vs Long-run cost curves', marksObtained: 2, maxMarks: 2 },
      { question: 'Q3: Monopolistic competition analysis', marksObtained: 1, maxMarks: 2 },
      { question: 'Q4: Calculate equilibrium price', marksObtained: 2, maxMarks: 2 },
      { question: 'Q5: Market failure scenarios', marksObtained: 2, maxMarks: 2 },
    ],
  },
  {
    id: 'pe2',
    examType: 'quiz',
    courseName: 'Managerial Communication',
    courseCode: 'MBA-102',
    date: 'Mar 1, 2026',
    marksObtained: 8,
    maxMarks: 10,
    percentage: 80,
    grade: 'A',
    status: 'passed',
    breakdown: [
      { question: 'Q1: Communication barriers', marksObtained: 2, maxMarks: 2 },
      { question: 'Q2: Active listening techniques', marksObtained: 2, maxMarks: 2 },
      { question: 'Q3: Formal vs informal communication', marksObtained: 1, maxMarks: 2 },
      { question: 'Q4: Non-verbal communication analysis', marksObtained: 1, maxMarks: 2 },
      { question: 'Q5: Business email drafting', marksObtained: 2, maxMarks: 2 },
    ],
  },
  {
    id: 'pe3',
    examType: 'mid-sem',
    courseName: 'Financial Accounting & Analysis',
    courseCode: 'MBA-103',
    date: 'Mar 15, 2026',
    marksObtained: 42,
    maxMarks: 50,
    percentage: 84,
    grade: 'A',
    status: 'passed',
    breakdown: [
      { question: 'Q1: Journal entries for transactions', marksObtained: 9, maxMarks: 10 },
      { question: 'Q2: Trial balance preparation', marksObtained: 8, maxMarks: 10 },
      { question: 'Q3: Depreciation methods comparison', marksObtained: 9, maxMarks: 10 },
      { question: 'Q4: Balance sheet analysis', marksObtained: 8, maxMarks: 10 },
      { question: 'Q5: Ratio analysis case study', marksObtained: 8, maxMarks: 10 },
    ],
  },
  {
    id: 'pe4',
    examType: 'quiz',
    courseName: 'Business Statistics',
    courseCode: 'MBA-105',
    date: 'Mar 8, 2026',
    marksObtained: 8,
    maxMarks: 10,
    percentage: 80,
    grade: 'A',
    status: 'passed',
  },
  {
    id: 'pe5',
    examType: 'quiz',
    courseName: 'Organizational Behaviour',
    courseCode: 'MBA-104',
    date: 'Mar 15, 2026',
    marksObtained: 4,
    maxMarks: 10,
    percentage: 40,
    grade: 'D',
    status: 'failed',
    breakdown: [
      { question: 'Q1: Maslow vs Herzberg theories', marksObtained: 1, maxMarks: 2 },
      { question: 'Q2: Contingency leadership model', marksObtained: 1, maxMarks: 2 },
      { question: 'Q3: Group decision-making', marksObtained: 1, maxMarks: 2 },
      { question: 'Q4: Organizational structure types', marksObtained: 0, maxMarks: 2 },
      { question: 'Q5: Conflict resolution strategies', marksObtained: 1, maxMarks: 2 },
    ],
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const EXAM_TYPE_CONFIG: Record<ExamType, { label: string; color: string; bg: string }> = {
  'mid-sem': { label: 'Mid-Sem', color: '#072FB5', bg: 'rgba(7,47,181,0.08)' },
  'end-sem': { label: 'End-Sem', color: '#DC2626', bg: 'rgba(220,38,38,0.08)' },
  'quiz': { label: 'Quiz', color: '#7C3AED', bg: 'rgba(124,58,237,0.08)' },
  'supplementary': { label: 'Supplementary', color: '#D97706', bg: 'rgba(217,119,6,0.08)' },
};

// ─── DaysLeftBadge (matches UpcomingActivities) ───────────────────────────────

function DaysLeftBadge({ days }: { days: number }) {
  const urgent = days <= 2;
  const soon = days <= 7;
  const color = urgent ? '#DC2626' : soon ? '#D97706' : 'var(--text-tertiary)';
  const bg = urgent ? 'rgba(220,38,38,0.08)' : soon ? 'rgba(217,119,6,0.08)' : 'var(--bg-section)';
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 8px', background: bg, borderRadius: 'var(--radius-sm)',
      fontSize: 10, fontWeight: 700, color, fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap',
    }}>
      <Clock size={9} strokeWidth={2.5} />
      {days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : days + 'd left'}
    </div>
  );
}

// ─── Exam Card ────────────────────────────────────────────────────────────────

function ExamCard({ exam }: { exam: UpcomingExam }) {
  const [showSyllabus, setShowSyllabus] = useState(false);
  const typeConfig = EXAM_TYPE_CONFIG[exam.examType];
  const isEligible = exam.eligibility === 'eligible';

  return (
    <div style={{
      background: '#fff',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: '20px',
      display: 'flex', flexDirection: 'column', gap: 0,
      transition: 'box-shadow 0.12s ease',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 3px 12px rgba(0,0,0,0.05)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
    >
      {/* Top row: type badge + days left */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '3px 10px',
          background: typeConfig.bg,
          borderRadius: 'var(--radius-sm)',
          fontSize: 10, fontWeight: 700, color: typeConfig.color,
          letterSpacing: '0.03em', textTransform: 'uppercase',
        }}>
          <FileText size={10} strokeWidth={2.2} />
          {typeConfig.label}
        </div>
        <DaysLeftBadge days={exam.daysLeft} />
      </div>

      {/* Course name + code */}
      <div style={{
        fontSize: 15, fontWeight: 700, color: 'var(--text-primary)',
        fontFamily: 'var(--font-display)', letterSpacing: '-0.01em',
        marginBottom: 3,
      }}>
        {exam.courseName}
      </div>
      <div style={{
        fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600,
        fontFamily: 'var(--font-mono)', marginBottom: 14,
      }}>
        {exam.courseCode}
      </div>

      {/* Date + Time + Duration */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: 'var(--text-secondary)', fontWeight: 500 }}>
          <CalendarDays size={12} strokeWidth={1.8} style={{ color: 'var(--text-tertiary)' }} />
          {exam.date}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: 'var(--text-secondary)', fontWeight: 500 }}>
          <Clock size={12} strokeWidth={1.8} style={{ color: 'var(--text-tertiary)' }} />
          {exam.time}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: 'var(--text-secondary)', fontWeight: 500 }}>
          <Timer size={12} strokeWidth={1.8} style={{ color: 'var(--text-tertiary)' }} />
          {exam.duration}
        </div>
      </div>

      {/* Eligibility */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '8px 12px',
        background: isEligible ? 'rgba(22,163,74,0.06)' : 'rgba(220,38,38,0.06)',
        borderRadius: 'var(--radius-sm)',
        marginBottom: 14,
      }}>
        {isEligible ? (
          <CheckCircle2 size={13} strokeWidth={2} style={{ color: '#16A34A' }} />
        ) : (
          <AlertTriangle size={13} strokeWidth={2} style={{ color: '#DC2626' }} />
        )}
        <span style={{
          fontSize: 11.5, fontWeight: 600,
          color: isEligible ? '#16A34A' : '#DC2626',
        }}>
          {isEligible ? 'Eligible' : `Not Eligible — ${exam.eligibilityNote || 'Attendance below 75%'}`}
        </span>
      </div>

      {/* Syllabus toggle */}
      <button
        onClick={() => setShowSyllabus(!showSyllabus)}
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: 0, background: 'none', border: 'none',
          fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)',
          cursor: 'pointer', fontFamily: 'var(--font-sans)',
          marginBottom: showSyllabus ? 8 : 0,
        }}
      >
        <ClipboardList size={11} strokeWidth={2} />
        Topics covered ({exam.syllabus.length})
        <ChevronDown
          size={11} strokeWidth={2}
          style={{ transform: showSyllabus ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
        />
      </button>

      {showSyllabus && (
        <div style={{ padding: '8px 0 4px 0' }}>
          {exam.syllabus.map((topic, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '4px 0',
              fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500,
            }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--text-tertiary)', opacity: 0.5, flexShrink: 0 }} />
              {topic}
            </div>
          ))}
        </div>
      )}

      {/* Action button */}
      <div style={{ marginTop: 'auto', paddingTop: 16 }}>
        {exam.status === 'live' ? (
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}>
            Start Exam
          </button>
        ) : (
          <div style={{
            width: '100%', textAlign: 'center',
            padding: '9px 18px',
            background: 'var(--bg-section)',
            borderRadius: 'var(--radius-md)',
            fontSize: 13, fontWeight: 600, color: 'var(--text-tertiary)',
            border: '1px solid var(--border-subtle)',
          }}>
            Scheduled
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Past Exam Row ────────────────────────────────────────────────────────────

function PastExamRow({ exam, isExpanded, onToggle }: { exam: PastExam; isExpanded: boolean; onToggle: () => void }) {
  const typeConfig = EXAM_TYPE_CONFIG[exam.examType];
  const isPassed = exam.status === 'passed';

  function gradeColor(percentage: number): string {
    if (percentage >= 85) return '#16A34A';
    if (percentage >= 70) return '#072FB5';
    if (percentage >= 50) return '#D97706';
    return '#DC2626';
  }

  return (
    <div style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <div
        onClick={onToggle}
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 0.8fr 0.8fr 0.7fr 0.6fr 0.6fr 32px',
          alignItems: 'center',
          padding: '14px 20px',
          cursor: 'pointer',
          transition: 'background 0.1s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-section)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
      >
        {/* Course */}
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.01em', marginBottom: 2 }}>
            {exam.courseName}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
            {exam.courseCode}
          </div>
        </div>

        {/* Exam Type */}
        <div>
          <span style={{
            display: 'inline-flex', padding: '2px 8px',
            background: typeConfig.bg, borderRadius: 'var(--radius-sm)',
            fontSize: 10, fontWeight: 700, color: typeConfig.color,
            letterSpacing: '0.02em',
          }}>
            {typeConfig.label}
          </span>
        </div>

        {/* Date */}
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>
          {exam.date}
        </div>

        {/* Marks */}
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
            {exam.marksObtained}
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>/{exam.maxMarks}</span>
        </div>

        {/* Grade */}
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: gradeColor(exam.percentage), fontFamily: 'var(--font-mono)' }}>
            {exam.grade}
          </span>
        </div>

        {/* Status */}
        <div style={{ textAlign: 'center' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 10, fontWeight: 700,
            color: isPassed ? '#16A34A' : '#DC2626',
          }}>
            {isPassed ? <CheckCircle2 size={11} strokeWidth={2.5} /> : <XCircle size={11} strokeWidth={2.5} />}
            {isPassed ? 'Passed' : 'Failed'}
          </span>
        </div>

        {/* Chevron */}
        <div style={{ display: 'grid', placeItems: 'center', color: 'var(--text-tertiary)' }}>
          {exam.breakdown ? (
            isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
          ) : (
            <span style={{ fontSize: 10, color: 'var(--text-tertiary)', opacity: 0.3 }}>--</span>
          )}
        </div>
      </div>

      {/* Expanded breakdown */}
      {isExpanded && exam.breakdown && (
        <div style={{ padding: '0 20px 20px', background: 'var(--bg-section)' }}>
          <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginTop: 8 }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '2.5fr 0.5fr 0.5fr',
              padding: '8px 16px', background: 'var(--bg-section)',
              borderBottom: '1px solid var(--border-subtle)',
            }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Question</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase', textAlign: 'center' }}>Marks</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase', textAlign: 'center' }}>Max</span>
            </div>
            {exam.breakdown.map((q, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '2.5fr 0.5fr 0.5fr',
                padding: '10px 16px', alignItems: 'center',
                borderBottom: i < exam.breakdown!.length - 1 ? '1px solid var(--border-subtle)' : 'none',
              }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>{q.question}</span>
                <span style={{
                  fontSize: 12, fontWeight: 700, textAlign: 'center',
                  fontFamily: 'var(--font-mono)',
                  color: q.marksObtained === q.maxMarks ? '#16A34A' : q.marksObtained === 0 ? '#DC2626' : 'var(--text-primary)',
                }}>
                  {q.marksObtained}
                </span>
                <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-tertiary)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{q.maxMarks}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main View ────────────────────────────────────────────────────────────────

export default function ExamView() {
  const defaultSem = SEMESTERS.find(s => s.isCurrent)?.id ?? SEMESTERS[0].id;
  const [selectedSem, setSelectedSem] = useState<SemesterId>(defaultSem);
  const [expandedPastId, setExpandedPastId] = useState<string | null>(null);

  return (
    <div style={{ padding: '24px 48px 64px', maxWidth: 1400, width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <span className="label">Assessments</span>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', margin: 0 }}>
            Exams
          </h1>
          <div style={{ position: 'relative', display: 'inline-flex' }}>
            <select
              value={selectedSem}
              onChange={e => { setSelectedSem(e.target.value as SemesterId); setExpandedPastId(null); }}
              style={{
                appearance: 'none', WebkitAppearance: 'none', padding: '6px 28px 6px 12px',
                fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-sans)',
                color: 'var(--text-primary)', background: 'var(--bg-section)',
                border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)',
                cursor: 'pointer', outline: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
              }}
            >
              {SEMESTERS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
            <ChevronDown size={13} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' }} />
          </div>
        </div>
      </div>

      {/* ── Upcoming Exams ── */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <BookOpen size={15} strokeWidth={2} style={{ color: 'var(--text-tertiary)' }} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
            Upcoming Exams
          </span>
          <span style={{
            fontSize: 10, fontWeight: 700, color: '#fff',
            background: 'var(--text-primary)', borderRadius: 'var(--radius-sm)',
            padding: '1px 7px', marginLeft: 2,
          }}>
            {UPCOMING_EXAMS.length}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {UPCOMING_EXAMS.map(exam => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      </div>

      {/* ── Past Exams ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <CheckCircle2 size={15} strokeWidth={2} style={{ color: 'var(--text-tertiary)' }} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
            Past Exams
          </span>
          <span style={{
            fontSize: 10, fontWeight: 700, color: '#fff',
            background: 'var(--text-primary)', borderRadius: 'var(--radius-sm)',
            padding: '1px 7px', marginLeft: 2,
          }}>
            {PAST_EXAMS.length}
          </span>
        </div>

        <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 0.8fr 0.8fr 0.7fr 0.6fr 0.6fr 32px',
            padding: '10px 20px',
            background: 'var(--bg-section)',
            borderBottom: '1px solid var(--border-subtle)',
          }}>
            {['Course', 'Type', 'Date', 'Marks', 'Grade', 'Status', ''].map(h => (
              <div key={h} style={{
                fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)',
                letterSpacing: '0.06em', textTransform: 'uppercase',
                textAlign: h === 'Course' || h === 'Type' || h === 'Date' || h === '' ? 'left' : 'center',
              }}>
                {h}
              </div>
            ))}
          </div>

          {/* Rows */}
          {PAST_EXAMS.map(exam => (
            <PastExamRow
              key={exam.id}
              exam={exam}
              isExpanded={expandedPastId === exam.id}
              onToggle={() => {
                if (!exam.breakdown) return;
                setExpandedPastId(expandedPastId === exam.id ? null : exam.id);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
