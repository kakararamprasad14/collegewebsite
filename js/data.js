/**
 * Student Hub Domain Data Layer - Comprehensive Academic Model
 * Authentic college dataset for Rohan Sharma (2nd Year B.Tech CSE, Semester IV)
 */

export const studentData = {
  profile: {
    name: "Rohan Sharma",
    rollNumber: "1MS22CS084",
    program: "B.Tech Computer Science & Engineering",
    branchCode: "CSE",
    department: "Department of Computer Science & Engineering",
    year: "2nd Year",
    semester: "Semester IV (Section B)",
    academicYear: "2025 - 2026",
    admissionBatch: "2023 - 2027",
    cgpa: "8.64",
    creditsEarned: 78,
    advisor: "Dr. K. S. Venkatesh (Dept of CSE)",
    advisorEmail: "venkatesh.ks@msrit.edu",
    advisorCabin: "Cabin 208, Academic Block A",
    emergencyContact: "+91 (080) 2360-1234 (Campus Security & Medical)",
    preferences: {
      defaultLanding: "home",
      theme: "light",
      emailDigest: true,
      urgentSms: true,
      examAlerts: true,
      clubUpdates: false
    }
  },

  urgentAlert: {
    id: "alert-01",
    tag: "URGENT",
    title: "Heavy Rainfall Alert & Rescheduling of Laboratory Sessions",
    description: "In accordance with district advisory, all practical laboratory batches scheduled post 2:00 PM today (Wednesday) stand postponed. Revised practical schedule will be posted by 6:00 PM. Morning theory lectures remain unaffected.",
    timestamp: "Updated 42 mins ago",
    authority: "Office of the Dean (Academic Administration)",
    verified: true,
    noticeId: "not-01"
  },

  todaySchedule: {
    day: "Wednesday",
    date: "Sep 30, 2026",
    activeClass: {
      status: "NOW IN SESSION",
      code: "CS402",
      name: "Operating Systems & System Programming",
      faculty: "Prof. S. R. Kulkarni",
      room: "Room 304 (Academic Block A)",
      time: "09:00 AM - 10:00 AM",
      progress: 65
    },
    upcomingClasses: [
      {
        code: "CS401",
        name: "Design & Analysis of Algorithms",
        faculty: "Dr. Ananya Ray",
        room: "Room 304 (Block A)",
        time: "10:00 AM - 11:00 AM"
      },
      {
        code: "CS403",
        name: "Database Management Systems",
        faculty: "Prof. M. H. Prasad",
        room: "Room 312 (Block A)",
        time: "11:15 AM - 12:15 PM"
      },
      {
        code: "CS408",
        name: "Database Systems Lab (Batch B1)",
        faculty: "Prof. Prasad & Lab Staff",
        room: "Computing Lab 3 (Ground Floor)",
        time: "02:00 PM - 04:00 PM",
        note: "Postponed per Weather Advisory"
      }
    ]
  },

  priorities: [
    {
      id: "prio-1",
      title: "Pay Semester IV Examination Fee (₹ 2,400)",
      due: "Due in 3 days (Oct 3, 5:00 PM)",
      urgency: "urgent",
      type: "Fee Due",
      actionText: "Pay Online",
      route: "services/fees"
    },
    {
      id: "prio-2",
      title: "Download Mid-Term (MSE-II) Admit Card",
      due: "Exams begin Oct 12",
      urgency: "important",
      type: "Examination",
      actionText: "Get Hall Ticket",
      route: "exams/hallticket"
    },
    {
      id: "prio-3",
      title: "Submit CS409 Mini-Project Team Selection",
      due: "Deadline: Oct 5",
      urgency: "academic",
      type: "Academics",
      actionText: "View Circular",
      route: "notices/not-03"
    }
  ],

  deadlines: [
    {
      id: "dl-1",
      title: "Semester Examination Fee Payment",
      course: "Office of Controller of Examinations",
      amount: "₹ 2,400",
      due: "Due in 3 days (Oct 3, 5:00 PM)",
      status: "urgent",
      actionText: "Pay Online",
      serviceRoute: "services"
    },
    {
      id: "dl-2",
      title: "Algorithms Programming Assignment 2",
      course: "CS401 - Dr. Ananya Ray",
      due: "Due in 5 days (Oct 5, 11:59 PM)",
      status: "warning",
      actionText: "View Brief",
      serviceRoute: "academics"
    },
    {
      id: "dl-3",
      title: "Course Feedback & Teaching Quality Survey",
      course: "Internal Quality Assurance Cell (IQAC)",
      due: "Due in 8 days (Oct 8)",
      status: "warning",
      actionText: "Fill Survey",
      serviceRoute: "services"
    },
    {
      id: "dl-4",
      title: "Mini-Project Problem Statement Submission",
      course: "Dept of Computer Science & Engineering",
      due: "Due in 10 days (Oct 10)",
      status: "upcoming",
      actionText: "Guide List",
      serviceRoute: "notices"
    }
  ],

  notices: [
    {
      id: "not-01",
      status: "IMPORTANT",
      category: "urgent",
      categoryLabel: "URGENT NOTICE",
      date: "Sep 30, 2026",
      isoDate: "2026-09-30",
      unread: true,
      department: "Office of the Dean (Academic Administration)",
      refNo: "COE/2026/089",
      headline: "Rescheduling of Post-2:00 PM Laboratory Sessions Due to Rain",
      snippet: "All afternoon practical exams and lab sessions for 2nd and 3rd year students are postponed. Morning theoretical lectures remain as per timetable.",
      content: `
        <p>In view of the continuous heavy downpour across the city and the subsequent advisory issued by the District Disaster Management Authority, the college administration has resolved to suspend all afternoon practical sessions and laboratory classes scheduled post 2:00 PM today (Wednesday, September 30, 2026).</p>
        
        <h4>Key Operational Directives:</h4>
        <ul>
          <li><strong>Morning Sessions:</strong> All theory lectures and morning lab sessions ending before 1:30 PM remain regular and uninterrupted.</li>
          <li><strong>Afternoon Lab Batches (2:00 PM - 5:00 PM):</strong> Stand postponed for B.Tech Semester IV and Semester VI. Specific makeup dates will be announced by respective departmental heads.</li>
          <li><strong>Hostel & Mess Operations:</strong> Campus mess facilities and health centers will function normally without change in timings.</li>
          <li><strong>College Buses:</strong> Transport services will depart 45 minutes earlier in the evening at 4:30 PM to facilitate safe transit for day scholars.</li>
        </ul>

        <p>Students are strongly advised to exercise caution and avoid unverified rumors on social messaging channels. For official clarifications, contact your respective faculty mentors or call the Student Welfare desk at extension 144.</p>
      `,
      attachment: "Circular_Rain_Advisory_Sep30.pdf",
      attachmentSize: "124 KB",
      authority: "Prof. S. N. Murthy, Dean (Academic Administration)",
      readTime: "2 min read",
      relatedNoticeIds: ["not-02", "not-03"]
    },
    {
      id: "not-02",
      status: "NEW",
      category: "exam",
      categoryLabel: "EXAMINATION",
      date: "Sep 28, 2026",
      isoDate: "2026-09-28",
      unread: true,
      department: "Office of Controller of Examinations",
      refNo: "COE/EXAM/SEM4-MSE2",
      headline: "Mid-Term Assessment (MSE-II) Timetable & Hall Allocations Published",
      snippet: "The second mid-semester assessment timetable for B.Tech Semester IV is now officially notified. Tests commence from October 12, 2026. Hall tickets available for download.",
      content: `
        <p>The Controller of Examinations hereby notifies that the Second Mid-Semester Examination (MSE-II) for all undergraduate B.Tech Semester IV students will commence from Monday, October 12, 2026, as per the approved Academic Almanac.</p>
        
        <h4>General Instructions for Candidates:</h4>
        <ul>
          <li><strong>Session Timings:</strong> Morning Session commences strictly at 09:30 AM and concludes at 12:30 PM. Candidates must report at their assigned examination hall 20 minutes prior.</li>
          <li><strong>Mandatory Documentation:</strong> Candidates must carry their College ID Card and authenticated Digital Hall Ticket. Entry without valid admit card will not be permitted.</li>
          <li><strong>Prohibited Items:</strong> Mobile phones, smartwatches, programmable calculators, and unauthorized printed matter are strictly prohibited inside the examination hall.</li>
          <li><strong>Seating Arrangements:</strong> Hall allocations and desk numbers have been mapped to Student USNs. Please verify your exact room in the Exams hub.</li>
        </ul>

        <p>Any discrepancies regarding subject codes or clashes should be brought to the notice of the Assistant Controller of Examinations on or before October 5, 2026.</p>
      `,
      attachment: "BTech_Sem4_MSE2_Timetable.pdf",
      attachmentSize: "450 KB",
      authority: "Dr. R. V. Chalam, Controller of Examinations",
      readTime: "3 min read",
      relatedNoticeIds: ["not-01"]
    },
    {
      id: "not-03",
      status: "UPDATED",
      category: "academic",
      categoryLabel: "ACADEMICS",
      date: "Sep 26, 2026",
      isoDate: "2026-09-26",
      unread: false,
      department: "Department of Computer Science & Engineering",
      refNo: "DEPT/CSE/2026/41",
      headline: "Mini-Project Problem Statements & Faculty Guide Allotment for 4th Sem CSE",
      snippet: "Students of 4th Semester CSE must finalize their project teams (max 3 students) and submit topic selections to their respective faculty guides by October 10.",
      content: `
        <p>As part of the curriculum requirements for the B.Tech Degree in Computer Science & Engineering, all students currently in Semester IV (Sections A, B, and C) are required to complete a Capstone Mini-Project carrying 2 academic credits.</p>
        
        <h4>Submission Timeline & Milestones:</h4>
        <ul>
          <li><strong>Team Formation:</strong> Teams of 2 to 3 students from within the same section must be registered via the student portal by October 5, 2026.</li>
          <li><strong>Domain Areas:</strong> Approved domains include Distributed Systems, Cloud Computing, Edge AI, Cryptography & Blockchain, Web & Mobile Systems, and Database Optimizations.</li>
          <li><strong>Guide Approval:</strong> Faculty guides will review submitted 2-page synopses and grant approvals between October 7 and October 10, 2026.</li>
          <li><strong>Phase 1 Evaluation:</strong> Architecture design and preliminary literature review evaluation is slated for November 14, 2026.</li>
        </ul>

        <p>Refer to the attached rubric for detailed marking schemes and documentation templates.</p>
      `,
      attachment: "MiniProject_Guidelines_Sem4_CSE.pdf",
      attachmentSize: "210 KB",
      authority: "Dr. Meenakshi Sundaram, Head of Department (CSE)",
      readTime: "2 min read",
      relatedNoticeIds: ["not-04"]
    },
    {
      id: "not-04",
      status: "NEW",
      category: "placement",
      categoryLabel: "PLACEMENTS",
      date: "Sep 24, 2026",
      isoDate: "2026-09-24",
      unread: false,
      department: "Training & Placement Cell",
      refNo: "TPO/INT/2026/18",
      headline: "Summer Internship Drive 2027: Microsoft & Cisco Registration Open",
      snippet: "Pre-final and eligible second-year students with CGPA >= 8.0 may register for the early software engineering internship screening round.",
      content: `
        <p>The Department of Training & Placement is pleased to announce the commencement of the Summer 2027 Internship Recruitment Process with premier industry partners Microsoft and Cisco Systems.</p>
        
        <h4>Eligibility Matrix:</h4>
        <ul>
          <li><strong>Degree Programs:</strong> B.Tech in CSE, ISE, AIML, and ECE (Graduating batch of 2027).</li>
          <li><strong>Academic Threshold:</strong> Minimum cumulative CGPA of 8.00 with zero standing active backlogs.</li>
          <li><strong>Selection Format:</strong> Round 1 consists of online Data Structures & Algorithms coding challenge, followed by technical interviews.</li>
          <li><strong>Registration Deadline:</strong> Eligible candidates must apply via the Placement Portal before October 4, 2026, 11:59 PM.</li>
        </ul>
      `,
      attachment: "Internship_Eligibility_Criteria_2027.pdf",
      attachmentSize: "320 KB",
      authority: "Prof. Savitha Rani, Chief Placement Officer",
      readTime: "2 min read",
      relatedNoticeIds: ["not-03"]
    },
    {
      id: "not-05",
      status: "ARCHIVED",
      category: "campus",
      categoryLabel: "CAMPUS LIFE",
      date: "Sep 22, 2026",
      isoDate: "2026-09-22",
      unread: false,
      department: "Student Welfare Office",
      refNo: "SAC/FEST/2026/04",
      headline: "Inviting Student Volunteers for 'Pratibha 2026' National Tech Fest",
      snippet: "Student Activity Center is conducting open auditions and committee interviews for event leads, web team, and logistics coordinators.",
      content: `
        <p>The annual National Techno-Cultural Symposium 'Pratibha 2026' will be hosted on campus from November 20 to November 22, 2026. The Central Organizing Committee invites enthusiastic student volunteers across all years and branches.</p>
        
        <h4>Open Volunteer Committees:</h4>
        <ul>
          <li>Technical Events & Hackathons Committee</li>
          <li>Web Development, Portal & App Team</li>
          <li>Sponsorship, Corporate Outreach & Finance</li>
          <li>Hospitality, Guest Relations & Campus Logistics</li>
        </ul>
        <p>Interview rounds will be held at the Student Activity Center on Saturday, October 3, between 10:00 AM and 3:00 PM.</p>
      `,
      attachment: "Fest_Volunteer_Application_Form.pdf",
      attachmentSize: "180 KB",
      authority: "Dr. B. K. Ramanathan, Director of Student Welfare",
      readTime: "1 min read",
      relatedNoticeIds: ["not-01"]
    },
    {
      id: "not-06",
      status: "IMPORTANT",
      category: "exam",
      categoryLabel: "EXAMINATION",
      date: "Sep 20, 2026",
      isoDate: "2026-09-20",
      unread: false,
      department: "Finance & Accounts Office",
      refNo: "FIN/FEE/2026/09",
      headline: "Mandatory Semester Examination Fee Notification for Fall 2026",
      snippet: "Students appearing for Semester IV regular and backlog examinations must clear exam fees of ₹2,400 online before October 3 to avoid late surcharges.",
      content: `
        <p>All candidates enrolled in undergraduate B.Tech Semester IV are hereby notified that the portal for the remittance of the Semester End Examination Fee has been enabled.</p>
        <h4>Important Payment Conditions:</h4>
        <ul>
          <li><strong>Amount Payable:</strong> ₹ 2,400 (Regular theory and practical laboratory papers).</li>
          <li><strong>Due Date:</strong> Remittance without fine: Saturday, October 3, 2026 (5:00 PM).</li>
          <li><strong>Late Fee Provision:</strong> Payments received after October 3 will attract a penal surcharge of ₹ 500 per week.</li>
          <li><strong>Receipt Generation:</strong> Authenticated digital payment receipts are generated immediately and stored in the Student Services hub.</li>
        </ul>
      `,
      attachment: "Exam_Fee_Circular_Fall2026.pdf",
      attachmentSize: "165 KB",
      authority: "Shri. C. M. Chandrashekar, Finance Officer",
      readTime: "2 min read",
      relatedNoticeIds: ["not-02"]
    }
  ],

  weeklyTimetable: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    Wednesday: [
      { time: "09:00 - 10:00 AM", code: "CS402", name: "Operating Systems", faculty: "Prof. S. R. Kulkarni", room: "Room 304", building: "Block A" },
      { time: "10:00 - 11:00 AM", code: "CS401", name: "Design & Analysis of Algorithms", faculty: "Dr. Ananya Ray", room: "Room 304", building: "Block A" },
      { time: "11:15 - 12:15 PM", code: "CS403", name: "Database Management Systems", faculty: "Prof. M. H. Prasad", room: "Room 312", building: "Block A" },
      { time: "01:00 - 02:00 PM", code: "MA401", name: "Discrete Mathematical Structures", faculty: "Dr. Geetha S.", room: "Room 304", building: "Block A" },
      { time: "02:00 - 04:00 PM", code: "CS408", name: "DBMS Laboratory (Batch B1)", faculty: "Prof. Prasad & Team", room: "Computing Lab 3", building: "Ground Floor" }
    ],
    Thursday: [
      { time: "09:00 - 10:00 AM", code: "CS403", name: "Database Management Systems", faculty: "Prof. M. H. Prasad", room: "Room 312", building: "Block A" },
      { time: "10:00 - 11:00 AM", code: "CS404", name: "Theory of Computation", faculty: "Dr. R. K. Hegde", room: "Room 304", building: "Block A" },
      { time: "11:15 - 12:15 PM", code: "CS401", name: "Design & Analysis of Algorithms", faculty: "Dr. Ananya Ray", room: "Room 304", building: "Block A" },
      { time: "01:00 - 02:00 PM", code: "CS402", name: "Operating Systems", faculty: "Prof. S. R. Kulkarni", room: "Room 304", building: "Block A" },
      { time: "02:00 - 04:00 PM", code: "CS407", name: "Algorithms Lab (Batch B1)", faculty: "Dr. Ray & Team", room: "Computing Lab 2", building: "Block B" }
    ],
    Monday: [
      { time: "09:00 - 10:00 AM", code: "MA401", name: "Discrete Mathematical Structures", faculty: "Dr. Geetha S.", room: "Room 304", building: "Block A" },
      { time: "10:00 - 11:00 AM", code: "CS402", name: "Operating Systems", faculty: "Prof. S. R. Kulkarni", room: "Room 304", building: "Block A" },
      { time: "11:15 - 12:15 PM", code: "CS404", name: "Theory of Computation", faculty: "Dr. R. K. Hegde", room: "Room 304", building: "Block A" },
      { time: "02:00 - 03:00 PM", code: "CS403", name: "Database Management Systems", faculty: "Prof. M. H. Prasad", room: "Room 312", building: "Block A" }
    ],
    Tuesday: [
      { time: "09:00 - 10:00 AM", code: "CS401", name: "Design & Analysis of Algorithms", faculty: "Dr. Ananya Ray", room: "Room 304", building: "Block A" },
      { time: "10:00 - 11:00 AM", code: "CS403", name: "Database Management Systems", faculty: "Prof. M. H. Prasad", room: "Room 312", building: "Block A" },
      { time: "11:15 - 12:15 PM", code: "MA401", name: "Discrete Mathematical Structures", faculty: "Dr. Geetha S.", room: "Room 304", building: "Block A" },
      { time: "02:00 - 04:00 PM", code: "CS406", name: "Unix Shell Programming & Tools", faculty: "Prof. Kulkarni", room: "Computing Lab 1", building: "Block B" }
    ],
    Friday: [
      { time: "09:00 - 10:00 AM", code: "CS404", name: "Theory of Computation", faculty: "Dr. R. K. Hegde", room: "Room 304", building: "Block A" },
      { time: "10:00 - 11:00 AM", code: "CS401", name: "Design & Analysis of Algorithms", faculty: "Dr. Ananya Ray", room: "Room 304", building: "Block A" },
      { time: "11:15 - 12:15 PM", code: "CS402", name: "Operating Systems", faculty: "Prof. S. R. Kulkarni", room: "Room 304", building: "Block A" },
      { time: "02:00 - 04:00 PM", code: "CS409", name: "Mini-Project Mentoring Session", faculty: "Assigned Faculty Guides", room: "Seminar Hall 2", building: "Block A" }
    ]
  },

  academicCalendar: [
    { date: "Aug 18, 2026", event: "Commencement of Semester IV Academic Classes", type: "Academic" },
    { date: "Sep 08, 2026", event: "Mid-Term Assessment I (MSE-I) Commences", type: "Examination" },
    { date: "Oct 03, 2026", event: "Last Date for Examination Fee Payment Without Fine", type: "Deadline" },
    { date: "Oct 12 - 21, 2026", event: "Mid-Term Assessment II (MSE-II) Examinations", type: "Examination" },
    { date: "Nov 01, 2026", event: "Kannada Rajyotsava (Campus Holiday)", type: "Holiday" },
    { date: "Nov 16 - 20, 2026", event: "Practical Laboratory End-Semester Examinations", type: "Examination" },
    { date: "Nov 25, 2026", event: "Last Instruction Day & Attendance Closure", type: "Academic" },
    { date: "Dec 01 - 18, 2026", event: "Semester End Theory University Examinations", type: "Examination" }
  ],

  academicResources: [
    {
      code: "CS401",
      title: "Design & Analysis of Algorithms",
      faculty: "Dr. Ananya Ray",
      syllabusPdf: "CS401_Algorithms_Syllabus_2026.pdf",
      lectureNotes: "Algorithms_Lecture_Notes_Modules_1_to_4.pdf (4.2 MB)",
      questionBank: "CS401_Previous_5Years_Solved_Papers.pdf (2.8 MB)",
      labManual: "Algorithms_Design_Lab_Manual_v2.pdf (1.9 MB)"
    },
    {
      code: "CS402",
      title: "Operating Systems & Unix Internals",
      faculty: "Prof. S. R. Kulkarni",
      syllabusPdf: "CS402_OperatingSystems_Syllabus.pdf",
      lectureNotes: "OS_Process_Threads_Memory_Management.pdf (5.1 MB)",
      questionBank: "OS_Question_Bank_Unitwise.pdf (1.6 MB)",
      labManual: "Linux_Kernel_System_Calls_Manual.pdf (2.4 MB)"
    },
    {
      code: "CS403",
      title: "Database Management Systems",
      faculty: "Prof. M. H. Prasad",
      syllabusPdf: "CS403_DBMS_Syllabus.pdf",
      lectureNotes: "Relational_Algebra_SQL_Normalization.pdf (3.7 MB)",
      questionBank: "DBMS_Practice_Problems_Set.pdf (2.1 MB)",
      labManual: "PostgreSQL_PL_SQL_Lab_Manual.pdf (1.8 MB)"
    }
  ],

  departments: [
    {
      id: "cse",
      name: "Computer Science & Engineering",
      code: "CSE",
      hod: "Dr. Meenakshi Sundaram",
      email: "hod.cse@msrit.edu",
      facultyCount: 38,
      studentsEnrolled: 720,
      building: "Academic Block A (Floors 2 - 4)",
      labs: ["AI & High Performance Lab", "Networks & Cloud Lab", "Computing Labs 1 - 4"]
    },
    {
      id: "ise",
      name: "Information Science & Engineering",
      code: "ISE",
      hod: "Dr. Dayananda P.",
      email: "hod.ise@msrit.edu",
      facultyCount: 28,
      studentsEnrolled: 540,
      building: "Academic Block A (Floor 1)",
      labs: ["Data Analytics Lab", "Cybersecurity Lab", "Software Engineering Lab"]
    },
    {
      id: "ece",
      name: "Electronics & Communication Engineering",
      code: "ECE",
      hod: "Dr. B. K. Sujatha",
      email: "hod.ece@msrit.edu",
      facultyCount: 34,
      studentsEnrolled: 680,
      building: "Science & Engineering Block B",
      labs: ["VLSI Design Lab", "Embedded Systems Lab", "DSP & Communication Lab"]
    },
    {
      id: "mech",
      name: "Mechanical Engineering",
      code: "MECH",
      hod: "Dr. Raji George",
      email: "hod.mech@msrit.edu",
      facultyCount: 30,
      studentsEnrolled: 480,
      building: "Mechanical Workshop Complex",
      labs: ["Robotics & Automation Center", "Thermal Engineering Lab", "CAD/CAM Simulation Center"]
    }
  ],

  examSchedule: [
    {
      code: "CS401",
      subject: "Design and Analysis of Algorithms",
      date: "Oct 12, 2026 (Monday)",
      time: "09:30 AM - 12:30 PM",
      room: "Examination Hall 3 (Block B)",
      seatNo: "EH3-Row B-14",
      status: "Scheduled"
    },
    {
      code: "CS402",
      subject: "Operating Systems & Unix Internals",
      date: "Oct 14, 2026 (Wednesday)",
      time: "09:30 AM - 12:30 PM",
      room: "Examination Hall 3 (Block B)",
      seatNo: "EH3-Row B-14",
      status: "Scheduled"
    },
    {
      code: "CS403",
      subject: "Database Management Systems",
      date: "Oct 16, 2026 (Friday)",
      time: "09:30 AM - 12:30 PM",
      room: "Examination Hall 4 (Block B)",
      seatNo: "EH4-Row A-08",
      status: "Scheduled"
    },
    {
      code: "MA401",
      subject: "Discrete Mathematical Structures",
      date: "Oct 19, 2026 (Monday)",
      time: "09:30 AM - 12:30 PM",
      room: "Examination Hall 1 (Main Building)",
      seatNo: "EH1-Row C-22",
      status: "Scheduled"
    },
    {
      code: "CS404",
      subject: "Theory of Computation & Automata",
      date: "Oct 21, 2026 (Wednesday)",
      time: "09:30 AM - 12:30 PM",
      room: "Examination Hall 3 (Block B)",
      seatNo: "EH3-Row B-14",
      status: "Scheduled"
    }
  ],

  resultsSummary: {
    semester: "Semester III (Fall 2025)",
    sgpa: "8.72",
    cgpa: "8.64",
    credits: 22,
    resultStatus: "FIRST CLASS WITH DISTINCTION",
    courses: [
      { code: "CS301", name: "Data Structures & Applications", grade: "O (Outstanding)", credits: 4, marks: 91 },
      { code: "CS302", name: "Object Oriented Programming Java", grade: "A+ (Excellent)", credits: 4, marks: 86 },
      { code: "CS303", name: "Digital Logic & Computer Design", grade: "A+ (Excellent)", credits: 3, marks: 84 },
      { code: "MA301", name: "Fourier Series & Linear Algebra", grade: "A (Very Good)", credits: 4, marks: 79 },
      { code: "CS307", name: "Data Structures Lab", grade: "O (Outstanding)", credits: 2, marks: 95 },
      { code: "CS308", name: "OOP Java Laboratory", grade: "O (Outstanding)", credits: 2, marks: 92 }
    ]
  },

  campusDirectory: {
    facilities: [
      { name: "Central Library & Digital Archives", hours: "08:00 AM - 10:00 PM", location: "Library Complex, Central Quad", status: "Open Now", contact: "Ext. 210" },
      { name: "Central Computing Center", hours: "08:30 AM - 08:00 PM", location: "Ground Floor, Academic Block B", status: "Open Now", contact: "Ext. 240" },
      { name: "Campus Health & Medical Center", hours: "24 Hours (Resident Doctor on Duty)", location: "Next to Student Hostel 2", status: "Open 24/7", contact: "Ext. 100" },
      { name: "Sports Complex & Gymnasium", hours: "06:00 AM - 09:00 AM, 04:30 PM - 08:30 PM", location: "South Campus Pavilion", status: "Opens at 4:30 PM", contact: "Ext. 350" },
      { name: "Main Dining Hall & Food Court", hours: "07:30 AM - 09:30 PM", location: "Block C Dining Plaza", status: "Open Now", contact: "Ext. 400" },
      { name: "Campus Stationery & Reprographics", hours: "09:00 AM - 06:30 PM", location: "Opposite Auditorium", status: "Open Now", contact: "Ext. 180" }
    ],
    upcomingEvents: [
      {
        id: "ev-1",
        title: "Hackathon 'CodeSpark 2026'",
        date: "Oct 24 - 25, 2026",
        venue: "Auditorium & Innovation Hub",
        organizedBy: "ACM Student Chapter",
        tag: "Technical Fest",
        rsvpStatus: "Open",
        description: "24-hour national hackathon focused on sustainable AI, decentralized protocols, and healthcare tech."
      },
      {
        id: "ev-2",
        title: "Guest Lecture: Generative AI in Production",
        date: "Oct 7, 2026 (03:00 PM)",
        venue: "Seminar Hall 1, Block A",
        organizedBy: "Dept of Computer Science",
        tag: "Academic",
        rsvpStatus: "Registered",
        description: "Keynote presentation by Principal Research Scientist at Google DeepMind."
      },
      {
        id: "ev-3",
        title: "Inter-Collegiate Volleyball Tournament",
        date: "Oct 15 - 17, 2026",
        venue: "Outdoor Sports Arena",
        organizedBy: "Sports Council",
        tag: "Sports",
        rsvpStatus: "Open",
        description: "Annual university zonal sports championship featuring teams from 24 engineering colleges."
      }
    ],
    clubs: [
      {
        name: "ACM Student Chapter",
        category: "Technical",
        members: 140,
        lead: "Siddharth Verma (4th Yr CSE)",
        description: "Focuses on competitive programming, algorithmic workshops, open-source projects, and research symposiums.",
        meetingTime: "Every Friday, 4:30 PM (Lab 3)"
      },
      {
        name: "Robotics & Automation Society",
        category: "Hardware & Robotics",
        members: 95,
        lead: "Pooja Hegde (3rd Yr ECE)",
        description: "Builds autonomous ground rovers, drone swarms, and prepares for Robocon India.",
        meetingTime: "Tuesdays & Thursdays, 5:00 PM (Workshop 2)"
      },
      {
        name: "Rotaract Youth Club",
        category: "Social Service",
        members: 180,
        lead: "Aditya Rao (3rd Yr MECH)",
        description: "Community health camps, literacy drives for underprivileged schools, and environmental cleanups.",
        meetingTime: "Saturdays, 11:00 AM (SAC Hall)"
      },
      {
        name: "Literary & Debating Society",
        category: "Cultural",
        members: 75,
        lead: "Nivedita Menon (2nd Yr ISE)",
        description: "Parliamentary debating, Model United Nations, creative writing journals, and annual campus poetry slam.",
        meetingTime: "Wednesdays, 5:00 PM (Auditorium 2)"
      }
    ]
  },

  services: [
    {
      id: "srv-1",
      title: "Bonafide Certificate Request",
      category: "Academic Records",
      turnaround: "1 - 2 Working Days",
      description: "Required for internship applications, passport verification, bank accounts, or external competitions.",
      status: "Available Online"
    },
    {
      id: "srv-2",
      title: "Official Grade Card / Transcript Copy",
      category: "Examination Section",
      turnaround: "3 - 5 Working Days",
      description: "Attested hard-copy transcript or digital verified PDF for higher studies and visa processing.",
      status: "Available Online"
    },
    {
      id: "srv-3",
      title: "Semester Fee Payment & Receipt Download",
      category: "Finance Office",
      turnaround: "Instant E-Receipt",
      description: "Pay tuition/hostel fees online through NetBanking, UPI, or Card and download authenticated receipts.",
      status: "Action Required"
    },
    {
      id: "srv-4",
      title: "Hostel Room Allotment & Mess Card Renewal",
      category: "Campus Logistics",
      turnaround: "2 Working Days",
      description: "Apply for semester room renewal, room-swap requests, or mess rebate during academic breaks.",
      status: "Open"
    },
    {
      id: "srv-5",
      title: "Student Grievance & Facility Helpdesk",
      category: "Student Welfare",
      turnaround: "Within 24 Hours",
      description: "Submit confidential feedback or report issues regarding classrooms, Wi-Fi, lab equipment, or campus hygiene.",
      status: "Active Portal"
    }
  ],

  studentServicesData: {
    fees: {
      tuitionFeeStatus: "PAID IN FULL",
      tuitionReceiptNo: "REC-2026-98124",
      tuitionAmount: "₹ 1,12,000",
      examFeeStatus: "PENDING",
      examFeeAmount: "₹ 2,400",
      examDueDate: "Oct 3, 2026",
      hostelFeeStatus: "PAID",
      hostelReceiptNo: "HOS-2026-4421"
    },
    library: {
      membershipId: "LIB-CS-22-084",
      activeBorrowings: [
        {
          title: "Database System Concepts (7th Edition)",
          author: "Silberschatz, Korth, Sudarshan",
          borrowedDate: "Sep 15, 2026",
          dueDate: "Oct 4, 2026",
          renewable: true,
          callNo: "005.74 SIL"
        },
        {
          title: "Introduction to Algorithms (4th Edition)",
          author: "Cormen, Leiserson, Rivest, Stein",
          borrowedDate: "Sep 20, 2026",
          dueDate: "Oct 12, 2026",
          renewable: true,
          callNo: "005.1 COR"
        }
      ],
      maxAllowance: 4,
      overdueFines: "₹ 0.00"
    },
    transport: {
      passStatus: "ACTIVE",
      routeNumber: "Route 12 (South Express)",
      pickupStop: "Jayanagar 4th Block Metro",
      pickupTime: "07:35 AM",
      returnTime: "05:15 PM",
      busDriverContact: "+91 98450-23912 (Mr. Suresh K.)",
      validUntil: "Dec 31, 2026"
    },
    supportContacts: [
      { role: "Chief Warden (Boys Hostels)", name: "Prof. H. R. Nataraj", phone: "+91 94480-12891", email: "warden.boys@msrit.edu" },
      { role: "Chief Warden (Girls Hostels)", name: "Dr. K. Manjula", phone: "+91 94480-12892", email: "warden.girls@msrit.edu" },
      { role: "Controller of Examinations", name: "Dr. R. V. Chalam", phone: "+91 (080) 2360-6934", email: "coe@msrit.edu" },
      { role: "Dean of Student Welfare", name: "Dr. B. K. Ramanathan", phone: "+91 (080) 2360-1440", email: "studentwelfare@msrit.edu" },
      { role: "Campus IT & Wi-Fi Helpdesk", name: "System Admin Desk", phone: "+91 (080) 2360-2200", email: "ithelpdesk@msrit.edu" }
    ]
  }
};

