CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  "id" uuid DEFAULT uuid_generate_v4(),
  "email" varchar(255) UNIQUE NOT NULL,
  "password" text NOT NULL,
  "name" varchar(255) NOT NULL,
  "address" varchar(800),
  "phone" varchar(50),
  "logo" varchar(800),
  "is_admin" BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY ("id")
);

CREATE TABLE clients (
  "id" uuid DEFAULT uuid_generate_v4(),
  "user_id" uuid,
  "name" varchar(255),
  "address" varchar(800),
  "email" varchar(255),
  "created_at" timestamp NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("id"),
  FOREIGN KEY ("user_id") REFERENCES users ("id") ON DELETE CASCADE
);

CREATE TABLE invoices (
  "id" uuid DEFAULT uuid_generate_v4(),
  "user_id" uuid,
  "code" varchar(50) UNIQUE,
  "email" varchar(255),
  "name" varchar(255),
  "address" varchar(400),
  "logo" varchar(800) NOT NULL DEFAULT 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
  "client_name" varchar(255),
  "client_address" varchar(800),
  "client_email" varchar(255),
  "created_at" timestamp NOT NULL DEFAULT NOW(),
  "date" date NOT NULL,
  "due_date" date,
  "payment_terms" varchar(50),
  "submitted_at" timestamp,
  "terms" text,
  "notes" text,
  "tax_rate" decimal DEFAULT 0,
  "subtotal" decimal DEFAULT 0,
  "total" decimal DEFAULT 0,
  "currency" varchar(5),
  "status" varchar(50),
  PRIMARY KEY ("id"),
  FOREIGN KEY ("user_id") REFERENCES users ("id") ON DELETE CASCADE

);

CREATE TABLE items (
  "index" integer NOT NULL,
  "user_id" uuid NOT NULL, 
  "invoice_id" uuid NOT NULL,
  "description" text,
  "rate" decimal NOT NULL,
  "quantity" decimal NOT NULL,
  PRIMARY KEY ("index", "user_id", "invoice_id"),
  FOREIGN KEY ("user_id") REFERENCES users ("id") ON DELETE CASCADE,
  FOREIGN KEY ("invoice_id") REFERENCES invoices ("id") ON DELETE CASCADE
);
