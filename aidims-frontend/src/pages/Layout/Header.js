import { useNavigate } from "react-router";

function Header() {
  let navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="site-header">
      <div className="container header-container">
        <div className="logo">
          <a href="/">
            <span role="img" aria-label="hospital">🏥</span>
            <span className="logo-text">AIDIMS</span>
          </a>
        </div>
        <nav className="main-nav">
          <ul className="nav-links">
            <li><a href="/"><span role="img" aria-label="home">🏠</span> Trang chủ</a></li>
            <li><a href="/about"><span role="img" aria-label="info">ℹ️</span> Giới thiệu</a></li>
            <li><a href="/Feature"><span role="img" aria-label="features">🧠</span> Tính năng</a></li>
            <li><a href="/Contact"><span role="img" aria-label="contact">📞</span> Liên hệ</a></li>
          </ul>
        </nav>
        <div className="auth-buttons">
          <a href="/LoginRegister" className="btn login-btn">Đăng nhập</a>
          {/* <button className="btn logout-btn" onClick={handleLogout}>Đăng xuất</button> */}
        </div>
      </div>
    </header>
  );
}

export default Header;
