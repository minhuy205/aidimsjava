import React, { memo } from "react";
const HomePage = () => {
    return (
        <div className="App">
            <header className="App-header">
                <h1>AIDIMS</h1>
                <h2>AI-Integrated DICOM Image Management System for Hospitals</h2>
                <p>Hệ thống hỗ trợ quản lý và phân tích ảnh y tế DICOM bằng trí tuệ nhân tạo.</p>
                <div className="button-group">
                    <a className="App-button" href="/login-doctor">Đăng nhập Bác sĩ</a>
                    <a className="App-button" href="/login-technician">Đăng nhập Kỹ thuật viên</a>
                    <a className="App-button" href="/admin">Trang Quản trị</a>
                </div>
            </header>
        </div>
    );
};

export default memo(HomePage);
