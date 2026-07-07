const express = require("express");
const authRouter = express.Router();
const User = require("../model/user");
const { validateSignUpData, hashPassword } = require("../helpers/validation");
const validator = require("validator");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req.body);

    const passwordHash = await hashPassword(req.body.password);

    // This is creating a new instance of usermodel
    const user = new User({
      ...req.body,
      password: passwordHash,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
    });

    const userData = savedUser.toObject();
    delete userData.password;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: userData,
    });
  } catch (err) {
    res.status(400).send("Bad Request " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid Credentials");
    }
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordvalid = await user.validatePassword(password);
    if (isPasswordvalid) {
      const token = await user.getJWT();

      res.cookie("token", token);

      res.status(200).json({
        success: true,
        data: user,
      });
    } else {
      throw new Error("Incorrect Credentials!");
    }
  } catch (err) {
    res.status(400).send("Bad Request " + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.send("Logged Out Successfully");
});

module.exports = authRouter;
