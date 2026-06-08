'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, Clock, Search, BarChart3, Users, Award, AlertTriangle, CircleDot, FileText, HelpCircle, ClipboardList } from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────

type AssessmentType = 'quiz' | 'assignment';

interface Assessment {
  id: string;
  title: string;
  type: AssessmentType;
  courseCode: string;
  courseName: string;
  totalStudents: number;
  submitted: number;
  graded: number;
  avgScore: number;
  maxMarks: number;
  passRate: number;
  dueDate: string;
}

interface StudentResult {
  id: string;
  name: string;
  initials: string;
  rollNo: string;
  score: number | null;
  maxMarks: number;
  status: 'passed' | 'failed' | 'not_attempted' | 'pending_grade';
  submittedAt: string | null;
  timeTaken: string | null;
  attempts: number;
}

interface QuizAnswer {
  questionNum: number;
  questionText: string;
  questionType: string;
  studentAnswer: string;
  correctAnswer: string;
  points: number;
  maxPoints: number;
  correct: boolean | null; // null = pending (essay)
}

// ─── Mock Data ─────────────────────────────────────────────────────────────

const ASSESSMENTS: Assessment[] = [
  { id: 'a1', title: 'Case Study: Market Entry Strategy', type: 'assignment', courseCode: 'MBA-101', courseName: 'Managerial Economics', totalStudents: 20, submitted: 14, graded: 8, avgScore: 72, maxMarks: 100, passRate: 86, dueDate: '8 Jun' },
  { id: 'a2', title: 'Module 2 Assessment', type: 'quiz', courseCode: 'MBA-101', courseName: 'Managerial Economics', totalStudents: 20, submitted: 18, graded: 18, avgScore: 78, maxMarks: 100, passRate: 89, dueDate: '5 Jun' },
  { id: 'a3', title: 'Financial Statement Analysis', type: 'assignment', courseCode: 'MBA-103', courseName: 'Financial Accounting', totalStudents: 20, submitted: 16, graded: 12, avgScore: 68, maxMarks: 100, passRate: 75, dueDate: '10 Jun' },
  { id: 'a4', title: 'Check-in: Communication Fundamentals', type: 'quiz', courseCode: 'MBA-102', courseName: 'Managerial Communication', totalStudents: 20, submitted: 20, graded: 20, avgScore: 85, maxMarks: 50, passRate: 95, dueDate: '1 Jun' },
  { id: 'a5', title: 'OB Reflection Paper', type: 'assignment', courseCode: 'MBA-104', courseName: 'Organizational Behaviour', totalStudents: 20, submitted: 6, graded: 0, avgScore: 0, maxMarks: 100, passRate: 0, dueDate: '15 Jun' },
];

