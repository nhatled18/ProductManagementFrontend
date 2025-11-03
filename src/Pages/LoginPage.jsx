import React, { useState } from 'react';
import { authService } from '../Services/AuthServices';
import "../assets/styles/LoginPage.css";
import "../assets/styles/Common.css";

function LoginPage({ onLogin }) {
  const [mode, setMode] = useState('login'); // 'login', 'register', 'forgot'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ username, password });
      
      // Gọi callback onLogin với user data
      onLogin({ 
        username: response.user?.username || username,
        ...response.user 
      });
      
      // Success message (optional)
      console.log('✅ Đăng nhập thành công:', response);
    } catch (err) {
      console.error('❌ Lỗi đăng nhập:', err);
      setError(err.message || 'Tên đăng nhập hoặc mật khẩu không đúng!');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Validate trước khi gửi
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }
    
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    setLoading(true);

    try {
      await authService.register({
        username,
        password,
        email,
        fullName
      });
      
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      setMode('login');
      resetForm();
    } catch (err) {
      console.error('❌ Lỗi đăng ký:', err);
      setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Implement forgot password API endpoint
      // await authService.forgotPassword({ email });
      
      alert(`Link khôi phục mật khẩu đã được gửi đến ${email}.\nVui lòng kiểm tra email của bạn.`);
      setMode('login');
      resetForm();
    } catch (err) {
      console.error('❌ Lỗi khôi phục mật khẩu:', err);
      setError(err.message || 'Email không tồn tại trong hệ thống!');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setEmail('');
    setFullName('');
    setError('');
    setRememberMe(false);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    resetForm();
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-branding">
          <div className="login-logo">📦</div>
          <h1>Kho Hàng</h1>
          <p>Hệ thống quản lý kho hàng<br />chuyên nghiệp và hiện đại</p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-box">
          {/* Error Alert */}
          {error && (
            <div className="alert alert-error" style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #ef4444',
              color: '#991b1b',
              padding: '12px 16px',
              borderRadius: '12px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <>
              <div className="login-header">
                <h2>Đăng Nhập Kho Hàng</h2>
                <p>Nhập thông tin đăng nhập để truy cập hệ thống</p>
              </div>

              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-input"
                    placeholder="ten@khohang.com"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Mật khẩu</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    placeholder="Nhập mật khẩu"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  marginBottom: '1.5rem'
                }}>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    color: '#64748b'
                  }}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{ marginRight: '0.5rem' }}
                      disabled={loading}
                    />
                    Ghi nhớ đăng nhập
                  </label>
                  
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); switchMode('forgot'); }}
                    style={{
                      color: '#0ea5e9',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}
                  >
                    Quên mật khẩu?
                  </a>
                </div>

                <button 
                  type="submit" 
                  className="btn-login"
                  disabled={loading}
                  style={{ opacity: loading ? 0.6 : 1 }}
                >
                  {loading ? '⏳ Đang đăng nhập...' : 'Đăng Nhập Kho Hàng'}
                </button>
              </form>

              <div className="divider">
                <span>Hoặc tiếp tục với</span>
              </div>

              <div className="social-login">
                <button type="button" onClick={() => alert('Đăng nhập Google sắp có!')}>
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                    <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z"/>
                    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                  </svg>
                  Google
                </button>
                <button type="button" onClick={() => alert('Đăng nhập GitHub sắp có!')}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#181717">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  GitHub
                </button>
              </div>

              <div className="switch-auth-mode">
                <p>Cần truy cập? <a href="#" onClick={(e) => { e.preventDefault(); switchMode('register'); }}>Liên hệ quản trị viên</a></p>
              </div>
            </>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <>
              <div className="login-header">
                <h2>Tạo Tài Khoản</h2>
                <p>Đăng ký để truy cập hệ thống kho hàng</p>
              </div>

              <form onSubmit={handleRegister}>
                <div className="form-group">
                  <label className="form-label">Họ và Tên</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="form-input"
                    placeholder="Nhập họ và tên"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    placeholder="ten@khohang.com"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tên đăng nhập</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-input"
                    placeholder="Chọn tên đăng nhập"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Mật khẩu</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    placeholder="Tạo mật khẩu (tối thiểu 6 ký tự)"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Xác nhận mật khẩu</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-input"
                    placeholder="Nhập lại mật khẩu"
                    required
                    disabled={loading}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn-login"
                  disabled={loading}
                  style={{ opacity: loading ? 0.6 : 1 }}
                >
                  {loading ? '⏳ Đang tạo tài khoản...' : 'Tạo Tài Khoản'}
                </button>
              </form>

              <div className="switch-auth-mode">
                <p>Đã có tài khoản? <a href="#" onClick={(e) => { e.preventDefault(); switchMode('login'); }}>Đăng nhập</a></p>
              </div>
            </>
          )}

          {/* FORGOT PASSWORD FORM */}
          {mode === 'forgot' && (
            <>
              <div className="login-header">
                <h2>Khôi Phục Mật Khẩu</h2>
                <p>Nhập email để nhận hướng dẫn đặt lại mật khẩu</p>
              </div>

              <form onSubmit={handleForgotPassword}>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    placeholder="ten@khohang.com"
                    required
                    disabled={loading}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn-login"
                  disabled={loading}
                  style={{ opacity: loading ? 0.6 : 1 }}
                >
                  {loading ? '⏳ Đang gửi...' : 'Gửi Link Khôi Phục'}
                </button>
              </form>

              <div className="switch-auth-mode">
                <p>Nhớ mật khẩu? <a href="#" onClick={(e) => { e.preventDefault(); switchMode('login'); }}>Đăng nhập</a></p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;