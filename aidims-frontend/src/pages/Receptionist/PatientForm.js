"use client";

import { useState, useEffect } from "react";
import Layout from "../Layout/Layout";
import "../../css/patientForm.css";

const PatientForm = () => {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    patient_code: "",
    full_name: "",
    date_of_birth: "",
    gender: "Nam",
    phone: "",
    email: "",
    address: "",
    identity_number: "",
    insurance_number: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    blood_type: "",
    allergies: "",
    medical_history: "",
  });
  const [editId, setEditId] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Lấy danh sách bệnh nhân từ backend khi load trang
  useEffect(() => {
    fetch("http://localhost:8080/api/receptionist/patients")
      .then((res) => res.json())
      .then((data) => {
        console.log("API DATA:", data); // Thêm dòng này để kiểm tra
        setPatients(Array.isArray(data) ? data : []);
      })
      .catch(() => setPatients([]));
  }, []);

  const generatePatientCode = () => {
    if (patients.length === 0) return "BN001";
    const codes = patients
      .map((p) => p.patient_code)
      .filter((code) => typeof code === "string" && code.startsWith("BN"));
    const numbers = codes
      .map((code) => parseInt(code.replace("BN", ""), 10))
      .filter((num) => !isNaN(num));
    const maxNum = numbers.length > 0 ? Math.max(...numbers) : 0;
    return `BN${(maxNum + 1).toString().padStart(3, "0")}`;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      // Cập nhật bệnh nhân
      try {
        const response = await fetch(
          "http://localhost:8080/api/receptionist/patient",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, patient_id: editId }),
          }
        );
        if (!response.ok) throw new Error("Cập nhật bệnh nhân thất bại!");
        const updatedPatient = await response.json();
        setPatients(
          patients.map((p) => (p.patient_id === editId ? updatedPatient : p))
        );
      } catch (error) {
        alert(error.message);
      }
    } else {
      // Thêm mới bệnh nhân
      try {
        const response = await fetch(
          "http://localhost:8080/api/receptionist/patient",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...form,
              patient_code: form.patient_code || generatePatientCode(),
            }),
          }
        );
        if (!response.ok) throw new Error("Thêm bệnh nhân thất bại!");
        const newPatient = await response.json();
        setPatients([...patients, newPatient]);
      } catch (error) {
        alert(error.message);
      }
    }
    // Reset form
    setForm({
      patient_code: "",
      full_name: "",
      date_of_birth: "",
      gender: "Nam",
      phone: "",
      email: "",
      address: "",
      identity_number: "",
      insurance_number: "",
      emergency_contact_name: "",
      emergency_contact_phone: "",
      blood_type: "",
      allergies: "",
      medical_history: "",
    });
    setEditId(null);
  };

  const handleEdit = (patient) => {
    setForm({
      patient_code: patient.patient_code || "",
      full_name: patient.full_name || "",
      date_of_birth: patient.date_of_birth || "",
      gender: patient.gender || "Nam",
      phone: patient.phone || "",
      email: patient.email || "",
      address: patient.address || "",
      identity_number: patient.identity_number || "",
      insurance_number: patient.insurance_number || "",
      emergency_contact_name: patient.emergency_contact_name || "",
      emergency_contact_phone: patient.emergency_contact_phone || "",
      blood_type: patient.blood_type || "",
      allergies: patient.allergies || "",
      medical_history: patient.medical_history || "",
    });
    setEditId(patient.patient_id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa hồ sơ này?")) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/receptionist/patient/${id}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) throw new Error("Xóa bệnh nhân thất bại!");
        setPatients(patients.filter((p) => p.patient_id !== id));
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleRowClick = (patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPatient(null);
  };

  const calculateAge = (date_of_birth) => {
    if (!date_of_birth) return "";
    const today = new Date();
    const birthDate = new Date(date_of_birth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const filteredPatients = patients.filter(
    (patient) =>
      (patient.full_name &&
        patient.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (patient.patient_code &&
        patient.patient_code
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (patient.phone && patient.phone.includes(searchTerm))
  );

  return (
    <Layout>
      <div className="patient-form">
        <div className="page-header">
          <h2>📄 Quản lý Hồ sơ Bệnh nhân</h2>
          <p>Tạo mới và cập nhật thông tin hồ sơ bệnh nhân</p>
        </div>

        <div className="form-container">
          <h3>{editId ? "✏️ Cập nhật hồ sơ" : "➕ Tạo hồ sơ mới"}</h3>
          <form onSubmit={handleSubmit} className="patient-form-grid">
            <div className="form-row">
              <div className="form-group">
                <label>Mã bệnh nhân:</label>
                <input
                  type="text"
                  name="patient_code"
                  value={form.patient_code}
                  onChange={handleChange}
                  placeholder={editId ? "" : generatePatientCode()}
                />
              </div>
              <div className="form-group">
                <label>Họ và tên: *</label>
                <input
                  type="text"
                  name="full_name"
                  value={form.full_name || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Ngày sinh: *</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={form.date_of_birth || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Giới tính:</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Số điện thoại: *</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={form.email || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label>Địa chỉ:</label>
              <input
                type="text"
                name="address"
                value={form.address || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>CMND/CCCD:</label>
                <input
                  type="text"
                  name="identity_number"
                  value={form.identity_number || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Số BHYT:</label>
                <input
                  type="text"
                  name="insurance_number"
                  value={form.insurance_number || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Người liên hệ khẩn cấp:</label>
                <input
                  type="text"
                  name="emergency_contact_name"
                  value={form.emergency_contact_name || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>SĐT người liên hệ:</label>
                <input
                  type="tel"
                  name="emergency_contact_phone"
                  value={form.emergency_contact_phone || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Nhóm máu:</label>
                <select
                  name="blood_type"
                  value={form.blood_type || ""}
                  onChange={handleChange}
                >
                  <option value="">Chọn nhóm máu</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            <div className="form-group full-width">
              <label>Dị ứng:</label>
              <textarea
                name="allergies"
                value={form.allergies || ""}
                onChange={handleChange}
                rows="2"
                placeholder="Ghi rõ các loại dị ứng (nếu có)"
              />
            </div>

            <div className="form-group full-width">
              <label>Tiền sử bệnh:</label>
              <textarea
                name="medical_history"
                value={form.medical_history || ""}
                onChange={handleChange}
                rows="3"
                placeholder="Ghi rõ tiền sử bệnh lý"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editId ? "💾 Cập nhật hồ sơ" : "➕ Lưu hồ sơ"}
              </button>
              {editId && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setForm({
                      patient_code: "",
                      full_name: "",
                      date_of_birth: "",
                      gender: "Nam",
                      phone: "",
                      email: "",
                      address: "",
                      identity_number: "",
                      insurance_number: "",
                      emergency_contact_name: "",
                      emergency_contact_phone: "",
                      blood_type: "",
                      allergies: "",
                      medical_history: "",
                    });
                    setEditId(null);
                  }}
                >
                  ❌ Hủy
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="patient-list-section">
          <div className="list-header">
            <h3>📋 Danh sách bệnh nhân ({filteredPatients.length})</h3>
            <div className="search-box">
              <input
                type="text"
                placeholder="🔍 Tìm kiếm theo tên, mã BN hoặc SĐT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="table-container">
            <table className="patients-table">
              <thead>
                <tr>
                  <th>Mã BN</th>
                  <th>Họ tên</th>
                  <th>Tuổi</th>
                  <th>Giới tính</th>
                  <th>SĐT</th>
                  <th>Địa chỉ</th>
                  <th>Nhóm máu</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr
                    key={patient.patient_id}
                    onClick={() => handleRowClick(patient)}
                    className="patient-row"
                  >
                    <td className="patient-code">{patient.patient_code}</td>
                    <td className="patient-name">{patient.full_name}</td>
                    <td>{patient.age}</td>
                    <td>{patient.gender}</td>
                    <td>{patient.phone}</td>
                    <td className="address-cell">{patient.address}</td>
                    <td>{patient.blood_type}</td>
                    <td className="actions-cell">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(patient);
                        }}
                        className="btn-edit"
                        title="Sửa"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(patient.patient_id);
                        }}
                        className="btn-delete"
                        title="Xóa"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Patient Detail Modal */}
        {showModal && selectedPatient && (
          <div className="modal-overlay" onClick={closeModal}>
            <div
              className="medical-record-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <button className="close-btn" onClick={closeModal}>
                  ×
                </button>
                <h3>🏥 HỒ SƠ BỆNH NHÂN</h3>
                <p>Mã bệnh nhân: {selectedPatient.patient_code}</p>
              </div>

              <div className="modal-content">
                <div className="patient-info-section">
                  <h4>📋 THÔNG TIN CHI TIẾT</h4>

                  <div className="info-grid">
                    <div className="info-row">
                      <span className="info-label">Họ và tên:</span>
                      <span className="info-value">
                        {selectedPatient.full_name}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Mã bệnh nhân:</span>
                      <span className="info-value">
                        {selectedPatient.patient_code}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Ngày sinh:</span>
                      <span className="info-value">
                        {selectedPatient.date_of_birth}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Tuổi:</span>
                      <span className="info-value">{selectedPatient.age} tuổi</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Giới tính:</span>
                      <span className="info-value">
                        {selectedPatient.gender}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Số điện thoại:</span>
                      <span className="info-value">
                        {selectedPatient.phone}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Email:</span>
                      <span className="info-value">
                        {selectedPatient.email || "Chưa có"}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Địa chỉ:</span>
                      <span className="info-value">
                        {selectedPatient.address}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">CMND/CCCD:</span>
                      <span className="info-value">
                        {selectedPatient.identity_number}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Số BHYT:</span>
                      <span className="info-value">
                        {selectedPatient.insurance_number}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Nhóm máu:</span>
                      <span className="info-value">
                        {selectedPatient.blood_type}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">
                        Người liên hệ khẩn cấp:
                      </span>
                      <span className="info-value">
                        {selectedPatient.emergency_contact_name}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">SĐT người liên hệ:</span>
                      <span className="info-value">
                        {selectedPatient.emergency_contact_phone}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Dị ứng:</span>
                      <span className="info-value">
                        {selectedPatient.allergies || "Không có"}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Tiền sử bệnh:</span>
                      <span className="info-value">
                        {selectedPatient.medical_history || "Không có"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PatientForm;
