import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { FaTrash, FaArrowLeft } from 'react-icons/fa';

const Cart = () => {
    const { cart, loading, updateCartItem, removeFromCart } = useCart();
    const [updatingItems, setUpdatingItems] = useState({});
    const [removingItems, setRemovingItems] = useState({});

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
        );
    }

    // Determine if cart is empty based on different possible structures
    const isCartEmpty = !cart || 
                       (cart.items && cart.items.length === 0) || 
                       (Array.isArray(cart) && cart.length === 0) ||
                       cart.totalItems === 0;
    
    console.log('Cart data:', cart);
    
    if (isCartEmpty) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Giỏ hàng của bạn đang trống</h2>
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
    
    // Get cart items based on the structure (backend returns items array)
    const cartItems = cart.items || (Array.isArray(cart) ? cart : []);
    console.log('Cart items:', cartItems);

    // Calculate total from cart items or use the total from backend
    const total = cart.totalPrice || cartItems.reduce(
        (sum, item) => {
            const price = item.productPrice || (item.product ? item.product.price : item.price);
            return sum + (price * item.quantity);
        }, 
        0
    );

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
        } catch (error) {
            console.error("Error updating quantity:", error);
            alert("Có lỗi xảy ra khi cập nhật số lượng");
        } finally {
            setUpdatingItems(prev => ({ ...prev, [itemId]: false }));
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            setRemovingItems(prev => ({ ...prev, [productId]: true }));
            await removeFromCart(productId);
        } catch (error) {
            console.error("Error removing item:", error);
            alert("Có lỗi xảy ra khi xóa sản phẩm");
        } finally {
            setRemovingItems(prev => ({ ...prev, [productId]: false }));
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Giỏ hàng</h1>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="divide-y divide-gray-200">
                    {cartItems.map((item) => {
                        // Extract product data based on the CartItemDTO structure
                        const itemId = item.id;
                        const productId = item.productId;
                        const productName = item.productName;
                        const productPrice = item.productPrice;
                        const productImage = item.productImage || '/placeholder.jpg';
                        const subtotal = item.subtotal;
                        
                        console.log('Rendering cart item:', { item, itemId, productId, productName });
                        
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
                                    <div className="mt-2 flex items-center">
                                        <button
                                            onClick={() => handleUpdateQuantity(itemId, item.quantity - 1, productId, productName)}
                                            className={`px-2 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50 ${
                                                item.quantity === 1 ? 'border-red-300 text-red-600 hover:bg-red-50' : ''
                                            }`}
                                            disabled={updatingItems[itemId]}
                                            title={item.quantity === 1 ? 'Nhấn để xóa sản phẩm khỏi giỏ hàng' : 'Giảm số lượng'}
                                        >
                                            -
                                        </button>
                                        <span className="mx-4">{item.quantity}</span>
                                        <button
                                            onClick={() => handleUpdateQuantity(itemId, item.quantity + 1, productId, productName)}
                                            className="px-2 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50"
                                            disabled={updatingItems[itemId]}
                                        >
                                            +
                                        </button>
                                        {updatingItems[itemId] && (
                                            <span className="ml-2 text-xs text-gray-500">Đang cập nhật...</span>
                                        )}
                                    </div>
                                </div>
                                <div className="ml-6">
                                    <p className="text-lg font-semibold text-gray-800">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(subtotal || (productPrice * item.quantity))}
                                    </p>
                                    <button
                                        onClick={() => handleRemoveItem(productId)}
                                        className="mt-2 text-red-500 hover:text-red-600 disabled:opacity-50"
                                        disabled={removingItems[productId]}
                                    >
                                        {removingItems[productId] ? 'Đang xóa...' : <FaTrash />}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="p-6 bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold text-gray-800">Tổng cộng:</span>
                        <span className="text-2xl font-bold text-gray-800">
                            {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                            }).format(total)}
                        </span>
                    </div>
                    <Link to="/payment">
                        <button className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition-colors">
                            Tiến hành thanh toán
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Cart;