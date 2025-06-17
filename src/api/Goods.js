import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Lấy danh sách sản phẩm
export const getAllGoods = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/goods/all-goods`, {
      headers: { "Content-Type": "application/json" },
      mode: "cors",
      credentials: "include",
      cache: "no-cache",
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

// Lấy sản phẩm theo ID
export const getGoodsById = async (goodsId) => {
  try {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await fetch(`${BASE_URL}/goods/details/${goodsId}`, {
      method: "GET",
      headers,
      mode: "cors",
      credentials: "include",
      cache: "no-cache",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Lấy sản phẩm theo ID thất bại");
    }
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm theo ID:", error);
    throw error;
  }
};

// Tạo sản phẩm mới
export const createGoods = async (goodsData) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Vui lòng đăng nhập trước.");

  console.log("Token:", token); // Kiểm tra token
  console.log("Goods Data:", goodsData); // Kiểm tra dữ liệu sản phẩm

  try {
    const response = await axios.post(`${BASE_URL}/goods`, goodsData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Thêm sản phẩm thất bại");
    }
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error);
    throw error;
  }
};

// Tìm kiếm sản phẩm theo tên
export const getGoodsByName = async (goodsName) => {
  try {
    const response = await axios.get(`${BASE_URL}/goods/goodsName`, {
      params: { goodsName },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm sản phẩm theo tên:", error);
    throw error;
  }
};

// Tìm kiếm sản phẩm theo danh mục
export const getGoodsByType = async (goodsCategory) => {
  try {
    const response = await axios.get(`${BASE_URL}/goods/goodsCategory`, {
      params: { goodsCategory },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm sản phẩm theo danh mục:", error);
    throw error;
  }
};

// Tìm kiếm sản phẩm theo thương hiệu
export const getGoodsByBrand = async (goodsBrand) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/goods/by-brand/${goodsBrand}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm sản phẩm theo thương hiệu:", error);
    throw error;
  }
};

// Tìm kiếm sản phẩm theo giá
export const getGoodsByPrice = async (minPrice, maxPrice) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/goods/${minPrice}_${maxPrice}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm sản phẩm theo giá:", error);
    throw error;
  }
};

// Sắp xếp sản phẩm theo tên tăng dần
export const sortGoodsByNameAsc = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/goods/sort-name-asc`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi sắp xếp sản phẩm theo tên tăng dần:", error);
    throw error;
  }
};

// Sắp xếp sản phẩm theo tên giảm dần
export const sortGoodsByNameDesc = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/goods/sort-name-desc`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi sắp xếp sản phẩm theo tên giảm dần:", error);
    throw error;
  }
};

// Cập nhật sản phẩm
export const updateGoodsById = async (goodsId, goodsData) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Vui lòng đăng nhập trước.");

  console.log("Token:", token); // Kiểm tra token
  console.log("Goods Data:", goodsData); // Kiểm tra dữ liệu sản phẩm

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

// Xóa sản phẩm theo ID
export const deleteGoodsById = async (goodsId) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Vui lòng đăng nhập trước.");

  console.log("Token:", token); // Kiểm tra token
  console.log("Goods Data:", goodsId); // Kiểm tra dữ liệu sản phẩm

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

// Lấy đánh giá sản phẩm theo ID
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
