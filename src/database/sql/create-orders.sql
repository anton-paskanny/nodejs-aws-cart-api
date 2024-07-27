CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    cart_id UUID NOT NULL,
    payment JSON NOT NULL,
    delivery JSON NOT NULL,
    comments TEXT,
    status status_type NOT NULL,
    total INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (cart_id) REFERENCES carts (id)
);