// CampuSync - Comprehensive Dummy Data

import type {
  User, Course, Attendance, Assignment, ExamResult, TimetableEntry,
  Event, LostFoundItem, Placement, Problem, MenuItem, Order, Book,
  BookIssue, HostelRoom, Complaint, Announcement, AIInsight, ChatMessage,
  DashboardStats
} from '@/types';

// Users
export const users: User[] = [
  { id: 's1', name: 'Aarav Sharma', email: 'aarav@campus.edu', role: 'student', avatar: 'https://i.pravatar.cc/150?u=s1', department: 'CSE', skills: ['React', 'Node.js', 'Python'], interests: ['Web Dev', 'AI'], preferredDomains: ['Software', 'Data Science'], careerGoals: 'Full Stack Developer', phone: '9876543210', joinDate: '2022-08-01' },
  { id: 's2', name: 'Priya Patel', email: 'priya@campus.edu', role: 'student', avatar: 'https://i.pravatar.cc/150?u=s2', department: 'CSE', skills: ['Java', 'ML', 'SQL'], interests: ['Machine Learning', 'Cloud'], preferredDomains: ['AI/ML', 'Backend'], careerGoals: 'ML Engineer', phone: '9876543211', joinDate: '2022-08-01' },
  { id: 's3', name: 'Rahul Kumar', email: 'rahul@campus.edu', role: 'student', avatar: 'https://i.pravatar.cc/150?u=s3', department: 'ECE', skills: ['C++', 'Embedded', 'IoT'], interests: ['Robotics', 'VLSI'], preferredDomains: ['Hardware', 'IoT'], careerGoals: 'Embedded Engineer', phone: '9876543212', joinDate: '2022-08-01' },
  { id: 's4', name: 'Sneha Gupta', email: 'sneha@campus.edu', role: 'student', avatar: 'https://i.pravatar.cc/150?u=s4', department: 'IT', skills: ['Figma', 'UI/UX', 'HTML/CSS'], interests: ['Design', 'User Research'], preferredDomains: ['UI/UX', 'Product'], careerGoals: 'Product Designer', phone: '9876543213', joinDate: '2022-08-01' },
  { id: 's5', name: 'Vikram Rao', email: 'vikram@campus.edu', role: 'student', avatar: 'https://i.pravatar.cc/150?u=s5', department: 'CSE', skills: ['Python', 'Django', 'AWS'], interests: ['Backend', 'DevOps'], preferredDomains: ['Backend', 'Cloud'], careerGoals: 'Cloud Architect', phone: '9876543214', joinDate: '2022-08-01' },
  { id: 's6', name: 'Ananya Reddy', email: 'ananya@campus.edu', role: 'student', avatar: 'https://i.pravatar.cc/150?u=s6', department: 'CSE', skills: ['JavaScript', 'React', 'MongoDB'], interests: ['Frontend', 'Mobile'], preferredDomains: ['Frontend', 'Mobile'], careerGoals: 'Frontend Developer', phone: '9876543215', joinDate: '2023-08-01' },
  { id: 'f1', name: 'Dr. Rajesh Iyer', email: 'rajesh@campus.edu', role: 'faculty', avatar: 'https://i.pravatar.cc/150?u=f1', department: 'CSE', phone: '9876543220', joinDate: '2018-06-15' },
  { id: 'f2', name: 'Prof. Meera Nair', email: 'meera@campus.edu', role: 'faculty', avatar: 'https://i.pravatar.cc/150?u=f2', department: 'CSE', phone: '9876543221', joinDate: '2019-07-01' },
  { id: 'f3', name: 'Dr. Arun Kumar', email: 'arun@campus.edu', role: 'faculty', avatar: 'https://i.pravatar.cc/150?u=f3', department: 'ECE', phone: '9876543222', joinDate: '2017-05-20' },
  { id: 'f4', name: 'Prof. Lakshmi Menon', email: 'lakshmi@campus.edu', role: 'faculty', avatar: 'https://i.pravatar.cc/150?u=f4', department: 'IT', phone: '9876543223', joinDate: '2020-08-10' },
  { id: 'a1', name: 'Admin User', email: 'admin@campus.edu', role: 'admin', avatar: 'https://i.pravatar.cc/150?u=a1', phone: '9876543230', joinDate: '2015-01-01' },
  { id: 'st1', name: 'Ramesh Canteen', email: 'ramesh@campus.edu', role: 'staff', staffType: 'canteen', avatar: 'https://i.pravatar.cc/150?u=st1', phone: '9876543240', joinDate: '2019-03-15' },
  { id: 'st2', name: 'Suresh Library', email: 'suresh@campus.edu', role: 'staff', staffType: 'library', avatar: 'https://i.pravatar.cc/150?u=st2', phone: '9876543241', joinDate: '2018-07-20' },
  { id: 'st3', name: 'Mahesh Hostel', email: 'mahesh@campus.edu', role: 'staff', staffType: 'hostel', avatar: 'https://i.pravatar.cc/150?u=st3', phone: '9876543242', joinDate: '2020-01-10' },
  { id: 'st4', name: 'Ganesh Maintenance', email: 'ganesh@campus.edu', role: 'staff', staffType: 'maintenance', avatar: 'https://i.pravatar.cc/150?u=st4', phone: '9876543243', joinDate: '2019-11-05' },
];

