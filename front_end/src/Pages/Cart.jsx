import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { FaTrash, FaArrowLeft } from 'react-icons/fa';

const Cart = () => {
  const { cart, loading, updateCartItem, removeFromCart } = useCart();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your cart is empty</h2>
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

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="divide-y divide-gray-200">
          {cart.map((item) => (
            <div key={item.id} className="p-6 flex items-center">
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-md"
              />
              <div className="ml-6 flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-600">${item.price}</p>
                <div className="mt-2 flex items-center">
                  <button
                    onClick={() => updateCartItem(item.id, Math.max(1, item.quantity - 1))}
                    className="px-2 py-1 border rounded-md hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="mx-4">{item.quantity}</span>
                  <button
                    onClick={() => updateCartItem(item.id, item.quantity + 1)}
                    className="px-2 py-1 border rounded-md hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="ml-6">
                <p className="text-lg font-semibold text-gray-800">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="mt-2 text-red-500 hover:text-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-800">Total:</span>
            <span className="text-2xl font-bold text-gray-800">${total.toFixed(2)}</span>
          </div>
          <button className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
