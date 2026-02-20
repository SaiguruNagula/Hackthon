import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'cyan';
  delay?: number;
}

const colorVariants = {
  blue: 'from-blue-500 to-blue-600 shadow-blue-500/25',
  green: 'from-emerald-500 to-emerald-600 shadow-emerald-500/25',
  purple: 'from-purple-500 to-purple-600 shadow-purple-500/25',
  orange: 'from-orange-500 to-orange-600 shadow-orange-500/25',
  red: 'from-red-500 to-red-600 shadow-red-500/25',
  cyan: 'from-cyan-500 to-cyan-600 shadow-cyan-500/25',
};

const bgVariants = {
  blue: 'bg-blue-50 dark:bg-blue-950/30',
  green: 'bg-emerald-50 dark:bg-emerald-950/30',
  purple: 'bg-purple-50 dark:bg-purple-950/30',
  orange: 'bg-orange-50 dark:bg-orange-950/30',
  red: 'bg-red-50 dark:bg-red-950/30',
  cyan: 'bg-cyan-50 dark:bg-cyan-950/30',
};

const iconVariants = {
  blue: 'text-blue-600 dark:text-blue-400',
  green: 'text-emerald-600 dark:text-emerald-400',
  purple: 'text-purple-600 dark:text-purple-400',
  orange: 'text-orange-600 dark:text-orange-400',
  red: 'text-red-600 dark:text-red-400',
  cyan: 'text-cyan-600 dark:text-cyan-400',
};

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  trendLabel,
  color,
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl transition-shadow duration-300"
    >
      {/* Background Gradient Blob */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${colorVariants[color]} opacity-10 blur-2xl`} />
      
      <div className="relative">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{value}</h3>
            {subtitle && (
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtitle}</p>
            )}
          </div>
          
          <div className={`p-3 rounded-xl ${bgVariants[color]}`}>
            <Icon className={`w-6 h-6 ${iconVariants[color]}`} />
          </div>
        </div>

        {trend !== undefined && (
          <div className="flex items-center gap-2 mt-4">
            <div className={`flex items-center gap-1 text-sm font-medium ${
              trend >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{Math.abs(trend)}%</span>
            </div>
            {trendLabel && (
              <span className="text-xs text-slate-400 dark:text-slate-500">{trendLabel}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
