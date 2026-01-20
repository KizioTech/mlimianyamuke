const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Post = sequelize.define('Post', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    author: {
        type: DataTypes.STRING
    },
    image: {
        type: DataTypes.STRING
    },
    tags: {
        type: DataTypes.JSON // Changed to JSON for better handling
    },
    category: {
        type: DataTypes.STRING,
        defaultValue: 'General'
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'published' // draft, published
    },
    featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

module.exports = Post;
