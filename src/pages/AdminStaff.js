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
    phone: "",
    role: "staff", // Mặc định là staff, có thể thay đổi
    dob: "", // Thêm trường dob
  });
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  // Lấy danh sách tài khoản
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data.result || []);
      } catch (error) {
        setError("Failed to load users. Please check your token or try again.");
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

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
      setError("Please select a date of birth.");
      return;
    }
    const age = validateDob(newUser.dob);
    if (age < 18) {
      setError("User must be at least 18 years old.");
      return;
    }
    try {
      const userData = {
        username: newUser.username,
        password: newUser.password,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phone: newUser.phone,
        email: newUser.email,
        dob: newUser.dob,
      };
      if (newUser.role === "staff") {
        await registerStaffRole(userData);
      } else {
        await registerUserRole(userData);
      }

      toast.success("User added successfully!");

      const updatedUsers = await getUsers();
      setUsers(updatedUsers.result || []);
      setNewUser({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "staff",
        dob: "",
      });
      setError(null);
    } catch (error) {
      setError("Error adding user. Please check your input or token.");
      console.error("Error adding user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        await deleteUser(userId);
        setUsers(users.filter((u) => u.userId !== userId));
        setError(null);
      } catch (error) {
        setError("Error deleting user. Please try again.");
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Accounts</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
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
            placeholder="Phone"
            value={newUser.phone}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
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
          >
            Add Account
          </button>
        </div>
      </form>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Account List</h2>
        {users.map((user) => (
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
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminStaff;
