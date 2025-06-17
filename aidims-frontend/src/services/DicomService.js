const API_BASE = "http://localhost:8080/api/dicom";

export async function getAllDicoms() {
  const res = await fetch(`${API_BASE}/all`);
  if (!res.ok) throw new Error("Lỗi khi gọi API DICOM");
  return await res.json();
}

export async function downloadDicomFile(filePath) {
  const link = document.createElement("a");
  link.href = filePath;
  link.setAttribute("download", "DICOMFile.dcm");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
