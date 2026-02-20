// Enhanced Dummy Data for AI-Powered Smart Campus Platform

import type { 
  StudentProfile, AIMatchResult, AcademicHealth, RealWorldProblem, 
  StudentProblem, NetworkNode, NetworkEdge, BroadcastNotification, 
  SystemMetrics, CanteenOrder, FoodMenuItem, AIInsight 
} from '@/types/enhanced';
import { placements } from '@/data/dummyData';
export { placements };

// Student Profiles with Skills & Career Goals
export const studentProfiles: StudentProfile[] = [
  {
    studentId: 's1',
    skills: ['React', 'Node.js', 'Python', 'MongoDB', 'TypeScript'],
    interests: ['Web Development', 'AI/ML', 'Cloud Computing'],
    preferredDomains: ['Software Engineering', 'Full Stack Development', 'DevOps'],
    careerGoals: 'Become a Senior Full Stack Developer at a top tech company',
    cgpa: 8.5,
    attendanceRate: 84.4,
    assignmentCompletionRate: 95,
    skillGrowth: [
      { skill: 'React', level: 8, history: [{ date: '2024-01', level: 6 }, { date: '2024-02', level: 8 }] },
      { skill: 'Node.js', level: 7, history: [{ date: '2024-01', level: 5 }, { date: '2024-02', level: 7 }] },
      { skill: 'Python', level: 8, history: [{ date: '2024-01', level: 7 }, { date: '2024-02', level: 8 }] },
    ]
  },
  {
    studentId: 's2',
    skills: ['Java', 'Machine Learning', 'SQL', 'TensorFlow', 'Data Analysis'],
    interests: ['Machine Learning', 'Data Science', 'Big Data'],
    preferredDomains: ['AI/ML Engineering', 'Data Science', 'Research'],
    careerGoals: 'ML Engineer working on cutting-edge AI products',
    cgpa: 9.2,
    attendanceRate: 93.3,
    assignmentCompletionRate: 100,
    skillGrowth: [
      { skill: 'Machine Learning', level: 9, history: [{ date: '2024-01', level: 7 }, { date: '2024-02', level: 9 }] },
      { skill: 'Python', level: 9, history: [{ date: '2024-01', level: 8 }, { date: '2024-02', level: 9 }] },
      { skill: 'SQL', level: 8, history: [{ date: '2024-01', level: 7 }, { date: '2024-02', level: 8 }] },
    ]
  },
  {
    studentId: 's3',
    skills: ['C++', 'Embedded Systems', 'IoT', 'Arduino', 'Circuit Design'],
    interests: ['Robotics', 'VLSI', 'Embedded Systems'],
    preferredDomains: ['Hardware Engineering', 'IoT Development', 'Robotics'],
    careerGoals: 'Embedded Systems Engineer in automotive industry',
    cgpa: 7.8,
    attendanceRate: 83.3,
    assignmentCompletionRate: 85,
    skillGrowth: [
      { skill: 'Embedded C', level: 7, history: [{ date: '2024-01', level: 6 }, { date: '2024-02', level: 7 }] },
      { skill: 'IoT', level: 6, history: [{ date: '2024-01', level: 5 }, { date: '2024-02', level: 6 }] },
    ]
  },
  {
    studentId: 's4',
    skills: ['Figma', 'UI/UX Design', 'HTML/CSS', 'Adobe XD', 'Prototyping'],
    interests: ['Design', 'User Research', 'Product Design'],
    preferredDomains: ['UI/UX Design', 'Product Design', 'Design Systems'],
    careerGoals: 'Product Designer at a design-led company',
    cgpa: 8.0,
    attendanceRate: 88,
    assignmentCompletionRate: 92,
    skillGrowth: [
      { skill: 'Figma', level: 9, history: [{ date: '2024-01', level: 7 }, { date: '2024-02', level: 9 }] },
      { skill: 'UI Design', level: 8, history: [{ date: '2024-01', level: 6 }, { date: '2024-02', level: 8 }] },
    ]
  },
  {
    studentId: 's5',
    skills: ['Python', 'Django', 'AWS', 'Docker', 'Kubernetes'],
    interests: ['Backend', 'DevOps', 'Cloud Architecture'],
    preferredDomains: ['Backend Engineering', 'Cloud Architecture', 'DevOps'],
    careerGoals: 'Cloud Architect designing scalable systems',
    cgpa: 8.7,
    attendanceRate: 90,
    assignmentCompletionRate: 98,
    skillGrowth: [
      { skill: 'AWS', level: 8, history: [{ date: '2024-01', level: 6 }, { date: '2024-02', level: 8 }] },
      { skill: 'Docker', level: 7, history: [{ date: '2024-01', level: 5 }, { date: '2024-02', level: 7 }] },
    ]
  },
  {
    studentId: 's6',
    skills: ['JavaScript', 'React', 'React Native', 'MongoDB', 'Firebase'],
    interests: ['Frontend', 'Mobile Development', 'Web Apps'],
    preferredDomains: ['Frontend Development', 'Mobile Development'],
    careerGoals: 'Frontend Developer building beautiful user interfaces',
    cgpa: 7.5,
    attendanceRate: 71.1,
    assignmentCompletionRate: 80,
    skillGrowth: [
      { skill: 'React', level: 7, history: [{ date: '2024-01', level: 6 }, { date: '2024-02', level: 7 }] },
      { skill: 'React Native', level: 6, history: [{ date: '2024-01', level: 4 }, { date: '2024-02', level: 6 }] },
    ]
  },
];

