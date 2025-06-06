"use client"

import { useState, useEffect } from "react"
import Layout from "../Layout/Layout"
import "../../css/symptomRecord.css"

const SymptomRecord = () => {
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState("")
  const [symptoms, setSymptoms] = useState([])
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [customSymptom, setCustomSymptom] = useState("")
  const [chiefComplaint, setChiefComplaint] = useState("")
  const [vitalSigns, setVitalSigns] = useState({
    temperature: "",
    bloodPressure: "",
    heartRate: "",
    respiratoryRate: "",
    oxygenSaturation: "",
  })
  const [records, setRecords] = useState([])

  // Load data on component mount
  useEffect(() => {
    // Load patients from localStorage
    const savedPatients = localStorage.getItem("patients")
    if (savedPatients) {
      setPatients(JSON.parse(savedPatients))
    }

    // Load symptom records
    const savedRecords = localStorage.getItem("symptomRecords")
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords))
    }

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
  }, [])

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

  const handleVitalSignChange = (e) => {
    setVitalSigns({
      ...vitalSigns,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!selectedPatient) {
      alert("Vui lòng chọn bệnh nhân")
      return
    }

    if (!chiefComplaint.trim()) {
      alert("Vui lòng nhập triệu chứng chính")
      return
    }

    const patient = patients.find((p) => p.id === Number.parseInt(selectedPatient))
    const newRecord = {
      id: Date.now(),
      patientId: Number.parseInt(selectedPatient),
      patientName: patient.fullName,
      patientCode: patient.patientCode,
      chiefComplaint,
      symptoms: [...selectedSymptoms],
      customSymptom,
      vitalSigns,
      recordDate: new Date().toISOString(),
      status: "Đã ghi nhận",
    }

    const updatedRecords = [...records, newRecord]
    setRecords(updatedRecords)
    localStorage.setItem("symptomRecords", JSON.stringify(updatedRecords))

    // Reset form
    setSelectedPatient("")
    setSelectedSymptoms([])
    setCustomSymptom("")
    setChiefComplaint("")
    setVitalSigns({
      temperature: "",
      bloodPressure: "",
      heartRate: "",
      respiratoryRate: "",
      oxygenSaturation: "",
    })

    alert("Đã ghi nhận triệu chứng thành công!")
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
              <h3>📊 Sinh hiệu</h3>
              <div className="vital-signs-grid">
                <div className="form-group">
                  <label>Nhiệt độ (°C):</label>
                  <input
                    type="number"
                    name="temperature"
                    value={vitalSigns.temperature}
                    onChange={handleVitalSignChange}
                    step="0.1"
                    placeholder="36.5"
                  />
                </div>
                <div className="form-group">
                  <label>Huyết áp (mmHg):</label>
                  <input
                    type="text"
                    name="bloodPressure"
                    value={vitalSigns.bloodPressure}
                    onChange={handleVitalSignChange}
                    placeholder="120/80"
                  />
                </div>
                <div className="form-group">
                  <label>Nhịp tim (lần/phút):</label>
                  <input
                    type="number"
                    name="heartRate"
                    value={vitalSigns.heartRate}
                    onChange={handleVitalSignChange}
                    placeholder="72"
                  />
                </div>
                <div className="form-group">
                  <label>Nhịp thở (lần/phút):</label>
                  <input
                    type="number"
                    name="respiratoryRate"
                    value={vitalSigns.respiratoryRate}
                    onChange={handleVitalSignChange}
                    placeholder="16"
                  />
                </div>
                <div className="form-group">
                  <label>SpO2 (%):</label>
                  <input
                    type="number"
                    name="oxygenSaturation"
                    value={vitalSigns.oxygenSaturation}
                    onChange={handleVitalSignChange}
                    placeholder="98"
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                💾 Lưu thông tin triệu chứng
              </button>
            </div>
          </form>
        </div>

        <div className="records-section">
          <h3>📋 Lịch sử ghi nhận triệu chứng</h3>
          <div className="records-table-container">
            <table className="records-table">
              <thead>
                <tr>
                  <th>Mã BN</th>
                  <th>Tên bệnh nhân</th>
                  <th>Triệu chứng chính</th>
                  <th>Ngày ghi nhận</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id}>
                    <td>{record.patientCode}</td>
                    <td>{record.patientName}</td>
                    <td className="chief-complaint-cell">{record.chiefComplaint}</td>
                    <td>{new Date(record.recordDate).toLocaleDateString("vi-VN")}</td>
                    <td>
                      <span className="status-badge">{record.status}</span>
                    </td>
                    <td>
                      <button className="btn-view" title="Xem chi tiết">
                        👁️
                      </button>
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

export default SymptomRecord
