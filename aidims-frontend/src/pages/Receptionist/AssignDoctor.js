"use client"

import { useState, useEffect } from "react"
import Layout from "../Layout/Layout"
import "../../css/assignDoctor.css"

const AssignDoctor = () => {
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [specialties, setSpecialties] = useState([])
  const [selectedPatient, setSelectedPatient] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [priority, setPriority] = useState("Bình thường")
  const [notes, setNotes] = useState("")
  const [assignments, setAssignments] = useState([])

  useEffect(() => {
    // Load patients
    const savedPatients = localStorage.getItem("patients")
    if (savedPatients) {
      setPatients(JSON.parse(savedPatients))
    }

    // Load assignments
    const savedAssignments = localStorage.getItem("doctorAssignments")
    if (savedAssignments) {
      setAssignments(JSON.parse(savedAssignments))
    }

    // Initialize specialties
    const mockSpecialties = [
      { id: 1, name: "Chẩn đoán hình ảnh", code: "CDHA" },
      { id: 2, name: "Tim mạch", code: "TM" },
      { id: 3, name: "Hô hấp", code: "HH" },
      { id: 4, name: "Tiêu hóa", code: "TH" },
      { id: 5, name: "Thần kinh", code: "TK" },
      { id: 6, name: "Cơ xương khớp", code: "CXK" },
      { id: 7, name: "Nội tổng hợp", code: "NTH" },
      { id: 8, name: "Ngoại tổng hợp", code: "NGH" },
      { id: 9, name: "Sản phụ khoa", code: "SPK" },
      { id: 10, name: "Nhi khoa", code: "NK" },
    ]
    setSpecialties(mockSpecialties)

    // Initialize doctors
    const mockDoctors = [
      {
        id: 1,
        name: "BS. Nguyễn Văn A",
        specialtyId: 1,
        specialtyName: "Chẩn đoán hình ảnh",
        phone: "0902345678",
        email: "nguyen@hospital.com",
        experience: "10 năm",
        status: "Đang làm việc",
      },
      {
        id: 2,
        name: "BS. Trần Thị B",
        specialtyId: 2,
        specialtyName: "Tim mạch",
        phone: "0903456789",
        email: "tran@hospital.com",
        experience: "8 năm",
        status: "Đang làm việc",
      },
      {
        id: 3,
        name: "BS. Lê Văn C",
        specialtyId: 3,
        specialtyName: "Hô hấp",
        phone: "0904567890",
        email: "le@hospital.com",
        experience: "12 năm",
        status: "Đang làm việc",
      },
      {
        id: 4,
        name: "BS. Phạm Thị D",
        specialtyId: 4,
        specialtyName: "Tiêu hóa",
        phone: "0905678901",
        email: "pham@hospital.com",
        experience: "6 năm",
        status: "Đang làm việc",
      },
      {
        id: 5,
        name: "BS. Hoàng Văn E",
        specialtyId: 5,
        specialtyName: "Thần kinh",
        phone: "0906789012",
        email: "hoang@hospital.com",
        experience: "15 năm",
        status: "Đang làm việc",
      },
    ]
    setDoctors(mockDoctors)
  }, [])

  const filteredDoctors = selectedSpecialty
    ? doctors.filter((doctor) => doctor.specialtyId === Number.parseInt(selectedSpecialty))
    : doctors

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!selectedPatient || !selectedDoctor) {
      alert("Vui lòng chọn đầy đủ thông tin bệnh nhân và bác sĩ")
      return
    }

    const patient = patients.find((p) => p.id === Number.parseInt(selectedPatient))
    const doctor = doctors.find((d) => d.id === Number.parseInt(selectedDoctor))
    const specialty = specialties.find((s) => s.id === Number.parseInt(selectedSpecialty))

    const newAssignment = {
      id: Date.now(),
      patientId: Number.parseInt(selectedPatient),
      patientName: patient.fullName,
      patientCode: patient.patientCode,
      doctorId: Number.parseInt(selectedDoctor),
      doctorName: doctor.name,
      specialtyId: Number.parseInt(selectedSpecialty),
      specialtyName: specialty.name,
      priority,
      notes,
      assignedDate: new Date().toISOString(),
      status: "Đã chuyển",
      assignedBy: "Nhân viên tiếp nhận", // In real app, get from current user
    }

    const updatedAssignments = [...assignments, newAssignment]
    setAssignments(updatedAssignments)
    localStorage.setItem("doctorAssignments", JSON.stringify(updatedAssignments))

    // Reset form
    setSelectedPatient("")
    setSelectedSpecialty("")
    setSelectedDoctor("")
    setPriority("Bình thường")
    setNotes("")

    alert("Đã chuyển hồ sơ bệnh nhân đến bác sĩ thành công!")
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
      <div className="assign-doctor-page">
        <div className="page-header">
          <h2>👨‍⚕️ Chuyển hồ sơ đến Bác sĩ</h2>
          <p>Phân công bác sĩ phù hợp dựa trên chuyên khoa và triệu chứng</p>
        </div>

        <div className="assign-form-container">
          <form onSubmit={handleSubmit} className="assign-form">
            <div className="form-section">
              <h3>👤 Thông tin bệnh nhân</h3>
              <div className="form-group">
                <label>Chọn bệnh nhân: *</label>
                <select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)} required>
                  <option value="">-- Chọn bệnh nhân --</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.patientCode} - {patient.fullName} - {patient.phone}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-section">
              <h3>🏥 Chuyên khoa</h3>
              <div className="form-group">
                <label>Chọn chuyên khoa: *</label>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => {
                    setSelectedSpecialty(e.target.value)
                    setSelectedDoctor("") // Reset doctor selection
                  }}
                  required
                >
                  <option value="">-- Chọn chuyên khoa --</option>
                  {specialties.map((specialty) => (
                    <option key={specialty.id} value={specialty.id}>
                      {specialty.name} ({specialty.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-section">
              <h3>👨‍⚕️ Bác sĩ</h3>
              <div className="form-group">
                <label>Chọn bác sĩ: *</label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  required
                  disabled={!selectedSpecialty}
                >
                  <option value="">-- Chọn bác sĩ --</option>
                  {filteredDoctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.experience} kinh nghiệm
                    </option>
                  ))}
                </select>
              </div>

              {selectedDoctor && (
                <div className="doctor-info">
                  {(() => {
                    const doctor = doctors.find((d) => d.id === Number.parseInt(selectedDoctor))
                    return (
                      <div className="doctor-card">
                        <h4>👨‍⚕️ Thông tin bác sĩ</h4>
                        <div className="doctor-details">
                          <p>
                            <strong>Tên:</strong> {doctor.name}
                          </p>
                          <p>
                            <strong>Chuyên khoa:</strong> {doctor.specialtyName}
                          </p>
                          <p>
                            <strong>Kinh nghiệm:</strong> {doctor.experience}
                          </p>
                          <p>
                            <strong>Điện thoại:</strong> {doctor.phone}
                          </p>
                          <p>
                            <strong>Email:</strong> {doctor.email}
                          </p>
                          <p>
                            <strong>Trạng thái:</strong> <span className="status-active">{doctor.status}</span>
                          </p>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              )}
            </div>

            <div className="form-section">
              <h3>⚡ Mức độ ưu tiên</h3>
              <div className="priority-options">
                {["Bình thường", "Ưu tiên", "Khẩn cấp"].map((level) => (
                  <label key={level} className="priority-option">
                    <input
                      type="radio"
                      name="priority"
                      value={level}
                      checked={priority === level}
                      onChange={(e) => setPriority(e.target.value)}
                    />
                    <span className="priority-label" style={{ color: getPriorityColor(level) }}>
                      {level}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h3>📝 Ghi chú</h3>
              <div className="form-group">
                <label>Ghi chú thêm:</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="3"
                  placeholder="Ghi chú thêm về tình trạng bệnh nhân hoặc yêu cầu đặc biệt..."
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                📤 Chuyển hồ sơ đến bác sĩ
              </button>
            </div>
          </form>
        </div>

        <div className="assignments-section">
          <h3>📋 Lịch sử chuyển hồ sơ</h3>
          <div className="assignments-table-container">
            <table className="assignments-table">
              <thead>
                <tr>
                  <th>Mã BN</th>
                  <th>Tên bệnh nhân</th>
                  <th>Bác sĩ</th>
                  <th>Chuyên khoa</th>
                  <th>Mức độ ưu tiên</th>
                  <th>Ngày chuyển</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment) => (
                  <tr key={assignment.id}>
                    <td>{assignment.patientCode}</td>
                    <td>{assignment.patientName}</td>
                    <td>{assignment.doctorName}</td>
                    <td>{assignment.specialtyName}</td>
                    <td>
                      <span
                        className="priority-badge"
                        style={{ backgroundColor: getPriorityColor(assignment.priority) }}
                      >
                        {assignment.priority}
                      </span>
                    </td>
                    <td>{new Date(assignment.assignedDate).toLocaleDateString("vi-VN")}</td>
                    <td>
                      <span className="status-badge">{assignment.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AssignDoctor
