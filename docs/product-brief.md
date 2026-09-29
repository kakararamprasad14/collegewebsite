# Product Brief: Student-First College Digital Hub

## 1. Executive Summary & Vision

Traditional college websites are institutional brochures designed for prospective parents, accreditors, and donors—not for enrolled students. When enrolled students visit, they encounter cluttered mega-menus, unorganized PDF dumps, outdated faculty listings, and buried exam timetables. As a consequence, students abandon the official portal in favor of informal WhatsApp or Telegram groups, where misinformation spreads and critical academic deadlines are missed.

The **Student-First College Digital Hub** reimagines the college web experience as a personalized, high-utility, daily digital companion. Built around the core daily cadence of college life—timetables, urgent circulars, exam schedules, results, and administrative requests—the hub reduces the cognitive burden on students and delivers essential information within seconds on any device, especially mobile.

---

## 2. Target Persona

### Primary Persona: Rohan
- **Profile:** 2nd-Year Undergraduate, Computer Science & Engineering (Semester IV).
- **Device Context:** 85% mobile (smartphone on spotty campus Wi-Fi or cellular data), 15% laptop (in labs or during study sessions).
- **Behavioral Context:**
  - Visits in bursts: between lectures, standing outside exam halls, traveling on public transit, or late at night before deadline cut-offs.
  - Has low patience for multi-level nested menus or pages requiring pinch-to-zoom to read scanned circular PDFs.
  - Needs unambiguous answers: *"Is tomorrow an odd or even schedule?", "When is the CS402 exam?", "Where is the seating arrangement?", "Did my fee payment clear?"*
- **Frustrations with Existing Site:**
  - Critical circulars buried under 5 levels of administrative bureaucracy (Home > Administration > Registrar > Notifications > 2026).
  - Exam timetables posted as non-responsive 2MB images or unsearchable photocopied PDFs.
  - Missing notification tiering: An urgent holiday notice looks identical to a procurement tender for lab equipment.
  - Lack of a unified search that indexes academic dates, notices, and faculty contacts.

---

## 3. Core Problem Statement

> **How might we make important college information faster to find, easier to understand, mobile-friendly, and useful enough that students return to the website regularly?**

### Root Causes of Failure in Legacy College Portals
1. **Audience Conflict:** One website attempts to serve prospective students, research scholars, alumni, faculty, university auditors, and current students simultaneously without audience segmentation.
2. **Poor Information Scent:** Generic labels such as *"Student Zone"*, *"Campus Life"*, or *"Academic Affairs"* provide weak semantic cues for urgent queries.
3. **Desktop-Centric Assumption:** Dense data tables designed for 1080p monitors that break or overflow horizontally on 375px mobile viewports.
4. **Information Fragmentation:** Exam circulars live under Registrar; results live on an external unlinked server; fees live on an unbranded bank gateway; lecture timetables are distributed via paper noticeboards.

---

## 4. Key Student Jobs-To-Be-Done (JTBD)

| # | Job-To-Be-Done | Student Trigger | Desired Outcome |
|---|---|---|---|
| **JTBD-1** | **Find Latest Notices** | Hears a rumor about a schedule change or holiday. | Read verified, timestamped notice in < 15 seconds; verify authenticity. |
| **JTBD-2** | **Find Exam Timetable** | Mid-term or end-semester exam season approaches. | View subject code, date, reporting time, and room allocation filtered to their specific branch/semester. |
| **JTBD-3** | **Find Class Timetable** | Start of semester or weekly schedule check. | See today's lecture schedule, room number, faculty, and lab batch at a single glance. |
| **JTBD-4** | **Find Results & Academic Standing** | Semester results declared. | Enter roll number / access grades, GPA/CGPA summary, and backlog status cleanly without server crashes. |
| **JTBD-5** | **Check Upcoming Events** | Looking for tech fests, club workshops, hackathons, or sports meets. | Filter events by date, category, and eligibility; add to personal calendar. |
| **JTBD-6** | **Check Deadlines & Milestones** | Assignment submissions, fee dues, exam registration. | Unified countdown ticker showing days remaining and direct action link. |
| **JTBD-7** | **Access Student Services** | Needs bonafide certificate, hall ticket, transcript, or IT support. | Trackable digital service request form replacing physical trips to the admin office. |
| **JTBD-8** | **Search College Information** | Needs a specific faculty cabin, syllabus syllabus copy, or library rule. | Fast omni-search with instant results and keyboard / tap navigation. |

---

## 5. Scope & Functional Boundaries

### In Scope for Initial Release & Shell Architecture
1. **Glanceable Student Dashboard (Home):**
   - Active academic alert ticker (urgent circulars pinned).
   - "Today at a Glance" widget (current day's schedule & upcoming class).
   - Quick Action Grid (Exam Timetable, Results, Fees, Hall Ticket, Services).
   - High-priority deadline tracker.
2. **Dedicated Information Hubs:**
   - **Notices:** Tagged by department, exam, urgent, general; search & category filter.
   - **Academics:** Timetables, syllabus reference, attendance overview, academic calendar.
   - **Exams:** Timetable view with branch/semester selector, hall ticket download, results portal access.
   - **Campus:** Interactive campus map overview, event listings, facility timings (Library, Labs, Gym).
   - **Student Services:** Digital service catalog (Bonafide, Fee Receipt, Hall Ticket, Grievance Redressal).
   - **Search:** Universal instant search overlay / modal with categorized matching.
   - **Profile:** Student badge, enrolled branch/semester, saved circulars, notification preferences.
3. **Responsive Mobile Shell:**
   - Ergonomic bottom navigation for mobile viewports.
   - Persistent top utility bar with institution branding, search shortcut, and alert bell.
   - Side navigation drawer for desktop and expanded tablet viewports.

### Out of Scope (Guarded for Future Phases)
- Complex payment gateway integrations (mocked with clear status feedback).
- Full enterprise ERP database sync (clean modular mock data contracts provided).
- Native iOS/Android app wrappers (web application built to PWA-readiness standards).

---

## 6. Constraints & Technical Foundation
- **No External Bloat:** High performance, vanilla CSS custom properties, zero unneeded heavy framework runtimes.
- **Accessibility:** Strict adherence to WCAG 2.2 Level AA.
- **Offline / Low-Bandwidth Consideration:** Minimal payload size, high contrast, readable system font fallbacks.
- **Progressive Enhancement:** Works instantly across modern mobile and desktop browsers with clean client-side routing.
