import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, 
  Calendar, FileText, Award, Target
} from 'lucide-react';
import { academicHealthData } from '@/data/enhancedDummyData';
import { useAuth } from '@/contexts/AuthContext';

const AcademicHealthScore: React.FC = () => {
  const { user } = useAuth();
  const health = user ? academicHealthData.find(h => h.studentId === user.id) : null;
  
  if (!health) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500">No health data available</p>
      </div>
    );
  }
  
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-emerald-500';
      case 'medium': return 'text-amber-500';
      case 'high': return 'text-red-500';
      default: return 'text-slate-500';
    }
  };
  
  const getRiskBg = (level: string) => {
    switch (level) {
      case 'low': return 'bg-emerald-500';
      case 'medium': return 'bg-amber-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };
  
  const getRiskLabel = (level: string) => {
    switch (level) {
      case 'low': return 'Healthy';
      case 'medium': return 'At Risk';
      case 'high': return 'Critical';
      default: return 'Unknown';
    }
  };

  const scoreCategories = [
    { label: 'Attendance', score: health.attendanceScore, icon: Calendar, color: 'blue' },
    { label: 'Performance', score: health.performanceScore, icon: Award, color: 'purple' },
    { label: 'Assignments', score: health.assignmentScore, icon: FileText, color: 'emerald' },
    { label: 'Skills', score: health.skillScore, icon: Target, color: 'orange' },
  ];

  return (
    <div className="space-y-6">
      {/* Main Health Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
      >
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Circular Score */}
          <div className="relative">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-slate-100 dark:text-slate-800"
              />
              <motion.circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 70}`}
                initial={{ strokeDashoffset: `${2 * Math.PI * 70}` }}
                animate={{ strokeDashoffset: `${2 * Math.PI * 70 * (1 - health.overallScore / 100)}` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className={getRiskColor(health.riskLevel)}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold ${getRiskColor(health.riskLevel)}`}>
                {health.overallScore}
              </span>
              <span className="text-sm text-slate-400">/100</span>
            </div>
          </div>
          
          {/* Score Details */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Academic Health Score
            </h3>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getRiskBg(health.riskLevel)} bg-opacity-10`}>
              <Heart className={`w-5 h-5 ${getRiskColor(health.riskLevel)}`} />
              <span className={`font-medium ${getRiskColor(health.riskLevel)}`}>
                {getRiskLabel(health.riskLevel)} Status
              </span>
            </div>
            <p className="text-slate-500 mt-4">
              Last updated: {new Date(health.lastUpdated).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        {/* Category Scores */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {scoreCategories.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800"
            >
              <cat.icon className={`w-6 h-6 mx-auto mb-2 text-${cat.color}-500`} />
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{cat.score}</p>
              <p className="text-xs text-slate-500">{cat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Risk Factors */}
      {health.riskFactors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-6"
        >
          <h4 className="flex items-center gap-2 text-lg font-semibold text-amber-800 dark:text-amber-400 mb-4">
            <AlertTriangle className="w-5 h-5" />
            Risk Factors Detected
          </h4>
          <ul className="space-y-2">
            {health.riskFactors.map((factor, i) => (
              <li key={i} className="flex items-start gap-2 text-amber-700 dark:text-amber-400">
                <TrendingDown className="w-4 h-4 mt-0.5 flex-shrink-0" />
                {factor}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
      
      {/* Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 p-6"
      >
        <h4 className="flex items-center gap-2 text-lg font-semibold text-emerald-800 dark:text-emerald-400 mb-4">
          <TrendingUp className="w-5 h-5" />
          AI Recommendations
        </h4>
        <ul className="space-y-2">
          {health.suggestions.map((suggestion, i) => (
            <li key={i} className="flex items-start gap-2 text-emerald-700 dark:text-emerald-400">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {suggestion}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default AcademicHealthScore;
