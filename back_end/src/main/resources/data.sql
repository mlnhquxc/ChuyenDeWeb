-- Thêm roles nếu chưa tồn tại
INSERT INTO roles (name, description) 
SELECT 'ROLE_ADMIN', 'Administrator' FROM dual 
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'ROLE_ADMIN');

INSERT INTO roles (name, description) 
SELECT 'ROLE_USER', 'Regular user' FROM dual 
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'ROLE_USER');

-- Thêm categories nếu chưa tồn tại
INSERT INTO categories (name, description)
SELECT 'Laptops', 'Laptop computers and notebooks' FROM dual
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Laptops');

INSERT INTO categories (name, description)
SELECT 'Smartphones', 'Mobile phones and accessories' FROM dual
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Smartphones');

INSERT INTO categories (name, description)
SELECT 'TVs', 'Smart TVs and displays' FROM dual
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'TVs');

INSERT INTO categories (name, description)
SELECT 'Accessories', 'Computer and mobile accessories' FROM dual
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Accessories');

-- Tạo bảng product_images nếu chưa tồn tại
CREATE TABLE IF NOT EXISTS product_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT,
    image_url VARCHAR(500),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Thêm sản phẩm Laptop
INSERT INTO products (name, description, price, category_id, stock)
SELECT 'MacBook Pro M1 Max 14 inch 32GB/512GB', 'Chip Apple M1 Max; RAM 32GB; SSD 512GB; Màn hình Liquid Retina XDR 14 inch; Thời lượng pin lên đến 17 giờ.', 35900000, 
(SELECT id FROM categories WHERE name = 'Laptops'), 50
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'MacBook Pro M1 Max 14 inch 32GB/512GB');

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/m/a/macbook-pro-14-inch-2021-m1-max-10cpu-24gpu-32gb-96w-3_3_1.jpg'
FROM products p WHERE p.name = 'MacBook Pro M1 Max 14 inch 32GB/512GB';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/m/a/macbook-pro-14-inch-2021-m1-max-10cpu-24gpu-32gb-96w-2_1_1.jpg'
FROM products p WHERE p.name = 'MacBook Pro M1 Max 14 inch 32GB/512GB';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/m/a/macbook-pro-14-inch-2021-m1-max-10cpu-24gpu-32gb-96w-4_1_1.jpg'
FROM products p WHERE p.name = 'MacBook Pro M1 Max 14 inch 32GB/512GB';

-- Thêm sản phẩm Smartphone
INSERT INTO products (name, description, price, category_id, stock)
SELECT 'iPhone 15 128GB', 'Chip A16 Bionic; Dynamic Island; Camera nâng cấp 48MP; Chính hãng Apple VN/A.', 21990000,
(SELECT id FROM categories WHERE name = 'Smartphones'), 100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'iPhone 15 128GB');

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone-15-plus_1__1.png'
FROM products p WHERE p.name = 'iPhone 15 128GB';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/v/n/vn_iphone_15_pink_pdp_image_position-2_design_2.jpg'
FROM products p WHERE p.name = 'iPhone 15 128GB';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/v/n/vn_iphone_15_pink_pdp_image_position-5_colors_2.jpg'
FROM products p WHERE p.name = 'iPhone 15 128GB';

-- Thêm sản phẩm TV
INSERT INTO products (name, description, price, category_id, stock)
SELECT 'Smart Tivi OLED LG 4K 55 inch 55A3PSA', 'Màn hình OLED 4K 55 inch; Hệ điều hành webOS; Hỗ trợ HDR10, Dolby Vision; Tích hợp AI ThinQ.', 17120000,
(SELECT id FROM categories WHERE name = 'TVs'), 30
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Smart Tivi OLED LG 4K 55 inch 55A3PSA');

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://m.media-amazon.com/images/I/51FZgruKdpL._SL1500_.jpg'
FROM products p WHERE p.name = 'Smart Tivi OLED LG 4K 55 inch 55A3PSA';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://m.media-amazon.com/images/I/714IUMxTYIL._SL1500_.jpg'
FROM products p WHERE p.name = 'Smart Tivi OLED LG 4K 55 inch 55A3PSA';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://m.media-amazon.com/images/I/81QysInPhqL._SL1500_.jpg'
FROM products p WHERE p.name = 'Smart Tivi OLED LG 4K 55 inch 55A3PSA';

