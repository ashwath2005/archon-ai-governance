import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { SubmissionsPage } from './pages/SubmissionsPage';
import { SubmissionFormPage } from './pages/SubmissionFormPage';
import { SubmissionDetailPage } from './pages/SubmissionDetailPage';
import { ReviewPage } from './pages/ReviewPage';
import { RubricPage } from './pages/RubricPage';
import { AnalyticsPage } from './pages/AnalyticsPage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="submissions" element={<SubmissionsPage />} />
          <Route path="submissions/new" element={<SubmissionFormPage />} />
          <Route path="submissions/:id" element={<SubmissionDetailPage />} />
          <Route path="submissions/:id/edit" element={<SubmissionFormPage />} />
          <Route path="submissions/:id/review" element={<ReviewPage />} />
          <Route path="rubric" element={<RubricPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}
