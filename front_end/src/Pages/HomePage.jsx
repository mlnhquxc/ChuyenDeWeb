import React, { useState, useEffect } from "react";
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiHeart, FiMail ,FiChevronLeft, FiChevronRight} from "react-icons/fi";
import ProductCard from "../component/ProductCard";


const HomePage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  console.log(currentCategoryIndex);

  const categories = [
    { name: "Fresh Fruits", image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf" },
    { name: "Vegetables", image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c" },
    { name: "Meat & Fish", image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f" },
    { name: "Bakery", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff" },
    { name: "Dairy", image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da" },
    { name: "Beverages", image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625" },
    { name: "Snacks", image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087" },
    { name: "Organic", image: "https://images.unsplash.com/photo-1542838132-92c53300491e" }
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
      name: "Organic Bananas",
      price: 4.99,
      image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e",
      discount: 10
    },
    {
      name: "Fresh Strawberries",
      price: 5.99,
      image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6",
      discount: 15
    },
    {
      name: "Organic Tomatoes",
      price: 3.99,
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea",
      discount: 20
    },
    {
      name: "Fresh Bread",
      price: 2.99,
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff",
      discount: 5
    },
    {
      name: "Organic Bananas",
      price: 4.99,
      image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e",
      discount: 10
    },
    {
      name: "Fresh Strawberries",
      price: 5.99,
      image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6",
      discount: 15
    },
    {
      name: "Organic Tomatoes",
      price: 3.99,
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea",
      discount: 20
    },
    {
      name: "Fresh Bread",
      price: 2.99,
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff",
      discount: 5
    },
    {
      name: "Organic Bananas",
      price: 4.99,
      image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e",
      discount: 10
    },
    {
      name: "Fresh Strawberries",
      price: 5.99,
      image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6",
      discount: 15
    },
    {
      name: "Organic Tomatoes",
      price: 3.99,
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea",
      discount: 20
    },
    {
      name: "Fresh Bread",
      price: 2.99,
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff",
      discount: 5
    },
    {
      name: "Organic Bananas",
      price: 4.99,
      image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e",
      discount: 10
    },
    {
      name: "Fresh Strawberries",
      price: 5.99,
      image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6",
      discount: 15
    },
    {
      name: "Organic Tomatoes",
      price: 3.99,
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea",
      discount: 20
    },
    {
      name: "Fresh Bread",
      price: 2.99,
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff",
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
            <a href="#" className="text-lg">Shop</a>
            <a href="#" className="text-lg">Categories</a>
            <a href="#" className="text-lg">Contact</a>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8"
          alt="Hero Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
              Fresh & Organic
            </h1>
            <p className="text-xl mb-8 animate-fade-in-delay">
              Quality products delivered to your doorstep
            </p>
            <button className="bg-red-500 text-white px-8 py-3 rounded-full hover:bg-red-600 transition duration-300">
              Shop Now
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
      <section className="container mx-auto px-4 py-16 bg-gray-50 dark:bg-gray-800">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <ProductCard key={index} product={product}/>
          ))}
        </div>
      </section>
      
    </div>
  );
};

export default HomePage;