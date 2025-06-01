import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ isAuthenticated, handleLogout, cartCount }) => {
  return (
    <nav className="bg-blue-700 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-3xl font-bold tracking-wide">ShopApp</Link>
        <div className="space-x-6">
          <Link to="/" className="text-white text-lg font-medium hover:text-blue-200 transition duration-300">Home</Link>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="text-white text-lg font-medium hover:text-blue-200 transition duration-300">Profile</Link>
              <button
                onClick={handleLogout}
                className="text-white text-lg font-medium hover:text-blue-200 transition duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="text-white text-lg font-medium hover:text-blue-200 transition duration-300">Login</Link>
          )}
          <Link to="/cart" className="text-white text-lg font-medium hover:text-blue-200 transition duration-300 relative">
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;