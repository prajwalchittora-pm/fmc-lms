'use client';
import { useState } from 'react';
import { Search, Pin, Paperclip, Building2, BookOpen, ChevronRight } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type AnnouncementSource = 'university' | 'course';
type FilterKey = 'all' | 'university' | 'course';

interface Announcement {
  id: string;
  source: AnnouncementSource;
  courseName?: string;
  courseColor?: string;
  title: string;
  body: string;
  author: string;
  authorRole: string;
  date: string;
  pinned: boolean;
  attachments: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    source: 'university',
    title: 'End-Semester Examination Schedule Released',
    body: 'The end-semester examination schedule for all programmes has been published. Examinations will commence from June 23, 2026. Students are advised to check their individual timetables on the exam portal and report any conflicts within the next 5 working days. Hall tickets will be available for download from June 16.',
    author: 'Office of the Controller of Examinations',
    authorRole: 'University Administration',
    date: 'May 30, 2026',
    pinned: true,
    attachments: 2,
  },
  {
    id: 'a2',
    source: 'university',
    title: 'Fee Payment Deadline — Semester 3 Registration',
    body: 'The last date for payment of tuition fees for Semester 3 is June 15, 2026. Students who fail to pay by the deadline will incur a late fee of Rs. 500 per day. Fee payment can be done through the student portal under the Finance section. Contact the accounts office for any queries regarding scholarships or fee waivers.',
    author: 'Finance Department',
    authorRole: 'University Administration',
    date: 'May 28, 2026',
    pinned: true,
    attachments: 1,
  },
  {
    id: 'a3',
    source: 'course',
    courseName: 'Managerial Economics',
    courseColor: '#072FB5',
    title: 'Assignment 3 Deadline Extended to June 10',
    body: 'Due to the upcoming mid-semester break, the deadline for Assignment 3 (Elasticity Analysis Case Study) has been extended by one week. The new submission deadline is June 10, 2026 at 11:59 PM. Please ensure you follow the updated rubric shared in the course materials section.',
    author: 'Dr. Priya Sharma',
    authorRole: 'Course Instructor',
    date: 'May 29, 2026',
    pinned: false,
    attachments: 1,
  },
  {
    id: 'a4',
    source: 'university',
    title: 'University Holiday — Foundation Day (June 15)',
    body: 'The university will remain closed on June 15, 2026 (Monday) on account of University Foundation Day celebrations. All classes, counselling sessions, and examinations scheduled for this date stand cancelled. An online cultural programme will be streamed on the university portal at 5:00 PM.',
    author: 'Office of the Registrar',
    authorRole: 'University Administration',
    date: 'May 27, 2026',
    pinned: false,
    attachments: 0,
  },
  {
    id: 'a5',
    source: 'course',
    courseName: 'Managerial Communication',
    courseColor: '#059669',
    title: 'New Study Material Uploaded — Module 4',
    body: 'Module 4 learning materials covering "Persuasive Communication & Negotiation" have been uploaded to the course page. This includes 3 new video lectures, a reading packet, and practice exercises. Please complete the pre-reading before the live session on June 8.',
    author: 'Prof. Kavya Menon',
    authorRole: 'Course Instructor',
    date: 'May 26, 2026',
    pinned: false,
    attachments: 3,
  },
  {
    id: 'a6',
    source: 'course',
    courseName: 'Financial Accounting & Analysis',
    courseColor: '#D97706',
    title: 'Guest Lecture — CFO of TechVentures Inc.',
    body: 'We are delighted to announce a guest lecture by Mr. Rajesh Kumar, CFO of TechVentures Inc., on "Financial Statement Analysis in the Real World" scheduled for June 12 at 3:00 PM. Attendance is optional but strongly recommended. A recording will be made available within 48 hours for those unable to attend.',
    author: 'Dr. Anil Verma',
    authorRole: 'Course Instructor',
    date: 'May 25, 2026',
    pinned: false,
    attachments: 0,
  },
  {
    id: 'a7',
    source: 'course',
    courseName: 'Business Statistics',
    courseColor: '#7C3AED',
    title: 'Quiz 2 Rescheduled to June 9',
    body: 'Quiz 2 on "Probability Distributions & Hypothesis Testing" has been rescheduled from June 6 to June 9, 2026. The quiz will be conducted online through the LMS exam module. Duration remains 60 minutes. Please review Modules 3 and 4 thoroughly.',
    author: 'Prof. Neha Gupta',
    authorRole: 'Course Instructor',
    date: 'May 24, 2026',
    pinned: false,
    attachments: 0,
  },
  {
    id: 'a8',
    source: 'university',
    title: 'Student Feedback Survey — Open Until June 5',
    body: 'The mid-semester student feedback survey is now open. Your anonymous feedback helps us improve course quality, teaching methods, and support services. The survey takes approximately 5 minutes to complete. Please submit your responses before June 5, 2026.',
    author: 'Quality Assurance Cell',
    authorRole: 'University Administration',
    date: 'May 22, 2026',
    pinned: false,
    attachments: 0,
  },
];

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'university', label: 'University' },
  { key: 'course', label: 'Course' },
];

// ─── Source Badge ─────────────────────────────────────────────────────────────

