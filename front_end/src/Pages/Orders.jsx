import React, { useState, useEffect } from 'react';
import { FaBox, FaTruck, FaCheckCircle, FaClock, FaTimes, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import orderService from '../services/orderService';
import { ProductImage } from '../utils/placeholderImage.jsx';
import { useTranslation } from 'react-i18next';
const Orders = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);

  useEffect(() => {
    loadOrders();
  }, [currentPage]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      // Explicitly sort by orderDate in descending order (newest first)
      const response = await orderService.getMyOrders(currentPage, 10, 'orderDate', 'desc');
      if (response.result) {
        const ordersData = response.result.content || [];
        // Additional client-side sorting to ensure newest orders are first
        const sortedOrders = ordersData.sort((a, b) => {
          const dateA = new Date(a.orderDate || a.createdAt);
          const dateB = new Date(b.orderDate || b.createdAt);
          return dateB - dateA; // Descending order (newest first)
        });
        setOrders(sortedOrders);
        setTotalPages(response.result.totalPages || 0);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      return;
    }

    try {
      const reason = prompt('Lý do hủy đơn hàng (tùy chọn):');
      await orderService.cancelOrder(orderId, reason || '');
      toast.success('Đã hủy đơn hàng thành công');
      loadOrders(); // Reload orders
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Không thể hủy đơn hàng');
    }
  };

  const handleViewOrderDetail = async (orderId) => {
    try {
      const response = await orderService.getOrderById(orderId);
      if (response.result) {
        setSelectedOrder(response.result);
        setShowOrderDetail(true);
      }
    } catch (error) {
      console.error('Error loading order detail:', error);
      toast.error('Không thể tải chi tiết đơn hàng');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'DELIVERED':
        return <FaCheckCircle className="text-green-500" />;
      case 'SHIPPED':
        return <FaTruck className="text-blue-500" />;
      case 'CONFIRMED':
        return <FaClock className="text-yellow-500" />;
      case 'CANCELLED':
        return <FaTimes className="text-red-500" />;
      default:
        return <FaBox className="text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return t('orders.status.pending');
      case 'CONFIRMED':
        return t('orders.status.confirmed');
      case 'SHIPPED':
        return t('orders.status.shipped');
      case 'DELIVERED':
        return t('orders.status.delivered');
      case 'CANCELLED':
        return t('orders.status.cancelled');
      default:
        return t('orders.status.processing');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'text-green-600 bg-green-100';
      case 'SHIPPED':
        return 'text-blue-600 bg-blue-100';
      case 'CONFIRMED':
        return 'text-yellow-600 bg-yellow-100';
      case 'CANCELLED':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">{t('orders.title')}</h1>
        
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <FaBox className="mx-auto text-6xl text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">{t('orders.emptyTitle')}</h2>
            <p className="text-gray-500">{t('orders.emptyDesc')}</p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="text-lg font-semibold text-gray-800">
                            {t('orders.orderNumber', { number: order.orderNumber })}
                          </h2>
                          <p className="text-sm text-gray-600">
                            {t('orders.orderedAt', { date: new Date(order.orderDate).toLocaleDateString('vi-VN') })}
                          </p>
                          {order.trackingNumber && (
                            <p className="text-sm text-gray-600">
                              {t('orders.trackingNumber', { tracking: order.trackingNumber })}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                          {getStatusIcon(order.status)}
                        </div>
                      </div>

                      <div className="divide-y divide-gray-200">
                        {order.orderDetails?.slice(0, 2).map((item) => (
                            <div key={item.id} className="py-4 flex items-center">
                              <ProductImage
                                  src={item.productImage}
                                  alt={item.productName}
                                  size="small"
                                  className="w-16 h-16 object-cover rounded-md"
                              />
                              <div className="ml-4 flex-1">
                                <h3 className="text-sm font-medium text-gray-800">{item.productName}</h3>
                                <p className="text-sm text-gray-600">
                                  Số lượng: {item.quantity} × {item.price?.toLocaleString('vi-VN')}₫
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-gray-800">
                                  {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                                </p>
                              </div>
                            </div>
                        ))}
                        {order.orderDetails?.length > 2 && (
                          <div className="py-2 text-center text-sm text-gray-500">
                            và {order.orderDetails.length - 2} sản phẩm khác...
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                          <div className="text-sm text-gray-600">
                            <p>{t('orders.shippingAddress', { address: order.shippingAddress })}</p>
                            <p>{t('orders.paymentMethod', { method: order.paymentMethod === 'cod' ? 'COD' : 'VNPay' })}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">{t('orders.total')}</p>
                            <p className="text-lg font-bold text-red-600">
                              {order.totalAmount?.toLocaleString('vi-VN')}₫
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => handleViewOrderDetail(order.id)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <FaEye className="mr-2" />
                            {t('orders.viewDetail')}
                          </button>
                          {order.canBeCancelled && (
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                            >
                              <FaTimes className="mr-2" />
                              {t('orders.cancelOrder')}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('orders.prev')}
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-700">
                    {t('orders.page', { current: currentPage + 1, total: totalPages })}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage >= totalPages - 1}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('orders.next')}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Order Detail Modal */}
        {showOrderDetail && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Chi tiết đơn hàng #{selectedOrder.orderNumber}
                  </h2>
                  <button
                    onClick={() => setShowOrderDetail(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Thông tin đơn hàng</h3>
                    <p className="text-sm text-gray-600">Ngày đặt: {new Date(selectedOrder.orderDate).toLocaleString('vi-VN')}</p>
                    <p className="text-sm text-gray-600">Trạng thái: {getStatusText(selectedOrder.status)}</p>
                    <p className="text-sm text-gray-600">Phương thức thanh toán: {selectedOrder.paymentMethod}</p>
                    {selectedOrder.trackingNumber && (
                      <p className="text-sm text-gray-600">Mã vận đơn: {selectedOrder.trackingNumber}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Thông tin giao hàng</h3>
                    <p className="text-sm text-gray-600">Người nhận: {selectedOrder.customerName}</p>
                    <p className="text-sm text-gray-600">Số điện thoại: {selectedOrder.phone}</p>
                    <p className="text-sm text-gray-600">Địa chỉ: {selectedOrder.shippingAddress}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Sản phẩm</h3>
                  <div className="divide-y divide-gray-200">
                    {selectedOrder.orderDetails?.map((item) => (
                      <div key={item.id} className="py-4 flex items-center">
                        <ProductImage
                          src={item.productImage}
                          alt={item.productName}
                          className="w-20 h-20 object-cover rounded-md"
                          size="medium"
                        />
                        <div className="ml-4 flex-1">
                          <h4 className="font-medium text-gray-800">{item.productName}</h4>
                          <p className="text-sm text-gray-600">
                            Số lượng: {item.quantity} × {item.price?.toLocaleString('vi-VN')}₫
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-800">
                            {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-red-600">{selectedOrder.totalAmount?.toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
  );
};

export default Orders;