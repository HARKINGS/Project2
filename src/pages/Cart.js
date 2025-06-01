import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Cart = ({ cartItems, setCartItems, cartCount, setCartCount }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    paymentMethod: 'COD',
  });

  const products = [
    { id: 1, name: 'Laptop Pro', price: 1299.99, category: 'Electronics', stock: 50 },
    { id: 2, name: 'Smartphone X', price: 699.99, category: 'Electronics', stock: 100 },
    { id: 3, name: 'Running Shoes', price: 89.99, category: 'Fashion', stock: 75 },
    { id: 4, name: 'Winter Jacket', price: 149.99, category: 'Fashion', stock: 60 },
    { id: 5, name: 'Gaming Mouse', price: 49.99, category: 'Electronics', stock: 120 },
    { id: 6, name: 'Casual Sneakers', price: 59.99, category: 'Fashion', stock: 90 },
  ];

  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.id));
    }
  };

  const selectedTotal = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert('Please select at least one item to checkout!');
      return;
    }

    const selectedCartItems = cartItems.filter((item) => selectedItems.includes(item.id));
    const orderData = {
      items: selectedCartItems,
      total: selectedTotal,
      customer: formData,
    };

    console.log('Sending order to backend:', orderData);
    alert('Order placed successfully! (Simulated)');
    setCartItems(cartItems.filter((item) => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  };

  const handleRemoveItem = (itemId) => {
    const removedItem = cartItems.find((item) => item.id === itemId);
    setCartItems(cartItems.filter((item) => item.id !== itemId));
    setSelectedItems(selectedItems.filter((id) => id !== itemId));
    setCartCount(cartCount - removedItem.quantity);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    const value = Math.max(1, Math.min(
      products.find((p) => p.id === itemId).stock,
      parseInt(newQuantity) || 1
    ));
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: value } : item
      )
    );
    setCartCount((prev) => {
      const oldItem = cartItems.find((item) => item.id === itemId);
      return prev - (oldItem.quantity - value);
    });
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={selectedItems.length === cartItems.length}
                  onChange={handleSelectAll}
                  className="mr-2"
                />
                <label className="text-gray-700 font-medium">Select All</label>
              </div>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b py-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                        className="mr-4"
                      />
                      <div className="flex items-center gap-4">
                        <img
                          src={`https://via.placeholder.com/50x50?text=${item.name}`}
                          alt={item.name}
                          className="w-12 h-12 rounded-md"
                        />
                        <div>
                          <Link to={`/product/${item.id}`} className="text-gray-800 hover:underline">
                            {item.name}
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                              min="1"
                              max={products.find((p) => p.id === item.id).stock}
                              className="w-20 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
                              disabled={item.quantity >= products.find((p) => p.id === item.id).stock}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-4">${(item.price * item.quantity).toFixed(2)}</span>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-right">
                <p className="text-xl font-semibold text-gray-800">
                  Total (Selected): ${selectedTotal.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Checkout</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="address">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="phone">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="paymentMethod">
                    Payment Method
                  </label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="COD">Cash on Delivery</option>
                    <option value="CreditCard">Credit Card</option>
                    <option value="PayPal">PayPal</option>
                  </select>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
          <Link to="/" className="mt-6 inline-block text-blue-600 hover:underline">Back to Products</Link>
        </>
      )}
    </div>
  );
};

export default Cart;