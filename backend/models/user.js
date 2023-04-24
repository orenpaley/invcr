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
   * Returns { email, first_name, last_name, address, phone, logo, is_admin }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(email, password) {
    // try to find the user first
    const result = await db.query(
      `SELECT email,
              id,
              password,
              first_name AS "firstName",
              last_name AS "lastName",
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
   * Returns { email, firstName, lastName, address , phone, logo, isAdmin }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register({
    email,
    password,
    firstName,
    lastName,
    address,
    phone,
    logo,
    isAdmin,
  }) {
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
            first_name,
            last_name,
            address,
            phone, 
            logo,
            is_admin)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING email, first_name AS "firstName", last_name AS "lastName", address, phone, logo, is_admin AS "isAdmin"`,
      [
        email,
        hashedPassword,
        firstName,
        lastName,
        address,
        phone,
        logo,
        isAdmin,
      ]
    );

    const user = result.rows[0];

    return user;
  }

  /** Find all users.
   *
   * Returns [{ email, first_name, last_name, is_admin }, ...]
   **/

  static async findAll() {
    const result = await db.query(
      `SELECT id, 
              email,
              first_name AS "firstName",
              last_name AS "lastName",
              is_admin AS "isAdmin"
           FROM users
           `
    );

    return result.rows;
  }

  /** Given an email, return data about user.
   *
   * Returns { email, first_name, last_name, address, phone, logo, is_admin}

   * Throws NotFoundError if user not found.
   **/

  static async get(userId) {
    const userRes = await db.query(
      `SELECT 
              id,
              email,
              first_name AS "firstName",
              last_name AS "lastName",
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
   *   { firstName, lastName, password, phone, address, logo, isAdmin }
   *
   * Returns { email, firstName, lastName, address, phone, logo, isAdmin }
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
      firstName: "first_name",
      lastName: "last_name",
      isAdmin: "is_admin",
    });
    const userIdx = "$" + (formattedSql.values.length + 1);

    const querySql = `UPDATE users 
                      SET ${formattedSql.setCols} 
                      WHERE id = ${userIdx} 
                      RETURNING email,
                                first_name AS "firstName",
                                last_name AS "lastName",
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
