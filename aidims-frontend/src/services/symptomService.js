const API_BASE_URL = "http://localhost:8080/api"

class SymptomService {

    // Test connection đến API
    async testConnection() {
        try {
            console.log("Testing connection to:", `${API_BASE_URL}/symptom-record/test`)
            const response = await fetch(`${API_BASE_URL}/symptom-record/test`)

            console.log("Test response status:", response.status)

            if (!response.ok) {
                throw new Error(`Test connection failed! status: ${response.status}`)
            }

            const data = await response.json()
            console.log("Test connection successful:", data)
            return data
        } catch (error) {
            console.error("Test connection error:", error)
            throw error
        }
    }

    // Lấy tất cả triệu chứng theo patient_id
    async getSymptomsByPatientId(patientId) {
        try {
            console.log("Fetching symptoms for patient ID:", patientId)
            console.log("API URL:", `${API_BASE_URL}/symptom-record/patient/${patientId}`)

            const response = await fetch(`${API_BASE_URL}/symptom-record/patient/${patientId}`)

            console.log("Response status:", response.status)

            if (!response.ok) {
                const errorText = await response.text()
                console.error("API Error Response:", errorText)
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
            }

            const data = await response.json()
            console.log("Symptoms data received:", data)
            return Array.isArray(data) ? data : []
        } catch (error) {
            console.error("Error fetching symptoms by patient ID:", error)

            // Check if it's a network error
            if (error.message.includes('Failed to fetch')) {
                console.error("Network error - check if backend is running on port 8080")
            }

            return []
        }
    }

    // Lấy triệu chứng mới nhất theo patient_id
    async getLatestSymptomsByPatientId(patientId) {
        try {
            console.log("Fetching latest symptoms for patient ID:", patientId)

            const response = await fetch(`${API_BASE_URL}/symptom-record/patient/${patientId}/latest`)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            console.log("Latest symptoms data:", data)
            return Array.isArray(data) ? data : []
        } catch (error) {
            console.error("Error fetching latest symptoms by patient ID:", error)
            return []
        }
    }

    // Lấy triệu chứng theo ID
    async getSymptomById(symptomId) {
        try {
            console.log("Fetching symptom by ID:", symptomId)

            const response = await fetch(`${API_BASE_URL}/symptom-record/${symptomId}`)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error("Error fetching symptom by ID:", error)
            throw error
        }
    }

    // Tạo triệu chứng mới
    async createSymptom(symptomData) {
        try {
            console.log("Creating symptom:", symptomData)

            const response = await fetch(`${API_BASE_URL}/symptom-record`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(symptomData),
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
            }

            const result = await response.json()
            console.log("Symptom created successfully:", result)
            return result
        } catch (error) {
            console.error("Error creating symptom:", error)
            throw error
        }
    }

    // Kiểm tra bệnh nhân có triệu chứng hay không
    async checkSymptomsExist(patientId) {
        try {
            console.log("Checking symptoms existence for patient:", patientId)

            const response = await fetch(`${API_BASE_URL}/symptom-record/patient/${patientId}/exists`)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()
            console.log("Symptoms existence check result:", result)
            return result
        } catch (error) {
            console.error("Error checking symptoms existence:", error)
            return { hasSymptoms: false, count: 0 }
        }
    }

    // Tạo triệu chứng nhanh
    async createQuickSymptom(patientId, mainSymptom, detailedSymptoms, otherSymptoms) {
        try {
            const symptomData = {
                patientId: parseInt(patientId),
                mainSymptom: mainSymptom || "Chưa xác định",
                detailedSymptoms: detailedSymptoms || "",
                otherSymptoms: otherSymptoms || ""
            }

            console.log("Creating quick symptom:", symptomData)

            const response = await fetch(`${API_BASE_URL}/symptom-record/quick`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(symptomData),
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
            }

            const result = await response.json()
            console.log("Quick symptom created successfully:", result)
            return result
        } catch (error) {
            console.error("Error creating quick symptom:", error)
            throw error
        }
    }

    // Xóa triệu chứng
    async deleteSymptom(symptomId) {
        try {
            console.log("Deleting symptom:", symptomId)

            const response = await fetch(`${API_BASE_URL}/symptom-record/${symptomId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            console.log("Symptom deleted successfully")
            return true
        } catch (error) {
            console.error("Error deleting symptom:", error)
            throw error
        }
    }

    // Tạo triệu chứng từ form React
async createSymptomRecord(symptomData) {
  try {
    const response = await fetch(`${API_BASE_URL}/symptom-record/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(symptomData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Created record:", result); // Kiểm tra dữ liệu trả về
    return result;
  } catch (error) {
    console.error("Error creating symptom record:", error);
    throw error;
  }
}

 // Lấy tất cả triệu chứng
    async getAllSymptoms() {
        try {
            const response = await fetch(`${API_BASE_URL}/symptom-record`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error("Error fetching all symptoms:", error);
            return [];
        }
    }
}


export const symptomService = new SymptomService()