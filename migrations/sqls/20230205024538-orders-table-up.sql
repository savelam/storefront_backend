CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    status VARCHAR(100)  NULL,
    user_id bigint REFERENCES users(id),
    product_id bigint REFERENCES products(id)
);