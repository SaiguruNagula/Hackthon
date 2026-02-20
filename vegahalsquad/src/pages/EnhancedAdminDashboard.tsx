import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users, BookOpen, GraduationCap, TrendingUp, Bell, ChevronRight,
  LogOut, LayoutDashboard, BarChart3, MessageSquare, Network,
  Search, Trash2, Edit, UserPlus, Send, Download, RefreshCw,
  AlertTriangle, CheckCircle, X, Shield, Activity, Plus, Filter
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { dashboardStats, users } from '@/data/dummyData';
import {
  enhancedAIInsights
} from '@/data/enhancedDummyData';
import NetworkVisualization from '@/components/admin/NetworkVisualization';
import SystemMonitoring from '@/components/admin/SystemMonitoring';
import { useData } from '@/contexts/DataContext';
import { useAIConfig } from '@/contexts/AIConfigContext';
import { toast } from 'sonner';

const EnhancedAdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { announcements, addAnnouncement } = useData();
  const { apiKey, provider, setApiKey, setProvider } = useAIConfig();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  const [broadcastForm, setBroadcastForm] = useState({
    title: '',
    content: '',
    targetAudience: 'All Users' as any,
    priority: 'medium' as any
  });

  if (!user) return null;

  // Analytics data
  const departmentData = [
    { name: 'CSE', students: 450, faculty: 25, avgGPA: 8.2 },
    { name: 'ECE', students: 320, faculty: 18, avgGPA: 7.8 },
    { name: 'IT', students: 280, faculty: 15, avgGPA: 8.0 },
    { name: 'MECH', students: 195, faculty: 12, avgGPA: 7.5 },
    { name: 'CIVIL', students: 150, faculty: 8, avgGPA: 7.6 },
  ];

  const attendanceTrend = [
    { month: 'Aug', attendance: 88 },
    { month: 'Sep', attendance: 85 },
    { month: 'Oct', attendance: 82 },
    { month: 'Nov', attendance: 84 },
    { month: 'Dec', attendance: 79 },
    { month: 'Jan', attendance: 82.5 },
  ];

  const userDistribution = [
    { name: 'Students', value: 1245, color: '#3B82F6' },
    { name: 'Faculty', value: 78, color: '#8B5CF6' },
    { name: 'Staff', value: 45, color: '#10B981' },
    { name: 'Admin', value: 5, color: '#F59E0B' },
  ];

  const placementData = [
    { company: 'Google', offers: 12 },
    { company: 'Microsoft', offers: 18 },
    { company: 'Amazon', offers: 25 },
    { company: 'TCS', offers: 45 },
    { company: 'Infosys', offers: 38 },
    { company: 'Wipro', offers: 32 },
  ];

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'ai-insights', label: 'AI Insights', icon: MessageSquare },
    { id: 'network', label: 'Network View', icon: Network },
    { id: 'broadcast', label: 'Broadcast', icon: Send },
    { id: 'monitoring', label: 'System Monitor', icon: Activity },
    { id: 'ai-settings', label: 'AI Settings', icon: Shield },
  ];

  const handleSendBroadcast = () => {
    if (!broadcastForm.title || !broadcastForm.content) {
      toast.error('Please fill in all fields');
      return;
    }

    addAnnouncement({
      title: broadcastForm.title,
      content: broadcastForm.content,
      targetAudience: broadcastForm.targetAudience,
      priority: broadcastForm.priority,
      postedBy: user?.id || 'admin',
      postedByName: user?.name || 'Administrator'
    });

    toast.success('Broadcast sent successfully!');
    setBroadcastForm({
      title: '',
      content: '',
      targetAudience: 'All Users' as any,
      priority: 'medium' as any
    });
    setShowBroadcastModal(false);
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl"><Users className="w-6 h-6 text-blue-600" /></div>
            <div>
              <p className="text-sm text-slate-500">Total Students</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{dashboardStats.totalStudents}</p>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-xl"><GraduationCap className="w-6 h-6 text-purple-600" /></div>
            <div>
              <p className="text-sm text-slate-500">Total Faculty</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{dashboardStats.totalFaculty}</p>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-xl"><BookOpen className="w-6 h-6 text-amber-600" /></div>
            <div>
              <p className="text-sm text-slate-500">Active Courses</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{dashboardStats.totalCourses}</p>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-xl"><TrendingUp className="w-6 h-6 text-emerald-600" /></div>
            <div>
              <p className="text-sm text-slate-500">Avg Attendance</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{dashboardStats.avgAttendance}%</p>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-xl"><AlertTriangle className="w-6 h-6 text-red-600" /></div>
            <div>
              <p className="text-sm text-slate-500">At Risk</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{dashboardStats.atRiskStudents}</p>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-100 rounded-xl"><TrendingUp className="w-6 h-6 text-cyan-600" /></div>
            <div>
              <p className="text-sm text-slate-500">Placement Rate</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{dashboardStats.placementRate}%</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Department Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" domain={[0, 10]} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar yAxisId="left" dataKey="students" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              <Bar yAxisId="right" dataKey="avgGPA" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={attendanceTrend}>
              <defs>
                <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis domain={[70, 100]} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="attendance" stroke="#10B981" fillOpacity={1} fill="url(#colorAttendance)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* AI Insights */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">AI Insights</h3>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"><RefreshCw className="w-4 h-4 text-slate-400" /></button>
        </div>
        <div className="space-y-3">
          {enhancedAIInsights.slice(0, 4).map((insight, i) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + i * 0.1 }}
              className={`p-4 rounded-xl border-l-4 ${insight.severity === 'critical' ? 'border-red-500 bg-red-50 dark:bg-red-950/20' :
                insight.severity === 'warning' ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/20' :
                  'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className={`font-medium ${insight.severity === 'critical' ? 'text-red-800 dark:text-red-400' :
                    insight.severity === 'warning' ? 'text-amber-800 dark:text-amber-400' :
                      'text-blue-800 dark:text-blue-400'
                    }`}>{insight.title}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{insight.message}</p>
                  {insight.actions && (
                    <div className="flex gap-2 mt-3">
                      {insight.actions.map((action, j) => (
                        <button key={j} className="px-3 py-1 bg-white dark:bg-slate-800 rounded-lg text-xs font-medium hover:bg-slate-50">
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-xs text-slate-400">{new Date(insight.createdAt).toLocaleDateString()}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50">
          <Filter className="w-5 h-5" />
          Filter
        </button>
        <button className="flex items-center gap-2 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50">
          <Download className="w-5 h-5" />
          Export
        </button>
      </div>

      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">User</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Role</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Department</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Status</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredUsers.map((u, i) => (
              <motion.tr
                key={u.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{u.name}</p>
                      <p className="text-sm text-slate-500">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${u.role === 'student' ? 'bg-blue-100 text-blue-700' :
                    u.role === 'faculty' ? 'bg-purple-100 text-purple-700' :
                      u.role === 'admin' ? 'bg-orange-100 text-orange-700' :
                        'bg-emerald-100 text-emerald-700'
                    }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">{u.department || u.staffType || '-'}</td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1 text-sm text-emerald-600">
                    <CheckCircle className="w-4 h-4" />
                    Active
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-slate-100 rounded-lg"><Edit className="w-4 h-4 text-slate-400" /></button>
                    <button className="p-2 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-400" /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics Dashboard</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">User Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={userDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                {userDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {userDistribution.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-slate-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Placement Statistics</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={placementData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="company" type="category" tick={{ fontSize: 12 }} width={80} />
              <Tooltip />
              <Bar dataKey="offers" fill="#3B82F6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Department Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Department</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Students</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Faculty</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Avg GPA</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {departmentData.map((dept) => (
                <tr key={dept.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{dept.name}</td>
                  <td className="px-4 py-3 text-slate-600">{dept.students}</td>
                  <td className="px-4 py-3 text-slate-600">{dept.faculty}</td>
                  <td className="px-4 py-3 text-slate-600">{dept.avgGPA}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${dept.avgGPA >= 8 ? 'bg-emerald-100 text-emerald-700' :
                      dept.avgGPA >= 7 ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                      {dept.avgGPA >= 8 ? 'Excellent' : dept.avgGPA >= 7 ? 'Good' : 'Average'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAIInsights = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">AI Insights & Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['all', 'attendance', 'performance', 'placement', 'risk'].map((type) => (
          <button
            key={type}
            className="px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium capitalize hover:bg-slate-50"
          >
            {type} Insights
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {enhancedAIInsights.map((insight, i) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-2xl border p-6 ${insight.severity === 'critical' ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' :
              insight.severity === 'warning' ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800' :
                'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'
              }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${insight.type === 'attendance' ? 'bg-blue-100 text-blue-700' :
                    insight.type === 'performance' ? 'bg-purple-100 text-purple-700' :
                      insight.type === 'placement' ? 'bg-emerald-100 text-emerald-700' :
                        insight.type === 'risk' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                    }`}>
                    {insight.type}
                  </span>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${insight.severity === 'critical' ? 'bg-red-100 text-red-700' :
                    insight.severity === 'warning' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                    {insight.severity}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{insight.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 mt-1">{insight.message}</p>
                {insight.actions && (
                  <div className="flex gap-2 mt-4">
                    {insight.actions.map((action, j) => (
                      <button key={j} className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg text-sm font-medium hover:bg-slate-50">
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-sm text-slate-400">{new Date(insight.createdAt).toLocaleDateString()}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderNetwork = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Network Visualization</h2>
          <p className="text-slate-500">Interactive view of campus connections and relationships</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm hover:bg-slate-50">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <NetworkVisualization height={600} />
    </div>
  );

  const renderBroadcast = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Broadcast System</h2>
          <p className="text-slate-500">Send emergency alerts and campus-wide announcements</p>
        </div>
        <button
          onClick={() => setShowBroadcastModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Broadcast
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-2xl border transition-all ${notification.priority === 'emergency' ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' :
              notification.priority === 'high' ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800' :
                'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{notification.title}</h3>
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
              <div className="flex gap-2">
                <button className="p-2 hover:bg-slate-100 rounded-lg"><Edit className="w-4 h-4 text-slate-400" /></button>
                <button className="p-2 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-400" /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Broadcast Modal */}
      <AnimatePresence>
        {showBroadcastModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowBroadcastModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Send Broadcast</h3>
                <button onClick={() => setShowBroadcastModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={broadcastForm.title}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    placeholder="Announcement title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
                  <textarea
                    value={broadcastForm.content}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, content: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white h-32"
                    placeholder="Your message"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target</label>
                    <select
                      value={broadcastForm.targetAudience}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, targetAudience: e.target.value as any })}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="All Users">All Users</option>
                      <option value="Students Only">Students Only</option>
                      <option value="Faculty Only">Faculty Only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                    <select
                      value={broadcastForm.priority}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, priority: e.target.value as any })}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="emergency">Emergency</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleSendBroadcast}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Send Broadcast
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderMonitoring = () => (
    <SystemMonitoring />
  );

  const renderAISettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">AI Configuration</h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 max-w-2xl shadow-sm"
      >
        <div className="flex items-center gap-4 mb-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900">
          <Shield className="w-8 h-8 text-blue-600" />
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Administrator API Access</h3>
            <p className="text-sm text-slate-500">Configure global AI API keys for CampuSync smart monitoring features.</p>
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
              API Key (Demo)
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
                toast.success('Admin AI Configuration saved!');
              }}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
            >
              Save Global Configuration
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'users': return renderUserManagement();
      case 'analytics': return renderAnalytics();
      case 'ai-insights': return renderAIInsights();
      case 'network': return renderNetwork();
      case 'broadcast': return renderBroadcast();
      case 'monitoring': return renderMonitoring();
      case 'ai-settings': return renderAISettings();
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="font-bold text-lg">Admin Panel</h1>
                <p className="text-xs text-slate-400">Campus Command</p>
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
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${isActive ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
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
                <p className="text-[10px] text-slate-400">Administrator</p>
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
                  Admin Dashboard
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Campus Command Center</p>
              </div>
              <div className="flex items-center gap-4">
                <button className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">5</span>
                </button>
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-slate-500">Administrator</p>
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
    </div>
  );
};

export default EnhancedAdminDashboard;
