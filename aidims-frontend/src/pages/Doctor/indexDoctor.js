import React, { memo } from "react";
import "../../css/indexDoctor.css"; // Ensure this path is correct based on your project structure
const IndexDoctor = () => {
    return (
        <div className="doctor-page">
            {/* Header Navigation */}
            <nav className="navbar">
                <div className="nav-container">
                    <div className="nav-logo">
                        <a href="/"><h2>🏥 AIDIMS</h2></a>
                    </div>
                    <ul className="nav-menu">
                        <li><a href="/">Trang chủ</a></li>
                        <li><a href="#about">Giới thiệu</a></li>
                        <li><a href="#features">Tính năng</a></li>
                        <li><a href="#contact">Liên hệ</a></li>
                        <li><a href="/LoginRegister" className="login-btn">Đăng nhập</a></li>
                    </ul>
                </div>
            </nav>

            {/* Doctor Dashboard */}
            <section className="doctor-dashboard">
                <h1>Chào mừng Bác sĩ đến với AIDIMS</h1>
                <p>Quản lý hồ sơ bệnh nhân và hình ảnh y tế một cách hiệu quả.</p>
                {/* Add more content specific to the doctor's dashboard here */}
            </section>
            
        </div>
    );
};
export default memo(IndexDoctor);