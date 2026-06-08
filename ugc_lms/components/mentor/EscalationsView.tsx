'use client';
import { useState } from 'react';
import { Plus, X, AlertTriangle, CheckCircle2, Clock, ChevronRight } from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────

type EscalationStatus = 'open' | 'in_review' | 'resolved';
type EscalationPriority = 'high' | 'medium' | 'low';

interface Escalation {
  id: string; mentee: string; menteeInitials: string; rollNo: string; programme: string;
  title: string; description: string; priority: EscalationPriority;
  status: EscalationStatus; createdAt: string; createdDate: string;
  coordinatorResponse?: string; resolvedAt?: string;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────

const ESCALATIONS: Escalation[] = [
  { id: 'esc1', mentee: 'Neha Patel', menteeInitials: 'NP', rollNo: 'MBA-2026-006', programme: 'MBA-26', title: 'Student inactive for 12+ days — potential dropout risk', description: 'Neha has been completely inactive since 26 May. Unable to reach via phone or email. Previous counselling session revealed family issues. Requesting coordinator intervention for potential semester extension or withdrawal process.', priority: 'high', status: 'open', createdAt: '2 days ago', createdDate: '6 Jun 2026' },
  { id: 'esc2', mentee: 'Rahul Verma', menteeInitials: 'RV', rollNo: 'MBA-2026-003', programme: 'MBA-26', title: 'Failed 2 courses — needs academic probation review', description: 'Rahul has F grades in MBA-102 and MBA-104. Engagement at 38%. Despite counselling sessions, improvement is minimal. Requesting academic probation review and supplementary exam scheduling.', priority: 'high', status: 'in_review', createdAt: '5 days ago', createdDate: '3 Jun 2026', coordinatorResponse: 'Reviewing academic record. Will schedule meeting with student and mentor next week.' },
  { id: 'esc3', mentee: 'Siddharth Rao', menteeInitials: 'SR', rollNo: 'MBA-2026-014', programme: 'MBA-26', title: 'Attendance exemption — sports team participation', description: 'Siddharth\'s attendance is 73% due to university sports team commitments (inter-university cricket tournament, 2 weeks). Has valid documentation. Requesting attendance exemption for End Sem eligibility.', priority: 'medium', status: 'resolved', createdAt: '2 weeks ago', createdDate: '25 May 2026', coordinatorResponse: 'Exemption granted. Student advised to submit request through the Exams portal with supporting documents.', resolvedAt: '27 May 2026' },
  { id: 'esc4', mentee: 'Dev Malhotra', menteeInitials: 'DM', rollNo: 'MBA-2026-016', programme: 'MBA-26', title: 'Struggling with Business Statistics — tutorial support needed', description: 'Dev is consistently scoring below average in MBA-105. Has attended counselling and peer study group but needs additional tutorial support. Requesting coordinator to arrange extra lab sessions or assign a teaching assistant.', priority: 'medium', status: 'in_review', createdAt: '1 week ago', createdDate: '1 Jun 2026', coordinatorResponse: 'TA assigned for extra statistics lab sessions starting next week.' },
];

const STATUS_CONFIG: Record<EscalationStatus, { label: string; color: string; bg: string }> = {
  open: { label: 'Open', color: '#DC2626', bg: 'rgba(220,38,38,0.06)' },
  in_review: { label: 'In Review', color: '#D97706', bg: 'rgba(217,119,6,0.06)' },
  resolved: { label: 'Resolved', color: '#059669', bg: 'rgba(5,150,105,0.06)' },
};

const PRIORITY_CONFIG: Record<EscalationPriority, { label: string; color: string }> = {
  high: { label: 'High', color: '#DC2626' },
  medium: { label: 'Medium', color: '#D97706' },
  low: { label: 'Low', color: 'var(--text-tertiary)' },
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function EscalationsView() {
  const [statusFilter, setStatusFilter] = useState<EscalationStatus | 'all'>('all');
  const [selectedEsc, setSelectedEsc] = useState<Escalation | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filtered = statusFilter === 'all' ? ESCALATIONS : ESCALATIONS.filter(e => e.status === statusFilter);
  const openCount = ESCALATIONS.filter(e => e.status === 'open').length;
  const reviewCount = ESCALATIONS.filter(e => e.status === 'in_review').length;

  if (selectedEsc) {
    const sc = STATUS_CONFIG[selectedEsc.status];
    const pc = PRIORITY_CONFIG[selectedEsc.priority];
    return (
      <div style={{ padding: '28px 40px', maxWidth: 800 }}>
        <button onClick={() => setSelectedEsc(null)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: 'var(--blue-700)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-sans)', marginBottom: 20 }}>&larr; Back to Escalations</button>

        <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', padding: '28px 32px', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: sc.color, background: sc.bg, padding: '3px 10px', borderRadius: 'var(--radius-xs)' }}>{sc.label}</span>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: pc.color }}>{pc.label} Priority</span>
            <span style={{ fontSize: 10.5, color: 'var(--text-tertiary)', marginLeft: 'auto' }}>{selectedEsc.createdDate}</span>
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', margin: '0 0 12px' }}>{selectedEsc.title}</h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-section)', border: '1px solid var(--border-subtle)', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)' }}>{selectedEsc.menteeInitials}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{selectedEsc.mentee}</div>
              <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{selectedEsc.rollNo} &middot; {selectedEsc.programme}</div>
            </div>
          </div>

          <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.8 }}>{selectedEsc.description}</div>
        </div>

