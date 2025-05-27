const express = require("express");
const Request = require("../models/request");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post("/requests", auth, async (req, res) => {
  const request = new Request({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await request.save();
    res.status(201).send(request);
  } catch (e) {
    res.status(400).send();
  }
});

router.get("/requests", auth, async (req, res) => {
  const match = {};
  const sort = {};
//   if (req.query.completed) {
//     match.completed = req.query.completed === "true";
//   }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    await req.user.populate({
      path: "requests",
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort,
      },
    });
    res.send(req.user.requests);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/requests/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const request = await Request.findOne({ _id, owner: req.user._id });

    if (!request) {
      return res.status(404).send();
    }

    res.send(request);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/requests/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "status"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const request = await Request.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!request) {
      return res.status(404).send();
    }

    updates.forEach((update) => (request[update] = req.body[update]));
    await request.save();
    res.send(request);
  } catch (e) {
    res.status(400).send();
  }
});

router.delete("/requests/:id", auth, async (req, res) => {
  try {
    const request = await Request.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!request) {
      return res.status(404).send();
    }

    res.send(request);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
