// Mock participant and staff data for UDGAM'27 Campus Ambassador Portal
export const mockUsers = {
  ambassador: {
    id: "user-amb-1",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    username: "rahul123",
    role: "ambassador",
    roleTitle: "Campus Ambassador",
    college: "NIT Silchar",
    initials: "RS",
    caId: "UDGAM27-CA-1042",
    phone: "+91 98765 43210",
    state: "Assam",
    department: "Computer Science & Engineering",
    year: "3rd Year, B.Tech",
    joinedDate: "October 10, 2026",
    badges: ["Early Adopter", "Community Builder", "Promoter Star"],
    permissions: ["view_assigned_tasks", "submit_tasks", "view_public_leaderboard"]
  },
  manager: {
    id: "user-mgr-1",
    name: "Pooja Verma",
    email: "pooja.verma@ecell-iitg.org",
    username: "manager",
    role: "manager",
    roleTitle: "CA Task Review Manager",
    college: "E-Cell, IIT Guwahati",
    initials: "PV",
    phone: "+91 98112 34567",
    department: "CA Operations & Outreach",
    joinedDate: "August 15, 2026",
    badges: ["Core Evaluator", "Outreach Lead"],
    permissions: [
      "view_all_tasks", 
      "grade_tasks", 
      "review_submissions",
      "add_feedback"
    ]
  },
  admin: {
    id: "user-adm-1",
    name: "Aman Singhania",
    email: "aman.singhania@ecell-iitg.org",
    username: "admin",
    role: "admin",
    roleTitle: "Head of Operations & Lead Admin",
    college: "E-Cell, IIT Guwahati",
    initials: "AS",
    phone: "+91 98760 12345",
    department: "Executive Board, E-Cell IIT Guwahati",
    joinedDate: "May 01, 2026",
    badges: ["Super Admin", "Operations Head", "Summit Convener"],
    permissions: [
      "full_access", 
      "add_tasks", 
      "edit_task_points", 
      "view_all_rankings", 
      "grade_tasks", 
      "manage_ambassadors",
      "export_reports"
    ]
  }
};

export const initialUser = mockUsers.ambassador;

