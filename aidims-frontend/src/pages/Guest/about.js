// pages/About.js
import React, { memo } from "react";
import Layout from '../Layout/Layout';  // đúng theo cấu trúc hiện tại
import "../../css/index.css"; // Đảm bảo đúng đường dẫn theo cấu trúc dự án của bạn
import "../../css/about.css"; // Đảm bảo đúng đường dẫn theo cấu trúc dự án của bạn

const About = () => {
    return (
        <Layout>
        <div className="about-page">
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
        </Layout>
    );
};

export default memo(About);
