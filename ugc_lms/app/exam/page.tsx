'use client';
import SideNav from '@/components/SideNav';
import Breadcrumb from '@/components/Breadcrumb';
import ExamView from '@/components/exam/ExamView';

export default function ExamPage() {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#FBF4EA' }}>
      <SideNav />
      <main style={{ flex: 1, height: '100vh', overflow: 'auto', background: '#F8F5F1' }}>
        <div style={{ padding: '0 48px' }}>
          <Breadcrumb items={[
            { label: 'Overview', onClick: () => window.location.href = '/' },
            { label: 'Exam' },
          ]} />
        </div>
        <ExamView />
      </main>
    </div>
  );
}