// 12 Realistic Tasks with diverse submission formats
export const initialTasks = [
  {
    id: "task-1",
    title: "Share UDGAM'27 registration announcement in college WhatsApp groups",
    shortDescription: "Disseminate the official registration poster and link across active batch and college group chats.",
    detailedDescription: "Spread the word about UDGAM'27, the flagship entrepreneurship summit of IIT Guwahati. Share the official announcement poster, message, and registration link in at least 3 major college WhatsApp or Telegram communities.",
    instructions: [
      "Download the official promotional message and graphics from the CA resource drive.",
      "Share the announcement in at least 3 distinct student groups (batch groups, club groups, or college notice boards).",
      "Take screenshots of the messages showing engagement or timestamp.",
      "Upload the screenshot to Google Drive or Imgur and provide the accessible link below."
    ],
    submissionRequirements: "Publicly accessible link (Google Drive, Imgur, or direct post URL) displaying proof of sharing in WhatsApp/Telegram groups.",
    submissionType: "link",
    placeholderText: "https://drive.google.com/drive/folders/...",
    assignedDate: "Oct 15, 2026",
    deadline: "Oct 22, 2026",
    status: "completed",
    submittedDate: "Oct 20, 2026",
    points: 100,
    submissionData: {
      link: "https://drive.google.com/drive/folders/udgam-nit-silchar-proofs-1"
    }
  },
  {
    id: "task-2",
    title: "Publish a UDGAM'27 promotional story on Instagram",
    shortDescription: "Post the official UDGAM'27 poster as a story, tag @ecell_iitg, and add the event link.",
    detailedDescription: "Create visibility for the summit on your social media. Post the summit teaser story on your personal or college society Instagram handle, tagging @ecell_iitg and adding the official registration link sticker.",
    instructions: [
      "Use the official high-resolution story template from the media kit.",
      "Tag @ecell_iitg and use hashtag #UDGAM27 #ECellIITG.",
      "Add the link sticker pointing to udgam.ecell-iitg.org.",
      "Keep the story active for at least 24 hours.",
      "Submit the public link to your story, profile highlight, or screenshot drive link."
    ],
    submissionRequirements: "Instagram story highlight URL or Google Drive link containing screenshots with view counts.",
    submissionType: "link",
    placeholderText: "https://instagram.com/stories/highlights/...",
    assignedDate: "Oct 18, 2026",
    deadline: "Oct 25, 2026",
    status: "completed",
    submittedDate: "Oct 23, 2026",
    points: 120,
    submissionData: {
      link: "https://instagram.com/s/aGlnaGxpZ2h0OjE3OTIxNDg3NTEx?story_media_id=1"
    }
  },
  {
    id: "task-3",
    title: "Prepare and submit a campus outreach report",
    shortDescription: "Compile an initial report detailing student outreach channels, reach metrics, and club alignments.",
    detailedDescription: "Draft a comprehensive campus outreach report highlighting your initial campaign strategies at NIT Silchar. Outline student body demographics, faculty approvals obtained, and anticipated participation numbers.",
    instructions: [
      "Utilize the official E-Cell outreach report template.",
      "Document key statistics: total student reach, departments contacted, and club partnerships.",
      "Include a brief roadmap of upcoming promotional initiatives.",
      "Export your completed report as a PDF document (Max 15MB) and upload below."
    ],
    submissionRequirements: "Single compiled PDF document detailing outreach strategy and campaign metrics.",
    submissionType: "file",
    acceptedFormats: ".pdf",
    assignedDate: "Oct 22, 2026",
    deadline: "Oct 30, 2026",
    status: "completed",
    submittedDate: "Oct 28, 2026",
    points: 200,
    submissionData: {
      fileName: "NIT_Silchar_UDGAM27_Outreach_Report_V1.pdf",
      fileSize: "2.4 MB"
    }
  },
  {
    id: "task-4",
    title: "Share UDGAM'27 poster across college communities",
    shortDescription: "Distribute physical or digital posters on central campus boards and student lounges.",
    detailedDescription: "Ensure high physical and digital visibility of UDGAM'27 posters across prominent college notice boards, hostel common rooms, library bulletin areas, or departmental Discord channels.",
    instructions: [
      "Print or digitally circulate official A3 posters provided in the CA package.",
      "Place posters in at least 4 designated high-traffic locations.",
      "Take geotagged or clear photographic proof of the posters pinned on notice boards.",
      "Upload image files or a compiled image document."
    ],
    submissionRequirements: "High resolution image file (PNG, JPG) or PDF showing posters displayed on campus notice boards.",
    submissionType: "file",
    acceptedFormats: ".pdf,.png,.jpg,.jpeg",
    assignedDate: "Oct 26, 2026",
    deadline: "Nov 02, 2026",
    status: "completed",
    submittedDate: "Nov 01, 2026",
    points: 150,
    submissionData: {
      fileName: "Campus_Poster_Display_NIT_Silchar.jpg",
      fileSize: "4.1 MB"
    }
  },
  {
    id: "task-5",
    title: "Identify entrepreneurship clubs in your college",
    shortDescription: "Catalog existing innovation and entrepreneurship clubs, their coordinators, and contact details.",
    detailedDescription: "Conduct thorough mapping of all innovation, startup, incubation, and entrepreneurial cells active within your institution. We will contact them for co-branded workshops and event partnerships.",
    instructions: [
      "Identify the official names of E-Cells, incubation centres, or innovation clubs on campus.",
      "List faculty in-charge and student president/convenor contact details (Email, Phone, LinkedIn).",
      "Summarize their active member strength and standard annual event calendar.",
      "Type or paste your structured catalog directly in the text response area."
    ],
    submissionRequirements: "Well-structured written response covering club names, faculty advisors, student convenors, and phone/email contacts.",
    submissionType: "text",
    placeholderText: "1. E-Cell NIT Silchar:\n- President: [Name], Contact: [Phone/Email]\n- Faculty Advisor: Prof. [Name]\n...",
    assignedDate: "Oct 28, 2026",
    deadline: "Nov 04, 2026",
    status: "completed",
    submittedDate: "Nov 03, 2026",
    points: 100,
    submissionData: {
      text: "1. E-Cell NIT Silchar (Official):\n- Faculty Advisor: Dr. A. K. Baruah (akbaruah@ece.nits.ac.in)\n- Student Convenor: Ritesh Sen (+91 94351 22849, ritesh.sen@gmail.com)\n- Member Strength: ~85 active student members\n- Major Event: E-Summit Silchar (March)\n\n2. Innovation & Incubation Cell (IIC NIT Silchar):\n- Head: Prof. S. Dey\n- Secretary: Vikram Das (+91 88764 12390)\n- Focus: Patent filings and prototype funding"
    }
  },
  {
    id: "task-6",
    title: "Organize a campus promotional activity",
    shortDescription: "Host a flash quiz, booth, or kiosk on campus introducing UDGAM'27 competitions and cash prizes.",
    detailedDescription: "Conduct an interactive on-ground activation on campus. Set up an information desk during lunch hours or a mini-quiz around famous Indian startups to generate excitement and distribute UDGAM flyer handouts.",
    instructions: [
      "Obtain required permissions from the student affairs council or hostel warden.",
      "Organize an engaging kiosk or 15-minute interactive quiz session.",
      "Take 3-5 photographs showing participant attendance and interaction.",
      "Compile a 1-2 page event summary with photos into a PDF and upload below."
    ],
    submissionRequirements: "PDF summary report including event photos, total attendees, and brief outcome summary.",
    submissionType: "file",
    acceptedFormats: ".pdf",
    assignedDate: "Oct 30, 2026",
    deadline: "Nov 06, 2026",
    status: "completed",
    submittedDate: "Nov 05, 2026",
    points: 250,
    submissionData: {
      fileName: "UDGAM27_Promotional_Kiosk_Report_NITS.pdf",
      fileSize: "5.8 MB"
    }
  },
  {
    id: "task-7",
    title: "Create a list of potential participants",
    shortDescription: "Collate a verified roster of students interested in pitching, case study events, and hackathons.",
    detailedDescription: "Gather contact details of aspiring student founders, coders, and business minds from your college who are keen to participate in flagship events like Disrupters, PMx, and HackInNorthEast at UDGAM'27.",
    instructions: [
      "Circulate an internal Google Form or connect with department batch representatives.",
      "Collect: Name, Department, Year, Preferred Event Category, and Email.",
      "Ensure minimum 25 verified leads are recorded.",
      "Export and upload as Excel (.xlsx), CSV, or PDF spreadsheet."
    ],
    submissionRequirements: "Spreadsheet (.xlsx, .csv) or compiled PDF containing at least 25 student participant leads.",
    submissionType: "file",
    acceptedFormats: ".xlsx,.csv,.pdf",
    assignedDate: "Nov 02, 2026",
    deadline: "Nov 09, 2026",
    status: "completed",
    submittedDate: "Nov 08, 2026",
    points: 180,
    submissionData: {
      fileName: "UDGAM27_Potential_Participants_NIT_Silchar.xlsx",
      fileSize: "84 KB"
    }
  },
  {
    id: "task-8",
    title: "Promote UDGAM'27 through LinkedIn",
    shortDescription: "Author a professional LinkedIn article or post detailing UDGAM'27 speaker sessions and networking.",
    detailedDescription: "Amplify UDGAM'27 on professional networks. Write a thoughtful post highlighting the marquee speakers, workshops, venture capital exposure, and how it empowers student entrepreneurs.",
    instructions: [
      "Craft a 150-250 word professional post highlighting UDGAM'27 and E-Cell IIT Guwahati.",
      "Mention your role as Campus Ambassador.",
      "Tag official pages: @E-Cell IIT Guwahati and @UDGAM IITG.",
      "Include hashtags: #Entrepreneurship #IITGuwahati #UDGAM27 #CampusAmbassador.",
      "Paste your published post URL below."
    ],
    submissionRequirements: "Direct URL of the live LinkedIn post.",
    submissionType: "link",
    placeholderText: "https://www.linkedin.com/posts/rahul-sharma-...",
    assignedDate: "Nov 05, 2026",
    deadline: "Nov 15, 2026",
    status: "pending",
    points: 150
  },
  {
    id: "task-9",
    title: "Conduct a classroom announcement",
    shortDescription: "Visit 3+ classrooms or lecture halls to deliver a 2-minute elevator pitch about UDGAM'27.",
    detailedDescription: "Pitch the summit directly to students before or after lectures. Highlight the ₹10 Lakh+ prize pool, internship opportunities, mentorship sessions, and certification benefits.",
    instructions: [
      "Coordinate with professors or student representatives to secure a 2-minute window.",
      "Deliver the elevator pitch covering dates, venues, key events, and registration perks.",
      "Have a peer take a clear photo of you speaking at the podium with the class visible.",
      "Upload classroom announcement photos or compiled PDF document."
    ],
    submissionRequirements: "Classroom presentation photo proof (PNG, JPG, or PDF).",
    submissionType: "file",
    acceptedFormats: ".pdf,.png,.jpg,.jpeg",
    assignedDate: "Nov 07, 2026",
    deadline: "Nov 18, 2026",
    status: "pending",
    points: 180
  },
  {
    id: "task-10",
    title: "Submit a weekly outreach report",
    shortDescription: "Submit weekly metrics including footfalls, click-through rates, and query resolutions.",
    detailedDescription: "Provide a concise weekly progress report covering your ambassador activities over the past 7 days. Include count of student inquiries resolved, group engagement trends, and blockers faced.",
    instructions: [
      "Summarize week 3 promotional performance.",
      "List total registration queries answered.",
      "Highlight any administrative assistance required from E-Cell IIT Guwahati team.",
      "Upload in PDF format."
    ],
    submissionRequirements: "Weekly report document in PDF format (Max 10MB).",
    submissionType: "file",
    acceptedFormats: ".pdf",
    assignedDate: "Nov 09, 2026",
    deadline: "Nov 20, 2026",
    status: "pending",
    points: 130
  },
  {
    id: "task-11",
    title: "Connect with college societies for collaboration",
    shortDescription: "Initiate tie-ups with technical, cultural, or literary societies for event cross-promotions.",
    detailedDescription: "Reach out to influential societies in your college (e.g. Coding Club, Debate Society, Fine Arts, Media Club) to cross-promote UDGAM events in exchange for shoutouts and community privileges.",
    instructions: [
      "Approach executive leads of at least 2 campus clubs.",
      "Discuss mutual collaboration points (such as co-hosting mock rounds or sharing registrations).",
      "Document the agreed collaboration terms, coordinator contacts, and tentative dates.",
      "Provide detailed written collaboration summary in the box below."
    ],
    submissionRequirements: "Text report detailing society names, POC contacts, collaboration agreement details, and estimated reach.",
    submissionType: "text",
    placeholderText: "Detail the societies contacted, agreement terms, POC contacts, and planned joint activities...",
    assignedDate: "Nov 10, 2026",
    deadline: "Nov 23, 2026",
    status: "pending",
    points: 160
  },
  {
    id: "task-12",
    title: "Submit the final Campus Ambassador report",
    shortDescription: "Comprehensive final documentation of all achievements, overall impact, and learnings.",
    detailedDescription: "The capstone submission for your UDGAM'27 Campus Ambassador tenure. Collate end-to-end impact statistics: total registrations mobilized, all marketing collateral distributed, and a reflective summary.",
    instructions: [
      "Compile overall campaign performance from day 1 to summit launch.",
      "Aggregate total confirmed student registrations driven via your referral code.",
      "Attach collage of photos, social media analytics, and WhatsApp broadcast logs.",
      "Provide your feedback on the CA program and recommendations for future editions.",
      "Upload the comprehensive final dossier as a PDF."
    ],
    submissionRequirements: "Final comprehensive report in PDF format (Max 25MB).",
    submissionType: "file",
    acceptedFormats: ".pdf",
    assignedDate: "Nov 12, 2026",
    deadline: "Nov 30, 2026",
    status: "pending",
    points: 300
  }
];

