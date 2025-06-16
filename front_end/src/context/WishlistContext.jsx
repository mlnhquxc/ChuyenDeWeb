import React, { createContext, useContext, useState, useEffect } from 'react';
import wishlistService from '../services/wishlistService';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('WishlistContext - Authentication state changed:', isAuthenticated);
    if (isAuthenticated) {
      console.log('WishlistContext - User is authenticated, loading wishlist...');
      loadWishlist();
    } else {
      console.log('WishlistContext - User is not authenticated, clearing wishlist...');
      setWishlist([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadWishlist = async () => {
    try {
      console.log('WishlistContext - Loading wishlist...');
      setLoading(true);
      const wishlistData = await wishlistService.getWishlist();
      console.log('WishlistContext - Wishlist data received:', wishlistData);
      
      if (wishlistData && wishlistData.result) {
        console.log('WishlistContext - Setting wishlist with data:', wishlistData.result);
        setWishlist(wishlistData.result || []);
      } else {
        console.warn('WishlistContext - No wishlist data in response:', wishlistData);
        setWishlist([]);
      }
    } catch (error) {
      console.error('WishlistContext - Error loading wishlist:', error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      setLoading(true);
      const response = await wishlistService.addToWishlist(productId);
      setWishlist(response.result || []);
      return response;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      setLoading(true);
      const response = await wishlistService.removeFromWishlist(productId);
      setWishlist(response.result || []);
      return response;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearWishlist = async () => {
    try {
      setLoading(true);
      await wishlistService.clearWishlist();
      setWishlist([]);
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    if (!wishlist) return false;
    
    console.log('Checking if product is in wishlist, productId:', productId);
    console.log('Wishlist:', wishlist);
    
    // If wishlist is an array, check directly
    if (Array.isArray(wishlist)) {
      return wishlist.some(item => 
        item.id === productId || 
        item.productId === productId || 
        (item.product && item.product.id === productId)
      );
    }
    
    // If wishlist has wishlistItems property (from backend API)
    if (wishlist.wishlistItems && Array.isArray(wishlist.wishlistItems)) {
      return wishlist.wishlistItems.some(item => 
        item.productId === productId || 
        (item.product && item.product.id === productId)
      );
    }
    
    // If wishlist has items property
    if (wishlist.items && Array.isArray(wishlist.items)) {
      return wishlist.items.some(item => 
        item.productId === productId || 
        (item.product && item.product.id === productId)
      );
    }
    
    return false;
  };

  const value = {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    refreshWishlist: loadWishlist
  };

  return (
      <WishlistContext.Provider value={value}>
        {children}
      </WishlistContext.Provider>
  );
};