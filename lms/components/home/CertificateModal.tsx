'use client';
import { X, Download, Share2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  learnerName: string;
  programName: string;
  institution: string;
  completionDate?: string;
}

const CERT_W = 780;
const CERT_H = 550;

export default function CertificateModal({ isOpen, onClose, learnerName, programName, institution, completionDate = '7 June 2026' }: CertificateModalProps) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!isOpen) return;
    const update = () => {
      const maxW = window.innerWidth * 0.88;
      const maxH = window.innerHeight * 0.72;
      setScale(Math.min(1, maxW / CERT_W, maxH / CERT_H));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={onClose}>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }} onClick={e => e.stopPropagation()}>
        <button onClick={() => { const url = encodeURIComponent(window.location.href); const text = encodeURIComponent(`I just earned my ${programName} certificate from ${institution}!`); window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`, '_blank', 'width=600,height=500'); }} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 16px', fontSize: 12.5, fontWeight: 600, color: '#fff', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
          <Share2 size={13} /> Share on LinkedIn
        </button>
        <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 16px', fontSize: 12.5, fontWeight: 600, color: '#030B22', background: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
          <Download size={13} /> Download
        </button>
        <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }}>
          <X size={18} />
        </button>
      </div>

      {/* Certificate — fixed size, scaled to fit */}
      <div onClick={e => e.stopPropagation()} style={{
        width: CERT_W, height: CERT_H,
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        background: '#fff',
        borderRadius: 4,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
        flexShrink: 0,
      }}>
        {/* Outer border */}
        <div style={{ position: 'absolute', inset: 12, border: '2px solid #D4AF37', borderRadius: 2, pointerEvents: 'none' }} />

        {/* Inner border */}
        <div style={{ position: 'absolute', inset: 18, border: '1px solid rgba(212,175,55,0.3)', borderRadius: 2, pointerEvents: 'none' }} />

        {/* Corner ornaments */}
        {[
          { top: 12, left: 12 },
          { top: 12, right: 12 },
          { bottom: 12, left: 12 },
          { bottom: 12, right: 12 },
        ].map((pos, i) => (
          <svg key={i} width="32" height="32" viewBox="0 0 32 32" style={{ position: 'absolute', ...pos, pointerEvents: 'none' }}>
            <path d={
              i === 0 ? 'M2 16 L2 2 L16 2' :
              i === 1 ? 'M16 2 L30 2 L30 16' :
              i === 2 ? 'M2 16 L2 30 L16 30' :
              'M16 30 L30 30 L30 16'
            } stroke="#D4AF37" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </svg>
        ))}

        {/* Top decorative line */}
        <div style={{ position: 'absolute', top: 40, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, #D4AF37)' }} />
          <svg width="16" height="16" viewBox="0 0 16 16">
            <polygon points="8,1 10,6 16,6 11,9.5 13,15 8,11.5 3,15 5,9.5 0,6 6,6" fill="#D4AF37" opacity="0.6" />
          </svg>
          <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, #D4AF37, transparent)' }} />
        </div>

        {/* Content */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '50px 60px', textAlign: 'center' }}>

          {/* Institution */}
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D4AF37', marginBottom: 6 }}>
            {institution}
          </div>

          {/* Title */}
          <div style={{ fontSize: 32, fontWeight: 300, color: '#1a1a1a', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'Georgia, serif', marginBottom: 4 }}>
            Certificate
          </div>
          <div style={{ fontSize: 13, fontWeight: 400, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', marginBottom: 28 }}>
            of Completion
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, width: '70%' }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #D4AF37)' }} />
            <div style={{ fontSize: 12, color: '#D4AF37', fontWeight: 600, whiteSpace: 'nowrap' }}>This is to certify that</div>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, #D4AF37, transparent)' }} />
          </div>

          {/* Learner name */}
          <div style={{
            fontSize: 38, fontWeight: 400, color: '#1a1a1a',
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontStyle: 'italic', letterSpacing: '0.02em', lineHeight: 1.2,
            marginBottom: 18, borderBottom: '2px solid #D4AF37',
            paddingBottom: 8, paddingLeft: 20, paddingRight: 20,
          }}>
            {learnerName}
          </div>

          {/* Description */}
          <div style={{ fontSize: 13, color: '#555', lineHeight: 1.7, maxWidth: 480, marginBottom: 24 }}>
            has successfully completed all courses and requirements of the
          </div>

          {/* Program name */}
          <div style={{
            fontSize: 18, fontWeight: 700, color: '#1a1a1a',
            letterSpacing: '0.02em', lineHeight: 1.3,
            fontFamily: 'Georgia, "Times New Roman", serif',
            marginBottom: 32,
          }}>
            {programName}
          </div>

          {/* Bottom: date + seal + signature */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', width: '80%' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#333', fontFamily: 'Georgia, serif', marginBottom: 6 }}>{completionDate}</div>
              <div style={{ width: 120, height: 1, background: '#ccc', marginBottom: 4 }} />
              <div style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#999', fontWeight: 600 }}>Date</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <svg width="52" height="52" viewBox="0 0 52 52">
                <circle cx="26" cy="26" r="24" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
                <circle cx="26" cy="26" r="20" fill="none" stroke="#D4AF37" strokeWidth="0.8" strokeDasharray="3 2" />
                <polygon points="26,10 28.5,18 37,18 30.5,23 33,31 26,26.5 19,31 21.5,23 15,18 23.5,18" fill="#D4AF37" opacity="0.3" />
                <text x="26" y="29" textAnchor="middle" fontSize="6" fontWeight="700" fill="#D4AF37" letterSpacing="0.08em">VERIFIED</text>
              </svg>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontStyle: 'italic', color: '#555', fontFamily: 'Georgia, serif', marginBottom: 6 }}>Programme Director</div>
              <div style={{ width: 120, height: 1, background: '#ccc', marginBottom: 4 }} />
              <div style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#999', fontWeight: 600 }}>Authorized Signatory</div>
            </div>
          </div>
        </div>

        {/* Certificate ID */}
        <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', fontSize: 8, color: '#ccc', letterSpacing: '0.1em', fontFamily: 'var(--font-mono)' }}>
          CERT-FMC-2026-00142
        </div>
      </div>
    </div>,
    document.body
  );
}
