// Import ảnh laptop
import macbook1 from '../assets/images/laptop/macbook/macbook_1.png';
import macbook2 from '../assets/images/laptop/macbook/macbook_2.png';
import macbook3 from '../assets/images/laptop/macbook/macbook_3.png';

// Import ảnh điện thoại
import iphone1 from '../assets/images/phone/16promax/iphone-16-pro-max.png';
import iphone2 from '../assets/images/phone/16promax/iphone-16-pro-max-2.png';
import iphone3 from '../assets/images/phone/16promax/iphone-16-pro-max-3.png';
import iphone4 from '../assets/images/phone/16promax/iphone-16-pro-max-4.png';
import iphone5 from '../assets/images/phone/16promax/iphone-16-pro-max-5.png';
import iphone6 from '../assets/images/phone/16promax/iphone-16-pro-max-6.png';

// Import ảnh phụ kiện
import airpods1 from '../assets/images/phukien/tainghe/airpods-1.png';
import airpods2 from '../assets/images/phukien/tainghe/airpods-2.png';
import airpods3 from '../assets/images/phukien/tainghe/airpods-3.png';

// Import ảnh tivi
import tivi1 from '../assets/images/tivi/sony/tivi-1.png';
import tivi2 from '../assets/images/tivi/sony/tivi-2.png';
import tivi3 from '../assets/images/tivi/sony/tivi-3.png';

// Cấu trúc dữ liệu sản phẩm
export const products = [
  // Laptop
  {
    id: 1,
    name: 'MacBook Pro M1',
    price: 29990000,
    category: 'laptop',
    brand: 'macbook',
    images: [
      'macbook_1.png',
      'macbook_2.png',
      'macbook_3.png'
    ],
    description: 'MacBook Pro với chip M1, 8GB RAM, 256GB SSD',
    specs: {
      processor: 'Apple M1',
      ram: '8GB',
      storage: '256GB SSD',
      display: '13.3 inch Retina',
      graphics: 'Apple M1 GPU',
      battery: 'Up to 20 hours'
    }
  },
  {
    id: 2,
    name: 'Lenovo ThinkPad X1',
    price: 25990000,
    category: 'laptop',
    brand: 'lenovo',
    images: ['lenovo_1.png'],
    description: 'Lenovo ThinkPad X1 với Intel Core i7, 16GB RAM, 512GB SSD',
    specs: {
      processor: 'Intel Core i7',
      ram: '16GB',
      storage: '512GB SSD',
      display: '14 inch 4K',
      graphics: 'Intel Iris Xe',
      battery: 'Up to 15 hours'
    }
  },
  // Điện thoại
  {
    id: 3,
    name: 'iPhone 16 Pro Max',
    price: 34990000,
    category: 'phone',
    brand: '16promax',
    images: [
      'iphone-16-pro-max.png',
      'iphone-16-pro-max-2.png',
      'iphone-16-pro-max-3.png',
      'iphone-16-pro-max-4.png',
      'iphone-16-pro-max-5.png',
      'iphone-16-pro-max-6.png'
    ],
    description: 'iPhone 16 Pro Max với chip A18 Pro, 6GB RAM, 256GB',
    specs: {
      processor: 'A18 Pro',
      ram: '6GB',
      storage: '256GB',
      display: '6.7 inch Super Retina XDR',
      camera: '48MP + 12MP + 12MP',
      battery: '4422 mAh'
    }
  },
  // Phụ kiện
  {
    id: 4,
    name: 'AirPods Pro 2',
    price: 5990000,
    category: 'phukien',
    brand: 'tainghe',
    images: [
      'tainghe_1.png',
      'tainghe_2.png',
      'tainghe_3.png'
    ],
    description: 'AirPods Pro 2 với chống ồn chủ động và không gian âm thanh',
    specs: {
      battery: '6 giờ nghe nhạc',
      charging: 'MagSafe, Lightning',
      features: 'Chống ồn chủ động, Chế độ xuyên âm',
      connectivity: 'Bluetooth 5.3'
    }
  },
  // Tivi
  {
    id: 5,
    name: 'Sony Bravia XR A95K',
    price: 49990000,
    category: 'tivi',
    brand: 'sony',
    images: [
      'sony_1.png',
      'sony_2.png',
      'sony_3.png'
    ],
    description: 'Tivi Sony Bravia XR A95K 65 inch với công nghệ QD-OLED',
    specs: {
      display: '65 inch QD-OLED',
      resolution: '4K HDR',
      processor: 'Cognitive Processor XR',
      features: 'Google TV, Dolby Vision, Dolby Atmos'
    }
  }
];

// Hàm helper để lấy ảnh sản phẩm
export const getProductImage = (category, brand, imageName) => {
  try {
    return require(`../assets/images/${category}/${brand}/${imageName}`);
  } catch (error) {
    console.error('Error loading image:', error);
    return null;
  }
};

// Hàm helper để lấy danh sách sản phẩm theo danh mục
export const getProductsByCategory = (category) => {
  return products.filter(product => product.category === category);
};

// Hàm helper để lấy danh sách sản phẩm theo thương hiệu
export const getProductsByBrand = (brand) => {
  return products.filter(product => product.brand === brand);
}; 