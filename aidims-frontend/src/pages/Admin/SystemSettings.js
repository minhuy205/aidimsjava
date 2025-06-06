"use client"

import { useState, useEffect } from "react"
import Layout from "../Layout/Layout"
import "../../css/systemSettings.css"

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    general: {
      systemName: "AIDIMS",
      systemVersion: "1.0.0",
      maintenanceMode: false,
      autoBackup: true,
      backupInterval: "daily",
      maxFileSize: 100, // MB
      sessionTimeout: 30, // minutes
    },
    security: {
      passwordMinLength: 6,
      passwordRequireSpecial: false,
      maxLoginAttempts: 5,
      lockoutDuration: 15, // minutes
      twoFactorAuth: false,
      ipWhitelist: "",
    },
    dicom: {
      autoProcessing: true,
      qualityThreshold: "good",
      compressionLevel: "medium",
      retentionPeriod: 365, // days
      anonymizeData: true,
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      systemAlerts: true,
      maintenanceAlerts: true,
      smtpServer: "smtp.hospital.com",
      smtpPort: 587,
      smtpUsername: "",
      smtpPassword: "",
    },
  })

  const [activeTab, setActiveTab] = useState("general")
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("systemSettings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleSettingChange = (category, setting, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }))
    setHasChanges(true)
  }

  const handleSaveSettings = () => {
    localStorage.setItem("systemSettings", JSON.stringify(settings))
    setHasChanges(false)
    alert("Cài đặt đã được lưu thành công!")
  }

  const handleResetSettings = () => {
    if (window.confirm("Bạn có chắc chắn muốn khôi phục cài đặt mặc định?")) {
      const defaultSettings = {
        general: {
          systemName: "AIDIMS",
          systemVersion: "1.0.0",
          maintenanceMode: false,
          autoBackup: true,
          backupInterval: "daily",
          maxFileSize: 100,
          sessionTimeout: 30,
        },
        security: {
          passwordMinLength: 6,
          passwordRequireSpecial: false,
          maxLoginAttempts: 5,
          lockoutDuration: 15,
          twoFactorAuth: false,
          ipWhitelist: "",
        },
        dicom: {
          autoProcessing: true,
          qualityThreshold: "good",
          compressionLevel: "medium",
          retentionPeriod: 365,
          anonymizeData: true,
        },
        notifications: {
          emailNotifications: true,
          smsNotifications: false,
          systemAlerts: true,
          maintenanceAlerts: true,
          smtpServer: "smtp.hospital.com",
          smtpPort: 587,
          smtpUsername: "",
          smtpPassword: "",
        },
      }
      setSettings(defaultSettings)
      setHasChanges(true)
    }
  }

  return (
    <Layout>
      <div className="system-settings-page">
        <div className="page-header">
          <h2>⚙️ Cấu hình Hệ thống</h2>
          <p>Thiết lập và tùy chỉnh các thông số hoạt động của hệ thống AIDIMS</p>
        </div>

        <div className="settings-container">
          <div className="settings-tabs">
            <div
              className={`tab-item ${activeTab === "general" ? "active" : ""}`}
              onClick={() => setActiveTab("general")}
            >
              <span className="tab-icon">🏠</span>
              <span>Tổng quát</span>
            </div>
            <div
              className={`tab-item ${activeTab === "security" ? "active" : ""}`}
              onClick={() => setActiveTab("security")}
            >
              <span className="tab-icon">🔒</span>
              <span>Bảo mật</span>
            </div>
            <div className={`tab-item ${activeTab === "dicom" ? "active" : ""}`} onClick={() => setActiveTab("dicom")}>
              <span className="tab-icon">🖼️</span>
              <span>DICOM</span>
            </div>
            <div
              className={`tab-item ${activeTab === "notifications" ? "active" : ""}`}
              onClick={() => setActiveTab("notifications")}
            >
              <span className="tab-icon">🔔</span>
              <span>Thông báo</span>
            </div>
          </div>

          <div className="settings-content">
            {activeTab === "general" && (
              <div className="settings-section">
                <h3>🏠 Cài đặt tổng quát</h3>
                <div className="settings-grid">
                  <div className="setting-item">
                    <label>Tên hệ thống:</label>
                    <input
                      type="text"
                      value={settings.general.systemName}
                      onChange={(e) => handleSettingChange("general", "systemName", e.target.value)}
                    />
                  </div>
                  <div className="setting-item">
                    <label>Phiên bản:</label>
                    <input type="text" value={settings.general.systemVersion} disabled />
                  </div>
                  <div className="setting-item">
                    <label>Chế độ bảo trì:</label>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={settings.general.maintenanceMode}
                        onChange={(e) => handleSettingChange("general", "maintenanceMode", e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>Sao lưu tự động:</label>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={settings.general.autoBackup}
                        onChange={(e) => handleSettingChange("general", "autoBackup", e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>Tần suất sao lưu:</label>
                    <select
                      value={settings.general.backupInterval}
                      onChange={(e) => handleSettingChange("general", "backupInterval", e.target.value)}
                    >
                      <option value="hourly">Mỗi giờ</option>
                      <option value="daily">Hàng ngày</option>
                      <option value="weekly">Hàng tuần</option>
                      <option value="monthly">Hàng tháng</option>
                    </select>
                  </div>
                  <div className="setting-item">
                    <label>Kích thước file tối đa (MB):</label>
                    <input
                      type="number"
                      value={settings.general.maxFileSize}
                      onChange={(e) => handleSettingChange("general", "maxFileSize", Number.parseInt(e.target.value))}
                    />
                  </div>
                  <div className="setting-item">
                    <label>Thời gian hết phiên (phút):</label>
                    <input
                      type="number"
                      value={settings.general.sessionTimeout}
                      onChange={(e) =>
                        handleSettingChange("general", "sessionTimeout", Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="settings-section">
                <h3>🔒 Cài đặt bảo mật</h3>
                <div className="settings-grid">
                  <div className="setting-item">
                    <label>Độ dài mật khẩu tối thiểu:</label>
                    <input
                      type="number"
                      value={settings.security.passwordMinLength}
                      onChange={(e) =>
                        handleSettingChange("security", "passwordMinLength", Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div className="setting-item">
                    <label>Yêu cầu ký tự đặc biệt:</label>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={settings.security.passwordRequireSpecial}
                        onChange={(e) => handleSettingChange("security", "passwordRequireSpecial", e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>Số lần đăng nhập sai tối đa:</label>
                    <input
                      type="number"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) =>
                        handleSettingChange("security", "maxLoginAttempts", Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div className="setting-item">
                    <label>Thời gian khóa tài khoản (phút):</label>
                    <input
                      type="number"
                      value={settings.security.lockoutDuration}
                      onChange={(e) =>
                        handleSettingChange("security", "lockoutDuration", Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div className="setting-item">
                    <label>Xác thực 2 yếu tố:</label>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={settings.security.twoFactorAuth}
                        onChange={(e) => handleSettingChange("security", "twoFactorAuth", e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="setting-item full-width">
                    <label>Danh sách IP được phép (mỗi IP một dòng):</label>
                    <textarea
                      value={settings.security.ipWhitelist}
                      onChange={(e) => handleSettingChange("security", "ipWhitelist", e.target.value)}
                      rows="4"
                      placeholder="192.168.1.100&#10;192.168.1.101"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "dicom" && (
              <div className="settings-section">
                <h3>🖼️ Cài đặt DICOM</h3>
                <div className="settings-grid">
                  <div className="setting-item">
                    <label>Xử lý tự động:</label>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={settings.dicom.autoProcessing}
                        onChange={(e) => handleSettingChange("dicom", "autoProcessing", e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>Ngưỡng chất lượng:</label>
                    <select
                      value={settings.dicom.qualityThreshold}
                      onChange={(e) => handleSettingChange("dicom", "qualityThreshold", e.target.value)}
                    >
                      <option value="low">Thấp</option>
                      <option value="good">Tốt</option>
                      <option value="excellent">Xuất sắc</option>
                    </select>
                  </div>
                  <div className="setting-item">
                    <label>Mức độ nén:</label>
                    <select
                      value={settings.dicom.compressionLevel}
                      onChange={(e) => handleSettingChange("dicom", "compressionLevel", e.target.value)}
                    >
                      <option value="none">Không nén</option>
                      <option value="low">Nén thấp</option>
                      <option value="medium">Nén trung bình</option>
                      <option value="high">Nén cao</option>
                    </select>
                  </div>
                  <div className="setting-item">
                    <label>Thời gian lưu trữ (ngày):</label>
                    <input
                      type="number"
                      value={settings.dicom.retentionPeriod}
                      onChange={(e) => handleSettingChange("dicom", "retentionPeriod", Number.parseInt(e.target.value))}
                    />
                  </div>
                  <div className="setting-item">
                    <label>Ẩn danh hóa dữ liệu:</label>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={settings.dicom.anonymizeData}
                        onChange={(e) => handleSettingChange("dicom", "anonymizeData", e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="settings-section">
                <h3>🔔 Cài đặt thông báo</h3>
                <div className="settings-grid">
                  <div className="setting-item">
                    <label>Thông báo email:</label>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={settings.notifications.emailNotifications}
                        onChange={(e) => handleSettingChange("notifications", "emailNotifications", e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>Thông báo SMS:</label>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={settings.notifications.smsNotifications}
                        onChange={(e) => handleSettingChange("notifications", "smsNotifications", e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>Cảnh báo hệ thống:</label>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={settings.notifications.systemAlerts}
                        onChange={(e) => handleSettingChange("notifications", "systemAlerts", e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>Cảnh báo bảo trì:</label>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={settings.notifications.maintenanceAlerts}
                        onChange={(e) => handleSettingChange("notifications", "maintenanceAlerts", e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>SMTP Server:</label>
                    <input
                      type="text"
                      value={settings.notifications.smtpServer}
                      onChange={(e) => handleSettingChange("notifications", "smtpServer", e.target.value)}
                    />
                  </div>
                  <div className="setting-item">
                    <label>SMTP Port:</label>
                    <input
                      type="number"
                      value={settings.notifications.smtpPort}
                      onChange={(e) =>
                        handleSettingChange("notifications", "smtpPort", Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div className="setting-item">
                    <label>SMTP Username:</label>
                    <input
                      type="text"
                      value={settings.notifications.smtpUsername}
                      onChange={(e) => handleSettingChange("notifications", "smtpUsername", e.target.value)}
                    />
                  </div>
                  <div className="setting-item">
                    <label>SMTP Password:</label>
                    <input
                      type="password"
                      value={settings.notifications.smtpPassword}
                      onChange={(e) => handleSettingChange("notifications", "smtpPassword", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="settings-actions">
          <button className="btn-save" onClick={handleSaveSettings} disabled={!hasChanges}>
            💾 Lưu cài đặt
          </button>
          <button className="btn-reset" onClick={handleResetSettings}>
            🔄 Khôi phục mặc định
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default SystemSettings
