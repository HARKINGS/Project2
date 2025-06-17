import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const token = localStorage.getItem('token'); // Lấy token từ localStorage

// Tạo quyền mới (ADMIN mới dùng dc)
export const createPermission = async (permissionData) => {
    if (!token) {
        throw new Error('No token found. Please log in first.');
    }
    try {
        const response = await axios.post(`${BASE_URL}/permissions`, permissionData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Gửi token để xác thực
            },
        });
        const data = response.data;
        if (!response.ok) throw new Error(data.message || 'Permission creation failed');
        return data;
    } catch (error) {
        console.error('Permission creation error:', error);
        throw error;
    }
};

// Xem tất cả các quyền (ADMIN mới dùng dc)
export const getAllPermissions = async () => {
    if (!token) {
        throw new Error('No token found. Please log in first.');
    }
    try {
        const response = await axios.get(`${BASE_URL}/permissions`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Gửi token để xác thực
            },
        });
        const data = response.data;
        if (!response.ok) throw new Error(data.message || 'Failed to fetch permissions');
        return data;
    } catch (error) {
        console.error('Fetch permissions error:', error);
        throw error;
    }   
};

// Xoá quyền (ADMIN mới dùng dc)
export const deletePermission = async (permissionName) => {
    if (!token) {
        throw new Error('No token found. Please log in first.');
    }
    try {
        const response = await axios.delete(`${BASE_URL}/permissions/${permissionName}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Gửi token để xác thực
            },
        });
        const data = response.data;
        if (!response.ok) throw new Error(data.message || 'Permission deletion failed');
        return data;
    } catch (error) {
        console.error('Permission deletion error:', error);
        throw error;
    }
};