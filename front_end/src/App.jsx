import React, { useState } from 'react';
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

function App() {
  return (
      <Router>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <TokenCleaner />
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Authentication />} />
                    <Route path="/auth" element={<Authentication />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/store" element={<Store />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                  </Routes>
                </main>
                <Footer />
              </div>
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </Router>
  );
}

export default App;