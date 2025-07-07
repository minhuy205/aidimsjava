"use client"

import { useState, useEffect } from "react"
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import LayoutLogin from "../Layout/LayoutLogin"
import { patientService } from "../../services/patientService"
import { requestPhotoService } from "../../services/requestPhotoService"
import "../../css/CreateImagingRequest.css"

const CreateImagingRequest = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const patientId = searchParams.get('patientId')

    const [patient, setPatient] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [successMessage, setSuccessMessage] = useState(null) // THÊM STATE
    const [formData, setFormData] = useState({
        imagingType: '',
        bodyPart: '',
        priority: 'normal',
        requestDate: new Date().toISOString().split('T')[0],
        clinicalInfo: '',
        notes: ''
    })

    // Load patient information
    useEffect(() => {
        const fetchPatient = async () => {
            try {
                setLoading(true)
                if (!patientId) {
                    setError("Không tìm thấy thông tin bệnh nhân")
                    return
                }

                const patientsData = await patientService.getAllPatients()
                const selectedPatient = patientsData.find(p => p.patient_id == patientId)

                if (!selectedPatient) {
                    setError("Không tìm thấy bệnh nhân")
                    return
                }

                const transformedPatient = {
                    id: selectedPatient.patient_id,
                    patientCode: selectedPatient.patient_code,
                    fullName: selectedPatient.full_name,
                    dateOfBirth: selectedPatient.date_of_birth,
                    gender: selectedPatient.gender,
                    phone: selectedPatient.phone,
                    email: selectedPatient.email,
                    address: selectedPatient.address,
                    identityNumber: selectedPatient.identity_number,
                    insuranceNumber: selectedPatient.insurance_number,
                }

                setPatient(transformedPatient)
            } catch (err) {
                console.error("Lỗi:", err)
                setError("Không thể tải thông tin bệnh nhân")
            } finally {
                setLoading(false)
            }
        }

        fetchPatient()
    }, [patientId])

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

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setSubmitting(true)
            setError(null)

            // Validate form
            if (!formData.imagingType) {
                throw new Error("Vui lòng chọn loại chụp")
            }
            if (!formData.bodyPart) {
                throw new Error("Vui lòng chọn vị trí chụp")
            }
            if (!formData.clinicalInfo.trim()) {
                throw new Error("Vui lòng nhập thông tin lâm sàng")
            }

            // Chuẩn bị dữ liệu gửi lên server - ĐÃ SỬA
            const requestData = {
                patientId: patient.id,
                imagingType: formData.imagingType,
                bodyPart: formData.bodyPart,
                clinicalIndication: formData.clinicalInfo.trim(), // Đổi tên field
                notes: formData.notes.trim() || null,
                priorityLevel: formData.priority,
                requestDate: formData.requestDate,
                status: 'pending'
            }

            console.log('Sending request data:', requestData)

            // Gửi request lên server
            const result = await requestPhotoService.createRequest(requestData)

            console.log('Request created successfully:', result)

            // Hiển thị success message trên UI
            setSuccessMessage(`Tạo yêu cầu chụp thành công! Mã yêu cầu: ${result.data.requestCode}`)

            // Tự động ẩn success message sau 5 giây
            setTimeout(() => {
                setSuccessMessage(null)
            }, 5000)

            // Thông báo thành công
            alert(`✅ Tạo yêu cầu chụp thành công!\nMã yêu cầu: ${result.data.requestCode}`)

            // Reset form
            setFormData({
                imagingType: '',
                bodyPart: '',
                priority: 'normal',
                requestDate: new Date().toISOString().split('T')[0],
                clinicalInfo: '',
                notes: ''
            })

            // Thông báo thành công và hỏi user
            const shouldCreateAnother = window.confirm(
                `✅ Tạo yêu cầu chụp thành công!\n` +
                `Mã yêu cầu: ${result.data.requestCode}\n\n` +
                `Bạn có muốn tạo yêu cầu khác cho bệnh nhân này không?\n` +
                `• OK: Tạo yêu cầu mới\n` +
                `• Cancel: Quay lại trang trước`
            )

            // Reset form
            setFormData({
                imagingType: '',
                bodyPart: '',
                priority: 'normal',
                requestDate: new Date().toISOString().split('T')[0],
                clinicalInfo: '',
                notes: ''
            })

            if (!shouldCreateAnother) {
                // User chọn Cancel -> quay lại trang trước
                navigate(-1)
            }
            // User chọn OK -> ở lại trang với form đã reset

        } catch (err) {
            console.error('Error submitting form:', err)
            setError(err.message || 'Có lỗi xảy ra khi tạo yêu cầu')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <LayoutLogin>

                <div className="create-imaging-page">
                    <div className="imaging-container">
                        <div className="page-header">
                            <h2>📷 Tạo yêu cầu chụp X-quang/CT</h2>
                            <p>Đang tải thông tin bệnh nhân...</p>
                        </div>
                        <div style={{ textAlign: "center", padding: "2rem" }}>
                            <div>🔄 Đang tải...</div>
                        </div>
                    </div>
                </div>
            </LayoutLogin>
        )
    }

    if (error && !patient) {
        return (
            <LayoutLogin>
                <div className="create-imaging-page">
                    <div className="imaging-container">
                        <div className="page-header">
                            <h2>📷 Tạo yêu cầu chụp X-quang/CT</h2>
                            <p>Có lỗi xảy ra</p>
                        </div>
                        <div style={{ textAlign: "center", padding: "2rem", color: "red" }}>
                            <div>❌ {error}</div>
                            <Link to="/Doctor/PatientProfile">
                                <button className="btn btn-secondary" style={{ marginTop: "1rem" }}>
                                    ← Quay lại danh sách bệnh nhân
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </LayoutLogin>
        )
    }

    return (
        <LayoutLogin>
            <button
                onClick={() => window.history.back()}
                style={{
                    position: 'fixed',
                    top: '20px',
                    left: '20px',
                    zIndex: 99999,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    background: '#fff',
                    border: '2px solid #007bff',
                    borderRadius: '8px',
                    color: '#007bff',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                }}
                title="Quay lại"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                <span>Quay lại</span>
            </button>
            <div className="create-imaging-page">
                <div className="imaging-container">
                    <div className="page-header">
                        <h2>📷 Tạo yêu cầu chụp X-quang/CT</h2>
                        <p>Tạo yêu cầu chụp chiếu cho bệnh nhân</p>
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <div style={{
                            backgroundColor: '#e8f5e8',
                            color: '#2d5a2d',
                            padding: '1rem',
                            borderRadius: '4px',
                            marginBottom: '1rem',
                            border: '1px solid #90ee90'
                        }}>
                            ✅ {successMessage}
                        </div>
                    )}

                    {/* Error Display */}
                    {error && (
                        <div style={{
                            backgroundColor: '#fee',
                            color: '#c33',
                            padding: '1rem',
                            borderRadius: '4px',
                            marginBottom: '1rem',
                            border: '1px solid #fcc'
                        }}>
                            ❌ {error}
                        </div>
                    )}

                    {/* Patient Information Card */}
                    <div className="patient-info-card">
                        <h3>👤 Thông tin bệnh nhân</h3>
                        <div className="patient-info-grid">
                            <div className="info-item">
                                <span className="info-label">Mã bệnh nhân:</span>
                                <span className="info-value">{patient?.patientCode}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Họ và tên:</span>
                                <span className="info-value">{patient?.fullName}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Tuổi:</span>
                                <span className="info-value">{calculateAge(patient?.dateOfBirth)} tuổi</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Giới tính:</span>
                                <span className="info-value">{patient?.gender}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Ngày sinh:</span>
                                <span className="info-value">{patient?.dateOfBirth}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Số điện thoại:</span>
                                <span className="info-value">{patient?.phone}</span>
                            </div>
                        </div>
                    </div>

                    {/* Imaging Request Form */}
                    <div className="imaging-form-card">
                        <h3>📋 Thông tin yêu cầu chụp</h3>
                        <form className="imaging-form" onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="imagingType">Loại chụp: <span style={{color: 'red'}}>*</span></label>
                                    <select
                                        id="imagingType"
                                        name="imagingType"
                                        value={formData.imagingType}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">-- Chọn loại chụp --</option>
                                        <option value="x-ray">X-quang</option>
                                        <option value="ct">CT Scan</option>
                                        <option value="mri">MRI</option>
                                        <option value="ultrasound">Siêu âm</option>
                                        <option value="Mammography">Mammography</option>
                                        <option value="Fluoroscopy">Fluoroscopy</option>
                                        <option value="PET-CT">PET-CT</option>
                                        <option value="SPECT">SPECT</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="bodyPart">Vị trí chụp: <span style={{color: 'red'}}>*</span></label>
                                    <select
                                        id="bodyPart"
                                        name="bodyPart"
                                        value={formData.bodyPart}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">-- Chọn vị trí --</option>
                                        <option value="Ngực">Ngực</option>
                                        <option value="Bụng">Bụng</option>
                                        <option value="Đầu">Đầu</option>
                                        <option value="Cột sống">Cột sống</option>
                                        <option value="Tứ chi">Tứ chi</option>
                                        <option value="Khung Chậu">Khung chậu</option>
                                        <option value="other">Khác</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="priority">Mức độ ưu tiên:</label>
                                    <select
                                        id="priority"
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="Bình thường">Bình thường</option>
                                        <option value="Khẩn cấp">Khẩn cấp</option>
                                        <option value="Cấp cứu">Cấp cứu</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="requestDate">Ngày yêu cầu:</label>
                                    <input
                                        type="date"
                                        id="requestDate"
                                        name="requestDate"
                                        value={formData.requestDate}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="clinicalInfo">Thông tin lâm sàng: <span style={{color: 'red'}}>*</span></label>
                                <textarea
                                    id="clinicalInfo"
                                    name="clinicalInfo"
                                    rows="4"
                                    placeholder="Nhập thông tin lâm sàng, triệu chứng, chẩn đoán sơ bộ..."
                                    value={formData.clinicalInfo}
                                    onChange={handleInputChange}
                                    required
                                ></textarea>
                            </div>

                            <div className="form-group">
                                <label htmlFor="notes">Ghi chú thêm:</label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    rows="3"
                                    placeholder="Ghi chú thêm nếu có..."
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>

                            <div className="form-actions">
                                <Link to="/PatientProfile">
                                    <button type="button" className="btn btn-secondary" disabled={submitting}>
                                        ← Quay lại
                                    </button>
                                </Link>

                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? (
                                        <>🔄 Đang gửi...</>
                                    ) : (
                                        <>📤 Gửi yêu cầu chụp</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </LayoutLogin>
    )
}

export default CreateImagingRequest
