const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Farmer = sequelize.define('Farmer', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    district: {
        type: DataTypes.STRING,
        allowNull: false
    },
    crop: {
        type: DataTypes.STRING,
        allowNull: false
    },
    alertMethod: {
        type: DataTypes.STRING,
        allowNull: false
    },
    language: {
        type: DataTypes.STRING,
        defaultValue: 'en'
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: true // Null for legacy entries, but required for new accounts
    }
});

module.exports = Farmer;
