// src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-backend-api.com',
  headers: {
    'Content-Type': 'application/json',
    // Thêm token nếu có xác thực
    // Authorization: `Bearer ${token}`,
  },
});

export const getProducts = () => api.get('/products');
export const getStaff = () => api.get('/staff');
export const sendChatMessage = (message) => api.post('/chat', { message });
export const sendStaffChatMessage = (message) => api.post('/staff-chat', { message });

export default api;