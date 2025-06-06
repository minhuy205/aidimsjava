"use client"

import { memo, useState, useEffect } from "react"
import Layout from "../Layout/Layout"
import "../../css/PatientProfile.css"

const PatientProfile = () => {
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  // Load patients from database
  useEffect(() => {
    // Simulate API call to get patients
    const mockPatients = [
      {
        id: "BN001",
        patientCode: "BN001",
        fullName: "Nguyễn Văn Nam",
        dateOfBirth: "1985-03-15",
        gender: "Nam",
        phone: "0912345678",
        email: "nvnam@email.com",
        address: "123 Nguyễn Huệ, Q.1, TP.HCM",
        identityNumber: "123456789",
        insuranceNumber: "SV123456789",
        bloodType: "A+",
        allergies: "Không có",
        medicalHistory: "Tiền sử cao huyết áp",
        chiefComplaint: "Đau ngực, khó thở khi gắng sức",
        vitalSigns: {
          temperature: 36.5,
          bloodPressure: "140/90",
          heartRate: 85,
          respiratoryRate: 18,
          oxygenSaturation: 97,
        },
        specialty: "Tim mạch",
        status: "Chờ chụp",
        priority: "Bình thường",
        visitDate: "2024-12-15",
      },
      {
        id: "BN002",
        patientCode: "BN002",
        fullName: "Trần Thị Hoa",
        dateOfBirth: "1990-07-22",
        gender: "Nữ",
        phone: "0923456789",
        email: "tthoa@email.com",
        address: "456 Lê Lợi, Q.3, TP.HCM",
        identityNumber: "987654321",
        insuranceNumber: "SV987654321",
        bloodType: "B+",
        allergies: "Dị ứng penicillin",
        medicalHistory: "Không có tiền sử bệnh lý",
        chiefComplaint: "Ho khan kéo dài, sốt nhẹ",
        vitalSigns: {
          temperature: 37.2,
          bloodPressure: "120/80",
          heartRate: 78,
          respiratoryRate: 20,
          oxygenSaturation: 98,
        },
        specialty: "Hô hấp",
        status: "Chờ chụp",
        priority: "Bình thường",
        visitDate: "2024-12-16",
      },
      {
        id: "BN003",
        patientCode: "BN003",
        fullName: "Lê Minh Tuấn",
        dateOfBirth: "1978-11-08",
        gender: "Nam",
        phone: "0934567890",
        email: "lmtuan@email.com",
        address: "789 Hai Bà Trưng, Q.1, TP.HCM",
        identityNumber: "456789123",
        insuranceNumber: "SV456789123",
        bloodType: "O+",
        allergies: "Không có",
        medicalHistory: "Tiền sử đau đầu mãn tính",
        chiefComplaint: "Đau đầu dữ dội, buồn nôn",
        vitalSigns: {
          temperature: 36.8,
          bloodPressure: "160/100",
          heartRate: 92,
          respiratoryRate: 16,
          oxygenSaturation: 99,
        },
        specialty: "Thần kinh",
        status: "Khẩn cấp",
        priority: "Khẩn cấp",
        visitDate: "2024-12-17",
      },
    ]
    setPatients(mockPatients)
  }, [])

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedPatient(null)
    setActiveTab("general")
  }

  const calculateAge = (dateOfBirth) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Khẩn cấp":
        return "#dc3545"
      case "Ưu tiên":
        return "#fd7e14"
      default:
        return "#28a745"
    }
  }

  return (
    <Layout>
      <div className="doctor-page">
        <div className="patient-list-container">
          <div className="page-header">
            <h2>📋 Danh sách bệnh nhân</h2>
            <p>Quản lý và xem thông tin chi tiết hồ sơ bệnh nhân</p>
          </div>

          <div className="patient-stats">
            <div className="stat-card">
              <div className="stat-number">{patients.length}</div>
              <div className="stat-label">Tổng bệnh nhân</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{patients.filter((p) => p.priority === "Khẩn cấp").length}</div>
              <div className="stat-label">Khẩn cấp</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{patients.filter((p) => p.status === "Chờ chụp").length}</div>
              <div className="stat-label">Chờ chụp</div>
            </div>
          </div>

          <div className="table-container">
            <table className="patient-table">
              <thead>
                <tr>
                  <th>Mã BN</th>
                  <th>Họ và tên</th>
                  <th>Tuổi</th>
                  <th>Giới tính</th>
                  <th>Chuyên khoa</th>
                  <th>Triệu chứng chính</th>
                  <th>Mức độ ưu tiên</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id} onClick={() => handlePatientClick(patient)} className="patient-row">
                    <td>{patient.patientCode}</td>
                    <td className="patient-name">{patient.fullName}</td>
                    <td>{calculateAge(patient.dateOfBirth)}</td>
                    <td>{patient.gender}</td>
                    <td>{patient.specialty}</td>
                    <td className="chief-complaint">{patient.chiefComplaint}</td>
                    <td>
                      <span className="priority-badge" style={{ backgroundColor: getPriorityColor(patient.priority) }}>
                        {patient.priority}
                      </span>
                    </td>
                    <td>
                      <span className="status-badge">{patient.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Medical Record Modal */}
        {showModal && selectedPatient && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="medical-record-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <button className="close-btn" onClick={closeModal}>
                  ×
                </button>
                <h3>🏥 HỒ SƠ BỆNH ÁN</h3>
                <p>Mã bệnh nhân: {selectedPatient.patientCode}</p>
              </div>

              <div className="modal-tabs">
                <div
                  className={`tab-item ${activeTab === "general" ? "active" : ""}`}
                  onClick={() => setActiveTab("general")}
                >
                  <div className="tab-icon">👤</div>
                  <span>Thông tin chung</span>
                </div>
                <div
                  className={`tab-item ${activeTab === "medical" ? "active" : ""}`}
                  onClick={() => setActiveTab("medical")}
                >
                  <div className="tab-icon">🩺</div>
                  <span>Thông tin y tế</span>
                </div>
                <div
                  className={`tab-item ${activeTab === "vital" ? "active" : ""}`}
                  onClick={() => setActiveTab("vital")}
                >
                  <div className="tab-icon">📊</div>
                  <span>Sinh hiệu</span>
                </div>
              </div>

              <div className="modal-content">
                {activeTab === "general" && (
                  <div className="patient-info-section">
                    <h4>📋 THÔNG TIN BỆNH NHÂN</h4>

                    <div className="info-grid">
                      <div className="info-row">
                        <span className="info-label">Họ và tên:</span>
                        <span className="info-value">{selectedPatient.fullName}</span>
                      </div>

                      <div className="info-row">
                        <span className="info-label">Ngày sinh:</span>
                        <span className="info-value">{selectedPatient.dateOfBirth}</span>
                      </div>

                      <div className="info-row">
                        <span className="info-label">Tuổi:</span>
                        <span className="info-value">{calculateAge(selectedPatient.dateOfBirth)} tuổi</span>
                      </div>

                      <div className="info-row">
                        <span className="info-label">Giới tính:</span>
                        <span className="info-value">{selectedPatient.gender}</span>
                      </div>

                      <div className="info-row">
                        <span className="info-label">Số điện thoại:</span>
                        <span className="info-value">{selectedPatient.phone}</span>
                      </div>

                      <div className="info-row">
                        <span className="info-label">Email:</span>
                        <span className="info-value">{selectedPatient.email}</span>
                      </div>

                      <div className="info-row">
                        <span className="info-label">Địa chỉ:</span>
                        <span className="info-value">{selectedPatient.address}</span>
                      </div>

                      <div className="info-row">
                        <span className="info-label">CMND/CCCD:</span>
                        <span className="info-value">{selectedPatient.identityNumber}</span>
                      </div>

                      <div className="info-row">
                        <span className="info-label">Số BHYT:</span>
                        <span className="info-value">{selectedPatient.insuranceNumber}</span>
                      </div>

                      <div className="info-row">
                        <span className="info-label">Nhóm máu:</span>
                        <span className="info-value">{selectedPatient.bloodType}</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "medical" && (
                  <div className="patient-info-section">
                    <h4>🩺 THÔNG TIN Y TẾ</h4>

                    <div className="info-grid">
                      <div className="info-row">
                        <span className="info-label">Triệu chứng chính:</span>
                        <span className="info-value">{selectedPatient.chiefComplaint}</span>
                      </div>

                      <div className="info-row">
                        <span className="info-label">Tiền sử bệnh:</span>
                        <span className="info-value">{selectedPatient.medicalHistory}</span>
                      </div>

                      <div className="info-row">
                        <span className="info-label">Dị ứng:</span>
                        <span className="info-value">{selectedPatient.allergies}</span>
                      </div>

                      <div className="info-row">
                        <span className="info-label">Chuyên khoa:</span>
                        <span className="info-value">{selectedPatient.specialty}</span>
                      </div>

                      <div className="info-row">
                        <span className="info-label">Mức độ ưu tiên:</span>
                        <span className="info-value">
                          <span
                            className="priority-badge"
                            style={{ backgroundColor: getPriorityColor(selectedPatient.priority) }}
                          >
                            {selectedPatient.priority}
                          </span>
                        </span>
                      </div>

                      <div className="info-row">
                        <span className="info-label">Trạng thái:</span>
                        <span className="info-value">
                          <span className="status-badge">{selectedPatient.status}</span>
                        </span>
                      </div>

                      <div className="info-row">
                        <span className="info-label">Ngày khám:</span>
                        <span className="info-value">{selectedPatient.visitDate}</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "vital" && (
                  <div className="patient-info-section">
                    <h4>📊 SINH HIỆU</h4>

                    <div className="vital-signs-grid">
                      <div className="vital-card">
                        <div className="vital-icon">🌡️</div>
                        <div className="vital-value">{selectedPatient.vitalSigns.temperature}°C</div>
                        <div className="vital-label">Nhiệt độ</div>
                      </div>

                      <div className="vital-card">
                        <div className="vital-icon">💓</div>
                        <div className="vital-value">{selectedPatient.vitalSigns.heartRate}</div>
                        <div className="vital-label">Nhịp tim (lần/phút)</div>
                      </div>

                      <div className="vital-card">
                        <div className="vital-icon">🩸</div>
                        <div className="vital-value">{selectedPatient.vitalSigns.bloodPressure}</div>
                        <div className="vital-label">Huyết áp (mmHg)</div>
                      </div>

                      <div className="vital-card">
                        <div className="vital-icon">🫁</div>
                        <div className="vital-value">{selectedPatient.vitalSigns.respiratoryRate}</div>
                        <div className="vital-label">Nhịp thở (lần/phút)</div>
                      </div>

                      <div className="vital-card">
                        <div className="vital-icon">🔵</div>
                        <div className="vital-value">{selectedPatient.vitalSigns.oxygenSaturation}%</div>
                        <div className="vital-label">SpO2</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="modal-actions">
                  <button className="btn btn-primary">📝 Tạo yêu cầu chụp</button>
                  <button className="btn btn-secondary">📄 Xem báo cáo</button>
                  <button className="btn btn-success">✅ Hoàn thành khám</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default memo(PatientProfile)
