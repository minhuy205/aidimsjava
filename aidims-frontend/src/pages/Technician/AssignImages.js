// "use client"

// import { useState, useEffect } from "react"
// import LayoutLogin from "../Layout/LayoutLogin"
// import "../../css/assignImages.css"

// const AssignImages = () => {
//   const [images, setImages] = useState([])
//   const [patients, setPatients] = useState([])
//   const [selectedImage, setSelectedImage] = useState("")
//   const [selectedPatient, setSelectedPatient] = useState("")
//   const [priority, setPriority] = useState("Bình thường")
//   const [notes, setNotes] = useState("")
//   const [assignments, setAssignments] = useState([])

//   useEffect(() => {
//     // Load verified images
//     const savedImages = localStorage.getItem("dicomImages")
//     if (savedImages) {
//       const parsedImages = JSON.parse(savedImages)
//       const verifiedImages = parsedImages.filter((img) => img.status === "Đã kiểm tra")
//       setImages(verifiedImages)
//     }

//     // Load patients
//     const savedPatients = localStorage.getItem("patients")
//     if (savedPatients) {
//       setPatients(JSON.parse(savedPatients))
//     }

//     // Load assignments
//     const savedAssignments = localStorage.getItem("imageAssignments")
//     if (savedAssignments) {
//       setAssignments(JSON.parse(savedAssignments))
//     } else {
//       // Sample assignments
//       const sampleAssignments = [
//         {
//           id: 1,
//           imageFileName: "CT_CHEST_001.dcm",
//           patientCode: "BN001",
//           patientName: "Nguyễn Văn Nam",
//           studyType: "CT Scanner",
//           bodyPart: "Ngực",
//           priority: "Bình thường",
//           assignedDate: "2024-12-15 16:30:00",
//           status: "Đã gán",
//           assignedBy: "KTV001",
//         },
//         {
//           id: 2,
//           imageFileName: "XRAY_KNEE_002.dcm",
//           patientCode: "BN002",
//           patientName: "Trần Thị Hoa",
//           studyType: "X-quang thường",
//           bodyPart: "Khớp gối",
//           priority: "Ưu tiên",
//           assignedDate: "2024-12-15 17:15:00",
//           status: "Đã gán",
//           assignedBy: "KTV001",
//         },
//       ]
//       setAssignments(sampleAssignments)
//       localStorage.setItem("imageAssignments", JSON.stringify(sampleAssignments))
//     }
//   }, [])

//   const handleSubmit = (e) => {
//     e.preventDefault()

//     if (!selectedImage || !selectedPatient) {
//       alert("Vui lòng chọn hình ảnh và bệnh nhân")
//       return
//     }

//     const image = images.find((img) => img.id === Number.parseInt(selectedImage))
//     const patient = patients.find((p) => p.id === Number.parseInt(selectedPatient))

//     const newAssignment = {
//       id: Date.now(),
//       imageFileName: image.fileName,
//       patientCode: patient.patientCode,
//       patientName: patient.fullName,
//       studyType: image.studyType,
//       bodyPart: image.bodyPart,
//       priority,
//       assignedDate: new Date().toLocaleString("vi-VN"),
//       status: "Đã gán",
//       assignedBy: "KTV001", // In real app, get from current user
//       notes,
//     }

//     const updatedAssignments = [newAssignment, ...assignments]
//     setAssignments(updatedAssignments)
//     localStorage.setItem("imageAssignments", JSON.stringify(updatedAssignments))

//     // Reset form
//     setSelectedImage("")
//     setSelectedPatient("")
//     setPriority("Bình thường")
//     setNotes("")

//     alert("Đã gán hình ảnh cho bệnh nhân thành công!")
//   }

//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case "Khẩn cấp":
//         return "#dc3545"
//       case "Ưu tiên":
//         return "#fd7e14"
//       default:
//         return "#28a745"
//     }
//   }

//   return (
//     <LayoutLogin>
//       <div className="assign-images-page">
//         <div className="page-header">
//           <h2>👥 Phân công hình ảnh</h2>
//           <p>Gán hình ảnh đã kiểm tra cho bệnh nhân và chuyển đến bác sĩ</p>
//         </div>

