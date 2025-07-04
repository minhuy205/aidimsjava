"use client";

import { useState, useEffect, useCallback } from "react";
import LayoutLogin from "../Layout/LayoutLogin";
import "../../css/verifyImages.css";
import verifyImageService from "../../services/verifyImageService";

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

  // Fetch images from backend
  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const [dicomImportsRes, verifyImagesRes] = await Promise.all([
        fetch("http://localhost:8080/api/verify-image/dicom-imports"),
        fetch("http://localhost:8080/api/verify-image/all"),
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
          patientName: dicomItem.patientName || "",
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
          technicalParams: dicomItem.technicalParams || {},
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

        // Update state
        setImages((prev) =>
          prev.map((img) =>
            img.id === selectedImage.id
              ? {
                  ...img,
                  status: approve ? "Đã duyệt" : "Từ chối",
                  quality: approve
                    ? approvalNote.includes("Xuất sắc")
                      ? "Xuất sắc"
                      : "Tốt"
                    : "Kém",
                  note,
                }
              : img
          )
        );

        setFilteredImages((prev) =>
          prev.filter((img) => img.id !== selectedImage.id)
        );
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
    [selectedImage, approvalNote]
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
            <h3>{selectedImage.fileName}</h3>
            <button
              className="close-btn"
              onClick={() => setShowImageModal(false)}
            >
              &times;
            </button>
          </div>
          <div className="modal-body">
            {selectedImage.filePath ? (
              <img
                src={selectedImage.filePath}
                alt={selectedImage.fileName}
                onError={(e) => {
                  console.error("Failed to load image:", e.target.src);
                  e.target.src = "/placeholder-image.jpg";
                  e.target.onerror = null;
                }}
              />
            ) : (
              <div className="no-image">
                <p>No image available</p>
                <img
                  src="/placeholder-image.jpg"
                  alt="Placeholder"
                  className="placeholder-image"
                />
              </div>
            )}
            <div className="image-info">
              <p>
                <strong>Bệnh nhân:</strong> {selectedImage.patientCode} -{" "}
                {selectedImage.patientName}
              </p>
              <p>
                <strong>Loại chụp:</strong> {selectedImage.studyType}
              </p>
              <p>
                <strong>Vùng chụp:</strong> {selectedImage.bodyPart}
              </p>
              <p>
                <strong>Ngày chụp:</strong> {selectedImage.captureDate}
              </p>
              {selectedImage.note && (
                <p>
                  <strong>Ghi chú:</strong> {selectedImage.note}
                </p>
              )}
            </div>
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

  return (
    <LayoutLogin>
      <div className="verify-images-container">
        <div className="header-section">
          <h1>Duyệt Hình Ảnh Y Tế</h1>
          <p>Xem xét và phê duyệt chất lượng hình ảnh DICOM</p>
        </div>

        <div className="filter-section">
          <div className="filter-row">
            <div className="filter-group">
              <label>Trạng thái:</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="pending">Chờ duyệt</option>
                <option value="approved">Đã duyệt</option>
                <option value="rejected">Từ chối</option>
                <option value="all">Tất cả</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Loại chụp:</label>
              <select
                name="studyType"
                value={filters.studyType}
                onChange={handleFilterChange}
              >
                <option value="">Tất cả</option>
                <option value="X-quang thường">X-quang thường</option>
                <option value="CT Scanner">CT Scanner</option>
                <option value="MRI">MRI</option>
                <option value="Siêu âm">Siêu âm</option>
                <option value="PET-CT">PET-CT</option>
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
                  <th>Hành động</th>
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
                          {image.patientName && (
                            <span>{image.patientName}</span>
                          )}
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
                      <td className="actions-cell">
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
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="no-results">
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