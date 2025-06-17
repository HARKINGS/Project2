import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getAllGoods,
  createGoods,
  updateGoodsById,
  deleteGoodsById,
  getGoodsByName,
  uploadImage,
} from "../api/Goods";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    goodsName: "",
    goodsVersion: "",
    price: "",
    quantity: "",
    goodsBrand: "",
    goodsDescription: "",
    goodsCategory: "",
    goodsImageURL: "",
    imageFile: null,
  });
  const [editProduct, setEditProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllGoods();
      console.log("API response from getAllGoods:", data); // Debug log
      if (data.code !== 1000) {
        throw new Error(data.message || "Lấy danh sách sản phẩm thất bại");
      }
      setProducts(data.result || []);
      setError(null);
    } catch (error) {
      console.error("Lỗi lấy danh sách sản phẩm:", error);
      setError(error.message || "Không thể tải sản phẩm. Vui lòng thử lại.");
      toast.error(error.message);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [navigate]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!newProduct.goodsName || !newProduct.goodsCategory) {
        throw new Error("Tên sản phẩm và danh mục là bắt buộc");
      }
      if (!newProduct.price || newProduct.price <= 0) {
        throw new Error("Giá phải lớn hơn 0");
      }
      if (!newProduct.quantity || newProduct.quantity < 0) {
        throw new Error("Số lượng không được âm");
      }

      let goodsImageURL = newProduct.goodsImageURL;
      if (newProduct.imageFile) {
        goodsImageURL = await uploadImage(newProduct.imageFile);
      }

      const goodsData = {
        goodsName: newProduct.goodsName,
        goodsVersion: newProduct.goodsVersion || undefined,
        price: parseFloat(newProduct.price),
        quantity: parseInt(newProduct.quantity),
        goodsBrand: newProduct.goodsBrand || undefined,
        goodsDescription: newProduct.goodsDescription || undefined,
        goodsCategory: newProduct.goodsCategory || "DefaultCategory", // Fallback
        goodsImageURL: goodsImageURL || undefined,
      };

      console.log("Sending goodsData:", goodsData);
      const data = await createGoods({ goodsData });
      toast.success("Thêm sản phẩm thành công!");
      await fetchProducts(); // Cập nhật danh sách sau khi thêm
      setNewProduct({
        goodsName: "",
        goodsVersion: "",
        price: "",
        quantity: "",
        goodsBrand: "",
        goodsDescription: "",
        goodsCategory: "",
        goodsImageURL: "",
        imageFile: null,
      });
      setError(null);
    } catch (error) {
      console.error("Lỗi thêm sản phẩm:", error);
      setError(`Thêm sản phẩm thất bại: ${error.message}`);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditProduct({
      goodsId: product.goodsId,
      goodsName: product.goodsName,
      goodsVersion: product.goodsVersion || "",
      price: product.price || "",
      quantity: product.quantity || "",
      goodsBrand: product.goodsBrand || "",
      goodsDescription: product.goodsDescription || "",
      goodsCategory: product.goodsCategory || "",
      goodsImageURL: product.goodsImageURL || "",
      imageFile: null,
    });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!editProduct.goodsName || !editProduct.goodsCategory) {
        throw new Error("Tên sản phẩm và danh mục là bắt buộc");
      }
      if (!editProduct.price || editProduct.price <= 0) {
        throw new Error("Giá phải lớn hơn 0");
      }
      if (!editProduct.quantity || editProduct.quantity < 0) {
        throw new Error("Số lượng không được âm");
      }

      let goodsImageURL = editProduct.goodsImageURL;
      if (editProduct.imageFile) {
        goodsImageURL = await uploadImage(editProduct.imageFile);
      }

      const updatedData = {
        goodsName: editProduct.goodsName,
        goodsVersion: editProduct.goodsVersion || undefined,
        price: parseFloat(editProduct.price),
        quantity: parseInt(editProduct.quantity),
        goodsBrand: editProduct.goodsBrand || undefined,
        goodsDescription: editProduct.goodsDescription || undefined,
        goodsCategory: editProduct.goodsCategory || "DefaultCategory",
        goodsImageURL: goodsImageURL || undefined,
      };

      const data = await updateGoodsById(editProduct.goodsId, updatedData);
      await fetchProducts(); // Cập nhật danh sách sau khi sửa
      setEditProduct(null);
      toast.success("Cập nhật sản phẩm thành công!");
      setError(null);
    } catch (error) {
      console.error("Lỗi cập nhật sản phẩm:", error);
      setError(`Cập nhật sản phẩm thất bại: ${error.message}`);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (goodsId) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      setLoading(true);
      try {
        await deleteGoodsById(goodsId);
        await fetchProducts(); // Cập nhật danh sách sau khi xóa
        toast.success("Xóa sản phẩm thành công!");
        setError(null);
      } catch (error) {
        console.error("Lỗi xóa sản phẩm:", error);
        setError(`Xóa sản phẩm thất bại: ${error.message}`);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = !searchQuery.trim()
        ? await getAllGoods()
        : await getGoodsByName(searchQuery);
      setProducts(data.result || []);
      setError(null);
    } catch (error) {
      console.error("Lỗi tìm kiếm sản phẩm:", error);
      setError(`Tìm kiếm sản phẩm thất bại: ${error.message}`);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File ảnh quá lớn (tối đa 5MB).");
        return;
      }
      setNewProduct((prev) => ({
        ...prev,
        imageFile: file,
        goodsImageURL: URL.createObjectURL(file),
      }));
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File ảnh quá lớn (tối đa 5MB).");
        return;
      }
      setEditProduct((prev) => ({
        ...prev,
        imageFile: file,
        goodsImageURL: URL.createObjectURL(file),
      }));
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Quản lý sản phẩm
      </h1>
      {error && <div className="p-3 text-red-600 mb-4">{error}</div>}
      {loading && <p className="p-3 text-gray-600 mb-4">Đang tải...</p>}
      <form onSubmit={handleSearch} className="mb-4 flex space-x-2">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          disabled={loading}
        >
          Tìm kiếm
        </button>
      </form>
      <form
        onSubmit={handleAddProduct}
        className="mb-8 bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-semibold mb-4">Thêm sản phẩm mới</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="goodsName"
            placeholder="Tên sản phẩm"
            value={newProduct.goodsName}
            onChange={handleInputChange}
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="goodsVersion"
            placeholder="Phiên bản (tùy chọn)"
            value={newProduct.goodsVersion}
            onChange={handleInputChange}
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            name="price"
            placeholder="Giá"
            value={newProduct.price}
            onChange={handleInputChange}
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            min="0"
            step="0.01"
          />
          <input
            type="number"
            name="quantity"
            placeholder="Số lượng"
            value={newProduct.quantity}
            onChange={handleInputChange}
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            min="0"
            step="1"
          />
          <input
            type="text"
            name="goodsBrand"
            placeholder="Thương hiệu (tùy chọn)"
            value={newProduct.goodsBrand}
            onChange={handleInputChange}
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="goodsCategory"
            placeholder="Danh mục"
            value={newProduct.goodsCategory}
            onChange={handleInputChange}
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <textarea
            name="goodsDescription"
            placeholder="Mô tả (tùy chọn)"
            value={newProduct.goodsDescription}
            onChange={handleInputChange}
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
          />
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hình ảnh sản phẩm
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="p-3 border rounded-md w-full mb-2"
            />
            <input
              type="text"
              name="goodsImageURL"
              placeholder="Hoặc nhập URL ảnh (tùy chọn)"
              value={newProduct.goodsImageURL}
              onChange={handleInputChange}
              className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {newProduct.goodsImageURL && (
              <img
                src={newProduct.goodsImageURL}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover rounded"
              />
            )}
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Đang thêm..." : "Thêm sản phẩm"}
        </button>
      </form>
      {editProduct && (
        <form
          onSubmit={handleUpdateProduct}
          className="mb-8 bg-white p-6 rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-semibold mb-4">Cập nhật sản phẩm</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="goodsName"
              placeholder="Tên sản phẩm"
              value={editProduct.goodsName}
              onChange={handleEditInputChange}
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="goodsVersion"
              placeholder="Phiên bản (tùy chọn)"
              value={editProduct.goodsVersion}
              onChange={handleEditInputChange}
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="price"
              placeholder="Giá"
              value={editProduct.price}
              onChange={handleEditInputChange}
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="0"
              step="0.01"
            />
            <input
              type="number"
              name="quantity"
              placeholder="Số lượng"
              value={editProduct.quantity}
              onChange={handleEditInputChange}
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="0"
              step="1"
            />
            <input
              type="text"
              name="goodsBrand"
              placeholder="Thương hiệu (tùy chọn)"
              value={editProduct.goodsBrand}
              onChange={handleEditInputChange}
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="goodsCategory"
              placeholder="Danh mục"
              value={editProduct.goodsCategory}
              onChange={handleEditInputChange}
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <textarea
              name="goodsDescription"
              placeholder="Mô tả (tùy chọn)"
              value={editProduct.goodsDescription}
              onChange={handleEditInputChange}
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hình ảnh sản phẩm
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleEditImageChange}
                className="p-3 border rounded-md w-full mb-2"
              />
              <input
                type="text"
                name="goodsImageURL"
                placeholder="Hoặc nhập URL ảnh (tùy chọn)"
                value={editProduct.goodsImageURL}
                onChange={handleEditInputChange}
                className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {editProduct.goodsImageURL && (
                <img
                  src={editProduct.goodsImageURL}
                  alt="Preview"
                  className="mt-2 w-32 h-32 object-cover rounded"
                />
              )}
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? "Đang cập nhật..." : "Cập nhật sản phẩm"}
            </button>
            <button
              type="button"
              onClick={() => setEditProduct(null)}
              className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
            >
              Hủy
            </button>
          </div>
        </form>
      )}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Danh sách sản phẩm</h2>
        {products.length === 0 && !loading ? (
          <p className="text-gray-500">Không có sản phẩm nào.</p>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product.goodsId}
                className="flex items-center justify-between border-b py-4"
              >
                <div className="flex items-center">
                  <img
                    src={
                      product.goodsImageURL || "https://via.placeholder.com/100"
                    }
                    alt={product.goodsName}
                    className="w-16 h-16 object-cover mr-4 rounded"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">
                      {product.goodsName}
                    </h3>
                    <p className="text-gray-600">
                      Giá: {product.price.toFixed(2)} VNĐ | Số lượng:{" "}
                      {product.quantity} | Danh mục: {product.goodsCategory}
                    </p>
                    {product.goodsBrand && (
                      <p className="text-gray-500">
                        Thương hiệu: {product.goodsBrand}
                      </p>
                    )}
                    {product.goodsDescription && (
                      <p className="text-gray-500">
                        Mô tả: {product.goodsDescription}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="text-blue-600 hover:text-blue-800"
                    disabled={loading}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.goodsId)}
                    className="text-red-600 hover:text-red-800"
                    disabled={loading}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
