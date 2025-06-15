import React from 'react';
import { Card, Button, Image } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const WishlistItem = ({ item, onRemove, onAddToCart }) => {
  const navigate = useNavigate();

  return (
    <Card
      hoverable
      style={{ width: 240, margin: '16px' }}
      cover={
        <Image
          alt={item.productName}
          src={item.productImage}
          style={{ height: 200, objectFit: 'cover' }}
          onClick={() => navigate(`/product/${item.productId}`)}
        />
      }
      actions={[
        <Button
          type="text"
          icon={<ShoppingCartOutlined />}
          onClick={() => onAddToCart(item)}
        >
          Add to Cart
        </Button>,
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => onRemove(item.id)}
        >
          Remove
        </Button>,
      ]}
    >
      <Card.Meta
        title={item.productName}
        description={`$${item.productPrice.toFixed(2)}`}
      />
    </Card>
  );
};

export default WishlistItem; 