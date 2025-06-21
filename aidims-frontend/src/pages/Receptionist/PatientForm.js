"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "../Layout/Layout"
import { patientService } from "../../services/patientService"
import "../../css/patientForm.css"

const PatientForm = () => {
  const navigate = useNavigate()
  const [patients, setPatients] = useState([])
  const [form, setForm] = useState({
    patient_code: "",
    full_name: "",
    date_of_birth: "",
    gender: "Nam",
    phone: "",
    email: "",
    address: "",
    identity_number: "",
    insurance_number: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    blood_type: "",
    allergies: "",
    medical_history: "",
    // Sinh hiệu
    temperature: "",
    blood_pressure_systolic: "",
    blood_pressure_diastolic: "",
    heart_rate: "",
    respiratory_rate: "",
    oxygen_saturation: "",
    weight: "",
    height: "",
  })
  const [editId, setEditId] = useState(null)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeModalTab, setActiveModalTab] = useState("general")

  // Lấy danh sách bệnh nhân
  useEffect(() => {
    loadPatients()
  }, [])

  const loadPatients = async () => {
    try {
      setLoading(true)
      const data = await patientService.getAllPatients()
      setPatients(data)
    } catch (error) {
      console.error("Error loading patients:", error)
      setPatients([])
    } finally {
      setLoading(false)
    }
  }

  const generatePatientCode = () => {
    if (patients.length === 0) return "BN001"
    const codes = patients
      .map((p) => p.patient_code)
      .filter((code) => typeof code === "string" && code.startsWith("BN"))
    const numbers = codes.map((code) => Number.parseInt(code.replace("BN", ""), 10)).filter((num) => !isNaN(num))
    const maxNum = numbers.length > 0 ? Math.max(...numbers) : 0
    return `BN${(maxNum + 1).toString().padStart(3, "0")}`
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const patientData = {
        ...form,
        patient_code: form.patient_code || generatePatientCode(),
        // Convert string values to appropriate types
        temperature: form.temperature ? Number.parseFloat(form.temperature) : null,
        blood_pressure_systolic: form.blood_pressure_systolic ? Number.parseInt(form.blood_pressure_systolic) : null,
        blood_pressure_diastolic: form.blood_pressure_diastolic ? Number.parseInt(form.blood_pressure_diastolic) : null,
        heart_rate: form.heart_rate ? Number.parseInt(form.heart_rate) : null,
        respiratory_rate: form.respiratory_rate ? Number.parseInt(form.respiratory_rate) : null,
        oxygen_saturation: form.oxygen_saturation ? Number.parseInt(form.oxygen_saturation) : null,
        weight: form.weight ? Number.parseFloat(form.weight) : null,
        height: form.height ? Number.parseInt(form.height) : null,
      }

      if (editId) {
        patientData.patient_id = editId
      }

      await patientService.createOrUpdatePatient(patientData)

      // Reload patients list
      await loadPatients()

      // Reset form
      resetForm()

      alert(editId ? "Cập nhật hồ sơ thành công!" : "Tạo hồ sơ thành công!")
    } catch (error) {
      console.error("Error saving patient:", error)
      alert("Có lỗi xảy ra khi lưu hồ sơ!")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setForm({
      patient_code: "",
      full_name: "",
      date_of_birth: "",
      gender: "Nam",
      phone: "",
      email: "",
      address: "",
      identity_number: "",
      insurance_number: "",
      emergency_contact_name: "",
      emergency_contact_phone: "",
      blood_type: "",
      allergies: "",
      medical_history: "",
      temperature: "",
      blood_pressure_systolic: "",
      blood_pressure_diastolic: "",
      heart_rate: "",
      respiratory_rate: "",
      oxygen_saturation: "",
      weight: "",
      height: "",
    })
    setEditId(null)
  }

  const handleEdit = (patient) => {
    setForm({
      patient_code: patient.patient_code || "",
      full_name: patient.full_name || "",
      date_of_birth: patient.date_of_birth || "",
      gender: patient.gender || "Nam",
      phone: patient.phone || "",
      email: patient.email || "",
      address: patient.address || "",
      identity_number: patient.identity_number || "",
      insurance_number: patient.insurance_number || "",
      emergency_contact_name: patient.emergency_contact_name || "",
      emergency_contact_phone: patient.emergency_contact_phone || "",
      blood_type: patient.blood_type || "",
      allergies: patient.allergies || "",
      medical_history: patient.medical_history || "",
      temperature: patient.temperature || "",
      blood_pressure_systolic: patient.blood_pressure_systolic || "",
      blood_pressure_diastolic: patient.blood_pressure_diastolic || "",
      heart_rate: patient.heart_rate || "",
      respiratory_rate: patient.respiratory_rate || "",
      oxygen_saturation: patient.oxygen_saturation || "",
      weight: patient.weight || "",
      height: patient.height || "",
    })
    setEditId(patient.patient_id)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa hồ sơ này?")) {
      try {
        await patientService.deletePatient(id)
        await loadPatients()
        alert("Xóa hồ sơ thành công!")
      } catch (error) {
        console.error("Error deleting patient:", error)
        alert("Có lỗi xảy ra khi xóa hồ sơ!")
      }
    }
  }

  const handleRowClick = (patient) => {
    setSelectedPatient(patient)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedPatient(null)
    setActiveModalTab("general") // Reset tab
  }

  const calculateAge = (date_of_birth) => {
    if (!date_of_birth) return ""
    const today = new Date()
    const birthDate = new Date(date_of_birth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const filteredPatients = patients.filter(
    (patient) =>
      (patient.full_name && patient.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (patient.patient_code && patient.patient_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (patient.phone && patient.phone.includes(searchTerm)),
  )

  return (
    <Layout>
      <div className="patient-form">
        <div className="page-header">
          <h2>📄 Quản lý Hồ sơ Bệnh nhân</h2>
          <p>Tạo mới và cập nhật thông tin hồ sơ bệnh nhân</p>
        </div>

        <div className="form-container">
          <h3>{editId ? "✏️ Cập nhật hồ sơ" : "➕ Tạo hồ sơ mới"}</h3>

          <form onSubmit={handleSubmit} className="patient-form-grid">
            {/* Thông tin cơ bản */}
            <div className="section-header">
              <h4>👤 Thông tin cơ bản</h4>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Mã bệnh nhân:</label>
                <input
                  type="text"
                  name="patient_code"
                  value={form.patient_code}
                  onChange={handleChange}
                  placeholder={editId ? "" : generatePatientCode()}
                />
              </div>
              <div className="form-group">
                <label>Họ và tên: *</label>
                <input type="text" name="full_name" value={form.full_name} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Ngày sinh: *</label>
                <input type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Giới tính:</label>
                <select name="gender" value={form.gender} onChange={handleChange}>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Số điện thoại: *</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group full-width">
              <label>Địa chỉ:</label>
              <input type="text" name="address" value={form.address} onChange={handleChange} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>CMND/CCCD:</label>
                <input type="text" name="identity_number" value={form.identity_number} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Số BHYT:</label>
                <input type="text" name="insurance_number" value={form.insurance_number} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Người liên hệ khẩn cấp:</label>
                <input
                  type="text"
                  name="emergency_contact_name"
                  value={form.emergency_contact_name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>SĐT người liên hệ:</label>
                <input
                  type="tel"
                  name="emergency_contact_phone"
                  value={form.emergency_contact_phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Nhóm máu:</label>
                <select name="blood_type" value={form.blood_type} onChange={handleChange}>
                  <option value="">Chọn nhóm máu</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            <div className="form-group full-width">
              <label>Dị ứng:</label>
              <textarea
                name="allergies"
                value={form.allergies}
                onChange={handleChange}
                rows="2"
                placeholder="Ghi rõ các loại dị ứng (nếu có)"
              />
            </div>

            <div className="form-group full-width">
              <label>Tiền sử bệnh:</label>
              <textarea
                name="medical_history"
                value={form.medical_history}
                onChange={handleChange}
                rows="3"
                placeholder="Ghi rõ tiền sử bệnh lý"
              />
            </div>

            {/* Sinh hiệu */}
            <div className="section-header">
              <h4>📊 Sinh hiệu</h4>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>🌡️ Nhiệt độ (°C):</label>
                <input
                  type="number"
                  step="0.1"
                  name="temperature"
                  value={form.temperature}
                  onChange={handleChange}
                  placeholder="36.5"
                />
              </div>
              <div className="form-group">
                <label>💓 Nhịp tim (lần/phút):</label>
                <input
                  type="number"
                  name="heart_rate"
                  value={form.heart_rate}
                  onChange={handleChange}
                  placeholder="72"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>🩸 Huyết áp tâm thu (mmHg):</label>
                <input
                  type="number"
                  name="blood_pressure_systolic"
                  value={form.blood_pressure_systolic}
                  onChange={handleChange}
                  placeholder="120"
                />
              </div>
              <div className="form-group">
                <label>🩸 Huyết áp tâm trương (mmHg):</label>
                <input
                  type="number"
                  name="blood_pressure_diastolic"
                  value={form.blood_pressure_diastolic}
                  onChange={handleChange}
                  placeholder="80"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>🫁 Nhịp thở (lần/phút):</label>
                <input
                  type="number"
                  name="respiratory_rate"
                  value={form.respiratory_rate}
                  onChange={handleChange}
                  placeholder="16"
                />
              </div>
              <div className="form-group">
                <label>🔵 SpO2 (%):</label>
                <input
                  type="number"
                  name="oxygen_saturation"
                  value={form.oxygen_saturation}
                  onChange={handleChange}
                  placeholder="98"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>⚖️ Cân nặng (kg):</label>
                <input
                  type="number"
                  step="0.1"
                  name="weight"
                  value={form.weight}
                  onChange={handleChange}
                  placeholder="65.0"
                />
              </div>
              <div className="form-group">
                <label>📏 Chiều cao (cm):</label>
                <input type="number" name="height" value={form.height} onChange={handleChange} placeholder="170" />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Đang lưu..." : editId ? "💾 Cập nhật hồ sơ" : "➕ Lưu hồ sơ"}
              </button>
              {editId && (
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  ❌ Hủy
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="patient-list-section">
          <div className="list-header">
            <h3>📋 Danh sách bệnh nhân ({filteredPatients.length})</h3>
            <div className="search-box">
              <input
                type="text"
                placeholder="🔍 Tìm kiếm theo tên, mã BN hoặc SĐT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="table-container">
            {loading ? (
              <div className="loading-message">🔄 Đang tải dữ liệu...</div>
            ) : filteredPatients.length === 0 ? (
              <div className="empty-message">📝 Chưa có bệnh nhân nào trong hệ thống</div>
            ) : (
              <table className="patients-table">
                <thead>
                  <tr>
                    <th>Mã BN</th>
                    <th>Họ tên</th>
                    <th>Tuổi</th>
                    <th>Giới tính</th>
                    <th>SĐT</th>
                    <th>Địa chỉ</th>
                    <th>Nhóm máu</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient) => (
                    <tr key={patient.patient_id} onClick={() => handleRowClick(patient)} className="patient-row">
                      <td className="patient-code">{patient.patient_code}</td>
                      <td className="patient-name">{patient.full_name}</td>
                      <td>{calculateAge(patient.date_of_birth)}</td>
                      <td>{patient.gender}</td>
                      <td>{patient.phone}</td>
                      <td className="address-cell">{patient.address}</td>
                      <td>{patient.blood_type}</td>
                      <td className="actions-cell">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEdit(patient)
                          }}
                          className="btn-edit"
                          title="Sửa"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(patient.patient_id)
                          }}
                          className="btn-delete"
                          title="Xóa"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Patient Detail Modal với sinh hiệu */}
        {showModal && selectedPatient && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="medical-record-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <button className="close-btn" onClick={closeModal}>
                  ×
                </button>
                <h3>🏥 HỒ SƠ BỆNH NHÂN</h3>
                <p>Mã bệnh nhân: {selectedPatient.patient_code}</p>
              </div>

              <div className="modal-content">
                {/* Tab Navigation */}
                <div className="modal-tabs">
                  <div
                    className={`modal-tab-item ${activeModalTab === "general" ? "active" : ""}`}
                    onClick={() => setActiveModalTab("general")}
                  >
                    <span className="tab-icon">👤</span>
                    <span>Thông tin chung</span>
                  </div>
                  <div
                    className={`modal-tab-item ${activeModalTab === "vital" ? "active" : ""}`}
                    onClick={() => setActiveModalTab("vital")}
                  >
                    <span className="tab-icon">📊</span>
                    <span>Sinh hiệu</span>
                  </div>
                </div>

                {/* Tab Content */}
                {activeModalTab === "general" && (
                  <div className="patient-info-section">
                    <h4>📋 THÔNG TIN CHI TIẾT</h4>
                    <div className="patient-details-grid">
                      <div className="detail-row">
                        <div className="detail-item">
                          <span className="detail-label">Họ và tên:</span>
                          <span className="detail-value">{selectedPatient.full_name}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Mã bệnh nhân:</span>
                          <span className="detail-value">{selectedPatient.patient_code}</span>
                        </div>
                      </div>

                      <div className="detail-row">
                        <div className="detail-item">
                          <span className="detail-label">Ngày sinh:</span>
                          <span className="detail-value">{selectedPatient.date_of_birth}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Tuổi:</span>
                          <span className="detail-value">{calculateAge(selectedPatient.date_of_birth)} tuổi</span>
                        </div>
                      </div>

                      <div className="detail-row">
                        <div className="detail-item">
                          <span className="detail-label">Giới tính:</span>
                          <span className="detail-value">{selectedPatient.gender}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Số điện thoại:</span>
                          <span className="detail-value">{selectedPatient.phone}</span>
                        </div>
                      </div>

                      <div className="detail-row">
                        <div className="detail-item">
                          <span className="detail-label">Email:</span>
                          <span className="detail-value">{selectedPatient.email || "Chưa có"}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Địa chỉ:</span>
                          <span className="detail-value">{selectedPatient.address}</span>
                        </div>
                      </div>

                      <div className="detail-row">
                        <div className="detail-item">
                          <span className="detail-label">CMND/CCCD:</span>
                          <span className="detail-value">{selectedPatient.identity_number}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Số BHYT:</span>
                          <span className="detail-value">{selectedPatient.insurance_number}</span>
                        </div>
                      </div>

                      <div className="detail-row">
                        <div className="detail-item">
                          <span className="detail-label">Nhóm máu:</span>
                          <span className="detail-value">{selectedPatient.blood_type}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Người liên hệ khẩn cấp:</span>
                          <span className="detail-value">{selectedPatient.emergency_contact_name}</span>
                        </div>
                      </div>

                      <div className="detail-row">
                        <div className="detail-item">
                          <span className="detail-label">Dị ứng:</span>
                          <span className="detail-value">{selectedPatient.allergies || "Không có"}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">SĐT người liên hệ:</span>
                          <span className="detail-value">{selectedPatient.emergency_contact_phone}</span>
                        </div>
                      </div>

                      <div className="detail-row full-width">
                        <div className="detail-item">
                          <span className="detail-label">Tiền sử bệnh:</span>
                          <span className="detail-value">{selectedPatient.medical_history || "Không có"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeModalTab === "vital" && (
                  <div className="patient-info-section">
                    <h4>📊 SINH HIỆU</h4>
                    {selectedPatient.temperature ||
                    selectedPatient.heart_rate ||
                    selectedPatient.blood_pressure_systolic ||
                    selectedPatient.weight ||
                    selectedPatient.height ? (
                      <div className="vital-signs-display">
                        {selectedPatient.temperature && (
                          <div className="vital-item">
                            <span className="vital-icon">🌡️</span>
                            <span className="vital-label">Nhiệt độ:</span>
                            <span className="vital-value">{selectedPatient.temperature}°C</span>
                          </div>
                        )}
                        {selectedPatient.heart_rate && (
                          <div className="vital-item">
                            <span className="vital-icon">💓</span>
                            <span className="vital-label">Nhịp tim:</span>
                            <span className="vital-value">{selectedPatient.heart_rate} lần/phút</span>
                          </div>
                        )}
                        {selectedPatient.blood_pressure_systolic && selectedPatient.blood_pressure_diastolic && (
                          <div className="vital-item">
                            <span className="vital-icon">🩸</span>
                            <span className="vital-label">Huyết áp:</span>
                            <span className="vital-value">
                              {selectedPatient.blood_pressure_systolic}/{selectedPatient.blood_pressure_diastolic} mmHg
                            </span>
                          </div>
                        )}
                        {selectedPatient.respiratory_rate && (
                          <div className="vital-item">
                            <span className="vital-icon">🫁</span>
                            <span className="vital-label">Nhịp thở:</span>
                            <span className="vital-value">{selectedPatient.respiratory_rate} lần/phút</span>
                          </div>
                        )}
                        {selectedPatient.oxygen_saturation && (
                          <div className="vital-item">
                            <span className="vital-icon">🔵</span>
                            <span className="vital-label">SpO2:</span>
                            <span className="vital-value">{selectedPatient.oxygen_saturation}%</span>
                          </div>
                        )}
                        {selectedPatient.weight && (
                          <div className="vital-item">
                            <span className="vital-icon">⚖️</span>
                            <span className="vital-label">Cân nặng:</span>
                            <span className="vital-value">{selectedPatient.weight} kg</span>
                          </div>
                        )}
                        {selectedPatient.height && (
                          <div className="vital-item">
                            <span className="vital-icon">📏</span>
                            <span className="vital-label">Chiều cao:</span>
                            <span className="vital-value">{selectedPatient.height} cm</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="no-vital-data">
                        <p>Chưa có dữ liệu sinh hiệu cho bệnh nhân này.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

         <div className="back-to-home-btn-wrapper">
          <button className="back-to-home-btn" onClick={() => navigate("/receptionist")}>
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M15 18L9 12L15 6" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            Quay lại trang chủ
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default PatientForm
