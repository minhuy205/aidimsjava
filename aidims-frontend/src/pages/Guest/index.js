import React, { memo } from "react";
import Layout from '../Layout/Layout';  // đúng theo cấu trúc hiện tại

const HomePage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-section">
            <div className="hero-container">
              <div className="hero-content">
                <h1>Hệ thống Quản lý Hình ảnh DICOM</h1>
                <h2>Tích hợp Trí tuệ Nhân tạo cho Bệnh viện</h2>
                <p>
                  AIDIMS - Giải pháp toàn diện cho việc quản lý, lưu trữ và phân tích hình ảnh y tế DICOM với sự hỗ trợ của
                  AI tiên tiến.
                </p>
    
                <div className="features-list">
                  <div className="feature-item">✅ Quản lý và Lưu trữ Hình ảnh DICOM</div>
                  <div className="feature-item">✅ Quản lý Hồ sơ Bệnh nhân</div>
                  <div className="feature-item">✅ Hỗ trợ và Tham khảo Chẩn đoán AI</div>
                  <div className="feature-item">✅ Bảo mật và Tuân thủ Tiêu chuẩn Y tế</div>
                </div>
    
                <div className="button-group">
                  <a className="btn-primary" href="#demo">
                    Xem Demo
                  </a>
                  <a className="btn-secondary" href="/LoginRegister">
                    Đăng nhập Hệ thống
                  </a>
                </div>
              </div>
    
              <div className="hero-image">
                <div className="demo-card">
                  <div className="card-header">
                    <h3>🔬 AIDIMS Dashboard</h3>
                  </div>
                  <div className="card-content">
                    <div className="demo-feature">
                      <span className="icon">📊</span>
                      <span>Phân tích AI</span>
                    </div>
                    <div className="demo-feature">
                      <span className="icon">🏥</span>
                      <span>Quản lý Bệnh nhân</span>
                    </div>
                    <div className="demo-feature">
                      <span className="icon">💾</span>
                      <span>Lưu trữ DICOM</span>
                    </div>
                    <div className="demo-feature">
                      <span className="icon">🔒</span>
                      <span>Bảo mật Cao</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Why Choose AIDIMS */}
          <section className="why-choose">
            <div className="container">
              <h2>Tại sao chọn AIDIMS?</h2>
              <div className="benefits-grid">
                <div className="benefit-card">
                  <div className="benefit-icon">⚡</div>
                  <h3>Hiệu suất Vượt trội</h3>
                  <p>Xử lý hình ảnh DICOM nhanh chóng với công nghệ tối ưu</p>
                </div>
                <div className="benefit-card">
                  <div className="benefit-icon">🤖</div>
                  <h3>AI Thông minh</h3>
                  <p>Hỗ trợ chẩn đoán chính xác với thuật toán AI tiên tiến</p>
                </div>
                <div className="benefit-card">
                  <div className="benefit-icon">🛡️</div>
                  <h3>Bảo mật Tuyệt đối</h3>
                  <p>Tuân thủ các tiêu chuẩn bảo mật y tế quốc tế</p>
                </div>
              </div>
            </div>
          </section>
    
          {/* Call to Action */}
          <section className="cta-section">
            <div className="container">
              <h2>Sẵn sàng trải nghiệm AIDIMS?</h2>
              <p>Đăng ký dùng thử miễn phí ngay hôm nay</p>
              <div className="cta-stats">
                <div className="stat">
                  <strong>30 ngày</strong>
                  <span>Dùng thử miễn phí</span>
                </div>
                <div className="stat">
                  <strong>24/7</strong>
                  <span>Hỗ trợ kỹ thuật</span>
                </div>
                <div className="stat">
                  <strong>100%</strong>
                  <span>Hoàn tiền nếu không hài lòng</span>
                </div>
              </div>
              <a className="btn-cta" href="#register">
                Đăng ký ngay
              </a>
            </div>
          </section>
    </Layout>
  );
}
export default memo(HomePage);
