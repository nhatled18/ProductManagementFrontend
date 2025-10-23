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
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    resetForm();
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-branding">
          <div className="login-logo">🏢</div>
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
              borderRadius: '8px',
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
                <h2>Đăng nhập</h2>
                <p>Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục</p>
              </div>

              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label className="form-label">Tên đăng nhập</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-input"
                    placeholder="Nhập tên đăng nhập"
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

                <div className="forgot-password-link">
                  <a href="#" onClick={(e) => { e.preventDefault(); switchMode('forgot'); }}>
                    Quên mật khẩu?
                  </a>
                </div>

                <button 
                  type="submit" 
                  className="btn-login"
                  disabled={loading}
                  style={{ opacity: loading ? 0.6 : 1 }}
                >
                  {loading ? '⏳ Đang đăng nhập...' : 'Đăng nhập'}
                </button>
              </form>

              <div className="switch-auth-mode">
                <p>Chưa có tài khoản? <a href="#" onClick={(e) => { e.preventDefault(); switchMode('register'); }}>Đăng ký ngay</a></p>
              </div>

              <div className="demo-credentials">
                <p><strong>Tài khoản demo:</strong></p>
                <p>Username: <code>admin</code></p>
                <p>Password: <code>admin123</code></p>
              </div>
            </>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <>
              <div className="login-header">
                <h2>Đăng ký tài khoản</h2>
                <p>Tạo tài khoản mới để sử dụng hệ thống</p>
              </div>

              <form onSubmit={handleRegister}>
                <div className="form-group">
                  <label className="form-label">Họ và tên</label>
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
                    placeholder="Nhập email"
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
                    placeholder="Nhập tên đăng nhập"
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
                    placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
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
                  {loading ? '⏳ Đang đăng ký...' : 'Đăng ký'}
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
                <h2>Quên mật khẩu</h2>
                <p>Nhập email để khôi phục mật khẩu</p>
              </div>

              <form onSubmit={handleForgotPassword}>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    placeholder="Nhập email đã đăng ký"
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
                  {loading ? '⏳ Đang xử lý...' : 'Khôi phục mật khẩu'}
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