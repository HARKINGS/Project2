import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const token = localStorage.getItem('token'); // Lấy token từ localStorage

export const createVoucher = async (voucherData) => {
    if (!token) {
        throw new Error('No token found. Please log in first.');
    }
    try {
        const response = await axios.post(`${BASE_URL}/vouchers`, voucherData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Gửi token để xác thực
            },
        });
        const data = response.data;
        if (!response.ok) throw new Error(data.message || 'Voucher creation failed');
        return data;
    } catch (error) {
        console.error('Voucher creation error:', error);
        throw error;
    }
}

export const getVoucherById = async (voucherId) => {
    if (!token) {
        throw new Error('No token found. Please log in first.');
    }
    try {
        const response = await axios.get(`${BASE_URL}/vouchers/${voucherId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Gửi token để xác thực
            },
        });
        const data = response.data;
        if (!response.ok) throw new Error(data.message || 'Failed to fetch voucher');
        return data;
    } catch (error) {
        console.error('Fetch voucher error:', error);
        throw error;
    }
}

export const getAllVouchers = async () => {
    if (!token) {
        throw new Error('No token found. Please log in first.');
    }
    try {
        const response = await axios.get(`${BASE_URL}/vouchers`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Gửi token để xác thực
            },
        });
        const data = response.data;
        if (!response.ok) throw new Error(data.message || 'Failed to fetch vouchers');
        return data;
    } catch (error) {
        console.error('Fetch vouchers error:', error);
        throw error;
    }
}   

export const deleteVoucher = async (voucherId) => {
    if (!token) {
        throw new Error('No token found. Please log in first.');
    }
    try {
        const response = await axios.delete(`${BASE_URL}/vouchers/${voucherId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Gửi token để xác thực
            },
        });
        const data = response.data;
        if (!response.ok) throw new Error(data.message || 'Voucher deletion failed');
        return data;
    } catch (error) {
        console.error('Voucher deletion error:', error);
        throw error;
    }
}