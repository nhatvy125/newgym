import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// --- IMPORT LOGIC AUTH ---
import { AuthProvider, useAuth } from "@/hooks/useAuth";

// --- IMPORT DÙNG CHUNG ---
import Login from "./shared/Login";
//import Register from "./shared/pages/Register";
import <Homepa></Homepa> from "./shared/Homepage";

// --- IMPORT GIAO DIỆN USER (Nằm trong apps/user) ---
import Homepage from "./shared/Homepage";
import Login from "./shared/Login";
import AppLayout from "./apps/user/components/AppLayout";
import Dashboard from "./apps/user/pages/Dashboard";
import Packages from "./apps/user/pages/Packages";
import Booking from "./apps/user/pages/Booking";
import Checkin from "./apps/user/pages/Checkin";
import UserSchedule from "./apps/user/pages/Schedule";
import Profile from "./apps/user/pages/Profile";

// --- IMPORT GIAO DIỆN ADMIN (Nằm trong apps/admin) ---
import AdminAppLayout from "./apps/admin/AppLayout"; 
import AdminDashboard from "./apps/admin/MemberDashboard";
import MemberManagement from "./apps/admin/MemberManagement";
import AdminSchedule from "./apps/admin/Schedule";
import AdminPackages from "./apps/admin/Packages";
import BranchManagement from "./apps/admin/Branch"; // Trong ảnh Admin đặt tên là Branch.tsx
import Setting from "./apps/admin/Setting";

const queryClient = new QueryClient();

// --- LOGIC BẢO VỆ ROUTE (GIỮ NGUYÊN) ---
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (user) {
    return user.role === 'ADMIN' ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user || user.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-pulse text-primary font-bold text-lg">Đang tải...</div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* 1. ROUTES DÙNG CHUNG */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/" element={<Homepage />} />

            {/* 2. KHU VỰC USER */}
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/checkin" element={<Checkin />} />
              <Route path="/schedule" element={<UserSchedule />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* 3. KHU VỰC ADMIN */}
            <Route path="/admin" element={<AdminRoute><AdminAppLayout /></AdminRoute>}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="members" element={<MemberManagement />} />
              <Route path="schedule" element={<AdminSchedule />} />
              <Route path="packages" element={<AdminPackages />} />
              <Route path="branches" element={<BranchManagement />} />
              <Route path="settings" element={<Setting />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;