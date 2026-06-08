'use client';
import { useState } from 'react';
import { ChevronDown, ChevronRight, Search, GraduationCap, Award, BookOpen, Users, AlertTriangle } from 'lucide-react';
import { SEMESTERS, getSemesterGrades, SemesterId, CourseGrade, GradeStatus } from '@/lib/mockData';

const STATUS_FILTERS: { key: GradeStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'passed', label: 'Passed' },
  { key: 'failed', label: 'Failed' },
  { key: 'pending', label: 'Pending' },
];

function gradeColor(grade: string, percentage: number): string {
  if (grade === '-') return 'var(--text-tertiary)';
  if (percentage >= 85) return '#16A34A';
  if (percentage >= 70) return '#072FB5';
  if (percentage >= 50) return '#D97706';
  return '#DC2626';
}

function attendanceColor(pct: number): string {
  if (pct >= 85) return '#16A34A';
  if (pct >= 75) return '#D97706';
  return '#DC2626';
}

function StatCard({ icon: Icon, label, value, sub, accent }: { icon: React.ElementType; label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div style={{ flex: 1, background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: 'var(--bg-section)', display: 'grid', placeItems: 'center' }}>
          <Icon size={13} strokeWidth={2.2} style={{ color: 'var(--text-tertiary)' }} />
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontSize: 28, fontWeight: 800, color: accent || 'var(--text-primary)', fontFamily: 'var(--font-mono)', letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</span>
        {sub && <span style={{ fontSize: 13, color: 'var(--text-tertiary)', fontWeight: 500 }}>{sub}</span>}
      </div>
    </div>
  );
}

