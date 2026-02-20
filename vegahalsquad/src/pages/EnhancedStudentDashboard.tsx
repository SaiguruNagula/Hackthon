// Enhanced Student Dashboard - AI-Powered Smart Campus Platform
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, Calendar, ClipboardList, Award, Clock,
  Briefcase, CalendarDays, Bot, Utensils,
  LogOut, Bell, Moon, Sun, AlertCircle,
  CheckCircle, Plus, Send, Search,
  MapPin, Phone, Download,
  Users, Sparkles, Heart, Lightbulb,
  HelpCircle, Minus, Shield,
  MoreHorizontal, X, Wallet
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import AIMatchingSystem from '@/components/ai/AIMatchingSystem';
import AcademicHealthScore from '@/components/ai/AcademicHealthScore';
import {
  events, lostFoundItems, placements, foodMenuItems, canteenOrders,
  getStudentCourses, getStudentAttendance, getStudentAssignments, getStudentResults,
  getStudentTimetable, calculateGPA
} from '@/data/dummyData';
import {
  realWorldProblems, studentProblems, aiMatchResults,
  academicHealthData, broadcastNotifications
} from '@/data/enhancedDummyData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { useData } from '@/contexts/DataContext';
import { useAIConfig } from '@/contexts/AIConfigContext';
import { getAIResponse, generateSystemPrompt } from '@/lib/aiService';

type TabType = 'dashboard' | 'courses' | 'attendance' | 'assignments' | 'results' | 'timetable' | 'placement' | 'events' | 'lostfound' | 'problems' | 'askfaculty' | 'aiassistant' | 'canteen' | 'aisettings';

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'courses', label: 'My Courses', icon: BookOpen },
  { id: 'attendance', label: 'Attendance', icon: Calendar },
  { id: 'assignments', label: 'Assignments', icon: ClipboardList },
  { id: 'results', label: 'Results', icon: Award },
  { id: 'timetable', label: 'Timetable', icon: Clock },
  { id: 'placement', label: 'Placement', icon: Briefcase },
  { id: 'events', label: 'Events', icon: CalendarDays },
  { id: 'lostfound', label: 'Lost & Found', icon: Search },
  { id: 'problems', label: 'Problem Solving', icon: Lightbulb },
  { id: 'askfaculty', label: 'Ask Faculty', icon: HelpCircle },
  { id: 'aiassistant', label: 'AI Assistant', icon: Bot },
  { id: 'canteen', label: 'Canteen', icon: Utensils },
  { id: 'aisettings', label: 'AI Settings', icon: Shield },
];

const EnhancedStudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { announcements } = useData();
  const { apiKey, provider, setApiKey, setProvider } = useAIConfig();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications] = useState(broadcastNotifications.filter(n => !n.readBy.includes(user?.id || '')));

  // Modal states
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [showAskModal, setShowAskModal] = useState(false);
  const [showLostFoundModal, setShowLostFoundModal] = useState(false);
  const [showEventRegisterModal, setShowEventRegisterModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null);

  // Lost & Found state
  const [lostFoundItemsState, setLostFoundItemsState] = useState(lostFoundItems);
  const [lostFoundForm, setLostFoundForm] = useState({
    itemType: 'lost' as 'lost' | 'found',
    title: '',
    description: '',
    locationFound: '',
    image: null as File | null,
    imagePreview: null as string | null
  });

  // Cart state for canteen
  const [cart, setCart] = useState<{ item: typeof foodMenuItems[0]; quantity: number }[]>([]);

  // Chat state for AI assistant
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'ai'; message: string; timestamp: Date }[]>([
    { sender: 'ai', message: 'Hello! I am your AI Academic Assistant. How can I help you today?', timestamp: new Date() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const studentCourses = user ? getStudentCourses(user.id) : [];
  const studentAttendance = user ? getStudentAttendance(user.id) : [];
  const studentAssignments = user ? getStudentAssignments(user.id) : [];
  const studentResults = user ? getStudentResults(user.id) : [];
  const studentTimetable = user ? getStudentTimetable(user.id) : [];
  const studentHealth = user ? academicHealthData.find(h => h.studentId === user.id) : null;
  const myOrders = user ? canteenOrders.filter(o => o.userId === user.id) : [];

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const addToCart = (item: typeof foodMenuItems[0]) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id);
      if (existing) {
        return prev.map(c => c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { item, quantity: 1 }];
    });
    toast.success(`Added ${item.name} to cart`);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(c => c.item.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => prev.map(c => c.item.id === itemId ? { ...c, quantity } : c));
  };

  const getCartTotal = () => {
    return cart.reduce((total, c) => total + c.item.price * c.quantity, 0);
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    toast.success('Order placed successfully!');
    setCart([]);
    setShowOrderModal(false);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', message: userMessage, timestamp: new Date() }]);
    setChatInput('');

    if (!apiKey) {
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          sender: 'ai',
          message: "I need an API key to provide real answers. Please go to the AI Settings tab to configure your OpenAI or Grok API key.",
          timestamp: new Date()
        }]);
      }, 500);
      return;
    }

    setIsLoadingAI(true);
    try {
      const contextData = {
        student: user,
        courses: studentCourses,
        attendance: studentAttendance,
        assignments: studentAssignments,
        upcomingEvents: events.filter(e => e.status === 'upcoming'),
        announcements: announcements.slice(0, 5)
      };

      const systemPrompt = generateSystemPrompt('Student', contextData);
      const messages = [
        { role: 'system' as const, content: systemPrompt },
        ...chatMessages.map(m => ({
          role: (m.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
          content: m.message
        })),
        { role: 'user' as const, content: userMessage }
      ];

      const aiResponse = await getAIResponse(messages, apiKey, provider);
      setChatMessages(prev => [...prev, { sender: 'ai', message: aiResponse, timestamp: new Date() }]);
    } catch (error: any) {
      toast.error('AI Error: ' + error.message);
      setChatMessages(prev => [...prev, { sender: 'ai', message: "Sorry, I encountered an error. Please check your API key and connection.", timestamp: new Date() }]);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleRegisterForEvent = (event: typeof events[0]) => {
    setSelectedEvent(event);
    setShowEventRegisterModal(true);
  };

  const confirmEventRegistration = () => {
    if (selectedEvent) {
      toast.success(`Successfully registered for ${selectedEvent.title}!`);
      setShowEventRegisterModal(false);
      setSelectedEvent(null);
    }
  };

  // Render functions for each tab
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
            <p className="text-white/80">Here's what's happening in your academic journey today.</p>
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm">{studentCourses.length} Courses</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span className="text-sm">GPA: {user ? calculateGPA(user.id) : '0'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{studentAttendance.length > 0 ? Math.round(studentAttendance.reduce((sum, a) => sum + a.percentage, 0) / studentAttendance.length) : 0}% Attendance</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <Sparkles className="w-24 h-24 text-white/20" />
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Pending Assignments', value: studentAssignments.filter(a => !a.submissions.find(s => s.studentId === user?.id)).length, icon: ClipboardList, color: 'blue' },
          { label: 'Upcoming Events', value: events.filter(e => e.status === 'upcoming').length, icon: CalendarDays, color: 'purple' },
          { label: 'Placement Matches', value: aiMatchResults.filter(m => m.studentId === user?.id).length, icon: Briefcase, color: 'emerald' },
          { label: 'Active Problems', value: realWorldProblems.filter(p => p.status === 'open').length, icon: Lightbulb, color: 'amber' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4"
          >
            <div className="flex items-center gap-3">
              <div className={`p-3 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-xl`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Academic Health & AI Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Academic Health
            </h3>
            <button
              onClick={() => setActiveTab('aiassistant')}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              View Details
            </button>
          </div>
          {studentHealth ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                    <circle
                      cx="48" cy="48" r="40"
                      stroke="currentColor" strokeWidth="8" fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - studentHealth.overallScore / 100)}`}
                      className={studentHealth.riskLevel === 'low' ? 'text-emerald-500' : studentHealth.riskLevel === 'medium' ? 'text-amber-500' : 'text-red-500'}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-slate-900 dark:text-white">{studentHealth.overallScore}</span>
                  </div>
                </div>
                <div>
                  <p className={`text-lg font-semibold ${studentHealth.riskLevel === 'low' ? 'text-emerald-500' : studentHealth.riskLevel === 'medium' ? 'text-amber-500' : 'text-red-500'}`}>
                    {studentHealth.riskLevel === 'low' ? 'Healthy' : studentHealth.riskLevel === 'medium' ? 'At Risk' : 'Critical'}
                  </p>
                  <p className="text-sm text-slate-500">Overall Score</p>
                </div>
              </div>
              {studentHealth.riskFactors.length > 0 && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    <AlertCircle className="w-4 h-4 inline mr-1" />
                    {studentHealth.riskFactors[0]}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-slate-500">No health data available</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              AI Job Matches
            </h3>
            <button
              onClick={() => setActiveTab('placement')}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {aiMatchResults.filter(m => m.studentId === user?.id).slice(0, 2).map(match => {
              const placement = placements.find(p => p.id === match.placementId);
              if (!placement) return null;
              return (
                <div key={match.placementId} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{placement.title}</p>
                    <p className="text-sm text-slate-500">{placement.company}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${match.matchScore >= 80 ? 'text-emerald-500' : match.matchScore >= 60 ? 'text-blue-500' : 'text-amber-500'}`}>
                      {match.matchScore}%
                    </p>
                    <p className="text-xs text-slate-500">Match</p>
                  </div>
                </div>
              );
            })}
            {aiMatchResults.filter(m => m.studentId === user?.id).length === 0 && (
              <p className="text-slate-500 text-center py-4">No job matches yet</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Today's Classes & Upcoming Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Today's Classes
          </h3>
          <div className="space-y-3">
            {studentTimetable.filter(t => t.day === new Date().toLocaleDateString('en-US', { weekday: 'long' })).length > 0 ? (
              studentTimetable
                .filter(t => t.day === new Date().toLocaleDateString('en-US', { weekday: 'long' }))
                .map((cls, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div className="text-center min-w-[60px]">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{cls.startTime}</p>
                      <p className="text-xs text-slate-500">{cls.endTime}</p>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-white">{cls.courseName}</p>
                      <p className="text-sm text-slate-500">{cls.room} • {cls.facultyName}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${cls.type === 'lab' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {cls.type}
                    </span>
                  </div>
                ))
            ) : (
              <p className="text-slate-500 text-center py-4">No classes scheduled for today</p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-amber-500" />
            Upcoming Assignments
          </h3>
          <div className="space-y-3">
            {studentAssignments
              .filter(a => !a.submissions.find(s => s.studentId === user?.id))
              .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
              .slice(0, 3)
              .map(assignment => {
                const daysLeft = Math.ceil((new Date(assignment.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={assignment.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{assignment.title}</p>
                      <p className="text-sm text-slate-500">{assignment.courseName}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${daysLeft <= 2 ? 'text-red-500' : daysLeft <= 5 ? 'text-amber-500' : 'text-emerald-500'}`}>
                        {daysLeft} days left
                      </p>
                      <p className="text-xs text-slate-500">{new Date(assignment.deadline).toLocaleDateString()}</p>
                    </div>
                  </div>
                );
              })}
            {studentAssignments.filter(a => !a.submissions.find(s => s.studentId === user?.id)).length === 0 && (
              <p className="text-slate-500 text-center py-4">No pending assignments!</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Courses</h2>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            {studentCourses.length} Courses
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {studentCourses.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{course.name}</h3>
                <p className="text-sm text-slate-500">{course.code} • {course.credits} Credits</p>
              </div>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                Sem {course.semester}
              </span>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{course.description}</p>

            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-500">{course.students.length} students enrolled</span>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-slate-500">Syllabus Progress</span>
                <span className="text-slate-900 dark:text-white font-medium">{course.syllabusProgress}%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${course.syllabusProgress}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full bg-blue-500 rounded-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex-1">
                <p className="text-xs text-slate-500">Faculty</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{course.facultyName}</p>
              </div>
              <button
                onClick={() => toast.info('Course materials coming soon!')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                View Materials
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderAttendance = () => {
    const attendanceData = studentAttendance.map(a => ({
      name: a.courseName.split(' ').slice(0, 2).join(' '),
      percentage: a.percentage,
      attended: a.attendedClasses,
      total: a.totalClasses
    }));

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Attendance</h2>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
              {Math.round(studentAttendance.reduce((sum, a) => sum + a.percentage, 0) / studentAttendance.length || 0)}% Avg
            </span>
          </div>
        </div>

        {/* Attendance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Attendance Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#fff', border: 'none', borderRadius: '8px' }}
                  formatter={(value: number) => [`${value}%`, 'Attendance']}
                />
                <Bar dataKey="percentage" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Detailed Attendance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studentAttendance.map((att, i) => (
            <motion.div
              key={att.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-slate-900 dark:text-white">{att.courseName}</h4>
                <span className={`px-2 py-1 rounded-full text-xs ${att.percentage >= 75 ? 'bg-emerald-100 text-emerald-700' :
                  att.percentage >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                  }`}>
                  {att.percentage >= 75 ? 'Good' : att.percentage >= 60 ? 'Warning' : 'At Risk'}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-500">Classes Attended</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{att.attendedClasses} / {att.totalClasses}</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${att.percentage >= 75 ? 'bg-emerald-500' : att.percentage >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${att.percentage}%` }}
                />
              </div>
              <p className="text-right text-sm font-medium mt-2" style={{ color: att.percentage >= 75 ? '#10b981' : att.percentage >= 60 ? '#f59e0b' : '#ef4444' }}>
                {att.percentage}%
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderAssignments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Assignments</h2>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
            {studentAssignments.filter(a => !a.submissions.find(s => s.studentId === user?.id)).length} Pending
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {studentAssignments.map((assignment, i) => {
          const submission = assignment.submissions.find(s => s.studentId === user?.id);
          const daysLeft = Math.ceil((new Date(assignment.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          const isOverdue = daysLeft < 0;

          return (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{assignment.title}</h3>
                    {submission ? (
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                        Submitted
                      </span>
                    ) : isOverdue ? (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                        Overdue
                      </span>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs ${daysLeft <= 2 ? 'bg-red-100 text-red-700' : daysLeft <= 5 ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                        {daysLeft} days left
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mb-2">{assignment.courseName}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{assignment.description}</p>

                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Calendar className="w-4 h-4" />
                      Due: {new Date(assignment.deadline).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Award className="w-4 h-4" />
                      Max Marks: {assignment.maxMarks}
                    </span>
                  </div>

                  {submission && (
                    <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
                      <p className="text-sm text-emerald-700 dark:text-emerald-400">
                        <CheckCircle className="w-4 h-4 inline mr-1" />
                        Submitted on {new Date(submission.submittedAt).toLocaleDateString()}
                        {submission.marks !== undefined && ` • Marks: ${submission.marks}/${assignment.maxMarks}`}
                      </p>
                      {submission.feedback && (
                        <p className="text-sm text-emerald-600 mt-1">Feedback: {submission.feedback}</p>
                      )}
                    </div>
                  )}
                </div>

                {!submission && (
                  <button
                    onClick={() => toast.success('Assignment submitted successfully!')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    Submit
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const renderResults = () => {
    const resultsBySemester = studentResults.reduce((acc, result) => {
      if (!acc[result.semester]) acc[result.semester] = [];
      acc[result.semester].push(result);
      return acc;
    }, {} as Record<number, typeof studentResults>);

    const gradeDistribution = studentResults.reduce((acc, result) => {
      acc[result.grade] = (acc[result.grade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const pieData = Object.entries(gradeDistribution).map(([grade, count]) => ({
      name: grade,
      value: count,
      color: grade.startsWith('A') ? '#10b981' : grade.startsWith('B') ? '#3b82f6' : grade.startsWith('C') ? '#f59e0b' : '#ef4444'
    }));

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Academic Results</h2>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              GPA: {user ? calculateGPA(user.id) : '0'}
            </span>
          </div>
        </div>

        {/* Grade Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Grade Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-slate-600">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Results by Semester */}
        {Object.entries(resultsBySemester).sort((a, b) => Number(b[0]) - Number(a[0])).map(([semester, results]) => (
          <motion.div
            key={semester}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Semester {semester}</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Course</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Type</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-slate-500">Marks</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-slate-500">Percentage</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-slate-500">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result.id} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-3 px-4 text-sm text-slate-900 dark:text-white">{result.courseName}</td>
                      <td className="py-3 px-4 text-sm text-slate-500 capitalize">{result.examType}</td>
                      <td className="py-3 px-4 text-sm text-center text-slate-900 dark:text-white">{result.marks}/{result.maxMarks}</td>
                      <td className="py-3 px-4 text-sm text-center text-slate-900 dark:text-white">{result.percentage}%</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${result.grade.startsWith('A') ? 'bg-emerald-100 text-emerald-700' :
                          result.grade.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                            result.grade.startsWith('C') ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                          }`}>
                          {result.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderTimetable = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = ['09:00', '10:30', '12:00', '14:00', '15:30'];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Class Timetable</h2>
          <button
            onClick={() => toast.info('Download feature coming soon!')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800">
                  <th className="py-4 px-4 text-left text-sm font-medium text-slate-500">Time / Day</th>
                  {days.map(day => (
                    <th key={day} className="py-4 px-4 text-center text-sm font-medium text-slate-500">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(time => (
                  <tr key={time} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="py-4 px-4 text-sm font-medium text-slate-900 dark:text-white">{time}</td>
                    {days.map(day => {
                      const cls = studentTimetable.find(t => t.day === day && t.startTime === time);
                      return (
                        <td key={`${day}-${time}`} className="py-2 px-2">
                          {cls ? (
                            <div className={`p-3 rounded-lg ${cls.type === 'lab' ? 'bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800' : 'bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800'}`}>
                              <p className="text-xs font-medium text-slate-900 dark:text-white">{cls.courseName}</p>
                              <p className="text-xs text-slate-500">{cls.room}</p>
                              <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs ${cls.type === 'lab' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                {cls.type}
                              </span>
                            </div>
                          ) : (
                            <div className="h-16"></div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* List View */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studentTimetable.map((cls, i) => (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white">{cls.courseName}</h4>
                  <p className="text-sm text-slate-500">{cls.facultyName}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${cls.type === 'lab' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                  {cls.type}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {cls.day}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {cls.startTime} - {cls.endTime}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {cls.room}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderPlacement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Placement Opportunities</h2>
      </div>

      <AIMatchingSystem />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">All Opportunities</h3>
        {placements.map((placement, i) => (
          <motion.div
            key={placement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{placement.title}</h3>
                  <span className={`px-2 py-1 rounded-lg text-xs ${placement.type === 'internship' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                    {placement.type}
                  </span>
                </div>
                <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">{placement.company}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{placement.description}</p>

                <div className="flex flex-wrap gap-4 text-sm mb-4">
                  <span className="flex items-center gap-1 text-slate-500">
                    <MapPin className="w-4 h-4" />
                    {placement.location}
                  </span>
                  {placement.ctc && (
                    <span className="flex items-center gap-1 text-slate-500">
                      <Wallet className="w-4 h-4" />
                      CTC: {placement.ctc}
                    </span>
                  )}
                  {placement.stipend && (
                    <span className="flex items-center gap-1 text-slate-500">
                      <Wallet className="w-4 h-4" />
                      Stipend: {placement.stipend}
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-sm text-slate-500 mb-2">Required Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {placement.skillsRequired.map((skill, j) => (
                      <span key={j} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span>Min CGPA: {placement.eligibility.minCgpa}</span>
                  <span>Deadline: {new Date(placement.deadline).toLocaleDateString()}</span>
                </div>
              </div>

              <button
                onClick={() => toast.success('Applied successfully!')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderEvents = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Campus Events</h2>
        <button
          onClick={() => toast.info('Event creation coming soon!')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event, i) => {
          const isRegistered = event.registeredStudents.includes(user?.id || '');
          const isFull = event.registeredStudents.length >= event.registrationLimit;

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                    {event.clubName}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs ${event.status === 'upcoming' ? 'bg-emerald-100 text-emerald-700' :
                    event.status === 'ongoing' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                    {event.status}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{event.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{event.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="w-4 h-4" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock className="w-4 h-4" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <MapPin className="w-4 h-4" />
                    {event.venue}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-500">
                      {event.registeredStudents.length} / {event.registrationLimit} registered
                    </span>
                  </div>

                  {isRegistered ? (
                    <span className="flex items-center gap-1 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Registered
                    </span>
                  ) : isFull ? (
                    <span className="px-4 py-2 bg-slate-100 text-slate-500 rounded-lg text-sm cursor-not-allowed">
                      Full
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRegisterForEvent(event)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                    >
                      Register
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const renderLostFound = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Lost & Found</h2>
        <button
          onClick={() => {
            setLostFoundForm({
              itemType: 'lost',
              title: '',
              description: '',
              locationFound: '',
              image: null,
              imagePreview: null
            });
            setShowLostFoundModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Report Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lostFoundItemsState.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            {item.imageUrl && (
              <div className="w-full h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs ${item.itemType === 'lost' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                    {item.itemType === 'lost' ? 'Lost' : 'Found'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs ${item.status === 'open' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                    {item.status === 'open' ? 'Open' : 'Resolved'}
                  </span>
                </div>
                <span className="text-sm text-slate-500">
                  {new Date(item.postedAt).toLocaleDateString()}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{item.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <MapPin className="w-4 h-4" />
                  {item.locationFound}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Users className="w-4 h-4" />
                  Posted by: {item.postedByName}
                </div>
              </div>

              {item.status === 'open' && (
                <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => toast.info('Contact info: ' + item.contactInfo)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Contact
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderProblemSolving = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Real World Problem Solving</h2>
          <p className="text-sm text-slate-500 mt-1">Problems posted by faculty for students to solve</p>
        </div>
        {/* Only show Post button for faculty/admin, not for students */}
        {user?.role !== 'student' && (
          <button
            onClick={() => setShowProblemModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Post a Problem
          </button>
        )}
      </div>

      <div className="space-y-4">
        {realWorldProblems.length === 0 ? (
          <div className="text-center py-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="text-slate-500">No problems posted yet. Check back later!</p>
          </div>
        ) : (
          realWorldProblems.map((problem, i) => {
            const isEnrolled = problem.enrolledStudents.includes(user?.id || '');

            return (
              <motion.div
                key={problem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{problem.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${problem.difficulty === 'easy' ? 'bg-emerald-100 text-emerald-700' :
                        problem.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {problem.difficulty}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${problem.status === 'open' ? 'bg-blue-100 text-blue-700' :
                        problem.status === 'in-progress' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                        {problem.status}
                      </span>
                    </div>

                    <p className="text-sm text-slate-500 mb-2">Posted by: {problem.postedByName} • {problem.department}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{problem.refinedDescription || problem.description}</p>

                    <div className="mb-4">
                      <p className="text-sm text-slate-500 mb-2">Required Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {problem.requiredSkills.map((skill, j) => (
                          <span key={j} className="px-3 py-1 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 rounded-full text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {problem.enrolledStudents.length} enrolled
                      </span>
                      {problem.deadline && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Deadline: {new Date(problem.deadline).toLocaleDateString()}
                        </span>
                      )}
                      {problem.reward && (
                        <span className="flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          {problem.reward}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {isEnrolled ? (
                      <span className="flex items-center gap-1 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Enrolled
                      </span>
                    ) : (
                      <button
                        onClick={() => toast.success('Enrolled successfully!')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                      >
                        Enroll
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          }))}
      </div>
    </div>
  );

  const renderAskFaculty = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Ask Faculty</h2>
        <button
          onClick={() => setShowAskModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ask Question
        </button>
      </div>

      <div className="space-y-4">
        {studentProblems.map((problem, i) => (
          <motion.div
            key={problem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
          >
            <div className="flex items-start gap-4">
              <img
                src={problem.studentAvatar || `https://i.pravatar.cc/150?u=${problem.postedBy}`}
                alt={problem.postedByName}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{problem.title}</h4>
                    <p className="text-sm text-slate-500">{problem.postedByName} • {problem.subject}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs ${problem.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                    problem.status === 'in-review' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                    {problem.status}
                  </span>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{problem.description}</p>

                {problem.solution && (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                        Answer from {problem.solution.providedByName}
                      </span>
                    </div>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">{problem.solution.description}</p>
                  </div>
                )}

                <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
                  <span>{new Date(problem.createdAt).toLocaleDateString()}</span>
                  {problem.resolvedAt && (
                    <span>Resolved: {new Date(problem.resolvedAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderAIAssistant = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">AI Academic Assistant</h2>
      </div>

      <AcademicHealthScore />

      {/* Chat Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold">Campus AI Assistant</h3>
              <p className="text-sm text-white/70">Ask me anything about your academics</p>
            </div>
          </div>
        </div>

        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user'
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-none'
                }`}>
                <p className="text-sm whitespace-pre-line">{msg.message}</p>
                <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-white/70' : 'text-slate-500'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {isLoadingAI && (
            <div className="flex justify-start">
              <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl rounded-bl-none">
                <div className="flex gap-1">
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about attendance, assignments, GPA..."
              className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {['Show my attendance', 'Pending assignments', 'What is my GPA?', 'Am I at risk?'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setChatInput(suggestion);
                  setTimeout(handleSendMessage, 100);
                }}
                className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderCanteen = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Canteen</h2>
        <button
          onClick={() => setShowOrderModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Place Order
        </button>
      </div>

      {/* My Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
      >
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">My Orders</h3>
        <div className="space-y-3">
          {myOrders.length > 0 ? (
            myOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-slate-900 dark:text-white">Order #{order.id}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                      order.status === 'ready' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'preparing' ? 'bg-amber-100 text-amber-700' :
                          order.status === 'confirmed' ? 'bg-purple-100 text-purple-700' :
                            'bg-slate-100 text-slate-700'
                      }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(order.orderTime).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900 dark:text-white">₹{order.totalAmount}</p>
                  {order.estimatedReadyTime && (
                    <p className="text-xs text-slate-500">
                      Ready by: {new Date(order.estimatedReadyTime).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-center py-4">No orders yet</p>
          )}
        </div>
      </motion.div>

      {/* Menu Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['breakfast', 'lunch', 'snacks', 'dinner', 'beverages'].map((category) => (
          <motion.button
            key={category}
            onClick={() => setShowOrderModal(true)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-colors capitalize"
          >
            <Utensils className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-900 dark:text-white">{category}</p>
            <p className="text-xs text-slate-500">
              {foodMenuItems.filter(i => i.category === category).length} items
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );

  const renderAISettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">AI Configuration</h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 max-w-2xl"
      >
        <div className="flex items-center gap-4 mb-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
          <Shield className="w-8 h-8 text-blue-600" />
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">API Configuration</h3>
            <p className="text-sm text-slate-500">Configure your personal AI API keys for CampuSync AI features.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">AI Provider</label>
            <div className="flex gap-4">
              <button
                onClick={() => setProvider('openai')}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${provider === 'openai'
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                  : 'border-slate-200 dark:border-slate-800 text-slate-500'}`}
              >
                OpenAI (GPT-4o mini)
              </button>
              <button
                onClick={() => setProvider('grok')}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${provider === 'grok'
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                  : 'border-slate-200 dark:border-slate-800 text-slate-500'}`}
              >
                Grok (xAI)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              API Key
            </label>
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={provider === 'openai' ? 'sk-...' : 'xai-...'}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                {apiKey ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <Shield className="w-5 h-5" />}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => {
                toast.success('AI Configuration saved successfully!');
              }}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  // Modals
  const renderOrderModal = () => {
    if (!showOrderModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Place Order</h3>
            <button onClick={() => setShowOrderModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 overflow-y-auto max-h-[60vh]">
            <div className="space-y-4">
              {['breakfast', 'lunch', 'snacks', 'dinner', 'beverages'].map((category) => (
                <div key={category}>
                  <h4 className="font-medium text-slate-900 dark:text-white capitalize mb-2">{category}</h4>
                  <div className="space-y-2">
                    {foodMenuItems.filter(i => i.category === category && i.isAvailable).map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-slate-900 dark:text-white">{item.name}</p>
                            {item.isVeg && <span className="w-3 h-3 bg-emerald-500 rounded-full" />}
                          </div>
                          <p className="text-sm text-slate-500">₹{item.price} • {item.preparationTime} mins</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {cart.find(c => c.item.id === item.id) ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateCartQuantity(item.id, (cart.find(c => c.item.id === item.id)?.quantity || 1) - 1)}
                                className="w-8 h-8 flex items-center justify-center bg-slate-200 dark:bg-slate-700 rounded-lg"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center">{cart.find(c => c.item.id === item.id)?.quantity}</span>
                              <button
                                onClick={() => updateCartQuantity(item.id, (cart.find(c => c.item.id === item.id)?.quantity || 0) + 1)}
                                className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-lg"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart(item)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                            >
                              Add
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {cart.length > 0 && (
            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-600 dark:text-slate-400">Total ({cart.reduce((sum, c) => sum + c.quantity, 0)} items)</span>
                <span className="text-xl font-bold text-slate-900 dark:text-white">₹{getCartTotal()}</span>
              </div>
              <button
                onClick={handlePlaceOrder}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Place Order
              </button>
            </div>
          )}
        </motion.div>
      </div>
    );
  };

  const renderEventRegisterModal = () => {
    if (!showEventRegisterModal || !selectedEvent) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6"
        >
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Register for Event</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Are you sure you want to register for <strong>{selectedEvent.title}</strong>?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowEventRegisterModal(false)}
              className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={confirmEventRegistration}
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Confirm
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  const renderAskModal = () => {
    if (!showAskModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6"
        >
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Ask Faculty</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject</label>
              <select className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800">
                {studentCourses.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Question</label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800"
                placeholder="Describe your question..."
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowAskModal(false)}
              className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.success('Question submitted successfully!');
                setShowAskModal(false);
              }}
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      setLostFoundForm(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleLostFoundSubmit = () => {
    if (!lostFoundForm.title.trim() || !lostFoundForm.description.trim() || !lostFoundForm.locationFound.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newItem: typeof lostFoundItems[0] = {
      id: `lf${Date.now()}`,
      title: lostFoundForm.title,
      description: lostFoundForm.description,
      imageUrl: lostFoundForm.imagePreview || undefined,
      locationFound: lostFoundForm.locationFound,
      postedBy: user?.id || '',
      postedByName: user?.name || 'Anonymous',
      postedAt: new Date().toISOString(),
      status: 'open',
      contactInfo: user?.phone || user?.email || 'N/A',
      itemType: lostFoundForm.itemType
    };

    setLostFoundItemsState(prev => [newItem, ...prev]);
    toast.success('Item reported successfully!');
    setShowLostFoundModal(false);
    setLostFoundForm({
      itemType: 'lost',
      title: '',
      description: '',
      locationFound: '',
      image: null,
      imagePreview: null
    });
  };

  const renderLostFoundModal = () => {
    if (!showLostFoundModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto"
        >
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Report Item</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="lost"
                    checked={lostFoundForm.itemType === 'lost'}
                    onChange={(e) => setLostFoundForm(prev => ({ ...prev, itemType: e.target.value as 'lost' | 'found' }))}
                    className="text-blue-600"
                  />
                  <span>Lost</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="found"
                    checked={lostFoundForm.itemType === 'found'}
                    onChange={(e) => setLostFoundForm(prev => ({ ...prev, itemType: e.target.value as 'lost' | 'found' }))}
                    className="text-blue-600"
                  />
                  <span>Found</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title *</label>
              <input
                type="text"
                value={lostFoundForm.title}
                onChange={(e) => setLostFoundForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="e.g., Blue Water Bottle"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description *</label>
              <textarea
                rows={3}
                value={lostFoundForm.description}
                onChange={(e) => setLostFoundForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="Describe the item..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location *</label>
              <input
                type="text"
                value={lostFoundForm.locationFound}
                onChange={(e) => setLostFoundForm(prev => ({ ...prev, locationFound: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="Where was it lost/found?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Image (Optional)</label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400"
                />
                {lostFoundForm.imagePreview && (
                  <div className="mt-2">
                    <img
                      src={lostFoundForm.imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-xl border border-slate-200 dark:border-slate-700"
                    />
                    <button
                      onClick={() => {
                        if (lostFoundForm.imagePreview) {
                          URL.revokeObjectURL(lostFoundForm.imagePreview);
                        }
                        setLostFoundForm(prev => ({ ...prev, image: null, imagePreview: null }));
                      }}
                      className="mt-2 text-sm text-red-600 hover:text-red-700"
                    >
                      Remove image
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                if (lostFoundForm.imagePreview) {
                  URL.revokeObjectURL(lostFoundForm.imagePreview);
                }
                setShowLostFoundModal(false);
                setLostFoundForm({
                  itemType: 'lost',
                  title: '',
                  description: '',
                  locationFound: '',
                  image: null,
                  imagePreview: null
                });
              }}
              className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleLostFoundSubmit}
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  const renderProblemModal = () => {
    if (!showProblemModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6"
        >
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Post a Problem</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800"
                placeholder="Problem title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800"
                placeholder="Describe the problem..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Difficulty</label>
              <select className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowProblemModal(false)}
              className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.success('Problem posted successfully!');
                setShowProblemModal(false);
              }}
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Post
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          className={`fixed left-0 top-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-40 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}
        >
          <div className="p-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h1 className="font-bold text-slate-900 dark:text-white">CampusAI</h1>
                  <p className="text-xs text-slate-500">Student Portal</p>
                </div>
              )}
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 space-y-1 scrollbar-hide pb-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${activeTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-200 dark:border-slate-800 mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
              {!sidebarCollapsed && <span className="text-sm font-medium">Logout</span>}
            </button>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
          {/* Header */}
          <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {navItems.find(n => n.id === activeTab)?.label}
                </h2>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <div className="relative">
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative">
                    <Bell className="w-5 h-5" />
                    {notifications.length > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={user?.avatar || `https://i.pravatar.cc/150?u=${user?.id}`}
                    alt={user?.name}
                    className="w-9 h-9 rounded-full border-2 border-slate-200 dark:border-slate-700"
                  />
                  {!sidebarCollapsed && (
                    <div className="hidden md:block">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name}</p>
                      <p className="text-xs text-slate-500">{user?.department}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'dashboard' && renderDashboard()}
                {activeTab === 'courses' && renderCourses()}
                {activeTab === 'attendance' && renderAttendance()}
                {activeTab === 'assignments' && renderAssignments()}
                {activeTab === 'results' && renderResults()}
                {activeTab === 'timetable' && renderTimetable()}
                {activeTab === 'placement' && renderPlacement()}
                {activeTab === 'events' && renderEvents()}
                {activeTab === 'lostfound' && renderLostFound()}
                {activeTab === 'problems' && renderProblemSolving()}
                {activeTab === 'askfaculty' && renderAskFaculty()}
                {activeTab === 'aiassistant' && renderAIAssistant()}
                {activeTab === 'canteen' && renderCanteen()}
                {activeTab === 'aisettings' && renderAISettings()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Modals */}
      {renderOrderModal()}
      {renderEventRegisterModal()}
      {renderAskModal()}
      {renderLostFoundModal()}
      {renderProblemModal()}
    </div>
  );
};

export default EnhancedStudentDashboard;
