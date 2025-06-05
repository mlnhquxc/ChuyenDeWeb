import React, { useState, useEffect } from "react";
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiHeart, FiMail } from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../components/ProductCard";
import { productService } from "../services/productService";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    category: "",
    sortBy: "id"
  });

  const filterOptions = {
    categories: ["Áo", "Quần", "Đầm", "Phụ kiện"],
    sortOptions: [
      { value: "id", label: "Mới nhất" },
      { value: "price", label: "Giá thấp đến cao" },
      { value: "price,desc", label: "Giá cao đến thấp" }
    ]
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts(
        currentPage,
        8,
        filters.sortBy
      );
      setProducts(response.content);
      setTotalPages(response.totalPages);
      setError(null);
    } catch (err) {
      setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.");
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [currentPage, filters]);

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
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className="w-64 bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Bộ lọc sản phẩm</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Danh mục</h4>
                <select 
                  className="w-full p-2 border rounded"
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                  value={filters.category}
                >
                  <option value="">Tất cả</option>
                  {filterOptions.categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Sắp xếp theo</h4>
                <select 
                  className="w-full p-2 border rounded"
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
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-8">Sản phẩm</h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center py-8">{error}</div>
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
                    {products.map(product => (
                      <div key={product.id} className="w-full h-full flex">
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Pagination */}
                <div className="flex justify-center mt-8 space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                  >
                    Trước
                  </button>
                  <span className="px-4 py-2">
                    Trang {currentPage + 1} / {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                  >
                    Sau
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;