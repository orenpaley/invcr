"use strict";

/** Routes for clients. */

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Client = require("../models/client");

const Invoice = require("../models/invoice");

const router = express.Router();

/** POST / => { client: [ data ] }
 *
 * save/create client
 *
 * Authorization required: curr user/Admin
 **/

router.post(
  "/:userId",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const client = await Client.save(req.params.userId, req.body);
      return res.json({ client });
    } catch (err) {
      return next(err);
    }
  }
);
// get Client
router.get(
  "/:userId/:id",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const client = await Client.open(req.params.userId, req.params.id);
      return res.json({ client });
    } catch (err) {
      return next(err);
    }
  }
);
// get list of clients
router.get(
  "/:userId/",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const clients = await Client.findAll(req.params.userId);
      return res.json({ clients });
    } catch (err) {
      return next(err);
    }
  }
);

router.delete(
  "/:userId/:id",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const client = await Client.remove(req.params.userId, req.params.id);
      return res.json({ client });
    } catch (err) {
      return next(err);
    }
  }
);

router.patch(
  "/:userId/:id",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const client = await Client.update(
        req.params.userId,
        req.params.id,
        req.body
      );
      return res.json({ client });
    } catch (err) {
      return next(err);
    }
  }
);
// get invoice for client
router.get("/:invoiceId", async function (req, res, next) {
  try {
    const invoice = await Invoice.open(req.params.userId, req.params.code);
    return res.json({ invoice });
  } catch (err) {
    return next(err);
  }
});
module.exports = router;
