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
import StaffLayout from './pages/StaffLayout'; // Thêm import StaffLayout
import StaffProducts from './pages/StaffProducts';
import StaffChat from './pages/StaffChat';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem('userRole');
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

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
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
          userRole={userRole}
        />
        <Routes>
          <Route
            path="/"
            element={!isAuthenticated ? <HomePage addToCart={addToCart} cartItems={cartItems} setCartItems={setCartItems} /> : <Navigate to={userRole === 'ADMIN' ? '/admin' : '/staff'} />}
          />
          <Route path="/login" element={!isAuthenticated ? <LoginPage setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} /> : <Navigate to={userRole === 'ADMIN' ? '/admin' : '/staff'} />} />
          <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} cartCount={cartCount} setCartCount={setCartCount} />} />
          <Route path="/search" element={<SearchPage addToCart={addToCart} />} />
          <Route path="/product/:id" element={<ProductDetailPage addToCart={addToCart} />} />
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
        </Routes>
      </div>
    </Router>
  );
};

export default App;