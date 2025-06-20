import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiHeart, FiShoppingCart } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { productService } from '../services/productService';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const RelatedProductsSlider = ({ currentProductId, categoryName }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState({});
  const [isAddingToWishlist, setIsAddingToWishlist] = useState({});
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Responsive products per slide
  const getProductsPerSlide = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1; // mobile
      if (window.innerWidth < 1024) return 2; // tablet
      return 4; // desktop
    }
    return 4;
  };

  const [productsPerSlide, setProductsPerSlide] = useState(getProductsPerSlide());

  useEffect(() => {
    const loadRelatedProducts = async () => {
      try {
        setLoading(true);
        let products = [];
        
        // Lấy sản phẩm cùng danh mục trước
        if (categoryName) {
          const categoryResponse = await productService.getProductsByCategory(categoryName, 0, 12);
          products = categoryResponse.content || [];
        }
        
        // Nếu không đủ sản phẩm cùng danh mục, lấy thêm sản phẩm khác
        if (products.length < 8) {
          const allProductsResponse = await productService.getAllProducts(0, 12);
          const additionalProducts = allProductsResponse.content || [];
          products = [...products, ...additionalProducts];
        }
        
        // Loại bỏ sản phẩm hiện tại và trộn ngẫu nhiên
        const filteredProducts = products
          .filter(product => product.id !== currentProductId)
          .sort(() => Math.random() - 0.5)
          .slice(0, 8); // Lấy tối đa 8 sản phẩm
        
        setRelatedProducts(filteredProducts);
      } catch (error) {
        console.error('Error loading related products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentProductId) {
      loadRelatedProducts();
    }
  }, [currentProductId, categoryName]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setProductsPerSlide(getProductsPerSlide());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-play slider
  useEffect(() => {
    if (!isAutoPlay || relatedProducts.length <= productsPerSlide) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => {
        const maxSlide = Math.ceil(relatedProducts.length / productsPerSlide) - 1;
        return prev >= maxSlide ? 0 : prev + 1;
      });
    }, 5000); // Chuyển slide mỗi 5 giây

    return () => clearInterval(interval);
  }, [isAutoPlay, relatedProducts.length, productsPerSlide]);

  const nextSlide = () => {
    const maxSlide = Math.ceil(relatedProducts.length / productsPerSlide) - 1;
    setCurrentSlide(prev => (prev >= maxSlide ? 0 : prev + 1));
  };

  const prevSlide = () => {
    const maxSlide = Math.ceil(relatedProducts.length / productsPerSlide) - 1;
    setCurrentSlide(prev => (prev <= 0 ? maxSlide : prev - 1));
  };

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      setIsAddingToCart(prev => ({ ...prev, [product.id]: true }));
      await addToCart(product.id, 1);
      alert("Sản phẩm đã được thêm vào giỏ hàng");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Có lỗi xảy ra khi thêm vào giỏ hàng");
    } finally {
      setIsAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const handleWishlistClick = async (product) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      setIsAddingToWishlist(prev => ({ ...prev, [product.id]: true }));
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product.id);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    } finally {
      setIsAddingToWishlist(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Sản phẩm liên quan</h2>
          <div className="flex justify-center items-center h-32">
            <div className="w-8 h-8 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  const currentProducts = relatedProducts.slice(
    currentSlide * productsPerSlide,
    (currentSlide + 1) * productsPerSlide
  );

  return (
    <div 
      className="py-12 bg-gray-50 dark:bg-gray-800 transition-colors duration-200"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sản phẩm liên quan</h2>
          
          {/* Navigation buttons */}
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-md hover:shadow-lg transition-all duration-300 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-md hover:shadow-lg transition-all duration-300 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="wait">
            {currentProducts.map((product, index) => (
              <motion.div
                key={`${product.id}-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
              {/* Product image */}
              <div className="relative overflow-hidden">
                <img
                  src={product.imageUrls?.[0] || 'https://via.placeholder.com/300x300?text=No+Image'}
                  alt={product.name}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                  }}
                />
                
                {/* Wishlist button */}
                <button
                  onClick={() => handleWishlistClick(product)}
                  disabled={isAddingToWishlist[product.id]}
                  className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
                    isInWishlist(product.id)
                      ? "bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-300"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-500 dark:hover:text-red-300"
                  } opacity-0 group-hover:opacity-100`}
                >
                  <FiHeart className="w-4 h-4" />
                </button>
              </div>

              {/* Product info */}
              <div className="p-4">
                <h3
                  className="font-semibold text-gray-900 dark:text-white mb-2 cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 overflow-hidden"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    textOverflow: 'ellipsis'
                  }}
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  {product.name}
                </h3>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {product.categoryName}
                  </span>
                </div>

                {/* Add to cart button */}
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={isAddingToCart[product.id]}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <FiShoppingCart className="w-4 h-4" />
                  {isAddingToCart[product.id] ? 'Đang thêm...' : 'Thêm vào giỏ'}
                </button>
              </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Slide indicators */}
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: Math.ceil(relatedProducts.length / productsPerSlide) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "bg-purple-600 dark:bg-purple-400"
                  : "bg-gray-300 dark:bg-gray-600 hover:bg-purple-300 dark:hover:bg-purple-700"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedProductsSlider;