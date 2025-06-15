import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, Empty, message, Button, Card } from 'antd';
import CartItem from './CartItem';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/cart');
      setCartItems(response.data.result.items);
      setTotalPrice(response.data.result.totalPrice);
    } catch (error) {
      message.error('Failed to fetch cart items');
    }
  };

  const handleUpdateQuantity = async (itemId, quantity) => {
    try {
      await axios.put(`http://localhost:8080/api/cart/update/${itemId}`, { quantity });
      message.success('Cart updated');
      fetchCart();
    } catch (error) {
      message.error('Failed to update cart');
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await axios.delete(`http://localhost:8080/api/cart/remove/${itemId}`);
      message.success('Item removed from cart');
      fetchCart();
    } catch (error) {
      message.error('Failed to remove item from cart');
    }
  };

  const handleAddToWishlist = async (item) => {
    try {
      await axios.post('http://localhost:8080/api/wishlist/add', {
        productId: item.productId
      });
      message.success('Item added to wishlist');
    } catch (error) {
      message.error('Failed to add item to wishlist');
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Shopping Cart</Title>
      {cartItems.length === 0 ? (
        <Empty description="Your cart is empty" />
      ) : (
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemove}
                onAddToWishlist={handleAddToWishlist}
              />
            ))}
          </Col>
          <Col xs={24} lg={8}>
            <Card>
              <Title level={4}>Order Summary</Title>
              <div style={{ marginBottom: '16px' }}>
                <p>Total Items: {cartItems.length}</p>
                <p style={{ fontSize: '20px', fontWeight: 'bold' }}>
                  Total: ${totalPrice.toFixed(2)}
                </p>
              </div>
              <Button
                type="primary"
                size="large"
                block
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default CartPage; 