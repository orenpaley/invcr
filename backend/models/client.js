const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

class Client {
  static async save(userId, { name, address, email }) {
    const userCheck = await db.query(`select id FROM users WHERE id = $1`, [
      +userId,
    ]);
    if (!userCheck.rows[0]) {
      throw NotFoundError(`user not found - id:${id}`);
    }
    const clientQuery = await db.query(
      `INSERT INTO clients (user_id, name, address, email)
          VALUES($1,$2,$3,$4)
          RETURNING (name)`,
      [+userId, name, address, email]
    );
    return clientQuery.rows[0];
  }

  static async findAll(userId) {
    const userCheck = await db.query(`select id FROM users WHERE id = $1`, [
      +userId,
    ]);
    if (!userCheck.rows[0]) {
      throw NotFoundError(`user not found - id:${userId}`);
    }

    const clientsQuery = await db.query(
      `SELECT id, name, address, email FROM clients
        WHERE user_id = $1`,
      [+userId]
    );
    console.log("clientsQuery --->", clientsQuery.rows);
    for (let client of clientsQuery.rows) {
      console.log("client ---> ", client.id);
      const totalQuery = await db.query(
        `SELECT total 
           FROM invoices
           WHERE user_id = $1 AND client_id = $2`,
        [+userId, client.id]
      );
      console.log("totalQuery ---->>>", totalQuery.rows);
      for (let invoice of totalQuery.rows) {
        if (client.total) client.total += +invoice.total;
        else client.total = +invoice.total || 0;
      }
    }

    return clientsQuery.rows;
  }

  static async open(userId, id) {
    const userCheck = await db.query(`select id FROM users WHERE id = $1`, [
      +userId,
    ]);
    if (!userCheck.rows[0]) {
      throw NotFoundError(`user not found - id:${id}`);
    }
    const clientQuery = await db.query(
      `SELECT name, address, email FROM clients
        WHERE user_id = $1 AND id = $2`,
      [+userId, +id]
    );
    return clientQuery.rows[0];
  }

  static async update(userId, id, data) {
    const formattedSql = sqlForPartialUpdate(data, {
      userId: "user_id",
    });
    const userIdx = "$" + (formattedSql.values.length + 1);
    const keyIdx = "$" + (formattedSql.values.length + 2);

    const querySql = `UPDATE clients
                    SET ${formattedSql.setCols} 
                    WHERE user_id = ${userIdx} AND id = ${keyIdx}
                    RETURNING user_id AS "userId", name, email, address`;
    const result = await db.query(querySql, [
      ...formattedSql.values,
      +userId,
      +id,
    ]);
    const client = result.rows[0];

    if (!client) throw new NotFoundError(`No client: ${id}`);

    return client;
  }

  static async remove(userId, id) {
    const delQuery = await db.query(
      `DELETE from clients WHERE user_id = $1 AND id = $2 RETURNING name`,
      [+userId, +id]
    );
    return `deleted Client: ${delQuery.rows[0].name}`;
  }
}

module.exports = Client;
