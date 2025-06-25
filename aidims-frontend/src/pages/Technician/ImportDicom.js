// "use client"

// import { useState, useEffect } from "react"
// import Layout from "../Layout/Layout"
// import "../../css/importDicom.css"

// const ImportDicom = () => {
//   const [selectedFiles, setSelectedFiles] = useState([])
//   const [patientId, setPatientId] = useState("")
//   const [studyType, setStudyType] = useState("")
//   const [bodyPart, setBodyPart] = useState("")
//   const [technicalParams, setTechnicalParams] = useState({
//     kVp: "",
//     mAs: "",
//     sliceThickness: "",
//     contrast: false,
//   })
//   const [notes, setNotes] = useState("")
//   const [recentImports, setRecentImports] = useState([])

//   useEffect(() => {
//     // Load recent imports from localStorage
//     const savedImports = localStorage.getItem("dicomImports")
//     if (savedImports) {
//       setRecentImports(JSON.parse(savedImports))
//     } else {
//       // Sample data
//       const sampleImports = [
//         {
//           id: 1,
//           fileName: "CT_CHEST_001.dcm",
//           patientCode: "BN001",
//           studyType: "CT Scanner",
//           bodyPart: "Ngực",
//           importDate: "2024-12-15 14:30:00",
//           status: "Thành công",
//           fileSize: "25.6 MB",
//         },
//         {
//           id: 2,
//           fileName: "XRAY_KNEE_002.dcm",
//           patientCode: "BN002",
//           studyType: "X-quang thường",
//           bodyPart: "Khớp gối",
//           importDate: "2024-12-15 15:45:00",
//           status: "Thành công",
//           fileSize: "8.2 MB",
//         },
//       ]
//       setRecentImports(sampleImports)
//       localStorage.setItem("dicomImports", JSON.stringify(sampleImports))
//     }
//   }, [])

//   const handleFileSelect = (e) => {
//     const files = Array.from(e.target.files)
//     const fileObjects = files.map((file) => ({
//       id: Date.now() + Math.random(),
//       file,
//       name: file.name,
//       size: file.size,
//       type: file.type,
//     }))
//     setSelectedFiles([...selectedFiles, ...fileObjects])
//   }

//   const handleRemoveFile = (fileId) => {
//     setSelectedFiles(selectedFiles.filter((f) => f.id !== fileId))
//   }

//   const handleTechnicalParamChange = (e) => {
//     const { name, value, type, checked } = e.target
//     setTechnicalParams({
//       ...technicalParams,
//       [name]: type === "checkbox" ? checked : value,
//     })
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()

//     if (selectedFiles.length === 0) {
//       alert("Vui lòng chọn ít nhất một file DICOM")
//       return
//     }

//     if (!patientId || !studyType || !bodyPart) {
//       alert("Vui lòng điền đầy đủ thông tin bắt buộc")
//       return
//     }

//     // Create new import record
//     const newImport = {
//       id: Date.now(),
//       fileName: selectedFiles.map((f) => f.name).join(", "),
//       patientCode: patientId,
//       studyType,
//       bodyPart,
//       importDate: new Date().toLocaleString("vi-VN"),
//       status: "Thành công",
//       fileSize: `${(selectedFiles.reduce((total, f) => total + f.size, 0) / (1024 * 1024)).toFixed(1)} MB`,
//       technicalParams,
//       notes,
//     }

//     const updatedImports = [newImport, ...recentImports]
//     setRecentImports(updatedImports)
//     localStorage.setItem("dicomImports", JSON.stringify(updatedImports))

//     // Reset form
//     setSelectedFiles([])
//     setPatientId("")
//     setStudyType("")
//     setBodyPart("")
//     setTechnicalParams({
//       kVp: "",
//       mAs: "",
//       sliceThickness: "",
//       contrast: false,
//     })
//     setNotes("")

//     alert("Đã import file DICOM thành công!")
//   }

//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return "0 Bytes"
//     const k = 1024
//     const sizes = ["Bytes", "KB", "MB", "GB"]
//     const i = Math.floor(Math.log(bytes) / Math.log(k))
//     return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
//   }

//   return (
//     <Layout>
//       <div className="import-dicom-page">
//         <div className="page-header">
//           <h2>📤 Import File DICOM</h2>
//           <p>Nhập và quản lý file hình ảnh y tế từ các thiết bị chụp</p>
//         </div>