-- Thêm sản phẩm Phụ kiện
INSERT INTO products (name, description, price, category_id, stock)
SELECT 'Tai nghe Bluetooth Sony WF-1000XM4', 'Tai nghe không dây chống ồn chủ động, chất lượng âm thanh cao cấp.', 5990000,
(SELECT id FROM categories WHERE name = 'Accessories'), 200
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Tai nghe Bluetooth Sony WF-1000XM4');

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/t/a/tai-nghe-khong-day-sony-wf-1000xm5-6_1.png'
FROM products p WHERE p.name = 'Tai nghe Bluetooth Sony WF-1000XM4';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/t/a/tai-nghe-khong-day-sony-wf-1000xm5-7.png'
FROM products p WHERE p.name = 'Tai nghe Bluetooth Sony WF-1000XM4';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/t/a/tai-nghe-khong-day-sony-wf-1000xm5-8.png'
FROM products p WHERE p.name = 'Tai nghe Bluetooth Sony WF-1000XM4';

-- Thêm sản phẩm Laptop Masstel E140 Celeron
INSERT INTO products (name, description, price, category_id, stock)
SELECT 'Laptop Masstel E140 Celeron', 'CPU Intel Celeron; RAM 4GB; SSD 128GB; Màn hình 14 inch HD; Thích hợp cho nhu cầu học tập và văn phòng cơ bản.', 3590000,
(SELECT id FROM categories WHERE name = 'Laptops'), 40
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Laptop Masstel E140 Celeron');

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_9_36.png'
FROM products p WHERE p.name = 'Laptop Masstel E140 Celeron';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_2__6_26.png'
FROM products p WHERE p.name = 'Laptop Masstel E140 Celeron';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_1__6_18.png'
FROM products p WHERE p.name = 'Laptop Masstel E140 Celeron';

-- Thêm sản phẩm HP Pavilion 15-eg2082TU
INSERT INTO products (name, description, price, category_id, stock)
SELECT 'HP Pavilion 15-eg2082TU i5 1240P/8GB/512GB SSD/Win11', 'CPU Intel Core i5-1240P; RAM 8GB; SSD 512GB; Màn hình 15.6 inch FHD; Hệ điều hành Windows 11.', 17990000,
(SELECT id FROM categories WHERE name = 'Laptops'), 35
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'HP Pavilion 15-eg2082TU i5 1240P/8GB/512GB SSD/Win11');

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/1/_/1_467.png'
FROM products p WHERE p.name = 'HP Pavilion 15-eg2082TU i5 1240P/8GB/512GB SSD/Win11';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/3/_/3_400.png'
FROM products p WHERE p.name = 'HP Pavilion 15-eg2082TU i5 1240P/8GB/512GB SSD/Win11';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/4/_/4_360.png'
FROM products p WHERE p.name = 'HP Pavilion 15-eg2082TU i5 1240P/8GB/512GB SSD/Win11';

-- Thêm sản phẩm Lenovo IdeaPad 3
INSERT INTO products (name, description, price, category_id, stock)
SELECT 'Lenovo IdeaPad 3 15ITL6 i5 1135G7/8GB/512GB SSD/Win11', 'CPU Intel Core i5-1135G7; RAM 8GB; SSD 512GB; Màn hình 15.6 inch FHD; Hệ điều hành Windows 11.', 13990000,
(SELECT id FROM categories WHERE name = 'Laptops'), 45
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Lenovo IdeaPad 3 15ITL6 i5 1135G7/8GB/512GB SSD/Win11');

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_10__2_61.png'
FROM products p WHERE p.name = 'Lenovo IdeaPad 3 15ITL6 i5 1135G7/8GB/512GB SSD/Win11';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_11__2_63.png'
FROM products p WHERE p.name = 'Lenovo IdeaPad 3 15ITL6 i5 1135G7/8GB/512GB SSD/Win11';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_12__1_53.png'
FROM products p WHERE p.name = 'Lenovo IdeaPad 3 15ITL6 i5 1135G7/8GB/512GB SSD/Win11';

