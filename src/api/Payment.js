import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const token = localStorage.getItem("token");

const getConfig = () => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

export const createMomoPayment = async (cartRequest, cartId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/momo/create?cartId=${cartId}`,
      cartRequest,
      getConfig()
    );
    const data = response.data;
    if (data.resultCode !== 0) {
      throw new Error(data.message || "Lỗi khi tạo mã QR MoMo");
    }
    return data; // Trả về payUrl, qrCodeUrl, v.v.
  } catch (error) {
    console.error("Lỗi khi tạo mã QR MoMo:", error);
    if (error.response?.status === 401) {
      throw new Error("Unauthenticated");
    }
    throw error;
  }
};

export const checkMomoPaymentStatus = async (orderId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/momo/return`,
      { orderId },
      getConfig()
    );
    if (response.data.code !== 1000) {
      throw new Error(
        response.data.message || "Kiểm tra trạng thái thanh toán MoMo thất bại"
      );
    }
    return response.data;
  } catch (error) {
    console.error("Lỗi khi kiểm tra trạng thái thanh toán MoMo:", error);
    if (error.response?.status === 401) {
      throw new Error("Unauthenticated");
    }
    throw error;
  }
};
