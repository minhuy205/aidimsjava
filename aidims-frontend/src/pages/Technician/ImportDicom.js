	"use client";

import { useState, useEffect } from "react";
import Layout from "../Layout/Layout";
import "../../css/importDicom.css";
import { importDicom } from "../../services/ImportDicomService";
import { patientService } from "../../services/patientService";
import { requestPhotoService } from "../../services/requestPhotoService";
import { imageTypeService } from "../../services/imageTypeService";

// Danh sách vùng chụp đơn giản như yêu cầu
const SIMPLE_BODY_PARTS = [
  { value: "limbs", label: "Tứ chi" },
  { value: "chest", label: "Ngực" },
  { value: "abdomen", label: "Bụng" },
  { value: "head", label: "Đầu" },
  { value: "spine", label: "Cột sống" },
  { value: "pelvis", label: "Khung chậu" },
  { value: "other", label: "Khác" },
];

const imagingTypeToTypeCode = (imagingType) => {
  switch (imagingType?.toLowerCase()) {
    case "x-ray":
      return "XR";
    case "ct":
      return "CT";
    case "mri":
      return "MRI";
    case "us":
    case "ultrasound":
      return "US";
    case "mammography":
      return "MG";
    case "fluoroscopy":
      return "FL";
    case "pet-ct":
    case "pet":
      return "PET";
    case "spect":
      return "SP";
    default:
      return "";
  }
};

const convertImagingTypeToStudyType = (type) => {
  switch (type?.toLowerCase()) {
    case "x-ray":
      return "X-quang thường";
    case "ct":
      return "CT Scanner";
    case "mri":
      return "MRI";
    case "us":
    case "ultrasound":
      return "Siêu âm";
    case "pet-ct":
    case "pet":
      return "PET-CT";
    case "spect":
      return "SPECT";
    case "fluoroscopy":
      return "Fluoroscopy";
    case "mammography":
      return "Mammography";
    default:
      return "";
  }
};

