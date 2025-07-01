// verifyImageService.js
// Service for verify image (kiểm tra hình ảnh) - gọi API backend mới

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api/verify-image";

export const verifyImageService = {
  async saveVerifyImage(data) {
    const res = await fetch(`${API_URL}/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Không thể lưu kiểm tra hình ảnh");
    return await res.json();
  },

  async getAllVerifyImages() {
    const res = await fetch(`${API_URL}/all`);
    if (!res.ok) throw new Error("Không thể lấy danh sách kiểm tra hình ảnh");
    return await res.json();
  },

  async getVerifyImageById(id) {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Không tìm thấy kiểm tra hình ảnh");
    return await res.json();
  },
};
