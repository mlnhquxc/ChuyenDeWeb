import { Routes, Route } from 'react-router-dom';
import Home from '../Pages/HomePage';
import Store from '../Pages/Store';
import ProductDetail from '../Pages/ProductDetail';
import Cart from '../Pages/Cart'
import CheckoutPage from '../Pages/Payment'
import AuthPage from '../Pages/Authentication'
import WishList from '../Pages/WishList';

function AppRoutes() {
  
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Store />} />
      <Route path="/product_detail" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart/>} />
      <Route path="/payment" element={<CheckoutPage/>} />
      <Route path="/login" element={<AuthPage/>} />
      <Route path="/wishList" element={<WishList/>} />
    </Routes>
  );
}

export default AppRoutes;
