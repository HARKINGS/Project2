import React from "react";

const ProductCard = ({ product, addToCart }) => {
  const { id, name, price, imageURL, stock } = product;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
      <img
        src={
          imageURL || "https://placehold.co/200x200?text=Image+Not+Available"
        }
        alt={name}
        className="w-full h-48 object-cover rounded-md"
        onError={(e) => {
          e.target.src =
            "https://placehold.co/200x200?text=Image+Not+Available";
        }}
      />
      <h3 className="text-lg font-semibold mt-2">{name}</h3>
      <p className="text-gray-600 mt-1">
        ${typeof price === "number" ? price.toFixed(2) : "N/A"}
      </p>
      <p className="text-gray-500 text-sm">Stock: {stock}</p>
      <button
        onClick={() => addToCart(product)}
        className="mt-2 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
        disabled={stock <= 0}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
