import React, { useState } from "react";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/product_detail');
  };

  const addToWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="flex flex-col h-[430px] bg-white rounded-xl shadow p-0 cursor-pointer" onClick={handleClick}>
      <div className="w-full aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
        <img src={product.image} alt={product.name} className="object-cover w-full h-full rounded-lg" />
      </div>
      <div className="flex flex-col flex-1 justify-between p-4">
        <div>
          <div className="font-semibold text-lg line-clamp-2 min-h-[3rem]">{product.name}</div>
          <div className="text-gray-500 text-sm mb-2">{product.category}</div>
          <div className="font-bold text-red-500 text-xl mb-2">{product.price?.toLocaleString()} đ</div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <button className="flex-1 bg-red-500 text-white py-2 rounded mr-2 hover:bg-red-600 flex items-center justify-center">
            <FiShoppingCart className="mr-2" /> Thêm vào giỏ
          </button>
          <button className={`p-2 rounded-full border ${isWishlisted ? 'bg-red-100 text-red-500' : 'text-gray-400 hover:text-red-500'}`} onClick={addToWishlist}>
            <FiHeart />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