// Courses
export const courses: Course[] = [
  { id: 'c1', name: 'Data Structures & Algorithms', code: 'CS201', facultyId: 'f1', facultyName: 'Dr. Rajesh Iyer', department: 'CSE', credits: 4, semester: 3, students: ['s1', 's2', 's5', 's6'], syllabusProgress: 75, totalClasses: 45, description: 'Core course on data structures and algorithms' },
  { id: 'c2', name: 'Database Management Systems', code: 'CS202', facultyId: 'f2', facultyName: 'Prof. Meera Nair', department: 'CSE', credits: 3, semester: 3, students: ['s1', 's2', 's5'], syllabusProgress: 60, totalClasses: 40, description: 'Introduction to DBMS concepts' },
  { id: 'c3', name: 'Operating Systems', code: 'CS203', facultyId: 'f1', facultyName: 'Dr. Rajesh Iyer', department: 'CSE', credits: 4, semester: 4, students: ['s1', 's2', 's5', 's6'], syllabusProgress: 50, totalClasses: 50, description: 'OS concepts and implementation' },
  { id: 'c4', name: 'Computer Networks', code: 'CS204', facultyId: 'f2', facultyName: 'Prof. Meera Nair', department: 'CSE', credits: 3, semester: 5, students: ['s1', 's2'], syllabusProgress: 40, totalClasses: 35, description: 'Networking protocols and architecture' },
  { id: 'c5', name: 'Digital Electronics', code: 'EC201', facultyId: 'f3', facultyName: 'Dr. Arun Kumar', department: 'ECE', credits: 4, semester: 3, students: ['s3'], syllabusProgress: 80, totalClasses: 42, description: 'Digital logic and circuit design' },
  { id: 'c6', name: 'Web Development', code: 'IT301', facultyId: 'f4', facultyName: 'Prof. Lakshmi Menon', department: 'IT', credits: 3, semester: 5, students: ['s4', 's6'], syllabusProgress: 65, totalClasses: 30, description: 'Full stack web development' },
];

// Attendance
export const attendance: Attendance[] = [
  { id: 'a1', studentId: 's1', courseId: 'c1', courseName: 'Data Structures & Algorithms', date: '2024-01-15', status: 'present', totalClasses: 45, attendedClasses: 38, percentage: 84.4 },
  { id: 'a2', studentId: 's1', courseId: 'c2', courseName: 'Database Management Systems', date: '2024-01-15', status: 'present', totalClasses: 40, attendedClasses: 30, percentage: 75.0 },
  { id: 'a3', studentId: 's1', courseId: 'c3', courseName: 'Operating Systems', date: '2024-01-15', status: 'absent', totalClasses: 50, attendedClasses: 35, percentage: 70.0 },
  { id: 'a4', studentId: 's2', courseId: 'c1', courseName: 'Data Structures & Algorithms', date: '2024-01-15', status: 'present', totalClasses: 45, attendedClasses: 42, percentage: 93.3 },
  { id: 'a5', studentId: 's2', courseId: 'c2', courseName: 'Database Management Systems', date: '2024-01-15', status: 'present', totalClasses: 40, attendedClasses: 38, percentage: 95.0 },
  { id: 'a6', studentId: 's3', courseId: 'c5', courseName: 'Digital Electronics', date: '2024-01-15', status: 'present', totalClasses: 42, attendedClasses: 35, percentage: 83.3 },
  { id: 'a7', studentId: 's6', courseId: 'c1', courseName: 'Data Structures & Algorithms', date: '2024-01-15', status: 'late', totalClasses: 45, attendedClasses: 32, percentage: 71.1 },
  { id: 'a8', studentId: 's6', courseId: 'c6', courseName: 'Web Development', date: '2024-01-15', status: 'present', totalClasses: 30, attendedClasses: 28, percentage: 93.3 },
];