const ImportDicom = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [patients, setPatients] = useState([]);
  const [studyType, setStudyType] = useState("");
  const [bodyPart, setBodyPart] = useState("");
  const [technicalParams, setTechnicalParams] = useState({
    kVp: "",
    mAs: "",
    sliceThickness: "",
    contrast: false,
  });
  const [notes, setNotes] = useState("");
  const [recentImports, setRecentImports] = useState([]);

  useEffect(() => {
    patientService
      .getAllPatients()
      .then(setPatients)
      .catch(() => setPatients([]));

    const saved = localStorage.getItem("dicomImports");
    if (saved) setRecentImports(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (!selectedPatient) return resetForm();

    requestPhotoService
      .getRequestsByPatientId(selectedPatient)
      .then(async (requests) => {
        if (!requests.length) return resetForm();

        const latest = requests[requests.length - 1];
        const rawImagingType = latest?.imagingType;
        const imagingCode = imagingTypeToTypeCode(rawImagingType);

        setStudyType(convertImagingTypeToStudyType(rawImagingType));

        // Giữ nguyên giá trị vùng chụp từ API
        setBodyPart(latest.body_part || "");

        setNotes(latest.clinical_indication || "");

        if (!imagingCode) {
          console.warn("❗ imaging_type không xác định:", rawImagingType);
          return;
        }

        try {
          const techParams = await imageTypeService.getParamsByType(
            imagingCode
          );
          setTechnicalParams({
            kVp: techParams.kVp || "",
            mAs: techParams.mAs || "",
            sliceThickness: techParams.slice_thickness || "",
            contrast: techParams.contrast === true,
          });
        } catch (err) {
          console.warn("❌ Không lấy được thông số:", err);
        }
      })
      .catch((err) => {
        console.error("Không thể lấy yêu cầu:", err);
        resetForm();
      });
  }, [selectedPatient]);

  const resetForm = () => {
    setStudyType("");
    setBodyPart("");
    setNotes("");
    setTechnicalParams({
      kVp: "",
      mAs: "",
      sliceThickness: "",
      contrast: false,
    });
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

  const handleTechnicalParamChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTechnicalParams({
      ...technicalParams,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Đã bấm Import DICOM");
    if (!selectedFiles[0] || !selectedFiles[0].file) {
      alert("Bạn chưa chọn file hoặc file không hợp lệ!");
      return;
    }
    // Kiểm tra selectedPatient có giá trị chưa
    if (!selectedPatient) {
      alert("Bạn chưa chọn bệnh nhân!");
      return;
    }
    // Lấy đúng mã bệnh nhân từ danh sách patients (dựa vào patient_id, ép kiểu về string để so sánh chắc chắn)
    const patientObj = patients.find((p) => String(p.patient_id) === String(selectedPatient));
    if (!patientObj) {
      alert("Không tìm thấy mã bệnh nhân, vui lòng chọn lại!");
      return;
    }
    const patientCode = patientObj.patient_code;
    // Log thông tin file
    console.log("File gửi lên:", selectedFiles[0].file);
    // Log FormData
    const metadata = {
      patient_code: patientCode, // Đúng mã bệnh nhân
      study_type: studyType,
      body_part: bodyPart,
      technical_params:
        typeof technicalParams === "object"
          ? JSON.stringify(technicalParams)
          : technicalParams,
      notes,
      performed_by: 7,
    };
    const formData = new FormData();
    Object.entries(metadata).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("file", selectedFiles[0].file);
    for (let pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
    try {
      const msg = await importDicom(formData);
      alert(msg);
      const importRecord = {
        ...metadata,
        fileName: selectedFiles[0]?.name,
        importDate: new Date().toLocaleString("vi-VN"),
        status: "Thành công",
        fileSize: `${(selectedFiles[0].size / 1024 / 1024).toFixed(2)} MB`,
      };
      const updated = [importRecord, ...recentImports];
      setRecentImports(updated);
      localStorage.setItem("dicomImports", JSON.stringify(updated));
      resetForm();
      setSelectedFiles([]);
      setSelectedPatient("");
    } catch (err) {
      console.error(err);
      alert("Import thất bại: " + err.message);
    }
  };

  return (
    <Layout>
      <div className="import-dicom-page">
        <h2 className="page-title">📄 Import Ảnh DICOM</h2>
        <div className="page-header">
          <h2>✅ Nhập file DICOM </h2>
          <p>Import và quản lý file DICOM từ các thiết bị chụp hình ảnh y tế</p>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <div className="section-title">Thông tin ảnh DICOM</div>
              <div className="form-row">
                <div className="form-group">
                  <label>Chọn bệnh nhân:</label>
                  <select
                    className="form-select"
                    value={selectedPatient}
                    onChange={(e) => setSelectedPatient(e.target.value)}
                    required
                  >
                    <option value="">-- Chọn --</option>
                    {patients.map((p) => (
                      <option key={p.patient_id} value={p.patient_id}>
                        {p.patient_code} - {p.full_name} - {p.phone}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Loại chụp: *</label>
                  <input
                    className="form-input"
                    value={studyType}
                    onChange={(e) => setStudyType(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Vùng chụp: *</label>
                  <select
                    className="form-select"
                    value={bodyPart}
                    onChange={(e) => setBodyPart(e.target.value)}
                    required
                  >
                    <option value="">-- Chọn vị trí --</option>
                    {SIMPLE_BODY_PARTS.map((part, idx) => (
                      <option key={idx} value={part.value}>
                        {part.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>kVp:</label>
                  <input
                    className="form-input"
                    name="kVp"
                    value={technicalParams.kVp}
                    onChange={handleTechnicalParamChange}
                  />
                </div>
                <div className="form-group">
                  <label>mAs:</label>
                  <input
                    className="form-input"
                    name="mAs"
                    value={technicalParams.mAs}
                    onChange={handleTechnicalParamChange}
                  />
                </div>
                <div className="form-group">
                  <label>Độ dày lát cắt (mm):</label>
                  <input
                    className="form-input"
                    name="sliceThickness"
                    value={technicalParams.sliceThickness}
                    onChange={handleTechnicalParamChange}
                  />
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="contrast"
                      checked={technicalParams.contrast}
                      onChange={handleTechnicalParamChange}
                    />
                    Dùng thuốc cản quang
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label>Ghi chú:</label>
                <textarea
                  className="form-textarea"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
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
                  {recentImports.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.fileName}</td>
                      <td>{item.patient_code}</td>
                      <td>{item.study_type || item.studyType}</td>
                      <td>{item.body_part || item.bodyPart}</td>
                      <td>{item.fileSize}</td>
                      <td>{item.importDate}</td>
                      <td>{item.status}</td>
                    </tr>
                  ))}
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
