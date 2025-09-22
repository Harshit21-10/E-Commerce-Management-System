-- Create product_owners table
CREATE TABLE IF NOT EXISTS product_owners (
    product_owner_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_owner_name VARCHAR(255) NOT NULL,
    product_owner_email VARCHAR(255) NOT NULL UNIQUE,
    product_owner_password VARCHAR(255) NOT NULL,
    product_owner_number BIGINT NOT NULL UNIQUE
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT,
    category VARCHAR(255),
    available BOOLEAN NOT NULL DEFAULT FALSE,
    approved BOOLEAN NOT NULL DEFAULT FALSE,
    product_owner_id BIGINT,
    product_image LONGTEXT,
    status VARCHAR(50) DEFAULT 'PENDING',
    FOREIGN KEY (product_owner_id) REFERENCES product_owners(product_owner_id)
);

-- Create product_sizes table
CREATE TABLE IF NOT EXISTS product_sizes (
    product_id BIGINT,
    size VARCHAR(50),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create product_colors table
CREATE TABLE IF NOT EXISTS product_colors (
    product_id BIGINT,
    color VARCHAR(50),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
    admin_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    admin_name VARCHAR(255) NOT NULL,
    admin_email VARCHAR(255) NOT NULL UNIQUE,
    admin_password VARCHAR(255) NOT NULL
); 