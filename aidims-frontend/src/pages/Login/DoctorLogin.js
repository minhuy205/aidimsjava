import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService} from '../../services/authService';
import '../../css/auth.css';
import '../../css/loginchung.css';

const DoctorLogin = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername");
    const savedPassword = localStorage.getItem("rememberedPassword");
    if (savedUsername && savedPassword) {
      setLoginData({
        username: savedUsername,
        password: savedPassword,
      });
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await authService.doctorLogin(
        loginData.username,
        loginData.password
      );

      if (response.success) {
        setMessage("✅ Đăng nhập thành công");
        
        if (rememberMe) {
          localStorage.setItem("rememberedUsername", loginData.username);
          localStorage.setItem("rememberedPassword", loginData.password);
        } else {
          localStorage.removeItem("rememberedUsername");
          localStorage.removeItem("rememberedPassword");
        }
        
        setTimeout(() => {
          navigate("/IndexDoctor");
        }, 1000);
      } else {
        setMessage(response.message || "❌ Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      setMessage("❌ Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-standalone">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">👨‍⚕️</div>
            <h1>Đăng nhập Bác sĩ</h1>
            <p>Truy cập hệ thống khám bệnh</p>
          </div>

          {message && (
            <div className={`auth-message ${message.includes("✅") ? "success" : "error"}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username">Tên đăng nhập</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Nhập mã bác sĩ"
                value={loginData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Nhập mật khẩu"
                value={loginData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)} 
                />
                <span className="checkmark"></span>
                Ghi nhớ mật khẩu
              </label>
            </div>

            <button 
              type="submit" 
              className="auth-btn primary" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Đang đăng nhập...
                </>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>

          <div className="auth-footer">
            <a href="/" className="back-home">
              ← Quay về trang chủ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;