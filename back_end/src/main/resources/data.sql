-- Thêm roles
INSERT INTO roles (name, description) VALUES
('ROLE_ADMIN', 'Administrator'),
('ROLE_USER', 'Regular user');

-- Thêm categories
INSERT INTO categories (name, description) VALUES
('Laptops', 'Laptop computers and notebooks'),
('Smartphones', 'Mobile phones and accessories'),
('Tablets', 'Tablet computers and accessories'),
('Accessories', 'Computer and mobile accessories'),
('Gaming', 'Gaming equipment and accessories');

-- Thêm sản phẩm mẫu
INSERT INTO products (name, description, price, stock, category_id, active) VALUES
('MacBook Pro 2023', 'Apple MacBook Pro with M2 chip, 16GB RAM, 512GB SSD', 1999.99, 50, 1, true),
('iPhone 15 Pro', 'Apple iPhone 15 Pro, 256GB, Titanium', 999.99, 100, 2, true),
('Samsung Galaxy Tab S9', 'Samsung Galaxy Tab S9, 11-inch, 256GB', 699.99, 30, 3, true),
('AirPods Pro', 'Apple AirPods Pro with Noise Cancellation', 249.99, 200, 4, true),
('Logitech G Pro X', 'Logitech G Pro X Wireless Gaming Headset', 199.99, 75, 5, true),
('Dell XPS 15', 'Dell XPS 15 Laptop, Intel i7, 16GB RAM, 1TB SSD', 1799.99, 25, 1, true),
('Samsung Galaxy S23', 'Samsung Galaxy S23 Ultra, 512GB', 1199.99, 80, 2, true),
('iPad Pro', 'Apple iPad Pro 12.9-inch, M2 chip, 256GB', 1099.99, 40, 3, true),
('Sony WH-1000XM5', 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones', 399.99, 60, 4, true),
('Razer Blade 15', 'Razer Blade 15 Gaming Laptop, RTX 3080, 32GB RAM', 2499.99, 20, 5, true); 