import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiShoppingCart, FiHeart, FiMenu, FiX , FiMic, FiUser, FiSettings, FiLogOut} from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { MdEmail, MdPhone, MdKeyboardArrowDown } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  // Theo dõi thay đổi của user state
  useEffect(() => {
    console.log('Header - User state changed:', { user, isAuthenticated });
  }, [user, isAuthenticated]);

  // Force re-render when auth state changes
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('Header - User authenticated, updating UI');
    }
  }, [isAuthenticated, user]);
  
  // Update cart count
  useEffect(() => {
    console.log('Cart updated:', cart);
    
    if (!cart) {
      setCartCount(0);
    } else if (cart.cartItems && Array.isArray(cart.cartItems)) {
      setCartCount(cart.cartItems.length);
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
      await logout();
      console.log('Header: Logout successful, navigating to login');
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Header: Logout error:', error);
      // Even if logout fails, navigate to login page
      navigate('/login', { replace: true });
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  //Tìm kiếm giọng nói
  const [isListening, setIsListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
  //
  const cartClick = () => {
    navigate('/cart'); // Chuyển sang trang /cart
  };

  const wishListClick = () => {
    navigate('/wishlist'); // Chuyển sang trang /wishlist
  };

  const menuItems = [
    { name: "Home", link: "/" },
    { name: "Shop", link: "/shop", hasDropdown: true },
    { name: "Pages", link: "#", hasDropdown: true },
    { name: "Blog", link: "#" },
    { name: "Contact", link: "/contact" },
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
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md">
        {/* <header className={`w-full ${isSticky ? "fixed top-0 shadow-lg bg-white" : ""}`}> */}
        {/* Top Bar */}
        <div className="bg-gray-100 py-2 hidden md:block">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
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
                <FaFacebookF className="text-gray-600 hover:text-blue-600 cursor-pointer" />
                <FaTwitter className="text-gray-600 hover:text-blue-400 cursor-pointer" />
                <FaInstagram className="text-gray-600 hover:text-pink-600 cursor-pointer" />
                <FaLinkedinIn className="text-gray-600 hover:text-blue-800 cursor-pointer" />
              </div>
              <div className="flex items-center space-x-4">
                <select className="bg-transparent text-sm text-gray-600 focus:outline-none">
                  <option value="en">English</option>
                  <option value="es">Vietnamese</option>
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
                              Profile
                            </button>
                            <button
                                onClick={handleOrdersClick}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <FiShoppingCart className="mr-2" />
                              Orders
                            </button>
                            <button
                                onClick={handleWishlistClick}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <FiHeart className="mr-2" />
                              Wishlist
                            </button>
                            <button
                                onClick={handleSettingsClick}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <FiSettings className="mr-2" />
                              Settings
                            </button>
                            <div className="border-t border-gray-100"></div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                            >
                              <FiLogOut className="mr-2" />
                              Logout
                            </button>
                          </div>
                      )}
                    </div>
                ) : (
                    <button
                        onClick={handleLogin}
                        className="text-sm text-gray-600 hover:text-red-600"
                    >
                      Login
                    </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="bg-white py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="w-40 cursor-pointer" onClick={() => navigate('/')}>
                <img
                    src="https://i.pinimg.com/736x/af/a5/38/afa538f94bca768daba1dcbb804fde4b.jpg"
                    alt="Logo"
                    className="h-12 object-contain"

                />
              </div>

              {/* Desktop Menu */}
              <div className="hidden lg:flex items-center space-x-8">
                {menuItems.map((item, index) => (
                    <div key={index} className="relative group">
                      <a
                          href={item.link}
                          className="text-gray-700 hover:text-red-600 flex items-center"
                      >
                        {item.name}
                        {item.hasDropdown && (
                            <MdKeyboardArrowDown className="ml-1" />
                        )}
                      </a>
                      {item.hasDropdown && (
                          <div className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-md py-2 hidden group-hover:block">
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Submenu 1</a>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Submenu 2</a>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Submenu 3</a>
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
                      placeholder="Search..."
                      className="w-40 lg:w-80 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-red-500"
                  />
                  <button onClick={handleVoiceSearch}
                          className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${isListening ? "text-red-500" : "text-gray-500"} hover:bg-gray-100`}
                  >
                    <FiMic className="w-5 h-5" />
                  </button>
                  {/* <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full text-gray-500 hover:bg-gray-100"
                >
                  <FiSearch className="w-5 h-5" />
                </button> */}
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <FiHeart className="text-2xl text-gray-700 hover:text-red-600 cursor-pointer" onClick={wishListClick}/>
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                  </div>
                  <div className="relative" >
                    <FiShoppingCart className="text-2xl text-gray-700 hover:text-red-600 cursor-pointer" onClick={cartClick}/>
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
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