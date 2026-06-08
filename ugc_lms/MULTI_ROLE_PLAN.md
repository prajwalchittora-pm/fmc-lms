# UGC LMS — Multi-Role Frontend Plan

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 16 Frontends                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────┐  │
│  │ Learner  │ │ Faculty  │ │  Admin   │ │  Coordinator   │  │
│  │ Frontend │ │ Frontend │ │ Frontend │ │  /HOD Frontend │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └───────┬────────┘  │
│       └──────┬─────┴─────┬──────┴────────────────┘           │
│              │  API Layer (Next.js Route Handlers)  │         │
│              └──────────────┬────────────────────────┘        │
└─────────────────────────────┼────────────────────────────────┘
                              │ REST (wstoken + wsfunction)
                    ┌─────────▼──────────┐
                    │  Moodle 4.x Server │
                    │  (Headless Backend) │
                    └─────────┬──────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
    ┌─────▼─────┐     ┌──────▼──────┐    ┌───────▼───────┐
    │  Zoom SDK │     │  Elumina    │    │ Custom Plugin │
    │  (Live +  │     │ (Proctored  │    │ local_ugclms  │
    │  Record)  │     │   Exams)    │    │ (Gap Bridge)  │
    └───────────┘     └─────────────┘    └───────────────┘
```

**Key decisions:**
- Single Next.js app with role-based routing (`/faculty/*`, `/admin/*`, `/coordinator/*`)
- Moodle token per user, role determined by Moodle role assignments
- `local_ugclms` custom Moodle plugin to bridge API gaps (engagement scoring, UGC-specific reporting, activity creation)
- Zoom SDK embedded for live sessions + recording
- Elumina for UGC-approved proctored exams

---

## Part 1: Learner Frontend — Gap Analysis

### What's Built vs What's Required

| # | UGC Requirement | Built? | Gap |
|---|----------------|--------|-----|
| 1 | 4-Quadrant course structure (E-Tutorial, E-Content, Discussion, Assessment) | ✅ Yes | Unit → Quadrant → Activity hierarchy done |
| 2 | Video player with transcription | ⚠️ Partial | Player UI exists, NO transcription panel, NO real video |
| 3 | E-Content reader (PDF, e-book) | ⚠️ Partial | PDF activity exists, no download tracking |
| 4 | Discussion forum (near-real-time) | ✅ Yes | 3-level forum built, needs API connection |
| 5 | Self-assessment (MCQ, fill-in-blank, matching, short/long answer) | ⚠️ Partial | Quiz UI exists, only MCQ type rendered |
| 6 | Engagement score (5 components, weighted) | ✅ Yes | Score card + modal breakdown built |
| 7 | 75% threshold for exam eligibility | ✅ Yes | Eligibility badge on engagement card |
| 8 | Fortnightly 2-hour minimum activity tracking | ❌ No | No fortnightly tracker |
| 9 | Proctored exam interface | ❌ No | No Elumina integration |
| 10 | Continuous (30%) vs Summative (70%) grade separation | ⚠️ Partial | Grades table shows internal + end-sem, but ratio not enforced |
| 11 | Assignment submission (file upload + text) | ❌ No | No upload interface |
| 12 | Live session / synchronous counselling (Zoom) | ❌ No | No Zoom SDK integration |
| 13 | Attendance / participation tracking | ⚠️ Partial | Static % shown, no self-marking |
| 14 | Aadhaar/Govt ID authentication | ❌ No | Mock login only |
| 15 | Grievance submission + tracking | ❌ No | Tickets page is Coming Soon |
| 16 | Help desk / single-window service | ❌ No | Tickets page is Coming Soon |
| 17 | Academic calendar with sync/async sessions | ✅ Yes | Calendar built with event types |
| 18 | Pre-admission counselling interface | ❌ No | Not applicable to in-app learner |
| 19 | Digital certificate with unique ID | ❌ No | Certificate card exists but no download |
| 20 | E-Library / digital repository | ❌ No | Coming Soon placeholder |
| 21 | Plagiarism check visibility | ❌ No | Not built |
| 22 | Academic integrity policy page | ❌ No | Not built |
| 23 | Notifications system | ❌ No | No push/in-app notifications |
| 24 | Messaging (direct messages to mentor/faculty) | ❌ No | Forum only, no DMs |
| 25 | Payment gateway | ❌ No | Not in learner frontend (admin handles) |
| 26 | Responsive / mobile-friendly | ⚠️ Partial | Designed for 1440p, no mobile breakpoints |

### Priority Fixes for Learner Frontend

**P0 — Must fix before UGC approval:**
1. Assignment submission interface (mod_assign integration)
2. All quiz question types (not just MCQ — fill-in-blank, matching, short answer, essay)
3. Live session integration (Zoom SDK embed + attendance marking)
4. Proctored exam interface (Elumina embed + audit logging)
5. Video transcription panel
6. Real authentication (Moodle token-based, Aadhaar verification link)
7. Notifications center

**P1 — Required but can launch without:**
8. Support tickets / grievance system
9. E-Library with search and download tracking
10. Certificate download with unique ID
11. Direct messaging to mentor/faculty
12. Fortnightly activity tracker
13. Mobile responsive breakpoints

**P2 — Nice to have:**
14. Academic integrity policy page
15. Plagiarism report visibility
16. Offline content access

---

## Part 2: Role Definitions (UGC + Moodle Mapping)

| Role | UGC Regulation | Moodle Role | Responsibilities |
|------|---------------|-------------|-----------------|
| **Learner** | Reg. 14 | `student` | Consume content, submit work, participate, take exams |
| **Faculty / Course Coordinator** | Reg. 11, Annexure IV | `editingteacher` | Create content, grade, moderate forums, manage course, conduct sessions |
| **Mentor** | Annexure IV (1:250 ratio) | `teacher` (non-editing) | Grade, facilitate discussion, guide learners, attendance |
| **Programme Coordinator** | Annexure IV | `manager` (category-level) | Oversee programme, manage faculty, review grades, ensure UGC compliance |
| **HOD / Coordinator** | Reg. 7-8 | `manager` (category-level) | Programme approval, faculty assignment, quality oversight |
| **Admin** | Reg. 6 | `admin` / `manager` | System config, user management, reporting, CIQA support |
| **CIQA Director** | Annexure I | `manager` (system-level) | Quality assurance, audit reports, stakeholder feedback |
| **Examiner** | Reg. 15 | `teacher` (course-level) | Question paper development, evaluation, exam oversight |

**For frontend purposes, we consolidate into 4 frontends:**
1. **Learner** — Already built (needs gap fixes above)
2. **Faculty** — Course Coordinator + Mentor + Examiner views
3. **Admin** — System admin + user management + reporting
4. **Coordinator** — Programme Coordinator + HOD + CIQA Director

---

## Part 3: Faculty Frontend — Screen Inventory

### Navigation Structure (SideNav Tabs)

| # | Tab | Icon | Description |
|---|-----|------|-------------|
| 1 | Dashboard | LayoutDashboard | Overview: my courses, pending tasks, upcoming sessions |
| 2 | My Courses | BookOpen | Course list with editing capabilities |
| 3 | Grading | CheckSquare | Pending submissions, grade queue, rubrics |
| 4 | Question Bank | Database | Create/manage questions across courses |
| 5 | Attendance | UserCheck | Session management, attendance marking |
| 6 | Students | Users | Enrolled students, engagement analytics |
| 7 | Forum | MessageSquare | Discussion moderation across courses |
| 8 | Live Sessions | Video | Zoom session management, recordings |
| 9 | Calendar | Calendar | Teaching schedule, deadlines |
| 10 | Announcements | Bell | Create/manage announcements |

### Screen-by-Screen Breakdown

#### 3.1 Faculty Dashboard (1 screen)
**What it shows:**
- Welcome + faculty profile summary
- Today's schedule (live sessions, deadlines)
- Pending actions count cards:
  - Assignments to grade
  - Forum posts to moderate
  - Quiz reviews pending
  - Attendance sessions to conduct
- Quick stats: total students, active courses, avg engagement
- Recent student activity feed

**Moodle APIs:**
- `core_enrol_get_users_courses` — my courses
- `mod_assign_get_assignments` + `mod_assign_get_submissions` — pending grading
- `core_calendar_get_action_events_by_timesort` — upcoming events
- `core_message_get_unread_conversation_counts` — unread messages

---

#### 3.2 My Courses (2 screens)

**3.2a Course List** — Grid/list of courses I teach
- Course card: title, code, semester, enrolled count, completion rate
- Status badges: Active, Upcoming, Archived
- Quick actions: Enter course, View grades, Manage activities

**3.2b Course Editor** — Course content management (the big one)
- **Unit Management**: Add/reorder/rename/delete units
- **Quadrant Structure per Unit**:
  - Live Session: Schedule Zoom sessions, link recordings
  - E-Tutorial: Upload videos, add transcriptions, set completion criteria
  - E-Content: Upload PDFs/docs, add web links, create pages
  - Discussion: Create forum topics per unit
  - Assessment: Link quizzes, create assignments
- **Activity Settings**: Completion conditions, availability restrictions (dates, prerequisites)
- **Bulk Operations**: Import from another course, duplicate activities

**Moodle APIs:**
- `core_course_get_contents` — course structure
- `core_course_get_courses` — course list
- `core_enrol_get_enrolled_users` — student count
- `core_completion_get_activities_completion_status` — completion rates
- `core_files_upload` + `webservice/upload.php` — file uploads
- `mod_forum_add_discussion` — create forum topics
- Custom plugin for activity creation/reordering

---

#### 3.3 Grading Center (4 screens)

**3.3a Grading Queue** — All pending submissions across courses
- Filter: By course, by type (assignment/quiz/forum), by urgency
- Sort: Oldest first, due date, student name
- Submission card: student name, course, activity, submitted date, status
- Batch actions: Download all, Grade multiple

**3.3b Assignment Grading** — Grade individual assignment
- Split view: Student submission (left) + grading panel (right)
- Submission viewer: File preview (PDF/doc/image), online text
- Grading form: Score input, rubric (if configured), text feedback
- Quick actions: Return for revision, Grant extension
- Navigation: Previous/Next student

**3.3c Quiz Review** — Review quiz attempts
- Question-by-question review
- Manual grading for essay/short answer questions
- Override auto-graded scores
- Add per-question feedback
- Regrading tools

**3.3d Rubric Manager** — Create/edit grading rubrics
- Criteria rows with level descriptions and scores
- Marking guide alternative
- Apply rubric to assignments

**Moodle APIs:**
- `mod_assign_get_submissions` — submission list
- `mod_assign_get_submission_status` — individual submission
- `mod_assign_save_grade` — submit grade
- `mod_assign_save_grades` — batch grade
- `mod_quiz_get_user_attempts` — quiz attempts
- `mod_quiz_get_attempt_review` — attempt details
- `core_grading_get_definitions` — rubric definitions
- `core_grading_save_definitions` — create/edit rubrics
- `mod_assign_save_user_extensions` — grant extensions

---

#### 3.4 Question Bank (2 screens)

**3.4a Question Browser** — Browse/search all questions
- Filter: By course, category, type (MCQ, essay, matching, etc.)
- Search by question text
- Preview question inline
- Add to quiz, Duplicate, Edit, Delete
- Import/Export (Moodle XML, GIFT, Aiken formats)

**3.4b Question Editor** — Create/edit individual question
- Question type selector
- Question text editor (rich text)
- Answer options (varies by type)
- Feedback fields (per answer + general)
- Tags, difficulty, category assignment

**Moodle APIs:**
- `core_question_get_random_question_summaries` — question list
- Question creation requires custom plugin or Moodle admin
- `mod_quiz_add_random_questions` — add to quiz

**Note:** Moodle's question bank has LIMITED web service API. This is a gap that needs the `local_ugclms` plugin to bridge.

---

#### 3.5 Attendance Management (2 screens)

**3.5a Session List** — Attendance sessions for my courses
- Calendar/list view of sessions
- Status: Upcoming, In Progress, Completed
- Quick stats: Avg attendance %, students marked
- Create new session: Date, time, duration, type (live/regular)

**3.5b Session Marking** — Mark attendance for a session
- Student roster with status toggles (Present/Late/Absent/Excused)
- Bulk mark: Mark all present, Mark by group
- Self-marking link generation (QR code / time-limited URL)
- Notes per student
- Export attendance report

**Moodle APIs:**
- `mod_attendance_get_sessions` — session list
- `mod_attendance_add_session` — create session
- `mod_attendance_update_user_status` — mark attendance
- `mod_attendance_get_session` — session details

---

#### 3.6 Student Analytics (2 screens)

**3.6a Class Overview** — All students in a course
- Table: Student name, engagement %, attendance %, current grade, last active
- Sort/filter by any column
- Risk indicators (falling behind, inactive >2 weeks)
- Export to CSV

**3.6b Student Profile** — Individual student detail
- Engagement breakdown (5 UGC components)
- Activity completion timeline
- Grade history (assignments + quizzes)
- Forum participation stats
- Attendance record
- Exam eligibility status
- Send direct message button

**Moodle APIs:**
- `core_enrol_get_enrolled_users` — student list
- `core_completion_get_activities_completion_status` — per-student completion
- `gradereport_user_get_grade_items` — student grades
- `mod_forum_get_discussion_posts_by_userid` — forum activity
- `mod_attendance_get_sessions` + status data — attendance

---

#### 3.7 Forum Moderation (1 screen — extends learner forum)
- Same 3-level forum as learner, plus:
- Pin/Unpin threads
- Lock/Unlock threads
- Delete posts
- Role badge (Faculty) on own posts
- Flagged content queue
- Reply as announcement

**Moodle APIs:**
- All `mod_forum_*` functions
- `mod_forum_set_pin_state`, `mod_forum_set_lock_state`
- `mod_forum_delete_post`

---

#### 3.8 Live Sessions (2 screens)

**3.8a Session Scheduler** — Schedule and manage Zoom sessions
- Create session: Title, date/time, duration, course, unit link
- Recurring session setup
- Session list with status (Scheduled, Live, Ended)
- Recording management: View, download, link to activity

**3.8b Session Conductor** — In-session view
- Zoom SDK embedded (start/join meeting)
- Participant list with attendance auto-marking
- Chat panel
- Screen share controls
- Recording toggle
- Post-session: Auto-upload recording, generate transcript

**External Integration:**
- Zoom SDK for meeting management
- Zoom API for recordings
- Moodle: `mod_bigbluebuttonbn_*` pattern adapted for Zoom, or custom `mod_zoom` plugin
- Attendance marking via `mod_attendance_update_user_status`

---

#### 3.9 Calendar (1 screen — shared with learner, faculty actions added)
- Same calendar grid as learner
- Plus: Create events (deadline, session, exam)
- Edit/delete own events
- Course-scoped event creation

---

#### 3.10 Announcements Manager (1 screen)
- Create announcement (title, body, attachments, target: course/programme/all)
- Pin/unpin
- Edit/delete own announcements
- View stats (read count)

**Moodle APIs:**
- `mod_forum_add_discussion` (announcements forum type)
- Custom announcement module or notification system

---

### Faculty Frontend Total: **18 screens**

| Category | Screen Count |
|----------|-------------|
| Dashboard | 1 |
| My Courses | 2 |
| Grading Center | 4 |
| Question Bank | 2 |
| Attendance | 2 |
| Student Analytics | 2 |
| Forum Moderation | 1 |
| Live Sessions | 2 |
| Calendar | 1 |
| Announcements | 1 |
| **Total** | **18** |

---

## Part 4: Admin Frontend — Screen Inventory

### Navigation Structure (SideNav Tabs)

| # | Tab | Icon | Description |
|---|-----|------|-------------|
| 1 | Dashboard | LayoutDashboard | System overview, alerts, quick stats |
| 2 | Users | Users | Student/faculty/staff management |
| 3 | Programmes | GraduationCap | Programme & course structure management |
| 4 | Enrolment | UserPlus | Batch enrolment, cohort management |
| 5 | Exams | FileCheck | Exam scheduling, centre management, proctoring |
| 6 | Reports | BarChart3 | UGC compliance reports, analytics |
| 7 | CIQA | ShieldCheck | Quality assurance dashboard |
| 8 | Grievances | MessageCircle | Grievance management + escalation |
| 9 | Announcements | Bell | System-wide announcements |
| 10 | Settings | Settings | System configuration |

### Screen-by-Screen Breakdown

#### 4.1 Admin Dashboard (1 screen)
**What it shows:**
- System health: Total students, active today, new enrollments (week/month)
- Programme cards: enrolled count, completion rate, engagement avg per programme
- Alert feed: Low engagement students, pending grievances, upcoming exam deadlines
- Quick actions: Add user, Create announcement, Generate report
- UGC compliance status checklist (green/amber/red)

**Moodle APIs:**
- `core_user_get_users` — user stats
- `core_enrol_get_enrolled_users` — enrollment counts
- Custom reporting plugin for aggregated stats

---

#### 4.2 User Management (3 screens)

**4.2a User Directory** — All users with roles
- Table: Name, Email, Role(s), Programme, Status (Active/Suspended), Last Login
- Search + filter by role, programme, status
- Bulk actions: Activate, Suspend, Export, Send message
- Add single user / Import CSV

**4.2b User Profile Editor** — Create/edit user
- Personal info: Name, email, phone, Aadhaar/ID number, photo
- Role assignments: Student, Faculty, Mentor, Coordinator, Admin
- Programme/course enrollment
- Custom fields (batch, admission year, etc.)
- Authentication method

**4.2c Faculty Management** — Faculty-specific view
- Faculty directory with qualifications, specialization, courses assigned
- Workload view: courses teaching, students mentoring, hours/week
- 1:250 mentor ratio enforcement indicator
- Faculty profile (public page content management)

**Moodle APIs:**
- `core_user_create_users`, `core_user_update_users` — CRUD
- `core_user_get_users`, `core_user_get_users_by_field` — search
- `core_role_assign_roles`, `core_role_unassign_roles` — role management
- `enrol_manual_enrol_users` — enrolment

---

#### 4.3 Programme & Course Management (3 screens)

**4.3a Programme Directory** — All programmes
- Card/table: Programme name, type (UG/PG/Diploma), duration, total credits, semesters, enrolled
- Status: Active, Under Review, Archived
- Create new programme

**4.3b Programme Editor** — Configure programme
- Basic info: Name, type, duration, eligibility, fee structure
- Semester structure: Drag courses into semesters
- Credit distribution: Per-semester credit mapping
- Faculty assignment: Programme Coordinator, Course Coordinators
- PPR (Programme Project Report) compliance checklist
- Syllabus upload per course

**4.3c Course Setup** — Course configuration
- Course details: Title, code, credits, semester, category
- 4-quadrant structure template setup
- Assign faculty (Coordinator + Mentors)
- Enrolment method selection
- Completion criteria configuration
- Gradebook structure: 30% continuous + 70% summative

**Moodle APIs:**
- `core_course_create_courses`, `core_course_update_courses` — course CRUD
- `core_course_create_categories` — category (programme) management
- `enrol_manual_enrol_users` — assign faculty
- Custom plugin for programme-level metadata

---

#### 4.4 Enrolment Management (2 screens)

**4.4a Batch Enrolment** — Enrol students in bulk
- CSV upload: Student ID, Programme, Semester, Courses
- Preview with validation (duplicate check, eligibility check)
- Confirm and execute
- Results summary: Success/Fail counts with error details

**4.4b Cohort Manager** — Manage student batches
- Cohort list: Batch name, programme, year, member count
- Create/edit cohort
- Add/remove members
- Sync cohort to course enrolments

**Moodle APIs:**
- `enrol_manual_enrol_users` — individual enrolment
- `core_cohort_create_cohorts`, `core_cohort_add_cohort_members` — cohort management
- `core_user_create_users` — bulk user creation

---

#### 4.5 Examination Management (4 screens)

**4.5a Exam Calendar** — All exams across programmes
- Calendar view with exam slots
- Filter by programme, semester, type (mid-sem/end-sem/supplementary)
- Schedule new exam: Course, date, time, duration, type, mode (online/offline)

**4.5b Exam Configuration** — Individual exam setup
- Exam details: Date, time, duration, total marks, passing marks
- Mode: Online proctored (Elumina) / Physical centre / Hybrid
- Question paper assignment
- Proctoring settings: Webcam, screen capture, secure browser, interval settings
- Observer assignment (for physical centres)
- Eligible students list (auto-filtered by 75% engagement)

**4.5c Exam Centre Management** — Physical exam centres (if applicable)
- Centre list: Location, capacity, CCTV status, ICT facilities
- Centre-student mapping
- Observer assignment per centre
- CCTV archive management (5-year retention)

**4.5d Results Processing** — Post-exam
- Grade import/entry
- Moderation controls (scaling, grace marks)
- Result declaration workflow: Entry → Verification → Approval → Publish
- Grade card generation (continuous + summative shown separately)
- National Academic Depository upload status

**External Integration:**
- Elumina API for proctored exam sessions
- Moodle: `mod_quiz_*` for online quizzes
- Custom plugin for exam management, result processing

---

#### 4.6 Reports & Analytics (4 screens)

**4.6a Enrollment Report** — Year-wise, programme-wise enrollment data
- Pivot table: Programme × Year × Gender × Category
- Trend charts: Enrollment over time
- Export: CSV, Excel, PDF
- UGC format compliance

**4.6b Engagement Report** — Student engagement analytics
- Programme/course level: Avg engagement score, distribution histogram
- Student-level: Below 75% threshold list, at-risk students
- Component breakdown: Which quadrant has lowest participation
- Fortnightly activity compliance (2hr minimum)

**4.6c Academic Performance Report** — Grades and outcomes
- Programme-wise pass rate, grade distribution
- Course-wise: Avg marks, highest/lowest, std deviation
- Comparison: Continuous (30%) vs Summative (70%) performance correlation
- Student progression: Semester-to-semester improvement

**4.6d Compliance Report** — UGC regulatory compliance
- Mandatory disclosure checklist (16 items from Reg. 9) — status per item
- Content sourcing: % in-house vs external (60% minimum threshold)
- Faculty-student ratio per programme
- Mentor-student ratio per course (1:250)
- Exam audit trail completeness
- CIQA meeting and report status

**Moodle APIs:**
- `gradereport_user_get_grade_items` — grades data
- `core_enrol_get_enrolled_users` — enrollment data
- `core_completion_get_activities_completion_status` — completion data
- Custom plugin for aggregated reporting

---

#### 4.7 CIQA Dashboard (2 screens)

**4.7a Quality Dashboard** — CIQA oversight
- Quality KPIs: Course pass rates, engagement averages, faculty utilization
- Meeting tracker: Upcoming, past meetings, minutes, ATR status
- Annual report status: Draft / Under Review / Published
- Stakeholder feedback summary: Student, Faculty, Employer, Parent
- Accreditation status (NAAC, UGC recognition)

**4.7b Feedback Manager** — Stakeholder feedback collection
- Create feedback form (survey builder)
- Distribute to: Students, Faculty, Employers, Parents
- Response dashboard with analytics
- Feedback action items tracker

**Moodle APIs:**
- `mod_feedback_*` — survey/feedback forms
- Custom plugin for CIQA workflow

---

#### 4.8 Grievance Management (2 screens)

**4.8a Grievance Queue** — All active grievances
- Table: Ticket ID, Student, Category, Status, Submitted Date, SLA countdown
- Filter: Category (Academic/Technical/Administrative), Status, Priority
- Assign to handler
- Escalation workflow: Level 1 → Level 2 → Level 3 with SLA timers

**4.8b Grievance Detail** — Individual grievance
- Student info + grievance description
- Conversation thread (student ↔ handler)
- Internal notes (not visible to student)
- Status updates with timestamp audit trail
- Resolution and closure

**Moodle APIs:**
- Custom ticketing module (Moodle has no built-in grievance system)
- `core_message_*` for notifications

---

#### 4.9 System Announcements (1 screen)
- Create system-wide announcements
- Target: All users / Specific programme / Specific role
- Schedule: Immediate / Scheduled
- Pin important announcements
- Attachment support

---

#### 4.10 Settings & Configuration (2 screens)

**4.10a System Settings** — General configuration
- Academic calendar setup (semester dates, holidays)
- Engagement score weights (UGC defaults, adjustable)
- Grading scale configuration
- Default completion criteria
- Notification preferences (which events trigger alerts)

**4.10b Mandatory Disclosures** — UGC Reg. 9 compliance
- 16-item checklist with content editor per item
- Upload supporting documents
- Public page preview
- Last updated timestamps

**Moodle APIs:**
- Custom plugin for UGC-specific configuration
- `core_calendar_create_calendar_events` — academic calendar

---

### Admin Frontend Total: **24 screens**

| Category | Screen Count |
|----------|-------------|
| Dashboard | 1 |
| User Management | 3 |
| Programme & Course Management | 3 |
| Enrolment Management | 2 |
| Examination Management | 4 |
| Reports & Analytics | 4 |
| CIQA Dashboard | 2 |
| Grievance Management | 2 |
| Announcements | 1 |
| Settings & Configuration | 2 |
| **Total** | **24** |

---

## Part 5: Coordinator / HOD Frontend — Screen Inventory

### Navigation Structure (SideNav Tabs)

| # | Tab | Icon | Description |
|---|-----|------|-------------|
| 1 | Dashboard | LayoutDashboard | Programme health overview |
| 2 | Programmes | GraduationCap | My programme(s) overview |
| 3 | Faculty | Users | Faculty under me |
| 4 | Students | UserCheck | Student performance overview |
| 5 | Curriculum | BookMarked | Syllabus and content review |
| 6 | Exams | FileCheck | Exam oversight |
| 7 | Reports | BarChart3 | Programme-level reports |
| 8 | Quality | ShieldCheck | Quality metrics and audit |
| 9 | Calendar | Calendar | Programme calendar |

### Screen-by-Screen Breakdown

#### 5.1 Coordinator Dashboard (1 screen)
- Programme summary cards: Enrolled, Active, At-risk, Graduated
- Faculty status: Courses assigned, pending grading backlogs
- Engagement overview: Programme-level engagement distribution
- Alerts: Courses below 60% engagement, faculty without forum activity, upcoming exams
- UGC compliance status for my programme

---

#### 5.2 Programme Overview (2 screens)

**5.2a Programme Health** — Programme-level metrics
- Semester-wise enrollment and completion
- Course-wise engagement heatmap
- Credit distribution visualization
- Intake vs graduation funnel

**5.2b Semester View** — Current semester detail
- Course list with: Faculty assigned, students enrolled, avg engagement, avg grade
- Status flags: On track, needs attention, critical
- Content readiness: % of 4-quadrant content uploaded per course

---

#### 5.3 Faculty Oversight (2 screens)

**5.3a Faculty Overview** — All faculty in my programme
- Table: Faculty name, courses, student load, grading pending, forum activity, last login
- Workload balancing view
- Mentor assignment status (1:250 check)

**5.3b Faculty Detail** — Individual faculty performance
- Courses teaching with progress
- Grading turnaround time (avg days to grade)
- Forum engagement: Posts, replies, avg response time
- Student feedback scores (from mod_feedback)
- Live session attendance and recording status

---

#### 5.4 Student Oversight (2 screens)

**5.4a Programme Students** — All students across programme
- Table: Name, semester, CGPA, engagement %, attendance %, status
- Filter: Semester, status (Active/At-risk/Detained/Graduated)
- Drill-down to individual student
- At-risk students highlighted (engagement < 50%, attendance < 75%)

**5.4b Student Detail** — Individual student (read-only version of faculty's student profile)
- Engagement breakdown per component
- Grade history across semesters
- Exam eligibility status
- Attendance record
- Any grievances filed

---

#### 5.5 Curriculum Review (2 screens)

**5.5a Syllabus Manager** — Course syllabi for programme
- Course list with syllabus status: Uploaded, Under Review, Approved
- View syllabus document per course
- 4-quadrant content checklist: Does each course have all 4 quadrants populated?
- Content sourcing: In-house vs external percentage per course (60% threshold)

**5.5b Content Audit** — Content quality review
- Per course: List of all activities with type, creator, creation date, last updated
- Flag outdated content (>2 years old)
- Review and approve new content
- Suggested readings and web resources checklist

---

#### 5.6 Exam Oversight (1 screen)
- Exam calendar for my programme (read-only, set by admin)
- Eligibility status for all students per exam
- Pass rates for past exams
- Observer reports viewer
- Red flags: Courses with <60% pass rate, students with eligibility issues

---

#### 5.7 Programme Reports (2 screens)

**5.7a Performance Report** — Academic performance analytics
- Semester-wise grade distribution charts
- Course-wise pass/fail rates
- Top/bottom performing courses
- Year-over-year comparison
- Export for regulatory submission

**5.7b Engagement Report** — Programme engagement analytics
- Quadrant-wise participation: Which quadrant is weakest?
- Fortnightly activity compliance rate
- Students below 75% threshold — count and list
- Engagement trends over time

---

#### 5.8 Quality Review (1 screen)
- Programme quality scorecard
- PPR compliance status
- Student feedback analysis
- Faculty evaluation summary
- Academic audit preparation checklist
- Benchmark comparison (if available)

---

#### 5.9 Programme Calendar (1 screen)
- Same calendar component as learner
- Plus: View all course deadlines, exam dates, live sessions across programme
- No create (admin creates, coordinator views)

---

### Coordinator Frontend Total: **14 screens**

| Category | Screen Count |
|----------|-------------|
| Dashboard | 1 |
| Programme Overview | 2 |
| Faculty Oversight | 2 |
| Student Oversight | 2 |
| Curriculum Review | 2 |
| Exam Oversight | 1 |
| Reports | 2 |
| Quality Review | 1 |
| Calendar | 1 |
| **Total** | **14** |

---

## Part 6: Complete Screen Inventory Summary

| Frontend | Screens | Status |
|----------|---------|--------|
| Learner | 9 built + 2 placeholder + ~7 gap screens = **~18** | 60% built |
| Faculty | **18** | 0% built |
| Admin | **24** | 0% built |
| Coordinator/HOD | **14** | 0% built |
| **Total** | **~74 screens** | |

### Shared Components Across Roles
These components can be shared (built once, used across frontends):

| Component | Used By |
|-----------|---------|
| SideNav (role-configurable tabs) | All |
| Calendar View | Learner, Faculty, Coordinator |
| Forum View (with role-based actions) | Learner, Faculty |
| Engagement Score Card | Learner, Faculty (student view), Coordinator |
| Grade Table (expandable) | Learner, Faculty, Coordinator |
| Announcement Feed | All |
| User Profile Card | All |
| Search/Filter bar | All |
| Data Table (sortable, filterable) | Faculty, Admin, Coordinator |
| Modal / Dialog | All |
| Chart Components (bar, line, pie) | Faculty, Admin, Coordinator |
| File Upload | Learner (assignments), Faculty (content) |

**Estimated unique components to build: ~45** (after shared component reuse)

---

## Part 7: Moodle Custom Plugin Requirements

### `local_ugclms` — Custom Moodle Plugin

The following capabilities are NOT available in standard Moodle Web Services and need a custom plugin:

| # | Function Needed | Why |
|---|----------------|-----|
| 1 | `local_ugclms_get_engagement_score` | UGC engagement calculation with 5 weighted components — Moodle has no built-in engagement scoring |
| 2 | `local_ugclms_get_programme_structure` | Programme → Semester → Course hierarchy doesn't exist natively in Moodle |
| 3 | `local_ugclms_create_activity` | Full activity creation (quiz/assign/forum/page) via API — Moodle's built-in module creation API is limited |
| 4 | `local_ugclms_get_event_log` | Query event log store — no built-in WS for raw logs |
| 5 | `local_ugclms_manage_grievances` | Ticketing/grievance CRUD — Moodle has no built-in grievance system |
| 6 | `local_ugclms_get_compliance_report` | UGC mandatory disclosures and compliance data — custom |
| 7 | `local_ugclms_get_content_sourcing` | Track in-house vs external content ratio (60% threshold) |
| 8 | `local_ugclms_manage_exam_config` | Exam centre, observer, proctoring config beyond what mod_quiz offers |
| 9 | `local_ugclms_generate_certificate` | Certificate with unique ID, Aadhaar, photo — custom |
| 10 | `local_ugclms_get_aggregated_reports` | Enrollment/engagement/performance reports aggregated at programme level |

---

## Part 8: External Integration Points

| Integration | Purpose | Where Used | API/SDK |
|------------|---------|------------|---------|
| **Zoom SDK** | Live sessions, recording, attendance | Faculty (Live Sessions), Learner (join session) | Zoom Meeting SDK for Web, Zoom API v2 |
| **Elumina** | Proctored examinations | Learner (take exam), Admin (configure) | Elumina API (proprietary, already licensed) |
| **Aadhaar/DigiLocker** | Identity verification | Admin (enrollment), Learner (profile), Exam (biometric) | DigiLocker API / UIDAI API |
| **National Academic Depository** | Certificate/degree upload | Admin (results processing) | NAD API |
| **Payment Gateway** | Fee collection | Admin (settings), possibly learner portal | Razorpay/PayU SDK |
| **SMTP/Email** | Notifications | All roles | Nodemailer or Moodle's built-in email |

---

## Part 9: Recommended Build Order

### Phase 1: Foundation (Weeks 1-4)
**Goal:** API layer + Authentication + Shared components

1. Set up Moodle test instance with sample data
2. Build Next.js API route handlers for Moodle Web Services
3. Implement authentication flow (Moodle token-based)
4. Build shared component library (DataTable, Charts, FileUpload, Modal)
5. Fix learner frontend P0 gaps: Assignment submission, All quiz types, Video transcription
6. Start `local_ugclms` plugin development

### Phase 2: Faculty Frontend (Weeks 5-10)
**Goal:** Faculty can manage courses, grade, and conduct sessions

1. Faculty Dashboard + My Courses
2. Grading Center (4 screens) — highest priority for daily use
3. Attendance Management (2 screens)
4. Student Analytics (2 screens)
5. Forum Moderation
6. Live Sessions (Zoom SDK integration)
7. Question Bank (2 screens)
8. Calendar + Announcements

### Phase 3: Admin Frontend (Weeks 11-16)
**Goal:** Admin can manage users, programmes, and generate reports

1. Admin Dashboard
2. User Management (3 screens)
3. Programme & Course Management (3 screens)
4. Enrolment Management (2 screens)
5. Reports & Analytics (4 screens)
6. Examination Management (4 screens) + Elumina integration
7. CIQA Dashboard (2 screens)
8. Grievance Management (2 screens)
9. Settings + Mandatory Disclosures

### Phase 4: Coordinator Frontend (Weeks 17-20)
**Goal:** Coordinators can oversee programmes and faculty

1. Coordinator Dashboard
2. Programme Overview (2 screens)
3. Faculty Oversight (2 screens)
4. Student Oversight (2 screens)
5. Curriculum Review (2 screens)
6. Reports (2 screens)
7. Exam Oversight + Quality Review + Calendar

### Phase 5: Polish & Compliance (Weeks 21-24)
**Goal:** UGC submission-ready

1. Complete learner P1 gaps (E-Library, Tickets, Certificates, Messaging)
2. Mobile responsive across all frontends
3. Accessibility audit (WCAG 2.1)
4. UGC compliance audit against all 16 mandatory disclosures
5. Performance optimization
6. Security audit (authentication, data encryption, audit logging)
7. UAT with all roles

---

## Part 10: Moodle API → Frontend Screen Mapping

### Learner Screens → Moodle API

| Screen | Primary APIs |
|--------|-------------|
| Home Dashboard | `core_enrol_get_users_courses`, `local_ugclms_get_engagement_score`, `core_calendar_get_action_events_by_timesort` |
| Course List | `core_course_get_courses_by_field`, `core_completion_get_course_completion_status` |
| Course View (4-Quadrant) | `core_course_get_contents`, `core_completion_get_activities_completion_status` |
| Video Activity | `mod_resource_view_resource` or `mod_url_view_url`, `core_completion_update_activity_completion_status_manually` |
| Page Activity | `mod_page_get_pages_by_courses`, `mod_page_view_page` |
| PDF Activity | `mod_resource_get_resources_by_courses`, download via `pluginfile.php` |
| Quiz Activity | `mod_quiz_start_attempt`, `mod_quiz_get_attempt_data`, `mod_quiz_save_attempt`, `mod_quiz_process_attempt` |
| Assignment Submission | `mod_assign_get_submission_status`, `mod_assign_save_submission`, `mod_assign_submit_for_grading` |
| Forum | `mod_forum_get_forums_by_courses`, `mod_forum_get_forum_discussions`, `mod_forum_get_discussion_posts`, `mod_forum_add_discussion`, `mod_forum_add_discussion_post` |
| Grades | `gradereport_user_get_grades_table`, `gradereport_user_get_grade_items` |
| Exams | `mod_quiz_get_quizzes_by_courses`, `local_ugclms_get_exam_config` |
| Calendar | `core_calendar_get_calendar_monthly_view`, `core_calendar_get_action_events_by_courses` |
| Announcements | Site news forum via `mod_forum_get_forum_discussions` |
| Engagement Score | `local_ugclms_get_engagement_score` |
| E-Library | `core_course_get_contents` (resource type), `core_files_get_files` |
| Tickets/Grievance | `local_ugclms_manage_grievances` |
| Certificate | `local_ugclms_generate_certificate` |
| Notifications | `core_message_get_messages`, `core_message_get_unread_notification_count` |

### Faculty Screens → Moodle API

| Screen | Primary APIs |
|--------|-------------|
| Dashboard | `core_enrol_get_users_courses`, `mod_assign_get_submissions` (pending), `core_calendar_get_action_events_by_timesort` |
| Course List | `core_course_get_courses` (with editing teacher role) |
| Course Editor | `core_course_get_contents`, `local_ugclms_create_activity`, `core_files_upload` |
| Grading Queue | `mod_assign_get_submissions`, `mod_quiz_get_user_attempts` |
| Assignment Grading | `mod_assign_get_submission_status`, `mod_assign_save_grade`, `core_grading_get_definitions` |
| Quiz Review | `mod_quiz_get_attempt_review`, `mod_quiz_process_attempt` |
| Rubric Manager | `core_grading_save_definitions`, `core_grading_get_definitions` |
| Question Bank | `core_question_*`, custom plugin |
| Attendance Sessions | `mod_attendance_get_sessions`, `mod_attendance_add_session` |
| Attendance Marking | `mod_attendance_update_user_status`, `mod_attendance_get_session` |
| Student Overview | `core_enrol_get_enrolled_users`, `core_completion_get_activities_completion_status` |
| Student Detail | `gradereport_user_get_grade_items`, `local_ugclms_get_engagement_score` |
| Forum Moderation | `mod_forum_*`, `mod_forum_set_pin_state`, `mod_forum_delete_post` |
| Session Scheduler | Zoom API + `core_calendar_create_calendar_events` |
| Session Conductor | Zoom SDK (embedded) + `mod_attendance_update_user_status` |
| Calendar | `core_calendar_get_calendar_monthly_view` |
| Announcements | `mod_forum_add_discussion` (announcement forum) |

### Admin Screens → Moodle API

| Screen | Primary APIs |
|--------|-------------|
| Dashboard | `core_user_get_users` (counts), `local_ugclms_get_aggregated_reports` |
| User Directory | `core_user_get_users`, `core_user_search_identity` |
| User Editor | `core_user_create_users`, `core_user_update_users`, `core_role_assign_roles` |
| Faculty Management | `core_user_get_users` (role filter), `core_enrol_get_enrolled_users` |
| Programme Directory | `core_course_get_categories`, `local_ugclms_get_programme_structure` |
| Programme Editor | `core_course_create_categories`, `local_ugclms_get_programme_structure` |
| Course Setup | `core_course_create_courses`, `core_course_update_courses` |
| Batch Enrolment | `core_user_create_users`, `enrol_manual_enrol_users`, `core_cohort_*` |
| Cohort Manager | `core_cohort_*` |
| Exam Calendar | `local_ugclms_manage_exam_config` |
| Exam Config | `mod_quiz_*`, Elumina API, `local_ugclms_manage_exam_config` |
| Exam Centres | `local_ugclms_manage_exam_config` |
| Results Processing | `core_grades_update_grades`, `local_ugclms_generate_certificate` |
| Reports (all 4) | `local_ugclms_get_aggregated_reports`, `gradereport_*`, `core_completion_*` |
| CIQA Dashboard | `local_ugclms_get_compliance_report` |
| Feedback Manager | `mod_feedback_*` |
| Grievance Queue/Detail | `local_ugclms_manage_grievances` |
| Announcements | `mod_forum_add_discussion` |
| Settings | `local_ugclms_*` (custom config) |
| Mandatory Disclosures | `local_ugclms_get_compliance_report` |

---

## Key Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Moodle API gaps (no activity creation) | Can't build Course Editor fully | Build `local_ugclms` plugin early; use template courses |
| No real-time push from Moodle | Notifications delayed | Poll every 30s for critical events; consider Redis pub/sub bridge |
| Elumina integration complexity | Proctored exams blocked | Get Elumina API docs early; build integration in parallel |
| 74 screens is a lot of frontend | Timeline risk | Maximize shared components; build generic DataTable/Form/Chart once |
| UGC regulation changes | Requirements shift | Build configurable rules (engagement weights, thresholds) not hardcoded |
| Moodle performance as headless | API response times | Implement Redis caching layer in Next.js API routes |
| Zoom SDK web compatibility | Live sessions may have issues | Test early with actual Zoom license; fallback to meeting links |
