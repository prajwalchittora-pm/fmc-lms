'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Home, Video, BarChart2, ClipboardList, LogOut, Check, HelpCircle, ArrowRightLeft, ChevronDown, PanelLeftClose } from 'lucide-react';
import { LEARNER, PROGRAMMES, ProgrammeTab } from '@/lib/mockData';
import { usePrototype } from '@/context/PrototypeContext';

const SUPPORT_EMAIL = 'support@findmycollege.com';

const BG = '#0D0A3D';
const BG_IDENTITY = 'rgba(255,255,255,0.065)';
const BG_DROPDOWN = '#151E5C';
const ORANGE = '#FF6A00';
const SEP = 'rgba(255,255,255,0.11)';
const TEXT = 'rgba(255,255,255,0.68)';
const TEXT_ACTIVE = '#FFFFFF';
const ICON = 'rgba(255,255,255,0.48)';
const LABEL = 'rgba(255,255,255,0.45)';
const W_FULL = 272;
const W_COLLAPSED = 56;

const TAB_META: Record<ProgrammeTab, { label: string; icon: React.ElementType; href: string }> = {
  overview:      { label: 'Overview',      icon: Home,          href: '/' },
  learn:         { label: 'Learn',         icon: Home,          href: '/learn' },
  live_sessions: { label: 'Live Sessions', icon: Video,         href: '/live-sessions' },
  grades:        { label: 'Grades',        icon: BarChart2,     href: '/grades' },
  assignments:   { label: 'Assignments',   icon: ClipboardList, href: '/assignments' },
};