// AI Match Results for Job Opportunities
export const aiMatchResults: AIMatchResult[] = [
  {
    placementId: 'p1',
    studentId: 's1',
    matchScore: 92,
    matchReasons: [
      'Strong React & Node.js skills match job requirements',
      'Good academic performance (8.5 GPA)',
      'Web Development interest aligns with role',
      '95% assignment completion shows dedication'
    ],
    skillGaps: ['System Design', 'Google Cloud Platform'],
    recommendations: [
      'Complete system design course',
      'Practice LeetCode medium/hard problems',
      'Build a portfolio project with scalability focus'
    ],
    createdAt: '2024-02-08T10:00:00'
  },
  {
    placementId: 'p2',
    studentId: 's5',
    matchScore: 88,
    matchReasons: [
      'Excellent AWS & cloud skills',
      'Backend development experience with Django',
      'DevOps knowledge with Docker & Kubernetes',
      'Strong academic record'
    ],
    skillGaps: ['Azure', '.NET Core'],
    recommendations: [
      'Get AWS Solutions Architect certification',
      'Learn Azure fundamentals',
      'Contribute to open-source cloud projects'
    ],
    createdAt: '2024-02-08T11:00:00'
  },
  {
    placementId: 'p3',
    studentId: 's2',
    matchScore: 95,
    matchReasons: [
      'Perfect ML & Python skills match',
      'Exceptional academic performance (9.2 GPA)',
      'Data Science interest aligns perfectly',
      'TensorFlow experience is a plus'
    ],
    skillGaps: ['PyTorch', 'MLOps'],
    recommendations: [
      'Complete PyTorch tutorial series',
      'Build end-to-end ML project',
      'Learn model deployment techniques'
    ],
    createdAt: '2024-02-08T12:00:00'
  },
];

