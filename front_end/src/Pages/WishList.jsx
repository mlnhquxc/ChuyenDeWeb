import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { FaTrash, FaArrowLeft, FaShoppingCart } from 'react-icons/fa';

const Wishlist = () => {
  const { wishlist, loading, removeFromWishlist, addToCart } = useCart();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your wishlist is empty</h2>
        <Link
          to="/products"
          className="inline-flex items-center text-blue-500 hover:text-blue-600"
        >
          <FaArrowLeft className="mr-2" />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Wishlist</h1>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="divide-y divide-gray-200">
          {wishlist.map((item) => (
            <div key={item.id} className="p-6 flex items-center">
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-md"
              />
              <div className="ml-6 flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-600">${item.price}</p>
              </div>
              <div className="ml-6 flex items-center space-x-4">
                <button
                  onClick={() => addToCart(item.id)}
                  className="flex items-center text-blue-500 hover:text-blue-600"
                >
                  <FaShoppingCart className="mr-2" />
                  Add to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