function SourceBadge({ source, courseName, courseColor }: { source: AnnouncementSource; courseName?: string; courseColor?: string }) {
  if (source === 'university') {
    return (
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '3px 9px',
        background: 'rgba(13,10,61,0.07)',
        borderRadius: 'var(--radius-sm)',
        fontSize: 10, fontWeight: 700, color: '#0D0A3D',
        letterSpacing: '0.03em',
      }}>
        <Building2 size={10} strokeWidth={2.2} />
        University
      </div>
    );
  }

  const color = courseColor || '#072FB5';
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px',
      background: color + '10',
      borderRadius: 'var(--radius-sm)',
      fontSize: 10, fontWeight: 700, color,
      letterSpacing: '0.03em',
    }}>
      <BookOpen size={10} strokeWidth={2.2} />
      {courseName || 'Course'}
    </div>
  );
}

// ─── Announcement Card ────────────────────────────────────────────────────────

function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '20px 24px',
        cursor: 'pointer',
        transition: 'box-shadow 0.12s ease, border-color 0.12s ease',
        position: 'relative',
      }}
      onClick={() => setExpanded(!expanded)}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 3px 12px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = 'rgba(215,215,215,0.8)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
    >
      {/* Top row: badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <SourceBadge source={announcement.source} courseName={announcement.courseName} courseColor={announcement.courseColor} />
        {announcement.pinned && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '3px 8px',
            background: 'rgba(220,38,38,0.07)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 10, fontWeight: 700, color: '#DC2626',
            letterSpacing: '0.02em',
          }}>
            <Pin size={9} strokeWidth={2.5} />
            Important
          </div>
        )}
        {announcement.attachments > 0 && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '3px 8px',
            background: 'var(--bg-section)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)',
          }}>
            <Paperclip size={9} strokeWidth={2} />
            {announcement.attachments} {announcement.attachments === 1 ? 'file' : 'files'}
          </div>
        )}
        <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
          <ChevronRight
            size={14}
            strokeWidth={2}
            style={{
              color: 'var(--text-tertiary)',
              opacity: 0.5,
              transform: expanded ? 'rotate(90deg)' : 'none',
              transition: 'transform 0.2s ease',
            }}
          />
        </div>
      </div>

      {/* Title */}
      <div style={{
        fontSize: 15, fontWeight: 700, color: 'var(--text-primary)',
        fontFamily: 'var(--font-display)', letterSpacing: '-0.01em',
        marginBottom: 6,
      }}>
        {announcement.title}
      </div>

      {/* Body */}
      <div style={{
        fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)',
        fontWeight: 450,
        ...(expanded ? {} : {
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical' as const,
          overflow: 'hidden',
        }),
      }}>
        {announcement.body}
      </div>

      {/* Author + date */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        marginTop: 12,
        fontSize: 11.5, color: 'var(--text-tertiary)', fontWeight: 500,
      }}>
        <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{announcement.author}</span>
        <span style={{ opacity: 0.4 }}>{'·'}</span>
        <span>{announcement.authorRole}</span>
        <span style={{ opacity: 0.4 }}>{'·'}</span>
        <span>{announcement.date}</span>
      </div>
    </div>
  );
}

// ─── Main View ────────────────────────────────────────────────────────────────

export default function AnnouncementsView() {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [search, setSearch] = useState('');

  const filtered = ANNOUNCEMENTS
    .filter(a => {
      if (filter === 'university') return a.source === 'university';
      if (filter === 'course') return a.source === 'course';
      return true;
    })
    .filter(a => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.body.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q) ||
        (a.courseName && a.courseName.toLowerCase().includes(q))
      );
    });

  // Pinned first, then by date
  const sorted = [...filtered].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0; // preserve original order (already sorted by date)
  });

  const counts = {
    all: ANNOUNCEMENTS.length,
    university: ANNOUNCEMENTS.filter(a => a.source === 'university').length,
    course: ANNOUNCEMENTS.filter(a => a.source === 'course').length,
  };

  return (
    <div style={{ padding: '24px 48px 64px', maxWidth: 1400, width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <span className="label">Communication</span>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', margin: '4px 0 0' }}>
          Announcements
        </h1>
      </div>

      {/* Toolbar: Search + Filters */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, gap: 16 }}>
        {/* Search */}
        <div style={{ position: 'relative', width: 280 }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            placeholder="Search announcements..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '8px 10px 8px 32px',
              fontSize: 12, fontFamily: 'var(--font-sans)', fontWeight: 500,
              color: 'var(--text-primary)', background: '#fff',
              border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)',
              outline: 'none', boxSizing: 'border-box',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--text-tertiary)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 6 }}>
          {FILTERS.map(f => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                style={{
                  padding: '6px 14px',
                  fontSize: 11.5, fontWeight: 600,
                  fontFamily: 'var(--font-sans)',
                  background: active ? 'var(--text-primary)' : 'transparent',
                  color: active ? '#fff' : 'var(--text-tertiary)',
                  border: active ? 'none' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  transition: 'all 0.1s ease',
                }}
              >
                {f.label} <span style={{ opacity: 0.7, marginLeft: 2 }}>{counts[f.key]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Announcement Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sorted.length > 0 ? sorted.map(a => (
          <AnnouncementCard key={a.id} announcement={a} />
        )) : (
          <div style={{
            background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
            padding: '48px 20px', textAlign: 'center', color: 'var(--text-tertiary)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>No announcements found</div>
            <div style={{ fontSize: 12, fontWeight: 500 }}>Try adjusting your search or filter</div>
          </div>
        )}
      </div>
    </div>
  );
}