export default function SideNav() {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);
  const { activeProgrammeId, setActiveProgrammeId, focusMode } = usePrototype();
  const activeProg = PROGRAMMES.find(p => p.id === activeProgrammeId) ?? PROGRAMMES[0];
  const otherProgs = PROGRAMMES.filter(p => p.id !== activeProgrammeId);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setSwitcherOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { if (collapsed) setSwitcherOpen(false); }, [collapsed]);

  const copyEmail = () => {
    navigator.clipboard.writeText(SUPPORT_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const dropdownItems = otherProgs.map(prog => (
    <button
      key={prog.id}
      onClick={() => { setActiveProgrammeId(prog.id); setSwitcherOpen(false); }}
      style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '11px 16px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.1s ease' }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
    >
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.20)', flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.75)', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prog.name}</div>
      </div>
    </button>
  ));

  return (
    <aside style={{
      width: focusMode ? 0 : (collapsed ? W_COLLAPSED : W_FULL),
      flexShrink: 0,
      height: '100%',
      background: BG,
      display: focusMode ? 'none' : 'flex',
      flexDirection: 'column',
      overflow: 'visible',
      position: 'relative',
      zIndex: 10,
      transition: 'width 0.3s ease',
    }}>

      {/* Logo */}
      <div style={{
        padding: collapsed ? '18px 0' : '18px 20px',
        borderBottom: `1px solid ${SEP}`,
        flexShrink: 0,
        minHeight: 78,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {collapsed ? (
          <button
            onClick={() => setCollapsed(false)}
            title="Expand sidebar"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <img src="/logos/Icon_Solo_DarkBG.svg" alt="FMC" style={{ height: 34, width: 34, display: 'block' }} />
          </button>
        ) : (
          <>
            <img src="/logos/Primary_Horizontal_DarkBG.svg" alt="FindMyCollege" style={{ height: 42, width: 'auto', display: 'block', maxWidth: 180, flex: 1, minWidth: 0 }} />
            <button
              onClick={() => setCollapsed(true)}
              title="Collapse sidebar"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.30)', flexShrink: 0, marginLeft: 8, transition: 'color 0.12s ease' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.70)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.30)'; }}
            >
              <PanelLeftClose size={16} strokeWidth={1.8} />
            </button>
          </>
        )}
      </div>

      {/* ── Programme identity ── */}
      {!collapsed && (
        <div
          ref={switcherRef}
          data-tour="programme"
          style={{
            background: BG_IDENTITY,
            borderBottom: `1px solid ${SEP}`,
            flexShrink: 0,
            padding: '18px 20px 20px',
            position: 'relative',
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: 10, fontFamily: 'var(--font-mono)' }}>
            Current Programme
          </div>
          <div style={{ fontSize: 15.5, fontWeight: 700, color: TEXT_ACTIVE, lineHeight: 1.3, fontFamily: 'var(--font-display)', minWidth: 0, marginBottom: 14 }}>
            {activeProg.name}
          </div>

          <button
            onClick={() => setSwitcherOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '5px 10px',
              background: 'transparent',
              border: 'none',
              borderRadius: 0,
              cursor: 'pointer',
              fontSize: 12, fontWeight: 500,
              color: switcherOpen ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.35)',
              fontFamily: 'var(--font-sans)',
              transition: 'color 0.12s ease',
              width: '100%',
            }}
            onMouseEnter={e => { if (!switcherOpen) e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}
            onMouseLeave={e => { if (!switcherOpen) e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
          >
            <ArrowRightLeft size={11} strokeWidth={1.8} style={{ color: 'rgba(255,255,255,0.30)', flexShrink: 0 }} />
            Switch programme
            <ChevronDown size={11} strokeWidth={2} style={{ color: 'rgba(255,255,255,0.25)', marginLeft: 'auto', transform: switcherOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
          </button>

          {switcherOpen && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0,
              background: BG_DROPDOWN,
              border: '1px solid rgba(255,255,255,0.14)',
              borderTop: 'none',
              borderRadius: '0 0 10px 10px',
              boxShadow: '0 12px 32px rgba(0,0,0,0.45)',
              overflow: 'hidden',
              zIndex: 50,
            }}>
              <div style={{ padding: '9px 14px 7px', fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: LABEL, borderBottom: `1px solid rgba(255,255,255,0.07)` }}>
                Switch Programme
              </div>
              {dropdownItems}
            </div>
          )}
        </div>
      )}

      {/* ── Programme-scoped tabs ── */}
      <nav style={{ padding: collapsed ? '20px 0 8px' : '28px 10px 8px', flex: 1, overflow: 'auto' }}>
        {activeProg.tabs.map(tabKey => {
          const { label, icon: Icon, href } = TAB_META[tabKey];
          const isActive = href === '/' ? pathname === '/' : pathname?.startsWith(href);
          return collapsed ? (
            <Link
              key={tabKey}
              href={href}
              title={label}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: W_COLLAPSED, height: 44,
                borderLeft: isActive ? `3px solid ${ORANGE}` : '3px solid transparent',
                background: 'transparent',
                textDecoration: 'none',
                transition: 'background 0.12s ease',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} style={{ color: isActive ? ORANGE : 'rgba(255,255,255,0.65)' }} />
            </Link>
          ) : (
            <Link
              key={tabKey}
              href={href}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: isActive ? '11px 12px 11px 11px' : '11px 12px 11px 13px',
                borderRadius: 0,
                fontSize: isActive ? 14 : 13.5, fontWeight: isActive ? 700 : 500,
                color: isActive ? TEXT_ACTIVE : TEXT,
                background: 'transparent',
                borderLeft: isActive ? `3px solid ${ORANGE}` : '3px solid transparent',
                textDecoration: 'none',
                transition: 'color 0.12s ease',
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = TEXT_ACTIVE; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = TEXT; } }}
            >
              <Icon size={15} strokeWidth={isActive ? 2.2 : 1.8} style={{ color: isActive ? ORANGE : ICON, flexShrink: 0 }} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom utility ── */}
      <div
        style={{ borderTop: `1px solid ${SEP}`, padding: collapsed ? '14px 0 18px' : '14px 10px 18px', flexShrink: 0 }}
      >
        {/* Profile row */}
        {collapsed ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0 10px' }}>
            <div style={{ width: 30, height: 30, background: ORANGE, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>
              {LEARNER.initials}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', marginBottom: 10 }}>
            <div style={{ width: 30, height: 30, background: ORANGE, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
              {LEARNER.initials}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: TEXT_ACTIVE, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {LEARNER.fullName}
              </div>
            </div>
          </div>
        )}

        {collapsed ? (
          <>
            <button
              onClick={copyEmail}
              title="Need help?"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: W_COLLAPSED, height: 42, background: 'transparent', border: 'none', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              {copied ? <Check size={16} strokeWidth={2.5} style={{ color: 'rgba(74,222,128,0.85)' }} /> : <HelpCircle size={16} strokeWidth={1.8} style={{ color: 'rgba(255,255,255,0.60)' }} />}
            </button>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('restart-ftue'))}
              title="Log out"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: W_COLLAPSED, height: 42, background: 'transparent', border: 'none', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.07)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              <LogOut size={16} strokeWidth={1.8} style={{ color: 'rgba(239,68,68,0.75)' }} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={copyEmail}
              data-tour="need-help"
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', width: '100%', fontSize: 13, fontWeight: 500, color: copied ? 'rgba(74,222,128,0.85)' : TEXT, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', borderLeft: '2px solid transparent', fontFamily: 'var(--font-sans)', transition: 'background 0.1s ease' }}
              onMouseEnter={e => { if (!copied) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.80)'; } }}
              onMouseLeave={e => { if (!copied) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = TEXT; } }}
            >
              {copied ? <Check size={14} strokeWidth={2.5} style={{ color: 'rgba(74,222,128,0.85)', flexShrink: 0 }} /> : <HelpCircle size={14} strokeWidth={1.8} style={{ color: ICON, flexShrink: 0 }} />}
              {copied ? 'Email copied!' : 'Need help?'}
            </button>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('restart-ftue'))}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', width: '100%', fontSize: 13, fontWeight: 600, color: 'rgba(220,38,38,0.65)', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', borderLeft: '2px solid transparent', fontFamily: 'var(--font-sans)', transition: 'background 0.1s ease' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.07)'; e.currentTarget.style.color = '#ef4444'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(220,38,38,0.65)'; }}
            >
              <LogOut size={14} strokeWidth={1.8} style={{ color: 'currentColor', flexShrink: 0 }} />
              Log out
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
