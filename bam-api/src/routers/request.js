const express = require("express");
const Request = require("../models/request");
const auth = require("../middleware/auth");
const router = new express.Router();
const CODES = require("../utils/status-codes");

router.post("/requests", auth, async (req, res) => {
  const request = new Request({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await request.save();
    res.status(CODES.CREATED).send(request);
  } catch (e) {
    res.status(CODES.BAD_REQUEST).send();
  }
});

// GET /requests?state=pending/approved/rejected
// GET /requests?limit=10&skip=10
// GET /requests?from=2025-05-28&until=2025-05-29
// GET /requests?description=To+code+the+card
// GET /requests?owner=68360a0c536d6cc9efee4c4b
router.get("/requests", auth, async (req, res) => {
  const match = {};
  if (!req.user.isAdmin) {
    match.owner = req.user._id;
  }

  if (req.query.owner) {
    match.owner = req.query.owner;
  }

  if (req.query.state) {
    match.status = {};
    match.status.state = req.query.state;
  }

  if (req.query.from || req.query.until) {
    match.createdAt = {};
    match.createdAt["$gte"] = new Date(
      new Date(req.query.from).setHours(0, 0, 0)
    );
    match.createdAt["$lte"] = new Date(
      new Date(req.query.until).setHours(23, 59, 59)
    );
  }

  if (req.query.description) {
    match.description = req.query.description;
  }

  try {
    const sortedRequests = await Request.find(match, null, {
      limit: parseInt(req.query.limit),
      skip: parseInt(req.query.skip),
    }).populate("owner");
    res.send(sortedRequests);
  } catch (e) {
    res.status(CODES.INTERNAL_SERVER_ERROR).send();
  }
});

router.patch("/requests/:id", auth, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(CODES.UNAUTHORIZED).send("Only admins can update data!");
  }

  const updates = Object.keys(req.body);
  const allowedUpdates = ["status"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(CODES.BAD_REQUEST).send({ error: "Invalid updates!" });
  }

  try {
    const request = await Request.findOne({
      _id: req.params.id,
    });

    if (!request) {
      return res.status(CODES.NOT_FOUND).send();
    }

    updates.forEach((update) => (request[update] = req.body[update]));
    await request.save();
    res.send(request);
  } catch (e) {
    res.status(CODES.BAD_REQUEST).send();
  }
});

module.exports = router;
