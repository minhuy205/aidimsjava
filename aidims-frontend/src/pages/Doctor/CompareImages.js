import { memo, useState, useEffect } from "react";
import Layout from "../Layout/Layout";
import "../../css/CompareImages.css"; // file css riêng

const CompareImages = () => {
  const [dicomImages, setDicomImages] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");

  useEffect(() => {
    // Mock danh sách bệnh nhân
    const mockPatients = [
      { patientCode: "BN001", fullName: "Nguyễn Văn Nam" },
      { patientCode: "BN002", fullName: "Trần Thị Hoa" },
    ];
    setPatients(mockPatients);

    // Mock dữ liệu DICOM
    const mockDicoms = [
      {
        id: "DICOM001",
        fileName: "CT-Head-Old.dcm",
        dateTaken: "2024-01-01",
        patientCode: "BN001",
        imageUrl: "https://via.placeholder.com/400x400.png?text=Old+Image"
      },
      {
        id: "DICOM002",
        fileName: "CT-Head-New.dcm",
        dateTaken: "2024-06-01",
        patientCode: "BN001",
        imageUrl: "https://via.placeholder.com/400x400.png?text=New+Image"
      },
      {
        id: "DICOM003",
        fileName: "XRay-Chest-Old.dcm",
        dateTaken: "2024-02-01",
        patientCode: "BN002",
        imageUrl: "https://via.placeholder.com/400x400.png?text=Old+Chest"
      },
      {
        id: "DICOM004",
        fileName: "XRay-Chest-New.dcm",
        dateTaken: "2024-06-10",
        patientCode: "BN002",
        imageUrl: "https://via.placeholder.com/400x400.png?text=New+Chest"
      }
    ];
    setDicomImages(mockDicoms);
  }, []);

  const handlePatientChange = (e) => {
    setSelectedPatient(e.target.value);
  };

  const patientName = patients.find(p => p.patientCode === selectedPatient)?.fullName;

  const imagesForPatient = dicomImages
    .filter(img => img.patientCode === selectedPatient)
    .sort((a, b) => new Date(a.dateTaken) - new Date(b.dateTaken)); // Cũ -> Mới

  return (
    <Layout>
      <div className="doctor-page">
        <div className="compare-container">
          <h2>🔄 So sánh ảnh DICOM</h2>
          <p>Chọn bệnh nhân để xem ảnh DICOM cũ và mới</p>

          <select value={selectedPatient} onChange={handlePatientChange} className="patient-select">
            <option value="">-- Chọn bệnh nhân --</option>
            {patients.map(patient => (
              <option key={patient.patientCode} value={patient.patientCode}>
                {patient.fullName}
              </option>
            ))}
          </select>

          {selectedPatient && (
            <div className="comparison-section">
              <h3>Bệnh nhân: {patientName}</h3>
              <div className="image-compare">
                {imagesForPatient[0] ? (
                  <div className="image-box">
                    <h4>Ảnh cũ ({imagesForPatient[0].dateTaken})</h4>
                    <img src={imagesForPatient[0].imageUrl} alt="Old DICOM" />
                  </div>
                ) : <p>Không có ảnh cũ</p>}

                {imagesForPatient[1] ? (
                  <div className="image-box">
                    <h4>Ảnh mới ({imagesForPatient[1].dateTaken})</h4>
                    <img src={imagesForPatient[1].imageUrl} alt="New DICOM" />
                  </div>
                ) : <p>Không có ảnh mới</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default memo(CompareImages);
