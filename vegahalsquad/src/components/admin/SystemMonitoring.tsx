import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, Database, Server, AlertTriangle, CheckCircle, 
  Clock, Users, TrendingUp, TrendingDown, RefreshCw
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar
} from 'recharts';
import { systemMetrics } from '@/data/enhancedDummyData';

const SystemMonitoring: React.FC = () => {
  const [metrics] = useState(systemMetrics);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLive, setIsLive] = useState(true);
  
  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // In a real app, this would fetch new metrics
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isLive]);
  
  const latestMetrics = metrics[metrics.length - 1];
  
  const getHealthStatus = (health: string) => {
    switch (health) {
      case 'healthy':
        return { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-100', label: 'Healthy' };
      case 'degraded':
        return { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-100', label: 'Degraded' };
      case 'critical':
        return { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-100', label: 'Critical' };
      default:
        return { icon: CheckCircle, color: 'text-slate-500', bg: 'bg-slate-100', label: 'Unknown' };
    }
  };
  
  const healthStatus = getHealthStatus(latestMetrics.apiHealth);
  const HealthIcon = healthStatus.icon;

  const statCards = [
    { 
      label: 'Active Users', 
      value: latestMetrics.activeUsers, 
      icon: Users, 
      color: 'blue',
      trend: '+12%',
      trendUp: true
    },
    { 
      label: 'CPU Usage', 
      value: `${latestMetrics.cpuUsage}%`, 
      icon: Cpu, 
      color: 'purple',
      trend: '-5%',
      trendUp: false
    },
    { 
      label: 'Memory', 
      value: `${latestMetrics.memoryUsage}%`, 
      icon: Database, 
      color: 'amber',
      trend: '+3%',
      trendUp: true
    },
    { 
      label: 'Response Time', 
      value: `${latestMetrics.avgResponseTime}ms`, 
      icon: Clock, 
      color: 'emerald',
      trend: '-8%',
      trendUp: false
    },
    { 
      label: 'Error Rate', 
      value: `${latestMetrics.errorRate}%`, 
      icon: AlertTriangle, 
      color: 'red',
      trend: '+0.2%',
      trendUp: true
    },
    { 
      label: 'DB Connections', 
      value: latestMetrics.databaseConnections, 
      icon: Server, 
      color: 'cyan',
      trend: 'stable',
      trendUp: null
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Live Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${healthStatus.bg}`}>
            <HealthIcon className={`w-5 h-5 ${healthStatus.color}`} />
            <span className={`font-medium ${healthStatus.color}`}>{healthStatus.label}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            {isLive ? 'Live' : 'Paused'}
            <span className="text-slate-400">•</span>
            Last update: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isLive 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {isLive ? 'Pause' : 'Resume'}
          </button>
          <button
            onClick={() => setLastUpdate(new Date())}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`w-4 h-4 text-${stat.color}-600`} />
              </div>
              {stat.trendUp !== null && (
                <span className={`flex items-center gap-1 text-xs ${stat.trendUp ? 'text-emerald-600' : 'text-blue-600'}`}>
                  {stat.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.trend}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
            <p className="text-xs text-slate-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Users Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Active Users</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={metrics}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(val) => new Date(val).getHours() + ':00'}
                tick={{ fontSize: 12 }} 
              />
              <YAxis />
              <Tooltip 
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                labelFormatter={(val) => new Date(val).toLocaleTimeString()}
              />
              <Area 
                type="monotone" 
                dataKey="activeUsers" 
                stroke="#3B82F6" 
                fillOpacity={1} 
                fill="url(#colorUsers)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
        
        {/* Response Time Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Response Time (ms)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(val) => new Date(val).getHours() + ':00'}
                tick={{ fontSize: 12 }} 
              />
              <YAxis />
              <Tooltip 
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                labelFormatter={(val) => new Date(val).toLocaleTimeString()}
              />
              <Line 
                type="monotone" 
                dataKey="avgResponseTime" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
      
      {/* Resource Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPU & Memory */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Resource Usage</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(val) => new Date(val).getHours() + ':00'}
                tick={{ fontSize: 12 }} 
              />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                labelFormatter={(val) => new Date(val).toLocaleTimeString()}
              />
              <Line type="monotone" dataKey="cpuUsage" stroke="#8B5CF6" strokeWidth={2} name="CPU %" />
              <Line type="monotone" dataKey="memoryUsage" stroke="#F59E0B" strokeWidth={2} name="Memory %" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
        
        {/* Error Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Error Rate (%)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(val) => new Date(val).getHours() + ':00'}
                tick={{ fontSize: 12 }} 
              />
              <YAxis />
              <Tooltip 
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                labelFormatter={(val) => new Date(val).toLocaleTimeString()}
              />
              <Bar dataKey="errorRate" fill="#EF4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
      
      {/* System Health Mind Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
      >
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">System Health Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'API Gateway', status: 'healthy', latency: '45ms' },
            { name: 'Auth Service', status: 'healthy', latency: '32ms' },
            { name: 'Database', status: 'healthy', latency: '28ms' },
            { name: 'Cache Layer', status: 'degraded', latency: '120ms' },
            { name: 'File Storage', status: 'healthy', latency: '55ms' },
            { name: 'Notification', status: 'healthy', latency: '38ms' },
            { name: 'AI Service', status: 'healthy', latency: '180ms' },
            { name: 'Analytics', status: 'healthy', latency: '42ms' },
          ].map((service, i) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.05 }}
              className={`p-4 rounded-xl border ${
                service.status === 'healthy' 
                  ? 'border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20' 
                  : service.status === 'degraded'
                  ? 'border-amber-200 bg-amber-50 dark:bg-amber-950/20'
                  : 'border-red-200 bg-red-50 dark:bg-red-950/20'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${
                  service.status === 'healthy' ? 'bg-emerald-500' : 
                  service.status === 'degraded' ? 'bg-amber-500' : 'bg-red-500'
                }`} />
                <span className="font-medium text-slate-900 dark:text-white text-sm">{service.name}</span>
              </div>
              <p className="text-xs text-slate-500">Latency: {service.latency}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SystemMonitoring;
