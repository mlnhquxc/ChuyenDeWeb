import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiMinus, FiPlus } from "react-icons/fi";
import { FaShoppingBag } from "react-icons/fa";
import { motion } from "framer-motion";
import { productService } from "../services/productService";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

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

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (quantity > product.stock) {
      alert("Số lượng sản phẩm trong kho không đủ");
      return;
    }
    
    try {
      setIsAddingToCart(true);
      await addToCart(product.id, quantity);
      alert("Sản phẩm đã được thêm vào giỏ hàng");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Có lỗi xảy ra khi thêm vào giỏ hàng");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (quantity > product.stock) {
      alert("Số lượng sản phẩm trong kho không đủ");
      return;
    }
    
    // Navigate directly to payment page with product data
    const buyNowItem = {
      id: `buynow_${product.id}`,
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      productImage: product.imageUrls?.[0] || product.image,
      quantity: quantity,
      subtotal: product.price * quantity
    };
    
    navigate('/payment', {
      state: {
        selectedItems: [buyNowItem],
        isFromBuyNow: true
      }
    });
  };

  const handleWishlistClick = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      setIsAddingToWishlist(true);
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id);
        alert("Sản phẩm đã được xóa khỏi danh sách yêu thích");
      } else {
        await addToWishlist(product.id);
        alert("Sản phẩm đã được thêm vào danh sách yêu thích");
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      alert("Có lỗi xảy ra khi cập nhật danh sách yêu thích");
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin"></div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="text-center py-8 text-red-500 dark:text-red-400 font-medium">{error}</div>
    );
  }

  if (!product) {
    return (
        <div className="text-center py-8 text-gray-600 dark:text-gray-400 font-medium">Không tìm thấy sản phẩm</div>
    );
  }

  return (
      <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 transition-colors duration-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="relative overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:scale-[1.02]">
              <img
                  src={currentImage === 0 ? product.mainImage : product.additionalImages[currentImage - 1]}
                  alt={product.name}
                  className="w-full h-[500px] object-cover transition-transform duration-500 hover:scale-[1.05]"
              />
            </div>
            <div className="flex gap-4 mt-4">
              <button
                  onClick={() => setCurrentImage(0)}
                  className={`w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                    currentImage === 0 ? "border-purple-500" : "border-transparent"
                  }`}
              >
                <img 
                  src={product.mainImage} 
                  alt={`${product.name} - Hình chính`} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </button>
              {product.additionalImages.map((img, index) => (
                  <button
                      key={index}
                      onClick={() => setCurrentImage(index + 1)}
                      className={`w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                        currentImage === index + 1 ? "border-purple-500" : "border-transparent"
                      }`}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name} ${index + 1}`} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">{product.name}</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Danh mục: {product.categoryName}</p>
            </div>

            <div>
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 inline-block mb-4">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(product.price)}
              </span>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Số lượng</h3>
              <div className="flex items-center gap-4">
                <button
                    onClick={() => quantity > 1 && setQuantity(q => q - 1)}
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity <= 1}
                >
                  <FiMinus />
                </button>
                <span className="text-xl font-medium text-gray-900 dark:text-white">{quantity}</span>
                <button
                    onClick={() => quantity < product.stock && setQuantity(q => q + 1)}
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity >= product.stock}
                >
                  <FiPlus />
                </button>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({product.stock} sản phẩm có sẵn)</span>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center py-3 px-4 rounded-full font-semibold text-white transition-all duration-300 shadow-md hover:-translate-y-1 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed bg-gradient-to-r from-purple-600 to-indigo-600"
                  disabled={isAddingToCart}
              >
                <FiShoppingCart className="mr-2" /> 
                {isAddingToCart ? 'Đang thêm...' : 'Thêm vào giỏ'}
              </button>
              <button
                  onClick={handleBuyNow}
                  className="flex-1 flex items-center justify-center py-3 px-4 rounded-full font-semibold text-white transition-all duration-300 shadow-md hover:-translate-y-1 hover:shadow-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                <FaShoppingBag className="mr-2" />
                Mua ngay
              </button>
              <button
                  onClick={handleWishlistClick}
                  className={`flex items-center justify-center w-12 h-12 rounded-full border transition-all duration-300 hover:scale-110 disabled:opacity-70 disabled:cursor-not-allowed ${
                    isInWishlist(product.id) 
                      ? "bg-red-100 dark:bg-red-900 border-red-200 dark:border-red-800 text-red-500 dark:text-red-300" 
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900 hover:border-red-200 dark:hover:border-red-800 hover:text-red-500 dark:hover:text-red-300"
                  }`}
                  disabled={isAddingToWishlist}
              >
                <FiHeart className="w-6 h-6" />
              </button>
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Mô tả</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ProductDetail;