// Academic Health Scores
export const academicHealthData: AcademicHealth[] = [
  {
    studentId: 's1',
    overallScore: 82,
    attendanceScore: 78,
    performanceScore: 88,
    assignmentScore: 95,
    skillScore: 80,
    riskLevel: 'medium',
    riskFactors: [
      'Operating Systems attendance below 75%',
      'Two assignments submitted close to deadline'
    ],
    suggestions: [
      'Prioritize OS lectures this week',
      'Start assignments earlier',
      'Join study group for OS'
    ],
    lastUpdated: '2024-02-08T10:00:00'
  },
  {
    studentId: 's2',
    overallScore: 95,
    attendanceScore: 95,
    performanceScore: 96,
    assignmentScore: 100,
    skillScore: 92,
    riskLevel: 'low',
    riskFactors: [],
    suggestions: [
      'Continue excellent performance',
      'Consider mentoring other students',
      'Apply for research opportunities'
    ],
    lastUpdated: '2024-02-08T10:00:00'
  },
  {
    studentId: 's6',
    overallScore: 65,
    attendanceScore: 60,
    performanceScore: 70,
    assignmentScore: 80,
    skillScore: 72,
    riskLevel: 'high',
    riskFactors: [
      'Attendance critically low in multiple courses',
      'Missed 3 assignment deadlines',
      'Declining performance trend'
    ],
    suggestions: [
      'Meet with academic advisor urgently',
      'Create daily attendance reminder',
      'Request assignment extensions',
      'Join tutoring sessions'
    ],
    lastUpdated: '2024-02-08T10:00:00'
  },
];

// Real World Problems
export const realWorldProblems: RealWorldProblem[] = [
  {
    id: 'rwp1',
    title: 'Smart Campus Timetable Generator',
    description: 'Build an AI-powered system that generates optimal timetables considering faculty availability, room capacity, and student preferences.',
    refinedDescription: 'Create an intelligent scheduling system using constraint satisfaction algorithms that optimizes for: minimal conflicts, preferred time slots, room utilization, and faculty workload balance.',
    postedBy: 'f1',
    postedByName: 'Dr. Rajesh Iyer',
    department: 'CSE',
    difficulty: 'hard',
    status: 'open',
    requiredSkills: ['Python', 'Algorithms', 'Optimization', 'React', 'Node.js'],
    enrolledStudents: ['s1', 's2', 's5'],
    solutions: [],
    createdAt: '2024-02-01T10:00:00',
    deadline: '2024-03-15',
    maxSubmissions: 10,
    reward: 'Certificate + Internship Recommendation'
  },
  {
    id: 'rwp2',
    title: 'Campus Indoor Navigation App',
    description: 'Build an indoor navigation system for campus buildings using BLE beacons.',
    refinedDescription: 'Develop a mobile application that helps students navigate between buildings and find classrooms using Bluetooth Low Energy (BLE) beacons for precise indoor positioning.',
    postedBy: 'f2',
    postedByName: 'Prof. Meera Nair',
    department: 'CSE',
    difficulty: 'medium',
    status: 'in-progress',
    requiredSkills: ['React Native', 'Mobile Development', 'IoT', 'Bluetooth'],
    enrolledStudents: ['s6'],
    solutions: [
      {
        id: 'sol1',
        studentId: 's6',
        studentName: 'Ananya Reddy',
        description: 'Implemented using React Native and indoor mapping with beacon triangulation',
        codeUrl: 'https://github.com/ananya/campus-nav',
        submittedAt: '2024-02-10T15:00:00',
        isSelected: false,
        rating: 4
      }
    ],
    createdAt: '2024-01-25T11:00:00',
    deadline: '2024-02-28',
    reward: 'Certificate + Cash Prize ₹5000'
  },
  {
    id: 'rwp3',
    title: 'Automated Attendance System',
    description: 'Build a facial recognition based attendance system for classrooms.',
    refinedDescription: 'Create an automated attendance marking system using OpenCV and face recognition that identifies students and marks attendance without manual intervention.',
    postedBy: 'f3',
    postedByName: 'Dr. Arun Kumar',
    department: 'ECE',
    difficulty: 'hard',
    status: 'open',
    requiredSkills: ['Python', 'OpenCV', 'Machine Learning', 'Computer Vision'],
    enrolledStudents: ['s3'],
    solutions: [],
    createdAt: '2024-02-05T09:00:00',
    deadline: '2024-03-20',
    reward: 'Certificate + Research Opportunity'
  },
  {
    id: 'rwp4',
    title: 'Library Book Recommendation Engine',
    description: 'Build an AI system that recommends books based on student interests and academic performance.',
    refinedDescription: 'Develop a recommendation engine using collaborative filtering and content-based filtering to suggest relevant books to students based on their course, interests, and reading history.',
    postedBy: 'f4',
    postedByName: 'Prof. Lakshmi Menon',
    department: 'IT',
    difficulty: 'medium',
    status: 'open',
    requiredSkills: ['Python', 'Machine Learning', 'Data Analysis', 'SQL'],
    enrolledStudents: [],
    solutions: [],
    createdAt: '2024-02-10T14:00:00',
    deadline: '2024-03-30',
    reward: 'Certificate + Library Credits'
  },
];

