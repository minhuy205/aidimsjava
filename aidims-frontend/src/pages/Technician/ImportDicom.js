"use client";

import { useState, useEffect } from "react";
import Layout from "../Layout/Layout";
import "../../css/importDicom.css";
import { importDicom } from "../../services/ImportDicomService";
import { patientService } from "../../services/patientService";
import { requestPhotoService } from "../../services/requestPhotoService";
import { imageTypeService } from "../../services/imageTypeService";

const ImportDicom = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [patients, setPatients] = useState([]);
  const [requests, setRequests] = useState([]); // Danh sách yêu cầu chụp
  const [selectedRequestId, setSelectedRequestId] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [recentImports, setRecentImports] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [patientRequests, setPatientRequests] = useState([]);

  // Lấy danh sách yêu cầu chụp từ bác sĩ
  useEffect(() => {
    requestPhotoService.getAllRequests().then(async (data) => {
      setRequests(data || []);
      const uniquePatients = [];
      const seen = new Set();
      for (const req of (data || [])) {
        // Ưu tiên lấy các trường có giá trị, fallback nếu không có
        let patient_id = req.patient_id || req.patientId || req.patientID || req.id;
        let patient_code = req.patient_code || req.patientCode || req.code;
        let full_name = req.full_name || req.fullName || req.name;
        let phone = req.phone || '';
        let date_of_birth = req.date_of_birth || req.dateOfBirth || '';
        let gender = req.gender || '';
        let email = req.email || '';
        let address = req.address || '';
        let identity_number = req.identity_number || req.identityNumber || '';
        let insurance_number = req.insurance_number || req.insuranceNumber || '';
        // Nếu thiếu thông tin cơ bản, gọi API lấy chi tiết bệnh nhân
        if (patient_id && (!patient_code || !full_name)) {
          try {
            const patientDetail = await patientService.getPatientById(patient_id);
            patient_code = patientDetail.patient_code || patientDetail.patientCode || patient_code;
            full_name = patientDetail.full_name || patientDetail.fullName || full_name;
            phone = patientDetail.phone || phone;
            date_of_birth = patientDetail.date_of_birth || patientDetail.dateOfBirth || date_of_birth;
            gender = patientDetail.gender || gender;
            email = patientDetail.email || email;
            address = patientDetail.address || address;
            identity_number = patientDetail.identity_number || patientDetail.identityNumber || identity_number;
            insurance_number = patientDetail.insurance_number || patientDetail.insuranceNumber || insurance_number;
          } catch (e) {}
        }
        if (patient_id && !seen.has(patient_id) && (patient_code || full_name)) {
          uniquePatients.push({
            patient_id,
            patient_code: patient_code || '',
            full_name: full_name || '',
            phone,
            date_of_birth,
            gender,
            email,
            address,
            identity_number,
            insurance_number
          });
          seen.add(patient_id);
        }
      }
      setPatients(uniquePatients);
    });
    const saved = localStorage.getItem("dicomImports");
    if (saved) setRecentImports(JSON.parse(saved));
  }, []);

  // Khi chọn bệnh nhân, tự động chọn yêu cầu chụp mới nhất (nếu có)
  const handlePatientChange = (e) => {
    const patientId = e.target.value;
    setSelectedPatientId(patientId);
    // Lọc các yêu cầu chụp của bệnh nhân này
    const reqs = requests.filter((r) => String(r.patient_id) === String(patientId) || String(r.patientId) === String(patientId));
    setPatientRequests(reqs);
    if (reqs.length > 0) {
      // Chọn tự động yêu cầu mới nhất (theo requestDate hoặc request_id lớn nhất)
      let latest = reqs[0];
      for (let r of reqs) {
        if ((r.requestDate && latest.requestDate && r.requestDate > latest.requestDate) ||
            (r.request_date && latest.request_date && r.request_date > latest.request_date) ||
            (r.requestId && latest.requestId && r.requestId > latest.requestId) ||
            (r.id && latest.id && r.id > latest.id)) {
          latest = r;
        }
      }
      setSelectedRequestId(latest.id || latest.requestId);
      setSelectedRequest(latest);
    } else {
      setSelectedRequestId("");
      setSelectedRequest(null);
    }
  };

  // Khi chọn yêu cầu chụp, fill thông tin
  const handleRequestChange = (e) => {
    const reqId = e.target.value;
    setSelectedRequestId(reqId);
    // Tìm đúng object yêu cầu chụp (có thể có các field khác nhau)
    const req = patientRequests.find((r) => String(r.id) === String(reqId) || String(r.requestId) === String(reqId));
    setSelectedRequest(req || null);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(
      files.map((file) => ({
        file,
        name: file.name,
        size: file.size,
        type: file.type,
      }))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFiles[0] || !selectedFiles[0].file) {
      alert("Bạn chưa chọn file hoặc file không hợp lệ!");
      return;
    }
    if (!selectedRequest) {
      alert("Bạn chưa chọn yêu cầu chụp!");
      return;
    }
    // Lấy metadata từ yêu cầu chụp
    const metadata = {
      patient_code: selectedRequest.patient_code || selectedRequest.patientCode || '',
      study_type: selectedRequest.imagingType || selectedRequest.imaging_type || selectedRequest.study_type || '',
      body_part: selectedRequest.body_part || selectedRequest.bodyPart || '',
      technical_params: selectedRequest.technical_params || selectedRequest.technicalParams || '',
      notes: selectedRequest.notes || selectedRequest.clinical_indication || selectedRequest.clinicalIndication || '',
      performed_by: 7,
      request_id: selectedRequest.id || selectedRequest.requestId || '',
      // Thêm các thông số kỹ thuật từ input
      kVp: selectedFiles[0]?.kVp || '',
      mAs: selectedFiles[0]?.mAs || '',
      sliceThickness: selectedFiles[0]?.sliceThickness || '',
      contrast: selectedFiles[0]?.contrast || ''
    };
    const formData = new FormData();
    Object.entries(metadata).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("file", selectedFiles[0].file);
    try {
      const msg = await importDicom(formData);
      alert(msg);
      // Lấy patient_code chắc chắn nhất
      let patient_code = '';
      if (selectedRequest.patient_code) patient_code = selectedRequest.patient_code;
      else if (selectedRequest.patientCode) patient_code = selectedRequest.patientCode;
      else if (metadata.patient_code) patient_code = metadata.patient_code;
      else if (selectedPatientId) {
        const p = patients.find(x => String(x.patient_id) === String(selectedPatientId));
        if (p && p.patient_code) patient_code = p.patient_code;
      }
      // Nếu vẫn chưa có, thử lấy từ patient_id của selectedRequest
      if (!patient_code && selectedRequest.patient_id) {
        const p = patients.find(x => String(x.patient_id) === String(selectedRequest.patient_id));
        if (p && p.patient_code) patient_code = p.patient_code;
      }
      const importRecord = {
        ...metadata,
        patient_code: patient_code || '',
        fileName: selectedFiles[0]?.name,
        importDate: new Date().toLocaleString("vi-VN"),
        status: "Thành công",
        fileSize: `${(selectedFiles[0].size / 1024 / 1024).toFixed(2)} MB`,
        patient_id: selectedPatientId
      };
      const updated = [importRecord, ...recentImports];
      setRecentImports(updated);
      localStorage.setItem("dicomImports", JSON.stringify(updated));
      setSelectedFiles([]);
      setSelectedRequestId("");
      setSelectedRequest(null);
    } catch (err) {
      alert("Import thất bại: " + err.message);
    }
  };

  // Helper chuyển đổi sang tiếng Việt
  const getBodyPartVN = val => {
    if (!val) return '';
    const map = { spine: 'Cột sống', chest: 'Ngực', head: 'Đầu', hand: 'Tay', leg: 'Chân', abdomen: 'Bụng' };
    return map[val.toLowerCase()] || val;
  };
  const getPriorityVN = val => {
    if (!val) return '';
    const map = { normal: 'Bình thường', urgent: 'Khẩn cấp', high: 'Cao', low: 'Thấp' };
    return map[val.toLowerCase()] || val;
  };
  const getStatusVN = val => {
    if (!val) return '';
    const map = { pending: 'Chờ xử lý', completed: 'Hoàn thành', imported: 'Đã import', cancelled: 'Đã hủy' };
    return map[val.toLowerCase()] || val;
  };

  return (
    <Layout>
      <div className="import-dicom-page">
        <h2 className="page-title">📄 Import Ảnh DICOM</h2>
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <div className="form-group">
                <label>Chọn bệnh nhân có yêu cầu chụp:</label>
                <select className="form-select" value={selectedPatientId} onChange={handlePatientChange} required>
                  <option value="">-- Chọn --</option>
                  {patients.map((p) => (
                    <option key={p.patient_id} value={p.patient_id}>
                      {p.patient_code} - {p.full_name} - {p.phone}
                    </option>
                  ))}
                </select>
              </div>
              {/* Hiển thị thông tin bệnh nhân khi đã chọn */}
              {selectedPatientId && (() => {
                const p = patients.find(x => String(x.patient_id) === String(selectedPatientId));
                if (!p) return null;
                // Tính tuổi
                let age = '';
                if (p.date_of_birth) {
                  const birth = new Date(p.date_of_birth);
                  const now = new Date();
                  age = now.getFullYear() - birth.getFullYear();
                  const m = now.getMonth() - birth.getMonth();
                  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
                  age = age + ' tuổi';
                }
                return (
                  <div className="patient-info-card">
                    <div className="patient-info-title"><i className="fa fa-user" style={{color:'#5b6ee1', marginRight:8}}></i>Thông tin bệnh nhân</div>
                    <div className="patient-info-grid">
                      <div className="patient-info-cell">
                        <div className="patient-info-label">Mã bệnh nhân:</div>
                        <div className="patient-info-value highlight">{p.patient_code}</div>
                      </div>
                      <div className="patient-info-cell">
                        <div className="patient-info-label">Họ và tên:</div>
                        <div className="patient-info-value highlight">{p.full_name}</div>
                      </div>
                      <div className="patient-info-cell">
                        <div className="patient-info-label">Tuổi:</div>
                        <div className="patient-info-value highlight">{age}</div>
                      </div>
                      <div className="patient-info-cell">
                        <div className="patient-info-label">Giới tính:</div>
                        <div className="patient-info-value highlight">{p.gender}</div>
                      </div>
                      <div className="patient-info-cell">
                        <div className="patient-info-label">Ngày sinh:</div>
                        <div className="patient-info-value highlight">{p.date_of_birth}</div>
                      </div>
                      <div className="patient-info-cell">
                        <div className="patient-info-label">Số điện thoại:</div>
                        <div className="patient-info-value highlight">{p.phone}</div>
                      </div>
                    </div>
                  </div>
                );
              })()}
              {/* KHÔNG HIỂN THỊ DROPDOWN VÀ BẢNG YÊU CẦU CHỤP  */}
              {selectedRequest && (
                <div className="form-group doctor-request-card">
                  <div className="doctor-request-title"><i className="fa fa-stethoscope" style={{color:'#d48806', marginRight:8}}></i>Thông tin yêu cầu chụp từ bác sĩ</div>
                  <div className="doctor-request-grid2">
                    <div className="doctor-request-cell">
                      <div className="doctor-request-label">Mã yêu cầu:</div>
                      <div className="doctor-request-value highlight">{selectedRequest.requestCode || selectedRequest.request_code || selectedRequest.id || selectedRequest.requestId}</div>
                    </div>
                    <div className="doctor-request-cell">
                      <div className="doctor-request-label">Loại chụp:</div>
                      <div className="doctor-request-value highlight">{selectedRequest.imagingType || selectedRequest.imaging_type || selectedRequest.study_type}</div>
                    </div>
                    <div className="doctor-request-cell">
                      <div className="doctor-request-label">Vùng chụp:</div>
                      <div className="doctor-request-value highlight">{getBodyPartVN(selectedRequest.bodyPart || selectedRequest.body_part)}</div>
                    </div>
                    <div className="doctor-request-cell">
                      <div className="doctor-request-label">Chỉ định:</div>
                      <div className="doctor-request-value highlight">{selectedRequest.clinicalIndication || selectedRequest.clinical_indication}</div>
                    </div>
                    <div className="doctor-request-cell">
                      <div className="doctor-request-label">Ghi chú:</div>
                      <div className="doctor-request-value highlight">{selectedRequest.notes}</div>
                    </div>
                    <div className="doctor-request-cell">
                      <div className="doctor-request-label">Mức độ ưu tiên:</div>
                      <div className="doctor-request-value highlight">{getPriorityVN(selectedRequest.priorityLevel || selectedRequest.priority_level)}</div>
                    </div>
                    <div className="doctor-request-cell">
                      <div className="doctor-request-label">Ngày yêu cầu:</div>
                      <div className="doctor-request-value highlight">{selectedRequest.requestDate || selectedRequest.request_date}</div>
                    </div>
                    <div className="doctor-request-cell">
                      <div className="doctor-request-label">Trạng thái:</div>
                      <div className="doctor-request-value highlight">{getStatusVN(selectedRequest.status)}</div>
                    </div>
                  </div>
                </div>
              )}
              {/* Thông số kỹ thuật hình ảnh */}
              <div className="form-group">
                <label>Thông số kỹ thuật hình ảnh:</label>
                <div style={{display: 'flex', gap: 16, flexWrap: 'wrap'}}>
                  <div>
                    <label>Điện áp (kVp):</label>
                    <input type="number" min={0} className="form-control" value={selectedFiles[0]?.kVp ?? ''}
                      onChange={e => {
                        const val = e.target.value;
                        setSelectedFiles(files => {
                          const arr = files.length ? [...files] : [{}];
                          arr[0] = {...arr[0], kVp: val};
                          return arr;
                        });
                      }} placeholder="VD: 80" style={{width: 80}} />
                  </div>
                  <div>
                    <label>Dòng điện (mAs):</label>
                    <input type="number" min={0} className="form-control" value={selectedFiles[0]?.mAs ?? ''}
                      onChange={e => {
                        const val = e.target.value;
                        setSelectedFiles(files => {
                          const arr = files.length ? [...files] : [{}];
                          arr[0] = {...arr[0], mAs: val};
                          return arr;
                        });
                      }} placeholder="VD: 10" style={{width: 80}} />
                  </div>
                  <div>
                    <label>Độ dày lát cắt (mm):</label>
                    <input type="text" className="form-control" value={selectedFiles[0]?.sliceThickness ?? ''}
                      onChange={e => {
                        const val = e.target.value;
                        setSelectedFiles(files => {
                          const arr = files.length ? [...files] : [{}];
                          arr[0] = {...arr[0], sliceThickness: val};
                          return arr;
                        });
                      }} placeholder="VD: 11" style={{width: 80}} />
                  </div>
                  <div>
                    <label>Chất cản quang:</label>
                    <input type="text" className="form-control" value={selectedFiles[0]?.contrast ?? ''}
                      onChange={e => {
                        const val = e.target.value;
                        setSelectedFiles(files => {
                          const arr = files.length ? [...files] : [{}];
                          arr[0] = {...arr[0], contrast: val};
                          return arr;
                        });
                      }} placeholder="Có/Không" style={{width: 80}} />
                  </div>
                </div>
              </div>
              <div className="form-group file-upload-label">
                <label>Chọn file hình ảnh (DICOM, JPEG, PNG):</label>
                <input
                  className="file-input"
                  type="file"
                  accept=".dcm,image/*"
                  onChange={handleFileSelect}
                />
                {selectedFiles[0] && (
                  <div className="file-preview">
                    <p><b>Tên file:</b> {selectedFiles[0].name}</p>
                    <p><b>Kích thước:</b> {((selectedFiles[0].size / 1024 / 1024).toFixed(2))} MB</p>
                  </div>
                )}
              </div>
              <div className="form-actions">
                <button className="submit-button" type="submit">📥 Import DICOM</button>
              </div>
            </div>
          </form>
        </div>
        <div className="recent-imports">
          <div className="section-title">Lịch sử import gần đây</div>
          <div className="imports-table">
            {recentImports.length === 0 ? (
              <div className="no-imports">Chưa có file nào được import.</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Ảnh</th>
                    <th>File</th>
                    <th>Mã bệnh nhân</th>
                    <th>Loại chụp</th>
                    <th>Vùng chụp</th>
                    <th>Kích thước</th>
                    <th>Ngày import</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {recentImports.map((item, idx) => {
                    const isImage = /\.(jpg|jpeg|png|gif)$/i.test(item.fileName || "");
                    const imageUrl = isImage
                      ? `/aidims-backend/dicom_uploads/${item.fileName}`
                      : null;
                    return (
                      <tr key={idx}>
                        <td>
                          {isImage && (
                            <img
                              src={imageUrl}
                              alt={item.fileName}
                              style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4 }}
                              onError={e => { e.target.style.display = 'none'; }}
                            />
                          )}
                        </td>
                        <td>{item.fileName}</td>
                        <td>{item.patient_code}</td>
                        <td>{item.study_type || item.studyType}</td>
                        <td>{item.body_part || item.bodyPart}</td>
                        <td>{item.fileSize}</td>
                        <td>{item.importDate}</td>
                        <td>{item.status}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ImportDicom;
