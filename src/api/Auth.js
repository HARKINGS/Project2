import axios from "axios";
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Đã Bắt API login xong
export const authenticate = async (credentials) => {
  const token = localStorage.getItem("token"); // Lấy token từ localStorage
  try {
    const response = await fetch(`${BASE_URL}/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Authentication failed");
    return data;
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
};

// Logout
export const logout = async () => {
  const token = localStorage.getItem("token"); // Lấy token từ localStorage
  if (!token) {
    throw new Error("No token found. Please log in first.");
  }
  try {
    const response = await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }), // Gửi token để xác thực
    });
    const data = await response.json();
    if (data.code !== 1000) throw new Error(data.message || "Logout failed");

    return data;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

// Refresh token
export const refreshToken = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/refresh`, {
      refreshToken: localStorage.getItem("refreshToken"),
    });
    const newToken = response.data.accessToken;
    localStorage.setItem("token", newToken);
    return newToken;
  } catch (error) {
    console.error("Lỗi làm mới token:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
    throw error;
  }
};
