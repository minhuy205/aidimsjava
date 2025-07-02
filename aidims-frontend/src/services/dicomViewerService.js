import axios from 'axios';

// Base URL cho backend API
const API_BASE_URL = 'http://localhost:8080/api/dicom-viewer';

// Tạo axios instance với cấu hình mặc định
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor để xử lý response và error
apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.error('DICOM Viewer API Error:', error);

        if (error.response) {
            // Server trả về error status
            console.error('Response Error:', error.response.data);
            throw new Error(`API Error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
        } else if (error.request) {
            // Request được gửi nhưng không có response
            console.error('Request Error:', error.request);
            throw new Error('Không thể kết nối đến server');
        } else {
            // Lỗi khác
            console.error('Error:', error.message);
            throw new Error(error.message);
        }
    }
);

/**
 * Lấy tất cả DICOM từ bảng dicom_imports
 */
export const getAllDicomViewer = async () => {
    try {
        return await apiClient.get('/all');
    } catch (error) {
        console.error('Lỗi khi lấy danh sách DICOM viewer:', error);
        throw error;
    }
};

/**
 * Lấy DICOM theo ID từ bảng dicom_imports
 */
export const getDicomViewerById = async (id) => {
    try {
        return await apiClient.get(`/${id}`);
    } catch (error) {
        console.error(`Lỗi khi lấy DICOM viewer ID ${id}:`, error);
        throw error;
    }
};

/**
 * Lấy DICOM theo mã bệnh nhân từ bảng dicom_imports
 */
export const getDicomViewerByPatient = async (patientCode) => {
    try {
        return await apiClient.get(`/patient/${patientCode}`);
    } catch (error) {
        console.error(`Lỗi khi lấy DICOM viewer của bệnh nhân ${patientCode}:`, error);
        throw error;
    }
};

/**
 * Lấy DICOM theo loại nghiên cứu từ bảng dicom_imports
 */
export const getDicomViewerByStudyType = async (studyType) => {
    try {
        return await apiClient.get(`/study-type/${studyType}`);
    } catch (error) {
        console.error(`Lỗi khi lấy DICOM viewer loại ${studyType}:`, error);
        throw error;
    }
};

/**
 * Tìm kiếm DICOM theo từ khóa trong bảng dicom_imports
 */
export const searchDicomViewer = async (keyword) => {
    try {
        return await apiClient.get(`/search`, {
            params: { keyword }
        });
    } catch (error) {
        console.error(`Lỗi khi tìm kiếm DICOM viewer với từ khóa ${keyword}:`, error);
        throw error;
    }
};

/**
 * Download file DICOM từ bảng dicom_imports
 */
export const downloadDicomViewerFile = async (fileName) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/download/${fileName}`, {
            responseType: 'blob', // Quan trọng để download file
        });

        // Tạo URL từ blob
        const url = window.URL.createObjectURL(new Blob([response.data]));

        // Tạo link để download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();

        // Cleanup
        link.remove();
        window.URL.revokeObjectURL(url);

        return true;
    } catch (error) {
        console.error(`Lỗi khi download file ${fileName}:`, error);
        throw error;
    }
};

/**
 * Lấy thống kê DICOM từ bảng dicom_imports
 */
export const getDicomViewerStats = async () => {
    try {
        return await apiClient.get('/stats');
    } catch (error) {
        console.error('Lỗi khi lấy thống kê DICOM viewer:', error);
        throw error;
    }
};

/**
 * Lấy URL ảnh DICOM từ bảng dicom_imports
 */
export const getDicomViewerImageUrl = (fileName) => {
    return `${API_BASE_URL}/image/${fileName}`;
};

/**
 * Test kết nối API cho DICOM Viewer
 */
export const testDicomViewerConnection = async () => {
    try {
        const response = await apiClient.get('/test');
        return { success: true, data: response };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

/**
 * Verify image accessibility (kiểm tra ảnh có load được không)
 */
export const verifyImageAccess = async (fileName) => {
    try {
        const imageUrl = getDicomViewerImageUrl(fileName);
        const response = await axios.head(imageUrl);
        return { success: true, url: imageUrl, status: response.status };
    } catch (error) {
        return { success: false, url: getDicomViewerImageUrl(fileName), error: error.message };
    }
};

/**
 * Health check endpoint
 */
export const getDicomViewerHealth = async () => {
    try {
        return await apiClient.get('/health');
    } catch (error) {
        console.error('Lỗi khi kiểm tra health DICOM viewer:', error);
        throw error;
    }
};

// Export default object với tất cả functions
const dicomViewer = {
    getAllDicomViewer,
    getDicomViewerById,
    getDicomViewerByPatient,
    getDicomViewerByStudyType,
    searchDicomViewer,
    downloadDicomViewerFile,
    getDicomViewerStats,
    getDicomViewerImageUrl,
    testDicomViewerConnection,
    verifyImageAccess,
    getDicomViewerHealth
};

export default dicomViewer;