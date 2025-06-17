import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const token = localStorage.getItem("token"); // Lấy token từ localStorage

// Tạo đánh giá sản phẩm
export const createReview = async (reviewData) => {
  if (!token) {
    throw new Error("No token found. Please log in first.");
  }
  try {
    const response = await axios.post(
      `${BASE_URL}/reviews/create`,
      reviewData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Gửi token để xác thực
        },
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Review creation failed");
    return data;
  } catch (error) {
    console.error("Review creation error:", error);
    throw error;
  }
};

// Lấy danh sách đánh giá sản phẩm
export const getAllReviews = async () => {
  // if (!token) {
  //     throw new Error('No token found. Please log in first.');
  // }
  try {
    const response = await axios.get(`${BASE_URL}/reviews`, {
      headers: {
        "Content-Type": "application/json",
        // 'Authorization': `Bearer ${token}` // Gửi token để xác thực
      },
    });
    const data = response.data;
    if (!response.ok)
      throw new Error(data.message || "Failed to fetch reviews");
    return data;
  } catch (error) {
    console.error("Fetch reviews error:", error);
    throw error;
  }
};

// Lấy đanh sách đánh giá theo ID sản phẩm
export const getReviewsByGoodsId = async (goodsId) => {
  // if (!token) {
  //     throw new Error('No token found. Please log in first.');
  // }
  try {
    const response = await axios.get(`${BASE_URL}/reviews/${goodsId}`, {
      headers: {
        "Content-Type": "application/json",
        // 'Authorization': `Bearer ${token}` // Gửi token để xác thực
      },
    });
    const data = response.data;
    if (!response.ok)
      throw new Error(data.message || "Failed to fetch reviews by goods ID");
    return data;
  } catch (error) {
    console.error("Fetch reviews by goods ID error:", error);
    throw error;
  }
};

// Cập nhật đánh giá sản phẩm
export const updateReview = async (reviewId, reviewData) => {
  if (!token) {
    throw new Error("No token found. Please log in first.");
  }
  try {
    const response = await axios.put(
      `${BASE_URL}/reviews/${reviewId}`,
      reviewData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Gửi token để xác thực
        },
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Review update failed");
    return data;
  } catch (error) {
    console.error("Review update error:", error);
    throw error;
  }
};
