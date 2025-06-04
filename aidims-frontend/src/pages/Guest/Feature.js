// pages/Feature.js
import React, { memo } from "react";
import Layout from '../Layout/Layout';  // đúng theo cấu trúc hiện tại
import "../../css/index.css"; // Đảm bảo đúng đường dẫn theo cấu trúc dự án của bạn
import "../../css/about.css"; // Đảm bảo đúng đường dẫn theo cấu trúc dự án của bạn
import "../../css/feature.css"; // Đảm bảo đúng đường dẫn theo cấu trúc dự án của bạn

const Feature = () => {
    return (
        <Layout>
            <div className="about-page">
            {/* About Section */}
            <section className="about-dashboard">
            <div className="role-features">
  <h1>Yêu cầu chức năng theo vai trò</h1>

  <div className="role-block">
    <h3>👩‍💼 Nhân viên tiếp nhận</h3>
    <ul>
      <li>Tạo và cập nhật hồ sơ bệnh nhân.</li>
      <li>Ghi nhận triệu chứng của bệnh nhân.</li>
      <li>Chuyển hồ sơ đến bác sĩ phù hợp theo triệu chứng và chuyên khoa.</li>
    </ul>
  </div>

  <div className="role-block">
    <h3>🩺 Bác sĩ</h3>
    <ul>
      <li>Xem hồ sơ bệnh nhân và yêu cầu chụp hình ảnh.</li>
      <li>Phân tích hình ảnh DICOM của bệnh nhân.</li>
      <li>Nhận kết quả từ AI và đưa ra chẩn đoán cuối cùng.</li>
      <li>Ghi chú, chú thích trên ảnh.</li>
      <li>So sánh hình ảnh theo thời gian của cùng bệnh nhân.</li>
      <li>Tạo báo cáo chẩn đoán.</li>
    </ul>
  </div>

  <div className="role-block">
    <h3>🧑‍🔬 Kỹ thuật viên hình ảnh</h3>
    <ul>
      <li>Nhập hình ảnh DICOM từ thiết bị vào hệ thống.</li>
      <li>Kiểm tra chất lượng ảnh và chụp lại nếu cần.</li>
      <li>Gán ảnh cho đúng bệnh nhân và nhập thông tin liên quan.</li>
    </ul>
  </div>

  <div className="role-block">
    <h3>🛠️ Quản trị viên hệ thống</h3>
    <ul>
      <li>Quản lý tài khoản người dùng.</li>
      <li>Theo dõi hoạt động hệ thống.</li>
      <li>Cấu hình tham số hệ thống và mô hình AI.</li>
    </ul>
  </div>

  <div className="role-block">
    <h3>🤖 Hệ thống xử lý tự động <span className="bonus-tag">(điểm cộng)</span></h3>
    <ul>
      <li>Tự động phân tích ảnh bằng AI ngay khi có ảnh mới.</li>
      <li>Gửi thông báo về kết quả hoặc trường hợp khẩn cấp.</li>
    </ul>
  </div>
</div>
            </section>
        </div>
        </Layout>
    );
};

export default memo(Feature);
