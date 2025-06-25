import { memo } from "react"
import { Link } from "react-router-dom"
import LayoutLogin from "../Layout/LayoutLogin"
import "../../css/indexDoctor.css"

const IndexDoctor = () => {
  return (
    <LayoutLogin>
      <div className="doctor-page">
        <section className="doctor-dashboard">
          <h1>
            👨‍⚕️ Chào mừng Bác sĩ đến với <span className="brand3">AIDIMS</span>
          </h1>
          <p>
            🏥 Quản lý hồ sơ bệnh nhân và phân tích hình ảnh y tế một cách <b>chuyên nghiệp</b> và <b>chính xác</b>
          </p>
        </section>

        <section className="medical-services-section">
          <h2>🔧 Các chức năng chính</h2>
          <div className="services-container">
            <Link to="/doctor/patients" className="service-card">
              <div className="icon-container">
                <svg className="icon" fill="white" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M3 6a2 2 0 0 1 2-2h5.532a2 2 0 0 1 1.536.72l1.9 2.28H3V6Zm0 3v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9H3Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="service-title">📋 Xem hồ sơ bệnh nhân</h3>
              <p className="service-description">
                Xem thông tin chi tiết, lịch sử bệnh án và tình trạng sức khỏe của bệnh nhân
              </p>
            </Link>

            <Link to="/doctor/dicom-viewer" className="service-card">
              <div className="icon-container">
                <svg className="icon" fill="white" viewBox="0 0 24 24">
                  <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 17l3.5-4.5 2.5 3.01L14.5 11l4.5 6H5z" />
                </svg>
              </div>
              <h3 className="service-title">
                🖼️ Xem và phân tích hình ảnh <span className="highlight">DICOM</span>
              </h3>
              <p className="service-description">Xem, phân tích hình ảnh y tế với công cụ chuyên nghiệp và hỗ trợ AI</p>
            </Link>

            <Link to="/doctor/reports" className="service-card">
              <div className="icon-container">
                <svg className="icon" fill="white" viewBox="0 0 24 24">
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                </svg>
              </div>
              <h3 className="service-title">📄 Tạo báo cáo chẩn đoán</h3>
              <p className="service-description">Tạo và quản lý báo cáo chẩn đoán chi tiết cho bệnh nhân</p>
            </Link>

             <Link to="/doctor/compare-images" className="service-card">
              <div className="icon-container">
                <svg className="icon" fill="white" viewBox="0 0 24 24">
                  <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
                </svg>
              </div>
              <h3 className="service-title">🔄 So sánh hình ảnh</h3>
              <p className="service-description">So sánh hình ảnh mới với hình ảnh cũ của cùng một bệnh nhân</p>
            </Link>

            <Link to="/doctor/notifications" className="service-card">
              <div className="icon-container">
                <svg className="icon" fill="white" viewBox="0 0 24 24">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                </svg>
              </div>
              <h3 className="service-title">🔔 Thông báo và nhắc nhở</h3>
              <p className="service-description">Nhận thông báo về kết quả AI và các ca cần ưu tiên xem xét</p>
            </Link>
          </div>
        </section>
      </div>
    </LayoutLogin>
  )
}

export default memo(IndexDoctor)
