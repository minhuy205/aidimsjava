import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api/verify-image";

const verifyImageService = {
  /**
   * Get pending DICOM images for verification
   */
  async getPendingImages(filters = {}) {
    try {
      const response = await axios.get(`${API_BASE_URL}/pending`, {
        params: filters,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      return response.data.map(item => ({
        id: item.id,
        imageName: item.fileName,
        patientId: item.patientId || 'BN' + Math.floor(100 + Math.random() * 900),
        modality: item.modality || 'CT',
        bodyPart: item.bodyPart || 'Khác',
        studyDate: item.studyDate ? new Date(item.studyDate).toLocaleDateString() : '01/01/2023',
        quality: this.mapQuality(item.quality),
        status: this.mapStatus(item.status),
        imageUrl: `${API_BASE_URL}/image/${item.id}?thumbnail=true`,
        fullImageUrl: `${API_BASE_URL}/image/${item.id}`
      }));
      
    } catch (error) {
      console.error('[DICOM Service] Lỗi khi lấy hình ảnh:', error);
      throw new Error(error.response?.data?.message || 'Không thể tải danh sách hình ảnh');
    }
  },
/**
   * Upload DICOM file to both backend and frontend public folder
   */
  async uploadDicomFile(file) {
    try {
      // 1. First upload to backend
      const formData = new FormData();
      formData.append('file', file);
      
      const backendResponse = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      // 2. Then save to frontend public folder
      await this.saveToFrontendPublicFolder(file);

      return backendResponse.data;
    } catch (error) {
      console.error('[DICOM Service] Upload error:', error);
      throw new Error(error.response?.data?.message || 'Upload failed');
    }
  },

  /**
   * Save file to frontend public/dicom_uploads folder
   */
  async saveToFrontendPublicFolder(file) {
    return new Promise((resolve, reject) => {
      try {
        // Create directory if not exists
        const fs = window.require('fs');
        const path = window.require('path');
        
        const uploadDir = path.join(process.env.PUBLIC_URL, 'dicom_uploads');
        
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Create file stream
        const filePath = path.join(uploadDir, file.name);
        const fileStream = fs.createWriteStream(filePath);
        
        fileStream.on('finish', () => resolve(filePath));
        fileStream.on('error', (error) => reject(error));
        
        // Write file
        const reader = new FileReader();
        reader.onload = (event) => {
          const buffer = Buffer.from(event.target.result);
          fileStream.write(buffer);
          fileStream.end();
        };
        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.error('Error saving to frontend:', error);
        reject(error);
      }
    });
  },
  /**
   * Approve an image
   */
  async approveImage(imageId) {
    return this.updateImageStatus(imageId, 'approved');
  },

  /**
   * Reject an image
   */
  async rejectImage(imageId) {
    return this.updateImageStatus(imageId, 'rejected');
  },

  /**
   * Update image status
   */
  async updateImageStatus(imageId, status) {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/${imageId}/status`,
        { status },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`[DICOM Service] Lỗi khi cập nhật trạng thái (${status}):`, error);
      throw new Error(error.response?.data?.message || `Không thể ${status === 'approved' ? 'duyệt' : 'từ chối'} hình ảnh`);
    }
  },

  /**
   * Save verify image (duyệt hoặc từ chối kèm note)
   */
  async saveVerifyImage(data) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/save`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`[DICOM Service] Lỗi khi lưu kết quả duyệt ảnh:`, error);
      throw new Error(error.response?.data?.message || 'Không thể lưu kết quả duyệt ảnh');
    }
  },

  // Helper methods
  mapQuality(quality) {
    const qualityMap = {
      'good': 'Tốt',
      'poor': 'Kém',
      'unacceptable': 'Không chấp nhận',
      'undefined': 'Chưa xác định'
    };
    return qualityMap[quality] || 'Chưa xác định';
  },

  mapStatus(status) {
    const statusMap = {
      'pending': 'Chờ duyệt',
      'approved': 'Đã duyệt',
      'rejected': 'Đã từ chối'
    };
    return statusMap[status] || 'Chờ duyệt';
  }
};

export default verifyImageService;