// Student-to-Faculty Problems
export const studentProblems: StudentProblem[] = [
  {
    id: 'sp1',
    title: 'Help with Dijkstra Algorithm Implementation',
    description: 'I am having trouble understanding how to implement Dijkstra\'s algorithm for finding the shortest path. Can someone explain the priority queue approach?',
    postedBy: 's1',
    postedByName: 'Aarav Sharma',
    studentAvatar: 'https://i.pravatar.cc/150?u=s1',
    subject: 'Data Structures',
    facultyId: 'f1',
    attachments: [],
    status: 'resolved',
    solution: {
      description: 'Here is a step-by-step explanation with code example. Dijkstra\'s algorithm uses a priority queue to always expand the shortest known path first...',
      fileUrl: 'https://example.com/dijkstra-explanation.pdf',
      providedBy: 'f1',
      providedByName: 'Dr. Rajesh Iyer',
      providedAt: '2024-02-06T10:00:00'
    },
    createdAt: '2024-02-05T15:00:00',
    resolvedAt: '2024-02-06T10:00:00'
  },
  {
    id: 'sp2',
    title: 'Database Normalization Confusion',
    description: 'I am confused about 3NF and BCNF. When should I use BCNF over 3NF? Can you provide examples?',
    postedBy: 's2',
    postedByName: 'Priya Patel',
    studentAvatar: 'https://i.pravatar.cc/150?u=s2',
    subject: 'Database Management',
    facultyId: 'f2',
    attachments: [],
    status: 'in-review',
    createdAt: '2024-02-08T09:00:00'
  },
  {
    id: 'sp3',
    title: 'Understanding Deadlocks in OS',
    description: 'Can you explain deadlock prevention vs avoidance with real-world examples?',
    postedBy: 's5',
    postedByName: 'Vikram Rao',
    studentAvatar: 'https://i.pravatar.cc/150?u=s5',
    subject: 'Operating Systems',
    facultyId: 'f1',
    attachments: [],
    status: 'open',
    createdAt: '2024-02-08T16:00:00'
  },
];

