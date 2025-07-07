"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../../css/auth.css"

function Register() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [rememberMe, setRememberMe] = useState(true) // Default to true for new registrations
  const navigate = useNavigate()

  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    email: "",
    phone: "",
  })

  const handleChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    // Kiểm tra mật khẩu xác nhận
    if (registerData.password !== registerData.confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp")
      setLoading(false)
      return
    }

    try {
      // Giả lập API call
      setTimeout(() => {
        setMessage("Đăng ký thành công! Đang chuyển hướng...")
        setTimeout(() => {
          navigate("/login")
        }, 2000)
        setLoading(false)
      }, 1500)
    } catch (error) {
      console.error("Register error:", error)
      setMessage("Lỗi kết nối đến server. Vui lòng kiểm tra kết nối mạng.")
      setLoading(false)
    }
  }

  return (
    <div className="auth-page-standalone">
      <div className="auth-container">
        <div className="auth-card register-card">
          <div className="auth-header">
            <div className="auth-icon">🏥</div>
            <h1>Đăng ký AIDIMS</h1>
            <p>Tạo tài khoản mới để sử dụng hệ thống</p>
          </div>

          {message && (
            <div className={`auth-message ${message.includes("thành công") ? "success" : "error"}`}>{message}</div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName">Họ và tên *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Nhập họ và tên"
                  value={registerData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="username">Tên đăng nhập *</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Nhập tên đăng nhập"
                  value={registerData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Nhập email"
                  value={registerData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Số điện thoại</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Nhập số điện thoại"
                  value={registerData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Mật khẩu *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Nhập mật khẩu"
                  value={registerData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Xác nhận mật khẩu *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Nhập lại mật khẩu"
                  value={registerData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                <span className="checkmark"></span>
                Ghi nhớ mật khẩu sau khi đăng ký
              </label>
            </div>

            <div className="form-note">
              <p>* Các trường bắt buộc</p>
              <p>Tài khoản mặc định sẽ có quyền "Nhân viên tiếp nhận"</p>
            </div>

            <button type="submit" className="auth-btn primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Đang đăng ký...
                </>
              ) : (
                "Đăng ký tài khoản"
              )}
            </button>
          </form>

          <div className="auth-links">
            <p>
              Đã có tài khoản?
              <a href="/login" className="link-primary">
                {" "}
                Đăng nhập ngay
              </a>
            </p>
          </div>

          <div className="auth-footer">
            <a href="/" className="back-home">
              ← Quay về trang chủ
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
