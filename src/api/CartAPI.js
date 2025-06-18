import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const addToCart = async (cartData) => {
  try {
    const response = await axios.post(`${BASE_URL}/cart`, cartData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error adding to cart");
  }
};

export const placeOrder = async (cartId, orderData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/cart/${cartId}/place-order`,
      orderData,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error placing order");
  }
};

export const cancelOrder = async (cartId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/cart/${cartId}/cancel-order`,
      null,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error canceling order");
  }
};

export const updateCartItemStatus = async (cartItemId, status) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/cart/items/${cartItemId}/status?status=${status}`,
      null,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error updating cart item status"
    );
  }
};

export const removeCartItem = async (cartItemId) => {
  try {
    await axios.delete(`${BASE_URL}/cart/items/${cartItemId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error removing cart item"
    );
  }
};

export const getCart = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/cart`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching cart");
  }
};
