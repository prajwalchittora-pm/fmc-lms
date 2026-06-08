'use client';
import { MessageSquare, ArrowRight } from 'lucide-react';

interface DiscussionPost {
  id: string;
  course: string;
  courseColor: string;
  title: string;
  excerpt: string;
  author: string;
  authorInitials: string;
  date: string;
  replies: number;
}

const DISCUSSIONS: DiscussionPost[] = [
  {
    id: 'd1',
    course: 'Managerial Economics',
    courseColor: '#072FB5',
    title: 'Applying Elasticity Analysis',
    excerpt: 'Hi everyone! My name is Abhijit Shah, and I\'ve recently joined the online MBA program at BML Munjal University. I\'m really excited to be part of this...',
    author: 'Abhijit Shah',
    authorInitials: 'AS',
    date: 'Monday, 8 Dec 2025, 2:16 AM',
    replies: 4,
  },
  {
    id: 'd2',
    course: 'Managerial Economics',
    courseColor: '#072FB5',
    title: 'Introduction',
    excerpt: 'Hi I\'m new here, looking forward to connecting with everyone in this course and learning together.',
    author: 'Priya Kapoor',
    authorInitials: 'PK',
    date: 'Thursday, 26 Feb 2026, 4:07 PM',
    replies: 1,
  },
  {
    id: 'd3',
    course: 'Managerial Communication',
    courseColor: '#8F3B00',
    title: 'Presentation Techniques Discussion',
    excerpt: 'Can someone share their experience with the persuasive presentation framework from Module 3? I found the structure really helpful but...',
    author: 'Rahul Verma',
    authorInitials: 'RV',
    date: 'Wednesday, 28 May 2026, 11:30 AM',
    replies: 7,
  },
];

export default function ActiveDiscussions() {
  return (
    <div className="enter enter-6" style={{ marginTop: 36 }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <span className="label">Active Discussions</span>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', marginTop: 4 }}>
            Recent forum activity
          </div>
        </div>
        <button style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '6px 14px',
          fontSize: 12, fontWeight: 600,
          color: 'var(--blue-700)',
          background: 'transparent',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          cursor: 'pointer',
          fontFamily: 'var(--font-sans)',
          transition: 'border-color 0.12s ease',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blue-700)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
        >
          View all <ArrowRight size={12} />
        </button>
      </div>

      {/* Discussion cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {DISCUSSIONS.map(post => (
          <div
            key={post.id}
            style={{
              background: '#fff',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '18px 20px',
              cursor: 'pointer',
              transition: 'box-shadow 0.12s ease, border-color 0.12s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = 'rgba(7,47,181,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
          >
            {/* Top row: course pill + replies */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '3px 10px',
                background: `${post.courseColor}0A`,
                border: `1px solid ${post.courseColor}18`,
                borderRadius: 'var(--radius-sm)',
                fontSize: 11, fontWeight: 600,
                color: post.courseColor,
              }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: post.courseColor }} />
                {post.course}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>
                <MessageSquare size={11} />
                {post.replies} {post.replies === 1 ? 'reply' : 'replies'}
              </div>
            </div>

            {/* Title */}
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.01em', marginBottom: 6 }}>
              {post.title}
            </div>

            {/* Excerpt */}
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55, fontWeight: 500, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {post.excerpt}
            </div>

            {/* Author + date */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--bg-section)', border: '1px solid var(--border-subtle)', display: 'grid', placeItems: 'center', fontSize: 8, fontWeight: 700, color: 'var(--text-tertiary)' }}>
                {post.authorInitials}
              </div>
              <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)', fontWeight: 500 }}>
                {post.author}
              </span>
              <span style={{ fontSize: 10, color: 'var(--text-tertiary)', opacity: 0.6 }}>·</span>
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 400 }}>
                {post.date}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
