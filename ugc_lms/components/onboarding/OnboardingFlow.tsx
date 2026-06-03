'use client';
import { useState } from 'react';
import { ArrowRight, User, Mail, Phone } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: (profile: { name: string; email: string; phone: string }) => void;
}

const PROGRAM_NAME = 'Professional Communication Excellence';

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [name,  setName]  = useState('Rahul Sharma');
  const [email, setEmail] = useState('rahul@company.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [focused, setFocused] = useState<string | null>(null);

  const firstName = name.trim().split(' ')[0];
  const canSubmit = name.trim().length >= 2 && email.trim().length >= 4 && phone.trim().length >= 6;

  const fields = [
    { key: 'name',  label: 'Name',  Icon: User,  value: name,  setter: setName,  type: 'text',  placeholder: 'Your full name' },
    { key: 'email', label: 'Email', Icon: Mail,  value: email, setter: setEmail, type: 'email', placeholder: 'you@company.com' },
    { key: 'phone', label: 'Phone', Icon: Phone, value: phone, setter: setPhone, type: 'tel',   placeholder: '+91 98765 43210' },
  ] as const;

  return (
    <div style={{ height: '100vh', display: 'flex', overflow: 'hidden', fontFamily: 'var(--font-sans)' }}>
      <style>{`
        @keyframes ob-slide-in {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes ob-fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ob-left  { animation: ob-slide-in 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        .ob-right { animation: ob-fade-up  0.5s 0.08s cubic-bezier(0.22,1,0.36,1) both; }
        .ob-r1 { animation: ob-fade-up 0.4s 0.18s ease both; }
        .ob-r2 { animation: ob-fade-up 0.4s 0.24s ease both; }
        .ob-r3 { animation: ob-fade-up 0.4s 0.30s ease both; }
        .ob-cta { animation: ob-fade-up 0.4s 0.36s ease both; }
        .confirm-btn { transition: transform 0.15s ease, box-shadow 0.15s ease !important; }
        .confirm-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 36px rgba(7,47,181,0.38) !important; }
        .confirm-btn:active { transform: translateY(0); }
        .field-row { transition: background 0.15s ease; }
        .field-row:focus-within { background: rgba(7,47,181,0.03) !important; }
      `}</style>

      {/* ── LEFT: Program Identity Panel ── */}
      <div className="ob-left" style={{
        flex: '0 0 46%',
        background: 'linear-gradient(155deg, #0B1F72 0%, #040D26 60%, #060F22 100%)',
        display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative rings */}
        <svg style={{ position: 'absolute', top: -80, right: -100, opacity: 0.06 }} width="500" height="500" viewBox="0 0 500 500">
          <circle cx="250" cy="250" r="180" fill="none" stroke="white" strokeWidth="1"/>
          <circle cx="250" cy="250" r="260" fill="none" stroke="white" strokeWidth="0.6"/>
          <circle cx="250" cy="250" r="340" fill="none" stroke="white" strokeWidth="0.4"/>
        </svg>
        <svg style={{ position: 'absolute', bottom: -60, left: -60, opacity: 0.04 }} width="360" height="360" viewBox="0 0 360 360">
          <circle cx="180" cy="180" r="140" fill="none" stroke="white" strokeWidth="1"/>
          <circle cx="180" cy="180" r="210" fill="none" stroke="white" strokeWidth="0.5"/>
        </svg>

        {/* Glow dots */}
        <div style={{ position: 'absolute', top: 120, right: 80, width: 8, height: 8, borderRadius: '50%', background: '#FF6B00', boxShadow: '0 0 28px 8px rgba(255,107,0,0.45)' }}/>
        <div style={{ position: 'absolute', bottom: 200, left: 56, width: 5, height: 5, borderRadius: '50%', background: '#FFB800', opacity: 0.55 }}/>

        {/* Logo */}
        <div style={{ padding: '36px 48px 0', position: 'relative', zIndex: 1 }}>
          <img
            src="/logos/Primary_Horizontal_LightBG.svg"
            alt="FindMyCollege"
            style={{ height: 30, filter: 'brightness(0) invert(1)', opacity: 0.85 }}
          />
        </div>

        {/* Main copy */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 48px 72px', position: 'relative', zIndex: 1 }}>

          {/* Welcome line */}
          <p style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.40)', margin: '0 0 14px', letterSpacing: '0.02em' }}>
            Welcome to
          </p>

          {/* Program name */}
          <div style={{ marginBottom: 40 }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 42, fontWeight: 800,
              color: '#fff', letterSpacing: '-0.04em',
              lineHeight: 1.05, margin: '0 0 2px',
            }}>
              Professional<br/>Communication
            </h1>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 42, fontWeight: 800,
              letterSpacing: '-0.04em', lineHeight: 1.05, margin: 0,
              color: '#FF8A38',
            }}>
              Excellence
            </h1>
          </div>

        </div>
      </div>

      {/* ── RIGHT: Confirm Details Panel ── */}
      <div className="ob-right" style={{
        flex: 1,
        background: '#F8F7F4',
        backgroundImage: 'radial-gradient(rgba(0,0,0,0.055) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 72px',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Heading */}
          <div className="ob-r1" style={{ marginBottom: 28 }}>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800,
              color: 'var(--text-headings)', letterSpacing: '-0.03em',
              margin: '0 0 8px', lineHeight: 1.15,
            }}>
              Confirm your details
            </h2>
            <p style={{ fontSize: 13.5, color: 'var(--text-tertiary)', margin: 0, lineHeight: 1.55 }}>
              Pre-filled from your account — edit anything that looks off.
            </p>
          </div>

          {/* Field rows */}
          <div className="ob-r2" style={{
            background: '#fff',
            border: '1.5px solid #E6E4E0',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            marginBottom: 16,
            boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
          }}>
            {fields.map(({ key, label, Icon, value, setter, type, placeholder }, i) => (
              <div
                key={key}
                className="field-row"
                style={{
                  display: 'flex', alignItems: 'center',
                  borderBottom: i < fields.length - 1 ? '1px solid #F0EDE8' : 'none',
                  padding: '0 20px',
                  background: focused === key ? 'rgba(7,47,181,0.025)' : 'transparent',
                }}
              >
                <span style={{
                  width: 46, flexShrink: 0,
                  fontSize: 10.5, fontWeight: 700, letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  color: focused === key ? 'var(--blue-700)' : '#B0B0B0',
                  transition: 'color 0.15s ease',
                }}>
                  {label}
                </span>
                <div style={{ width: 1, height: 14, background: '#E0DDD8', flexShrink: 0, margin: '0 14px' }}/>
                <Icon
                  size={13}
                  color={focused === key ? '#072FB5' : '#C8C5C0'}
                  style={{ flexShrink: 0, marginRight: 10, transition: 'color 0.15s' } as React.CSSProperties}
                />
                <input
                  type={type}
                  value={value}
                  onChange={e => setter(e.target.value)}
                  onFocus={() => setFocused(key)}
                  onBlur={() => setFocused(null)}
                  placeholder={placeholder}
                  style={{
                    flex: 1, border: 'none', outline: 'none',
                    padding: '16px 0',
                    fontSize: 14, fontFamily: 'var(--font-sans)',
                    color: 'var(--text-primary)', background: 'transparent',
                    letterSpacing: '0.01em',
                  }}
                />
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="ob-cta">
            <button
              className="confirm-btn"
              onClick={() => onComplete({ name, email, phone })}
              disabled={!canSubmit}
              style={{
                width: '100%', padding: '15px 0',
                fontSize: 14.5, fontWeight: 700, fontFamily: 'var(--font-sans)',
                color: '#fff',
                background: canSubmit ? 'var(--blue-700)' : '#C8C8C8',
                border: 'none', borderRadius: 'var(--radius-md)',
                cursor: canSubmit ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                letterSpacing: '0.01em',
                boxShadow: canSubmit ? '0 4px 22px rgba(7,47,181,0.30)' : 'none',
              }}
            >
              Yes, that's me — let's go <ArrowRight size={15}/>
            </button>
            <p style={{ textAlign: 'center', fontSize: 11.5, color: '#B8B3AC', margin: '12px 0 0', lineHeight: 1.5 }}>
              You can update these details anytime from your profile.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
