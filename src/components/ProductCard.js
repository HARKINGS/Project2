import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <img
        src={product.imageURL}
        alt={product.name}
        className="w-full h-48 object-cover rounded-t-lg"
        onError={(e) => {
          e.target.src =
            "https://via.placeholder.com/200?text=Image+Not+Available";
          toast.error("Không thể tải ảnh sản phẩm!");
        }}
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-600">Stock: {product.stock}</p>
        <p className="text-gray-800 font-bold">${product.price.toFixed(2)}</p>
        <Link
          to={`/product/${product.id}`}
          className="mt-2 w-full bg-blue-600 text-white py-2 rounded text-center block hover:bg-blue-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