// Network Graph Data
export const networkNodes: NetworkNode[] = [
  // Students
  { id: 's1', type: 'student', label: 'Aarav Sharma', data: { department: 'CSE', cgpa: 8.5 }, health: 'good' },
  { id: 's2', type: 'student', label: 'Priya Patel', data: { department: 'CSE', cgpa: 9.2 }, health: 'good' },
  { id: 's3', type: 'student', label: 'Rahul Kumar', data: { department: 'ECE', cgpa: 7.8 }, health: 'warning' },
  { id: 's4', type: 'student', label: 'Sneha Gupta', data: { department: 'IT', cgpa: 8.0 }, health: 'good' },
  { id: 's5', type: 'student', label: 'Vikram Rao', data: { department: 'CSE', cgpa: 8.7 }, health: 'good' },
  { id: 's6', type: 'student', label: 'Ananya Reddy', data: { department: 'CSE', cgpa: 7.5 }, health: 'critical' },
  
  // Faculty
  { id: 'f1', type: 'faculty', label: 'Dr. Rajesh Iyer', data: { department: 'CSE', courses: 3 }, health: 'good' },
  { id: 'f2', type: 'faculty', label: 'Prof. Meera Nair', data: { department: 'CSE', courses: 2 }, health: 'good' },
  { id: 'f3', type: 'faculty', label: 'Dr. Arun Kumar', data: { department: 'ECE', courses: 2 }, health: 'good' },
  { id: 'f4', type: 'faculty', label: 'Prof. Lakshmi Menon', data: { department: 'IT', courses: 2 }, health: 'good' },
  
  // Courses
  { id: 'c1', type: 'course', label: 'Data Structures', data: { code: 'CS201', students: 35 }, health: 'good' },
  { id: 'c2', type: 'course', label: 'DBMS', data: { code: 'CS202', students: 30 }, health: 'warning' },
  { id: 'c3', type: 'course', label: 'Operating Systems', data: { code: 'CS203', students: 40 }, health: 'critical' },
  { id: 'c4', type: 'course', label: 'Computer Networks', data: { code: 'CS204', students: 25 }, health: 'good' },
  { id: 'c5', type: 'course', label: 'Digital Electronics', data: { code: 'EC201', students: 20 }, health: 'good' },
  
  // Clubs
  { id: 'club1', type: 'club', label: 'CodeClub', data: { members: 120, events: 5 }, health: 'good' },
  { id: 'club2', type: 'club', label: 'AI Society', data: { members: 80, events: 3 }, health: 'good' },
  { id: 'club3', type: 'club', label: 'Cultural Club', data: { members: 200, events: 8 }, health: 'good' },
  
  // Placements
  { id: 'p1', type: 'placement', label: 'Google Internship', data: { company: 'Google', applicants: 45 }, health: 'good' },
  { id: 'p2', type: 'placement', label: 'Microsoft FTE', data: { company: 'Microsoft', applicants: 60 }, health: 'good' },
  { id: 'p3', type: 'placement', label: 'Amazon DS', data: { company: 'Amazon', applicants: 35 }, health: 'good' },
];

export const networkEdges: NetworkEdge[] = [
  // Student-Course Enrollments
  { source: 's1', target: 'c1', type: 'enrolled', weight: 1, health: 'good' },
  { source: 's1', target: 'c2', type: 'enrolled', weight: 1, health: 'warning' },
  { source: 's1', target: 'c3', type: 'enrolled', weight: 1, health: 'critical' },
  { source: 's2', target: 'c1', type: 'enrolled', weight: 1, health: 'good' },
  { source: 's2', target: 'c2', type: 'enrolled', weight: 1, health: 'good' },
  { source: 's3', target: 'c5', type: 'enrolled', weight: 1, health: 'good' },
  { source: 's6', target: 'c1', type: 'enrolled', weight: 1, health: 'warning' },
  { source: 's6', target: 'c4', type: 'enrolled', weight: 1, health: 'good' },
  
  // Faculty-Course Teaching
  { source: 'f1', target: 'c1', type: 'teaches', weight: 1, health: 'good' },
  { source: 'f1', target: 'c3', type: 'teaches', weight: 1, health: 'good' },
  { source: 'f2', target: 'c2', type: 'teaches', weight: 1, health: 'good' },
  { source: 'f2', target: 'c4', type: 'teaches', weight: 1, health: 'good' },
  { source: 'f3', target: 'c5', type: 'teaches', weight: 1, health: 'good' },
  
  // Student-Club Memberships
  { source: 's1', target: 'club1', type: 'member', weight: 1, health: 'good' },
  { source: 's2', target: 'club2', type: 'member', weight: 1, health: 'good' },
  { source: 's3', target: 'club1', type: 'member', weight: 1, health: 'good' },
  { source: 's4', target: 'club3', type: 'member', weight: 1, health: 'good' },
  { source: 's5', target: 'club1', type: 'member', weight: 1, health: 'good' },
  { source: 's6', target: 'club1', type: 'member', weight: 1, health: 'good' },
  
  // Student-Placement Applications
  { source: 's1', target: 'p1', type: 'applied', weight: 1, health: 'good' },
  { source: 's2', target: 'p1', type: 'applied', weight: 1, health: 'good' },
  { source: 's5', target: 'p2', type: 'applied', weight: 1, health: 'good' },
  { source: 's2', target: 'p3', type: 'applied', weight: 1, health: 'good' },
];

