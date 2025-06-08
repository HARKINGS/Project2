import React, { useState, useEffect } from 'react';
import { getStaff, getProducts } from '../utils/api';

const AdminDashboard = () => {
  const [staffCount, setStaffCount] = useState(0);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const staffResponse = await getStaff();
        setStaffCount(staffResponse.data.length);

        const productsResponse = await getProducts();
        setProductCount(productsResponse.data.length);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-700">Total Staff</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{staffCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-700">Total Products</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{productCount}</p>
        </div>
      </div>
      <p className="text-gray-600">Select a section from the sidebar to get started.</p>
    </>
  );
};

export default AdminDashboard;