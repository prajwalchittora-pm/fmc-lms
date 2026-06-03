'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, ArrowRight, FileDown, Download, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

type ActivityItem = { id: string; type: string; title: string; duration: string; done: boolean; current?: boolean; };
interface PdfActivityProps { activity: ActivityItem; onBack: () => void; onPrev?: () => void; onNext?: () => void; hasPrev: boolean; hasNext: boolean; }

const PDF_META: Record<string, { pages: number; size: string; description: string; sections: string[] }> = {
  'lp-8b': {
    pages: 4,
    size: '1.2 MB',
    description: 'A quick-reference guide covering the essential body language signals in professional settings — posture, gestures, eye contact, and spatial awareness.',
    sections: ['Open vs Closed Postures', 'Hand Gestures That Build Trust', 'Eye Contact Rules by Culture', 'Spatial Zones in Business Settings'],
  },
  'lp-12b': {
    pages: 6,
    size: '2.4 MB',
    description: 'Three real-world case studies examining how narrative structure was used to drive business outcomes — from pitch decks to internal change communications.',
    sections: ['Case 1: The $50M Pitch That Started with a Story', 'Case 2: Reframing a Layoff as a Pivot', 'Case 3: Turning Metrics into Meaning', 'Framework: The Narrative Arc for Business', 'Exercises & Reflection Prompts', 'Further Reading'],
  },
};

const DEFAULT_META = {
  pages: 3,
  size: '800 KB',
  description: 'A downloadable PDF resource to supplement your learning.',
  sections: ['Overview', 'Key Concepts', 'Summary'],
};

export default function PdfActivity({ activity, onBack, onPrev, onNext, hasPrev, hasNext }: PdfActivityProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const meta = PDF_META[activity.id] ?? DEFAULT_META;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'var(--font-sans)', overflow: 'hidden' }}>

      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '8px 20px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-white)',
        flexShrink: 0,
      }}>
        <FileDown size={14} strokeWidth={2} style={{ color: 'var(--blue-700)' }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', flex: 1 }}>PDF Document</span>

        {/* Page nav */}
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage <= 1}
          style={{ background: 'none', border: 'none', cursor: currentPage <= 1 ? 'default' : 'pointer', opacity: currentPage <= 1 ? 0.3 : 1, padding: 2 }}
        >
          <ChevronLeft size={14} color="var(--text-secondary)" />
        </button>
        <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', minWidth: 60, textAlign: 'center' }}>
          {currentPage} / {meta.pages}
        </span>
        <button
          onClick={() => setCurrentPage(p => Math.min(meta.pages, p + 1))}
          disabled={currentPage >= meta.pages}
          style={{ background: 'none', border: 'none', cursor: currentPage >= meta.pages ? 'default' : 'pointer', opacity: currentPage >= meta.pages ? 0.3 : 1, padding: 2 }}
        >
          <ChevronRight size={14} color="var(--text-secondary)" />
        </button>

        <div style={{ width: 1, height: 16, background: 'var(--border-subtle)', margin: '0 4px' }} />

        {/* Zoom */}
        <button onClick={() => setZoom(z => Math.max(50, z - 25))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
          <ZoomOut size={13} color="var(--text-tertiary)" />
        </button>
        <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', minWidth: 36, textAlign: 'center' }}>{zoom}%</span>
        <button onClick={() => setZoom(z => Math.min(200, z + 25))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
          <ZoomIn size={13} color="var(--text-tertiary)" />
        </button>

        <div style={{ width: 1, height: 16, background: 'var(--border-subtle)', margin: '0 4px' }} />

        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }} title="Fullscreen">
          <Maximize2 size={13} color="var(--text-tertiary)" />
        </button>
        <button style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '4px 10px',
          background: 'var(--bg-section)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)',
          cursor: 'pointer', fontFamily: 'var(--font-sans)',
        }}>
          <Download size={11} strokeWidth={2.2} /> Download
        </button>
      </div>

      {/* Main content area */}
      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-section)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 24px 56px' }}>

        {/* PDF viewer placeholder — simulated page */}
        <div style={{
          width: '100%', maxWidth: Math.round(612 * (zoom / 100)),
          minHeight: Math.round(792 * (zoom / 100)),
          background: '#fff',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)',
          padding: Math.round(48 * (zoom / 100)),
          transition: 'all 0.2s ease',
          marginBottom: 32,
        }}>
          {/* Page header */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <FileDown size={18} style={{ color: 'var(--blue-700)' }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--blue-700)' }}>PDF Resource</span>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1.2, margin: '0 0 12px', fontFamily: 'var(--font-display)' }}>
              {activity.title}
            </h1>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              {meta.description}
            </p>
          </div>

          {/* File info */}
          <div style={{
            display: 'flex', gap: 16, padding: '12px 16px', marginBottom: 24,
            background: 'var(--bg-section)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
          }}>
            {[
              { label: 'Pages', value: String(meta.pages) },
              { label: 'Size', value: meta.size },
              { label: 'Format', value: 'PDF' },
            ].map(({ label, value }) => (
              <div key={label} style={{ flex: 1 }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-tertiary)', marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Table of contents */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', marginBottom: 10 }}>Contents</div>
            {meta.sections.map((section, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 0',
                  borderBottom: i < meta.sections.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4,
                }}
              >
                <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', minWidth: 18 }}>{i + 1}.</span>
                {section}
              </div>
            ))}
          </div>

          {/* Simulated page content lines */}
          <div style={{ marginTop: 24 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{
                height: 8,
                background: 'var(--border-subtle)',
                opacity: 0.5 + Math.random() * 0.3,
                marginBottom: 10,
                width: `${65 + Math.random() * 35}%`,
                borderRadius: 2,
              }} />
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ maxWidth: 612, width: '100%' }}>
          <div style={{ height: 1, background: 'var(--border-subtle)', marginBottom: 20 }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {activity.done ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: 'var(--green-600)', fontSize: 13, fontWeight: 700 }}>
                  <CheckCircle2 size={16} strokeWidth={2.5} /> Completed
                </div>
              ) : (
                <button className="btn-primary" style={{ padding: '9px 20px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 7 }}>
                  <CheckCircle2 size={14} /> Mark as complete
                </button>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {hasPrev && (
                <button onClick={onPrev} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-sans)', padding: 0 }}>
                  <ChevronLeft size={13} /> Previous activity
                </button>
              )}
              {hasNext && (
                <button onClick={onNext} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', fontSize: 12.5, fontWeight: 600, color: 'var(--blue-700)', cursor: 'pointer', fontFamily: 'var(--font-sans)', padding: 0 }}>
                  Next activity <ArrowRight size={13} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
