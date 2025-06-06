import React, { useState } from "react";
import Layout from "../Layout/Layout.js";
import "../../css/patientForm.css";

const PatientForm = () => {
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      dob: "1990-01-01",
      gender: "male",
      phone: "0123456789",
      address: "Hà Nội",
    },
    {
      id: 2,
      name: "Trần Thị B",
      dob: "1985-05-20",
      gender: "female",
      phone: "0987654321",
      address: "TP.HCM",
    },
  ]);
  const [form, setForm] = useState({
    name: "",
    dob: "",
    gender: "male",
    phone: "",
    address: "",
  });
  const [editId, setEditId] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      setPatients(
        patients.map((p) => (p.id === editId ? { ...p, ...form } : p))
      );
    } else {
      const newPatient = { ...form, id: Date.now() };
      setPatients([...patients, newPatient]);
    }
    setForm({ name: "", dob: "", gender: "male", phone: "", address: "" });
    setEditId(null);
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name,
      dob: p.dob,
      gender: p.gender,
      phone: p.phone,
      address: p.address,
    });
    setEditId(p.id);
  };

  const handleDelete = (id) => setPatients(patients.filter((p) => p.id !== id));

  const handleRowClick = (patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPatient(null);
  };

  return (
    <Layout>
      <div className="patient-form">
        <h2>📄 Tạo / Cập nhật Hồ sơ bệnh nhân</h2>
        <form onSubmit={handleSubmit}>
          <label>Họ tên:</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label>Ngày sinh:</label>
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            required
          />

          <label>Giới tính:</label>
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>

          <label>Số điện thoại:</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />

          <label>Địa chỉ:</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
          />

          <button type="submit">{editId ? "Cập nhật" : "Lưu hồ sơ"}</button>
        </form>

        <h3 style={{ marginTop: 32 }}>Danh sách bệnh nhân</h3>
        <table>
          <thead>
            <tr>
              <th>Họ tên</th>
              <th>Ngày sinh</th>
              <th>Giới tính</th>
              <th>SĐT</th>
              <th>Địa chỉ</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr
                key={p.id}
                onClick={() => handleRowClick(p)}
                style={{ cursor: "pointer" }}
              >
                <td>{p.name}</td>
                <td>{p.dob}</td>
                <td>
                  {p.gender === "male"
                    ? "Nam"
                    : p.gender === "female"
                    ? "Nữ"
                    : "Khác"}
                </td>
                <td>{p.phone}</td>
                <td>{p.address}</td>
                <td>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(p);
                    }}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(p.id);
                    }}
                    style={{ color: "red" }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

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
                <h3>HỒ SƠ BỆNH NHÂN</h3>
              </div>
              <div className="modal-content">
                <div className="patient-info-section">
                  <div className="info-row">
                    <span className="info-label">Họ và tên:</span>
                    <span className="info-value">{selectedPatient.name}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Ngày sinh:</span>
                    <span className="info-value">{selectedPatient.dob}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Giới tính:</span>
                    <span className="info-value">
                      {selectedPatient.gender === "male"
                        ? "Nam"
                        : selectedPatient.gender === "female"
                        ? "Nữ"
                        : "Khác"}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Số điện thoại:</span>
                    <span className="info-value">{selectedPatient.phone}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Địa chỉ:</span>
                    <span className="info-value">
                      {selectedPatient.address}
                    </span>
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
