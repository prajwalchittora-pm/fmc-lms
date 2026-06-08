'use client';
import CoordinatorSideNav from '@/components/coordinator/CoordinatorSideNav';

export default function CoordinatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-page)' }}>
      <CoordinatorSideNav />
      <main style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
