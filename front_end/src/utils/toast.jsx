import React from 'react';
import { toast } from 'react-toastify';
import { 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaInfoCircle, 
  FaTimesCircle,
  FaShoppingCart,
  FaUser,
  FaTrash,
  FaEdit,
  FaHeart,
  FaCreditCard
} from 'react-icons/fa';

// Custom toast component with icon and better styling
const CustomToast = ({ icon: Icon, title, message, type }) => (
  <div className="flex items-start space-x-3">
    <div className={`flex-shrink-0 ${
      type === 'success' ? 'text-green-500' :
      type === 'error' ? 'text-red-500' :
      type === 'warning' ? 'text-yellow-500' :
      'text-blue-500'
    }`}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900 dark:text-white">
        {title}
      </p>
      {message && (
        <p className="text-sm text-gray-500 mt-1">
          {message}
        </p>
      )}
    </div>
  </div>
);

// Enhanced toast utilities
export const showToast = {
  // Authentication toasts
  loginSuccess: (username) => {
    toast.success(
      <CustomToast 
        icon={FaUser}
        title="Đăng nhập thành công!"
        message={`Chào mừng ${username} quay trở lại`}
        type="success"
      />,
      {
        toastId: 'login-success',
        autoClose: 4000,
      }
    );
  },

  loginError: (message) => {
    toast.error(
      <CustomToast 
        icon={FaTimesCircle}
        title="Đăng nhập thất bại"
        message={message || "Vui lòng kiểm tra lại thông tin đăng nhập"}
        type="error"
      />,
      {
        toastId: 'login-error',
        autoClose: 5000,
      }
    );
  },

  registerSuccess: () => {
    toast.success(
      <CustomToast 
        icon={FaCheckCircle}
        title="Đăng ký thành công!"
        message="Tài khoản của bạn đã được tạo. Hãy đăng nhập để tiếp tục."
        type="success"
      />,
      {
        toastId: 'register-success',
        autoClose: 5000,
      }
    );
  },

  registerError: (message) => {
    toast.error(
      <CustomToast 
        icon={FaTimesCircle}
        title="Đăng ký thất bại"
        message={message || "Có lỗi xảy ra trong quá trình đăng ký"}
        type="error"
      />,
      {
        toastId: 'register-error',
        autoClose: 5000,
      }
    );
  },

  // Cart toasts
  addToCartSuccess: (productName, quantity = 1) => {
    toast.success(
      <CustomToast 
        icon={FaShoppingCart}
        title="Đã thêm vào giỏ hàng"
        message={`${productName} (${quantity} sản phẩm)`}
        type="success"
      />,
      {
        toastId: `add-cart-${Date.now()}`,
        autoClose: 3000,
      }
    );
  },

  addToCartError: (productName, message) => {
    toast.error(
      <CustomToast 
        icon={FaTimesCircle}
        title="Không thể thêm vào giỏ hàng"
        message={message || `Có lỗi xảy ra khi thêm ${productName}`}
        type="error"
      />,
      {
        toastId: 'add-cart-error',
        autoClose: 4000,
      }
    );
  },

  updateQuantitySuccess: (productName, newQuantity) => {
    // More subtle toast for quantity updates
    toast.success(
      <CustomToast 
        icon={FaEdit}
        title="Đã cập nhật"
        message={`${productName}: ${newQuantity} sản phẩm`}
        type="success"
      />,
      {
        toastId: `update-quantity-${Date.now()}`,
        autoClose: 1500, // Shorter duration
        hideProgressBar: true,
        position: "bottom-right", // Less intrusive position
      }
    );
  },

  // New subtle update method for cart quantity changes
  updateQuantitySubtle: (productName, newQuantity) => {
    // Very subtle notification that doesn't interrupt user flow
    toast.info(
      <div className="flex items-center space-x-2">
        <FaEdit className="w-4 h-4 text-blue-500" />
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {productName}: {newQuantity}
        </span>
      </div>,
      {
        toastId: `update-quantity-subtle-${Date.now()}`,
        autoClose: 1000,
        hideProgressBar: true,
        position: "bottom-right",
        className: "opacity-75",
      }
    );
  },

  updateQuantityError: (productName, message) => {
    toast.error(
      <CustomToast 
        icon={FaTimesCircle}
        title="Không thể cập nhật số lượng"
        message={message || `Có lỗi xảy ra khi cập nhật ${productName}`}
        type="error"
      />,
      {
        toastId: 'update-quantity-error',
        autoClose: 4000,
      }
    );
  },

  removeFromCartSuccess: (productName) => {
    toast.success(
      <CustomToast 
        icon={FaTrash}
        title="Đã xóa khỏi giỏ hàng"
        message={`${productName} đã được xóa`}
        type="success"
      />,
      {
        toastId: `remove-cart-${Date.now()}`,
        autoClose: 3000,
      }
    );
  },

  removeFromCartError: (productName, message) => {
    toast.error(
      <CustomToast 
        icon={FaTimesCircle}
        title="Không thể xóa sản phẩm"
        message={message || `Có lỗi xảy ra khi xóa ${productName}`}
        type="error"
      />,
      {
        toastId: 'remove-cart-error',
        autoClose: 4000,
      }
    );
  },

  // Wishlist toasts
  addToWishlistSuccess: (productName) => {
    toast.success(
      <CustomToast 
        icon={FaHeart}
        title="Đã thêm vào danh sách yêu thích"
        message={productName}
        type="success"
      />,
      {
        toastId: `add-wishlist-${Date.now()}`,
        autoClose: 2500,
      }
    );
  },

  removeFromWishlistSuccess: (productName) => {
    toast.info(
      <CustomToast 
        icon={FaHeart}
        title="Đã xóa khỏi danh sách yêu thích"
        message={productName}
        type="info"
      />,
      {
        toastId: `remove-wishlist-${Date.now()}`,
        autoClose: 2500,
      }
    );
  },

  // Payment toasts
  orderSuccess: (orderNumber) => {
    toast.success(
      <CustomToast 
        icon={FaCreditCard}
        title="Đặt hàng thành công!"
        message={`Mã đơn hàng: ${orderNumber}. Cảm ơn bạn đã mua sắm!`}
        type="success"
      />,
      {
        toastId: 'order-success',
        autoClose: 6000,
      }
    );
  },

  orderError: (message) => {
    toast.error(
      <CustomToast 
        icon={FaTimesCircle}
        title="Đặt hàng thất bại"
        message={message || "Có lỗi xảy ra trong quá trình đặt hàng"}
        type="error"
      />,
      {
        toastId: 'order-error',
        autoClose: 5000,
      }
    );
  },

  // OTP toasts
  otpSent: (email) => {
    toast.info(
      <CustomToast 
        icon={FaInfoCircle}
        title="Mã OTP đã được gửi"
        message={`Vui lòng kiểm tra email: ${email}`}
        type="info"
      />,
      {
        toastId: 'otp-sent',
        autoClose: 5000,
      }
    );
  },

  otpSuccess: () => {
    toast.success(
      <CustomToast 
        icon={FaCheckCircle}
        title="Xác thực OTP thành công"
        message="Bạn có thể tiếp tục sử dụng dịch vụ"
        type="success"
      />,
      {
        toastId: 'otp-success',
        autoClose: 3000,
      }
    );
  },

  otpError: (message) => {
    toast.error(
      <CustomToast 
        icon={FaTimesCircle}
        title="Xác thực OTP thất bại"
        message={message || "Mã OTP không đúng hoặc đã hết hạn"}
        type="error"
      />,
      {
        toastId: 'otp-error',
        autoClose: 4000,
      }
    );
  },

  // Password reset toasts
  passwordResetSuccess: () => {
    toast.success(
      <CustomToast 
        icon={FaCheckCircle}
        title="Đặt lại mật khẩu thành công"
        message="Bạn có thể đăng nhập với mật khẩu mới"
        type="success"
      />,
      {
        toastId: 'password-reset-success',
        autoClose: 4000,
      }
    );
  },

  passwordResetError: (message) => {
    toast.error(
      <CustomToast 
        icon={FaTimesCircle}
        title="Đặt lại mật khẩu thất bại"
        message={message || "Có lỗi xảy ra trong quá trình đặt lại mật khẩu"}
        type="error"
      />,
      {
        toastId: 'password-reset-error',
        autoClose: 4000,
      }
    );
  },

  // Generic toasts
  success: (title, message) => {
    toast.success(
      <CustomToast 
        icon={FaCheckCircle}
        title={title}
        message={message}
        type="success"
      />
    );
  },

  error: (title, message) => {
    toast.error(
      <CustomToast 
        icon={FaTimesCircle}
        title={title}
        message={message}
        type="error"
      />
    );
  },

  warning: (title, message) => {
    toast.warning(
      <CustomToast 
        icon={FaExclamationTriangle}
        title={title}
        message={message}
        type="warning"
      />
    );
  },

  info: (title, message) => {
    toast.info(
      <CustomToast 
        icon={FaInfoCircle}
        title={title}
        message={message}
        type="info"
      />
    );
  }
};

export default showToast;