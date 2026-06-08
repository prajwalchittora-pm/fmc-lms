export const LEARNER = {
  name: 'Arjun',
  fullName: 'Arjun Mehta',
  initials: 'AM',
  cohort: 'Batch 24-B · Professional Communication',
  streak: 14,
  joinedDate: '2024-02-10',
};

export type ActivityType = 'video' | 'quiz' | 'page' | 'pdf';
export type CourseStatus = 'not_started' | 'in_progress' | 'completed';

export interface Activity {
  id: string;
  courseId: string;
  title: string;
  type: ActivityType;
  duration?: string;
  wordCount?: number;
  questions?: number;
  done: boolean;
  thumbnail?: string;
  excerpt?: string;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  status: CourseStatus;
  progress: number;
  activities: {
    videos: { done: number; total: number };
    quizzes: { done: number; total: number };
    pages: { done: number; total: number };
    discussions: { done: number; total: number };
  };
  colorAccent: string;
  gradientFrom: string;
  gradientTo: string;
  lastActivity?: string;
  estimatedHours: number;
}

export const COURSES: Course[] = [
  {
    id: 'spoken-english',
    title: 'Professional Communication & Spoken English Excellence',
    subtitle: 'Build clarity, confidence, and impact in spoken communication',
    status: 'in_progress',
    progress: 65,
    activities: { videos: { done: 5, total: 8 }, quizzes: { done: 2, total: 5 }, pages: { done: 4, total: 7 }, discussions: { done: 3, total: 6 } },
    colorAccent: '#072fb5',
    gradientFrom: '#072fb5',
    gradientTo: '#4B7BF5',
    lastActivity: 'Presentation Skills — Module 3',
    estimatedHours: 18,
  },
  {
    id: 'active-listening',
    title: 'Active Listening, Collaboration & Response Strategies',
    subtitle: 'Master the art of listening and collaborative communication',
    status: 'in_progress',
    progress: 30,
    activities: { videos: { done: 2, total: 6 }, quizzes: { done: 1, total: 4 }, pages: { done: 2, total: 8 }, discussions: { done: 1, total: 4 } },
    colorAccent: '#059669',
    gradientFrom: '#059669',
    gradientTo: '#34D399',
    lastActivity: 'Empathetic Listening — Module 2',
    estimatedHours: 16,
  },
  {
    id: 'business-writing',
    title: 'Business Writing & Professional Communication',
    subtitle: 'Craft compelling emails, reports, and professional documents',
    status: 'completed',
    progress: 100,
    activities: { videos: { done: 6, total: 6 }, quizzes: { done: 4, total: 4 }, pages: { done: 5, total: 5 }, discussions: { done: 4, total: 4 } },
    colorAccent: '#D97706',
    gradientFrom: '#D97706',
    gradientTo: '#FCD34D',
    lastActivity: 'Completed',
    estimatedHours: 14,
  },
  {
    id: 'reading-comprehension',
    title: 'Reading Comprehension, Critical Thinking & Analytical Communication',
    subtitle: 'Analyse complex texts and communicate insights with precision',
    status: 'not_started',
    progress: 0,
    activities: { videos: { done: 0, total: 7 }, quizzes: { done: 0, total: 5 }, pages: { done: 0, total: 9 }, discussions: { done: 0, total: 5 } },
    colorAccent: '#7C3AED',
    gradientFrom: '#7C3AED',
    gradientTo: '#A78BFA',
    estimatedHours: 20,
  },
  {
    id: 'workplace-skills',
    title: 'Workplace Soft Skills & Professional Readiness',
    subtitle: 'Navigate workplace dynamics with confidence and professionalism',
    status: 'not_started',
    progress: 0,
    activities: { videos: { done: 0, total: 6 }, quizzes: { done: 0, total: 3 }, pages: { done: 0, total: 8 }, discussions: { done: 0, total: 3 } },
    colorAccent: '#DC2626',
    gradientFrom: '#DC2626',
    gradientTo: '#F87171',
    estimatedHours: 16,
  },
  {
    id: 'career-readiness',
    title: 'Career Readiness & Employability Skills',
    subtitle: 'Prepare for interviews, networking, and career growth',
    status: 'not_started',
    progress: 0,
    activities: { videos: { done: 0, total: 8 }, quizzes: { done: 0, total: 4 }, pages: { done: 0, total: 6 }, discussions: { done: 0, total: 4 } },
    colorAccent: '#0891B2',
    gradientFrom: '#0891B2',
    gradientTo: '#67E8F9',
    estimatedHours: 18,
  },
  {
    id: 'ielts-readiness',
    title: 'Global Communication & IELTS Readiness Foundation',
    subtitle: 'Master academic English and prepare for global certification',
    status: 'not_started',
    progress: 0,
    activities: { videos: { done: 0, total: 10 }, quizzes: { done: 0, total: 6 }, pages: { done: 0, total: 12 }, discussions: { done: 0, total: 5 } },
    colorAccent: '#BE185D',
    gradientFrom: '#BE185D',
    gradientTo: '#F472B6',
    estimatedHours: 30,
  },
];

