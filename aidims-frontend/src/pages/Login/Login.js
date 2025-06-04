import React, { useState } from 'react';
import '../../css/login.css';

function LoginRegister() {
  const [isRegister, setIsRegister] = useState(false);

  const showRegister = () => setIsRegister(true);
  const showLogin = () => setIsRegister(false);

  return (
    <div className="auth-wrapper">
      {!isRegister ? (
        <div className="container3">
          <h2>Đăng nhập</h2>
          <form action="#" method="POST">
            <input type="text" name="username" placeholder="Tên đăng nhập" required />
            <input type="password" name="password" placeholder="Mật khẩu" required />
            <button type="submit">Đăng nhập</button>
          </form>
          <p className="center-text">
            Chưa có tài khoản? <a href="#" onClick={showRegister}>Đăng ký</a>
          </p>
          <p className="center-text">
            <a href="/">Nhân viên tiếp nhận</a>
          </p>
          <p className="center-text">
            <a href="/IndexDoctor">Bác sĩ</a>
          </p>
          <p className="center-text">
            <a href="/">Kỹ thuật viên hình ảnh</a>
          </p>
          <p className="center-text">
            <a href="/">Quay lại</a>
          </p>
          <p className="center-text admin-link">
            <a href="/layoutADMIN.html">Chuyển sang trang dành cho Admin</a>
          </p>
        </div>
      ) : (
        <div className="container">
          <h2>Đăng ký</h2>
          <form action="#" method="POST">
            <input type="text" name="fullname" placeholder="Họ và tên" required />
            <input type="email" name="email" placeholder="Email" required />
            <input type="text" name="username" placeholder="Tên đăng nhập" required />
            <input type="password" name="password" placeholder="Mật khẩu" required />
            <input type="password" name="confirm_password" placeholder="Nhập lại mật khẩu" required />
            <button type="submit">Đăng ký</button>
          </form>
          <p className="center-text">
            Đã có tài khoản? <a href="#" onClick={showLogin}>Đăng nhập</a>
          </p>
          <p className="center-text">
            <a href="/">Quay lại</a>
          </p>
        </div>
      )}
    </div>
  );
}

export default LoginRegister;
