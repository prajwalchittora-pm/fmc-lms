'use client';
import { useState } from 'react';
import { Search, MessageSquare, Clock, ChevronRight, User, AlertCircle, CheckCircle2, Filter } from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────

type ThreadStatus = 'unanswered' | 'answered' | 'flagged';

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
  status: ThreadStatus;
  views: number;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────

const THREADS: ForumThread[] = [
  { id: 'f1', title: 'Doubt regarding Market Equilibrium in imperfect competition', body: 'In the lecture on oligopoly markets, we discussed Cournot and Bertrand models. How do we determine which model applies in real-world scenarios? The Indian telecom market seems to follow neither perfectly...', course: 'MBA-101', courseName: 'Managerial Economics', programme: 'MBA-26', author: 'Arjun Mehta', authorInitials: 'AM', postedAt: '2 hours ago', replies: 0, status: 'unanswered', views: 12 },
  { id: 'f2', title: 'Clarification on End Sem syllabus — Units 4 & 5 included?', body: 'Are Units 4 and 5 (International Trade and Monetary Policy) part of the End Semester exam? The course outline mentions them but we haven\'t covered them in class yet.', course: 'MBA-101', courseName: 'Managerial Economics', programme: 'MBA-26', author: 'Priya Sharma', authorInitials: 'PS', postedAt: '5 hours ago', replies: 3, lastReply: '1 hour ago', lastReplyBy: 'Prof. Raghav Iyer', status: 'answered', views: 45 },
  { id: 'f3', title: 'Assignment format — APA or Harvard referencing?', body: 'The assignment brief says "follow standard referencing" but doesn\'t specify which style. Previous assignments used APA but the new template looks like Harvard. Can someone clarify?', course: 'MBA-102', courseName: 'Managerial Communication', programme: 'MBA-26', author: 'Kavya Menon', authorInitials: 'KM', postedAt: '1 day ago', replies: 1, lastReply: '6 hours ago', lastReplyBy: 'Sneha Reddy', status: 'unanswered', views: 28 },
  { id: 'f4', title: 'Balance Sheet doesn\'t tally — Practice Problem Set 3', body: 'In Problem 3 of the practice set, my trial balance shows a difference of Rs. 15,000. I\'ve checked all entries twice. Has anyone else faced this? Could there be an error in the problem statement?', course: 'MBA-103', courseName: 'Financial Accounting', programme: 'MBA-26', author: 'Rohan Gupta', authorInitials: 'RG', postedAt: '1 day ago', replies: 5, lastReply: '3 hours ago', lastReplyBy: 'Aisha Khan', status: 'answered', views: 67 },
  { id: 'f5', title: 'Request to reschedule OB group presentation', body: 'Our group (Group 4) has 2 members with exam clashes on the scheduled presentation date (12 June). Can we present on 13 June instead? CC: Prof. Meera Nair', course: 'MBA-104', courseName: 'Organizational Behaviour', programme: 'MBA-26', author: 'Dev Malhotra', authorInitials: 'DM', postedAt: '2 days ago', replies: 0, status: 'unanswered', views: 8 },
  { id: 'f6', title: 'Inappropriate language in discussion', body: '[Content flagged by system] A student has used inappropriate language while responding to a peer\'s comment in the case study discussion thread.', course: 'MBA-104', courseName: 'Organizational Behaviour', programme: 'MBA-26', author: 'System', authorInitials: '!', postedAt: '2 days ago', replies: 0, status: 'flagged', views: 3 },
  { id: 'f7', title: 'Statistics formula sheet — allowed in exam?', body: 'Will we be provided a formula sheet during the End Semester exam, or do we need to memorize all formulas? The mid-sem had a formula sheet attached.', course: 'MBA-105', courseName: 'Business Statistics', programme: 'MBA-26', author: 'Siddharth Rao', authorInitials: 'SR', postedAt: '3 days ago', replies: 2, lastReply: '2 days ago', lastReplyBy: 'Prof. Anita Desai', status: 'answered', views: 52 },
  { id: 'f8', title: 'Case Study Discussion — Tata Motors JLR Acquisition', body: 'Analyzing Tata Motors\' acquisition of Jaguar Land Rover — was the premium paid justified given the brand value and market access it provided? Share your analysis with supporting data.', course: 'MBA-101', courseName: 'Managerial Economics', programme: 'MBA-26', author: 'Arjun Mehta', authorInitials: 'AM', postedAt: '5 days ago', replies: 8, lastReply: '1 day ago', lastReplyBy: 'Kavya Menon', status: 'answered', views: 89 },
  { id: 'f9', title: 'Data Structures — Linked List vs Array performance', body: 'Can someone explain when to use linked lists over arrays in practice? The textbook says O(1) insertion for linked lists but isn\'t memory allocation also a factor?', course: 'BCA-201', courseName: 'Data Structures', programme: 'BCA-26', author: 'Ananya Iyer', authorInitials: 'AI', postedAt: '3 days ago', replies: 4, lastReply: '1 day ago', lastReplyBy: 'Karthik Nair', status: 'answered', views: 34 },
  { id: 'f10', title: 'Lab submission deadline — server was down', body: 'The submission portal was down on Saturday evening when many of us tried to upload. Can the deadline be extended? I have screenshots of the error.', course: 'BCA-201', courseName: 'Data Structures', programme: 'BCA-26', author: 'Karthik Nair', authorInitials: 'KN', postedAt: '4 days ago', replies: 1, lastReply: '3 days ago', lastReplyBy: 'Ananya Iyer', status: 'unanswered', views: 19 },
];

