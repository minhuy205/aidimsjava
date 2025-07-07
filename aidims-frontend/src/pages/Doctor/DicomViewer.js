import { memo, useState, useEffect } from "react";
import LayoutLogin from "../Layout/LayoutLogin";
import {
    getAllDicomViewer,
    downloadDicomViewerFile,
    testDicomViewerConnection,
    getDicomViewerStats,
    getDicomViewerHealth,
    verifyImageAccess,
    searchDicomViewer
} from "../../services/dicomViewerService";
import "../../css/DicomViewer.css";
import MiniChatbot from "./MiniChatBot";
import ImageEditorModal from "../../components/ImageEditorModal";


const DicomViewer = () => {
    const [dicomImages, setDicomImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [editorImageUrl, setEditorImageUrl] = useState(null);

    useEffect(() => {
        loadDicomViewerData();
    }, []);

    const loadDicomViewerData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Test connection trước
            const testResult = await testDicomViewerConnection();
            console.log("🔗 Test DICOM Viewer connection:", testResult);

            // Lấy dữ liệu DICOM viewer
            const data = await getAllDicomViewer();
            console.log("📊 DICOM Viewer data:", data);

            // 🔍 DEBUG: Log chi tiết từng record
            if (data && data.length > 0) {
                console.log("🔍 DEBUG: Detailed record analysis:");
                data.forEach((record, index) => {
                    console.log(`Record ${index + 1}:`, {
                        id: record.id,
                        fileName: record.fileName,
                        patientCode: record.patientCode,
                        imageUrl: record.imageUrl,
                        hasUniqueFile: record.fileName !== data[0].fileName
                    });
                });

                // Check unique files
                const uniqueFiles = [...new Set(data.map(r => r.fileName))];
                console.log(`📁 Unique files found: ${uniqueFiles.length}/${data.length}`);
                console.log("📁 Unique file names:", uniqueFiles);

                // Check unique patients
                const uniquePatients = [...new Set(data.map(r => r.patientCode))];
                console.log(`👥 Unique patients: ${uniquePatients.length}/${data.length}`);
                console.log("👥 Patient codes:", uniquePatients);
            }

            setDicomImages(data || []);

            // Lấy thống kê
            try {
                const statsData = await getDicomViewerStats();
                setStats(statsData);
                console.log("📈 DICOM Viewer stats:", statsData);
            } catch (statsError) {
                console.warn("⚠️ Không thể lấy thống kê:", statsError);
            }

        } catch (err) {
            console.error("❌ Lỗi khi lấy dữ liệu DICOM Viewer:", err);
            setError(err.message || "Không thể kết nối đến server");
        } finally {
            setLoading(false);
        }
    };

    const handleImageClick = async (dicom) => {
        console.log("🖼️ Selected DICOM:", dicom);

        // Verify image trước khi mở modal
        if (dicom.fileName) {
            try {
                const verifyResult = await verifyImageAccess(dicom.fileName);
                console.log("🔍 Image verification:", verifyResult);

                if (!verifyResult.success) {
                    console.warn("⚠️ Ảnh có thể không tải được:", verifyResult.error);
                }
            } catch (verifyError) {
                console.warn("⚠️ Không thể verify ảnh:", verifyError);
            }
        }

        setSelectedImage(dicom);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedImage(null);
    };

    const handleDownload = async (fileName) => {
        try {
            await downloadDicomViewerFile(fileName);
            console.log("✅ Download thành công:", fileName);
        } catch (err) {
            console.error("❌ Lỗi download:", err);
            alert("Lỗi khi download file: " + err.message);
        }
    };

    const handleSearch = async () => {
        if (!searchKeyword.trim()) {
            loadDicomViewerData();
            return;
        }

        try {
            setLoading(true);
            const searchResults = await searchDicomViewer(searchKeyword);
            setDicomImages(searchResults || []);
            console.log("🔍 Search results:", searchResults);
        } catch (err) {
            console.error("❌ Lỗi search:", err);
            setError("Lỗi khi tìm kiếm: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return "N/A";
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1048576) return Math.round(bytes / 1024) + " KB";
        return Math.round(bytes / 1048576) + " MB";
    };

    const formatStats = (stats) => {
        if (!stats) return "N/A";
        return (
            <div style={{fontSize: '12px', color: '#666'}}>
                Total: {stats.total_count || 0} |
                MRI: {stats.mri_count || 0} |
                CT: {stats.ct_count || 0} |
                X-Ray: {stats.xray_count || 0} |
                Patients: {stats.unique_patients || 0}
            </div>
        );
    };
    const getImageUrl = (fileName) =>
    `http://localhost:8080/api/dicom-viewer/image/${encodeURIComponent(fileName)}`;
    if (loading) {
        return (
            <LayoutLogin>
                <div className="doctor-page">
                    <div className="dicom-list-container">
                        <div className="page-header">
                            <h2>🔄 Đang tải dữ liệu DICOM Viewer...</h2>
                            <p>Vui lòng chờ trong giây lát</p>
                        </div>
                    </div>
                </div>
            </LayoutLogin>
        );
    }

    if (error) {
        return (
            <LayoutLogin>
                <div className="doctor-page">
                    <div className="dicom-list-container">
                        <div className="page-header">
                            <h2>❌ Lỗi kết nối DICOM Viewer</h2>
                            <p style={{color: 'red'}}>{error}</p>
                            <button
                                onClick={loadDicomViewerData}
                                style={{
                                    padding: '10px 20px',
                                    marginTop: '10px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}
                            >
                                🔄 Thử lại
                            </button>
                        </div>
                    </div>
                </div>
            </LayoutLogin>
        );
    }

    return (
        <LayoutLogin>
            <div className="doctor-page">
                <div className="dicom-list-container">
                    <div className="page-header">
                        <h2>🖼️ DICOM Viewer - Danh sách ảnh y tế</h2>
                        <p>Xem và phân tích ảnh DICOM từ hệ thống ({dicomImages.length} ảnh)</p>
                        {formatStats(stats)}

                        {/* Search Bar */}
                        <div style={{margin: '10px 0', display: 'flex', gap: '10px', alignItems: 'center'}}>
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên file, mã BN, loại chụp..."
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                style={{
                                    padding: '8px 12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    minWidth: '300px'
                                }}
                            />
                            <button
                                onClick={handleSearch}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                🔍 Tìm kiếm
                            </button>
                            <button
                                onClick={loadDicomViewerData}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                🔄 Làm mới
                            </button>
                        </div>
                    </div>

                    {dicomImages.length === 0 ? (
                        <div style={{textAlign: 'center', padding: '50px'}}>
                            <h3>📂 Chưa có ảnh DICOM nào</h3>
                            <p>
                                {searchKeyword ?
                                    `Không tìm thấy kết quả cho "${searchKeyword}"` :
                                    'Vui lòng upload ảnh DICOM để hiển thị ở đây.'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="dicom-table">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Họ và tên BN</th>
                                    <th>Tên file</th>
                                    <th>Mô tả</th>
                                    <th>Modality</th>
                                    <th>Bộ phận</th>
                                    <th>Ngày chụp</th>
                                    <th>Mã BN</th>
                                    <th>Kích thước</th>
                                    <th>Trạng thái</th>
                                </tr>
                                </thead>
                                <tbody>
                                {dicomImages.map((dicom, index) => (
                                    <tr
                                        key={`dicom-${dicom.id}-${index}`}
                                        onClick={() => handleImageClick(dicom)}
                                        className="dicom-row"
                                        style={{cursor: 'pointer'}}
                                    >
                                        <td>{dicom.id}</td>
                                        <td>{dicom.fullName || 'N/A'}</td>
                                        <td title={dicom.fileName}>
                                            {dicom.fileName ?
                                                (dicom.fileName.length > 30 ?
                                                        dicom.fileName.substring(0, 30) + '...' :
                                                        dicom.fileName
                                                ) : 'N/A'
                                            }
                                        </td>
                                        <td>{dicom.description || 'Không có mô tả'}</td>
                                        <td>
                        <span style={{
                            padding: '2px 6px',
                            backgroundColor: dicom.modality === 'MRI' ? '#e3f2fd' :
                                dicom.modality === 'CT' ? '#f3e5f5' :
                                    dicom.modality === 'X-Ray' ? '#e8f5e8' : '#f5f5f5',
                            borderRadius: '3px',
                            fontSize: '12px'
                        }}>
                          {dicom.modality || 'N/A'}
                        </span>
                                        </td>
                                        <td>{dicom.bodyPart || 'N/A'}</td>
                                        <td>{dicom.dateTaken || 'N/A'}</td>
                                        <td>{dicom.patientCode || 'N/A'}</td>
                                        <td>{formatFileSize(dicom.fileSize)}</td>
                                        <td>
                        <span style={{
                            padding: '2px 6px',
                            backgroundColor: dicom.status === 'imported' ? '#d4edda' : '#f8d7da',
                            color: dicom.status === 'imported' ? '#155724' : '#721c24',
                            borderRadius: '3px',
                            fontSize: '12px'
                        }}>
                          {dicom.status || 'N/A'}
                        </span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {showModal && selectedImage && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="dicom-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <button className="close-btn" onClick={closeModal}>×</button>
                                <h3>🖼️ Chi tiết DICOM Viewer</h3>
                                <p>ID: {selectedImage.id} | File: {selectedImage.fileName}</p>
                            </div>

                            <div className="modal-content">
                                <div className="dicom-info-section">
                                    <h4>📋 Thông tin chi tiết</h4>
                                    <div className="info-grid">
                                        <div className="info-row">
                                            <span className="info-label">ID:</span>
                                            <span className="info-value">{selectedImage.id}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Tên file:</span>
                                            <span className="info-value">{selectedImage.fileName}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Mô tả:</span>
                                            <span className="info-value">{selectedImage.description}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Modality:</span>
                                            <span className="info-value">{selectedImage.modality}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Bộ phận:</span>
                                            <span className="info-value">{selectedImage.bodyPart}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Ngày chụp:</span>
                                            <span className="info-value">{selectedImage.dateTaken}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Mã BN:</span>
                                            <span className="info-value">{selectedImage.patientCode}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Họ và tên BN:</span>
                                            <span className="info-value">{selectedImage.fullName}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Kích thước:</span>
                                            <span className="info-value">{formatFileSize(selectedImage.fileSize)}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Thực hiện bởi:</span>
                                            <span className="info-value">{selectedImage.performedBy}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Trạng thái:</span>
                                            <span className="info-value">{selectedImage.status}</span>
                                        </div>
                                        {selectedImage.technicalParams && (
                                            <div className="info-row">
                                                <span className="info-label">Thông số kỹ thuật:</span>
                                                <span className="info-value">{selectedImage.technicalParams}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="dicom-info-section">
                                    <h4>🖼️ Hình ảnh DICOM</h4>
                                    {selectedImage.imageUrl ? (
                                        <div style={{textAlign: 'center'}}>
                                            <img
                                                src={`http://localhost:8080/api/dicom-viewer/image/${encodeURIComponent(selectedImage.fileName)}`}
                                                alt="DICOM Preview"
                                                style={{
                                                    maxWidth: '100%',
                                                    maxHeight: '500px',
                                                    borderRadius: '10px',
                                                    border: '2px solid #ddd',
                                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                                    cursor: 'zoom-in' // 👈 thêm con trỏ zoom
                                                }}
                                                onClick={() =>
                                                    setEditorImageUrl(
                                                    `http://localhost:8080/api/dicom-viewer/image/${encodeURIComponent(selectedImage.fileName)}`
                                                    )
                                                }
                                                onLoad={() => console.log("✅ Ảnh DICOM Viewer được tải thành công")}
                                                onError={(e) => {
                                                    console.error("❌ Lỗi tải ảnh:", selectedImage.fileName);
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'block';
                                                }}
                                            />

                                            <div style={{ display: 'none', color: 'red', padding: '20px' }}>
                                                ❌ Không thể tải ảnh. Vui lòng kiểm tra đường dẫn.
                                                <br />
                                                <small>File: {selectedImage.fileName}</small>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{textAlign: 'center', color: '#999', padding: '20px'}}>
                                            📷 Không có ảnh để hiển thị
                                        </div>
                                    )}
                                    {editorImageUrl && (
                                        <ImageEditorModal
                                            isOpen={!!editorImageUrl}
                                            imageUrl={editorImageUrl}
                                            onRequestClose={() => setEditorImageUrl(null)}
                                        />
                                    )}
                                </div>

                                <div className="modal-actions">
                                    <button className="btn btn-primary">🔍 Phân tích AI</button>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => handleDownload(selectedImage.fileName)}
                                    >
                                        💾 Tải về
                                    </button>
                                    <button className="btn btn-success" onClick={closeModal}>✅ Đóng</button>
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