CREATE TABLE IF NOT EXISTS  products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    available_quantity INTEGER,
    price INTEGER
);