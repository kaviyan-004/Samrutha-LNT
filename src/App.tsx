import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import AppLayout from './components/AppLayout';
import EmployeeDashboard from './pages/dashboards/EmployeeDashboard';
import ManagerDashboard from './pages/dashboards/ManagerDashboard';
import ProjectLeadDashboard from './pages/dashboards/ProjectLeadDashboard';
import UnitHeadDashboard from './pages/dashboards/UnitHeadDashboard';
import MarketingDashboard from './pages/dashboards/MarketingDashboard';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import ProjectsPage from './pages/ProjectsPage';
import NotFoundPage from './pages/NotFoundPage';

function RoleDashboard() {
  const { user } = useAuth();
  switch (user?.role) {
    case 'employee': return <EmployeeDashboard />;
    case 'manager': return <ManagerDashboard />;
    case 'projectlead': return <ProjectLeadDashboard />;
    case 'unithead': return <UnitHeadDashboard />;
    case 'marketing': return <MarketingDashboard />;
    default: return <EmployeeDashboard />;
  }
}

function TeamPage() {
  const { user } = useAuth();
  if (user?.role === 'manager') return <ManagerDashboard />;
  if (user?.role === 'projectlead') return <ProjectLeadDashboard />;
  if (user?.role === 'unithead') return <UnitHeadDashboard />;
  return <Navigate to="/dashboard" />;
}

function CheckInPage() {
  return <EmployeeDashboard />;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Routes>
                <Route path="/dashboard" element={<RoleDashboard />} />
                <Route path="/checkin" element={<CheckInPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/team" element={<TeamPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
