"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

class Invoice {
  static async save(
    userId,
    {
      clientId,
      code,
      email,
      firstName,
      lastName,
      address,
      logo = "https://www.pixfiniti.com/wp-content/uploads/2020/06/small_house_logo_template_3.png",
      clientName,
      clientAddress,
      clientEmail,
      date,
      dueDate,
      paymentTerms,
      submittedAt,
      terms,
      notes,
      taxRate,
      total,
      currency,
      status,
    }
  ) {
    const duplicateCheck = await db.query(
      `SELECT code
           FROM invoices
           WHERE code = $1 AND user_id = $2`,
      [code, +userId]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate invoice code: ${code}`);
    }

    if (clientId) {
      const clientQuery = await db.query(
        `SELECT name, address, email
                            FROM clients
                            WHERE id = $1 AND user_id = $2`,
        [clientId, +userId]
      );
      const client = clientQuery.rows[0];
      if (client.name) clientName = client.name;
      if (client.address) clientAddress = client.address;
      if (client.email) clientEmail = client.email;
    }

    let result = await db.query(
      `insert INTO invoices
        (user_id,
          client_id,
          code,
          email,
          first_name,
          last_name,
          address, 
          logo, 
          client_name,
          client_address, 
          client_email, 
          date, 
          due_date,
          payment_terms, 
          submitted_at, 
          terms, 
          notes, 
          tax_rate, 
          total, 
          currency, 
          status)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
        RETURNING user_id AS "userId", client_id AS "clientId", code, email, first_name AS "firstName",
        last_name AS "lastName", address,logo, client_name AS "clientName", client_address AS "clientAddress", 
        client_email AS "clientEmail", created_at AS "createdAt", date, due_date as "dueDate", payment_terms AS "paymentTerms", 
        submitted_at AS "submittedAt", terms, notes, tax_rate AS "taxRate", total, currency, status`,

      [
        +userId,
        clientId,
        code,
        email,
        firstName,
        lastName,
        address,
        logo,
        clientName,
        clientAddress,
        clientEmail,
        date,
        dueDate,
        paymentTerms,
        submittedAt,
        terms,
        notes,
        taxRate,
        total,
        currency,
        status,
      ]
    );
    const invoice = result.rows[0];

    return invoice;
  }

  /** Given an invoice code and user_id, return an invoice.
   *
   * Returns { invoice }

   * Throws NotFoundError if invoice not found.
   **/

  static async open(userId, code) {
    const invoiceRes = await db.query(
      `SELECT id, user_id AS "userId", client_id AS "clientId", code,
              email, first_name AS "firstName", last_name AS "lastName",
              address, logo, client_name AS "clientName", client_address AS "clientAddress", 
              client_email AS "clientEmail", created_at AS "createdAt", date, 
              due_date as "dueDate", payment_terms AS "paymentTerms", submitted_at AS "submittedAt", 
              terms, notes, tax_rate AS "taxRate", total, currency, status
              FROM invoices
      WHERE user_id = $1 AND code = $2`,
      [+userId, code]
    );

    const invoice = invoiceRes.rows[0];
    const itemQuery = `SELECT user_id AS "userId", invoice_id AS "invoiceId",
                              description, rate, quantity
                        FROM items
                        WHERE user_id = $1 AND invoice_id = $2`;
    const items = await db.query(itemQuery, [userId, invoice.id]);
    invoice.items = items.rows || [];

    if (!invoice) throw new NotFoundError(`No invoice for user found: ${code}`);

    return invoice;
  }

  /** Given a  user_id, return all invoices for that user .
   *   Given no user_id returns all invoices (admin only permissions should be enabled)
   *
   * Returns { first_name AS "firstName",
                last_name AS "lastName",
                client_name AS "clientName",
                created_at AS "createdAt",
                due_date AS "dueDate",
                total, 
                status}

   * Throws NotFoundError if no invoices found.
   **/

  static async findAll(userId = null) {
    if (!userId) {
      const invoicesRes = await db.query(
        `SELECT code,
                first_name AS "firstName",
                last_name AS "lastName",
                client_name AS "clientName",
                created_at AS "createdAt",
                due_date AS "dueDate",
                total, 
                status
             FROM invoices
             `
      );
    }
    const invoicesRes = await db.query(
      `SELECT code,
                first_name AS "firstName",
                last_name AS "lastName",
                client_name AS "clientName",
                created_at AS "createdAt",
                due_date AS "dueDate",
                total, 
                status
             FROM invoices
             WHERE user_id = $1`,
      [userId]
    );

    const invoices = invoicesRes.rows;

    if (!invoices) throw new NotFoundError(`No invoices found`);

    return invoices;
  }

  /** Given an invoice code and user_id, modify data about user.
   *
   * Returns { code, first_name, last_name, address,
   *           client_name, client_email, created_at}

   * Throws NotFoundError if user not found.
   **/

  static async update(userId, code, data) {
    const formattedSql = sqlForPartialUpdate(data, {
      clientId: "client_id",
      firstName: "first_name",
      lastName: "last_name",
      clientName: "client_name",
      clientAddress: "client_address",
      clientEmail: "client_email",
      createdAt: "created_at",
      dueDate: "due_date",
      paymentTerms: "payment_terms",
      submittedAt: "submitted_at",
      taxRate: "tax_rate",
    });
    const userIdx = "$" + (formattedSql.values.length + 1);
    const codeIdx = "$" + (formattedSql.values.length + 2);

    const querySql = `UPDATE invoices
                      SET ${formattedSql.setCols} 
                      WHERE user_id = ${userIdx} AND code = ${codeIdx}
                      RETURNING code, first_name AS "firstName", last_name AS "lastName", address, client_name AS "clientName",
                  client_email as "clientEmail", created_at as "createdAt"`;
    const result = await db.query(querySql, [
      ...formattedSql.values,
      +userId,
      code,
    ]);
    const invoice = result.rows[0];

    if (!invoice) throw new NotFoundError(`No user: ${userId}`);

    return invoice;
  }

  static async addItem(invoiceId, description, rate, quantity) {
    const itemQuery = `INSERT INTO items (invoice_id, description, rate, quantity)
                        VALUES ($1,$2,$3,$4)
                        RETURNING invoice_id AS "invoiceId", description, rate, quantity`;
    const result = await db.query(itemQuery, [
      invoiceId,
      description,
      rate,
      quantity,
    ]);
    const item = result.rows[0];
    return item;
  }

  static async deleteItem(id) {
    await db.query(`DELETE FROM items WHERE id = $1`, [id]);
    return `deleted item`;
  }

  static async getItems(userId, invoiceId) {
    const itemQuery = `SELECT (user_id AS "userId", invoice_id AS "invoiceId",
                              description, rate, quantity)
                        FROM items
                        Where user_id = $1 AND invoice_id = $2`;

    const result = await db.query(itemQuery, [userId, invoiceId]);
    const items = result.rows;
    return items;
  }
}

module.exports = Invoice;
