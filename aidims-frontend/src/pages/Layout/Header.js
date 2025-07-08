// import { useNavigate } from "react-router";

// function Header() {
//   let navigate = useNavigate();
//   return (

//     <header className="bg-blue-800 text-white p-4">
//       <nav className="navbar">
//         <div className="nav-container">
//           <div className="nav-logo">
            
//             <a href="/"><h2>🏥 AIDIMS</h2></a>
//           </div>
//           <ul className="nav-menu">
//             <li>
//               <a href="/">Trang chủ</a>
//             </li>
//             <li>
//               <a href="/about">Giới thiệu</a>
//             </li>
//             <li>
//               <a href="/Feature">Tính năng</a>
//             </li>
//             <li>
//               <a href="/Contact">Liên hệ</a>
//             </li>
//             <li>
//               <a href="/LoginRegister" className="login-btn">
//                 Đăng nhập
//               </a>
//             </li>
//             <li> 
//              <a href="/login" className="login-btn" onClick={() => {
//                 localStorage.removeItem("token");
//               }}>
//                 Đăng xuất
//               </a>
//             </li>
//           </ul>
//         </div>
//       </nav>
//     </header>
//   );
// }

// export default Header;  


import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // true nếu có token
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false); // cập nhật UI
    navigate("/login");
  };

  return (
    <header className="bg-blue-800 text-white p-4">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <a href="/"><h2>🏥 AIDIMS</h2></a>
          </div>
          <ul className="nav-menu">
            <li><a href="/">Trang chủ</a></li>
            <li><a href="/about">Giới thiệu</a></li>
            <li><a href="/Feature">Tính năng</a></li>
            <li><a href="/Contact">Liên hệ</a></li>

            {!isLoggedIn && (
              <li>
                <a href="/LoginRegister" className="login-btn">Đăng nhập</a>
              </li>
            )}

            {isLoggedIn && (
              <li>
                <button onClick={handleLogout} className="login-btn bg-transparent border-none text-white hover:underline">
                  Đăng xuất
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;