/**
 * Load student profile preferences from localStorage if present
 */
export function loadPersistedPreferences() {
  try {
    if (typeof localStorage !== "undefined") {
      const saved = localStorage.getItem("student_profile_prefs");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.year) studentData.profile.year = parsed.year;
        if (parsed.program) studentData.profile.program = parsed.program;
        if (parsed.department) studentData.profile.department = parsed.department;
        if (parsed.branchCode) studentData.profile.branchCode = parsed.branchCode;
        if (parsed.semester) studentData.profile.semester = parsed.semester;
        if (parsed.preferences) {
          studentData.profile.preferences = {
            ...studentData.profile.preferences,
            ...parsed.preferences
          };
        }
      }
    }
  } catch (e) {
    console.warn("Could not load persisted preferences", e);
  }
}

/**
 * Save current student profile preferences to localStorage
 */
export function savePersistedPreferences(updated) {
  try {
    if (typeof localStorage !== "undefined") {
      if (updated.year) studentData.profile.year = updated.year;
      if (updated.program) studentData.profile.program = updated.program;
      if (updated.department) studentData.profile.department = updated.department;
      if (updated.branchCode) studentData.profile.branchCode = updated.branchCode;
      if (updated.semester) studentData.profile.semester = updated.semester;
      if (updated.preferences) {
        studentData.profile.preferences = {
          ...studentData.profile.preferences,
          ...updated.preferences
        };
      }
      localStorage.setItem("student_profile_prefs", JSON.stringify({
        year: studentData.profile.year,
        program: studentData.profile.program,
        department: studentData.profile.department,
        branchCode: studentData.profile.branchCode,
        semester: studentData.profile.semester,
        preferences: studentData.profile.preferences
      }));
    }
  } catch (e) {
    console.warn("Could not save persisted preferences", e);
  }
}

// Automatically load on module evaluation
loadPersistedPreferences();
