const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FarmReport = sequelize.define('FarmReport', {
    problemType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
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
        type: DataTypes.JSON,
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

module.exports = FarmReport;