export const CERTIFICATE = {
  program: 'Professional Communication & Soft Skills Certification',
  institution: 'FindMyCollege Institute',
  totalCourses: 7,
  completedCourses: 1,
  inProgressCourses: 2,
  aggregateProgress: 28,
  eta: '10 weeks',
  hoursLogged: 18,
  hoursTotal: 132,
};

export const VIDEO_ACTIVITIES: Activity[] = [
  {
    id: 'v1', courseId: 'spoken-english',
    title: 'Mastering Clarity & Pronunciation',
    type: 'video', duration: '22:15', done: false,
    thumbnail: 'pronunciation',
    excerpt: 'Module 3 · Professional Communication',
  },
  {
    id: 'v2', courseId: 'active-listening',
    title: 'The Art of Active Listening',
    type: 'video', duration: '18:40', done: false,
    thumbnail: 'listening',
    excerpt: 'Module 2 · Active Listening',
  },
  {
    id: 'v3', courseId: 'spoken-english',
    title: 'Structuring Compelling Presentations',
    type: 'video', duration: '28:30', done: false,
    thumbnail: 'presentation',
    excerpt: 'Module 4 · Professional Communication',
  },
  {
    id: 'v4', courseId: 'active-listening',
    title: 'Building Rapport in Professional Settings',
    type: 'video', duration: '19:50', done: false,
    thumbnail: 'rapport',
    excerpt: 'Module 3 · Active Listening',
  },
  {
    id: 'v5', courseId: 'business-writing',
    title: 'Writing Emails that Get Responses',
    type: 'video', duration: '15:20', done: true,
    thumbnail: 'email-writing',
    excerpt: 'Module 2 · Business Writing',
  },
];

export const PAGE_ACTIVITIES: Activity[] = [
  {
    id: 'p1', courseId: 'spoken-english',
    title: 'The Seven Principles of Effective Communication',
    type: 'page', wordCount: 2200, done: false,
    excerpt: 'From clarity to completeness — what separates good communicators from great ones in professional settings...',
  },
  {
    id: 'p2', courseId: 'active-listening',
    title: 'How Empathy Transforms Professional Relationships',
    type: 'page', wordCount: 1800, done: false,
    excerpt: 'Research shows that empathetic listening increases collaboration effectiveness by 40%. Develop this skill...',
  },
  {
    id: 'p3', courseId: 'spoken-english',
    title: 'Overcoming Communication Anxiety',
    type: 'page', wordCount: 1600, done: false,
    excerpt: 'Practical techniques used by top executives and public speakers to manage nervousness and project confidence...',
  },
  {
    id: 'p4', courseId: 'business-writing',
    title: 'The Pyramid Principle: Writing for Busy Readers',
    type: 'page', wordCount: 2800, done: false,
    excerpt: 'The McKinsey method for structuring business documents so decision-makers read them and act on them...',
  },
];

export const LEARNING_PATH = [
  { id: 'lp-1', type: 'page' as ActivityType, title: 'Introduction to Professional Communication', done: true, duration: '~6 min read' },
  { id: 'lp-2', type: 'video' as ActivityType, title: 'Voice Modulation & Tone Control', done: true, duration: '14:20' },
  { id: 'lp-3', type: 'page' as ActivityType, title: 'The Seven Principles of Effective Communication', done: true, duration: '~11 min read' },
  { id: 'lp-4', type: 'quiz' as ActivityType, title: 'Check-in: Communication Fundamentals', done: true, duration: '5 questions' },
  { id: 'lp-5', type: 'video' as ActivityType, title: 'Pronunciation & Accent Clarity', done: true, duration: '18:45' },
  { id: 'lp-6', type: 'page' as ActivityType, title: 'Spoken Excellence', done: false, duration: '~12 min read', current: true },
  { id: 'lp-7', type: 'video' as ActivityType, title: 'Mastering Clarity & Pronunciation', done: false, duration: '22:15' },
  { id: 'lp-8', type: 'page' as ActivityType, title: 'Non-Verbal Communication & Body Language', done: false, duration: '~12 min read' },
  { id: 'lp-8b', type: 'pdf' as ActivityType, title: 'Reference Guide: Body Language Cheat Sheet', done: false, duration: '4 pages' },
  { id: 'lp-9', type: 'video' as ActivityType, title: 'Structuring Compelling Presentations', done: false, duration: '28:30' },
  { id: 'lp-10', type: 'quiz' as ActivityType, title: 'Module 3 Assessment', done: false, duration: '10 questions' },
  { id: 'lp-11', type: 'video' as ActivityType, title: 'Interview Communication Skills', done: false, duration: '24:10' },
  { id: 'lp-12', type: 'page' as ActivityType, title: 'Storytelling in Professional Contexts', done: false, duration: '~15 min read' },
  { id: 'lp-12b', type: 'pdf' as ActivityType, title: 'Case Study: Persuasive Narratives in Business', done: false, duration: '6 pages' },
  { id: 'lp-13', type: 'quiz' as ActivityType, title: 'Final Assessment', done: false, duration: '20 questions' },
];

export const NOTIFICATIONS = [
  { id: 'n1', title: 'Quiz deadline reminder', body: 'Module 3 Assessment due in 3 days', time: '2h ago', read: false },
  { id: 'n2', title: 'New content available', body: 'Active Listening Module 3 is now live', time: '1d ago', read: false },
  { id: 'n3', title: 'Certificate milestone', body: 'You are 28% toward your certificate!', time: '2d ago', read: true },
];

export function getRemainingActivities() {
  let remaining = 0;
  COURSES.forEach(c => {
    remaining += (c.activities.videos.total - c.activities.videos.done);
    remaining += (c.activities.quizzes.total - c.activities.quizzes.done);
    remaining += (c.activities.pages.total - c.activities.pages.done);
  });
  return remaining;
}

// ─── PROGRAMME DATA ───────────────────────────────────────────────────────────

export type ProgrammeType = 'self_paced' | 'live_sessions' | 'grades_based';
export type MilestoneStatus = 'completed' | 'current' | 'upcoming';
export type CriteriaType = 'completion' | 'grades' | 'attendance_and_completion';
export type ProgrammeTab = 'overview' | 'courses' | 'grades' | 'exam' | 'announcements' | 'forum' | 'elibrary' | 'tickets' | 'calendar';

// ─── UGC LMS: SEMESTERS & ENGAGEMENT ────────────────────────────────────────

export type SemesterId = 'sem-1' | 'sem-2' | 'sem-3' | 'sem-4';

export interface Semester {
  id: SemesterId;
  label: string;
  courses: string[]; // course IDs
  isCurrent: boolean;
}

export const SEMESTERS: Semester[] = [
  { id: 'sem-1', label: 'Semester 1', courses: ['spoken-english', 'active-listening', 'business-writing'], isCurrent: false },
  { id: 'sem-2', label: 'Semester 2', courses: ['reading-comprehension', 'workplace-skills', 'career-readiness'], isCurrent: true },
  { id: 'sem-3', label: 'Semester 3', courses: ['ielts-readiness'], isCurrent: false },
  { id: 'sem-4', label: 'Semester 4', courses: [], isCurrent: false },
];

