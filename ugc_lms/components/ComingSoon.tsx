'use client';
import { Hammer } from 'lucide-react';

interface ComingSoonProps {
  tabName: string;
}

export default function ComingSoon({ tabName }: ComingSoonProps) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 80px)',
      padding: '48px 24px',
      textAlign: 'center',
    }}>
      {/* Icon container */}
      <div style={{
        width: 72,
        height: 72,
        borderRadius: 'var(--radius-xl)',
        background: 'var(--accent-soft)',
        border: '1px solid var(--accent-border)',
        display: 'grid',
        placeItems: 'center',
        marginBottom: 28,
      }}>
        <Hammer size={32} strokeWidth={1.6} style={{ color: 'var(--blue-700)' }} />
      </div>

      {/* Heading */}
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--fs-h2)',
        fontWeight: 'var(--fw-black)',
        color: 'var(--text-headings)',
        letterSpacing: 'var(--tracking-tight)',
        lineHeight: 'var(--lh-tight)',
        margin: '0 0 8px',
      }}>
        Coming Soon
      </h1>

      {/* Tab name pill */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '5px 14px',
        borderRadius: 'var(--radius-pill)',
        background: 'var(--bg-pastel-beige-2)',
        border: '1px solid var(--border-orange)',
        fontSize: 13,
        fontWeight: 700,
        color: 'var(--orange-600)',
        fontFamily: 'var(--font-sans)',
        marginBottom: 16,
      }}>
        {tabName}
      </div>

      {/* Subtitle */}
      <p style={{
        fontSize: 'var(--fs-sm)',
        fontWeight: 'var(--fw-medium)',
        color: 'var(--text-tertiary)',
        lineHeight: 'var(--lh-relaxed)',
        margin: 0,
        maxWidth: 320,
      }}>
        This feature is being built. Check back soon.
      </p>
    </div>
  );
}
