import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiShoppingCart, FiHeart, FiMenu, FiX , FiMic, FiUser, FiSettings, FiLogOut } from "react-icons/fi";
import { FiSun, FiMoon } from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { MdEmail, MdPhone, MdKeyboardArrowDown } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
// Nhận isDarkMode và toggleDarkMode từ props

const Header = ({ isDarkMode, toggleDarkMode }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  // Nhận isDarkMode và toggleDarkMode từ props
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Theo dõi thay đổi của user state
  useEffect(() => {
    console.log('Header - User state changed:', { user, isAuthenticated });
  }, [user, isAuthenticated]);

  // Force re-render when auth state changes
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('Header - User authenticated, updating UI');
    } else {
      console.log('Header - User not authenticated, updating UI');
    }
  }, [isAuthenticated, user]);
  
  // Update cart count
  useEffect(() => {
    console.log('Cart updated:', cart);
    
    if (!cart) {
      setCartCount(0);
    } else if (cart.items && Array.isArray(cart.items)) {
      // Count number of unique products (not total quantity)
      setCartCount(cart.items.length);
    } else if (Array.isArray(cart)) {
      setCartCount(cart.length);
    } else {
      setCartCount(0);
    }
  }, [cart]);
  
  // Update wishlist count
  useEffect(() => {
    console.log('Wishlist updated:', wishlist);
    
    if (!wishlist) {
      setWishlistCount(0);
    } else if (wishlist.wishlistItems && Array.isArray(wishlist.wishlistItems)) {
      setWishlistCount(wishlist.wishlistItems.length);
    } else if (wishlist.items && Array.isArray(wishlist.items)) {
      setWishlistCount(wishlist.items.length);
    } else if (Array.isArray(wishlist)) {
      setWishlistCount(wishlist.length);
    } else {
      setWishlistCount(0);
    }
  }, [wishlist]);

  const handleLogout = async () => {
    try {
      console.log('Header: Initiating logout...');
      const success = await logout();
      if (success) {
        console.log('Header: Logout successful, navigating to login');
        navigate('/login', { replace: true });
      } else {
        console.error('Header: Logout failed');
        navigate('/login', { replace: true });
      }
    } catch (error) {
      console.error('Header: Logout error:', error);
      // Even if logout fails, navigate to login page
      navigate('/login', { replace: true });
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  //Tìm kiếm giọng nói và tìm kiếm thông thường
  const [isListening, setIsListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Lấy query từ URL nếu đang ở trang store và có query
  useEffect(() => {
    if (location.pathname === '/store' && location.state?.searchQuery) {
      setSearchQuery(location.state.searchQuery);
    }
  }, [location]);
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;
  if (recognition) {
    recognition.continuous = false;
    recognition.lang = "vi-VN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setSearchQuery(text);
      setIsListening(false);
      // Tự động tìm kiếm khi có kết quả từ giọng nói
      handleSearch(text);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
  }
  
  const handleVoiceSearch = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in your browser");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };
  
  // Xử lý tìm kiếm
  const handleSearch = (query = searchQuery) => {
    if (!query.trim()) return;
    
    console.log("Searching for:", query);
    navigate('/store', { 
      state: { 
        searchQuery: query,
        fromSearch: true
      } 
    });
  };
  
  // Xử lý khi nhấn Enter trong ô tìm kiếm
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  //
  const cartClick = () => {
    navigate('/cart'); // Chuyển sang trang /cart
  };

  const wishListClick = () => {
    navigate('/wishlist'); // Chuyển sang trang /wishlist
  };

  const menuItems = [
    { name: "Trang chủ", link: "/" },
    { name: "Cửa hàng", link: "/shop" },
    { name: "Trang", link: "#", hasDropdown: true },
    { name: "Blog", link: "/blog" },
    { name: "Liên hệ", link: "/contact" },
  ];

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUserMenuClick = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsUserMenuOpen(false);
  };

  const handleOrdersClick = () => {
    navigate('/orders');
    setIsUserMenuOpen(false);
  };

  const handleWishlistClick = () => {
    navigate('/wishlist');
    setIsUserMenuOpen(false);
  };

  const handleSettingsClick = () => {
    navigate('/settings');
    setIsUserMenuOpen(false);
  };

  return (
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-lg transition-colors duration-200">
        {/* <header className={`w-full ${isSticky ? "fixed top-0 shadow-lg bg-white" : ""}`}> */}
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 py-2 hidden md:block transition-colors duration-200">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center">
                <MdEmail className="mr-2" />
                <span>Nagis@gmail.com</span>
              </div>
              <div className="flex items-center">
                <MdPhone className="mr-2" />
                <span>+1 234 567 8900</span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex space-x-4">
                <FaFacebookF className="text-gray-500 dark:text-gray-400 hover:text-blue-500 cursor-pointer transition-all duration-300 transform hover:scale-110" />
                <FaTwitter className="text-gray-500 dark:text-gray-400 hover:text-sky-500 cursor-pointer transition-all duration-300 transform hover:scale-110" />
                <FaInstagram className="text-gray-500 dark:text-gray-400 hover:text-rose-500 cursor-pointer transition-all duration-300 transform hover:scale-110" />
                <FaLinkedinIn className="text-gray-500 dark:text-gray-400 hover:text-blue-600 cursor-pointer transition-all duration-300 transform hover:scale-110" />
              </div>
              <div className="flex items-center space-x-4">
                <select className="bg-transparent text-sm text-gray-600 dark:text-gray-300 focus:outline-none">
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">Tiếng Anh</option>
                </select>
                {isAuthenticated && user ? (
                    <div className="relative" ref={userMenuRef}>
                      <button
                          onClick={handleUserMenuClick}
                          className="flex items-center space-x-2 focus:outline-none"
                      >
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          {user?.avatar ? (
                              <img
                                  src={user.avatar}
                                  alt="User avatar"
                                  className="w-full h-full object-cover"
                              />
                          ) : (
                              <FiUser className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                        <span className="text-sm text-gray-600">{user?.fullname || user?.username}</span>
                        <MdKeyboardArrowDown className={`transform transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isUserMenuOpen && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                            <button
                                onClick={handleProfileClick}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <FiUser className="mr-2" />
                              Hồ sơ
                            </button>
                            <button
                                onClick={handleOrdersClick}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <FiShoppingCart className="mr-2" />
                              Đơn hàng
                            </button>
                            <button
                                onClick={handleWishlistClick}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <FiHeart className="mr-2" />
                              Yêu thích
                            </button>
                            <button
                                onClick={handleSettingsClick}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <FiSettings className="mr-2" />
                              Cài đặt
                            </button>
                            <div className="border-t border-gray-100"></div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                            >
                              <FiLogOut className="mr-2" />
                              Đăng xuất
                            </button>
                          </div>
                      )}
                    </div>
                ) : (
                    <button
                        onClick={handleLogin}
                        className="text-sm text-gray-600 hover:text-red-600"
                    >
                      Đăng nhập
                    </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="bg-white dark:bg-gray-800 py-4 transition-colors duration-200 border-b border-gray-100 dark:border-gray-700">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div 
                className="flex items-center cursor-pointer transform transition-all duration-300 hover:scale-105 group" 
                onClick={() => navigate('/')}
              >
                <div className="relative overflow-hidden rounded-xl shadow-lg border-2 border-transparent group-hover:border-purple-500 dark:group-hover:border-purple-400 transition-all duration-300 logo-pulse">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-300 z-0 gradient-animation"></div>
                  <div className="relative z-10 bg-white dark:bg-gray-800 rounded-xl overflow-hidden logo-shine">
                    <img
                      src="https://i.pinimg.com/736x/af/a5/38/afa538f94bca768daba1dcbb804fde4b.jpg"
                      alt="Logo"
                      className="h-12 w-12 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>
                <div className="ml-3 transition-all duration-300">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text dark:from-blue-400 dark:to-indigo-400 group-hover:from-blue-500 group-hover:to-indigo-500 gradient-animation">NAGIS</h1>
                  <div className="h-0.5 w-0 bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:w-full transition-all duration-500"></div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-1 group-hover:translate-y-0">Tech Store</p>
                </div>
              </div>

              {/* Desktop Menu */}
              <div className="hidden lg:flex items-center space-x-8">
                {menuItems.map((item, index) => (
                    <div key={index} className="relative group">
                      <a
                          href={item.link}
                          className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center transition-colors duration-300"
                      >
                        {item.name}
                        {item.hasDropdown && (
                            <MdKeyboardArrowDown className="ml-1" />
                        )}
                      </a>
                      {item.hasDropdown && (
                          <div className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-md py-2 hidden group-hover:block">
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Danh mục 1</a>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Danh mục 2</a>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Danh mục 3</a>
                          </div>
                      )}
                    </div>
                ))}
              </div>

              {/* Search and Cart */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Tìm kiếm sản phẩm..."
                      className="w-40 lg:w-80 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-300"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex">
                    <button 
                      onClick={handleVoiceSearch}
                      className={`p-2 rounded-full ${isListening ? "text-blue-500 bg-blue-50 dark:bg-blue-900/30" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600"} mr-1 transition-all duration-300`}
                    >
                      <FiMic className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleSearch()}
                      className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-blue-500 transition-all duration-300"
                    >
                      <FiSearch className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {/* Nút chuyển đổi chế độ sáng/tối */}
                  <button 
                    onClick={toggleDarkMode}
                    className="p-2 rounded-full bg-gradient-to-r from-slate-100 to-blue-100 hover:from-slate-200 hover:to-blue-200 dark:from-gray-700 dark:to-gray-600 dark:hover:from-gray-600 dark:hover:to-gray-500 text-gray-600 dark:text-amber-400 transition-all duration-300 transform hover:scale-105 shadow-md"
                    title={isDarkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
                  >
                    {isDarkMode ? <FiSun className="text-xl text-amber-400" /> : <FiMoon className="text-xl text-slate-600" />}
                  </button>
                  
                  <div className="relative">
                    <FiHeart className="text-2xl text-gray-700 hover:text-rose-500 cursor-pointer dark:text-gray-300 dark:hover:text-rose-400 transition-colors duration-300" onClick={wishListClick}/>
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shadow-lg font-semibold">
                    {wishlistCount}
                  </span>
                  </div>
                  <div className="relative" >
                    <FiShoppingCart className="text-2xl text-gray-700 hover:text-emerald-600 cursor-pointer dark:text-gray-300 dark:hover:text-emerald-400 transition-colors duration-300" onClick={cartClick}/>
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shadow-lg font-semibold">
                    {cartCount}
                  </span>
                  </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden text-gray-700"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
              <div className="lg:hidden fixed inset-0 z-50">
                <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)} />
                <div className="absolute top-0 right-0 w-64 h-full bg-white shadow-lg py-4 px-6">
                  <div className="flex justify-end">
                    <button onClick={() => setIsMenuOpen(false)}>
                      <FiX size={24} className="text-gray-700" />
                    </button>
                  </div>
                  <div className="mt-8 space-y-4">
                    {menuItems.map((item, index) => (
                        <div key={index}>
                          <a
                              href={item.link}
                              className="block text-gray-700 hover:text-red-600 py-2"
                          >
                            {item.name}
                          </a>
                        </div>
                    ))}
                  </div>
                </div>
              </div>
          )}
        </nav>
      </header>
  );
};

export default Header;