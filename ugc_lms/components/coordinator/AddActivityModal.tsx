'use client';
import { useState } from 'react';
import { X, Video, FileText, FileDown, HelpCircle, ClipboardList, MessageSquare, MonitorPlay, Upload, ChevronRight, ArrowLeft, Package } from 'lucide-react';
import { ACTIVITY_TYPE_OPTIONS, EditorActivityType } from '@/lib/coordinatorData';

type QuadrantType = 'live_session' | 'e_tutorial' | 'e_content' | 'discussion' | 'assessment';

const TYPE_ICONS: Record<EditorActivityType, React.ElementType> = {
  video: MonitorPlay,
  page: FileText,
  pdf: FileDown,
  quiz: HelpCircle,
  assignment: ClipboardList,
  forum_topic: MessageSquare,
  live_session: Video,
  scorm: Package,
};

// Which activity types belong to which quadrant
const QUADRANT_TYPES: Record<QuadrantType, EditorActivityType[]> = {
  live_session: ['live_session'],
  e_tutorial: ['video'],
  e_content: ['page', 'pdf', 'scorm'],
  discussion: ['forum_topic'],
  assessment: ['quiz', 'assignment'],
};

interface Props {
  quadrantType: QuadrantType;
  onClose: () => void;
  onSubmit: (activity: { title: string; type: string; duration: string }) => void;
  onTypeSelected?: (type: EditorActivityType) => void;
}

interface FieldDef {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'date' | 'file';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  defaultValue?: string;
  helpText?: string;
}

function getFieldsForType(type: EditorActivityType): FieldDef[] {
  switch (type) {
    case 'video':
      return [
        { key: 'title', label: 'Title', type: 'text', placeholder: 'e.g. Introduction to Supply Chain', required: true },
        { key: 'url', label: 'Video URL', type: 'text', placeholder: 'YouTube, Vimeo, or direct URL', helpText: 'Or upload via the file manager after creation' },
        { key: 'duration', label: 'Duration', type: 'text', placeholder: 'e.g. 22:15' },
      ];
    case 'page':
      return [
        { key: 'title', label: 'Title', type: 'text', placeholder: 'e.g. Seven Principles of Communication', required: true },
        { key: 'content', label: 'Content', type: 'textarea', placeholder: 'Write or paste learning material here...' },
      ];
    case 'pdf':
      return [
        { key: 'title', label: 'Title', type: 'text', placeholder: 'e.g. SLM Unit 1 - MBA Sem 1', required: true },
        { key: 'file', label: 'Upload Document', type: 'file', helpText: 'PDF, DOCX, or PPTX (max 50MB)' },
        { key: 'pages', label: 'Page Count', type: 'number', placeholder: 'e.g. 24' },
      ];
    case 'quiz':
      return [
        { key: 'title', label: 'Title', type: 'text', placeholder: 'e.g. Module 2 Assessment', required: true },
        { key: 'timeLimit', label: 'Time Limit (minutes)', type: 'number', placeholder: '30', helpText: 'Leave empty for untimed' },
        { key: 'attempts', label: 'Attempts Allowed', type: 'select', options: [{ value: '1', label: '1 attempt' }, { value: '2', label: '2 attempts' }, { value: '3', label: '3 attempts' }, { value: '0', label: 'Unlimited' }], defaultValue: '1' },
        { key: 'openDate', label: 'Open Date', type: 'date', helpText: 'When students can start taking the quiz' },
      ];
    case 'assignment':
      return [
        { key: 'title', label: 'Title', type: 'text', placeholder: 'e.g. Case Study Analysis Report', required: true },
        { key: 'description', label: 'Instructions', type: 'textarea', placeholder: 'Describe what students should submit...' },
        { key: 'dueDate', label: 'Due Date', type: 'date', required: true },
        { key: 'maxGrade', label: 'Max Grade', type: 'number', placeholder: '100', defaultValue: '100' },
        { key: 'submissionType', label: 'Submission Type', type: 'select', options: [{ value: 'file', label: 'File upload' }, { value: 'text', label: 'Online text' }, { value: 'both', label: 'File + Online text' }], defaultValue: 'file' },
      ];
    case 'forum_topic':
      return [
        { key: 'title', label: 'Topic Title', type: 'text', placeholder: 'e.g. Discuss: Ethics in Business', required: true },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Set the context for the discussion...' },
      ];
    case 'live_session':
      return [
        { key: 'title', label: 'Session Title', type: 'text', placeholder: 'e.g. Orientation Session', required: true },
        { key: 'date', label: 'Date & Time', type: 'date', required: true },
        { key: 'duration', label: 'Duration', type: 'select', options: [{ value: '30', label: '30 minutes' }, { value: '60', label: '1 hour' }, { value: '90', label: '1.5 hours' }, { value: '120', label: '2 hours' }], defaultValue: '60' },
      ];
    case 'scorm':
      return [
        { key: 'title', label: 'Title', type: 'text', placeholder: 'e.g. Interactive Module 1', required: true },
        { key: 'file', label: 'Upload SCORM Package', type: 'file', helpText: '.zip file containing SCORM 1.2 or 2004 package' },
      ];
    default:
      return [{ key: 'title', label: 'Title', type: 'text', required: true }];
  }
}