-- Thêm sản phẩm MacBook Air M1
INSERT INTO products (name, description, price, category_id, stock)
SELECT 'Apple MacBook Air M1 256GB 2020', 'Chip Apple M1 với 8 nhân (4 hiệu năng cao và 4 tiết kiệm điện); Màn hình Retina 13.3 inch; Thiết kế mỏng nhẹ; Thời lượng pin lên đến 18 giờ; Hệ điều hành macOS.', 26000000,
(SELECT id FROM categories WHERE name = 'Laptops'), 60
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Apple MacBook Air M1 256GB 2020');

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/_/0/_0003_macbook-air-gallery4-20201110.jpg'
FROM products p WHERE p.name = 'Apple MacBook Air M1 256GB 2020';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/_/0/_0000_macbook-air-gallery1-20201110_geo_us.jpg'
FROM products p WHERE p.name = 'Apple MacBook Air M1 256GB 2020';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/_/0/_0001_macbook-air-gallery2-20201110.jpg'
FROM products p WHERE p.name = 'Apple MacBook Air M1 256GB 2020';

-- Thêm sản phẩm MacBook Pro 13 Touch Bar
INSERT INTO products (name, description, price, category_id, stock)
SELECT 'Apple MacBook Pro 13 Touch Bar M1 512GB 2020', 'Chip Apple M1 mạnh mẽ; Màn hình Retina 13.3 inch; Touch Bar tiện lợi; Thời lượng pin lên đến 20 giờ; Hệ điều hành macOS.', 36000000,
(SELECT id FROM categories WHERE name = 'Laptops'), 40
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Apple MacBook Pro 13 Touch Bar M1 512GB 2020');

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/m/b/mbp-silver-gallery3-202011-removebg-preview.png_1.jpg'
FROM products p WHERE p.name = 'Apple MacBook Pro 13 Touch Bar M1 512GB 2020';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/m/b/mbp-spacegray-select-202011_2.jpg'
FROM products p WHERE p.name = 'Apple MacBook Pro 13 Touch Bar M1 512GB 2020';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/m/b/mbp-silver-gallery4-202011-removebg-preview.png_1.jpg'
FROM products p WHERE p.name = 'Apple MacBook Pro 13 Touch Bar M1 512GB 2020';

-- Thêm sản phẩm ASUS Vivobook R564JA
INSERT INTO products (name, description, price, category_id, stock)
SELECT 'Laptop ASUS Vivobook R564JA-UH51T', 'CPU Intel Core i5-1035G1; Màn hình 15.6 inch Full HD; RAM 8GB; Ổ cứng SSD 512GB; Thiết kế hiện đại; Phù hợp cho công việc văn phòng và học tập.', 16490000,
(SELECT id FROM categories WHERE name = 'Laptops'), 55
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Laptop ASUS Vivobook R564JA-UH51T');

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/l/a/laptop-asus-vivobook-r564ja-uh51t-11.jpg'
FROM products p WHERE p.name = 'Laptop ASUS Vivobook R564JA-UH51T';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/l/a/laptop-asus-vivobook-r564ja-uh51t-12.jpg'
FROM products p WHERE p.name = 'Laptop ASUS Vivobook R564JA-UH51T';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/l/a/laptop-asus-vivobook-r564ja-uh51t-04.jpg'
FROM products p WHERE p.name = 'Laptop ASUS Vivobook R564JA-UH51T';

-- Thêm sản phẩm ASUS VivoBook R564JA-UH31T
INSERT INTO products (name, description, price, category_id, stock)
SELECT 'Laptop ASUS VivoBook R564JA-UH31T', 'CPU Intel Core i3-1005G1; Màn hình 15.6 inch Full HD; RAM 4GB; Ổ cứng SSD 256GB; Thiết kế mỏng nhẹ; Phù hợp cho nhu cầu học tập và giải trí cơ bản.', 11690000,
(SELECT id FROM categories WHERE name = 'Laptops'), 65
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Laptop ASUS VivoBook R564JA-UH31T');

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/l/a/laptop-asus-vivobook-r564ja-uh31t-4.jpg'
FROM products p WHERE p.name = 'Laptop ASUS VivoBook R564JA-UH31T';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/l/a/laptop-asus-vivobook-r564ja-uh31t-1.jpg'
FROM products p WHERE p.name = 'Laptop ASUS VivoBook R564JA-UH31T';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/l/a/laptop-asus-vivobook-r564ja-uh31t-3.jpg'
FROM products p WHERE p.name = 'Laptop ASUS VivoBook R564JA-UH31T';

