import React from 'react';
import { FaBox, FaTruck, FaCheckCircle } from 'react-icons/fa';

const Orders = () => {
  // TODO: Implement orders fetching from API
  const orders = [
    {
      id: '1',
      date: '2024-03-15',
      status: 'delivered',
      total: 129.99,
      items: [
        {
          id: '1',
          name: 'Classic T-Shirt',
          price: 29.99,
          quantity: 2,
          image: 'https://example.com/tshirt.jpg',
        },
        {
          id: '2',
          name: 'Denim Jacket',
          price: 69.99,
          quantity: 1,
          image: 'https://example.com/jacket.jpg',
        },
      ],
    },
    {
      id: '2',
      date: '2024-03-10',
      status: 'shipped',
      total: 89.99,
      items: [
        {
          id: '3',
          name: 'Sneakers',
          price: 89.99,
          quantity: 1,
          image: 'https://example.com/sneakers.jpg',
        },
      ],
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <FaCheckCircle className="text-green-500" />;
      case 'shipped':
        return <FaTruck className="text-blue-500" />;
      default:
        return <FaBox className="text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'shipped':
        return 'Shipped';
      default:
        return 'Processing';
    }
  };

  return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Orders</h1>
        <div className="space-y-6">
          {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">Order #{order.id}</h2>
                      <p className="text-sm text-gray-600">Placed on {order.date}</p>
                    </div>
                    <div className="flex items-center">
                      {getStatusIcon(order.status)}
                      <span className="ml-2 text-sm font-medium text-gray-600">
                    {getStatusText(order.status)}
                  </span>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {order.items.map((item) => (
                        <div key={item.id} className="py-4 flex items-center">
                          <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-md"
                          />
                          <div className="ml-4 flex-1">
                            <h3 className="text-sm font-medium text-gray-800">{item.name}</h3>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity} × ${item.price}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-800">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Total</span>
                      <span className="text-lg font-bold text-gray-800">
                    ${order.total.toFixed(2)}
                  </span>
                    </div>
                  </div>
                </div>
              </div>
          ))}
        </div>
      </div>
  );
};

export default Orders;