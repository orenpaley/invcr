DO $$
DECLARE
  user1_id UUID := uuid_generate_v4();
  user2_id UUID := uuid_generate_v4();
  client1_id UUID := uuid_generate_v4();
  client2_id UUID := uuid_generate_v4();
  invoice1_id UUID := uuid_generate_v4();
BEGIN

INSERT INTO users(id, email, password, name, address, phone, logo, is_admin)
VALUES (user1_id,
      'oepaley@gmail.com',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Oren Paley', 
        '12345 test st, anytown AA, 12345',
        '123-456-7890',
        'https://www.pixfiniti.com/wp-content/uploads/2020/06/small_house_logo_template_3.png',
        TRUE),
         (user2_id,
         'test@test.com',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Morgan Menley', 
        '1235 test ln, anytown AA, 12335',
        '123-456-7890',
        'https://www.pixfiniti.com/wp-content/uploads/2020/06/small_house_logo_template_3.png',
        FALSE);

INSERT INTO invoices (id, code, user_id, email, name, address, 
                client_name, client_address, client_email, date, due_date, 
                payment_terms, tax_rate, total, currency)
VALUES (invoice1_id, 'OP-001', user1_id, 'test@test.com', 'Oren Paley', '12345 test st, anytown AA, 12345', 'VIP', '157 Test VIP st, atown, TN, 22222',
      'test@tester.com', '2023-04-11','2023-05-11', 'net30', 0, 1600, 'USD');

INSERT INTO items (index, user_id, invoice_id, description, rate, quantity)
VALUES (1, user1_id, invoice1_id, 'item description 1', 50, 8),
       (2, user1_id, invoice1_id, 'item description 2', 50, 8),
       (3, user1_id, invoice1_id, 'item description 3', 50, 8),
       (4, user1_id, invoice1_id, 'item description 4', 50, 8);

INSERT INTO clients(id, user_id, name, email, address)
VALUES (client1_id, user1_id, 'VIP', 'test@tester.com', '157 Test VIP st, atown, TN, 22222'),
       (client2_id, user1_id, 'Mr. Client', 'test@test.com', '123 mrmr st');

END $$;