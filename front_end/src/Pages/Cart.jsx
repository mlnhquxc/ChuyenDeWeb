import React, { useState } from "react";
import {
  FiHeart,
  FiShoppingCart,
  FiMinus,
  FiPlus,
  FiTrash2,
  FiArrowLeft,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Classic T-Shirt",
      color: "White",
      size: "M",
      price: 29.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    },
    {
      id: 2,
      name: "Denim Jacket",
      color: "Blue",
      size: "L",
      price: 89.99,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1503341960582-b45751874cf0",
    },
  ]);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const shipping = 5.99;
  const tax = 0.1; // 10% tax

  const updateQuantity = (id, newQuantity) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const taxAmount = subtotal * tax;
  const total = subtotal + taxAmount + shipping - discount;
  // Payment
  const navigate = useNavigate();
  const handleCheckout = () => {
    navigate("/payment");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              Shopping Cart ({cartItems.length} items)
            </h2>
            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-600 flex items-center gap-2"
            >
              <FiTrash2 /> Clear Cart
            </button>
          </div>

          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 bg-white p-4 rounded-lg shadow"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-semibold">{item.name}</h3>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <FiTrash2 />
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  Color: {item.color} | Size: {item.size}
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded-full border"
                    >
                      <FiMinus />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-full border"
                    >
                      <FiPlus />
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">
                      ${item.price} each
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={() => navigate("/")}
            className="flex items-center text-green-500 hover:text-green-600 gap-2 mt-8"
          >
            <FiArrowLeft /> Continue Shopping
          </button>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-500">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-2 font-bold flex justify-between">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code"
                  className="flex-1 border rounded px-3 py-2"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Apply
                </button>
              </div>

              <button
                className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
