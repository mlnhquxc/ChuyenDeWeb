import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaEye, FaEyeSlash, FaUser, FaLock } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { showToast } from "../utils/toast";
import ForgotPassword from "../components/ForgotPassword";
import VerifyOTP from "../components/VerifyOTP";
import ResetPassword from "../components/ResetPassword";

const PasswordStrength = ({ password }) => {
  const getStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (pass.match(/[A-Z]/)) score++;
    if (pass.match(/[0-9]/)) score++;
    if (pass.match(/[^A-Za-z0-9]/)) score++;
    return score;
  };

  const strength = getStrength(password);
  const getColor = () => {
    if (strength === 0) return "bg-gray-200";
    if (strength === 1) return "bg-red-500";
    if (strength === 2) return "bg-yellow-500";
    if (strength === 3) return "bg-indigo-500";
    return "bg-green-500";
  };

  return (
    <div className="mt-2">
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor()} rounded-full transition-all duration-300`}
          style={{ width: `${(strength / 4) * 100}%` }}
        ></div>
      </div>
      <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
        {strength === 0 && "Nhập mật khẩu"}
        {strength === 1 && "Yếu"}
        {strength === 2 && "Trung bình"}
        {strength === 3 && "Tốt"}
        {strength === 4 && "Mạnh"}
      </p>
    </div>
  );
};

const LoginForm = ({ onSwitchToRegister, onForgotPassword }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (Object.keys(errors).length > 0) {
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await login({
        username: formData.username,
        password: formData.password
      });
      
      if (response && response.authenticated) {
        showToast.loginSuccess(formData.username);
        navigate('/');
      } else {
        setErrors({ submit: 'Tên đăng nhập hoặc mật khẩu không đúng' });
        showToast.loginError('Tên đăng nhập hoặc mật khẩu không đúng');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi khi đăng nhập';
      
      // Kiểm tra nếu lỗi là email chưa được xác thực
      if (errorMessage.includes('Email is not verified') || errorMessage.includes('Email not verified')) {
        setErrors({ 
          submit: 'Tài khoản chưa được xác thực. Vui lòng kiểm tra email để xác thực tài khoản.',
          showResendButton: true,
          userEmail: formData.username // Có thể là email hoặc username
        });
      } else {
        setErrors({ submit: errorMessage });
      }
      showToast.loginError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setIsLoading(true);
      const response = await authService.resendVerification({ email: errors.userEmail });
      
      if (response && response.result) {
        showToast.success("Email xác thực đã được gửi lại. Vui lòng kiểm tra hộp thư.");
        setErrors({ submit: "Email xác thực đã được gửi lại. Vui lòng kiểm tra hộp thư." });
      } else {
        showToast.error("Không thể gửi lại email xác thực. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      const errorMessage = error.response?.data?.message || 'Không thể gửi lại email xác thực';
      showToast.error(errorMessage);
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-indigo-400">
          Đăng nhập
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Chào mừng bạn quay trở lại</p>
      </div>

      <form className="space-y-6" onSubmit={handleLogin}>
        {errors.submit && (
          <div className={`px-4 py-3 rounded-lg ${
            errors.submit.includes('gửi lại') 
              ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400'
              : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
          }`} role="alert">
            <span className="block sm:inline">{errors.submit}</span>
            {errors.showResendButton && (
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={isLoading}
                className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? 'Đang gửi...' : 'Gửi lại email xác thực'}
              </button>
            )}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tên đăng nhập</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`pl-10 block w-full px-4 py-3 border ${errors.username ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 dark:text-white transition-colors duration-200`}
                placeholder="Nhập tên đăng nhập"
              />
            </div>
            {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mật khẩu</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`pl-10 block w-full px-4 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 dark:text-white transition-colors duration-200`}
                placeholder="Nhập mật khẩu"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 
                  <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" /> : 
                  <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                }
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Ghi nhớ đăng nhập
              </label>
            </div>
            <div className="text-sm">
              <button 
                type="button"
                onClick={onForgotPassword}
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Quên mật khẩu?
              </button>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-[1.02] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </span>
            ) : (
              "Đăng nhập"
            )}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              Hoặc đăng nhập với
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <FcGoogle className="h-5 w-5 mr-2" />
            Google
          </button>
          <button
            type="button"
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <FaFacebook className="h-5 w-5 mr-2 text-blue-600" />
            Facebook
          </button>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Chưa có tài khoản? Đăng ký ngay
        </button>
      </div>
    </motion.div>
  );
};

const RegisterForm = ({ onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    email: "",
    phone: "",
    termsAccepted: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
    return hasMinLength && hasUpperCase && hasNumber && hasSpecialChar;
  };

  const validatePhone = (phone) => {
    return phone.match(/^[0-9]{10}$/);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate form
    const newErrors = {};
    if (!validateEmail(formData.email)) {
      newErrors.email = "Vui lòng nhập địa chỉ email hợp lệ";
    }
    if (!validatePassword(formData.password)) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, số và ký tự đặc biệt";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }
    if (!formData.fullName) {
      newErrors.fullName = "Họ tên là bắt buộc";
    }
    if (!validatePhone(formData.phone)) {
      newErrors.phone = "Vui lòng nhập số điện thoại 10 chữ số hợp lệ";
    }
    if (!formData.termsAccepted) {
      newErrors.terms = "Vui lòng chấp nhận điều khoản và điều kiện";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        const userData = {
          email: formData.email,
          password: formData.password,
          fullname: formData.fullName,
          phone: formData.phone,
          role: "USER",
          username: formData.username,
          active: true
        };

        const response = await authService.register(userData);

        if (response && response.result) {
          showToast.success("Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.");
          
          // Hiển thị thông báo thành công và chuyển về form đăng nhập
          setErrors({
            submit: "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản trước khi đăng nhập."
          });
          
          // Chuyển về form đăng nhập sau 3 giây
          setTimeout(() => {
            onSwitchToLogin();
          }, 3000);
        } else {
          showToast.error("Đăng ký thất bại. Vui lòng thử lại.");
          setErrors({
            submit: "Đăng ký thất bại. Vui lòng thử lại."
          });
        }
      } catch (error) {
        console.error('Registration error:', error);
        const errorMessage = error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.";
        showToast.registerError(errorMessage);
        setErrors({
          submit: error.response?.data?.message || error.message || "Đăng ký thất bại. Vui lòng thử lại."
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-indigo-400">
          Tạo tài khoản mới
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Đăng ký để trải nghiệm dịch vụ của chúng tôi</p>
      </div>

      <form className="space-y-5" onSubmit={handleRegister}>
        {errors.submit && (
          <div className={`px-4 py-3 rounded-lg ${
            errors.submit.includes('thành công') 
              ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400'
              : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
          }`} role="alert">
            <span className="block sm:inline">{errors.submit}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Họ tên</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`block w-full px-4 py-3 border ${errors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 dark:text-white transition-colors duration-200`}
              placeholder="Nhập họ tên đầy đủ"
            />
            {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Số điện thoại</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`block w-full px-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 dark:text-white transition-colors duration-200`}
              placeholder="Nhập số điện thoại"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`block w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 dark:text-white transition-colors duration-200`}
            placeholder="Nhập địa chỉ email"
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tên đăng nhập</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className={`block w-full px-4 py-3 border ${errors.username ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 dark:text-white transition-colors duration-200`}
            placeholder="Chọn tên đăng nhập"
          />
          {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mật khẩu</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`block w-full px-4 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 dark:text-white transition-colors duration-200`}
              placeholder="Tạo mật khẩu mạnh"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 
                <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" /> : 
                <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
              }
            </button>
          </div>
          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          <PasswordStrength password={formData.password} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Xác nhận mật khẩu</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={`block w-full px-4 py-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 dark:text-white transition-colors duration-200`}
            placeholder="Nhập lại mật khẩu"
          />
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
        </div>

        <div className="flex items-center">
          <input
            id="terms"
            name="termsAccepted"
            type="checkbox"
            checked={formData.termsAccepted}
            onChange={handleInputChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Tôi đồng ý với <a href="#" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">điều khoản</a> và <a href="#" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">chính sách bảo mật</a>
          </label>
        </div>
        {errors.terms && <p className="mt-1 text-sm text-red-500">{errors.terms}</p>}

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-[1.02] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </span>
            ) : (
              "Đăng ký"
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Đã có tài khoản? Đăng nhập ngay
        </button>
      </div>
    </motion.div>
  );
};

const AuthPage = () => {
  const [authState, setAuthState] = useState("login");
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordOTP, setForgotPasswordOTP] = useState("");

  const handleSwitchToLogin = () => {
    setAuthState("login");
  };

  const handleSwitchToRegister = () => {
    setAuthState("register");
  };

  const handleForgotPassword = () => {
    setAuthState("forgot-password");
  };

  const handleOtpSent = (email) => {
    setForgotPasswordEmail(email);
    setAuthState("verify-otp");
  };

  const handleOtpVerified = (email, otp) => {
    setForgotPasswordEmail(email);
    setForgotPasswordOTP(otp);
    setAuthState("reset-password");
  };

  const handlePasswordReset = () => {
    toast.success("Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập với mật khẩu mới.");
    setAuthState("login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-indigo-950 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-200">
        <div className="px-6 py-8 sm:px-8 sm:py-10">
          <AnimatePresence mode="wait">
            {authState === "login" && (
              <LoginForm 
                onSwitchToRegister={handleSwitchToRegister} 
                onForgotPassword={handleForgotPassword}
              />
            )}
            
            {authState === "register" && (
              <RegisterForm onSwitchToLogin={handleSwitchToLogin} />
            )}
            
            {authState === "forgot-password" && (
              <ForgotPassword 
                onBack={handleSwitchToLogin}
                onOtpSent={handleOtpSent}
              />
            )}
            
            {authState === "verify-otp" && (
              <VerifyOTP 
                email={forgotPasswordEmail}
                onBack={() => setAuthState("forgot-password")}
                onVerified={handleOtpVerified}
              />
            )}
            
            {authState === "reset-password" && (
              <ResetPassword 
                email={forgotPasswordEmail}
                otp={forgotPasswordOTP}
                onBack={() => setAuthState("verify-otp")}
                onSuccess={handlePasswordReset}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;