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

  // Lấy bệnh nhân theo ID
  async getPatientById(patientId) {
    try {
      const response = await fetch(`${API_BASE_URL}/receptionist/patient/${patientId}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Error fetching patient by ID:", error)
      throw error
    }
  }
}

export const patientService = new PatientService()
