const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FarmTask = sequelize.define('FarmTask', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending' // pending, in-progress, completed
    },
    priority: {
        type: DataTypes.STRING, // low, medium, high
        defaultValue: 'medium'
    }
});

module.exports = FarmTask;
