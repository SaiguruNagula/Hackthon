import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import {
  BookOpen, Users, ClipboardList, Calendar, TrendingUp, Bell,
  ChevronRight, LogOut, GraduationCap, LayoutDashboard, MessageSquare,
  Lightbulb, Upload, CheckCircle, Plus, Filter, Trash2,
  Download, X, Clock, Shield
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useData } from '@/contexts/DataContext';
import { getAIResponse, generateSystemPrompt } from '@/lib/aiService';
import { courses as initialCourses, users } from '@/data/dummyData';
import { realWorldProblems } from '@/data/enhancedDummyData';
import { toast } from 'sonner';

const EnhancedFacultyDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { assignments, announcements, addAssignment, addAnnouncement, addProblem } = useData();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showModal, setShowModal] = useState<string | null>(null);

  // Form states for adding items
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    courseId: '',
    deadline: '',
    maxMarks: '100',
    description: ''
  });

  const [newAnn, setNewAnn] = useState({
    title: '',
    content: '',
    targetAudience: 'all' as any,
    priority: 'medium' as any
  });

  const [newProblem, setNewProblem] = useState({
    title: '',
    description: '',
    difficulty: 'medium' as any,
    reward: ''
  });

  if (!user) return null;

  const facultyCourses = initialCourses.filter(c => c.facultyId === user.id);
  const totalStudents = facultyCourses.reduce((sum, c) => sum + c.students.length, 0);
  const facultyAssignments = assignments.filter(a =>
    facultyCourses.some(c => c.id === a.courseId)
  );

  // Get students in faculty courses
  const courseStudentIds = facultyCourses.flatMap(c => c.students);
  const myStudents = users.filter((u: any) => courseStudentIds.includes(u.id));

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'assignments', label: 'Assignments', icon: ClipboardList },
    { id: 'marks', label: 'Marks & Grades', icon: TrendingUp },
    { id: 'announcements', label: 'Announcements', icon: MessageSquare },
    { id: 'problems', label: 'Problem Solving', icon: Lightbulb },
    { id: 'student-queries', label: 'Student Queries', icon: MessageSquare },
    { id: 'ai-config', label: 'AI Settings', icon: Shield },
  ];

  const quickActions = [
    { id: 'problem', label: 'Post New Problem', icon: Lightbulb, color: 'bg-purple-600', modal: 'post-problem' },
    { id: 'assignment', label: 'Upload Assignment', icon: Upload, color: 'bg-blue-600', modal: 'upload-assignment' },
    { id: 'attendance', label: 'Take Attendance', icon: Calendar, color: 'bg-emerald-600', modal: 'take-attendance' },
    { id: 'marks', label: 'Upload Marks', icon: TrendingUp, color: 'bg-amber-600', modal: 'upload-marks' },
    { id: 'announcement', label: 'Make Announcement', icon: MessageSquare, color: 'bg-pink-600', modal: 'make-announcement' },
  ];

  // Modal Components
  const Modal = ({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );

  const renderModal = () => {
    if (!showModal) return null;

    const action = quickActions.find(a => a.modal === showModal);

    return (
      <Modal title={action?.label || ''} onClose={() => setShowModal(null)}>
        <form className="space-y-4" onSubmit={async (e) => {
          e.preventDefault();
          if (showModal === 'upload-assignment') {
            addAssignment({
              title: newAssignment.title,
              courseId: newAssignment.courseId || facultyCourses[0].id,
              courseName: facultyCourses.find(c => c.id === (newAssignment.courseId || facultyCourses[0].id))?.name || '',
              deadline: newAssignment.deadline,
              maxMarks: parseInt(newAssignment.maxMarks),
              description: newAssignment.description
            });
            toast.success('Assignment created successfully!');
          } else if (showModal === 'make-announcement') {
            addAnnouncement({
              title: newAnn.title,
              content: newAnn.content,
              targetAudience: newAnn.targetAudience,
              priority: newAnn.priority,
              postedBy: user.id,
              postedByName: user.name
            });
            toast.success('Announcement posted successfully!');
          } else if (showModal === 'post-problem') {
            addProblem({
              title: newProblem.title,
              description: newProblem.description,
              difficulty: newProblem.difficulty,
              status: 'open',
              reward: newProblem.reward,
              postedBy: user.id,
              postedByName: user.name,
              requiredSkills: ['General'],
              subject: facultyCourses[0]?.name || 'Academic',
              department: user.department || 'Academic'
            });
            toast.success('Problem posted successfully!');
          }
          setShowModal(null);
        }}>
          {showModal === 'upload-assignment' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Course</label>
                <select
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  value={newAssignment.courseId}
                  onChange={(e) => setNewAssignment({ ...newAssignment, courseId: e.target.value })}
                  required
                >
                  <option value="">Select a course</option>
                  {facultyCourses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Assignment Title</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  placeholder="Enter title"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Deadline</label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  value={newAssignment.deadline}
                  onChange={(e) => setNewAssignment({ ...newAssignment, deadline: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Max Marks</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  placeholder="100"
                  value={newAssignment.maxMarks}
                  onChange={(e) => setNewAssignment({ ...newAssignment, maxMarks: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-24"
                  placeholder="Description..."
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                />
              </div>
            </>
          )}
          {showModal === 'make-announcement' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  placeholder="Announcement title"
                  value={newAnn.title}
                  onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
                <textarea
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-24"
                  placeholder="Your announcement"
                  value={newAnn.content}
                  onChange={(e) => setNewAnn({ ...newAnn, content: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Audience</label>
                <select
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  value={newAnn.targetAudience}
                  onChange={(e) => setNewAnn({ ...newAnn, targetAudience: e.target.value })}
                >
                  <option>All Students</option>
                  <option>My Course Students</option>
                  <option>Department</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                <select
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  value={newAnn.priority}
                  onChange={(e) => setNewAnn({ ...newAnn, priority: e.target.value as any })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </>
          )}
          {showModal === 'post-problem' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Problem Title</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  placeholder="Enter problem title"
                  value={newProblem.title}
                  onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-24"
                  placeholder="Describe the problem..."
                  value={newProblem.description}
                  onChange={(e) => setNewProblem({ ...newProblem, description: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Difficulty</label>
                  <select
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    value={newProblem.difficulty}
                    onChange={(e) => setNewProblem({ ...newProblem, difficulty: e.target.value as any })}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Reward (Points/etc)</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    placeholder="e.g. 50 Credits"
                    value={newProblem.reward}
                    onChange={(e) => setNewProblem({ ...newProblem, reward: e.target.value })}
                  />
                </div>
              </div>
            </>
          )}
          <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            {action?.label}
          </button>
        </form>
      </Modal>
    );
  };

  // Render functions for each tab
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-5 gap-4"
      >
        {quickActions.map((action, i) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setShowModal(action.modal)}
            className={`p-4 rounded-xl ${action.color} text-white hover:opacity-90 transition-opacity text-left`}
          >
            <action.icon className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">{action.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">My Courses</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{facultyCourses.length}</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Students</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalStudents}</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-xl">
              <ClipboardList className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Assignments</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{facultyAssignments.length}</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Avg Attendance</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">82.5%</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Submissions</h3>
          <div className="space-y-3">
            {facultyAssignments.slice(0, 3).flatMap(a => a.submissions.slice(0, 1).map(s => (
              <div key={`${a.id}-${s.studentId}`} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                    {s.studentName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{s.studentName}</p>
                    <p className="text-sm text-slate-500">{a.title}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${s.status === 'submitted' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                  {s.status}
                </span>
              </div>
            )))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Course Performance</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={facultyCourses.map(c => ({ name: c.name.split(' ')[0], students: c.students.length, progress: c.syllabusProgress }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="students" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Courses</h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {facultyCourses.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{course.name}</h3>
                <p className="text-slate-500">{course.code}</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {course.credits} Credits
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{course.students.length}</p>
                <p className="text-xs text-slate-500">Students</p>
              </div>
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{course.syllabusProgress}%</p>
                <p className="text-xs text-slate-500">Progress</p>
              </div>
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{facultyAssignments.filter(a => a.courseId === course.id).length}</p>
                <p className="text-xs text-slate-500">Assignments</p>
              </div>
            </div>

            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${course.syllabusProgress}%` }}
              />
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-blue-50 dark:bg-blue-950/30 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                View Details
              </button>
              <button className="flex-1 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                Edit Course
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderAttendance = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Attendance Management</h2>
        <button
          onClick={() => setShowModal('take-attendance')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Take Attendance
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
          <p className="text-sm text-slate-500">Today's Classes</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">3</p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
          <p className="text-sm text-slate-500">Avg Attendance</p>
          <p className="text-3xl font-bold text-emerald-600">82.5%</p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
          <p className="text-sm text-slate-500">Low Attendance</p>
          <p className="text-3xl font-bold text-red-600">8</p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
          <p className="text-sm text-slate-500">Classes Taken</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">45</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Course-wise Attendance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Course</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Students</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Avg Attendance</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {facultyCourses.map(course => {
                const avgAtt = Math.floor(Math.random() * 20) + 75;
                return (
                  <tr key={course.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{course.name}</td>
                    <td className="px-4 py-3 text-slate-600">{course.students.length}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${avgAtt}%` }} />
                        </div>
                        <span className="text-sm text-slate-600">{avgAtt}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${avgAtt >= 85 ? 'bg-emerald-100 text-emerald-700' :
                        avgAtt >= 75 ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                        {avgAtt >= 85 ? 'Excellent' : avgAtt >= 75 ? 'Good' : 'At Risk'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAssignments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Assignments</h2>
        <button
          onClick={() => setShowModal('upload-assignment')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          New Assignment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
          <p className="text-sm text-slate-500">Total Assignments</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{facultyAssignments.length}</p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
          <p className="text-sm text-slate-500">Pending Review</p>
          <p className="text-3xl font-bold text-amber-600">12</p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
          <p className="text-sm text-slate-500">Total Submissions</p>
          <p className="text-3xl font-bold text-emerald-600">89</p>
        </div>
      </div>

      <div className="space-y-4">
        {facultyAssignments.map((assignment, i) => (
          <motion.div
            key={assignment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{assignment.title}</h3>
                <p className="text-slate-500">{assignment.courseName}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Due: {new Date(assignment.deadline).toLocaleDateString()}
                  </span>
                  <span>Max Marks: {assignment.maxMarks}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{assignment.submissions.length}</p>
                <p className="text-sm text-slate-500">Submissions</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="px-4 py-2 bg-blue-50 dark:bg-blue-950/30 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100">
                View Submissions
              </button>
              <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800">
                Edit
              </button>
              <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800 text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderMarks = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Marks & Grades</h2>
        <button
          onClick={() => setShowModal('upload-marks')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          <Upload className="w-4 h-4" />
          Upload Marks
        </button>
      </div>

      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center gap-4 mb-6">
          <select className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            {facultyCourses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <option>Internal Assessment 1</option>
            <option>Mid Semester</option>
            <option>End Semester</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Student</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Roll No</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Marks</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Percentage</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Grade</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {myStudents.slice(0, 8).map((student, i) => {
                const marks = Math.floor(Math.random() * 30) + 70;
                const grade = marks >= 90 ? 'A+' : marks >= 80 ? 'A' : marks >= 70 ? 'B' : 'C';
                return (
                  <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full" />
                        <span className="font-medium text-slate-900 dark:text-white">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">CS2023{String(i + 1).padStart(3, '0')}</td>
                    <td className="px-4 py-3 text-slate-900 dark:text-white font-medium">{marks}/100</td>
                    <td className="px-4 py-3 text-slate-600">{marks}%</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${grade.startsWith('A') ? 'bg-emerald-100 text-emerald-700' :
                        grade === 'B' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                        {grade}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Edit</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnnouncements = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Announcements</h2>
        <button
          onClick={() => setShowModal('make-announcement')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          New Announcement
        </button>
      </div>

      <div className="space-y-4">
        {announcements.slice(0, 4).map((notification, i) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-2xl border p-6 ${notification.priority === 'emergency' ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' :
              notification.priority === 'high' ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800' :
                'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{notification.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${notification.priority === 'emergency' ? 'bg-red-100 text-red-700' :
                    notification.priority === 'high' ? 'bg-amber-100 text-amber-700' :
                      notification.priority === 'medium' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                    }`}>
                    {notification.priority}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">{notification.content}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                  <span>By: {notification.postedByName}</span>
                  <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
                  <span>Target: {notification.targetAudience}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderProblemSolving = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Real World Problem Solving</h2>
        <button
          onClick={() => setShowModal('post-problem')}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
        >
          <Plus className="w-4 h-4" />
          Post New Problem
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {realWorldProblems.map((problem, i) => (
          <motion.div
            key={problem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${problem.difficulty === 'easy' ? 'bg-emerald-100 text-emerald-700' :
                  problem.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                  {problem.difficulty}
                </span>
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${problem.status === 'open' ? 'bg-blue-100 text-blue-700' :
                  problem.status === 'in-progress' ? 'bg-purple-100 text-purple-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                  {problem.status}
                </span>
              </div>
              {problem.reward && (
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                  {problem.reward}
                </span>
              )}
            </div>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{problem.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">{problem.description}</p>

            {problem.refinedDescription && (
              <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg mb-3">
                <p className="text-xs text-purple-700 dark:text-purple-400 font-medium mb-1">AI Refined:</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{problem.refinedDescription}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mb-4">
              {problem.requiredSkills.map((skill, j) => (
                <span key={j} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-xs">
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {problem.enrolledStudents.length} enrolled
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                {problem.solutions.length} solutions
              </span>
              {problem.deadline && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Due: {new Date(problem.deadline).toLocaleDateString()}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-purple-50 dark:bg-purple-950/30 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-100">
                View Solutions
              </button>
              <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800">
                Edit
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderStudentQueries = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Student Queries</h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {realWorldProblems.filter(p => !p.department || p.department === user.department).map((problem: any, i: number) => (
          <motion.div
            key={problem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-2xl border p-6 ${problem.status === 'open' ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800' :
              problem.status === 'in-review' ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800' :
                'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
              }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <img
                  src={problem.studentAvatar || `https://i.pravatar.cc/150?u=${problem.postedBy}`}
                  alt={problem.postedByName}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{problem.title}</h3>
                  <p className="text-sm text-slate-500">by {problem.postedByName} • {problem.subject}</p>
                  <p className="text-slate-600 dark:text-slate-400 mt-2">{problem.description}</p>

                  {problem.solution && (
                    <div className="mt-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <p className="text-sm font-medium text-emerald-600 mb-1">Solution by {problem.solution.providedByName}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{problem.solution.description}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${problem.status === 'open' ? 'bg-slate-100 text-slate-700' :
                  problem.status === 'in-review' ? 'bg-amber-100 text-amber-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                  {problem.status}
                </span>
                <span className="text-xs text-slate-400">{new Date(problem.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {problem.status !== 'resolved' && (
              <div className="flex gap-2 mt-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                  Provide Solution
                </button>
                <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800">
                  Mark In Review
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'courses': return renderCourses();
      case 'attendance': return renderAttendance();
      case 'assignments': return renderAssignments();
      case 'marks': return renderMarks();
      case 'announcements': return renderAnnouncements();
      case 'problems': return renderProblemSolving();
      case 'student-queries': return renderStudentQueries();
      default: return renderDashboard();
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
        <div className="p-6 flex items-center justify-between border-b border-slate-700/50">
          <motion.div className="flex items-center gap-3 overflow-hidden" animate={{ opacity: isCollapsed ? 0 : 1 }}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="font-bold text-lg leading-tight">CampuSync</h1>
              </div>
            )}
          </motion.div>
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-lg hover:bg-slate-700/50">
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronRight className="w-5 h-5 rotate-180" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-hide">
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
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
                </motion.button>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-700/50 mt-auto">
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''} mb-3`}>
            <img src={user?.avatar} alt={user?.name} className="w-8 h-8 rounded-full border border-blue-500/50" />
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-xs truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-400 capitalize">{user?.role}</p>
              </div>
            )}
          </div>
          <motion.button
            onClick={logout}
            whileHover={{ scale: 1.02 }}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 ${isCollapsed ? 'justify-center' : ''}`}
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && <span className="text-xs font-medium">Logout</span>}
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <motion.main
        initial={{ marginLeft: 280 }}
        animate={{ marginLeft: isCollapsed ? 80 : 280 }}
        className="min-h-screen"
      >
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                  Faculty Dashboard
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back, {user?.name}!</p>
              </div>
              <div className="flex items-center gap-4">
                <button className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
                </button>
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.department}</p>
                  </div>
                  <img src={user?.avatar} alt={user?.name} className="w-10 h-10 rounded-full border-2 border-blue-500/30" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {renderContent()}
        </div>
      </motion.main>

      {/* Modals */}
      <AnimatePresence>
        {showModal && renderModal()}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedFacultyDashboard;
