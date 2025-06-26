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
    if (!selectedFiles.length) return alert("Vui lòng chọn file DICOM");
    if (!selectedPatient || !studyType || !bodyPart)
      return alert("Vui lòng điền đủ thông tin");

    const patient = patients.find((p) => p.patient_id === +selectedPatient);
    const metadata = {
      patientCode: patient?.patient_code || selectedPatient,
      studyType,
      bodyPart,
      technicalParams,
      notes,
      dicomFileName: selectedFiles[0]?.name,
      performedBy: 7,
    };

    const formData = new FormData();
    formData.append(
      "metadata",
      new Blob([JSON.stringify(metadata)], { type: "application/json" })
    );
    formData.append("file", selectedFiles[0].file);

    try {
      const msg = await importDicom(formData);
      alert(msg);
      const importRecord = {
        ...metadata,
        fileName: metadata.dicomFileName,
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
        <h2>📄 Nhập File DICOM</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Chọn bệnh nhân:</label>
            <select
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
              value={studyType}
              onChange={(e) => setStudyType(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Vùng chụp: *</label>
            <select
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

          <div className="form-group">
            <label>kVp:</label>
            <input
              name="kVp"
              value={technicalParams.kVp}
              onChange={handleTechnicalParamChange}
            />
          </div>
          <div className="form-group">
            <label>mAs:</label>
            <input
              name="mAs"
              value={technicalParams.mAs}
              onChange={handleTechnicalParamChange}
            />
          </div>
          <div className="form-group">
            <label>Độ dày lát cắt (mm):</label>
            <input
              name="sliceThickness"
              value={technicalParams.sliceThickness}
              onChange={handleTechnicalParamChange}
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="contrast"
                checked={technicalParams.contrast}
                onChange={handleTechnicalParamChange}
              />{" "}
              Dùng thuốc cản quang
            </label>
          </div>
          <div className="form-group">
            <label>Ghi chú:</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Chọn file hình ảnh (DICOM, JPEG, PNG):</label>
            <input
              type="file"
              accept=".dcm,image/*"
              onChange={handleFileSelect}
            />
          </div>

          <button type="submit">📥 Import DICOM</button>
        </form>

        <hr />
        <h3>Lịch sử import gần đây</h3>
        <ul>
          {recentImports.map((item, idx) => (
            <li key={idx}>
              {item.fileName} - {item.patientCode} - {item.studyType} -{" "}
              {item.bodyPart} ({item.fileSize}) [{item.importDate}]
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default ImportDicom;
