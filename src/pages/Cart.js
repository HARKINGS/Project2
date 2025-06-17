import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cart = ({ cartItems, setCartItems, cartCount, setCartCount, placeOrder }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [checkoutData, setCheckoutData] = useState({
    fullName: '',
    address: '',
    phoneNumber: '',
    paymentMethod: 'Cash on Delivery',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter((item) => item.id !== productId);
    setCartItems(updatedCart);
    const newCount = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(newCount);
    setSelectedItems((prev) => prev.filter((id) => id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
    const newCount = cartItems
      .map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item))
      .reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(newCount);
  };

  const handleSelectItem = (productId) => {
    setSelectedItems((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.id));
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    const selectedProducts = cartItems.filter((item) => selectedItems.includes(item.id));
    const total = selectedProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (selectedProducts.length === 0) {
      toast.error('Vui lòng chọn ít nhất một sản phẩm để thanh toán.');
      return;
    }

    const orderData = {
      items: selectedProducts.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      total,
      ...checkoutData,
    };

    setLoading(true);
    try {
      await placeOrder(orderData);
      setCartItems([]);
      setCartCount(0);
      setSelectedItems([]);
      toast.success('Đặt hàng thành công! Kiểm tra lịch sử đơn hàng.');
      navigate('/order-history');
    } catch (error) {
      toast.error(`Đặt hàng thất bại: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCheckoutData((prev) => ({ ...prev, [name]: value }));
  };

  const selectedTotal = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Giỏ hàng</h1>
      {cartItems.length === 0 ? (
        <p className="text-gray-500">Giỏ hàng trống.</p>
      ) : (
        <div className="flex space-x-6">
          <div className="w-2/3">
            <label className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={selectedItems.length === cartItems.length}
                onChange={handleSelectAll}
                className="mr-2"
              />
              Chọn tất cả
            </label>
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-white p-4 mb-4 rounded-lg shadow">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                    className="mr-2"
                  />
                  <img src={`https://placehold.co/50x50?text=${item.name}`} alt={item.name} className="mr-4" />
                  <div>
                    <h2 className="text-xl font-semibold">{item.name}</h2>
                    <p className="text-gray-600">{item.price.toFixed(2)} VNĐ</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    className="w-16 p-1 border rounded"
                  />
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
            <a href="/" className="text-blue-500 hover:underline">Quay lại sản phẩm</a>
          </div>
          <div className="w-1/3">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Thanh toán</h2>
              <div>
                <input
                  type="text"
                  name="fullName"
                  value={checkoutData.fullName}
                  onChange={handleInputChange}
                  placeholder="Họ và tên"
                  className="w-full p-2 mb-4 border rounded"
                  required
                />
                <input
                  type="text"
                  name="address"
                  value={checkoutData.address}
                  onChange={handleInputChange}
                  placeholder="Địa chỉ"
                  className="w-full p-2 mb-4 border rounded"
                  required
                />
                <input
                  type="text"
                  name="phoneNumber"
                  value={checkoutData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Số điện thoại"
                  className="w-full p-2 mb-4 border rounded"
                  required
                />
                <select
                  name="paymentMethod"
                  value={checkoutData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full p-2 mb-4 border rounded"
                >
                  <option value="Cash on Delivery">Thanh toán khi nhận hàng</option>
                  <option value="Credit Card">Thẻ tín dụng</option>
                </select>
                <p className="mb-4">Tổng (đã chọn): {selectedTotal.toFixed(2)} VNĐ</p>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                  disabled={loading}
                >
                  {loading ? 'Đang đặt hàng...' : 'Đặt hàng'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;