// Assignments
export const assignments: Assignment[] = [
  {
    id: 'as1',
    courseId: 'c1',
    courseName: 'Data Structures & Algorithms',
    title: 'Implement Binary Search Tree',
    description: 'Create a BST with insert, delete, and traversal operations',
    deadline: '2024-02-10T23:59:59',
    maxMarks: 100,
    submissions: [
      { studentId: 's1', studentName: 'Aarav Sharma', submittedAt: '2024-02-09T20:30:00', marks: 85, status: 'submitted', feedback: 'Good implementation' },
      { studentId: 's2', studentName: 'Priya Patel', submittedAt: '2024-02-10T22:15:00', marks: 92, status: 'submitted', feedback: 'Excellent work!' },
    ],
    createdAt: '2024-01-25T10:00:00'
  },
  {
    id: 'as2',
    courseId: 'c2',
    courseName: 'Database Management Systems',
    title: 'SQL Query Optimization',
    description: 'Optimize given SQL queries and explain execution plan',
    deadline: '2024-02-15T23:59:59',
    maxMarks: 50,
    submissions: [
      { studentId: 's1', studentName: 'Aarav Sharma', submittedAt: '2024-02-14T18:00:00', status: 'submitted' },
    ],
    createdAt: '2024-01-28T09:00:00'
  },
  {
    id: 'as3',
    courseId: 'c1',
    courseName: 'Data Structures & Algorithms',
    title: 'Graph Algorithms Assignment',
    description: 'Implement Dijkstra and Bellman-Ford algorithms',
    deadline: '2024-02-20T23:59:59',
    maxMarks: 100,
    submissions: [],
    createdAt: '2024-02-01T11:00:00'
  },
  {
    id: 'as4',
    courseId: 'c6',
    courseName: 'Web Development',
    title: 'Build a React Todo App',
    description: 'Create a todo application with CRUD operations using React',
    deadline: '2024-02-12T23:59:59',
    maxMarks: 75,
    submissions: [
      { studentId: 's6', studentName: 'Ananya Reddy', submittedAt: '2024-02-11T15:30:00', marks: 88, status: 'submitted', feedback: 'Nice UI design' },
    ],
    createdAt: '2024-01-30T14:00:00'
  },
];

// Exam Results
export const examResults: ExamResult[] = [
  { id: 'e1', studentId: 's1', courseId: 'c1', courseName: 'Data Structures & Algorithms', examType: 'internal', marks: 42, maxMarks: 50, percentage: 84, grade: 'A', semester: 3, date: '2024-01-20' },
  { id: 'e2', studentId: 's1', courseId: 'c2', courseName: 'Database Management Systems', examType: 'internal', marks: 35, maxMarks: 50, percentage: 70, grade: 'B', semester: 3, date: '2024-01-22' },
  { id: 'e3', studentId: 's2', courseId: 'c1', courseName: 'Data Structures & Algorithms', examType: 'internal', marks: 48, maxMarks: 50, percentage: 96, grade: 'A+', semester: 3, date: '2024-01-20' },
  { id: 'e4', studentId: 's2', courseId: 'c2', courseName: 'Database Management Systems', examType: 'internal', marks: 45, maxMarks: 50, percentage: 90, grade: 'A+', semester: 3, date: '2024-01-22' },
  { id: 'e5', studentId: 's3', courseId: 'c5', courseName: 'Digital Electronics', examType: 'internal', marks: 40, maxMarks: 50, percentage: 80, grade: 'A', semester: 3, date: '2024-01-21' },
  { id: 'e6', studentId: 's6', courseId: 'c1', courseName: 'Data Structures & Algorithms', examType: 'internal', marks: 32, maxMarks: 50, percentage: 64, grade: 'B', semester: 3, date: '2024-01-20' },
  { id: 'e7', studentId: 's1', courseId: 'c1', courseName: 'Data Structures & Algorithms', examType: 'semester', marks: 78, maxMarks: 100, percentage: 78, grade: 'A', semester: 3, date: '2023-12-15' },
  { id: 'e8', studentId: 's2', courseId: 'c1', courseName: 'Data Structures & Algorithms', examType: 'semester', marks: 88, maxMarks: 100, percentage: 88, grade: 'A+', semester: 3, date: '2023-12-15' },
];

