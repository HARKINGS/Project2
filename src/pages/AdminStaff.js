import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  registerStaffRole,
  registerUserRole,
  getUsers,
  deleteUser,
} from "../api/Users"; // Import các hàm từ User.js
import { toast } from "react-toastify";

const AdminStaff = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "", // Mặc định là số điện thoại không hợp lệ
    role: "staff", // Mặc định là staff, có thể thay đổi
    dob: "", // Thêm trường dob
  });
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading

  // Lấy danh sách tài khoản
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      if (data.code !== 1000) {
        throw new Error(data.message || "Lấy danh sách tài khoản thất bại");
      }
      setUsers(data.result || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.response?.status === 401) {
        setError("Phiên làm việc hết hạn. Vui lòng đăng nhập lại.");
        navigate("/login"); // Redirect về trang login nếu token không hợp lệ
      } else {
        setError(
          "Không thể tải danh sách tài khoản. Vui lòng kiểm tra token hoặc thử lại."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [navigate]);

  const validateDob = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      return age - 1;
    }
    return age;
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.dob) {
      setError("Vui lòng chọn ngày sinh.");
      return;
    }
    const age = validateDob(newUser.dob);
    if (age < 18) {
      setError("Người dùng phải ít nhất 18 tuổi.");
      return;
    }
    try {
      const userData = {
        username: newUser.username,
        password: newUser.password,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phoneNumber: newUser.phoneNumber,
        email: newUser.email,
        dob: newUser.dob,
      };
      if (newUser.role === "staff") {
        await registerStaffRole(userData);
      } else {
        await registerUserRole(userData);
      }

      // Thông báo hiển thị trên giao diện tạo tài khoản thành công
      toast.success("Tài khoản đã được thêm thành công!");

      await fetchUsers(); // Cập nhật danh sách sau khi thêm
      setNewUser({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        role: "staff",
        dob: "",
      });
      setError(null);
    } catch (error) {
      console.error("Error adding user:", error);
      setError(
        "Lỗi khi thêm tài khoản. Vui lòng kiểm tra thông tin hoặc token."
      );
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
      try {
        await deleteUser(userId);
        setUsers(users.filter((u) => u.userId !== userId));
        setError(null);
      } catch (error) {
        console.error("Error deleting user:", error);
        setError("Lỗi khi xóa tài khoản. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Accounts</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading && <p className="text-gray-600 mb-4">Đang tải...</p>}
      <form
        onSubmit={handleAddUser}
        className="mb-4 bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-semibold mb-4">Add New Account</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={newUser.username}
            onChange={(e) =>
              setNewUser({ ...newUser, username: e.target.value })
            }
            className="w-full p-3 border rounded-md"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            className="w-full p-3 border rounded-md"
            required
          />
          <input
            type="text"
            placeholder="FirstName"
            value={newUser.firstName}
            onChange={(e) =>
              setNewUser({ ...newUser, firstName: e.target.value })
            }
            className="w-full p-3 border rounded-md"
            required
          />
          <input
            type="text"
            placeholder="LastName"
            value={newUser.lastName}
            onChange={(e) =>
              setNewUser({ ...newUser, lastName: e.target.value })
            }
            className="w-full p-3 border rounded-md"
            required
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={newUser.phoneNumber}
            onChange={(e) =>
              setNewUser({ ...newUser, phoneNumber: e.target.value })
            }
            className="w-full p-3 border rounded-md"
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="w-full p-3 border rounded-md"
            required
          />
          <input
            type="date"
            value={newUser.dob}
            onChange={(e) => setNewUser({ ...newUser, dob: e.target.value })}
            className="w-full p-3 border rounded-md"
            required
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="w-full p-3 border rounded-md"
          >
            <option value="staff">Staff</option>
            <option value="user">User</option>
          </select>
          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
            disabled={loading}
          >
            Add Account
          </button>
        </div>
      </form>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Account List</h2>
        {loading ? (
          <p className="text-gray-600">Đang tải danh sách...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-500">Không có tài khoản nào.</p>
        ) : (
          users.map((user) => (
            <div
              key={user.userId}
              className="flex items-center justify-between border-b py-4"
            >
              <div>
                <span>
                  ID: {user.userId}
                  <br />
                  Username: {user.username}
                  <br />
                  Name: {user.lastName} {user.firstName}
                  <br />
                  DOB:{" "}
                  {user.dob ? new Date(user.dob).toLocaleDateString() : "N/A"}
                  <br />
                  Email: {user.email || "N/A"}
                  <br />
                  Phone Number: {user.phoneNumber || "N/A"} <br />
                  Role:{" "}
                  {user.roles && user.roles.length > 0
                    ? user.roles[0].name
                    : "N/A"}
                </span>
              </div>
              <div>
                <button
                  onClick={() => handleDeleteUser(user.userId)}
                  className="text-red-600 hover:text-red-800"
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminStaff;
