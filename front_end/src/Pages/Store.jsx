import React, { useState, useEffect } from "react";
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiHeart, FiMail } from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../components/ProductCard";
import { productService } from "../services/productService";
import { useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const Shop = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState(location.state?.searchQuery || "");
  const [filters, setFilters] = useState({
    category: location.state?.category || "",
    sortBy: "id"
  });

  const filterOptions = {
    categories: [
      { value: "Laptops", label: t('store.categories.laptops') },
      { value: "Smartphones", label: t('store.categories.smartphones') },
      { value: "TVs", label: t('store.categories.tvs') },
      { value: "Accessories", label: t('store.categories.accessories') }
    ],
    sortOptions: [
      { value: "id,asc", label: t('store.sort.newest') },
      { value: "id,desc", label: t('store.sort.oldest') },
      { value: "name,asc", label: t('store.sort.nameAZ') },
      { value: "name,desc", label: t('store.sort.nameZA') },
      { value: "price,asc", label: t('store.sort.priceLowHigh') },
      { value: "price,desc", label: t('store.sort.priceHighLow') }
    ]
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      console.log("Loading products with filters:", filters, "search:", searchKeyword);
      
      let response;
      
      // Nếu có từ khóa tìm kiếm, sử dụng API tìm kiếm
      if (searchKeyword && searchKeyword.trim() !== "") {
        console.log("Searching for products with keyword:", searchKeyword);
        response = await productService.searchProducts(
          searchKeyword,
          currentPage,
          8,
          filters.sortBy
        );
      } else {
        // Nếu không có từ khóa, lấy sản phẩm theo category (nếu có)
        response = await productService.getAllProducts2(
          currentPage,
          8,
          filters.sortBy,
          filters.category
        );
      }
      
      console.log("Products loaded:", response);
      setProducts(response.content);
      setTotalPages(response.totalPages);
      setError(null);
    } catch (err) {
      setError(t('store.error.loadProducts'));
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [currentPage, filters, searchKeyword]);
  
  // Khi nhận được category hoặc searchQuery từ trang khác
  useEffect(() => {
    if (location.state) {
      console.log("Received state:", location.state);
      
      // Xử lý category
      if (location.state.category) {
        console.log("Category from navigation:", location.state.category);
        setFilters(prev => ({
          ...prev,
          category: location.state.category
        }));
      }
      
      // Xử lý searchQuery
      if (location.state.searchQuery) {
        console.log("Search query from navigation:", location.state.searchQuery);
        setSearchKeyword(location.state.searchQuery);
      }
    }
  }, [location.state]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(0); // Reset về trang đầu tiên khi thay đổi bộ lọc
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-indigo-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="w-full md:w-64 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl mb-6 md:mb-0 border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text dark:from-purple-400 dark:to-indigo-400">{t('store.filter.title')}</h3>

              <div className="space-y-6">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">{t('store.filter.category')}</h4>
                  <select
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      onChange={(e) => handleFilterChange("category", e.target.value)}
                      value={filters.category}
                  >
                    <option value="">{t('store.filter.allCategories')}</option>
                    {filterOptions.categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">{t('store.filter.sortBy')}</h4>
                  <select
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                      value={filters.sortBy}
                  >
                    {filterOptions.sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                    ))}
                  </select>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button 
                    onClick={() => {
                      setFilters({category: "", sortBy: "id"});
                      setSearchKeyword("");
                    }}
                    className="w-full py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    {t('store.filter.clearFilters')}
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text dark:from-purple-400 dark:to-indigo-400">
                  {t('store.title')}
                  <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-indigo-500 mt-2 rounded-full"></div>
                </h2>
                
                {/* Thanh tìm kiếm */}
                <div className="relative w-full max-w-md">
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder={t('store.search.placeholder')}
                    className="w-full px-5 py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-md transition-all duration-200"
                    onKeyPress={(e) => e.key === 'Enter' && loadProducts()}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex">
                    {searchKeyword && (
                      <button
                        onClick={() => {
                          setSearchKeyword("");
                          setTimeout(() => loadProducts(), 0);
                        }}
                        className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 mr-1 transition-colors duration-200"
                        title={t('store.search.clear')}
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={loadProducts}
                      className="p-2 rounded-full text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200"
                      title={t('store.search.search')}
                    >
                      <FiSearch className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Hiển thị thông tin tìm kiếm nếu có */}
              {searchKeyword && (
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg shadow-inner border border-purple-100 dark:border-purple-900/30">
                  <p className="text-purple-700 dark:text-purple-300 flex items-center">
                    <FiSearch className="mr-2" />
                    {t('store.search.results')} <span className="font-semibold ml-2">"{searchKeyword}"</span>
                    {products.length === 0 && !loading ? <span className="ml-2 text-red-500 dark:text-red-400"> - {t('store.search.noResults')}</span> : ""}
                  </p>
                </div>
              )}
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-4 border-t-purple-600 dark:border-gray-700 dark:border-t-purple-400"></div>
                </div>
              ) : error ? (
                <div className="text-red-500 text-center py-8 bg-red-50 dark:bg-red-900/20 rounded-lg shadow-inner p-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              ) : (
                <>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentPage}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                      {products.length > 0 ? (
                        products.map((product, index) => (
                          <motion.div 
                            key={product.id} 
                            className="w-full h-full flex transform transition-all duration-300 hover:-translate-y-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <ProductCard product={product} />
                          </motion.div>
                        ))
                      ) : (
                        <div className="col-span-4 text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <p className="text-xl text-gray-600 dark:text-gray-300">{t('store.empty.title')}</p>
                          <p className="text-gray-500 dark:text-gray-400 mt-2">{t('store.empty.description')}</p>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Pagination */}
                  {products.length > 0 && totalPages > 1 && (
                    <div className="flex justify-center mt-12 space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className="px-5 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 shadow-sm"
                      >
                        {t('store.pagination.previous')}
                      </button>
                      <span className="px-5 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-lg font-medium">
                        {t('store.pagination.page', { current: currentPage + 1, total: totalPages })}
                      </span>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                        className="px-5 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 shadow-sm"
                      >
                        {t('store.pagination.next')}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default Shop;