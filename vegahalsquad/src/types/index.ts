// CampuSync - Type Definitions

export type UserRole = 'student' | 'faculty' | 'admin' | 'staff';
export type StaffType = 'canteen' | 'library' | 'hostel' | 'maintenance' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  skills?: string[];
  interests?: string[];
  preferredDomains?: string[];
  careerGoals?: string;
  staffType?: StaffType;
  phone?: string;
  joinDate: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  facultyId: string;
  facultyName: string;
  department: string;
  credits: number;
  semester: number;
  students: string[];
  syllabusProgress: number;
  totalClasses: number;
  description?: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  courseId: string;
  courseName: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  description: string;
  deadline: string;
  maxMarks: number;
  submissions: Submission[];
  resources?: string[];
  createdAt: string;
}

export interface Submission {
  studentId: string;
  studentName: string;
  submittedAt: string;
  fileUrl?: string;
  marks?: number;
  status: 'submitted' | 'late' | 'pending';
  feedback?: string;
}

export interface ExamResult {
  id: string;
  studentId: string;
  courseId: string;
  courseName: string;
  examType: 'internal' | 'semester' | 'quiz';
  marks: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  semester: number;
  date: string;
}

export interface TimetableEntry {
  id: string;
  courseId: string;
  courseName: string;
  facultyId: string;
  facultyName: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  type: 'lecture' | 'lab' | 'tutorial';
}

export interface Event {
  id: string;
  title: string;
  description: string;
  clubName: string;
  posterUrl?: string;
  date: string;
  time: string;
  venue: string;
  registrationLimit: number;
  registeredStudents: string[];
  status: 'upcoming' | 'ongoing' | 'completed';
  createdBy: string;
}

export interface LostFoundItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  locationFound: string;
  postedBy: string;
  postedByName: string;
  postedAt: string;
  status: 'open' | 'resolved';
  contactInfo: string;
  itemType: 'lost' | 'found';
}

export interface Placement {
  id: string;
  title: string;
  company: string;
  description: string;
  skillsRequired: string[];
  eligibility: {
    minCgpa?: number;
    departments?: string[];
    backlogsAllowed?: boolean;
    graduationYear?: number;
  };
  type: 'internship' | 'fulltime';
  location: string;
  ctc?: string;
  stipend?: string;
  postedBy: string;
  postedAt: string;
  deadline: string;
  applications: PlacementApplication[];
}

export interface PlacementApplication {
  studentId: string;
  studentName: string;
  appliedAt: string;
  status: 'applied' | 'shortlisted' | 'rejected' | 'selected';
  resumeUrl?: string;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  refinedDescription?: string;
  postedBy: string;
  postedByName: string;
  department: string;
  subject?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'open' | 'in-progress' | 'completed';
  enrolledStudents: string[];
  solutions: Solution[];
  createdAt: string;
  deadline?: string;
  reward?: string;
  requiredSkills: string[];
}

export interface Solution {
  studentId: string;
  studentName: string;
  description: string;
  fileUrl?: string;
  submittedAt: string;
  isSelected: boolean;
  feedback?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'breakfast' | 'lunch' | 'snacks' | 'dinner' | 'beverages';
  isAvailable: boolean;
  imageUrl?: string;
  isVeg: boolean;
  preparationTime?: number;
  rating?: number;
  orderCount?: number;
}

export interface Order {
  id: string;
  studentId: string;
  userId?: string;
  studentName: string;
  userName?: string;
  userRole?: string;
  items: { itemId: string; name?: string; quantity: number; price: number }[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'delivered' | 'cancelled';
  orderTime: string;
  pickupTime?: string;
  estimatedReadyTime?: string;
  deliveredAt?: string;
  specialInstructions?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  shelfLocation: string;
  addedAt: string;
}

export interface BookIssue {
  id: string;
  bookId: string;
  bookTitle: string;
  studentId: string;
  studentName: string;
  issuedAt: string;
  dueDate: string;
  returnedAt?: string;
  fine: number;
  status: 'issued' | 'returned' | 'overdue';
}

export interface HostelRoom {
  id: string;
  roomNumber: string;
  block: string;
  capacity: number;
  occupied: number;
  occupants: string[];
  roomType: 'single' | 'double' | 'triple';
  amenities: string[];
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: 'electrical' | 'plumbing' | 'furniture' | 'cleaning' | 'other';
  raisedBy: string;
  raisedByName: string;
  roomNumber?: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  resolvedAt?: string;
  assignedTo?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  postedBy: string;
  postedByName: string;
  targetAudience: 'all' | 'students' | 'faculty' | 'department';
  targetDepartment?: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high' | 'emergency';
}

export interface AIInsight {
  id: string;
  type: 'attendance' | 'performance' | 'placement' | 'trend';
  message: string;
  severity: 'info' | 'warning' | 'critical';
  createdAt: string;
  relatedTo?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  message: string;
  timestamp: string;
  suggestions?: string[];
}

export interface DashboardStats {
  totalStudents: number;
  totalFaculty: number;
  totalCourses: number;
  avgAttendance: number;
  atRiskStudents: number;
  placementRate: number;
}
