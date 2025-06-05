import React, { memo } from "react";
import { Link } from 'react-router-dom';
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
                        <li><a href="/about">Giới thiệu</a></li>
                        <li><a href="Features">Tính năng</a></li>
                        <li><a href="Contact">Liên hệ</a></li>
                        <li><a href="/LoginRegister" className="login-btn">Đăng nhập</a></li>
                    </ul>
                </div>
            </nav>
            <section className="doctor-dashboard">
                <h1>Chào mừng Bác sĩ đến với AIDIMS</h1>
                <p>Quản lý hồ sơ bệnh nhân và hình ảnh y tế một cách hiệu quả.</p>
                {/* Add more content specific to the doctor's dashboard here */}
            </section>
            <div className="services-container">
            <a href="/about"
                <div className="service-card">
                    <div className="icon-container">
                        <svg className="w-[30px] h-[30px] text-gray-800 dark:text-white" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="White"
                             viewBox="0 0 24 24">
                            <path fill-rule="evenodd"
                                  d="M3 6a2 2 0 0 1 2-2h5.532a2 2 0 0 1 1.536.72l1.9 2.28H3V6Zm0 3v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9H3Z"
                                  clip-rule="evenodd"/>
                        </svg>


                    </div>
                    <h3 className="service-title">Hồ sơ bệnh nhân</h3>
                    <p className="service-description">
                        Xem thông tin, lịch sử bệnh án, tạo hồ sơ và báo cáo chuẩn đoán
                    </p>
                </div>
                <div className="service-card">
                    <div className="icon-container">
                        <svg className="w-[30px] h-[30px] text-gray-800 dark:text-white" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white"
                             viewBox="0 0 24 24">
                            <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z"/>
                            <path fill-rule="evenodd"
                                  d="M21.707 21.707a1 1 0 0 1-1.414 0l-3.5-3.5a1 1 0 0 1 1.414-1.414l3.5 3.5a1 1 0 0 1 0 1.414Z"
                                  clip-rule="evenodd"/>
                        </svg>
                    </div>
                    <h3 className="service-title">Phân tích hình ảnh<span className="highlight"> DICOM</span>
                    </h3>
                    <p className="service-description">
                        Xem và phân tích hình ảnh
                    </p>

                </div>
            </div>
        </div>
    );
};

export default memo(IndexDoctor);