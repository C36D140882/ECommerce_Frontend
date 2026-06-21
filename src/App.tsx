import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

// Layouts
import AdminLayout from './components/layouts/AdminLayout';

// Admin pages
import AdminLoginPage from './pages/Admin/AdminLoginPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserManagement from './pages/Admin/UserManagement';
import RoleManagement from './pages/Admin/RoleManagement';

// Public pages
import UserLoginPage from './pages/User/UserLoginPage';
import HomePage from './pages/User/HomePage';
import ProfilePage from './pages/User/ProfilePage';

import { getUserData } from './api/api';

/** Keep already-logged-in users off the login page */
function LoginGuard({ children }: { children: React.ReactElement }) {
  const user = getUserData();
  if (user?.role === 'Admin') return <Navigate to="/admin/dashboard" replace />;
  if (user) return <Navigate to="/home" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Root → smart redirect based on session */}
        <Route
          path="/"
          element={
            (() => {
              const user = getUserData();
              if (user?.role === 'Admin') return <Navigate to="/admin/dashboard" replace />;
              if (user) return <Navigate to="/home" replace />;
              return <Navigate to="/login" replace />;
            })()
          }
        />

        {/* User login */}
        <Route path="/login" element={<LoginGuard><UserLoginPage /></LoginGuard>} />

        {/* Home page — shown to logged-in users (all non-admin roles) */}
        <Route path="/home" element={<HomePage />} />
        
        {/* Profile page */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* Admin login (public) */}
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Admin portal — nested under AdminLayout so sidebar renders */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="roles" element={<RoleManagement />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;