const API_BASE = "http://localhost:8080/api/dicom";

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
 * Gửi thông tin import DICOM lên backend
 * @param {Object} importData - dữ liệu gửi lên backend
 * @returns {string} - thông báo từ server
 */
export async function importDicom(importData) {
  const res = await fetch(`${API_BASE}/import`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(importData)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Import thất bại: ${errorText}`);
  }

  return await res.text();
}