export interface EngagementComponent {
  name: string;
  yourTime: string;
  targetTime: string;
  completion: number | null; // null = N/A
  weight: number;
  score: number;
}

export interface EngagementScore {
  total: number;
  maxScore: number;
  status: 'Lacking' | 'Needs Improvement' | 'Satisfactory' | 'Good' | 'Excellent';
  statusColor: string;
  totalTime: string;
  totalTarget: string;
  totalCompletion: number;
  components: EngagementComponent[];
}

export function getEngagementScore(_semesterId: SemesterId): EngagementScore {
  // Mock data — in production this comes from API
  return {
    total: 42,
    maxScore: 100,
    status: 'Needs Improvement',
    statusColor: '#D97706',
    totalTime: '28.5h',
    totalTarget: '144h',
    totalCompletion: 19,
    components: [
      { name: 'Synchronous Counselling', yourTime: '2h', targetTime: '14h', completion: null, weight: 10, score: 1.4 },
      { name: 'Discussion Forum', yourTime: '8h', targetTime: '144h', completion: 6, weight: 20, score: 1.1 },
      { name: 'E-Tutorial (Video)', yourTime: '6.5h', targetTime: '40h', completion: 16, weight: 16.67, score: 2.7 },
      { name: 'E-Content (SLM)', yourTime: '4h', targetTime: '30h', completion: 13, weight: 16.67, score: 2.2 },
      { name: 'Self-Study', yourTime: '8h', targetTime: '60h', completion: 13, weight: 36.67, score: 4.9 },
    ],
  };
}

export interface ProgrammeMilestone {
  id: string;
  shortTitle: string;
  fullTitle: string;
  status: MilestoneStatus;
  progress: number;
  courseId?: string; // links into Learn tab
}

export interface ProgrammeCriteria {
  type: CriteriaType;
  coursesTotal: number;
  coursesDone: number;
  gradeRequired?: number;
  gradeCurrent?: number;
  sessionsTotal?: number;
  sessionsAttended?: number;
}

export interface Notice {
  id: string;
  title: string;
  body: string;
  author: string;
  timeAgo: string;
  isNew: boolean;
}

export interface LiveSession {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  instructor: string;
  isNext: boolean;
}

export interface ProgrammeResume {
  courseId: string;
  courseTitle: string;
  moduleTitle: string;
  lessonTitle: string;
  lessonNumber: string;
  courseProgress: number;
  accentFrom: string;
  accentTo: string;
  activityBreakdown: { videos: number; quizzes: number; pages: number };
}

export interface Programme {
  id: string;
  name: string;
  shortName: string;
  type: ProgrammeType;
  overallProgress: number;
  lastAccessedLabel: string;
  eta: string;
  tabs: ProgrammeTab[];
  criteria: ProgrammeCriteria;
  milestones: ProgrammeMilestone[];
  resume: ProgrammeResume;
  notices: Notice[];
  liveSessions?: LiveSession[];
}

