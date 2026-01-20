const { Farmer, User } = require('../models');

exports.getAllFarmers = async (req, res) => {
    try {
        console.log('Fetching all farmers...');
        const farmers = await Farmer.findAll({
            include: [{
                model: User,
                attributes: ['username', 'email']
            }],
            order: [['createdAt', 'DESC']]
        });
        console.log(`Found ${farmers.length} farmers`);
        res.json(farmers);
    } catch (error) {
        console.error('Error fetching farmers:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ message: 'Error fetching farmers', error: error.message });
    }
};

exports.deleteFarmer = async (req, res) => {
    try {
        console.log(`Deleting farmer with ID: ${req.params.id}`);
        await Farmer.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Farmer deleted' });
    } catch (error) {
        console.error('Error deleting farmer:', error);
        res.status(500).json({ message: 'Error deleting farmer', error: error.message });
    }
};
