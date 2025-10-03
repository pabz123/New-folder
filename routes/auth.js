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

      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ email, password: hashed, role });

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
export default router;