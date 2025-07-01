"use client"

import { useState, useEffect } from "react"
import LayoutLogin from "../Layout/LayoutLogin"
import "../../css/verifyImages.css"
import { verifyImageService } from "../../services/verifyImageService"

const VerifyImages = () => {
  const [images, setImages] = useState([])
  const [filteredImages, setFilteredImages] = useState([])
  const [filters, setFilters] = useState({
    status: "",
    studyType: "",
    quality: "",
    dateFrom: "",
    dateTo: "",
  })
  // Modal state
  const [showImageModal, setShowImageModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    // Lấy danh sách ảnh từ backend (dicom_imports)
    fetch("http://localhost:8080/api/verify-image/dicom-imports")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Không thể kết nối API: " + res.status)
        }
        return res.json()
      })
      .then((data) => {
        const imagesFromDb = data.map((item) => ({
          id: item.id,
          fileName: item.fileName || "Không có tên file",
          patientCode: item.patientCode || "",
          patientName: item.patientName || item.patientCode || "",
          studyType: item.studyType || "",
          bodyPart: item.bodyPart || "",
          captureDate: item.importDate ? item.importDate.split("T")[0] : "",
          quality: "Chưa xác định", // Chưa ai kiểm tra
          status: "Chờ kiểm tra",
          technicalParams: item.technicalParams ? (typeof item.technicalParams === 'string' ? JSON.parse(item.technicalParams) : item.technicalParams) : {},
          fileSize: item.fileSize ? (item.fileSize / (1024 * 1024)).toFixed(1) + " MB" : "",
          thumbnail: item.filePath ? `http://localhost:8080${item.filePath}` : "/placeholder.svg?height=150&width=150",
          filePath: item.filePath || "",
        }))
        setImages(imagesFromDb)
        setFilteredImages(imagesFromDb)
      })
      .catch((err) => {
        alert("Lỗi khi lấy danh sách ảnh từ backend: " + err.message)
        setImages([])
        setFilteredImages([])
      })
  }, [])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters({
      ...filters,
      [name]: value,
    })
  }

  const applyFilters = () => {
    let filtered = images

    if (filters.status) {
      filtered = filtered.filter((img) => img.status === filters.status)
    }

    if (filters.studyType) {
      filtered = filtered.filter((img) => img.studyType === filters.studyType)
    }

    if (filters.quality) {
      filtered = filtered.filter((img) => img.quality === filters.quality)
    }

    if (filters.dateFrom) {
      filtered = filtered.filter((img) => img.captureDate >= filters.dateFrom)
    }

    if (filters.dateTo) {
      filtered = filtered.filter((img) => img.captureDate <= filters.dateTo)
    }

    setFilteredImages(filtered)
  }

  const resetFilters = () => {
    setFilters({
      status: "",
      studyType: "",
      quality: "",
      dateFrom: "",
      dateTo: "",
    })
    setFilteredImages(images)
  }

  // Gọi API lưu kiểm tra hình ảnh khi phê duyệt hoặc từ chối
  const updateImageStatus = async (imageId, newStatus, newQuality = null) => {
    // Cập nhật trạng thái trên giao diện ngay lập tức
    const updatedImages = images.map((img) => {
      if (img.id === imageId) {
        return {
          ...img,
          status: newStatus,
          quality: newQuality || img.quality,
        }
      }
      return img
    })
    setImages(updatedImages)
    setFilteredImages(updatedImages)

    // Gọi API lưu kiểm tra hình ảnh vào bảng verify_image
    const img = images.find((img) => img.id === imageId)
    if (img) {
      try {
        await verifyImageService.saveVerifyImage({
          imageId: img.id,
          checkedBy: 1, // TODO: lấy userId thực tế
          result: newStatus,
          note: `Chất lượng: ${newQuality || img.quality}`,
        })
      } catch (err) {
        alert("Lỗi khi lưu kiểm tra hình ảnh: " + err.message)
      }
    }
  }

  const getQualityColor = (quality) => {
    switch (quality) {
      case "Xuất sắc":
        return "#28a745"
      case "Tốt":
        return "#17a2b8"
      case "Kém":
        return "#dc3545"
      default:
        return "#6c757d"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Đã kiểm tra":
        return "#28a745"
      case "Chờ kiểm tra":
        return "#ffc107"
      case "Cần chụp lại":
        return "#dc3545"
      default:
        return "#6c757d"
    }
  }

  return (
    <LayoutLogin>
      <div className="verify-images-page">
        <div className="page-header">
          <h2>✅ Kiểm tra chất lượng hình ảnh</h2>
          <p>Xác minh và đánh giá chất lượng hình ảnh DICOM</p>
        </div>

        <div className="filters-section">
          <div className="filters-grid">
            <div className="filter-group">
              <label>Trạng thái:</label>
              <select name="status" value={filters.status} onChange={handleFilterChange}>
                <option value="">Tất cả</option>
                <option value="Chờ kiểm tra">Chờ kiểm tra</option>
                <option value="Đã kiểm tra">Đã kiểm tra</option>
                <option value="Cần chụp lại">Cần chụp lại</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Loại chụp:</label>
              <select name="studyType" value={filters.studyType} onChange={handleFilterChange}>
                <option value="">Tất cả</option>
                <option value="X-quang thường">X-quang thường</option>
                <option value="CT Scanner">CT Scanner</option>
                <option value="MRI">MRI</option>
                <option value="Siêu âm">Siêu âm</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Chất lượng:</label>
              <select name="quality" value={filters.quality} onChange={handleFilterChange}>
                <option value="">Tất cả</option>
                <option value="Xuất sắc">Xuất sắc</option>
                <option value="Tốt">Tốt</option>
                <option value="Kém">Kém</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Từ ngày:</label>
              <input type="date" name="dateFrom" value={filters.dateFrom} onChange={handleFilterChange} />
            </div>
            <div className="filter-group">
              <label>Đến ngày:</label>
              <input type="date" name="dateTo" value={filters.dateTo} onChange={handleFilterChange} />
            </div>
          </div>
          <div className="filter-actions">
            <button className="btn-filter" onClick={applyFilters}>
              🔍 Lọc
            </button>
            <button className="btn-reset" onClick={resetFilters}>
              🔄 Đặt lại
            </button>
          </div>
        </div>

        <div className="images-grid">
          {filteredImages.map((image) => (
            <div key={image.id} className="image-card">
              <div className="image-preview">
                <img src={image.thumbnail || "/placeholder.svg"} alt={image.fileName} />
                <div className="image-overlay">
                  <div className="overlay-actions">
                    <button className="overlay-btn" onClick={() => { setSelectedImage(image); setShowImageModal(true); }}>👁️ Xem</button>
                    <button className="overlay-btn" onClick={() => { setSelectedImage(image); setShowDetailModal(true); }}>📊 Chi tiết</button>
                  </div>
                </div>
              </div>
              <div className="image-info">
                <div className="image-header">
                  <h4>{image.fileName}</h4>
                  <div className="image-badges">
                    <span className="quality-badge" style={{ backgroundColor: getQualityColor(image.quality) }}>
                      {image.quality}
                    </span>
                    <span className="status-badge" style={{ backgroundColor: getStatusColor(image.status) }}>
                      {image.status}
                    </span>
                  </div>
                </div>
                <div className="image-details">
                  <p>
                    <strong>Bệnh nhân:</strong> {image.patientCode} - {image.patientName}
                  </p>
                  <p>
                    <strong>Loại chụp:</strong> {image.studyType}
                  </p>
                  <p>
                    <strong>Vùng chụp:</strong> {image.bodyPart}
                  </p>
                  <p>
                    <strong>Ngày chụp:</strong> {image.captureDate}
                  </p>
                  <p>
                    <strong>Kích thước:</strong> {image.fileSize}
                  </p>
                </div>
                <div className="technical-params">
                  <h5>Thông số kỹ thuật:</h5>
                  <div className="params-grid">
                    {Object.entries(image.technicalParams).map(([key, value]) => (
                      <span key={key} className="param-item">
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="image-actions">
                  {image.status === "Chờ kiểm tra" && (
                    <>
                      <button className="btn-approve" onClick={() => updateImageStatus(image.id, "Đã kiểm tra", "Tốt")}>
                        ✅ Phê duyệt
                      </button>
                      <button className="btn-reject" onClick={() => updateImageStatus(image.id, "Cần chụp lại", "Kém")}>
                        ❌ Từ chối
                      </button>
                    </>
                  )}
                  {image.status === "Đã kiểm tra" && (
                    <button className="btn-recheck" onClick={() => updateImageStatus(image.id, "Chờ kiểm tra")}>
                      🔄 Kiểm tra lại
                    </button>
                  )}
                  {image.status === "Cần chụp lại" && (
                    <button className="btn-recheck" onClick={() => updateImageStatus(image.id, "Chờ kiểm tra")}>
                      🔄 Kiểm tra lại
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Modal xem ảnh */}
        {showImageModal && selectedImage && (
          <div className="modal-overlay" onClick={() => setShowImageModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <img src={selectedImage.filePath ? `http://localhost:8080${selectedImage.filePath}` : selectedImage.thumbnail} alt={selectedImage.fileName} style={{ maxWidth: '90vw', maxHeight: '80vh' }} />
              <button className="modal-close" onClick={() => setShowImageModal(false)}>Đóng</button>
            </div>
          </div>
        )}
        {/* Modal chi tiết */}
        {showDetailModal && selectedImage && (
          <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h3>Chi tiết hình ảnh</h3>
              <p><strong>Tên file:</strong> {selectedImage.fileName}</p>
              <p><strong>Bệnh nhân:</strong> {selectedImage.patientCode} - {selectedImage.patientName}</p>
              <p><strong>Loại chụp:</strong> {selectedImage.studyType}</p>
              <p><strong>Vùng chụp:</strong> {selectedImage.bodyPart}</p>
              <p><strong>Ngày chụp:</strong> {selectedImage.captureDate}</p>
              <p><strong>Kích thước:</strong> {selectedImage.fileSize}</p>
              <h5>Thông số kỹ thuật:</h5>
              <div className="params-grid">
                {Object.entries(selectedImage.technicalParams).map(([key, value]) => (
                  <span key={key} className="param-item">{key}: {value}</span>
                ))}
              </div>
              <p><strong>Chất lượng:</strong> {selectedImage.quality}</p>
              <button className="modal-close" onClick={() => setShowDetailModal(false)}>Đóng</button>
            </div>
          </div>
        )}

        {filteredImages.length === 0 && (
          <div className="no-results">
            <p>Không tìm thấy hình ảnh nào phù hợp với bộ lọc.</p>
          </div>
        )}
      </div>
    </LayoutLogin>
  )
}

export default VerifyImages
