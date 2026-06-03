'use client';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

export default function Breadcrumb({ items, rightAction }: { items: BreadcrumbItem[]; rightAction?: React.ReactNode }) {
  if (items.length === 0) return null;

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      padding: '10px 0',
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      fontWeight: 500,
      minHeight: 36,
      flexShrink: 0,
    }}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            {i > 0 && <ChevronRight size={11} strokeWidth={2} style={{ color: 'var(--text-tertiary)', opacity: 0.5 }} />}
            {isLast ? (
              <span style={{
                color: 'var(--text-primary)',
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}>
                {item.label}
              </span>
            ) : (
              <button
                onClick={item.onClick}
                style={{
                  color: 'var(--text-tertiary)',
                  fontWeight: 500,
                  background: 'none',
                  border: 'none',
                  cursor: item.onClick ? 'pointer' : 'default',
                  padding: 0,
                  fontFamily: 'var(--font-sans)',
                  fontSize: 12,
                  transition: 'color 0.1s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { if (item.onClick) e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)'; }}
              >
                {item.label}
              </button>
            )}
          </span>
        );
      })}
      {rightAction && <div style={{ marginLeft: 'auto', flexShrink: 0 }}>{rightAction}</div>}
    </nav>
  );
}
