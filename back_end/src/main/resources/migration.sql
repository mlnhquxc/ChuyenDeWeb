-- Migration script to fix decimal precision issues
-- This script updates the decimal column definitions to handle larger amounts

-- Update products table
ALTER TABLE products MODIFY COLUMN price DECIMAL(15,2) NOT NULL;
ALTER TABLE products MODIFY COLUMN original_price DECIMAL(15,2);

-- Update orders table
ALTER TABLE orders MODIFY COLUMN total_amount DECIMAL(15,2) NOT NULL;
ALTER TABLE orders MODIFY COLUMN shipping_fee DECIMAL(15,2) DEFAULT 0;
ALTER TABLE orders MODIFY COLUMN discount_amount DECIMAL(15,2) DEFAULT 0;
ALTER TABLE orders MODIFY COLUMN tax_amount DECIMAL(15,2) DEFAULT 0;

-- Update order_details table
ALTER TABLE order_details MODIFY COLUMN price DECIMAL(15,2) NOT NULL;
ALTER TABLE order_details MODIFY COLUMN subtotal DECIMAL(15,2) NOT NULL;