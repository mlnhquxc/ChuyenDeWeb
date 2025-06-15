import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiMinus, FiPlus } from "react-icons/fi";
import { motion } from "framer-motion";
import { productService } from "../services/productService";
import { useWishlist } from "../context/WishlistContext";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductDetailById(id);
        setProduct(data);
        setError(null);
      } catch (err) {
        setError("Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.");
        console.error("Error loading product:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (quantity > product.stock) {
      alert("Số lượng sản phẩm trong kho không đủ");
      return;
    }
    // TODO: Implement add to cart functionality
  };

  const handleBuyNow = () => {
    if (quantity > product.stock) {
      alert("Số lượng sản phẩm trong kho không đủ");
      return;
    }
    // TODO: Implement buy now functionality
  };

  const handleWishlistClick = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="text-red-500 text-center py-8">{error}</div>
    );
  }

  if (!product) {
    return (
        <div className="text-center py-8">Không tìm thấy sản phẩm</div>
    );
  }

  return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg">
              <img
                  src={product.mainImage}
                  alt={product.name}
                  className="w-full h-[500px] object-cover"
              />
            </div>
            <div className="flex gap-4">
              {product.additionalImages.map((img, index) => (
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
              <p className="text-gray-500">Danh mục: {product.categoryName}</p>
            </div>

            <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold text-green-500">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(product.price)}
            </span>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Số lượng</h3>
              <div className="flex items-center space-x-4">
                <button
                    onClick={() => quantity > 1 && setQuantity(q => q - 1)}
                    className="p-2 rounded-full border"
                >
                  <FiMinus />
                </button>
                <span className="text-xl">{quantity}</span>
                <button
                    onClick={() => quantity < product.stock && setQuantity(q => q + 1)}
                    className="p-2 rounded-full border"
                >
                  <FiPlus />
                </button>
                <span className="text-gray-500">({product.stock} sản phẩm có sẵn)</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-green-500 text-white py-3 rounded-full hover:bg-green-600 transition"
              >
                <FiShoppingCart className="inline mr-2" /> Thêm vào giỏ
              </button>
              <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-black text-white py-3 rounded-full hover:bg-gray-800 transition"
              >
                Mua ngay
              </button>
              <button
                  onClick={handleWishlistClick}
                  className={`p-3 rounded-full border ${isInWishlist(product.id) ? "text-red-500" : ""}`}
              >
                <FiHeart className="w-6 h-6" />
              </button>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-2">Mô tả</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ProductDetail;