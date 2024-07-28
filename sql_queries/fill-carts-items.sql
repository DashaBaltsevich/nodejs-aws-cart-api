-- Insert sample data into the carts table
INSERT INTO carts (user_id, created_at, updated_at, status)
VALUES
    (uuid_generate_v4(), '2024-07-23', '2024-07-23', 'OPEN'),
    (uuid_generate_v4(), '2024-07-23', '2024-07-23', 'ORDERED');

-- Insert sample data into the cart_items table
INSERT INTO cart_items (cart_id, product_id, count)
VALUES
    ('65e84a41-7ad5-4afc-81e5-7de79ed269bd', uuid_generate_v4(), 2),
    ('207d14ad-9394-4710-a606-b80a9d33414c', uuid_generate_v4(), 1),
    ('aaeb354d-850a-4ac2-a446-cc22c7b10eb6', uuid_generate_v4(), 5);