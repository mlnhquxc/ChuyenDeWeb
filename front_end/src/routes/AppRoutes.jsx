import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../Pages/HomePage';
import Store from '../Pages/Store';
import ProductDetail from '../Pages/ProductDetail';
import AboutUs from '../Pages/aboutUs';
import Contact from '../Pages/Contact';
import FAQ from '../Pages/FAQ';
import BaoHanh from '../Pages/baoHanh';
import DoiTra from '../Pages/doiTra';
import AuthPage from '../Pages/Authentication';
import Cart from '../Pages/Cart';
import WishList from '../Pages/WishList';
import Profile from '../Pages/Profile';
import Orders from '../Pages/Orders';
import PrivateRoute from '../components/PrivateRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/shop" element={<Store />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
      <Route
        path="/cart"
        element={
          <PrivateRoute>
            <Cart />
          </PrivateRoute>
        }
      />
      <Route
        path="/wishlist"
        element={
          <PrivateRoute>
            <WishList />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <PrivateRoute>
            <Orders />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
