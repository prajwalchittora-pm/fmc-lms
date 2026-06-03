'use client';
import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import SideNav from '@/components/SideNav';
import GreetingHero from '@/components/home/GreetingHero';
import ContinueLearningCard from '@/components/home/ContinueLearningCard';
import CertificateCard from '@/components/home/CertificateCard';
import ContinueWatching from '@/components/home/ContinueWatching';
import ContinueReading from '@/components/home/ContinueReading';
import EnrolledCourses from '@/components/home/EnrolledCourses';
import CourseView from '@/components/learn/CourseView';
import { COURSES, PROGRAMMES } from '@/lib/mockData';
import { usePrototype } from '@/context/PrototypeContext';

interface FirstTimeHomeProps {
  profile: { name: string; email: string; phone: string };
  onTourDone: () => void;
}

type Side = 'bottom' | 'top' | 'right' | 'left' | 'center';

interface TourStep {
  screen: 'home' | 'course';
  selector?: string;
  side: Side;
  title: string;
  body: string;
  cta: string;
}

const STEPS: TourStep[] = [
  {
    screen: 'home',
    selector: '[data-tour="programme"]',
    side: 'right',
    title: '__WELCOME_TITLE__',
    body: '__PROGRAMME_BODY__',
    cta: 'Start tour',
  },
  {
    screen: 'home',
    selector: '[data-tour="start-course"]',
    side: 'bottom',
    title: 'Your first course',
    body: 'Tap here to dive into your enrolled course and kick off your learning journey.',
    cta: 'Next',
  },
  {
    screen: 'course',
    selector: '[data-tour="current-activity"]',
    side: 'right',
    title: 'Your first activity',
    body: 'This is your starting point. Click it to open the activity — videos, reading pages, or quizzes await.',
    cta: 'Got it',
  },
  {
    screen: 'course',
    selector: '[data-tour="activity-filter"]',
    side: 'right',
    title: 'Filter & search',
    body: 'Filter by Video, Page, or Quiz — or search by name to jump to any activity instantly.',
    cta: 'Next',
  },
  {
    screen: 'course',
    selector: '[data-tour="need-help"]',
    side: 'top',
    title: 'Need help anytime?',
    body: "Hit this button to reach our support team — they're usually online and reply in under 2 minutes.",
    cta: 'Next',
  },
  {
    screen: 'home',
    selector: undefined,
    side: 'center',
    title: "You're all set! 🎉",
    body: "Tour complete. You now know your way around the platform. Your first activity is ready and waiting — jump in whenever you're ready.",
    cta: "Done",
  },
];

const SP = 10;  // spotlight padding px
const GAP = 12; // gap between spotlight edge and tooltip
const TW = 420; // tooltip width px
const DIM = 'rgba(5,12,30,0.58)';

