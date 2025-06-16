import React, { useState } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { FaTrash, FaArrowLeft, FaShoppingCart } from 'react-icons/fa';

const Wishlist = () => {
    const { wishlist, loading, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const [addingToCart, setAddingToCart] = useState({});
    const [removingItems, setRemovingItems] = useState({});

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
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
    
    console.log('Wishlist items:', wishlistItems);

    if (!wishlist || wishlistItems.length === 0) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Danh sách yêu thích của bạn đang trống</h2>
                <Link
                    to="/store"
                    className="inline-flex items-center text-red-500 hover:text-red-600"
                >
                    <FaArrowLeft className="mr-2" />
                    Tiếp tục mua sắm
                </Link>
            </div>
        );
    }

    const handleAddToCart = async (productId) => {
        try {
            setAddingToCart(prev => ({ ...prev, [productId]: true }));
            await addToCart(productId, 1);
            alert("Sản phẩm đã được thêm vào giỏ hàng");
        } catch (error) {
            console.error('Error adding item to cart:', error);
            alert("Có lỗi xảy ra khi thêm vào giỏ hàng");
        } finally {
            setAddingToCart(prev => ({ ...prev, [productId]: false }));
        }
    };

    const handleRemoveFromWishlist = async (productId) => {
        try {
            setRemovingItems(prev => ({ ...prev, [productId]: true }));
            await removeFromWishlist(productId);
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            alert("Có lỗi xảy ra khi xóa khỏi danh sách yêu thích");
        } finally {
            setRemovingItems(prev => ({ ...prev, [productId]: false }));
        }
    };



    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Danh sách yêu thích</h1>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="divide-y divide-gray-200">
                    {wishlistItems.map((item) => {
                        // Extract product data based on the WishlistItemDTO structure
                        const itemId = item.id;
                        const productId = item.productId;
                        const productName = item.productName;
                        const productPrice = item.productPrice;
                        const productImage = item.productImage || '/placeholder.jpg';
                        
                        console.log('Rendering wishlist item:', { item, itemId, productId, productName });
                        
                        return (
                            <div key={itemId} className="p-6 flex items-center">
                                <img
                                    src={productImage}
                                    alt={productName}
                                    className="w-24 h-24 object-cover rounded-md"
                                />
                                <div className="ml-6 flex-1">
                                    <h3 className="text-lg font-semibold text-gray-800">{productName}</h3>
                                    <p className="text-gray-600">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(productPrice)}
                                    </p>
                                </div>
                                <div className="ml-6 flex items-center space-x-4">
                                    <button
                                        onClick={() => handleAddToCart(productId)}
                                        className="flex items-center text-red-500 hover:text-red-600 disabled:opacity-50"
                                        disabled={addingToCart[productId]}
                                    >
                                        <FaShoppingCart className="mr-2" />
                                        {addingToCart[productId] ? 'Đang thêm...' : 'Thêm vào giỏ'}
                                    </button>
                                    <button
                                        onClick={() => handleRemoveFromWishlist(productId)}
                                        className="text-red-500 hover:text-red-600 disabled:opacity-50"
                                        disabled={removingItems[productId]}
                                    >
                                        {removingItems[productId] ? 'Đang xóa...' : <FaTrash />}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;