const STUDENT_RESULTS: Record<string, StudentResult[]> = {
  'a2': [
    { id: 's1', name: 'Arjun Mehta', initials: 'AM', rollNo: 'MBA-001', score: 92, maxMarks: 100, status: 'passed', submittedAt: '5 Jun, 10:15 AM', timeTaken: '24 min', attempts: 1 },
    { id: 's2', name: 'Priya Sharma', initials: 'PS', rollNo: 'MBA-002', score: 88, maxMarks: 100, status: 'passed', submittedAt: '5 Jun, 10:30 AM', timeTaken: '28 min', attempts: 1 },
    { id: 's3', name: 'Kavya Menon', initials: 'KM', rollNo: 'MBA-013', score: 76, maxMarks: 100, status: 'passed', submittedAt: '5 Jun, 11:00 AM', timeTaken: '30 min', attempts: 1 },
    { id: 's4', name: 'Dev Malhotra', initials: 'DM', rollNo: 'MBA-016', score: 34, maxMarks: 100, status: 'failed', submittedAt: '5 Jun, 10:45 AM', timeTaken: '18 min', attempts: 1 },
    { id: 's5', name: 'Rohan Gupta', initials: 'RG', rollNo: 'MBA-011', score: 62, maxMarks: 100, status: 'passed', submittedAt: '5 Jun, 11:15 AM', timeTaken: '29 min', attempts: 1 },
    { id: 's6', name: 'Sneha Reddy', initials: 'SR', rollNo: 'MBA-008', score: 95, maxMarks: 100, status: 'passed', submittedAt: '5 Jun, 10:20 AM', timeTaken: '22 min', attempts: 1 },
    { id: 's7', name: 'Aisha Khan', initials: 'AK', rollNo: 'MBA-015', score: 81, maxMarks: 100, status: 'passed', submittedAt: '5 Jun, 11:30 AM', timeTaken: '26 min', attempts: 1 },
    { id: 's8', name: 'Karthik Nair', initials: 'KN', rollNo: 'MBA-009', score: null, maxMarks: 100, status: 'not_attempted', submittedAt: null, timeTaken: null, attempts: 0 },
    { id: 's9', name: 'Siddharth Rao', initials: 'SR2', rollNo: 'MBA-014', score: null, maxMarks: 100, status: 'not_attempted', submittedAt: null, timeTaken: null, attempts: 0 },
  ],
  'a1': [
    { id: 's1', name: 'Arjun Mehta', initials: 'AM', rollNo: 'MBA-001', score: 85, maxMarks: 100, status: 'passed', submittedAt: '7 Jun, 12:30 PM', timeTaken: null, attempts: 1 },
    { id: 's2', name: 'Priya Sharma', initials: 'PS', rollNo: 'MBA-002', score: 78, maxMarks: 100, status: 'passed', submittedAt: '7 Jun, 10:15 AM', timeTaken: null, attempts: 1 },
    { id: 's3', name: 'Kavya Menon', initials: 'KM', rollNo: 'MBA-013', score: null, maxMarks: 100, status: 'pending_grade', submittedAt: '7 Jun, 9:00 AM', timeTaken: null, attempts: 1 },
    { id: 's4', name: 'Dev Malhotra', initials: 'DM', rollNo: 'MBA-016', score: null, maxMarks: 100, status: 'not_attempted', submittedAt: null, timeTaken: null, attempts: 0 },
  ],
};

