import React, { useState } from "react";
import { FiHeart, FiTrash2, FiArrowLeft, FiShoppingCart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const WishList = () => {
  const [wishItems, setWishItems] = useState([
    {
      id: 1,
      name: "Classic T-Shirt",
      color: "White",
      size: "M",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"
    },
    {
      id: 2,
      name: "Denim Jacket",
      color: "Blue",
      size: "L",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1503341960582-b45751874cf0"
    }
  ]);

  const navigate = useNavigate();

  const removeItem = (id) => {
    setWishItems(items => items.filter(item => item.id !== id));
  };

  const clearWishList = () => {
    setWishItems([]);
  };

  const handleAddToCart = (item) => {
    console.log("Adding to cart:", item);
    // chỗ này có thể gọi API hoặc dispatch Redux, tuỳ logic nhóm.
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Wishlist ({wishItems.length} items)</h2>
        <button
          onClick={clearWishList}
          className="text-red-500 hover:text-red-600 flex items-center gap-2"
        >
          <FiTrash2 /> Clear Wishlist
        </button>
      </div>

      {wishItems.length === 0 ? (
        <p className="text-center text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishItems.map(item => (
            <div key={item.id} className="flex flex-col bg-white p-4 rounded-lg shadow">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover rounded"
              />
              <div className="mt-4 flex-1">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-sm text-gray-500">
                  Color: {item.color} | Size: {item.size}
                </p>
                <p className="font-semibold mt-2">${item.price.toFixed(2)}</p>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => handleAddToCart(item)}
                  className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                  <FiShoppingCart /> Add to Cart
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => navigate('/')}
        className="flex items-center text-green-500 hover:text-green-600 gap-2 mt-8"
      >
        <FiArrowLeft /> Continue Shopping
      </button>
    </div>
  );
};

export default WishList;
