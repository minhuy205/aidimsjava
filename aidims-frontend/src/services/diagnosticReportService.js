// src/services/diagnosticReportService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/diagnostic-reports';

// Create axios instance
const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        // Thêm basic auth hoặc token nếu cần
        // 'Authorization': 'Bearer YOUR_TOKEN_HERE'
        // Hoặc cho development có thể thêm:
        'X-Requested-With': 'XMLHttpRequest'
    }
});

// Add request interceptor
apiClient.interceptors.request.use(
    (config) => {
        console.log(`🚀 API Call: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor
apiClient.interceptors.response.use(
    (response) => {
        console.log('✅ API Response:', response.data);
        return response;
    },
    (error) => {
        console.error('❌ API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

const diagnosticReportService = {

    /**
     * Create new diagnostic report
     */
    async createReport(reportData) {
        try {
            console.log('🚀 Creating report with data:', reportData);

            // Try main endpoint first
            let response;
            try {
                response = await apiClient.post('/', reportData);
            } catch (error) {
                console.log('❌ Main endpoint failed, trying alternative...');
                // Try alternative endpoint if main fails
                response = await apiClient.post('/create', reportData);
            }

            console.log('✅ Report created successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error creating report:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể tạo báo cáo');
        }
    },

    /**
     * Generate new report code
     */
    async generateReportCode() {
        try {
            console.log("🔢 Calling API to generate report code...");
            const response = await apiClient.get('/generate-code');
            console.log("🔢 API response:", response.data);

            // API trả về { success: true, message: "...", data: "BC20250624001" }
            if (response.data && response.data.success && response.data.data) {
                return response.data; // Trả về full response để frontend xử lý
            } else {
                throw new Error('Invalid response format from server');
            }
        } catch (error) {
            console.error('❌ Error generating report code:', error);
            throw new Error('Không thể tạo mã báo cáo từ server');
        }
    },

    /**
     * Get all reports - FIX: Gọi endpoint không có dấu / cuối
     */
    async getAllReports() {
        try {
            console.log('📋 Fetching all diagnostic reports...');
            // BỎ dấu / cuối trong endpoint
            const response = await apiClient.get(''); // Thay vì get('/')

            console.log('🔍 Raw API response:', response.data);

            // Backend trả về ApiResponse wrapper: { success: true, message: "...", data: [...] }
            if (response.data && response.data.success && Array.isArray(response.data.data)) {
                console.log('✅ Successfully fetched reports:', response.data.data.length, 'items');
                return {
                    success: true,
                    data: response.data.data,
                    message: response.data.message
                };
            } else {
                console.error('❌ Unexpected response format:', response.data);
                throw new Error('Invalid response format from server');
            }
        } catch (error) {
            console.error('❌ Error fetching reports:', error);
            throw new Error(error.response?.data?.message || 'Không thể lấy danh sách báo cáo');
        }
    },

    /**
     * Get report by ID - FIX: Đảm bảo URL đúng format
     */
    async getReportById(reportId) {
        try {
            console.log(`🔍 Fetching report by ID: ${reportId}`);
            // Đảm bảo không có dấu / thừa
            const response = await apiClient.get(`/${reportId}`);

            // Backend trả về ApiResponse wrapper
            if (response.data && response.data.success && response.data.data) {
                console.log('✅ Successfully fetched report:', response.data.data);
                return {
                    success: true,
                    data: response.data.data,
                    message: response.data.message
                };
            } else {
                throw new Error('Invalid response format from server');
            }
        } catch (error) {
            console.error(`❌ Error fetching report ${reportId}:`, error);
            throw new Error(error.response?.data?.message || `Không thể lấy báo cáo ID ${reportId}`);
        }
    },

    /**
     * Get report statistics - THÊM MỚI
     */
    async getReportStatistics() {
        try {
            console.log('📊 Fetching report statistics...');
            const response = await apiClient.get('/statistics');

            if (response.data && response.data.success && response.data.data) {
                console.log('✅ Successfully fetched statistics:', response.data.data);
                return {
                    success: true,
                    data: response.data.data,
                    message: response.data.message
                };
            } else {
                throw new Error('Invalid response format from server');
            }
        } catch (error) {
            console.error('❌ Error fetching statistics:', error);
            throw new Error(error.response?.data?.message || 'Không thể lấy thống kê báo cáo');
        }
    },

    /**
     * Transform form data to API format
     */
    transformFormDataToApi(formData) {
        // Combine firstName and lastName for full name
        const fullName = `${formData.firstName} ${formData.lastName}`.trim();

        // Join symptoms array to string
        const symptomsText = formData.symptoms.join(', ');

        // Combine all form info into impression field to show in database
        const patientInfo = `Bệnh nhân: ${fullName}`;
        const birthInfo = formData.dateOfBirth ? `Ngày sinh: ${formData.dateOfBirth}` : '';
        const genderInfo = formData.gender ? `Giới tính: ${formData.gender}` : '';
        const addressInfo = formData.address ? `Địa chỉ: ${formData.address}` : '';
        const symptomsInfo = symptomsText ? `Triệu chứng: ${symptomsText}` : '';
        const clinicalInfo = formData.clinicalHistory ? `Lịch sử lâm sàng: ${formData.clinicalHistory}` : '';

        // Combine all info
        const allInfo = [patientInfo, birthInfo, genderInfo, addressInfo, symptomsInfo, clinicalInfo]
            .filter(Boolean)
            .join('\n');

        return {
            resultId: 1,
            findings: formData.diagnosis || 'Chưa có kết quả chẩn đoán',
            impression: allInfo || 'Chưa có thông tin',
            recommendations: formData.recommendations || 'Chưa có khuyến nghị',
            radiologistId: 4,
            // THÊM MỚI: Referring doctor information
            referringDoctorName: formData.referringDoctor || null,
            referringDoctorSpecialty: formData.doctorSpecialty || null
            // BỎ reportType và status - để service tự set default
        };
    }
};

export default diagnosticReportService;