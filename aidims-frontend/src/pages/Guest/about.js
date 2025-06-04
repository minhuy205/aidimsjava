// pages/About.js
import React, { memo } from "react";
import "../../css/index.css"; // Đảm bảo đúng đường dẫn theo cấu trúc dự án của bạn

const About = () => {
    return (
        <div className="about-page">
            {/* Header Navigation */}
            <nav className="navbar">
                <div className="nav-container">
                    <div className="nav-logo">
                        <a href="/"><h2>🏥 AIDIMS</h2></a>
                    </div>
                    <ul className="nav-menu">
                        <li><a href="/">Trang chủ</a></li>
                        <li><a href="/About">Giới thiệu</a></li>
                        <li><a href="#features">Tính năng</a></li>
                        <li><a href="#contact">Liên hệ</a></li>
                        <li><a href="/LoginRegister" className="login-btn">Đăng nhập</a></li>
                    </ul>
                </div>
            </nav>

            {/* About Section */}
            <section className="about-dashboard">
                <h1>Giới thiệu về AIDIMS</h1>
                <p>
                    <strong>AIDIMS</strong> (Hệ thống Quản lý Ảnh DICOM Tích hợp Trí tuệ Nhân tạo cho Bệnh viện)
                    là một giải pháp hiện đại giúp tối ưu hoá việc lưu trữ, xử lý và chẩn đoán hình ảnh y tế.
                </p>
                <p>
                    Hệ thống cho phép nhập, phân loại, lưu trữ ảnh DICOM từ các thiết bị như CT, MRI, X-quang,...
                    đồng thời tích hợp AI để hỗ trợ bác sĩ trong việc phân tích và đưa ra chẩn đoán chính xác hơn.
                </p>
                <p>
                    AIDIMS không chỉ tăng cường hiệu quả trong quản lý dữ liệu hình ảnh, mà còn giúp cải thiện
                    chất lượng điều trị và chăm sóc bệnh nhân.
                </p>
            </section>
        </div>
    );
};

export default memo(About);
