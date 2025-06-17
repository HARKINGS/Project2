import axios from "axios";
import { refreshToken } from "./Auth";
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const axiosWithAuth = async (config) => {
  let token = localStorage.getItem("token");
  console.log("Token:", token);
  if (!token) throw new Error("Vui lòng đăng nhập");

  try {
    config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
    const response = await axios(config);
    return response;
  } catch (error) {
    if (error.response?.status === 401) {
      console.log("Token hết hạn, thử làm mới...");
      token = await refreshToken();
      config.headers["Authorization"] = `Bearer ${token}`;
      return axios(config);
    }
    throw error;
  }
};

export const getAllGoods = async () => {
  try {
    const response = await axiosWithAuth({
      method: "get",
      url: `${BASE_URL}/goods/all-goods`,
      headers: { "Content-Type": "application/json" },
    });
    if (response.data.code !== 1000) {
      throw new Error(
        response.data.message || "Lấy danh sách sản phẩm thất bại"
      );
    }
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    throw error;
  }
};

export const getGoodsById = async (goodsId) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Vui lòng đăng nhập trước.");
  try {
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch(`${BASE_URL}/goods/details/${goodsId}`, {
      method: "GET",
      headers,
      mode: "cors",
      credentials: "include",
      cache: "no-cache",
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Lấy sản phẩm theo ID thất bại");
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm theo ID:", error);
    throw error;
  }
};

export const uploadImage = async (imageFile) => {
  const token = localStorage.getItem("token");
  console.log("Token for upload:", token);
  if (!token) throw new Error("Vui lòng đăng nhập");
  if (!imageFile || !(imageFile instanceof File) || imageFile.size === 0) {
    throw new Error("File ảnh không hợp lệ");
  }

  try {
    const formData = new FormData();
    formData.append("image", imageFile);
    console.log("Uploading image:", imageFile.name);
    const response = await axios.post(`${BASE_URL}/goods/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Upload ảnh thất bại");
    }
    return response.data.result; // URL ảnh
  } catch (error) {
    console.error("Lỗi khi upload ảnh:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    throw error;
  }
};

export const createGoods = async ({ goodsData }) => {
  const token = localStorage.getItem("token");
  console.log("Token for createGoods:", token);
  if (!token) throw new Error("Vui lòng đăng nhập");
  if (!goodsData || !goodsData.goodsName || !goodsData.goodsCategory) {
    throw new Error("Tên sản phẩm và danh mục là bắt buộc");
  }
  if (isNaN(goodsData.price) || goodsData.price <= 0) {
    throw new Error("Giá không hợp lệ");
  }
  if (isNaN(goodsData.quantity) || goodsData.quantity < 0) {
    throw new Error("Số lượng không hợp lệ");
  }

  try {
    console.log("Sending goodsData:", goodsData);
    const response = await axios.post(`${BASE_URL}/goods`, goodsData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Thêm sản phẩm thất bại");
    }
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    throw error;
  }
};

export const getGoodsByName = async (goodsName) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Vui lòng đăng nhập trước.");
  try {
    const response = await axios.get(`${BASE_URL}/goods/goodsName`, {
      params: { goodsName },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm sản phẩm theo tên:", error);
    throw error;
  }
};

export const getGoodsByType = async (goodsCategory) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Vui lòng đăng nhập trước.");
  try {
    const response = await axios.get(`${BASE_URL}/goods/goodsCategory`, {
      params: { goodsCategory },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm sản phẩm theo danh mục:", error);
    throw error;
  }
};

export const getGoodsByBrand = async (goodsBrand) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Vui lòng đăng nhập trước.");
  try {
    const response = await axios.get(
      `${BASE_URL}/goods/by-brand/${goodsBrand}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm sản phẩm theo thương hiệu:", error);
    throw error;
  }
};

export const getGoodsByPrice = async (minPrice, maxPrice) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Vui lòng đăng nhập trước.");
  try {
    const response = await axios.get(
      `${BASE_URL}/goods/${minPrice}_${maxPrice}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm sản phẩm theo giá:", error);
    throw error;
  }
};

export const sortGoodsByNameAsc = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Vui lòng đăng nhập trước.");
  try {
    const response = await axios.get(`${BASE_URL}/goods/sort-name-asc`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi sắp xếp sản phẩm theo tên tăng dần:", error);
    throw error;
  }
};

export const sortGoodsByNameDesc = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Vui lòng đăng nhập trước.");
  try {
    const response = await axios.get(`${BASE_URL}/goods/sort-name-desc`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi sắp xếp sản phẩm theo tên giảm dần:", error);
    throw error;
  }
};

export const updateGoodsById = async (goodsId, goodsData) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Vui lòng đăng nhập trước.");
  try {
    const response = await axios.put(
      `${BASE_URL}/goods/${goodsId}`,
      goodsData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.code !== 1000)
      throw new Error(response.data.message || "Cập nhật sản phẩm thất bại");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    throw error;
  }
};

export const deleteGoodsById = async (goodsId) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Vui lòng đăng nhập trước.");
  try {
    const response = await axios.delete(`${BASE_URL}/goods/${goodsId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data.code !== 1000)
      throw new Error(response.data.message || "Xóa sản phẩm thất bại");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    throw error;
  }
};

export const getGoodsReviews = async (goodsId) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Vui lòng đăng nhập trước.");
  try {
    const response = await axios.get(`${BASE_URL}/goods/reviews/${goodsId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data.code !== 1000)
      throw new Error(
        response.data.message || "Lấy đánh giá sản phẩm thất bại"
      );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy đánh giá sản phẩm:", error);
    throw error;
  }
};
