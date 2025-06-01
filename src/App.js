import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Cart from './pages/Cart';
import SearchPage from './pages/SearchPage';
import ProductDetailPage from './pages/ProductDetailPage';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const addToCart = (product) => {
    setCartCount(cartCount + (product.quantity || 1));
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      }
      return [...prev, { ...product, quantity: product.quantity || 1 }];
    });
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header isAuthenticated={isAuthenticated} handleLogout={handleLogout} cartCount={cartCount} />
        <Routes>
          <Route
            path="/"
            element={<HomePage addToCart={addToCart} cartItems={cartItems} setCartItems={setCartItems} />}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/cart"
            element={<Cart cartItems={cartItems} setCartItems={setCartItems} cartCount={cartCount} setCartCount={setCartCount} />}
          />
          <Route path="/search" element={<SearchPage addToCart={addToCart} />} />
          <Route path="/product/:id" element={<ProductDetailPage addToCart={addToCart} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;