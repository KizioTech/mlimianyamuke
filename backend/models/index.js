const User = require('./User');
const Farmer = require('./Farmer');
const Post = require('./Post');
const Comment = require('./Comment');
const Consultation = require('./Consultation');
const FarmReport = require('./FarmReport');
const Resource = require('./Resource');
const Contact = require('./Contact');
const Crop = require('./Crop');
const FarmTask = require('./FarmTask');

// User <-> Farmer (1:1)
User.hasOne(Farmer, { foreignKey: 'UserId', onDelete: 'CASCADE' });
Farmer.belongsTo(User, { foreignKey: 'UserId' });

// User <-> Comment (1:N)
User.hasMany(Comment, { foreignKey: 'UserId' });
Comment.belongsTo(User, { foreignKey: 'UserId' });

// Post <-> Comment (1:N)
Post.hasMany(Comment, { foreignKey: 'PostId' });
Comment.belongsTo(Post, { foreignKey: 'PostId' });

// User <-> Consultation (1:N)
User.hasMany(Consultation, { foreignKey: 'UserId' });
Consultation.belongsTo(User, { foreignKey: 'UserId' });

// User <-> FarmReport (1:N)
User.hasMany(FarmReport, { foreignKey: 'UserId' });
FarmReport.belongsTo(User, { foreignKey: 'UserId' });

// User <-> Crop (1:N)
User.hasMany(Crop, { foreignKey: 'UserId' });
Crop.belongsTo(User, { foreignKey: 'UserId' });

// Crop <-> FarmTask (1:N)
Crop.hasMany(FarmTask, { foreignKey: 'CropId', onDelete: 'CASCADE' });
FarmTask.belongsTo(Crop, { foreignKey: 'CropId' });

// User <-> FarmTask (1:N)
User.hasMany(FarmTask, { foreignKey: 'UserId' });
FarmTask.belongsTo(User, { foreignKey: 'UserId' });

module.exports = {
    User,
    Farmer,
    Post,
    Comment,
    Consultation,
    FarmReport,
    Resource,
    Contact,
    Crop,
    FarmTask
};
