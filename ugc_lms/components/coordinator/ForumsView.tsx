'use client';
import { useState } from 'react';
import { Search, MessageSquare, ChevronLeft } from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────

interface ForumThread {
  id: string;
  title: string;
  body: string;
  course: string;
  courseName: string;
  programme: string;
  author: string;
  authorInitials: string;
  postedAt: string;
  replies: number;
  lastReply?: string;
  lastReplyBy?: string;
  views: number;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────

const THREADS: ForumThread[] = [
  { id: 'f1', title: 'Doubt regarding Market Equilibrium in imperfect competition', body: 'In the lecture on oligopoly markets, we discussed Cournot and Bertrand models. How do we determine which model applies in real-world scenarios? The Indian telecom market seems to follow neither perfectly...', course: 'MBA-101', courseName: 'Managerial Economics', programme: 'MBA-26', author: 'Arjun Mehta', authorInitials: 'AM', postedAt: '2 hours ago', replies: 0, views: 12 },
  { id: 'f2', title: 'Clarification on End Sem syllabus — Units 4 & 5 included?', body: 'Are Units 4 and 5 (International Trade and Monetary Policy) part of the End Semester exam? The course outline mentions them but we haven\'t covered them in class yet.', course: 'MBA-101', courseName: 'Managerial Economics', programme: 'MBA-26', author: 'Priya Sharma', authorInitials: 'PS', postedAt: '5 hours ago', replies: 3, lastReply: '1 hour ago', lastReplyBy: 'Prof. Raghav Iyer', views: 45 },
  { id: 'f3', title: 'Assignment format — APA or Harvard referencing?', body: 'The assignment brief says "follow standard referencing" but doesn\'t specify which style. Previous assignments used APA but the new template looks like Harvard. Can someone clarify?', course: 'MBA-102', courseName: 'Managerial Communication', programme: 'MBA-26', author: 'Kavya Menon', authorInitials: 'KM', postedAt: '1 day ago', replies: 1, lastReply: '6 hours ago', lastReplyBy: 'Sneha Reddy', views: 28 },
  { id: 'f4', title: 'Balance Sheet doesn\'t tally — Practice Problem Set 3', body: 'In Problem 3 of the practice set, my trial balance shows a difference of Rs. 15,000. I\'ve checked all entries twice. Has anyone else faced this? Could there be an error in the problem statement?', course: 'MBA-103', courseName: 'Financial Accounting', programme: 'MBA-26', author: 'Rohan Gupta', authorInitials: 'RG', postedAt: '1 day ago', replies: 5, lastReply: '3 hours ago', lastReplyBy: 'Aisha Khan', views: 67 },
  { id: 'f5', title: 'Request to reschedule OB group presentation', body: 'Our group (Group 4) has 2 members with exam clashes on the scheduled presentation date (12 June). Can we present on 13 June instead? CC: Prof. Meera Nair', course: 'MBA-104', courseName: 'Organizational Behaviour', programme: 'MBA-26', author: 'Dev Malhotra', authorInitials: 'DM', postedAt: '2 days ago', replies: 0, views: 8 },
  { id: 'f7', title: 'Statistics formula sheet — allowed in exam?', body: 'Will we be provided a formula sheet during the End Semester exam, or do we need to memorize all formulas? The mid-sem had a formula sheet attached.', course: 'MBA-105', courseName: 'Business Statistics', programme: 'MBA-26', author: 'Siddharth Rao', authorInitials: 'SR', postedAt: '3 days ago', replies: 2, lastReply: '2 days ago', lastReplyBy: 'Prof. Anita Desai', views: 52 },
  { id: 'f8', title: 'Case Study Discussion — Tata Motors JLR Acquisition', body: 'Analyzing Tata Motors\' acquisition of Jaguar Land Rover — was the premium paid justified given the brand value and market access it provided? Share your analysis with supporting data.', course: 'MBA-101', courseName: 'Managerial Economics', programme: 'MBA-26', author: 'Arjun Mehta', authorInitials: 'AM', postedAt: '5 days ago', replies: 8, lastReply: '1 day ago', lastReplyBy: 'Kavya Menon', views: 89 },
  { id: 'f9', title: 'Data Structures — Linked List vs Array performance', body: 'Can someone explain when to use linked lists over arrays in practice? The textbook says O(1) insertion for linked lists but isn\'t memory allocation also a factor?', course: 'BCA-201', courseName: 'Data Structures', programme: 'BCA-26', author: 'Ananya Iyer', authorInitials: 'AI', postedAt: '3 days ago', replies: 4, lastReply: '1 day ago', lastReplyBy: 'Karthik Nair', views: 34 },
  { id: 'f10', title: 'Lab submission deadline — server was down', body: 'The submission portal was down on Saturday evening when many of us tried to upload. Can the deadline be extended? I have screenshots of the error.', course: 'BCA-201', courseName: 'Data Structures', programme: 'BCA-26', author: 'Karthik Nair', authorInitials: 'KN', postedAt: '4 days ago', replies: 1, lastReply: '3 days ago', lastReplyBy: 'Ananya Iyer', views: 19 },
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function ForumsView() {
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [programmeFilter, setProgrammeFilter] = useState('all');
  const [selectedThread, setSelectedThread] = useState<ForumThread | null>(null);
  const [replyText, setReplyText] = useState('');

  const uniqueCourses = [...new Map(THREADS.map(t => [t.course, { code: t.course, name: t.courseName }])).values()];

  const filtered = THREADS.filter(t => {
    if (courseFilter !== 'all' && t.course !== courseFilter) return false;
    if (programmeFilter !== 'all' && t.programme !== programmeFilter) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.author.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // ─── Thread Detail ──────────────────────────────────────────────────────
  if (selectedThread) {
    return (
      <div style={{ padding: '28px 40px', maxWidth: 860 }}>
        <button onClick={() => setSelectedThread(null)} style={{
          display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 600,
          color: 'var(--blue-700)', background: 'none', border: 'none', cursor: 'pointer',
          padding: 0, fontFamily: 'var(--font-sans)', marginBottom: 20,
        }}>
          <ChevronLeft size={15} /> Back to Forums
        </button>

        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid rgba(15,15,15,0.08)', padding: '28px 32px', marginBottom: 16 }}>
          {/* Course + meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--blue-700)', background: 'rgba(7,47,181,0.06)', padding: '3px 10px', borderRadius: 5, fontFamily: 'var(--font-mono)' }}>{selectedThread.course}</span>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{selectedThread.courseName}</span>
          </div>

          {/* Title */}
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', margin: '0 0 14px', lineHeight: 1.35 }}>{selectedThread.title}</h2>

          {/* Body */}
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>{selectedThread.body}</p>

          {/* Author footer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--bg-section)', border: '1px solid var(--border-subtle)', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)' }}>{selectedThread.authorInitials}</div>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{selectedThread.author}</span>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{selectedThread.postedAt}</span>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)', marginLeft: 'auto' }}>{selectedThread.views} views · {selectedThread.replies} replies</span>
          </div>
        </div>

        {/* Reply box */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid rgba(15,15,15,0.08)', padding: '22px 26px' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12, fontFamily: 'var(--font-display)' }}>Reply as Coordinator</div>
          <textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Type your response..." rows={4} style={{
            width: '100%', padding: '12px 14px', fontSize: 13,
            border: '1.5px solid transparent', borderRadius: 8, background: 'var(--bg-section)',
            fontFamily: 'var(--font-sans)', outline: 'none', resize: 'vertical', lineHeight: 1.65,
            boxSizing: 'border-box', transition: 'border-color 0.15s, background 0.15s',
          }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--blue-700)'; e.currentTarget.style.background = '#fff'; }}
            onBlur={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'var(--bg-section)'; }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
            <button style={{
              padding: '9px 24px', fontSize: 13, fontWeight: 700,
              color: '#fff', background: 'var(--blue-700)', border: 'none',
              borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font-sans)',
            }}>Post Reply</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Thread List ────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '28px 40px', maxWidth: 1000 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', margin: 0 }}>Forums</h1>
        <p style={{ fontSize: 13, color: 'var(--text-tertiary)', fontWeight: 500, marginTop: 5 }}>Student discussions across all courses</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        {/* Course filter */}
        <select value={courseFilter} onChange={e => setCourseFilter(e.target.value)} style={{
          padding: '8px 32px 8px 12px', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)',
          background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 8,
          fontFamily: 'var(--font-sans)', outline: 'none', cursor: 'pointer',
          appearance: 'none', WebkitAppearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
        }}>
          <option value="all">All Courses</option>
          {uniqueCourses.map(c => <option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}
        </select>

        {/* Programme filter */}
        <select value={programmeFilter} onChange={e => setProgrammeFilter(e.target.value)} style={{
          padding: '8px 32px 8px 12px', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)',
          background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 8,
          fontFamily: 'var(--font-sans)', outline: 'none', cursor: 'pointer',
          appearance: 'none', WebkitAppearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
        }}>
          <option value="all">All Programmes</option>
          <option value="MBA-26">MBA - Batch 2026</option>
          <option value="BCA-26">BCA - Batch 2026</option>
        </select>

        {/* Search */}
        <div style={{ position: 'relative', marginLeft: 'auto' }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search threads..." style={{
            width: 240, padding: '8px 14px 8px 34px', fontSize: 13, fontWeight: 500,
            border: '1px solid var(--border-subtle)', borderRadius: 8,
            background: '#fff', fontFamily: 'var(--font-sans)', outline: 'none', color: 'var(--text-primary)',
            transition: 'border-color 0.15s',
          }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--blue-700)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
          />
        </div>
      </div>

      {/* Thread list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map(thread => (
          <div key={thread.id} onClick={() => setSelectedThread(thread)} style={{
            background: '#fff', borderRadius: 12,
            border: '1px solid rgba(15,15,15,0.08)',
            padding: '18px 22px',
            cursor: 'pointer',
            display: 'flex', gap: 16, alignItems: 'flex-start',
            transition: 'box-shadow 0.12s, border-color 0.12s',
          }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = 'rgba(7,47,181,0.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(15,15,15,0.08)'; }}
          >
            {/* Avatar */}
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--bg-section)', border: '1.5px solid var(--border-subtle)',
              display: 'grid', placeItems: 'center',
              fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', flexShrink: 0, marginTop: 2,
            }}>
              {thread.authorInitials}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Course tag */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--blue-700)', background: 'rgba(7,47,181,0.05)', padding: '2px 8px', borderRadius: 4, fontFamily: 'var(--font-mono)' }}>{thread.course}</span>
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{thread.courseName}</span>
              </div>

              {/* Title */}
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', lineHeight: 1.35, marginBottom: 5, letterSpacing: '-0.01em' }}>{thread.title}</div>

              {/* Preview */}
              <div style={{ fontSize: 13, color: 'var(--text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 8 }}>{thread.body}</div>

              {/* Meta */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{thread.author}</span>
                <span style={{ color: 'var(--text-tertiary)' }}>{thread.postedAt}</span>
                {thread.lastReplyBy && (
                  <>
                    <span style={{ color: 'var(--text-tertiary)', opacity: 0.4 }}>·</span>
                    <span style={{ color: 'var(--text-tertiary)' }}>Last reply by <b style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{thread.lastReplyBy}</b> · {thread.lastReply}</span>
                  </>
                )}
              </div>
            </div>

            {/* Right: replies + views */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <MessageSquare size={13} style={{ color: 'var(--text-tertiary)' }} />
                <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{thread.replies}</span>
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{thread.views} views</span>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13 }}>
            No threads found
          </div>
        )}
      </div>

      {/* Footer count */}
      <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500 }}>
        {filtered.length} thread{filtered.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
