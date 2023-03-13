/* Replace with your SQL commands */
ALTER TABLE orders 
    ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES products(id), 
    ADD COLUMN IF NOT EXISTS quantity INTEGER CHECK (quantity > 0), 
    ADD COLUMN IF NOT EXISTS cost NUMERIC(1000, 2) CHECK(cost > 0);