import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Cart from './pages/Cart';
import SearchPage from './pages/SearchPage';
import ProductDetailPage from './pages/ProductDetailPage';
import StaffDashboard from './pages/StaffDashboard';
import AdminLayout from './pages/AdminLayout';
import AdminProducts from './pages/AdminProducts';
import AdminStaff from './pages/AdminStaff';
import AdminChat from './pages/AdminChat';
import AdminDashboard from './pages/AdminDashboard';
import StaffLayout from './pages/StaffLayout';
import StaffProducts from './pages/StaffProducts';
import StaffChat from './pages/StaffChat';
import OrderHistory from './pages/OrderHistory';
import Profile from './pages/Profile';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [orderHistory, setOrderHistory] = useState(() => {
    const savedOrders = localStorage.getItem('orderHistory');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
  };

  const addToCart = (product) => {
    if (!isAuthenticated) {
      alert('Please log in to add items to cart.');
      return;
    }
    setCartCount((prev) => prev + (product.quantity || 1));
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

  const placeOrder = (orderDetails) => {
    if (!isAuthenticated) {
      alert('Please log in to place an order.');
      return;
    }
    const newOrder = {
      id: Date.now(),
      items: orderDetails.items,
      total: orderDetails.total,
      date: new Date().toLocaleString(),
    };
    setOrderHistory((prev) => {
      const updatedHistory = [...prev, newOrder];
      localStorage.setItem('orderHistory', JSON.stringify(updatedHistory));
      return updatedHistory;
    });
    alert('Order placed successfully! Check your order history.');
  };

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    const storedUsername = localStorage.getItem('username');
    if (storedRole && storedUsername) {
      setIsAuthenticated(true);
      setUserRole(storedRole);
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header
          isAuthenticated={isAuthenticated}
          handleLogout={handleLogout}
          cartCount={cartCount}
          userRole={userRole} // Thêm prop userRole
        />
        <Routes>
          <Route path="/" element={<HomePage addToCart={addToCart} cartItems={cartItems} setCartItems={setCartItems} />} />
          <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />
          <Route
            path="/cart"
            element={isAuthenticated ? <Cart cartItems={cartItems} setCartItems={setCartItems} cartCount={cartCount} setCartCount={setCartCount} placeOrder={placeOrder} /> : <Navigate to="/login" />}
          />
          <Route
            path="/search"
            element={isAuthenticated ? <SearchPage addToCart={addToCart} /> : <Navigate to="/login" />}
          />
          <Route
            path="/product/:id"
            element={isAuthenticated ? <ProductDetailPage addToCart={addToCart} /> : <Navigate to="/login" />}
          />
          <Route
            path="/staff"
            element={isAuthenticated && userRole === 'STAFF' ? <StaffLayout /> : <Navigate to="/login" />}
          >
            <Route index element={<StaffDashboard />} />
            <Route path="products" element={<StaffProducts />} />
            <Route path="chat" element={<StaffChat />} />
          </Route>
          <Route
            path="/admin"
            element={isAuthenticated && userRole === 'ADMIN' ? <AdminLayout /> : <Navigate to="/login" />}
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="staff" element={<AdminStaff />} />
            <Route path="chat" element={<AdminChat />} />
          </Route>
          <Route
            path="/order-history"
            element={isAuthenticated ? <OrderHistory orderHistory={orderHistory} /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;