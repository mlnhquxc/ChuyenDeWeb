import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProductCard from "../components/ProductCard";
import { productService } from "../services/productService";
import ImageSlider from '../components/ImageSlider';
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
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
      <div className={`min-h-screen ${isDarkMode ? "dark bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
            <div className="fixed inset-0 z-40 bg-white dark:bg-gray-800 md:hidden">
              <div className="flex flex-col p-4 space-y-4">
                <a href="#" className="text-lg">Home</a>
                <a href="#" className="text-lg">Products</a>
                <a href="#" className="text-lg">Categories</a>
                <a href="#" className="text-lg">Deals</a>
                <a href="#" className="text-lg">Support</a>
                <a href="#" className="text-lg">Contact</a>
              </div>
            </div>
        )}

        {/* Hero Section */}
        <section className="relative h-[600px] overflow-hidden">
          {/* <img
          src="https://images.unsplash.com/photo-1550009158-9ebf69173e03"
          alt="Tech Hero Banner"
          className="w-full h-full object-cover"
        /> */}
          <div className="w-full h-full object-cover m-0">
            <ImageSlider />
          </div>
          <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-yellow">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
                Tech Innovation
              </h1>
              <p className="text-xl mb-8 animate-fade-in-delay">
                Discover the latest in technology and innovation
              </p>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition duration-300">
                Explore Now
              </button>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Categories</h2>
          <div className="relative">
            <button
                onClick={prevCategory}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg z-10 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiChevronLeft className="h-6 w-6" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.slice(currentCategoryIndex,currentCategoryIndex+4).map((category, index) => (
                  <div
                      key={index}
                      className="relative overflow-hidden rounded-lg group cursor-pointer"
                      onClick={() => handleCategoryClick(category)}
                  >
                    <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-64 object-cover transform group-hover:scale-110 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <h3 className="text-white text-2xl font-semibold">{category.name}</h3>
                    </div>
                  </div>
              ))}
            </div>
            <button
                onClick={nextCategory}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg z-10 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiChevronRight className="h-6 w-6" />
            </button>
          </div>
        </section>

        {/* Featured Products */}
        <section className="container mx-auto px-4 py-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
          <h2 className="text-3xl font-bold dark:text-white text-center mb-12">Featured Products</h2>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : (
            <div className="grid grid-cols-1 dark:text-white md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map(product => (
                <div key={product.id} className="w-full h-full flex">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
  );
};

export default HomePage;