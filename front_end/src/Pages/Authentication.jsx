import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { useAuth } from "../context/AuthContext";

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
    if (strength === 3) return "bg-blue-500";
    return "bg-green-500";
  };

  return (
    <div className="mt-2">
      <div className="h-2 w-full bg-gray-200 rounded-full">
        <div
          className={`h-full ${getColor()} rounded-full transition-all duration-300`}
          style={{ width: `${(strength / 4) * 100}%` }}
        ></div>
      </div>
      <p className="text-xs mt-1 text-gray-500">
        {strength === 0 && "Enter password"}
        {strength === 1 && "Weak"}
        {strength === 2 && "Fair"}
        {strength === 3 && "Good"}
        {strength === 4 && "Strong"}
      </p>
    </div>
  );
};

const AuthPage = () => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    email: "",
    phone: "",
    rememberMe: false,
    termsAccepted: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const { login } = useAuth();

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
    console.log('=== REGISTER START ===');
    console.log('Form data:', formData);
    console.log('Current auth state:', authState);
    
    // Validate form
    const newErrors = {};
    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 8 characters long and include uppercase, number, and special character";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.fullName) {
      newErrors.fullName = "Full name is required";
    }
    if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    if (!formData.termsAccepted) {
      newErrors.terms = "Please accept terms and conditions";
    }

    console.log('Validation errors:', newErrors);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('No validation errors, proceeding with registration');
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
        
        console.log('Calling authService.register with:', userData);
        const response = await authService.register(userData);
        console.log('Registration response:', response);
        
        if (response && response.authenticated) {
          console.log('Registration successful, setting user data');
          setUser(response.user);
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          navigate('/');
        } else {
          console.log('Registration failed - not authenticated');
          setErrors({
            submit: "Registration failed. Please try again."
          });
        }
      } catch (error) {
        console.error('Registration error:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        setErrors({
          submit: error.response?.data?.message || error.message || "Registration failed. Please try again."
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('Validation failed, not proceeding with registration');
    }
    console.log('=== REGISTER END ===');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Login form submitted');
    console.log('Form data:', formData);
    if (Object.keys(errors).length > 0) {
      console.log('Validation errors:', errors);
      return;
    }
    try {
      console.log('Attempting login...');
      const response = await login({
        username: formData.username,
        password: formData.password
      });
      console.log('Login response:', response);
      if (response && response.authenticated) {
        console.log('Login successful');
        navigate('/');
      } else {
        console.log('Login failed: Not authenticated');
        setErrors({ submit: 'Invalid username or password' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ submit: error.response?.data?.message || 'An error occurred during login' });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log('=== FORM SUBMIT START ===');
    console.log('Form submitted, auth state:', authState);
    console.log('Form data:', formData);
    console.log('Form validation errors:', errors);
    
    if (authState === "login") {
      handleLogin(e);
    } else {
      handleRegister(e);
    }
    console.log('=== FORM SUBMIT END ===');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={authState}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                {authState === "login" ? "Sign in to your account" : "Create your account"}
              </h2>
            </div>

            <form 
              className="mt-8 space-y-6" 
              onSubmit={handleFormSubmit}
              onClick={() => console.log('Form clicked')}
            >
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{errors.submit}</span>
                </div>
              )}

              {authState === "register" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                  </div>
                </>
              )}

              {authState === "register" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              </div>

              {authState === "register" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
                </div>
              )}

              {authState === "register" && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    I accept the terms and conditions
                  </label>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                    isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    authState === "login" ? "Sign in" : "Sign up"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  console.log('Switching auth state from', authState, 'to', authState === "login" ? "register" : "login");
                  setAuthState(authState === "login" ? "register" : "login");
                }}
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                {authState === "login"
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthPage;