// pages/Contact.js
import React, { memo } from "react";
import Layout from '../Layout/Layout';  // đúng theo cấu trúc hiện tại
import "../../css/index.css"; // Đảm bảo đúng đường dẫn theo cấu trúc dự án của bạn
import "../../css/about.css"; // Đảm bảo đúng đường dẫn theo cấu trúc dự án của bạn

const Contact = () => {
    return (
        <Layout>
        <div className="about-page">
            {/* About Section */}
            <section className="about-dashboard">
  <h1>Liên hệ</h1>
  <h2>Nhóm phát triển</h2>
  <ul>
    <li><strong>Trưởng dự án:</strong> Lê Minh Huy</li>
    <li><strong>Thành viên dự án:</strong> Huỳnh Thị Mỹ Duyên</li>
    <li><strong>Thành viên dự án:</strong> Võ Thị Kim Cương</li>
    <li><strong>Thành viên dự án:</strong> Lê Anh Kiệt</li>
    <li><strong>Thành viên dự án:</strong> Nguyễn Hoàng Thoại</li>
    <li><strong>Thành viên dự án:</strong> Trần Huỳnh Gia Nguyễn</li>
    <li><strong>Thành viên dự án:</strong> Võ Hoàng Long</li>
    {/* <li><strong>Phát triển Backend:</strong> Trần Thị B – Kỹ sư phần mềm Spring Boot</li>
    <li><strong>Phát triển Frontend:</strong> Lê Văn C – Lập trình viên React / Next.js</li>
    <li><strong>AI Engineer:</strong> Hoàng D – Kỹ sư AI chuyên xử lý ảnh y khoa</li> */}
  </ul>
  <h2>Sheet & Github</h2>
  <ul>
    <li><a href="https://docs.google.com/spreadsheets/d/1V5PADmai-D2lrqRuN2viL-ZkTWZqA2K32qBgBx6gJZk/edit?usp=sharing">Link Google Sheet dự án</a></li>
    <li><a href="https://github.com/minhuy205/aidimsjava.git"> Link Github dự án</a></li>
  </ul>
  <h2>Thông tin liên hệ</h2>
  <ul>
    <li>Representative gmail: huylm1640@ut.edu.vn</li>
  </ul>
</section>
        </div>
        </Layout>
    );
};

export default memo(Contact);
