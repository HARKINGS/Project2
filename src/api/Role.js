import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const token = localStorage.getItem('token'); // Lấy token từ localStorage

// Tạo vai trò mới (ADMIN mới dùng dc)
export const createRole = async (roleData) => {
    if (!token) {
        throw new Error('No token found. Please log in first.');
    }
    try {
        const response = await axios.post(`${BASE_URL}/roles`, roleData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Gửi token để xác thực
            },
        });
        const data = response.data;
        if (!response.ok) throw new Error(data.message || 'Role creation failed');
        return data;
    } catch (error) {
        console.error('Role creation error:', error);
        throw error;
    }
}

// Lấy tất cả các vai trò (ADMIN mới dùng dc)
export const getAllRoles = async () => {
    if (!token) {
        throw new Error('No token found. Please log in first.');
    }
    try {
        const response = await axios.get(`${BASE_URL}/roles`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Gửi token để xác thực
            },
        });
        const data = response.data;
        if (!response.ok) throw new Error(data.message || 'Failed to fetch roles');
        return data;
    } catch (error) {
        console.error('Fetch roles error:', error);
        throw error;
    }
}

// Xoá vai trò (ADMIN mới dùng dc)
export const deleteRole = async (roleName) => {
    if (!token) {
        throw new Error('No token found. Please log in first.');
    }
    try {
        const response = await axios.delete(`${BASE_URL}/roles/${roleName}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Gửi token để xác thực
            },
        });
        const data = response.data;
        if (!response.ok) throw new Error(data.message || 'Role deletion failed');
        return data;
    } catch (error) {
        console.error('Role deletion error:', error);
        throw error;
    }
}