// Timetable
export const timetable: TimetableEntry[] = [
  { id: 't1', courseId: 'c1', courseName: 'Data Structures', facultyId: 'f1', facultyName: 'Dr. Rajesh Iyer', day: 'Monday', startTime: '09:00', endTime: '10:30', room: 'A-101', type: 'lecture' },
  { id: 't2', courseId: 'c2', courseName: 'DBMS', facultyId: 'f2', facultyName: 'Prof. Meera Nair', day: 'Monday', startTime: '11:00', endTime: '12:30', room: 'B-202', type: 'lecture' },
  { id: 't3', courseId: 'c1', courseName: 'DSA Lab', facultyId: 'f1', facultyName: 'Dr. Rajesh Iyer', day: 'Tuesday', startTime: '14:00', endTime: '16:00', room: 'Lab-1', type: 'lab' },
  { id: 't4', courseId: 'c3', courseName: 'Operating Systems', facultyId: 'f1', facultyName: 'Dr. Rajesh Iyer', day: 'Wednesday', startTime: '09:00', endTime: '10:30', room: 'A-102', type: 'lecture' },
  { id: 't5', courseId: 'c6', courseName: 'Web Development', facultyId: 'f4', facultyName: 'Prof. Lakshmi Menon', day: 'Wednesday', startTime: '11:00', endTime: '12:30', room: 'Lab-3', type: 'lab' },
  { id: 't6', courseId: 'c4', courseName: 'Computer Networks', facultyId: 'f2', facultyName: 'Prof. Meera Nair', day: 'Thursday', startTime: '09:00', endTime: '10:30', room: 'A-103', type: 'lecture' },
  { id: 't7', courseId: 'c2', courseName: 'DBMS Lab', facultyId: 'f2', facultyName: 'Prof. Meera Nair', day: 'Friday', startTime: '14:00', endTime: '16:00', room: 'Lab-2', type: 'lab' },
];

// Events
export const events: Event[] = [
  {
    id: 'ev1',
    title: 'Hackathon 2024',
    description: '24-hour coding competition with exciting prizes',
    clubName: 'CodeClub',
    date: '2024-02-25',
    time: '09:00',
    venue: 'Main Auditorium',
    registrationLimit: 200,
    registeredStudents: ['s1', 's2', 's5', 's6'],
    status: 'upcoming',
    createdBy: 'f1'
  },
  {
    id: 'ev2',
    title: 'AI Workshop',
    description: 'Hands-on workshop on machine learning fundamentals',
    clubName: 'AI Society',
    date: '2024-02-18',
    time: '14:00',
    venue: 'Seminar Hall',
    registrationLimit: 100,
    registeredStudents: ['s2', 's3'],
    status: 'upcoming',
    createdBy: 'f2'
  },
  {
    id: 'ev3',
    title: 'Cultural Fest',
    description: 'Annual cultural celebration with music, dance, and drama',
    clubName: 'Cultural Club',
    date: '2024-03-10',
    time: '18:00',
    venue: 'Open Air Theatre',
    registrationLimit: 500,
    registeredStudents: ['s1', 's2', 's3', 's4', 's5', 's6'],
    status: 'upcoming',
    createdBy: 'f4'
  },
  {
    id: 'ev4',
    title: 'Tech Talk: Cloud Computing',
    description: 'Industry expert session on cloud architecture',
    clubName: 'TechClub',
    date: '2024-01-20',
    time: '16:00',
    venue: 'Conference Room',
    registrationLimit: 80,
    registeredStudents: ['s1', 's5'],
    status: 'completed',
    createdBy: 'f1'
  },
];

