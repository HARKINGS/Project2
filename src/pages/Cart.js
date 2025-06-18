import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getCart,
  placeOrder,
  cancelOrder,
  removeCartItem,
} from "../api/CartAPI";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [checkoutData, setCheckoutData] = useState({
    shippingAddress: "",
    paymentMethod: "Cash on Delivery",
    voucherId: "",
    receiverName: "",
    phoneNumber: "",
  });
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await getCart();
        console.log("Cart response:", response);
        if (response && response.cartItems) {
          setCartItems(
            response.cartItems.map((item) => ({
              id: item.id,
              goodsId: item.goodsId,
              name: item.goodsName || "Unnamed Product",
              price: item.price || 0,
              quantity: item.quantity,
              status: item.status,
              cartId: response.id,
            }))
          );
          setCartCount(
            response.cartItems.reduce((sum, item) => sum + item.quantity, 0)
          );
          setCheckoutData({
            shippingAddress: response.shippingAddress || "",
            paymentMethod: response.paymentMethod || "Cash on Delivery",
            voucherId: response.voucherId || "",
            receiverName: response.receiverName || "",
            phoneNumber: response.phoneNumber || "",
          });
        } else {
          setCartItems([]);
          setCartCount(0);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        toast.error(`Error fetching cart: ${error.message}`);
        setCartItems([]);
        setCartCount(0);
      }
    };
    fetchCart();
  }, []);

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
    setCartCount(
      cartItems
        .map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
        .reduce((sum, item) => sum + item.quantity, 0)
    );
  };

  const handleSelectItem = (productId) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.id));
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      await removeCartItem(productId);
      setCartItems((prev) => prev.filter((item) => item.id !== productId));
      setCartCount((prev) => prev - 1);
      setSelectedItems((prev) => prev.filter((id) => id !== productId));
      toast.success("Sản phẩm đã được xóa khỏi giỏ hàng!");
    } catch (error) {
      toast.error(`Error removing item: ${error.message}`);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    const selectedProducts = cartItems.filter((item) =>
      selectedItems.includes(item.id)
    );
    const total = selectedProducts.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const totalDiscount = checkoutData.voucherId
      ? selectedProducts.reduce(
          (sum, item) => sum + item.price * item.quantity * 0.1,
          0
        ) // Giả định 10% giảm giá
      : 0;

    if (selectedProducts.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
      return;
    }

    const orderData = {
      cartItems: selectedProducts.map((item) => ({
        goodsId: item.goodsId,
        quantity: item.quantity,
      })),
      shippingAddress: checkoutData.shippingAddress,
      paymentMethod: checkoutData.paymentMethod,
      voucherId: checkoutData.voucherId,
      receiverName: checkoutData.receiverName,
      phoneNumber: checkoutData.phoneNumber,
      totalPrice: total,
      totalDiscount: totalDiscount,
    };

    setLoading(true);
    try {
      await placeOrder(cartItems[0].cartId, orderData);
      setCartItems([]);
      setCartCount(0);
      setSelectedItems([]);
      toast.success("Đặt hàng thành công! Kiểm tra lịch sử đơn hàng.");
      navigate("/order-history");
    } catch (error) {
      toast.error(`Đặt hàng thất bại: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (cartId) => {
    try {
      await cancelOrder(cartId);
      setCartItems([]);
      setCartCount(0);
      setSelectedItems([]);
      toast.success("Đơn hàng đã được hủy!");
      navigate("/cart");
    } catch (error) {
      toast.error(`Error canceling order: ${error.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCheckoutData((prev) => ({ ...prev, [name]: value }));
  };

  const selectedTotal = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountedTotal =
    selectedTotal - (checkoutData.voucherId ? selectedTotal * 0.1 : 0);

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
              <div
                key={item.id}
                className="flex items-center justify-between bg-white p-4 mb-4 rounded-lg shadow"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                    className="mr-2"
                  />
                  <img
                    src={`https://placehold.co/50x50?text=${item.name}`}
                    alt={item.name}
                    className="mr-4"
                  />
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
                    onChange={(e) =>
                      updateQuantity(item.id, parseInt(e.target.value))
                    }
                    className="w-16 p-1 border rounded"
                  />
                  <button
                    onClick={() => handleRemoveFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
            <a href="/" className="text-blue-500 hover:underline">
              Quay lại sản phẩm
            </a>
          </div>
          <div className="w-1/3">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Thanh toán</h2>
              <div>
                <input
                  type="text"
                  name="shippingAddress"
                  value={checkoutData.shippingAddress}
                  onChange={handleInputChange}
                  placeholder="Địa chỉ giao hàng"
                  className="w-full p-2 mb-4 border rounded"
                  required
                />
                <input
                  type="text"
                  name="receiverName"
                  value={checkoutData.receiverName}
                  onChange={handleInputChange}
                  placeholder="Tên người nhận"
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
                  <option value="Cash on Delivery">
                    Thanh toán khi nhận hàng
                  </option>
                  <option value="Credit Card">Thẻ tín dụng</option>
                </select>
                <input
                  type="text"
                  name="voucherId"
                  value={checkoutData.voucherId}
                  onChange={handleInputChange}
                  placeholder="Mã voucher (nếu có)"
                  className="w-full p-2 mb-4 border rounded"
                />
                <p className="mb-4">
                  Tổng (đã chọn): {selectedTotal.toFixed(2)} VNĐ
                </p>
                {checkoutData.voucherId && (
                  <p className="mb-4">
                    Giảm giá: {(selectedTotal * 0.1).toFixed(2)} VNĐ
                  </p>
                )}
                <p className="mb-4">
                  Tổng thanh toán: {discountedTotal.toFixed(2)} VNĐ
                </p>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                  disabled={loading}
                >
                  {loading ? "Đang đặt hàng..." : "Đặt hàng"}
                </button>
                {cartItems.some((item) => item.status === "PLACED") && (
                  <button
                    onClick={() => handleCancelOrder(cartItems[0].cartId)}
                    className="w-full mt-2 bg-red-600 text-white p-2 rounded hover:bg-red-700"
                    disabled={loading}
                  >
                    {loading ? "Đang hủy..." : "Hủy đơn hàng"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
