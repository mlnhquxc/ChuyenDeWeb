import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../Pages/Home';
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
import BuyNow from '../Pages/BuyNow';
import Payment from '../Pages/Payment';
import PaymentResult from '../Pages/PaymentResult';
import PaymentReturn from '../Pages/PaymentReturn';
import PaymentTest from '../components/PaymentTest';
import Blog from '../Pages/Blog';
import EmailVerification from '../Pages/EmailVerification';
import PrivateRoute from '../components/PrivateRoute';
import PublicRoute from '../components/PublicRoute';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Store />} />
            <Route path="/store" element={<Store />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/aboutUs" element={<AboutUs />} />
            <Route path="/baoHanh" element={<BaoHanh />} />
            <Route path="/doiTra" element={<DoiTra />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route 
                path="/login" 
                element={
                    <PublicRoute>
                        <AuthPage />
                    </PublicRoute>
                } 
            />
            <Route 
                path="/register" 
                element={
                    <PublicRoute>
                        <AuthPage />
                    </PublicRoute>
                } 
            />

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
            <Route
                path="/buy-now"
                element={
                    <PrivateRoute>
                        <BuyNow />
                    </PrivateRoute>
                }
            />
            <Route
                path="/payment"
                element={
                    <PrivateRoute>
                        <Payment />
                    </PrivateRoute>
                }
            />
            <Route
                path="/payment/result"
                element={<PaymentResult />}
            />
            <Route
                path="/payment/return"
                element={<PaymentReturn />}
            />
            <Route
                path="/payment/test"
                element={<PaymentTest />}
            />
        </Routes>
    );
};

export default AppRoutes;