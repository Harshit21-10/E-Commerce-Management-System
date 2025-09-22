-- Insert admin user
INSERT INTO admins (admin_id, admin_name, admin_email, admin_password)
VALUES (1, 'admin123', 'admin@gmail.com', 'admin123')
ON DUPLICATE KEY UPDATE admin_id=admin_id;

-- Insert product owners
INSERT INTO product_owners (product_owner_id, product_owner_name, product_owner_email, product_owner_password, product_owner_number)
VALUES 
(1, 'Electronics Store', 'electronics@store.com', 'pass123', 1234567890),
(2, 'Fashion Boutique', 'fashion@boutique.com', 'pass123', 1234567891),
(3, 'Home Store', 'home@store.com', 'pass123', 1234567892),
(4, 'Sports Shop', 'sports@shop.com', 'pass123', 1234567893),
(5, 'Book Store', 'books@store.com', 'pass123', 1234567894)
ON DUPLICATE KEY UPDATE product_owner_id=product_owner_id;

-- Electronics Category
INSERT INTO products (name, description, price, stock, category, available, approved, product_owner_id, status, product_image)
VALUES 
('MacBook Pro M2', 'Latest MacBook Pro with M2 chip, 16GB RAM, 512GB SSD', 1499.99, 10, 'Electronics', true, true, 1, 'APPROVED', 
 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800&q=80&auto=format&fit=crop'),
('Samsung QLED 4K TV', '65-inch QLED 4K Smart TV with HDR', 1299.99, 15, 'Electronics', true, true, 1, 'APPROVED',
 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80&auto=format&fit=crop'),
('Sony WH-1000XM4', 'Wireless Noise Cancelling Headphones', 349.99, 30, 'Electronics', true, true, 1, 'APPROVED',
 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80&auto=format&fit=crop'),
('iPad Air', '10.9-inch iPad Air with M1 chip, 256GB', 749.99, 20, 'Electronics', true, true, 1, 'APPROVED',
 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80&auto=format&fit=crop'),
('DJI Mini 3 Pro', 'Lightweight drone with 4K camera', 759.99, 8, 'Electronics', true, true, 1, 'APPROVED',
 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&q=80&auto=format&fit=crop');

-- Insert product sizes for relevant categories
INSERT INTO product_sizes (product_id, size)
SELECT id, 'M' FROM products WHERE category = 'Electronics'
UNION ALL
SELECT id, 'L' FROM products WHERE category = 'Electronics';

-- Insert product colors for relevant categories
INSERT INTO product_colors (product_id, color)
SELECT id, 'Black' FROM products WHERE category = 'Electronics'
UNION ALL
SELECT id, 'White' FROM products WHERE category = 'Electronics';

-- Fashion Category
INSERT INTO products (name, description, price, stock, category, available, approved, product_owner_id, status, product_image)
VALUES 
('Designer Leather Jacket', 'Premium leather jacket with quilted lining', 299.99, 20, 'Fashion', true, true, 2, 'APPROVED',
 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80&auto=format&fit=crop'),
('Silk Evening Dress', 'Elegant silk evening dress in midnight blue', 199.99, 15, 'Fashion', true, true, 2, 'APPROVED',
 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80&auto=format&fit=crop'),
('Italian Leather Shoes', 'Handcrafted leather oxford shoes', 159.99, 30, 'Fashion', true, true, 2, 'APPROVED',
 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80&auto=format&fit=crop'),
('Designer Handbag', 'Luxury leather handbag with gold hardware', 399.99, 10, 'Fashion', true, true, 2, 'APPROVED',
 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80&auto=format&fit=crop'),
('Cashmere Sweater', 'Pure cashmere sweater in classic design', 249.99, 25, 'Fashion', true, true, 2, 'APPROVED',
 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&q=80&auto=format&fit=crop'),
('Premium Denim Jeans', 'High-quality selvedge denim jeans', 129.99, 40, 'Fashion', true, true, 2, 'APPROVED',
 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80&auto=format&fit=crop'),
('Designer Watch', 'Luxury automatic watch with leather strap', 599.99, 8, 'Fashion', true, true, 2, 'APPROVED',
 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80&auto=format&fit=crop'),
('Silk Scarf', 'Hand-painted silk scarf', 89.99, 30, 'Fashion', true, true, 2, 'APPROVED',
 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80&auto=format&fit=crop'),
('Designer Sunglasses', 'Premium acetate frame sunglasses', 179.99, 20, 'Fashion', true, true, 2, 'APPROVED',
 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80&auto=format&fit=crop'),
('Leather Belt', 'Italian leather belt with designer buckle', 79.99, 35, 'Fashion', true, true, 2, 'APPROVED',
 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80&auto=format&fit=crop');

-- Home & Living Category
INSERT INTO products (name, description, price, stock, category, available, approved, product_owner_id, status, product_image)
VALUES 
('Modern Sofa Set', 'Contemporary 3-piece sofa set in grey', 1299.99, 5, 'Home & Living', true, true, 3, 'APPROVED',
 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80&auto=format&fit=crop'),
('Queen Size Bed', 'Premium memory foam mattress with frame', 899.99, 8, 'Home & Living', true, true, 3, 'APPROVED',
 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80&auto=format&fit=crop'),
('Smart LED Chandelier', 'WiFi-enabled LED chandelier with app control', 299.99, 15, 'Home & Living', true, true, 3, 'APPROVED',
 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80&auto=format&fit=crop'),
('Kitchen Set', 'Complete stainless steel cookware set', 399.99, 12, 'Home & Living', true, true, 3, 'APPROVED',
 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80&auto=format&fit=crop'),
('Dining Table Set', '6-seater wooden dining set', 799.99, 6, 'Home & Living', true, true, 3, 'APPROVED',
 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80&auto=format&fit=crop'),
('Persian Carpet', 'Hand-knotted wool carpet 6x9 ft', 1499.99, 4, 'Home & Living', true, true, 3, 'APPROVED',
 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=800&q=80&auto=format&fit=crop'),
('Smart Coffee Maker', 'WiFi-enabled premium coffee maker', 199.99, 20, 'Home & Living', true, true, 3, 'APPROVED',
 'https://images.unsplash.com/photo-1520970014086-2208d157c9e2?w=800&q=80&auto=format&fit=crop'),
('Air Purifier', 'HEPA air purifier with PM2.5 filter', 299.99, 15, 'Home & Living', true, true, 3, 'APPROVED',
 'https://images.unsplash.com/photo-1585157603291-a3250c1e2c43?w=800&q=80&auto=format&fit=crop'),
('Bedding Set', 'Egyptian cotton king size bedding set', 149.99, 25, 'Home & Living', true, true, 3, 'APPROVED',
 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80&auto=format&fit=crop'),
('Wall Art Set', 'Modern abstract canvas art set of 3', 199.99, 10, 'Home & Living', true, true, 3, 'APPROVED',
 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80&auto=format&fit=crop');

-- Sports & Fitness Category
INSERT INTO products (name, description, price, stock, category, available, approved, product_owner_id, status, product_image)
VALUES 
('Smart Treadmill', 'Foldable treadmill with LCD display', 999.99, 8, 'Sports & Fitness', true, true, 4, 'APPROVED',
 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80&auto=format&fit=crop'),
('Yoga Set', 'Complete yoga set with mat and blocks', 79.99, 30, 'Sports & Fitness', true, true, 4, 'APPROVED',
 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80&auto=format&fit=crop'),
('Dumbbells Set', 'Adjustable dumbbells 5-25kg pair', 299.99, 15, 'Sports & Fitness', true, true, 4, 'APPROVED',
 'https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=800&q=80&auto=format&fit=crop'),
('Tennis Racket', 'Professional carbon fiber tennis racket', 199.99, 20, 'Sports & Fitness', true, true, 4, 'APPROVED',
 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&q=80&auto=format&fit=crop'),
('Basketball', 'Official size indoor/outdoor basketball', 29.99, 50, 'Sports & Fitness', true, true, 4, 'APPROVED',
 'https://images.unsplash.com/photo-1519861155730-0b5fbf0dd889?w=800&q=80&auto=format&fit=crop'),
('Cycling Bike', 'Indoor cycling bike with resistance', 599.99, 10, 'Sports & Fitness', true, true, 4, 'APPROVED',
 'https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=800&q=80&auto=format&fit=crop'),
('Golf Club Set', 'Complete golf club set with bag', 899.99, 5, 'Sports & Fitness', true, true, 4, 'APPROVED',
 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80&auto=format&fit=crop'),
('Fitness Tracker', 'Smart fitness band with heart rate monitor', 99.99, 40, 'Sports & Fitness', true, true, 4, 'APPROVED',
 'https://images.unsplash.com/photo-1557935728-e6d1eaabe558?w=800&q=80&auto=format&fit=crop'),
('Boxing Gloves', 'Professional leather boxing gloves', 79.99, 25, 'Sports & Fitness', true, true, 4, 'APPROVED',
 'https://images.unsplash.com/photo-1583473848882-f9f81e434648?w=800&q=80&auto=format&fit=crop'),
('Rowing Machine', 'Magnetic resistance rowing machine', 799.99, 8, 'Sports & Fitness', true, true, 4, 'APPROVED',
 'https://images.unsplash.com/photo-1540558870477-e8c59bf88421?w=800&q=80&auto=format&fit=crop');

-- Books Category
INSERT INTO products (name, description, price, stock, category, available, approved, product_owner_id, status, product_image)
VALUES 
('The Art of Programming', 'Comprehensive guide to modern programming', 49.99, 30, 'Books', true, true, 5, 'APPROVED',
 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&q=80&auto=format&fit=crop'),
('World History Collection', 'Complete 5-volume world history set', 129.99, 15, 'Books', true, true, 5, 'APPROVED',
 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=800&q=80&auto=format&fit=crop'),
('Cooking Masterclass', 'Professional cooking techniques and recipes', 39.99, 40, 'Books', true, true, 5, 'APPROVED',
 'https://images.unsplash.com/photo-1589634749000-1e72ec00a13f?w=800&q=80&auto=format&fit=crop'),
('Science Encyclopedia', 'Illustrated science encyclopedia', 59.99, 25, 'Books', true, true, 5, 'APPROVED',
 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80&auto=format&fit=crop'),
('Business Strategy', 'Modern business strategy and management', 44.99, 35, 'Books', true, true, 5, 'APPROVED',
 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&q=80&auto=format&fit=crop'),
('Classic Literature Set', '10 classic literature masterpieces', 99.99, 20, 'Books', true, true, 5, 'APPROVED',
 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80&auto=format&fit=crop'),
('Art & Design', 'Contemporary art and design collection', 79.99, 15, 'Books', true, true, 5, 'APPROVED',
 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80&auto=format&fit=crop'),
('Self-Development', 'Personal growth and development guide', 29.99, 50, 'Books', true, true, 5, 'APPROVED',
 'https://images.unsplash.com/photo-1544716278-e513176f20b5?w=800&q=80&auto=format&fit=crop'),
('Photography Guide', 'Professional photography techniques', 49.99, 25, 'Books', true, true, 5, 'APPROVED',
 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&q=80&auto=format&fit=crop'),
('Fiction Bestsellers', 'Top 5 fiction bestsellers collection', 89.99, 30, 'Books', true, true, 5, 'APPROVED',
 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80&auto=format&fit=crop');

-- Insert test product owners
INSERT INTO product_owners (product_owner_id, name, email) VALUES
(1, 'Test Owner 1', 'owner1@test.com'),
(2, 'Test Owner 2', 'owner2@test.com');

-- Insert test products with Unsplash images
INSERT INTO products (name, description, price, stock, category, available, approved, product_owner_id, product_image) VALUES
('Modern Laptop', 'High-performance laptop with latest features', 1299.99, 50, 'electronics', true, true, 1, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853'),
('Stylish Watch', 'Elegant timepiece for any occasion', 299.99, 100, 'accessories', true, true, 1, 'https://images.unsplash.com/photo-1524805444758-089113d48a6d'),
('Coffee Maker', 'Premium coffee machine for perfect brews', 199.99, 30, 'appliances', true, true, 2, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085'),
('Wireless Headphones', 'High-quality sound with noise cancellation', 249.99, 75, 'electronics', true, true, 2, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'),
('Smart Watch', 'Track your fitness and stay connected', 399.99, 60, 'electronics', true, true, 1, 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a');

-- Insert product sizes
INSERT INTO product_sizes (product_id, size) VALUES
(1, '15 inch'),
(1, '17 inch'),
(2, 'One Size'),
(3, 'Standard'),
(4, 'One Size'),
(5, '40mm'),
(5, '44mm');

-- Insert product colors
INSERT INTO product_colors (product_id, color) VALUES
(1, 'Silver'),
(1, 'Space Gray'),
(2, 'Gold'),
(2, 'Silver'),
(3, 'Black'),
(3, 'White'),
(4, 'Black'),
(4, 'White'),
(5, 'Black'),
(5, 'Silver'); 