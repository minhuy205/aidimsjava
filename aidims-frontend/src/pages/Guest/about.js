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
    <strong>AIDIMS</strong> (AI-powered DICOM Image Management System) là nền tảng hiện đại giúp bệnh viện số hoá toàn bộ quy trình quản lý ảnh y tế, tích hợp trí tuệ nhân tạo để hỗ trợ chẩn đoán nhanh chóng và chính xác.
  </p>

  <h2>Mục tiêu hệ thống</h2>
  <ul>
    <li>Hiện đại hoá quy trình xử lý ảnh y tế.</li>
    <li>Rút ngắn thời gian chẩn đoán và giảm tải cho bác sĩ.</li>
    <li>Đảm bảo bảo mật và truy cập an toàn vào dữ liệu bệnh nhân.</li>
    <li>Nâng cao chất lượng dịch vụ y tế thông qua công nghệ.</li>
  </ul>

  <h2>Tính năng nổi bật</h2>
  <ul>
    <li>📥 Tải lên và phân tích ảnh DICOM từ thiết bị CT, MRI, siêu âm, X-quang,...</li>
    <li>🧠 AI tự động gợi ý vùng tổn thương, dị tật, bất thường trên ảnh y học.</li>
    <li>🔎 Tra cứu, lọc ảnh theo tên bệnh nhân, loại ảnh, thời gian, khoa khám.</li>
    <li>📊 Dashboard thống kê số lượng ảnh, loại bệnh, hiệu suất AI theo thời gian thực.</li>
    <li>👥 Phân quyền người dùng: bác sĩ, kỹ thuật viên, quản trị viên, trợ lý AI.</li>
    <li>📡 Kết nối PACS, HL7 để đồng bộ dữ liệu với hệ thống bệnh viện tổng thể.</li>
  </ul>

  <h2>Các phân hệ trong AIDIMS</h2>
  <ol>
    <li><strong>Hệ thống lưu trữ ảnh:</strong> xử lý ảnh DICOM, chuẩn hóa và mã hoá lưu trữ.</li>
    <li><strong>Phân tích AI:</strong> huấn luyện mô hình, gợi ý chẩn đoán hình ảnh.</li>
    <li><strong>Quản trị người dùng:</strong> tạo tài khoản, phân quyền theo khoa/phòng.</li>
    <li><strong>Dashboard:</strong> theo dõi kết quả, AI accuracy, tình trạng hệ thống.</li>
  </ol>

  <h2>Ngôn ngữ & công nghệ</h2>
  <ul>
    <li>🚀 Backend: Spring Boot (Java), RESTful API</li>
    <li>🌐 Frontend: React / Next.js + Tailwind CSS</li>
    <li>🧠 AI: Python, TensorFlow, OpenCV, PyTorch</li>
    <li>🗃️ Database: PostgreSQL, MongoDB</li>
    <li>📡 Protocols: DICOM, HL7, HTTPS</li>
    <li>🔐 Bảo mật: JWT, OAuth2, phân quyền RBAC</li>
    <li>📦 DevOps: Docker, Kubernetes, CI/CD</li>
  </ul>

  <h2>Phản hồi từ người dùng</h2>
  <blockquote>
    "Từ khi áp dụng AIDIMS, quy trình chẩn đoán ảnh trong khoa Chẩn đoán hình ảnh đã giảm một nửa thời gian xử lý so với trước." – Bệnh viện ABC
  </blockquote>
  <blockquote>
    "Tôi thật sự ấn tượng với tính năng AI phát hiện tổn thương phổi trên ảnh X-quang – rất nhanh và chính xác." – Bác sĩ Phạm Văn E
  </blockquote>

  <h2>Tầm nhìn & phát triển tương lai</h2>
  <p>
    Trong giai đoạn tiếp theo, AIDIMS sẽ mở rộng thêm các mô hình AI chuyên biệt theo từng bệnh lý (ung thư, tim mạch, thần kinh), tích hợp với thiết bị IoT tại giường bệnh, và hỗ trợ ra quyết định điều trị bằng dữ liệu lớn (Big Data).
  </p>
</section>
        </div>
        </Layout>
    );
};

export default memo(About);
