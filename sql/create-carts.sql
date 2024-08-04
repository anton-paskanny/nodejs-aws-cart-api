CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE status_type AS ENUM ('OPEN', 'ORDERED');

CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    created_at DATE NOT NULL,
    updated_at DATE NOT NULL,
    status status_type NOT NULL DEFAULT 'OPEN',
    FOREIGN KEY (user_id) REFERENCES users (id)
);