//         <div className="upload-container">
//           <h3>📁 Chọn file DICOM</h3>

//           <div
//             className="upload-area"
//             onClick={() => document.getElementById("fileInput").click()}
//             onDrop={(e) => {
//               e.preventDefault()
//               handleFileSelect(e)
//             }}
//             onDragOver={(e) => e.preventDefault()}
//           >
//             <div className="upload-icon">📁</div>
//             <div className="upload-text">Kéo thả file hoặc click để chọn</div>
//             <div className="upload-subtext">Hỗ trợ file .dcm, .dicom (tối đa 100MB mỗi file)</div>
//           </div>

//           <input
//             id="fileInput"
//             type="file"
//             multiple
//             accept=".dcm,.dicom"
//             onChange={handleFileSelect}
//             className="upload-input"
//           />

//           {selectedFiles.length > 0 && (
//             <div className="file-list">
//               <h4>📋 File đã chọn ({selectedFiles.length})</h4>
//               {selectedFiles.map((file) => (
//                 <div key={file.id} className="file-item">
//                   <div className="file-icon">📄</div>
//                   <div className="file-info">
//                     <div className="file-name">{file.name}</div>
//                     <div className="file-meta">{formatFileSize(file.size)}</div>
//                   </div>
//                   <div className="file-actions">
//                     <button className="btn-remove" onClick={() => handleRemoveFile(file.id)}>
//                       🗑️
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           <form onSubmit={handleSubmit}>
//             <div className="form-section">
//               <h4>📋 Thông tin nghiên cứu</h4>
//               <div className="form-row">
//                 <div className="form-group">
//                   <label>Mã bệnh nhân: *</label>
//                   <input
//                     type="text"
//                     value={patientId}
//                     onChange={(e) => setPatientId(e.target.value)}
//                     placeholder="VD: BN001"
//                     required
//                   />
//                 </div>
                // <div className="form-group">
                //   <label>Loại chụp: *</label>
                //   <select value={studyType} onChange={(e) => setStudyType(e.target.value)} required>
                //     <option value="">-- Chọn loại chụp --</option>
                //     <option value="X-quang thường">X-quang thường</option>
                //     <option value="CT Scanner">CT Scanner</option>
                //     <option value="MRI">MRI</option>
                //     <option value="Siêu âm">Siêu âm</option>
                //     <option value="Mammography">Mammography</option>
                //   </select>
                // </div>
//               </div>
//               <div className="form-row">
//                 <div className="form-group">
//                   <label>Vùng chụp: *</label>
//                   <input
//                     type="text"
//                     value={bodyPart}
//                     onChange={(e) => setBodyPart(e.target.value)}
//                     placeholder="VD: Ngực, Bụng, Đầu..."
//                     required
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="form-section">
//               <h4>⚙️ Thông số kỹ thuật</h4>
//               <div className="form-row">
//                 <div className="form-group">
//                   <label>kVp:</label>
//                   <input
//                     type="number"
//                     name="kVp"
//                     value={technicalParams.kVp}
//                     onChange={handleTechnicalParamChange}
//                     placeholder="80"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>mAs:</label>
//                   <input
//                     type="number"
//                     name="mAs"
//                     value={technicalParams.mAs}
//                     onChange={handleTechnicalParamChange}
//                     placeholder="10"
//                   />
//                 </div>
//               </div>
//               <div className="form-row">
//                 <div className="form-group">
//                   <label>Độ dày lát cắt (mm):</label>
//                   <input
//                     type="number"
//                     name="sliceThickness"
//                     value={technicalParams.sliceThickness}
//                     onChange={handleTechnicalParamChange}
//                     placeholder="5"
//                     step="0.1"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>
//                     <input
//                       type="checkbox"
//                       name="contrast"
//                       checked={technicalParams.contrast}
//                       onChange={handleTechnicalParamChange}
//                     />
//                     Sử dụng thuốc cản quang
//                   </label>
//                 </div>
//               </div>
//             </div>

//             <div className="form-section">
//               <h4>📝 Ghi chú</h4>
//               <div className="form-group">
//                 <textarea
//                   value={notes}
//                   onChange={(e) => setNotes(e.target.value)}
//                   rows="3"
//                   placeholder="Ghi chú thêm về quá trình chụp hoặc chất lượng hình ảnh..."
//                 />
//               </div>
//             </div>