// Broadcast Notifications
export const broadcastNotifications: BroadcastNotification[] = [
  {
    id: 'bn1',
    title: 'Semester Exam Schedule Released',
    content: 'End semester examinations will commence from March 1st, 2024. Check the portal for your detailed schedule.',
    postedBy: 'a1',
    postedByName: 'Admin User',
    targetAudience: 'all',
    priority: 'high',
    createdAt: '2024-02-05T10:00:00',
    expiresAt: '2024-03-01T00:00:00',
    readBy: ['s1', 's2', 's3', 's4', 's5']
  },
  {
    id: 'bn2',
    title: 'Campus Maintenance - Water Supply',
    content: 'Water supply will be interrupted on Sunday, Feb 11th from 10 AM to 2 PM for maintenance work.',
    postedBy: 'a1',
    postedByName: 'Admin User',
    targetAudience: 'all',
    priority: 'medium',
    createdAt: '2024-02-07T09:00:00',
    readBy: ['s1', 's2']
  },
  {
    id: 'bn3',
    title: 'CSE Department Meeting',
    content: 'All CSE faculty are requested to attend the department meeting on Friday at 3 PM in Conference Room A.',
    postedBy: 'a1',
    postedByName: 'Admin User',
    targetAudience: 'department',
    targetDepartment: 'CSE',
    priority: 'medium',
    createdAt: '2024-02-08T11:00:00',
    readBy: ['f1', 'f2']
  },
  {
    id: 'bn4',
    title: 'Google Campus Drive - Registration Open',
    content: 'Google is conducting a campus recruitment drive on Feb 25th. Eligible students can register through the placement portal.',
    postedBy: 'a1',
    postedByName: 'Admin User',
    targetAudience: 'students',
    priority: 'high',
    createdAt: '2024-02-08T14:00:00',
    readBy: []
  },
  {
    id: 'bn5',
    title: '🚨 Emergency: Campus Closure Tomorrow',
    content: 'Due to severe weather conditions, the campus will remain closed tomorrow (Feb 9th). All classes will be conducted online.',
    postedBy: 'a1',
    postedByName: 'Admin User',
    targetAudience: 'all',
    priority: 'emergency',
    createdAt: '2024-02-08T18:00:00',
    readBy: []
  },
];

// System Metrics (for monitoring dashboard)
export const systemMetrics: SystemMetrics[] = [
  {
    timestamp: '2024-02-08T10:00:00',
    activeUsers: 245,
    totalRequests: 15234,
    avgResponseTime: 120,
    errorRate: 0.5,
    cpuUsage: 45,
    memoryUsage: 62,
    databaseConnections: 78,
    apiHealth: 'healthy'
  },
  {
    timestamp: '2024-02-08T11:00:00',
    activeUsers: 312,
    totalRequests: 18923,
    avgResponseTime: 135,
    errorRate: 0.8,
    cpuUsage: 52,
    memoryUsage: 68,
    databaseConnections: 85,
    apiHealth: 'healthy'
  },
  {
    timestamp: '2024-02-08T12:00:00',
    activeUsers: 456,
    totalRequests: 23456,
    avgResponseTime: 145,
    errorRate: 1.2,
    cpuUsage: 68,
    memoryUsage: 75,
    databaseConnections: 102,
    apiHealth: 'degraded'
  },
  {
    timestamp: '2024-02-08T13:00:00',
    activeUsers: 389,
    totalRequests: 19876,
    avgResponseTime: 125,
    errorRate: 0.6,
    cpuUsage: 55,
    memoryUsage: 70,
    databaseConnections: 89,
    apiHealth: 'healthy'
  },
];

