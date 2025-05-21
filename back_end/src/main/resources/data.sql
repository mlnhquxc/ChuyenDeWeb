
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
SELECT 'Tablets', 'Tablet computers and accessories' FROM dual
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Tablets');

INSERT INTO categories (name, description)
SELECT 'Accessories', 'Computer and mobile accessories' FROM dual
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Accessories');

INSERT INTO categories (name, description)
SELECT 'Gaming', 'Gaming equipment and accessories' FROM dual
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Gaming');

-- Thêm sản phẩm mẫu
-- Tạm thời bỏ qua phần này vì có thể gây lỗi trùng lặp
-- Có thể bật lại sau khi đã kiểm tra hoặc tạo thêm điều kiện kiểm tra 

INSERT INTO categories (name, description) VALUES ('Laptop', 'Laptop');
INSERT INTO categories (name, description) VALUES ('Laptop Gaming', 'Laptop Gaming');
INSERT INTO categories (name, description) VALUES ('PC GVN', 'PC GVN');
INSERT INTO categories (name, description) VALUES ('Main, CPU, VGA', 'Mainboard, CPU, Card đồ họa');
INSERT INTO categories (name, description) VALUES ('Case, Nguồn, Tản', 'Case, Power, Cooling');
INSERT INTO categories (name, description) VALUES ('Ổ cứng, RAM, Thẻ nhớ', 'Storage, RAM, Memory Card');
INSERT INTO categories (name, description) VALUES ('Loa, Micro, Webcam', 'Speaker, Microphone, Webcam');
INSERT INTO categories (name, description) VALUES ('Màn hình', 'Monitor');
INSERT INTO categories (name, description) VALUES ('Bàn phím', 'Keyboard');
INSERT INTO categories (name, description) VALUES ('Chuột + Lót chuột', 'Mouse and Mousepad');
INSERT INTO categories (name, description) VALUES ('Tai Nghe', 'Headphone');
INSERT INTO categories (name, description) VALUES ('Ghế - Bàn', 'Chair and Desk');
INSERT INTO categories (name, description) VALUES ('Phần mềm, mạng', 'Software and Network');
INSERT INTO categories (name, description) VALUES ('Handheld, Console', 'Handheld and Console');
INSERT INTO categories (name, description) VALUES ('Phụ kiện (Hub, sạc, cáp..)', 'Accessories (Hub, charger, cable, etc.)');
