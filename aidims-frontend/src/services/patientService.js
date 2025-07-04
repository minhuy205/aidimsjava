const API_BASE_URL = "http://localhost:8080/api"

class PatientService {
  // Lấy tất cả bệnh nhân (GIỮ NGUYÊN)
  async getAllPatients() {
    try {
      const response = await fetch(`${API_BASE_URL}/receptionist/patients`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error("Error fetching patients:", error)
      return []
    }
  }

  // Lấy bệnh nhân theo ID - CHỈ DÙNG ENDPOINT ĐANG HOẠT ĐỘNG
  async getPatientById(patientId) {
    // Thử theo thứ tự ưu tiên - endpoint đang hoạt động trước
    const endpoints = [
      `${API_BASE_URL}/receptionist/patients/${patientId}`,  // Endpoint chính
      `${API_BASE_URL}/receptionist/patient/${patientId}`,   // Backup
    ]

    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`)
        const response = await fetch(endpoint)

        if (response.ok) {
          const data = await response.json()
          console.log(`✅ Success with endpoint: ${endpoint}`)
          console.log("Patient data:", data)
          return data
        } else {
          console.log(`❌ Failed ${endpoint}: ${response.status} - ${response.statusText}`)
        }
      } catch (error) {
        console.log(`❌ Error with ${endpoint}:`, error.message)
      }
    }

    // Nếu tất cả endpoint đều fail, thử gọi getAllPatients và filter
    console.log("🔄 All direct endpoints failed, trying to get from patient list...")
    try {
      const allPatients = await this.getAllPatients()
      const patient = allPatients.find(p =>
          p.patient_id === parseInt(patientId) ||
          p.id === parseInt(patientId)
      )

      if (patient) {
        console.log("✅ Found patient from list:", patient)
        return patient
      }
    } catch (error) {
      console.log("❌ Fallback method also failed:", error.message)
    }

    throw new Error(`Cannot find patient with ID: ${patientId}`)
  }

  // Tạo hoặc cập nhật bệnh nhân (GIỮ NGUYÊN)
  async createOrUpdatePatient(patientData) {
    try {
      const response = await fetch(`${API_BASE_URL}/receptionist/patient`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error creating/updating patient:", error)
      throw error
    }
  }

  // Xóa bệnh nhân (GIỮ NGUYÊN)
  async deletePatient(patientId) {
    try {
      const response = await fetch(`${API_BASE_URL}/receptionist/patient/${patientId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return true
    } catch (error) {
      console.error("Error deleting patient:", error)
      throw error
    }
  }

  // Test các endpoint có sẵn (GIỮ NGUYÊN)
  async testPatientEndpoints() {
    const testEndpoints = [
      `${API_BASE_URL}/receptionist/patients`,
      `${API_BASE_URL}/patients`,
      `${API_BASE_URL}/receptionist/patient/10`,
      `${API_BASE_URL}/patient/10`
    ]

    console.log("Testing patient endpoints...")

    for (const endpoint of testEndpoints) {
      try {
        const response = await fetch(endpoint)
        console.log(`${endpoint} -> Status: ${response.status}`)

        if (response.ok) {
          const data = await response.json()
          console.log(`${endpoint} -> Data:`, data)
        }
      } catch (error) {
        console.log(`${endpoint} -> Error:`, error.message)
      }
    }
  }

  // THÊM: Test connection cho debug
  async testConnection() {
    try {
      console.log("Testing patient service connection...")
      const response = await fetch(`${API_BASE_URL}/receptionist/patients`)
      console.log("Connection test result:", response.status)
      return response.ok
    } catch (error) {
      console.error("Connection test failed:", error)
      return false
    }
  }
}

export const patientService = new PatientService()