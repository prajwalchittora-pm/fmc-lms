'use client';
import { useState } from 'react';
import { X, ChevronDown, ChevronRight, Video, FileText, FileDown, HelpCircle, ClipboardList, MessageSquare, MonitorPlay, Package, Calendar, Clock, Users, CheckCircle2 } from 'lucide-react';
import { EditorActivityType, FACULTY } from '@/lib/coordinatorData';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface FieldDef {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'date' | 'time' | 'file' | 'toggle' | 'multiselect' | 'radio' | 'dateonly' | 'timeonly';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  defaultValue?: string;
  helpText?: string;
  width?: 'full' | 'half';  // layout hint: full-width or half-width field
  showWhen?: { field: string; value: string | string[] };  // conditional: only show this field when another field has a specific value
}

export interface SettingsSection {
  key: string;
  label: string;
  fields: FieldDef[];
  defaultOpen?: boolean;
}

// ─── Activity settings registry ────────────────────────────────────────────
// Each activity type defines its settings sections.
// This is the central place to add/edit fields per type.
// The user will populate these after the framework is built.

// Default common sections — used by types that haven't been fully defined yet
function defaultSections(): { general: SettingsSection; availability: SettingsSection; completion: SettingsSection } {
  return {
    general: {
      key: 'general', label: 'General', defaultOpen: true,
      fields: [
        { key: 'title', label: 'Name', type: 'text', placeholder: 'Activity name', required: true, width: 'full' },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Optional description shown to students...', width: 'full' },
        { key: 'visible', label: 'Visible to students', type: 'toggle', defaultValue: 'true' },
      ],
    },
    availability: {
      key: 'availability', label: 'Availability',
      fields: [
        { key: 'openDate', label: 'Available from', type: 'date', helpText: 'Students can access after this date', width: 'half' },
        { key: 'closeDate', label: 'Available until', type: 'date', helpText: 'Access closes after this date', width: 'half' },
      ],
    },
    completion: {
      key: 'completion', label: 'Completion Tracking',
      fields: [
        { key: 'completionType', label: 'Students complete this activity when they', type: 'select', options: [
          { value: 'view', label: 'View it' }, { value: 'submit', label: 'Submit / attempt it' },
          { value: 'grade', label: 'Receive a grade' }, { value: 'passinggrade', label: 'Receive a passing grade' },
          { value: 'manual', label: 'Manually mark as complete' },
        ], defaultValue: 'view', width: 'full' },
      ],
    },
  };
}

