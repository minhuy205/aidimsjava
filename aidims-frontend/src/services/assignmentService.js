const API_BASE_URL = "http://localhost:8080/api";

class AssignmentService {
  // Lấy danh sách chuyển hồ sơ (doctor assignments)
  async getAllAssignments() {
    try {
      const response = await fetch(`${API_BASE_URL}/doctor-assignments`);
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
  async createAssignment(assignmentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/doctor-assignments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assignmentData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error creating assignment:", error);
      throw error;
    }
  }
}

export const assignmentService = new AssignmentService();
