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
      return res.json({ message: "משתמש לא קיים!" });
    }
    const secret = process.env.JWT_SECRET + existingUser.password;
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      secret,
      { expiresIn: "10m" }
    );
    const link = `${process.env.REACT_CLIENT_HOST}/reset-password?id=${existingUser._id}&token=${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Password Reset",
      html: `<p>לחץ על הקישור בכדי להחליף את הסיסמא: <a href=${link}>${link}</a></p>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.status(CODES.CREATED).json({ message: "האימייל נשלח בהצלחה! תוכל להחליף סיסמא רק למשך 10 דקות לאחר קבלת האימייל." });
  } catch (e) {
    res
      .status(CODES.NOT_FOUND)
      .json({ message: "משהו השתבש בשליחת האימייל... נסה שוב מאוחר יותר." });
  }
});

router.post("/users/reset-password/", async (req, res) => {
  const { id, token, password } = req.body;
  const existingUser = await User.findOne({ _id: id });
  if (!existingUser) {
    return res.json({ message: "משתמש לא קיים!" });
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

    res.status(CODES.CREATED).json({ message: "הסיסמא עודכנה בהצלחה!" });
  } catch (e) {
    console.log(e);
    res.status(CODES.INTERNAL_SERVER_ERROR).send();
  }
});

module.exports = router;
