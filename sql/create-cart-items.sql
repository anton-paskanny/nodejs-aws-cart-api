CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE cart_items (
    cart_id UUID NOT NULL,
    product_id UUID NOT NULL,
    count INTEGER NOT NULL CHECK (count > 0),
    FOREIGN KEY (cart_id) REFERENCES carts (id) ON DELETE CASCADE
);