// Lost & Found
export const lostFoundItems: LostFoundItem[] = [
  {
    id: 'lf1',
    title: 'Blue Water Bottle',
    description: 'Sky blue Milton water bottle found near library',
    locationFound: 'Library 2nd Floor',
    postedBy: 's2',
    postedByName: 'Priya Patel',
    postedAt: '2024-02-05T10:30:00',
    status: 'open',
    contactInfo: '9876543211',
    itemType: 'found'
  },
  {
    id: 'lf2',
    title: 'Black Wallet',
    description: 'Leather wallet with ID cards and some cash',
    locationFound: 'Canteen',
    postedBy: 'st1',
    postedByName: 'Ramesh Canteen',
    postedAt: '2024-02-04T14:00:00',
    status: 'resolved',
    contactInfo: '9876543240',
    itemType: 'found'
  },
  {
    id: 'lf3',
    title: 'Lost: Scientific Calculator',
    description: 'Casio FX-991ES calculator lost in Lab 1',
    locationFound: 'Lab 1',
    postedBy: 's4',
    postedByName: 'Sneha Gupta',
    postedAt: '2024-02-06T09:00:00',
    status: 'open',
    contactInfo: '9876543213',
    itemType: 'lost'
  },
];

// Placements
export const placements: Placement[] = [
  {
    id: 'p1',
    title: 'Software Engineer Intern',
    company: 'Google',
    description: '6-month internship for talented developers',
    skillsRequired: ['Python', 'Algorithms', 'System Design'],
    eligibility: { minCgpa: 8.0, departments: ['CSE', 'IT'], backlogsAllowed: false, graduationYear: 2025 },
    type: 'internship',
    location: 'Bangalore',
    stipend: '50,000/month',
    postedBy: 'f1',
    postedAt: '2024-02-01T10:00:00',
    deadline: '2024-02-28',
    applications: [
      { studentId: 's1', studentName: 'Aarav Sharma', appliedAt: '2024-02-02T11:00:00', status: 'shortlisted' },
      { studentId: 's2', studentName: 'Priya Patel', appliedAt: '2024-02-02T12:00:00', status: 'applied' },
    ]
  },
  {
    id: 'p2',
    title: 'Full Stack Developer',
    company: 'Microsoft',
    description: 'Full-time position for fresh graduates',
    skillsRequired: ['React', 'Node.js', 'Azure'],
    eligibility: { minCgpa: 7.5, departments: ['CSE', 'IT'], backlogsAllowed: false, graduationYear: 2024 },
    type: 'fulltime',
    location: 'Hyderabad',
    ctc: '15 LPA',
    postedBy: 'f2',
    postedAt: '2024-02-05T09:00:00',
    deadline: '2024-03-15',
    applications: [
      { studentId: 's5', studentName: 'Vikram Rao', appliedAt: '2024-02-06T10:00:00', status: 'applied' },
    ]
  },
  {
    id: 'p3',
    title: 'Data Science Intern',
    company: 'Amazon',
    description: '3-month internship in ML team',
    skillsRequired: ['Python', 'ML', 'SQL'],
    eligibility: { minCgpa: 7.0, departments: ['CSE', 'IT', 'ECE'], backlogsAllowed: true, graduationYear: 2025 },
    type: 'internship',
    location: 'Remote',
    stipend: '30,000/month',
    postedBy: 'f1',
    postedAt: '2024-02-07T14:00:00',
    deadline: '2024-02-25',
    applications: []
  },
];