-- Thêm sản phẩm OPPO Reno10 Pro+
INSERT INTO products (name, description, price, category_id, stock)
SELECT 'OPPO Reno10 Pro+ 5G 12GB 256GB', 'Màn hình AMOLED 6.74", tần số quét 120Hz; Camera sau AI 50MP + 64MP + 8MP; Pin 4700mAh, sạc nhanh 100W.', 10990000,
(SELECT id FROM categories WHERE name = 'Smartphones'), 80
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'OPPO Reno10 Pro+ 5G 12GB 256GB');

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/o/p/oppo-reno10-pro-plus-tim.png'
FROM products p WHERE p.name = 'OPPO Reno10 Pro+ 5G 12GB 256GB';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/o/p/oppo-reno10-pro-plus-xam.png'
FROM products p WHERE p.name = 'OPPO Reno10 Pro+ 5G 12GB 256GB';

-- Thêm sản phẩm realme C51
INSERT INTO products (name, description, price, category_id, stock)
SELECT 'realme C51 3GB 64GB', 'Màn hình IPS LCD 6.74", tần số quét 90Hz; Camera chính 50MP; Pin 5000mAh, sạc nhanh 33W.', 2690000,
(SELECT id FROM categories WHERE name = 'Smartphones'), 120
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'realme C51 3GB 64GB');

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/r/e/realme-c51-den-011_5.png'
FROM products p WHERE p.name = 'realme C51 3GB 64GB';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/r/e/realme-c51_1.png'
FROM products p WHERE p.name = 'realme C51 3GB 64GB';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/r/e/realme-c51-den-2_1_2.jpg'
FROM products p WHERE p.name = 'realme C51 3GB 64GB';

-- Thêm sản phẩm iPhone 13
INSERT INTO products (name, description, price, category_id, stock)
SELECT 'iPhone 13 128GB', 'Chip A15 Bionic; Camera kép; Màn hình OLED 6.1 inch; Chính hãng Apple VN/A.', 16990000,
(SELECT id FROM categories WHERE name = 'Smartphones'), 90
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'iPhone 13 128GB');

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone-13-0-0.jpg'
FROM products p WHERE p.name = 'iPhone 13 128GB';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/1/5/15_2_7_2_5.jpg'
FROM products p WHERE p.name = 'iPhone 13 128GB';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/1/3/13_4_7_2_7.jpg'
FROM products p WHERE p.name = 'iPhone 13 128GB';

-- Thêm sản phẩm Nothing Phone 2A
INSERT INTO products (name, description, price, category_id, stock)
SELECT 'Nothing Phone 2A 5G 8GB 128GB', 'Thiết kế trong suốt độc đáo; Chip Dimensity 7200 Pro; Hệ điều hành Nothing OS; Hỗ trợ 5G.', 7990000,
(SELECT id FROM categories WHERE name = 'Smartphones'), 70
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Nothing Phone 2A 5G 8GB 128GB');

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/d/i/dien-thoai-nothing-phone-2a_4__1.png'
FROM products p WHERE p.name = 'Nothing Phone 2A 5G 8GB 128GB';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/d/i/dien-thoai-nothing-phone-2a_1_1.png'
FROM products p WHERE p.name = 'Nothing Phone 2A 5G 8GB 128GB';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/d/i/dien-thoai-nothing-phone-2a_3__1_1.png'
FROM products p WHERE p.name = 'Nothing Phone 2A 5G 8GB 128GB';

