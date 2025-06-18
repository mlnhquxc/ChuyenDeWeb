import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { ProductImage } from '../utils/placeholderImage.jsx';

const Cart = () => {
    const { cart, loading, updateCartItem, removeFromCart } = useCart();
    const [updatingItems, setUpdatingItems] = useState({});
    const [removingItems, setRemovingItems] = useState({});
    const [selectedItems, setSelectedItems] = useState({});
    const [selectAll, setSelectAll] = useState(false);
    const navigate = useNavigate();

    // Determine if cart is empty based on different possible structures
    const isCartEmpty = !cart || 
                       (cart.items && cart.items.length === 0) || 
                       (Array.isArray(cart) && cart.length === 0) ||
                       cart.totalItems === 0;
    
    // Get cart items based on the structure (backend returns items array)
    const cartItems = cart?.items || (Array.isArray(cart) ? cart : []);

    // Initialize selected items when cart items change - MOVED BEFORE EARLY RETURNS
    React.useEffect(() => {
        if (cartItems.length > 0) {
            const initialSelection = {};
            cartItems.forEach(item => {
                initialSelection[item.id] = selectedItems[item.id] || false;
            });
            setSelectedItems(initialSelection);
        }
    }, [cartItems.length]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }
    
    if (isCartEmpty) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12">
                <div className="text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            <FaShoppingCart className="w-10 h-10" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Giỏ hàng của bạn đang trống</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-8">Hãy thêm sản phẩm vào giỏ hàng để tiến hành mua sắm</p>
                    <Link
                        to="/store"
                        className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] shadow-md"
                    >
                        <FaArrowLeft className="mr-2" />
                        Tiếp tục mua sắm
                    </Link>
                </div>
            </div>
        );
    }

    // Calculate total from selected items only
    const calculateSelectedTotal = () => {
        return cartItems.reduce((sum, item) => {
            if (selectedItems[item.id]) {
                const price = item.productPrice || (item.product ? item.product.price : item.price);
                return sum + (price * item.quantity);
            }
            return sum;
        }, 0);
    };

    const selectedTotal = calculateSelectedTotal();
    const selectedCount = Object.values(selectedItems).filter(Boolean).length;

    const handleUpdateQuantity = async (itemId, newQuantity, productId, productName) => {
        if (newQuantity < 1) {
            // Ask user if they want to remove the item when quantity would be 0
            const confirmDelete = window.confirm(
                `Bạn đang giảm số lượng "${productName}" xuống 0.\n\nBạn có muốn xóa sản phẩm này khỏi giỏ hàng không?`
            );
            if (confirmDelete) {
                await handleRemoveItem(productId);
            }
            return;
        }
        
        try {
            setUpdatingItems(prev => ({ ...prev, [itemId]: true }));
            await updateCartItem(itemId, newQuantity);
            // No toast notification - visual feedback is enough
        } catch (error) {
            console.error("Error updating quantity:", error);
            // Only show toast for errors, not success
            alert("Có lỗi xảy ra khi cập nhật số lượng. Vui lòng thử lại.");
        } finally {
            setUpdatingItems(prev => ({ ...prev, [itemId]: false }));
        }
    };

    const handleRemoveItem = async (productId) => {
        const item = cartItems.find(item => item.productId === productId);
        const productName = item?.productName || "sản phẩm";
        
        try {
            setRemovingItems(prev => ({ ...prev, [productId]: true }));
            await removeFromCart(productId);
            // No toast notification - item disappearing is clear feedback
        } catch (error) {
            console.error("Error removing item:", error);
            alert("Có lỗi xảy ra khi xóa sản phẩm. Vui lòng thử lại.");
        } finally {
            setRemovingItems(prev => ({ ...prev, [productId]: false }));
        }
    };

    const handleSelectItem = (itemId) => {
        setSelectedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        const newSelectedItems = {};
        cartItems.forEach(item => {
            newSelectedItems[item.id] = newSelectAll;
        });
        setSelectedItems(newSelectedItems);
    };

    const handleCheckoutSelected = () => {
        const selectedCartItems = cartItems.filter(item => selectedItems[item.id]);
        if (selectedCartItems.length === 0) {
            alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
            return;
        }
        
        // Navigate to payment with selected items
        navigate('/payment', {
            state: {
                selectedItems: selectedCartItems,
                isFromCart: true
            }
        });
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-indigo-400 mb-8">
                Giỏ hàng của bạn
            </h1>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors duration-200">
                {/* Select All Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAll}
                            className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Chọn tất cả ({cartItems.length} sản phẩm)
                        </span>
                    </label>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {cartItems.map((item) => {
                        // Extract product data based on the CartItemDTO structure
                        const itemId = item.id;
                        const productId = item.productId;
                        const productName = item.productName;
                        const productPrice = item.productPrice;
                        const productImage = item.productImage || '/placeholder.jpg';
                        const subtotal = item.subtotal;
                        
                        return (
                            <div 
                                key={itemId} 
                                className={`p-6 flex flex-col sm:flex-row items-center gap-6 transition-all duration-300 ${
                                    updatingItems[itemId] || removingItems[productId] 
                                        ? 'bg-gray-50 dark:bg-gray-700/50' 
                                        : 'hover:bg-gray-50/50 dark:hover:bg-gray-700/30'
                                }`}
                            >
                                {/* Checkbox */}
                                <div className="flex-shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems[itemId] || false}
                                        onChange={() => handleSelectItem(itemId)}
                                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                </div>
                                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                                <ProductImage
                                    src={item.productImage}
                                        alt={productName}
                                        size="medium"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/placeholder-image.jpg';
                                        }}
                                    />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">{productName}</h3>
                                    <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(productPrice)}
                                    </p>
                                    
                                    <div className="mt-3 flex items-center">
                                        <div className={`flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden transition-all duration-200 ${
                                            updatingItems[itemId] ? 'opacity-75 scale-95' : 'opacity-100 scale-100'
                                        }`}>
                                            <button
                                                onClick={() => handleUpdateQuantity(itemId, item.quantity - 1, productId, productName)}
                                                className={`w-8 h-8 flex items-center justify-center ${
                                                    item.quantity === 1 
                                                    ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' 
                                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                } disabled:opacity-50 transition-all duration-200 hover:scale-110 active:scale-95`}
                                                disabled={updatingItems[itemId]}
                                                title={item.quantity === 1 ? 'Nhấn để xóa sản phẩm khỏi giỏ hàng' : 'Giảm số lượng'}
                                            >
                                                -
                                            </button>
                                            <span className={`w-10 text-center text-gray-800 dark:text-gray-200 transition-all duration-200 ${
                                                updatingItems[itemId] ? 'animate-pulse' : ''
                                            }`}>
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleUpdateQuantity(itemId, item.quantity + 1, productId, productName)}
                                                className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition-all duration-200 hover:scale-110 active:scale-95"
                                                disabled={updatingItems[itemId]}
                                            >
                                                +
                                            </button>
                                        </div>
                                        
                                        {updatingItems[itemId] && (
                                            <div className="ml-3 flex items-center">
                                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-indigo-500 mr-2"></div>
                                                <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">Đang cập nhật...</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex flex-col items-end">
                                    <p className={`text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-indigo-400 transition-all duration-300 ${
                                        updatingItems[itemId] ? 'animate-pulse scale-105' : 'hover:scale-105'
                                    }`}>
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(subtotal || (productPrice * item.quantity))}
                                    </p>
                                    
                                    <button
                                        onClick={() => handleRemoveItem(productId)}
                                        className="mt-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 disabled:opacity-50 transition-all duration-200 p-2 hover:scale-110 active:scale-95 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                        disabled={removingItems[productId]}
                                        title="Xóa sản phẩm khỏi giỏ hàng"
                                    >
                                        {removingItems[productId] ? (
                                            <div className="flex items-center">
                                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-500 mr-1"></div>
                                                <span className="text-xs">Đang xóa...</span>
                                            </div>
                                        ) : (
                                            <FaTrash />
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                <div className="p-6 bg-gray-50 dark:bg-gray-900/50">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div className="text-gray-600 dark:text-gray-300">
                            <p>Tổng số sản phẩm: <span className="font-medium">{cartItems.length}</span></p>
                            <p>Sản phẩm đã chọn: <span className="font-medium text-purple-600 dark:text-purple-400">{selectedCount}</span></p>
                            <p>Tổng số lượng đã chọn: <span className="font-medium">
                                {cartItems.reduce((sum, item) => {
                                    return selectedItems[item.id] ? sum + item.quantity : sum;
                                }, 0)}
                            </span></p>
                        </div>
                        
                        <div className="text-right">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Tổng thanh toán (đã chọn):</p>
                            <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-indigo-400 transition-all duration-300 hover:scale-105">
                                {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                }).format(selectedTotal)}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/store" className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <FaArrowLeft className="mr-2" />
                            Tiếp tục mua sắm
                        </Link>
                        
                        <button 
                            onClick={handleCheckoutSelected}
                            disabled={selectedCount === 0}
                            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-md ${
                                selectedCount > 0 
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white' 
                                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            Thanh toán ({selectedCount} sản phẩm)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;