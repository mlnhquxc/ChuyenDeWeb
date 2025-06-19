import React, { useState } from "react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { FaTrash, FaArrowLeft, FaShoppingCart, FaHeart, FaGift, FaStar } from "react-icons/fa";
import { HiHeart, HiShoppingBag } from "react-icons/hi";
import { MdFavorite } from "react-icons/md";
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
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-rose-200 border-t-4 border-t-rose-500 mb-4"></div>
          <p className="text-rose-500 dark:text-rose-400 font-medium">Đang tải danh sách yêu thích...</p>
        </div>
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
        <div className="text-center max-w-md mx-auto">
          <div className="mb-8 flex justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-rose-200 to-pink-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-rose-700 dark:text-rose-300 shadow-xl animate-pulse">
              <MdFavorite className="w-16 h-16" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Chưa có sản phẩm yêu thích
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
            Hãy thêm những sản phẩm bạn yêu thích vào danh sách để dễ dàng tìm lại sau này!
          </p>
          <Link
            to="/store"
            className="inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-lg hover:from-rose-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-[1.05] shadow-lg hover:shadow-rose-200 dark:hover:shadow-rose-800"
          >
            <FaGift className="mr-3" />
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
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent dark:from-rose-400 dark:to-pink-400 mb-2 flex items-center justify-center gap-3">
          <HiHeart className="text-rose-500 dark:text-rose-400" />
          Danh sách yêu thích
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-rose-500 to-pink-500 mx-auto rounded-full"></div>
        <p className="text-gray-600 dark:text-gray-300 mt-3">Những sản phẩm bạn yêu thích nhất</p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300">
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
                className="p-6 flex flex-col sm:flex-row items-center gap-6 hover:bg-gradient-to-r hover:from-rose-100 hover:to-pink-100 dark:hover:from-gray-800 dark:hover:to-gray-700 transition-all duration-300 group"
              >
                <Link to={`/product/${productId}`} className="flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <div className="w-28 h-28 bg-gradient-to-br from-rose-200 to-pink-200 dark:from-gray-700 dark:to-gray-600 rounded-xl overflow-hidden shadow-md">
                    <ProductImage
                      src={item.productImage}
                      alt={productName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      size="medium"
                    />
                  </div>
                </Link>

                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <Link to={`/product/${productId}`}>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white hover:text-rose-500 dark:hover:text-rose-400 transition-colors duration-200 mb-2 group-hover:scale-105 transition-transform duration-300">
                      {productName}
                    </h3>
                  </Link>
                  <div className="bg-gradient-to-r from-rose-200 to-pink-200 dark:from-gray-700 dark:to-gray-600 rounded-lg p-3 inline-block border border-rose-300 dark:border-gray-600">
                    <p className="font-bold text-xl">
                      <span className="text-rose-700 dark:text-rose-300">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(productPrice)}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => handleAddToCart(productId, productName)}
                    className="flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold transition-all duration-300 transform hover:scale-[1.05] shadow-lg hover:shadow-emerald-200 dark:hover:shadow-emerald-800 disabled:opacity-70"
                    disabled={addingToCart[productId]}
                  >
                    <HiShoppingBag className="mr-2" />
                    {addingToCart[productId] ? "Đang thêm..." : "Thêm vào giỏ"}
                  </button>

                  <button
                    onClick={() =>
                      handleRemoveFromWishlist(productId, productName)
                    }
                    className="p-3 rounded-xl bg-gradient-to-r from-rose-200 to-pink-200 dark:from-gray-700 dark:to-gray-600 text-rose-700 dark:text-rose-300 hover:from-rose-300 hover:to-pink-300 dark:hover:from-gray-600 dark:hover:to-gray-500 border-2 border-rose-300 dark:border-gray-600 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-50"
                    disabled={removingItems[productId]}
                    title="Xóa khỏi danh sách yêu thích"
                  >
                    {removingItems[productId] ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-rose-500"></div>
                    ) : (
                      <HiHeart className="text-lg" />
                    )}
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
          className="inline-flex items-center px-8 py-4 rounded-xl border-2 border-rose-200 dark:border-rose-700 text-rose-700 dark:text-rose-300 font-bold text-lg hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 dark:hover:from-rose-900/20 dark:hover:to-pink-900/20 transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg"
        >
          <FaStar className="mr-3" />
          Khám phá thêm sản phẩm
        </Link>
      </div>
    </div>
  );
};

export default Wishlist;
