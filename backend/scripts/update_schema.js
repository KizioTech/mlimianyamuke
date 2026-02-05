const sequelize = require('../config/database');
const { User, Farmer, Post, Comment, Consultation, FarmReport, Resource, Contact, Crop, FarmTask } = require('../models');

console.log('Syncing database schema (altering table structure)...');

sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database schema updated successfully.');
        process.exit(0);
    })
    .catch((err) => {
        console.error('Failed to update database schema:', err);
        process.exit(1);
    });
