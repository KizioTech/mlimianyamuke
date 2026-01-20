const { Crop, FarmTask } = require('../models');

exports.createCrop = async (req, res) => {
    try {
        const { cropName, variety, plantingDate, expectedHarvestDate, landSize, location, notes } = req.body;
        const crop = await Crop.create({
            cropName,
            variety,
            plantingDate,
            expectedHarvestDate,
            landSize,
            location,
            notes,
            UserId: req.user.id
        });
        res.status(201).json(crop);
    } catch (error) {
        res.status(500).json({ message: 'Error creating crop' });
    }
};

exports.getUserCrops = async (req, res) => {
    try {
        const crops = await Crop.findAll({
            where: { UserId: req.user.id },
            include: [{ model: FarmTask }], // Include tasks for dashboard summary
            order: [['createdAt', 'DESC']]
        });
        res.json(crops);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching crops' });
    }
};

exports.updateCrop = async (req, res) => {
    try {
        const crop = await Crop.findOne({ where: { id: req.params.id, UserId: req.user.id } });
        if (!crop) return res.status(404).json({ message: 'Crop not found' });

        await crop.update(req.body);
        res.json(crop);
    } catch (error) {
        res.status(500).json({ message: 'Error updating crop' });
    }
};

exports.deleteCrop = async (req, res) => {
    try {
        const crop = await Crop.findOne({ where: { id: req.params.id, UserId: req.user.id } });
        if (!crop) return res.status(404).json({ message: 'Crop not found' });

        await crop.destroy();
        res.json({ message: 'Crop deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting crop' });
    }
};
