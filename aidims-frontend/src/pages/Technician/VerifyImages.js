"use client";

import { useState, useEffect, useCallback } from "react";
import LayoutLogin from "../Layout/LayoutLogin";
import "../../css/verifyImages.css";
import verifyImageService from "../../services/verifyImageService";

// Danh sách loại chụp đồng bộ với các module khác
const STUDY_TYPE_OPTIONS = [
  { value: '', label: 'Tất cả' },
  { value: 'X-quang thường', label: 'X-quang thường' },
  { value: 'CT Scanner', label: 'CT Scanner' },
  { value: 'MRI', label: 'MRI' },
  { value: 'Siêu âm', label: 'Siêu âm' },
  { value: 'PET-CT', label: 'PET-CT' },
  { value: 'Mammography', label: 'Mammography' },
  { value: 'Fluoroscopy', label: 'Fluoroscopy' },
  { value: 'SPECT', label: 'SPECT' },
];

const VerifyImages = () => {
  // State management
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [filters, setFilters] = useState({
    status: "pending",
    studyType: "",
    quality: "",
    dateFrom: "",
    dateTo: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [approvalNote, setApprovalNote] = useState("");
  const [activeTab, setActiveTab] = useState("info");
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  // Thống kê số lượng ảnh theo trạng thái (tính trực tiếp từ images)
  const statsFromImages = {
    total: images.length,
    approved: images.filter(img => img.status === "Đã duyệt").length,
    pending: images.filter(img => img.status === "Chờ duyệt").length,
    rejected: images.filter(img => img.status === "Từ chối").length,
  };

  // Filter trạng thái dạng nút giống trang bác sĩ
  const [statusTab, setStatusTab] = useState("pending");

  // Fetch images from backend
  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const backendUrl = "http://localhost:8080"; // Change this if your backend URL is different
      const [dicomImportsRes, verifyImagesRes] = await Promise.all([
        fetch(`${backendUrl}/api/verify-image/dicom-imports`, { credentials: 'include' }),
        fetch(`${backendUrl}/api/verify-image/all`, { credentials: 'include' }),
      ]);

      if (!dicomImportsRes.ok || !verifyImagesRes.ok) {
        throw new Error("Failed to load image data");
      }

      const [dicomImports, verifyImages] = await Promise.all([
        dicomImportsRes.json(),
        verifyImagesRes.json(),
      ]);

      const combinedImages = dicomImports.map((dicomItem) => {
        const verification =
          verifyImages.find((v) => v.imageId === dicomItem.id) || {};

        // Extract filename from path
        const fileName = dicomItem.filePath
          ? dicomItem.filePath.split(/[\\/]/).pop()
          : dicomItem.fileName;

        // Build correct URL for image and thumbnail
        const filePath = fileName
          ? `/dicom_uploads/${fileName}`
          : null;
        const thumbnail = fileName
          ? `/dicom_uploads/${fileName}`
          : "/placeholder-image.jpg";

        return {
          id: dicomItem.id,
          fileName: fileName || "No filename",
          patientCode: dicomItem.patientCode || "",
          patientName:
            dicomItem.patientName ||
            (dicomItem.patient && dicomItem.patient.name) ||
            dicomItem.name ||
            dicomItem.fullName ||
            (dicomItem.request && (dicomItem.request.patientName || (dicomItem.request.patient && dicomItem.request.patient.name))) ||
            (dicomItem.imagingRequest && (dicomItem.imagingRequest.patientName || (dicomItem.imagingRequest.patient && dicomItem.imagingRequest.patient.name))) ||
            "Không rõ",
          studyType: dicomItem.studyType || "",
          bodyPart: dicomItem.bodyPart || "",
          captureDate: dicomItem.importDate
            ? new Date(dicomItem.importDate).toLocaleDateString("vi-VN")
            : "",
          quality: verification.note?.includes("Xuất sắc")
            ? "Xuất sắc"
            : verification.note?.includes("Tốt")
            ? "Tốt"
            : verification.note?.includes("Kém")
            ? "Kém"
            : "Chưa xác định",
          status:
            verification.result === "approved"
              ? "Đã duyệt"
              : verification.result === "rejected"
              ? "Từ chối"
              : "Chờ duyệt",
          technicalParams: (() => {
            // Nếu technicalParams là object, trả về luôn
            if (typeof dicomItem.technicalParams === 'object' && dicomItem.technicalParams !== null) return dicomItem.technicalParams;
            // Nếu là string JSON, parse ra object
            if (typeof dicomItem.technicalParams === 'string') {
              try {
                return JSON.parse(dicomItem.technicalParams);
              } catch (e) {
                // Nếu không phải JSON, trả về string gốc
                return dicomItem.technicalParams;
              }
            }
            // Nếu null hoặc undefined, trả về object rỗng
            return {};
          })(),
          fileSize: dicomItem.fileSize
            ? `${(dicomItem.fileSize / (1024 * 1024)).toFixed(2)} MB`
            : "",
          filePath,
          thumbnail,
          verificationId: verification.id,
          note: verification.note || "",
        };
      });

      setImages(combinedImages);
      setFilteredImages(
        combinedImages.filter((img) => img.status === "Chờ duyệt")
      );
    } catch (error) {
      console.error("Error loading images:", error);
      alert("Error loading image list: " + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Filter handlers
  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = [...images];

    // Status filter
    if (filters.status) {
      filtered = filtered.filter((img) =>
        filters.status === "all"
          ? true
          : filters.status === "pending"
          ? img.status === "Chờ duyệt"
          : filters.status === "approved"
          ? img.status === "Đã duyệt"
          : filters.status === "rejected"
          ? img.status === "Từ chối"
          : true
      );
    }

    // Study type filter
    if (filters.studyType) {
      filtered = filtered.filter((img) => img.studyType === filters.studyType);
    }

    // Quality filter
    if (filters.quality) {
      filtered = filtered.filter((img) => img.quality === filters.quality);
    }

    // Date range filters
    if (filters.dateFrom) {
      filtered = filtered.filter((img) => {
        if (!img.captureDate) return false;
        const [day, month, year] = img.captureDate.split("/");
        const imgDate = new Date(`${year}-${month}-${day}`);
        return imgDate >= new Date(filters.dateFrom);
      });
    }

    if (filters.dateTo) {
      filtered = filtered.filter((img) => {
        if (!img.captureDate) return false;
        const [day, month, year] = img.captureDate.split("/");
        const imgDate = new Date(`${year}-${month}-${day}`);
        return imgDate <= new Date(filters.dateTo);
      });
    }

    setFilteredImages(filtered);
  }, [filters, images]);

  const resetFilters = useCallback(() => {
    setFilters({
      status: "pending",
      studyType: "",
      quality: "",
      dateFrom: "",
      dateTo: "",
    });
    setFilteredImages(images.filter((img) => img.status === "Chờ duyệt"));
  }, [images]);

  // Approval handlers
  const handleApprove = useCallback(
    async (approve = true) => {
      if (!selectedImage) return;

      try {
        setLoading(true);
        const result = approve ? "approved" : "rejected";
        const note = approve
          ? `Chất lượng: ${approvalNote || "Tốt"}`
          : `Lý do từ chối: ${approvalNote || "Chất lượng không đạt"}`;

        await verifyImageService.saveVerifyImage({
          imageId: selectedImage.id,
          checkedBy: 1, // TODO: Replace with actual user ID
          result,
          note,
        });

        // Sau khi duyệt/từ chối thành công, gọi lại fetchImages và fetchStats để đồng bộ dữ liệu mới nhất từ backend
        await fetchImages();

        setShowApproveModal(false);
        setSelectedImage(null);
        setApprovalNote("");
      } catch (error) {
        console.error("Approval error:", error);
        alert("Approval failed: " + error.message);
      } finally {
        setLoading(false);
      }
    },
    [selectedImage, approvalNote, fetchImages]
  );

  // UI helpers
  const getStatusColor = useCallback((status) => {
    switch (status) {
      case "Đã duyệt":
        return "var(--success)";
      case "Từ chối":
        return "var(--danger)";
      case "Chờ duyệt":
        return "var(--warning)";
      default:
        return "var(--secondary)";
    }
  }, []);

  const getQualityColor = useCallback((quality) => {
    switch (quality) {
      case "Xuất sắc":
        return "var(--success)";
      case "Tốt":
        return "var(--info)";
      case "Kém":
        return "var(--danger)";
      default:
        return "var(--secondary)";
    }
  }, []);

  // Modal components
  const ImageModal = () =>
    showImageModal &&
    selectedImage && (
      <div className="modal-backdrop" onClick={() => setShowImageModal(false)}>
        <div className="image-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>🖼️ Xem chi tiết hình ảnh</h3>
            <button className="close-btn" onClick={() => setShowImageModal(false)}>
              &times;
            </button>
          </div>
          <div className="modal-tabs" style={{ display: 'flex', borderBottom: '1px solid #eee', marginBottom: 16 }}>
            <div
              className={`tab-item${activeTab === "info" ? " active" : ""}`}
              style={{ padding: '10px 20px', cursor: 'pointer', borderBottom: activeTab === "info" ? '2px solid #3498db' : 'none', fontWeight: activeTab === "info" ? 600 : 400 }}
              onClick={() => setActiveTab("info")}
            >
              Thông tin ảnh
            </div>
            <div
              className={`tab-item${activeTab === "tech" ? " active" : ""}`}
              style={{ padding: '10px 20px', cursor: 'pointer', borderBottom: activeTab === "tech" ? '2px solid #3498db' : 'none', fontWeight: activeTab === "tech" ? 600 : 400 }}
              onClick={() => setActiveTab("tech")}
            >
              Thông tin kỹ thuật
            </div>
          </div>
          <div className="modal-content">
            {activeTab === "info" && (
              <div className="image-info-modal-flex">
                <div className="image-info-modal-img-wrap">
                  <img
                    className="image-info-modal-img"
                    src={selectedImage.filePath || "/placeholder-image.jpg"}
                    alt={selectedImage.fileName}
                    onError={e => {
                      e.target.src = "/placeholder-image.jpg";
                      e.target.onerror = null;
                    }}
                  />
                </div>
                <div className="image-info-modal-details">
                  <div><strong>Tên file:</strong> {selectedImage.fileName}</div>
                  <div><strong>Mã bệnh nhân:</strong> {selectedImage.patientCode}</div>
                  <div><strong>Tên bệnh nhân:</strong> {selectedImage.patientName}</div>
                  <div><strong>Loại chụp:</strong> {selectedImage.studyType}</div>
                  <div><strong>Vùng chụp:</strong> {selectedImage.bodyPart}</div>
                  <div><strong>Ngày chụp:</strong> {selectedImage.captureDate}</div>
                  <div><strong>Kích thước file:</strong> {selectedImage.fileSize}</div>
                  <div className="image-info-modal-actions">
                    {selectedImage.status === "Chờ duyệt" && (
                      <>
                        <button
                          className="btn btn-success"
                          onClick={() => {
                            setSelectedImage(selectedImage);
                            setShowApproveModal(true);
                          }}
                        >
                          Duyệt
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => {
                            setSelectedImage(selectedImage);
                            setApprovalNote("");
                            handleApprove(false);
                          }}
                        >
                          Từ chối
                        </button>
                      </>
                    )}
                    <button
                      className="btn btn-info"
                      onClick={() => {
                        window.open(selectedImage.filePath, "_blank");
                      }}
                    >
                      Xem ảnh gốc
                    </button>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "tech" && (
              <div>
                <div style={{ marginBottom: 8 }}><strong>Chất lượng:</strong> <span className="badge" style={{ backgroundColor: getQualityColor(selectedImage.quality) }}>{selectedImage.quality}</span></div>
                <div style={{ marginBottom: 8 }}><strong>Trạng thái:</strong> <span className="badge" style={{ backgroundColor: getStatusColor(selectedImage.status) }}>{selectedImage.status}</span></div>
                {selectedImage.technicalParams && Object.keys(selectedImage.technicalParams).length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <strong>Thông số kỹ thuật:</strong>
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                      {Object.entries(selectedImage.technicalParams).map(([key, value]) => (
                        <li key={key}><strong>{key}:</strong> {value}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {selectedImage.note && (
                  <div style={{ marginTop: 12 }}><strong>Ghi chú:</strong> {selectedImage.note}</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );

  const ApproveModal = () =>
    showApproveModal &&
    selectedImage && (
      <div
        className="modal-backdrop"
        onClick={() => setShowApproveModal(false)}
      >
        <div className="approval-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Duyệt hình ảnh</h3>
            <button
              className="close-btn"
              onClick={() => setShowApproveModal(false)}
            >
              &times;
            </button>
          </div>
          <div className="modal-body">
            <p>
              Bạn đang duyệt hình ảnh: <strong>{selectedImage.fileName}</strong>
            </p>
            <div className="form-group">
              <label>Đánh giá chất lượng:</label>
              <select
                value={
                  approvalNote.includes("Xuất sắc")
                    ? "excellent"
                    : approvalNote.includes("Tốt")
                    ? "good"
                    : ""
                }
                onChange={(e) => {
                  const quality =
                    e.target.value === "excellent" ? "Xuất sắc" : "Tốt";
                  setApprovalNote(`Chất lượng: ${quality}`);
                }}
              >
                <option value="">Chọn chất lượng</option>
                <option value="excellent">Xuất sắc</option>
                <option value="good">Tốt</option>
              </select>
            </div>
            <div className="form-group">
              <label>Ghi chú:</label>
              <textarea
                value={
                  approvalNote.startsWith("Chất lượng:")
                    ? approvalNote.replace(/^Chất lượng: /, "")
                    : approvalNote
                }
                onChange={(e) => {
                  if (approvalNote.includes("Xuất sắc")) {
                    setApprovalNote(`Chất lượng: Xuất sắc - ${e.target.value}`);
                  } else if (approvalNote.includes("Tốt")) {
                    setApprovalNote(`Chất lượng: Tốt - ${e.target.value}`);
                  } else {
                    setApprovalNote(e.target.value);
                  }
                }}
                placeholder="Nhập ghi chú (nếu có)"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-success"
              onClick={() => handleApprove(true)}
              disabled={!approvalNote}
            >
              Xác nhận duyệt
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowApproveModal(false)}
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    );

  useEffect(() => {
    // Khi đổi tab trạng thái, tự động lọc lại danh sách
    let filtered = images;
    if (statusTab === "pending") filtered = images.filter(img => img.status === "Chờ duyệt");
    else if (statusTab === "approved") filtered = images.filter(img => img.status === "Đã duyệt");
    else if (statusTab === "rejected") filtered = images.filter(img => img.status === "Từ chối");
    setFilteredImages(filtered);
  }, [statusTab, images]);

  return (
    <LayoutLogin>
      <div className="verify-images-container">
        <div className="page-header verify-header">
          <h2 style={{fontSize: 38, fontWeight: 800, color: '#222', margin: 0, display: 'inline-block', verticalAlign: 'middle'}}>
            <span style={{fontSize: 36, verticalAlign: 'middle', marginRight: 8}}>✅</span> Kiểm tra chất lượng DICOM
          </h2>
          <p style={{fontSize: 20, color: '#666', marginTop: 8, fontWeight: 400, marginBottom: 0}}>Xác minh chất lượng hình ảnh và thông số kỹ thuật</p>
        </div>

        {/* Filter trạng thái dạng nút đẹp */}
        <div className="status-tab-row">
          <button className={`status-tab pending${statusTab === "pending" ? " active" : ""}`} onClick={() => setStatusTab("pending")}>🕒 Chờ duyệt <span>({statsFromImages.pending})</span></button>
          <button className={`status-tab approved${statusTab === "approved" ? " active" : ""}`} onClick={() => setStatusTab("approved")}>✅ Đã duyệt <span>({statsFromImages.approved})</span></button>
          <button className={`status-tab rejected${statusTab === "rejected" ? " active" : ""}`} onClick={() => setStatusTab("rejected")}>❌ Từ chối <span>({statsFromImages.rejected})</span></button>
          <button className={`status-tab all${statusTab === "all" ? " active" : ""}`} onClick={() => setStatusTab("all")}>📋 Tất cả <span>({statsFromImages.total})</span></button>
        </div>

        <div className="filter-section">
          <div className="filter-row">
            <div className="filter-group">
              <label>Loại chụp:</label>
              <select
                name="studyType"
                value={filters.studyType}
                onChange={handleFilterChange}
              >
                {STUDY_TYPE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Chất lượng:</label>
              <select
                name="quality"
                value={filters.quality}
                onChange={handleFilterChange}
              >
                <option value="">Tất cả</option>
                <option value="Xuất sắc">Xuất sắc</option>
                <option value="Tốt">Tốt</option>
                <option value="Kém">Kém</option>
                <option value="Chưa xác định">Chưa xác định</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Từ ngày:</label>
              <input
                type="date"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
              />
            </div>
            <div className="filter-group">
              <label>Đến ngày:</label>
              <input
                type="date"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
              />
            </div>
            <div className="filter-group">
              <label>Trạng thái:</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="all">Tất cả</option>
                <option value="approved">Đã duyệt</option>
                <option value="pending">Chờ duyệt</option>
                <option value="rejected">Từ chối</option>
              </select>
            </div>
          </div>
          <div className="filter-actions">
            <button onClick={applyFilters} className="btn btn-primary">
              Áp dụng
            </button>
            <button onClick={resetFilters} className="btn btn-secondary">
              Đặt lại
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className="images-table-container">
            <table className="images-table">
              <thead>
                <tr>
                  <th>Hình ảnh</th>
                  <th>Bệnh nhân</th>
                  <th>Loại chụp</th>
                  <th>Vùng chụp</th>
                  <th>Ngày chụp</th>
                  <th>Chất lượng</th>
                  <th>Trạng thái</th>
                  {/* <th>Hành động</th> */}
                </tr>
              </thead>
              <tbody>
                {filteredImages.length > 0 ? (
                  filteredImages.map((image) => (
                    <tr key={image.id}>
                      <td className="image-cell">
                        <div
                          className="thumbnail-wrapper"
                          onClick={() => {
                            setSelectedImage(image);
                            setShowImageModal(true);
                          }}
                        >
                          <img
                            src={image.thumbnail}
                            alt={image.fileName}
                            onError={(e) => {
                              e.target.src = "/placeholder-image.jpg";
                              e.target.onerror = null;
                            }}
                          />
                          <span>{image.fileName}</span>
                        </div>
                      </td>
                      <td>
                        <div className="patient-info">
                          <strong>{image.patientCode}</strong>
                          <span className="patient-name">{image.patientName || "Không rõ"}</span>
                        </div>
                      </td>
                      <td>{image.studyType}</td>
                      <td>{image.bodyPart}</td>
                      <td>{image.captureDate}</td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            backgroundColor: getQualityColor(image.quality),
                          }}
                        >
                          {image.quality}
                        </span>
                      </td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            backgroundColor: getStatusColor(image.status),
                          }}
                        >
                          {image.status}
                        </span>
                      </td>
                      {/* <td className="actions-cell">
                        {image.status === "Chờ duyệt" && (
                          <>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => {
                                setSelectedImage(image);
                                setShowApproveModal(true);
                              }}
                            >
                              Duyệt
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => {
                                setSelectedImage(image);
                                setApprovalNote("");
                                handleApprove(false);
                              }}
                            >
                              Từ chối
                            </button>
                          </>
                        )}
                        <button
                          className="btn btn-info btn-sm"
                          onClick={() => {
                            setSelectedImage(image);
                            setShowImageModal(true);
                          }}
                        >
                          Xem
                        </button>
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-results">
                      Không tìm thấy hình ảnh nào phù hợp
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <ImageModal />
        <ApproveModal />
      </div>
    </LayoutLogin>
  );
};

export default VerifyImages;

