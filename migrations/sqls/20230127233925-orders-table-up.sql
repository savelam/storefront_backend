/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    status VARCHAR(100) NOT NULL,
    user_id bigint REFERENCES users(id)
);