// Submissions Queue Across All Ambassadors (for Manager & Admin grading)
export const initialSubmissions = [
  {
    id: "sub-101",
    taskId: "task-10",
    taskTitle: "Submit a weekly outreach report",
    ambassadorId: "amb-1",
    ambassadorName: "Priya Sundaram",
    college: "IIT Madras",
    avatar: "PS",
    submittedAt: "Nov 10, 2026, 02:15 PM",
    submissionType: "file",
    submissionData: {
      fileName: "IIT_Madras_Week3_UDGAM27_Report.pdf",
      fileSize: "3.2 MB"
    },
    maxPoints: 130,
    status: "pending_review",
    pointsAwarded: null,
    reviewedBy: null,
    reviewedAt: null,
    feedback: null
  },
  {
    id: "sub-102",
    taskId: "task-8",
    taskTitle: "Promote UDGAM'27 through LinkedIn",
    ambassadorId: "amb-2",
    ambassadorName: "Aditya Verma",
    college: "BITS Pilani",
    avatar: "AV",
    submittedAt: "Nov 10, 2026, 11:30 AM",
    submissionType: "link",
    submissionData: {
      link: "https://www.linkedin.com/posts/aditya-verma-bits/udgam27-flagship-announcement-activity-71938291"
    },
    maxPoints: 150,
    status: "pending_review",
    pointsAwarded: null,
    reviewedBy: null,
    reviewedAt: null,
    feedback: null
  },
  {
    id: "sub-103",
    taskId: "task-9",
    taskTitle: "Conduct a classroom announcement",
    ambassadorId: "amb-3",
    ambassadorName: "Sneha Mukherjee",
    college: "Jadavpur University",
    avatar: "SM",
    submittedAt: "Nov 10, 2026, 09:45 AM",
    submissionType: "file",
    submissionData: {
      fileName: "Jadavpur_CS_Classroom_Pitch_Photos.pdf",
      fileSize: "4.7 MB"
    },
    maxPoints: 180,
    status: "pending_review",
    pointsAwarded: null,
    reviewedBy: null,
    reviewedAt: null,
    feedback: null
  },
  {
    id: "sub-104",
    taskId: "task-4",
    taskTitle: "Share UDGAM'27 poster across college communities",
    ambassadorId: "amb-7",
    ambassadorName: "Devendra Rathore",
    college: "IIT Roorkee",
    avatar: "DR",
    submittedAt: "Nov 09, 2026, 06:10 PM",
    submissionType: "file",
    submissionData: {
      fileName: "IITR_Hostel_NoticeBoards_PosterCollage.jpg",
      fileSize: "5.1 MB"
    },
    maxPoints: 150,
    status: "pending_review",
    pointsAwarded: null,
    reviewedBy: null,
    reviewedAt: null,
    feedback: null
  },
  {
    id: "sub-105",
    taskId: "task-11",
    taskTitle: "Connect with college societies for collaboration",
    ambassadorId: "amb-4",
    ambassadorName: "Rohan Kulkarni",
    college: "COEP Tech Pune",
    avatar: "RK",
    submittedAt: "Nov 09, 2026, 01:20 PM",
    submissionType: "text",
    submissionData: {
      text: "Met with President of Robotics Club and Literary Society. Both agreed in principle to share posts. Waiting for formal signoff from faculty."
    },
    maxPoints: 160,
    status: "needs_revision",
    pointsAwarded: 0,
    reviewedBy: "Pooja Verma (Manager)",
    reviewedAt: "Nov 09, 2026, 04:30 PM",
    feedback: "Please provide official coordinator email addresses, mobile numbers, and an agreed date for the workshop as outlined in instructions."
  },
  {
    id: "sub-106",
    taskId: "task-7",
    taskTitle: "Create a list of potential participants",
    ambassadorId: "amb-5", // Rahul Sharma
    ambassadorName: "Rahul Sharma",
    college: "NIT Silchar",
    avatar: "RS",
    submittedAt: "Nov 08, 2026, 05:15 PM",
    submissionType: "file",
    submissionData: {
      fileName: "UDGAM27_Potential_Participants_NIT_Silchar.xlsx",
      fileSize: "84 KB"
    },
    maxPoints: 180,
    status: "approved",
    pointsAwarded: 180,
    reviewedBy: "Pooja Verma (Manager)",
    reviewedAt: "Nov 08, 2026, 07:00 PM",
    feedback: "Excellent verified list with 32 interested students across CSE and ECE batches. Full marks awarded!"
  },
  {
    id: "sub-107",
    taskId: "task-6",
    taskTitle: "Organize a campus promotional activity",
    ambassadorId: "amb-6",
    ambassadorName: "Ananya Deshmukh",
    college: "VNIT Nagpur",
    avatar: "AD",
    submittedAt: "Nov 07, 2026, 03:40 PM",
    submissionType: "file",
    submissionData: {
      fileName: "VNIT_Kiosk_Activation_Report.pdf",
      fileSize: "6.2 MB"
    },
    maxPoints: 250,
    status: "approved",
    pointsAwarded: 250,
    reviewedBy: "Aman Singhania (Admin)",
    reviewedAt: "Nov 07, 2026, 06:15 PM",
    feedback: "Superb crowd mobilization and neat photo proofs. High engagement observed."
  },
  {
    id: "sub-108",
    taskId: "task-2",
    taskTitle: "Publish a UDGAM'27 promotional story on Instagram",
    ambassadorId: "amb-8",
    ambassadorName: "Kavya Nair",
    college: "NIT Calicut",
    avatar: "KN",
    submittedAt: "Nov 06, 2026, 12:10 PM",
    submissionType: "link",
    submissionData: {
      link: "https://instagram.com/s/nitcalicut_ecell_stories_udgam"
    },
    maxPoints: 120,
    status: "approved",
    pointsAwarded: 120,
    reviewedBy: "Pooja Verma (Manager)",
    reviewedAt: "Nov 06, 2026, 02:00 PM",
    feedback: "Verified live story highlight with link sticker active."
  },
  {
    id: "sub-109",
    taskId: "task-5",
    taskTitle: "Identify entrepreneurship clubs in your college",
    ambassadorId: "amb-10",
    ambassadorName: "Meera Nambiar",
    college: "DTU Delhi",
    avatar: "MN",
    submittedAt: "Nov 05, 2026, 04:50 PM",
    submissionType: "text",
    submissionData: {
      text: "DTU E-Cell (President: Harshit Malhotra, +91 99112 00192). E-Summit Delhi scheduled February. Active member count 110."
    },
    maxPoints: 100,
    status: "approved",
    pointsAwarded: 100,
    reviewedBy: "Pooja Verma (Manager)",
    reviewedAt: "Nov 05, 2026, 08:30 PM",
    feedback: "Verified details with DTU team."
  },
  {
    id: "sub-110",
    taskId: "task-1",
    taskTitle: "Share UDGAM'27 registration announcement in college WhatsApp groups",
    ambassadorId: "amb-9",
    ambassadorName: "Ayush Patel",
    college: "SVNIT Surat",
    avatar: "AP",
    submittedAt: "Nov 04, 2026, 10:20 AM",
    submissionType: "link",
    submissionData: {
      link: "https://drive.google.com/drive/folders/svnit-whatsapp-proofs-udgam27"
    },
    maxPoints: 100,
    status: "approved",
    pointsAwarded: 95,
    reviewedBy: "Pooja Verma (Manager)",
    reviewedAt: "Nov 04, 2026, 12:45 PM",
    feedback: "Good coverage across 2 batch groups. Minor deduction as third group had low member count."
  }
];

