// ─── COORDINATOR / PROGRAMME COORDINATOR MOCK DATA ──────────────────────────

export const COORDINATOR = {
  name: 'Dr. Vikram',
  fullName: 'Dr. Vikram Rao',
  initials: 'VR',
  designation: 'Programme Coordinator',
  department: 'School of Management',
  email: 'vikram.rao@university.edu',
};

// ─── Faculty in the programme ───────────────────────────────────────────────

export interface FacultyMember {
  id: string;
  name: string;
  initials: string;
  designation: string;
  specialization: string;
  courses: string[];
  studentsAssigned: number;
  pendingGrading: number;
  forumReplies7d: number;
  lastActive: string;
  avgGradingTurnaround: string;
  status: 'active' | 'on_leave';
}

export const FACULTY: FacultyMember[] = [
  { id: 'f1', name: 'Prof. Kavya Menon', initials: 'KM', designation: 'Associate Professor', specialization: 'Communication Studies', courses: ['MBA-102', 'MBA-107'], studentsAssigned: 180, pendingGrading: 24, forumReplies7d: 18, lastActive: '2h ago', avgGradingTurnaround: '2.1 days', status: 'active' },
  { id: 'f2', name: 'Dr. Priya Nair', initials: 'PN', designation: 'Assistant Professor', specialization: 'Financial Economics', courses: ['MBA-101', 'MBA-103'], studentsAssigned: 210, pendingGrading: 8, forumReplies7d: 12, lastActive: '1h ago', avgGradingTurnaround: '1.4 days', status: 'active' },
  { id: 'f3', name: 'Prof. Arjun Das', initials: 'AD', designation: 'Professor', specialization: 'Organizational Behaviour', courses: ['MBA-104'], studentsAssigned: 95, pendingGrading: 42, forumReplies7d: 3, lastActive: '3d ago', avgGradingTurnaround: '5.2 days', status: 'active' },
  { id: 'f4', name: 'Dr. Sanjay Gupta', initials: 'SG', designation: 'Assistant Professor', specialization: 'Business Statistics', courses: ['MBA-105'], studentsAssigned: 95, pendingGrading: 0, forumReplies7d: 9, lastActive: '4h ago', avgGradingTurnaround: '1.8 days', status: 'active' },
  { id: 'f5', name: 'Prof. Meera Krishnan', initials: 'MK', designation: 'Associate Professor', specialization: 'Business Law', courses: ['MBA-106'], studentsAssigned: 95, pendingGrading: 5, forumReplies7d: 6, lastActive: '1d ago', avgGradingTurnaround: '3.0 days', status: 'on_leave' },
];

// ─── Programme-level course data ────────────────────────────────────────────

export interface CoordinatorCourse {
  id: string;
  code: string;
  title: string;
  credits: number;
  semester: number;
  faculty: string;
  facultyId: string;
  enrolled: number;
  avgEngagement: number;
  avgGrade: number;
  contentReadiness: number; // % of 4-quadrant content uploaded
  status: 'active' | 'upcoming' | 'archived';
  quadrantStatus: {
    live_session: { total: number; conducted: number };
    e_tutorial: { total: number; uploaded: number };
    e_content: { total: number; uploaded: number };
    discussion: { total: number; active: number };
    assessment: { total: number; published: number };
  };
}

