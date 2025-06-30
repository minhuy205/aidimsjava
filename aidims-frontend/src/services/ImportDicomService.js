const API_BASE = "http://localhost:8080/api/dicom-import";

/**
 * Lấy danh sách tất cả DICOM đã import (tùy thuộc vào backend hỗ trợ endpoint này)
 */
export async function getAllDicoms() {
  const res = await fetch(`${API_BASE}/all`);
  if (!res.ok) throw new Error("Lỗi khi gọi API DICOM");
  return await res.json();
}

/**
 * Tải file DICOM từ đường dẫn file
 * @param {string} filePath - Đường dẫn file DICOM
 */
export async function downloadDicomFile(filePath) {
  const link = document.createElement("a");
  link.href = filePath;
  link.setAttribute("download", "DICOMFile.dcm");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Gửi dữ liệu import DICOM lên backend (dùng FormData để upload file)
 * @param {FormData} formData - chứa cả file và metadata JSON
 * @returns {string} - thông báo từ backend
 */
export async function importDicom(formData) {
  try {
    const res = await fetch(`${API_BASE}/import`, {
      method: "POST",
      body: formData, // Không đặt Content-Type ở đây, browser sẽ tự gánmultipart/form-data với boundary
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error("Import thất bại: " + errText);
    }

    const resultText = await res.text();
    return resultText || "Import thành công";
  } catch (error) {
    console.error("Lỗi khi import DICOM:", error);
    throw error;
  }
}
