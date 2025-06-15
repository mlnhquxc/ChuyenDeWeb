import React from 'react';
import { Card, Button, Image, InputNumber, Space } from 'antd';
import { DeleteOutlined, HeartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const CartItem = ({ item, onUpdateQuantity, onRemove, onAddToWishlist }) => {
  const navigate = useNavigate();

  return (
    <Card
      hoverable
      style={{ width: '100%', marginBottom: '16px' }}
    >
      <div style={{ display: 'flex', gap: '24px' }}>
        <Image
          alt={item.productName}
          src={item.productImage}
          style={{ width: 120, height: 120, objectFit: 'cover' }}
          onClick={() => navigate(`/product/${item.productId}`)}
        />
        <div style={{ flex: 1 }}>
          <h3>{item.productName}</h3>
          <p style={{ fontSize: '18px', color: '#1890ff' }}>${item.productPrice.toFixed(2)}</p>
          <Space>
            <InputNumber
              min={1}
              value={item.quantity}
              onChange={(value) => onUpdateQuantity(item.id, value)}
            />
            <Button
              type="text"
              icon={<HeartOutlined />}
              onClick={() => onAddToWishlist(item)}
            >
              Add to Wishlist
            </Button>
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onRemove(item.id)}
            >
              Remove
            </Button>
          </Space>
          <p style={{ marginTop: '8px' }}>
            Subtotal: ${(item.productPrice * item.quantity).toFixed(2)}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default CartItem; 