export const COORDINATOR_COURSES: CoordinatorCourse[] = [
  {
    id: 'c1', code: 'MBA-101', title: 'Managerial Economics', credits: 4, semester: 1,
    faculty: 'Dr. Priya Nair', facultyId: 'f2', enrolled: 95, avgEngagement: 72, avgGrade: 74,
    contentReadiness: 92,
    status: 'active',
    quadrantStatus: {
      live_session: { total: 12, conducted: 8 },
      e_tutorial: { total: 20, uploaded: 18 },
      e_content: { total: 15, uploaded: 15 },
      discussion: { total: 10, active: 7 },
      assessment: { total: 8, published: 8 },
    },
  },
  {
    id: 'c2', code: 'MBA-102', title: 'Managerial Communication', credits: 3, semester: 1,
    faculty: 'Prof. Kavya Menon', facultyId: 'f1', enrolled: 95, avgEngagement: 68, avgGrade: 69,
    contentReadiness: 85,
    status: 'active',
    quadrantStatus: {
      live_session: { total: 10, conducted: 6 },
      e_tutorial: { total: 16, uploaded: 14 },
      e_content: { total: 12, uploaded: 10 },
      discussion: { total: 8, active: 5 },
      assessment: { total: 6, published: 5 },
    },
  },
  {
    id: 'c3', code: 'MBA-103', title: 'Financial Accounting & Analysis', credits: 4, semester: 1,
    faculty: 'Dr. Priya Nair', facultyId: 'f2', enrolled: 95, avgEngagement: 81, avgGrade: 82,
    contentReadiness: 100,
    status: 'active',
    quadrantStatus: {
      live_session: { total: 12, conducted: 10 },
      e_tutorial: { total: 22, uploaded: 22 },
      e_content: { total: 18, uploaded: 18 },
      discussion: { total: 12, active: 10 },
      assessment: { total: 10, published: 10 },
    },
  },
  {
    id: 'c4', code: 'MBA-104', title: 'Organizational Behaviour', credits: 3, semester: 1,
    faculty: 'Prof. Arjun Das', facultyId: 'f3', enrolled: 95, avgEngagement: 45, avgGrade: 58,
    contentReadiness: 60,
    status: 'active',
    quadrantStatus: {
      live_session: { total: 10, conducted: 4 },
      e_tutorial: { total: 14, uploaded: 8 },
      e_content: { total: 10, uploaded: 6 },
      discussion: { total: 8, active: 2 },
      assessment: { total: 6, published: 4 },
    },
  },
  {
    id: 'c5', code: 'MBA-105', title: 'Business Statistics', credits: 4, semester: 1,
    faculty: 'Dr. Sanjay Gupta', facultyId: 'f4', enrolled: 95, avgEngagement: 76, avgGrade: 75,
    contentReadiness: 95,
    status: 'active',
    quadrantStatus: {
      live_session: { total: 12, conducted: 9 },
      e_tutorial: { total: 20, uploaded: 19 },
      e_content: { total: 16, uploaded: 16 },
      discussion: { total: 10, active: 8 },
      assessment: { total: 8, published: 8 },
    },
  },
  {
    id: 'c6', code: 'MBA-106', title: 'Business Law & Ethics', credits: 2, semester: 1,
    faculty: 'Prof. Meera Krishnan', facultyId: 'f5', enrolled: 95, avgEngagement: 62, avgGrade: 64,
    contentReadiness: 78,
    status: 'active',
    quadrantStatus: {
      live_session: { total: 8, conducted: 5 },
      e_tutorial: { total: 10, uploaded: 8 },
      e_content: { total: 8, uploaded: 6 },
      discussion: { total: 6, active: 3 },
      assessment: { total: 4, published: 3 },
    },
  },
];

// ─── Programme stats ────────────────────────────────────────────────────────

export interface ProgrammeStats {
  totalStudents: number;
  activeToday: number;
  avgEngagement: number;
  belowThreshold: number; // students below 75%
  totalFaculty: number;
  pendingGrading: number;
  avgAttendance: number;
  coursesActive: number;
  coursesTotal: number;
  contentReadiness: number;
}

export function getProgrammeStats(): ProgrammeStats {
  return {
    totalStudents: 95,
    activeToday: 67,
    avgEngagement: 67,
    belowThreshold: 18,
    totalFaculty: FACULTY.length,
    pendingGrading: FACULTY.reduce((s, f) => s + f.pendingGrading, 0),
    avgAttendance: 84,
    coursesActive: COORDINATOR_COURSES.filter(c => c.status === 'active').length,
    coursesTotal: COORDINATOR_COURSES.length,
    contentReadiness: Math.round(COORDINATOR_COURSES.reduce((s, c) => s + c.contentReadiness, 0) / COORDINATOR_COURSES.length),
  };
}

// ─── Student overview data ──────────────────────────────────────────────────

export interface StudentOverview {
  id: string;
  name: string;
  initials: string;
  rollNo: string;
  semester: number;
  cgpa: number;
  engagement: number;
  attendance: number;
  status: 'on_track' | 'at_risk' | 'critical' | 'detained';
  lastActive: string;
}

