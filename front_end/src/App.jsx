import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Home from './Pages/Home';
import Authentication from './Pages/Authentication';
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout';
import ProductDetail from './Pages/ProductDetail';
import Category from './Pages/Category';
import Search from './Pages/Search';
import Profile from './Pages/Profile';
import Header from './component/Header';
import Footer from './component/Footer';

function App() {
  const [authState, setAuthState] = useState("login");
  const [user, setUser] = useState(null);

  const handleAuthChange = (newState, userData = null) => {
    setAuthState(newState);
    if (userData) {
      setUser(userData);
    }
  };

  return (
    <AuthContext.Provider value={{ authState, setAuthState: handleAuthChange, user, setUser }}>
      <Router>
        <AuthProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/auth" element={<Authentication />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/category/:category" element={<Category />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;