import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaArrowLeft, FaShoppingCart, FaPlus, FaMinus, FaCreditCard, FaBoxOpen } from 'react-icons/fa';
import { HiShoppingBag } from 'react-icons/hi';
import { ProductImage } from '../utils/placeholderImage.jsx';
import { useTranslation } from 'react-i18next';

const Cart = () => {
    const { cart, loading, updateCartItem, removeFromCart } = useCart();
    const [updatingItems, setUpdatingItems] = useState({});
    const [removingItems, setRemovingItems] = useState({});
    const [selectedItems, setSelectedItems] = useState({});
    const [selectAll, setSelectAll] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();

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
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-4 border-t-emerald-500 mb-4"></div>
                    <p className="text-emerald-500 dark:text-emerald-400 font-medium">{t('cart.loading')}</p>
                </div>
            </div>
        );
    }
    
    if (isCartEmpty) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12">
                <div className="text-center max-w-md mx-auto">
                    <div className="mb-8 flex justify-center">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-200 to-teal-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shadow-xl">
                            <HiShoppingBag className="w-16 h-16" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">{t('cart.emptyTitle')}</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">{t('cart.emptyDesc')}</p>
                    <Link
                        to="/store"
                        className="inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-[1.05] shadow-lg hover:shadow-emerald-200 dark:hover:shadow-emerald-800"
                    >
                        <FaBoxOpen className="mr-3" />
                        {t('cart.exploreProducts')}
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
        
        // Prepare checkout items with proper format
        const checkoutItems = selectedCartItems.map(item => ({
            id: item.productId,
            name: item.productName,
            price: item.productPrice,
            image: item.productImage,
            quantity: item.quantity,
            subtotal: item.productPrice * item.quantity
        }));
        
        // Navigate to payment with selected items
        navigate('/payment', {
            state: {
                items: checkoutItems,
                fromCart: true
            }
        });
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-400 mb-2">
                    {t('cart.title')}
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full"></div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300">
                {/* Select All Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-gray-800 dark:to-gray-700">
                    <label className="flex items-center cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAll}
                            className="w-5 h-5 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 transition-all duration-200"
                        />
                        <span className="ml-3 text-base font-semibold text-gray-700 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
                            {t('cart.selectAll', { count: cartItems.length })}
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
                                        ? 'bg-gray-100 dark:bg-gray-800' 
                                        : 'hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                                }`}
                            >
                                {/* Checkbox */}
                                <div className="flex-shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems[itemId] || false}
                                        onChange={() => handleSelectItem(itemId)}
                                        className="w-5 h-5 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 transition-all duration-200"
                                    />
                                </div>
                                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
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
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200">{productName}</h3>
                                    <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
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
                                                className={`w-8 h-8 flex items-center justify-center rounded-l-lg ${
                                                    item.quantity === 1 
                                                    ? 'text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20' 
                                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                } disabled:opacity-50 transition-all duration-200 hover:scale-110 active:scale-95`}
                                                disabled={updatingItems[itemId]}
                                                title={item.quantity === 1 ? 'Nhấn để xóa sản phẩm khỏi giỏ hàng' : 'Giảm số lượng'}
                                            >
                                                <FaMinus className="w-3 h-3" />
                                            </button>
                                            <span className={`w-10 text-center text-gray-800 dark:text-gray-200 transition-all duration-200 ${
                                                updatingItems[itemId] ? 'animate-pulse' : ''
                                            }`}>
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleUpdateQuantity(itemId, item.quantity + 1, productId, productName)}
                                                className="w-8 h-8 flex items-center justify-center rounded-r-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 disabled:opacity-50 transition-all duration-200 hover:scale-110 active:scale-95"
                                                disabled={updatingItems[itemId]}
                                            >
                                                <FaPlus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        
                                        {updatingItems[itemId] && (
                                            <div className="ml-3 flex items-center">
                                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-emerald-500 mr-2"></div>
                                                <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Đang cập nhật...</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex flex-col items-end">
                                    <p className={`text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-400 transition-all duration-300 ${
                                        updatingItems[itemId] ? 'animate-pulse scale-105' : 'hover:scale-105'
                                    }`}>
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(subtotal || (productPrice * item.quantity))}
                                    </p>
                                    
                                    <button
                                        onClick={() => handleRemoveItem(productId)}
                                        className="mt-2 text-gray-500 hover:text-rose-500 dark:text-gray-400 dark:hover:text-rose-400 disabled:opacity-50 transition-all duration-200 p-2 hover:scale-110 active:scale-95 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg"
                                        disabled={removingItems[productId]}
                                        title="Xóa sản phẩm khỏi giỏ hàng"
                                    >
                                        {removingItems[productId] ? (
                                            <div className="flex items-center">
                                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-rose-500 mr-1"></div>
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
                
                <div className="p-6 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-gray-800 dark:to-gray-700">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-6">
                        <div className="text-gray-700 dark:text-gray-200 space-y-2">
                            <p className="flex items-center"><span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>Tổng số sản phẩm: <span className="font-semibold ml-1">{cartItems.length}</span></p>
                            <p className="flex items-center"><span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>Sản phẩm đã chọn: <span className="font-semibold text-emerald-600 dark:text-emerald-400 ml-1">{selectedCount}</span></p>
                            <p className="flex items-center"><span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>Tổng số lượng đã chọn: <span className="font-semibold ml-1">
                                {cartItems.reduce((sum, item) => {
                                    return selectedItems[item.id] ? sum + item.quantity : sum;
                                }, 0)}
                            </span></p>
                        </div>
                        
                        <div className="text-right bg-gradient-to-br from-emerald-200 to-teal-200 dark:from-gray-700 dark:to-gray-600 p-4 rounded-xl shadow-md border border-emerald-300 dark:border-gray-600">
                            <p className="text-sm text-emerald-800 dark:text-emerald-300 mb-1 font-medium">Tổng thanh toán (đã chọn):</p>
                            <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-400 transition-all duration-300 hover:scale-105">
                                {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                }).format(selectedTotal)}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/store" className="inline-flex items-center justify-center px-6 py-3 rounded-xl border-2 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300 hover:scale-[1.02]">
                            <FaArrowLeft className="mr-2" />
                            Tiếp tục mua sắm
                        </Link>
                        
                        <button 
                            onClick={handleCheckoutSelected}
                            disabled={selectedCount === 0}
                            className={`flex-1 py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg ${
                                selectedCount > 0 
                                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-200 dark:shadow-emerald-800' 
                                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            <FaCreditCard className="mr-2" />
                            Thanh toán ({selectedCount} sản phẩm)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;