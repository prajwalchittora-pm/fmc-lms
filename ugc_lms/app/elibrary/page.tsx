'use client';
import SideNav from '@/components/SideNav';
import Breadcrumb from '@/components/Breadcrumb';
import ComingSoon from '@/components/ComingSoon';

export default function ELibraryPage() {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#FBF4EA' }}>
      <SideNav />
      <main style={{ flex: 1, height: '100vh', overflow: 'auto', background: '#F8F5F1' }}>
        <div style={{ padding: '0 48px' }}>
          <Breadcrumb items={[
            { label: 'Overview', onClick: () => window.location.href = '/' },
            { label: 'E-Library' },
          ]} />
        </div>
        <ComingSoon tabName="E-Library" />
      </main>
    </div>
  );
}
