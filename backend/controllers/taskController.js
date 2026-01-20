const { FarmTask, Crop } = require('../models');

exports.createTask = async (req, res) => {
    try {
        const { title, description, dueDate, priority, CropId } = req.body;

        // Verify crop belongs to user
        const crop = await Crop.findOne({ where: { id: CropId, UserId: req.user.id } });
        if (!crop) return res.status(404).json({ message: 'Crop not found' });

        const task = await FarmTask.create({
            title,
            description,
            dueDate,
            priority,
            CropId,
            UserId: req.user.id
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error creating task' });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const tasks = await FarmTask.findAll({
            where: { UserId: req.user.id },
            include: [{ model: Crop, attributes: ['cropName'] }],
            order: [['dueDate', 'ASC']]
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks' });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const task = await FarmTask.findOne({ where: { id: req.params.id, UserId: req.user.id } });
        if (!task) return res.status(404).json({ message: 'Task not found' });

        await task.update(req.body);
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task' });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await FarmTask.findOne({ where: { id: req.params.id, UserId: req.user.id } });
        if (!task) return res.status(404).json({ message: 'Task not found' });

        await task.destroy();
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task' });
    }
};