-- Thêm sản phẩm iPhone 16 Pro Max
INSERT INTO products (name, description, price, category_id, stock)
SELECT 'iPhone 16 Pro Max 256GB', 'Chip Apple A18 Pro; Màn hình ProMotion 6.7 inch; Camera tele 5x; Thiết kế titan; Chính hãng Apple VN/A.', 33990000,
(SELECT id FROM categories WHERE name = 'Smartphones'), 40
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'iPhone 16 Pro Max 256GB');

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone-16-pro-max.png'
FROM products p WHERE p.name = 'iPhone 16 Pro Max 256GB';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone-16-pro-max-2.png'
FROM products p WHERE p.name = 'iPhone 16 Pro Max 256GB';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone-16-pro-max-3.png'
FROM products p WHERE p.name = 'iPhone 16 Pro Max 256GB';

-- Thêm sản phẩm Xiaomi 14T Pro
INSERT INTO products (name, description, price, category_id, stock)
SELECT 'Xiaomi 14T Pro 12GB 512GB', 'Chip Snapdragon 8 Gen 3; Màn hình AMOLED 144Hz; Camera 200MP; Pin 5000mAh sạc nhanh 120W.', 16490000,
(SELECT id FROM categories WHERE name = 'Smartphones'), 85
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Xiaomi 14T Pro 12GB 512GB');

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/x/i/xiaomi_14t_pro_2_.png'
FROM products p WHERE p.name = 'Xiaomi 14T Pro 12GB 512GB';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/x/i/xiaomi_14t_pro_1_.png'
FROM products p WHERE p.name = 'Xiaomi 14T Pro 12GB 512GB';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/x/i/xiaomi_14t_pro.png'
FROM products p WHERE p.name = 'Xiaomi 14T Pro 12GB 512GB';

-- Thêm sản phẩm Samsung Galaxy S25
INSERT INTO products (name, description, price, category_id, stock)
SELECT 'Samsung Galaxy S25 256GB', 'Chip Exynos/Snapdragon thế hệ mới; Màn hình Dynamic AMOLED 2X; Camera AI nâng cao; IP68 chống nước.', 24990000,
(SELECT id FROM categories WHERE name = 'Smartphones'), 60
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Samsung Galaxy S25 256GB');

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/d/i/dien-thoai-samsung-galaxy-s25_2_.png'
FROM products p WHERE p.name = 'Samsung Galaxy S25 256GB';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/d/i/dien-thoai-samsung-galaxy-s25_1__2.png'
FROM products p WHERE p.name = 'Samsung Galaxy S25 256GB';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/d/i/dien-thoai-samsung-galaxy-s25_3.png'
FROM products p WHERE p.name = 'Samsung Galaxy S25 256GB';

-- Thêm sản phẩm Smart Tivi Crystal UHD Samsung
INSERT INTO products (name, description, price, category_id, stock)
SELECT 'Smart Tivi Crystal UHD Samsung 4K 43 inch UA43DU7000', 'Màn hình Crystal UHD 4K 43 inch; Hệ điều hành Tizen; Hỗ trợ HDR10+; Tích hợp trợ lý ảo Bixby.', 7890000,
(SELECT id FROM categories WHERE name = 'TVs'), 25
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Smart Tivi Crystal UHD Samsung 4K 43 inch UA43DU7000');

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://images.samsung.com/is/image/samsung/p6pim/sg/ua43du7000kxxs/gallery/sg-crystal-uhd-du7000-ua43du7000kxxs-540268685?$684_547_JPG$'
FROM products p WHERE p.name = 'Smart Tivi Crystal UHD Samsung 4K 43 inch UA43DU7000';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://images.samsung.com/is/image/samsung/p6pim/sg/ua43du7000kxxs/gallery/sg-crystal-uhd-du7000-ua43du7000kxxs-540268670?$684_547_JPG$'
FROM products p WHERE p.name = 'Smart Tivi Crystal UHD Samsung 4K 43 inch UA43DU7000';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://images.samsung.com/is/image/samsung/p6pim/sg/ua43du7000kxxs/gallery/sg-crystal-uhd-du7000-ua43du7000kxxs-540268670?$684_547_JPG$'
FROM products p WHERE p.name = 'Smart Tivi Crystal UHD Samsung 4K 43 inch UA43DU7000';

