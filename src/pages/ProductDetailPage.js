import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const products = [
  { id: 1, name: 'Laptop Pro', price: 1299.99, category: 'Electronics', stock: 50, description: 'High-performance laptop with 16GB RAM and 1TB SSD.' },
  { id: 2, name: 'Smartphone X', price: 699.99, category: 'Electronics', stock: 100, description: 'Latest smartphone with 5G and 128GB storage.' },
  { id: 3, name: 'Running Shoes', price: 89.99, category: 'Fashion', stock: 75, description: 'Comfortable running shoes with breathable fabric.' },
  { id: 4, name: 'Winter Jacket', price: 149.99, category: 'Fashion', stock: 60, description: 'Warm winter jacket with waterproof coating.' },
  { id: 5, name: 'Gaming Mouse', price: 49.99, category: 'Electronics', stock: 120, description: 'Ergonomic gaming mouse with customizable buttons.' },
  { id: 6, name: 'Casual Sneakers', price: 59.99, category: 'Fashion', stock: 90, description: 'Stylish casual sneakers for everyday use.' },
];

const ProductDetailPage = ({ addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === parseInt(id));
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    { id: 1, user: 'User1', text: 'Great product!', date: '2025-05-31' },
    { id: 2, user: 'User2', text: 'Works perfectly!', date: '2025-05-30' },
  ]);

  useEffect(() => {
    if (!product) navigate('/');
  }, [product, navigate]);

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    alert(`${quantity} ${product.name}(s) added to cart!`);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      setComments([
        ...comments,
        { id: Date.now(), user: 'CurrentUser', text: comment, date: new Date().toISOString().split('T')[0] },
      ]);
      setComment('');
    }
  };

  const handleQuantityChange = (e) => {
    const value = Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1));
    setQuantity(value);
  };

  if (!product) return <div className="text-center text-gray-500">Product not found.</div>;

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
              src={`https://via.placeholder.com/400x400?text=${product.name}`}
              alt={product.name}
              className="w-full h-auto rounded-lg"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-xl font-semibold text-gray-800 mb-4">Price: ${product.price.toFixed(2)}</p>
            <p className="text-gray-600 mb-4">Stock: {product.stock} units available</p>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Quantity:</label>
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
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
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

        {/* Comments Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Comments</h2>
          <div className="space-y-4 mb-4">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-800"><strong>{comment.user}</strong> - {comment.date}</p>
                <p className="text-gray-600">{comment.text}</p>
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