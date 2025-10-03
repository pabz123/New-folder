import express from "express";
import multer from "multer";
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Student applies to a job (with resume)
router.post(
  "/apply",
  authenticate,
  requireRole("student"),
  upload.single("resume"),
  async (req, res) => {
    try {
      const { jobId } = req.body;
      const resumePath = req.file ? req.file.path : null;
      const application = await Application.create({
        userId: req.user.id,
        jobId,
        resume: resumePath,
      });
      res.json({ message: "Application submitted", application });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Student views their applications
router.get(
  "/my",
  authenticate,
  requireRole("student"),
  async (req, res) => {
    const apps = await Application.findAll({ where: { userId: req.user.id }, include: [Job] });
    res.json(apps);
  }
);

// Employer views applicants for their jobs
router.get(
  "/for-job/:jobId",
  authenticate,
  requireRole("employer"),
  async (req, res) => {
    const apps = await Application.findAll({
      where: { jobId: req.params.jobId },
      include: [User],
    });
    res.json(apps);
  }
);

export { router };


//import User from "./User.js";
//import Job from "./Job.js";

const Application = sequelize.define("Application", {
  resume: DataTypes.STRING,
});

Application.belongsTo(User, { foreignKey: "userId" });
Application.belongsTo(Job, { foreignKey: "jobId" });

export { Application };