-- Thêm sản phẩm Google Tivi Sony 4K
INSERT INTO products (name, description, price, category_id, stock)
SELECT 'Google Tivi Sony 4K', 'Màn hình 4K; Hệ điều hành Google TV; Hỗ trợ HDR; Tích hợp trợ lý ảo Google Assistant.', 20500000,
(SELECT id FROM categories WHERE name = 'TVs'), 20
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Google Tivi Sony 4K');

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://www.smappliance.com/cdn/shop/products/50_X75K_blk_blk_outsideh_front-Mid2048x2048_800x.jpg?v=1656559129'
FROM products p WHERE p.name = 'Google Tivi Sony 4K';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://www.smappliance.com/cdn/shop/products/50_X75K_blk_blk_outsideh_ccw-Mid2048x2048_800x.jpg?v=1656559129'
FROM products p WHERE p.name = 'Google Tivi Sony 4K';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://www.smappliance.com/cdn/shop/products/50_X75K_blk_blk_outsideh_cw-Mid2048x2048_800x.jpg?v=1656559129'
FROM products p WHERE p.name = 'Google Tivi Sony 4K';

-- Thêm sản phẩm Smart Tivi Coocaa HD
INSERT INTO products (name, description, price, category_id, stock)
SELECT 'Smart Tivi Coocaa HD 32 inch 32S3U+', 'Màn hình HD 32 inch; Hệ điều hành Coocaa OS; Hỗ trợ HDR; Tích hợp Wi-Fi.', 3190000,
(SELECT id FROM categories WHERE name = 'TVs'), 35
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Smart Tivi Coocaa HD 32 inch 32S3U+');

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://www.coocaatv.in/media/products/WhatsApp_Image_2024-08-08_at_2.15.25_PM.jpeg'
FROM products p WHERE p.name = 'Smart Tivi Coocaa HD 32 inch 32S3U+';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://www.coocaatv.in/media/products/Back_View.jpg'
FROM products p WHERE p.name = 'Smart Tivi Coocaa HD 32 inch 32S3U+';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://www.coocaatv.in/media/products/Dimension_Image.jpg'
FROM products p WHERE p.name = 'Smart Tivi Coocaa HD 32 inch 32S3U+';

-- Thêm sản phẩm Smart Tivi LG UHD 4K
INSERT INTO products (name, description, price, category_id, stock)
SELECT 'Smart Tivi LG UHD 4K 43 inch 2025 (43UA7350)', 'Màn hình 43 inch với độ phân giải 4K; Hệ điều hành WebOS dễ sử dụng; Tích hợp AI ThinQ hỗ trợ điều khiển bằng giọng nói; Hỗ trợ HDR10 Pro nâng cao chất lượng hình ảnh.', 9490000,
(SELECT id FROM categories WHERE name = 'TVs'), 28
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Smart Tivi LG UHD 4K 43 inch 2025 (43UA7350)');

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://www.smappliance.com/cdn/shop/products/50_X75K_blk_blk_outsideh_front-Mid2048x2048_800x.jpg?v=1656559129'
FROM products p WHERE p.name = 'Smart Tivi LG UHD 4K 43 inch 2025 (43UA7350)';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://www.smappliance.com/cdn/shop/products/50_X75K_blk_blk_outsideh_back-Mid2048x2048_800x.jpg?v=1656559129'
FROM products p WHERE p.name = 'Smart Tivi LG UHD 4K 43 inch 2025 (43UA7350)';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://www.smappliance.com/cdn/shop/products/50_X75K_blk_blk_outsideh_cw-Mid2048x2048_800x.jpg?v=1656559129'
FROM products p WHERE p.name = 'Smart Tivi LG UHD 4K 43 inch 2025 (43UA7350)';

-- Thêm sản phẩm Smart Tivi Sony 4K 50 inch
INSERT INTO products (name, description, price, category_id, stock)
SELECT 'Smart Tivi Sony 4K 50 inch KD-50X75K', 'Màn hình 50 inch độ phân giải 4K; Bộ xử lý X1 4K HDR cho hình ảnh sắc nét và giảm nhiễu; Công nghệ S-Force Front Surround mang đến âm thanh sống động; Hỗ trợ Google Assistant điều khiển bằng giọng nói.', 10490000,
(SELECT id FROM categories WHERE name = 'TVs'), 22
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Smart Tivi Sony 4K 50 inch KD-50X75K');

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/s/m/smart-tivi-sony-4k-50-inch-kd-50x75k-1.jpg'
FROM products p WHERE p.name = 'Smart Tivi Sony 4K 50 inch KD-50X75K';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/s/m/smart-tivi-sony-4k-50-inch-kd-50x75k.png'
FROM products p WHERE p.name = 'Smart Tivi Sony 4K 50 inch KD-50X75K';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/s/m/smart-tivi-sony-4k-50-inch-kd-50x75k-2.jpg'
FROM products p WHERE p.name = 'Smart Tivi Sony 4K 50 inch KD-50X75K';

