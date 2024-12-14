import express from "express";
const router = express.Router();
import { User, validate } from "../mongodb/models/user.js";
import bcrypt from "bcrypt";

router.post("/", async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Log request body

    const { error } = validate(req.body);
    if (error) {
      console.error("Validation Error:", error.details[0].message);
      return res.status(400).send({ message: error.details[0].message });
    }

    const user = await User.findOne({ email: req.body.email });
    if (user) {
      console.error("User Already Exists:", req.body.email);
      return res.status(409).send({ message: "User with given email already exists!" });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT) || 10); // Default SALT to 10 if undefined
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    console.log("Creating User...");
    await new User({ ...req.body, password: hashPassword }).save();

    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    console.error("Server Error:", error); // Log the error details
    res.status(500).send({ message: "Internal Server Error" });
  }
});

export default router;
