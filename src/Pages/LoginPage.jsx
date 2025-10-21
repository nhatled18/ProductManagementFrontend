import React, { useState } from 'react';
import "../assets/styles/LoginPage.css";
import "../assets/styles/Common.css";

function LoginPage({ onLogin }) {
  const [mode, setMode] = useState('login'); // 'login', 'register', 'forgot'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  
  // Lưu trữ users trong state (trong thực tế nên dùng database)
  const [users, setUsers] = useState([
    { username: 'admin', password: 'admin123', email: 'admin@example.com', fullName: 'Admin' }
  ]);

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      onLogin(username);
    } else {
      alert('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    
    if (users.find(u => u.username === username)) {
      alert('Tên đăng nhập đã tồn tại!');
      return;
    }
    
    if (users.find(u => u.email === email)) {
      alert('Email đã được đăng ký!');
      return;
    }
    
    if (password !== confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    
    if (password.length < 6) {
      alert('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }
    
    setUsers([...users, { username, password, email, fullName }]);
    alert('Đăng ký thành công! Vui lòng đăng nhập.');
    setMode('login');
    resetForm();
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    
    const user = users.find(u => u.email === email);
    
    if (user) {
      alert(`Mật khẩu của bạn là: ${user.password}\n(Trong thực tế, sẽ gửi link reset qua email)`);
      setMode('login');
      resetForm();
    } else {
      alert('Email không tồn tại trong hệ thống!');
    }
  };

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setEmail('');
    setFullName('');
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
        <div className="login-box">{mode === 'login' && (
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
                  />
                </div>

                <div className="forgot-password-link">
                  <a href="#" onClick={(e) => { e.preventDefault(); switchMode('forgot'); }}>
                    Quên mật khẩu?
                  </a>
                </div>

                <button type="submit" className="btn-login">
                  Đăng nhập
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
                  />
                </div>

                <button type="submit" className="btn-login">
                  Đăng ký
                </button>
              </form>

              <div className="switch-auth-mode">
                <p>Đã có tài khoản? <a href="#" onClick={(e) => { e.preventDefault(); switchMode('login'); }}>Đăng nhập</a></p>
              </div>
            </>
          )}

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
                  />
                </div>

                <button type="submit" className="btn-login">
                  Khôi phục mật khẩu
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