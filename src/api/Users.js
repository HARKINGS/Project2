import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const token = localStorage.getItem('token'); // Lấy token từ localStorage

// Đăng ký người dùng với vai trò USER
export const registerUserRole = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/users/USER`, { // Endpoint cố định /users/USER
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Registration failed');
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Đăng ký người dùng với vai trò STAFF
export const registerStaffRole = async (userData) => {
  if (!token) {
    throw new Error('No token found. Please log in first.');
  }
  try {
    const response = await fetch(`${BASE_URL}/users/STAFF`, { // Endpoint cố định /users/STAFF
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Gửi token để xác thực 
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Registration failed');
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Lấy thông tin bản thân
export const getMyInfo = async () => {
  if (!token) {
    throw new Error('No token found. Please log in first.');
  }
  try {
    const response = await axios.get(`${BASE_URL}/users/myInfo`, {
      headers: {  
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Gửi token để xác thực
      }
    });

    const data = response.data;
    if (data.code !== 1000) throw new Error(data.message || 'Failed to fetch user info');
    return data; // Giả sử dữ liệu người dùng nằm trong trường 'data'
  } catch (error) {
    console.error('Get user info error:', error);
    throw error;
  }
}

// Lấy thông tin người dùng theo ID
export const getUser = async (userId) => {
  if (!token) {
    throw new Error('No token found. Please log in first.');
  }
  try {
    const response = await axios.get(`${BASE_URL}/users/${userId}`, {
      headers: {    
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Gửi token để xác thực)
      }
    });
    const data = response.data;
    if (data.code !== 1000) throw new Error(data.message || 'Failed to fetch user info');
    return data; // Giả sử dữ liệu người dùng nằm trong trường 'data'
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
}

// Lấy thông tin tất cả người dùng
export const getUsers = async () => {
  if (!token) {
    throw new Error('No token found. Please log in first.');
  }
  try {
    const response = await axios.get(`${BASE_URL}/users`, {
      headers: {    
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Gửi token để xác thực
      }
    });
    const data = response.data;
    if (data.code !== 1000) throw new Error(data.message || 'Failed to fetch all users info');
    return data; // Giả sử dữ liệu người dùng nằm trong trường 'data'
  } catch (error) {
    console.error('Get users error:', error);
    throw error;
  }
}

// Cập nhật thông tin người dùng theo ID
export const updateUser = async (userId, userData) => {
  if (!token) {
    throw new Error('No token found. Please log in first.');
  }
  try {
    const response = await axios.put(`${BASE_URL}/users/${userId}`, userData, {
      headers: {    
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Gửi token để xác thực
      },
    });
    const data = response.data;
    if (data.code !== 1000) throw new Error(data.message || 'Failed to update user info');
    return data; // Giả sử dữ liệu người dùng nằm trong trường 'data'
  } catch (error) {
    console.error('Update user error:', error);
    throw error;
  }
} 

// Xóa người dùng theo ID
export const deleteUser = async (userId) => {
  if (!token) {
    throw new Error('No token found. Please log in first.');
  }
  try {
    const response = await axios.delete(`${BASE_URL}/users/${userId}`, {
      headers: {    
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Gửi token để xác thực
      }
    });
    const data = response.data;
    if (data.code !== 1000) throw new Error(data.message || 'Failed to delete user');
    return data; // Giả sử dữ liệu người dùng nằm trong trường 'data'
  } catch (error) {
    console.error('Delete user error:', error);
    throw error;
  }
}