import { Routes, Route } from 'react-router-dom';
import LoginRegister from './pages/LoginRegister';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './auth/ProtectedRoute';

export default function Router() {
  return (
    <Routes>
      <Route path="/login" element={<LoginRegister />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
