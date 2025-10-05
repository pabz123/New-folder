import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';
import Job from './Job.js';

const Application = sequelize.define("Application", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
        defaultValue: 'pending'
    },
    coverLetter: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

// Define associations
Application.belongsTo(User, { as: 'student', foreignKey: 'studentId' });
Application.belongsTo(Job, { foreignKey: 'jobId' });

export default Application;