        {selectedEsc.coordinatorResponse && (
          <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', padding: '24px 28px', borderLeft: `3px solid ${selectedEsc.status === 'resolved' ? '#059669' : '#D97706'}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Coordinator Response</div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>{selectedEsc.coordinatorResponse}</p>
            {selectedEsc.resolvedAt && (
              <div style={{ fontSize: 11, color: '#059669', fontWeight: 600, marginTop: 8 }}>Resolved on {selectedEsc.resolvedAt}</div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: '28px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', margin: 0 }}>Escalations</h1>
          <p style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500, marginTop: 4 }}>Raise and track concerns with the programme coordinator</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} style={{
          display: 'flex', alignItems: 'center', gap: 5, padding: '8px 16px', fontSize: 12.5, fontWeight: 600,
          color: '#fff', background: 'var(--blue-700)', border: '1px solid var(--blue-700)',
          borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)',
        }}>
          <Plus size={14} /> New Escalation
        </button>
      </div>

      {/* Status summary */}
      {(openCount > 0 || reviewCount > 0) && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          {openCount > 0 && (
            <div style={{ background: 'rgba(220,38,38,0.04)', border: '1px solid rgba(220,38,38,0.12)', borderRadius: 'var(--radius-sm)', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertTriangle size={13} style={{ color: '#DC2626' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#DC2626' }}>{openCount} open</span>
            </div>
          )}
          {reviewCount > 0 && (
            <div style={{ background: 'rgba(217,119,6,0.04)', border: '1px solid rgba(217,119,6,0.12)', borderRadius: 'var(--radius-sm)', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={13} style={{ color: '#D97706' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#D97706' }}>{reviewCount} in review</span>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        {([['all', 'All'], ['open', 'Open'], ['in_review', 'In Review'], ['resolved', 'Resolved']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setStatusFilter(key as EscalationStatus | 'all')} style={{
            padding: '5px 12px', fontSize: 11.5, fontWeight: statusFilter === key ? 700 : 500,
            color: statusFilter === key ? '#fff' : 'var(--text-secondary)',
            background: statusFilter === key ? 'var(--blue-700)' : '#fff',
            border: statusFilter === key ? '1px solid var(--blue-700)' : '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)',
          }}>{label}</button>
        ))}
      </div>

      {/* Escalation list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map(esc => {
          const sc = STATUS_CONFIG[esc.status];
          const pc = PRIORITY_CONFIG[esc.priority];
          return (
            <div key={esc.id} onClick={() => setSelectedEsc(esc)} style={{
              background: '#fff', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)',
              padding: '16px 22px', cursor: 'pointer',
              borderLeft: `3px solid ${esc.status === 'open' ? '#DC2626' : esc.status === 'in_review' ? '#D97706' : '#059669'}`,
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-section)', border: '1px solid var(--border-subtle)', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', flexShrink: 0, marginTop: 2 }}>{esc.menteeInitials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 4 }}>{esc.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>{esc.description}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>{esc.mentee}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--blue-700)', background: 'rgba(7,47,181,0.06)', padding: '1px 6px', borderRadius: 'var(--radius-xs)', fontFamily: 'var(--font-mono)' }}>{esc.programme}</span>
                    <span style={{ fontSize: 10.5, color: 'var(--text-tertiary)' }}>{esc.createdAt}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: sc.color, background: sc.bg, padding: '3px 10px', borderRadius: 'var(--radius-xs)' }}>{sc.label}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: pc.color }}>{pc.label}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,0.4)' }} onClick={() => setShowCreateModal(false)}>
          <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', width: 480, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 16, fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>New Escalation</div>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 4, display: 'flex' }}><X size={18} /></button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Student</label>
                <select style={{ width: '100%', padding: '8px 28px 8px 12px', fontSize: 13, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)', outline: 'none', background: '#fff', appearance: 'none' as const, WebkitAppearance: 'none' as const, backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}>
                  <option>Neha Patel (MBA-2026-006)</option>
                  <option>Rahul Verma (MBA-2026-003)</option>
                  <option>Dev Malhotra (MBA-2026-016)</option>
                  <option>Siddharth Rao (MBA-2026-014)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Title</label>
                <input type="text" placeholder="Brief description of the concern" style={{ width: '100%', padding: '8px 12px', fontSize: 13, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Priority</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {(['high', 'medium', 'low'] as const).map(p => (
                    <button key={p} style={{ flex: 1, padding: '7px', fontSize: 12, fontWeight: 600, color: PRIORITY_CONFIG[p].color, background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)', textTransform: 'capitalize' }}>{p}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Description</label>
                <textarea rows={4} placeholder="Provide details about the issue, what you've tried, and what action you're requesting from the coordinator..." style={{ width: '100%', padding: '8px 12px', fontSize: 13, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)', outline: 'none', resize: 'vertical', lineHeight: 1.6 }} />
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => setShowCreateModal(false)} style={{ padding: '8px 20px', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Cancel</button>
              <button onClick={() => setShowCreateModal(false)} style={{ padding: '8px 20px', fontSize: 13, fontWeight: 600, color: '#fff', background: 'var(--blue-700)', border: '1px solid var(--blue-700)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Submit Escalation</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
