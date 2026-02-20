import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
}

const colorVariants = {
  blue: 'bg-blue-500',
  green: 'bg-emerald-500',
  yellow: 'bg-amber-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
};

const sizeVariants = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  color = 'blue', 
  size = 'md',
  showLabel = true,
  label
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  const getColorByProgress = () => {
    if (color !== 'blue') return colorVariants[color];
    if (clampedProgress >= 80) return colorVariants.green;
    if (clampedProgress >= 60) return colorVariants.blue;
    if (clampedProgress >= 40) return colorVariants.yellow;
    return colorVariants.red;
  };

  return (
    <div className="w-full">
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>}
          {showLabel && (
            <span className={`text-sm font-medium ${
              clampedProgress >= 80 ? 'text-emerald-600' :
              clampedProgress >= 60 ? 'text-blue-600' :
              clampedProgress >= 40 ? 'text-amber-600' : 'text-red-600'
            }`}>
              {clampedProgress.toFixed(1)}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden ${sizeVariants[size]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
          className={`h-full rounded-full ${getColorByProgress()}`}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
