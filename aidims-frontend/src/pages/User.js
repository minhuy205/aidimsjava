// aidims-frontend/src/pages/User.js

import React, { useEffect, useState } from 'react';

function User() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/users")
      .then(res => {
        if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu người dùng");
        return res.json();
      })
      .then(data => setUsers(data))
      .catch(err => {
        console.error("Lỗi fetch:", err);
        setError(err.message);
      });
  }, []);

  if (error) return <p style={{ color: 'red' }}>❌ {error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>👨‍⚕️ Danh sách người dùng</h2>
      {users.length === 0 ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên đăng nhập</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Điện thoại</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id}>
                <td>{user.user_id}</td>
                <td>{user.username}</td>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default User;
