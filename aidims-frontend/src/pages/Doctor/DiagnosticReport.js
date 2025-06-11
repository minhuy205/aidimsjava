import { memo } from "react";
import Layout from "../Layout/Layout";
import "../../css/DiagnosticReport.css";

const DiagnosticReport = () => {
    return (
        <Layout>
            <div className="report-form-page">
                <section className="report-form-section">
                    <h1>📝 Phiếu xét nghiệm bệnh lý</h1>
                    <form className="report-form">
                        {/* Nhận dạng bệnh nhân */}
                        <fieldset className="form-group">
                            <legend>👤 Nhận dạng bệnh nhân</legend>
                            <label>
                                Tên bệnh nhân
                                <input type="text" name="patientName" placeholder="Nguyễn Văn A" />
                            </label>
                            <label>
                                Ngày sinh
                                <input type="date" name="dob" />
                            </label>
                            <label>
                                Giới tính
                                <select name="gender">
                                    <option value="">-- Chọn giới tính --</option>
                                    <option value="male">Nam</option>
                                    <option value="female">Nữ</option>
                                    <option value="other">Khác</option>
                                </select>
                            </label>
                            <label>
                                Địa chỉ
                                <input type="text" name="address" placeholder="123 Đường ABC, Quận XYZ" />
                            </label>
                        </fieldset>

                        {/* Bác sĩ giới thiệu */}
                        <fieldset className="form-group">
                            <legend>🩺 Bác sĩ giới thiệu</legend>
                            <label>
                                Tên bác sĩ giới thiệu
                                <input type="text" name="referringDoctor" placeholder="BS. Nguyễn Văn B" />
                            </label>
                        </fieldset>

                        {/* Lịch sử lâm sàng */}
                        <fieldset className="form-group">
                            <legend>📋 Lịch sử lâm sàng</legend>
                            <label>
                                Ghi chú lâm sàng
                                <textarea name="clinicalHistory" rows="4" placeholder="Ví dụ: ho kéo dài, sưng hạch cổ,..."></textarea>
                            </label>
                        </fieldset>

                        {/* Chẩn đoán */}
                        <fieldset className="form-group">
                            <legend>🔍 Chẩn đoán</legend>
                            <label>
                                Kết quả chẩn đoán
                                <textarea name="diagnosis" rows="4" placeholder="Kết quả xét nghiệm, phát hiện bệnh lý hoặc bất thường..."></textarea>
                            </label>
                        </fieldset>

                        <div className="button-group">
                            <button type="submit" className="submit-button">
                                Tạo báo cáo
                            </button>
                            <button type="submit" className="submit-button">
                                Xem báo cáo
                            </button>
                        </div>

                    </form>
                </section>
            </div>
        </Layout>
    );
};

export default memo(DiagnosticReport);