
import { useNavigate } from "react-router";

function Header() {
  let navigate = useNavigate();
  return (
    <header className="bg-blue-800 text-white p-4">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <a href="/"><h2>🏥 AIDIMS</h2></a>
          </div>
          <ul className="nav-menu">
            <li>
              <a href="/">Trang chủ</a>
            </li>
            <li>
              <a href="/about">Giới thiệu</a>
            </li>
            <li>
              <a href="/Feature">Tính năng</a>
            </li>
            <li>
              <a href="/Contact">Liên hệ</a>
            </li>
            <li>
              <a href="/LoginRegister" className="login-btn">
                Đăng nhập
              </a>
            </li>
            <li>
              <a href="/login" className="login-btn" onClick={() => {
                localStorage.removeItem("token");
              }}>
                Đăng xuất
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;