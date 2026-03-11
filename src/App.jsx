import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from "./Components/Sidebar";
import DashboardPages from './Pages/Dashboard';
import LoginPage from './Pages/LoginPage';
import { authService } from './Services/AuthServices';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Chờ xác minh token

  // ✅ Khi app khởi động, kiểm tra token trong localStorage
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Gọi API /auth/me để xác minh token còn hợp lệ và lấy thông tin user
        const response = await authService.getCurrentUser();
        const userData = response.data?.user || response.data;
        setUser(userData);
        setIsAuthenticated(true);
      } catch (err) {
        // Token hết hạn hoặc không hợp lệ → xóa đi
        console.warn('⚠️ Token không hợp lệ, đăng xuất:', err.message);
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    authService.logout(); // Xóa token khỏi localStorage
    setIsAuthenticated(false);
    setUser(null);
  };

  // Hiển thị màn hình loading trong khi xác minh token
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid rgba(255,255,255,0.3)',
          borderTopColor: '#fff',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <p style={{ color: 'white', fontSize: '16px', fontWeight: '500' }}>Đang tải...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <Sidebar user={user} onLogout={handleLogout} />}
        
        <div className={`app-content ${isAuthenticated ? 'with-sidebar' : ''}`}>
          <Routes>
            <Route 
              path="/login" 
              element={
                isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <LoginPage onLogin={handleLogin} />
              } 
            />

            {/* Dashboard với nested routes */}
            <Route
              path="/dashboard/*"
              element={
                isAuthenticated ? 
                <DashboardPages user={user} /> : 
                <Navigate to="/login" replace />
              }
            />

            <Route 
              path="/" 
              element={
                <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
              } 
            />
            
            <Route 
              path="*" 
              element={<Navigate to="/" replace />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;