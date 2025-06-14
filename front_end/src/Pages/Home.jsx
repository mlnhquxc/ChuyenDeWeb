import React, { useState, useEffect } from "react";
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiHeart, FiMail ,FiChevronLeft, FiChevronRight} from "react-icons/fi";
import ProductCard from "../components/ProductCard";

// Import images
import macbook1 from "../assets/images/laptop/macbook/macbook_1.png";
import macbook2 from "../assets/images/laptop/macbook/macbook_2.png";
import iphone1 from "../assets/images/phone/16promax/iphone-16-pro-max-2.png";
import iphone2 from "../assets/images/phone/16promax/iphone-16-pro-max-3.png";
import tv1 from "../assets/images/tivi/ss_44/ss_43_1.png";
import tv2 from "../assets/images/tivi/ss_44/ss_43_2.png";
import tainghe1 from "../assets/images/phukien/tainghe/tainghe_1.png";
import tainghe2 from "../assets/images/phukien/tainghe/tainghe_2.png";
import ImageSlider from '../components/ImageSlider';

const HomePage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  const categories = [
    { name: "Laptops", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853" },
    { name: "Smartphones", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9" },
    { name: "TVs & Displays", image: "https://images.unsplash.com/photo-1593784991095-a205069470b6" },
    { name: "Accessories", image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07" },
    { name: "Audio", image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b" },
    { name: "Gaming", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e" },
    { name: "Smart Home", image: "https://images.unsplash.com/photo-1558002038-1055907df827" },
    { name: "Wearables", image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a" }
  ];

  const nextCategory = () => {// đây là load thêm
    if(currentCategoryIndex < categories.length -4){
      setCurrentCategoryIndex(prev => prev + 1);
    }
  console.log("currentCategoryIndex : right");
  };
  
  const prevCategory = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(prev => prev - 1);
    }
    console.log("currentCategoryIndex : left");
  };

  const products = [
    {
      name: "MacBook Pro M2",
      price: 1299.99,
      image: macbook1,
      discount: 10
    },
    {
      name: "iPhone 16 Pro Max",
      price: 999.99,
      image: iphone1,
      discount: 15
    },
    {
      name: "Samsung 4K TV",
      price: 799.99,
      image: tv1,
      discount: 20
    },
    {
      name: "AirPods Pro",
      price: 249.99,
      image: tainghe1,
      discount: 5
    },
    {
      name: "MacBook Pro M2",
      price: 1199.99,
      image: macbook2,
      discount: 10
    },
    {
      name: "iPhone 16 Pro Max",
      price: 899.99,
      image: iphone2,
      discount: 15
    },
    {
      name: "Samsung 4K TV",
      price: 1499.99,
      image: tv2,
      discount: 20
    },
    {
      name: "AirPods Pro",
      price: 399.99,
      image: tainghe2,
      discount: 5
    }
  ];

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
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-64 object-cover transform group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-opacity-40 flex items-center justify-center">
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
        <div className="grid grid-cols-1 dark:text-white md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <ProductCard key={index} product={product}/>
          ))}
        </div>
      </section>
      
    </div>
  );
};

export default HomePage;