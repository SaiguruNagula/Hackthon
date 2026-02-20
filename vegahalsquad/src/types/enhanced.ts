// Enhanced Types for AI-Powered Smart Campus Platform

export interface StudentProfile {
  studentId: string;
  skills: string[];
  interests: string[];
  preferredDomains: string[];
  careerGoals: string;
  cgpa: number;
  attendanceRate: number;
  assignmentCompletionRate: number;
  skillGrowth: SkillGrowth[];
}

export interface SkillGrowth {
  skill: string;
  level: number; // 1-10
  history: { date: string; level: number }[];
}

export interface AIMatchResult {
  placementId: string;
  studentId: string;
  matchScore: number; // 0-100
  matchReasons: string[];
  skillGaps: string[];
  recommendations: string[];
  createdAt: string;
}

export interface AcademicHealth {
  studentId: string;
  overallScore: number; // 0-100
  attendanceScore: number;
  performanceScore: number;
  assignmentScore: number;
  skillScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  riskFactors: string[];
  suggestions: string[];
  lastUpdated: string;
}

export interface RealWorldProblem {
  id: string;
  title: string;
  description: string;
  refinedDescription?: string;
  postedBy: string;
  postedByName: string;
  department: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'open' | 'in-progress' | 'completed';
  requiredSkills: string[];
  enrolledStudents: string[];
  solutions: ProblemSolution[];
  createdAt: string;
  deadline?: string;
  maxSubmissions?: number;
  reward?: string;
}

export interface ProblemSolution {
  id: string;
  studentId: string;
  studentName: string;
  description: string;
  fileUrl?: string;
  codeUrl?: string;
  submittedAt: string;
  isSelected: boolean;
  feedback?: string;
  rating?: number;
}

export interface StudentProblem {
  id: string;
  title: string;
  description: string;
  postedBy: string;
  postedByName: string;
  studentAvatar?: string;
  subject: string;
  facultyId?: string;
  attachments: string[];
  status: 'open' | 'in-review' | 'resolved';
  solution?: FacultySolution;
  createdAt: string;
  resolvedAt?: string;
}

export interface FacultySolution {
  description: string;
  fileUrl?: string;
  providedBy: string;
  providedByName: string;
  providedAt: string;
}

export interface NetworkNode {
  id: string;
  type: 'student' | 'faculty' | 'course' | 'club' | 'placement';
  label: string;
  data: Record<string, any>;
  health?: 'good' | 'warning' | 'critical';
}

export interface NetworkEdge {
  source: string;
  target: string;
  type: 'enrolled' | 'teaches' | 'member' | 'applied' | 'matched';
  weight?: number;
  health?: 'good' | 'warning' | 'critical';
}

export interface BroadcastNotification {
  id: string;
  title: string;
  content: string;
  postedBy: string;
  postedByName: string;
  targetAudience: 'all' | 'students' | 'faculty' | 'staff' | 'department';
  targetDepartment?: string;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  createdAt: string;
  expiresAt?: string;
  readBy: string[];
}

export interface SystemMetrics {
  timestamp: string;
  activeUsers: number;
  totalRequests: number;
  avgResponseTime: number;
  errorRate: number;
  cpuUsage: number;
  memoryUsage: number;
  databaseConnections: number;
  apiHealth: 'healthy' | 'degraded' | 'critical';
}

export interface CanteenOrderItem {
  itemId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface CanteenOrder {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  items: CanteenOrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  orderTime: string;
  estimatedReadyTime?: string;
  deliveredAt?: string;
  specialInstructions?: string;
}

export interface FoodMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'breakfast' | 'lunch' | 'snacks' | 'dinner' | 'beverages';
  isAvailable: boolean;
  isVeg: boolean;
  imageUrl?: string;
  preparationTime: number; // minutes
  rating: number;
  orderCount: number;
}

export interface FacultyQuickAction {
  id: string;
  label: string;
  icon: string;
  color: string;
  action: () => void;
}

export interface AIInsight {
  id: string;
  type: 'attendance' | 'performance' | 'placement' | 'trend' | 'skill' | 'risk';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  relatedTo?: string;
  createdAt: string;
  actions?: { label: string; action: string }[];
}
