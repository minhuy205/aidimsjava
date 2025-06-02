import "./App.css"

function App() {
  return (
    <div className="App">
      {/* Header Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <h2>🏥 AIDIMS</h2>
          </div>
          <ul className="nav-menu">
            <li>
              <a href="#home">Trang chủ</a>
            </li>
            <li>
              <a href="#about">Giới thiệu</a>
            </li>
            <li>
              <a href="#features">Tính năng</a>
            </li>
            <li>
              <a href="#contact">Liên hệ</a>
            </li>
            <li>
              <a href="#login" className="login-btn">
                Đăng nhập
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1>Hệ thống Quản lý Hình ảnh DICOM</h1>
            <h2>Tích hợp Trí tuệ Nhân tạo cho Bệnh viện</h2>
            <p>
              AIDIMS - Giải pháp toàn diện cho việc quản lý, lưu trữ và phân tích hình ảnh y tế DICOM với sự hỗ trợ của
              AI tiên tiến.
            </p>

            <div className="features-list">
              <div className="feature-item">✅ Quản lý và Lưu trữ Hình ảnh DICOM</div>
              <div className="feature-item">✅ Quản lý Hồ sơ Bệnh nhân</div>
              <div className="feature-item">✅ Hỗ trợ và Tham khảo Chẩn đoán AI</div>
              <div className="feature-item">✅ Bảo mật và Tuân thủ Tiêu chuẩn Y tế</div>
            </div>

            <div className="button-group">
              <a className="btn-primary" href="#demo">
                Xem Demo
              </a>
              <a className="btn-secondary" href="#login">
                Đăng nhập Hệ thống
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>🏥 AIDIMS</h3>
              <p>Hệ thống quản lý hình ảnh DICOM tích hợp AI cho bệnh viện</p>
            </div>
            <div className="footer-section">
              <h4>Liên kết</h4>
              <ul>
                <li>
                  <a href="#about">Giới thiệu</a>
                </li>
                <li>
                  <a href="#features">Tính năng</a>
                </li>
                <li>
                  <a href="#contact">Liên hệ</a>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Hỗ trợ</h4>
              <ul>
                <li>
                  <a href="#help">Trợ giúp</a>
                </li>
                <li>
                  <a href="#docs">Tài liệu</a>
                </li>
                <li>
                  <a href="#support">Hỗ trợ kỹ thuật</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 AIDIMS. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