// Enhanced Food Menu
export const foodMenuItems: FoodMenuItem[] = [
  {
    id: 'fm1',
    name: 'Masala Dosa',
    description: 'Crispy rice crepe with spiced potato filling',
    price: 60,
    category: 'breakfast',
    isAvailable: true,
    isVeg: true,
    preparationTime: 10,
    rating: 4.5,
    orderCount: 245
  },
  {
    id: 'fm2',
    name: 'Idli Sambar',
    description: 'Soft steamed rice cakes with lentil soup',
    price: 40,
    category: 'breakfast',
    isAvailable: true,
    isVeg: true,
    preparationTime: 5,
    rating: 4.3,
    orderCount: 189
  },
  {
    id: 'fm3',
    name: 'Veg Biryani',
    description: 'Aromatic basmati rice with mixed vegetables',
    price: 80,
    category: 'lunch',
    isAvailable: true,
    isVeg: true,
    preparationTime: 15,
    rating: 4.6,
    orderCount: 312
  },
  {
    id: 'fm4',
    name: 'Chicken Biryani',
    description: 'Hyderabadi style chicken biryani',
    price: 120,
    category: 'lunch',
    isAvailable: true,
    isVeg: false,
    preparationTime: 20,
    rating: 4.7,
    orderCount: 423
  },
  {
    id: 'fm5',
    name: 'Samosa',
    description: 'Crispy pastry with spiced potato filling',
    price: 15,
    category: 'snacks',
    isAvailable: true,
    isVeg: true,
    preparationTime: 5,
    rating: 4.4,
    orderCount: 567
  },
  {
    id: 'fm6',
    name: 'Paneer Butter Masala',
    description: 'Creamy cottage cheese curry',
    price: 100,
    category: 'dinner',
    isAvailable: true,
    isVeg: true,
    preparationTime: 15,
    rating: 4.5,
    orderCount: 278
  },
  {
    id: 'fm7',
    name: 'Cold Coffee',
    description: 'Refreshing iced coffee with cream',
    price: 45,
    category: 'beverages',
    isAvailable: true,
    isVeg: true,
    preparationTime: 3,
    rating: 4.6,
    orderCount: 334
  },
];

// Canteen Orders with full workflow
export const canteenOrders: CanteenOrder[] = [
  {
    id: 'co1',
    userId: 's1',
    userName: 'Aarav Sharma',
    userRole: 'student',
    items: [
      { itemId: 'fm1', name: 'Masala Dosa', quantity: 1, price: 60 },
      { itemId: 'fm7', name: 'Cold Coffee', quantity: 1, price: 45 }
    ],
    totalAmount: 105,
    status: 'delivered',
    orderTime: '2024-02-08T08:30:00',
    estimatedReadyTime: '2024-02-08T08:45:00',
    deliveredAt: '2024-02-08T08:50:00'
  },
  {
    id: 'co2',
    userId: 's2',
    userName: 'Priya Patel',
    userRole: 'student',
    items: [
      { itemId: 'fm3', name: 'Veg Biryani', quantity: 1, price: 80 }
    ],
    totalAmount: 80,
    status: 'ready',
    orderTime: '2024-02-08T12:30:00',
    estimatedReadyTime: '2024-02-08T12:50:00'
  },
  {
    id: 'co3',
    userId: 'f1',
    userName: 'Dr. Rajesh Iyer',
    userRole: 'faculty',
    items: [
      { itemId: 'fm4', name: 'Chicken Biryani', quantity: 1, price: 120 },
      { itemId: 'fm5', name: 'Samosa', quantity: 2, price: 30 }
    ],
    totalAmount: 150,
    status: 'preparing',
    orderTime: '2024-02-08T12:45:00',
    estimatedReadyTime: '2024-02-08T13:05:00',
    specialInstructions: 'Less spicy please'
  },
  {
    id: 'co4',
    userId: 's5',
    userName: 'Vikram Rao',
    userRole: 'student',
    items: [
      { itemId: 'fm6', name: 'Paneer Butter Masala', quantity: 1, price: 100 },
      { itemId: 'fm2', name: 'Idli Sambar', quantity: 1, price: 40 }
    ],
    totalAmount: 140,
    status: 'pending',
    orderTime: '2024-02-08T13:00:00'
  },
  {
    id: 'co5',
    userId: 's3',
    userName: 'Rahul Kumar',
    userRole: 'student',
    items: [
      { itemId: 'fm5', name: 'Samosa', quantity: 3, price: 45 }
    ],
    totalAmount: 45,
    status: 'confirmed',
    orderTime: '2024-02-08T13:05:00',
    estimatedReadyTime: '2024-02-08T13:10:00'
  },
];

