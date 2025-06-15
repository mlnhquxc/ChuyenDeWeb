import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, Empty, message } from 'antd';
import WishlistItem from './WishlistItem';
import axios from 'axios';

const { Title } = Typography;

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const userId = localStorage.getItem('userId'); // Assuming you store userId in localStorage

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/wishlist/user/${userId}`);
      setWishlistItems(response.data);
    } catch (error) {
      message.error('Failed to fetch wishlist items');
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await axios.delete(`http://localhost:8080/api/wishlist/remove?userId=${userId}&productId=${itemId}`);
      message.success('Item removed from wishlist');
      fetchWishlist();
    } catch (error) {
      message.error('Failed to remove item from wishlist');
    }
  };

  const handleAddToCart = async (item) => {
    try {
      await axios.post('http://localhost:8080/api/cart/add', {
        userId: userId,
        productId: item.productId,
        quantity: 1
      });
      message.success('Item added to cart');
    } catch (error) {
      message.error('Failed to add item to cart');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>My Wishlist</Title>
      {wishlistItems.length === 0 ? (
        <Empty description="Your wishlist is empty" />
      ) : (
        <Row gutter={[16, 16]}>
          {wishlistItems.map((item) => (
            <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
              <WishlistItem
                item={item}
                onRemove={handleRemove}
                onAddToCart={handleAddToCart}
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default WishlistPage; 