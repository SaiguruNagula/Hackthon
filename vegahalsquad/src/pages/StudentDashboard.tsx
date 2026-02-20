import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import StatCard from '@/components/ui/StatCard';
import ChartCard from '@/components/ui/ChartCard';
import ProgressBar from '@/components/ui/ProgressBar';
import {
  BookOpen, Calendar, ClipboardCheck, TrendingUp, AlertTriangle,
  GraduationCap, Briefcase, CalendarDays, MessageSquare,
  ChevronRight, FileText, Upload, Search, MapPin, Users,
  Clock, CheckCircle, XCircle, Filter,
  Download, Plus
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import {
  getStudentCourses, getStudentAttendance, getStudentAssignments, getStudentResults,
  getStudentTimetable, calculateGPA, sampleChatMessages,
  events, lostFoundItems, placements
} from '@/data/dummyData';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [chatMessages, setChatMessages] = useState(sampleChatMessages);
  const [chatInput, setChatInput] = useState('');

  if (!user) return null;

  const studentCourses = getStudentCourses(user.id);
  const studentAttendance = getStudentAttendance(user.id);
  const studentAssignments = getStudentAssignments(user.id);
  const studentResults = getStudentResults(user.id);
  const studentTimetable = getStudentTimetable(user.id);
  const gpa = calculateGPA(user.id);

  // Calculate stats
  const avgAttendance = studentAttendance.length > 0
    ? studentAttendance.reduce((sum, a) => sum + a.percentage, 0) / studentAttendance.length
    : 0;

  const pendingAssignments = studentAssignments.filter(a =>
    !a.submissions.find(s => s.studentId === user.id)
  ).length;

  const atRiskCourses = studentAttendance.filter(a => a.percentage < 75).length;

  // Chart data
  const attendanceData = studentAttendance.map(a => ({
    course: a.courseName.split(' ').slice(0, 2).join(' '),
    percentage: a.percentage,
    threshold: 75
  }));

  const performanceData = studentResults
    .filter(r => r.examType === 'internal')
    .map(r => ({
      course: r.courseName.split(' ')[0],
      marks: r.percentage
    }));

  const gradeDistribution = [
    { name: 'A+', value: studentResults.filter(r => r.percentage >= 90).length, color: '#10B981' },
    { name: 'A', value: studentResults.filter(r => r.percentage >= 80 && r.percentage < 90).length, color: '#3B82F6' },
    { name: 'B', value: studentResults.filter(r => r.percentage >= 70 && r.percentage < 80).length, color: '#8B5CF6' },
    { name: 'C', value: studentResults.filter(r => r.percentage >= 60 && r.percentage < 70).length, color: '#F59E0B' },
    { name: 'D', value: studentResults.filter(r => r.percentage < 60).length, color: '#EF4444' },
  ];

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const newMessage: typeof sampleChatMessages[0] = {
      id: `cm${Date.now()}`,
      sender: 'user',
      message: chatInput,
      timestamp: new Date().toISOString()
    };

    setChatMessages([...chatMessages, newMessage]);
    setChatInput('');

    setTimeout(() => {
      const aiResponse: typeof sampleChatMessages[0] = {
        id: `cm${Date.now() + 1}`,
        sender: 'ai',
        message: 'I\'m analyzing your academic data. Based on your current performance, I recommend focusing on Operating Systems to improve your attendance. Would you like specific study resources?',
        timestamp: new Date().toISOString(),
        suggestions: ['Show study resources', 'View attendance details', 'Set reminders']
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const getTabTitle = () => {
    const titles: Record<string, { title: string; subtitle: string }> = {
      dashboard: { title: 'Student Dashboard', subtitle: `Welcome back, ${user.name}!` },
      courses: { title: 'My Courses', subtitle: 'View all your enrolled courses' },
      attendance: { title: 'Attendance', subtitle: 'Track your attendance across all courses' },
      assignments: { title: 'Assignments', subtitle: 'Manage your assignments and submissions' },
      results: { title: 'Results', subtitle: 'View your exam results and performance' },
      timetable: { title: 'Timetable', subtitle: 'Your weekly class schedule' },
      placement: { title: 'Placement', subtitle: 'Explore internship and job opportunities' },
      events: { title: 'Events', subtitle: 'Upcoming campus events and activities' },
      lostfound: { title: 'Lost & Found', subtitle: 'Report or find lost items' },
      'ai-assistant': { title: 'AI Assistant', subtitle: 'Your personalized academic guide' },
    };
    return titles[activeTab] || titles.dashboard;
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Current GPA"
          value={gpa}
          subtitle="Out of 10.0"
          icon={GraduationCap}
          trend={5.2}
          trendLabel="vs last semester"
          color="purple"
          delay={0}
        />
        <StatCard
          title="Attendance"
          value={`${avgAttendance.toFixed(1)}%`}
          subtitle={`${atRiskCourses} courses at risk`}
          icon={Calendar}
          trend={-2.1}
          trendLabel="vs last week"
          color={avgAttendance >= 75 ? 'green' : 'red'}
          delay={0.1}
        />
        <StatCard
          title="Pending Tasks"
          value={pendingAssignments}
          subtitle="Assignments due"
          icon={ClipboardCheck}
          color="orange"
          delay={0.2}
        />
        <StatCard
          title="Courses"
          value={studentCourses.length}
          subtitle="Currently enrolled"
          icon={BookOpen}
          color="blue"
          delay={0.3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Attendance by Course" subtitle="Track your attendance across all courses">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="course" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="percentage" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Performance Trend" subtitle="Internal assessment scores">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorMarks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="course" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="marks" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorMarks)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* AI Insights & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-6 text-white shadow-xl shadow-orange-500/25"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">Attendance Alert</h3>
              <p className="text-white/90 mb-4">
                Your Operating Systems attendance is at 70%. If you miss 2 more classes,
                it will drop below the 75% threshold.
              </p>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-white text-orange-600 rounded-lg font-medium text-sm hover:bg-white/90 transition-colors">
                  View Details
                </button>
                <button className="px-4 py-2 bg-white/20 text-white rounded-lg font-medium text-sm hover:bg-white/30 transition-colors">
                  Set Reminder
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: 'Submit Assignment', icon: Upload, color: 'text-blue-600', tab: 'assignments' },
              { label: 'View Timetable', icon: CalendarDays, color: 'text-purple-600', tab: 'timetable' },
              { label: 'Check Results', icon: FileText, color: 'text-emerald-600', tab: 'results' },
              { label: 'Ask AI Assistant', icon: MessageSquare, color: 'text-orange-600', tab: 'ai-assistant' },
            ].map((action) => (
              <motion.button
                key={action.label}
                whileHover={{ x: 4 }}
                onClick={() => setActiveTab(action.tab)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <action.icon className={`w-5 h-5 ${action.color}`} />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{action.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Enrolled Courses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Enrolled Courses</h3>
          <button onClick={() => setActiveTab('courses')} className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {studentCourses.map((course, i) => {
            const courseAttendance = studentAttendance.find(a => a.courseId === course.id);
            const courseAssignment = studentAssignments.filter(a => a.courseId === course.id);
            const completedAssignments = courseAssignment.filter(a =>
              a.submissions.find(s => s.studentId === user.id)
            ).length;

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{course.name}</h4>
                    <p className="text-sm text-slate-500">{course.code} • {course.facultyName}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-lg text-xs font-medium ${(courseAttendance?.percentage || 0) >= 75
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-red-100 text-red-700'
                    }`}>
                    {courseAttendance?.percentage.toFixed(0) || 0}%
                  </div>
                </div>

                <ProgressBar
                  progress={course.syllabusProgress}
                  size="sm"
                  label="Syllabus Progress"
                />

                <div className="flex items-center gap-4 mt-3 text-sm">
                  <span className="text-slate-500">
                    {completedAssignments}/{courseAssignment.length} Assignments
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500">{course.credits} Credits</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {studentCourses.map((course, i) => {
          const courseAttendance = studentAttendance.find(a => a.courseId === course.id);
          const courseAssignments = studentAssignments.filter(a => a.courseId === course.id);
          const courseResults = studentResults.filter(r => r.courseId === course.id);

          return (
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

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Faculty</p>
                    <p className="font-medium text-slate-900 dark:text-white">{course.facultyName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{courseAttendance?.percentage.toFixed(0) || 0}%</p>
                    <p className="text-xs text-slate-500">Attendance</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{courseAssignments.length}</p>
                    <p className="text-xs text-slate-500">Assignments</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{courseResults.length}</p>
                    <p className="text-xs text-slate-500">Tests</p>
                  </div>
                </div>

                <ProgressBar progress={course.syllabusProgress} label="Course Progress" />

                <p className="text-sm text-slate-600 dark:text-slate-400">{course.description}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );

  const renderAttendance = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-100 rounded-xl">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Overall Attendance</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{avgAttendance.toFixed(1)}%</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-100 rounded-xl">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Classes Attended</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {studentAttendance.reduce((sum, a) => sum + a.attendedClasses, 0)}
              </p>
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
            <div className="p-4 bg-red-100 rounded-xl">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Classes Missed</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {studentAttendance.reduce((sum, a) => sum + (a.totalClasses - a.attendedClasses), 0)}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <ChartCard title="Attendance Overview" subtitle="Course-wise attendance percentage">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="course" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} />
            <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
            <Bar dataKey="percentage" fill="#3B82F6" radius={[8, 8, 0, 0]} name="Attendance %" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
      >
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Course Attendance Details</h3>
        <div className="space-y-4">
          {studentAttendance.map((att) => (
            <div key={att.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="flex-1">
                <h4 className="font-medium text-slate-900 dark:text-white">{att.courseName}</h4>
                <p className="text-sm text-slate-500">{att.attendedClasses} of {att.totalClasses} classes attended</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32">
                  <ProgressBar progress={att.percentage} size="sm" showLabel={false} />
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${att.percentage >= 75 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                  {att.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderAssignments = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-100 rounded-xl">
              <ClipboardCheck className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Assignments</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{studentAssignments.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-amber-100 rounded-xl">
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Pending</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{pendingAssignments}</p>
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
            <div className="p-4 bg-emerald-100 rounded-xl">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Submitted</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {studentAssignments.length - pendingAssignments}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
      >
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">All Assignments</h3>
        <div className="space-y-4">
          {studentAssignments.map((assignment, i) => {
            const submission = assignment.submissions.find(s => s.studentId === user.id);
            const isPending = !submission;
            const isLate = submission?.status === 'late';

            return (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-slate-900 dark:text-white">{assignment.title}</h4>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${isPending ? 'bg-amber-100 text-amber-700' :
                        isLate ? 'bg-red-100 text-red-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                        {isPending ? 'Pending' : isLate ? 'Late Submitted' : 'Submitted'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mb-2">{assignment.courseName}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{assignment.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Calendar className="w-4 h-4" />
                        Due: {new Date(assignment.deadline).toLocaleDateString()}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">Max Marks: {assignment.maxMarks}</span>
                      {submission?.marks && (
                        <>
                          <span className="text-slate-400">•</span>
                          <span className="text-emerald-600 font-medium">Scored: {submission.marks}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {isPending ? (
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        Submit
                      </button>
                    ) : (
                      <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        View
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );

  const renderResults = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <p className="text-sm text-slate-500">Current GPA</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{gpa}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <p className="text-sm text-slate-500">Total Exams</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{studentResults.length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <p className="text-sm text-slate-500">Average</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {studentResults.length > 0
              ? (studentResults.reduce((sum, r) => sum + r.percentage, 0) / studentResults.length).toFixed(1)
              : 0}%
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <p className="text-sm text-slate-500">Highest</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {studentResults.length > 0
              ? Math.max(...studentResults.map(r => r.percentage))
              : 0}%
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Performance History</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorPerformance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="course" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="marks" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorPerformance)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Grade Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={gradeDistribution}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {gradeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {gradeDistribution.filter(g => g.value > 0).map((grade) => (
              <div key={grade.name} className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: grade.color }} />
                <span className="text-xs text-slate-600">{grade.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
      >
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Detailed Results</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Course</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Exam Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Marks</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Percentage</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {studentResults.map((result, i) => (
                <motion.tr
                  key={result.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 + i * 0.05 }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{result.courseName}</td>
                  <td className="px-4 py-3 text-sm text-slate-500 capitalize">{result.examType}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{result.marks}/{result.maxMarks}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{result.percentage}%</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${result.grade.startsWith('A') ? 'bg-emerald-100 text-emerald-700' :
                      result.grade.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                      {result.grade}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );

  const renderTimetable = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'];

    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Weekly Schedule</h3>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header Row */}
              <div className="grid grid-cols-6 gap-2 mb-2">
                <div className="p-3 font-medium text-slate-500">Time</div>
                {days.map(day => (
                  <div key={day} className="p-3 font-medium text-slate-900 dark:text-white text-center">{day}</div>
                ))}
              </div>

              {/* Time Slots */}
              {timeSlots.map(time => (
                <div key={time} className="grid grid-cols-6 gap-2 mb-2">
                  <div className="p-3 text-sm text-slate-500">{time}</div>
                  {days.map(day => {
                    const session = studentTimetable.find(t => t.day === day && t.startTime === time);
                    return (
                      <div key={`${day}-${time}`} className="p-2">
                        {session ? (
                          <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className={`p-3 rounded-xl text-xs ${session.type === 'lab'
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
                              }`}
                          >
                            <p className="font-medium">{session.courseName}</p>
                            <p className="opacity-75">{session.room}</p>
                            <p className="opacity-75">{session.startTime}-{session.endTime}</p>
                          </motion.div>
                        ) : (
                          <div className="h-full min-h-[80px] rounded-xl border border-dashed border-slate-200 dark:border-slate-700" />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Today's Classes</h3>
            <div className="space-y-3">
              {studentTimetable.filter(t => t.day === 'Monday').map((session) => (
                <div key={session.id} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className={`p-2 rounded-lg ${session.type === 'lab' ? 'bg-purple-100' : 'bg-blue-100'}`}>
                    <Clock className={`w-5 h-5 ${session.type === 'lab' ? 'text-purple-600' : 'text-blue-600'}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">{session.courseName}</p>
                    <p className="text-sm text-slate-500">{session.startTime} - {session.endTime} • {session.room}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${session.type === 'lab' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                    {session.type}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Legend</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-blue-100" />
                <span className="text-sm text-slate-600">Lecture</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-purple-100" />
                <span className="text-sm text-slate-600">Lab Session</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-emerald-100" />
                <span className="text-sm text-slate-600">Tutorial</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  const renderPlacement = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white"
        >
          <p className="text-white/70">Available Opportunities</p>
          <p className="text-4xl font-bold">{placements.length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <p className="text-sm text-slate-500">Applications Sent</p>
          <p className="text-4xl font-bold text-slate-900 dark:text-white">
            {placements.reduce((sum, p) => sum + p.applications.filter(a => a.studentId === user.id).length, 0)}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <p className="text-sm text-slate-500">Shortlisted</p>
          <p className="text-4xl font-bold text-emerald-600">
            {placements.reduce((sum, p) => sum + p.applications.filter(a => a.studentId === user.id && a.status === 'shortlisted').length, 0)}
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Opportunities</h3>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {placements.map((placement, i) => {
            const hasApplied = placement.applications.some(a => a.studentId === user.id);
            const application = placement.applications.find(a => a.studentId === user.id);

            return (
              <motion.div
                key={placement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-slate-900 dark:text-white">{placement.title}</h4>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${placement.type === 'internship' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                        {placement.type}
                      </span>
                    </div>
                    <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">{placement.company}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{placement.description}</p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {placement.skillsRequired.map((skill, j) => (
                        <span key={j} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {placement.location}
                      </span>
                      {placement.ctc && <span>CTC: {placement.ctc}</span>}
                      {placement.stipend && <span>Stipend: {placement.stipend}</span>}
                      <span>Deadline: {new Date(placement.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {hasApplied ? (
                      <>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${application?.status === 'shortlisted' ? 'bg-emerald-100 text-emerald-700' :
                          application?.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                          {application?.status}
                        </span>
                        <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          View Details
                        </button>
                      </>
                    ) : (
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );

  const renderEvents = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <p className="text-sm text-slate-500">Upcoming Events</p>
          <p className="text-4xl font-bold text-slate-900 dark:text-white">
            {events.filter(e => e.status === 'upcoming').length}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <p className="text-sm text-slate-500">Registered</p>
          <p className="text-4xl font-bold text-blue-600">
            {events.filter(e => e.registeredStudents.includes(user.id)).length}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <p className="text-sm text-slate-500">Past Events</p>
          <p className="text-4xl font-bold text-slate-900 dark:text-white">
            {events.filter(e => e.status === 'completed').length}
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {events.map((event, i) => {
          const isRegistered = event.registeredStudents.includes(user.id);
          const isFull = event.registeredStudents.length >= event.registrationLimit;

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{event.title}</h3>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${event.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                      event.status === 'ongoing' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                      {event.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">by {event.clubName}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {new Date(event.date).getDate()}
                  </p>
                  <p className="text-sm text-slate-500">
                    {new Date(event.date).toLocaleString('default', { month: 'short' })}
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{event.description}</p>

              <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {event.time}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {event.venue}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {event.registeredStudents.length}/{event.registrationLimit}
                </span>
              </div>

              <div className="flex gap-2">
                {isRegistered ? (
                  <button className="flex-1 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium">
                    Registered
                  </button>
                ) : isFull ? (
                  <button className="flex-1 py-2 bg-slate-100 text-slate-500 rounded-lg text-sm font-medium" disabled>
                    Full
                  </button>
                ) : (
                  <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Register
                  </button>
                )}
                <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  Details
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const renderLostFound = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            Report Lost Item
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Search className="w-4 h-4" />
            Report Found Item
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Lost Items</h3>
          <div className="space-y-4">
            {lostFoundItems.filter(item => item.itemType === 'lost').map((item) => (
              <div key={item.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">{item.title}</h4>
                    <p className="text-sm text-slate-500 mt-1">{item.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {item.locationFound}
                      </span>
                      <span>{new Date(item.postedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.status === 'open' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Found Items</h3>
          <div className="space-y-4">
            {lostFoundItems.filter(item => item.itemType === 'found').map((item) => (
              <div key={item.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">{item.title}</h4>
                    <p className="text-sm text-slate-500 mt-1">{item.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {item.locationFound}
                      </span>
                      <span>{new Date(item.postedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.status === 'open' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderAIAssistant = () => (
    <div className="h-[calc(100vh-200px)] flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
      >
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">AI Academic Assistant</h3>
              <p className="text-sm text-white/70">Powered by Campus AI</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-2xl p-4 ${msg.sender === 'user'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                }`}>
                <p className="whitespace-pre-line">{msg.message}</p>
                {msg.suggestions && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {msg.suggestions.map((suggestion, j) => (
                      <button
                        key={j}
                        onClick={() => setChatInput(suggestion)}
                        className="px-3 py-1.5 text-xs rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
                <p className={`text-xs mt-2 ${msg.sender === 'user' ? 'text-white/60' : 'text-slate-400'
                  }`}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything about your academics..."
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium"
            >
              Send
            </motion.button>
          </div>
          <div className="flex gap-2 mt-3">
            {['Which lectures should I prioritize?', 'Am I at risk?', 'What skills should I improve?', 'Summarize my academic health'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setChatInput(suggestion)}
                className="px-3 py-1.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'courses':
        return renderCourses();
      case 'attendance':
        return renderAttendance();
      case 'assignments':
        return renderAssignments();
      case 'results':
        return renderResults();
      case 'timetable':
        return renderTimetable();
      case 'placement':
        return renderPlacement();
      case 'events':
        return renderEvents();
      case 'lostfound':
        return renderLostFound();
      case 'ai-assistant':
        return renderAIAssistant();
      default:
        return renderDashboard();
    }
  };

  const tabInfo = getTabTitle();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <StudentSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <motion.main
        initial={{ marginLeft: 280 }}
        animate={{ marginLeft: 280 }}
        className="min-h-screen ml-[280px]"
      >
        <Header
          title={tabInfo.title}
          subtitle={tabInfo.subtitle}
        />

        <div className="p-6">
          {renderContent()}
        </div>
      </motion.main>
    </div>
  );
};

// Student Sidebar Component
const StudentSidebar: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({
  activeTab,
  setActiveTab
}) => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'assignments', label: 'Assignments', icon: ClipboardCheck },
    { id: 'results', label: 'Results', icon: TrendingUp },
    { id: 'timetable', label: 'Timetable', icon: CalendarDays },
    { id: 'placement', label: 'Placement', icon: Briefcase },
    { id: 'events', label: 'Events', icon: CalendarDays },
    { id: 'lostfound', label: 'Lost & Found', icon: Search },
    { id: 'ai-assistant', label: 'AI Assistant', icon: MessageSquare },
  ];

  return (
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
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
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
  );
};

// Header Component
const Header: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => {
  const { user } = useAuth();
  const unreadCount = 3;

  return (
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
              {title}
            </motion.h1>
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-sm text-slate-500 dark:text-slate-400 mt-1"
              >
                {subtitle}
              </motion.p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {unreadCount}
                </span>
              )}
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
  );
};

// Import missing icons
import { LayoutDashboard, LogOut, Bell, ChevronLeft } from 'lucide-react';

export default StudentDashboard;
