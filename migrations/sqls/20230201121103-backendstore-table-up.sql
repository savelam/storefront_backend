CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    available_quantity INTEGER,
    price INTEGER
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    password VARCHAR(255)
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    status VARCHAR(100) NOT NULL,
    user_id bigint REFERENCES users(id)
);

CREATE TABLE order_products (
    id SERIAL PRIMARY KEY,
    quantity integer,
    order_id bigint REFERENCES orders(id),
    product_id bigint REFERENCES products(id)
);

