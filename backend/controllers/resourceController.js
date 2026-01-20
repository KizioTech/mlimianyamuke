const { Resource } = require('../models');

exports.getAllResources = async (req, res) => {
    try {
        const resources = await Resource.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching resources' });
    }
};

exports.createResource = async (req, res) => {
    try {
        const { title, description, category } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const resource = await Resource.create({
            title,
            description,
            category,
            fileUrl: `/uploads/documents/${file.filename}`,
            fileType: 'pdf'
        });

        res.status(201).json(resource);
    } catch (error) {
        console.error('Create resource error:', error);
        res.status(500).json({ message: 'Error creating resource' });
    }
};

exports.deleteResource = async (req, res) => {
    try {
        await Resource.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Resource deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting resource' });
    }
};
