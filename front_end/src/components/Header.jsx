import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiShoppingCart, FiHeart, FiMenu, FiX , FiMic, FiUser, FiSettings, FiLogOut} from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { MdEmail, MdPhone, MdKeyboardArrowDown } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Layout, Menu, Button, Badge, Space } from 'antd';
import { ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Header: AntHeader } = Layout;

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
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

  const userId = localStorage.getItem('userId');

  return (
    <AntHeader style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div className="logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        style={{ flex: 1, minWidth: 0 }}
      >
        <Menu.Item key="home">
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="shop">
          <Link to="/shop">Shop</Link>
        </Menu.Item>
      </Menu>
      <Space>
        <Button
          type="text"
          icon={<HeartOutlined />}
          onClick={() => navigate('/wishlist')}
        >
          Wishlist
        </Button>
        <Button
          type="text"
          icon={<ShoppingCartOutlined />}
          onClick={() => navigate('/cart')}
        >
          Cart
        </Button>
        {userId ? (
          <Button type="primary" onClick={() => navigate('/profile')}>
            Profile
          </Button>
        ) : (
          <Button type="primary" onClick={() => navigate('/auth')}>
            Login
          </Button>
        )}
      </Space>
    </AntHeader>
  );
};

export default Header;