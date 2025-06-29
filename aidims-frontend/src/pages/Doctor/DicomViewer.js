import { memo, useState, useEffect } from "react";
import LayoutLogin from "../Layout/LayoutLogin";
import { getAllDicoms, downloadDicomFile } from "../../services/DicomService";
import "../../css/DicomViewer.css";
import MiniChatbot from "./MiniChatBot";

const DicomViewer = () => {
  const [dicomImages, setDicomImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getAllDicoms()
      .then(setDicomImages)
      .catch((err) => console.error("Lỗi khi lấy dữ liệu DICOM:", err));
  }, []);

  const handleImageClick = (dicom) => {
    setSelectedImage(dicom);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  return (
    <LayoutLogin>
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
                  <th>Họ và tên BN</th>
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
                    <td>{dicom.fullName}</td>
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
                    <div className="info-row"><span className="info-label">Họ và tên BN:</span><span className="info-value">{selectedImage.fullName}</span></div>
                  </div>
                </div>

                <div className="dicom-info-section">
                  <h4>🖼️ Hình ảnh DICOM</h4>
                  <img src={selectedImage.imageUrl} alt="DICOM Preview" style={{ width: '100%', borderRadius: '10px' }} />
                </div>

                <div className="modal-actions">
                  <button className="btn btn-primary">🔍 Phân tích AI</button>
                  <button className="btn btn-secondary" onClick={() => downloadDicomFile(selectedImage.dicomFilePath)}>💾 Tải về</button>
                  <button className="btn btn-success" onClick={closeModal}>✅ Xong</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <MiniChatbot />
    </LayoutLogin>
  );
};

export default memo(DicomViewer);
