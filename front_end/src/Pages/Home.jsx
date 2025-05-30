import React from 'react';
import ProductCard from '../components/ProductCard';
import { products, getProductsByCategory } from '../config/productImages';

const Home = () => {
  // Lấy danh sách sản phẩm theo danh mục
  const laptops = getProductsByCategory('laptop');
  const phones = getProductsByCategory('phone');
  const accessories = getProductsByCategory('phukien');
  const tvs = getProductsByCategory('tivi');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Laptop Section */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Laptop</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {laptops.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Phone Section */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Điện thoại</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {phones.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Accessories Section */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Phụ kiện</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {accessories.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* TV Section */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Tivi</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {tvs.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home; 