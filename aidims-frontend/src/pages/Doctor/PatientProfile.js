import React, { memo, useState } from "react";
import "../../css/PatientProfile.css";
import "../../css/indexDoctor.css"

const PatientProfile = () => {
    // Dữ liệu mẫu với thông tin chi tiết hơn
    const patients = [
        {
            id: "1",
            name: "Nguyễn Văn A",
            age: 30,
            gender: "Nam",
            phone: "0912345678",
            ethnicity: "Kinh",
            address: "123 Nguyễn Huệ, Q.1, TP.HCM",
            birthMonth: "03",
            birthYear: "1994",
            height: "170",
            weight: "65",
            chiefComplaint: "Đau đầu, mệt mỏi",
            medicalHistory: {
                repeat: true,
                rescheduled: false,
                formsCompleted: true,
                neckShoulderPain: true
            },
            bookingInfo: {
                date: "01/03/23",
                time: "11:37 AM",
                doctor: "Kaley Berry",
                updateDate: "03/03/23",
                updateTime: "03:25 PM",
                updatedBy: "Kaley Berry"
            }
        },
        {
            id: "2",
            name: "Trần Thị B",
            age: 25,
            gender: "Nữ",
            phone: "0987654321",
            ethnicity: "Kinh",
            address: "456 Lê Lợi, Q.3, TP.HCM",
            birthMonth: "07",
            birthYear: "1999",
            height: "160",
            weight: "52",
            chiefComplaint: "Ho kéo dài, sốt nhẹ",
            medicalHistory: {
                repeat: false,
                rescheduled: true,
                formsCompleted: true,
                neckShoulderPain: false
            },
            bookingInfo: {
                date: "02/03/23",
                time: "09:00 AM",
                doctor: "Kaley Berry",
                updateDate: "02/03/23",
                updateTime: "10:30 AM",
                updatedBy: "Kaley Berry"
            }
        },
        {
            id: "3",
            name: "Lê Văn C",
            age: 40,
            gender: "Nam",
            phone: "0909090909",
            ethnicity: "Kinh",
            address: "789 Trần Hưng Đạo, Q.5, TP.HCM",
            birthMonth: "12",
            birthYear: "1984",
            height: "175",
            weight: "78",
            chiefComplaint: "Đau lưng, khó ngủ",
            medicalHistory: {
                repeat: true,
                rescheduled: false,
                formsCompleted: false,
                neckShoulderPain: true
            },
            bookingInfo: {
                date: "03/03/23",
                time: "02:00 PM",
                doctor: "Kaley Berry",
                updateDate: "03/03/23",
                updateTime: "02:15 PM",
                updatedBy: "Kaley Berry"
            }
        },
        {
            id: "4",
            name: "Phạm Thị D",
            age: 35,
            gender: "Nữ",
            phone: "0901234567",
            ethnicity: "Kinh",
            address: "321 Võ Văn Tần, Q.3, TP.HCM",
            birthMonth: "05",
            birthYear: "1989",
            height: "165",
            weight: "58",
            chiefComplaint: "Đau bụng, buồn nôn",
            medicalHistory: {
                repeat: false,
                rescheduled: false,
                formsCompleted: true,
                neckShoulderPain: false
            },
            bookingInfo: {
                date: "04/03/23",
                time: "10:30 AM",
                doctor: "Kaley Berry",
                updateDate: "04/03/23",
                updateTime: "11:00 AM",
                updatedBy: "Kaley Berry"
            }
        }
    ];

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handlePatientClick = (patient) => {
        setSelectedPatient(patient);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedPatient(null);
    };

    return (
        <div className="doctor-page">

            {/* Header Navigation */}
            <nav className="navbar">
                <div className="nav-container">
                    <div className="nav-logo">
                        <a href="/"><h2>🏥 AIDIMS</h2></a>
                    </div>
                    <ul className="nav-menu">
                        <li><a href="/">Trang chủ</a></li>
                        <li><a href="/about">Giới thiệu</a></li>
                        <li><a href="/Features">Tính năng</a></li>
                        <li><a href="/Contact">Liên hệ</a></li>
                        <li><a href="/LoginRegister" className="login-btn">Đăng nhập</a></li>
                    </ul>
                </div>
            </nav>

            {/* Patient List Table */}
            <div className="patient-list-container">
                <h2>Danh sách bệnh nhân</h2>
                <table className="patient-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Tuổi</th>
                        <th>Giới tính</th>
                    </tr>
                    </thead>
                    <tbody>
                    {patients.map((patient) => (
                        <tr key={patient.id} onClick={() => handlePatientClick(patient)}>
                            <td>{patient.id}</td>
                            <td>{patient.name}</td>
                            <td>{patient.age}</td>
                            <td>{patient.gender}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Medical Record Modal */}
            {showModal && selectedPatient && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="medical-record-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <button className="close-btn" onClick={closeModal}>×</button>
                            <h3>HỒ SƠ BỆNH ÁN</h3>
                            <p>Chi tiết hồ sơ bệnh án</p>
                        </div>

                        <div className="modal-tabs">
                            <div className="tab-item active">
                                <div className="tab-icon">+</div>
                                <span>Điều trị tổng quát</span>
                            </div>
                            <div className="tab-item">
                                <div className="tab-icon">+</div>
                                <span>Bệnh án tổng quát</span>
                            </div>
                        </div>

                        <div className="modal-content">
                            <div className="patient-info-section">
                                <h4>HỒ SƠ:</h4>

                                <div className="info-row">
                                    <span className="info-label">1. Họ và tên</span>
                                    <span className="info-value">{selectedPatient.name.toUpperCase()}</span>
                                    <div className="info-value-group">
                                        <span>Nhịp tim: ___</span>
                                    </div>
                                </div>

                                <div className="info-row">
                                    <span className="info-label">2. Giới tính:</span>
                                    <span className="info-value">{selectedPatient.gender}</span>
                                    <div className="info-value-group">
                                        <span>Nhiệt độ: ___°C</span>
                                    </div>
                                </div>

                                <div className="info-row">
                                    <span className="info-label">3. Dân tộc:</span>
                                    <span className="info-value">{selectedPatient.ethnicity}</span>
                                    <div className="info-value-group">
                                        <span>Huyết áp: ___mmHg</span>
                                    </div>
                                </div>

                                <div className="info-row">
                                    <span className="info-label">4. Số điện thoại:</span>
                                    <span className="info-value">{selectedPatient.phone}</span>
                                    <div className="info-value-group">
                                        <span>Nhịp thở: ___Lần/ph</span>
                                    </div>
                                </div>

                                <div className="info-row">
                                    <span className="info-label">5. Địa chỉ:</span>
                                    <span className="info-value">{selectedPatient.address}</span>
                                </div>

                                <div className="info-row" style={{marginTop: '1rem'}}>
                                    <div className="measurement-input">
                                        <span>Chiều cao: {selectedPatient.height} cm</span>
                                    </div>
                                    <div className="measurement-input" style={{marginLeft: '2rem'}}>
                                        <span>Cân nặng: {selectedPatient.weight} cm</span>
                                    </div>
                                </div>



                                <div className="booking-info">
                                    <p><strong>Booked:</strong> {selectedPatient.bookingInfo.date} at {selectedPatient.bookingInfo.time} by {selectedPatient.bookingInfo.doctor}</p>
                                    <p><strong>Updated:</strong> {selectedPatient.bookingInfo.updateDate} at {selectedPatient.bookingInfo.updateTime} by {selectedPatient.bookingInfo.updatedBy}</p>
                                </div>

                                <div className="signature-section">
                                    Signature
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(PatientProfile);