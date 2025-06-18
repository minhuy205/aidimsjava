const API_BASE_URL = "http://localhost:8080/api"

class PatientService {
  // Lấy tất cả bệnh nhân (dùng chung cho cả receptionist và doctor)
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

  // FIXED: Lấy bệnh nhân theo ID - thử nhiều endpoint
  async getPatientById(patientId) {
    const endpoints = [
      `${API_BASE_URL}/receptionist/patients/${patientId}`,
      `${API_BASE_URL}/receptionist/patient/${patientId}`,
      `${API_BASE_URL}/patients/${patientId}`,
      `${API_BASE_URL}/patient/${patientId}`
    ]

    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`)
        const response = await fetch(endpoint)

        if (response.ok) {
          const data = await response.json()
          console.log(`Success with endpoint: ${endpoint}`)
          console.log("Patient data:", data)
          return data
        } else {
          console.log(`Failed ${endpoint}: ${response.status}`)
        }
      } catch (error) {
        console.log(`Error with ${endpoint}:`, error.message)
      }
    }

    throw new Error(`All patient endpoints failed for ID: ${patientId}`)
  }

  // Tạo hoặc cập nhật bệnh nhân
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

  // Xóa bệnh nhân
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

  // THÊM: Test các endpoint có sẵn
  async testPatientEndpoints() {
    const testEndpoints = [
      `${API_BASE_URL}/receptionist/patients`,
      `${API_BASE_URL}/patients`,
      `${API_BASE_URL}/receptionist/patient/2`,
      `${API_BASE_URL}/patient/2`
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
}

export const patientService = new PatientService()