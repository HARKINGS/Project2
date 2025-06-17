import React, { useState, useEffect } from 'react';
import { getStaff, getProducts } from '../utils/Api'; // Giả sử bạn có các API này

const AdminDashboard = () => {
  const [staffCount, setStaffCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const staffResponse = await getStaff();
        setStaffCount(staffResponse.data.length);

        const productsResponse = await getProducts();
        setProductCount(productsResponse.data.length);

        // Đếm số tài khoản từ localStorage (hoặc API khi đồng bộ)
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        setUserCount(Object.keys(users).length);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-xl font-semibold text-gray-700">Total Staff</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{staffCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-xl font-semibold text-gray-700">Total Products</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{productCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-xl font-semibold text-gray-700">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{userCount}</p>
        </div>
      </div>
      <p className="text-gray-600">Manage your sections from the sidebar.</p>
    </div>
  );
};

export default AdminDashboard;