export default function FirstTimeHome({ profile, onTourDone }: FirstTimeHomeProps) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const firstName = profile.name.trim().split(' ')[0];
  const firstCourseId = COURSES[0]?.id ?? '';
  const { activeProgrammeId } = usePrototype();
  const activeProg = PROGRAMMES.find(p => p.id === activeProgrammeId) ?? PROGRAMMES[0];
  const current = { ...STEPS[step] };
  if (current.title === '__WELCOME_TITLE__') {
    current.title = `Hi ${firstName}! Let's get you started`;
  }
  if (current.body === '__PROGRAMME_BODY__') {
    current.body = `__RICH__You're enrolled in <strong style="color:#8F3B00">${activeProg.name}</strong>. Here's a quick tour so you know where everything is.`;
  }

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else onTourDone();
  };

  useEffect(() => {
    setRect(null);
    if (!current.selector) return;
    const query = () => {
      const el = document.querySelector(current.selector!);
      if (el) {
        (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => setRect((document.querySelector(current.selector!) as Element)?.getBoundingClientRect() ?? null), 320);
      }
    };
    const t = setTimeout(query, 150);
    return () => clearTimeout(t);
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!current.selector) return;
    const onResize = () => {
      const el = document.querySelector(current.selector!);
      if (el) setRect(el.getBoundingClientRect());
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [current.selector]);

  const hasSpotlight = current.side !== 'center' && rect !== null;

  // Spotlight rect — padded outward for glow effect, clamped to viewport
  const isInSidenav = rect ? rect.left < 280 : false;
  const pad = isInSidenav ? 6 : SP;
  const sl = rect ? Math.max(2, rect.left - pad) : 0;
  const st = rect ? Math.max(2, rect.top - pad) : 0;
  const sr = rect ? (isInSidenav ? Math.min(rect.right + 2, 272) : rect.right + pad) : 0;
  const sb = rect ? Math.min(window.innerHeight - 2, rect.bottom + pad) : 0;
  const sw = sr - sl;
  const sh = sb - st;

  // Tooltip position
  const getTooltipPos = (): React.CSSProperties => {
    if (!hasSpotlight || !rect) return {};
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const clampX = (x: number) => Math.max(16, Math.min(x, vw - TW - 16));

    if (current.side === 'bottom') return { top: Math.min(sb + GAP, vh - 160), left: clampX(sl) };
    if (current.side === 'top')    return { top: Math.max(16, st - GAP - 90), left: clampX(sl) };
    if (current.side === 'right')  return { top: Math.max(16, st), left: Math.min(sr + GAP, vw - TW - 16) };
    if (current.side === 'left')   return { top: Math.max(16, st), left: Math.max(16, sl - GAP - TW) };
    return {};
  };

  // Arrow pointing from tooltip toward spotlight
  const getArrow = (): React.CSSProperties | null => {
    if (!hasSpotlight) return null;
    const base: React.CSSProperties = {
      position: 'absolute', width: 12, height: 12,
      background: '#fff', transform: 'rotate(45deg)',
      zIndex: 0,
    };
    if (current.side === 'bottom') return { ...base, top: -6, left: 24 };
    if (current.side === 'top')    return { ...base, bottom: -6, left: 24 };
    if (current.side === 'right')  return { ...base, left: -6, top: 24 };
    if (current.side === 'left')   return { ...base, right: -6, top: 24 };
    return null;
  };

  const arrow = getArrow();
  const tooltipPos = getTooltipPos();

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-white)', fontFamily: 'var(--font-sans)' }}>
      <style>{`
        @keyframes ftSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ftRingPulse {
          0%, 100% { box-shadow: 0 0 0 2.5px rgba(7,47,181,0.95), 0 0 0 6px rgba(7,47,181,0.22); }
          50%       { box-shadow: 0 0 0 2.5px rgba(7,47,181,1),    0 0 0 10px rgba(7,47,181,0.10); }
        }
        .ft-tooltip { animation: ftSlideUp 0.28s cubic-bezier(0.22,1,0.36,1) both; }
        .ft-ring    { animation: ftRingPulse 2s ease-in-out infinite; }
      `}</style>

      <SideNav />

      {/* ── Home screen ── */}
      {current.screen === 'home' && (
        <main style={{ flex: 1, height: '100vh', overflow: 'auto', padding: '40px 60px 200px', boxSizing: 'border-box' }}>
          <GreetingHero />
          <div style={{ marginTop: 20, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ flex: '0 0 70%', minWidth: 0 }}>
              <ContinueLearningCard firstTime />
            </div>
            <div style={{ flex: '0 0 calc(30% - 16px)', minWidth: 0 }}>
              <CertificateCard />
            </div>
          </div>
          <ContinueWatching firstTime />
          <ContinueReading firstTime />
          <EnrolledCourses />
        </main>
      )}

      {/* ── Course screen ── */}
      {current.screen === 'course' && (
        <div style={{ flex: 1, height: '100vh', overflow: 'hidden', padding: '20px 40px', boxSizing: 'border-box' }}>
          <div style={{ height: '100%', overflow: 'hidden' }}>
            <CourseView courseId={firstCourseId} onBack={() => setStep(0)} />
          </div>
        </div>
      )}

      {/* ── OVERLAY ── */}
      {/* Full overlay for center steps (no spotlight) */}
      {!hasSpotlight && (
        <div style={{ position: 'fixed', inset: 0, background: DIM, zIndex: 200 }}/>
      )}

      {/* 4-rect overlay for spotlight steps — leaves a hole at the target */}
      {hasSpotlight && (
        <>
          {/* Top */}
          <div style={{ position: 'fixed', left: 0, top: 0, right: 0, height: st, background: DIM, zIndex: 200 }}/>
          {/* Bottom */}
          <div style={{ position: 'fixed', left: 0, top: sb, right: 0, bottom: 0, background: DIM, zIndex: 200 }}/>
          {/* Left */}
          <div style={{ position: 'fixed', left: 0, top: st, width: sl, height: sh, background: DIM, zIndex: 200 }}/>
          {/* Right */}
          <div style={{ position: 'fixed', left: sr, top: st, right: 0, height: sh, background: DIM, zIndex: 200 }}/>

          {/* Spotlight ring (pulsing border around target) */}
          <div
            className="ft-ring"
            style={{
              position: 'fixed', left: sl, top: st, width: sw, height: sh,
              borderRadius: 8, zIndex: 201, pointerEvents: 'none',
            }}
          />

          {/* Click interceptor — clicking the spotlighted element advances tour */}
          <div
            style={{
              position: 'fixed', left: sl, top: st, width: sw, height: sh,
              borderRadius: 8, zIndex: 202, cursor: 'pointer',
            }}
            onClick={handleNext}
          />
        </>
      )}

      {/* ── TOOLTIP: centered (side = 'center') ── */}
      {current.side === 'center' && (
        <div style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '100%', maxWidth: 480, padding: '0 20px', boxSizing: 'border-box',
          zIndex: 300,
        }}>
          <div key={step} className="ft-tooltip">
            <TooltipCard
              step={step} total={STEPS.length}
              title={current.title}
              body={current.body} cta={current.cta}
              isLast={step === STEPS.length - 1}
              onNext={handleNext}
              onSkip={step > 0 && step < STEPS.length - 1 ? onTourDone : undefined}
              arrow={null}
            />
          </div>
        </div>
      )}

      {/* ── TOOLTIP: positioned (directional sides) ── */}
      {hasSpotlight && (
        <div
          key={step}
          className="ft-tooltip"
          style={{ position: 'fixed', width: TW, zIndex: 300, ...tooltipPos }}
        >
          <TooltipCard
            step={step} total={STEPS.length}
            title={current.title}
            body={current.body} cta={current.cta}
            isLast={step === STEPS.length - 1}
            onNext={handleNext}
            onSkip={step > 0 && step < STEPS.length - 1 ? onTourDone : undefined}
            arrow={arrow}
          />
        </div>
      )}
    </div>
  );
}

