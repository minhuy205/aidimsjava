import { memo } from "react"
import { Link } from "react-router-dom"
import LayoutLogin from "../Layout/LayoutLogin"
import "../../css/indexAdmin.css"

const IndexAdmin = () => {
  return (
    <LayoutLogin>
      <div className="admin-page">
        <section className="admin-dashboard">
          <div className="dashboard-content">
            <h1 className="welcome-title">
              👑 Chào mừng Quản trị viên đến với <span className="brand">AIDIMS</span>
            </h1>
            <p className="dashboard-desc">
              ⚙️ Quản lý và giám sát toàn bộ hệ thống một cách <b>toàn diện</b>, <b>bảo mật</b> và <b>hiệu quả</b>.
            </p>
            <div className="features">
              <Link to="/admin/users" className="feature-card">
                <div className="feature-icon users-icon">👥</div>
                <h3>Quản lý người dùng</h3>
                <p>Tạo, chỉnh sửa tài khoản và phân quyền cho các nhân viên trong hệ thống.</p>
              </Link>
              <Link to="/admin/system" className="feature-card">
                <div className="feature-icon system-icon">📊</div>
                <h3>Giám sát hệ thống</h3>
                <p>Theo dõi hiệu suất, báo cáo thống kê và trạng thái hoạt động của hệ thống.</p>
              </Link>
              <Link to="/admin/settings" className="feature-card">
                <div className="feature-icon settings-icon">⚙️</div>
                <h3>Cấu hình hệ thống</h3>
                <p>Thiết lập các tham số, cấu hình bảo mật và tùy chỉnh hệ thống.</p>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </LayoutLogin>
  )
}

export default memo(IndexAdmin)
