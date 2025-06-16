import React, { useState, useEffect } from "react";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

const ProductCard = ({ product }) => {
  if (!product) {
    return null;
  }

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

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
      alert("Sản phẩm đã được thêm vào giỏ hàng");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Có lỗi xảy ra khi thêm vào giỏ hàng");
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
  
  const imageUrl = product.imageUrls?.[0] || product.image || '/placeholder-image.jpg';
  const productName = product.name || 'Không có tên';
  const categoryName = product.categoryName || 'Không phân loại';
  const price = product.price || 0;

  return (
      <div className="flex flex-col h-[430px] bg-white rounded-xl shadow p-0 cursor-pointer" onClick={handleClick}>
        <div className="w-full aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
          <img
              src={imageUrl}
              alt={productName}
              className="object-cover w-full h-full rounded-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder-image.jpg';
              }}
          />
        </div>
        <div className="flex flex-col flex-1 justify-between p-4">
          <div>
            <div className="font-semibold text-lg line-clamp-2 min-h-[3rem]">{productName}</div>
            <div className="text-gray-500 text-sm mb-2">{categoryName}</div>
            <div className="font-bold text-red-500 text-xl mb-2">{price.toLocaleString()} đ</div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <button
                className={`flex-1 bg-red-500 text-white py-2 rounded mr-2 hover:bg-red-600 flex items-center justify-center ${isAddingToCart ? 'opacity-70' : ''}`}
                onClick={handleAddToCart}
                disabled={isAddingToCart}
            >
              <FiShoppingCart className="mr-2" /> 
              {isAddingToCart ? 'Đang thêm...' : 'Thêm vào giỏ'}
            </button>
            <button
                className={`p-2 rounded-full border ${isWishlisted ? 'bg-red-100 text-red-500' : 'text-gray-400 hover:text-red-500'} ${isAddingToWishlist ? 'opacity-70' : ''}`}
                onClick={handleWishlistToggle}
                disabled={isAddingToWishlist}
            >
              <FiHeart />
            </button>
          </div>
        </div>
      </div>
  );
};

export default ProductCard;