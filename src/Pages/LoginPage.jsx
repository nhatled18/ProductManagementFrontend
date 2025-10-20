// pages/LoginPage.jsx
import React, { useState } from 'react';
import "../assets/styles/LoginPage.css";
import "../assets/styles/Common.css";

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      onLogin(username);
    } else {
      alert('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
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
          <div className="login-header">
            <h2>Đăng nhập</h2>
            <p>Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục</p>
          </div>

          <form onSubmit={handleSubmit}>
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

            <button type="submit" className="btn-login">
              Đăng nhập
            </button>
          </form>

          <div className="demo-credentials">
            <p><strong>Tài khoản demo:</strong></p>
            <p>Username: <code>admin</code></p>
            <p>Password: <code>admin123</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;