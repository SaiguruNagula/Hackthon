import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Login from '@/pages/Login';
import EnhancedStudentDashboard from '@/pages/EnhancedStudentDashboard';
import EnhancedFacultyDashboard from '@/pages/EnhancedFacultyDashboard';
import EnhancedAdminDashboard from '@/pages/EnhancedAdminDashboard';
import StaffDashboard from '@/pages/StaffDashboard';
import { Toaster } from '@/components/ui/sonner';

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Login />
        </motion.div>
      </AnimatePresence>
    );
  }

  // Route to appropriate dashboard based on user role
  const renderDashboard = () => {
    switch (user?.role) {
      case 'student':
        return <EnhancedStudentDashboard />;
      case 'faculty':
        return <EnhancedFacultyDashboard />;
      case 'admin':
        return <EnhancedAdminDashboard />;
      case 'staff':
        return <StaffDashboard />;
      default:
        return <EnhancedStudentDashboard />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="dashboard"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderDashboard()}
      </motion.div>
    </AnimatePresence>
  );
};

import { DataProvider } from '@/contexts/DataContext';
import { AIConfigProvider } from '@/contexts/AIConfigContext';

function App() {
  return (
    <AIConfigProvider>
      <DataProvider>
        <AuthProvider>
          <AppContent />
          <Toaster position="top-right" />
        </AuthProvider>
      </DataProvider>
    </AIConfigProvider>
  );
}

export default App;
