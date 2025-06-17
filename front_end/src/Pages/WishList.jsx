import React, { useState } from "react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { FaTrash, FaArrowLeft, FaShoppingCart, FaHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import { ProductImage } from "../utils/placeholderImage.jsx";

const Wishlist = () => {
  const { wishlist, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [addingToCart, setAddingToCart] = useState({});
  const [removingItems, setRemovingItems] = useState({});

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Determine the structure of the wishlist data
  let wishlistItems = [];

  if (Array.isArray(wishlist)) {
    wishlistItems = wishlist;
  } else if (wishlist && wishlist.items && Array.isArray(wishlist.items)) {
    wishlistItems = wishlist.items;
  }

  if (!wishlist || wishlistItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400">
              <FaHeart className="w-10 h-10" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Danh sách yêu thích của bạn đang trống
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Hãy thêm sản phẩm vào danh sách yêu thích để xem sau
          </p>
          <Link
            to="/store"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] shadow-md"
          >
            <FaArrowLeft className="mr-2" />
            Khám phá sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = async (productId, productName) => {
    try {
      setAddingToCart((prev) => ({ ...prev, [productId]: true }));
      await addToCart(productId, 1);
      toast.success(`Đã thêm "${productName}" vào giỏ hàng`);
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng");
    } finally {
      setAddingToCart((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleRemoveFromWishlist = async (productId, productName) => {
    try {
      setRemovingItems((prev) => ({ ...prev, [productId]: true }));
      await removeFromWishlist(productId);
      toast.success(`Đã xóa "${productName}" khỏi danh sách yêu thích`);
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Có lỗi xảy ra khi xóa khỏi danh sách yêu thích");
    } finally {
      setRemovingItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-indigo-400 mb-8">
        Danh sách yêu thích
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors duration-200">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {wishlistItems.map((item) => {
            // Extract product data based on the WishlistItemDTO structure
            const itemId = item.id;
            const productId = item.productId;
            const productName = item.productName;
            const productPrice = item.productPrice;

            return (
              <div
                key={itemId}
                className="p-6 flex flex-col sm:flex-row items-center gap-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
              >
                <Link to={`/product/${productId}`} className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <ProductImage
                      src={item.productImage}
                      alt={productName}
                      className="w-full h-full object-cover"
                      size="medium"
                    />
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <Link to={`/product/${productId}`}>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">
                      {productName}
                    </h3>
                  </Link>
                  <p className="font-bold text-lg mt-1">
                    <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text dark:from-purple-400 dark:to-indigo-400">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(productPrice)}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleAddToCart(productId, productName)}
                    className="flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white transition-all duration-300 transform hover:scale-[1.02] shadow-sm disabled:opacity-70"
                    disabled={addingToCart[productId]}
                  >
                    <FaShoppingCart className="mr-2" />
                    {addingToCart[productId] ? "Đang thêm..." : "Thêm vào giỏ"}
                  </button>

                  <button
                    onClick={() =>
                      handleRemoveFromWishlist(productId, productName)
                    }
                    className="p-2 rounded-full bg-white dark:bg-gray-700 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border border-gray-200 dark:border-gray-600 shadow-sm transition-colors duration-200 disabled:opacity-50"
                    disabled={removingItems[productId]}
                    title="Xóa khỏi danh sách yêu thích"
                  >
                    {removingItems[productId] ? "..." : <FaTrash />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-10 text-center">
        <Link
          to="/store"
          className="inline-flex items-center px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  );
};

export default Wishlist;
