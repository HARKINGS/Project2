import React, { useState, useEffect } from 'react';
import { getProducts } from '../utils/Api'; // Giả sử bạn có API này

const StaffDashboard = () => {
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await getProducts();
        setProductCount(productsResponse.data.length);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Staff Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-xl font-semibold text-gray-700">Total Products</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{productCount}</p>
        </div>
      </div>
      <p className="text-gray-600">Manage your tasks from the sidebar.</p>
    </div>
  );
};

export default StaffDashboard;