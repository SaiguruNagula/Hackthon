import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/types';
import {
  LayoutDashboard, BookOpen, Calendar, ClipboardList, GraduationCap,
  Briefcase, CalendarDays, Search, MessageSquare, Users, Settings,
  Utensils, Library, Home, Wrench, Bell, BarChart3,
  Network, Lightbulb, LogOut, ChevronLeft, ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['student', 'faculty', 'admin', 'staff'] },
  { id: 'courses', label: 'My Courses', icon: BookOpen, roles: ['student'] },
  { id: 'attendance', label: 'Attendance', icon: Calendar, roles: ['student', 'faculty'] },
  { id: 'assignments', label: 'Assignments', icon: ClipboardList, roles: ['student', 'faculty'] },
  { id: 'results', label: 'Results', icon: GraduationCap, roles: ['student'] },
  { id: 'timetable', label: 'Timetable', icon: CalendarDays, roles: ['student'] },
  { id: 'placement', label: 'Placement', icon: Briefcase, roles: ['student', 'faculty'] },
  { id: 'events', label: 'Events', icon: CalendarDays, roles: ['student'] },
  { id: 'lostfound', label: 'Lost & Found', icon: Search, roles: ['student'] },
  { id: 'ai-assistant', label: 'AI Assistant', icon: MessageSquare, roles: ['student'] },
  { id: 'course-mgmt', label: 'Course Management', icon: BookOpen, roles: ['faculty'] },
  { id: 'announcements', label: 'Announcements', icon: Bell, roles: ['faculty'] },
  { id: 'marks', label: 'Marks & Grades', icon: GraduationCap, roles: ['faculty'] },
  { id: 'problems', label: 'Problem Solving', icon: Lightbulb, roles: ['faculty'] },
  { id: 'users', label: 'User Management', icon: Users, roles: ['admin'] },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, roles: ['admin'] },
  { id: 'ai-insights', label: 'AI Insights', icon: MessageSquare, roles: ['admin'] },
  { id: 'network', label: 'Network View', icon: Network, roles: ['admin'] },
  { id: 'broadcast', label: 'Broadcast', icon: Bell, roles: ['admin'] },
  { id: 'canteen', label: 'Canteen', icon: Utensils, roles: ['staff'] },
  { id: 'library', label: 'Library', icon: Library, roles: ['staff'] },
  { id: 'hostel', label: 'Hostel', icon: Home, roles: ['staff'] },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench, roles: ['staff'] },
  { id: 'settings', label: 'Settings', icon: Settings, roles: ['student', 'faculty', 'admin', 'staff'] },
];

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed, activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  const filteredNavItems = navItems.filter(item =>
    user && item.roles.includes(user.role)
  );

  return (
    <motion.aside
      initial={{ width: 280 }}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
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
          {filteredNavItems.map((item) => {
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
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
                {!isCollapsed && (
                  <span className="font-medium text-sm whitespace-nowrap">{item.label}</span>
                )}
                {isActive && !isCollapsed && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                  />
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

export default Sidebar;
