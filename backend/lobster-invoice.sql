
\echo 'Delete and recreate lobster-invoice db?'
\prompt 'Return for yes or control-C to cancel > ' foo


DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE; 
CREATE EXTENSION "uuid-ossp"; 

DROP DATABASE lobsterinvoice;
CREATE DATABASE lobsterinvoice;
\connect lobsterinvoice

\i lobster-invoice-schema.sql
\i lobster-invoice-seed.sql

\echo 'Delete and recreate lobster-invoice-test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE lobsterinvoicetest;
CREATE DATABASE lobsterinvoicetest;
\connect lobsterinvoicetest

\i lobster-invoice-schema.sql
