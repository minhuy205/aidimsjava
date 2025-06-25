const API_BASE_URL = "http://localhost:8080/api";

class AssignmentService {
  // Lấy danh sách chuyển hồ sơ (doctor assignments)
  async getAllAssignments() {
    try {
      const response = await fetch(`${API_BASE_URL}/receptionist/assignments`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching assignments:", error);
      return [];
    }
  }

  // Tạo mới chuyển hồ sơ
  async createAssignment({ patientId, doctorId, department }) {
    // Gọi đúng API backend dạng query string, thêm header Accept để nhận lỗi chi tiết
    const url = `${API_BASE_URL}/receptionist/assign?patientId=${patientId}&doctorId=${doctorId}&department=${encodeURIComponent(department)}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Accept": "application/json"
      }
    });
    if (!response.ok) {
      let errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}\n${errorText}`);
    }
    return await response.json();
  }

  // Lấy danh sách bác sĩ từ backend
  async getAllDoctors() {
    const response = await fetch(`${API_BASE_URL}/receptionist/doctors`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  }

  // Lấy danh sách bác sĩ theo chuyên khoa
  async getDoctorsByDepartment(department) {
    const url = `${API_BASE_URL}/receptionist/doctors-by-department?department=${encodeURIComponent(department)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  }
}

export const assignmentService = new AssignmentService();
