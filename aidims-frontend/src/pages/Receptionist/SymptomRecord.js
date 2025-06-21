"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "../Layout/Layout"
import { patientService } from "../../services/patientService"
import { symptomService } from "../../services/symptomService"
import "../../css/symptomRecord.css"

const SymptomRecord = () => {
  const navigate = useNavigate()

  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState("")
  const [selectedPatientData, setSelectedPatientData] = useState(null)
  const [symptoms, setSymptoms] = useState([])
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [customSymptom, setCustomSymptom] = useState("")
  const [chiefComplaint, setChiefComplaint] = useState("")
  const [severityLevel, setSeverityLevel] = useState("Trung bình")
  const [onsetTime, setOnsetTime] = useState("")
  const [duration, setDuration] = useState("")
  const [painScale, setPainScale] = useState("")
  const [additionalNotes, setAdditionalNotes] = useState("")
  const [priorityLevel, setPriorityLevel] = useState("Bình thường")
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Helper function để parse text
  const extractFromText = (text, key) => {
    if (!text || !text.includes(key)) return ""
    const lines = text.split("\n")
    for (const line of lines) {
      if (line.startsWith(key)) {
        return line.replace(key, "").trim()
      }
    }
    return ""
  }

  // Load data on component mount
  useEffect(() => {
    const loadAll = async () => {
      await loadPatients()
      await loadSymptomRecords() // Load ngay lập tức
      initializeSymptoms()
    }
    loadAll()
  }, [])

  const loadPatients = async () => {
    try {
      const data = await patientService.getAllPatients()
      console.log("Loaded patients for symptoms:", data)
      setPatients(data)
    } catch (error) {
      console.error("Error loading patients:", error)
      setPatients([])
    }
  }

  const loadSymptomRecords = async () => {
    try {
      setLoading(true)
      console.log("🔍 Loading symptom records...")

      // Backend đã trả về dữ liệu kèm thông tin bệnh nhân
      const data = await symptomService.getAllSymptoms()
      console.log("📊 Raw symptom data received:", data)
      console.log("📊 Number of records:", data.length)

      // Không cần map thêm vì backend đã trả về đầy đủ thông tin
      const mappedRecords = data.map((record) => ({
        id: record.id,
        patient_id: record.patient_id,
        patient_code: record.patient_code || `BN${record.patient_id}`,
        patient_name: record.patient_name || "Không xác định",
        patient_phone: record.patient_phone || "N/A",
        patient_gender: record.patient_gender || record.gender || "N/A",
        patient_age: record.patient_age || record.age || "N/A",
        main_symptom: record.main_symptom || "Chưa có thông tin",
        detailed_symptoms: record.detailed_symptoms || "Chưa xác định",
        other_symptoms: record.other_symptoms || "Bình thường",
        created_at: record.created_at,
        // Parse detailed_symptoms để lấy thông tin chi tiết
        severity_level: extractFromText(record.detailed_symptoms, "Severity:") || "Chưa xác định",
        priority_level: extractFromText(record.other_symptoms, "Priority:") || "Bình thường",
        onset_time: extractFromText(record.detailed_symptoms, "Onset:") || "",
        duration: extractFromText(record.detailed_symptoms, "Duration:") || "",
        pain_scale: extractFromText(record.detailed_symptoms, "Pain Scale:") || "",
        additional_notes: extractFromText(record.other_symptoms, "Additional Notes:") || "",
        recorded_by: extractFromText(record.other_symptoms, "Recorded By:") || "",
        status: "Đã ghi nhận",
      }))

      console.log("✅ Final mapped records:", mappedRecords)
      setRecords(mappedRecords)
    } catch (error) {
      console.error("❌ Error loading symptom records:", error)
      setRecords([])
    } finally {
      setLoading(false)
    }
  }

  const initializeSymptoms = () => {
    // Initialize symptoms by specialty
    const symptomsBySpecialty = {
      "Tim mạch": [
        { code: "TM01", name: "Đau ngực", description: "Cảm giác đau, tức ngực" },
        { code: "TM02", name: "Khó thở", description: "Khó thở, thở gấp" },
        { code: "TM03", name: "Hồi hộp", description: "Tim đập nhanh, hồi hộp" },
        { code: "TM04", name: "Phù chân", description: "Sưng phù vùng chân" },
      ],
      "Hô hấp": [
        { code: "HH01", name: "Ho khan", description: "Ho không có đờm" },
        { code: "HH02", name: "Ho có đờm", description: "Ho kèm đờm" },
        { code: "HH03", name: "Thở khò khè", description: "Thở có tiếng khò khè" },
        { code: "HH04", name: "Thở gấp", description: "Nhịp thở nhanh, khó thở" },
      ],
      "Tiêu hóa": [
        { code: "TH01", name: "Đau bụng", description: "Đau vùng bụng" },
        { code: "TH02", name: "Buồn nôn", description: "Cảm giác buồn nôn" },
        { code: "TH03", name: "Tiêu chảy", description: "Đi ngoài lỏng nhiều lần" },
        { code: "TH04", name: "Táo bón", description: "Khó đi ngoài, đại tiện cứng" },
      ],
      "Thần kinh": [
        { code: "TK01", name: "Đau đầu", description: "Cảm giác đau đầu" },
        { code: "TK02", name: "Chóng mặt", description: "Cảm giác chóng mặt, choáng váng" },
        { code: "TK03", name: "Tê liệt", description: "Mất cảm giác, không cử động được" },
        { code: "TK04", name: "Co giật", description: "Cơn co giật không kiểm soát" },
      ],
      "Cơ xương khớp": [
        { code: "CXK01", name: "Đau khớp", description: "Đau vùng khớp" },
        { code: "CXK02", name: "Sưng khớp", description: "Khớp bị sưng" },
        { code: "CXK03", name: "Cứng khớp", description: "Khớp bị cứng, khó cử động" },
        { code: "CXK04", name: "Yếu cơ", description: "Cơ bắp yếu, mất sức" },
      ],
    }

    // Flatten all symptoms
    const allSymptoms = Object.values(symptomsBySpecialty).flat()
    setSymptoms(allSymptoms)
  }

  const handlePatientChange = (e) => {
    const patientId = e.target.value
    setSelectedPatient(patientId)

    if (patientId) {
      const patient = patients.find((p) => p.patient_id === Number.parseInt(patientId))
      setSelectedPatientData(patient)
      console.log("Selected patient:", patient)
    } else {
      setSelectedPatientData(null)
    }
  }

  const handleSymptomToggle = (symptom) => {
    setSelectedSymptoms((prev) => {
      const exists = prev.find((s) => s.code === symptom.code)
      if (exists) {
        return prev.filter((s) => s.code !== symptom.code)
      } else {
        return [...prev, symptom]
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!selectedPatient) {
        alert("Vui lòng chọn bệnh nhân")
        return
      }

      if (!chiefComplaint.trim()) {
        alert("Vui lòng nhập triệu chứng chính")
        return
      }

      const symptomData = {
        patient_id: Number.parseInt(selectedPatient),
        chief_complaint: chiefComplaint,
        selected_symptoms: JSON.stringify(selectedSymptoms),
        custom_symptoms: customSymptom,
        severity_level: severityLevel,
        onset_time: onsetTime,
        duration: duration,
        pain_scale: painScale ? Number.parseInt(painScale) : null,
        additional_notes: additionalNotes,
        recorded_by: "Huy - Nhân viên tiếp nhận",
        priority_level: priorityLevel,
      }

      console.log("Submitting symptom data:", symptomData)

      const result = await symptomService.createSymptomRecord(symptomData)
      console.log("✅ Symptom created successfully:", result)

      // Reset form trước
      resetForm()

      // Reload records sau khi tạo thành công
      await loadSymptomRecords()

      alert("Đã ghi nhận triệu chứng thành công!")
    } catch (error) {
      console.error("Error saving symptom record:", error)
      alert("Có lỗi xảy ra khi lưu thông tin triệu chứng: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSelectedPatient("")
    setSelectedPatientData(null)
    setSelectedSymptoms([])
    setCustomSymptom("")
    setChiefComplaint("")
    setSeverityLevel("Trung bình")
    setOnsetTime("")
    setDuration("")
    setPainScale("")
    setAdditionalNotes("")
    setPriorityLevel("Bình thường")
  }

  const handleViewDetail = (record) => {
    console.log("👁️ Viewing detail for record:", record)
    setSelectedRecord(record)
    setShowDetailModal(true)
  }

  const closeDetailModal = () => {
    setShowDetailModal(false)
    setSelectedRecord(null)
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

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Nặng":
        return "#dc3545"
      case "Trung bình":
        return "#fd7e14"
      default:
        return "#28a745"
    }
  }

  return (
    <Layout>
      <div className="symptom-record-page">
        <div className="page-header">
          <h2>📝 Ghi nhận Triệu chứng</h2>
          <p>Tiếp nhận và ghi lại tình trạng sức khỏe ban đầu của bệnh nhân</p>
        </div>

        <div className="symptom-form-container">
          <form onSubmit={handleSubmit} className="symptom-form">
            <div className="form-section">
              <h3>👤 Thông tin bệnh nhân</h3>
              <div className="form-group">
                <label>Chọn bệnh nhân: *</label>
                <select value={selectedPatient} onChange={handlePatientChange} required>
                  <option value="">-- Chọn bệnh nhân --</option>
                  {patients.map((patient) => (
                    <option key={patient.patient_id} value={patient.patient_id}>
                      {patient.patient_code} - {patient.full_name} - {patient.phone}
                    </option>
                  ))}
                </select>
              </div>

              {selectedPatientData && (
                <div className="patient-info-display">
                  <div className="patient-info-grid">
                    <div className="info-item">
                      <span className="info-label">Họ tên:</span>
                      <span className="info-value">{selectedPatientData.full_name}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Tuổi:</span>
                      <span className="info-value">{selectedPatientData.age || "N/A"}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Giới tính:</span>
                      <span className="info-value">{selectedPatientData.gender}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Nhóm máu:</span>
                      <span className="info-value">{selectedPatientData.blood_type || "Chưa xác định"}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="form-section">
              <h3>🩺 Triệu chứng chính</h3>
              <div className="form-group">
                <label>Mô tả triệu chứng chính: *</label>
                <textarea
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  rows="3"
                  placeholder="Mô tả chi tiết triệu chứng chính mà bệnh nhân than phiền..."
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Mức độ nghiêm trọng:</label>
                  <select value={severityLevel} onChange={(e) => setSeverityLevel(e.target.value)}>
                    <option value="Nhẹ">Nhẹ</option>
                    <option value="Trung bình">Trung bình</option>
                    <option value="Nặng">Nặng</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Mức độ ưu tiên:</label>
                  <select value={priorityLevel} onChange={(e) => setPriorityLevel(e.target.value)}>
                    <option value="Bình thường">Bình thường</option>
                    <option value="Ưu tiên">Ưu tiên</option>
                    <option value="Khẩn cấp">Khẩn cấp</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Thời gian khởi phát:</label>
                  <select value={onsetTime} onChange={(e) => setOnsetTime(e.target.value)}>
                    <option value="">-- Chọn thời gian --</option>
                    <option value="Đột ngột">Đột ngột</option>
                    <option value="Từ từ">Từ từ</option>
                    <option value="Không rõ">Không rõ</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Thời gian kéo dài:</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="VD: 2 giờ, 1 ngày, 1 tuần..."
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Thang điểm đau (0-10):</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={painScale}
                  onChange={(e) => setPainScale(e.target.value)}
                  placeholder="0 = không đau, 10 = đau không chịu được"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>📋 Triệu chứng cụ thể</h3>
              <div className="symptoms-grid">
                {symptoms.map((symptom) => (
                  <div
                    key={symptom.code}
                    className={`symptom-card ${
                      selectedSymptoms.find((s) => s.code === symptom.code) ? "selected" : ""
                    }`}
                    onClick={() => handleSymptomToggle(symptom)}
                  >
                    <div className="symptom-name">{symptom.name}</div>
                    <div className="symptom-description">{symptom.description}</div>
                    <div className="symptom-code">{symptom.code}</div>
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label>Triệu chứng khác (nếu có):</label>
                <textarea
                  value={customSymptom}
                  onChange={(e) => setCustomSymptom(e.target.value)}
                  rows="2"
                  placeholder="Ghi rõ các triệu chứng khác không có trong danh sách..."
                />
              </div>
            </div>

            <div className="form-section">
              <h3>📄 Ghi chú bổ sung</h3>
              <div className="form-group">
                <label>Ghi chú thêm:</label>
                <textarea
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  rows="3"
                  placeholder="Thông tin bổ sung về tình trạng bệnh nhân..."
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Đang lưu..." : "💾 Lưu thông tin triệu chứng"}
              </button>
              <button type="button" className="btn-secondary" onClick={resetForm}>
                🔄 Làm mới
              </button>
            </div>
          </form>
        </div>

        <div className="records-section">
          <h3>📋 Lịch sử ghi nhận triệu chứng ({records.length})</h3>
          <div className="records-table-container">
            {loading ? (
              <div className="loading-message">🔄 Đang tải dữ liệu...</div>
            ) : records.length === 0 ? (
              <div className="empty-message">📝 Chưa có ghi nhận triệu chứng nào</div>
            ) : (
              <table className="records-table">
                <thead>
                  <tr>
                    <th>Mã BN</th>
                    <th>Tên bệnh nhân</th>
                    <th>Triệu chứng chính</th>
                    <th>Mức độ</th>
                    <th>Ưu tiên</th>
                    <th>Ngày ghi nhận</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, index) => (
                    <tr key={record.id || index}>
                      <td>{record.patient_code}</td>
                      <td>{record.patient_name}</td>
                      <td className="chief-complaint-cell">{record.main_symptom}</td>
                      <td>
                        <span
                          className="severity-badge"
                          style={{ backgroundColor: getSeverityColor(record.severity_level) }}
                        >
                          {record.severity_level}
                        </span>
                      </td>
                      <td>
                        <span
                          className="priority-badge"
                          style={{ backgroundColor: getPriorityColor(record.priority_level) }}
                        >
                          {record.priority_level}
                        </span>
                      </td>
                      <td>
                        {record.created_at ? new Date(record.created_at).toLocaleDateString("vi-VN") : "Chưa xác định"}
                      </td>
                      <td>
                        <span className="status-badge">{record.status}</span>
                      </td>
                      <td>
                        <button className="btn-view" title="Xem chi tiết" onClick={() => handleViewDetail(record)}>
                          👁️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedRecord && (
          <div className="modal-overlay" onClick={closeDetailModal}>
            <div className="symptom-detail-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <button className="close-btn" onClick={closeDetailModal}>
                  ×
                </button>
                <h3>📝 CHI TIẾT TRIỆU CHỨNG</h3>
                <p>Mã bệnh nhân: {selectedRecord.patient_code}</p>
              </div>

              <div className="modal-content">
                <div className="detail-section">
                  <h4>👤 Thông tin bệnh nhân</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Tên bệnh nhân:</span>
                      <span className="detail-value">{selectedRecord.patient_name}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Mã bệnh nhân:</span>
                      <span className="detail-value">{selectedRecord.patient_code}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Số điện thoại:</span>
                      <span className="detail-value">{selectedRecord.patient_phone}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Tuổi/Giới tính:</span>
                      <span className="detail-value">
                        {selectedRecord.patient_age} tuổi - {selectedRecord.patient_gender}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>🩺 Thông tin triệu chứng</h4>
                  <div className="detail-grid">
                    <div className="detail-item full-width">
                      <span className="detail-label">Triệu chứng chính:</span>
                      <span className="detail-value">{selectedRecord.main_symptom}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Mức độ nghiêm trọng:</span>
                      <span
                        className="detail-value severity-badge"
                        style={{ backgroundColor: getSeverityColor(selectedRecord.severity_level) }}
                      >
                        {selectedRecord.severity_level}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Mức độ ưu tiên:</span>
                      <span
                        className="detail-value priority-badge"
                        style={{ backgroundColor: getPriorityColor(selectedRecord.priority_level) }}
                      >
                        {selectedRecord.priority_level}
                      </span>
                    </div>
                    {selectedRecord.onset_time && (
                      <div className="detail-item">
                        <span className="detail-label">Thời gian khởi phát:</span>
                        <span className="detail-value">{selectedRecord.onset_time}</span>
                      </div>
                    )}
                    {selectedRecord.duration && (
                      <div className="detail-item">
                        <span className="detail-label">Thời gian kéo dài:</span>
                        <span className="detail-value">{selectedRecord.duration}</span>
                      </div>
                    )}
                    {selectedRecord.pain_scale && (
                      <div className="detail-item">
                        <span className="detail-label">Thang điểm đau:</span>
                        <span className="detail-value">{selectedRecord.pain_scale}/10</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedRecord.additional_notes && (
                  <div className="detail-section">
                    <h4>📄 Ghi chú bổ sung</h4>
                    <p className="additional-notes">{selectedRecord.additional_notes}</p>
                  </div>
                )}

                <div className="detail-section">
                  <h4>ℹ️ Thông tin ghi nhận</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Người ghi nhận:</span>
                      <span className="detail-value">{selectedRecord.recorded_by}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Thời gian:</span>
                      <span className="detail-value">
                        {new Date(selectedRecord.created_at).toLocaleString("vi-VN")}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Trạng thái:</span>
                      <span className="detail-value status-badge">{selectedRecord.status}</span>
                    </div>
                  </div>
                </div>
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

export default SymptomRecord
