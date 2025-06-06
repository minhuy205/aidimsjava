const API_BASE_URL = "http://localhost:8080"

const authService = {
  async login(username, password) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      const data = await response.json()

      if (response.ok && data.token) {
        // Lưu token vào localStorage
        localStorage.setItem("token", data.token)
        localStorage.setItem(
          "user",
          JSON.stringify({
            userId: data.userId,
            username: data.username,
            fullName: data.fullName,
            email: data.email,
            role: data.role,
          }),
        )
        return { success: true, data }
      } else {
        return { success: false, message: data.message || "Đăng nhập thất bại" }
      }
    } catch (error) {
      console.error("Login error:", error)
      if (error.name === "AbortError") {
        return { success: false, message: "Kết nối quá chậm, vui lòng thử lại" }
      }
      return { success: false, message: "Lỗi kết nối đến server. Vui lòng kiểm tra kết nối mạng." }
    }
  },

  async register(userData) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      const data = await response.json()

      if (response.ok && data.token) {
        // Lưu token vào localStorage
        localStorage.setItem("token", data.token)
        localStorage.setItem(
          "user",
          JSON.stringify({
            userId: data.userId,
            username: data.username,
            fullName: data.fullName,
            email: data.email,
            role: data.role,
          }),
        )
        return { success: true, data }
      } else {
        return { success: false, message: data.message || "Đăng ký thất bại" }
      }
    } catch (error) {
      console.error("Register error:", error)
      if (error.name === "AbortError") {
        return { success: false, message: "Kết nối quá chậm, vui lòng thử lại" }
      }
      return { success: false, message: "Lỗi kết nối đến server. Vui lòng kiểm tra kết nối mạng." }
    }
  },

  logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("rememberedUsername")
    localStorage.removeItem("rememberedPassword")
  },

  getCurrentUser() {
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  },

  getToken() {
    return localStorage.getItem("token")
  },

  isAuthenticated() {
    const token = this.getToken()
    return !!token
  },

  async testConnection() {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const response = await fetch(`${API_BASE_URL}/auth/test`, {
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      return response.ok
    } catch (error) {
      console.error("Connection test failed:", error)
      return false
    }
  },
}

export default authService
