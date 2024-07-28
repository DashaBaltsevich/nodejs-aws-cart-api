CREATE TABLE orders (
    id UUID PRIMARY KEY default uuid_generate_v4(),
    user_id UUID REFERENCES users(id) NOT NULL,
    cart_id UUID REFERENCES carts(id) NOT NULL,
    payment JSON NOT NULL,
    delivery JSON NOT NULL,
    comments TEXT,
    status statuses NOT NULL,
    total INTEGER NOT NULL
);