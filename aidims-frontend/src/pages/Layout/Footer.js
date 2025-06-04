// components/Footer.js
const Footer = () => (
    <footer className="footer">
            <div className="container">
              <div className="footer-content">
                <div className="footer-section">
                  <h3>🏥 AIDIMS</h3>
                  <p>Hệ thống quản lý hình ảnh DICOM tích hợp AI cho bệnh viện</p>
                </div>
                <div className="footer-section">
                  <h4>Liên kết</h4>
                  <ul>
                    <li>
                      <a href="/about">Giới thiệu</a>
                    </li>
                    <li>
                      <a href="/feature">Tính năng</a>
                    </li>
                    <li>
                      <a href="/contact">Liên hệ</a>
                    </li>
                  </ul>
                </div>
                <div className="footer-section">
                  <h4>Hỗ trợ</h4>
                  <ul>
                    <li>
                      <a href="#help">Trợ giúp</a>
                    </li>
                    <li>
                      <a href="#docs">Tài liệu</a>
                    </li>
                    <li>
                      <a href="#support">Hỗ trợ kỹ thuật</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="footer-bottom">
                <p>&copy; 2025 AIDIMS. Tất cả quyền được bảo lưu.</p>
              </div>
            </div>
          </footer>
  );
  
  export default Footer;
  