// Problems (Real World Problem Solving)
export const problems: Problem[] = [
  {
    id: 'pr1',
    title: 'Smart Timetable Generator',
    description: 'Build an AI-powered system to generate optimal timetables',
    refinedDescription: 'Create a system that considers faculty availability, room capacity, and student preferences to generate conflict-free timetables',
    postedBy: 'f1',
    postedByName: 'Dr. Rajesh Iyer',
    department: 'CSE',
    difficulty: 'hard',
    status: 'open',
    enrolledStudents: ['s1', 's2', 's5'],
    solutions: [],
    createdAt: '2024-02-01T10:00:00',
    deadline: '2024-03-01'
  },
  {
    id: 'pr2',
    title: 'Campus Navigation App',
    description: 'Build an indoor navigation system for campus buildings',
    refinedDescription: 'Develop a mobile app that helps students navigate between buildings and find classrooms using BLE beacons',
    postedBy: 'f2',
    postedByName: 'Prof. Meera Nair',
    department: 'CSE',
    difficulty: 'medium',
    status: 'in-progress',
    enrolledStudents: ['s6'],
    solutions: [
      { studentId: 's6', studentName: 'Ananya Reddy', description: 'Implemented using React Native and indoor mapping', submittedAt: '2024-02-10T15:00:00', isSelected: false }
    ],
    createdAt: '2024-01-25T11:00:00',
    deadline: '2024-02-28'
  },
  {
    id: 'pr3',
    title: 'Automated Attendance System',
    description: 'Build a facial recognition based attendance system',
    refinedDescription: 'Create a system using OpenCV and face recognition to automatically mark attendance',
    postedBy: 'f3',
    postedByName: 'Dr. Arun Kumar',
    department: 'ECE',
    difficulty: 'hard',
    status: 'open',
    enrolledStudents: ['s3'],
    solutions: [],
    createdAt: '2024-02-05T09:00:00',
    deadline: '2024-03-15'
  },
];

// Canteen Menu
export const menuItems: MenuItem[] = [
  { id: 'm1', name: 'Masala Dosa', description: 'Crispy dosa with potato masala', price: 60, category: 'breakfast', isAvailable: true, isVeg: true },
  { id: 'm2', name: 'Idli Sambar', description: 'Soft idlis with sambar and chutney', price: 40, category: 'breakfast', isAvailable: true, isVeg: true },
  { id: 'm3', name: 'Veg Biryani', description: 'Aromatic rice with mixed vegetables', price: 80, category: 'lunch', isAvailable: true, isVeg: true },
  { id: 'm4', name: 'Chicken Biryani', description: 'Hyderabadi style chicken biryani', price: 120, category: 'lunch', isAvailable: true, isVeg: false },
  { id: 'm5', name: 'Samosa', description: 'Crispy pastry with potato filling', price: 15, category: 'snacks', isAvailable: true, isVeg: true },
  { id: 'm6', name: 'Vada Pav', description: 'Mumbai style vada pav', price: 25, category: 'snacks', isAvailable: false, isVeg: true },
  { id: 'm7', name: 'Paneer Butter Masala', description: 'Creamy paneer curry with naan', price: 100, category: 'dinner', isAvailable: true, isVeg: true },
  { id: 'm8', name: 'Dal Rice', description: 'Comfort food - dal and steamed rice', price: 50, category: 'dinner', isAvailable: true, isVeg: true },
];

// Orders - alias for canteen compatibility
export const orders: Order[] = [
  {
    id: 'o1',
    studentId: 's1',
    studentName: 'Aarav Sharma',
    items: [
      { itemId: 'm1', quantity: 1, price: 60 },
      { itemId: 'm5', quantity: 2, price: 30 }
    ],
    totalAmount: 90,
    status: 'completed',
    orderTime: '2024-02-08T08:30:00',
    pickupTime: '2024-02-08T09:00:00'
  },
  {
    id: 'o2',
    studentId: 's2',
    studentName: 'Priya Patel',
    items: [
      { itemId: 'm3', quantity: 1, price: 80 }
    ],
    totalAmount: 80,
    status: 'ready',
    orderTime: '2024-02-08T12:30:00'
  },
  {
    id: 'o3',
    studentId: 's3',
    studentName: 'Rahul Kumar',
    items: [
      { itemId: 'm4', quantity: 1, price: 120 },
      { itemId: 'm5', quantity: 1, price: 15 }
    ],
    totalAmount: 135,
    status: 'preparing',
    orderTime: '2024-02-08T12:45:00'
  },
];

// Library Books
export const books: Book[] = [
  { id: 'b1', title: 'Introduction to Algorithms', author: 'CLRS', isbn: '978-0262033848', category: 'Computer Science', totalCopies: 5, availableCopies: 2, shelfLocation: 'A-12-3', addedAt: '2020-01-15' },
  { id: 'b2', title: 'Database System Concepts', author: 'Silberschatz', isbn: '978-0073523323', category: 'Computer Science', totalCopies: 4, availableCopies: 3, shelfLocation: 'A-12-4', addedAt: '2020-02-20' },
  { id: 'b3', title: 'Operating System Concepts', author: 'Silberschatz', isbn: '978-1118063330', category: 'Computer Science', totalCopies: 6, availableCopies: 4, shelfLocation: 'A-12-5', addedAt: '2020-03-10' },
  { id: 'b4', title: 'Clean Code', author: 'Robert Martin', isbn: '978-0132350884', category: 'Software Engineering', totalCopies: 3, availableCopies: 1, shelfLocation: 'B-05-2', addedAt: '2021-01-05' },
  { id: 'b5', title: 'Design Patterns', author: 'Gang of Four', isbn: '978-0201633610', category: 'Software Engineering', totalCopies: 4, availableCopies: 2, shelfLocation: 'B-05-3', addedAt: '2021-02-15' },
];

