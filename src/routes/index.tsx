import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import Dashboard from '../components/dashboard/Dashboard';
import Documents from '../components/documents/Documents';
import EquipmentList from '../components/equipment/EquipmentList';
import Reports from '../components/reports/Reports';
import TechnicalSupport from '../components/support/TechnicalSupport';
import Sustainability from '../components/sustainability/Sustainability';
import Financial from '../components/financial/Financial';
import Login from '../components/auth/Login';
import Profile from '../components/profile/Profile';
import Settings from '../components/settings/Settings';
import Notifications from '../components/notifications/Notifications';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // TODO: Implement proper authentication check
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="documents" element={<Documents />} />
        <Route path="equipment" element={<EquipmentList />} />
        <Route path="reports" element={<Reports />} />
        <Route path="support" element={<TechnicalSupport />} />
        <Route path="sustainability" element={<Sustainability />} />
        <Route path="financial" element={<Financial />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
