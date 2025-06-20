import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaLock,
  FaCreditCard,
  FaMoneyBillWave,
  FaWallet,
  FaArrowLeft,
} from "react-icons/fa";
import { showToast } from "../utils/toast";
import ProvinceSelect, { calculateShippingFee } from "../api/Location.jsx";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import orderService from "../services/orderService";
import userService from "../services/userService";
import paymentService from "../services/paymentService";
import { ProductImage } from "../utils/placeholderImage.jsx";
import { useTranslation } from 'react-i18next';

const CheckoutPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, loading: cartLoading, clearCart } = useCart();
  const { user } = useAuth();
  
  // Get selected items from cart or buy now
  const { selectedItems, isFromCart, isFromBuyNow } = location.state || {};
  const cartItems = selectedItems || cart.items || [];
  
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    province: "",
    provinceId: "",
    district: "",
    districtId: "",
    ward: "",
    address: "",
    deliveryNotes: "",
    shippingMethod: "standard",
    paymentMethod: "cod",
    cardNumber: "",
    cvv: "",
    expiryDate: "",
    discountCode: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  // Load user profile data
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const response = await userService.getProfile();
        if (response.result) {
          setUserProfile(response.result);
          setFormData(prev => ({
            ...prev,
            fullName: response.result.fullname || "",
            phoneNumber: response.result.phone || "",
            email: response.result.email || "",
            address: response.result.address || "",
          }));
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };

    if (user) {
      loadUserProfile();
    }
  }, [user]);

  // Check if cart is empty (when not coming from cart selection or buy now)
  const isCartEmpty = !isFromCart && !isFromBuyNow && (!cart || 
                     (cart.items && cart.items.length === 0) || 
                     (Array.isArray(cart) && cart.length === 0) ||
                     cart.totalItems === 0);

  const [calculatedShippingFee, setCalculatedShippingFee] = useState(0);

  const shippingMethods = {
    standard: { price: calculatedShippingFee || 30000, time: "3-5 ngày làm việc" },
    express: { price: calculatedShippingFee ? Math.round(calculatedShippingFee * 1.67) : 50000, time: "1-2 ngày làm việc" },
    economy: { price: calculatedShippingFee ? Math.round(calculatedShippingFee * 0.67) : 20000, time: "5-7 ngày làm việc" },
  };

  // Recalculate shipping fee when shipping method changesAdd commentMore actions
  useEffect(() => {
    if (formData.province && formData.shippingMethod) {
      const newFee = calculateShippingFee(formData.province, formData.shippingMethod);
      setCalculatedShippingFee(newFee);
    }
  }, [formData.shippingMethod, formData.province]);

  // Handle shipping fee calculation when location changes
  const handleShippingFeeChange = (fee) => {
    setCalculatedShippingFee(fee);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName || formData.fullName.length < 2) {
      newErrors.fullName = "Họ tên phải có ít nhất 2 ký tự";
    }
    
    if (!/^0\d{9,10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Số điện thoại phải bắt đầu bằng 0 và có 10-11 chữ số";
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    
    if (!formData.province) newErrors.province = "Vui lòng chọn tỉnh/thành phố";
    if (!formData.district) newErrors.district = "Vui lòng chọn quận/huyện";
    if (!formData.ward) newErrors.ward = "Vui lòng chọn phường/xã";
    if (!formData.address) newErrors.address = "Vui lòng nhập địa chỉ cụ thể";

    // VnPay validation is handled on their platform, no need to validate card details here

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotal = () => {
    if (!cartItems.length) return 0;
    
    const subtotal = cartItems.reduce(
        (sum, item) => sum + (item.productPrice * item.quantity),
        0
    );
    const shippingFee = shippingMethods[formData.shippingMethod]?.price || 0;
    return subtotal + shippingFee;
  };

  const getSubtotal = () => {
    if (!cartItems.length) return 0;
    return cartItems.reduce(
        (sum, item) => sum + (item.productPrice * item.quantity),
        0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      try {
        // Prepare shipping address
        const shippingAddress = `${formData.address}, ${formData.ward}, ${formData.district}, ${formData.province}`;
        
        // Prepare order data
        const orderData = {
          shippingAddress,
          billingAddress: shippingAddress, // Use same as shipping for now
          phone: formData.phoneNumber,
          email: formData.email,
          customerName: formData.fullName,
          paymentMethod: formData.paymentMethod,
          shippingFee: shippingMethods[formData.shippingMethod]?.price || 0,
          discountAmount: 0, // TODO: Implement discount logic
          notes: formData.deliveryNotes
        };

        console.log('Creating order with data:', orderData);
        
        // Create order from cart
        const response = await orderService.createOrderFromCart(orderData);
        
        if (response.result) {
          const orderNumber = response.result.id || 'N/A';
          
          // Handle VnPay payment
          if (formData.paymentMethod === 'vnpay') {
            try {
              const paymentData = {
                orderId: response.result.id,
                amount: calculateTotal(),
                orderInfo: `Thanh toán đơn hàng #${orderNumber}`,
                userId: user?.id
              };
              
              const paymentResponse = await paymentService.createPayment(paymentData);
              
              if (paymentResponse.result && paymentResponse.result.paymentUrl) {
                // Clear cart before redirecting to payment
                await clearCart();
                
                // Redirect to VnPay
                paymentService.redirectToVnPay(paymentResponse.result.paymentUrl);
                return;
              } else {
                throw new Error('Không thể tạo liên kết thanh toán');
              }
            } catch (paymentError) {
              console.error('Payment creation failed:', paymentError);
              showToast.error('Có lỗi xảy ra khi tạo thanh toán: ' + paymentError.message);
              return;
            }
          } else {
            // Handle COD payment
            showToast.orderSuccess(orderNumber);
            setShowSuccess(true);
            
            // Clear cart after successful order
            await clearCart();
            
            // Redirect to orders page after 2 seconds
            setTimeout(() => {
              navigate('/orders');
            }, 2000);
          }
        }
      } catch (error) {
        console.error("Order submission failed:", error);
        showToast.orderError(error.message || 'Có lỗi xảy ra khi đặt hàng');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Show loading state
  if (cartLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show empty cart message
  if (isCartEmpty) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{t('payment.emptyCart.title')}</h1>
          <p className="text-gray-600 mb-8">{t('payment.emptyCart.description')}</p>
          <button
            onClick={() => navigate('/store')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FaArrowLeft className="mr-2" />
            {t('payment.emptyCart.continueShopping')}
          </button>
        </div>
      </div>
    );
  }

  // Show success message
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{t('payment.success.title')}</h1>
            <p className="text-gray-600 mb-8">
              {t('payment.success.description')}
            </p>
            <p className="text-sm text-gray-500">{t('payment.success.redirecting')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-indigo-400 mb-8">
            {isFromBuyNow ? t('payment.buyNow') : t('payment.checkout')}
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6">{t('payment.deliveryInfo')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Họ và tên *
                    </label>
                    <input
                        type="text"
                        className={`mt-1 block w-full rounded-md border ${
                            errors.fullName ? "border-red-500" : "border-gray-300"
                        } px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        value={formData.fullName}
                        onChange={(e) =>
                            setFormData({ ...formData, fullName: e.target.value })
                        }
                        placeholder="Nhập họ và tên"
                    />
                    {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.fullName}
                        </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Số điện thoại *
                    </label>
                    <input
                        type="tel"
                        className={`mt-1 block w-full rounded-md border ${
                            errors.phoneNumber ? "border-red-500" : "border-gray-300"
                        } px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        value={formData.phoneNumber}
                        onChange={(e) =>
                            setFormData({ ...formData, phoneNumber: e.target.value })
                        }
                        placeholder="Nhập số điện thoại"
                        onKeyDown={(e) => {
                          if (
                              e.ctrlKey ||
                              e.metaKey ||
                              [
                                "Backspace",
                                "ArrowLeft",
                                "ArrowRight",
                                "Delete",
                                "Tab",
                              ].includes(e.key)
                          ) {
                            return;
                          }
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                    />
                    {errors.phoneNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phoneNumber}
                        </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                        type="email"
                        className={`mt-1 block w-full rounded-md border ${
                            errors.email ? "border-red-500" : "border-gray-300"
                        } px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="Nhập địa chỉ email"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </p>
                    )}
                  </div>
                  {/* Address Fields */}
                  <ProvinceSelect
                      formData={formData}
                      setFormData={setFormData}
                      errors={errors}
                      onShippingFeeChange={handleShippingFeeChange}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Địa chỉ cụ thể *
                    </label>
                    <input
                        type="text"
                        className={`mt-1 block w-full rounded-md border ${
                            errors.address ? "border-red-500" : "border-gray-300"
                        } px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        value={formData.address}
                        onChange={(e) =>
                            setFormData({ ...formData, address: e.target.value })
                        }
                        placeholder="Số nhà, tên đường..."
                    />
                    {errors.address && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.address}
                        </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ghi chú giao hàng
                    </label>
                    <textarea
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows="3"
                        value={formData.deliveryNotes}
                        onChange={(e) =>
                            setFormData({ ...formData, deliveryNotes: e.target.value })
                        }
                        placeholder="Ghi chú thêm cho người giao hàng (tùy chọn)"
                    />
                  </div>

                  {/* Payment Method */}
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Phương thức thanh toán
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                            type="radio"
                            id="cod"
                            name="payment"
                            value="cod"
                            checked={formData.paymentMethod === "cod"}
                            onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  paymentMethod: e.target.value,
                                })
                            }
                            className="h-4 w-4 text-blue-600"
                        />
                        <label htmlFor="cod" className="ml-3 flex items-center">
                          <FaMoneyBillWave className="text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">
                            Thanh toán khi nhận hàng (COD)
                          </span>
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                            type="radio"
                            id="vnpay"
                            name="payment"
                            value="vnpay"
                            checked={formData.paymentMethod === "vnpay"}
                            onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  paymentMethod: e.target.value,
                                })
                            }
                            className="h-4 w-4 text-blue-600"
                        />
                        <label htmlFor="vnpay" className="ml-3 flex items-center">
                          <FaCreditCard className="text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">
                            Thanh toán qua VNPay
                          </span>
                        </label>
                      </div>

                      {formData.paymentMethod === "vnpay" && (
                          <div className="ml-7 p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center text-blue-700">
                              <FaLock className="mr-2" />
                              <span className="text-sm">
                                Bạn sẽ được chuyển đến trang VNPay để hoàn tất thanh toán một cách an toàn
                              </span>
                            </div>
                            <p className="text-xs text-blue-600 mt-2">
                              Hỗ trợ thanh toán qua thẻ ATM, thẻ tín dụng, ví điện tử và Internet Banking
                            </p>
                          </div>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6">Tóm tắt đơn hàng</h2>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <ProductImage
                            src={item.productImage}
                            alt={item.productName}
                            className="w-20 h-20 object-cover rounded"
                            size="medium"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{item.productName}</h3>
                          <p className="text-sm text-gray-500">
                            Số lượng: {item.quantity}
                          </p>
                          <p className="text-sm text-gray-500">
                            Đơn giá: {item.productPrice?.toLocaleString('vi-VN')}₫
                          </p>
                        </div>
                        <p className="font-medium">
                          {(item.productPrice * item.quantity).toLocaleString('vi-VN')}₫
                        </p>
                      </div>
                  ))}

                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between mb-2">
                      <span>Tạm tính</span>
                      <span>{getSubtotal().toLocaleString('vi-VN')}₫</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Phí vận chuyển</span>
                      <span>{(shippingMethods[formData.shippingMethod]?.price || 0).toLocaleString('vi-VN')}₫</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Tổng cộng</span>
                      <span className="text-red-600">{calculateTotal().toLocaleString('vi-VN')}₫</span>
                    </div>
                  </div>

                  {/* Shipping Method Selection */}
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Phương thức vận chuyển
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(shippingMethods).map(([key, method]) => (
                        <div key={key} className="flex items-center">
                          <input
                            type="radio"
                            id={key}
                            name="shipping"
                            value={key}
                            checked={formData.shippingMethod === key}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                shippingMethod: e.target.value,
                              })
                            }
                            className="h-4 w-4 text-blue-600"
                          />
                          <label htmlFor={key} className="ml-3 flex-1">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-900">
                                {key === 'standard' ? 'Tiêu chuẩn' : 
                                 key === 'express' ? 'Nhanh' : 'Tiết kiệm'}
                              </span>
                              <span className="text-sm text-gray-500">
                                {method.price.toLocaleString('vi-VN')}₫
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">{method.time}</p>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                      type="submit"
                      className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                      onClick={handleSubmit}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Đang xử lý...
                      </div>
                    ) : (
                      "Đặt hàng"
                    )}
                  </button>

                  <div className="flex items-center justify-center text-sm text-gray-500">
                    <FaLock className="mr-2" />
                    Thanh toán an toàn
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Success Modal */}
          {showSuccess && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg max-w-md">
                  <h3 className="text-2xl font-bold text-green-600 mb-4">
                    Order Placed Successfully!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Thank you for your purchase. We'll send you a confirmation email
                    shortly.
                  </p>
                  <button
                      onClick={() => setShowSuccess(false)}
                      className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
          )}
        </div>
      </div>
  );
};

export default CheckoutPage;