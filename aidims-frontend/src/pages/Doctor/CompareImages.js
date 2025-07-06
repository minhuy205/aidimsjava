import { memo, useState } from "react";
import LayoutLogin from "../Layout/LayoutLogin";
import "../../css/CompareImages.css";
import ImageEditorModal from "../../components/ImageEditorModal"; // Đảm bảo đúng đường dẫn


const CompareImages = () => {
  const [keyword, setKeyword] = useState("");
  const [dicomImages, setDicomImages] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // NEW: ảnh được chọn để zoom

  const handleSearch = async () => {
    if (!keyword.trim()) return;

    setSearching(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/compare-images/search?keyword=${encodeURIComponent(keyword)}`
      );
      const data = await response.json();
      const sorted = data.sort(
        (a, b) => new Date(a.dateTaken) - new Date(b.dateTaken)
      );
      setDicomImages(sorted);
    } catch (error) {
      console.error("❌ Lỗi khi tìm ảnh DICOM:", error);
      setDicomImages([]);
    } finally {
      setSearching(false);
    }
  };

  return (
    <LayoutLogin>
      <div className="doctor-page">
        <div className="compare-container">
          <h2>🔍 So sánh ảnh DICOM</h2>
          <p>Nhập mã bệnh nhân hoặc tên để tìm tất cả ảnh đã chụp</p>

          <div className="search-bar">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Nhập mã bệnh nhân hoặc tên..."
              className="search-input"
            />
            <button onClick={handleSearch} className="search-button">
              Tìm kiếm
            </button>
          </div>

          {searching && <p>⏳ Đang tìm ảnh...</p>}

          {dicomImages.length > 0 && (
            <div className="comparison-section">
              <h3>Bệnh nhân: {dicomImages[0].fullName}</h3>
              <div className="image-compare">
                {dicomImages.map((img, index) => (
                  <div className="image-box" key={img.id || index}>
                    <h4>
                      {img.dateTaken} - {img.modality || "?"} - {img.bodyPart || "?"}
                    </h4>
                    <img
                      src={img.imageUrl}
                      alt={`DICOM ${index}`}
                      style={{ cursor: "zoom-in" }}
                      onClick={() => setSelectedImage(img.imageUrl)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {dicomImages.length === 0 && !searching && (
            <p>
              Không tìm thấy ảnh cho từ khóa: <b>{keyword}</b>
            </p>
          )}
        </div>

        {/* 🔍 Modal hiển thị ảnh và công cụ vẽ */}
        <ImageEditorModal
          isOpen={!!selectedImage}
          onRequestClose={() => setSelectedImage(null)}
          imageUrl={selectedImage}
        />
      </div>
    </LayoutLogin>
  );
};

export default memo(CompareImages);
