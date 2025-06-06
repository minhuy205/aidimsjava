import React, { memo } from "react";
import { Link } from "react-router-dom";
import "../../css/indexReceptionist.css";
import Layout from "../Layout/Layout.js";

const IndexReceptionist = () => {
  return (
    <Layout>
      <div className="receptionist-page">
        <section className="receptionist-dashboard">
          <div className="dashboard-content">
            <h1 className="welcome-title">👋 Chào mừng Nhân viên tiếp nhận đến với <span className="brand">AIDIMS</span></h1>
            <p className="dashboard-desc">📁 Quản lý hồ sơ bệnh nhân và hình ảnh y tế một cách <b>hiệu quả</b>, <b>chính xác</b> và <b>nhanh chóng</b>.</p>
            <div className="features">
              <Link to="/patient" className="feature-card">
                <div className="feature-icon patient-icon">📄</div>
                <h3>Tạo & Cập nhật hồ sơ</h3>
                <p>Lưu trữ thông tin bệnh nhân an toàn và đầy đủ.</p>
              </Link>
              <Link to="/receptionist/symptom" className="feature-card">
                <div className="feature-icon symptom-icon">📝</div>
                <h3>Ghi nhận triệu chứng</h3>
                <p>Tiếp nhận và mô tả tình trạng ban đầu của bệnh nhân.</p>
              </Link>
              <Link to="/receptionist/assign" className="feature-card">
                <div className="feature-icon assign-icon">👨‍⚕️</div>
                <h3>Chuyển hồ sơ đến bác sĩ</h3>
                <p>Chọn bác sĩ phù hợp dựa trên chuyên khoa và triệu chứng.</p>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default memo(IndexReceptionist);