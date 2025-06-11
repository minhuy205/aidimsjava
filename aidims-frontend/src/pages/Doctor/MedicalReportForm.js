import { memo, useState, useEffect } from "react";
import Layout from "../Layout/Layout";
import "../../css/MedicalReportForm.css";
import diagnosticReportService from '../../services/diagnosticReportService';

const MedicalReportForm = () => {
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
    const [message, setMessage] = useState({ type: '', text: '' });
    const [reportCode, setReportCode] = useState('BC20241211001');
    const [showReportsList, setShowReportsList] = useState(false);

    // Generate report code when component mounts
    useEffect(() => {
        generateNewReportCode();
    }, []);

    const generateNewReportCode = async () => {
        try {
            const response = await diagnosticReportService.generateReportCode();
            if (response.success) {
                setReportCode(response.data);
            } else {
                // Fallback to generated code
                const newCode = `BC${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
                setReportCode(newCode);
            }
        } catch (error) {
            console.error('Error generating report code:', error);
            // Fallback to generated code
            const newCode = `BC${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
            setReportCode(newCode);
            setMessage({ type: 'error', text: 'Không thể tạo mã báo cáo từ server, sử dụng mã tạm thời' });
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
            // Validate required fields
            if (!formData.firstName || !formData.lastName) {
                throw new Error('Vui lòng nhập đầy đủ họ tên');
            }

            if (!formData.diagnosis) {
                throw new Error('Vui lòng nhập kết quả chẩn đoán');
            }

            // Transform form data to API format
            const apiData = diagnosticReportService.transformFormDataToApi(formData);
            apiData.reportCode = reportCode;

            console.log('🚀 Sending data to API:', apiData);

            // Call real API
            const response = await diagnosticReportService.createReport(apiData);

            if (response.success) {
                setMessage({ type: 'success', text: `Báo cáo ${response.data.reportCode} đã được lưu thành công vào cơ sở dữ liệu!` });

                // Reset form after successful submission
                setTimeout(() => {
                    resetForm();
                    generateNewReportCode();
                }, 3000);
            } else {
                throw new Error(response.message || 'Có lỗi xảy ra khi lưu báo cáo');
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
        setMessage({ type: '', text: '' });
    };

    return (
        <Layout>
            <div className="report-form-page">
                <section className="report-form-section">
                    <h1>📝 Phiếu xét nghiệm bệnh lý</h1>

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
                            <legend>👤 Nhận dạng bệnh nhân</legend>

                            <div className="name-group">
                                <label>
                                    Tên
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="Tên"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                    />
                                </label>
                                <label>
                                    Họ
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Họ"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
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
                                />
                            </label>

                            <label>
                                Giới tính
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
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
                                />
                            </label>
                        </fieldset>

                        {/* Bác sĩ giới thiệu */}
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

                        {/* Lịch sử lâm sàng */}
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
                                ></textarea>
                            </label>
                        </fieldset>

                        {/* Chẩn đoán */}
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