function TooltipCard({
  step, total, title, body, cta, isLast, onNext, onSkip, arrow,
}: {
  step: number; total: number; title: string; body: string; cta: string;
  isLast: boolean; onNext: () => void; onSkip?: () => void;
  arrow: React.CSSProperties | null;
}) {
  return (
    <div style={{ position: 'relative' }}>
      {arrow && <div style={arrow}/>}
      <div style={{
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.20), 0 4px 16px rgba(0,0,0,0.08)',
        padding: '16px 18px',
        display: 'flex', alignItems: 'center', gap: 14,
        position: 'relative', zIndex: 1,
      }}>
        {/* Step badge */}
        <div style={{
          width: 38, height: 38, flexShrink: 0,
          borderRadius: 'var(--radius-md)',
          background: 'var(--blue-700)',
          display: 'grid', placeItems: 'center',
        }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)' }}>
            {step + 1}
          </span>
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 4, marginBottom: 5, alignItems: 'center' }}>
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} style={{
                height: 3, width: i === step ? 16 : 6, borderRadius: 100,
                background: i === step ? 'var(--blue-700)' : i < step ? 'rgba(7,47,181,0.28)' : '#E0E0E0',
                transition: 'all 0.3s ease',
              }}/>
            ))}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-headings)', letterSpacing: '-0.01em', lineHeight: 1.3, marginBottom: 3 }}>
            {title}
          </div>
          {body.startsWith('__RICH__') ? (
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: body.replace('__RICH__', '') }} />
          ) : (
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
              {body}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0 }}>
          <button
            onClick={onNext}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '9px 15px',
              fontSize: 12.5, fontWeight: 700, fontFamily: 'var(--font-sans)',
              color: '#fff', background: 'var(--blue-700)',
              border: 'none', borderRadius: 'var(--radius-md)',
              cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'opacity 0.12s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            {cta} {!isLast && <ArrowRight size={11}/>}
          </button>
          {onSkip && (
            <button
              onClick={onSkip}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 10.5, color: 'var(--text-tertiary)',
                fontFamily: 'var(--font-sans)', padding: '2px 0',
                transition: 'color 0.12s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)'; }}
            >
              Skip tour
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
