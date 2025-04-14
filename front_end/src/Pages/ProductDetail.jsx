import React, { useState } from "react";
import { FiHeart, FiShoppingCart, FiMinus, FiPlus } from "react-icons/fi";
import { motion } from "framer-motion";

const ProductDetail = () => {
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);

  const product = {
    name: "Classic T-Shirt",
    sku: "TSH001",
    price: 29.99,
    salePrice: 24.99,
    discount: 17,
    colors: ["White", "Black", "Navy", "Gray"],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
      "https://images.unsplash.com/photo-1503341960582-b45751874cf0",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c"
    ],
    stock: {
      S: 5,
      M: 10,
      L: 0,
      XL: 8
    },
    description: "Premium cotton t-shirt with classic fit",
    details: "100% Cotton\nMachine washable\nClassic fit\nRound neck",
    brand: "Fashion Brand",
    rating: 4.5,
    reviews: 128
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select size and color");
      return;
    }
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select size and color");
      return;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={product.images[currentImage]}
              alt={product.name}
              className="w-full h-[500px] object-cover"
            />
          </div>
          <div className="flex gap-4">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`w-20 h-20 rounded-lg overflow-hidden ${currentImage === index ? "ring-2 ring-green-500" : ""}`}
              >
                <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-gray-500">SKU: {product.sku}</p>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold text-green-500">${product.salePrice}</span>
            <span className="text-lg text-gray-500 line-through">${product.price}</span>
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm">-{product.discount}%</span>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Color</h3>
            <div className="flex space-x-2">
              {product.colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border ${selectedColor === color ? "ring-2 ring-green-500" : ""}`}
                  style={{ backgroundColor: color.toLowerCase() }}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Size</h3>
              <button
                onClick={() => setShowSizeGuide(true)}
                className="text-green-500 text-sm"
              >
                Size Guide
              </button>
            </div>
            <div className="flex space-x-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  disabled={!product.stock[size]}
                  className={`
                    px-4 py-2 rounded-md border
                    ${selectedSize === size ? "bg-green-500 text-white" : ""}
                    ${!product.stock[size] ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}
                  `}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Quantity</h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => quantity > 1 && setQuantity(q => q - 1)}
                className="p-2 rounded-full border"
              >
                <FiMinus />
              </button>
              <span className="text-xl">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="p-2 rounded-full border"
              >
                <FiPlus />
              </button>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-green-500 text-white py-3 rounded-full hover:bg-green-600 transition"
            >
              <FiShoppingCart className="inline mr-2" /> Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-black text-white py-3 rounded-full hover:bg-gray-800 transition"
            >
              Buy Now
            </button>
            <button
              onClick={() => setIsWishlist(!isWishlist)}
              className={`p-3 rounded-full border ${isWishlist ? "text-red-500" : ""}`}
            >
              <FiHeart className="w-6 h-6" />
            </button>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Product Details</h3>
            <pre className="text-gray-600 whitespace-pre-line">{product.details}</pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Brand</h3>
            <p className="text-gray-600">{product.brand}</p>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold">{product.rating}</span>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <span className="text-gray-500">({product.reviews} reviews)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;