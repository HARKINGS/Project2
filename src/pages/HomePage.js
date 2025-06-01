import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const products = [
  { id: 1, name: 'Laptop Pro', price: 1299.99, category: 'Electronics' },
  { id: 2, name: 'Smartphone X', price: 699.99, category: 'Electronics' },
  { id: 3, name: 'Running Shoes', price: 89.99, category: 'Fashion' },
  { id: 4, name: 'Winter Jacket', price: 149.99, category: 'Fashion' },
  { id: 5, name: 'Gaming Mouse', price: 49.99, category: 'Electronics' },
  { id: 6, name: 'Casual Sneakers', price: 59.99, category: 'Fashion' },
];

const banners = [
  'https://via.placeholder.com/1200x400?text=Big+Sale+Up+to+50%25+Off',
  'https://via.placeholder.com/1200x400?text=New+Arrivals+2025',
  'https://via.placeholder.com/1200x400?text=Free+Shipping+This+Week',
];

const stores = [
  { id: 1, name: 'Main Store', location: 'Hanoi' },
  { id: 2, name: 'Branch Store', location: 'Ho Chi Minh City' },
];

const HomePage = ({ addToCart, cartItems, setCartItems }) => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter((product) => product.category === selectedCategory);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    paymentMethod: 'COD',
  });

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    const orderData = {
      items: cartItems,
      total: total,
      customer: formData,
    };
    console.log('Sending order to backend:', orderData);
    alert('Order placed successfully! (Simulated)');
    setCartItems([]);
  };

  const categories = ['All', 'Electronics', 'Fashion'];

  return (
    <div className="bg-gray-50">
      {/* Carousel Banner */}
      <div className="relative w-full h-[500px] overflow-hidden">
        {banners.map((banner, index) => (
          <img
            key={index}
            src={banner}
            alt={`Banner ${index + 1}`}
            className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-1000 ${
              index === currentBanner ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`w-4 h-4 rounded-full ${
                index === currentBanner ? 'bg-blue-600' : 'bg-gray-300'
              } transition duration-300`}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-12 px-4">
        {/* Search Bar */}
        <div className="mb-12">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-4 border rounded-l-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg transition duration-300"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white p-4 rounded-r-lg hover:bg-blue-700 transition duration-300"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Categories Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Categories</h2>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full text-lg font-medium transition duration-300 ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Link to={`/product/${product.id}`} key={product.id}>
                  <ProductCard product={product} addToCart={() => addToCart(product)} />
                </Link>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 text-lg">
                No products found in this category.
              </p>
            )}
          </div>
        </div>

        {/* Stores Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Stores</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {stores.map((store) => (
              <div key={store.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
                <h3 className="text-xl font-semibold text-gray-800">{store.name}</h3>
                <p className="text-gray-600 mt-2">{store.location}</p>
                <button className="mt-4 text-blue-600 hover:underline">Visit Store</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;