// Leaderboard Mock Data (12 Ambassadors from top colleges across India)
export const initialLeaderboard = [
  {
    id: "amb-1",
    name: "Priya Sundaram",
    college: "IIT Madras",
    email: "priya.s@iitm.ac.in",
    phone: "+91 98401 23456",
    tasksCompleted: 11,
    avgSpeed: "1.2 days",
    speedDays: 1.2,
    score: 1850,
    avatar: "PS",
    performance: "Exceptional",
    status: "active"
  },
  {
    id: "amb-2",
    name: "Aditya Verma",
    college: "BITS Pilani",
    email: "aditya.v@pilani.bits-pilani.ac.in",
    phone: "+91 98290 87654",
    tasksCompleted: 10,
    avgSpeed: "1.5 days",
    speedDays: 1.5,
    score: 1680,
    avatar: "AV",
    performance: "Outstanding",
    status: "active"
  },
  {
    id: "amb-3",
    name: "Sneha Mukherjee",
    college: "Jadavpur University",
    email: "sneha.m@ju.edu.in",
    phone: "+91 98300 45678",
    tasksCompleted: 9,
    avgSpeed: "1.8 days",
    speedDays: 1.8,
    score: 1520,
    avatar: "SM",
    performance: "Superior",
    status: "active"
  },
  {
    id: "amb-4",
    name: "Rohan Kulkarni",
    college: "COEP Tech Pune",
    email: "rohan.k@coep.ac.in",
    phone: "+91 98220 11223",
    tasksCompleted: 8,
    avgSpeed: "2.1 days",
    speedDays: 2.1,
    score: 1360,
    avatar: "RK",
    performance: "High",
    status: "active"
  },
  {
    id: "amb-5",
    name: "Rahul Sharma", // The logged in user!
    college: "NIT Silchar",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210",
    tasksCompleted: 7,
    avgSpeed: "2.4 days",
    speedDays: 2.4,
    score: 1100,
    avatar: "RS",
    performance: "High",
    isCurrentUser: true,
    status: "active"
  },
  {
    id: "amb-6",
    name: "Ananya Deshmukh",
    college: "VNIT Nagpur",
    email: "ananya.d@vnit.ac.in",
    phone: "+91 98711 99887",
    tasksCompleted: 7,
    avgSpeed: "2.8 days",
    speedDays: 2.8,
    score: 1050,
    avatar: "AD",
    performance: "Good",
    status: "active"
  },
  {
    id: "amb-7",
    name: "Devendra Rathore",
    college: "IIT Roorkee",
    email: "devendra.r@iitr.ac.in",
    phone: "+91 98970 33445",
    tasksCompleted: 6,
    avgSpeed: "2.0 days",
    speedDays: 2.0,
    score: 980,
    avatar: "DR",
    performance: "Good",
    status: "active"
  },
  {
    id: "amb-8",
    name: "Kavya Nair",
    college: "NIT Calicut",
    email: "kavya.n@nitc.ac.in",
    phone: "+91 94470 55667",
    tasksCompleted: 6,
    avgSpeed: "2.5 days",
    speedDays: 2.5,
    score: 920,
    avatar: "KN",
    performance: "Good",
    status: "active"
  },
  {
    id: "amb-9",
    name: "Ayush Patel",
    college: "SVNIT Surat",
    email: "ayush.p@svnit.ac.in",
    phone: "+91 98250 77889",
    tasksCompleted: 5,
    avgSpeed: "3.1 days",
    speedDays: 3.1,
    score: 790,
    avatar: "AP",
    performance: "Moderate",
    status: "active"
  },
  {
    id: "amb-10",
    name: "Meera Nambiar",
    college: "DTU Delhi",
    email: "meera.n@dtu.ac.in",
    phone: "+91 98100 88990",
    tasksCompleted: 5,
    avgSpeed: "3.4 days",
    speedDays: 3.4,
    score: 740,
    avatar: "MN",
    performance: "Moderate",
    status: "active"
  },
  {
    id: "amb-11",
    name: "Tanmay Joshi",
    college: "IIT Guwahati",
    email: "tanmay.j@iitg.ac.in",
    phone: "+91 94350 12345",
    tasksCompleted: 4,
    avgSpeed: "2.2 days",
    speedDays: 2.2,
    score: 660,
    avatar: "TJ",
    performance: "Moderate",
    status: "active"
  },
  {
    id: "amb-12",
    name: "Sarthak Bansal",
    college: "Thapar Institute",
    email: "sarthak.b@thapar.edu",
    phone: "+91 98150 44556",
    tasksCompleted: 4,
    avgSpeed: "3.8 days",
    speedDays: 3.8,
    score: 590,
    avatar: "SB",
    performance: "On Track",
    status: "active"
  }
];