const STATUS_CONFIG: Record<ThreadStatus, { label: string; color: string; bg: string }> = {
  unanswered: { label: 'Needs Response', color: '#D97706', bg: 'rgba(217,119,6,0.06)' },
  answered: { label: 'Answered', color: '#059669', bg: 'rgba(5,150,105,0.06)' },
  flagged: { label: 'Flagged', color: '#DC2626', bg: 'rgba(220,38,38,0.06)' },
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function ForumsView() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ThreadStatus | 'all'>('all');
  const [programmeFilter, setProgrammeFilter] = useState('all');
  const [selectedThread, setSelectedThread] = useState<ForumThread | null>(null);
  const [replyText, setReplyText] = useState('');

  const filtered = THREADS.filter(t => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (programmeFilter !== 'all' && t.programme !== programmeFilter) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.course.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const unansweredCount = THREADS.filter(t => t.status === 'unanswered').length;
  const flaggedCount = THREADS.filter(t => t.status === 'flagged').length;

  if (selectedThread) {
    const sc = STATUS_CONFIG[selectedThread.status];
    return (
      <div style={{ padding: '28px 40px' }}>
        <button onClick={() => setSelectedThread(null)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: 'var(--blue-700)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-sans)', marginBottom: 20 }}>&larr; Back to Forums</button>

        <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', padding: '24px 28px', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--blue-700)', background: 'rgba(7,47,181,0.06)', padding: '2px 8px', borderRadius: 'var(--radius-xs)', fontFamily: 'var(--font-mono)' }}>{selectedThread.course}</span>
            <span style={{ fontSize: 10.5, fontWeight: 600, color: sc.color, background: sc.bg, padding: '2px 8px', borderRadius: 'var(--radius-xs)' }}>{sc.label}</span>
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', margin: '0 0 10px' }}>{selectedThread.title}</h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>{selectedThread.body}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(0,0,0,0.04)' }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--bg-section)', border: '1px solid var(--border-subtle)', display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 700, color: 'var(--text-secondary)' }}>{selectedThread.authorInitials}</div>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{selectedThread.author}</span>
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{selectedThread.postedAt}</span>
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)', marginLeft: 'auto' }}>{selectedThread.views} views &middot; {selectedThread.replies} replies</span>
          </div>
        </div>

        {/* Reply box */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', padding: '20px 24px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Reply as Coordinator</div>
          <textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Type your response..." rows={4} style={{ width: '100%', padding: '10px 12px', fontSize: 13, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)', outline: 'none', resize: 'vertical', lineHeight: 1.6 }} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
            <button style={{ padding: '8px 20px', fontSize: 13, fontWeight: 600, color: '#fff', background: 'var(--blue-700)', border: '1px solid var(--blue-700)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Post Reply</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '28px 40px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', margin: 0 }}>Forums</h1>
        <p style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500, marginTop: 4 }}>Monitor and respond to student discussions across programmes</p>
      </div>

      {/* Status summary */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div style={{ background: 'rgba(217,119,6,0.04)', border: '1px solid rgba(217,119,6,0.12)', borderRadius: 'var(--radius-sm)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertCircle size={14} style={{ color: '#D97706' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#D97706' }}>{unansweredCount} unanswered</span>
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>threads need your attention</span>
        </div>
        {flaggedCount > 0 && (
          <div style={{ background: 'rgba(220,38,38,0.04)', border: '1px solid rgba(220,38,38,0.12)', borderRadius: 'var(--radius-sm)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={14} style={{ color: '#DC2626' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#DC2626' }}>{flaggedCount} flagged</span>
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>for moderation</span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        {(['all', 'unanswered', 'flagged', 'answered'] as const).map(status => {
          const isActive = statusFilter === status;
          const label = status === 'all' ? 'All Threads' : status === 'unanswered' ? 'Needs Response' : status === 'flagged' ? 'Flagged' : 'Answered';
          return (
            <button key={status} onClick={() => setStatusFilter(status)} style={{
              padding: '5px 12px', fontSize: 11.5, fontWeight: isActive ? 700 : 500,
              color: isActive ? '#fff' : 'var(--text-secondary)',
              background: isActive ? 'var(--blue-700)' : '#fff',
              border: isActive ? '1px solid var(--blue-700)' : '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)',
            }}>{label}</button>
          );
        })}
        <span style={{ width: 1, height: 20, background: 'var(--border-subtle)', margin: '0 4px' }} />
        <select value={programmeFilter} onChange={e => setProgrammeFilter(e.target.value)} style={{
          padding: '5px 28px 5px 10px', fontSize: 11.5, fontWeight: 500, color: 'var(--text-secondary)',
          background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)',
          fontFamily: 'var(--font-sans)', outline: 'none', cursor: 'pointer',
          appearance: 'none', WebkitAppearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
        }}>
          <option value="all">All Programmes</option>
          <option value="MBA-26">MBA - Batch 2026</option>
          <option value="BCA-26">BCA - Batch 2026</option>
        </select>
        <div style={{ position: 'relative', marginLeft: 'auto' }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search threads..." style={{
            width: 200, padding: '5px 10px 5px 30px', fontSize: 12, fontWeight: 500,
            border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)',
            background: '#fff', fontFamily: 'var(--font-sans)', outline: 'none', color: 'var(--text-primary)',
          }} />
        </div>
      </div>

      {/* Thread list */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
        {filtered.map((thread, i) => {
          const sc = STATUS_CONFIG[thread.status];
          return (
            <div key={thread.id} onClick={() => setSelectedThread(thread)} style={{
              padding: '16px 20px', cursor: 'pointer',
              borderBottom: i < filtered.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
              background: thread.status === 'flagged' ? 'rgba(220,38,38,0.02)' : thread.status === 'unanswered' ? 'rgba(217,119,6,0.01)' : 'transparent',
              display: 'flex', gap: 14, alignItems: 'flex-start',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.015)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = thread.status === 'flagged' ? 'rgba(220,38,38,0.02)' : thread.status === 'unanswered' ? 'rgba(217,119,6,0.01)' : 'transparent'; }}
            >
              {/* Avatar */}
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: thread.status === 'flagged' ? 'rgba(220,38,38,0.08)' : 'var(--bg-section)', border: '1px solid var(--border-subtle)', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 700, color: thread.status === 'flagged' ? '#DC2626' : 'var(--text-secondary)', flexShrink: 0, marginTop: 2 }}>
                {thread.authorInitials}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--blue-700)', background: 'rgba(7,47,181,0.06)', padding: '1px 6px', borderRadius: 'var(--radius-xs)', fontFamily: 'var(--font-mono)' }}>{thread.course}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: sc.color, background: sc.bg, padding: '1px 6px', borderRadius: 'var(--radius-xs)' }}>{sc.label}</span>
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 4 }}>{thread.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{thread.body}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)' }}>{thread.author}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{thread.postedAt}</span>
                  {thread.lastReplyBy && (
                    <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Last reply by <b style={{ color: 'var(--text-secondary)' }}>{thread.lastReplyBy}</b> &middot; {thread.lastReply}</span>
                  )}
                </div>
              </div>

              {/* Right meta */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MessageSquare size={12} style={{ color: 'var(--text-tertiary)' }} />
                  <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-mono)', color: thread.replies === 0 ? '#D97706' : 'var(--text-secondary)' }}>{thread.replies}</span>
                </div>
                <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{thread.views} views</span>
              </div>
            </div>
          );
        })}
        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border-subtle)', fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>
          {filtered.length} threads shown
        </div>
      </div>
    </div>
  );
}
