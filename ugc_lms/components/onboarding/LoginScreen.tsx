'use client';
import { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, ArrowRight, Phone, Mail } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [mode, setMode] = useState<'otp' | 'password'>('otp');
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (resendTimer <= 0) { clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => setResendTimer(t => t - 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [resendTimer > 0]);

  const handleSendOtp = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setOtpSent(true);
    setResendTimer(30);
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setLoading(false);
    onLogin();
  };

  const handleLogin = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    onLogin();
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-sans)',
      background: '#F8F5F1',
      position: 'relative', overflow: 'hidden',
    }}>
      <style>{`
        @keyframes blob1 {
          0%   { transform: translate(0px, 0px)    scale(1);    }
          33%  { transform: translate(60px, -40px)  scale(1.12); }
          66%  { transform: translate(-30px, 30px)  scale(0.95); }
          100% { transform: translate(0px, 0px)    scale(1);    }
        }
        @keyframes blob2 {
          0%   { transform: translate(0px, 0px)    scale(1);    }
          33%  { transform: translate(-50px, 30px)  scale(1.08); }
          66%  { transform: translate(40px, -50px)  scale(1.14); }
          100% { transform: translate(0px, 0px)    scale(1);    }
        }
        @keyframes blob3 {
          0%   { transform: translate(0px, 0px)    scale(1);    }
          33%  { transform: translate(30px, 60px)   scale(0.92); }
          66%  { transform: translate(-60px, -20px) scale(1.1);  }
          100% { transform: translate(0px, 0px)    scale(1);    }
        }
        @keyframes blob4 {
          0%   { transform: translate(0px, 0px)    scale(1);    }
          50%  { transform: translate(-40px, -60px) scale(1.15); }
          100% { transform: translate(0px, 0px)    scale(1);    }
        }
        @keyframes blob5 {
          0%   { transform: translate(0px, 0px)    scale(1);    }
          40%  { transform: translate(70px, 30px)   scale(0.9);  }
          80%  { transform: translate(-20px, 60px)  scale(1.1);  }
          100% { transform: translate(0px, 0px)    scale(1);    }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .login-in { animation: fadeUp 0.5s ease both; }
        .login-in-1 { animation-delay: 0.05s; }
        .login-in-2 { animation-delay: 0.12s; }
        .login-in-3 { animation-delay: 0.20s; }
        .login-in-4 { animation-delay: 0.28s; }
      `}</style>

      {/* ── Animated gradient blobs ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '55vw', height: '55vw', background: 'radial-gradient(ellipse at center, #072FB5 0%, rgba(7,47,181,0) 70%)', borderRadius: '50%', opacity: 0.42, filter: 'blur(72px)', animation: 'blob1 14s ease-in-out infinite' }}/>
        <div style={{ position: 'absolute', top: '20%', right: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(ellipse at center, #FF6A00 0%, rgba(255,106,0,0) 70%)', borderRadius: '50%', opacity: 0.36, filter: 'blur(80px)', animation: 'blob2 18s ease-in-out infinite' }}/>
        <div style={{ position: 'absolute', bottom: '-15%', left: '15%', width: '50vw', height: '50vw', background: 'radial-gradient(ellipse at center, #1346F6 0%, rgba(19,70,246,0) 70%)', borderRadius: '50%', opacity: 0.32, filter: 'blur(64px)', animation: 'blob3 16s ease-in-out infinite' }}/>
        <div style={{ position: 'absolute', bottom: '5%', right: '5%', width: '45vw', height: '45vw', background: 'radial-gradient(ellipse at center, #FF9A00 0%, rgba(255,154,0,0) 70%)', borderRadius: '50%', opacity: 0.30, filter: 'blur(80px)', animation: 'blob4 20s ease-in-out infinite' }}/>
        <div style={{ position: 'absolute', top: '40%', left: '30%', width: '38vw', height: '38vw', background: 'radial-gradient(ellipse at center, #76ACFF 0%, rgba(118,172,255,0) 70%)', borderRadius: '50%', opacity: 0.35, filter: 'blur(60px)', animation: 'blob5 12s ease-in-out infinite' }}/>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(248,245,241,0.40)' }}/>
      </div>

      {/* ── Center content ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: 500,
        padding: '0 24px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>

        {/* Logo */}
        <div className="login-in login-in-1" style={{ marginBottom: 32 }}>
          <img src="/logos/UniversityLMS_LightBG.svg" alt="University LMS" style={{ height: 64, display: 'block' }}/>
        </div>

        {/* Headline */}
        <div className="login-in login-in-2" style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800,
            color: 'var(--text-headings)', letterSpacing: '-0.03em',
            lineHeight: 1.1, margin: 0,
          }}>
            Your learning starts today.
          </h1>
        </div>

        {/* Login card */}
        <div className="login-in login-in-3" style={{
          width: '100%',
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: 'var(--radius-xl)',
          border: '1.5px solid rgba(255,255,255,0.95)',
          boxShadow: '0 12px 60px rgba(7,47,181,0.12), 0 2px 10px rgba(0,0,0,0.06)',
          padding: '36px 36px 30px',
        }}>

          {/* Card heading */}
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--text-headings)', letterSpacing: '-0.02em', margin: '0 0 4px' }}>
              Login
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-tertiary)', margin: 0 }}>
              Enter your mobile number or email to continue.
            </p>
          </div>

          {/* Primary: OTP (phone/email) */}
          {mode === 'otp' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Contact input — locked after OTP sent */}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
                  Mobile number or email
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }}>
                    <Phone size={15}/>
                  </div>
                  <input
                    type="text"
                    value={contact}
                    onChange={e => { if (!otpSent) setContact(e.target.value); }}
                    onFocus={() => setFocused('contact')}
                    onBlur={() => setFocused(null)}
                    placeholder="+91 98765 43210 or email"
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      padding: '13px 14px 13px 40px',
                      fontSize: 14, fontFamily: 'var(--font-sans)',
                      color: 'var(--text-primary)',
                      background: otpSent ? '#F4F4F4' : focused === 'contact' ? '#fff' : '#F8F8F8',
                      border: `1.5px solid ${otpSent ? '#E0E0E0' : focused === 'contact' ? 'var(--blue-700)' : '#E0E0E0'}`,
                      borderRadius: 'var(--radius-sm)',
                      outline: 'none',
                      transition: 'all 0.15s ease',
                      boxShadow: focused === 'contact' && !otpSent ? '0 0 0 3px rgba(7,47,181,0.10)' : 'none',
                    }}
                  />
                  {otpSent && (
                    <button onClick={() => { setOtpSent(false); setOtp(''); }} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: 'var(--blue-700)', fontFamily: 'var(--font-sans)', padding: 0 }}>
                      Change
                    </button>
                  )}
                </div>
              </div>

              {/* OTP input — shown after OTP sent */}
              {otpSent && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      Enter OTP
                    </label>
                    <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Sent to {contact}</span>
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                    onFocus={() => setFocused('otp')}
                    onBlur={() => setFocused(null)}
                    placeholder="• • • • • •"
                    autoFocus
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      padding: '13px 14px',
                      fontSize: 22, fontFamily: 'var(--font-mono)', fontWeight: 700,
                      letterSpacing: '0.25em', textAlign: 'center',
                      color: 'var(--text-primary)',
                      background: focused === 'otp' ? '#fff' : '#F8F8F8',
                      border: `1.5px solid ${focused === 'otp' ? 'var(--blue-700)' : '#E0E0E0'}`,
                      borderRadius: 'var(--radius-sm)',
                      outline: 'none',
                      transition: 'all 0.15s ease',
                      boxShadow: focused === 'otp' ? '0 0 0 3px rgba(7,47,181,0.10)' : 'none',
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
                    {resendTimer > 0 ? (
                      <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-tertiary)', fontFamily: 'var(--font-sans)' }}>
                        Resend in <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-secondary)' }}>0:{resendTimer.toString().padStart(2, '0')}</span>
                      </span>
                    ) : (
                      <button onClick={handleSendOtp} disabled={loading} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: 'var(--blue-700)', fontFamily: 'var(--font-sans)', padding: 0 }}>
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Action button */}
              <button
                onClick={otpSent ? handleVerifyOtp : handleSendOtp}
                disabled={loading || (!otpSent && !contact.trim()) || (otpSent && otp.length < 4)}
                style={{
                  width: '100%', padding: '14px 0',
                  fontSize: 14.5, fontWeight: 700,
                  color: '#fff', background: 'var(--blue-700)',
                  border: 'none', borderRadius: 'var(--radius-sm)',
                  cursor: loading ? 'default' : 'pointer',
                  fontFamily: 'var(--font-sans)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'opacity 0.15s ease',
                  letterSpacing: '0.01em',
                  opacity: ((!otpSent && !contact.trim()) || (otpSent && otp.length < 4)) ? 0.5 : 1,
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.88'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = ((!otpSent && !contact.trim()) || (otpSent && otp.length < 4)) ? '0.5' : '1'; }}
              >
                {loading
                  ? <><span style={{ width: 16, height: 16, border: '2.5px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }}/> {otpSent ? 'Verifying…' : 'Sending OTP…'}</>
                  : otpSent ? <>Verify OTP <ArrowRight size={15}/></> : <>Send OTP <ArrowRight size={15}/></>
                }
              </button>

              {!otpSent && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 2 }}>
                    <div style={{ flex: 1, height: 1, background: '#E8E8E8' }}/>
                    <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)', fontWeight: 500, whiteSpace: 'nowrap' }}>or</span>
                    <div style={{ flex: 1, height: 1, background: '#E8E8E8' }}/>
                  </div>
                  <button
                    onClick={() => setMode('password')}
                    style={{
                      width: '100%', padding: '13px 0',
                      fontSize: 13.5, fontWeight: 600,
                      color: 'var(--text-primary)', background: '#fff',
                      border: '1.5px solid #E0E0E0', borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer', fontFamily: 'var(--font-sans)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      transition: 'border-color 0.15s, box-shadow 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#C0C0C0'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E0E0E0'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <Mail size={14}/> Use email & password
                  </button>
                </>
              )}
            </div>
          )}

          {/* Secondary: email + password */}
          {mode === 'password' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  placeholder="you@company.com"
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '13px 14px', fontSize: 14, fontFamily: 'var(--font-sans)',
                    color: 'var(--text-primary)',
                    background: focused === 'email' ? '#fff' : '#F8F8F8',
                    border: `1.5px solid ${focused === 'email' ? 'var(--blue-700)' : '#E0E0E0'}`,
                    borderRadius: 'var(--radius-sm)', outline: 'none', transition: 'all 0.15s ease',
                    boxShadow: focused === 'email' ? '0 0 0 3px rgba(7,47,181,0.10)' : 'none',
                  }}
                />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Password</label>
                  <button style={{ fontSize: 12, fontWeight: 600, color: 'var(--blue-700)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-sans)' }}>Forgot?</button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                    placeholder="••••••••"
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      padding: '13px 44px 13px 14px', fontSize: 14, fontFamily: 'var(--font-sans)',
                      color: 'var(--text-primary)',
                      background: focused === 'password' ? '#fff' : '#F8F8F8',
                      border: `1.5px solid ${focused === 'password' ? 'var(--blue-700)' : '#E0E0E0'}`,
                      borderRadius: 'var(--radius-sm)', outline: 'none', transition: 'all 0.15s ease',
                      boxShadow: focused === 'password' ? '0 0 0 3px rgba(7,47,181,0.10)' : 'none',
                    }}
                  />
                  <button onClick={() => setShowPassword(v => !v)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 0 }}>
                    {showPassword ? <EyeOff size={15}/> : <Eye size={15}/>}
                  </button>
                </div>
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                style={{
                  width: '100%', padding: '14px 0',
                  fontSize: 14.5, fontWeight: 700,
                  color: '#fff', background: 'var(--blue-700)',
                  border: 'none', borderRadius: 'var(--radius-sm)',
                  cursor: loading ? 'default' : 'pointer',
                  fontFamily: 'var(--font-sans)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'opacity 0.15s ease', letterSpacing: '0.01em',
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.88'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
              >
                {loading
                  ? <><span style={{ width: 16, height: 16, border: '2.5px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }}/> Signing in…</>
                  : <>Sign in <ArrowRight size={15}/></>
                }
              </button>

              <button
                onClick={() => setMode('otp')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--text-tertiary)', fontFamily: 'var(--font-sans)', padding: '4px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
              >
                <Phone size={13}/> Sign in with OTP instead
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="login-in login-in-4" style={{ fontSize: 12, color: 'var(--text-tertiary)', textAlign: 'center', marginTop: 20, lineHeight: 1.65 }}>
          By continuing, you agree to our{' '}
          <a href="#" style={{ color: 'var(--blue-700)', textDecoration: 'none', fontWeight: 600 }}>Terms</a>
          {' '}and{' '}
          <a href="#" style={{ color: 'var(--blue-700)', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
