"use client"

import { useState, useEffect } from "react"
import Layout from "../Layout/Layout"
import "../../css/verifyImages.css"

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

  useEffect(() => {
    // Load images from localStorage or initialize with sample data
    const savedImages = localStorage.getItem("dicomImages")
    if (savedImages) {
      const parsedImages = JSON.parse(savedImages)
      setImages(parsedImages)
      setFilteredImages(parsedImages)
    } else {
      const sampleImages = [
        {
          id: 1,
          fileName: "CT_CHEST_001.dcm",
          patientCode: "BN001",
          patientName: "Nguyễn Văn Nam",
          studyType: "CT Scanner",
          bodyPart: "Ngực",
          captureDate: "2024-12-15",
          quality: "Tốt",
          status: "Chờ kiểm tra",
          technicalParams: {
            kVp: 120,
            mAs: 250,
            sliceThickness: 5,
          },
          fileSize: "25.6 MB",
          thumbnail: "/placeholder.svg?height=150&width=150",
        },
        {
          id: 2,
          fileName: "XRAY_KNEE_002.dcm",
          patientCode: "BN002",
          patientName: "Trần Thị Hoa",
          studyType: "X-quang thường",
          bodyPart: "Khớp gối",
          captureDate: "2024-12-15",
          quality: "Xuất sắc",
          status: "Đã kiểm tra",
          technicalParams: {
            kVp: 80,
            mAs: 10,
          },
          fileSize: "8.2 MB",
          thumbnail: "/placeholder.svg?height=150&width=150",
        },
        {
          id: 3,
          fileName: "MRI_BRAIN_003.dcm",
          patientCode: "BN003",
          patientName: "Lê Minh Tuấn",
          studyType: "MRI",
          bodyPart: "Não",
          captureDate: "2024-12-16",
          quality: "Kém",
          status: "Cần chụp lại",
          technicalParams: {
            fieldStrength: "1.5T",
            sequence: "T1",
            sliceThickness: 3,
          },
          fileSize: "45.8 MB",
          thumbnail: "/placeholder.svg?height=150&width=150",
        },
      ]
      setImages(sampleImages)
      setFilteredImages(sampleImages)
      localStorage.setItem("dicomImages", JSON.stringify(sampleImages))
    }
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

  const updateImageStatus = (imageId, newStatus, newQuality = null) => {
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
    localStorage.setItem("dicomImages", JSON.stringify(updatedImages))
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
    <Layout>
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
                    <button className="overlay-btn">👁️ Xem</button>
                    <button className="overlay-btn">📊 Chi tiết</button>
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

        {filteredImages.length === 0 && (
          <div className="no-results">
            <p>Không tìm thấy hình ảnh nào phù hợp với bộ lọc.</p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default VerifyImages
