'use client';
import { useState } from 'react';
import GradingView from '@/components/coordinator/GradingView';
import AssessmentAnalytics from '@/components/coordinator/AssessmentAnalytics';
import { ClipboardCheck, BarChart3 } from 'lucide-react';

export default function GradingPage() {
  const [tab, setTab] = useState<'queue' | 'analytics'>('queue');

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Tab bar */}
      <div style={{
        display: 'flex', gap: 0,
        padding: '0 36px',
        borderBottom: '1px solid var(--border-subtle)',
        background: '#fff',
        flexShrink: 0,
      }}>
        {[
          { key: 'queue' as const, label: 'Grading Queue', icon: ClipboardCheck },
          { key: 'analytics' as const, label: 'Assessment Analytics', icon: BarChart3 },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '14px 20px',
            fontSize: 13, fontWeight: 700,
            color: tab === t.key ? 'var(--blue-700)' : 'var(--text-tertiary)',
            background: 'transparent', border: 'none',
            borderBottom: `2px solid ${tab === t.key ? 'var(--blue-700)' : 'transparent'}`,
            cursor: 'pointer', fontFamily: 'var(--font-sans)',
            transition: 'color 0.12s',
          }}>
            <t.icon size={15} strokeWidth={2} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {tab === 'queue' ? <GradingView /> : <AssessmentAnalytics />}
      </div>
    </div>
  );
}
