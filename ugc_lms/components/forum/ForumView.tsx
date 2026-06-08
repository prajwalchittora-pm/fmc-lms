'use client';
import { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  MessageSquare,
  Pin,
  ThumbsUp,
  Reply,
  Clock,
  Plus,
  X,
  ChevronDown,
  Send,
  Users,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Author {
  name: string;
  initials: string;
  role: 'student' | 'faculty' | 'ta';
  color: string;
}

interface ForumReply {
  id: string;
  author: Author;
  body: string;
  date: string;
  likes: number;
  children?: ForumReply[];
}

interface ForumThread {
  id: string;
  forumId: string;
  title: string;
  author: Author;
  body: string;
  date: string;
  isPinned: boolean;
  isUnread: boolean;
  likes: number;
  replyCount: number;
  lastReplyAuthor?: string;
  lastReplyDate?: string;
  replies: ForumReply[];
}

interface Forum {
  id: string;
  title: string;
  description: string;
  courseCode?: string;
  courseName?: string;
  threadCount: number;
  lastActivity: string;
}

type SortKey = 'latest' | 'newest' | 'replies';
type View = 'forumList' | 'threadList' | 'threadDetail';

// ─── Mock Authors ─────────────────────────────────────────────────────────────

const AUTHORS: Record<string, Author> = {
  profSharma:   { name: 'Prof. Sharma',     initials: 'PS', role: 'faculty', color: '#072FB5' },
  profMehta:    { name: 'Prof. Mehta',       initials: 'PM', role: 'faculty', color: '#7C3AED' },
  profDesai:    { name: 'Prof. Desai',       initials: 'PD', role: 'faculty', color: '#0D7377' },
  profKapoor:   { name: 'Prof. Kapoor',      initials: 'PK', role: 'faculty', color: '#8F3B00' },
  rahul:        { name: 'Rahul Verma',       initials: 'RV', role: 'student', color: '#D97706' },
  priya:        { name: 'Priya Nair',        initials: 'PN', role: 'student', color: '#DC2626' },
  ankit:        { name: 'Ankit Singh',       initials: 'AS', role: 'student', color: '#16A34A' },
  sneha:        { name: 'Sneha Patel',       initials: 'SP', role: 'student', color: '#9333EA' },
  vikram:       { name: 'Vikram Rao',        initials: 'VR', role: 'student', color: '#0EA5E9' },
  meera:        { name: 'Meera Iyer',        initials: 'MI', role: 'student', color: '#E11D48' },
  arjun:        { name: 'Arjun Khanna',      initials: 'AK', role: 'student', color: '#059669' },
  deepika:      { name: 'Deepika Joshi',     initials: 'DJ', role: 'student', color: '#7C3AED' },
  taAssist:     { name: 'Kavya R. (TA)',     initials: 'KR', role: 'ta',      color: '#FF6A00' },
};

// ─── Mock Forums ──────────────────────────────────────────────────────────────

const FORUMS: Forum[] = [
  {
    id: 'general',
    title: 'General Discussion',
    description: 'Open space for general academic discussions, introductions, and campus life.',
    threadCount: 12,
    lastActivity: '2 hours ago',
  },
  {
    id: 'mba101',
    title: 'Managerial Economics Forum',
    description: 'Discuss concepts, case studies, and assignments related to Managerial Economics.',
    courseCode: 'MBA-101',
    courseName: 'Managerial Economics',
    threadCount: 8,
    lastActivity: '5 hours ago',
  },
  {
    id: 'mba102',
    title: 'Managerial Communication Forum',
    description: 'Share insights on presentations, business writing, and communication frameworks.',
    courseCode: 'MBA-102',
    courseName: 'Managerial Communication',
    threadCount: 5,
    lastActivity: '1 day ago',
  },
  {
    id: 'mba103',
    title: 'Financial Accounting Forum',
    description: 'Doubts, discussions, and resources for Financial Accounting coursework.',
    courseCode: 'MBA-103',
    courseName: 'Financial Accounting',
    threadCount: 6,
    lastActivity: '3 days ago',
  },
];

// ─── Mock Threads ─────────────────────────────────────────────────────────────

const THREADS: ForumThread[] = [
  // General Discussion threads
  {
    id: 't1',
    forumId: 'general',
    title: 'Welcome & Introductions',
    author: AUTHORS.profSharma,
    body: 'Welcome to the MBA Programme! This is the place to introduce yourselves. Please share your name, background, and what you hope to gain from this programme. Looking forward to a great semester with all of you.\n\nFeel free to connect with your peers and build your network early on. Collaboration is key to your MBA journey.',
    date: 'Jan 15, 2026',
    isPinned: true,
    isUnread: true,
    likes: 18,
    replyCount: 24,
    lastReplyAuthor: 'Sneha Patel',
    lastReplyDate: '2 hours ago',
    replies: [
      {
        id: 'r1',
        author: AUTHORS.rahul,
        body: 'Hi everyone! I\'m Rahul Verma, coming from a 3-year stint in IT consulting at Deloitte. Excited to pivot into strategy and general management. Looking forward to learning together!',
        date: 'Jan 15, 2026',
        likes: 7,
        children: [
          {
            id: 'r1a',
            author: AUTHORS.priya,
            body: 'Hey Rahul! I\'m also from a consulting background (BCG). Would love to connect and share notes on the transition from consulting to general management.',
            date: 'Jan 15, 2026',
            likes: 3,
          },
          {
            id: 'r1b',
            author: AUTHORS.rahul,
            body: 'Absolutely, Priya! Let\'s set up a study group. I think there are a few more people from consulting backgrounds in our batch.',
            date: 'Jan 16, 2026',
            likes: 2,
          },
        ],
      },
      {
        id: 'r2',
        author: AUTHORS.sneha,
        body: 'Hi all! Sneha Patel here. I worked in product management at a fintech startup for 2 years. Super excited about the economics and finance courses. Anyone else interested in the fintech space?',
        date: 'Jan 15, 2026',
        likes: 5,
        children: [
          {
            id: 'r2a',
            author: AUTHORS.vikram,
            body: 'Hey Sneha! Vikram here. I\'m from the banking sector and very much into fintech disruption. Count me in for any fintech discussions!',
            date: 'Jan 16, 2026',
            likes: 4,
          },
        ],
      },
      {
        id: 'r3',
        author: AUTHORS.ankit,
        body: 'Hello everyone! Ankit Singh, fresh out of engineering (NIT Trichy). This is my first exposure to management studies, so I\'m looking forward to a steep learning curve. Any tips from seniors would be amazing.',
        date: 'Jan 16, 2026',
        likes: 6,
      },
      {
        id: 'r4',
        author: AUTHORS.meera,
        body: 'Welcome to all! I\'m Meera, and I\'ve been working in HR for 4 years. Excited to broaden my perspective with economics and strategy courses. Let\'s make the most of this cohort!',
        date: 'Jan 17, 2026',
        likes: 4,
        children: [
          {
            id: 'r4a',
            author: AUTHORS.taAssist,
            body: 'Great to see such diverse backgrounds in this batch! As your TA, I\'m here to help with any academic queries. Don\'t hesitate to reach out. Office hours are Tuesdays and Thursdays, 4-5 PM.',
            date: 'Jan 17, 2026',
            likes: 8,
          },
        ],
      },
      {
        id: 'r5',
        author: AUTHORS.deepika,
        body: 'Hi everyone! Deepika Joshi from the media industry. 5 years in advertising. Looking forward to the marketing and communication courses especially. Let\'s connect!',
        date: 'Jan 18, 2026',
        likes: 3,
      },
    ],
  },
  {
    id: 't2',
    forumId: 'general',
    title: 'Study Group for Mid-Sems',
    author: AUTHORS.ankit,
    body: 'Hey folks, mid-sems are around the corner. Anyone interested in forming a study group? We could divide topics and share notes. I\'m thinking we meet online twice a week starting next Monday.',
    date: 'Feb 20, 2026',
    isPinned: false,
    isUnread: true,
    likes: 9,
    replyCount: 8,
    lastReplyAuthor: 'Vikram Rao',
    lastReplyDate: '6 hours ago',
    replies: [
      {
        id: 'r6',
        author: AUTHORS.priya,
        body: 'I\'m in! Can we focus on Managerial Economics first? That\'s where I need the most help.',
        date: 'Feb 20, 2026',
        likes: 4,
      },
      {
        id: 'r7',
        author: AUTHORS.vikram,
        body: 'Count me in. I can help with the finance-related topics. Let\'s use the shared drive for notes.',
        date: 'Feb 21, 2026',
        likes: 3,
      },
    ],
  },
  {
    id: 't3',
    forumId: 'general',
    title: 'Library Access Issues',
    author: AUTHORS.meera,
    body: 'Is anyone else having trouble accessing the digital library? I keep getting an authentication error when trying to download journal articles. Has anyone found a workaround?',
    date: 'Mar 5, 2026',
    isPinned: false,
    isUnread: false,
    likes: 2,
    replyCount: 3,
    lastReplyAuthor: 'Kavya R. (TA)',
    lastReplyDate: '2 days ago',
    replies: [
      {
        id: 'r8',
        author: AUTHORS.arjun,
        body: 'Same issue here. I think it might be a VPN problem. Try connecting through the university VPN first.',
        date: 'Mar 5, 2026',
        likes: 2,
      },
      {
        id: 'r9',
        author: AUTHORS.taAssist,
        body: 'Hi everyone, I\'ve reported this to the IT team. They\'re working on a fix. In the meantime, you can access the library through the direct link: library.university.edu/access. Use your student ID as credentials.',
        date: 'Mar 6, 2026',
        likes: 5,
      },
    ],
  },
  {
    id: 't4',
    forumId: 'general',
    title: 'Placement Preparation Tips',
    author: AUTHORS.vikram,
    body: 'For those thinking ahead about placements, I\'ve compiled a list of resources that helped me prepare for consulting interviews in my previous job hunt. Happy to share and discuss strategies.',
    date: 'Mar 12, 2026',
    isPinned: false,
    isUnread: false,
    likes: 14,
    replyCount: 15,
    lastReplyAuthor: 'Priya Nair',
    lastReplyDate: '1 day ago',
    replies: [
      {
        id: 'r10',
        author: AUTHORS.rahul,
        body: 'This is super helpful, Vikram! Can you also share any mock interview platforms you\'d recommend?',
        date: 'Mar 12, 2026',
        likes: 3,
      },
      {
        id: 'r11',
        author: AUTHORS.sneha,
        body: 'Thanks for sharing! For product management roles, I\'d recommend also checking out PM interview prep communities. Happy to share my resources too.',
        date: 'Mar 13, 2026',
        likes: 6,
      },
    ],
  },
  // MBA-101 threads
  {
    id: 't5',
    forumId: 'mba101',
    title: 'Elasticity of Demand - Doubts',
    author: AUTHORS.ankit,
    body: 'Can someone explain the difference between point elasticity and arc elasticity with a practical example? The textbook explanation is a bit confusing.',
    date: 'Feb 10, 2026',
    isPinned: false,
    isUnread: true,
    likes: 4,
    replyCount: 6,
    lastReplyAuthor: 'Prof. Sharma',
    lastReplyDate: '1 day ago',
    replies: [],
  },
  {
    id: 't6',
    forumId: 'mba101',
    title: 'Case Study Discussion: Market Structures',
    author: AUTHORS.profSharma,
    body: 'Please share your analysis of the assigned case study on market structures. Focus on identifying the type of market and its implications for pricing strategy.',
    date: 'Feb 25, 2026',
    isPinned: true,
    isUnread: false,
    likes: 7,
    replyCount: 12,
    lastReplyAuthor: 'Sneha Patel',
    lastReplyDate: '5 hours ago',
    replies: [],
  },
  // MBA-102 threads
  {
    id: 't7',
    forumId: 'mba102',
    title: 'Presentation Tips for Module 3',
    author: AUTHORS.profMehta,
    body: 'Sharing some guidelines for the upcoming presentations. Remember: clarity over complexity. Your audience is your classmates, not a journal reviewer.',
    date: 'Mar 1, 2026',
    isPinned: true,
    isUnread: false,
    likes: 11,
    replyCount: 4,
    lastReplyAuthor: 'Deepika Joshi',
    lastReplyDate: '3 days ago',
    replies: [],
  },
  // MBA-103 threads
  {
    id: 't8',
    forumId: 'mba103',
    title: 'Balance Sheet Homework Help',
    author: AUTHORS.deepika,
    body: 'I\'m struggling with the balance sheet reconciliation exercise from Module 2. Can anyone walk me through the approach for handling deferred revenue entries?',
    date: 'Mar 8, 2026',
    isPinned: false,
    isUnread: true,
    likes: 3,
    replyCount: 5,
    lastReplyAuthor: 'Arjun Khanna',
    lastReplyDate: '12 hours ago',
    replies: [],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ROLE_LABELS: Record<string, string> = {
  faculty: 'Faculty',
  ta: 'Teaching Assistant',
  student: 'Student',
};

function Avatar({ author, size = 36 }: { author: Author; size?: number }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: author.color,
      display: 'grid',
      placeItems: 'center',
      fontSize: size * 0.33,
      fontWeight: 700,
      color: '#fff',
      fontFamily: 'var(--font-sans)',
      flexShrink: 0,
      letterSpacing: '0.02em',
    }}>
      {author.initials}
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const isSpecial = role === 'faculty' || role === 'ta';
  if (!isSpecial) return null;
  return (
    <span style={{
      fontSize: 10,
      fontWeight: 700,
      padding: '2px 7px',
      borderRadius: 'var(--radius-xs)',
      background: role === 'faculty' ? 'rgba(7,47,181,0.08)' : 'rgba(255,106,0,0.08)',
      color: role === 'faculty' ? '#072FB5' : '#FF6A00',
      letterSpacing: '0.03em',
      textTransform: 'uppercase',
      fontFamily: 'var(--font-mono)',
    }}>
      {ROLE_LABELS[role]}
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ForumView() {
  const [view, setView] = useState<View>('forumList');
  const [activeForum, setActiveForum] = useState<Forum | null>(null);
  const [activeThread, setActiveThread] = useState<ForumThread | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('latest');
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [sortOpen, setSortOpen] = useState(false);

  // ── Derived data ──
  const forumThreads = useMemo(() => {
    if (!activeForum) return [];
    let threads = THREADS.filter(t => t.forumId === activeForum.id);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      threads = threads.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.author.name.toLowerCase().includes(q) ||
        t.body.toLowerCase().includes(q)
      );
    }

    // Pinned first, then sort
    const pinned = threads.filter(t => t.isPinned);
    const unpinned = threads.filter(t => !t.isPinned);

    const sortFn = (a: ForumThread, b: ForumThread) => {
      if (sortKey === 'replies') return b.replyCount - a.replyCount;
      if (sortKey === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
      // latest activity (default)
      return 0; // already in mock order (latest first)
    };

    return [...pinned.sort(sortFn), ...unpinned.sort(sortFn)];
  }, [activeForum, searchQuery, sortKey]);

  const generalForums = FORUMS.filter(f => !f.courseCode);
  const courseForums = FORUMS.filter(f => f.courseCode);

  // ── Navigation handlers ──
  const openForum = (forum: Forum) => {
    setActiveForum(forum);
    setView('threadList');
    setSearchQuery('');
    setSortKey('latest');
  };

  const openThread = (thread: ForumThread) => {
    setActiveThread(thread);
    setView('threadDetail');
    setReplyText('');
    setReplyingTo(null);
  };

  const goBackToForums = () => {
    setView('forumList');
    setActiveForum(null);
    setActiveThread(null);
  };

  const goBackToThreads = () => {
    setView('threadList');
    setActiveThread(null);
    setReplyText('');
    setReplyingTo(null);
  };

  const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: 'latest', label: 'Latest Activity' },
    { key: 'newest', label: 'Newest First' },
    { key: 'replies', label: 'Most Replies' },
  ];

  // ── Render Reply (recursive) ──
  function renderReply(reply: ForumReply, depth: number = 0) {
    const isNested = depth > 0;
    return (
      <div key={reply.id} style={{
        marginLeft: isNested ? 24 : 0,
        borderLeft: isNested ? '2px solid var(--border-subtle)' : 'none',
        paddingLeft: isNested ? 20 : 0,
        marginTop: isNested ? 0 : 0,
      }}>
        <div style={{
          padding: '16px 0',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          {/* Reply header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <Avatar author={reply.author} size={30} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                {reply.author.name}
              </span>
              <RoleBadge role={reply.author.role} />
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{reply.date}</span>
            </div>
          </div>

          {/* Reply body */}
          <div style={{
            fontSize: 13.5,
            lineHeight: 1.65,
            color: 'var(--text-secondary)',
            marginBottom: 10,
            paddingLeft: 40,
          }}>
            {reply.body}
          </div>

          {/* Reply actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingLeft: 40 }}>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, color: 'var(--text-tertiary)', fontFamily: 'var(--font-sans)',
              padding: '2px 0',
            }}>
              <ThumbsUp size={12} strokeWidth={2} />
              <span>{reply.likes}</span>
            </button>
            {depth < 1 && (
              <button
                onClick={() => setReplyingTo(replyingTo === reply.id ? null : reply.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 12, color: 'var(--text-tertiary)', fontFamily: 'var(--font-sans)',
                  padding: '2px 0',
                }}
              >
                <Reply size={12} strokeWidth={2} />
                <span>Reply</span>
              </button>
            )}
          </div>

          {/* Inline reply box */}
          {replyingTo === reply.id && (
            <div style={{ marginTop: 12, paddingLeft: 40, display: 'flex', gap: 8 }}>
              <input
                type="text"
                placeholder={`Reply to ${reply.author.name}...`}
                style={{
                  flex: 1, padding: '8px 12px', fontSize: 13,
                  border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)',
                  background: '#fff', fontFamily: 'var(--font-sans)',
                  outline: 'none',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#072FB5'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
              />
              <button style={{
                padding: '8px 14px', background: 'var(--blue-700)', color: '#fff',
                border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-sans)',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <Send size={12} />
              </button>
            </div>
          )}
        </div>

        {/* Nested replies */}
        {reply.children?.map(child => renderReply(child, depth + 1))}
      </div>
    );
  }

  // ── FORUM LIST VIEW ──
  function renderForumList() {
    return (
      <>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <span className="label">Community</span>
          <h1 style={{
            fontSize: 24, fontWeight: 800, color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', margin: '4px 0 0',
          }}>
            Discussion Forums
          </h1>
        </div>

        {/* General Forums */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: 'var(--text-tertiary)',
            marginBottom: 12, fontFamily: 'var(--font-mono)',
          }}>
            General
          </div>
          {generalForums.map(forum => (
            <ForumCard key={forum.id} forum={forum} onClick={() => openForum(forum)} />
          ))}
        </div>

        {/* Course Forums */}
        <div>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: 'var(--text-tertiary)',
            marginBottom: 12, fontFamily: 'var(--font-mono)',
          }}>
            Course Forums
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {courseForums.map(forum => (
              <ForumCard key={forum.id} forum={forum} onClick={() => openForum(forum)} />
            ))}
          </div>
        </div>
      </>
    );
  }

  // ── Forum Card ──
  function ForumCard({ forum, onClick }: { forum: Forum; onClick: () => void }) {
    return (
      <div
        onClick={onClick}
        style={{
          background: '#fff',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '18px 22px',
          cursor: 'pointer',
          transition: 'box-shadow 0.12s ease, border-color 0.12s ease',
          marginBottom: 8,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          e.currentTarget.style.borderColor = 'rgba(7,47,181,0.2)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.borderColor = 'var(--border-subtle)';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              {forum.courseCode && (
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 8px',
                  background: 'var(--bg-section)', border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xs)', color: 'var(--text-tertiary)',
                  fontFamily: 'var(--font-mono)', letterSpacing: '0.04em',
                }}>
                  {forum.courseCode}
                </span>
              )}
              {forum.courseName && (
                <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500 }}>
                  {forum.courseName}
                </span>
              )}
            </div>
            <div style={{
              fontSize: 16, fontWeight: 700, color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)', letterSpacing: '-0.01em', marginBottom: 4,
            }}>
              {forum.title}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
              {forum.description}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0, paddingTop: forum.courseCode ? 6 : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <MessageSquare size={13} strokeWidth={2} style={{ color: 'var(--text-tertiary)' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                {forum.threadCount}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>threads</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Clock size={12} strokeWidth={2} style={{ color: 'var(--text-tertiary)', opacity: 0.7 }} />
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{forum.lastActivity}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── THREAD LIST VIEW ──
  function renderThreadList() {
    if (!activeForum) return null;

    return (
      <>
        {/* Back + Header */}
        <div style={{ marginBottom: 24 }}>
          <button
            onClick={goBackToForums}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)',
              fontFamily: 'var(--font-sans)', padding: '0 0 12px',
              transition: 'color 0.1s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)'; }}
          >
            <ArrowLeft size={14} strokeWidth={2} />
            Back to Forums
          </button>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              {activeForum.courseCode && (
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 8px',
                  background: 'var(--bg-section)', border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xs)', color: 'var(--text-tertiary)',
                  fontFamily: 'var(--font-mono)', letterSpacing: '0.04em',
                  marginBottom: 6, display: 'inline-block',
                }}>
                  {activeForum.courseCode}
                </span>
              )}
              <h1 style={{
                fontSize: 22, fontWeight: 800, color: 'var(--text-primary)',
                fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', margin: '6px 0 4px',
              }}>
                {activeForum.title}
              </h1>
              <p style={{ fontSize: 13, color: 'var(--text-tertiary)', margin: 0, lineHeight: 1.5 }}>
                {activeForum.description}
              </p>
            </div>
            <button
              onClick={() => setShowNewDiscussion(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '9px 18px', background: 'var(--blue-700)', color: '#fff',
                border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-sans)',
                flexShrink: 0, whiteSpace: 'nowrap',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--blue-800)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--blue-700)'; }}
            >
              <Plus size={14} strokeWidth={2.5} />
              New Discussion
            </button>
          </div>
        </div>

        {/* Search + Sort */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 8,
            background: '#fff', border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)', padding: '8px 12px',
          }}>
            <Search size={14} strokeWidth={2} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search threads..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                flex: 1, border: 'none', outline: 'none', fontSize: 13,
                color: 'var(--text-primary)', fontFamily: 'var(--font-sans)',
                background: 'transparent',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
              >
                <X size={13} style={{ color: 'var(--text-tertiary)' }} />
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setSortOpen(!sortOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 12px', background: '#fff',
                border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)',
                cursor: 'pointer', fontSize: 12, fontWeight: 600,
                color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)',
                whiteSpace: 'nowrap',
              }}
            >
              {SORT_OPTIONS.find(o => o.key === sortKey)?.label}
              <ChevronDown size={12} strokeWidth={2} style={{ color: 'var(--text-tertiary)', transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
            </button>
            {sortOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 4px)', right: 0,
                background: '#fff', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-md)',
                zIndex: 20, overflow: 'hidden', minWidth: 160,
              }}>
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => { setSortKey(opt.key); setSortOpen(false); }}
                    style={{
                      display: 'block', width: '100%', padding: '9px 14px',
                      border: 'none', background: sortKey === opt.key ? 'var(--bg-section)' : 'transparent',
                      cursor: 'pointer', fontSize: 12, fontWeight: sortKey === opt.key ? 700 : 500,
                      color: 'var(--text-primary)', fontFamily: 'var(--font-sans)',
                      textAlign: 'left', transition: 'background 0.1s ease',
                    }}
                    onMouseEnter={e => { if (sortKey !== opt.key) e.currentTarget.style.background = 'var(--bg-section)'; }}
                    onMouseLeave={e => { if (sortKey !== opt.key) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Thread count */}
        <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 12, fontWeight: 500 }}>
          {forumThreads.length} thread{forumThreads.length !== 1 ? 's' : ''}
        </div>

        {/* Thread list */}
        <div style={{
          background: '#fff', border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)', overflow: 'hidden',
        }}>
          {forumThreads.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <MessageSquare size={28} style={{ color: 'var(--text-tertiary)', opacity: 0.3, margin: '0 auto 12px' }} />
              <div style={{ fontSize: 14, color: 'var(--text-tertiary)', fontWeight: 500 }}>No threads found</div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', opacity: 0.7, marginTop: 4 }}>
                {searchQuery ? 'Try a different search term' : 'Start the first discussion!'}
              </div>
            </div>
          ) : (
            forumThreads.map((thread, i) => (
              <div
                key={thread.id}
                onClick={() => openThread(thread)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 20px',
                  borderBottom: i < forumThreads.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  cursor: 'pointer',
                  transition: 'background 0.1s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-section)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                {/* Unread dot */}
                <div style={{ width: 8, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
                  {thread.isUnread && (
                    <div style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: '#FF6A00',
                    }} />
                  )}
                </div>

                {/* Avatar */}
                <Avatar author={thread.author} size={34} />

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    {thread.isPinned && (
                      <Pin size={11} strokeWidth={2.5} style={{ color: '#FF6A00', transform: 'rotate(45deg)', flexShrink: 0 }} />
                    )}
                    <span style={{
                      fontSize: 14, fontWeight: 700, color: 'var(--text-primary)',
                      fontFamily: 'var(--font-display)', letterSpacing: '-0.01em',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {thread.title}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {thread.author.name}
                    </span>
                    <RoleBadge role={thread.author.role} />
                    <span style={{ fontSize: 10, color: 'var(--text-tertiary)', opacity: 0.5 }}>{'·'}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{thread.date}</span>
                  </div>
                </div>

                {/* Reply info */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MessageSquare size={12} strokeWidth={2} style={{ color: 'var(--text-tertiary)' }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                      {thread.replyCount}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>replies</span>
                  </div>
                  {thread.lastReplyAuthor && (
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                      Last: {thread.lastReplyAuthor}, {thread.lastReplyDate}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </>
    );
  }

  // ── THREAD DETAIL VIEW ──
  function renderThreadDetail() {
    if (!activeThread || !activeForum) return null;

    return (
      <>
        {/* Back */}
        <button
          onClick={goBackToThreads}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-sans)', padding: '0 0 16px',
            transition: 'color 0.1s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)'; }}
        >
          <ArrowLeft size={14} strokeWidth={2} />
          Back to {activeForum.title}
        </button>

        {/* Thread title */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            {activeThread.isPinned && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontSize: 10, fontWeight: 700, padding: '2px 8px',
                background: 'rgba(255,106,0,0.08)', color: '#FF6A00',
                borderRadius: 'var(--radius-xs)', letterSpacing: '0.04em',
                textTransform: 'uppercase', fontFamily: 'var(--font-mono)',
              }}>
                <Pin size={10} strokeWidth={2.5} style={{ transform: 'rotate(45deg)' }} />
                Pinned
              </span>
            )}
          </div>
          <h1 style={{
            fontSize: 22, fontWeight: 800, color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', margin: 0,
          }}>
            {activeThread.title}
          </h1>
        </div>

        {/* Original post */}
        <div style={{
          background: '#fff', border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)', padding: '24px', marginBottom: 6,
        }}>
          {/* Author info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <Avatar author={activeThread.author} size={40} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {activeThread.author.name}
                </span>
                <RoleBadge role={activeThread.author.role} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>
                {ROLE_LABELS[activeThread.author.role]} &middot; {activeThread.date}
              </div>
            </div>
          </div>

          {/* Post body */}
          <div style={{
            fontSize: 14, lineHeight: 1.75, color: 'var(--text-secondary)',
            whiteSpace: 'pre-line',
          }}>
            {activeThread.body}
          </div>

          {/* Post actions */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 20,
            marginTop: 20, paddingTop: 14,
            borderTop: '1px solid var(--border-subtle)',
          }}>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, color: 'var(--text-tertiary)',
              fontFamily: 'var(--font-sans)', padding: '2px 0',
            }}>
              <ThumbsUp size={14} strokeWidth={2} />
              <span>{activeThread.likes}</span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-tertiary)' }}>
              <MessageSquare size={14} strokeWidth={2} />
              <span style={{ fontWeight: 600 }}>{activeThread.replyCount}</span>
              <span>replies</span>
            </div>
          </div>
        </div>

        {/* Replies section */}
        <div style={{
          background: '#fff', border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)', padding: '0 24px',
          marginBottom: 24,
        }}>
          {activeThread.replies.length > 0 && (
            <div style={{
              padding: '16px 0 0',
              fontSize: 12, fontWeight: 700, letterSpacing: '0.06em',
              textTransform: 'uppercase', color: 'var(--text-tertiary)',
              fontFamily: 'var(--font-mono)',
            }}>
              Replies ({activeThread.replies.length})
            </div>
          )}
          {activeThread.replies.map(reply => renderReply(reply))}
          {activeThread.replies.length === 0 && (
            <div style={{ padding: '32px 0', textAlign: 'center' }}>
              <Users size={24} style={{ color: 'var(--text-tertiary)', opacity: 0.3, margin: '0 auto 8px' }} />
              <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>No replies yet. Be the first to respond!</div>
            </div>
          )}
        </div>

        {/* Reply box */}
        <div style={{
          background: '#fff', border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)', padding: '20px',
        }}>
          <div style={{
            fontSize: 12, fontWeight: 700, letterSpacing: '0.06em',
            textTransform: 'uppercase', color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-mono)', marginBottom: 10,
          }}>
            Your Reply
          </div>
          <textarea
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            placeholder="Write your reply..."
            rows={4}
            style={{
              width: '100%', padding: '12px 14px', fontSize: 13.5,
              lineHeight: 1.6, border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)',
              color: 'var(--text-primary)', resize: 'vertical',
              outline: 'none', boxSizing: 'border-box',
              transition: 'border-color 0.12s ease',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = '#072FB5'; }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
            <button
              disabled={!replyText.trim()}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '9px 20px', background: replyText.trim() ? 'var(--blue-700)' : 'var(--neutral-200)',
                color: '#fff', border: 'none', borderRadius: 'var(--radius-md)',
                cursor: replyText.trim() ? 'pointer' : 'not-allowed',
                fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-sans)',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={e => { if (replyText.trim()) e.currentTarget.style.background = 'var(--blue-800)'; }}
              onMouseLeave={e => { if (replyText.trim()) e.currentTarget.style.background = 'var(--blue-700)'; }}
            >
              <Send size={13} strokeWidth={2.5} />
              Submit Reply
            </button>
          </div>
        </div>
      </>
    );
  }

  // ── NEW DISCUSSION MODAL ──
  function renderNewDiscussionModal() {
    if (!showNewDiscussion) return null;

    return (
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(2px)',
        }}
        onClick={() => setShowNewDiscussion(false)}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: '#fff', borderRadius: 'var(--radius-md)',
            width: 560, maxWidth: '90vw',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
          }}
        >
          {/* Modal header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '18px 24px',
            borderBottom: '1px solid var(--border-subtle)',
          }}>
            <h2 style={{
              fontSize: 17, fontWeight: 800, color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', margin: 0,
            }}>
              New Discussion
            </h2>
            <button
              onClick={() => setShowNewDiscussion(false)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 4, display: 'flex', color: 'var(--text-tertiary)',
              }}
            >
              <X size={18} strokeWidth={2} />
            </button>
          </div>

          {/* Modal body */}
          <div style={{ padding: '20px 24px 24px' }}>
            {/* Forum name */}
            <div style={{
              fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)',
              marginBottom: 16,
            }}>
              Posting in: <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{activeForum?.title}</span>
            </div>

            {/* Title */}
            <div style={{ marginBottom: 14 }}>
              <label style={{
                display: 'block', fontSize: 12, fontWeight: 700,
                color: 'var(--text-secondary)', marginBottom: 6,
                letterSpacing: '0.02em',
              }}>
                Title
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="What's your discussion about?"
                style={{
                  width: '100%', padding: '10px 14px', fontSize: 14,
                  border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-sans)', color: 'var(--text-primary)',
                  outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.12s ease',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#072FB5'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
              />
            </div>

            {/* Body */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block', fontSize: 12, fontWeight: 700,
                color: 'var(--text-secondary)', marginBottom: 6,
                letterSpacing: '0.02em',
              }}>
                Body
              </label>
              <textarea
                value={newBody}
                onChange={e => setNewBody(e.target.value)}
                placeholder="Share your thoughts, questions, or ideas..."
                rows={6}
                style={{
                  width: '100%', padding: '10px 14px', fontSize: 13.5,
                  lineHeight: 1.6, border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)',
                  color: 'var(--text-primary)', resize: 'vertical',
                  outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.12s ease',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#072FB5'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => { setShowNewDiscussion(false); setNewTitle(''); setNewBody(''); }}
                style={{
                  padding: '9px 18px', background: 'transparent',
                  color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)', cursor: 'pointer',
                  fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-sans)',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-section)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                Cancel
              </button>
              <button
                disabled={!newTitle.trim() || !newBody.trim()}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '9px 20px',
                  background: (newTitle.trim() && newBody.trim()) ? 'var(--blue-700)' : 'var(--neutral-200)',
                  color: '#fff', border: 'none', borderRadius: 'var(--radius-md)',
                  cursor: (newTitle.trim() && newBody.trim()) ? 'pointer' : 'not-allowed',
                  fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-sans)',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={e => { if (newTitle.trim() && newBody.trim()) e.currentTarget.style.background = 'var(--blue-800)'; }}
                onMouseLeave={e => { if (newTitle.trim() && newBody.trim()) e.currentTarget.style.background = 'var(--blue-700)'; }}
              >
                <Send size={13} strokeWidth={2.5} />
                Post Discussion
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Main render ──
  return (
    <div style={{
      padding: '24px 48px 64px',
      maxWidth: 1400,
      width: '100%',
      boxSizing: 'border-box',
      fontFamily: 'var(--font-sans)',
    }}>
      {view === 'forumList' && renderForumList()}
      {view === 'threadList' && renderThreadList()}
      {view === 'threadDetail' && renderThreadDetail()}
      {renderNewDiscussionModal()}
    </div>
  );
}
