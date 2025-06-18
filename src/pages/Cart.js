import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getCart,
  placeOrder,
  cancelOrder,
  removeCartItem,
  addToCart,
} from "../api/CartAPI.js";
import { createMomoPayment, checkMomoPaymentStatus } from "../api/Payment";
import { getAllGoods } from "../api/Goods";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [checkoutData, setCheckoutData] = useState({
    shippingAddress: "",
    paymentMethod: "COD",
    voucherId: "",
    receiverName: "",
    phoneNumber: "",
  });
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [allGoods, setAllGoods] = useState([]);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let cartData = await getCart();
        console.log("Cart data:", cartData);

        if (!cartData || cartData.status !== "PENDING") {
          const newCartRequest = {
            cartItems: [],
            paymentMethod: "COD", // Thêm paymentMethod mặc định
            shippingAddress: "",
            voucherId: null,
            receiverName: "",
            phoneNumber: "",
          };
          cartData = await addToCart(newCartRequest);
          toast.info("Tạo giỏ hàng mới.");
        }

        if (cartData && cartData.cartItems) {
          setCartItems(
            cartData.cartItems.map((item) => ({
              id: item.id,
              goodsId: item.goodsId,
              name: item.goodsName || "Unknown Product",
              price: item.price || 0,
              quantity: item.quantity,
              status: item.status || "PENDING",
              cartId: cartData.id,
            }))
          );
          setCartCount(
            cartData.cartItems.reduce((sum, item) => sum + item.quantity, 0)
          );
          setCartId(cartData.id);
          setCheckoutData({
            shippingAddress: cartData.shippingAddress || "",
            paymentMethod: cartData.paymentMethod || "COD",
            voucherId: cartData.voucherId || "",
            receiverName: cartData.receiverName || "",
            phoneNumber: cartData.phoneNumber || "",
          });
          setTotalDiscount(cartData.totalDiscount || 0);
        } else {
          setCartItems([]);
          setCartCount(0);
          setCartId(cartData.id);
          setTotalDiscount(0);
        }

        const goodsData = await getAllGoods();
        setAllGoods(goodsData.result || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.message === "Unauthenticated") {
          toast.error("Vui lòng đăng nhập để xem giỏ hàng!");
          navigate("/login");
        } else {
          toast.error(`Lỗi: ${error.message}`);
        }
        setCartItems([]);
        setCartCount(0);
        setCartId(null);
        setTotalDiscount(0);
      }
    };
    fetchData();
  }, [navigate]);

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
    console.log("Attempting to remove cart item with ID:", productId);
    try {
      await removeCartItem(productId);
      setCartItems((prev) => prev.filter((item) => item.id !== productId));
      setCartCount((prev) => prev - 1);
      setSelectedItems((prev) => prev.filter((id) => id !== productId));
      toast.success("Sản phẩm đã được xóa khỏi giỏ hàng!");
    } catch (error) {
      console.error("Error removing product:", error);
      if (error.message === "Unauthenticated") {
        toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        navigate("/login");
      } else {
        toast.error(`Lỗi khi xóa sản phẩm: ${error.message}`);
      }
    }
  };

  const handleAddToCart = async (goodsId, quantity) => {
    try {
      let currentCart = await getCart();
      if (!currentCart || currentCart.status !== "PENDING") {
        const newCartRequest = {
          cartItems: [],
          paymentMethod: "COD", // Thêm paymentMethod mặc định
          shippingAddress: "",
          voucherId: null,
          receiverName: "",
          phoneNumber: "",
        };
        currentCart = await addToCart(newCartRequest);
        setCartId(currentCart.id);
        toast.info("Tạo giỏ hàng mới.");
      }

      const cartRequest = {
        cartItems: [{ goodsId, quantity }],
        shippingAddress: checkoutData.shippingAddress,
        paymentMethod: checkoutData.paymentMethod.toUpperCase(),
        voucherId: checkoutData.voucherId || null,
        receiverName: checkoutData.receiverName,
        phoneNumber: checkoutData.phoneNumber,
      };
      const response = await addToCart(cartRequest);
      setCartItems(
        response.cartItems.map((item) => ({
          id: item.id,
          goodsId: item.goodsId,
          name: item.goodsName || "Unknown Product",
          price: item.price || 0,
          quantity: item.quantity,
          status: item.status || "PENDING",
          cartId: response.id,
        }))
      );
      setCartCount(
        response.cartItems.reduce((sum, item) => sum + item.quantity, 0)
      );
      setCartId(response.id);
      setTotalDiscount(response.totalDiscount || 0);
      toast.success("Thêm sản phẩm vào giỏ hàng thành công!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error.message === "Unauthenticated") {
        toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        navigate("/login");
      } else {
        toast.error(`Lỗi khi thêm sản phẩm: ${error.message}`);
      }
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    const selectedProducts = cartItems.filter((item) =>
      selectedItems.includes(item.id)
    );
    if (selectedProducts.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm để thanh toán!");
      return;
    }

    if (
      !checkoutData.shippingAddress ||
      !checkoutData.receiverName ||
      !checkoutData.phoneNumber
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin giao hàng!");
      return;
    }

    const cartRequest = {
      cartItems: selectedProducts.map((item) => ({
        goodsId: item.goodsId,
        quantity: item.quantity,
      })),
      shippingAddress: checkoutData.shippingAddress,
      paymentMethod: checkoutData.paymentMethod.toUpperCase(),
      voucherId: checkoutData.voucherId || null,
      receiverName: checkoutData.receiverName,
      phoneNumber: checkoutData.phoneNumber,
    };

    setLoading(true);
    try {
      let cartData = await getCart();
      if (!cartData || cartData.status !== "PENDING") {
        const newCartRequest = {
          cartItems: cartRequest.cartItems,
          paymentMethod: "COD", // Thêm paymentMethod mặc định
          shippingAddress: "",
          voucherId: null,
          receiverName: "",
          phoneNumber: "",
        };
        cartData = await addToCart(newCartRequest);
        setCartId(cartData.id);
        toast.info("Tạo giỏ hàng mới để đặt hàng.");
      }

      if (checkoutData.paymentMethod === "MOMO") {
        const momoResponse = await createMomoPayment(cartRequest, cartData.id);
        if (momoResponse.resultCode === 0) {
          setQrCodeUrl(momoResponse.qrCodeUrl || momoResponse.payUrl);
          setOrderId(momoResponse.orderId);
          setCartId(cartData.id);
          toast.success("Tạo mã QR thành công! Quét mã để thanh toán.");
        } else {
          throw new Error(momoResponse.message || "Tạo mã QR MoMo thất bại");
        }
      } else if (checkoutData.paymentMethod === "COD") {
        const response = await placeOrder(cartData.id, cartRequest);
        setTotalDiscount(response.totalDiscount || 0);
        setCartItems([]);
        setCartCount(0);
        setSelectedItems([]);
        setCartId(null);
        toast.success("Đặt hàng thành công! Kiểm tra lịch sử đơn hàng!");
        navigate("/order-history");
      } else {
        toast.error("Phương thức thanh toán không hợp lệ!");
      }
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      if (error.message === "Unauthenticated") {
        toast.error("Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại!");
        navigate("/login");
      } else if (error.message.includes("VOUCHER")) {
        toast.error("Mã voucher không hợp lệ hoặc đã hết hạn!");
        setCheckoutData((prev) => ({ ...prev, voucherId: "" }));
      } else if (error.message.includes("CART_ITEM_NOT_FOUND")) {
        toast.error("Sản phẩm trong giỏ hàng không tồn tại!");
      } else if (error.message.includes("INSUFFICIENT_STOCK")) {
        toast.error("Sản phẩm không đủ số lượng tồn kho!");
      } else {
        toast.error(
          `Đặt hàng thất bại: ${error.message || "Lỗi không xác định"}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!orderId || !cartId) return;
    setLoading(true);
    try {
      const statusResponse = await checkMomoPaymentStatus(orderId);
      if (statusResponse.result === "Payment successful!") {
        toast.success("Thanh toán MoMo thành công!");
        const cartRequest = {
          cartItems: cartItems
            .filter((item) => selectedItems.includes(item.id))
            .map((item) => ({
              goodsId: item.goodsId,
              quantity: item.quantity,
            })),
          shippingAddress: checkoutData.shippingAddress,
          paymentMethod: "MOMO",
          voucherId: checkoutData.voucherId || null,
          receiverName: checkoutData.receiverName,
          phoneNumber: checkoutData.phoneNumber,
        };
        const response = await placeOrder(cartId, cartRequest);
        setTotalDiscount(response.totalDiscount || 0);
        setCartItems([]);
        setCartCount(0);
        setSelectedItems([]);
        setQrCodeUrl(null);
        setOrderId(null);
        setCartId(null);
        navigate("/order-history");
      } else {
        toast.error(
          "Thanh toán MoMo thất bại: " +
            (statusResponse.message || "Lỗi không xác định")
        );
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
      if (error.message === "Unauthenticated") {
        toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        navigate("/login");
      } else {
        toast.error(`Lỗi kiểm tra trạng thái: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cartId) return;
    try {
      await cancelOrder(cartId);
      const newCartRequest = {
        cartItems: [],
        paymentMethod: "COD", // Thêm paymentMethod mặc định
        shippingAddress: "",
        voucherId: null,
        receiverName: "",
        phoneNumber: "",
      };
      const newCart = await addToCart(newCartRequest);
      setCartId(newCart.id);
      setCartItems([]);
      setCartCount(0);
      setSelectedItems([]);
      setQrCodeUrl(null);
      setOrderId(null);
      setTotalDiscount(0);
      toast.success("Đơn hàng đã được hủy! Tạo giỏ hàng mới.");
      navigate("/cart");
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
      if (error.message === "Unauthenticated") {
        toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        navigate("/login");
      } else {
        toast.error(`Lỗi khi hủy đơn hàng: ${error.message}`);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCheckoutData((prev) => ({ ...prev, [name]: value }));
  };

  const selectedTotalPrice = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountedTotalPrice = selectedTotalPrice - totalDiscount;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Giỏ hàng</h1>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Thêm sản phẩm</h3>
        <select
          className="select select-bordered w-full mb-2"
          onChange={(e) => {
            const goodsId = e.target.value;
            if (goodsId) {
              handleAddToCart(goodsId, 1);
            }
          }}
        >
          <option value="">Chọn sản phẩm</option>
          {allGoods.map((goods) => (
            <option key={goods.id} value={goods.id}>
              {goods.name} - {goods.price} VNĐ
            </option>
          ))}
        </select>
      </div>
      {cartItems.length === 0 ? (
        <p className="text-gray-600">Giỏ hàng trống.</p>
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
                    className="w-16 p-2 border rounded"
                  />
                  <button
                    onClick={() => handleRemoveFromCart(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
            <a href="/" className="text-blue-600 hover:underline">
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
                  className="input input-bordered w-full mb-4"
                  required
                />
                <input
                  type="text"
                  name="receiverName"
                  value={checkoutData.receiverName}
                  onChange={handleInputChange}
                  placeholder="Tên người nhận"
                  className="input input-bordered w-full mb-4"
                  required
                />
                <input
                  type="text"
                  name="phoneNumber"
                  value={checkoutData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Số điện thoại"
                  className="input input-bordered w-full mb-4"
                  required
                />
                <select
                  name="paymentMethod"
                  value={checkoutData.paymentMethod}
                  onChange={handleInputChange}
                  className="select select-bordered w-full mb-4"
                >
                  <option value="COD">Thanh toán khi nhận hàng</option>
                  <option value="MOMO">Thanh toán MoMo</option>
                </select>
                <input
                  type="text"
                  name="voucherId"
                  value={checkoutData.voucherId}
                  onChange={handleInputChange}
                  placeholder="Mã voucher (tùy chọn)"
                  className="input input-bordered w-full mb-4"
                />
                <p className="mb-4">
                  Tổng (đã chọn): {selectedTotalPrice.toFixed(2)} VNĐ
                </p>
                {totalDiscount > 0 && (
                  <p className="mb-4">
                    Giảm giá: {totalDiscount.toFixed(2)} VNĐ
                  </p>
                )}
                <p className="mb-4">
                  Tổng thanh toán: {discountedTotalPrice.toFixed(2)} VNĐ
                </p>
                <button
                  onClick={handleCheckout}
                  className="btn btn-primary w-full"
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : "Đặt hàng"}
                </button>
                {cartItems.some(
                  (item) =>
                    item.status === "PLACED" || item.status === "SHIPPING"
                ) && (
                  <button
                    onClick={handleCancelOrder}
                    className="btn btn-error w-full mt-2"
                    disabled={loading}
                  >
                    {loading ? "Đang hủy..." : "Hủy đơn hàng"}
                  </button>
                )}
              </div>
              {qrCodeUrl && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Quét mã QR để thanh toán:
                  </h3>
                  <img src={qrCodeUrl} alt="MoMo QR code" className="mx-auto" />
                  <button
                    onClick={checkPaymentStatus}
                    className="btn btn-success w-full mt-4"
                    disabled={loading}
                  >
                    {loading
                      ? "Đang kiểm tra..."
                      : "Kiểm tra trạng thái thanh toán"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
