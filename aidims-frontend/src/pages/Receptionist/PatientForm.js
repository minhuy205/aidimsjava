"use client"

import { useState, useEffect } from "react"
import Layout from "../Layout/Layout"
import "../../css/patientForm.css"

const PatientForm = () => {
  const [patients, setPatients] = useState([])
  const [form, setForm] = useState({
    patientCode: "",
    fullName: "",
    dateOfBirth: "",
    gender: "Nam",
    phone: "",
    email: "",
    address: "",
    identityNumber: "",
    insuranceNumber: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    bloodType: "",
    allergies: "",
    medicalHistory: "",
  })
  const [editId, setEditId] = useState(null)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Load patients from localStorage on component mount
  useEffect(() => {
    const savedPatients = localStorage.getItem("patients")
    if (savedPatients) {
      setPatients(JSON.parse(savedPatients))
    } else {
      // Initialize with sample data
      const samplePatients = [
        {
          id: 1,
          patientCode: "BN001",
          fullName: "Nguyễn Văn Nam",
          dateOfBirth: "1985-03-15",
          gender: "Nam",
          phone: "0912345678",
          email: "nvnam@email.com",
          address: "123 Nguyễn Huệ, Q.1, TP.HCM",
          identityNumber: "123456789",
          insuranceNumber: "SV123456789",
          emergencyContactName: "Nguyễn Thị Lan",
          emergencyContactPhone: "0987654321",
          bloodType: "A+",
          allergies: "Không có",
          medicalHistory: "Tiền sử cao huyết áp",
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          patientCode: "BN002",
          fullName: "Trần Thị Hoa",
          dateOfBirth: "1990-07-22",
          gender: "Nữ",
          phone: "0923456789",
          email: "tthoa@email.com",
          address: "456 Lê Lợi, Q.3, TP.HCM",
          identityNumber: "987654321",
          insuranceNumber: "SV987654321",
          emergencyContactName: "Trần Văn Minh",
          emergencyContactPhone: "0901234567",
          bloodType: "B+",
          allergies: "Dị ứng penicillin",
          medicalHistory: "Không có tiền sử bệnh lý",
          createdAt: new Date().toISOString(),
        },
      ]
      setPatients(samplePatients)
      localStorage.setItem("patients", JSON.stringify(samplePatients))
    }
  }, [])

  // Save patients to localStorage whenever patients array changes
  useEffect(() => {
    localStorage.setItem("patients", JSON.stringify(patients))
  }, [patients])

  const generatePatientCode = () => {
    const lastPatient = patients[patients.length - 1]
    if (!lastPatient) return "BN001"

    const lastCode = lastPatient.patientCode
    const number = Number.parseInt(lastCode.substring(2)) + 1
    return `BN${number.toString().padStart(3, "0")}`
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editId) {
      setPatients(patients.map((p) => (p.id === editId ? { ...p, ...form } : p)))
    } else {
      const newPatient = {
        ...form,
        id: Date.now(),
        patientCode: form.patientCode || generatePatientCode(),
        createdAt: new Date().toISOString(),
      }
      setPatients([...patients, newPatient])
    }

    // Reset form
    setForm({
      patientCode: "",
      fullName: "",
      dateOfBirth: "",
      gender: "Nam",
      phone: "",
      email: "",
      address: "",
      identityNumber: "",
      insuranceNumber: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      bloodType: "",
      allergies: "",
      medicalHistory: "",
    })
    setEditId(null)
  }

  const handleEdit = (patient) => {
    setForm({
      patientCode: patient.patientCode,
      fullName: patient.fullName,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email,
      address: patient.address,
      identityNumber: patient.identityNumber,
      insuranceNumber: patient.insuranceNumber,
      emergencyContactName: patient.emergencyContactName,
      emergencyContactPhone: patient.emergencyContactPhone,
      bloodType: patient.bloodType,
      allergies: patient.allergies,
      medicalHistory: patient.medicalHistory,
    })
    setEditId(patient.id)
  }

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa hồ sơ này?")) {
      setPatients(patients.filter((p) => p.id !== id))
    }
  }

  const handleRowClick = (patient) => {
    setSelectedPatient(patient)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedPatient(null)
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

  const filteredPatients = patients.filter(
    (patient) =>
      patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patientCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm),
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
            <div className="form-row">
              <div className="form-group">
                <label>Mã bệnh nhân:</label>
                <input
                  type="text"
                  name="patientCode"
                  value={form.patientCode}
                  onChange={handleChange}
                  placeholder={editId ? "" : generatePatientCode()}
                />
              </div>
              <div className="form-group">
                <label>Họ và tên: *</label>
                <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Ngày sinh: *</label>
                <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} required />
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
                <input type="text" name="identityNumber" value={form.identityNumber} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Số BHYT:</label>
                <input type="text" name="insuranceNumber" value={form.insuranceNumber} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Người liên hệ khẩn cấp:</label>
                <input
                  type="text"
                  name="emergencyContactName"
                  value={form.emergencyContactName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>SĐT người liên hệ:</label>
                <input
                  type="tel"
                  name="emergencyContactPhone"
                  value={form.emergencyContactPhone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Nhóm máu:</label>
                <select name="bloodType" value={form.bloodType} onChange={handleChange}>
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
                name="medicalHistory"
                value={form.medicalHistory}
                onChange={handleChange}
                rows="3"
                placeholder="Ghi rõ tiền sử bệnh lý"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editId ? "💾 Cập nhật hồ sơ" : "➕ Lưu hồ sơ"}
              </button>
              {editId && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setForm({
                      patientCode: "",                      fullName: "",
                      dateOfBirth: "",
                      gender: "Nam",
                      phone: "",
                      email: "",
                      address: "",
                      identityNumber: "",
                      insuranceNumber: "",
                      emergencyContactName: "",
                      emergencyContactPhone: "",
                      bloodType: "",
                      allergies: "",
                      medicalHistory: "",
                    })
                    setEditId(null)
                  }}
                >
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
                  <tr key={patient.id} onClick={() => handleRowClick(patient)} className="patient-row">
                    <td className="patient-code">{patient.patientCode}</td>
                    <td className="patient-name">{patient.fullName}</td>
                    <td>{calculateAge(patient.dateOfBirth)}</td>
                    <td>{patient.gender}</td>
                    <td>{patient.phone}</td>
                    <td className="address-cell">{patient.address}</td>
                    <td>{patient.bloodType}</td>
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
                          handleDelete(patient.id)
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
          </div>
        </div>

        {/* Patient Detail Modal */}
        {showModal && selectedPatient && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="medical-record-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <button className="close-btn" onClick={closeModal}>
                  ×
                </button>
                <h3>🏥 HỒ SƠ BỆNH NHÂN</h3>
                <p>Mã bệnh nhân: {selectedPatient.patientCode}</p>
              </div>

              <div className="modal-content">
                <div className="patient-info-section">
                  <h4>📋 THÔNG TIN CHI TIẾT</h4>

                  <div className="info-grid">
                    <div className="info-row">
                      <span className="info-label">Họ và tên:</span>
                      <span className="info-value">{selectedPatient.fullName}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Mã bệnh nhân:</span>
                      <span className="info-value">{selectedPatient.patientCode}</span>
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
                      <span className="info-value">{selectedPatient.email || "Chưa có"}</span>
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
                    <div className="info-row">
                      <span className="info-label">Người liên hệ khẩn cấp:</span>
                      <span className="info-value">{selectedPatient.emergencyContactName}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">SĐT người liên hệ:</span>
                      <span className="info-value">{selectedPatient.emergencyContactPhone}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Dị ứng:</span>
                      <span className="info-value">{selectedPatient.allergies || "Không có"}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Tiền sử bệnh:</span>
                      <span className="info-value">{selectedPatient.medicalHistory || "Không có"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default PatientForm
