import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOrderHistory } from "../api/OrderHistoryAPI";
import { toast } from "react-toastify";

const OrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const data = await getOrderHistory();
        setOrderHistory(data.result || []);
      } catch (error) {
        console.error("Error fetching order history:", error);
        if (error.message === "Unauthenticated") {
          toast.error("Vui lòng đăng nhập để xem lịch sử đơn hàng!");
          navigate("/login");
        } else {
          toast.error(`Lỗi khi lấy lịch sử đơn hàng: ${error.message}`);
        }
        setOrderHistory([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderHistory();
  }, [navigate]);

  if (loading) {
    return <p className="text-gray-600">Đang tải...</p>;
  }

  if (!Array.isArray(orderHistory) || orderHistory.length === 0) {
    return <p className="text-gray-600">Không tìm thấy đơn hàng nào.</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Lịch sử đơn hàng
      </h1>
      {orderHistory.map((order) => (
        <div key={order.id} className="bg-white p-4 mb-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Mã đơn hàng: {order.id}</h2>
          <p className="text-gray-600">
            Ngày đặt: {order.createdDate || "N/A"}
          </p>
          <p className="text-gray-600">Trạng thái: {order.status}</p>
          <p className="text-gray-600">
            Phương thức thanh toán: {order.paymentMethod}
          </p>
          <ul className="mt-2">
            {order.orderHistoryItems.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>
                  {item.goods.name} (x{item.quantity})
                </span>
                <span>{(item.goods.price * item.quantity).toFixed(2)} VNĐ</span>
              </li>
            ))}
          </ul>
          <p className="text-right font-bold mt-2">
            Tổng: {(order.totalPrice - (order.totalDiscount || 0)).toFixed(2)}{" "}
            VNĐ
          </p>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
