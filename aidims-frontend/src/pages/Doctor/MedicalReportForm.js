import { memo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../Layout/Layout";
import "../../css/MedicalReportForm.css";
import diagnosticReportService from '../../services/diagnosticReportService';
import { patientService } from "../../services/patientService";

const MedicalReportForm = () => {
    const [searchParams] = useSearchParams();

    const [formData, setFormData] = useState({
        // Nhận dạng bệnh nhân
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        address: '',

        // Bác sĩ giới thiệu
        referringDoctor: '',
        doctorSpecialty: '',

        // Lịch sử lâm sàng
        clinicalHistory: '',
        symptoms: [],

        // Chẩn đoán
        diagnosis: '',
        findings: '',
        recommendations: ''
    });

    const [loading, setLoading] = useState(false);
    const [patientLoading, setPatientLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [reportCode, setReportCode] = useState('BC20241211001');
    const [showReportsList, setShowReportsList] = useState(false);
    const [selectedPatientInfo, setSelectedPatientInfo] = useState(null);

    // BƯỚC QUAN TRỌNG: Auto-fill khi component load
    useEffect(() => {
        const patientId = searchParams.get('patientId');
        console.log("URL patientId:", patientId);

        if (patientId) {
            loadPatientData(patientId);
        }

        generateNewReportCode();
    }, [searchParams]);

    const loadPatientData = async (patientId) => {
        try {
            setPatientLoading(true);

            // Fetch patient data from API
            const patientData = await patientService.getPatientById(patientId);

            if (patientData) {
                fillPatientData(patientData);
                setSelectedPatientInfo(patientData);
                setMessage({
                    type: 'success',
                    text: `Đã tự động điền thông tin bệnh nhân: ${patientData.full_name}`
                });
            }
        } catch (error) {
            console.error('Error loading patient data:', error);
            setMessage({
                type: 'error',
                text: 'Không thể tải thông tin bệnh nhân. Vui lòng nhập thủ công.'
            });
        } finally {
            setPatientLoading(false);
        }
    };

    const fillPatientData = (patientData) => {
        // Split full name into first and last name
        const fullName = patientData.full_name || patientData.fullName || '';
        const nameParts = fullName.trim().split(' ');
        const firstName = nameParts.pop() || ''; // Last word as first name
        const lastName = nameParts.join(' ') || ''; // Rest as last name

        setFormData(prev => ({
            ...prev,
            firstName: firstName,
            lastName: lastName,
            dateOfBirth: patientData.date_of_birth || patientData.dateOfBirth || '',
            gender: patientData.gender || '',
            address: patientData.address || '',
            // You can also pre-fill other fields if available
            clinicalHistory: patientData.medical_history || patientData.medicalHistory || ''
        }));
    };

    const generateNewReportCode = async () => {
        try {
            console.log("🔢 Generating new report code...");
            const response = await diagnosticReportService.generateReportCode();
            console.log("🔢 Generate code response:", response);

            // Kiểm tra response structure từ DiagnosticReportController
            if (response && response.data) {
                // API trả về { success: true, message: "...", data: "BC20250624001" }
                setReportCode(response.data);
                console.log("✅ Generated report code from API:", response.data);
            } else if (response && typeof response === 'string') {
                // Trường hợp trả về trực tiếp string
                setReportCode(response);
                console.log("✅ Generated report code (direct):", response);
            } else {
                // Fallback nếu API response không đúng format
                throw new Error("Invalid API response format");
            }
        } catch (error) {
            console.error('❌ Error generating report code from API:', error);
            console.log("🔄 Using fallback method...");

            // Fallback: tạo mã báo cáo ngẫu nhiên
            const today = new Date();
            const dateStr = today.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
            const randomNum = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
            const fallbackCode = `BC${dateStr}${randomNum}`;

            setReportCode(fallbackCode);
            console.log("✅ Generated fallback report code:", fallbackCode);

            setMessage({
                type: 'warning',
                text: `⚠️ Sử dụng mã báo cáo tạm thời: ${fallbackCode}`
            });
        }
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked
                ? [...prev[name], value]
                : prev[name].filter(item => item !== value)
        }));
    };

    const handleCreateReport = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // Validate required fields - SỬA: cho phép lastName trống nếu firstName có
            if (!formData.firstName || (!formData.lastName && formData.firstName.length < 2)) {
                throw new Error('Vui lòng nhập đầy đủ họ tên');
            }

            if (!formData.diagnosis) {
                throw new Error('Vui lòng nhập kết quả chẩn đoán');
            }

            // Sử dụng transformFormDataToApi() có sẵn
            const apiData = diagnosticReportService.transformFormDataToApi(formData);
            apiData.reportCode = reportCode;

            console.log('🚀 Sending data to API:', apiData);

            // Sử dụng createReport() có sẵn
            const response = await diagnosticReportService.createReport(apiData);

            if (response) {
                setMessage({ type: 'success', text: `Báo cáo ${reportCode} đã được lưu thành công vào cơ sở dữ liệu!` });

                setTimeout(() => {
                    resetForm();
                    generateNewReportCode();
                }, 3000);
            } else {
                throw new Error('Có lỗi xảy ra khi lưu báo cáo');
            }

        } catch (error) {
            console.error('❌ Submit error:', error);
            setMessage({ type: 'error', text: `Lỗi: ${error.message}` });
        } finally {
            setLoading(false);
        }
    };

    const handleViewReports = () => {
        setShowReportsList(!showReportsList);
    };

    const resetForm = () => {
        // Don't reset patient info if it was auto-filled
        const patientId = searchParams.get('patientId');

        if (patientId && selectedPatientInfo) {
            // Keep patient info, only reset medical fields
            setFormData(prev => ({
                ...prev,
                referringDoctor: '',
                doctorSpecialty: '',
                symptoms: [],
                diagnosis: '',
                findings: '',
                recommendations: ''
            }));
        } else {
            // Reset everything
            setFormData({
                firstName: '',
                lastName: '',
                dateOfBirth: '',
                gender: '',
                address: '',
                referringDoctor: '',
                doctorSpecialty: '',
                clinicalHistory: '',
                symptoms: [],
                diagnosis: '',
                findings: '',
                recommendations: ''
            });
        }

        setMessage({ type: '', text: '' });
    };

    return (
        <Layout>
            <div className="report-form-page">
                <section className="report-form-section">
                    <h1>📝 Phiếu xét nghiệm bệnh lý</h1>

                    {/* HIỂN THỊ: Thông tin bệnh nhân đã chọn */}
                    {selectedPatientInfo && (
                        <div className="patient-info-banner">
                            <div className="patient-banner">
                                <h3>👤 Bệnh nhân đã chọn</h3>
                                <div className="patient-details">
                                    <span><strong>Tên:</strong> {selectedPatientInfo.full_name || selectedPatientInfo.fullName}</span>
                                    <span><strong>Mã BN:</strong> {selectedPatientInfo.patient_code || selectedPatientInfo.patientCode}</span>
                                    <span><strong>Giới tính:</strong> {selectedPatientInfo.gender}</span>
                                    <span><strong>SĐT:</strong> {selectedPatientInfo.phone}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* HIỂN THỊ: Loading bệnh nhân */}
                    {patientLoading && (
                        <div className="loading-banner">
                            <div>🔄 Đang tải thông tin bệnh nhân...</div>
                        </div>
                    )}

                    {/* Message Display */}
                    {message.text && (
                        <div className={`message ${message.type === 'success' ? 'message-success' : 'message-error'}`}>
                            {message.text}
                        </div>
                    )}

                    {/* Report Code Display */}
                    {reportCode && (
                        <div className="report-code-display">
                            <strong>Mã báo cáo: {reportCode}</strong>
                        </div>
                    )}

                    <form className="report-form" onSubmit={handleCreateReport}>
                        {/* Nhận dạng bệnh nhân */}
                        <fieldset className="form-group">
                            <legend>👤 Nhận dạng bệnh nhân {selectedPatientInfo && <span className="auto-filled">✅ Tự động điền</span>}</legend>

                            <div className="name-group">
                                <label>
                                    Tên
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="Tên"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className={selectedPatientInfo ? 'auto-filled-field' : ''}
                                    />
                                </label>

                            </div>

                            <label>
                                Ngày sinh
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleInputChange}
                                    className={selectedPatientInfo ? 'auto-filled-field' : ''}
                                />
                            </label>

                            <label>
                                Giới tính
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    className={selectedPatientInfo ? 'auto-filled-field' : ''}
                                >
                                    <option value="">-- Chọn giới tính --</option>
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </label>

                            <label>
                                Địa chỉ
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="123 Đường ABC, Quận XYZ"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className={selectedPatientInfo ? 'auto-filled-field' : ''}
                                />
                            </label>
                        </fieldset>

                        {/* Rest of the form remains the same */}
                        <fieldset className="form-group">
                            <legend>🩺 Bác sĩ giới thiệu</legend>

                            <label>
                                Tên bác sĩ giới thiệu
                                <input
                                    type="text"
                                    name="referringDoctor"
                                    placeholder="BS. Nguyễn Văn B"
                                    value={formData.referringDoctor}
                                    onChange={handleInputChange}
                                />
                            </label>

                            <label>
                                Chuyên khoa
                                <select
                                    name="doctorSpecialty"
                                    value={formData.doctorSpecialty}
                                    onChange={handleInputChange}
                                >
                                    <option value="">-- Chọn chuyên khoa --</option>
                                    <option value="Bác sĩ gia đình">Bác sĩ gia đình</option>
                                    <option value="Bác sĩ phẫu thuật">Bác sĩ phẫu thuật</option>
                                    <option value="Bác sĩ ung thư">Bác sĩ ung thư</option>
                                    <option value="Bác sĩ nội khoa">Bác sĩ nội khoa</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </label>
                        </fieldset>

                        <fieldset className="form-group">
                            <legend>📋 Lịch sử lâm sàng</legend>

                            <label>
                                Triệu chứng
                                <div className="symptoms-checkboxes">
                                    {['Sốt', 'Đau', 'Khối u', 'Viêm', 'Khác'].map(symptom => (
                                        <label key={symptom} className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                name="symptoms"
                                                value={symptom}
                                                checked={formData.symptoms.includes(symptom)}
                                                onChange={handleCheckboxChange}
                                            />
                                            {symptom}
                                        </label>
                                    ))}
                                </div>
                            </label>

                            <label>
                                Ghi chú lâm sàng
                                <textarea
                                    name="clinicalHistory"
                                    rows="4"
                                    placeholder="Ví dụ: ho kéo dài, sưng hạch cổ,..."
                                    value={formData.clinicalHistory}
                                    onChange={handleInputChange}
                                    className={selectedPatientInfo ? 'auto-filled-field' : ''}
                                ></textarea>
                            </label>
                        </fieldset>

                        <fieldset className="form-group">
                            <legend>🔍 Chẩn đoán</legend>

                            <label>
                                Kết quả chẩn đoán
                                <textarea
                                    name="diagnosis"
                                    rows="4"
                                    placeholder="Kết quả xét nghiệm, phát hiện bệnh lý hoặc bất thường..."
                                    value={formData.diagnosis}
                                    onChange={handleInputChange}
                                ></textarea>
                            </label>

                            <label>
                                Các phát hiện chi tiết
                                <textarea
                                    name="findings"
                                    rows="3"
                                    placeholder="Chi tiết các phát hiện từ xét nghiệm..."
                                    value={formData.findings}
                                    onChange={handleInputChange}
                                ></textarea>
                            </label>

                            <label>
                                Khuyến nghị
                                <textarea
                                    name="recommendations"
                                    rows="3"
                                    placeholder="Khuyến nghị điều trị hoặc theo dõi..."
                                    value={formData.recommendations}
                                    onChange={handleInputChange}
                                ></textarea>
                            </label>
                        </fieldset>

                        <div className="button-group">
                            <button
                                type="submit"
                                className={`submit-button ${loading ? 'loading' : ''}`}
                                disabled={loading}
                            >
                                {loading ? 'Đang tạo...' : 'Tạo báo cáo'}
                            </button>

                            <button
                                type="button"
                                className="submit-button view-button"
                                onClick={handleViewReports}
                            >
                                Xem báo cáo
                            </button>

                            {!loading && (
                                <button
                                    type="button"
                                    className="submit-button reset-button"
                                    onClick={resetForm}
                                >
                                    Làm mới
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Reports List Section */}
                    {showReportsList && (
                        <div className="reports-list-section">
                            <h2>📋 Danh sách báo cáo</h2>
                            <div className="reports-grid">
                                <div className="report-card">
                                    <h3>BC20241211001</h3>
                                    <p><strong>Bệnh nhân:</strong> Nguyễn Văn A</p>
                                    <p><strong>Ngày tạo:</strong> 11/12/2024</p>
                                    <p><strong>Trạng thái:</strong> <span className="status completed">Hoàn thành</span></p>
                                    <div className="report-actions">
                                        <button className="action-btn view">Xem</button>
                                        <button className="action-btn edit">Sửa</button>
                                        <button className="action-btn delete">Xóa</button>
                                    </div>
                                </div>

                                <div className="report-card">
                                    <h3>BC20241211002</h3>
                                    <p><strong>Bệnh nhân:</strong> Trần Thị B</p>
                                    <p><strong>Ngày tạo:</strong> 11/12/2024</p>
                                    <p><strong>Trạng thái:</strong> <span className="status draft">Bản nháp</span></p>
                                    <div className="report-actions">
                                        <button className="action-btn view">Xem</button>
                                        <button className="action-btn edit">Sửa</button>
                                        <button className="action-btn delete">Xóa</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </Layout>
    );
};

export default memo(MedicalReportForm);