// Book Issues
export const bookIssues: BookIssue[] = [
  { id: 'bi1', bookId: 'b1', bookTitle: 'Introduction to Algorithms', studentId: 's1', studentName: 'Aarav Sharma', issuedAt: '2024-01-15T10:00:00', dueDate: '2024-02-15', fine: 0, status: 'issued' },
  { id: 'bi2', bookId: 'b4', bookTitle: 'Clean Code', studentId: 's2', studentName: 'Priya Patel', issuedAt: '2024-01-20T11:00:00', dueDate: '2024-02-20', fine: 0, status: 'issued' },
  { id: 'bi3', bookId: 'b2', bookTitle: 'Database System Concepts', studentId: 's5', studentName: 'Vikram Rao', issuedAt: '2024-01-10T09:00:00', dueDate: '2024-02-10', returnedAt: '2024-02-08T14:00:00', fine: 0, status: 'returned' },
  { id: 'bi4', bookId: 'b3', bookTitle: 'Operating System Concepts', studentId: 's3', studentName: 'Rahul Kumar', issuedAt: '2023-12-01T10:00:00', dueDate: '2024-01-01', fine: 150, status: 'overdue' },
];

// Hostel Rooms
export const hostelRooms: HostelRoom[] = [
  { id: 'r1', roomNumber: '101', block: 'A', capacity: 2, occupied: 2, occupants: ['s1', 's2'], roomType: 'double', amenities: ['AC', 'WiFi', 'Attached Bath'] },
  { id: 'r2', roomNumber: '102', block: 'A', capacity: 2, occupied: 1, occupants: ['s3'], roomType: 'double', amenities: ['AC', 'WiFi', 'Attached Bath'] },
  { id: 'r3', roomNumber: '201', block: 'B', capacity: 3, occupied: 3, occupants: ['s4', 's5', 's6'], roomType: 'triple', amenities: ['Fan', 'WiFi', 'Common Bath'] },
  { id: 'r4', roomNumber: '202', block: 'B', capacity: 3, occupied: 0, occupants: [], roomType: 'triple', amenities: ['Fan', 'WiFi', 'Common Bath'] },
];

// Complaints
export const complaints: Complaint[] = [
  { id: 'cmp1', title: 'AC Not Working', description: 'Room 101 AC is not cooling properly', category: 'electrical', raisedBy: 's1', raisedByName: 'Aarav Sharma', roomNumber: '101', status: 'in-progress', priority: 'high', createdAt: '2024-02-05T09:00:00', assignedTo: 'st4' },
  { id: 'cmp2', title: 'Water Leakage', description: 'Bathroom tap is leaking continuously', category: 'plumbing', raisedBy: 's2', raisedByName: 'Priya Patel', roomNumber: '101', status: 'open', priority: 'medium', createdAt: '2024-02-06T10:00:00' },
  { id: 'cmp3', title: 'Broken Chair', description: 'Study chair is broken in room 201', category: 'furniture', raisedBy: 's4', raisedByName: 'Sneha Gupta', roomNumber: '201', status: 'resolved', priority: 'low', createdAt: '2024-02-01T11:00:00', resolvedAt: '2024-02-03T14:00:00', assignedTo: 'st4' },
];

