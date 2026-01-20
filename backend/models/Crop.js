const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Crop = sequelize.define('Crop', {
    cropName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    variety: {
        type: DataTypes.STRING
    },
    plantingDate: {
        type: DataTypes.DATEONLY
    },
    expectedHarvestDate: {
        type: DataTypes.DATEONLY
    },
    landSize: {
        type: DataTypes.STRING // e.g., "2 acres"
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'planning' // planning, planted, growing, harvesting, harvested
    },
    location: {
        type: DataTypes.STRING
    },
    notes: {
        type: DataTypes.TEXT
    }
});

module.exports = Crop;
