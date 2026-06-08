'use client';
import { useState, useRef, useEffect } from 'react';
import { Plus, X, Search, ChevronDown, Pin, Clock, Users, Megaphone, GraduationCap, Trash2, Edit3 } from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────

interface Announcement {
  id: string;
  title: string;
  body: string;
  programme: string; // 'all' or programme code
  postedBy: string;
  postedAt: string; // relative
  postedDate: string; // absolute
  pinned: boolean;
  audience: number; // student count reached
}

// ─── Mock Data ──────────────────────────────────────────────────────────────

const ANNOUNCEMENTS: Announcement[] = [
  { id: 'a1', title: 'End Semester Examination Schedule Released', body: 'The End Semester examination for MBA Semester 1 will be conducted from 15 June to 25 June 2026. Detailed timetable has been uploaded to the Exams section. Students are advised to check their eligibility status and report any discrepancies to the coordinator before 10 June.', programme: 'MBA-26', postedBy: 'Dr. Anand Sharma', postedAt: '2 hours ago', postedDate: '7 Jun 2026, 12:30 PM', pinned: true, audience: 95 },
  { id: 'a2', title: 'Eligibility List — Final Reminder', body: 'Students with attendance below 75% must submit exemption requests with supporting documents by 6 June 2026. No requests will be entertained after this date. Students in the 65-74% bracket need documented reasons; 50-64% requires a medical certificate from a government hospital.', programme: 'MBA-26', postedBy: 'Dr. Anand Sharma', postedAt: '1 day ago', postedDate: '6 Jun 2026, 9:00 AM', pinned: true, audience: 95 },
  { id: 'a3', title: 'Preparatory Leave Notice', body: 'Preparatory leave for End Semester exams will be observed from 10 June to 14 June 2026. No classes or live sessions will be conducted during this period. The library will remain open from 8 AM to 8 PM.', programme: 'all', postedBy: 'Dr. Anand Sharma', postedAt: '3 days ago', postedDate: '4 Jun 2026, 10:00 AM', pinned: false, audience: 340 },
  { id: 'a4', title: 'Mid Semester Results Published', body: 'Mid Semester (CIA-2) results for all MBA Semester 1 courses have been published. Students can view their marks in the Gradebook section. For any discrepancies, contact the respective course faculty within 3 working days.', programme: 'MBA-26', postedBy: 'Dr. Anand Sharma', postedAt: '2 weeks ago', postedDate: '25 May 2026, 3:00 PM', pinned: false, audience: 95 },
  { id: 'a5', title: 'BCA Semester 2 — Assignment Submission Deadline Extended', body: 'Due to the university network outage on 20 May, the deadline for Data Structures assignment (BCA-201) has been extended by 3 days to 28 May 2026. Upload your submissions via the LMS.', programme: 'BCA-26', postedBy: 'Dr. Anand Sharma', postedAt: '2 weeks ago', postedDate: '23 May 2026, 11:00 AM', pinned: false, audience: 120 },
  { id: 'a6', title: 'Guest Lecture — Industry 4.0 and Management', body: 'A guest lecture by Mr. Rajiv Kapoor (VP, Tata Consultancy Services) on "Industry 4.0 and its Impact on Management Education" will be held on 30 May 2026 at 3:00 PM in the Main Auditorium. Attendance is mandatory for all MBA students.', programme: 'MBA-26', postedBy: 'Dr. Anand Sharma', postedAt: '3 weeks ago', postedDate: '18 May 2026, 9:30 AM', pinned: false, audience: 95 },
];

