"use client"

import { useState, useEffect } from "react"
import Layout from "../Layout/Layout"
import "../../css/systemMonitoring.css"

const SystemMonitoring = () => {
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalPatients: 0,
    totalImages: 0,
    storageUsed: 0,
    storageTotal: 1000, // GB
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
  })

  const [recentActivities, setRecentActivities] = useState([])
  const [systemLogs, setSystemLogs] = useState([])

  useEffect(() => {
    // Simulate loading system statistics
    const loadSystemStats = () => {
      const users = JSON.parse(localStorage.getItem("systemUsers") || "[]")
      const patients = JSON.parse(localStorage.getItem("patients") || "[]")
      const images = JSON.parse(localStorage.getItem("dicomImages") || "[]")

      setSystemStats({
        totalUsers: users.length,
        activeUsers: users.filter((u) => u.isActive).length,
        totalPatients: patients.length,
        totalImages: images.length,
        storageUsed: Math.floor(Math.random() * 500) + 200, // Simulate storage usage
        storageTotal: 1000,
        cpuUsage: Math.floor(Math.random() * 30) + 20, // Simulate CPU usage
        memoryUsage: Math.floor(Math.random() * 40) + 30, // Simulate memory usage
        diskUsage: Math.floor(Math.random() * 20) + 60, // Simulate disk usage
      })
    }

    // Load recent activities
    const loadRecentActivities = () => {
      const activities = [
        {
          id: 1,
          type: "login",
          user: "dr_nguyen",
          action: "Đăng nhập hệ thống",
          timestamp: "2024-12-15 14:30:00",
          ip: "192.168.1.100",
        },
        {
          id: 2,
          type: "upload",
          user: "kv_duyen",
          action: "Upload file DICOM: CT_CHEST_001.dcm",
          timestamp: "2024-12-15 14:25:00",
          ip: "192.168.1.105",
        },
        {
          id: 3,
          type: "create",
          user: "nv_huy",
          action: "Tạo hồ sơ bệnh nhân mới: BN005",
          timestamp: "2024-12-15 14:20:00",
          ip: "192.168.1.102",
        },
        {
          id: 4,
          type: "verify",
          user: "kv_duyen",
          action: "Xác minh chất lượng hình ảnh: XRAY_KNEE_002.dcm",
          timestamp: "2024-12-15 14:15:00",
          ip: "192.168.1.105",
        },
        {
          id: 5,
          type: "assign",
          user: "nv_huy",
          action: "Chuyển hồ sơ BN003 đến BS. Hoàng Văn E",
          timestamp: "2024-12-15 14:10:00",
          ip: "192.168.1.102",
        },
      ]
      setRecentActivities(activities)
    }

    // Load system logs
    const loadSystemLogs = () => {
      const logs = [
        {
          id: 1,
          level: "INFO",
          message: "Database backup completed successfully",
          timestamp: "2024-12-15 14:35:00",
          module: "Database",
        },
        {
          id: 2,
          level: "WARNING",
          message: "High memory usage detected: 85%",
          timestamp: "2024-12-15 14:30:00",
          module: "System",
        },
        {
          id: 3,
          level: "INFO",
          message: "DICOM file processed: CT_CHEST_001.dcm",
          timestamp: "2024-12-15 14:25:00",
          module: "DICOM",
        },
        {
          id: 4,
          level: "ERROR",
          message: "Failed to connect to imaging device: MRI_001",
          timestamp: "2024-12-15 14:20:00",
          module: "Device",
        },
        {
          id: 5,
          level: "INFO",
          message: "User authentication successful: dr_nguyen",
          timestamp: "2024-12-15 14:15:00",
          module: "Auth",
        },
      ]
      setSystemLogs(logs)
    }

    loadSystemStats()
    loadRecentActivities()
    loadSystemLogs()

    // Update stats every 30 seconds
    const interval = setInterval(loadSystemStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const getActivityIcon = (type) => {
    switch (type) {
      case "login":
        return "🔐"
      case "upload":
        return "📤"
      case "create":
        return "➕"
      case "verify":
        return "✅"
      case "assign":
        return "👨⚕️"
      default:
        return "📝"
    }
  }

  const getLogLevelColor = (level) => {
    switch (level) {
      case "ERROR":
        return "#dc3545"
      case "WARNING":
        return "#ffc107"
      case "INFO":
        return "#17a2b8"
      default:
        return "#6c757d"
    }
  }

  const getUsageColor = (percentage) => {
    if (percentage >= 80) return "#dc3545"
    if (percentage >= 60) return "#ffc107"
    return "#28a745"
  }

  return (
    <Layout>
      <div className="system-monitoring-page">
        <div className="page-header">
          <h2>📊 Giám sát Hệ thống</h2>
          <p>Theo dõi hiệu suất và trạng thái hoạt động của hệ thống AIDIMS</p>
        </div>

          {/* System Overview */}
<div className="system-overview">
  <h3>📈 Tổng quan hệ thống</h3>
  <div className="overview-grid">
    <div className="overview-card">
      <div className="card-icon">👥</div>
      <div className="card-content">
        <div className="card-label">Tổng người dùng</div>
        <div className="card-number">{systemStats.totalUsers}</div>
        <div className="card-sublabel">{systemStats.activeUsers} đang hoạt động</div>
      </div>
    </div>
    <div className="overview-card">
      <div className="card-icon">👤</div>
      <div className="card-content">
        <div className="card-label">Tổng bệnh nhân</div>
        <div className="card-number">{systemStats.totalPatients}</div>
        <div className="card-sublabel">Trong hệ thống</div>
      </div>
    </div>
    <div className="overview-card">
      <div className="card-icon">🖼️</div>
      <div className="card-content">
        <div className="card-label">Hình ảnh DICOM</div>
        <div className="card-number">{systemStats.totalImages}</div>
        <div className="card-sublabel">Đã lưu trữ</div>
      </div>
    </div>
    <div className="overview-card">
      <div className="card-icon">💾</div>
      <div className="card-content">
        <div className="card-label">Dung lượng sử dụng</div>
        <div className="card-number">{systemStats.storageUsed} GB</div>
        <div className="card-sublabel">
          {Math.round((systemStats.storageUsed / systemStats.storageTotal) * 100)}% / {systemStats.storageTotal} GB
        </div>
      </div>
    </div>
  </div>
</div>

        {/* System Performance */}
        <div className="system-performance">
          <h3>⚡ Hiệu suất hệ thống</h3>
          <div className="performance-grid">
            <div className="performance-card">
              <div className="performance-header">
                <span className="performance-icon">🖥️</span>
                <span className="performance-title">CPU Usage</span>
              </div>
              <div className="performance-meter">
                <div
                  className="performance-bar"
                  style={{
                    width: `${systemStats.cpuUsage}%`,
                    backgroundColor: getUsageColor(systemStats.cpuUsage),
                  }}
                ></div>
              </div>
              <div className="performance-value">{systemStats.cpuUsage}%</div>
            </div>
            <div className="performance-card">
              <div className="performance-header">
                <span className="performance-icon">🧠</span>
                <span className="performance-title">Memory Usage</span>
              </div>
              <div className="performance-meter">
                <div
                  className="performance-bar"
                  style={{
                    width: `${systemStats.memoryUsage}%`,
                    backgroundColor: getUsageColor(systemStats.memoryUsage),
                  }}
                ></div>
              </div>
              <div className="performance-value">{systemStats.memoryUsage}%</div>
            </div>
            <div className="performance-card">
              <div className="performance-header">
                <span className="performance-icon">💿</span>
                <span className="performance-title">Disk Usage</span>
              </div>
              <div className="performance-meter">
                <div
                  className="performance-bar"
                  style={{
                    width: `${systemStats.diskUsage}%`,
                    backgroundColor: getUsageColor(systemStats.diskUsage),
                  }}
                ></div>
              </div>
              <div className="performance-value">{systemStats.diskUsage}%</div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="recent-activities">
          <h3>🕒 Hoạt động gần đây</h3>
          <div className="activities-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">{getActivityIcon(activity.type)}</div>
                <div className="activity-content">
                  <div className="activity-action">{activity.action}</div>
                  <div className="activity-meta">
                    <span className="activity-user">👤 {activity.user}</span>
                    <span className="activity-time">🕒 {activity.timestamp}</span>
                    <span className="activity-ip">🌐 {activity.ip}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Logs */}
        <div className="system-logs">
          <h3>📋 Nhật ký hệ thống</h3>
          <div className="logs-table-container">
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Mức độ</th>
                  <th>Module</th>
                  <th>Thông điệp</th>
                  <th>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {systemLogs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <span className="log-level-badge" style={{ backgroundColor: getLogLevelColor(log.level) }}>
                        {log.level}
                      </span>
                    </td>
                    <td className="log-module">{log.module}</td>
                    <td className="log-message">{log.message}</td>
                    <td className="log-timestamp">{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default SystemMonitoring
