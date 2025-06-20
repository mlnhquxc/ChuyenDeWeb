import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiShoppingCart, FiHeart, FiMenu, FiX , FiMic, FiUser, FiSettings, FiLogOut } from "react-icons/fi";
import { FiSun, FiMoon } from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { MdEmail, MdPhone, MdKeyboardArrowDown } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useTranslation } from 'react-i18next';
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
  const { t, i18n } = useTranslation();

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
      alert(t('header.speechNotSupported'));
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
    { name: t('header.menu.home'), link: "/" },
    { name: t('header.menu.store'), link: "/shop" },
    { name: t('header.menu.pages'), link: "#", hasDropdown: true },
    { name: t('header.menu.blog'), link: "/blog" },
    { name: t('header.menu.contact'), link: "/contact" },
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

  // Đảm bảo ngôn ngữ dropdown đồng bộ với i18n
  useEffect(() => {
    console.log('Current language:', i18n.language);
  }, [i18n.language]);

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
                <span>{t('header.email')}</span>
              </div>
              <div className="flex items-center">
                <MdPhone className="mr-2" />
                <span>{t('header.phone')}</span>
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
                <select className="bg-transparent text-sm text-gray-600 dark:text-gray-300 focus:outline-none" value={i18n.language} onChange={e => i18n.changeLanguage(e.target.value)}>
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
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
                              {t('header.profile')}
                            </button>
                            <button
                                onClick={handleOrdersClick}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <FiShoppingCart className="mr-2" />
                              {t('header.orders')}
                            </button>
                            <button
                                onClick={handleWishlistClick}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <FiHeart className="mr-2" />
                              {t('header.wishlist')}
                            </button>
                            <button
                                onClick={handleSettingsClick}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <FiSettings className="mr-2" />
                              {t('header.settings')}
                            </button>
                            <div className="border-t border-gray-100"></div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                            >
                              <FiLogOut className="mr-2" />
                              {t('header.logout')}
                            </button>
                          </div>
                      )}
                    </div>
                ) : (
                    <button
                        onClick={handleLogin}
                        className="text-sm text-gray-600 hover:text-red-600"
                    >
                      {t('header.login')}
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
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-1 group-hover:translate-y-0">{t('header.techStore')}</p>
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
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('header.dropdown.category1')}</a>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('header.dropdown.category2')}</a>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('header.dropdown.category3')}</a>
                          </div>
                      )}
                    </div>
                ))}
              </div>

              {/* Search and Cart */}
              <div className="flex items-center space-x-3 lg:space-x-6">
                {/* Search Bar - Responsive Design */}
                <div className="relative flex-1 max-w-xs lg:max-w-md">
                  <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={t('header.searchPlaceholder')}
                      className="w-full pl-4 pr-20 lg:pr-24 py-2.5 lg:py-3 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-300 text-sm lg:text-base"
                  />
                  <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                    <button 
                      onClick={handleVoiceSearch}
                      className={`p-1.5 lg:p-2 rounded-full transition-all duration-300 ${
                        isListening 
                          ? "text-blue-500 bg-blue-50 dark:bg-blue-900/30 scale-110" 
                          : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 hover:scale-110"
                      }`}
                      title={t('header.voiceSearch')}
                    >
                      <FiMic className="w-4 h-4 lg:w-5 lg:h-5" />
                    </button>
                    <button
                      onClick={() => handleSearch()}
                      className="p-1.5 lg:p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-blue-500 hover:scale-110 transition-all duration-300"
                      title={t('header.search')}
                    >
                      <FiSearch className="w-4 h-4 lg:w-5 lg:h-5" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 lg:space-x-4">
                  {/* Dark Mode Toggle */}
                  <button 
                    onClick={toggleDarkMode}
                    className="p-2 lg:p-2.5 rounded-full bg-gradient-to-r from-slate-100 to-blue-100 hover:from-slate-200 hover:to-blue-200 dark:from-gray-700 dark:to-gray-600 dark:hover:from-gray-600 dark:hover:to-gray-500 text-gray-600 dark:text-amber-400 transition-all duration-300 transform hover:scale-105 shadow-md"
                    title={isDarkMode ? t('header.switchToLight') : t('header.switchToDark')}
                  >
                    {isDarkMode ? <FiSun className="text-lg lg:text-xl text-amber-400" /> : <FiMoon className="text-lg lg:text-xl text-slate-600" />}
                  </button>
                  
                  {/* Wishlist */}
                  <div className="relative">
                    <FiHeart className="text-xl lg:text-2xl text-gray-700 hover:text-rose-500 cursor-pointer dark:text-gray-300 dark:hover:text-rose-400 transition-colors duration-300" onClick={wishListClick}/>
                    <span className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs rounded-full w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center shadow-lg font-semibold">
                      {wishlistCount}
                    </span>
                  </div>

                  {/* Cart */}
                  <div className="relative" >
                    <FiShoppingCart className="text-xl lg:text-2xl text-gray-700 hover:text-emerald-600 cursor-pointer dark:text-gray-300 dark:hover:text-emerald-400 transition-colors duration-300" onClick={cartClick}/>
                    <span className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs rounded-full w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center shadow-lg font-semibold">
                      {cartCount}
                    </span>
                  </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden text-gray-700 dark:text-gray-300 p-2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
              <div className="lg:hidden fixed inset-0 z-50">
                <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)} />
                <div className="absolute top-0 right-0 w-80 h-full bg-white dark:bg-gray-800 shadow-xl overflow-y-auto">
                  {/* Mobile Menu Header */}
                  <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <img
                        src="https://i.pinimg.com/736x/af/a5/38/afa538f94bca768daba1dcbb804fde4b.jpg"
                        alt="Logo"
                        className="h-8 w-8 object-cover rounded-lg mr-3"
                      />
                      <h2 className="text-lg font-bold text-gray-800 dark:text-white">NAGIS</h2>
                    </div>
                    <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                      <FiX size={20} className="text-gray-700 dark:text-gray-300" />
                    </button>
                  </div>

                  {/* Mobile Search */}
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={t('header.searchPlaceholder')}
                        className="w-full pl-4 pr-16 py-3 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-300"
                      />
                      <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                        <button 
                          onClick={handleVoiceSearch}
                          className={`p-2 rounded-full transition-all duration-300 ${
                            isListening 
                              ? "text-blue-500 bg-blue-50 dark:bg-blue-900/30" 
                              : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600"
                          }`}
                        >
                          <FiMic className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            handleSearch();
                            setIsMenuOpen(false);
                          }}
                          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-blue-500 transition-all duration-300"
                        >
                          <FiSearch className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Menu Items */}
                  <div className="p-6 space-y-4">
                    {menuItems.map((item, index) => (
                        <div key={index}>
                          <a
                              href={item.link}
                              className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 font-medium"
                              onClick={() => setIsMenuOpen(false)}
                          >
                            {item.name}
                          </a>
                        </div>
                    ))}
                  </div>

                  {/* Mobile Action Buttons */}
                  <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{t('header.switchToDark')}</span>
                      <button 
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full bg-gradient-to-r from-slate-100 to-blue-100 hover:from-slate-200 hover:to-blue-200 dark:from-gray-700 dark:to-gray-600 dark:hover:from-gray-600 dark:hover:to-gray-500 text-gray-600 dark:text-amber-400 transition-all duration-300"
                      >
                        {isDarkMode ? <FiSun className="text-lg text-amber-400" /> : <FiMoon className="text-lg text-slate-600" />}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => {
                          wishListClick();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center justify-center p-3 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-200 dark:hover:bg-rose-900/50 transition-colors duration-300"
                      >
                        <FiHeart className="mr-2" />
                        <span className="font-medium">{t('header.wishlist')}</span>
                        <span className="ml-2 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {wishlistCount}
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          cartClick();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center justify-center p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors duration-300"
                      >
                        <FiShoppingCart className="mr-2" />
                        <span className="font-medium">{t('header.orders')}</span>
                        <span className="ml-2 bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {cartCount}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
          )}
        </nav>
      </header>
  );
};

export default Header;