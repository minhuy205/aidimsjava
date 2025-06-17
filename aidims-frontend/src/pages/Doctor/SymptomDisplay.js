"use client"
import { memo, useState, useEffect } from "react"
import Layout from "../Layout/Layout"
import Header from "../Layout/Header" // Import Header component đúng cách
import "../../css/PatientProfile.css"
import "../../css/SymptomDisplay.css"

const SymptomDisplayLayout = () => {

    // Dữ liệu mẫu của bệnh nhân và triệu chứng
    const patientData = {
        id: 1,
        name: "Nguyễn Văn A",
        code: "BN001",
        age: 45,
        gender: "Nam",
        phone: "0123456789",
        chiefComplaint: "Bệnh nhân than phiền đau ngực, khó thở khi gắng sức, kèm theo cảm giác hồi hộp tim đập nhanh. Triệu chứng xuất hiện từ 3 ngày nay và có xu hướng tăng dần.",
        selectedSymptoms: [
            { code: "TM01", name: "Đau ngực", description: "Cảm giác đau, tức ngực", severity: "Nặng" },
            { code: "TM02", name: "Khó thở", description: "Khó thở, thở gấp", severity: "Trung bình" },
            { code: "TM03", name: "Hồi hộp", description: "Tim đập nhanh, hồi hộp", severity: "Nhẹ" },
            { code: "HH04", name: "Thở gấp", description: "Nhịp thở nhanh, khó thở", severity: "Trung bình" },
            { code: "TK02", name: "Chóng mặt", description: "Cảm giác chóng mặt, choáng váng", severity: "Nhẹ" }
        ],
        otherSymptoms: "Bệnh nhân còn có cảm giác mệt mỏi, ăn uống kém, thỉnh thoảng có cảm giác buồn nôn nhẹ vào buổi sáng.",
        examDate: "2025-06-17",
        examTime: "09:30"
    }

    // Danh sách tất cả triệu chứng để tham chiếu
    const allSymptoms = [
        // Tim mạch
        { code: "TM01", name: "Đau ngực", description: "Cảm giác đau, tức ngực", group: "Tim mạch" },
        { code: "TM02", name: "Khó thở", description: "Khó thở, thở gấp", group: "Tim mạch" },
        { code: "TM03", name: "Hồi hộp", description: "Tim đập nhanh, hồi hộp", group: "Tim mạch" },
        { code: "TM04", name: "Phù chân", description: "Sưng phù vùng chân", group: "Tim mạch" },
        // Hô hấp
        { code: "HH01", name: "Ho khan", description: "Ho không có đờm", group: "Hô hấp" },
        { code: "HH02", name: "Ho có đờm", description: "Ho kèm đờm", group: "Hô hấp" },
        { code: "HH03", name: "Thở khò khè", description: "Thở có tiếng khò khè", group: "Hô hấp" },
        { code: "HH04", name: "Thở gấp", description: "Nhịp thở nhanh, khó thở", group: "Hô hấp" },
        // Tiêu hóa
        { code: "TH01", name: "Đau bụng", description: "Đau vùng bụng", group: "Tiêu hóa" },
        { code: "TH02", name: "Buồn nôn", description: "Cảm giác buồn nôn", group: "Tiêu hóa" },
        { code: "TH03", name: "Tiêu chảy", description: "Đi ngoài lỏng nhiều lần", group: "Tiêu hóa" },
        { code: "TH04", name: "Táo bón", description: "Khó đi ngoài, đại tiện cứng", group: "Tiêu hóa" },
        // Thần kinh
        { code: "TK01", name: "Đau đầu", description: "Cảm giác đau đầu", group: "Thần kinh" },
        { code: "TK02", name: "Chóng mặt", description: "Cảm giác chóng mặt, choáng váng", group: "Thần kinh" },
        { code: "TK03", name: "Tê liệt", description: "Mất cảm giác, không cử động được", group: "Thần kinh" },
        { code: "TK04", name: "Co giật", description: "Cơn co giật không kiểm soát", group: "Thần kinh" },
        // Cơ xương khớp
        { code: "CXK01", name: "Đau khớp", description: "Đau vùng khớp", group: "Cơ xương khớp" },
        { code: "CXK02", name: "Sưng khớp", description: "Khớp bị sưng", group: "Cơ xương khớp" },
        { code: "CXK03", name: "Cứng khớp", description: "Khớp bị cứng, khó cử động", group: "Cơ xương khớp" },
        { code: "CXK04", name: "Yếu cơ", description: "Cơ bắp yếu, mất sức", group: "Cơ xương khớp" }
    ]

    const getSeverityColor = (severity) => {
        switch (severity) {
            case "Nặng": return "severity-severe"
            case "Trung bình": return "severity-moderate"
            case "Nhẹ": return "severity-mild"
            default: return "severity-default"
        }
    }

    const groupSymptomsByCategory = () => {
        const grouped = {}
        patientData.selectedSymptoms.forEach(symptom => {
            const fullSymptom = allSymptoms.find(s => s.code === symptom.code)
            if (fullSymptom) {
                if (!grouped[fullSymptom.group]) {
                    grouped[fullSymptom.group] = []
                }
                grouped[fullSymptom.group].push(symptom)
            }
        })
        return grouped
    }

    const groupedSymptoms = groupSymptomsByCategory()

    return (
        <>
            <Header />
            <Layout>
                <div className="doctor-page">
                    <div className="patient-list-container">
                        <div className="symptom-display-container">
                            {/* Header */}
                            <div className="symptom-header">
                                <h1 className="symptom-title">
                                    🩺 Thông tin Triệu chứng Bệnh nhân
                                </h1>
                                <p className="exam-info">
                                    Ngày khám: {patientData.examDate} - {patientData.examTime}
                                </p>
                            </div>

                            {/* Thông tin bệnh nhân */}
                            <div className="patient-info-section">
                                <h2 className="section-title">
                                    👤 Thông tin bệnh nhân
                                </h2>
                                <div className="info-grid">
                                    <div className="info-row">
                                        <span className="info-label">Mã bệnh nhân:</span>
                                        <div className="info-value">{patientData.code}</div>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Họ và tên:</span>
                                        <div className="info-value">{patientData.name}</div>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Tuổi/Giới tính:</span>
                                        <div className="info-value">{patientData.age} tuổi - {patientData.gender}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Triệu chứng chính */}
                            <div className="chief-complaint-section">
                                <h2 className="section-title">
                                    🩺 Triệu chứng chính
                                </h2>
                                <div className="complaint-content">
                                    <p>{patientData.chiefComplaint}</p>
                                </div>
                            </div>

                            {/* Triệu chứng cụ thể */}
                            <div className="symptoms-section">
                                <h2 className="section-title">
                                    📋 Triệu chứng cụ thể ({patientData.selectedSymptoms.length} triệu chứng)
                                </h2>

                                {Object.keys(groupedSymptoms).length > 0 ? (
                                    <div className="symptoms-groups">
                                        {Object.entries(groupedSymptoms).map(([group, symptoms]) => (
                                            <div key={group} className="symptom-group">
                                                <h3 className="group-title">
                                                    <span className="group-badge">
                                                        {group}
                                                    </span>
                                                    ({symptoms.length} triệu chứng)
                                                </h3>
                                                <div className="symptoms-grid">
                                                    {symptoms.map((symptom, index) => (
                                                        <div key={index} className="symptom-card">
                                                            <div className="symptom-header-row">
                                                                <div className="symptom-name">
                                                                    {symptom.name}
                                                                </div>
                                                                <span className={`severity-badge ${getSeverityColor(symptom.severity)}`}>
                                                                    {symptom.severity}
                                                                </span>
                                                            </div>
                                                            <div className="symptom-description">
                                                                {symptom.description}
                                                            </div>
                                                            <div className="symptom-code">
                                                                {symptom.code}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="no-symptoms">
                                        Không có triệu chứng cụ thể nào được ghi nhận
                                    </div>
                                )}
                            </div>

                            {/* Triệu chứng khác */}
                            {patientData.otherSymptoms && (
                                <div className="other-symptoms-section">
                                    <h2 className="section-title">
                                        📝 Triệu chứng khác
                                    </h2>
                                    <div className="other-symptoms-content">
                                        <p>{patientData.otherSymptoms}</p>
                                    </div>
                                </div>
                            )}

                            {/* Tóm tắt */}
                            <div className="symptoms-summary">
                                <h3 className="summary-title">
                                    📊 Tóm tắt triệu chứng
                                </h3>
                                <div className="summary-grid">
                                    <div className="summary-item">
                                        <span className="summary-label">Tổng số triệu chứng:</span>
                                        <div className="summary-value">{patientData.selectedSymptoms.length}</div>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summary-label">Triệu chứng nặng:</span>
                                        <div className="summary-value">
                                            {patientData.selectedSymptoms.filter(s => s.severity === "Nặng").length}
                                        </div>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summary-label">Nhóm triệu chứng:</span>
                                        <div className="summary-value">{Object.keys(groupedSymptoms).length}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default memo(SymptomDisplayLayout)