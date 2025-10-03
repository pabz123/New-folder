import { DataTypes } from "sequelize";
  import { sequelize } from "../config/db.js";
import User from "./User.js";
const Job = sequelize.define("Job", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  company: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  type: { 
    type: DataTypes.ENUM("internship", "full-time", "part-time", "contract"),
    allowNull: false 
  },
  applicationDeadline: { type: DataTypes.DATE, allowNull: false }
}, {
  timestamps: true
});
Job.belongsTo(User, { foreignKey: "employerId", as: "employer" });

export default Job;
