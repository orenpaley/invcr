"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class User {
  /** authenticate user with email, password.
   *
   * Returns { email, name, address, phone, logo, is_admin }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(email, password) {
    // try to find the user first
    const result = await db.query(
      `SELECT email,
              id,
              password,
              name,
              address,
              phone, 
              logo,
              is_admin AS "isAdmin"
           FROM users
           WHERE email = $1`,
      [email]
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }
    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register user with data.
   *
   * Returns { email, name, address , phone, logo, isAdmin }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register({ email, password, name, address, isAdmin = false }) {
    const duplicateCheck = await db.query(
      `SELECT email
           FROM users
           WHERE email = $1`,
      [email]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${email}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users
           (email,
            password,
            name,
            address)
           VALUES ($1, $2, $3, $4)
           RETURNING email, name, address`,
      [email, hashedPassword, name, address]
    );

    const user = result.rows[0];
    delete user.hashedPassword;

    return user;
  }

  /** Find all users.
   *
   * Returns [{ email, name, is_admin }, ...]
   **/

  static async findAll() {
    const result = await db.query(
      `SELECT id, 
              email,
              name,
              is_admin AS "isAdmin"
           FROM users
           `
    );

    return result.rows;
  }

  /** Given an email, return data about user.
   *
   * Returns { email, name, address, phone, logo, is_admin}

   * Throws NotFoundError if user not found.
   **/

  static async get(userId) {
    const userRes = await db.query(
      `SELECT 
              id,
              email,
              name,
              address,
              phone,
              logo,
              is_admin AS "isAdmin"
           FROM users
           WHERE id = $1`,
      [userId]
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${userId}`);

    return user;
  }

  /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   {name, password, phone, address, logo, isAdmin }
   *
   * Returns { email, name, address, phone, logo, isAdmin }
   *
   * Throws NotFoundError if not found.
   *
   * WARNING: this function can set a new password or make a user an admin.
   * Callers of this function must be certain they have validated inputs to this
   * or a serious security risks are opened.
   */

  static async update(userId, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const formattedSql = sqlForPartialUpdate(data, {
      isAdmin: "is_admin",
    });
    const userIdx = "$" + (formattedSql.values.length + 1);

    const querySql = `UPDATE users 
                      SET ${formattedSql.setCols} 
                      WHERE id = ${userIdx} 
                      RETURNING email,
                                name,
                                address,
                                phone, 
                                logo, 
                                is_admin AS "isAdmin"`;
    const result = await db.query(querySql, [...formattedSql.values, userId]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${userId}`);

    delete user.password;
    return user;
  }

  /** Delete given user from database; returns undefined. */

  static async remove(userId) {
    let result = await db.query(
      `DELETE
           FROM users
           WHERE id = $1
           RETURNING userId`,
      [userId]
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${email}`);
  }
}

module.exports = User;
