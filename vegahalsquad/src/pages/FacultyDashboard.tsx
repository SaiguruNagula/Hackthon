import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import StatCard from '@/components/ui/StatCard';
import ChartCard from '@/components/ui/ChartCard';
import ProgressBar from '@/components/ui/ProgressBar';
import {
  BookOpen, Users, ClipboardList, Calendar, TrendingUp, Bell,
  ChevronRight, LogOut, GraduationCap, LayoutDashboard, MessageSquare,
  Lightbulb, Upload, CheckCircle, Plus, FileText, MoreVertical
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { courses, assignments, problems } from '@/data/dummyData';

const FacultyDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!user) return null;

  // Filter data for faculty
  const facultyCourses = courses.filter(c => c.facultyId === user.id);
  const totalStudents = facultyCourses.reduce((sum, c) => sum + c.students.length, 0);
  const facultyAssignments = assignments.filter(a =>
    facultyCourses.some(c => c.id === a.courseId)
  );
  const pendingSubmissions = facultyAssignments.reduce((sum, a) =>
    sum + (a.submissions?.length || 0), 0
  );

  // Chart data
  const coursePerformanceData = facultyCourses.map(c => ({
    course: c.name.split(' ').slice(0, 2).join(' '),
    avgAttendance: Math.floor(Math.random() * 20) + 75,
    avgMarks: Math.floor(Math.random() * 20) + 70
  }));

  const studentDistribution = [
    { name: 'Excellent', value: 25, color: '#10B981' },
    { name: 'Good', value: 40, color: '#3B82F6' },
    { name: 'Average', value: 25, color: '#F59E0B' },
    { name: 'At Risk', value: 10, color: '#EF4444' },
  ];

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'assignments', label: 'Assignments', icon: ClipboardList },
    { id: 'marks', label: 'Marks & Grades', icon: TrendingUp },
    { id: 'announcements', label: 'Announcements', icon: MessageSquare },
    { id: 'problems', label: 'Problem Solving', icon: Lightbulb },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="My Courses"
          value={facultyCourses.length}
          subtitle="Currently teaching"
          icon={BookOpen}
          color="blue"
          delay={0}
        />
        <StatCard
          title="Total Students"
          value={totalStudents}
          subtitle="Across all courses"
          icon={Users}
          color="purple"
          delay={0.1}
        />
        <StatCard
          title="Assignments"
          value={facultyAssignments.length}
          subtitle={`${pendingSubmissions} submissions received`}
          icon={ClipboardList}
          color="orange"
          delay={0.2}
        />
        <StatCard
          title="Avg Attendance"
          value="82.5%"
          subtitle="Across all courses"
          icon={Calendar}
          trend={3.2}
          trendLabel="vs last week"
          color="green"
          delay={0.3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Course Performance" subtitle="Average attendance and marks by course">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={coursePerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="course" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="avgAttendance" fill="#3B82F6" radius={[8, 8, 0, 0]} name="Attendance %" />
              <Bar dataKey="avgMarks" fill="#8B5CF6" radius={[8, 8, 0, 0]} name="Marks %" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Student Distribution" subtitle="Performance categories">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={studentDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {studentDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {studentDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-slate-600">{item.name}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Quick Actions & Recent Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: 'Post Assignment', icon: Plus, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Mark Attendance', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'Upload Marks', icon: Upload, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Post Announcement', icon: MessageSquare, color: 'text-orange-600', bg: 'bg-orange-50' },
              { label: 'Create Problem', icon: Lightbulb, color: 'text-pink-600', bg: 'bg-pink-50' },
            ].map((action) => (
              <motion.button
                key={action.label}
                whileHover={{ x: 4 }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <div className={`p-2 rounded-lg ${action.bg}`}>
                  <action.icon className={`w-4 h-4 ${action.color}`} />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{action.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Submissions</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>

          <div className="space-y-3">
            {facultyAssignments.slice(0, 3).map((assignment) => (
              assignment.submissions?.slice(0, 2).map((sub) => (
                <div
                  key={`${assignment.id}-${sub.studentId}`}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                      {sub.studentName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{sub.studentName}</p>
                      <p className="text-sm text-slate-500">{assignment.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${sub.status === 'submitted'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                      }`}>
                      {sub.status}
                    </span>
                    <span className="text-sm text-slate-500">
                      {new Date(sub.submittedAt).toLocaleDateString()}
                    </span>
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </button>
                  </div>
                </div>
              ))
            ))}
          </div>
        </motion.div>
      </div>

      {/* My Courses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">My Courses</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {facultyCourses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              whileHover={{ y: -4 }}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium text-slate-600">
                  {course.credits} Credits
                </span>
              </div>

              <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{course.name}</h4>
              <p className="text-sm text-slate-500 mb-4">{course.code}</p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Students</span>
                  <span className="font-medium text-slate-900 dark:text-white">{course.students.length}</span>
                </div>
                <ProgressBar progress={course.syllabusProgress} size="sm" showLabel={false} />
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Syllabus Progress</span>
                  <span>{course.syllabusProgress}%</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button className="flex-1 py-2 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-950/30 rounded-lg hover:bg-blue-100 transition-colors">
                  View Details
                </button>
                <button className="flex-1 py-2 text-sm font-medium text-slate-600 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 transition-colors">
                  Edit
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderProblemSolving = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Real-World Problem Solving</h2>
          <p className="text-slate-500 mt-1">Post technical problems for students to solve</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25"
        >
          <Plus className="w-5 h-5" />
          Post New Problem
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {problems.map((problem, i) => (
          <motion.div
            key={problem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${problem.difficulty === 'easy' ? 'bg-emerald-100 text-emerald-700' :
                problem.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${problem.status === 'open' ? 'bg-blue-100 text-blue-700' :
                problem.status === 'in-progress' ? 'bg-purple-100 text-purple-700' :
                  'bg-emerald-100 text-emerald-700'
                }`}>
                {problem.status}
              </span>
            </div>

            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{problem.title}</h3>
            <p className="text-sm text-slate-500 mb-4 line-clamp-2">{problem.description}</p>

            {problem.refinedDescription && (
              <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg mb-4">
                <p className="text-xs text-purple-700 dark:text-purple-400 font-medium mb-1">AI Refined:</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{problem.refinedDescription}</p>
              </div>
            )}

            <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {problem.enrolledStudents.length} enrolled
              </span>
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                {problem.solutions.length} solutions
              </span>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-2 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-950/30 rounded-lg hover:bg-blue-100 transition-colors">
                View Solutions
              </button>
              <button className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'problems':
        return renderProblemSolving();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <motion.aside
        initial={{ width: 280 }}
        animate={{ width: isCollapsed ? 80 : 280 }}
        className="h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white fixed left-0 top-0 z-50 flex flex-col shadow-2xl"
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between border-b border-slate-700/50">
          <motion.div
            className="flex items-center gap-3 overflow-hidden"
            animate={{ opacity: isCollapsed ? 0 : 1 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="font-bold text-lg leading-tight">CampuSync</h1>
              </div>
            )}
          </motion.div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronRight className="w-5 h-5 rotate-180" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="font-medium text-sm whitespace-nowrap">{item.label}</span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-700/50">
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <img
              src={user?.avatar || `https://i.pravatar.cc/150?u=${user?.id}`}
              alt={user?.name}
              className="w-10 h-10 rounded-full border-2 border-blue-500/50"
            />
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{user?.name}</p>
                <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
              </div>
            )}
          </div>

          <motion.button
            onClick={logout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`mt-3 w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors ${isCollapsed ? 'justify-center' : ''
              }`}
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <motion.main
        initial={{ marginLeft: 280 }}
        animate={{ marginLeft: isCollapsed ? 80 : 280 }}
        className="min-h-screen"
      >
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40"
        >
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent"
                >
                  Faculty Dashboard
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-sm text-slate-500 dark:text-slate-400 mt-1"
                >
                  Welcome back, {user?.name}!
                </motion.p>
              </div>

              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    3
                  </span>
                </motion.button>

                <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user?.department}</p>
                  </div>
                  <img
                    src={user?.avatar || `https://i.pravatar.cc/150?u=${user?.id}`}
                    alt={user?.name}
                    className="w-10 h-10 rounded-full border-2 border-blue-500/30"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        <div className="p-6">
          {renderContent()}
        </div>
      </motion.main>
    </div>
  );
};

export default FacultyDashboard;