const QUIZ_ANSWERS: Record<string, QuizAnswer[]> = {
  's1': [
    { questionNum: 1, questionText: 'Define the law of diminishing marginal returns.', questionType: 'Short Answer', studentAnswer: 'As one factor of production increases while others remain fixed, the marginal output eventually decreases.', correctAnswer: 'Accepted', points: 10, maxPoints: 10, correct: true },
    { questionNum: 2, questionText: 'Which of the following is NOT a market structure?', questionType: 'Multiple Choice', studentAnswer: 'B) Bilateral monopoly', correctAnswer: 'B) Bilateral monopoly', points: 10, maxPoints: 10, correct: true },
    { questionNum: 3, questionText: 'GDP is measured in real terms to account for inflation.', questionType: 'True / False', studentAnswer: 'True', correctAnswer: 'True', points: 10, maxPoints: 10, correct: true },
    { questionNum: 4, questionText: 'Calculate the price elasticity if price changes from ₹100 to ₹120 and quantity from 50 to 40.', questionType: 'Numerical', studentAnswer: '1.0', correctAnswer: '1.0 (±0.1)', points: 10, maxPoints: 10, correct: true },
    { questionNum: 5, questionText: 'Explain the concept of market equilibrium and its significance.', questionType: 'Essay', studentAnswer: 'Market equilibrium is the point where supply meets demand, determining the price and quantity of a good in the market. At equilibrium, there is no tendency for price to change...', correctAnswer: 'Manual grading', points: 18, maxPoints: 20, correct: null },
    { questionNum: 6, questionText: 'Match the economic theory with its proponent.', questionType: 'Matching', studentAnswer: 'All 4 matched correctly', correctAnswer: 'All matched', points: 10, maxPoints: 10, correct: true },
    { questionNum: 7, questionText: 'The law of {blank} states that consumer satisfaction diminishes with each additional unit.', questionType: 'Fill in the Blank', studentAnswer: 'diminishing marginal utility', correctAnswer: 'diminishing marginal utility', points: 10, maxPoints: 10, correct: true },
    { questionNum: 8, questionText: 'Which of the following are characteristics of perfect competition?', questionType: 'Multiple Select', studentAnswer: 'A, C, D (3 of 4 correct)', correctAnswer: 'A, B, C, D', points: 8, maxPoints: 10, correct: false },
  ],
  's4': [
    { questionNum: 1, questionText: 'Define the law of diminishing marginal returns.', questionType: 'Short Answer', studentAnswer: 'When you add more workers the output goes down', correctAnswer: 'Partial', points: 4, maxPoints: 10, correct: false },
    { questionNum: 2, questionText: 'Which of the following is NOT a market structure?', questionType: 'Multiple Choice', studentAnswer: 'C) Oligopoly', correctAnswer: 'B) Bilateral monopoly', points: 0, maxPoints: 10, correct: false },
    { questionNum: 3, questionText: 'GDP is measured in real terms to account for inflation.', questionType: 'True / False', studentAnswer: 'True', correctAnswer: 'True', points: 10, maxPoints: 10, correct: true },
    { questionNum: 4, questionText: 'Calculate the price elasticity if price changes from ₹100 to ₹120 and quantity from 50 to 40.', questionType: 'Numerical', studentAnswer: '2.5', correctAnswer: '1.0 (±0.1)', points: 0, maxPoints: 10, correct: false },
    { questionNum: 5, questionText: 'Explain the concept of market equilibrium and its significance.', questionType: 'Essay', studentAnswer: 'Market equilibrium is when supply equals demand.', correctAnswer: 'Manual grading', points: 6, maxPoints: 20, correct: null },
    { questionNum: 6, questionText: 'Match the economic theory with its proponent.', questionType: 'Matching', studentAnswer: '2 of 4 matched', correctAnswer: 'All matched', points: 5, maxPoints: 10, correct: false },
    { questionNum: 7, questionText: 'The law of {blank} states that consumer satisfaction diminishes with each additional unit.', questionType: 'Fill in the Blank', studentAnswer: 'supply and demand', correctAnswer: 'diminishing marginal utility', points: 0, maxPoints: 10, correct: false },
    { questionNum: 8, questionText: 'Which of the following are characteristics of perfect competition?', questionType: 'Multiple Select', studentAnswer: 'A, C (2 of 4 correct)', correctAnswer: 'A, B, C, D', points: 5, maxPoints: 10, correct: false },
  ],
};

// ─── Status helpers ────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  passed: { label: 'Passed', color: '#059669', bg: 'rgba(5,150,105,0.06)' },
  failed: { label: 'Failed', color: '#DC2626', bg: 'rgba(220,38,38,0.06)' },
  not_attempted: { label: 'Not attempted', color: 'var(--text-tertiary)', bg: 'var(--bg-section)' },
  pending_grade: { label: 'Pending grade', color: '#D97706', bg: 'rgba(217,119,6,0.06)' },
};

// ─── Main Component ────────────────────────────────────────────────────────

