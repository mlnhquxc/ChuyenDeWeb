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
import { useTranslation } from 'react-i18next';

const PasswordStrength = ({ password }) => {
  const { t } = useTranslation();
  
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

  const getStrengthText = () => {
    if (strength === 0) return t('auth.passwordStrength.enterPassword');
    if (strength === 1) return t('auth.passwordStrength.weak');
    if (strength === 2) return t('auth.passwordStrength.medium');
    if (strength === 3) return t('auth.passwordStrength.good');
    return t('auth.passwordStrength.strong');
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
        {getStrengthText()}
      </p>
    </div>
  );
};

const LoginForm = ({ onSwitchToRegister, onForgotPassword }) => {
  const { t } = useTranslation();
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
        setErrors({ submit: t('auth.login.invalidCredentials') });
        showToast.loginError(t('auth.login.invalidCredentials'));
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || t('auth.login.error');
      
      // Kiểm tra nếu lỗi là email chưa được xác thực
      if (errorMessage.includes('Email is not verified') || errorMessage.includes('Email not verified')) {
        setErrors({ 
          submit: t('auth.login.emailNotVerified'),
          showResendButton: true,
          userEmail: formData.username
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
        showToast.success(t('auth.login.verificationEmailSent'));
        setErrors({ submit: t('auth.login.verificationEmailSent') });
      } else {
        showToast.error(t('auth.login.verificationEmailError'));
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      const errorMessage = error.response?.data?.message || t('auth.login.verificationEmailError');
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
          {t('auth.login.title')}
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">{t('auth.login.subtitle')}</p>
      </div>

      <form className="space-y-6" onSubmit={handleLogin}>
        {errors.submit && (
          <div className={`px-4 py-3 rounded-lg ${
            errors.submit.includes(t('auth.login.verificationEmailSent')) 
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
                {isLoading ? t('auth.login.sending') : t('auth.login.resendVerificationEmail')}
              </button>
            )}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('auth.login.username')}</label>
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
                placeholder={t('auth.login.usernamePlaceholder')}
              />
            </div>
            {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('auth.login.password')}</label>
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
                placeholder={t('auth.login.passwordPlaceholder')}
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
                {t('auth.login.rememberMe')}
              </label>
            </div>
            <div className="text-sm">
              <button 
                type="button"
                onClick={onForgotPassword}
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                {t('auth.login.forgotPassword')}
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
                {t('auth.login.processing')}
              </span>
            ) : (
              t('auth.login.loginButton')
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
              {t('auth.login.orLoginWith')}
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
          {t('auth.login.noAccountRegister')}
        </button>
      </div>
    </motion.div>
  );
};

const RegisterForm = ({ onSwitchToLogin }) => {
  const { t } = useTranslation();
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
      newErrors.email = t('auth.register.invalidEmail');
    }
    if (!validatePassword(formData.password)) {
      newErrors.password = t('auth.register.invalidPassword');
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.register.passwordMismatch');
    }
    if (!formData.fullName) {
      newErrors.fullName = t('auth.register.fullNameRequired');
    }
    if (!validatePhone(formData.phone)) {
      newErrors.phone = t('auth.register.invalidPhone');
    }
    if (!formData.termsAccepted) {
      newErrors.terms = t('auth.register.termsRequired');
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
          showToast.success(t('auth.register.success'));
          
          // Hiển thị thông báo thành công và chuyển về form đăng nhập
          setErrors({
            submit: t('auth.register.successMessage')
          });
          
          // Chuyển về form đăng nhập sau 3 giây
          setTimeout(() => {
            onSwitchToLogin();
          }, 3000);
        } else {
          showToast.error(t('auth.register.error'));
          setErrors({
            submit: t('auth.register.error')
          });
        }
      } catch (error) {
        console.error('Registration error:', error);
        const errorMessage = error.response?.data?.message || t('auth.register.error');
        showToast.registerError(errorMessage);
        setErrors({
          submit: error.response?.data?.message || error.message || t('auth.register.error')
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
          {t('auth.register.title')}
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">{t('auth.register.subtitle')}</p>
      </div>

      <form className="space-y-5" onSubmit={handleRegister}>
        {errors.submit && (
          <div className={`px-4 py-3 rounded-lg ${
            errors.submit.includes(t('auth.register.success')) 
              ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400'
              : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
          }`} role="alert">
            <span className="block sm:inline">{errors.submit}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('auth.register.fullName')}</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`block w-full px-4 py-3 border ${errors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 dark:text-white transition-colors duration-200`}
              placeholder={t('auth.register.fullNamePlaceholder')}
            />
            {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('auth.register.phone')}</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`block w-full px-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 dark:text-white transition-colors duration-200`}
              placeholder={t('auth.register.phonePlaceholder')}
            />
            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('auth.register.email')}</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`block w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 dark:text-white transition-colors duration-200`}
            placeholder={t('auth.register.emailPlaceholder')}
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('auth.register.username')}</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className={`block w-full px-4 py-3 border ${errors.username ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 dark:text-white transition-colors duration-200`}
            placeholder={t('auth.register.usernamePlaceholder')}
          />
          {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('auth.register.password')}</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`block w-full px-4 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 dark:text-white transition-colors duration-200`}
              placeholder={t('auth.register.passwordPlaceholder')}
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
          <PasswordStrength password={formData.password} />
          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('auth.register.confirmPassword')}</label>
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={`block w-full px-4 py-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 dark:text-white transition-colors duration-200`}
            placeholder={t('auth.register.confirmPasswordPlaceholder')}
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
            {t('auth.register.agreeToTerms')}{' '}
            <button type="button" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
              {t('auth.register.termsAndConditions')}
            </button>
          </label>
        </div>
        {errors.terms && <p className="text-sm text-red-500">{errors.terms}</p>}

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
                {t('auth.register.processing')}
              </span>
            ) : (
              t('auth.register.registerButton')
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
          {t('auth.register.hasAccountLogin')}
        </button>
      </div>
    </motion.div>
  );
};

const AuthPage = () => {
  const { t } = useTranslation();
  const [currentView, setCurrentView] = useState('login');
  const [otpEmail, setOtpEmail] = useState('');
  const [resetData, setResetData] = useState({ email: '', otp: '' });

  const handleSwitchToLogin = () => {
    setCurrentView('login');
  };

  const handleSwitchToRegister = () => {
    setCurrentView('register');
  };

  const handleForgotPassword = () => {
    setCurrentView('forgotPassword');
  };

  const handleOtpSent = (email) => {
    setOtpEmail(email);
    setCurrentView('verifyOTP');
  };

  const handleOtpVerified = (email, otp) => {
    setResetData({ email, otp });
    setCurrentView('resetPassword');
  };

  const handlePasswordReset = () => {
    setCurrentView('login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 transition-colors duration-200">
        <AnimatePresence mode="wait">
          {currentView === 'login' && (
            <LoginForm 
              key="login"
              onSwitchToRegister={handleSwitchToRegister}
              onForgotPassword={handleForgotPassword}
            />
          )}
          {currentView === 'register' && (
            <RegisterForm 
              key="register"
              onSwitchToLogin={handleSwitchToLogin}
            />
          )}
          {currentView === 'forgotPassword' && (
            <ForgotPassword 
              key="forgotPassword"
              onBack={handleSwitchToLogin}
              onOtpSent={handleOtpSent}
            />
          )}
          {currentView === 'verifyOTP' && (
            <VerifyOTP 
              key="verifyOTP"
              email={otpEmail}
              onBack={handleForgotPassword}
              onVerified={handleOtpVerified}
            />
          )}
          {currentView === 'resetPassword' && (
            <ResetPassword 
              key="resetPassword"
              email={resetData.email}
              otp={resetData.otp}
              onBack={handleSwitchToLogin}
              onPasswordReset={handlePasswordReset}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthPage;