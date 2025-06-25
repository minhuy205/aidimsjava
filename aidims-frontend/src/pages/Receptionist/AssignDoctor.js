"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "../Layout/Layout"
import { patientService } from "../../services/patientService"
import { assignmentService } from "../../services/assignmentService"
import '../../css/assignDoctor.css'

const AssignDoctor = () => {
  const navigate = useNavigate()
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
    // Lấy danh sách bệnh nhân từ API (tạo/cập nhật hồ sơ)
    patientService.getAllPatients()
      .then((data) => setPatients(data))
      .catch(() => setPatients([]))

    // Lấy danh sách bác sĩ tất cả (nếu cần hiển thị mặc định)
    assignmentService.getAllDoctors()
      .then((data) => setDoctors(data))
      .catch(() => setDoctors([]))

    // Initialize specialties (có thể lấy từ backend nếu backend có bảng chuyên khoa)
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

    // Lấy lịch sử chuyển hồ sơ từ backend
    assignmentService.getAllAssignments()
      .then((data) => setAssignments(data))
      .catch(() => setAssignments([]))
  }, [])

  // Khi chọn chuyên khoa, gọi backend để lấy danh sách bác sĩ theo chuyên khoa
  useEffect(() => {
    if (selectedSpecialty) {
      const specialty = specialties.find((s) => s.id === Number.parseInt(selectedSpecialty))
      if (specialty) {
        assignmentService.getDoctorsByDepartment(specialty.name)
          .then((data) => setDoctors(data))
          .catch(() => setDoctors([]))
        setSelectedDoctor("")
      }
    } else {
      // Nếu bỏ chọn chuyên khoa, lấy lại toàn bộ bác sĩ
      assignmentService.getAllDoctors()
        .then((data) => setDoctors(data))
        .catch(() => setDoctors([]))
      setSelectedDoctor("")
    }
  }, [selectedSpecialty, specialties])

  // Lọc bác sĩ theo chuyên khoa (dựa vào trường department của bác sĩ backend)
  const filteredDoctors = selectedSpecialty
    ? doctors.filter((doctor) => {
        const specialty = specialties.find((s) => s.id === Number.parseInt(selectedSpecialty))
        return doctor.department === (specialty ? specialty.name : "")
      })
    : doctors

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedPatient || !selectedDoctor) {
      alert("Vui lòng chọn đầy đủ thông tin bệnh nhân và bác sĩ")
      return
    }
    const doctor = doctors.find((d) => d.id === Number.parseInt(selectedDoctor))
    if (doctor && doctor.id >= 9999) {
      alert("Bạn đang chọn bác sĩ demo, vui lòng thêm bác sĩ thật vào hệ thống để lưu vào CSDL!")
      return
    }
    const patient = patients.find((p) => p.patient_id === Number.parseInt(selectedPatient));
    if (!patient) {
      alert("Không tìm thấy thông tin bệnh nhân!");
      return;
    }
    const specialty = specialties.find((s) => s.id === Number.parseInt(selectedSpecialty))

    const newAssignment = {
      id: Date.now(),
      patientId: Number.parseInt(selectedPatient),
      patientName: patient.full_name,
      patientCode: patient.patient_code,
      doctorId: Number.parseInt(selectedDoctor),
      doctorName: doctor.name,
      specialtyId: Number.parseInt(selectedSpecialty),
      specialtyName: specialty ? specialty.name : doctor.department,
      priority,
      notes,
      assignedDate: new Date().toISOString(),
      status: "Đã chuyển",
      assignedBy: "Nhân viên tiếp nhận",
    }

    // Gọi API backend để lưu vào CSDL
    try {
      await assignmentService.createAssignment({
        patientId: Number(newAssignment.patientId),
        doctorId: Number(newAssignment.doctorId),
        department: doctor.department // lấy đúng chuyên khoa từ backend
      });
      // Sau khi lưu thành công, lấy lại lịch sử từ backend
      const updatedAssignments = await assignmentService.getAllAssignments();
      setAssignments(updatedAssignments);
    } catch (error) {
      // Log chi tiết lỗi trả về từ backend
      if (error instanceof Error) {
        alert("Lỗi khi lưu chuyển hồ sơ vào CSDL!\n" + error.message);
      } else {
        alert("Lỗi khi lưu chuyển hồ sơ vào CSDL!");
      }
      return;
    }

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
                    <option key={patient.patient_id} value={patient.patient_id}>
                      {patient.patient_code} - {patient.full_name} - {patient.phone}
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
                    setSelectedDoctor("")
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
                      {doctor.name} - {doctor.department}
                    </option>
                  ))}
                </select>
              </div>

              {selectedDoctor && (
                <div className="doctor-info">
                  {(() => {
                    const doctor = doctors.find((d) => d.id === Number.parseInt(selectedDoctor))
                    return doctor ? (
                      <div className="doctor-card">
                        <h4>👨‍⚕️ Thông tin bác sĩ</h4>
                        <div className="doctor-details">
                          <p><strong>Tên:</strong> {doctor.name}</p>
                          <p><strong>Chuyên khoa:</strong> {doctor.department}</p>
                          <p><strong>Số điện thoại:</strong> {doctor.phone}</p>
                          <p><strong>Email:</strong> {doctor.email}</p>
                          <p><strong>Kinh nghiệm:</strong> {doctor.experience}</p>
                          <p><strong>Tình trạng:</strong> {doctor.status}</p>
                        </div>
                      </div>
                    ) : null
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
                    <td>{assignment.patient?.patient_code || ''}</td>
                    <td>{assignment.patient?.full_name || ''}</td>
                    <td>{assignment.doctor?.name || ''}</td>
                    <td>{assignment.department || assignment.doctor?.department || ''}</td>
                    <td>
                      <span className="priority-badge" style={{ backgroundColor: getPriorityColor(assignment.priority) }}>
                        {assignment.priority || 'Bình thường'}
                      </span>
                    </td>
                    <td>{assignment.assignedAt ? new Date(assignment.assignedAt).toLocaleDateString("vi-VN") : ''}</td>
                    <td>
                      <span className="status-badge">{assignment.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

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

export default AssignDoctor