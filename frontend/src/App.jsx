import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import EventsPage from './pages/EventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import MyRegistrationsPage from './pages/student/MyRegistrationsPage';
import StudentProfilePage from './pages/student/StudentProfilePage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageEventsPage from './pages/admin/ManageEventsPage';
import ManageRegistrationsPage from './pages/admin/ManageRegistrationsPage';
import StudentManagementPage from './pages/admin/StudentManagementPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/events/:id" element={<EventDetailsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Student Protected Routes */}
                <Route
                  path="/student/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/registrations"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <MyRegistrationsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/profile"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <StudentProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Protected Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/events"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ManageEventsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/registrations"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ManageRegistrationsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/students"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <StudentManagementPage />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