//             <div className="form-actions">
//               <button type="submit" className="btn-primary">
//                 💾 Import file DICOM
//               </button>
//               <button
//                 type="button"
//                 className="btn-secondary"
//                 onClick={() => {
//                   setSelectedFiles([])
//                   setPatientId("")
//                   setStudyType("")
//                   setBodyPart("")
//                   setTechnicalParams({
//                     kVp: "",
//                     mAs: "",
//                     sliceThickness: "",
//                     contrast: false,
//                   })
//                   setNotes("")
//                 }}
//               >
//                 🔄 Làm mới
//               </button>
//             </div>
//           </form>
//         </div>

//         <div className="recent-imports">
//           <h3>📋 Lịch sử import gần đây</h3>
//           <div className="imports-table-container">
//             <table className="imports-table">
//               <thead>
//                 <tr>
//                   <th>Tên file</th>
//                   <th>Mã BN</th>
//                   <th>Loại chụp</th>
//                   <th>Vùng chụp</th>
//                   <th>Kích thước</th>
//                   <th>Thời gian</th>
//                   <th>Trạng thái</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {recentImports.map((item) => (
//                   <tr key={item.id}>
//                     <td>{item.fileName}</td>
//                     <td>{item.patientCode}</td>
//                     <td>{item.studyType}</td>
//                     <td>{item.bodyPart}</td>
//                     <td>{item.fileSize}</td>
//                     <td>{item.importDate}</td>
//                     <td>
//                       <span
//                         className={`status-badge ${
//                           item.status === "Thành công"
//                             ? "status-success"
//                             : item.status === "Đang xử lý"
//                               ? "status-pending"
//                               : "status-error"
//                         }`}
//                       >
//                         {item.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   )
// }

// export default ImportDicom

"use client"

import { useState, useEffect } from "react"
import LayoutLogin from "../Layout/LayoutLogin"
import "../../css/importDicom.css"
import { importDicom } from "../../services/ImportDicomService"

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

  useEffect(() => {
    const saved = localStorage.getItem("dicomImports")
    if (saved) {
      setRecentImports(JSON.parse(saved))
    }
  }, [])

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
    if (!patientId || !studyType || !bodyPart) return alert("Vui lòng nhập đầy đủ thông tin")

    const payload = {
      patientCode: patientId,
      studyType: studyType,
      bodyPart: bodyPart,
      technicalParams: technicalParams,
      notes: notes,
      dicomFileName: selectedFiles[0]?.name || "unknown.dcm",
      performedBy: 7
    }

    try {
      const msg = await importDicom(payload)
      alert(msg)

      const importRecord = {
        ...payload,
        fileName: payload.dicomFileName,
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

  return (
    <LayoutLogin>
      <div className="import-dicom-page">
        <h2>📄 Import File DICOM</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Mã bệnh nhân:</label>
            <input value={patientId} onChange={(e) => setPatientId(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Loại chụp: *</label>
            <select value={studyType} onChange={(e) => setStudyType(e.target.value)} required>
              <option value="">-- Chọn loại chụp --</option>
              <option value="X-quang thường">X-quang thường</option>
              <option value="CT Scanner">CT Scanner</option>
              <option value="MRI">MRI</option>
              <option value="Siêu âm">Siêu âm</option>
              <option value="Mammography">Mammography</option>
              <option value="Fluoroscopy">Fluoroscopy</option>
              <option value="PET-CT">PET-CT</option>
              <option value="SPECT">SPECT</option>
            </select>
          </div>

          <div className="form-group">
            <label>Vùng chụp:</label>
            <input value={bodyPart} onChange={(e) => setBodyPart(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>kVp:</label>
            <input type="number" name="kVp" value={technicalParams.kVp} onChange={handleTechnicalParamChange} />
          </div>

          <div className="form-group">
            <label>mAs:</label>
            <input type="number" name="mAs" value={technicalParams.mAs} onChange={handleTechnicalParamChange} />
          </div>

          <div className="form-group">
            <label>Slice Thickness:</label>
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
            <label>Chọn file DICOM:</label>
            <input type="file" multiple accept=".dcm,.dicom" onChange={handleFileSelect} />
          </div>

          <button type="submit">📅 Import</button>
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
    </LayoutLogin>
  )
}

export default ImportDicom