const PROGRAMME_OPTIONS = [
  { value: 'all', label: 'All Programmes' },
  { value: 'MBA-26', label: 'MBA - Batch 2026' },
  { value: 'BCA-26', label: 'BCA - Batch 2026' },
  { value: 'CSE-26', label: 'B.Tech CSE - Batch 2026' },
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function AnnouncementsView() {
  const [announcements, setAnnouncements] = useState(ANNOUNCEMENTS);
  const [search, setSearch] = useState('');
  const [filterProgramme, setFilterProgramme] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAnn, setNewAnn] = useState({ title: '', body: '', programme: 'all', pinned: false });

  const filtered = announcements.filter(a => {
    if (filterProgramme !== 'all' && a.programme !== filterProgramme && a.programme !== 'all') return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !a.body.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  const handleCreate = () => {
    if (!newAnn.title.trim()) return;
    const created: Announcement = {
      id: `a${Date.now()}`,
      title: newAnn.title,
      body: newAnn.body,
      programme: newAnn.programme,
      postedBy: 'Dr. Anand Sharma',
      postedAt: 'Just now',
      postedDate: '7 Jun 2026, 2:00 PM',
      pinned: newAnn.pinned,
      audience: newAnn.programme === 'all' ? 340 : newAnn.programme === 'MBA-26' ? 95 : 120,
    };
    setAnnouncements([created, ...announcements]);
    setNewAnn({ title: '', body: '', programme: 'all', pinned: false });
    setShowCreateModal(false);
  };

  const togglePin = (id: string) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, pinned: !a.pinned } : a));
  };

  const deleteAnn = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div style={{ padding: '28px 40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', margin: 0 }}>Announcements</h1>
          <p style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500, marginTop: 4 }}>Broadcast notices to students across programmes</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} style={{
          display: 'flex', alignItems: 'center', gap: 5, padding: '8px 16px', fontSize: 12.5, fontWeight: 600,
          color: '#fff', background: 'var(--blue-700)', border: '1px solid var(--blue-700)',
          borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)',
        }}>
          <Plus size={14} /> New Announcement
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search announcements..." style={{
            width: '100%', padding: '7px 10px 7px 30px', fontSize: 12, fontWeight: 500,
            border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)',
            background: '#fff', fontFamily: 'var(--font-sans)', outline: 'none', color: 'var(--text-primary)',
          }} />
        </div>
        <select value={filterProgramme} onChange={e => setFilterProgramme(e.target.value)} style={{
          padding: '7px 28px 7px 12px', fontSize: 12, fontWeight: 500, color: 'var(--text-primary)',
          background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)',
          fontFamily: 'var(--font-sans)', outline: 'none', cursor: 'pointer',
          appearance: 'none', WebkitAppearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
        }}>
          {PROGRAMME_OPTIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
        <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500, marginLeft: 'auto' }}>{filtered.length} announcement{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Announcements list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(ann => {
          const progLabel = PROGRAMME_OPTIONS.find(p => p.value === ann.programme)?.label || ann.programme;
          return (
            <div key={ann.id} style={{
              background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)',
              padding: '20px 24px', position: 'relative',
              borderLeft: ann.pinned ? '3px solid var(--blue-700)' : '3px solid transparent',
            }}>
              {/* Top row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    {ann.pinned && <Pin size={12} style={{ color: 'var(--blue-700)', transform: 'rotate(45deg)' }} />}
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.01em', margin: 0, lineHeight: 1.3 }}>{ann.title}</h3>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, fontWeight: 400 }}>{ann.body}</p>
                </div>
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  <button onClick={() => togglePin(ann.id)} title={ann.pinned ? 'Unpin' : 'Pin'} style={{ width: 28, height: 28, display: 'grid', placeItems: 'center', background: ann.pinned ? 'rgba(7,47,181,0.06)' : 'transparent', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)', cursor: 'pointer', color: ann.pinned ? 'var(--blue-700)' : 'var(--text-tertiary)' }}>
                    <Pin size={12} style={{ transform: 'rotate(45deg)' }} />
                  </button>
                  <button onClick={() => deleteAnn(ann.id)} title="Delete" style={{ width: 28, height: 28, display: 'grid', placeItems: 'center', background: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)', cursor: 'pointer', color: 'var(--text-tertiary)' }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              {/* Meta row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={11} /> {ann.postedAt}
                </span>
                <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-tertiary)' }}>{ann.postedDate}</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: ann.programme === 'all' ? '#059669' : '#072FB5', background: ann.programme === 'all' ? 'rgba(5,150,105,0.06)' : 'rgba(7,47,181,0.06)', padding: '2px 8px', borderRadius: 'var(--radius-xs)' }}>
                  {progLabel}
                </span>
                <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 3, marginLeft: 'auto' }}>
                  <Users size={11} /> {ann.audience} students
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ═══ CREATE MODAL ═══ */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }} onClick={() => setShowCreateModal(false)}>
          <div style={{ background: '#fff', borderRadius: 16, width: 520, maxHeight: '80vh', overflow: 'auto', boxShadow: '0 25px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.06)' }} onClick={e => e.stopPropagation()}>
            {/* Dark gradient header */}
            <div style={{ background: 'linear-gradient(135deg, #030B22 0%, #06102E 50%, #213594 100%)', borderRadius: '16px 16px 0 0', padding: '24px 24px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.1)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    <Megaphone size={20} style={{ color: '#fff' }} />
                  </div>
                  <span style={{ fontSize: 17, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>Create Announcement</span>
                </div>
                <button onClick={() => setShowCreateModal(false)} style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center', color: '#fff', flexShrink: 0 }}><X size={16} /></button>
              </div>
              {/* Hero title input in header */}
              <input
                type="text"
                value={newAnn.title}
                onChange={e => setNewAnn({ ...newAnn, title: e.target.value })}
                placeholder="Announcement title"
                style={{
                  width: '100%', padding: '10px 14px', fontSize: 14, fontWeight: 600,
                  background: 'transparent', border: '1.5px solid rgba(255,255,255,0.25)', borderRadius: 10,
                  fontFamily: 'var(--font-sans)', outline: 'none', color: '#fff',
                  boxSizing: 'border-box',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,255,255,0.08)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.boxShadow = 'none'; }}
              />
            </div>

            {/* Body inputs */}
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Message</label>
                <textarea
                  value={newAnn.body}
                  onChange={e => setNewAnn({ ...newAnn, body: e.target.value })}
                  placeholder="Write your announcement..."
                  rows={5}
                  style={{
                    width: '100%', padding: '10px 14px', fontSize: 13,
                    border: '1.5px solid transparent', borderRadius: 10,
                    fontFamily: 'var(--font-sans)', outline: 'none', resize: 'vertical', lineHeight: 1.6,
                    background: 'var(--bg-section)', color: 'var(--text-primary)', boxSizing: 'border-box',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#072FB5'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(7,47,181,0.12)'; e.currentTarget.style.background = '#fff'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'var(--bg-section)'; }}
                />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Programme</label>
                  <select
                    value={newAnn.programme}
                    onChange={e => setNewAnn({ ...newAnn, programme: e.target.value })}
                    style={{
                      width: '100%', padding: '10px 28px 10px 14px', fontSize: 12.5,
                      border: '1.5px solid transparent', borderRadius: 10,
                      fontFamily: 'var(--font-sans)', outline: 'none',
                      background: 'var(--bg-section)', color: 'var(--text-primary)',
                      appearance: 'none', WebkitAppearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = '#072FB5'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(7,47,181,0.12)'; e.currentTarget.style.background = '#fff'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'var(--bg-section)'; }}
                  >
                    {PROGRAMME_OPTIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 2 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <input type="checkbox" checked={newAnn.pinned} onChange={e => setNewAnn({ ...newAnn, pinned: e.target.checked })} style={{ accentColor: '#072FB5' }} />
                    Pin to top
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '16px 24px', background: '#FAFAFA', borderRadius: '0 0 16px 16px', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => setShowCreateModal(false)} style={{ padding: '8px 20px', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Cancel</button>
              <button
                onClick={handleCreate}
                disabled={!newAnn.title.trim()}
                style={{
                  padding: '8px 20px', fontSize: 13, fontWeight: 600, color: '#fff',
                  background: newAnn.title.trim() ? '#072FB5' : 'var(--neutral-200)',
                  border: 'none', borderRadius: 8, cursor: newAnn.title.trim() ? 'pointer' : 'not-allowed',
                  fontFamily: 'var(--font-sans)',
                  boxShadow: newAnn.title.trim() ? '0 1px 3px rgba(7,47,181,0.3)' : 'none',
                  transition: 'background 0.15s, box-shadow 0.15s',
                }}
              >Publish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