export const STUDENTS: StudentOverview[] = [
  { id: 's1', name: 'Arjun Mehta', initials: 'AM', rollNo: 'MBA-2024-001', semester: 1, cgpa: 7.59, engagement: 42, attendance: 88, status: 'at_risk', lastActive: '2h ago' },
  { id: 's2', name: 'Priya Sharma', initials: 'PS', rollNo: 'MBA-2024-002', semester: 1, cgpa: 8.92, engagement: 91, attendance: 96, status: 'on_track', lastActive: '30m ago' },
  { id: 's3', name: 'Rahul Verma', initials: 'RV', rollNo: 'MBA-2024-003', semester: 1, cgpa: 6.20, engagement: 38, attendance: 72, status: 'critical', lastActive: '5d ago' },
  { id: 's4', name: 'Ananya Iyer', initials: 'AI', rollNo: 'MBA-2024-004', semester: 1, cgpa: 7.85, engagement: 78, attendance: 90, status: 'on_track', lastActive: '1h ago' },
  { id: 's5', name: 'Karthik Nair', initials: 'KN', rollNo: 'MBA-2024-005', semester: 1, cgpa: 8.10, engagement: 82, attendance: 92, status: 'on_track', lastActive: '3h ago' },
  { id: 's6', name: 'Neha Patel', initials: 'NP', rollNo: 'MBA-2024-006', semester: 1, cgpa: 5.80, engagement: 28, attendance: 64, status: 'critical', lastActive: '12d ago' },
  { id: 's7', name: 'Vikash Kumar', initials: 'VK', rollNo: 'MBA-2024-007', semester: 1, cgpa: 7.40, engagement: 65, attendance: 80, status: 'on_track', lastActive: '6h ago' },
  { id: 's8', name: 'Sneha Reddy', initials: 'SR', rollNo: 'MBA-2024-008', semester: 1, cgpa: 9.10, engagement: 95, attendance: 98, status: 'on_track', lastActive: '15m ago' },
  { id: 's9', name: 'Amit Singh', initials: 'AS', rollNo: 'MBA-2024-009', semester: 1, cgpa: 6.50, engagement: 51, attendance: 76, status: 'at_risk', lastActive: '2d ago' },
  { id: 's10', name: 'Divya Joshi', initials: 'DJ', rollNo: 'MBA-2024-010', semester: 1, cgpa: 7.70, engagement: 74, attendance: 86, status: 'on_track', lastActive: '4h ago' },
];

// ─── Alerts for dashboard ───────────────────────────────────────────────────

export interface CoordinatorAlert {
  id: string;
  type: 'warning' | 'danger' | 'info';
  title: string;
  description: string;
  timeAgo: string;
  actionLabel?: string;
  actionHref?: string;
}

export const ALERTS: CoordinatorAlert[] = [
  { id: 'a1', type: 'danger', title: '18 students below 75% engagement', description: 'These students will be ineligible for end-sem exams if engagement does not improve.', timeAgo: 'Updated 1h ago', actionLabel: 'View students' },
  { id: 'a2', type: 'warning', title: 'MBA-104: 42 assignments pending grading', description: 'Prof. Arjun Das has a grading backlog of 5.2 days average turnaround.', timeAgo: '3d overdue', actionLabel: 'View course' },
  { id: 'a3', type: 'warning', title: 'MBA-104: Content readiness at 60%', description: 'Only 60% of 4-quadrant content has been uploaded for Organizational Behaviour.', timeAgo: 'Since course start', actionLabel: 'Review curriculum' },
  { id: 'a4', type: 'info', title: 'End-semester exams in 4 weeks', description: 'Exam schedule needs to be finalized. 2 courses still need question papers.', timeAgo: '28 days left', actionLabel: 'View exams' },
  { id: 'a5', type: 'warning', title: 'Prof. Meera Krishnan on leave', description: 'MBA-106 Business Law needs substitute faculty or deadline adjustments.', timeAgo: 'Since 2d ago' },
];

// ─── Programme / Batch hierarchy ────────────────────────────────────────────

export type ProgrammeType = 'UG' | 'PG' | 'Diploma' | 'Certificate';
export type ProgrammeStatus = 'active' | 'upcoming' | 'archived';