-- Thêm sản phẩm Google Tivi TCL 4K
INSERT INTO products (name, description, price, category_id, stock)
SELECT 'Google Tivi TCL 4K 43 inch 43P79B', 'Màn hình 43 inch với độ phân giải 4K; Hệ điều hành Google TV tích hợp kho ứng dụng phong phú; Hỗ trợ HDR10+ và Dolby Vision cho hình ảnh chân thực; Tích hợp trợ lý ảo Google Assistant.', 6100000,
(SELECT id FROM categories WHERE name = 'TVs'), 40
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Google Tivi TCL 4K 43 inch 43P79B');

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://www.smappliance.com/cdn/shop/files/P79Bfront_800x.jpg?v=1716953496'
FROM products p WHERE p.name = 'Google Tivi TCL 4K 43 inch 43P79B';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://www.smappliance.com/cdn/shop/files/P79Bleft_800x.jpg?v=1716953496'
FROM products p WHERE p.name = 'Google Tivi TCL 4K 43 inch 43P79B';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://www.smappliance.com/cdn/shop/files/P79Bback_800x.jpg?v=1716953496'
FROM products p WHERE p.name = 'Google Tivi TCL 4K 43 inch 43P79B';

-- Thêm sản phẩm Gimbal DJI Osmo Mobile 6
INSERT INTO products (name, description, price, category_id, stock)
SELECT 'Gimbal DJI Osmo Mobile 6', 'Gimbal chống rung 3 trục, hỗ trợ quay video mượt mà và chụp ảnh ổn định.', 2210000,
(SELECT id FROM categories WHERE name = 'Accessories'), 150
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Gimbal DJI Osmo Mobile 6');

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://se-cdn.djiits.com/tpc/uploads/carousel/image/7b718ab73be6949bdce63c5a1111197d@ultra.jpg?format=webp'
FROM products p WHERE p.name = 'Gimbal DJI Osmo Mobile 6';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://se-cdn.djiits.com/tpc/uploads/carousel/image/c46f11e17852b48e0598c1ad1e93db12@origin.jpg'
FROM products p WHERE p.name = 'Gimbal DJI Osmo Mobile 6';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://se-cdn.djiits.com/tpc/uploads/carousel/image/2b6c7422d8dafc17eb74f967114208b8@origin.jpg'
FROM products p WHERE p.name = 'Gimbal DJI Osmo Mobile 6';

-- Thêm sản phẩm Ốp lưng iPhone 12 UAG
INSERT INTO products (name, description, price, category_id, stock)
SELECT 'Ốp lưng iPhone 12 UAG', 'Ốp lưng chống sốc, thiết kế chắc chắn, bảo vệ điện thoại khỏi va đập.', 500000,
(SELECT id FROM categories WHERE name = 'Accessories'), 300
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Ốp lưng iPhone 12 UAG');

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://images.ctfassets.net/9hslf09drsil/27iERuDDTYQAWEK17lUL5R/942022629e8497d65bbafceca713acb7/Apple_iPhone6.1_2020_Mon_MAL_STD_PT01.png?w=1024&q=70&fm=webp'
FROM products p WHERE p.name = 'Ốp lưng iPhone 12 UAG';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://images.ctfassets.net/9hslf09drsil/3xbFKJNY1ZvdaHhzoEEyKf/b304249b613b2f4670884ff4464796ec/Apple_iPhone6.1_2020_Mon_MAL_STD_MAIN.png?w=1024&q=70&fm=webp'
FROM products p WHERE p.name = 'Ốp lưng iPhone 12 UAG';