export default function AssessmentAnalytics() {
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentResult | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'quiz' | 'assignment'>('all');

  // ─── Level 3: Quiz Attempt Review ──────────────────────────────────────
  if (selectedAssessment && selectedStudent) {
    const answers = QUIZ_ANSWERS[selectedStudent.id] || [];
    const totalEarned = answers.reduce((s, a) => s + a.points, 0);
    const totalMax = answers.reduce((s, a) => s + a.maxPoints, 0);

    return (
      <div style={{ padding: '28px 36px', maxWidth: 900 }}>
        {/* Back */}
        <button onClick={() => setSelectedStudent(null)} style={{
          display: 'flex', alignItems: 'center', gap: 5, padding: 0, marginBottom: 20,
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 13, fontWeight: 600, color: 'var(--blue-700)', fontFamily: 'var(--font-sans)',
        }}>
          <ChevronLeft size={15} /> Back to results
        </button>

        {/* Student header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '22px 26px', marginBottom: 24,
          background: 'linear-gradient(135deg, #030B22 0%, #06102E 50%, #213594 100%)',
          borderRadius: 14,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: 'rgba(255,255,255,0.12)', display: 'grid', placeItems: 'center',
              fontSize: 16, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)',
            }}>
              {selectedStudent.initials}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>{selectedStudent.name}</h2>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{selectedStudent.rollNo} · {selectedAssessment.title}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)', letterSpacing: '-0.03em' }}>{totalEarned}<span style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>/{totalMax}</span></div>
              <div style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Score</div>
            </div>
            {selectedStudent.timeTaken && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-mono)' }}>{selectedStudent.timeTaken}</div>
                <div style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Time</div>
              </div>
            )}
          </div>
        </div>

        {/* Answers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {answers.map((ans, idx) => (
            <div key={idx} style={{
              background: '#fff', borderRadius: 12,
              border: `1.5px solid ${ans.correct === true ? 'rgba(5,150,105,0.2)' : ans.correct === false ? 'rgba(220,38,38,0.15)' : 'rgba(217,119,6,0.15)'}`,
              overflow: 'hidden',
            }}>
              {/* Question header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 18px',
                background: ans.correct === true ? 'rgba(5,150,105,0.03)' : ans.correct === false ? 'rgba(220,38,38,0.02)' : 'rgba(217,119,6,0.03)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    width: 26, height: 26, borderRadius: 7, display: 'grid', placeItems: 'center',
                    fontSize: 11, fontWeight: 800, fontFamily: 'var(--font-mono)',
                    background: ans.correct === true ? 'rgba(5,150,105,0.1)' : ans.correct === false ? 'rgba(220,38,38,0.08)' : 'rgba(217,119,6,0.08)',
                    color: ans.correct === true ? '#059669' : ans.correct === false ? '#DC2626' : '#D97706',
                  }}>
                    {ans.questionNum}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{ans.questionText}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', background: 'var(--bg-section)', padding: '3px 8px', borderRadius: 4 }}>{ans.questionType}</span>
                  <span style={{
                    fontSize: 13, fontWeight: 800, fontFamily: 'var(--font-mono)',
                    color: ans.correct === true ? '#059669' : ans.correct === false ? '#DC2626' : '#D97706',
                  }}>
                    {ans.points}/{ans.maxPoints}
                  </span>
                  {ans.correct === true && <CheckCircle2 size={16} style={{ color: '#059669' }} />}
                  {ans.correct === false && <XCircle size={16} style={{ color: '#DC2626' }} />}
                  {ans.correct === null && <Clock size={16} style={{ color: '#D97706' }} />}
                </div>
              </div>

              {/* Answer detail */}
              <div style={{ padding: '14px 18px 14px 54px' }}>
                <div style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Student's answer</span>
                  <div style={{ fontSize: 13, color: 'var(--text-primary)', marginTop: 3, lineHeight: 1.5 }}>{ans.studentAnswer}</div>
                </div>
                {ans.correct === false && (
                  <div style={{ marginTop: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Correct answer</span>
                    <div style={{ fontSize: 13, color: '#059669', marginTop: 3, fontWeight: 500 }}>{ans.correctAnswer}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── Level 2: Assessment Results ─────────────────────────────────────────
  if (selectedAssessment) {
    const results = STUDENT_RESULTS[selectedAssessment.id] || [];
    const attempted = results.filter(r => r.status !== 'not_attempted');
    const passed = results.filter(r => r.status === 'passed');
    const failed = results.filter(r => r.status === 'failed');
    const isQuiz = selectedAssessment.type === 'quiz';

    return (
      <div style={{ padding: '28px 36px', maxWidth: 1000 }}>
        {/* Back */}
        <button onClick={() => setSelectedAssessment(null)} style={{
          display: 'flex', alignItems: 'center', gap: 5, padding: 0, marginBottom: 20,
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 13, fontWeight: 600, color: 'var(--blue-700)', fontFamily: 'var(--font-sans)',
        }}>
          <ChevronLeft size={15} /> All assessments
        </button>

        {/* Assessment header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 5,
              color: isQuiz ? '#7C3AED' : '#0E7490',
              background: isQuiz ? 'rgba(124,58,237,0.07)' : 'rgba(14,116,144,0.07)',
              textTransform: 'uppercase', letterSpacing: '0.04em',
            }}>
              {selectedAssessment.type}
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{selectedAssessment.courseCode} · {selectedAssessment.courseName}</span>
          </div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>
            {selectedAssessment.title}
          </h2>
        </div>

        {/* Stats cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
          {[
            { label: 'Average Score', value: `${selectedAssessment.avgScore}%`, icon: BarChart3, color: '#072FB5' },
            { label: 'Pass Rate', value: `${selectedAssessment.passRate}%`, icon: Award, color: '#059669' },
            { label: 'Attempted', value: `${attempted.length}/${results.length}`, icon: Users, color: '#8F3B00' },
            { label: 'Failed', value: `${failed.length}`, icon: AlertTriangle, color: failed.length > 0 ? '#DC2626' : 'var(--text-tertiary)' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: '#fff', border: '1px solid rgba(15,15,15,0.08)', borderRadius: 10, padding: '16px 18px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)' }}>{stat.label}</span>
                <stat.icon size={14} strokeWidth={2} style={{ color: stat.color, opacity: 0.6 }} />
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-display)', color: stat.color, letterSpacing: '-0.03em' }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Results table */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid rgba(15,15,15,0.08)', overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isQuiz ? '2fr 0.8fr 0.8fr 0.7fr 0.7fr 0.8fr' : '2fr 1fr 0.8fr 0.8fr 0.8fr',
            padding: '10px 20px', background: 'var(--bg-section)', borderBottom: '1px solid var(--border-subtle)',
          }}>
            {(isQuiz
              ? ['Student', 'Score', 'Status', 'Time', 'Attempts', 'Action']
              : ['Student', 'Submitted', 'Grade', 'Status', 'Action']
            ).map(h => (
              <span key={h} style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
            ))}
          </div>

          {/* Rows */}
          {results.map(student => {
            const sc = STATUS_CONFIG[student.status];
            return (
              <div key={student.id} style={{
                display: 'grid',
                gridTemplateColumns: isQuiz ? '2fr 0.8fr 0.8fr 0.7fr 0.7fr 0.8fr' : '2fr 1fr 0.8fr 0.8fr 0.8fr',
                padding: '12px 20px', alignItems: 'center',
                borderBottom: '1px solid var(--border-subtle)',
                transition: 'background 0.1s', cursor: 'default',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.01)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                {/* Student */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                    background: sc.bg, display: 'grid', placeItems: 'center',
                    fontSize: 10, fontWeight: 700, color: sc.color,
                  }}>
                    {student.initials}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{student.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{student.rollNo}</div>
                  </div>
                </div>

                {isQuiz ? (
                  <>
                    {/* Score */}
                    <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)', color: student.score !== null ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
                      {student.score !== null ? `${student.score}/${student.maxMarks}` : '—'}
                    </span>
                    {/* Status */}
                    <span style={{ fontSize: 11, fontWeight: 600, color: sc.color }}>{sc.label}</span>
                    {/* Time */}
                    <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>{student.timeTaken || '—'}</span>
                    {/* Attempts */}
                    <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>{student.attempts}</span>
                  </>
                ) : (
                  <>
                    {/* Submitted */}
                    <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{student.submittedAt || '—'}</span>
                    {/* Grade */}
                    <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)', color: student.score !== null ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
                      {student.score !== null ? `${student.score}/${student.maxMarks}` : '—'}
                    </span>
                    {/* Status */}
                    <span style={{ fontSize: 11, fontWeight: 600, color: sc.color }}>{sc.label}</span>
                  </>
                )}

                {/* Action */}
                {student.status !== 'not_attempted' ? (
                  <button onClick={() => setSelectedStudent(student)} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '5px 12px', fontSize: 11, fontWeight: 600,
                    color: 'var(--blue-700)', background: 'rgba(7,47,181,0.05)',
                    border: '1px solid rgba(7,47,181,0.12)', borderRadius: 6,
                    cursor: 'pointer', fontFamily: 'var(--font-sans)',
                    transition: 'background 0.1s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(7,47,181,0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(7,47,181,0.05)'; }}
                  >
                    Review <ChevronRight size={12} />
                  </button>
                ) : (
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>—</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── Level 1: Assessment List ────────────────────────────────────────────
  const filtered = ASSESSMENTS.filter(a => {
    if (typeFilter !== 'all' && a.type !== typeFilter) return false;
    if (searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase()) && !a.courseName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ padding: '28px 36px', maxWidth: 1000 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>Assessment Analytics</h2>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-tertiary)' }}>View submissions, results, and review individual attempts</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input type="text" placeholder="Search assessments..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{
            width: '100%', padding: '9px 14px 9px 34px', fontSize: 13,
            fontFamily: 'var(--font-sans)', color: 'var(--text-primary)',
            background: '#fff', border: '1px solid var(--border-subtle)',
            borderRadius: 8, outline: 'none', boxSizing: 'border-box',
          }} />
        </div>
        <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
          {(['all', 'quiz', 'assignment'] as const).map(t => (
            <button key={t} onClick={() => setTypeFilter(t)} style={{
              padding: '8px 16px', fontSize: 12, fontWeight: 600,
              color: typeFilter === t ? '#fff' : 'var(--text-tertiary)',
              background: typeFilter === t ? '#072FB5' : '#fff',
              border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)',
              textTransform: 'capitalize',
            }}>
              {t === 'all' ? 'All' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Assessment cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(assessment => {
          const isQuiz = assessment.type === 'quiz';
          const submissionRate = Math.round((assessment.submitted / assessment.totalStudents) * 100);
          return (
            <div key={assessment.id} onClick={() => setSelectedAssessment(assessment)} style={{
              background: '#fff', borderRadius: 12,
              border: '1px solid rgba(15,15,15,0.08)',
              padding: '18px 22px',
              cursor: 'pointer',
              transition: 'box-shadow 0.12s, border-color 0.12s',
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 3px 14px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = 'rgba(7,47,181,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(15,15,15,0.08)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  {/* Type + course */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 5,
                      color: isQuiz ? '#7C3AED' : '#0E7490',
                      background: isQuiz ? 'rgba(124,58,237,0.07)' : 'rgba(14,116,144,0.07)',
                    }}>
                      {isQuiz ? <HelpCircle size={10} /> : <ClipboardList size={10} />}
                      {assessment.type}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{assessment.courseCode} · {assessment.courseName}</span>
                  </div>
                  {/* Title */}
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>
                    {assessment.title}
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{assessment.submitted}/{assessment.totalStudents}</div>
                    <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Submitted</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-mono)', color: assessment.avgScore >= 60 ? '#059669' : '#D97706', letterSpacing: '-0.02em' }}>{assessment.avgScore}%</div>
                    <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Avg Score</div>
                  </div>
                  <ChevronRight size={16} style={{ color: 'var(--text-tertiary)' }} />
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, height: 4, background: 'var(--neutral-100)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${submissionRate}%`, background: submissionRate === 100 ? '#059669' : '#072FB5', borderRadius: 2, transition: 'width 0.3s ease' }} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', flexShrink: 0 }}>{submissionRate}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
