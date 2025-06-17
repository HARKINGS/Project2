import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const token = localStorage.getItem('token'); // Lấy token từ localStorage

export const placeOrder = async (orderData) => {
    if (!token) {
        throw new Error('No token found. Please log in first.');
    }
    try {
        const response = await axios.post(`${BASE_URL}/orders/create`, orderData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Gửi token để xác thực
            },
        });
        const data = response.data;
        if (!response.ok) throw new Error(data.message || 'Order placement failed');
        return data;
    } catch (error) {
        console.error('Order placement error:', error);
        throw error;
    }
}

// Update order status
export const updateOrderStatus = async (orderId, status) => {
    if (!token) {
        throw new Error('No token found. Please log in first.');
    }
    try {
        const response = await axios.put(`${BASE_URL}/orders/update-item-status/${orderItemId}`, { status }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Gửi token để xác thực
            },
        });
        const data = response.data;
        if (!response.ok) throw new Error(data.message || 'Order status update failed');
        return data;
    } catch (error) {
        console.error('Order status update error:', error);
        throw error;
    }
}

// Xem trạng thái đơn hàng
export const getOrderStatus = async (orderId) => {
    if (!token) {
        throw new Error('No token found. Please log in first.');
    }
    try {
        const response = await axios.get(`${BASE_URL}/orders/order-status/${orderId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Gửi token để xác thực
            },
        });
        const data = response.data;
        if (!response.ok) throw new Error(data.message || 'Failed to fetch order status');
        return data;
    } catch (error) {
        console.error('Fetch order status error:', error);
        throw error;
    }
}

// Cập nhật trạng thái đơn hàng
export const updateOrder = async (orderId, orderStatus) => {
    if (!token) {
        throw new Error('No token found. Please log in first.');
    }
    try {
        const response = await axios.put(`${BASE_URL}/orders/update/${orderId}`, orderStatus, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Gửi token để xác thực
            },
        });
        const data = response.data;
        if (!response.ok) throw new Error(data.message || 'Order update failed');
        return data;
    } catch (error) {
        console.error('Order update error:', error);
        throw error;
    }
}

// Cập nhật phương thức thanh toán
export const updatePaymentStatus = async (orderId, paymentStatus) => {
    if (!token) {
        throw new Error('No token found. Please log in first.');
    }
    try {
        const response = await axios.put(`${BASE_URL}/orders//payment-status/${orderId}`, { paymentStatus }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Gửi token để xác thực
            },
        });
        const data = response.data;
        if (!response.ok) throw new Error(data.message || 'Payment method update failed');
        return data;
    } catch (error) {
        console.error('Payment method update error:', error);
        throw error;
    }
}

// Xem tất cả đơn hàng
export const getAllOrders = async () => {
    if (!token) {
        throw new Error('No token found. Please log in first.');
    }
    try {
        const response = await axios.get(`${BASE_URL}/orders/all`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Gửi token để xác thực
            },
        });
        const data = response.data;
        if (!response.ok) throw new Error(data.message || 'Failed to fetch orders');
        return data;
    } catch (error) {
        console.error('Fetch orders error:', error);
        throw error;
    }
}

// Xem đơn hàng theo trạng thái
export const getOrdersByStatus = async (status) => {
    if (!token) {
        throw new Error('No token found. Please log in first.');
    }
    try {
        const response = await axios.get(`${BASE_URL}/orders/status/${status}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Gửi token để xác thực
            },
        });
        const data = response.data;
        if (!response.ok) throw new Error(data.message || 'Failed to fetch orders by status');
        return data;
    } catch (error) {
        console.error('Fetch orders by status error:', error);
        throw error;
    }
}

// Xoá đơn hàng
export const deleteOrder = async (orderId) => {
    if (!token) {
        throw new Error('No token found. Please log in first.');
    }
    try {
        const response = await axios.delete(`${BASE_URL}/orders/delete/${orderId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Gửi token để xác thực
            },
        });
        const data = response.data;
        if (!response.ok) throw new Error(data.message || 'Order deletion failed');
        return data;
    } catch (error) {
        console.error('Order deletion error:', error);
        throw error;
    }
}