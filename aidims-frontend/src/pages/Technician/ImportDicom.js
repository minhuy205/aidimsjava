"use client"

import { useState, useEffect } from "react"
import Layout from "../Layout/Layout"
import "../../css/importDicom.css"
import { importDicom } from "../../services/ImportDicomService"
import { patientService } from "../../services/patientService"
import { requestPhotoService } from "../../services/requestPhotoService"

const DEFAULT_BODY_PARTS = [
  "Ngực", "Bụng", "Đầu", "Cột sống", "Tứ chi", "Xương khớp", "Khung chậu", "Tim mạch", "Phổi", "Gan", "Thận", "Tuyến giáp", "Vú", "Mạch máu", "Cơ xương", "Khác"
]

const ImportDicom = () => {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [patientId, setPatientId] = useState("")
  const [studyType, setStudyType] = useState("")
  const [bodyPart, setBodyPart] = useState("")
  const [technicalParams, setTechnicalParams] = useState({
    kVp: "",
    mAs: "",
    sliceThickness: "",
    contrast: false,
  })
  const [notes, setNotes] = useState("")
  const [recentImports, setRecentImports] = useState([])
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState("")
  const [bodyPartOptions, setBodyPartOptions] = useState([])

  useEffect(() => {
    // Lấy danh sách bệnh nhân từ backend
    patientService.getAllPatients()
      .then((data) => setPatients(data))
      .catch(() => setPatients([]))
    // Lấy lịch sử import từ localStorage (nếu có)
    const saved = localStorage.getItem("dicomImports")
    if (saved) {
      setRecentImports(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    // Lấy danh sách vị trí chụp từ các yêu cầu chụp của bệnh nhân đã chọn
    if (selectedPatient) {
      requestPhotoService.getRequestsByPatientId(selectedPatient)
        .then((requests) => {
          const allBodyParts = requests
            .map((req) => req.bodyPart)
            .filter((v) => v && v.trim() !== "")
          // Gộp với danh sách mặc định, loại trùng
          setBodyPartOptions([...new Set([...allBodyParts, ...DEFAULT_BODY_PARTS])])
        })
        .catch(() => setBodyPartOptions(DEFAULT_BODY_PARTS))
    } else {
      setBodyPartOptions(DEFAULT_BODY_PARTS)
    }
  }, [selectedPatient])

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    const fileObjects = files.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
    }))
    setSelectedFiles([...selectedFiles, ...fileObjects])
  }

  const handleTechnicalParamChange = (e) => {
    const { name, value, type, checked } = e.target
    setTechnicalParams({
      ...technicalParams,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (selectedFiles.length === 0) return alert("Vui lòng chọn file DICOM")
    if (!selectedPatient || !studyType || !bodyPart) return alert("Vui lòng nhập đầy đủ thông tin")
    const patient = patients.find((p) => p.patient_id === Number.parseInt(selectedPatient))
    const metadata = {
      patientCode: patient ? patient.patient_code : selectedPatient,
      studyType: studyType,
      bodyPart: bodyPart,
      technicalParams: technicalParams,
      notes: notes,
      dicomFileName: selectedFiles[0]?.name || "unknown.dcm",
      performedBy: 7
    }
    const formData = new FormData()
    formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }))
    // Gửi file đầu tiên (hoặc có thể gửi nhiều file nếu backend hỗ trợ)
    formData.append("file", selectedFiles[0].file, selectedFiles[0].name)

    try {
      const msg = await importDicom(formData)
      alert(msg)
      const importRecord = {
        ...metadata,
        fileName: metadata.dicomFileName,
        importDate: new Date().toLocaleString("vi-VN"),
        status: "Thành công",
        fileSize: `${(selectedFiles.reduce((t, f) => t + f.size, 0) / 1024 / 1024).toFixed(1)} MB`
      }
      const updated = [importRecord, ...recentImports]
      setRecentImports(updated)
      localStorage.setItem("dicomImports", JSON.stringify(updated))
      setSelectedFiles([])
      setPatientId("")
      setStudyType("")
      setBodyPart("")
      setTechnicalParams({ kVp: "", mAs: "", sliceThickness: "", contrast: false })
      setNotes("")
    } catch (err) {
      console.error(err)
      alert("Lỗi khi import: " + err.message)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Layout>
      <div className="import-dicom-page">
        <h2>📄 Nhập File DICOM</h2>

        <form onSubmit={handleSubmit}>
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

          <div className="form-group">
            <label>Loại chụp: *</label>
            <select value={studyType} onChange={(e) => setStudyType(e.target.value)} required>
              <option value="">-- Chọn loại chụp --</option>
              <option value="X-quang thường">X-quang thường</option>
              <option value="CT Scanner">CT cắt lớp vi tính (CT)</option>
              <option value="MRI">Cộng hưởng từ (MRI)</option>
              <option value="Siêu âm">Siêu âm</option>
              <option value="Mammography">Nhũ ảnh (Mammography)</option>
              <option value="Fluoroscopy">Chụp huỳnh quang (Fluoroscopy)</option>
              <option value="PET-CT">Chụp PET-CT</option>
              <option value="SPECT">Chụp SPECT</option>
            </select>
          </div>

          <div className="form-group">
            <label>Vùng chụp: *</label>
            <select value={bodyPart} onChange={(e) => setBodyPart(e.target.value)} required>
              <option value="">-- Chọn vùng chụp --</option>
              {bodyPartOptions.map((part, idx) => (
                <option key={idx} value={part}>{part}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Điện thế (kVp):</label>
            <input type="number" name="kVp" value={technicalParams.kVp} onChange={handleTechnicalParamChange} />
          </div>

          <div className="form-group">
            <label>Dòng điện (mAs):</label>
            <input type="number" name="mAs" value={technicalParams.mAs} onChange={handleTechnicalParamChange} />
          </div>

          <div className="form-group">
            <label>Độ dày lát cắt (mm):</label>
            <input type="number" name="sliceThickness" value={technicalParams.sliceThickness} onChange={handleTechnicalParamChange} step="0.1" />
          </div>

          <div className="form-group">
            <label>
              <input type="checkbox" name="contrast" checked={technicalParams.contrast} onChange={handleTechnicalParamChange} />
              Dùng thuốc cản quang
            </label>
          </div>

          <div className="form-group">
            <label>Ghi chú:</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Chọn file hình ảnh (DICOM, JPEG, PNG):</label>
            <input type="file" multiple accept=".dcm,.dicom,image/jpeg,image/png,image/jpg" onChange={handleFileSelect} />
          </div>

          <button type="submit">📅 Nhập file DICOM</button>
        </form>

        <hr />
        <h3>📋 Lịch sử import gần đây</h3>
        <ul>
          {recentImports.map((item, idx) => (
            <li key={idx}>
              {item.fileName} - {item.patientCode} - {item.studyType} - {item.bodyPart} ({item.fileSize}) [{item.importDate}]
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  ) 
}

export default ImportDicom