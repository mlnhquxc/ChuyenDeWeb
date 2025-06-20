import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiMinus, FiPlus } from "react-icons/fi";
import { FaShoppingBag } from "react-icons/fa";
import { motion } from "framer-motion";
import { productService } from "../services/productService";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import RelatedProductsSlider from "../components/RelatedProductsSlider";
import FacebookComments from "../components/FacebookComments";

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
    const productImages = product.additionalImages || product.imageUrls || [];
    const buyNowItem = {
      id: `buynow_${product.id}`,
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      productImage: productImages[0] || product.mainImage || product.image,
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

  // Lấy danh sách ảnh từ product (tối đa 3 ảnh)
  const productImages = product.additionalImages || product.imageUrls || [];
  const displayImages = productImages.slice(0, 3); // Chỉ lấy 3 ảnh đầu tiên

  return (
      <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 transition-colors duration-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Phần hiển thị ảnh */}
          <div className="space-y-4">
            {/* Ảnh chính phóng to */}
            <div className="relative overflow-hidden rounded-xl shadow-lg bg-gray-100 dark:bg-gray-800 group">
              <img
                  src={displayImages[currentImage] || product.mainImage || displayImages[0]}
                  alt={`${product.name} - Ảnh ${currentImage + 1}`}
                  className="w-full h-[500px] object-contain transition-all duration-500 group-hover:scale-110 cursor-zoom-in"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/500x500?text=No+Image';
                  }}
              />
              
              {/* Indicator hiển thị ảnh hiện tại */}
              <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium">
                {currentImage + 1} / {displayImages.length}
              </div>
              
              {/* Navigation arrows */}
              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImage(currentImage > 0 ? currentImage - 1 : displayImages.length - 1)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentImage(currentImage < displayImages.length - 1 ? currentImage + 1 : 0)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
            
            {/* Danh sách thumbnail 3 ảnh nhỏ */}
            <div className="flex gap-3 justify-center">
              {displayImages.map((img, index) => (
                  <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`relative w-24 h-24 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                        currentImage === index 
                          ? "border-purple-500 shadow-lg ring-2 ring-purple-200 dark:ring-purple-400" 
                          : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600"
                      }`}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name} - Ảnh ${index + 1}`} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/96x96?text=No+Image';
                      }}
                    />
                    {/* Số thứ tự ảnh */}
                    <div className="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white text-xs px-1 rounded">
                      {index + 1}
                    </div>
                  </button>
              ))}
            </div>
            
            {/* Thông tin bổ sung về ảnh */}
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Nhấp vào ảnh nhỏ để xem chi tiết • Hover để phóng to
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">{product.name}</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Danh mục: {product.categoryName}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(product.originalPrice)}
                    </span>
                    <span className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 px-2 py-1 rounded-full text-sm font-medium">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                  Tiết kiệm: {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(product.originalPrice - product.price)}
                </p>
              )}
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

            {/* Thông tin chi tiết sản phẩm */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700 mt-6 space-y-6">
              {/* Mô tả ngắn */}
              {product.shortDescription && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Tóm tắt</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{product.shortDescription}</p>
                </div>
              )}
              
              {/* Thông tin kỹ thuật */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.brand && (
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Thương hiệu:</span>
                    <span className="text-gray-900 dark:text-white">{product.brand}</span>
                  </div>
                )}
                {product.model && (
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Model:</span>
                    <span className="text-gray-900 dark:text-white">{product.model}</span>
                  </div>
                )}
                {product.color && (
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Màu sắc:</span>
                    <span className="text-gray-900 dark:text-white">{product.color}</span>
                  </div>
                )}
                {product.weight && (
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Trọng lượng:</span>
                    <span className="text-gray-900 dark:text-white">{product.weight} kg</span>
                  </div>
                )}
                {product.dimensions && (
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Kích thước:</span>
                    <span className="text-gray-900 dark:text-white">{product.dimensions}</span>
                  </div>
                )}
                {product.material && (
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Chất liệu:</span>
                    <span className="text-gray-900 dark:text-white">{product.material}</span>
                  </div>
                )}
                {product.warrantyPeriod && (
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Bảo hành:</span>
                    <span className="text-gray-900 dark:text-white">{product.warrantyPeriod} tháng</span>
                  </div>
                )}
              </div>

              {/* Mô tả chi tiết */}
              {product.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Mô tả chi tiết</h3>
                  <div className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </div>
                </div>
              )}

              {/* Thông số kỹ thuật */}
              {product.specifications && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Thông số kỹ thuật</h3>
                  <div className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {product.specifications}
                  </div>
                </div>
              )}

              {/* Tính năng nổi bật */}
              {product.features && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tính năng nổi bật</h3>
                  <div className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {product.features}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Facebook Comments Section */}
        <div className="mt-12">
          <FacebookComments 
            key={product.id}
            url="https://developers.facebook.com/docs/plugins/comments#configurator"
            width="100%"
            numPosts={5}
          />
        </div>

        {/* Related Products Slider */}
        <RelatedProductsSlider 
          currentProductId={product.id} 
          categoryName={product.categoryName} 
        />
      </div>
  );
};

export default ProductDetail;