import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Home from './Pages/Home';
import Authentication from './Pages/Authentication';
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout';
import ProductDetail from './Pages/ProductDetail';
import Category from './Pages/Category';
import Search from './Pages/Search';
import Profile from './Pages/Profile';
import Shop from './Pages/Shop';
import Header from './components/Header';
import Footer from './components/Footer';
import Store from './Pages/Store';
import Wishlist from './Pages/WishList';

function App() {
  return (
      <Router>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Authentication />} />
                    <Route path="/auth" element={<Authentication />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/category/:category" element={<Category />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/store" element={<Store />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </Router>
  );
}

export default App;