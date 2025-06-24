"use client"

import { memo, useState, useEffect } from "react"
import { Link } from 'react-router-dom';
import Layout from "../Layout/Layout"
import { patientService } from "../../services/patientService"
import "../../css/PatientProfile.css"

const PatientProfile = () => {
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load patients from database (same source as receptionist)
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true)
        const patientsData = await patientService.getAllPatients()

        // Transform data for doctor view
        const transformedPatients = patientsData.map((patient) => ({
          id: patient.patient_id,
          patientCode: patient.patient_code,
          fullName: patient.full_name,
          dateOfBirth: patient.date_of_birth,
          gender: patient.gender,
          phone: patient.phone,
          email: patient.email,
          address: patient.address,
          identityNumber: patient.identity_number,
          insuranceNumber: patient.insurance_number,
          bloodType: patient.blood_type,
          allergies: patient.allergies || "Không có",
          medicalHistory: patient.medical_history || "Chưa có thông tin",
          // Vital signs from receptionist
          temperature: patient.temperature,
          heartRate: patient.heart_rate,
          bloodPressureSystolic: patient.blood_pressure_systolic,
          bloodPressureDiastolic: patient.blood_pressure_diastolic,
          respiratoryRate: patient.respiratory_rate,
          oxygenSaturation: patient.oxygen_saturation,
          weight: patient.weight,
          height: patient.height,
          // Default fields for doctor view
          chiefComplaint: "Chưa khám",
          specialty: "Tổng quát",
          status: "Chờ khám",
          priority: "Bình thường",
          visitDate: new Date().toISOString().split("T")[0],
        }))

        setPatients(transformedPatients)
      } catch (err) {
        console.error("Lỗi:", err)
        setError("Không thể tải danh sách bệnh nhân")
        setPatients([])
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
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
    if (!dateOfBirth) return "N/A"

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

  // Loading state
  if (loading) {
    return (
        <Layout>
          <div className="doctor-page">
            <div className="patient-list-container">
              <div className="page-header">
                <h2>📋 Danh sách bệnh nhân</h2>
                <p>Đang tải dữ liệu...</p>
              </div>
              <div style={{ textAlign: "center", padding: "2rem" }}>
                <div>🔄 Đang tải danh sách bệnh nhân...</div>
              </div>
            </div>
          </div>
        </Layout>
    )
  }

  // Error state
  if (error) {
    return (
        <Layout>
          <div className="doctor-page">
            <div className="patient-list-container">
              <div className="page-header">
                <h2>📋 Danh sách bệnh nhân</h2>
                <p>Có lỗi xảy ra</p>
              </div>
              <div style={{ textAlign: "center", padding: "2rem", color: "red" }}>
                <div>❌ {error}</div>
                <button onClick={() => window.location.reload()} style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
                  Thử lại
                </button>
              </div>
            </div>
          </div>
        </Layout>
    )
  }

  return (
      <Layout>
        <div className="doctor-page">
          <div className="patient-list-container">
            <div className="page-header">
              <h2>📋 Danh sách bệnh nhân</h2>
              <p>Xem thông tin chi tiết hồ sơ bệnh nhân do nhân viên tiếp nhận tạo</p>
            </div>

            <div className="patient-stats">
              <div className="stat-card">
                <div className="stat-label">Tổng bệnh nhân</div>
                <div className="stat-number">{patients.length}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Có sinh hiệu</div>
                <div className="stat-number">
                  {patients.filter((p) => p.temperature || p.heartRate || p.bloodPressureSystolic).length}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Chờ khám</div>
                <div className="stat-number">{patients.filter((p) => p.status === "Chờ khám").length}</div>
              </div>
            </div>

            <div className="table-container">
              {patients.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "2rem" }}>
                    <div>📝 Chưa có bệnh nhân nào trong hệ thống</div>
                  </div>
              ) : (
                  <table className="patient-table">
                    <thead>
                    <tr>
                      <th>Mã BN</th>
                      <th>Họ và tên</th>
                      <th>Tuổi</th>
                      <th>Giới tính</th>
                      <th>Số điện thoại</th>
                      <th>Email</th>
                      <th>Sinh hiệu</th>
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
                          <td>{patient.phone}</td>
                          <td>{patient.email}</td>
                          <td>
                            {patient.temperature || patient.heartRate || patient.bloodPressureSystolic ? (
                                <span className="vital-indicator">✅ Có</span>
                            ) : (
                                <span className="vital-indicator-none">❌ Chưa có</span>
                            )}
                          </td>
                          <td>
                            <span className="status-badge">{patient.status}</span>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
              )}
            </div>
          </div>

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
                    {/* Hiển thị tab sinh hiệu nếu có dữ liệu */}
                    {(selectedPatient.temperature ||
                        selectedPatient.heartRate ||
                        selectedPatient.bloodPressureSystolic ||
                        selectedPatient.weight) && (
                        <div
                            className={`tab-item ${activeTab === "vital" ? "active" : ""}`}
                            onClick={() => setActiveTab("vital")}
                        >
                          <div className="tab-icon">📊</div>
                          <span>Sinh hiệu</span>
                        </div>
                    )}
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
                          <h4>📊 SINH HIỆU (do nhân viên tiếp nhận ghi nhận)</h4>

                          <div className="vital-signs-grid">
                            {selectedPatient.temperature && (
                                <div className="vital-card">
                                  <div className="vital-icon">🌡️</div>
                                  <div className="vital-value">{selectedPatient.temperature}°C</div>
                                  <div className="vital-label">Nhiệt độ</div>
                                </div>
                            )}

                            {selectedPatient.heartRate && (
                                <div className="vital-card">
                                  <div className="vital-icon">💓</div>
                                  <div className="vital-value">{selectedPatient.heartRate}</div>
                                  <div className="vital-label">Nhịp tim (lần/phút)</div>
                                </div>
                            )}

                            {selectedPatient.bloodPressureSystolic && selectedPatient.bloodPressureDiastolic && (
                                <div className="vital-card">
                                  <div className="vital-icon">🩸</div>
                                  <div className="vital-value">
                                    {selectedPatient.bloodPressureSystolic}/{selectedPatient.bloodPressureDiastolic}
                                  </div>
                                  <div className="vital-label">Huyết áp (mmHg)</div>
                                </div>
                            )}

                            {selectedPatient.respiratoryRate && (
                                <div className="vital-card">
                                  <div className="vital-icon">🫁</div>
                                  <div className="vital-value">{selectedPatient.respiratoryRate}</div>
                                  <div className="vital-label">Nhịp thở (lần/phút)</div>
                                </div>
                            )}

                            {selectedPatient.oxygenSaturation && (
                                <div className="vital-card">
                                  <div className="vital-icon">🔵</div>
                                  <div className="vital-value">{selectedPatient.oxygenSaturation}%</div>
                                  <div className="vital-label">SpO2</div>
                                </div>
                            )}

                            {selectedPatient.weight && (
                                <div className="vital-card">
                                  <div className="vital-icon">⚖️</div>
                                  <div className="vital-value">{selectedPatient.weight} kg</div>
                                  <div className="vital-label">Cân nặng</div>
                                </div>
                            )}

                            {selectedPatient.height && (
                                <div className="vital-card">
                                  <div className="vital-icon">📏</div>
                                  <div className="vital-value">{selectedPatient.height} cm</div>
                                  <div className="vital-label">Chiều cao</div>
                                </div>
                            )}
                          </div>
                        </div>
                    )}

                    <div className="modal-actions">
                      <Link to={`/CreateImagingRequest?patientId=${selectedPatient.id}`}>
                        <button className="btn btn-primary">📝 Tạo yêu cầu chụp</button>
                      </Link>
                      {/* THAY ĐỔI: Truyền patientId qua URL params */}
                      <Link to={`/SymptomDisplay?patientId=${selectedPatient.id}`}>
                        <button className="btn btn-secondary">📄 Xem triệu chứng</button>
                      </Link>
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