export interface SemesterData {
  id: string;
  number: number;
  label: string;
  credits: number;
  courses: CoordinatorCourse[];
  status: 'active' | 'upcoming' | 'completed';
}

export interface ProgrammeBatch {
  id: string;
  name: string;
  code: string;
  batchYear: number;
  shortLabel: string;
  type: ProgrammeType;
  status: ProgrammeStatus;
  totalSemesters: number;
  currentSemester: number;
  totalCredits: number;
  students: number;
  avgEngagement: number;
  avgGrade: number;
  contentReadiness: number;
  faculty: number;
  semesters: SemesterData[];
  color: string;
  startDate: string;
  endDate: string;
}

const TYPE_COLORS: Record<ProgrammeType, string> = { UG: '#0DA88F', PG: '#072FB5', Diploma: '#D97706', Certificate: '#7C3AED' };

export const PROGRAMME_BATCHES: ProgrammeBatch[] = [
  {
    id: 'mba-26', name: 'Master of Business Administration', code: 'MBA', batchYear: 2026, shortLabel: 'MBA-26',
    type: 'PG', status: 'active', totalSemesters: 4, currentSemester: 1, totalCredits: 80,
    students: 95, avgEngagement: 67, avgGrade: 72, contentReadiness: 85, faculty: 5,
    color: TYPE_COLORS.PG, startDate: 'Aug 2025', endDate: 'Jul 2027',
    semesters: [
      { id: 'mba26-s1', number: 1, label: 'Semester 1', credits: 20, status: 'active', courses: COORDINATOR_COURSES },
      { id: 'mba26-s2', number: 2, label: 'Semester 2', credits: 22, status: 'upcoming', courses: [
        { id: 'c201', code: 'MBA-201', title: 'Marketing Management', credits: 4, semester: 2, faculty: 'Dr. Ritu Agarwal', facultyId: 'f6', enrolled: 0, avgEngagement: 0, avgGrade: 0, contentReadiness: 42, status: 'upcoming', quadrantStatus: { live_session: { total: 12, conducted: 0 }, e_tutorial: { total: 18, uploaded: 8 }, e_content: { total: 14, uploaded: 6 }, discussion: { total: 8, active: 0 }, assessment: { total: 6, published: 2 } } },
        { id: 'c202', code: 'MBA-202', title: 'Human Resource Management', credits: 3, semester: 2, faculty: 'Prof. Arjun Das', facultyId: 'f3', enrolled: 0, avgEngagement: 0, avgGrade: 0, contentReadiness: 30, status: 'upcoming', quadrantStatus: { live_session: { total: 10, conducted: 0 }, e_tutorial: { total: 14, uploaded: 4 }, e_content: { total: 10, uploaded: 3 }, discussion: { total: 6, active: 0 }, assessment: { total: 5, published: 1 } } },
        { id: 'c203', code: 'MBA-203', title: 'Operations Research', credits: 4, semester: 2, faculty: 'Dr. Sanjay Gupta', facultyId: 'f4', enrolled: 0, avgEngagement: 0, avgGrade: 0, contentReadiness: 55, status: 'upcoming', quadrantStatus: { live_session: { total: 12, conducted: 0 }, e_tutorial: { total: 20, uploaded: 11 }, e_content: { total: 16, uploaded: 9 }, discussion: { total: 10, active: 0 }, assessment: { total: 8, published: 4 } } },
        { id: 'c204', code: 'MBA-204', title: 'Corporate Finance', credits: 4, semester: 2, faculty: 'Dr. Priya Nair', facultyId: 'f2', enrolled: 0, avgEngagement: 0, avgGrade: 0, contentReadiness: 68, status: 'upcoming', quadrantStatus: { live_session: { total: 12, conducted: 0 }, e_tutorial: { total: 22, uploaded: 15 }, e_content: { total: 18, uploaded: 12 }, discussion: { total: 12, active: 0 }, assessment: { total: 10, published: 7 } } },
        { id: 'c205', code: 'MBA-205', title: 'Business Research Methods', credits: 3, semester: 2, faculty: 'Prof. Kavya Menon', facultyId: 'f1', enrolled: 0, avgEngagement: 0, avgGrade: 0, contentReadiness: 20, status: 'upcoming', quadrantStatus: { live_session: { total: 8, conducted: 0 }, e_tutorial: { total: 12, uploaded: 2 }, e_content: { total: 8, uploaded: 2 }, discussion: { total: 6, active: 0 }, assessment: { total: 4, published: 0 } } },
      ]},
      { id: 'mba26-s3', number: 3, label: 'Semester 3', credits: 20, status: 'upcoming', courses: [] },
      { id: 'mba26-s4', number: 4, label: 'Semester 4', credits: 18, status: 'upcoming', courses: [] },
    ],
  },
  {
    id: 'mba-25', name: 'Master of Business Administration', code: 'MBA', batchYear: 2025, shortLabel: 'MBA-25',
    type: 'PG', status: 'active', totalSemesters: 4, currentSemester: 3, totalCredits: 80,
    students: 110, avgEngagement: 78, avgGrade: 76, contentReadiness: 94, faculty: 6,
    color: TYPE_COLORS.PG, startDate: 'Aug 2024', endDate: 'Jul 2026',
    semesters: [
      { id: 'mba25-s1', number: 1, label: 'Semester 1', credits: 20, status: 'completed', courses: [
        { id: 'c301', code: 'MBA-101', title: 'Managerial Economics', credits: 4, semester: 1, faculty: 'Dr. Priya Nair', facultyId: 'f2', enrolled: 110, avgEngagement: 82, avgGrade: 78, contentReadiness: 100, status: 'active', quadrantStatus: { live_session: { total: 12, conducted: 12 }, e_tutorial: { total: 20, uploaded: 20 }, e_content: { total: 15, uploaded: 15 }, discussion: { total: 10, active: 10 }, assessment: { total: 8, published: 8 } } },
        { id: 'c302', code: 'MBA-102', title: 'Managerial Communication', credits: 3, semester: 1, faculty: 'Prof. Kavya Menon', facultyId: 'f1', enrolled: 110, avgEngagement: 79, avgGrade: 74, contentReadiness: 100, status: 'active', quadrantStatus: { live_session: { total: 10, conducted: 10 }, e_tutorial: { total: 16, uploaded: 16 }, e_content: { total: 12, uploaded: 12 }, discussion: { total: 8, active: 8 }, assessment: { total: 6, published: 6 } } },
      ]},
      { id: 'mba25-s2', number: 2, label: 'Semester 2', credits: 22, status: 'completed', courses: [] },
      { id: 'mba25-s3', number: 3, label: 'Semester 3', credits: 20, status: 'active', courses: [
        { id: 'c303', code: 'MBA-301', title: 'Strategic Management', credits: 4, semester: 3, faculty: 'Dr. Ritu Agarwal', facultyId: 'f6', enrolled: 108, avgEngagement: 74, avgGrade: 71, contentReadiness: 88, status: 'active', quadrantStatus: { live_session: { total: 12, conducted: 7 }, e_tutorial: { total: 20, uploaded: 18 }, e_content: { total: 16, uploaded: 14 }, discussion: { total: 10, active: 6 }, assessment: { total: 8, published: 7 } } },
        { id: 'c304', code: 'MBA-302', title: 'International Business', credits: 3, semester: 3, faculty: 'Prof. Kavya Menon', facultyId: 'f1', enrolled: 108, avgEngagement: 80, avgGrade: 77, contentReadiness: 95, status: 'active', quadrantStatus: { live_session: { total: 10, conducted: 6 }, e_tutorial: { total: 16, uploaded: 15 }, e_content: { total: 12, uploaded: 12 }, discussion: { total: 8, active: 5 }, assessment: { total: 6, published: 6 } } },
        { id: 'c305', code: 'MBA-303', title: 'Business Analytics', credits: 4, semester: 3, faculty: 'Dr. Sanjay Gupta', facultyId: 'f4', enrolled: 108, avgEngagement: 85, avgGrade: 80, contentReadiness: 100, status: 'active', quadrantStatus: { live_session: { total: 12, conducted: 8 }, e_tutorial: { total: 22, uploaded: 22 }, e_content: { total: 18, uploaded: 18 }, discussion: { total: 12, active: 9 }, assessment: { total: 10, published: 10 } } },
      ]},
      { id: 'mba25-s4', number: 4, label: 'Semester 4', credits: 18, status: 'upcoming', courses: [] },
    ],
  },
  {
    id: 'bca-26', name: 'Bachelor of Computer Applications', code: 'BCA', batchYear: 2026, shortLabel: 'BCA-26',
    type: 'UG', status: 'active', totalSemesters: 6, currentSemester: 2, totalCredits: 132,
    students: 120, avgEngagement: 71, avgGrade: 68, contentReadiness: 78, faculty: 8,
    color: TYPE_COLORS.UG, startDate: 'Jul 2025', endDate: 'Jun 2028',
    semesters: [
      { id: 'bca26-s1', number: 1, label: 'Semester 1', credits: 22, status: 'completed', courses: [
        { id: 'c401', code: 'BCA-101', title: 'Programming Fundamentals (C)', credits: 4, semester: 1, faculty: 'Dr. Ankit Sharma', facultyId: 'f7', enrolled: 120, avgEngagement: 75, avgGrade: 70, contentReadiness: 100, status: 'active', quadrantStatus: { live_session: { total: 14, conducted: 14 }, e_tutorial: { total: 24, uploaded: 24 }, e_content: { total: 20, uploaded: 20 }, discussion: { total: 12, active: 12 }, assessment: { total: 10, published: 10 } } },
        { id: 'c402', code: 'BCA-102', title: 'Mathematics for Computing', credits: 4, semester: 1, faculty: 'Prof. Deepa Iyer', facultyId: 'f8', enrolled: 120, avgEngagement: 62, avgGrade: 64, contentReadiness: 100, status: 'active', quadrantStatus: { live_session: { total: 12, conducted: 12 }, e_tutorial: { total: 20, uploaded: 20 }, e_content: { total: 16, uploaded: 16 }, discussion: { total: 8, active: 8 }, assessment: { total: 8, published: 8 } } },
      ]},
      { id: 'bca26-s2', number: 2, label: 'Semester 2', credits: 22, status: 'active', courses: [
        { id: 'c403', code: 'BCA-201', title: 'Data Structures & Algorithms', credits: 4, semester: 2, faculty: 'Dr. Ankit Sharma', facultyId: 'f7', enrolled: 118, avgEngagement: 78, avgGrade: 72, contentReadiness: 82, status: 'active', quadrantStatus: { live_session: { total: 14, conducted: 8 }, e_tutorial: { total: 22, uploaded: 18 }, e_content: { total: 18, uploaded: 15 }, discussion: { total: 10, active: 6 }, assessment: { total: 8, published: 7 } } },
        { id: 'c404', code: 'BCA-202', title: 'Database Management Systems', credits: 4, semester: 2, faculty: 'Prof. Suresh Kumar', facultyId: 'f9', enrolled: 118, avgEngagement: 70, avgGrade: 66, contentReadiness: 75, status: 'active', quadrantStatus: { live_session: { total: 12, conducted: 6 }, e_tutorial: { total: 20, uploaded: 15 }, e_content: { total: 14, uploaded: 10 }, discussion: { total: 8, active: 4 }, assessment: { total: 6, published: 5 } } },
        { id: 'c405', code: 'BCA-203', title: 'Web Technologies', credits: 3, semester: 2, faculty: 'Dr. Ankit Sharma', facultyId: 'f7', enrolled: 118, avgEngagement: 82, avgGrade: 75, contentReadiness: 90, status: 'active', quadrantStatus: { live_session: { total: 10, conducted: 6 }, e_tutorial: { total: 18, uploaded: 16 }, e_content: { total: 12, uploaded: 11 }, discussion: { total: 8, active: 5 }, assessment: { total: 6, published: 6 } } },
      ]},
      { id: 'bca26-s3', number: 3, label: 'Semester 3', credits: 22, status: 'upcoming', courses: [] },
      { id: 'bca26-s4', number: 4, label: 'Semester 4', credits: 22, status: 'upcoming', courses: [] },
      { id: 'bca26-s5', number: 5, label: 'Semester 5', credits: 22, status: 'upcoming', courses: [] },
      { id: 'bca26-s6', number: 6, label: 'Semester 6', credits: 22, status: 'upcoming', courses: [] },
    ],
  },
  {
    id: 'mca-26', name: 'Master of Computer Applications', code: 'MCA', batchYear: 2026, shortLabel: 'MCA-26',
    type: 'PG', status: 'upcoming', totalSemesters: 4, currentSemester: 0, totalCredits: 96,
    students: 0, avgEngagement: 0, avgGrade: 0, contentReadiness: 12, faculty: 0,
    color: TYPE_COLORS.PG, startDate: 'Aug 2026', endDate: 'Jul 2028',
    semesters: [
      { id: 'mca26-s1', number: 1, label: 'Semester 1', credits: 24, status: 'upcoming', courses: [
        { id: 'c501', code: 'MCA-101', title: 'Advanced Programming (Java)', credits: 4, semester: 1, faculty: 'TBD', facultyId: '', enrolled: 0, avgEngagement: 0, avgGrade: 0, contentReadiness: 15, status: 'upcoming', quadrantStatus: { live_session: { total: 14, conducted: 0 }, e_tutorial: { total: 24, uploaded: 4 }, e_content: { total: 20, uploaded: 3 }, discussion: { total: 12, active: 0 }, assessment: { total: 10, published: 1 } } },
        { id: 'c502', code: 'MCA-102', title: 'Computer Networks', credits: 4, semester: 1, faculty: 'TBD', facultyId: '', enrolled: 0, avgEngagement: 0, avgGrade: 0, contentReadiness: 8, status: 'upcoming', quadrantStatus: { live_session: { total: 12, conducted: 0 }, e_tutorial: { total: 20, uploaded: 2 }, e_content: { total: 16, uploaded: 1 }, discussion: { total: 8, active: 0 }, assessment: { total: 8, published: 0 } } },
      ]},
      { id: 'mca26-s2', number: 2, label: 'Semester 2', credits: 24, status: 'upcoming', courses: [] },
      { id: 'mca26-s3', number: 3, label: 'Semester 3', credits: 24, status: 'upcoming', courses: [] },
      { id: 'mca26-s4', number: 4, label: 'Semester 4', credits: 24, status: 'upcoming', courses: [] },
    ],
  },
  {
    id: 'btech-26', name: 'B.Tech Computer Science & Engineering', code: 'B.Tech CSE', batchYear: 2026, shortLabel: 'B.Tech CSE-26',
    type: 'UG', status: 'active', totalSemesters: 8, currentSemester: 2, totalCredits: 160,
    students: 180, avgEngagement: 73, avgGrade: 70, contentReadiness: 81, faculty: 12,
    color: TYPE_COLORS.UG, startDate: 'Jul 2025', endDate: 'Jun 2029',
    semesters: [
      { id: 'bt26-s1', number: 1, label: 'Semester 1', credits: 20, status: 'completed', courses: [
        { id: 'c601', code: 'CSE-101', title: 'Engineering Mathematics I', credits: 4, semester: 1, faculty: 'Dr. Ramesh Pandey', facultyId: 'f10', enrolled: 180, avgEngagement: 68, avgGrade: 65, contentReadiness: 100, status: 'active', quadrantStatus: { live_session: { total: 14, conducted: 14 }, e_tutorial: { total: 22, uploaded: 22 }, e_content: { total: 18, uploaded: 18 }, discussion: { total: 10, active: 10 }, assessment: { total: 8, published: 8 } } },
        { id: 'c602', code: 'CSE-102', title: 'Physics for Engineers', credits: 3, semester: 1, faculty: 'Prof. Lata Mishra', facultyId: 'f11', enrolled: 180, avgEngagement: 72, avgGrade: 68, contentReadiness: 100, status: 'active', quadrantStatus: { live_session: { total: 12, conducted: 12 }, e_tutorial: { total: 18, uploaded: 18 }, e_content: { total: 14, uploaded: 14 }, discussion: { total: 8, active: 8 }, assessment: { total: 6, published: 6 } } },
        { id: 'c603', code: 'CSE-103', title: 'Introduction to Programming', credits: 4, semester: 1, faculty: 'Dr. Ankit Sharma', facultyId: 'f7', enrolled: 180, avgEngagement: 80, avgGrade: 74, contentReadiness: 100, status: 'active', quadrantStatus: { live_session: { total: 14, conducted: 14 }, e_tutorial: { total: 24, uploaded: 24 }, e_content: { total: 20, uploaded: 20 }, discussion: { total: 12, active: 12 }, assessment: { total: 10, published: 10 } } },
      ]},
      { id: 'bt26-s2', number: 2, label: 'Semester 2', credits: 20, status: 'active', courses: [
        { id: 'c604', code: 'CSE-201', title: 'Engineering Mathematics II', credits: 4, semester: 2, faculty: 'Dr. Ramesh Pandey', facultyId: 'f10', enrolled: 178, avgEngagement: 65, avgGrade: 62, contentReadiness: 78, status: 'active', quadrantStatus: { live_session: { total: 14, conducted: 7 }, e_tutorial: { total: 22, uploaded: 17 }, e_content: { total: 18, uploaded: 14 }, discussion: { total: 10, active: 5 }, assessment: { total: 8, published: 6 } } },
        { id: 'c605', code: 'CSE-202', title: 'Object-Oriented Programming', credits: 4, semester: 2, faculty: 'Dr. Ankit Sharma', facultyId: 'f7', enrolled: 178, avgEngagement: 79, avgGrade: 73, contentReadiness: 85, status: 'active', quadrantStatus: { live_session: { total: 14, conducted: 8 }, e_tutorial: { total: 22, uploaded: 19 }, e_content: { total: 18, uploaded: 15 }, discussion: { total: 10, active: 7 }, assessment: { total: 8, published: 7 } } },
        { id: 'c606', code: 'CSE-203', title: 'Digital Logic Design', credits: 3, semester: 2, faculty: 'Prof. Lata Mishra', facultyId: 'f11', enrolled: 178, avgEngagement: 71, avgGrade: 67, contentReadiness: 80, status: 'active', quadrantStatus: { live_session: { total: 10, conducted: 5 }, e_tutorial: { total: 16, uploaded: 13 }, e_content: { total: 12, uploaded: 10 }, discussion: { total: 8, active: 4 }, assessment: { total: 6, published: 5 } } },
      ]},
      { id: 'bt26-s3', number: 3, label: 'Semester 3', credits: 20, status: 'upcoming', courses: [] },
      { id: 'bt26-s4', number: 4, label: 'Semester 4', credits: 20, status: 'upcoming', courses: [] },
      { id: 'bt26-s5', number: 5, label: 'Semester 5', credits: 20, status: 'upcoming', courses: [] },
      { id: 'bt26-s6', number: 6, label: 'Semester 6', credits: 20, status: 'upcoming', courses: [] },
      { id: 'bt26-s7', number: 7, label: 'Semester 7', credits: 20, status: 'upcoming', courses: [] },
      { id: 'bt26-s8', number: 8, label: 'Semester 8', credits: 20, status: 'upcoming', courses: [] },
    ],
  },
];