export const PROGRAMMES: Programme[] = [
  // ── 1. Applied AI & Product Management (self-paced, completion-based) ───────
  {
    id: 'ai-product',
    name: 'Applied AI & Product Management',
    shortName: 'Applied AI',
    type: 'self_paced',
    overallProgress: 42,
    lastAccessedLabel: '2h ago',
    eta: '8 weeks',
    tabs: ['overview', 'courses', 'grades', 'exam', 'announcements', 'forum', 'elibrary', 'tickets', 'calendar'] as ProgrammeTab[],
    criteria: {
      type: 'completion',
      coursesTotal: 7,
      coursesDone: 3,
    },
    milestones: [
      { id: 'm1', shortTitle: 'AI Foundations', fullTitle: 'AI Foundations & ML Basics', status: 'completed', progress: 100, courseId: 'ai-foundations' },
      { id: 'm2', shortTitle: 'Product Thinking', fullTitle: 'Product Thinking & Strategy', status: 'completed', progress: 100, courseId: 'product-thinking' },
      { id: 'm3', shortTitle: 'Data-Driven PM', fullTitle: 'Data-Driven Product Management', status: 'completed', progress: 100, courseId: 'data-driven-pm' },
      { id: 'm4', shortTitle: 'ML for PMs', fullTitle: 'Machine Learning for Product Managers', status: 'current', progress: 58, courseId: 'ml-for-pm' },
      { id: 'm5', shortTitle: 'AI Ethics', fullTitle: 'AI Ethics & Responsible Product Design', status: 'upcoming', progress: 0, courseId: 'ai-ethics' },
      { id: 'm6', shortTitle: 'Growth & A/B', fullTitle: 'Growth, Experimentation & A/B Testing', status: 'upcoming', progress: 0, courseId: 'growth-ab' },
      { id: 'm7', shortTitle: 'Capstone', fullTitle: 'Capstone: AI Product Case Study', status: 'upcoming', progress: 0, courseId: 'capstone-ai' },
    ],
    resume: {
      courseId: 'ml-for-pm',
      courseTitle: 'Machine Learning for Product Managers',
      moduleTitle: 'Module 4 · Model Evaluation',
      lessonTitle: 'Understanding Bias-Variance Tradeoff',
      lessonNumber: 'Lesson 4.3',
      courseProgress: 58,
      accentFrom: '#072FB5',
      accentTo: '#4B7BF5',
      activityBreakdown: { videos: 6, quizzes: 3, pages: 4 },
    },
    notices: [
      {
        id: 'ai-n1',
        title: 'Guest lecture: AI in fintech',
        body: 'Industry expert Priya Nair joins us to discuss deploying AI in regulated industries. Optional but highly recommended.',
        author: 'Dr. Samira Khan',
        timeAgo: '3h ago',
        isNew: true,
      },
      {
        id: 'ai-n2',
        title: 'Capstone brief released',
        body: 'The capstone project brief is now available. Review it early — submissions open in 4 weeks.',
        author: 'Dr. Samira Khan',
        timeAgo: '2d ago',
        isNew: false,
      },
    ],
  },

  // ── 2. Professional Communication (live sessions + completion criteria) ──────
  {
    id: 'pro-comm',
    name: 'Professional Communication & Spoken English',
    shortName: 'Pro Communication',
    type: 'live_sessions',
    overallProgress: 28,
    lastAccessedLabel: 'Yesterday',
    eta: '10 weeks',
    tabs: ['overview', 'courses', 'grades', 'exam', 'announcements', 'forum', 'elibrary', 'tickets', 'calendar'] as ProgrammeTab[],
    criteria: {
      type: 'attendance_and_completion',
      coursesTotal: 7,
      coursesDone: 1,
      sessionsTotal: 5,
      sessionsAttended: 2,
    },
    milestones: [
      { id: 'm1', shortTitle: 'Business Writing', fullTitle: 'Business Writing & Professional Communication', status: 'completed', progress: 100, courseId: 'business-writing' },
      { id: 'm2', shortTitle: 'Spoken English', fullTitle: 'Professional Communication & Spoken English', status: 'current', progress: 65, courseId: 'spoken-english' },
      { id: 'm3', shortTitle: 'Active Listening', fullTitle: 'Active Listening & Collaboration Strategies', status: 'upcoming', progress: 0, courseId: 'active-listening' },
      { id: 'm4', shortTitle: 'Reading & Thinking', fullTitle: 'Reading Comprehension & Critical Thinking', status: 'upcoming', progress: 0, courseId: 'reading-comprehension' },
      { id: 'm5', shortTitle: 'Workplace Skills', fullTitle: 'Workplace Soft Skills & Readiness', status: 'upcoming', progress: 0, courseId: 'workplace-skills' },
      { id: 'm6', shortTitle: 'Career Readiness', fullTitle: 'Career Readiness & Employability', status: 'upcoming', progress: 0, courseId: 'career-readiness' },
      { id: 'm7', shortTitle: 'IELTS Readiness', fullTitle: 'Global Communication & IELTS Foundation', status: 'upcoming', progress: 0, courseId: 'ielts-readiness' },
    ],
    resume: {
      courseId: 'spoken-english',
      courseTitle: 'Professional Communication & Spoken English Excellence',
      moduleTitle: 'Module 3 · Presentation Skills',
      lessonTitle: 'Spoken Excellence — Core Principles',
      lessonNumber: 'Lesson 3.2',
      courseProgress: 65,
      accentFrom: '#7C3AED',
      accentTo: '#A78BFA',
      activityBreakdown: { videos: 8, quizzes: 5, pages: 7 },
    },
    notices: [
      {
        id: 'pc-n1',
        title: 'Session 2 recording available',
        body: 'The Session 2 recording has been uploaded. Please watch it before our next live session on Monday.',
        author: 'Prof. Kavya Menon',
        timeAgo: '1d ago',
        isNew: true,
      },
      {
        id: 'pc-n2',
        title: 'Assignment deadline extended',
        body: 'The Module 3 reflection assignment deadline has been moved to June 15th. Please plan accordingly.',
        author: 'Prof. Kavya Menon',
        timeAgo: '3d ago',
        isNew: false,
      },
    ],
    liveSessions: [
      {
        id: 'ls-1',
        title: 'Advanced Presentation Techniques',
        date: 'Mon, Jun 9',
        time: '6:00 PM IST',
        duration: '90 min',
        instructor: 'Prof. Kavya Menon',
        isNext: true,
      },
      {
        id: 'ls-2',
        title: 'Group Discussion & Debate Workshop',
        date: 'Mon, Jun 16',
        time: '6:00 PM IST',
        duration: '90 min',
        instructor: 'Prof. Kavya Menon',
        isNext: false,
      },
    ],
  },

  // ── 3. Data Analytics Fundamentals (grades-based) ────────────────────────────
  {
    id: 'data-analytics',
    name: 'Data Analytics Fundamentals',
    shortName: 'Data Analytics',
    type: 'grades_based',
    overallProgress: 38,
    lastAccessedLabel: '3d ago',
    eta: '12 weeks',
    tabs: ['overview', 'courses', 'grades', 'exam', 'announcements', 'forum', 'elibrary', 'tickets', 'calendar'] as ProgrammeTab[],
    criteria: {
      type: 'grades',
      coursesTotal: 5,
      coursesDone: 2,
      gradeRequired: 75,
      gradeCurrent: 62,
    },
    milestones: [
      { id: 'm1', shortTitle: 'Excel & Data', fullTitle: 'Excel & Data Fundamentals', status: 'completed', progress: 100, courseId: 'excel-analytics' },
      { id: 'm2', shortTitle: 'SQL Basics', fullTitle: 'SQL for Data Analysis', status: 'completed', progress: 100, courseId: 'sql-basics' },
      { id: 'm3', shortTitle: 'Statistics', fullTitle: 'Statistical Analysis & Probability', status: 'current', progress: 45, courseId: 'statistical-analysis' },
      { id: 'm4', shortTitle: 'Data Viz', fullTitle: 'Data Visualisation & Tableau', status: 'upcoming', progress: 0, courseId: 'data-viz' },
      { id: 'm5', shortTitle: 'Capstone', fullTitle: 'Capstone: Analytics Project', status: 'upcoming', progress: 0, courseId: 'capstone-data' },
    ],
    resume: {
      courseId: 'statistical-analysis',
      courseTitle: 'Statistical Analysis & Probability',
      moduleTitle: 'Module 3 · Statistical Inference',
      lessonTitle: 'Hypothesis Testing in Practice',
      lessonNumber: 'Lesson 3.1',
      courseProgress: 45,
      accentFrom: '#0891B2',
      accentTo: '#67E8F9',
      activityBreakdown: { videos: 5, quizzes: 4, pages: 6 },
    },
    notices: [
      {
        id: 'da-n1',
        title: 'Mid-term grades posted',
        body: 'Grades for the SQL assessment and Excel assignment have been posted. Review your feedback before starting Module 3.',
        author: 'Dr. Vikram Rao',
        timeAgo: '5h ago',
        isNew: true,
      },
    ],
  },
];

