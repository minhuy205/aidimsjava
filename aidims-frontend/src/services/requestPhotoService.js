const API_BASE_URL = 'http://localhost:8080/api'

export const requestPhotoService = {
    // Test kết nối backend
    testConnection: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/request-photo/test`)
            const result = await response.json()
            console.log('Backend connection test:', result)
            return result
        } catch (error) {
            console.error('Backend connection failed:', error)
            throw new Error('Không thể kết nối tới backend. Vui lòng kiểm tra server đã chạy chưa.')
        }
    },

    // Tạo yêu cầu chụp mới
    createRequest: async (requestData) => {
        console.log('=== FRONTEND DEBUG ===')
        console.log('Sending request data:', requestData)
        console.log('API URL:', `${API_BASE_URL}/request-photo`)

        try {
            // Test connection first
            await requestPhotoService.testConnection()

            const response = await fetch(`${API_BASE_URL}/request-photo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            })

            console.log('Response status:', response.status)
            console.log('Response headers:', response.headers)

            // Check if response is JSON
            const contentType = response.headers.get('content-type')
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text()
                console.error('Non-JSON response:', text)
                throw new Error('Server trả về dữ liệu không hợp lệ')
            }

            const result = await response.json()
            console.log('Response data:', result)

            if (!response.ok) {
                throw new Error(result.message || `HTTP ${response.status}: Không thể tạo yêu cầu chụp`)
            }

            return result
        } catch (error) {
            console.error('Error creating request:', error)

            // Enhanced error messages
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Không thể kết nối tới server. Vui lòng kiểm tra:\n1. Backend đã chạy chưa?\n2. URL có đúng không?\n3. CORS có được cấu hình không?')
            }

            throw error
        }
    },

    // Lấy tất cả yêu cầu
    getAllRequests: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/request-photo`)
            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message || 'Không thể lấy danh sách yêu cầu')
            }

            return result.data
        } catch (error) {
            console.error('Error fetching requests:', error)
            throw error
        }
    },

    // Lấy yêu cầu theo ID bệnh nhân
    getRequestsByPatientId: async (patientId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/request-photo/patient/${patientId}`)
            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message || 'Không thể lấy yêu cầu của bệnh nhân')
            }

            return result.data
        } catch (error) {
            console.error('Error fetching patient requests:', error)
            throw error
        }
    },

    // Lấy yêu cầu theo ID
    getRequestById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/request-photo/${id}`)
            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message || 'Không thể lấy thông tin yêu cầu')
            }

            return result.data
        } catch (error) {
            console.error('Error fetching request:', error)
            throw error
        }
    },

    // Cập nhật trạng thái
    updateStatus: async (id, status) => {
        try {
            const response = await fetch(`${API_BASE_URL}/request-photo/${id}/status?status=${status}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message || 'Không thể cập nhật trạng thái')
            }

            return result.data
        } catch (error) {
            console.error('Error updating status:', error)
            throw error
        }
    }
}
