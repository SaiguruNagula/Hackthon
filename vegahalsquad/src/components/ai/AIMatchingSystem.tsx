import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Target, TrendingUp, AlertCircle, CheckCircle, 
  XCircle, ChevronDown, ChevronUp, Briefcase, Award, Zap
} from 'lucide-react';
import { aiMatchResults, placements } from '@/data/enhancedDummyData';
import { useAuth } from '@/contexts/AuthContext';

interface MatchCardProps {
  match: typeof aiMatchResults[0];
  placement: typeof placements[0];
  index: number;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, placement, index }) => {
  const [expanded, setExpanded] = useState(false);
  const [applied, setApplied] = useState(false);
  
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-500';
    if (score >= 70) return 'text-blue-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-red-500';
  };
  
  const getScoreBg = (score: number) => {
    if (score >= 85) return 'bg-emerald-500';
    if (score >= 70) return 'bg-blue-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{placement.title}</h3>
              <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                placement.type === 'internship' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
              }`}>
                {placement.type}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium mb-2">{placement.company}</p>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span>{placement.location}</span>
              {placement.ctc && <span>• CTC: {placement.ctc}</span>}
              {placement.stipend && <span>• Stipend: {placement.stipend}</span>}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className={`text-4xl font-bold ${getScoreColor(match.matchScore)}`}>
              {match.matchScore}%
            </div>
            <span className="text-xs text-slate-400">Match Score</span>
          </div>
        </div>
        
        {/* Match Score Bar */}
        <div className="mt-4">
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${match.matchScore}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className={`h-full ${getScoreBg(match.matchScore)} rounded-full`}
            />
          </div>
        </div>
        
        {/* Quick Match Reasons */}
        <div className="flex flex-wrap gap-2 mt-4">
          {match.matchReasons.slice(0, 2).map((reason, i) => (
            <span key={i} className="flex items-center gap-1 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs">
              <CheckCircle className="w-3 h-3" />
              {reason.length > 40 ? reason.substring(0, 40) + '...' : reason}
            </span>
          ))}
          {match.matchReasons.length > 2 && (
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-xs">
              +{match.matchReasons.length - 2} more
            </span>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {expanded ? 'Hide Details' : 'View Details'}
          </button>
          <button
            onClick={() => setApplied(true)}
            disabled={applied}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              applied 
                ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {applied ? (
              <><CheckCircle className="w-4 h-4" /> Applied</>
            ) : (
              <><Briefcase className="w-4 h-4" /> Apply Now</>
            )}
          </button>
        </div>
      </div>
      
      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-200 dark:border-slate-800"
          >
            <div className="p-6 space-y-6">
              {/* Why It Matches */}
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Why This Matches Your Profile
                </h4>
                <ul className="space-y-2">
                  {match.matchReasons.map((reason, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Skill Gaps */}
              {match.skillGaps.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white mb-3">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    Skill Gaps to Address
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {match.skillGaps.map((gap, i) => (
                      <span key={i} className="flex items-center gap-1 px-3 py-1 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 rounded-full text-xs">
                        <XCircle className="w-3 h-3" />
                        {gap}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Recommendations */}
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  <Target className="w-4 h-4 text-blue-500" />
                  Recommendations to Improve Match
                </h4>
                <ul className="space-y-2">
                  {match.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Required Skills */}
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  <Award className="w-4 h-4 text-purple-500" />
                  Required Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {placement.skillsRequired.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 rounded-full text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const AIMatchingSystem: React.FC = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  
  const matches = user ? aiMatchResults.filter(m => m.studentId === user.id) : [];
  
  const filteredMatches = matches.filter(match => {
    if (filter === 'high') return match.matchScore >= 80;
    if (filter === 'medium') return match.matchScore >= 60 && match.matchScore < 80;
    if (filter === 'low') return match.matchScore < 60;
    return true;
  });
  
  const avgMatchScore = matches.length > 0 
    ? Math.round(matches.reduce((sum, m) => sum + m.matchScore, 0) / matches.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-white/70 text-sm">AI Matches Found</p>
              <p className="text-3xl font-bold">{matches.length}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <Target className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Avg Match Score</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{avgMatchScore}%</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 rounded-xl">
              <Zap className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">High Matches</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {matches.filter(m => m.matchScore >= 80).length}
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Applied</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">1</p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'high', 'medium', 'low'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} Matches
            {f === 'high' && matches.filter(m => m.matchScore >= 80).length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {matches.filter(m => m.matchScore >= 80).length}
              </span>
            )}
          </button>
        ))}
      </div>
      
      {/* Match Cards */}
      <div className="space-y-4">
        {filteredMatches.length > 0 ? (
          filteredMatches.map((match, index) => {
            const placement = placements.find(p => p.id === match.placementId);
            if (!placement) return null;
            return (
              <MatchCard 
                key={match.placementId} 
                match={match} 
                placement={placement}
                index={index}
              />
            );
          })
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No matches found</h3>
            <p className="text-slate-500">Try adjusting your profile skills and preferences</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AIMatchingSystem;
