'use client';
import { useState, useRef } from 'react';
import {
  Play, Pause, Volume2, VolumeX, Maximize,
  RotateCcw, RotateCw, CheckCircle2, ArrowRight, ChevronLeft, ChevronRight,
} from 'lucide-react';

const GRADIENTS: Record<string, { from: string; to: string; accent: string; mid: string }> = {
  'spoken-english':        { from: '#1a2f7a', to: '#3a5ec8', accent: '#a8c4ff', mid: '#2a4ab8' },
  'active-listening':      { from: '#0d5c3a', to: '#1e9e68', accent: '#90f0c8', mid: '#1a7a52' },
  'business-writing':      { from: '#7a3a0a', to: '#c87028', accent: '#ffd08a', mid: '#a05818' },
  'reading-comprehension': { from: '#3a1a7a', to: '#7048c8', accent: '#d0b0ff', mid: '#5028a8' },
  'workplace-skills':      { from: '#0a4878', to: '#2080b8', accent: '#90d8f8', mid: '#1468a0' },
  'career-readiness':      { from: '#882810', to: '#c85030', accent: '#ffc090', mid: '#b04020' },
  'ielts-readiness':       { from: '#102878', to: '#3060b8', accent: '#90b8ff', mid: '#1840a0' },
};

const DEFAULT_GRADIENT = { from: '#1a2f7a', to: '#3a5ec8', accent: '#a8c4ff', mid: '#2a4ab8' };

const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

type ActivityItem = {
  id: string;
  type: string;
  title: string;
  duration: string;
  done: boolean;
  current?: boolean;
};

interface VideoActivityProps {
  activity: ActivityItem;
  courseId: string;
  onBack: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export default function VideoActivity({
  activity, courseId, onPrev, onNext, hasPrev, hasNext,
}: VideoActivityProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(34);
  const [volume, setVolume] = useState(80);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showSpeed, setShowSpeed] = useState(false);
  const [hovering, setHovering] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const grad = GRADIENTS[courseId] ?? DEFAULT_GRADIENT;

