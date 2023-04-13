INSERT INTO users(email, password, first_name, last_name, address, phone, logo, is_admin)
VALUES ('oepaley@gmail.com',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Oren', 
        'Paley', 
        '2908 st. philip st, New Orleans, 70119',
        '818-921-5550',
        'https://www.pixfiniti.com/wp-content/uploads/2020/06/small_house_logo_template_3.png',
        TRUE),
         ('test@test.com',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Morgan', 
        'Menley', 
        '2908 st. philip st, New Orleans, 70119',
        '818-921-5550',
        'https://www.pixfiniti.com/wp-content/uploads/2020/06/small_house_logo_template_3.png',
        FALSE);

INSERT INTO invoices (user_id, code, email, first_name, last_name, address, 
                client_name, client_address, client_email, date, due_date, 
                payment_terms, tax_rate, total, currency)
VALUES (1, 'OP-001', 'oepaley@gmail.com', 'Oren', 'Paley', '123 test st', 'VIP', '157 Test VIP st',
      'oepaley@gmail.com', '2023-04-11','2023-05-11', 'net30', 0, 0, 'USD');

INSERT INTO items (user_id, invoice_id, description, rate, quantity)
VALUES (1, 1, 'item description 1', 50, 8),
       (1, 1, 'item description 2', 50, 8),
       (1, 1, 'item description 3', 50, 8),
       (1, 1, 'item description 4', 50, 8);

INSERT INTO clients(user_id, name, email, address)
VALUES (1, "VIP", "oepaley@gmail.com", "123 VIP st"),
       (1, "Mr. Client", "oepaley@gmail.com", "123 mrmr st");