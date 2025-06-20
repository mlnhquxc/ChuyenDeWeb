import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaLock,
  FaCreditCard,
  FaMoneyBillWave,
  FaWallet,
  FaArrowLeft,
  FaMinus,
  FaPlus,
} from "react-icons/fa";
import { toast } from "react-toastify";
import ProvinceSelect, { calculateShippingFee } from "../api/Location.jsx";
import { useAuth } from "../context/AuthContext";
import orderService from "../services/orderService";
import userService from "../services/userService";
import { useTranslation } from 'react-i18next';

const BuyNowPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Get product data from navigation state
  const { product, quantity: initialQuantity = 1 } = location.state || {};
  
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

  const [quantity, setQuantity] = useState(initialQuantity);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [calculatedShippingFee, setCalculatedShippingFee] = useState(0);

  // Redirect if no product data
  useEffect(() => {
    if (!product) {
      toast.error('Không tìm thấy thông tin sản phẩm');
      navigate('/store');
    }
  }, [product, navigate]);

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

  const shippingMethods = {
    standard: { price: calculatedShippingFee || 30000, time: "3-5 ngày làm việc" },
    express: { price: calculatedShippingFee ? Math.round(calculatedShippingFee * 1.67) : 50000, time: "1-2 ngày làm việc" },
    economy: { price: calculatedShippingFee ? Math.round(calculatedShippingFee * 0.67) : 20000, time: "5-7 ngày làm việc" },
  };

  // Handle shipping fee calculation when location changes
  const handleShippingFeeChange = (fee) => {
    setCalculatedShippingFee(fee);
  };

  // Recalculate shipping fee when shipping method changes
  useEffect(() => {
    if (formData.province && formData.shippingMethod) {
      const newFee = calculateShippingFee(formData.province, formData.shippingMethod);
      setCalculatedShippingFee(newFee);
    }
  }, [formData.shippingMethod, formData.province]);

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

    if (formData.paymentMethod === "vnpay") {
      if (formData.cardNumber && !/^\d{16}$/.test(formData.cardNumber)) {
        newErrors.cardNumber = "Số thẻ không hợp lệ";
      }
      if (formData.cvv && !/^\d{3}$/.test(formData.cvv)) {
        newErrors.cvv = "Mã CVV không hợp lệ";
      }
      if (formData.expiryDate && !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = "Ngày hết hạn không hợp lệ";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotal = () => {
    if (!product) return 0;
    
    const subtotal = product.price * quantity;
    const shippingFee = shippingMethods[formData.shippingMethod]?.price || 0;
    return subtotal + shippingFee;
  };

  const getSubtotal = () => {
    if (!product) return 0;
    return product.price * quantity;
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
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
          items: [
            {
              productId: product.id,
              quantity: quantity
            }
          ],
          shippingAddress,
          billingAddress: shippingAddress,
          phone: formData.phoneNumber,
          email: formData.email,
          customerName: formData.fullName,
          paymentMethod: formData.paymentMethod,
          shippingFee: shippingMethods[formData.shippingMethod]?.price || 0,
          discountAmount: 0,
          notes: formData.deliveryNotes
        };

        console.log('Creating direct order with data:', orderData);
        
        // Create direct order
        const response = await orderService.createDirectOrder(orderData);
        
        if (response.result) {
          toast.success('Đặt hàng thành công!');
          setShowSuccess(true);
          
          // Redirect to orders page after 2 seconds
          setTimeout(() => {
            navigate('/orders');
          }, 2000);
        }
      } catch (error) {
        console.error("Order submission failed:", error);
        toast.error(error.message || 'Có lỗi xảy ra khi đặt hàng');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Show loading state
  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Đặt hàng thành công!</h1>
            <p className="text-gray-600 mb-8">
              Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng và liên hệ với bạn sớm nhất.
            </p>
            <p className="text-sm text-gray-500">Đang chuyển hướng đến trang đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-6">
                <button
                  onClick={() => navigate(-1)}
                  className="mr-4 p-2 text-gray-600 hover:text-gray-800"
                >
                  <FaArrowLeft />
                </button>
                <h2 className="text-2xl font-bold">Mua ngay</h2>
              </div>
              
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
                    placeholder="Ghi chú cho người giao hàng..."
                  />
                </div>
              </form>
            </div>

            {/* Shipping Method */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Phương thức vận chuyển</h3>
              <div className="space-y-3">
                {Object.entries(shippingMethods).map(([key, method]) => (
                  <label key={key} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value={key}
                      checked={formData.shippingMethod === key}
                      onChange={(e) =>
                        setFormData({ ...formData, shippingMethod: e.target.value })
                      }
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {key === "standard" && "Giao hàng tiêu chuẩn"}
                          {key === "express" && "Giao hàng nhanh"}
                          {key === "economy" && "Giao hàng tiết kiệm"}
                        </span>
                        <span className="font-semibold">
                          {method.price.toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{method.time}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Phương thức thanh toán</h3>
              <div className="space-y-3">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentMethod: e.target.value })
                    }
                    className="mr-3"
                  />
                  <FaMoneyBillWave className="mr-3 text-green-600" />
                  <span>Thanh toán khi nhận hàng (COD)</span>
                </label>

                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="vnpay"
                    checked={formData.paymentMethod === "vnpay"}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentMethod: e.target.value })
                    }
                    className="mr-3"
                  />
                  <FaCreditCard className="mr-3 text-blue-600" />
                  <span>Thanh toán online (VNPay)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-8">
            {/* Product Summary */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Sản phẩm đặt mua</h3>
              <div className="flex items-center space-x-4 p-4 border rounded-lg">
                <img
                  src={product.imageUrl || '/placeholder-image.jpg'}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="text-gray-600">{product.price?.toLocaleString('vi-VN')}đ</p>
                  <div className="flex items-center mt-2">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="p-1 border rounded-l disabled:opacity-50"
                    >
                      <FaMinus className="w-3 h-3" />
                    </button>
                    <span className="px-3 py-1 border-t border-b">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="p-1 border rounded-r disabled:opacity-50"
                    >
                      <FaPlus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>{getSubtotal().toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span>{(shippingMethods[formData.shippingMethod]?.price || 0).toLocaleString('vi-VN')}đ</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Tổng cộng:</span>
                  <span className="text-red-600">{calculateTotal().toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full mt-6 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                ) : (
                  <FaLock className="mr-2" />
                )}
                {isLoading ? "Đang xử lý..." : "Đặt hàng ngay"}
              </button>

              <div className="mt-4 text-center text-sm text-gray-600">
                <FaLock className="inline mr-1" />
                Thông tin của bạn được bảo mật an toàn
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyNowPage;