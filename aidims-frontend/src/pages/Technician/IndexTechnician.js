import { memo } from "react"
import { Link } from "react-router-dom"
import LayoutLogin from "../Layout/LayoutLogin"
import "../../css/indexTechnician.css"

const IndexTechnician = () => {
  return (
    <LayoutLogin>
      <div className="technician-page">
        <section className="technician-dashboard">
          <div className="dashboard-content">
            <h1 className="welcome-title">
              👨‍🔬 Chào mừng Kỹ thuật viên đến với <span className="brand">AIDIMS</span>
            </h1>
            <p className="dashboard-desc">
              🖼️ Quản lý và xử lý hình ảnh y tế DICOM một cách <b>chuyên nghiệp</b>, <b>chính xác</b> và <b>hiệu quả</b>.
            </p>
            <div className="features">
              <Link to="/technician/import-dicom" className="feature-card">
                <div className="feature-icon import-icon">📤</div>
                <h3>Nhập file DICOM</h3>
                <p>Import và quản lý file DICOM từ các thiết bị chụp hình ảnh y tế.</p>
              </Link>
              <Link to="/technician/verify-images" className="feature-card">
                <div className="feature-icon verify-icon">✅</div>
                <h3>Kiểm tra chất lượng</h3>
                <p>Xác minh chất lượng hình ảnh và thông số kỹ thuật.</p>
              </Link>
              <Link to="/technician/assign-images" className="feature-card">
                <div className="feature-icon assign-icon">👥</div>
                <h3>Phân công hình ảnh</h3>
                <p>Gán hình ảnh cho bệnh nhân và chuyển đến bác sĩ đọc.</p>
              </Link>
            </div>
          </div>
        </section>
      </div>
  )
    </LayoutLogin>
  )
}

export default memo(IndexTechnician)
