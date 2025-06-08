import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const StaffLayout = () => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed w-64 h-full bg-gray-800 text-white p-4 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Staff Panel</h2>
        <nav>
          <ul className="space-y-4">
            <li>
              <Link
                to="/staff/products"
                className={`flex items-center p-2 rounded-lg ${
                  location.pathname === '/staff/products' ? 'bg-gray-700' : 'hover:bg-gray-700'
                }`}
              >
                <span className="mr-2">📦</span> Manage Products
              </Link>
            </li>
            <li>
              <Link
                to="/staff/chat"
                className={`flex items-center p-2 rounded-lg ${
                  location.pathname === '/staff/chat' ? 'bg-gray-700' : 'hover:bg-gray-700'
                }`}
              >
                <span className="mr-2">💬</span> Chat with Users
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default StaffLayout;