//         <div className="assign-form-container">
//           <form onSubmit={handleSubmit} className="assign-form">
//             <div className="form-section">
//               <h3>🖼️ Chọn hình ảnh</h3>
//               <div className="form-group">
//                 <label>Hình ảnh đã kiểm tra: *</label>
//                 <select value={selectedImage} onChange={(e) => setSelectedImage(e.target.value)} required>
//                   <option value="">-- Chọn hình ảnh --</option>
//                   {images.map((image) => (
//                     <option key={image.id} value={image.id}>
//                       {image.fileName} - {image.studyType} - {image.bodyPart} ({image.quality})
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {selectedImage && (
//                 <div className="image-preview-card">
//                   {(() => {
//                     const image = images.find((img) => img.id === Number.parseInt(selectedImage))
//                     return (
//                       <div className="preview-content">
//                         <img
//                           src={image.thumbnail || "/placeholder.svg"}
//                           alt={image.fileName}
//                           className="preview-thumbnail"
//                         />
//                         <div className="preview-info">
//                           <h4>{image.fileName}</h4>
//                           <p>
//                             <strong>Loại:</strong> {image.studyType}
//                           </p>
//                           <p>
//                             <strong>Vùng:</strong> {image.bodyPart}
//                           </p>
//                           <p>
//                             <strong>Chất lượng:</strong> {image.quality}
//                           </p>
//                           <p>
//                             <strong>Kích thước:</strong> {image.fileSize}
//                           </p>
//                         </div>
//                       </div>
//                     )
//                   })()}
//                 </div>
//               )}
//             </div>

//             <div className="form-section">
//               <h3>👤 Chọn bệnh nhân</h3>
//               <div className="form-group">
//                 <label>Bệnh nhân: *</label>
//                 <select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)} required>
//                   <option value="">-- Chọn bệnh nhân --</option>
//                   {patients.map((patient) => (
//                     <option key={patient.id} value={patient.id}>
//                       {patient.patientCode} - {patient.fullName} - {patient.phone}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {selectedPatient && (
//                 <div className="patient-info-card">
//                   {(() => {
//                     const patient = patients.find((p) => p.id === Number.parseInt(selectedPatient))
//                     return (
//                       <div className="patient-details">
//                         <h4>👤 Thông tin bệnh nhân</h4>
//                         <div className="patient-grid">
//                           <p>
//                             <strong>Mã BN:</strong> {patient.patientCode}
//                           </p>
//                           <p>
//                             <strong>Họ tên:</strong> {patient.fullName}
//                           </p>
//                           <p>
//                             <strong>Ngày sinh:</strong> {patient.dateOfBirth}
//                           </p>
//                           <p>
//                             <strong>Giới tính:</strong> {patient.gender}
//                           </p>
//                           <p>
//                             <strong>Điện thoại:</strong> {patient.phone}
//                           </p>
//                           <p>
//                             <strong>Địa chỉ:</strong> {patient.address}
//                           </p>
//                         </div>
//                       </div>
//                     )
//                   })()}
//                 </div>
//               )}
//             </div>

//             <div className="form-section">
//               <h3>⚡ Mức độ ưu tiên</h3>
//               <div className="priority-options">
//                 {["Bình thường", "Ưu tiên", "Khẩn cấp"].map((level) => (
//                   <label key={level} className="priority-option">
//                     <input
//                       type="radio"
//                       name="priority"
//                       value={level}
//                       checked={priority === level}
//                       onChange={(e) => setPriority(e.target.value)}
//                     />
//                     <span className="priority-label" style={{ color: getPriorityColor(level) }}>
//                       {level}
//                     </span>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             <div className="form-section">
//               <h3>📝 Ghi chú</h3>
//               <div className="form-group">
//                 <label>Ghi chú thêm:</label>
//                 <textarea
//                   value={notes}
//                   onChange={(e) => setNotes(e.target.value)}
//                   rows="3"
//                   placeholder="Ghi chú về chất lượng hình ảnh hoặc yêu cầu đặc biệt..."
//                 />
//               </div>
//             </div>

//             <div className="form-actions">
//               <button type="submit" className="btn-primary">
//                 📤 Gán hình ảnh cho bệnh nhân
//               </button>
//             </div>
//           </form>
//         </div>

//         <div className="assignments-section">
//           <h3>📋 Lịch sử phân công</h3>
//           <div className="assignments-table-container">
//             <table className="assignments-table">
//               <thead>
//                 <tr>
//                   <th>Tên file</th>
//                   <th>Mã BN</th>
//                   <th>Tên bệnh nhân</th>
//                   <th>Loại chụp</th>
//                   <th>Vùng chụp</th>
//                   <th>Mức độ ưu tiên</th>
//                   <th>Thời gian gán</th>
//                   <th>Trạng thái</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {assignments.map((assignment) => (
//                   <tr key={assignment.id}>
//                     <td>{assignment.imageFileName}</td>
//                     <td>{assignment.patientCode}</td>
//                     <td>{assignment.patientName}</td>
//                     <td>{assignment.studyType}</td>
//                     <td>{assignment.bodyPart}</td>
//                     <td>
//                       <span
//                         className="priority-badge"
//                         style={{ backgroundColor: getPriorityColor(assignment.priority) }}
//                       >
//                         {assignment.priority}
//                       </span>
//                     </td>
//                     <td>{assignment.assignedDate}</td>
//                     <td>
//                       <span className="status-badge">{assignment.status}</span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </LayoutLogin>
//   )
// }

// export default AssignImages
