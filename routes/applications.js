import express from "express";
import Application from "../models/Application.js";
import { verifyToken, isStudent } from "../middleware/auth.js";

const router = express.Router();

// Student applies to job
router.post("/:jobId", verifyToken, isStudent, async (req, res) => {
  try {
    const app = await Application.create({
      jobId: req.params.jobId,
      studentId: req.user.id,
    });
    res.json({ message: "✅ Application submitted", app });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// View my applications (student)
router.get("/my", verifyToken, isStudent, async (req, res) => {
  try {
    const apps = await Application.findAll({ where: { studentId: req.user.id } });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