  const totalSecs = activity.duration.includes(':')
    ? parseInt(activity.duration.split(':')[0]) * 60 + parseInt(activity.duration.split(':')[1])
    : 0;
  const elapsed = Math.floor(totalSecs * progress / 100);
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setProgress(Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)));
  };

  const skip = (secs: number) => {
    const newElapsed = Math.max(0, Math.min(totalSecs, elapsed + secs));
    setProgress(totalSecs > 0 ? (newElapsed / totalSecs) * 100 : 0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'var(--font-sans)', overflow: 'hidden' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>

          {/* ── Video Player ── */}
          <div
            style={{ position: 'relative', paddingBottom: '56.25%', overflow: 'hidden', marginBottom: 16, borderRadius: 'var(--radius-md)', cursor: 'pointer', background: `linear-gradient(160deg, ${grad.from} 0%, ${grad.mid} 50%, ${grad.to} 100%)` }}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => { setHovering(false); setShowSpeed(false); }}
          >
            {/* Abstract SVG background */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="rg1" cx="20%" cy="30%"><stop offset="0%" stopColor={grad.accent} stopOpacity="0.18"/><stop offset="100%" stopColor={grad.accent} stopOpacity="0"/></radialGradient>
                <radialGradient id="rg2" cx="80%" cy="70%"><stop offset="0%" stopColor={grad.accent} stopOpacity="0.14"/><stop offset="100%" stopColor={grad.accent} stopOpacity="0"/></radialGradient>
              </defs>
              <rect width="800" height="450" fill="url(#rg1)"/>
              <rect width="800" height="450" fill="url(#rg2)"/>
              <circle cx="680" cy="60" r="120" fill={grad.accent} fillOpacity="0.07"/>
              <circle cx="100" cy="380" r="90" fill={grad.accent} fillOpacity="0.06"/>
              <path d="M0 300 Q200 220 400 280 T800 240 L800 450 L0 450Z" fill={grad.accent} fillOpacity="0.08"/>
              <path d="M0 350 Q200 290 400 330 T800 300 L800 450 L0 450Z" fill={grad.accent} fillOpacity="0.06"/>
              {/* Grid lines */}
              {[1,2,3,4,5,6,7].map(i => (
                <line key={`v${i}`} x1={i*100} y1="0" x2={i*100} y2="450" stroke={grad.accent} strokeOpacity="0.04" strokeWidth="1"/>
              ))}
              {[1,2,3,4].map(i => (
                <line key={`h${i}`} x1="0" y1={i*90} x2="800" y2={i*90} stroke={grad.accent} strokeOpacity="0.04" strokeWidth="1"/>
              ))}
            </svg>

            {/* Top overlay: lesson badge */}
            <div style={{ position: 'absolute', top: 14, left: 16, display: 'flex', alignItems: 'center', gap: 8, zIndex: 3 }}>
              <div style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: 100, fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.08em', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.12)' }}>
                Video Lesson
              </div>
              {activity.done && (
                <div style={{ background: 'rgba(22,163,74,0.85)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: 100, fontSize: 10, fontWeight: 700, color: '#fff', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle2 size={10}/> Watched
                </div>
              )}
            </div>

            {/* Duration badge */}
            <div style={{ position: 'absolute', top: 14, right: 16, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, color: 'white', fontFamily: 'var(--font-mono)', border: '1px solid rgba(255,255,255,0.12)', zIndex: 3 }}>
              {activity.duration}
            </div>

            {/* Bottom gradient */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 40%, transparent 65%)', zIndex: 2 }}/>

            {/* Center play button */}
            <button
              onClick={() => setIsPlaying(p => !p)}
              style={{ position: 'absolute', top: '50%', left: '50%', transform: `translate(-50%, -50%) scale(${hovering ? 1 : 0.9})`, width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1.5px solid rgba(255,255,255,0.3)', display: 'grid', placeItems: 'center', cursor: 'pointer', transition: 'transform 0.2s ease, background 0.15s ease, opacity 0.2s ease', opacity: hovering || !isPlaying ? 1 : 0, zIndex: 3 }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = `translate(-50%, -50%) scale(${hovering ? 1 : 0.9})`; }}
            >
              {isPlaying
                ? <Pause size={26} color="white" fill="white" strokeWidth={0}/>
                : <Play size={26} color="white" fill="white" strokeWidth={0} style={{ marginLeft: 3 }}/>
              }
            </button>

            {/* Controls bar */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 4, padding: '0 16px 14px', opacity: hovering || !isPlaying ? 1 : 0, transition: 'opacity 0.2s ease' }}>

              {/* Progress bar */}
              <div ref={progressRef}
                style={{ height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 100, cursor: 'pointer', position: 'relative', marginBottom: 10, transition: 'height 0.15s ease' }}
                onClick={handleProgressClick}
                onMouseEnter={e => { e.currentTarget.style.height = '6px'; }}
                onMouseLeave={e => { e.currentTarget.style.height = '4px'; }}
              >
                {/* Buffered */}
                <div style={{ position: 'absolute', height: '100%', width: `${Math.min(100, progress + 18)}%`, background: 'rgba(255,255,255,0.15)', borderRadius: 100 }}/>
                {/* Played */}
                <div style={{ height: '100%', width: `${progress}%`, background: grad.accent, borderRadius: 100, position: 'relative', transition: 'width 0.05s linear' }}>
                  <div style={{ position: 'absolute', right: -5, top: '50%', transform: 'translateY(-50%)', width: 12, height: 12, borderRadius: '50%', background: 'white', boxShadow: '0 0 0 2px rgba(255,255,255,0.3)' }}/>
                </div>
              </div>

              {/* Controls row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>

                {/* Play/Pause */}
                <button onClick={() => setIsPlaying(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 8px', display: 'grid', placeItems: 'center', transition: 'opacity 0.1s' }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.8'; }} onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}>
                  {isPlaying
                    ? <Pause size={18} color="white" fill="white" strokeWidth={0}/>
                    : <Play size={18} color="white" fill="white" strokeWidth={0} style={{ marginLeft: 2 }}/>
                  }
                </button>

                {/* Skip back */}
                <button onClick={() => skip(-10)} title="Back 10s" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 6px', display: 'grid', placeItems: 'center', color: 'rgba(255,255,255,0.65)', transition: 'color 0.1s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }} onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}>
                  <RotateCcw size={14} strokeWidth={2}/>
                </button>

                {/* Skip forward */}
                <button onClick={() => skip(10)} title="Forward 10s" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 6px', display: 'grid', placeItems: 'center', color: 'rgba(255,255,255,0.65)', transition: 'color 0.1s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }} onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}>
                  <RotateCw size={14} strokeWidth={2}/>
                </button>

                {/* Volume — hover to reveal slider */}
                <div style={{ display: 'flex', alignItems: 'center', marginLeft: 4, position: 'relative' }}
                  onMouseEnter={e => { const sl = e.currentTarget.querySelector('[data-vol-slider]') as HTMLElement; if (sl) { sl.style.width = '60px'; sl.style.opacity = '1'; sl.style.marginLeft = '4px'; } }}
                  onMouseLeave={e => { const sl = e.currentTarget.querySelector('[data-vol-slider]') as HTMLElement; if (sl) { sl.style.width = '0px'; sl.style.opacity = '0'; sl.style.marginLeft = '0px'; } }}
                >
                  <button onClick={() => setMuted(m => !m)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 6px', display: 'grid', placeItems: 'center' }}>
                    {muted ? <VolumeX size={14} color="rgba(255,255,255,0.65)"/> : <Volume2 size={14} color="rgba(255,255,255,0.65)"/>}
                  </button>
                  <input data-vol-slider type="range" min={0} max={100} value={muted ? 0 : volume}
                    onChange={e => { setVolume(+e.target.value); setMuted(+e.target.value === 0); }}
                    style={{ width: 0, opacity: 0, marginLeft: 0, cursor: 'pointer', accentColor: grad.accent, transition: 'width 0.2s ease, opacity 0.2s ease, margin 0.2s ease', height: 3 }}
                  />
                </div>

                {/* Time */}
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-mono)', fontWeight: 500, marginLeft: 8, letterSpacing: '0.01em' }}>
                  <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>{fmt(elapsed)}</span> / {activity.duration}
                </span>

                <div style={{ flex: 1 }}/>

                {/* Speed */}
                <div style={{ position: 'relative' }}
                  onMouseEnter={() => setShowSpeed(true)}
                  onMouseLeave={() => setShowSpeed(false)}>
                  <button style={{ background: 'rgba(255,255,255,0.10)', border: 'none', borderRadius: 4, cursor: 'pointer', padding: '3px 8px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-mono)', letterSpacing: '0.02em', transition: 'background 0.1s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; }}>
                    {speed === 1 ? '1×' : `${speed}×`}
                  </button>
                  {showSpeed && (
                    <div style={{ position: 'absolute', bottom: '100%', right: 0, marginBottom: 6, background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', minWidth: 64 }}>
                      {SPEEDS.map(s => (
                        <button key={s} onClick={() => { setSpeed(s); setShowSpeed(false); }}
                          style={{ display: 'block', width: '100%', padding: '6px 12px', fontSize: 11, fontWeight: speed === s ? 700 : 500, color: speed === s ? grad.accent : 'rgba(255,255,255,0.65)', background: speed === s ? 'rgba(255,255,255,0.06)' : 'none', border: 'none', cursor: 'pointer', textAlign: 'center', fontFamily: 'var(--font-mono)', transition: 'background 0.1s' }}
                          onMouseEnter={e => { if (speed !== s) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                          onMouseLeave={e => { if (speed !== s) e.currentTarget.style.background = 'none'; }}
                        >
                          {s === 1 ? '1×' : `${s}×`}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Fullscreen */}
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 6px', display: 'grid', placeItems: 'center', marginLeft: 6, color: 'rgba(255,255,255,0.55)', transition: 'color 0.1s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }} onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}>
                  <Maximize size={14}/>
                </button>
              </div>
            </div>
          </div>

          {/* Below player */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
            <h1 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1.3, margin: 0, fontFamily: 'var(--font-display)' }}>
              {activity.title}
            </h1>
            {activity.done && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--green-600)', fontSize: 12, fontWeight: 700, flexShrink: 0, background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '5px 10px', borderRadius: 100 }}>
                <CheckCircle2 size={13} strokeWidth={2.5}/> Completed
              </div>
            )}
          </div>

          {/* Prev / Next nav */}
          <div style={{ display: 'flex', gap: 8 }}>
            {hasPrev && (
              <button onClick={onPrev}
                style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: 'var(--bg-section)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'border-color 0.1s ease', fontFamily: 'var(--font-sans)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blue-700)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
              >
                <ChevronLeft size={15} color="var(--text-tertiary)"/>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>Previous</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>Previous activity</div>
                </div>
              </button>
            )}
            {hasNext && (
              <button onClick={onNext}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '12px 14px', background: 'var(--bg-section)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'border-color 0.1s ease', fontFamily: 'var(--font-sans)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blue-700)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
              >
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>Up next</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>Next activity</div>
                </div>
                <ArrowRight size={15} color="var(--text-tertiary)"/>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
