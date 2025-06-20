import React, { useState, useEffect } from "react";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import { FaShoppingBag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { showToast } from "../utils/toast";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { ProductImage } from "../utils/placeholderImage.jsx";
import { useTranslation } from 'react-i18next';

const ProductCard = ({ product }) => {
  if (!product) {
    return null;
  }

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated && product.id) {
      setIsWishlisted(isInWishlist(product.id));
    }
  }, [isAuthenticated, product.id, isInWishlist]);

  const handleClick = () => {
    if (product.id) {
      navigate(`/product/${product.id}`);
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      setIsAddingToCart(true);
      await addToCart(product.id, 1);
      showToast.addToCartSuccess(product.name, 1);
    } catch (error) {
      console.error("Error adding to cart:", error);
      showToast.addToCartError(product.name, "Có lỗi xảy ra khi thêm vào giỏ hàng");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      setIsAddingToWishlist(true);
      if (isWishlisted) {
        await removeFromWishlist(product.id);
        setIsWishlisted(false);
      } else {
        await addToWishlist(product.id);
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      alert("Có lỗi xảy ra khi cập nhật danh sách yêu thích");
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Navigate directly to payment page with product data
    const buyNowItem = {
      id: `buynow_${product.id}`,
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      productImage: product.imageUrls?.[0] || product.image,
      quantity: 1,
      subtotal: product.price
    };
    
    navigate('/payment', {
      state: {
        selectedItems: [buyNowItem],
        isFromBuyNow: true
      }
    });
  };
  
  const imageUrl = product.imageUrls?.[0] || product.image;
  const productName = product.name || t('productCard.noName');
  const categoryName = product.categoryName || t('productCard.noCategory');
  const price = product.price || 0;

  return (
      <div 
        className="flex flex-col h-[480px] bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl p-0 cursor-pointer transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden card" 
        onClick={handleClick}
      >
        <div className="relative w-full aspect-square bg-gray-50 dark:bg-gray-700 flex items-center justify-center overflow-hidden group">
          <ProductImage
              src={imageUrl}
              alt={productName}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              size="large"
          />
          <div className="absolute top-2 right-2">
            <button
                className={`p-2 rounded-full ${isWishlisted ? 'bg-rose-500 text-white' : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:text-rose-500 dark:hover:text-rose-400'} shadow-md backdrop-blur-sm transition-all duration-300 ${isAddingToWishlist ? 'opacity-70' : ''} hover:scale-110`}
                onClick={handleWishlistToggle}
                disabled={isAddingToWishlist}
            >
              <FiHeart className={`${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="text-white text-sm font-medium truncate">{categoryName}</div>
          </div>
        </div>
        <div className="flex flex-col flex-1 justify-between p-4 dark:text-gray-100">
          <div>
            <div className="font-semibold text-lg line-clamp-2 min-h-[3rem] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{productName}</div>
            <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">{categoryName}</div>
            <div className="font-bold text-xl mb-2">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text dark:from-blue-400 dark:to-indigo-400">
                {price.toLocaleString()} đ
              </span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <button
                className={`w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-2.5 px-4 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-[1.02] shadow-md font-medium`}
                onClick={handleBuyNow}
            >
              <FaShoppingBag className="mr-2" /> 
              {t('productCard.buyNow')}
            </button>
            <button
                className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 px-4 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-[1.02] ${isAddingToCart ? 'opacity-70' : ''} shadow-md`}
                onClick={handleAddToCart}
                disabled={isAddingToCart}
            >
              <FiShoppingCart className="mr-2" /> 
              {isAddingToCart ? t('productCard.adding') : t('productCard.addToCart')}
            </button>
          </div>
        </div>
      </div>
  );
};

export default ProductCard;