function CourseRow({ course, isExpanded, onToggle }: { course: CourseGrade; isExpanded: boolean; onToggle: () => void }) {
  const gc = gradeColor(course.grade, course.total.percentage);
  const ac = attendanceColor(course.attendance.percentage);
  const isPending = course.status === 'pending';

  return (
    <div style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      {/* Main row */}
      <div
        onClick={onToggle}
        style={{ display: 'grid', gridTemplateColumns: '2.2fr 0.6fr 0.6fr 0.6fr 0.7fr 0.5fr 32px', alignItems: 'center', padding: '14px 20px', cursor: 'pointer', transition: 'background 0.1s ease' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-section)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
      >
        {/* Course */}
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.01em', marginBottom: 2 }}>
            {course.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{course.code}</span>
            <span style={{ fontSize: 10, color: 'var(--text-tertiary)', opacity: 0.5 }}>{'·'}</span>
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{course.credits} credits</span>
          </div>
        </div>

        {/* Internal */}
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{course.internal.marks}</span>
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>/{course.internal.maxMarks}</span>
        </div>

        {/* End-Sem */}
        <div style={{ textAlign: 'center' }}>
          {isPending ? (
            <span style={{ fontSize: 11, fontWeight: 600, color: '#D97706' }}>Pending</span>
          ) : (
            <>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{course.endSem.marks}</span>
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>/{course.endSem.maxMarks}</span>
            </>
          )}
        </div>

        {/* Total */}
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{course.total.percentage}%</span>
        </div>

        {/* Grade */}
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: gc, fontFamily: 'var(--font-mono)' }}>{course.grade}</span>
        </div>

        {/* Attendance */}
        <div style={{ textAlign: 'center' }}>
          {course.attendance.hasLiveSessions ? (
            <span style={{ fontSize: 12, fontWeight: 700, color: ac, fontFamily: 'var(--font-mono)' }}>{course.attendance.percentage}%</span>
          ) : (
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>N/A</span>
          )}
        </div>

        {/* Expand chevron */}
        <div style={{ display: 'grid', placeItems: 'center', color: 'var(--text-tertiary)' }}>
          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </div>
      </div>

      {/* Expanded detail */}
      {isExpanded && (
        <div style={{ padding: '0 20px 20px', background: 'var(--bg-section)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, paddingTop: 16 }}>
            {/* Assignments */}
            <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '14px 16px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 10 }}>Assignments</div>
              {course.internal.assignments.length > 0 ? course.internal.assignments.map((a, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: i < course.internal.assignments.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 1 }}>{a.name}</div>
                    {a.date && <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{a.date}</div>}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                    {a.marks}<span style={{ color: 'var(--text-tertiary)', fontWeight: 500 }}>/{a.maxMarks}</span>
                  </div>
                </div>
              )) : <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>No assignments</div>}
            </div>

            {/* Quizzes */}
            <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '14px 16px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 10 }}>Quizzes</div>
              {course.internal.quizzes.map((q, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: i < course.internal.quizzes.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 1 }}>{q.name}</div>
                    {q.date && <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{q.date}</div>}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                    {q.marks}<span style={{ color: 'var(--text-tertiary)', fontWeight: 500 }}>/{q.maxMarks}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* End-Sem + Attendance */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '14px 16px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 10 }}>End-Semester Exam</div>
                {isPending ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 0' }}>
                    <AlertTriangle size={13} style={{ color: '#D97706' }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#D97706' }}>
                      {course.endSem.eligible ? 'Eligible - Exam pending' : 'Not eligible (attendance below 75%)'}
                    </span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, padding: '4px 0' }}>
                    <span style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{course.endSem.marks}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>/ {course.endSem.maxMarks}</span>
                  </div>
                )}
              </div>
              {course.attendance.hasLiveSessions && (
                <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '14px 16px' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 10 }}>Attendance</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
                    <span style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-mono)', color: attendanceColor(course.attendance.percentage) }}>{course.attendance.percentage}%</span>
                    <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{course.attendance.present}/{course.attendance.total} sessions</span>
                  </div>
                  <div style={{ height: 3, background: 'var(--border-subtle)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${course.attendance.percentage}%`, background: attendanceColor(course.attendance.percentage), borderRadius: 2 }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GradesView() {
  const defaultSem = SEMESTERS.find(s => s.isCurrent)?.id ?? SEMESTERS[0].id;
  const [selectedSem, setSelectedSem] = useState<SemesterId>(defaultSem);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<GradeStatus | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const data = getSemesterGrades(selectedSem);
  const filtered = data.courses.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusCounts = {
    all: data.courses.length,
    passed: data.courses.filter(c => c.status === 'passed').length,
    failed: data.courses.filter(c => c.status === 'failed').length,
    pending: data.courses.filter(c => c.status === 'pending').length,
  };

  return (
    <div style={{ padding: '24px 48px 64px', maxWidth: 1400, width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <span className="label">Academic Record</span>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', margin: 0 }}>
            Grades & Performance
          </h1>
          <div style={{ position: 'relative', display: 'inline-flex' }}>
            <select
              value={selectedSem}
              onChange={e => { setSelectedSem(e.target.value as SemesterId); setExpandedId(null); }}
              style={{ appearance: 'none', WebkitAppearance: 'none', padding: '6px 28px 6px 12px', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-sans)', color: 'var(--text-primary)', background: 'var(--bg-section)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', outline: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
            >
              {SEMESTERS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
            <ChevronDown size={13} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' }} />
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
        <StatCard icon={GraduationCap} label="SGPA" value={data.sgpa.toFixed(2)} sub="/ 10" accent={data.sgpa >= 8 ? '#16A34A' : data.sgpa >= 6 ? 'var(--text-primary)' : '#DC2626'} />
        <StatCard icon={Award} label="CGPA" value={data.cgpa.toFixed(2)} sub="/ 10" />
        <StatCard icon={BookOpen} label="Credits" value={String(data.creditsEarned)} sub={'/ ' + data.totalCredits} />
        <StatCard icon={Users} label="Avg Attendance" value={data.avgAttendance + '%'} accent={attendanceColor(data.avgAttendance)} />
      </div>

      {/* Course table */}
      <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        {/* Table toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          {/* Search */}
          <div style={{ position: 'relative', width: 240 }}>
            <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              type="text" placeholder="Search courses..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '7px 10px 7px 30px', fontSize: 12, fontFamily: 'var(--font-sans)', fontWeight: 500, color: 'var(--text-primary)', background: 'var(--bg-section)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--text-tertiary)'; e.currentTarget.style.background = '#fff'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.background = 'var(--bg-section)'; }}
            />
          </div>
          {/* Filters */}
          <div style={{ display: 'flex', gap: 6 }}>
            {STATUS_FILTERS.map(f => {
              const active = statusFilter === f.key;
              const count = statusCounts[f.key];
              return (
                <button key={f.key} onClick={() => setStatusFilter(f.key)}
                  style={{ padding: '5px 12px', fontSize: 11.5, fontWeight: 600, fontFamily: 'var(--font-sans)', background: active ? 'var(--text-primary)' : 'transparent', color: active ? '#fff' : 'var(--text-tertiary)', border: active ? 'none' : '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'all 0.1s ease' }}
                >
                  {f.label} {count > 0 && <span style={{ opacity: 0.7, marginLeft: 2 }}>{count}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 0.6fr 0.6fr 0.6fr 0.7fr 0.5fr 32px', padding: '10px 20px', background: 'var(--bg-section)', borderBottom: '1px solid var(--border-subtle)' }}>
          {['Course', 'Internal', 'End-Sem', 'Total', 'Grade', 'Attend.', ''].map(h => (
            <div key={h} style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase', textAlign: h === 'Course' || h === '' ? 'left' : 'center' }}>{h}</div>
          ))}
        </div>

        {/* Rows */}
        {filtered.length > 0 ? filtered.map(course => (
          <CourseRow
            key={course.id}
            course={course}
            isExpanded={expandedId === course.id}
            onToggle={() => setExpandedId(expandedId === course.id ? null : course.id)}
          />
        )) : (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>No courses found</div>
            <div style={{ fontSize: 12, fontWeight: 500 }}>Try adjusting your search or filter</div>
          </div>
        )}
      </div>
    </div>
  );
}