// Types that have full settings defined in ActivitySettingsModal
const FULL_SETTINGS_TYPES: EditorActivityType[] = ['live_session', 'video', 'assignment', 'page', 'pdf', 'scorm', 'quiz', 'forum_topic'];

export default function AddActivityModal({ quadrantType, onClose, onSubmit, onTypeSelected }: Props) {
  const availableTypes = QUADRANT_TYPES[quadrantType] || [];

  // If only one type and it has full settings, go straight to settings modal
  const singleType = availableTypes.length === 1 ? availableTypes[0] : null;
  if (singleType && FULL_SETTINGS_TYPES.includes(singleType) && onTypeSelected) {
    onTypeSelected(singleType);
    return null;
  }

  const [selectedType, setSelectedType] = useState<EditorActivityType | null>(singleType && !FULL_SETTINGS_TYPES.includes(singleType) ? singleType : null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    if (!selectedType) return;
    const title = formData.title || 'Untitled Activity';
    let duration = formData.duration || '';
    if (!duration) {
      if (selectedType === 'quiz') duration = (formData.timeLimit ? formData.timeLimit + ' min' : 'Untimed');
      else if (selectedType === 'assignment') duration = formData.dueDate ? 'Due ' + formData.dueDate : 'No deadline';
      else if (selectedType === 'page') duration = '~5 min read';
      else if (selectedType === 'pdf') duration = (formData.pages || '?') + ' pages';
      else if (selectedType === 'forum_topic') duration = 'Forum';
      else if (selectedType === 'live_session') {
        const mins = parseInt(formData.duration || '60');
        duration = mins >= 60 ? (mins / 60) + ' hrs' : mins + ' min';
      }
    }
    // Map editor types back to learner activity types
    const activityType = selectedType === 'assignment' ? 'page' : selectedType === 'forum_topic' ? 'page' : selectedType === 'live_session' ? 'video' : selectedType;
    onSubmit({ title, type: activityType, duration });
  };

  const fields = selectedType ? getFieldsForType(selectedType) : [];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'grid', placeItems: 'center',
      background: 'rgba(0,0,0,0.4)',
      backdropFilter: 'blur(4px)',
    }} onClick={onClose}>
      <div
        style={{
          width: 520, maxHeight: '85vh',
          background: '#fff',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '18px 24px 16px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {selectedType && availableTypes.length > 1 && (
              <button
                onClick={() => { setSelectedType(null); setFormData({}); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: 'var(--text-tertiary)' }}
              >
                <ArrowLeft size={16} />
              </button>
            )}
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
              {selectedType ? `Add ${ACTIVITY_TYPE_OPTIONS.find(o => o.type === selectedType)?.label || 'Activity'}` : 'Choose Activity Type'}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 4, display: 'flex' }}>
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px' }}>
          {!selectedType ? (
            /* Step 1: Choose type */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {availableTypes.map(type => {
                const option = ACTIVITY_TYPE_OPTIONS.find(o => o.type === type);
                if (!option) return null;
                const Icon = TYPE_ICONS[type];
                return (
                  <button
                    key={type}
                    onClick={() => {
                      if (FULL_SETTINGS_TYPES.includes(type) && onTypeSelected) {
                        onTypeSelected(type);
                      } else {
                        setSelectedType(type);
                      }
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '14px 16px',
                      background: '#fff',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'border-color 0.12s, background 0.12s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = option.color; e.currentTarget.style.background = option.color + '08'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.background = '#fff'; }}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                      background: option.color + '12',
                      display: 'grid', placeItems: 'center', flexShrink: 0,
                    }}>
                      <Icon size={18} strokeWidth={1.8} style={{ color: option.color }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>{option.label}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 2 }}>{option.description}</div>
                    </div>
                    <ChevronRight size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                  </button>
                );
              })}
            </div>
          ) : (
            /* Step 2: Settings form */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Smart defaults info */}
              <div style={{
                padding: '10px 14px',
                background: 'rgba(7,47,181,0.04)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(7,47,181,0.08)',
                fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5,
              }}>
                Only essential settings are shown. Everything else uses smart defaults that work for most courses.
              </div>

              {fields.map(field => (
                <div key={field.key}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 5 }}>
                    {field.label}
                    {field.required && <span style={{ color: '#DC2626', marginLeft: 2 }}>*</span>}
                  </label>
                  {field.type === 'text' && (
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      value={formData[field.key] || ''}
                      onChange={e => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                      style={{
                        width: '100%', padding: '9px 12px', fontSize: 13,
                        fontFamily: 'var(--font-sans)', color: 'var(--text-primary)',
                        background: '#fff', border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)', outline: 'none', boxSizing: 'border-box',
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = 'var(--blue-700)'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
                    />
                  )}
                  {field.type === 'textarea' && (
                    <textarea
                      placeholder={field.placeholder}
                      value={formData[field.key] || ''}
                      onChange={e => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                      rows={4}
                      style={{
                        width: '100%', padding: '9px 12px', fontSize: 13,
                        fontFamily: 'var(--font-sans)', color: 'var(--text-primary)',
                        background: '#fff', border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)', outline: 'none', boxSizing: 'border-box',
                        resize: 'vertical',
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = 'var(--blue-700)'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
                    />
                  )}
                  {field.type === 'number' && (
                    <input
                      type="number"
                      placeholder={field.placeholder}
                      value={formData[field.key] || field.defaultValue || ''}
                      onChange={e => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                      style={{
                        width: 140, padding: '9px 12px', fontSize: 13,
                        fontFamily: 'var(--font-mono)', color: 'var(--text-primary)',
                        background: '#fff', border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)', outline: 'none', boxSizing: 'border-box',
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = 'var(--blue-700)'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
                    />
                  )}
                  {field.type === 'select' && (
                    <select
                      value={formData[field.key] || field.defaultValue || ''}
                      onChange={e => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                      style={{
                        width: '100%', padding: '9px 28px 9px 12px', fontSize: 13,
                        fontFamily: 'var(--font-sans)', color: 'var(--text-primary)',
                        background: '#fff', border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)', outline: 'none', boxSizing: 'border-box',
                        cursor: 'pointer',
                        appearance: 'none', WebkitAppearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
                      }}
                    >
                      {field.options?.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  )}
                  {field.type === 'date' && (
                    <input
                      type="datetime-local"
                      value={formData[field.key] || ''}
                      onChange={e => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                      style={{
                        width: 260, padding: '9px 12px', fontSize: 13,
                        fontFamily: 'var(--font-sans)', color: 'var(--text-primary)',
                        background: '#fff', border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)', outline: 'none', boxSizing: 'border-box',
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = 'var(--blue-700)'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
                    />
                  )}
                  {field.type === 'file' && (
                    <div style={{
                      padding: '20px',
                      border: '2px dashed var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-section)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                      cursor: 'pointer',
                    }}>
                      <Upload size={20} strokeWidth={1.5} style={{ color: 'var(--text-tertiary)' }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Click to upload or drag and drop</span>
                      {field.helpText && <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{field.helpText}</span>}
                    </div>
                  )}
                  {field.helpText && field.type !== 'file' && (
                    <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)', marginTop: 4 }}>{field.helpText}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {selectedType && (
          <div style={{
            padding: '14px 24px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex', justifyContent: 'flex-end', gap: 8,
            flexShrink: 0,
          }}>
            <button
              onClick={onClose}
              style={{
                padding: '8px 18px', fontSize: 13, fontWeight: 600,
                color: 'var(--text-secondary)', background: '#fff',
                border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)',
                cursor: 'pointer', fontFamily: 'var(--font-sans)',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!formData.title}
              style={{
                padding: '8px 20px', fontSize: 13, fontWeight: 700,
                color: '#fff', background: formData.title ? 'var(--blue-700)' : 'var(--border-subtle)',
                border: 'none', borderRadius: 'var(--radius-sm)',
                cursor: formData.title ? 'pointer' : 'not-allowed',
                fontFamily: 'var(--font-sans)',
                transition: 'background 0.12s',
              }}
            >
              Add Activity
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