// Calculation helper to rank ambassadors based on:
// 1. Number of tasks completed (primary)
// 2. Speed of task submissions (faster = fewer days, secondary tiebreaker)
// 3. Score
export function calculateRankings(ambassadors) {
  const sorted = [...ambassadors].sort((a, b) => {
    // Primary: tasks completed (higher is better)
    if (b.tasksCompleted !== a.tasksCompleted) {
      return b.tasksCompleted - a.tasksCompleted;
    }
    // Secondary: speed in days (lower is faster/better)
    if (a.speedDays !== b.speedDays) {
      return a.speedDays - b.speedDays;
    }
    // Tertiary: points/score
    return (b.score || 0) - (a.score || 0);
  });

  return sorted.map((amb, index) => ({
    ...amb,
    rank: index + 1
  }));
}

// 8 Task Review Managers overseeing UDGAM'27 CA Evaluations
export const initialManagers = [
  {
    id: "user-mgr-1",
    name: "Pooja Verma",
    email: "pooja.verma@ecell-iitg.org",
    username: "manager",
    managerId: "UDGAM27-MGR-01",
    domain: "Social Media & Digital Promotion (Tasks 1-2)",
    phone: "+91 98112 34567",
    department: "Media & PR Track",
    evaluationsCount: 142,
    pendingInQueue: 2,
    avgTurnaround: "1.8 hrs",
    status: "active",
    joinedDate: "Aug 15, 2026",
    avatar: "PV"
  },
  {
    id: "user-mgr-2",
    name: "Arunav Sengupta",
    email: "arunav.s@ecell-iitg.org",
    username: "arunav_mgr",
    managerId: "UDGAM27-MGR-02",
    domain: "Offline Campus Activations & Kiosks (Task 6)",
    phone: "+91 98311 44556",
    department: "Events & On-Ground Outreach",
    evaluationsCount: 98,
    pendingInQueue: 1,
    avgTurnaround: "2.4 hrs",
    status: "active",
    joinedDate: "Sep 01, 2026",
    avatar: "AS"
  },
  {
    id: "user-mgr-3",
    name: "Nandini Kashyap",
    email: "nandini.k@ecell-iitg.org",
    username: "nandini_mgr",
    managerId: "UDGAM27-MGR-03",
    domain: "Classroom Pitches & Notice Boards (Tasks 4, 9)",
    phone: "+91 98722 88990",
    department: "Academic Outreach",
    evaluationsCount: 115,
    pendingInQueue: 1,
    avgTurnaround: "1.5 hrs",
    status: "active",
    joinedDate: "Sep 10, 2026",
    avatar: "NK"
  },
  {
    id: "user-mgr-4",
    name: "Harshit Bajpai",
    email: "harshit.b@ecell-iitg.org",
    username: "harshit_mgr",
    managerId: "UDGAM27-MGR-04",
    domain: "College Society & Club Collaborations (Tasks 5, 11)",
    phone: "+91 98910 12344",
    department: "Strategic Alliances",
    evaluationsCount: 84,
    pendingInQueue: 0,
    avgTurnaround: "3.2 hrs",
    status: "active",
    joinedDate: "Sep 15, 2026",
    avatar: "HB"
  },
  {
    id: "user-mgr-5",
    name: "Debojit Barman",
    email: "debojit.b@ecell-iitg.org",
    username: "debojit_mgr",
    managerId: "UDGAM27-MGR-05",
    domain: "Participant Rosters & Lead Sheets (Task 7)",
    phone: "+91 94350 99881",
    department: "Data & Registrations",
    evaluationsCount: 130,
    pendingInQueue: 0,
    avgTurnaround: "2.0 hrs",
    status: "active",
    joinedDate: "Oct 01, 2026",
    avatar: "DB"
  },
  {
    id: "user-mgr-6",
    name: "Ritwika Das",
    email: "ritwika.d@ecell-iitg.org",
    username: "ritwika_mgr",
    managerId: "UDGAM27-MGR-06",
    domain: "Weekly Reports & Capstone Dossiers (Tasks 3, 10, 12)",
    phone: "+91 98305 66778",
    department: "Quality Assurance & Reports",
    evaluationsCount: 76,
    pendingInQueue: 1,
    avgTurnaround: "2.8 hrs",
    status: "active",
    joinedDate: "Oct 05, 2026",
    avatar: "RD"
  },
  {
    id: "user-mgr-7",
    name: "Siddharth Roy",
    email: "siddharth.r@ecell-iitg.org",
    username: "siddharth_mgr",
    managerId: "UDGAM27-MGR-07",
    domain: "North-East Region Special Outreach Track",
    phone: "+91 94011 22334",
    department: "Regional Special Operations",
    evaluationsCount: 104,
    pendingInQueue: 0,
    avgTurnaround: "1.9 hrs",
    status: "active",
    joinedDate: "Oct 12, 2026",
    avatar: "SR"
  },
  {
    id: "user-mgr-8",
    name: "Ananya Swaminathan",
    email: "ananya.s@ecell-iitg.org",
    username: "ananya_mgr",
    managerId: "UDGAM27-MGR-08",
    domain: "Quality Audit & Grievance Resolutions",
    phone: "+91 98410 77665",
    department: "CA Operations Support",
    evaluationsCount: 65,
    pendingInQueue: 0,
    avgTurnaround: "2.2 hrs",
    status: "active",
    joinedDate: "Oct 18, 2026",
    avatar: "AS"
  }
];
