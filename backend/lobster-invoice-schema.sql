CREATE TABLE users (
  "id" serial PRIMARY KEY,
  "email" varchar(255) UNIQUE NOT NULL,
  "password" text NOT NULL,
  "first_name" varchar(255) NOT NULL,
  "last_name" varchar(255) NOT NULL,
  "address" varchar(800),
  "phone" varchar(50),
  "logo" varchar(800),
  "is_admin" BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE clients (
  "id" serial PRIMARY KEY,
  "user_id" integer,
  "name" varchar(255),
  "address" varchar(800),
  "email" varchar(255),
  "created_at" timestamp NOT NULL DEFAULT NOW()
);

CREATE TABLE invoices (
  "id" serial PRIMARY KEY,
  "user_id" integer,
  "client_id" integer,
  "code" varchar(50),
  "email" varchar(255),
  "first_name" varchar(255),
  "last_name" varchar(255),
  "address" varchar(400),
 "city_state_zip" varchar(400),
  "logo" varchar(800) NOT NULL DEFAULT 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
  "client_name" varchar(255),
  "client_address" varchar(800),
  "client_city_state_zip" varchar(800),
  "client_email" varchar(255),
  "created_at" timestamp NOT NULL DEFAULT NOW(),
  "date" date NOT NULL,
  "due_date" date,
  "payment_terms" varchar(50),
  "submitted_at" timestamp,
  "terms" varchar(800),
  "notes" text,
  "tax_rate" decimal DEFAULT 0,
  "total" decimal DEFAULT 0,
  "currency" varchar(5),
  "status" varchar(50)
);

CREATE TABLE items (
  "index" integer NOT NULL,
  "user_id" integer NOT NULL, 
  "invoice_id" integer NOT NULL,
  "description" text,
  "rate" decimal NOT NULL,
  "quantity" decimal NOT NULL
);

ALTER TABLE invoices ADD FOREIGN KEY ("client_id")  REFERENCES clients ("id") ON DELETE CASCADE;

ALTER TABLE invoices ADD FOREIGN KEY ("user_id") REFERENCES users ("id") ON DELETE CASCADE;

ALTER TABLE clients ADD FOREIGN KEY ("user_id") REFERENCES users ("id") ON DELETE CASCADE;

ALTER TABLE items ADD FOREIGN KEY ("invoice_id") REFERENCES invoices ("id") ON DELETE CASCADE;

ALTER TABLE items ADD FOREIGN KEY ("user_id") REFERENCES users ("id") ON DELETE CASCADE;