// Announcements
export const announcements: Announcement[] = [
  { id: 'an1', title: 'Semester Exam Schedule', content: 'End semester exams will start from March 1st. Check the portal for detailed schedule.', postedBy: 'a1', postedByName: 'Admin User', targetAudience: 'all', createdAt: '2024-02-05T10:00:00', priority: 'high' },
  { id: 'an2', title: 'Campus Maintenance', content: 'Water supply will be interrupted on Sunday from 10 AM to 2 PM for maintenance work.', postedBy: 'a1', postedByName: 'Admin User', targetAudience: 'all', createdAt: '2024-02-07T09:00:00', priority: 'medium' },
  { id: 'an3', title: 'CSE Department Meeting', content: 'All CSE faculty are requested to attend the department meeting on Friday at 3 PM.', postedBy: 'a1', postedByName: 'Admin User', targetAudience: 'department', targetDepartment: 'CSE', createdAt: '2024-02-08T11:00:00', priority: 'medium' },
];

// AI Insights
export const aiInsights: AIInsight[] = [
  { id: 'ai1', type: 'attendance', message: 'CSE department attendance dropped by 12% this week', severity: 'warning', createdAt: '2024-02-08T10:00:00', relatedTo: 'CSE' },
  { id: 'ai2', type: 'performance', message: 'Operating Systems course has the highest failure rate at 23%', severity: 'critical', createdAt: '2024-02-07T09:00:00', relatedTo: 'c3' },
  { id: 'ai3', type: 'trend', message: '3rd year students show declining performance trend in core subjects', severity: 'warning', createdAt: '2024-02-06T14:00:00' },
  { id: 'ai4', type: 'placement', message: '15 new internship opportunities match student profiles', severity: 'info', createdAt: '2024-02-08T08:00:00' },
  { id: 'ai5', type: 'attendance', message: 'Student Aarav Sharma is at risk - attendance below 75% in 2 courses', severity: 'critical', createdAt: '2024-02-08T12:00:00', relatedTo: 's1' },
];

// Chat Messages (Sample AI Conversation)
export const sampleChatMessages: ChatMessage[] = [
  { id: 'cm1', sender: 'user', message: 'Which lectures should I prioritize this week?', timestamp: '2024-02-08T10:00:00' },
  { id: 'cm2', sender: 'ai', message: 'Based on your attendance and upcoming assessments, I recommend prioritizing:\n\n1. Operating Systems (attendance at 70%)\n2. Database Management (assignment due Feb 15)\n\nYour DSA attendance is good at 84%.', timestamp: '2024-02-08T10:00:05', suggestions: ['Show my attendance', 'View assignments', 'Am I at risk?'] },
  { id: 'cm3', sender: 'user', message: 'Am I at risk?', timestamp: '2024-02-08T10:01:00' },
  { id: 'cm4', sender: 'ai', message: 'Yes, you are at MEDIUM RISK.\n\n⚠️ Operating Systems: 70% attendance (below 75% threshold)\n⚠️ If you miss 2 more DSA classes, attendance will drop to 75%\n\nRecommendations:\n- Attend all OS classes this week\n- Submit DBMS assignment before deadline\n- Review DSA topics for upcoming quiz', timestamp: '2024-02-08T10:01:05', suggestions: ['What skills should I improve?', 'Show placement opportunities'] },
];

// Dashboard Stats
export const dashboardStats: DashboardStats = {
  totalStudents: 1245,
  totalFaculty: 78,
  totalCourses: 156,
  avgAttendance: 82.5,
  atRiskStudents: 45,
  placementRate: 87.3
};

// Helper functions
export const getStudentCourses = (studentId: string) => {
  return courses.filter(c => c.students.includes(studentId));
};

export const getStudentAttendance = (studentId: string) => {
  return attendance.filter(a => a.studentId === studentId);
};

export const getStudentAssignments = (studentId: string) => {
  return assignments.filter(a => {
    const course = courses.find(c => c.id === a.courseId);
    return course?.students.includes(studentId);
  });
};

export const getStudentResults = (studentId: string) => {
  return examResults.filter(e => e.studentId === studentId);
};

export const getStudentTimetable = (studentId: string) => {
  const studentCourses = getStudentCourses(studentId).map(c => c.id);
  return timetable.filter(t => studentCourses.includes(t.courseId));
};

export const calculateGPA = (studentId: string) => {
  const results = examResults.filter(e => e.studentId === studentId && e.examType === 'semester');
  if (results.length === 0) return 0;
  const totalPoints = results.reduce((sum, r) => sum + (r.percentage / 10), 0);
  return (totalPoints / results.length).toFixed(2);
};

// Aliases for enhanced compatibility
export const foodMenuItems = menuItems;
export const canteenOrders = orders;
