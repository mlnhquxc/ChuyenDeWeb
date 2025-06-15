import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, message, Space } from 'antd';
import { HeartOutlined, HeartFilled, ShoppingCartOutlined } from '@ant-design/icons';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchProduct();
    checkWishlistStatus();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      message.error('Failed to fetch product details');
    }
  };

  const checkWishlistStatus = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/wishlist/user/${userId}`);
      setIsInWishlist(response.data.some(item => item.productId === parseInt(id)));
    } catch (error) {
      console.error('Failed to check wishlist status');
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await axios.post(`http://localhost:8080/api/wishlist/add?userId=${userId}&productId=${id}`);
      setIsInWishlist(true);
      message.success('Added to wishlist');
    } catch (error) {
      message.error('Failed to add to wishlist');
    }
  };

  const handleRemoveFromWishlist = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/wishlist/remove?userId=${userId}&productId=${id}`);
      setIsInWishlist(false);
      message.success('Removed from wishlist');
    } catch (error) {
      message.error('Failed to remove from wishlist');
    }
  };

  const handleAddToCart = async () => {
    try {
      await axios.post('http://localhost:8080/api/cart/add', {
        userId: userId,
        productId: id,
        quantity: 1
      });
      message.success('Added to cart');
    } catch (error) {
      message.error('Failed to add to cart');
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ display: 'flex', gap: '24px' }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '400px', height: '400px', objectFit: 'cover' }}
          />
          <div>
            <h1>{product.name}</h1>
            <p style={{ fontSize: '24px', color: '#1890ff' }}>${product.price}</p>
            <p>{product.description}</p>
            <Space>
              <Button
                type="primary"
                icon={<ShoppingCartOutlined />}
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              <Button
                icon={isInWishlist ? <HeartFilled /> : <HeartOutlined />}
                onClick={isInWishlist ? handleRemoveFromWishlist : handleAddToWishlist}
              >
                {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>
            </Space>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductDetail; 