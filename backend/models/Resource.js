const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Resource = sequelize.define('Resource', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    fileUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fileType: {
        type: DataTypes.STRING, // e.g., 'pdf', 'image'
        defaultValue: 'pdf'
    },
    category: {
        type: DataTypes.STRING, // e.g., 'Guides', 'Technical', 'General'
        defaultValue: 'General'
    }
});

module.exports = Resource;
