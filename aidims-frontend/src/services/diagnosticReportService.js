// src/services/diagnosticReportService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/diagnostic-reports';

// Create axios instance
const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
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
            const response = await apiClient.get('/generate-code');
            return response.data;
        } catch (error) {
            throw new Error('Không thể tạo mã báo cáo');
        }
    },

    /**
     * Get all reports
     */
    async getAllReports() {
        try {
            const response = await apiClient.get('/');
            return response.data;
        } catch (error) {
            throw new Error('Không thể lấy danh sách báo cáo');
        }
    },

    /**
     * Get report by ID
     */
    async getReportById(reportId) {
        try {
            const response = await apiClient.get(`/${reportId}`);
            return response.data;
        } catch (error) {
            throw new Error(`Không thể lấy báo cáo ID ${reportId}`);
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
        const doctorInfo = formData.referringDoctor ? `Bác sĩ: ${formData.referringDoctor}` : '';
        const specialtyInfo = formData.doctorSpecialty ? `Chuyên khoa: ${formData.doctorSpecialty}` : '';
        const symptomsInfo = symptomsText ? `Triệu chứng: ${symptomsText}` : '';
        const clinicalInfo = formData.clinicalHistory ? `Lịch sử lâm sàng: ${formData.clinicalHistory}` : '';

        // Combine all info
        const allInfo = [patientInfo, birthInfo, genderInfo, addressInfo, doctorInfo, specialtyInfo, symptomsInfo, clinicalInfo]
            .filter(Boolean)
            .join('\n');

        return {
            resultId: 1,
            findings: formData.diagnosis || 'Chưa có kết quả chẩn đoán',
            impression: allInfo || 'Chưa có thông tin',
            recommendations: formData.recommendations || 'Chưa có khuyến nghị',
            radiologistId: 4
            // BỎ reportType và status - để service tự set default
        };
    },

    /**
     * Check API connection
     */
    async checkConnection() {
        try {
            const response = await apiClient.get('/statistics');
            return response.status === 200;
        } catch (error) {
            console.error('API Connection Failed:', error);
            return false;
        }
    }
};

export default diagnosticReportService;