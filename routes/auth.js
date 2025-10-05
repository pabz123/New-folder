import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { body, validationResult } from "express-validator";
import transporter from "../config/mailer.js";

const router = express.Router();

// Register
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 chars"),
    body("role").isIn(["student", "employer"]).withMessage("Role must be student or employer"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { email, password, role } = req.body;

      const exists = await User.findOne({ where: { email } });
      if (exists) return res.status(400).json({ error: "Email already in use" });

      // Do NOT hash password here; model hook will handle it
      const user = await User.create({ email, password, role });

      // Send welcome email
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "🎉 Welcome to UniConnect",
        text: `Hello ${email}, welcome to UniConnect! You can now log in and start applying to jobs.`,
      });

      res.json({ message: "✅ User registered", user: { id: user.id, email: user.email, role: user.role } });
    } 
    catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").exists().withMessage("Password required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(400).json({ error: "Invalid credentials" });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ error: "Invalid credentials" });

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
      res.json({ message: "✅ Login successful", token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;