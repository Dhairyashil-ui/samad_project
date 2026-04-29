import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Members from './pages/Members';
import Transactions from './pages/Transactions';
import Fines from './pages/Fines';
import Reservations from './pages/Reservations';
import AuthSuccess from './pages/AuthSuccess';
import Loader from './components/common/Loader';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAdmin } = useAuth();
  
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" />;
  if (requireAdmin && !isAdmin) return <Navigate to="/dashboard" />;
  
  return children;
};

function App() {
  const { loading } = useAuth();

  if (loading) return <Loader />;

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/books" element={<ProtectedRoute><Books /></ProtectedRoute>} />
          <Route path="/members" element={<ProtectedRoute requireAdmin={true}><Members /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
          <Route path="/fines" element={<ProtectedRoute><Fines /></ProtectedRoute>} />
          <Route path="/reservations" element={<ProtectedRoute><Reservations /></ProtectedRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
