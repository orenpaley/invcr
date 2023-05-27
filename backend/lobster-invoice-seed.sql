INSERT INTO users(email, password, name, address, phone, logo, is_admin)
VALUES ('oepaley@gmail.com',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Oren Paley', 
        '12345 test st, anytown AA, 12345',
        '123-456-7890',
        'https://www.pixfiniti.com/wp-content/uploads/2020/06/small_house_logo_template_3.png',
        TRUE),
         ('test@test.com',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Morgan Menley', 
        '1235 test ln, anytown AA, 12335',
        '123-456-7890',
        'https://www.pixfiniti.com/wp-content/uploads/2020/06/small_house_logo_template_3.png',
        FALSE);

INSERT INTO invoices (user_id, code, email, name, address, 
                client_name, client_address, client_email, date, due_date, 
                payment_terms, tax_rate, total, currency)
VALUES (1, 'OP-001', 'test@test.com', 'Oren Paley', '12345 test st, anytown AA, 12345', 'VIP', '157 Test VIP st, atown, TN, 22222',
      'test@tester.com', '2023-04-11','2023-05-11', 'net30', 0, 1600, 'USD');

INSERT INTO items (index, user_id, invoice_id, description, rate, quantity)
VALUES (1, 1, 1, 'item description 1', 50, 8),
       (2, 1, 1, 'item description 2', 50, 8),
       (3, 1, 1, 'item description 3', 50, 8),
       (4, 1, 1, 'item description 4', 50, 8);

INSERT INTO clients(user_id, name, email, address)
VALUES (1, 'VIP', 'test@tester.com', '157 Test VIP st, atown, TN, 22222'),
       (1, 'Mr. Client', 'test@test.com', '123 mrmr st');