-- Thêm sản phẩm Cáp sạc nhanh USB-C Anker
INSERT INTO products (name, description, price, category_id, stock)
SELECT 'Cáp sạc nhanh USB-C Anker', 'Cáp sạc nhanh hỗ trợ Power Delivery, độ bền cao.', 300000,
(SELECT id FROM categories WHERE name = 'Accessories'), 400
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Cáp sạc nhanh USB-C Anker');

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn.shopify.com/s/files/1/0493/9834/9974/files/SKU-06-3ft_Black.png?v=1725438051'
FROM products p WHERE p.name = 'Cáp sạc nhanh USB-C Anker';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn.shopify.com/s/files/1/0493/9834/9974/files/3ft_Black-04.jpg?v=1719212558'
FROM products p WHERE p.name = 'Cáp sạc nhanh USB-C Anker';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn.shopify.com/s/files/1/0493/9834/9974/files/3ft_Black-06.jpg?v=1739180591'
FROM products p WHERE p.name = 'Cáp sạc nhanh USB-C Anker';

-- Thêm sản phẩm Giá đỡ Laptop/Macbook S-Case
INSERT INTO products (name, description, price, category_id, stock)
SELECT 'Giá đỡ Laptop/Macbook S-Case hợp kim nhôm đa năng cao cấp-B', 'Giá đỡ laptop/Macbook chất liệu hợp kim nhôm cao cấp, thiết kế đa năng, giúp nâng cao hiệu suất làm việc và bảo vệ thiết bị khỏi quá nhiệt.', 400000,
(SELECT id FROM categories WHERE name = 'Accessories'), 180
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Giá đỡ Laptop/Macbook S-Case hợp kim nhôm đa năng cao cấp-B');

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/s/c/screenshot_6_4_1.jpg'
FROM products p WHERE p.name = 'Giá đỡ Laptop/Macbook S-Case hợp kim nhôm đa năng cao cấp-B';

-- Thêm sản phẩm Bộ dán full Macbook Air M2
INSERT INTO products (name, description, price, category_id, stock)
SELECT 'Bộ dán full Macbook Air M2 2022 13 inch JCPal 5 in 1', 'Bộ dán bảo vệ toàn diện cho Macbook Air M2 2022 13 inch, bao gồm 5 món: dán mặt trên, mặt dưới, bàn phím, màn hình và touchpad, giúp bảo vệ thiết bị khỏi trầy xước và bụi bẩn.', 855000,
(SELECT id FROM categories WHERE name = 'Accessories'), 250
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Bộ dán full Macbook Air M2 2022 13 inch JCPal 5 in 1');

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/2/8/28_2_58.jpg'
FROM products p WHERE p.name = 'Bộ dán full Macbook Air M2 2022 13 inch JCPal 5 in 1';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/2/9/29_2_52.jpg'
FROM products p WHERE p.name = 'Bộ dán full Macbook Air M2 2022 13 inch JCPal 5 in 1';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/2/7/27_2_60.jpg'
FROM products p WHERE p.name = 'Bộ dán full Macbook Air M2 2022 13 inch JCPal 5 in 1';

-- Thêm sản phẩm Loa Bluetooth JBL Flip Essential 2
INSERT INTO products (name, description, price, category_id, stock)
SELECT 'Loa Bluetooth JBL Flip Essential 2', 'Bluetooth JBL Flip Essential 2 chưa có cổng AUX 3.5mm để kết nối trực tiếp với laptop', 1990000,
(SELECT id FROM categories WHERE name = 'Accessories'), 120
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Loa Bluetooth JBL Flip Essential 2');

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/j/b/jbl_flip_essential_3.png'
FROM products p WHERE p.name = 'Loa Bluetooth JBL Flip Essential 2';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/j/b/jbl_flip_essential_1.png'
FROM products p WHERE p.name = 'Loa Bluetooth JBL Flip Essential 2';

INSERT INTO product_images (product_id, image_url)
SELECT p.id, 'https://cdn2.cellphones.com.vn/x/media/catalog/product/j/b/jbl_flip_essential_3.png'
FROM products p WHERE p.name = 'Loa Bluetooth JBL Flip Essential 2';