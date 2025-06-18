import React, { createContext, useState, useContext, useEffect } from 'react';
import cartService from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('CartContext - Authentication state changed:', isAuthenticated);
    if (isAuthenticated) {
      console.log('CartContext - User is authenticated, loading cart...');
      loadCart();
    } else {
      console.log('CartContext - User is not authenticated, clearing cart...');
      setCart(null);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadCart = async () => {
    try {
      console.log('CartContext - Loading cart...');
      setLoading(true);
      const cartData = await cartService.getCart();
      console.log('CartContext - Cart data received:', cartData);
      
      if (cartData && cartData.result) {
        console.log('CartContext - Setting cart with data:', cartData.result);
        setCart(cartData.result);
      } else {
        console.warn('CartContext - No cart data in response:', cartData);
        setCart(null);
      }
    } catch (error) {
      console.error('CartContext - Error loading cart:', error);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      // Don't set global loading for add to cart to prevent flickering
      const response = await cartService.addToCart(productId, quantity);
      setCart(response.result);
      return response;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const updateCartItem = async (cartItemId, quantity) => {
    try {
      // Don't set global loading for updates to prevent flickering
      const response = await cartService.updateCartItem(cartItemId, quantity);
      setCart(response.result);
      return response;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      // Don't set global loading for removal to prevent flickering
      const response = await cartService.removeFromCart(productId);
      setCart(response.result);
      return response;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await cartService.clearCart();
      setCart(null);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart: loadCart
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