import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const token = localStorage.getItem("token");

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getOrderHistory = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/order-history`, getConfig());
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Lấy lịch sử đơn hàng thất bại");
    }
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử đơn hàng:", error);
    if (error.response?.status === 401) {
      throw new Error("Unauthenticated");
    }
    throw error;
  }
};
