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
  
  // Get data from location state
  const checkoutData = location.state;
  
  // Determine items source
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [isFromBuyNow, setIsFromBuyNow] = useState(false);
  const [isFromCart, setIsFromCart] = useState(false);
  
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

  // Initialize checkout data
  useEffect(() => {
    if (checkoutData) {
      if (checkoutData.fromBuyNow) {
        // From Buy Now
        setIsFromBuyNow(true);
        setCheckoutItems(checkoutData.items || []);
        if (checkoutData.formData) {
          setFormData(prev => ({
            ...prev,
            ...checkoutData.formData
          }));
        }
      } else if (checkoutData.fromCart) {
        // From Cart
        setIsFromCart(true);
        setCheckoutItems(checkoutData.items || []);
      }
    } else if (cart && cart.items) {
      // Default: use all cart items
      setIsFromCart(true);
      const allCartItems = cart.items.map(item => ({
        id: item.productId,
        name: item.productName,
        price: item.productPrice,
        image: item.productImage,
        quantity: item.quantity,
        subtotal: item.productPrice * item.quantity
      }));
      setCheckoutItems(allCartItems);
    }
  }, [checkoutData, cart]);

  // Load user profile data
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const response = await userService.getProfile();
        if (response.result) {
          setUserProfile(response.result);
          setFormData(prev => ({
            ...prev,
            fullName: prev.fullName || response.result.fullname || "",
            phoneNumber: prev.phoneNumber || response.result.phone || "",
            email: prev.email || response.result.email || "",
            address: prev.address || response.result.address || "",
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

  // Check if no items to checkout
  if (!checkoutItems || checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('checkout.noItems')}
          </h2>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            {t('checkout.continueShopping')}
          </button>
        </div>
      </div>
    );
  }

  const shippingMethods = {
    standard: { name: t('checkout.standardShipping'), price: 30000, days: "3-5" },
    express: { name: t('checkout.expressShipping'), price: 50000, days: "1-2" },
    overnight: { name: t('checkout.overnightShipping'), price: 100000, days: "1" },
  };

  const paymentMethods = [
    { id: "cod", name: t('checkout.cod'), icon: FaMoneyBillWave },
    { id: "vnpay", name: "VNPay", icon: FaWallet },
    { id: "credit", name: t('checkout.creditCard'), icon: FaCreditCard },
  ];

  const calculateSubtotal = () => {
    return checkoutItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = shippingMethods[formData.shippingMethod]?.price || 0;
    return subtotal + shipping;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t('checkout.errors.fullNameRequired');
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = t('checkout.errors.phoneRequired');
    } else if (!/^[0-9]{10,11}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = t('checkout.errors.phoneInvalid');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('checkout.errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('checkout.errors.emailInvalid');
    }

    if (!formData.province) {
      newErrors.province = t('checkout.errors.provinceRequired');
    }

    if (!formData.district) {
      newErrors.district = t('checkout.errors.districtRequired');
    }

    if (!formData.ward) {
      newErrors.ward = t('checkout.errors.wardRequired');
    }

    if (!formData.address.trim()) {
      newErrors.address = t('checkout.errors.addressRequired');
    }

    if (formData.paymentMethod === "credit") {
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = t('checkout.errors.cardNumberRequired');
      }
      if (!formData.cvv.trim()) {
        newErrors.cvv = t('checkout.errors.cvvRequired');
      }
      if (!formData.expiryDate.trim()) {
        newErrors.expiryDate = t('checkout.errors.expiryRequired');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      try {
        const shippingAddress = `${formData.address}, ${formData.ward}, ${formData.district}, ${formData.province}`;
        
        let orderData;
        let response;

        if (isFromBuyNow) {
          // Create direct order
          orderData = {
            items: checkoutItems.map(item => ({
              productId: item.id,
              quantity: item.quantity
            })),
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

          response = await orderService.createDirectOrder(orderData);
        } else {
          // Create order from cart
          orderData = {
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

          response = await orderService.createOrderFromCart(orderData);
        }
        
        if (response.result) {
          const orderNumber = response.result.id || 'N/A';
          
          // Handle VNPay payment
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
                // Redirect to VNPay
                paymentService.redirectToVnPay(paymentResponse.result.paymentUrl);
                return;
              } else {
                throw new Error('Không thể tạo liên kết thanh toán VNPay');
              }
            } catch (paymentError) {
              console.error('Payment creation failed:', paymentError);
              showToast.error('Có lỗi xảy ra khi tạo thanh toán VNPay');
              return;
            }
          } else {
            // COD payment - show success message
            showToast.success('Đặt hàng thành công!');
            setShowSuccess(true);
            
            // Clear cart if order was from cart
            if (isFromCart) {
              clearCart();
            }
            
            // Redirect to orders page after 2 seconds
            setTimeout(() => {
              navigate('/orders');
            }, 2000);
          }
        }
      } catch (error) {
        console.error("Order submission failed:", error);
        showToast.error(error.message || 'Có lỗi xảy ra khi đặt hàng');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            {t('common.back')}
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('checkout.title')}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4">
                {t('checkout.orderSummary')}
              </h2>
              
              {/* Items */}
              <div className="space-y-4 mb-6">
                {checkoutItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-gray-600">
                        {t('checkout.quantity')}: {item.quantity}
                      </p>
                      <p className="font-semibold text-blue-600">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>{t('checkout.subtotal')}</span>
                  <span>{calculateSubtotal().toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('checkout.shipping')}</span>
                  <span>{(shippingMethods[formData.shippingMethod]?.price || 0).toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>{t('checkout.total')}</span>
                  <span className="text-blue-600">
                    {calculateTotal().toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {t('checkout.customerInfo')}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('checkout.fullName')} *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.fullName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('checkout.phone')} *
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('checkout.email')} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {t('checkout.shippingAddress')}
                </h2>
                
                <ProvinceSelect
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                />

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('checkout.detailAddress')} *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder={t('checkout.addressPlaceholder')}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('checkout.deliveryNotes')}
                  </label>
                  <textarea
                    name="deliveryNotes"
                    value={formData.deliveryNotes}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder={t('checkout.deliveryNotesPlaceholder')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Shipping Method */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {t('checkout.shippingMethod')}
                </h2>
                
                <div className="space-y-3">
                  {Object.entries(shippingMethods).map(([key, method]) => (
                    <label key={key} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={key}
                        checked={formData.shippingMethod === key}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{method.name}</span>
                          <span className="font-semibold text-blue-600">
                            {method.price.toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {t('checkout.deliveryTime')}: {method.days} {t('checkout.days')}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {t('checkout.paymentMethod')}
                </h2>
                
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label key={method.id} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={formData.paymentMethod === method.id}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <method.icon className="mr-3 text-gray-600" />
                      <span className="font-medium">{method.name}</span>
                    </label>
                  ))}
                </div>

                {/* Credit Card Fields */}
                {formData.paymentMethod === "credit" && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('checkout.cardNumber')} *
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="1234 5678 9012 3456"
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.cardNumber && (
                          <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('checkout.expiryDate')} *
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.expiryDate && (
                          <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV *
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.cvv ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.cvv && (
                          <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  ) : (
                    <FaLock className="mr-2" />
                  )}
                  {isLoading ? t('checkout.processing') : t('checkout.placeOrder')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('checkout.orderSuccess')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('checkout.orderSuccessMessage')}
              </p>
              <button
                onClick={() => navigate('/orders')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                {t('checkout.viewOrders')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;