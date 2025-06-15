import { memo, useState, useEffect } from "react";
import Layout from "../Layout/Layout";
import "../../css/DicomViewer.css"; // Dùng CSS mới tách biệt

const DicomViewer = () => {
  const [dicomImages, setDicomImages] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const mockPatients = [
      { patientCode: "BN001", fullName: "Nguyễn Văn Nam" },
      { patientCode: "BN002", fullName: "Trần Thị Hoa" },
      { patientCode: "BN003", fullName: "Lê Minh Tuấn" },
    ];
    setPatients(mockPatients);

    const mockDicoms = [
      {
        id: "DICOM001",
        fileName: "CT-Head-01.dcm",
        description: "Chụp CT vùng đầu - nghi ngờ tai biến",
        modality: "CT",
        dateTaken: "2024-12-12",
        patientCode: "BN001",
        imageUrl: "https://via.placeholder.com/400x400.png?text=DICOM+CT+HEAD"
      },
      {
        id: "DICOM002",
        fileName: "XRay-Chest-01.dcm",
        description: "Chụp X-quang phổi - kiểm tra ho kéo dài",
        modality: "X-Ray",
        dateTaken: "2024-12-13",
        patientCode: "BN002",
        imageUrl: "https://via.placeholder.com/400x400.png?text=DICOM+XRay+CHEST"
      }
    ];
    setDicomImages(mockDicoms);
  }, []);

  const handleImageClick = (dicom) => {
    setSelectedImage(dicom);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  const getPatientName = (code) => {
    const patient = patients.find(p => p.patientCode === code);
    return patient ? patient.fullName : "Không rõ";
  };

  return (
    <Layout>
      <div className="doctor-page">
        <div className="dicom-list-container">
          <div className="page-header">
            <h2>🖼️ Danh sách ảnh DICOM</h2>
            <p>Xem và phân tích ảnh y tế DICOM của bệnh nhân</p>
          </div>

          <div className="table-container">
            <table className="dicom-table">
              <thead>
                <tr>
                  <th>Họ và tên BN</th> {/* Đã đưa lên đầu */}
                  <th>Mã DICOM</th>
                  <th>Tên file</th>
                  <th>Mô tả</th>
                  <th>Modality</th>
                  <th>Ngày chụp</th>
                  <th>Mã BN</th>
                </tr>
              </thead>
              <tbody>
                {dicomImages.map((dicom) => (
                  <tr key={dicom.id} onClick={() => handleImageClick(dicom)} className="dicom-row">
                    <td>{getPatientName(dicom.patientCode)}</td> {/* Đưa tên BN lên trước */}
                    <td>{dicom.id}</td>
                    <td>{dicom.fileName}</td>
                    <td>{dicom.description}</td>
                    <td>{dicom.modality}</td>
                    <td>{dicom.dateTaken}</td>
                    <td>{dicom.patientCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && selectedImage && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="dicom-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <button className="close-btn" onClick={closeModal}>×</button>
                <h3>🖼️ Chi tiết DICOM</h3>
                <p>Mã DICOM: {selectedImage.id}</p>
              </div>

              <div className="modal-content">
                <div className="dicom-info-section">
                  <h4>📋 Thông tin DICOM</h4>
                  <div className="info-grid">
                    <div className="info-row"><span className="info-label">Tên file:</span><span className="info-value">{selectedImage.fileName}</span></div>
                    <div className="info-row"><span className="info-label">Mô tả:</span><span className="info-value">{selectedImage.description}</span></div>
                    <div className="info-row"><span className="info-label">Modality:</span><span className="info-value">{selectedImage.modality}</span></div>
                    <div className="info-row"><span className="info-label">Ngày chụp:</span><span className="info-value">{selectedImage.dateTaken}</span></div>
                    <div className="info-row"><span className="info-label">Mã BN:</span><span className="info-value">{selectedImage.patientCode}</span></div>
                    <div className="info-row"><span className="info-label">Họ và tên BN:</span><span className="info-value">{getPatientName(selectedImage.patientCode)}</span></div>
                  </div>
                </div>

                <div className="dicom-info-section">
                  <h4>🖼️ Hình ảnh DICOM</h4>
                  <img src={selectedImage.imageUrl} alt="DICOM Preview" style={{ width: '100%', borderRadius: '10px' }} />
                </div>

                <div className="modal-actions">
                  <button className="btn btn-primary">🔍 Phân tích AI</button>
                  <button className="btn btn-secondary">💾 Tải về</button>
                  <button className="btn btn-success" onClick={closeModal}>✅ Xong</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default memo(DicomViewer);
