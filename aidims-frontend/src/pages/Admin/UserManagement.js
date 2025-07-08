"use client"

import { useState, useEffect } from "react"
import LayoutLogin from "../Layout/LayoutLogin"
import "../../css/userManagement.css"

const API_BASE = "http://localhost:8080/api"

const getRoleStyle = (role) => {
  const baseStyle = {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: "6px",
    color: "white",
    fontSize: "12px",
    fontWeight: "500",
  };

  const roleColors = {
    admin: "#dc2626",
    doctor: "#16a34a",
    receptionist: "#2563eb",
    technician: "#eab308",
  };

  return {
    ...baseStyle,
    backgroundColor: roleColors[role] || "#6b7280", // fallback: xám
  };
};


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
    password: "",
    roleId: "",
    specialtyId: "",
    isActive: true,
  })

  useEffect(() => {
    fetchUsers()

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

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/users`)
      const result = await res.json()
      if (res.ok) {
        setUsers(result)
      } else {
        alert("Lỗi khi tải danh sách người dùng")
      }
    } catch (err) {
      console.error("Fetch user error:", err)
      alert("Không thể kết nối tới máy chủ")
    }
  }

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setUserForm({
      ...userForm,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isCreating = !editingUser;
    if (
      !userForm.username ||
      !userForm.fullName ||
      !userForm.roleId ||
      (isCreating && !userForm.password)
    ) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    const payload = {
      username: userForm.username,
      fullName: userForm.fullName,
      email: userForm.email,
      phone: userForm.phone,
      active: userForm.isActive,
      role: {
        roleId: parseInt(userForm.roleId),
      },
    };

    if (isCreating || userForm.password.trim() !== "") {
      payload.password = userForm.password;
    }

    try {
      let response, result;

      if (isCreating) {
        response = await fetch(`${API_BASE}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        const userId = editingUser.userId || editingUser.id;
        response = await fetch(`${API_BASE}/users/${userId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      result = await response.json();

      if (response.ok && result.status === "success") {
        alert(isCreating ? "🆕 Tạo người dùng thành công" : "✅ Cập nhật người dùng thành công");
        fetchUsers();
      } else {
        alert(result.message || "❌ Có lỗi xảy ra khi xử lý dữ liệu");
      }
    } catch (error) {
      console.error("Lỗi gửi dữ liệu:", error);
      alert("⚠️ Không thể kết nối đến máy chủ");
    }

    setUserForm({
      username: "",
      fullName: "",
      email: "",
      phone: "",
      password: "",
      roleId: "",
      specialtyId: "",
      isActive: true,
    });
    setEditingUser(null);
    setShowModal(false);
  };


  const handleEdit = (user) => {
    setEditingUser(user);

    setUserForm({
      username: user.username || "",
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      password: "",
      roleId: user.role?.roleId?.toString() || "",
      isActive: user.active ?? true,
    });

    setShowModal(true);
  };


  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa?")) return
    try {
      const res = await fetch(`${API_BASE}/users/${id}`, { method: "DELETE" })
      if (res.ok) {
        alert("Đã xóa người dùng")
        fetchUsers()
      } else {
        alert("Không thể xóa")
      }
    } catch (err) {
      alert("Lỗi kết nối")
    }
  }

  const toggleUserStatus = async (id) => {
    const user = users.find(u => u.id === id || u.userId === id)
    if (!user) return alert("Không tìm thấy người dùng")

    const newStatus = !user.active

    try {
      const res = await fetch(`${API_BASE}/users/update-status/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`, // nếu có auth
        },
        body: JSON.stringify({ isActive: newStatus }),
      })

      let result = {}
      try {
        result = await res.json()
      } catch (e) {
        console.warn("Không thể đọc JSON từ server:", e)
      }

      if (!res.ok || result.status !== "success") {
        console.error("❌ Server trả về lỗi:", res.status, result.message)
        alert(result.message || "Không thể đổi trạng thái người dùng")
        return
      }

      // ✅ Cập nhật trực tiếp vào danh sách users (không cần gọi lại fetchUsers)
      setUsers(prev =>
        prev.map(u =>
          (u.id === id || u.userId === id)
            ? { ...u, active: result.data.isActive }
            : u
        )
      )

      alert("✅ " + result.message)
    } catch (e) {
      console.error("Toggle error:", e)
      alert("Lỗi kết nối đến máy chủ")
    }
  }


  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "" || user.role.name === filterRole
    return matchesSearch && matchesRole
  })

  const getRoleDisplayName = (roleName) => {
    console.log("getRoleDisplayName called with:", roleName)
    const role = roles.find((r) => r.name === roleName)
    return role ? role.displayName : roleName
  }

  return (
    <LayoutLogin>
      <div className="user-management-page">
        {/* HEADER */}
        <div className="page-header">
          <h2>👥 Quản lý Người dùng</h2>
          <p>Tạo, chỉnh sửa và phân quyền tài khoản người dùng trong hệ thống</p>
        </div>

        {/* CONTROL BAR */}
        <div className="management-controls">
          <div className="search-filters flex w-full gap-4">
            <div className="search-box flex-[5]">
              <input
                type="text"
                placeholder="🔍 Tìm kiếm theo tên, username hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="filter-box flex-[3]">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">Tất cả vai trò</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.name}>{role.displayName}</option>
                ))}
              </select>
            </div>

            <div className="add-user-box flex-[2]">
              <button className="btn-add-user" onClick={() => {
                setEditingUser(null)
                setUserForm({
                  username: "",
                  fullName: "",
                  email: "",
                  phone: "",
                  password: "",
                  roleId: "",
                  specialtyId: "",
                  isActive: true,
                })
                setShowModal(true)
              }}>
                ➕ Thêm người dùng
              </button>
            </div>
          </div>
        </div>

        {/* THỐNG KÊ */}
        <div className="users-stats">
          <div className="stat-card">
            <div className="stat-label">Tổng người dùng</div>
            <div className="stat-number">{users.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Đang hoạt động</div>
            <div className="stat-number">{users.filter((u) => u.active).length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Bác sĩ</div>
            <div className="stat-number">{users.filter((u) => u.role.name === "doctor").length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Kỹ thuật viên</div>
            <div className="stat-number">{users.filter((u) => u.role.name === "technician").length}</div>
          </div>
        </div>

        {/* BẢNG NGƯỜI DÙNG */}
        <div className="users-table-container mt-6">
          <table className="users-table w-full border-collapse rounded-xl overflow-hidden shadow-md">
            <thead>
              <tr className="bg-blue-600 text-white text-left text-sm uppercase font-semibold">
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Họ tên</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">SĐT</th>
                <th className="px-4 py-3">Vai trò</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-gray-700">
              {filteredUsers.map((user) => (
                <tr
                  key={user.userId || user.id}
                  className="hover:bg-gray-100 transition-colors border-b"
                >
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.fullName}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.phone}</td>
                  <td className="px-4 py-2">
                    <span style={getRoleStyle(user.role)}>
                      {getRoleDisplayName(user.role)}
                    </span>

                  </td>
                  <td className="px-4 py-2">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${user.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {user.active ? "Hoạt động" : "Tạm khóa"}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-start gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        title="Chỉnh sửa"
                        className="btn-edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => toggleUserStatus(user.id || user.userId)}
                        title={user.active ? "Tạm khóa" : "Kích hoạt"}
                        className={`btn-toggle ${user.active ? "btn-deactivate" : "btn-activate"}`}
                      >
                        {user.active ? "🔓" : "🔒"}
                      </button>
                      <button
                        onClick={() => handleDelete(user.id || user.userId)}
                        title="Xóa"
                        className="btn-delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FORM MODAL */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="user-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editingUser ? "✏️ Chỉnh sửa người dùng" : "➕ Thêm người dùng mới"}</h3>
                <button onClick={() => setShowModal(false)}>×</button>
              </div>

              <form onSubmit={handleSubmit} className="user-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Username *</label>
                    <input type="text" name="username" value={userForm.username} onChange={handleFormChange} required disabled={!!editingUser} />
                  </div>
                  <div className="form-group">
                    <label>Họ tên *</label>
                    <input type="text" name="fullName" value={userForm.fullName} onChange={handleFormChange} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={userForm.email} onChange={handleFormChange} />
                  </div>
                  <div className="form-group">
                    <label>SĐT</label>
                    <input type="tel" name="phone" value={userForm.phone} onChange={handleFormChange} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>{editingUser ? "Mật khẩu (nếu đổi)" : "Mật khẩu *"}</label>
                    <input type="password" name="password" value={userForm.password} onChange={handleFormChange} required={!editingUser} />
                  </div>
                  <div className="form-group">
                    <label>Vai trò *</label>
                    <select name="roleId" value={userForm.roleId} onChange={handleFormChange} required>
                      <option value="">-- Chọn vai trò --</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>{role.displayName}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <input type="checkbox" name="isActive" checked={userForm.isActive} onChange={handleFormChange} />
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
