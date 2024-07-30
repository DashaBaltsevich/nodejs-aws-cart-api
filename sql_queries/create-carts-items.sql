DROP TYPE IF EXIST statuses;
CREATE TYPE statuses AS ENUM ('OPEN', 'ORDERED');

CREATE TABLE carts (
    id UUID PRIMARY KEY default uuid_generate_v4(),
    user_id UUID NOT NULL,
    created_at DATE NOT NULL,
    updated_at DATE NOT NULL,
    status statuses NOT NULL
)

CREATE TABLE cart_items (
   cart_id UUID NOT NULL,
   product_id UUID NOT null DEFAULT uuid_generate_v4(),
   count INTEGER NOT NULL,
   FOREIGN KEY (cart_id) REFERENCES carts(id)
)