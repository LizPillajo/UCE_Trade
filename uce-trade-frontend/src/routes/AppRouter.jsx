import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from '../components/common/ProtectedRoute'; 

// Public Imports
import HomePage from '../pages/public/HomePage';
import ExplorePage from '../pages/public/ExplorePage';
import VentureDetailPage from '../pages/public/VentureDetailPage';
import SellerProfilePage from '../pages/public/SellerProfilePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Student Imports
import StudentDashboard from '../pages/student/StudentDashboard';
import MyVenturesPage from '../pages/student/MyVenturesPage';
import CreateVenturePage from '../pages/student/CreateVenturePage';

// Admin Imports
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminVenturesPage from '../pages/admin/AdminVenturesPage';
import ManageUsersPage from '../pages/admin/ManageUsersPage';

export const AppRouter = () => {
  return (
    <Routes>
      
      {/* PUBLIC ROUTES (Inside Main Layout) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/venture/:id" element={<VentureDetailPage />} />
        <Route path="/profile/:id" element={<SellerProfilePage />} />

        {/* --- STUDENT AREA (Only role STUDENT) --- */}
        <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/my-ventures" element={<MyVenturesPage />} />
            <Route path="/student/create-venture" element={<CreateVenturePage />} />
            <Route path="/profile" element={<MyVenturesPage />} />
        </Route>

        {/* --- ADMIN AREA (Only role ADMIN) --- */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/ventures" element={<AdminVenturesPage />} />
            <Route path="/admin/users" element={<ManageUsersPage />} />
        </Route>
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
};