export function getProgrammeTypeColor(type: ProgrammeType): string { return TYPE_COLORS[type]; }

// ─── Activity types for the course editor ───────────────────────────────────

export type EditorActivityType = 'video' | 'page' | 'pdf' | 'quiz' | 'assignment' | 'forum_topic' | 'live_session';

export interface ActivityTypeOption {
  type: EditorActivityType;
  label: string;
  description: string;
  quadrant: string;
  color: string;
}

export const ACTIVITY_TYPE_OPTIONS: ActivityTypeOption[] = [
  { type: 'video', label: 'Video Lecture', description: 'Upload or link a video lecture', quadrant: 'E-Tutorial', color: '#8F3B00' },
  { type: 'page', label: 'Text Content', description: 'Create rich text learning material', quadrant: 'E-Content', color: '#7C3AED' },
  { type: 'pdf', label: 'Document / PDF', description: 'Upload a PDF, DOCX, or PPT', quadrant: 'E-Content', color: '#7C3AED' },
  { type: 'quiz', label: 'Quiz', description: 'Create an auto-graded assessment', quadrant: 'Assessment', color: '#DC2626' },
  { type: 'assignment', label: 'Assignment', description: 'File or text submission with grading', quadrant: 'Assessment', color: '#DC2626' },
  { type: 'forum_topic', label: 'Discussion Topic', description: 'Start a forum discussion thread', quadrant: 'Discussion', color: '#0DA88F' },
  { type: 'live_session', label: 'Live Session', description: 'Schedule a Zoom session', quadrant: 'Live Session', color: '#072FB5' },
];
