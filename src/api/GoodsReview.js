import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
// Lấy token từ localStorage (giả sử token được lưu dưới key 'token')
const getToken = () => localStorage.getItem("token");

// Tạo đánh giá sản phẩm
export const createReview = async (reviewData) => {
  const token = getToken();
  if (!token) {
    throw new Error("No token found. Please log in first.");
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/reviews/create/${reviewData.goodsId}`, // Sửa BASE_URL để khớp với backend
      {
        content: reviewData.content,
        rating: reviewData.rating || 1, // Mặc định rating là 1 thay vì 0 để tuân thủ @Min(1)
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status < 200 || response.status >= 300) {
      throw new Error(response.data.message || "Review creation failed");
    }
    return response.data;
  } catch (error) {
    console.error("Review creation error:", error);
    throw error.response?.data?.message || error.message || "An error occurred";
  }
};

// Lấy danh sách đánh giá sản phẩm
export const getAllReviews = async () => {
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

export const updateReview = async (reviewId, reviewData) => {
  const token = getToken();
  if (!token) {
    throw new Error("No token found. Please log in first.");
  }

  try {
    console.log("Updating review with data:", reviewData); // Log dữ liệu gửi đi
    const response = await axios.put(
      `${BASE_URL}/reviews/${reviewId}`,
      {
        content: reviewData.content,
        rating: reviewData.rating,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status < 200 || response.status >= 300) {
      throw new Error(response.data.message || "Review update failed");
    }
    return response.data;
  } catch (error) {
    console.error("Review update error:", error);
    throw error.response?.data?.message || error.message || "An error occurred";
  }
};
