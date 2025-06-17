import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getAllGoods } from "../api/Goods";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const HomePage = ({ addToCart, cartItems, setCartItems }) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 8;
  const navigate = useNavigate();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [chatBotOpen, setChatBotOpen] = useState(false);
  const [chatBotMessages, setChatBotMessages] = useState([]);
  const [botMessage, setBotMessage] = useState("");
  const [isBotSending, setIsBotSending] = useState(false);
  const [botError, setBotError] = useState(null);
  const [chatStaffOpen, setChatStaffOpen] = useState(false);
  const [chatStaffMessages, setChatStaffMessages] = useState([]);
  const [staffMessage, setStaffMessage] = useState("");
  const [isStaffSending, setIsStaffSending] = useState(false);
  const [staffError, setStaffError] = useState(null);

  const banners = [
    "https://placehold.co/1200x400?text=Big+Sale+Up+to+50%25+Off&font=arial",
    "https://placehold.co/1200x400?text=New+Arrivals+2025&font=arial",
    "https://placehold.co/1200x400?text=Free+Shipping+This+Week&font=arial",
  ];

  const stores = [
    { id: 1, name: "Main Store", location: "Hanoi" },
    { id: 2, name: "Branch Store", location: "Ho Chi Minh City" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllGoods();
        console.log("API Response in HomePage:", data);
        if (data.code === 1000 && Array.isArray(data.result)) {
          const productsWithReviews = data.result.map((p) => ({
            id: p.goodsId,
            name: p.goodsName,
            price: p.price,
            category: p.goodsCategory,
            imageURL: p.goodsImageUrl
              ? `${BASE_URL}${p.goodsImageUrl}`
              : "https://placehold.co/200x200?text=Image+Not+Available",
            stock: p.quantity,
            description: p.goodsDescription || "No description available",
            brand: p.goodsBrand,
            version: p.goodsVersion,
            reviewCount: p.reviews ? p.reviews.length : 0,
          }));
          setProducts(productsWithReviews);
          setTotalPages(
            Math.ceil(productsWithReviews.length / productsPerPage)
          );
        } else {
          throw new Error("Unexpected API response format");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        alert("Failed to load products. Please try again.");
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const renderPagination = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      pageNumbers.push(1);
      if (currentPage > 3) pageNumbers.push("...");
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
      if (currentPage < totalPages - 2) pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }
    return pageNumbers.map((number, index) => (
      <button
        key={index}
        onClick={() => typeof number === "number" && paginate(number)}
        className={`mx-1 px-3 py-1 rounded-full ${
          currentPage === number
            ? "bg-blue-600 text-white"
            : "bg-gray-300 text-gray-700"
        }`}
        disabled={number === "..."}
      >
        {number}
      </button>
    ));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        const data = await getAllGoods();
        const filtered = data.result.filter((p) =>
          p.goodsName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const productsWithReviews = filtered.map((p) => ({
          id: p.goodsId,
          name: p.goodsName,
          price: p.price,
          category: p.goodsCategory,
          imageURL: p.goodsImageUrl
            ? `${BASE_URL}${p.goodsImageUrl}`
            : "https://placehold.co/200x200?text=Image+Not+Available",
          stock: p.quantity,
          description: p.goodsDescription || "No description available",
          brand: p.goodsBrand,
          version: p.goodsVersion,
          reviewCount: p.reviews ? p.reviews.length : 0,
        }));
        setProducts(productsWithReviews);
        setTotalPages(Math.ceil(filtered.length / productsPerPage));
        setCurrentPage(1);
      } catch (error) {
        console.error("Error searching products:", error);
        alert("Failed to search products.");
      }
    }
  };

  const handleSendBotMessage = async () => {
    if (!botMessage.trim() || isBotSending) return;
    setIsBotSending(true);
    setBotError(null);
    const userMessage = {
      text: botMessage,
      sender: "user",
      time: new Date().toLocaleTimeString(),
    };
    setChatBotMessages((prev) => [...prev, userMessage]);
    setBotMessage("");
    try {
      const response = await fetch("https://your-backend-api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: botMessage }),
      });
      if (!response.ok) throw new Error("Failed to send message");
      const data = await response.json();
      const botReply = {
        text: data.reply,
        sender: "bot",
        time: new Date().toLocaleTimeString(),
      };
      setChatBotMessages((prev) => [...prev, botReply]);
    } catch (err) {
      setBotError("Error sending message. Please try again.");
      console.error(err);
    } finally {
      setIsBotSending(false);
    }
  };

  const handleSendStaffMessage = async () => {
    if (!staffMessage.trim() || isStaffSending) return;
    setIsStaffSending(true);
    setStaffError(null);
    const userMessage = {
      text: staffMessage,
      sender: "user",
      time: new Date().toLocaleTimeString(),
    };
    setChatStaffMessages((prev) => [...prev, userMessage]);
    setStaffMessage("");
    try {
      const response = await fetch("https://your-backend-api/staff-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: staffMessage }),
      });
      if (!response.ok) throw new Error("Failed to send message");
      const data = await response.json();
      const staffReply = {
        text: data.reply,
        sender: "staff",
        time: new Date().toLocaleTimeString(),
      };
      setChatStaffMessages((prev) => [...prev, staffReply]);
    } catch (err) {
      setStaffError("Error sending message. Please try again.");
      console.error(err);
    } finally {
      setIsStaffSending(false);
    }
  };

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  return (
    <div className="bg-gray-50">
      <div className="relative w-full h-[500px] overflow-hidden">
        {banners.map((banner, index) => (
          <img
            key={index}
            src={banner}
            alt={`Banner ${index + 1}`}
            className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-1000 ${
              index === currentBanner ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`w-4 h-4 rounded-full ${
                index === currentBanner ? "bg-blue-600" : "bg-gray-300"
              } transition duration-300`}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto py-12 px-4">
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

        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Categories</h2>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
                className={`px-6 py-3 rounded-full text-lg font-medium transition duration-300 ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <Link to={`/product/${product.id}`} key={product.id}>
                  <ProductCard
                    product={product}
                    addToCart={() => addToCart(product)}
                  />
                </Link>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 text-lg">
                No products found in this category.
              </p>
            )}
          </div>
          <div className="flex justify-center mt-6">{renderPagination()}</div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Stores</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {stores.map((store) => (
              <div
                key={store.id}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
              >
                <h3 className="text-xl font-semibold text-gray-800">
                  {store.name}
                </h3>
                <p className="text-gray-600 mt-2">{store.location}</p>
                <button className="mt-4 text-blue-600 hover:underline">
                  Visit Store
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 flex space-x-4">
        <div className="bg-white shadow-lg rounded-lg p-4 w-80 min-w-[300px] max-w-[500px] min-h-[100px] max-h-[600px] resize overflow-auto">
          <div
            className="flex justify-between items-center mb-2 cursor-pointer"
            onClick={() => setChatBotOpen(!chatBotOpen)}
          >
            <h3 className="text-lg font-semibold">Chat with Bot</h3>
          </div>
          {chatBotOpen && (
            <>
              <div className="h-40 overflow-y-auto border p-2 mb-2 bg-gray-100">
                {chatBotMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-2 ${
                      msg.sender === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    <span
                      className={`p-2 rounded-lg ${
                        msg.sender === "user" ? "bg-blue-200" : "bg-gray-200"
                      }`}
                    >
                      {msg.text}{" "}
                      <small className="text-gray-500">({msg.time})</small>
                    </span>
                  </div>
                ))}
              </div>
              {botError && <p className="text-red-600 mb-2">{botError}</p>}
              <div className="flex">
                <input
                  type="text"
                  value={botMessage}
                  onChange={(e) => setBotMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isBotSending}
                />
                <button
                  onClick={handleSendBotMessage}
                  className="bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700"
                  disabled={isBotSending}
                >
                  {isBotSending ? "Sending..." : "Send"}
                </button>
              </div>
            </>
          )}
        </div>

        <div className="bg-white shadow-lg rounded-lg p-4 w-80 min-w-[300px] max-w-[500px] min-h-[100px] max-h-[600px] resize overflow-auto">
          <div
            className="flex justify-between items-center mb-2 cursor-pointer"
            onClick={() => setChatStaffOpen(!chatStaffOpen)}
          >
            <h3 className="text-lg font-semibold">Chat with Staff</h3>
          </div>
          {chatStaffOpen && (
            <>
              <div className="h-40 overflow-y-auto border p-2 mb-2 bg-gray-100">
                {chatStaffMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-2 ${
                      msg.sender === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    <span
                      className={`p-2 rounded-lg ${
                        msg.sender === "user" ? "bg-blue-200" : "bg-gray-200"
                      }`}
                    >
                      {msg.text}{" "}
                      <small className="text-gray-500">({msg.time})</small>
                    </span>
                  </div>
                ))}
              </div>
              {staffError && <p className="text-red-600 mb-2">{staffError}</p>}
              <div className="flex">
                <input
                  type="text"
                  value={staffMessage}
                  onChange={(e) => setStaffMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isStaffSending}
                />
                <button
                  onClick={handleSendStaffMessage}
                  className="bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700"
                  disabled={isStaffSending}
                >
                  {isStaffSending ? "Sending..." : "Send"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
