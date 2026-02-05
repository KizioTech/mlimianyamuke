const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Analytics = sequelize.define('Analytics', {
    path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    visits: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    day: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ['path', 'day']
        }
    ]
});

module.exports = Analytics;
