const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Consultation = sequelize.define('Consultation', {
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending' // pending, in-progress, resolved
    },
    adminResponse: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    linkedResourceIds: {
        type: DataTypes.JSON, // Store array of IDs e.g. [1, 5]
        allowNull: true,
        defaultValue: []
    },
    linkedPostIds: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Consultation;
