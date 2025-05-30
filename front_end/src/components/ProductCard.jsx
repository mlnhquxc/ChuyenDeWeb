import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Lấy ảnh đầu tiên của sản phẩm
  const productImage = `/src/assets/images/${product.category}/${product.brand}/${product.images[0]}`;

  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="relative overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
          <img
            src={productImage}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="mb-2 text-lg font-semibold text-gray-900">{product.name}</h3>
          <p className="mb-2 text-sm text-gray-600">{product.brand}</p>
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-primary">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(product.price)}
            </p>
            <button
              onClick={handleWishlistClick}
              className={`rounded-full p-2 transition-colors ${
                isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <FiHeart className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard; 