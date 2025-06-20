import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Home from './Pages/Home';
import Authentication from './Pages/Authentication';
import Cart from './Pages/Cart';
import Payment from './Pages/Payment';
import Orders from './Pages/Orders';
import ProductDetail from './Pages/ProductDetail';
import Profile from './Pages/Profile';
import Header from './components/Header';
import Footer from './components/Footer';
import Store from './Pages/Store';
import Wishlist from './Pages/WishList';
import TokenCleaner from './components/TokenCleaner';
import EmailVerification from './Pages/EmailVerification';

function App() {
  // Thêm state và logic dark mode trực tiếp vào App
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Kiểm tra localStorage để lấy trạng thái dark mode đã lưu
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  // Cập nhật class cho thẻ html khi chế độ thay đổi
  useEffect(() => {
    const htmlElement = document.documentElement;
    
    if (isDarkMode) {
      htmlElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      htmlElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Hàm để chuyển đổi giữa chế độ sáng và tối
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
      <Router>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <TokenCleaner />
              <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
                <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Authentication />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/store" element={<Store />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/verify-email" element={<EmailVerification />} />
                  </Routes>
                </main>
                <Footer />
              </div>
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={isDarkMode ? "dark" : "light"}
                className="mt-16"
                toastClassName={() => 
                  "relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer " +
                  (isDarkMode 
                    ? "bg-gray-800 text-white border border-gray-700" 
                    : "bg-white text-gray-900 border border-gray-200"
                  )
                }
                bodyClassName={() => "text-sm font-medium p-3"}
                progressClassName={() => 
                  isDarkMode 
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500" 
                    : "bg-gradient-to-r from-blue-600 to-indigo-600"
                }
                closeButton={({ closeToast }) => (
                  <button
                    onClick={closeToast}
                    className={`self-start p-2 rounded-full transition-colors ${
                      isDarkMode 
                        ? "hover:bg-gray-700 text-gray-400 hover:text-white" 
                        : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    ✕
                  </button>
                )}
              />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </Router>
  );
}

export default App;