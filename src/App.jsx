import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from "./Components/Navbar";
// import login from './Components/Login';
import DashboardPages from './Pages/Dashboard';
import LoginPage from './Pages/LoginPage';
import OverviewTabs from './Pages/OverviewTabs';
import ProductTab from './Pages/ProductTabs';
import TransactionTab from './Pages/TransactionTab';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <Navbar user={user} onLogout={handleLogout} />}
        
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
              <Navigate to="/dashboard" replace /> : 
              <LoginPage onLogin={handleLogin} />
            } 
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? 
              <DashboardPages user={user} /> : 
              <Navigate to="/login" replace />
            }
          />
          
          <Route
            path="/overview"
            element={
              isAuthenticated ? 
              <OverviewTabs /> : 
              <Navigate to="/login" replace />
            }
          />
          
          <Route
            path="/products"
            element={
              isAuthenticated ? 
              <ProductTab /> : 
              <Navigate to="/login" replace />
            }
          />
          
          <Route
            path="/transactions"
            element={
              isAuthenticated ? 
              <TransactionTab /> : 
              <Navigate to="/login" replace />
            }
          />

          {/* Default redirect */}
          <Route 
            path="/" 
            element={
              <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
            } 
          />
          
          {/* 404 redirect */}
          <Route 
            path="*" 
            element={<Navigate to="/" replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;