export const DEFAULT_PROGRAMME_ID = 'ai-product';

// ─── GRADES DATA ──────────────────────────────────────────────────────────────

export type GradeStatus = 'passed' | 'failed' | 'pending';

export interface AssessmentDetail {
  name: string;
  marks: number;
  maxMarks: number;
  date?: string;
}

export interface CourseGrade {
  id: string;
  code: string;
  name: string;
  credits: number;
  status: GradeStatus;
  internal: { marks: number; maxMarks: number; assignments: AssessmentDetail[]; quizzes: AssessmentDetail[] };
  endSem: { marks: number; maxMarks: number; eligible: boolean };
  total: { marks: number; maxMarks: number; percentage: number };
  grade: string;
  gradePoint: number;
  attendance: { percentage: number; present: number; total: number; hasLiveSessions: boolean };
}

export interface SemesterGrades {
  semesterId: SemesterId;
  sgpa: number;
  cgpa: number;
  creditsEarned: number;
  totalCredits: number;
  coursesCompleted: number;
  totalCourses: number;
  avgAttendance: number;
  courses: CourseGrade[];
}

export function getSemesterGrades(semId: SemesterId): SemesterGrades {
  const courses: CourseGrade[] = [
    {
      id: 'g1', code: 'MBA-101', name: 'Managerial Economics', credits: 4, status: 'passed',
      internal: { marks: 32, maxMarks: 40, assignments: [{ name: 'Assignment 1: Demand Analysis', marks: 8, maxMarks: 10, date: 'Feb 15' }, { name: 'Assignment 2: Cost Structures', marks: 7, maxMarks: 10, date: 'Mar 10' }], quizzes: [{ name: 'Quiz 1: Micro Foundations', marks: 9, maxMarks: 10, date: 'Feb 28' }, { name: 'Quiz 2: Market Structures', marks: 8, maxMarks: 10, date: 'Apr 5' }] },
      endSem: { marks: 52, maxMarks: 60, eligible: true },
      total: { marks: 84, maxMarks: 100, percentage: 84 },
      grade: 'A', gradePoint: 8.5,
      attendance: { percentage: 88, present: 22, total: 25, hasLiveSessions: true },
    },
    {
      id: 'g2', code: 'MBA-102', name: 'Managerial Communication', credits: 3, status: 'passed',
      internal: { marks: 28, maxMarks: 40, assignments: [{ name: 'Case Study Presentation', marks: 7, maxMarks: 10, date: 'Feb 20' }, { name: 'Written Communication Portfolio', marks: 6, maxMarks: 10, date: 'Mar 25' }], quizzes: [{ name: 'Quiz 1: Comm Fundamentals', marks: 8, maxMarks: 10, date: 'Mar 1' }, { name: 'Quiz 2: Persuasion Techniques', marks: 7, maxMarks: 10, date: 'Apr 12' }] },
      endSem: { marks: 41, maxMarks: 60, eligible: true },
      total: { marks: 69, maxMarks: 100, percentage: 69 },
      grade: 'B+', gradePoint: 7.5,
      attendance: { percentage: 92, present: 23, total: 25, hasLiveSessions: true },
    },
    {
      id: 'g3', code: 'MBA-103', name: 'Financial Accounting & Analysis', credits: 4, status: 'passed',
      internal: { marks: 35, maxMarks: 40, assignments: [{ name: 'Balance Sheet Analysis', marks: 9, maxMarks: 10, date: 'Feb 18' }, { name: 'Ratio Analysis Project', marks: 8, maxMarks: 10, date: 'Mar 20' }], quizzes: [{ name: 'Quiz 1: Journal Entries', marks: 9, maxMarks: 10, date: 'Mar 5' }, { name: 'Quiz 2: Financial Statements', marks: 9, maxMarks: 10, date: 'Apr 8' }] },
      endSem: { marks: 54, maxMarks: 60, eligible: true },
      total: { marks: 89, maxMarks: 100, percentage: 89 },
      grade: 'A+', gradePoint: 9.0,
      attendance: { percentage: 96, present: 24, total: 25, hasLiveSessions: true },
    },
    {
      id: 'g4', code: 'MBA-104', name: 'Organizational Behaviour', credits: 3, status: 'pending',
      internal: { marks: 22, maxMarks: 40, assignments: [{ name: 'Group Dynamics Report', marks: 5, maxMarks: 10, date: 'Mar 1' }, { name: 'Leadership Case Analysis', marks: 6, maxMarks: 10, date: 'Apr 1' }], quizzes: [{ name: 'Quiz 1: Motivation Theories', marks: 6, maxMarks: 10, date: 'Mar 15' }, { name: 'Quiz 2: Team Dynamics', marks: 5, maxMarks: 10, date: 'Apr 20' }] },
      endSem: { marks: 0, maxMarks: 60, eligible: false },
      total: { marks: 22, maxMarks: 100, percentage: 22 },
      grade: '-', gradePoint: 0,
      attendance: { percentage: 68, present: 17, total: 25, hasLiveSessions: true },
    },
    {
      id: 'g5', code: 'MBA-105', name: 'Business Statistics', credits: 4, status: 'passed',
      internal: { marks: 30, maxMarks: 40, assignments: [{ name: 'Hypothesis Testing Report', marks: 8, maxMarks: 10, date: 'Feb 22' }, { name: 'Regression Analysis', marks: 7, maxMarks: 10, date: 'Mar 28' }], quizzes: [{ name: 'Quiz 1: Probability', marks: 8, maxMarks: 10, date: 'Mar 8' }, { name: 'Quiz 2: Distributions', marks: 7, maxMarks: 10, date: 'Apr 15' }] },
      endSem: { marks: 45, maxMarks: 60, eligible: true },
      total: { marks: 75, maxMarks: 100, percentage: 75 },
      grade: 'B+', gradePoint: 7.5,
      attendance: { percentage: 84, present: 21, total: 25, hasLiveSessions: true },
    },
    {
      id: 'g6', code: 'MBA-106', name: 'Business Law & Ethics', credits: 2, status: 'passed',
      internal: { marks: 26, maxMarks: 40, assignments: [{ name: 'Contract Law Essay', marks: 7, maxMarks: 10, date: 'Mar 5' }], quizzes: [{ name: 'Quiz 1: Legal Framework', marks: 10, maxMarks: 10, date: 'Mar 20' }, { name: 'Quiz 2: Corporate Law', marks: 9, maxMarks: 10, date: 'Apr 18' }] },
      endSem: { marks: 38, maxMarks: 60, eligible: true },
      total: { marks: 64, maxMarks: 100, percentage: 64 },
      grade: 'B', gradePoint: 7.0,
      attendance: { percentage: 80, present: 20, total: 25, hasLiveSessions: false },
    },
  ];

  const passed = courses.filter(c => c.status === 'passed');
  const totalWeightedGP = passed.reduce((s, c) => s + c.gradePoint * c.credits, 0);
  const totalPassedCredits = passed.reduce((s, c) => s + c.credits, 0);

  return {
    semesterId: semId,
    sgpa: totalPassedCredits > 0 ? parseFloat((totalWeightedGP / totalPassedCredits).toFixed(2)) : 0,
    cgpa: totalPassedCredits > 0 ? parseFloat(((totalWeightedGP / totalPassedCredits) * 0.97).toFixed(2)) : 0,
    creditsEarned: totalPassedCredits,
    totalCredits: courses.reduce((s, c) => s + c.credits, 0),
    coursesCompleted: passed.length,
    totalCourses: courses.length,
    avgAttendance: Math.round(courses.reduce((s, c) => s + c.attendance.percentage, 0) / courses.length),
    courses,
  };
}
