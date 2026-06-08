'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Home, Users, HeartHandshake, Megaphone, MessageSquare, AlertTriangle, LogOut, HelpCircle, Check, PanelLeftClose } from 'lucide-react';

const BG = '#0D0A3D';
const SEP = 'rgba(255,255,255,0.11)';
const TEXT = 'rgba(255,255,255,0.68)';
const TEXT_ACTIVE = '#FFFFFF';
const ICON = 'rgba(255,255,255,0.48)';
const W_FULL = 272;
const W_COLLAPSED = 56;

const TABS = [
  { key: 'home', label: 'Home', icon: Home, href: '/mentor' },
  { key: 'mentees', label: 'My Mentees', icon: Users, href: '/mentor/mentees' },
  { key: 'counselling', label: 'Counselling', icon: HeartHandshake, href: '/mentor/counselling' },
  { key: 'escalations', label: 'Escalations', icon: AlertTriangle, href: '/mentor/escalations' },
  { key: 'announcements', label: 'Announcements', icon: Megaphone, href: '/mentor/announcements' },
  { key: 'forums', label: 'Forums', icon: MessageSquare, href: '/mentor/forums' },
] as const;

const MENTOR = { name: 'Dr. Meera Nair', initials: 'MN' };

export default function MentorSideNav() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText('support@findmycollege.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside style={{
      width: collapsed ? W_COLLAPSED : W_FULL,
      flexShrink: 0, height: '100%', background: BG,
      display: 'flex', flexDirection: 'column', overflow: 'visible',
      position: 'relative', zIndex: 10, transition: 'width 0.3s ease',
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? '18px 0' : '18px 20px',
        borderBottom: `1px solid ${SEP}`,
        flexShrink: 0, minHeight: 78,
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
      }}>
        {collapsed ? (
          <button onClick={() => setCollapsed(false)} title="Expand sidebar"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
            <img src="/logos/UniversityLMS_DarkBG.svg" alt="University LMS" style={{ height: 30, width: 30, display: 'block', objectFit: 'none', objectPosition: 'left center' }} />
          </button>
        ) : (
          <>
            <img src="/logos/UniversityLMS_DarkBG.svg" alt="University LMS" style={{ height: 38, width: 'auto', display: 'block', maxWidth: 200, flex: 1, minWidth: 0 }} />
            <button onClick={() => setCollapsed(true)} title="Collapse sidebar"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.30)', flexShrink: 0, marginLeft: 8, transition: 'color 0.12s ease' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.70)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.30)'; }}
            >
              <PanelLeftClose size={16} strokeWidth={1.8} />
            </button>
          </>
        )}
      </div>

      {/* Tabs */}
      <nav style={{ padding: collapsed ? '12px 0 4px' : '14px 10px 4px', flex: 1, overflow: 'hidden' }}>
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = tab.href === '/mentor'
            ? pathname === '/mentor'
            : pathname?.startsWith(tab.href);
          return collapsed ? (
            <Link key={tab.key} href={tab.href}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: 44, marginBottom: 2, borderRadius: 6, background: isActive ? 'rgba(255,255,255,0.10)' : 'transparent', textDecoration: 'none' }}
              title={tab.label}
            >
              <Icon size={19} strokeWidth={1.5} color={isActive ? TEXT_ACTIVE : ICON} />
            </Link>
          ) : (
            <Link key={tab.key} href={tab.href}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, height: 44, paddingLeft: 16, paddingRight: 14, marginBottom: 2,
                borderRadius: 6, textDecoration: 'none', transition: 'background 0.12s ease',
                background: isActive ? 'rgba(255,255,255,0.10)' : 'transparent',
                fontFamily: 'var(--font-sans)',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon size={19} strokeWidth={1.5} color={isActive ? TEXT_ACTIVE : ICON} />
              <span style={{ fontSize: 14, fontWeight: isActive ? 700 : 500, color: isActive ? TEXT_ACTIVE : TEXT, letterSpacing: '-0.01em' }}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div style={{ padding: '0 10px 12px', flexShrink: 0 }}>
          <div style={{ borderTop: `1px solid ${SEP}`, paddingTop: 14, marginBottom: 10 }}>
            <button onClick={copyEmail} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 12px', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 6, transition: 'background 0.12s ease' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              <HelpCircle size={14} color={ICON} />
              <span style={{ fontSize: 11, fontWeight: 500, color: TEXT, flex: 1, textAlign: 'left' }}>
                {copied ? 'Email copied!' : 'Need help?'}
              </span>
              {copied && <Check size={12} color="#059669" />}
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#059669', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 800, color: '#fff', flexShrink: 0 }}>{MENTOR.initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: TEXT_ACTIVE, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{MENTOR.name}</div>
              <div style={{ fontSize: 10, color: TEXT, marginTop: 1 }}>Mentor</div>
            </div>
            <Link href="/coordinator" title="Switch to Coordinator" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, background: 'transparent', border: 'none', cursor: 'pointer', color: ICON, borderRadius: 6 }}>
              <LogOut size={14} strokeWidth={1.6} />
            </Link>
          </div>
        </div>
      )}
    </aside>
  );
}
