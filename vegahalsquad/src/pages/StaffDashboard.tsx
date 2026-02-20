import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import StatCard from '@/components/ui/StatCard';
import ChartCard from '@/components/ui/ChartCard';
import {
  Utensils, Home, ChevronRight, LogOut, GraduationCap,
  LayoutDashboard, Plus, Filter,
  CheckCircle, Clock, DollarSign, BookOpen, Users, AlertTriangle,
  CheckCheck, BedDouble, Wrench
} from 'lucide-react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { menuItems, orders, books, bookIssues, hostelRooms, complaints } from '@/data/dummyData';

const StaffDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!user) return null;

  const staffType = user.staffType;

  // Canteen data
  const canteenStats = {
    totalOrders: orders.length,
    todayRevenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
    pendingOrders: orders.filter(o => o.status === 'pending' || o.status === 'preparing').length,
    availableItems: menuItems.filter(m => m.isAvailable).length,
  };

  const orderTrend = [
    { time: '8AM', orders: 15 },
    { time: '10AM', orders: 25 },
    { time: '12PM', orders: 65 },
    { time: '2PM', orders: 45 },
    { time: '4PM', orders: 30 },
    { time: '6PM', orders: 55 },
    { time: '8PM', orders: 40 },
  ];

  // Library data
  const libraryStats = {
    totalBooks: books.reduce((sum, b) => sum + b.totalCopies, 0),
    availableBooks: books.reduce((sum, b) => sum + b.availableCopies, 0),
    issuedBooks: bookIssues.filter(bi => bi.status === 'issued').length,
    overdueBooks: bookIssues.filter(bi => bi.status === 'overdue').length,
  };

  // Hostel data
  const hostelStats = {
    totalRooms: hostelRooms.length,
    occupiedRooms: hostelRooms.filter(r => r.occupied > 0).length,
    totalStudents: hostelRooms.reduce((sum, r) => sum + r.occupied, 0),
    pendingComplaints: complaints.filter(c => c.status === 'open').length,
  };

  // Maintenance data
  const maintenanceStats = {
    totalTickets: complaints.length,
    openTickets: complaints.filter(c => c.status === 'open').length,
    inProgressTickets: complaints.filter(c => c.status === 'in-progress').length,
    resolvedTickets: complaints.filter(c => c.status === 'resolved').length,
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ...(staffType === 'canteen' ? [
      { id: 'menu', label: 'Menu Management', icon: Utensils },
      { id: 'orders', label: 'Orders', icon: CheckCircle },
    ] : []),
    ...(staffType === 'library' ? [
      { id: 'books', label: 'Book Management', icon: BookOpen },
      { id: 'issues', label: 'Issue/Return', icon: CheckCheck },
    ] : []),
    ...(staffType === 'hostel' ? [
      { id: 'rooms', label: 'Room Allocation', icon: BedDouble },
      { id: 'complaints', label: 'Complaints', icon: AlertTriangle },
    ] : []),
    ...(staffType === 'maintenance' ? [
      { id: 'tickets', label: 'Tickets', icon: Wrench },
    ] : []),
  ];

  const renderCanteenDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Today's Orders" value={canteenStats.totalOrders} icon={CheckCircle} color="blue" delay={0} />
        <StatCard title="Revenue" value={`₹${canteenStats.todayRevenue}`} icon={DollarSign} color="green" delay={0.1} />
        <StatCard title="Pending" value={canteenStats.pendingOrders} icon={Clock} color="orange" delay={0.2} />
        <StatCard title="Available Items" value={canteenStats.availableItems} icon={Utensils} color="purple" delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Order Trend" subtitle="Today's hourly orders">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={orderTrend}>
              <defs>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="orders" stroke="#3B82F6" fillOpacity={1} fill="url(#colorOrders)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Orders</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div className="space-y-3">
            {orders.slice(0, 4).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{order.studentName}</p>
                  <p className="text-sm text-slate-500">{order.items.length} items • ₹{order.totalAmount}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                  order.status === 'ready' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'preparing' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                  }`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Menu Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Menu Items</h3>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </motion.button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {menuItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-slate-900 dark:text-white">{item.name}</h4>
                <span className={`w-2 h-2 rounded-full ${item.isAvailable ? 'bg-emerald-500' : 'bg-red-500'}`} />
              </div>
              <p className="text-sm text-slate-500 mb-2">{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 dark:text-white">₹{item.price}</span>
                <span className={`px-2 py-1 rounded-lg text-xs ${item.isVeg ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                  {item.isVeg ? 'Veg' : 'Non-Veg'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderLibraryDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Books" value={libraryStats.totalBooks} icon={BookOpen} color="blue" delay={0} />
        <StatCard title="Available" value={libraryStats.availableBooks} icon={CheckCircle} color="green" delay={0.1} />
        <StatCard title="Issued" value={libraryStats.issuedBooks} icon={Users} color="orange" delay={0.2} />
        <StatCard title="Overdue" value={libraryStats.overdueBooks} icon={AlertTriangle} color="red" delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Book Inventory</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div className="space-y-3">
            {books.map((book) => (
              <div key={book.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{book.title}</p>
                  <p className="text-sm text-slate-500">{book.author} • {book.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{book.availableCopies}/{book.totalCopies}</p>
                  <p className="text-xs text-slate-400">available</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Issues</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div className="space-y-3">
            {bookIssues.map((issue) => (
              <div key={issue.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{issue.bookTitle}</p>
                  <p className="text-sm text-slate-500">{issue.studentName}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${issue.status === 'returned' ? 'bg-emerald-100 text-emerald-700' :
                    issue.status === 'overdue' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                    {issue.status}
                  </span>
                  {issue.fine > 0 && (
                    <p className="text-xs text-red-500 mt-1">Fine: ₹{issue.fine}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderHostelDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Rooms" value={hostelStats.totalRooms} icon={Home} color="blue" delay={0} />
        <StatCard title="Occupied" value={hostelStats.occupiedRooms} icon={Users} color="purple" delay={0.1} />
        <StatCard title="Students" value={hostelStats.totalStudents} icon={GraduationCap} color="green" delay={0.2} />
        <StatCard title="Complaints" value={hostelStats.pendingComplaints} icon={AlertTriangle} color="red" delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Room Allocation</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {hostelRooms.map((room) => (
              <div key={room.id} className={`p-4 rounded-xl border ${room.occupied === room.capacity
                ? 'border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20'
                : 'border-slate-200 dark:border-slate-700'
                }`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Room {room.roomNumber}</h4>
                  <span className={`px-2 py-1 rounded-lg text-xs ${room.occupied === room.capacity
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                    }`}>
                    {room.occupied === room.capacity ? 'Full' : 'Available'}
                  </span>
                </div>
                <p className="text-sm text-slate-500">Block {room.block} • {room.roomType}</p>
                <p className="text-sm text-slate-600 mt-2">{room.occupied}/{room.capacity} occupied</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Complaints</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div className="space-y-3">
            {complaints.map((complaint) => (
              <div key={complaint.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{complaint.title}</p>
                    <p className="text-sm text-slate-500">{complaint.raisedByName} • Room {complaint.roomNumber}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${complaint.priority === 'high' ? 'bg-red-100 text-red-700' :
                    complaint.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                    {complaint.priority}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${complaint.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                    complaint.status === 'in-progress' ? 'bg-purple-100 text-purple-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                    {complaint.status}
                  </span>
                  {complaint.status !== 'resolved' && (
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderMaintenanceDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Tickets" value={maintenanceStats.totalTickets} icon={Wrench} color="blue" delay={0} />
        <StatCard title="Open" value={maintenanceStats.openTickets} icon={AlertTriangle} color="red" delay={0.1} />
        <StatCard title="In Progress" value={maintenanceStats.inProgressTickets} icon={Clock} color="orange" delay={0.2} />
        <StatCard title="Resolved" value={maintenanceStats.resolvedTickets} icon={CheckCircle} color="green" delay={0.3} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Maintenance Tickets</h3>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {complaints.map((ticket, i) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${ticket.category === 'electrical' ? 'bg-yellow-100 text-yellow-600' :
                    ticket.category === 'plumbing' ? 'bg-blue-100 text-blue-600' :
                      ticket.category === 'furniture' ? 'bg-amber-100 text-amber-600' :
                        'bg-slate-100 text-slate-600'
                    }`}>
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{ticket.title}</h4>
                    <p className="text-sm text-slate-500 mt-1">{ticket.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                      <span>Raised by: {ticket.raisedByName}</span>
                      <span>•</span>
                      <span>Room: {ticket.roomNumber}</span>
                      <span>•</span>
                      <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${ticket.priority === 'high' ? 'bg-red-100 text-red-700' :
                    ticket.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                    {ticket.priority} priority
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${ticket.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                    ticket.status === 'in-progress' ? 'bg-purple-100 text-purple-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                    {ticket.status}
                  </span>
                </div>
              </div>

              {ticket.status !== 'resolved' && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  {ticket.status === 'open' && (
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                      Start Work
                    </button>
                  )}
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
                    Mark Resolved
                  </button>
                  <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    Assign
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderDashboard = () => {
    switch (staffType) {
      case 'canteen':
        return renderCanteenDashboard();
      case 'library':
        return renderLibraryDashboard();
      case 'hostel':
        return renderHostelDashboard();
      case 'maintenance':
        return renderMaintenanceDashboard();
      default:
        return renderCanteenDashboard();
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
                <p className="text-xs text-slate-400 capitalize">{staffType} Staff</p>
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
                  {staffType?.charAt(0).toUpperCase()}{staffType?.slice(1)} Dashboard
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
                </motion.button>

                <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{staffType} Staff</p>
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
          {renderDashboard()}
        </div>
      </motion.main>
    </div>
  );
};

// Import missing icon
import { Bell } from 'lucide-react';

export default StaffDashboard;
