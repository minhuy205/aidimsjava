"use client"

import { useState, useEffect } from "react"
import LayoutLogin from "../Layout/LayoutLogin"
import "../../css/userManagement.css"

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [specialties, setSpecialties] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("")
  const [userForm, setUserForm] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    roleId: "",
    specialtyId: "",
    isActive: true,
  })

  useEffect(() => {
    // Load users from localStorage or initialize with sample data
    const savedUsers = localStorage.getItem("systemUsers")
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers))
    } else {
      const sampleUsers = [
        {
          id: 1,
          username: "admin",
          fullName: "Quản trị viên chính",
          email: "admin@hospital.com",
          phone: "0901234567",
          roleId: 1,
          roleName: "admin",
          specialtyId: null,
          specialtyName: null,
          isActive: true,
          lastLogin: "2024-12-15 10:30:00",
          createdAt: "2024-01-01",
        },
        {
          id: 2,
          username: "dr_nguyen",
          fullName: "BS. Nguyễn Văn A",
          email: "nguyen@hospital.com",
          phone: "0902345678",
          roleId: 2,
          roleName: "doctor",
          specialtyId: 1,
          specialtyName: "Chẩn đoán hình ảnh",
          isActive: true,
          lastLogin: "2024-12-15 14:20:00",
          createdAt: "2024-02-15",
        },
        {
          id: 3,
          username: "nv_huy",
          fullName: "Huy - Nhân viên tiếp nhận",
          email: "huy@hospital.com",
          phone: "0903456789",
          roleId: 3,
          roleName: "receptionist",
          specialtyId: null,
          specialtyName: null,
          isActive: true,
          lastLogin: "2024-12-15 09:15:00",
          createdAt: "2024-03-10",
        },
        {
          id: 4,
          username: "kv_duyen",
          fullName: "Duyên - Kỹ thuật viên",
          email: "duyen@hospital.com",
          phone: "0904567890",
          roleId: 4,
          roleName: "technician",
          specialtyId: 1,
          specialtyName: "Chẩn đoán hình ảnh",
          isActive: true,
          lastLogin: "2024-12-15 11:45:00",
          createdAt: "2024-04-05",
        },
      ]
      setUsers(sampleUsers)
      localStorage.setItem("systemUsers", JSON.stringify(sampleUsers))
    }

    // Initialize roles and specialties
    setRoles([
      { id: 1, name: "admin", displayName: "Quản trị viên" },
      { id: 2, name: "doctor", displayName: "Bác sĩ" },
      { id: 3, name: "receptionist", displayName: "Nhân viên tiếp nhận" },
      { id: 4, name: "technician", displayName: "Kỹ thuật viên" },
    ])

    setSpecialties([
      { id: 1, name: "Chẩn đoán hình ảnh" },
      { id: 2, name: "Tim mạch" },
      { id: 3, name: "Hô hấp" },
      { id: 4, name: "Tiêu hóa" },
      { id: 5, name: "Thần kinh" },
    ])
  }, [])

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setUserForm({
      ...userForm,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!userForm.username || !userForm.fullName || !userForm.roleId) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc")
      return
    }

    const role = roles.find((r) => r.id === Number.parseInt(userForm.roleId))
    const specialty = specialties.find((s) => s.id === Number.parseInt(userForm.specialtyId))

    if (editingUser) {
      // Update existing user
      const updatedUsers = users.map((user) => {
        if (user.id === editingUser.id) {
          return {
            ...user,
            ...userForm,
            roleId: Number.parseInt(userForm.roleId),
            roleName: role.name,
            specialtyId: userForm.specialtyId ? Number.parseInt(userForm.specialtyId) : null,
            specialtyName: specialty ? specialty.name : null,
          }
        }
        return user
      })
      setUsers(updatedUsers)
      localStorage.setItem("systemUsers", JSON.stringify(updatedUsers))
    } else {
      // Create new user
      const newUser = {
        id: Date.now(),
        ...userForm,
        roleId: Number.parseInt(userForm.roleId),
        roleName: role.name,
        specialtyId: userForm.specialtyId ? Number.parseInt(userForm.specialtyId) : null,
        specialtyName: specialty ? specialty.name : null,
        lastLogin: null,
        createdAt: new Date().toISOString().split("T")[0],
      }
      const updatedUsers = [...users, newUser]
      setUsers(updatedUsers)
      localStorage.setItem("systemUsers", JSON.stringify(updatedUsers))
    }

    // Reset form and close modal
    setUserForm({
      username: "",
      fullName: "",
      email: "",
      phone: "",
      roleId: "",
      specialtyId: "",
      isActive: true,
    })
    setEditingUser(null)
    setShowModal(false)
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setUserForm({
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      roleId: user.roleId.toString(),
      specialtyId: user.specialtyId ? user.specialtyId.toString() : "",
      isActive: user.isActive,
    })
    setShowModal(true)
  }

  const handleDelete = (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      const updatedUsers = users.filter((user) => user.id !== userId)
      setUsers(updatedUsers)
      localStorage.setItem("systemUsers", JSON.stringify(updatedUsers))
    }
  }

  const toggleUserStatus = (userId) => {
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return { ...user, isActive: !user.isActive }
      }
      return user
    })
    setUsers(updatedUsers)
    localStorage.setItem("systemUsers", JSON.stringify(updatedUsers))
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = filterRole === "" || user.roleName === filterRole

    return matchesSearch && matchesRole
  })

  const getRoleDisplayName = (roleName) => {
    const role = roles.find((r) => r.name === roleName)
    return role ? role.displayName : roleName
  }

  return (
    <LayoutLogin>
      <div className="user-management-page">
        <div className="page-header">
          <h2>👥 Quản lý Người dùng</h2>
          <p>Tạo, chỉnh sửa và phân quyền tài khoản người dùng trong hệ thống</p>
        </div>

        <div className="management-controls">
          <div className="search-filters">
            <div className="search-box">
              <input
                type="text"
                placeholder="🔍 Tìm kiếm theo tên, username hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-box">
              <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                <option value="">Tất cả vai trò</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.name}>
                    {role.displayName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            className="btn-add-user"
            onClick={() => {
              setEditingUser(null)
              setUserForm({
                username: "",
                fullName: "",
                email: "",
                phone: "",
                roleId: "",
                specialtyId: "",
                isActive: true,
              })
              setShowModal(true)
            }}
          >
            ➕ Thêm người dùng
          </button>
        </div>

        <div className="users-stats">
  <div className="stat-card">
    <div className="stat-label">Tổng người dùng</div>
    <div className="stat-number">{users.length}</div>
  </div>
  <div className="stat-card">
    <div className="stat-label">Đang hoạt động</div>
    <div className="stat-number">{users.filter((u) => u.isActive).length}</div>
  </div>
  <div className="stat-card">
    <div className="stat-label">Bác sĩ</div>
    <div className="stat-number">{users.filter((u) => u.roleName === "doctor").length}</div>
  </div>
  <div className="stat-card">
    <div className="stat-label">Kỹ thuật viên</div>
    <div className="stat-number">{users.filter((u) => u.roleName === "technician").length}</div>
  </div>
</div>

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Chuyên khoa</th>
                <th>Trạng thái</th>
                <th>Đăng nhập cuối</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="username-cell">{user.username}</td>
                  <td className="fullname-cell">{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge role-${user.roleName}`}>{getRoleDisplayName(user.roleName)}</span>
                  </td>
                  <td>{user.specialtyName || "—"}</td>
                  <td>
                    <span className={`status-badge ${user.isActive ? "status-active" : "status-inactive"}`}>
                      {user.isActive ? "Hoạt động" : "Tạm khóa"}
                    </span>
                  </td>
                  <td>{user.lastLogin || "Chưa đăng nhập"}</td>
                  <td className="actions-cell">
                    <button className="btn-edit" onClick={() => handleEdit(user)} title="Chỉnh sửa">
                      ✏️
                    </button>
                    <button
                      className={`btn-toggle ${user.isActive ? "btn-deactivate" : "btn-activate"}`}
                      onClick={() => toggleUserStatus(user.id)}
                      title={user.isActive ? "Tạm khóa" : "Kích hoạt"}
                    >
                      {user.isActive ? "🔒" : "🔓"}
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(user.id)} title="Xóa">
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* User Form Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="user-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editingUser ? "✏️ Chỉnh sửa người dùng" : "➕ Thêm người dùng mới"}</h3>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="user-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Username: *</label>
                    <input
                      type="text"
                      name="username"
                      value={userForm.username}
                      onChange={handleFormChange}
                      required
                      disabled={editingUser !== null}
                    />
                  </div>
                  <div className="form-group">
                    <label>Họ và tên: *</label>
                    <input type="text" name="fullName" value={userForm.fullName} onChange={handleFormChange} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" value={userForm.email} onChange={handleFormChange} />
                  </div>
                  <div className="form-group">
                    <label>Số điện thoại:</label>
                    <input type="tel" name="phone" value={userForm.phone} onChange={handleFormChange} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Vai trò: *</label>
                    <select name="roleId" value={userForm.roleId} onChange={handleFormChange} required>
                      <option value="">-- Chọn vai trò --</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.displayName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Chuyên khoa:</label>
                    <select name="specialtyId" value={userForm.specialtyId} onChange={handleFormChange}>
                      <option value="">-- Chọn chuyên khoa --</option>
                      {specialties.map((specialty) => (
                        <option key={specialty.id} value={specialty.id}>
                          {specialty.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input type="checkbox" name="isActive" checked={userForm.isActive} onChange={handleFormChange} />
                    <span className="checkmark"></span>
                    Tài khoản hoạt động
                  </label>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    {editingUser ? "💾 Cập nhật" : "➕ Tạo mới"}
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                    ❌ Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </LayoutLogin>
  )
}

export default UserManagement
