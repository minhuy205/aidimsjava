"use client"
import { memo, useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import Layout from "../Layout/Layout"
import Header from "../Layout/Header"
import { symptomService } from "../../services/symptomService"
import { patientService } from "../../services/patientService"
import "../../css/PatientProfile.css"
import "../../css/SymptomDisplay.css"

const SymptomDisplayLayout = () => {
    const location = useLocation()
    const [patientData, setPatientData] = useState(null)
    const [symptomsData, setSymptomsData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [debugInfo, setDebugInfo] = useState({})

    // Lấy patientId từ URL params
    const getPatientIdFromUrl = () => {
        const urlParams = new URLSearchParams(location.search)
        return urlParams.get('patientId')
    }

    // Test connection trước khi fetch data
    const testApiConnection = async () => {
        try {
            console.log("Testing API connections...")

            // Test symptom API
            const symptomTest = await symptomService.testConnection()
            console.log("Symptom API test successful:", symptomTest)

            // Test patient endpoints
            await patientService.testPatientEndpoints()

            setDebugInfo(prev => ({ ...prev, apiTest: "success", symptomTest }))
            return true
        } catch (error) {
            console.error("API connection test failed:", error)
            setDebugInfo(prev => ({ ...prev, apiTest: "failed", apiError: error.message }))
            return false
        }
    }

    // Fetch patient data và symptoms data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const patientId = getPatientIdFromUrl()

                console.log("Starting fetch data process...")
                console.log("Patient ID from URL:", patientId)

                if (!patientId) {
                    setError("Không tìm thấy ID bệnh nhân trong URL")
                    setDebugInfo(prev => ({ ...prev, patientId: null }))
                    return
                }

                setDebugInfo(prev => ({ ...prev, patientId }))

                // Test API connection trước
                const apiWorking = await testApiConnection()
                if (!apiWorking) {
                    setError("Không thể kết nối đến API server. Vui lòng kiểm tra backend có đang chạy không.")
                    return
                }

                console.log("Fetching patient info...")
                // Fetch patient info với fallback
                let patientInfo
                try {
                    patientInfo = await patientService.getPatientById(patientId)
                    console.log("Patient info received:", patientInfo)
                    setDebugInfo(prev => ({ ...prev, patientFetch: "success", patientInfo }))
                } catch (err) {
                    console.error("Error fetching patient info:", err)
                    setDebugInfo(prev => ({ ...prev, patientFetch: "failed", patientError: err.message }))

                    // FALLBACK: Tạo patient data giả lập
                    console.log("Using fallback patient data...")
                    patientInfo = {
                        patient_id: parseInt(patientId),
                        patient_code: `BN${patientId.padStart(3, '0')}`,
                        full_name: `Bệnh nhân #${patientId}`,
                        date_of_birth: "1990-01-01",
                        gender: "Nam",
                        phone: "0123456789",
                        address: "Địa chỉ không xác định"
                    }
                    setDebugInfo(prev => ({ ...prev, usingFallback: true }))
                }

                console.log("Fetching symptoms...")
                // Fetch symptoms
                let symptoms
                try {
                    symptoms = await symptomService.getSymptomsByPatientId(patientId)
                    console.log("Symptoms received:", symptoms)
                    setDebugInfo(prev => ({ ...prev, symptomsFetch: "success", symptoms }))
                } catch (err) {
                    console.error("Error fetching symptoms:", err)
                    setDebugInfo(prev => ({ ...prev, symptomsFetch: "failed", symptomsError: err.message }))
                    symptoms = []
                }

                // Transform patient data
                const transformedPatient = {
                    id: patientInfo.patient_id,
                    name: patientInfo.full_name,
                    code: patientInfo.patient_code,
                    age: calculateAge(patientInfo.date_of_birth),
                    gender: patientInfo.gender,
                    phone: patientInfo.phone,
                    address: patientInfo.address,
                    examDate: new Date().toISOString().split('T')[0],
                    examTime: new Date().toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                }

                setPatientData(transformedPatient)
                setSymptomsData(symptoms)
                setDebugInfo(prev => ({ ...prev, transformedPatient, finalSymptoms: symptoms }))

            } catch (err) {
                console.error("General error in fetchData:", err)
                setError("Có lỗi xảy ra khi tải dữ liệu: " + err.message)
                setDebugInfo(prev => ({ ...prev, generalError: err.message }))
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [location.search])

    const calculateAge = (dateOfBirth) => {
        if (!dateOfBirth) return "N/A"
        const today = new Date()
        const birthDate = new Date(dateOfBirth)
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }
        return age
    }

    const formatDate = (dateString) => {
        if (!dateString) return "N/A"
        const date = new Date(dateString)
        return date.toLocaleDateString('vi-VN')
    }

    const formatTime = (dateString) => {
        if (!dateString) return "N/A"
        const date = new Date(dateString)
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // Test manual symptom creation
    const handleTestCreateSymptom = async () => {
        try {
            const patientId = getPatientIdFromUrl()
            if (!patientId) {
                alert("Không có patient ID")
                return
            }

            console.log("Testing symptom creation...")
            const testSymptom = await symptomService.createQuickSymptom(
                patientId,
                "Test triệu chứng - " + new Date().toLocaleTimeString(),
                "Chi tiết test tạo lúc " + new Date().toLocaleString(),
                "Triệu chứng khác test"
            )

            console.log("Test symptom created:", testSymptom)
            alert("Tạo triệu chứng test thành công!")

            // Refresh symptoms data
            const updatedSymptoms = await symptomService.getSymptomsByPatientId(patientId)
            setSymptomsData(updatedSymptoms)

        } catch (error) {
            console.error("Error creating test symptom:", error)
            alert("Lỗi tạo triệu chứng test: " + error.message)
        }
    }

    // Loading state
    if (loading) {
        return (
            <>
                <Header />
                <Layout>
                    <div className="doctor-page">
                        <div className="patient-list-container">
                            <div className="symptom-display-container">
                                <div style={{ textAlign: "center", padding: "2rem" }}>
                                    <div>🔄 Đang tải thông tin triệu chứng...</div>
                                    <div style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
                                        <div>Patient ID: {getPatientIdFromUrl()}</div>
                                        <div>API Test: {debugInfo.apiTest || "pending"}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Layout>
            </>
        )
    }

    // Error state với debug info
    if (error) {
        return (
            <>
                <Header />
                <Layout>
                    <div className="doctor-page">
                        <div className="patient-list-container">
                            <div className="symptom-display-container">
                                <div style={{ textAlign: "center", padding: "2rem", color: "red" }}>
                                    <div>❌ {error}</div>

                                    {/* Debug information */}
                                    <div style={{
                                        marginTop: "20px",
                                        padding: "15px",
                                        background: "#f8f9fa",
                                        borderRadius: "8px",
                                        fontSize: "12px",
                                        color: "#333",
                                        textAlign: "left"
                                    }}>
                                        <h4>Debug Information:</h4>
                                        <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
                                    </div>

                                    <div style={{ marginTop: "20px" }}>
                                        <button
                                            onClick={() => window.history.back()}
                                            style={{ marginRight: "10px", padding: "0.5rem 1rem" }}
                                        >
                                            Quay lại
                                        </button>
                                        <button
                                            onClick={() => window.location.reload()}
                                            style={{ padding: "0.5rem 1rem" }}
                                        >
                                            Thử lại
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Layout>
            </>
        )
    }

    // No data state
    if (!patientData) {
        return (
            <>
                <Header />
                <Layout>
                    <div className="doctor-page">
                        <div className="patient-list-container">
                            <div className="symptom-display-container">
                                <div style={{ textAlign: "center", padding: "2rem" }}>
                                    <div>📝 Không tìm thấy thông tin bệnh nhân</div>
                                    <div style={{ marginTop: "15px", fontSize: "14px", color: "#666" }}>
                                        Debug: {JSON.stringify(debugInfo, null, 2)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Layout>
            </>
        )
    }

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
                                {debugInfo.usingFallback && (
                                    <p style={{color: "orange", fontSize: "14px"}}>
                                        ⚠️ Đang sử dụng dữ liệu fallback vì không thể tải thông tin bệnh nhân
                                    </p>
                                )}
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
                                    <div className="info-row">
                                        <span className="info-label">Số điện thoại:</span>
                                        <div className="info-value">{patientData.phone}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Hiển thị triệu chứng từ database */}
                            <div className="symptoms-section">
                                <h2 className="section-title">
                                    📋 Triệu chứng từ cơ sở dữ liệu ({symptomsData.length} bản ghi)
                                </h2>

                                {symptomsData.length > 0 ? (
                                    <div className="symptoms-database">
                                        {symptomsData.map((symptom, index) => (
                                            <div key={symptom.id || index} className="symptom-database-card">
                                                <div className="symptom-card-header">
                                                    <div className="symptom-card-title">
                                                        📝 Bản ghi triệu chứng #{symptom.id}
                                                    </div>
                                                    <div className="symptom-card-date">
                                                        {formatDate(symptom.createdAt)} - {formatTime(symptom.createdAt)}
                                                    </div>
                                                </div>

                                                <div className="symptom-card-content">
                                                    {/* Triệu chứng chính */}
                                                    {symptom.mainSymptom && (
                                                        <div className="symptom-field">
                                                            <div className="field-label">
                                                                🎯 Triệu chứng chính:
                                                            </div>
                                                            <div className="field-value main-symptom">
                                                                {symptom.mainSymptom}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Triệu chứng chi tiết */}
                                                    {symptom.detailedSymptoms && (
                                                        <div className="symptom-field">
                                                            <div className="field-label">
                                                                📋 Triệu chứng chi tiết:
                                                            </div>
                                                            <div className="field-value detailed-symptoms">
                                                                {symptom.detailedSymptoms}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Triệu chứng khác */}
                                                    {symptom.otherSymptoms && (
                                                        <div className="symptom-field">
                                                            <div className="field-label">
                                                                📝 Triệu chứng khác:
                                                            </div>
                                                            <div className="field-value other-symptoms">
                                                                {symptom.otherSymptoms}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="no-symptoms">
                                        <div className="no-symptoms-icon">📝</div>
                                        <div className="no-symptoms-title">Chưa có triệu chứng nào được ghi nhận</div>
                                        <div className="no-symptoms-desc">
                                            Bệnh nhân chưa có thông tin triệu chứng trong hệ thống
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Tóm tắt */}
                            <div className="symptoms-summary">
                                <h3 className="summary-title">
                                    📊 Tóm tắt thông tin
                                </h3>
                                <div className="summary-grid">
                                    <div className="summary-item">
                                        <span className="summary-label">Số bản ghi triệu chứng:</span>
                                        <div className="summary-value">{symptomsData.length}</div>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summary-label">Bản ghi mới nhất:</span>
                                        <div className="summary-value">
                                            {symptomsData.length > 0
                                                ? formatDate(symptomsData[symptomsData.length - 1]?.createdAt)
                                                : "Chưa có"
                                            }
                                        </div>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summary-label">Trạng thái:</span>
                                        <div className="summary-value">
                                            {symptomsData.length > 0 ? "Có dữ liệu" : "Chưa có dữ liệu"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Nút hành động */}
                            <div className="action-buttons">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => window.history.back()}
                                >
                                    ← Quay lại
                                </button>
                             
                                <button className="btn btn-success">
                                    📊 Tạo báo cáo
                                </button>
                            </div>

                            {/* Debug section */}
                            {debugInfo && (
                                <div style={{
                                    marginTop: "20px",
                                    padding: "15px",
                                    background: "#f8f9fa",
                                    borderRadius: "8px",
                                    fontSize: "12px"
                                }}>
                                    <details>
                                        <summary>Debug Information</summary>
                                        <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
                                    </details>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default memo(SymptomDisplayLayout)