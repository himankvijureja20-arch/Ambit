import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import BrandPage from './pages/BrandPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PendingApprovalPage from './pages/PendingApprovalPage';
import HomePage from './pages/HomePage';
import CirclesDirectoryPage from './pages/CirclesDirectoryPage';
import CreateCirclePage from './pages/CreateCirclePage';
import CircleDetailPage from './pages/CircleDetailPage';
import RequestsFeedPage from './pages/RequestsFeedPage';
import CreateRequestPage from './pages/CreateRequestPage';
import RequestDetailPage from './pages/RequestDetailPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminVerifyResidentsPage from './pages/AdminVerifyResidentsPage';
import AdminCircleApprovalPage from './pages/AdminCircleApprovalPage';
import AdminRequestModerationPage from './pages/AdminRequestModerationPage';
import InterestSelectionPage from './pages/InterestSelectionPage';
import NotFoundPage from './pages/NotFoundPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore();
  return token ? <>{children}</> : <Navigate to="/login" />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { token, user } = useAuthStore();
  if (!token) return <Navigate to="/login" />;
  if (user?.role !== 'admin') return <Navigate to="/" />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/brand" element={<BrandPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/pending-approval" element={<PendingApprovalPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/circles"
          element={
            <ProtectedRoute>
              <CirclesDirectoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/circles/new"
          element={
            <ProtectedRoute>
              <CreateCirclePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/circles/:id"
          element={
            <ProtectedRoute>
              <CircleDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests"
          element={
            <ProtectedRoute>
              <RequestsFeedPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests/new"
          element={
            <ProtectedRoute>
              <CreateRequestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests/:id"
          element={
            <ProtectedRoute>
              <RequestDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/residents"
          element={
            <AdminRoute>
              <AdminVerifyResidentsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/circles"
          element={
            <AdminRoute>
              <AdminCircleApprovalPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/requests"
          element={
            <AdminRoute>
              <AdminRequestModerationPage />
            </AdminRoute>
          }
        />
        <Route
          path="/onboarding/interests"
          element={
            <ProtectedRoute>
              <InterestSelectionPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
