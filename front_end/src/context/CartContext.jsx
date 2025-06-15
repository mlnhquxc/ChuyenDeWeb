import React, { createContext, useState, useContext, useEffect } from 'react';
import cartService from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadCartAndWishlist();
    } else {
      setCart([]);
      setWishlist([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadCartAndWishlist = async () => {
    try {
      const [cartData, wishlistData] = await Promise.all([
        cartService.getCart(),
        cartService.getWishlist()
      ]);
      setCart(cartData.result || []);
      setWishlist(wishlistData.result || []);
    } catch (error) {
      console.error('Error loading cart and wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await cartService.addToCart(productId, quantity);
      setCart(response.result);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const updateCartItem = async (cartItemId, quantity) => {
    try {
      const response = await cartService.updateCartItem(cartItemId, quantity);
      setCart(response.result);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const response = await cartService.removeFromCart(cartItemId);
      setCart(response.result);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const addToWishlist = async (productId) => {
    try {
      const response = await cartService.addToWishlist(productId);
      setWishlist(response.result);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await cartService.removeFromWishlist(productId);
      setWishlist(response.result);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    cart,
    wishlist,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    addToWishlist,
    removeFromWishlist,
    refreshCartAndWishlist: loadCartAndWishlist
  };

  return (
      <CartContext.Provider value={value}>
        {children}
      </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};