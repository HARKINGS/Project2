import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../api/Auth";

const Header = ({ isAuthenticated, handleLogout, cartCount, userRole }) => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    if (userRole === "ADMIN") navigate("/admin");
    else if (userRole === "STAFF") navigate("/staff");
    else navigate("/");
  };

  const handleLogoutClick = async () => {
    try {
      await logout();
      localStorage.removeItem("token");
      handleLogout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error.message);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <nav className="bg-blue-700 p-4 shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div
          className="text-white text-3xl font-bold tracking-wide cursor-pointer"
          onClick={handleHomeClick}
        >
          ShopApp
        </div>
        <div className="space-x-6">
          {isAuthenticated && (
            <>
              <Link
                to="/profile"
                className="text-white text-lg font-medium hover:text-blue-200 transition duration-300"
              >
                Profile
              </Link>
              <Link
                to="/order-history"
                className="text-white text-lg font-medium hover:text-blue-200 transition duration-300"
              >
                Order History
              </Link>
              <button
                onClick={handleLogoutClick}
                className="text-white text-lg font-medium hover:text-blue-200 transition duration-300"
              >
                Logout
              </button>
            </>
          )}
          {!isAuthenticated && (
            <Link
              to="/login"
              className="text-white text-lg font-medium hover:text-blue-200 transition duration-300"
            >
              Login
            </Link>
          )}
          <Link
            to="/cart"
            className="text-white text-lg font-medium hover:text-blue-200 transition duration-300 relative"
          >
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount} {/* Hiển thị số loại sản phẩm */}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;
