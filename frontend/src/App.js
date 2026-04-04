import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';
import AdminDashboardHome from './pages/admin/DashboardHome';
import PendingDocuments from './pages/admin/PendingDocuments';
import StudentManagement from './pages/admin/StudentManagement';
import UserDashboardHome from './pages/student/DashboardHome';
import UploadDocument from './pages/student/UploadDocument';
import MyDocuments from './pages/student/MyDocuments';
import Profile from './pages/student/Profile';

import VerifiedDocuments from './pages/admin/VerifiedDocuments';
import RejectedDocuments from './pages/admin/RejectedDocuments';
import VerificationResult from './pages/VerificationResult';

// Simple Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) return <Navigate to="/login" replace />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/" replace />; // Or unauthorized page

  return children;
};

// ... inside App component ...
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<VerificationResult />} />
        <Route path="/verify/:id" element={<VerificationResult />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardHome />} />
          <Route path="pending" element={<PendingDocuments />} />
          <Route path="verified" element={<VerifiedDocuments />} />
          <Route path="rejected" element={<RejectedDocuments />} />
          <Route path="students" element={<StudentManagement />} />
        </Route>

        {/* Student Routes */}
        <Route path="/student" element={<ProtectedRoute allowedRole="student"><UserLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<UserDashboardHome />} />
          <Route path="upload" element={<UploadDocument />} />
          <Route path="my-documents" element={<MyDocuments />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
