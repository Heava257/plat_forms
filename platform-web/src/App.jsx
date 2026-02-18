import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

// Modular Page Imports
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import CompanySelect from './pages/CompanySelect/CompanySelect';
import PlanSelect from './pages/PlanSelect/PlanSelect';
import Payment from './pages/Payment/Payment';
import LandingPage from './pages/LandingPage/LandingPage';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';

const PrivateRoute = ({ children, isAdmin = false }) => {
  const { token, user } = React.useContext(AuthContext);

  if (!token) return <Navigate to="/login" />;
  if (isAdmin && user?.role !== 'admin') return <Navigate to="/dashboard" />;

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute isAdmin={true}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/companies"
            element={
              <PrivateRoute>
                <CompanySelect />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/system/:systemId/plans"
            element={
              <PrivateRoute>
                <PlanSelect />
              </PrivateRoute>
            }
          />
          <Route
            path="/payment/:systemId/:planId"
            element={
              <PrivateRoute>
                <Payment />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
