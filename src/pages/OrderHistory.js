import React from 'react';

const OrderHistory = ({ orderHistory }) => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Order History</h1>
      {orderHistory.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div>
          {orderHistory.map((order) => (
            <div key={order.id} className="bg-white p-4 mb-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold">Order #{order.id}</h2>
              <p className="text-gray-600">Date: {order.date}</p>
              <ul className="mt-2">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.name} (x{item.quantity})</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <p className="text-right font-bold mt-2">Total: ${order.total.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;