import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProductCard from "../components/ProductCard";
import { productService } from "../services/productService";
import ImageSlider from '../components/ImageSlider';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    { name: "Laptops", value: "Laptops", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853" },
    { name: "Smartphones", value: "Smartphones", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9" },
    { name: "TVs & Displays", value: "TVs", image: "https://images.unsplash.com/photo-1593784991095-a205069470b6" },
    { name: "Accessories", value: "Accessories", image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07" },
    { name: "Audio", value: "Audio", image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b" },
    { name: "Gaming", value: "Gaming", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e" },
    { name: "Smart Home", value: "Smart Home", image: "https://images.unsplash.com/photo-1558002038-1055907df827" },
    { name: "Wearables", value: "Wearables", image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a" }
  ];
  
  const handleCategoryClick = (category) => {
    navigate('/store', { state: { category: category.value } });
  };

  // Fetch featured products from backend
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        // Lấy 8 sản phẩm đầu tiên từ API
        const response = await productService.getAllProducts2(0, 8, 'id');
        if (response && response.content) {
          setFeaturedProducts(response.content);
          setError(null);
        } else {
          setError("Không thể tải sản phẩm nổi bật");
        }
      } catch (err) {
        console.error("Error fetching featured products:", err);
        setError("Đã xảy ra lỗi khi tải sản phẩm nổi bật");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const nextCategory = () => {
    if(currentCategoryIndex < categories.length - 4){
      setCurrentCategoryIndex(prev => prev + 1);
    }
  };

  const prevCategory = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(prev => prev - 1);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
            <div className="fixed inset-0 z-40 bg-white dark:bg-gray-800 md:hidden">
              <div className="flex flex-col p-4 space-y-4">
                <a href="#" className="text-lg">{t('home.menu.home')}</a>
                <a href="#" className="text-lg">{t('home.menu.products')}</a>
                <a href="#" className="text-lg">{t('home.menu.categories')}</a>
                <a href="#" className="text-lg">{t('home.menu.deals')}</a>
                <a href="#" className="text-lg">{t('home.menu.support')}</a>
                <a href="#" className="text-lg">{t('home.menu.contact')}</a>
              </div>
            </div>
        )}

        {/* Hero Section */}
        <section className="relative h-[600px] overflow-hidden">
          <div className="w-full h-full object-cover m-0">
            <ImageSlider />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center justify-start px-8 md:px-16">
            <div className="text-left text-white max-w-xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in drop-shadow-lg">
                <span className="bg-gradient-to-r from-blue-400 to-indigo-500 text-transparent bg-clip-text">{t('home.hero.innovativeTech')}</span>
              </h1>
              <p className="text-xl mb-8 animate-fade-in-delay text-gray-200 drop-shadow-md">
                Khám phá những công nghệ mới nhất và sáng tạo cho cuộc sống hiện đại
              </p>
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full hover:from-blue-700 hover:to-indigo-700 transition duration-300 shadow-lg transform hover:scale-105 hover:shadow-xl">
                {t('home.hero.button')}
              </button>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 relative inline-block">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text dark:from-blue-400 dark:to-indigo-400">{t('home.categories.popularCategories')}</span>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-2 rounded-full"></div>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{t('home.categories.description')}</p>
          </div>
          
          <div className="relative">
            <button
                onClick={prevCategory}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 p-3 rounded-full shadow-xl z-10 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
                disabled={currentCategoryIndex === 0}
            >
              <FiChevronLeft className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-10">
              {categories.slice(currentCategoryIndex,currentCategoryIndex+4).map((category, index) => (
                  <div
                      key={index}
                      className="relative overflow-hidden rounded-xl group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                      onClick={() => handleCategoryClick(category)}
                  >
                    <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-64 object-cover transform group-hover:scale-110 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center p-6">
                      <div className="text-center">
                        <h3 className="text-white text-2xl font-semibold mb-2 group-hover:text-blue-300 transition-colors duration-300">{category.name}</h3>
                        <div className="w-0 h-1 bg-blue-500 mx-auto group-hover:w-16 transition-all duration-300"></div>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
            
            <button
                onClick={nextCategory}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 p-3 rounded-full shadow-xl z-10 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
                disabled={currentCategoryIndex >= categories.length - 4}
            >
              <FiChevronRight className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </button>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-slate-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 relative inline-block">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text dark:from-blue-400 dark:to-indigo-400">{t('home.featuredProducts.title')}</span>
                <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-2 rounded-full"></div>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{t('home.featuredProducts.description')}</p>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-4 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center py-8 bg-red-50 dark:bg-red-900/20 rounded-lg shadow-inner p-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            ) : (
              <div className="grid grid-cols-1 dark:text-white md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
                {featuredProducts.map((product, index) => (
                  <div key={product.id} className="w-full h-full flex transform transition-all duration-300 hover:-translate-y-2" style={{animationDelay: `${index * 0.1}s`}}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
            
            <div className="text-center mt-12">
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full hover:from-blue-700 hover:to-indigo-700 transition duration-300 shadow-lg transform hover:scale-105 hover:shadow-xl">
                {t('home.featuredProducts.viewAllProducts')}
              </button>
            </div>
          </div>
        </section>

      </div>
  );
};

export default HomePage;