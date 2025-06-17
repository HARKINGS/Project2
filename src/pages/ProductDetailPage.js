import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGoodsById, getReviewsByGoodsId } from "../api/Goods";
import { createReview } from "../api/GoodsReview";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const ProductDetailPage = ({ addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchProductAndReviews = async () => {
      try {
        const productData = await getGoodsById(id);
        console.log("API Response in ProductDetailPage:", productData);
        if (productData && productData.goods) {
          const goods = productData.goods;
          setProduct({
            id: goods.goodsId,
            name: goods.goodsName || "Unnamed Product",
            price: goods.price || 0,
            stock: goods.quantity || 0,
            description: goods.goodsDescription || "No description available",
            category: goods.goodsCategory || "Uncategorized",
            imageURL: goods.goodsImageUrl
              ? `${BASE_URL}${goods.goodsImageUrl}`
              : "https://placehold.co/400x400?text=Image+Not+Available",
            brand: goods.goodsBrand || "Unknown Brand",
            version: goods.goodsVersion || "1.0",
          });
          setReviews(productData.reviews || []);
        } else {
          throw new Error("Dữ liệu sản phẩm không hợp lệ hoặc không tìm thấy");
        }
      } catch (error) {
        console.error("Error fetching product or reviews:", error);
        setError(
          error.message || "Không thể tải thông tin sản phẩm hoặc đánh giá"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [id, navigate, BASE_URL]);

  const handleAddToCart = () => {
    if (product && quantity <= product.stock) {
      addToCart({ ...product, quantity });
      alert(`${quantity} ${product.name}(s) added to cart!`);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (comment.trim() && product) {
      try {
        const username = localStorage.getItem("username") || "Anonymous"; // Lấy username từ localStorage
        const reviewData = {
          userName: username,
          content: comment,
          rating: 0, // Mặc định là 0, có thể thêm input rating sau
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const response = await createReview({ id, reviewData });
        if (response.code !== 1000) {
          throw new Error(
            response.message || "Lỗi không xác định khi tạo bình luận"
          );
        }
        setReviews([...reviews, response.result]);
        setComment("");
      } catch (error) {
        console.error("Error adding review:", error);
        const errorMessage =
          error.response?.data?.message ||
          (error.message.includes("Network Error")
            ? "Kết nối mạng thất bại"
            : "Không thể thêm bình luận. Vui lòng thử lại sau.");
        setError(errorMessage);
      }
    }
  };

  const handleQuantityChange = (e) => {
    const value = Math.max(
      1,
      Math.min(product?.stock || 1, parseInt(e.target.value) || 1)
    );
    setQuantity(value);
  };

  if (loading)
    return <div className="text-center text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!product)
    return (
      <div className="text-center text-gray-500">Sản phẩm không tồn tại.</div>
    );

  const formattedPrice =
    typeof product.price === "number" ? product.price.toFixed(2) : "N/A";

  return (
    <div className="container mx-auto py-12 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-blue-600 hover:underline"
        >
          Back to Products
        </button>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            <img
              src={product.imageURL}
              alt={product.name}
              className="w-full h-auto rounded-lg"
              onError={(e) => {
                e.target.src =
                  "https://placehold.co/400x400?text=Image+Not+Available";
              }}
            />
          </div>
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {product.name}
            </h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-xl font-semibold text-gray-800 mb-4">
              Price: ${formattedPrice}
            </p>
            <p className="text-gray-600 mb-4">
              Stock: {product.stock} units available
            </p>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Quantity:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  max={product.stock}
                  className="w-20 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
                >
                  -
                </button>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300"
              disabled={quantity > product.stock}
            >
              Add to Cart
            </button>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Reviews ({reviews.length})
          </h2>
          <div className="space-y-4 mb-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-800">
                  <strong>{review.userName}</strong> - {review.createdAt}
                </p>
                <p className="text-gray-600">{review.content}</p>
                <p className="text-yellow-500">
                  Rating: {"★".repeat(review.rating)}
                </p>
              </div>
            ))}
          </div>
          <form onSubmit={handleAddComment} className="mt-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
            <button
              type="submit"
              className="mt-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Submit Comment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
