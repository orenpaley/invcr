"use strict";

/** Routes for invoices. */

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Invoice = require("../models/invoice");
const { createToken } = require("../helpers/tokens");

const router = express.Router();

/** POST / => { invoice: [ data ] }
 *
 * save/create invoice
 *
 * Authorization required: curr user
 **/

router.post(
  "/:userId",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const invoice = await Invoice.save(+req.params.userId, req.body);
      return res.json({ invoice });
    } catch (err) {
      return next(err);
    }
  }
);

/** GET / => { invoices: [ data ] }
 *
 * Returns list of all invoices.
 *
 * Authorization required: admin or curr user
 **/

router.get("/", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const invoices = await Invoice.findAll();
    return res.json({ invoices });
  } catch (err) {
    return next(err);
  }
});

/** GET /[userId] => { invoices }
 *
 * Returns all invoices of user { code,
                first_name AS "firstName",
                last_name AS "lastName",
                client_name AS "clientName",
                created_at AS "createdAt",
                due_date AS "dueDate",
                total, 
                status }
 *
 *
 * Authorization required: admin or same user-as-:userId
 **/

router.get(
  "/:userId",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const invoices = await Invoice.findAll(req.params.userId);
      return res.json({ invoices });
    } catch (err) {
      return next(err);
    }
  }
);

/** GET /[userId]/[code] => { invoice }
 *
 * Returns one invoice of user{ invoice_data }
 *
 *
 * Authorization required: admin or same user-as-:email
 **/

// no permission for correct user or admin to allow external clients to view
router.get("/:userId/:id", async function (req, res, next) {
  try {
    const invoice = await Invoice.open(req.params.userId, req.params.id);
    return res.json({ invoice });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[userId]/[code] { invoice } => { invoice }
 *
 * Data can include:
 *   { anything on invoice }
 *
 * Returns { email, firstName, lastName, address, phone, logo, isAdmin }
 *
 * Authorization required: admin or same-user-as-:email
 **/

router.patch(
  "/:userId/:id",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const invoice = await Invoice.update(
        req.params.userId,
        req.params.id,
        req.body
      );
      return res.json({ invoice });
    } catch (err) {
      return next(err);
    }
  }
);

/** DELETE /[user_id]/[:code]  =>  { deleted: invoice}
 *
 * Authorization required: admin or same-user-as-:user_id
 **/

router.delete(
  "/:userId/:code",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      await Invoice.remove(req.params.userId, req.params.id);
      return res.json({ deleted: req.params.userId + "-" + req.params.id });
    } catch (err) {
      return next(err);
    }
  }
);

// Route to send invoice via Twilio Send Grid

router.post(
  "/:userId/:invoiceId/send",

  async function (req, res, next) {
    try {
      let msgFormatted = {
        to: req.body.to,
        from: req.body.from,
        subject: req.body.subject,
        text: req.body.text,
        html: req.body.html,
      };
      await Invoice.send(req.params.userId, req.params.invoiceId, msgFormatted);
      return res.json({ sent: req.params.msg });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
