const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = new express.Router();
const CODES = require("../utils/status-codes");

const nodemailer = require("nodemailer");

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(CODES.CREATED).send({ user, token });
  } catch (e) {
    res.status(CODES.BAD_REQUEST).send(e);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(CODES.BAD_REQUEST).send();
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(CODES.INTERNAL_SERVER_ERROR).send();
  }
});

router.post("/users/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.json({ status: "User Not Exists!" });
    }
    const secret = process.env.JWT_SECRET + existingUser.password;
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      secret,
      { expiresIn: "5m" }
    );
    const link = `${process.env.HOST}/users/reset-password/${existingUser._id}/${token}`;

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let mailOptions = {
      from: "youremail@gmail.com",
      to: process.env.EMAIL_USER,
      subject: "Password Reset",
      text: link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      console.log("hi");
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    console.log(link);
    res.send(link);
  } catch (e) {
    res.status(CODES.NOT_FOUND).send();
  }
});

router.get("/users/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  console.log(req.params);
  const existingUser = await User.findOne({ _id: id });
  if (!existingUser) {
    return res.json({ status: "User Not Exists!" });
  }
  const secret = process.env.JWT_SECRET + existingUser.password;
  try {
    const verify = jwt.verify(token, secret);
    res.send({ email: verify.email });
  } catch (e) {
    res.send("Not Verified!");
  }
});

router.post("/users/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  console.log(req.params);
  const existingUser = await User.findOne({ _id: id });
  if (!existingUser) {
    return res.json({ status: "User Not Exists!" });
  }
  const secret = process.env.JWT_SECRET + existingUser.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 8);
    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );

    // res.send({ email: verify.email });
    res.json({ status: "Password Updated!" });
  } catch (e) {
    res.json({ status: "Something Went Wrong!" });
  }
});

module.exports = router;