// Enhanced AI Insights
export const enhancedAIInsights: AIInsight[] = [
  {
    id: 'ai1',
    type: 'risk',
    title: 'Attendance Risk Alert',
    message: 'CSE department attendance dropped by 12% this week. 15 students are below the 75% threshold.',
    severity: 'warning',
    relatedTo: 'CSE',
    createdAt: '2024-02-08T10:00:00',
    actions: [
      { label: 'View Details', action: 'view_attendance' },
      { label: 'Send Reminder', action: 'send_reminder' }
    ]
  },
  {
    id: 'ai2',
    type: 'performance',
    title: 'Course Performance Alert',
    message: 'Operating Systems has the highest failure rate at 23%. Consider additional support sessions.',
    severity: 'critical',
    relatedTo: 'c3',
    createdAt: '2024-02-07T09:00:00',
    actions: [
      { label: 'View Analytics', action: 'view_analytics' },
      { label: 'Schedule Support', action: 'schedule_support' }
    ]
  },
  {
    id: 'ai3',
    type: 'trend',
    title: 'Declining Performance Trend',
    message: '3rd year students show declining performance trend in core subjects. Early intervention recommended.',
    severity: 'warning',
    createdAt: '2024-02-06T14:00:00',
    actions: [
      { label: 'View Trend', action: 'view_trend' },
      { label: 'Alert Students', action: 'alert_students' }
    ]
  },
  {
    id: 'ai4',
    type: 'placement',
    title: 'New Opportunities Available',
    message: '15 new internship opportunities match student profiles. 8 students have been notified.',
    severity: 'info',
    createdAt: '2024-02-08T08:00:00',
    actions: [
      { label: 'View Matches', action: 'view_matches' },
      { label: 'Notify All', action: 'notify_all' }
    ]
  },
  {
    id: 'ai5',
    type: 'attendance',
    title: 'Student At Risk',
    message: 'Ananya Reddy (s6) is at high risk - attendance below 75% in 2 courses, declining assignment submissions.',
    severity: 'critical',
    relatedTo: 's6',
    createdAt: '2024-02-08T12:00:00',
    actions: [
      { label: 'Contact Student', action: 'contact_student' },
      { label: 'Schedule Meeting', action: 'schedule_meeting' }
    ]
  },
  {
    id: 'ai6',
    type: 'skill',
    title: 'Skill Gap Analysis',
    message: '45 students lack cloud computing skills required for upcoming placement drives. Recommend workshops.',
    severity: 'warning',
    createdAt: '2024-02-07T11:00:00',
    actions: [
      { label: 'View Details', action: 'view_details' },
      { label: 'Plan Workshop', action: 'plan_workshop' }
    ]
  },
];

// Helper functions for AI matching
export function calculateMatchScore(studentId: string, _placementId: string): number {
  const student = studentProfiles.find(s => s.studentId === studentId);
  // Simplified scoring logic
  if (!student) return 0;
  
  let score = 0;
  
  // Academic performance (30%)
  score += (student.cgpa / 10) * 30;
  
  // Attendance (20%)
  score += (student.attendanceRate / 100) * 20;
  
  // Assignment completion (20%)
  score += (student.assignmentCompletionRate / 100) * 20;
  
  // Skill match (30%) - simplified
  score += 25; // Assume some skill overlap
  
  return Math.min(Math.round(score), 100);
}

export function getAcademicHealth(studentId: string): AcademicHealth | undefined {
  return academicHealthData.find(h => h.studentId === studentId);
}

export function getMatchResults(studentId: string): AIMatchResult[] {
  return aiMatchResults.filter(m => m.studentId === studentId);
}
