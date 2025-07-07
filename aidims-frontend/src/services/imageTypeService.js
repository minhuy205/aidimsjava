const API_BASE = "http://localhost:8080/api/imaging-types"

export const imageTypeService = {
  getParamsByType: async (imagingType) => {
    const res = await fetch(`${API_BASE}/${imagingType}`)
    if (!res.ok) throw new Error("Không thể lấy thông số kỹ thuật từ image_types")
    return await res.json()
  }
}
