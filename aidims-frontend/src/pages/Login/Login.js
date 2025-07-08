"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {authService} from "../../services/authService"
import "../../css/auth.css"

function Login() {
    console.log("Login component loaded")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  })

  // Load saved credentials on component mount
  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername")
    const savedPassword = localStorage.getItem("rememberedPassword")
    if (savedUsername && savedPassword) {
      setLoginData({
        username: savedUsername,
        password: savedPassword,
      })
      setRememberMe(true)
    }
  }, [])

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const result = await authService.login(loginData.username, loginData.password)

      if (result.success) {
        // Save credentials if remember me is checked
        if (rememberMe) {
          localStorage.setItem("rememberedUsername", loginData.username)
          localStorage.setItem("rememberedPassword", loginData.password)
        } else {
          localStorage.removeItem("rememberedUsername")
          localStorage.removeItem("rememberedPassword")
        }

        setMessage("Đăng nhập thành công!")

        // Chuyển hướng dựa trên role
        const user = result.data
        setTimeout(() => {
          switch (user.role) {
            case "admin":
              navigate("/IndexAdmin")
              break
            case "doctor":
              navigate("/IndexDoctor")
              break
            case "receptionist":
              navigate("/receptionist")
              break
            case "technician":
              navigate("/technician")
              break
            default:
              navigate("/")
          }
        }, 1000)
      } else {
        setMessage(result.message)
      }
    } catch (error) {
      console.error("Login error:", error)
      setMessage("Lỗi kết nối đến server. Vui lòng kiểm tra kết nối mạng.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page-standalone">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">🏥</div>
            <h1>Đăng nhập AIDIMS</h1>
            <p>Chào mừng bạn quay trở lại</p>
          </div>

          {message && (
            <div className={`auth-message ${message.includes("thành công") ? "success" : "error"}`}>{message}</div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username">Tên đăng nhập</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Nhập tên đăng nhập"
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
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                <span className="checkmark"></span>
                Ghi nhớ mật khẩu
              </label>
            </div>

            <button type="submit" className="auth-btn primary" disabled={loading}>
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

          <div className="auth-links">
            {/* <p>
              Chưa có tài khoản?
              <a href="/register" className="link-primary">
                {" "}
                Đăng ký ngay
              </a>
            </p> */}
            <a href="#" className="link-secondary">
              Quên mật khẩu?
            </a>
          </div>

          {/* <div className="auth-divider">
            <span>Hoặc truy cập nhanh</span>
          </div>

          <div className="quick-access">
            <a href="/login/doctor" className="quick-btn doctor">
              👨‍⚕️ Bác sĩ
            </a>
            <a href="/login/receptionist" className="quick-btn receptionist">
              👩‍💼 Tiếp nhận
            </a>
            <a href="/login/technician" className="quick-btn technician">
              👨‍🔬 Kỹ thuật viên
            </a>
            <a href="/login/admin" className="quick-btn admin">
              👨‍💼 Quản trị viên
            </a>
          </div> */}

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

export default Login;