function getSettingsSections(type: EditorActivityType): SettingsSection[] {
  // ─── LIVE SESSION ─────────────────────────────────────────────────────
  if (type === 'live_session') {
    const facultyOptions = FACULTY.map(f => ({ value: f.id, label: `${f.name} — ${f.specialization}` }));
    return [
      {
        key: 'general', label: 'General', defaultOpen: true,
        fields: [
          { key: 'title', label: 'Name', type: 'text', placeholder: 'e.g. Counselling Session — Managerial Economics', required: true, width: 'full' },
          { key: 'visible', label: 'Show to students', type: 'toggle', defaultValue: 'true' },
        ],
      },
      {
        key: 'schedule', label: 'Schedule', defaultOpen: true,
        fields: [
          { key: 'sessionDate', label: 'Date', type: 'dateonly', required: true, width: 'half' },
          { key: 'sessionTime', label: 'Time', type: 'timeonly', required: true, width: 'half' },
          { key: 'durationHours', label: 'Duration (hours)', type: 'select', options: [
            { value: '0', label: '0 hrs' }, { value: '1', label: '1 hr' },
            { value: '2', label: '2 hrs' }, { value: '3', label: '3 hrs' },
          ], defaultValue: '1', width: 'half' },
          { key: 'durationMinutes', label: 'Duration (minutes)', type: 'select', options: [
            { value: '0', label: '0 min' }, { value: '15', label: '15 min' },
            { value: '30', label: '30 min' }, { value: '45', label: '45 min' },
          ], defaultValue: '0', width: 'half' },
        ],
      },
      {
        key: 'people', label: 'Faculty & Invites',
        fields: [
          { key: 'facultyId', label: 'Assign Faculty', type: 'select', required: true, options: [
            { value: '', label: 'Select a faculty member...' },
            ...facultyOptions,
          ], width: 'full', helpText: 'Faculty member who will conduct this session' },
          { key: 'inviteEmails', label: 'Invite Emails', type: 'textarea', placeholder: 'Enter email addresses separated by commas\ne.g. guest@university.edu, speaker@org.com', width: 'full', helpText: 'Optional — invite external guests or co-hosts' },
        ],
      },
      {
        key: 'completion', label: 'Completion',
        fields: [
          { key: 'completionCriteria', label: 'How is this activity marked complete?', type: 'radio', options: [
            { value: 'attendance', label: 'Learner must be present — attendance is auto-tracked when they join the session' },
            { value: 'manual', label: 'Manual — learner marks the completion themselves' },
          ], defaultValue: 'attendance', width: 'full' },
        ],
      },
    ];
  }

  // ─── VIDEO ─────────────────────────────────────────────────────────────
  if (type === 'video') {
    return [
      {
        key: 'general', label: 'General', defaultOpen: true,
        fields: [
          { key: 'title', label: 'Name', type: 'text', placeholder: 'e.g. Introduction to Supply Chain Management', required: true, width: 'full' },
          { key: 'visible', label: 'Show to students', type: 'toggle', defaultValue: 'true' },
        ],
      },
      {
        key: 'source', label: 'Video Source', defaultOpen: true,
        fields: [
          { key: 'videoSource', label: 'Source', type: 'radio', required: true, options: [
            { value: 'upload', label: 'Upload — upload an MP4 or WebM file directly' },
            { value: 'vimeo', label: 'Vimeo — paste a Vimeo video URL' },
            { value: 'youtube', label: 'YouTube — paste a YouTube video URL' },
          ], defaultValue: 'upload', width: 'full' },
          { key: 'videoFile', label: 'Upload Video', type: 'file', helpText: 'MP4 or WebM (max 500MB)', width: 'full', showWhen: { field: 'videoSource', value: 'upload' } },
          { key: 'videoUrl', label: 'Video URL', type: 'text', placeholder: 'e.g. https://vimeo.com/123456789', required: true, width: 'full', helpText: 'Paste the full video URL', showWhen: { field: 'videoSource', value: ['vimeo', 'youtube'] } },
        ],
      },
      {
        key: 'details', label: 'Details',
        fields: [
          { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Optional description shown to students...', width: 'full' },
        ],
      },
      {
        key: 'completion', label: 'Completion',
        fields: [
          { key: 'completionPercent', label: 'Minimum watch percentage to mark complete (%)', type: 'number', required: true, placeholder: 'e.g. 60', defaultValue: '60', width: 'half', helpText: 'Learner must watch this % of the video for auto-completion (1–100)' },
        ],
      },
    ];
  }

  // ─── ASSIGNMENT ────────────────────────────────────────────────────────
  if (type === 'assignment') {
    return [
      {
        key: 'general', label: 'General', defaultOpen: true,
        fields: [
          { key: 'title', label: 'Name', type: 'text', placeholder: 'e.g. Case Study: Market Entry Strategy', required: true, width: 'full' },
          { key: 'assignmentType', label: 'Type', type: 'radio', required: true, options: [
            { value: 'graded', label: 'Graded — counts towards the final grade' },
            { value: 'practice', label: 'Practice — for learning only, not graded' },
          ], defaultValue: 'graded', width: 'full' },
          { key: 'visible', label: 'Show to students', type: 'toggle', defaultValue: 'true' },
        ],
      },
      {
        key: 'content', label: 'Content', defaultOpen: true,
        fields: [
          { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Brief overview of the assignment...', width: 'full' },
          { key: 'instructions', label: 'Instructions', type: 'textarea', placeholder: 'Detailed instructions for students on what to submit and how...', width: 'full' },
          { key: 'attachments', label: 'Attached Files', type: 'file', helpText: 'Upload reference documents, rubrics, or templates (PDF, DOCX, PPTX)', width: 'full' },
        ],
      },
      {
        key: 'availability', label: 'Availability',
        fields: [
          { key: 'allowFrom', label: 'Allow submissions from', type: 'dateonly', width: 'half', helpText: 'Students can submit after this date' },
          { key: 'dueDate', label: 'Due date', type: 'dateonly', required: true, width: 'half', helpText: 'Submissions after this date are marked late' },
          { key: 'cutoffDate', label: 'Cut-off date', type: 'dateonly', width: 'half', helpText: 'No submissions accepted after this date' },
          { key: 'gradeByDate', label: 'Remind to grade by', type: 'dateonly', width: 'half', helpText: 'Coordinator gets a reminder if ungraded by this date' },
          { key: 'submissionType', label: 'Submission types', type: 'radio', required: true, options: [
            { value: 'file', label: 'File submissions — students upload files' },
            { value: 'onlinetext', label: 'Online text — students type their submission' },
            { value: 'both', label: 'Both — file upload and online text' },
          ], defaultValue: 'file', width: 'full' },
        ],
      },
      {
        key: 'grade', label: 'Grade',
        fields: [
          { key: 'maxGrade', label: 'Maximum grade', type: 'number', required: true, placeholder: '100', defaultValue: '100', width: 'half', showWhen: { field: 'assignmentType', value: 'graded' } },
          { key: 'gradeToPass', label: 'Grade to pass', type: 'number', placeholder: 'e.g. 40', width: 'half', helpText: 'Minimum grade for a passing mark', showWhen: { field: 'assignmentType', value: 'graded' } },
        ],
      },
      {
        key: 'completion', label: 'Completion',
        fields: [
          { key: 'completionCriteria', label: 'How is this activity marked complete?', type: 'radio', required: true, options: [
            { value: 'submit', label: 'Make a submission — marked complete when the learner submits' },
            { value: 'grade', label: 'Receive a grade — marked complete when the submission is graded' },
          ], defaultValue: 'submit', width: 'full' },
        ],
      },
    ];
  }

  // ─── PAGE (E-Content: text material) ───────────────────────────────────
  if (type === 'page') {
    return [
      {
        key: 'general', label: 'General', defaultOpen: true,
        fields: [
          { key: 'title', label: 'Name', type: 'text', placeholder: 'e.g. The Seven Principles of Effective Communication', required: true, width: 'full' },
          { key: 'visible', label: 'Show to students', type: 'toggle', defaultValue: 'true' },
        ],
      },
      {
        key: 'content', label: 'Content', defaultOpen: true,
        fields: [
          { key: 'content', label: 'Page content', type: 'textarea', placeholder: 'Write or paste the learning material here...', required: true, width: 'full' },
        ],
      },
      {
        key: 'completion', label: 'Completion',
        fields: [
          { key: 'completionCriteria', label: 'How is this activity marked complete?', type: 'radio', options: [
            { value: 'view', label: 'View the page — marked complete when the learner opens it' },
            { value: 'manual', label: 'Manual — learner marks the completion themselves' },
          ], defaultValue: 'view', width: 'full' },
        ],
      },
    ];
  }

  // ─── PDF (E-Content: document upload) ─────────────────────────────────
  if (type === 'pdf') {
    return [
      {
        key: 'general', label: 'General', defaultOpen: true,
        fields: [
          { key: 'title', label: 'Name', type: 'text', placeholder: 'e.g. SLM Unit 1 — MBA Semester 1', required: true, width: 'full' },
          { key: 'visible', label: 'Show to students', type: 'toggle', defaultValue: 'true' },
        ],
      },
      {
        key: 'document', label: 'Document', defaultOpen: true,
        fields: [
          { key: 'file', label: 'Upload document', type: 'file', required: true, helpText: 'PDF, DOCX, or PPTX (max 50MB)', width: 'full' },
          { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Optional context about this document...', width: 'full' },
        ],
      },
      {
        key: 'completion', label: 'Completion',
        fields: [
          { key: 'completionCriteria', label: 'How is this activity marked complete?', type: 'radio', options: [
            { value: 'view', label: 'View the document — marked complete when the learner opens it' },
            { value: 'manual', label: 'Manual — learner marks the completion themselves' },
          ], defaultValue: 'view', width: 'full' },
        ],
      },
    ];
  }

  // ─── SCORM (E-Content: interactive package) ───────────────────────────
  if (type === 'scorm') {
    return [
      {
        key: 'general', label: 'General', defaultOpen: true,
        fields: [
          { key: 'title', label: 'Name', type: 'text', placeholder: 'e.g. Interactive Module — Financial Accounting', required: true, width: 'full' },
          { key: 'visible', label: 'Show to students', type: 'toggle', defaultValue: 'true' },
        ],
      },
      {
        key: 'package', label: 'SCORM Package', defaultOpen: true,
        fields: [
          { key: 'file', label: 'Upload package', type: 'file', required: true, helpText: '.zip file containing SCORM 1.2 or SCORM 2004 package', width: 'full' },
          { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Optional description of the module...', width: 'full' },
        ],
      },
      {
        key: 'attempts', label: 'Attempts',
        fields: [
          { key: 'maxAttempts', label: 'Attempts allowed', type: 'select', options: [
            { value: '1', label: '1 attempt' }, { value: '2', label: '2 attempts' },
            { value: '3', label: '3 attempts' }, { value: '0', label: 'Unlimited' },
          ], defaultValue: '0', width: 'half' },
        ],
      },
      {
        key: 'grade', label: 'Grade',
        fields: [
          { key: 'maxGrade', label: 'Maximum grade', type: 'number', placeholder: '100', defaultValue: '100', width: 'half', helpText: 'Grade reported by the SCORM package' },
          { key: 'gradeToPass', label: 'Grade to pass', type: 'number', placeholder: 'e.g. 40', width: 'half' },
        ],
      },
      {
        key: 'completion', label: 'Completion',
        fields: [
          { key: 'completionCriteria', label: 'How is this activity marked complete?', type: 'radio', options: [
            { value: 'scorm', label: 'SCORM reports complete — the package tells the LMS when the learner finishes' },
            { value: 'grade', label: 'Receive a passing grade — complete when grade meets the pass threshold' },
            { value: 'manual', label: 'Manual — learner marks the completion themselves' },
          ], defaultValue: 'scorm', width: 'full' },
        ],
      },
    ];
  }

  // ─── QUIZ (Assessment: auto-graded) ───────────────────────────────────
  if (type === 'quiz') {
    return [
      {
        key: 'general', label: 'General', defaultOpen: true,
        fields: [
          { key: 'title', label: 'Name', type: 'text', placeholder: 'e.g. Module 2 Assessment', required: true, width: 'full' },
          { key: 'quizType', label: 'Type', type: 'radio', required: true, options: [
            { value: 'graded', label: 'Graded — counts towards the final grade' },
            { value: 'practice', label: 'Practice — for self-assessment only, not graded' },
          ], defaultValue: 'graded', width: 'full' },
          { key: 'visible', label: 'Show to students', type: 'toggle', defaultValue: 'true' },
        ],
      },
      {
        key: 'timing', label: 'Timing', defaultOpen: true,
        fields: [
          { key: 'timeLimit', label: 'Time limit (minutes)', type: 'number', placeholder: 'e.g. 30', width: 'half', helpText: 'Leave empty for untimed' },
          { key: 'openDate', label: 'Opens on', type: 'dateonly', width: 'half', helpText: 'Students can attempt after this date' },
          { key: 'closeDate', label: 'Closes on', type: 'dateonly', width: 'half', helpText: 'No attempts accepted after this date' },
        ],
      },
      {
        key: 'attempts', label: 'Attempts',
        fields: [
          { key: 'attemptsAllowed', label: 'Attempts allowed', type: 'select', options: [
            { value: '1', label: '1 attempt' }, { value: '2', label: '2 attempts' },
            { value: '3', label: '3 attempts' }, { value: '0', label: 'Unlimited' },
          ], defaultValue: '1', width: 'half' },
        ],
      },
      {
        key: 'grade', label: 'Grade',
        fields: [
          { key: 'maxGrade', label: 'Maximum grade', type: 'number', required: true, placeholder: '100', defaultValue: '100', width: 'half', showWhen: { field: 'quizType', value: 'graded' } },
          { key: 'gradeToPass', label: 'Grade to pass', type: 'number', placeholder: 'e.g. 40', width: 'half', helpText: 'Minimum grade for a passing mark', showWhen: { field: 'quizType', value: 'graded' } },
        ],
      },
      {
        key: 'completion', label: 'Completion',
        fields: [
          { key: 'completionCriteria', label: 'How is this activity marked complete?', type: 'radio', options: [
            { value: 'attempt', label: 'Complete an attempt — marked complete when the learner finishes a quiz attempt' },
            { value: 'grade', label: 'Receive a grade — marked complete when a grade is recorded' },
            { value: 'passinggrade', label: 'Receive a passing grade — marked complete only if the grade meets the pass threshold' },
          ], defaultValue: 'attempt', width: 'full' },
        ],
      },
    ];
  }

  // ─── DISCUSSION / FORUM TOPIC ─────────────────────────────────────────
  if (type === 'forum_topic') {
    return [
      {
        key: 'general', label: 'General', defaultOpen: true,
        fields: [
          { key: 'title', label: 'Name', type: 'text', placeholder: 'e.g. Discuss: Ethics in Business Decision Making', required: true, width: 'full' },
          { key: 'visible', label: 'Show to students', type: 'toggle', defaultValue: 'true' },
        ],
      },
      {
        key: 'forum', label: 'Discussion Settings', defaultOpen: true,
        fields: [
          { key: 'prompt', label: 'Discussion prompt', type: 'textarea', placeholder: 'Set the context and question for students to discuss...', required: true, width: 'full' },
          { key: 'forumType', label: 'Discussion type', type: 'radio', options: [
            { value: 'general', label: 'Open discussion — everyone can see and reply to all posts' },
            { value: 'qanda', label: 'Q&A — students must post their answer before seeing others\' replies' },
          ], defaultValue: 'general', width: 'full' },
        ],
      },
      {
        key: 'completion', label: 'Completion',
        fields: [
          { key: 'completionCriteria', label: 'How is this activity marked complete?', type: 'radio', options: [
            { value: 'post', label: 'Post a reply — marked complete when the learner posts in the discussion' },
            { value: 'manual', label: 'Manual — learner marks the completion themselves' },
          ], defaultValue: 'post', width: 'full' },
        ],
      },
    ];
  }

  // ─── FALLBACK — unknown type ──────────────────────────────────────────
  const { general, availability, completion } = defaultSections();
  return [general, availability, completion];
}

function getTypeSpecificSections(type: EditorActivityType): SettingsSection[] {
  switch (type) {
    case 'video':
      return [
        { key: 'source', label: 'Video Source', fields: [
          { key: 'url', label: 'Video URL', type: 'text', placeholder: 'YouTube, Vimeo, or direct URL', width: 'full' },
          { key: 'duration', label: 'Duration', type: 'text', placeholder: 'e.g. 22:15', width: 'half' },
        ]},
      ];

    case 'page':
      return [
        { key: 'content', label: 'Content', fields: [
          { key: 'content', label: 'Page content', type: 'textarea', placeholder: 'Write or paste learning material here...', width: 'full' },
        ]},
      ];

    case 'pdf':
      return [
        { key: 'document', label: 'Document', fields: [
          { key: 'file', label: 'Upload file', type: 'file', helpText: 'PDF, DOCX, or PPTX (max 50MB)', width: 'full' },
          { key: 'pages', label: 'Page count', type: 'number', placeholder: 'e.g. 24', width: 'half' },
        ]},
      ];

    case 'quiz':
      return [
        { key: 'timing', label: 'Timing', fields: [
          { key: 'timeLimit', label: 'Time limit (minutes)', type: 'number', placeholder: '30', helpText: 'Leave empty for untimed', width: 'half' },
          { key: 'openDate', label: 'Open date', type: 'date', width: 'half' },
          { key: 'closeDate', label: 'Close date', type: 'date', width: 'half' },
        ]},
        { key: 'grading', label: 'Grading', fields: [
          { key: 'attempts', label: 'Attempts allowed', type: 'select', options: [
            { value: '1', label: '1 attempt' }, { value: '2', label: '2 attempts' },
            { value: '3', label: '3 attempts' }, { value: '0', label: 'Unlimited' },
          ], defaultValue: '1', width: 'half' },
          { key: 'passingGrade', label: 'Passing grade (%)', type: 'number', placeholder: '40', width: 'half' },
        ]},
      ];

    case 'assignment':
      return [
        { key: 'submission', label: 'Submission Settings', fields: [
          { key: 'submissionType', label: 'Submission type', type: 'select', options: [
            { value: 'file', label: 'File upload' }, { value: 'text', label: 'Online text' },
            { value: 'both', label: 'File + Online text' },
          ], defaultValue: 'file', width: 'half' },
          { key: 'dueDate', label: 'Due date', type: 'date', required: true, width: 'half' },
          { key: 'cutoffDate', label: 'Cut-off date', type: 'date', helpText: 'No submissions accepted after this', width: 'half' },
          { key: 'maxGrade', label: 'Max grade', type: 'number', placeholder: '100', defaultValue: '100', width: 'half' },
        ]},
      ];

    case 'forum_topic':
      return [
        { key: 'forum', label: 'Discussion Settings', fields: [
          { key: 'forumType', label: 'Discussion type', type: 'select', options: [
            { value: 'general', label: 'General discussion' },
            { value: 'qanda', label: 'Q&A (must post before seeing replies)' },
            { value: 'single', label: 'Single discussion thread' },
          ], defaultValue: 'general', width: 'full' },
        ]},
      ];

    case 'live_session':
      return [
        { key: 'session', label: 'Session Details', fields: [
          { key: 'sessionDate', label: 'Date', type: 'date', required: true, width: 'half' },
          { key: 'sessionTime', label: 'Time', type: 'time', width: 'half' },
          { key: 'duration', label: 'Duration', type: 'select', options: [
            { value: '30', label: '30 minutes' }, { value: '60', label: '1 hour' },
            { value: '90', label: '1.5 hours' }, { value: '120', label: '2 hours' },
          ], defaultValue: '60', width: 'half' },
        ]},
      ];

    case 'scorm':
      return [
        { key: 'package', label: 'SCORM Package', fields: [
          { key: 'file', label: 'Upload SCORM package', type: 'file', helpText: '.zip file containing SCORM 1.2 or 2004 package', width: 'full' },
        ]},
      ];

    default:
      return [];
  }
}

// ─── Type metadata ─────────────────────────────────────────────────────────

const TYPE_META: Record<EditorActivityType, { icon: React.ElementType; label: string; color: string; gradient: string }> = {
  video:        { icon: MonitorPlay,    label: 'Video',           color: '#8F3B00', gradient: 'linear-gradient(135deg, #FFF9F0 0%, #FFECD4 100%)' },
  page:         { icon: FileText,       label: 'Text Content',    color: '#7C3AED', gradient: 'linear-gradient(135deg, #F8F5FF 0%, #EDE6FF 100%)' },
  pdf:          { icon: FileDown,       label: 'Document / PDF',  color: '#7C3AED', gradient: 'linear-gradient(135deg, #F8F5FF 0%, #EDE6FF 100%)' },
  quiz:         { icon: HelpCircle,     label: 'Quiz',            color: '#1B7A4A', gradient: 'linear-gradient(135deg, #F4FCF7 0%, #DDEFDF 100%)' },
  assignment:   { icon: ClipboardList,  label: 'Assignment',      color: '#0E7490', gradient: 'linear-gradient(135deg, #F4FDFE 0%, #DCF3F8 100%)' },
  forum_topic:  { icon: MessageSquare,  label: 'Discussion',      color: '#0DA88F', gradient: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)' },
  live_session: { icon: Video,          label: 'Live Session',    color: '#072FB5', gradient: 'linear-gradient(135deg, #EDF2FF 0%, #D4E2FF 100%)' },
  scorm:        { icon: Package,        label: 'SCORM Package',   color: '#6B7280', gradient: 'linear-gradient(135deg, #F9FAFB 0%, #E5E7EB 100%)' },
};

// Section icons
const SECTION_ICONS: Record<string, React.ElementType> = {
  general: FileText,
  schedule: Calendar,
  people: Users,
  completion: CheckCircle2,
  source: MonitorPlay,
  content: FileText,
  document: FileDown,
  timing: Clock,
  grading: ClipboardList,
  submission: ClipboardList,
  forum: MessageSquare,
  session: Calendar,
  package: Package,
  availability: Calendar,
};

// ─── Field renderers ───────────────────────────────────────────────────────

function FieldInput({ field, value, onChange, accentColor }: { field: FieldDef; value: string; onChange: (v: string) => void; accentColor: string }) {
  const baseInput: React.CSSProperties = {
    width: '100%', padding: '10px 14px', fontSize: 13,
    fontFamily: 'var(--font-sans)', color: 'var(--text-primary)',
    background: 'var(--bg-section)', border: '1.5px solid transparent',
    borderRadius: 10, outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease',
  };

  const focusStyle = `border-color: ${accentColor}; box-shadow: 0 0 0 3px ${accentColor}18; background: #fff;`;
  const blurStyle = 'border-color: transparent; box-shadow: none; background: var(--bg-section);';

  const focusHandlers = {
    onFocus: (e: React.FocusEvent<HTMLElement>) => { e.currentTarget.setAttribute('style', e.currentTarget.getAttribute('style')?.replace(blurStyle, '') + focusStyle); },
    onBlur: (e: React.FocusEvent<HTMLElement>) => { e.currentTarget.setAttribute('style', e.currentTarget.getAttribute('style')?.replace(focusStyle, '') + blurStyle); },
  };

  switch (field.type) {
    case 'text':
      return <input type="text" placeholder={field.placeholder} value={value} onChange={e => onChange(e.target.value)} style={baseInput}
        onFocus={e => { e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.boxShadow = `0 0 0 3px ${accentColor}18`; e.currentTarget.style.background = '#fff'; }}
        onBlur={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'var(--bg-section)'; }}
      />;

    case 'textarea':
      return <textarea placeholder={field.placeholder} value={value} onChange={e => onChange(e.target.value)} rows={3} style={{ ...baseInput, resize: 'vertical', lineHeight: 1.6 }}
        onFocus={e => { e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.boxShadow = `0 0 0 3px ${accentColor}18`; e.currentTarget.style.background = '#fff'; }}
        onBlur={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'var(--bg-section)'; }}
      />;

    case 'number':
      return <input type="number" placeholder={field.placeholder} value={value} onChange={e => onChange(e.target.value)} style={{ ...baseInput, width: 160, fontFamily: 'var(--font-mono)' }}
        onFocus={e => { e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.boxShadow = `0 0 0 3px ${accentColor}18`; e.currentTarget.style.background = '#fff'; }}
        onBlur={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'var(--bg-section)'; }}
      />;

    case 'select':
      return (
        <select value={value || field.defaultValue || ''} onChange={e => onChange(e.target.value)} style={{
          ...baseInput, cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none', paddingRight: 32,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
        }}>
          {field.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      );

    case 'date':
      return <input type="datetime-local" value={value} onChange={e => onChange(e.target.value)} style={{ ...baseInput, width: '100%' }}
        onFocus={e => { e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.boxShadow = `0 0 0 3px ${accentColor}18`; e.currentTarget.style.background = '#fff'; }}
        onBlur={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'var(--bg-section)'; }}
      />;

    case 'time':
      return <input type="time" value={value} onChange={e => onChange(e.target.value)} style={{ ...baseInput, width: '100%' }}
        onFocus={e => { e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.boxShadow = `0 0 0 3px ${accentColor}18`; e.currentTarget.style.background = '#fff'; }}
        onBlur={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'var(--bg-section)'; }}
      />;

    case 'toggle': {
      const isOn = value !== 'false';
      return (
        <button onClick={() => onChange(isOn ? 'false' : 'true')} style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: 0,
          background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)',
        }}>
          <div style={{
            width: 40, height: 22, borderRadius: 11,
            background: isOn ? accentColor : 'var(--neutral-200)',
            position: 'relative', transition: 'background 0.2s ease',
            boxShadow: isOn ? `0 0 8px ${accentColor}30` : 'none',
          }}>
            <div style={{
              width: 16, height: 16, borderRadius: '50%', background: '#fff',
              position: 'absolute', top: 3, left: isOn ? 21 : 3,
              transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }} />
          </div>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: isOn ? accentColor : 'var(--text-tertiary)' }}>
            {isOn ? 'Enabled' : 'Disabled'}
          </span>
        </button>
      );
    }

    case 'file':
      return (
        <div style={{
          padding: '28px 20px', border: `2px dashed ${accentColor}30`,
          borderRadius: 12, background: `${accentColor}04`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer',
          transition: 'border-color 0.15s, background 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = `${accentColor}50`; e.currentTarget.style.background = `${accentColor}08`; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = `${accentColor}30`; e.currentTarget.style.background = `${accentColor}04`; }}
        >
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${accentColor}10`, display: 'grid', placeItems: 'center' }}>
            <Package size={18} style={{ color: accentColor }} />
          </div>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>Click to upload or drag and drop</span>
          {field.helpText && <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{field.helpText}</span>}
        </div>
      );

    case 'dateonly': {
      // Custom date picker: 3 side-by-side inputs for DD / MM / YYYY
      const parts = (value || '').split('-'); // stored as YYYY-MM-DD
      const y = parts[0] || ''; const m = parts[1] || ''; const d = parts[2] || '';
      const update = (dd: string, mm: string, yy: string) => {
        if (yy && mm && dd) onChange(`${yy}-${mm.padStart(2,'0')}-${dd.padStart(2,'0')}`);
        else onChange('');
      };
      const segStyle: React.CSSProperties = {
        ...baseInput, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600, letterSpacing: '0.02em',
      };
      return (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Day</div>
            <input type="text" placeholder="DD" maxLength={2} value={d} onChange={e => update(e.target.value.replace(/\D/g,''), m, y)} style={segStyle}
              onFocus={e => { e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.boxShadow = `0 0 0 3px ${accentColor}18`; e.currentTarget.style.background = '#fff'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'var(--bg-section)'; }}
            />
          </div>
          <span style={{ color: 'var(--text-tertiary)', fontSize: 18, fontWeight: 300, marginTop: 16 }}>/</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Month</div>
            <input type="text" placeholder="MM" maxLength={2} value={m} onChange={e => update(d, e.target.value.replace(/\D/g,''), y)} style={segStyle}
              onFocus={e => { e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.boxShadow = `0 0 0 3px ${accentColor}18`; e.currentTarget.style.background = '#fff'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'var(--bg-section)'; }}
            />
          </div>
          <span style={{ color: 'var(--text-tertiary)', fontSize: 18, fontWeight: 300, marginTop: 16 }}>/</span>
          <div style={{ flex: 1.5 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Year</div>
            <input type="text" placeholder="YYYY" maxLength={4} value={y} onChange={e => update(d, m, e.target.value.replace(/\D/g,''))} style={segStyle}
              onFocus={e => { e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.boxShadow = `0 0 0 3px ${accentColor}18`; e.currentTarget.style.background = '#fff'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'var(--bg-section)'; }}
            />
          </div>
        </div>
      );
    }

    case 'timeonly': {
      // Custom time picker: HH : MM + AM/PM selector
      const timeParts = (value || '').split(':');
      let h = parseInt(timeParts[0] || '10'); const mi = timeParts[1] || '00';
      const isPM = h >= 12; const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
      const setTime = (hr: string, min: string, ampm: string) => {
        let hour24 = parseInt(hr) || 0;
        if (ampm === 'PM' && hour24 < 12) hour24 += 12;
        if (ampm === 'AM' && hour24 === 12) hour24 = 0;
        onChange(`${String(hour24).padStart(2,'0')}:${min}`);
      };
      const segStyle: React.CSSProperties = {
        ...baseInput, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600,
      };
      return (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Hour</div>
            <input type="text" placeholder="HH" maxLength={2} value={String(displayH)} onChange={e => setTime(e.target.value.replace(/\D/g,''), mi, isPM ? 'PM' : 'AM')} style={segStyle}
              onFocus={e => { e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.boxShadow = `0 0 0 3px ${accentColor}18`; e.currentTarget.style.background = '#fff'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'var(--bg-section)'; }}
            />
          </div>
          <span style={{ color: 'var(--text-tertiary)', fontSize: 18, fontWeight: 600, marginTop: 16 }}>:</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Min</div>
            <select value={mi} onChange={e => setTime(String(displayH), e.target.value, isPM ? 'PM' : 'AM')} style={{
              ...segStyle, cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none',
            }}>
              {['00','15','30','45'].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1.5px solid var(--border-subtle)' }}>
              {['AM','PM'].map(p => (
                <button key={p} onClick={() => setTime(String(displayH), mi, p)} style={{
                  padding: '9px 14px', fontSize: 11, fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  background: (isPM ? 'PM' : 'AM') === p ? accentColor : 'var(--bg-section)',
                  color: (isPM ? 'PM' : 'AM') === p ? '#fff' : 'var(--text-tertiary)',
                  border: 'none', cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    case 'radio': {
      const selected = value || field.defaultValue || '';
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {field.options?.map(opt => {
            const isSelected = selected === opt.value;
            // Split label at ' — ' to get title and description
            const dashIdx = opt.label.indexOf(' — ');
            const optTitle = dashIdx > -1 ? opt.label.slice(0, dashIdx) : opt.label;
            const optDesc = dashIdx > -1 ? opt.label.slice(dashIdx + 3) : '';
            return (
              <button key={opt.value} onClick={() => onChange(opt.value)} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '12px 14px',
                background: isSelected ? `${accentColor}06` : 'var(--bg-section)',
                border: `1.5px solid ${isSelected ? accentColor : 'transparent'}`,
                borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                fontFamily: 'var(--font-sans)',
                transition: 'all 0.15s ease',
              }}>
                {/* Radio circle */}
                <div style={{
                  width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                  border: `2px solid ${isSelected ? accentColor : 'var(--neutral-200)'}`,
                  display: 'grid', placeItems: 'center',
                  transition: 'border-color 0.15s',
                }}>
                  {isSelected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: accentColor }} />}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{optTitle}</div>
                  {optDesc && <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2, lineHeight: 1.4 }}>{optDesc}</div>}
                </div>
              </button>
            );
          })}
        </div>
      );
    }

    default:
      return <input type="text" value={value} onChange={e => onChange(e.target.value)} style={baseInput} />;
  }
}

// ─── Conditional field visibility ──────────────────────────────────────────

function isFieldVisible(field: FieldDef, formData: Record<string, string>): boolean {
  if (!field.showWhen) return true;
  const depValue = formData[field.showWhen.field] || '';
  if (Array.isArray(field.showWhen.value)) return field.showWhen.value.includes(depValue);
  return depValue === field.showWhen.value;
}

// ─── Main Modal ────────────────────────────────────────────────────────────

interface Props {
  activityType: EditorActivityType;
  mode: 'create' | 'edit';
  activityName?: string;
  initialValues?: Record<string, string>;
  onClose: () => void;
  onSubmit: (values: Record<string, string>) => void;
  onDelete?: () => void;
}

export default function ActivitySettingsModal({ activityType, mode, activityName, initialValues, onClose, onSubmit, onDelete }: Props) {
  const sections = getSettingsSections(activityType);
  const meta = TYPE_META[activityType];
  const TypeIcon = meta.icon;

  // Extract the title/name field from the first section
  const nameField = sections[0]?.fields.find(f => f.key === 'title');
  const otherGeneralFields = sections[0]?.fields.filter(f => f.key !== 'title') || [];
  const restSections = sections.slice(1);

  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    sections.forEach(s => s.fields.forEach(f => {
      if (f.defaultValue) defaults[f.key] = f.defaultValue;
    }));
    return { ...defaults, ...initialValues };
  });

  const updateField = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const title = formData.title || '';

  // Check all required AND visible fields are filled
  const requiredFields = sections.flatMap(s => s.fields.filter(f => f.required && isFieldVisible(f, formData)));
  const allRequiredFilled = requiredFields.every(f => {
    const val = formData[f.key];
    return val && val.trim() !== '';
  });

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'grid', placeItems: 'center',
      background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(6px)',
    }} onClick={onClose}>
      <div
        style={{
          width: 640, maxHeight: '90vh',
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 25px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.06)',
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* ═══ Header — dark gradient banner ═══ */}
        <div style={{
          padding: '24px 28px 22px',
          background: 'linear-gradient(135deg, #030B22 0%, #06102E 50%, #213594 100%)',
          position: 'relative', overflow: 'hidden',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.12)',
                display: 'grid', placeItems: 'center',
              }}>
                <TypeIcon size={22} strokeWidth={1.8} style={{ color: '#fff' }} />
              </div>
              <h3 style={{
                margin: 0, fontSize: 18, fontWeight: 800,
                color: '#fff', fontFamily: 'var(--font-display)',
                letterSpacing: '-0.03em',
              }}>
                {mode === 'edit' ? (activityName || meta.label) : meta.label}
              </h3>
            </div>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer',
              display: 'grid', placeItems: 'center',
              color: 'rgba(255,255,255,0.5)', transition: 'background 0.12s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Hero name input */}
          {nameField && (
            <div style={{ marginTop: 18 }}>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {nameField.label || 'Name'}
              </label>
              <input
                type="text"
                placeholder={nameField.placeholder || 'Activity name'}
                value={formData.title || ''}
                onChange={e => updateField('title', e.target.value)}
                style={{
                  width: '100%', padding: '12px 16px',
                  fontSize: 15, fontWeight: 600, fontFamily: 'var(--font-display)',
                  color: '#fff',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1.5px solid rgba(255,255,255,0.55)',
                  borderRadius: 10, outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.15s, box-shadow 0.15s, background 0.15s',
                  letterSpacing: '-0.01em',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,255,255,0.08)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
              />
            </div>
          )}
        </div>

        {/* ═══ Body — all sections visible, clean cards ═══ */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px 28px' }}>
          {/* Other general fields (like show/hide toggle) */}
          {otherGeneralFields.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 24 }}>
              {otherGeneralFields.filter(f => isFieldVisible(f, formData)).map(field => (
                <div key={field.key} style={{ width: field.width === 'half' ? 'calc(50% - 7px)' : '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>
                      {field.label}
                    </label>
                  </div>
                  <FieldInput field={field} value={formData[field.key] || ''} onChange={v => updateField(field.key, v)} accentColor={meta.color} />
                  {field.helpText && field.type !== 'file' && (
                    <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)', marginTop: 4 }}>{field.helpText}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Remaining sections as styled cards */}
          {restSections.map((section, sIdx) => {
            const SectionIcon = SECTION_ICONS[section.key] || FileText;
            return (
              <div key={section.key} style={{ marginBottom: sIdx < restSections.length - 1 ? 20 : 0 }}>
                {/* Section header */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  marginBottom: 14,
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: 6,
                    background: `${meta.color}08`,
                    display: 'grid', placeItems: 'center',
                  }}>
                    <SectionIcon size={12} strokeWidth={2.2} style={{ color: meta.color }} />
                  </div>
                  <span style={{
                    fontSize: 12, fontWeight: 700, color: 'var(--text-primary)',
                    letterSpacing: '0.02em', textTransform: 'uppercase',
                  }}>
                    {section.label}
                  </span>
                  <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)', marginLeft: 4 }} />
                </div>

                {/* Fields */}
                <div style={{
                  display: 'flex', flexWrap: 'wrap', gap: 14,
                  padding: '0 0 0 32px',
                }}>
                  {section.fields.filter(f => isFieldVisible(f, formData)).map(field => (
                    <div key={field.key} style={{ width: field.width === 'half' ? 'calc(50% - 7px)' : '100%' }}>
                      <label style={{
                        display: 'block', fontSize: 12, fontWeight: 600,
                        color: 'var(--text-secondary)', marginBottom: 6,
                      }}>
                        {field.label}
                        {field.required && <span style={{ color: meta.color, marginLeft: 3 }}>*</span>}
                      </label>
                      <FieldInput field={field} value={formData[field.key] || ''} onChange={v => updateField(field.key, v)} accentColor={meta.color} />
                      {field.helpText && field.type !== 'file' && (
                        <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)', marginTop: 5, lineHeight: 1.4 }}>{field.helpText}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ═══ Footer ═══ */}
        <div style={{
          padding: '16px 28px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0, background: '#FAFAFA',
        }}>
          <div>
            {mode === 'edit' && onDelete && (
              <button onClick={onDelete} style={{
                padding: '8px 16px', fontSize: 12, fontWeight: 600,
                color: '#DC2626', background: 'transparent',
                border: '1px solid rgba(220,38,38,0.15)', borderRadius: 8,
                cursor: 'pointer', fontFamily: 'var(--font-sans)',
                transition: 'all 0.12s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.05)'; e.currentTarget.style.borderColor = 'rgba(220,38,38,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(220,38,38,0.15)'; }}
              >
                Delete Activity
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onClose} style={{
              padding: '9px 20px', fontSize: 13, fontWeight: 600,
              color: 'var(--text-secondary)', background: '#fff',
              border: '1px solid var(--border-subtle)', borderRadius: 8,
              cursor: 'pointer', fontFamily: 'var(--font-sans)',
              transition: 'background 0.12s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-section)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
            >
              Cancel
            </button>
            <button
              onClick={() => onSubmit(formData)}
              disabled={!allRequiredFilled}
              style={{
                padding: '9px 24px', fontSize: 13, fontWeight: 700,
                color: '#fff',
                background: allRequiredFilled ? meta.color : 'var(--neutral-200)',
                border: 'none', borderRadius: 8,
                cursor: allRequiredFilled ? 'pointer' : 'not-allowed',
                fontFamily: 'var(--font-sans)',
                transition: 'opacity 0.12s, transform 0.12s',
                boxShadow: allRequiredFilled ? `0 2px 8px ${meta.color}30` : 'none',
              }}
              onMouseEnter={e => { if (allRequiredFilled) { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {mode === 'edit' ? 'Save Changes' : `Add ${meta.label}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
